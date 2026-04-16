import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async findAll(type?: string, difficulty?: string) {
    return this.prisma.resource.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(difficulty ? { difficulty } : {}),
      },
      include: {
        author: { select: { username: true, name: true, avatarUrl: true } },
      },
      orderBy: { reads: 'desc' },
    });
  }

  async findFeatured() {
    return this.prisma.resource.findMany({
      where: { isFeatured: true },
      include: {
        author: { select: { username: true, name: true } },
      },
      take: 4,
    });
  }

  async incrementReads(id: string) {
    return this.prisma.resource.update({
      where: { id },
      data: { reads: { increment: 1 } },
    });
  }

  async getTypeCounts() {
    const groups = await this.prisma.resource.groupBy({
      by: ['type'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });
    return groups.map(g => ({ type: g.type, count: g._count.id }));
  }
}
