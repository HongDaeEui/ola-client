import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ModerationService } from '../moderation/moderation.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private moderationService: ModerationService,
  ) {}

  findAll(category?: string, skip = 0, take?: number, includeFlagged = false) {
    return this.prisma.post.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(!includeFlagged ? { isFlagged: false } : {}),
      },
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

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });
    if (!post) throw new NotFoundException(`게시글(${id})을 찾을 수 없습니다.`);
    return post;
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
    const newPost = await this.prisma.post.create({
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

    // 비동기로 디스코드 알림 발송
    // this.notificationsService.sendPostNotification(newPost).catch((err) => {
    //   console.error('Failed to send notification via PostsService', err);
    // });

    // 비동기 AI 모더레이션
    this.moderationService.moderatePost(newPost.id, newPost.content).catch((err) => {
      console.error('Failed to run AI moderation', err);
    });

    return newPost;
  }

  findTopByViews(limit = 10) {
    return this.prisma.post.findMany({
      where: { isFlagged: false },
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
      where: { isFlagged: false },
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

  findByUserEmail(userEmail: string, includeFlagged = false) {
    return this.prisma.post.findMany({
      where: { 
        author: { email: userEmail },
        ...(!includeFlagged ? { isFlagged: false } : {}),
      },
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

  async remove(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  async update(id: string, userEmail: string, data: {
    title?: string;
    content?: string;
    category?: string;
    imageUrl?: string | null;
  }) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!post) throw new NotFoundException(`게시글(${id})을 찾을 수 없습니다.`);
    if (post.author.email !== userEmail) {
      throw new Error('권한이 없습니다.');
    }
    
    // AI 모더레이션 재검사가 필요하다면 여기서 비동기 호출 (생략 가능)
    if (data.content && data.content !== post.content) {
      this.moderationService.moderatePost(id, data.content).catch((err) => {
        console.error('Failed to run AI moderation on update', err);
      });
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.content ? { content: data.content } : {}),
        ...(data.category ? { category: data.category } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
      },
    });
  }

  async removeByUser(id: string, userEmail: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!post) throw new NotFoundException(`게시글(${id})을 찾을 수 없습니다.`);
    if (post.author.email !== userEmail) {
      throw new Error('권한이 없습니다.');
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }
}
