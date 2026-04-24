import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: string, targetType: string, targetId: string) {
    const existing = await this.prisma.bookmark.findUnique({
      where: { userId_targetType_targetId: { userId, targetType, targetId } },
    });

    if (existing) {
      await this.prisma.bookmark.delete({ where: { id: existing.id } });
      return { bookmarked: false };
    } else {
      await this.prisma.bookmark.create({ data: { userId, targetType, targetId } });
      return { bookmarked: true };
    }
  }

  async getStatus(userId: string, targetType: string, targetId: string) {
    const existing = await this.prisma.bookmark.findUnique({
      where: { userId_targetType_targetId: { userId, targetType, targetId } },
    });
    return { bookmarked: !!existing };
  }

  async getUserBookmarks(userId: string) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (bookmarks.length === 0) return [];

    // 타입별로 ID를 그룹화
    const idsByType: Record<string, string[]> = {};
    for (const b of bookmarks) {
      (idsByType[b.targetType] ??= []).push(b.targetId);
    }

    // 타입별 batch 조회 (N+1 → 최대 4 쿼리)
    const itemMap = new Map<string, Record<string, unknown>>();

    if (idsByType['POST']?.length) {
      const posts = await this.prisma.post.findMany({
        where: { id: { in: idsByType['POST'] } },
        select: { id: true, title: true, category: true, createdAt: true },
      });
      posts.forEach((p) => itemMap.set(`POST:${p.id}`, p));
    }

    if (idsByType['PROMPT']?.length) {
      const prompts = await this.prisma.prompt.findMany({
        where: { id: { in: idsByType['PROMPT'] } },
        select: { id: true, title: true, category: true, toolName: true },
      });
      prompts.forEach((p) => itemMap.set(`PROMPT:${p.id}`, p));
    }

    if (idsByType['TOOL']?.length) {
      const tools = await this.prisma.tool.findMany({
        where: { id: { in: idsByType['TOOL'] } },
        select: { id: true, name: true, category: true, shortDesc: true },
      });
      tools.forEach((t) => itemMap.set(`TOOL:${t.id}`, t));
    }

    if (idsByType['LAB']?.length) {
      const labs = await this.prisma.experiment.findMany({
        where: { id: { in: idsByType['LAB'] } },
        select: { id: true, title: true, category: true },
      });
      labs.forEach((l) => itemMap.set(`LAB:${l.id}`, l));
    }

    return bookmarks
      .map((b) => {
        const item = itemMap.get(`${b.targetType}:${b.targetId}`);
        return item ? { ...b, item } : null;
      })
      .filter(Boolean);
  }
}
