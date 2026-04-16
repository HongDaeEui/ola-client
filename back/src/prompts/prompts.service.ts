import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromptsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { category?: string }) {
    const where: Record<string, unknown> = {};
    if (filters?.category) where.category = filters.category;
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
    });
  }

  findOne(id: string) {
    return this.prisma.prompt.findUnique({
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
    return this.prisma.prompt.create({
      data: {
        title: data.title,
        toolName: data.toolName,
        category: data.category,
        content: data.content,
        authorId: author.id,
      },
    });
  }
}
