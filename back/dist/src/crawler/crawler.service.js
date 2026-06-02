"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CrawlerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const prisma_service_1 = require("../prisma/prisma.service");
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const TAAFT_URL = 'https://theresanaiforthat.com/';
const PRODUCT_HUNT_GRAPHQL = 'https://api.producthunt.com/v2/api/graphql';
const ITEM_DELAY_MS = 1500;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function trimText(value, max) {
    if (!value)
        return '';
    const clean = value.replace(/\s+/g, ' ').trim();
    return clean.length > max ? clean.slice(0, max - 1) + '…' : clean;
}
let CrawlerService = CrawlerService_1 = class CrawlerService {
    prisma;
    logger = new common_1.Logger(CrawlerService_1.name);
    lastRun = null;
    running = false;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getLastRun() {
        return { running: this.running, lastRun: this.lastRun };
    }
    async scheduledProductHunt() {
        this.logger.log('[schedule] Product Hunt 크롤링 시작');
        try {
            const result = await this.crawlProductHunt();
            this.logger.log(`[schedule] Product Hunt 완료: +${result.inserted} (skipped ${result.skipped})`);
        }
        catch (err) {
            this.logger.error('[schedule] Product Hunt 실패', err);
        }
    }
    async scheduledTAAFT() {
        this.logger.log('[schedule] TAAFT 크롤링 시작');
        try {
            const result = await this.crawlTAAFT();
            this.logger.log(`[schedule] TAAFT 완료: +${result.inserted} (skipped ${result.skipped})`);
        }
        catch (err) {
            this.logger.error('[schedule] TAAFT 실패', err);
        }
    }
    async runAll() {
        if (this.running) {
            throw new Error('크롤러가 이미 실행 중입니다.');
        }
        this.running = true;
        const startedAt = new Date();
        const results = [];
        try {
            results.push(await this.safeRun(() => this.crawlProductHunt()));
            results.push(await this.safeRun(() => this.crawlTAAFT()));
        }
        finally {
            this.running = false;
        }
        const finishedAt = new Date();
        const run = {
            startedAt: startedAt.toISOString(),
            finishedAt: finishedAt.toISOString(),
            durationMs: finishedAt.getTime() - startedAt.getTime(),
            results,
        };
        this.lastRun = run;
        return run;
    }
    async safeRun(fn) {
        try {
            return await fn();
        }
        catch (err) {
            this.logger.error('크롤 소스 실행 실패', err);
            return {
                source: 'TAAFT',
                scanned: 0,
                inserted: 0,
                skipped: 0,
                errors: 1,
                skippedReason: err?.message ?? 'unknown error',
            };
        }
    }
    async crawlTAAFT() {
        const result = {
            source: 'TAAFT',
            scanned: 0,
            inserted: 0,
            skipped: 0,
            errors: 0,
        };
        const { data: html } = await axios_1.default.get(TAAFT_URL, {
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
                const shortDesc = trimText(node.find('.short_desc').first().text(), 160) ||
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
                if (inserted)
                    result.inserted++;
                else
                    result.skipped++;
            }
            catch (err) {
                result.errors++;
                this.logger.warn(`[TAAFT] 항목 처리 실패: ${err.message}`);
            }
            await sleep(ITEM_DELAY_MS);
        }
        this.logger.log(`[TAAFT] 완료 — inserted ${result.inserted}, skipped ${result.skipped}, errors ${result.errors}`);
        return result;
    }
    async crawlProductHunt() {
        const result = {
            source: 'ProductHunt',
            scanned: 0,
            inserted: 0,
            skipped: 0,
            errors: 0,
        };
        const token = process.env.PRODUCT_HUNT_API_TOKEN;
        if (!token) {
            this.logger.warn('[ProductHunt] PRODUCT_HUNT_API_TOKEN 미설정 — 건너뜀');
            result.skippedReason = 'PRODUCT_HUNT_API_TOKEN not set';
            return result;
        }
        const postedAfter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
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
        const { data } = await axios_1.default.post(PRODUCT_HUNT_GRAPHQL, { query, variables: { postedAfter } }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'User-Agent': USER_AGENT,
            },
            timeout: 30000,
        });
        if (data.errors?.length) {
            throw new Error(`Product Hunt API 오류: ${data.errors.map((e) => e.message).join('; ')}`);
        }
        const edges = data.data?.posts?.edges ?? [];
        result.scanned = edges.length;
        this.logger.log(`[ProductHunt] ${edges.length}개 포스트 수신`);
        for (const { node } of edges) {
            try {
                const topics = node.topics?.edges.map((t) => t.node.name.toLowerCase()) ?? [];
                const isAi = topics.some((t) => t.includes('ai') ||
                    t.includes('artificial intelligence') ||
                    t.includes('machine learning'));
                if (!isAi) {
                    result.skipped++;
                    continue;
                }
                const name = trimText(node.name, 120);
                const launchUrl = (node.website || node.url || '').trim();
                const shortDesc = trimText(node.tagline, 160) ||
                    trimText(node.description, 160) ||
                    `${name} — featured on Product Hunt.`;
                const description = trimText(node.description, 500) || shortDesc;
                const iconUrl = node.thumbnail?.url ?? null;
                const category = node.topics?.edges?.[0]?.node?.name?.trim() || 'AI Tools';
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
                if (inserted)
                    result.inserted++;
                else
                    result.skipped++;
            }
            catch (err) {
                result.errors++;
                this.logger.warn(`[ProductHunt] 항목 처리 실패: ${err.message}`);
            }
        }
        this.logger.log(`[ProductHunt] 완료 — inserted ${result.inserted}, skipped ${result.skipped}, errors ${result.errors}`);
        return result;
    }
    async upsertPendingTool(input) {
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
};
exports.CrawlerService = CrawlerService;
__decorate([
    (0, schedule_1.Cron)('0 2 * * *', { name: 'crawl-producthunt' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrawlerService.prototype, "scheduledProductHunt", null);
__decorate([
    (0, schedule_1.Cron)('0 3 * * 1', { name: 'crawl-taaft' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrawlerService.prototype, "scheduledTAAFT", null);
exports.CrawlerService = CrawlerService = CrawlerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CrawlerService);
//# sourceMappingURL=crawler.service.js.map