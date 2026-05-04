import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModerationService } from '../moderation/moderation.service';

@Injectable()
export class PromptsService {
  constructor(
    private prisma: PrismaService,
    private moderationService: ModerationService,
  ) {}

  async findAll(filters?: { category?: string; userEmail?: string }, skip = 0, take?: number, includeFlagged = false) {
    const where: Record<string, unknown> = {};
    if (!includeFlagged) where.isFlagged = false;
    if (filters?.category) where.category = filters.category;
    if (filters?.userEmail) where.author = { email: filters.userEmail };
    return this.prisma.prompt.findMany({
      where,
      include: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { views: 'desc' },
      skip,
      ...(take !== undefined ? { take } : {}),
    });
  }

  incrementViews(id: string) {
    return this.prisma.prompt.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  async findOne(id: string) {
    const prompt = await this.prisma.prompt.findUnique({
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
    if (!prompt) throw new NotFoundException(`프롬프트(${id})를 찾을 수 없습니다.`);
    return prompt;
  }

  async create(data: {
    title: string;
    toolName: string;
    category: string;
    content: string;
    userEmail: string;
    userName: string;
  }) {
    const base = data.userName.replace(/\s+/g, '_').toLowerCase();
    const suffix = Math.random().toString(36).slice(2, 6);
    const author = await this.prisma.user.upsert({
      where: { email: data.userEmail },
      update: {},
      create: {
        email: data.userEmail,
        username: `${base}_${suffix}`,
        name: data.userName,
      },
    });
    const prompt = await this.prisma.prompt.create({
      data: {
        title: data.title,
        toolName: data.toolName,
        category: data.category,
        content: data.content,
        authorId: author.id,
      },
    });

    // 비동기 AI 모더레이션
    this.moderationService.moderatePrompt(prompt.id, prompt.content).catch((err) => {
      console.error('Failed to run AI moderation', err);
    });

    return prompt;
  }

  async remove(id: string) {
    return this.prisma.prompt.delete({
      where: { id },
    });
  }
}
