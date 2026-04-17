import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LikesService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async toggle(userId: string, targetType: string, targetId: string) {
    const existing = await this.prisma.like.findUnique({
      where: { userId_targetType_targetId: { userId, targetType, targetId } },
    });

    if (existing) {
      await this.prisma.like.delete({ where: { id: existing.id } });
      await this.decrementLikes(targetType, targetId);
      return { liked: false };
    } else {
      await this.prisma.like.create({ data: { userId, targetType, targetId } });
      await this.incrementLikes(targetType, targetId);
      await this.createLikeNotification(targetType, targetId).catch(() => {});
      return { liked: true };
    }
  }

  async getStatus(userId: string, targetType: string, targetId: string) {
    const existing = await this.prisma.like.findUnique({
      where: { userId_targetType_targetId: { userId, targetType, targetId } },
    });
    return { liked: !!existing };
  }

  private async createLikeNotification(targetType: string, targetId: string) {
    let authorId: string | null = null;
    let title: string | null = null;

    if (targetType === 'POST') {
      const post = await this.prisma.post.findUnique({ where: { id: targetId }, select: { authorId: true, title: true } });
      authorId = post?.authorId ?? null;
      title = post?.title ?? null;
    } else if (targetType === 'PROMPT') {
      const prompt = await this.prisma.prompt.findUnique({ where: { id: targetId }, select: { authorId: true, title: true } });
      authorId = prompt?.authorId ?? null;
      title = prompt?.title ?? null;
    }

    if (!authorId) return;

    const label = targetType === 'POST' ? '게시글' : '프롬프트';
    await this.notifications.create({
      recipientId: authorId,
      type: 'LIKE',
      message: `누군가 회원님의 ${label}에 좋아요를 눌렀어요`,
      targetType,
      targetId,
      targetTitle: title ?? undefined,
    });
  }

  private async incrementLikes(targetType: string, targetId: string) {
    if (targetType === 'POST') {
      await this.prisma.post.update({ where: { id: targetId }, data: { likes: { increment: 1 } } });
    } else if (targetType === 'PROMPT') {
      await this.prisma.prompt.update({ where: { id: targetId }, data: { likes: { increment: 1 } } });
    } else if (targetType === 'LAB') {
      await this.prisma.experiment.update({ where: { id: targetId }, data: { likes: { increment: 1 } } });
    } else if (targetType === 'TOOL') {
      await this.prisma.tool.update({ where: { id: targetId }, data: { likes: { increment: 1 } } });
    }
  }

  private async decrementLikes(targetType: string, targetId: string) {
    if (targetType === 'POST') {
      await this.prisma.post.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } });
    } else if (targetType === 'PROMPT') {
      await this.prisma.prompt.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } });
    } else if (targetType === 'LAB') {
      await this.prisma.experiment.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } });
    } else if (targetType === 'TOOL') {
      await this.prisma.tool.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } });
    }
  }
}
