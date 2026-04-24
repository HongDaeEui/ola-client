import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// 목록 API 공통 select: description 제외하여 페이로드 최소화
const TOOL_LIST_SELECT = {
  id: true,
  name: true,
  shortDesc: true,
  category: true,
  pricingModel: true,
  rating: true,
  iconUrl: true,
  coverUrl: true,
  isFeatured: true,
  tags: true,
  likes: true,
  status: true,
  launchUrl: true,
  createdAt: true,
} as const;

@Injectable()
export class ToolsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { category?: string; pricing?: string; tags?: string; sort?: string }) {
    const where: Record<string, unknown> = { status: 'ACTIVE' };
    
    if (filters?.category) {
      where.category = { in: filters.category.split(',').map(s => s.trim()) };
    }
    if (filters?.pricing) {
      where.pricingModel = { in: filters.pricing.split(',').map(s => s.trim()) };
    }
    if (filters?.tags) {
      where.tags = { hasSome: filters.tags.split(',').map(s => s.trim()) };
    }

    const orderBy =
      filters?.sort === 'rating' ? { rating: 'desc' as const }
      : filters?.sort === 'popular' ? { isFeatured: 'desc' as const }
      : { createdAt: 'desc' as const };

    return this.prisma.tool.findMany({
      where,
      orderBy,
      select: TOOL_LIST_SELECT,
    });
  }

  async findFeatured() {
    return this.prisma.tool.findMany({
      where: { isFeatured: true },
      take: 5,
      select: TOOL_LIST_SELECT,
    });
  }

  async findTopByRating(limit = 10) {
    return this.prisma.tool.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { rating: 'desc' },
      take: limit,
      select: TOOL_LIST_SELECT,
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
    const tool = await this.prisma.tool.findUnique({
      where: { id },
    });

    if (!tool) throw new NotFoundException(`도구(${id})를 찾을 수 없습니다.`);

    const relatedLabs = await this.prisma.experiment.findMany({
      where: {
        stack: {
          has: tool.name,
        },
      },
      include: {
        author: {
          select: { username: true, avatarUrl: true },
        },
      },
      orderBy: { likes: 'desc' },
      take: 4,
    });

    return { ...tool, relatedLabs };
  }

  async findRelated(id: string) {
    const tool = await this.prisma.tool.findUnique({
      where: { id },
      select: { id: true, category: true },
    });

    if (!tool) throw new NotFoundException(`도구(${id})를 찾을 수 없습니다.`);

    return this.prisma.tool.findMany({
      where: {
        category: tool.category,
        status: 'ACTIVE',
        NOT: { id: tool.id },
      },
      orderBy: { rating: 'desc' },
      take: 4,
      select: TOOL_LIST_SELECT,
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
