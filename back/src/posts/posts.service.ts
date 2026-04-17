import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  findAll(category?: string, skip = 0, take?: number) {
    return this.prisma.post.findMany({
      where: category ? { category } : undefined,
      include: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      ...(take !== undefined ? { take } : {}),
    });
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({
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
    content: string;
    category: string;
    imageUrl?: string;
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
    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
        authorId: author.id,
      },
      include: {
        author: {
          select: { username: true, avatarUrl: true },
        },
      },
    });
  }

  findTopByViews(limit = 10) {
    return this.prisma.post.findMany({
      orderBy: [{ views: 'desc' }, { likes: 'desc' }],
      take: limit,
      select: {
        id: true,
        title: true,
        category: true,
        likes: true,
        views: true,
        createdAt: true,
        author: { select: { username: true, avatarUrl: true } },
      },
    });
  }

  incrementViews(id: string) {
    return this.prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  async getTagStats() {
    const groups = await this.prisma.post.groupBy({
      by: ['category'],
      _count: { id: true },
      _sum: { likes: true, views: true },
      orderBy: { _sum: { likes: 'desc' } },
    });
    return groups.map(g => ({
      category: g.category,
      postCount: g._count.id,
      totalLikes: g._sum.likes ?? 0,
      totalViews: g._sum.views ?? 0,
    }));
  }

  findByUserEmail(userEmail: string) {
    return this.prisma.post.findMany({
      where: { author: { email: userEmail } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        category: true,
        likes: true,
        views: true,
        createdAt: true,
      },
    });
  }
}
