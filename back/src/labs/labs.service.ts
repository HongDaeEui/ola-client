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
        createdAt: true,
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

  async remove(id: string) {
    return this.prisma.experiment.delete({
      where: { id },
    });
  }

  /**
   * 관리자 직접 추가: Experiment(Lab) 즉시 생성.
   * authorId 미지정 시 첫 ADMIN 사용자를 author로 자동 지정한다.
   * ADMIN 사용자가 없으면 어떤 User라도 첫 번째 레코드를 사용한다.
   */
  async adminCreate(data: {
    title: string;
    description: string;
    content?: string;
    category: string;
    difficulty?: string;
    emoji?: string;
    metric: string;
    stack?: string[];
    color?: string;
    authorId?: string;
  }) {
    let authorId = data.authorId;
    if (!authorId) {
      const admin = await this.prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: { id: true },
      });
      if (admin) {
        authorId = admin.id;
      } else {
        const anyUser = await this.prisma.user.findFirst({
          select: { id: true },
        });
        if (!anyUser) {
          throw new NotFoundException(
            'authorId가 지정되지 않았고 사용자 레코드가 존재하지 않습니다.',
          );
        }
        authorId = anyUser.id;
      }
    }

    return this.prisma.experiment.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        difficulty: data.difficulty,
        emoji: data.emoji,
        metric: data.metric,
        stack: data.stack ?? [],
        color: data.color,
        authorId,
      },
    });
  }
}
