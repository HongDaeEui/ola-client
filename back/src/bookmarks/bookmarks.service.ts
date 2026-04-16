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

    const resolved = await Promise.all(
      bookmarks.map(async (b) => {
        let item: Record<string, unknown> | null = null;
        if (b.targetType === 'POST') {
          item = await this.prisma.post.findUnique({
            where: { id: b.targetId },
            select: { id: true, title: true, category: true, createdAt: true },
          });
        } else if (b.targetType === 'PROMPT') {
          item = await this.prisma.prompt.findUnique({
            where: { id: b.targetId },
            select: { id: true, title: true, category: true, toolName: true },
          });
        } else if (b.targetType === 'TOOL') {
          item = await this.prisma.tool.findUnique({
            where: { id: b.targetId },
            select: { id: true, name: true, category: true, shortDesc: true },
          });
        } else if (b.targetType === 'LAB') {
          item = await this.prisma.experiment.findUnique({
            where: { id: b.targetId },
            select: { id: true, title: true, category: true },
          });
        }
        return item ? { ...b, item } : null;
      }),
    );

    return resolved.filter(Boolean);
  }
}
