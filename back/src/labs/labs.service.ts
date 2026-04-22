import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LabsService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string) {
    const where: Record<string, unknown> = {};
    if (category) where.category = category;

    return this.prisma.experiment.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        emoji: true,
        metric: true,
        category: true,
        stack: true,
        color: true,
        likes: true,
        // content 필드 제외 — 목록에서 본문 수천 자 전송 방지
        author: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { likes: 'desc' },
    });
  }

  async findOne(id: string) {
    const lab = await this.prisma.experiment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
    if (!lab) throw new NotFoundException(`실험실(${id})을 찾을 수 없습니다.`);
    return lab;
  }
}
