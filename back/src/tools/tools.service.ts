import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ToolsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { category?: string; pricing?: string; sort?: string }) {
    const where: Record<string, unknown> = { status: 'ACTIVE' };
    if (filters?.category) where.category = filters.category;
    if (filters?.pricing) where.pricingModel = filters.pricing;

    const orderBy =
      filters?.sort === 'rating' ? { rating: 'desc' as const }
      : filters?.sort === 'popular' ? { isFeatured: 'desc' as const }
      : { createdAt: 'desc' as const };

    return this.prisma.tool.findMany({ where, orderBy });
  }

  async findFeatured() {
    return this.prisma.tool.findMany({
      where: { isFeatured: true },
      take: 5,
    });
  }

  async findTopByRating(limit = 10) {
    return this.prisma.tool.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { rating: 'desc' },
      take: limit,
      select: { id: true, name: true, shortDesc: true, category: true, rating: true, pricingModel: true, iconUrl: true, isFeatured: true },
    });
  }

  async getCategoryCounts() {
    const counts = await this.prisma.tool.groupBy({
      by: ['category'],
      where: { status: 'ACTIVE' },
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
    });
    return counts.map(c => ({ category: c.category, count: c._count.category }));
  }

  async findPending() {
    return this.prisma.tool.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approve(id: string) {
    return this.prisma.tool.update({ where: { id }, data: { status: 'ACTIVE' } });
  }

  async reject(id: string) {
    return this.prisma.tool.update({ where: { id }, data: { status: 'REJECTED' } });
  }

  async findOne(id: string) {
    return this.prisma.tool.findUnique({
      where: { id },
    });
  }

  async create(data: {
    name: string;
    shortDesc: string;
    description: string;
    category: string;
    launchUrl: string;
    pricingModel?: string;
    tags?: string[];
  }) {
    return this.prisma.tool.create({
      data: {
        ...data,
        status: 'PENDING',
        tags: data.tags ?? [],
      },
    });
  }
}
