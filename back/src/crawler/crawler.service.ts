import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaService } from '../prisma/prisma.service';

/**
 * 단일 소스 크롤링 결과 통계
 */
export interface CrawlSourceResult {
  source: 'TAAFT' | 'ProductHunt';
  scanned: number; // 페이지에서 발견한 항목 수
  inserted: number; // PENDING 으로 새로 저장한 항목 수
  skipped: number; // 중복/유효성 미달로 건너뛴 항목 수
  errors: number; // 항목 처리 중 발생한 에러 수
  skippedReason?: string; // 소스 전체를 건너뛴 사유 (예: API 토큰 없음)
}

/**
 * 전체 실행 결과 (runAll / 스케줄 / 수동 트리거 공통)
 */
export interface CrawlRunResult {
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  results: CrawlSourceResult[];
}

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const TAAFT_URL = 'https://theresanaiforthat.com/';
const PRODUCT_HUNT_GRAPHQL = 'https://api.producthunt.com/v2/api/graphql';

/** 항목 간 딜레이 (TAAFT 예의상 rate-limit) */
const ITEM_DELAY_MS = 1500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 문자열을 안전한 길이로 자른다 (DB 부담/노이즈 방지) */
function trimText(value: string | undefined | null, max: number): string {
  if (!value) return '';
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max - 1) + '…' : clean;
}

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  /** 마지막 실행 결과를 메모리에 보관 (GET /api/crawler/status 용) */
  private lastRun: CrawlRunResult | null = null;
  /** 동시 실행 방지 플래그 */
  private running = false;

  constructor(private readonly prisma: PrismaService) {}

  getLastRun(): { running: boolean; lastRun: CrawlRunResult | null } {
    return { running: this.running, lastRun: this.lastRun };
  }

  // ────────────────────────────────────────────────────────────
  // 스케줄
  // ────────────────────────────────────────────────────────────

  /** 매일 새벽 2시 — Product Hunt */
  @Cron('0 2 * * *', { name: 'crawl-producthunt' })
  async scheduledProductHunt(): Promise<void> {
    this.logger.log('[schedule] Product Hunt 크롤링 시작');
    try {
      const result = await this.crawlProductHunt();
      this.logger.log(
        `[schedule] Product Hunt 완료: +${result.inserted} (skipped ${result.skipped})`,
      );
    } catch (err) {
      this.logger.error('[schedule] Product Hunt 실패', err as Error);
    }
  }

  /** 매주 월요일 새벽 3시 — TAAFT */
  @Cron('0 3 * * 1', { name: 'crawl-taaft' })
  async scheduledTAAFT(): Promise<void> {
    this.logger.log('[schedule] TAAFT 크롤링 시작');
    try {
      const result = await this.crawlTAAFT();
      this.logger.log(
        `[schedule] TAAFT 완료: +${result.inserted} (skipped ${result.skipped})`,
      );
    } catch (err) {
      this.logger.error('[schedule] TAAFT 실패', err as Error);
    }
  }

  // ────────────────────────────────────────────────────────────
  // 통합 실행
  // ────────────────────────────────────────────────────────────

  /**
   * 모든 소스를 순차 실행하고 통계를 반환한다.
   * 수동 트리거(POST /api/crawler/run)에서 호출.
   */
  async runAll(): Promise<CrawlRunResult> {
    if (this.running) {
      throw new Error('크롤러가 이미 실행 중입니다.');
    }
    this.running = true;
    const startedAt = new Date();
    const results: CrawlSourceResult[] = [];

    try {
      // ProductHunt 먼저 (API, 빠름) → TAAFT (스크래핑, 느림)
      results.push(await this.safeRun(() => this.crawlProductHunt()));
      results.push(await this.safeRun(() => this.crawlTAAFT()));
    } finally {
      this.running = false;
    }

    const finishedAt = new Date();
    const run: CrawlRunResult = {
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      results,
    };
    this.lastRun = run;
    return run;
  }

  /** 개별 소스 실행을 감싸 에러를 통계로 변환 (한 소스 실패가 전체를 막지 않도록) */
  private async safeRun(
    fn: () => Promise<CrawlSourceResult>,
  ): Promise<CrawlSourceResult> {
    try {
      return await fn();
    } catch (err) {
      this.logger.error('크롤 소스 실행 실패', err as Error);
      return {
        source: 'TAAFT',
        scanned: 0,
        inserted: 0,
        skipped: 0,
        errors: 1,
        skippedReason: (err as Error)?.message ?? 'unknown error',
      };
    }
  }

  // ────────────────────────────────────────────────────────────
  // TAAFT (There's An AI For That) 스크래핑
  // ────────────────────────────────────────────────────────────

  /**
   * theresanaiforthat.com 홈페이지의 도구 목록을 스크래핑한다.
   *
   * 각 도구는 `<li class="li ..." data-name data-task data-url>` 구조이며:
   *  - data-name  → 이름
   *  - data-task  → 카테고리
   *  - data-url   → 외부 도구 URL (ref 파라미터 포함)
   *  - .short_desc → 설명
   *  - .taaft_icon[src] → 아이콘
   */
  async crawlTAAFT(): Promise<CrawlSourceResult> {
    const result: CrawlSourceResult = {
      source: 'TAAFT',
      scanned: 0,
      inserted: 0,
      skipped: 0,
      errors: 0,
    };

    const { data: html } = await axios.get<string>(TAAFT_URL, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 30000,
      responseType: 'text',
    });

    const $ = cheerio.load(html);
    const items = $('li[data-name][data-url]').toArray();
    result.scanned = items.length;
    this.logger.log(`[TAAFT] ${items.length}개 항목 발견`);

    for (const el of items) {
      try {
        const node = $(el);
        const name = trimText(node.attr('data-name'), 120);
        const launchUrl = (node.attr('data-url') ?? '').trim();
        const category = trimText(node.attr('data-task') || 'AI Tools', 60);
        const shortDesc =
          trimText(node.find('.short_desc').first().text(), 160) ||
          `${name} — AI tool from There's An AI For That.`;
        const iconUrl = node.find('.taaft_icon').first().attr('src') ?? null;

        if (!name || !launchUrl) {
          result.skipped++;
          continue;
        }

        const inserted = await this.upsertPendingTool({
          name,
          shortDesc,
          description: shortDesc,
          category,
          launchUrl,
          iconUrl,
          pricingModel: 'Freemium',
          source: 'TAAFT',
        });

        if (inserted) result.inserted++;
        else result.skipped++;
      } catch (err) {
        result.errors++;
        this.logger.warn(`[TAAFT] 항목 처리 실패: ${(err as Error).message}`);
        // skip 하고 계속
      }

      await sleep(ITEM_DELAY_MS);
    }

    this.logger.log(
      `[TAAFT] 완료 — inserted ${result.inserted}, skipped ${result.skipped}, errors ${result.errors}`,
    );
    return result;
  }

  // ────────────────────────────────────────────────────────────
  // Product Hunt GraphQL API
  // ────────────────────────────────────────────────────────────

  /**
   * Product Hunt GraphQL API로 최근 7일간 등록된 포스트를 가져온다.
   * PRODUCT_HUNT_API_TOKEN 미설정 시 즉시 skip.
   */
  async crawlProductHunt(): Promise<CrawlSourceResult> {
    const result: CrawlSourceResult = {
      source: 'ProductHunt',
      scanned: 0,
      inserted: 0,
      skipped: 0,
      errors: 0,
    };

    const token = process.env.PRODUCT_HUNT_API_TOKEN;
    if (!token) {
      this.logger.warn(
        '[ProductHunt] PRODUCT_HUNT_API_TOKEN 미설정 — 건너뜀',
      );
      result.skippedReason = 'PRODUCT_HUNT_API_TOKEN not set';
      return result;
    }

    const postedAfter = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const query = `
      query RecentPosts($postedAfter: DateTime!) {
        posts(order: VOTES, postedAfter: $postedAfter, first: 50) {
          edges {
            node {
              name
              tagline
              description
              url
              website
              thumbnail { url }
              topics(first: 5) { edges { node { name } } }
            }
          }
        }
      }
    `;

    const { data } = await axios.post<{
      data?: {
        posts?: {
          edges: Array<{
            node: {
              name: string;
              tagline?: string;
              description?: string;
              url?: string;
              website?: string;
              thumbnail?: { url?: string } | null;
              topics?: { edges: Array<{ node: { name: string } }> };
            };
          }>;
        };
      };
      errors?: Array<{ message: string }>;
    }>(
      PRODUCT_HUNT_GRAPHQL,
      { query, variables: { postedAfter } },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'User-Agent': USER_AGENT,
        },
        timeout: 30000,
      },
    );

    if (data.errors?.length) {
      throw new Error(
        `Product Hunt API 오류: ${data.errors.map((e) => e.message).join('; ')}`,
      );
    }

    const edges = data.data?.posts?.edges ?? [];
    result.scanned = edges.length;
    this.logger.log(`[ProductHunt] ${edges.length}개 포스트 수신`);

    // AI 관련 토픽만 필터링 (대소문자 무관 "ai" 포함)
    for (const { node } of edges) {
      try {
        const topics =
          node.topics?.edges.map((t) => t.node.name.toLowerCase()) ?? [];
        const isAi = topics.some(
          (t) =>
            t.includes('ai') ||
            t.includes('artificial intelligence') ||
            t.includes('machine learning'),
        );
        if (!isAi) {
          result.skipped++;
          continue;
        }

        const name = trimText(node.name, 120);
        const launchUrl = (node.website || node.url || '').trim();
        const shortDesc =
          trimText(node.tagline, 160) ||
          trimText(node.description, 160) ||
          `${name} — featured on Product Hunt.`;
        const description =
          trimText(node.description, 500) || shortDesc;
        const iconUrl = node.thumbnail?.url ?? null;
        const category =
          node.topics?.edges?.[0]?.node?.name?.trim() || 'AI Tools';

        if (!name || !launchUrl) {
          result.skipped++;
          continue;
        }

        const inserted = await this.upsertPendingTool({
          name,
          shortDesc,
          description,
          category: trimText(category, 60),
          launchUrl,
          iconUrl,
          pricingModel: 'Freemium',
          source: 'ProductHunt',
        });

        if (inserted) result.inserted++;
        else result.skipped++;
      } catch (err) {
        result.errors++;
        this.logger.warn(
          `[ProductHunt] 항목 처리 실패: ${(err as Error).message}`,
        );
      }
    }

    this.logger.log(
      `[ProductHunt] 완료 — inserted ${result.inserted}, skipped ${result.skipped}, errors ${result.errors}`,
    );
    return result;
  }

  // ────────────────────────────────────────────────────────────
  // 공통 저장 로직
  // ────────────────────────────────────────────────────────────

  /**
   * URL 또는 이름이 중복되지 않으면 PENDING 상태로 Tool을 저장한다.
   * @returns true = 새로 저장됨, false = 중복으로 건너뜀
   */
  private async upsertPendingTool(input: {
    name: string;
    shortDesc: string;
    description: string;
    category: string;
    launchUrl: string;
    iconUrl: string | null;
    pricingModel: string;
    source: string;
  }): Promise<boolean> {
    // URL 또는 (대소문자 무관) 이름이 이미 존재하면 skip
    const existing = await this.prisma.tool.findFirst({
      where: {
        OR: [
          { launchUrl: input.launchUrl },
          { name: { equals: input.name, mode: 'insensitive' } },
        ],
      },
      select: { id: true },
    });

    if (existing) {
      return false;
    }

    await this.prisma.tool.create({
      data: {
        name: input.name,
        shortDesc: input.shortDesc,
        description: input.description,
        category: input.category,
        launchUrl: input.launchUrl,
        iconUrl: input.iconUrl ?? undefined,
        pricingModel: input.pricingModel,
        tags: [`source:${input.source.toLowerCase()}`],
        status: 'PENDING',
      },
    });

    return true;
  }
}
