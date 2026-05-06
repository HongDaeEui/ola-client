import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  findByPost(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId, parentId: null },
      include: {
        author: { select: { username: true, avatarUrl: true, email: true } },
        replies: {
          include: {
            author: { select: { username: true, avatarUrl: true, email: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(data: {
    content: string;
    postId: string;
    userEmail: string;
    userName: string;
    parentId?: string;
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

    const comment = await this.prisma.comment.create({
      data: {
        content: data.content,
        postId: data.postId,
        authorId: author.id,
        parentId: data.parentId ?? null,
      },
      include: {
        author: { select: { username: true, avatarUrl: true, email: true } },
      },
    });

    // Notify post author (skip if commenter is the author)
    const post = await this.prisma.post.findUnique({
      where: { id: data.postId },
      select: { authorId: true, title: true },
    });
    if (post && post.authorId !== author.id) {
      await this.notifications.create({
        recipientId: post.authorId,
        type: 'COMMENT',
        message: `${data.userName}님이 회원님의 게시글에 댓글을 남겼어요`,
        targetType: 'POST',
        targetId: data.postId,
        targetTitle: post.title,
      }).catch(() => {});
    }

    return comment;
  }

  async update(id: string, userEmail: string, content: string) {
    const user = await this.prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) return null;
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment || comment.authorId !== user.id) return null;
    return this.prisma.comment.update({
      where: { id },
      data: { content },
      include: { author: { select: { username: true, avatarUrl: true, email: true } } },
    });
  }

  async remove(id: string, userEmail: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { author: { select: { email: true } } },
    });
    if (!comment || comment.author.email !== userEmail) return null;
    return this.prisma.comment.delete({ where: { id } });
  }
}
