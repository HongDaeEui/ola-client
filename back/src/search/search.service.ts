import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(q: string) {
    const query = q.trim();
    if (!query) return { tools: [], prompts: [], posts: [], labs: [] };

    const [tools, prompts, posts, labs] = await Promise.all([
      this.prisma.tool.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { shortDesc: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
          status: 'ACTIVE',
        },
        select: { id: true, name: true, shortDesc: true, category: true, iconUrl: true, pricingModel: true },
        take: 10,
      }),
      this.prisma.prompt.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { toolName: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, category: true, toolName: true, likes: true },
        take: 10,
      }),
      this.prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, category: true, likes: true, views: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.experiment.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, description: true, category: true, emoji: true, difficulty: true, likes: true },
        take: 10,
      }),
    ]);

    return { tools, prompts, posts, labs };
  }
}
