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

  async suggest(q: string) {
    const query = q.trim();
    if (!query || query.length < 2) return { tools: [], prompts: [], posts: [], labs: [] };

    const condition = (fields: string[]) => ({
      OR: fields.map((f) => ({ [f]: { contains: query, mode: 'insensitive' as const } })),
    });

    const [tools, prompts, posts, labs] = await Promise.all([
      this.prisma.tool.findMany({
        where: { ...condition(['name', 'shortDesc', 'category']), status: 'ACTIVE' },
        select: { id: true, name: true, category: true, iconUrl: true },
        take: 4,
      }),
      this.prisma.prompt.findMany({
        where: condition(['title', 'toolName', 'category']),
        select: { id: true, title: true, toolName: true },
        take: 3,
      }),
      this.prisma.post.findMany({
        where: condition(['title', 'category']),
        select: { id: true, title: true, category: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      this.prisma.experiment.findMany({
        where: condition(['title', 'description', 'category']),
        select: { id: true, title: true, emoji: true },
        take: 3,
      }),
    ]);

    return { tools, prompts, posts, labs };
  }
}
