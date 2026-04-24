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
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.like.findUnique({
        where: { userId_targetType_targetId: { userId, targetType, targetId } },
      });

      if (existing) {
        await tx.like.delete({ where: { id: existing.id } });
        await this.decrementLikesInTx(tx, targetType, targetId);
        return { liked: false };
      } else {
        await tx.like.create({ data: { userId, targetType, targetId } });
        await this.incrementLikesInTx(tx, targetType, targetId);
        // 알림은 트랜잭션 외부에서 비동기 처리
        this.createLikeNotification(targetType, targetId).catch(() => {});
        return { liked: true };
      }
    });
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

  private async incrementLikesInTx(tx: any, targetType: string, targetId: string) {
    if (targetType === 'POST') {
      await tx.post.update({ where: { id: targetId }, data: { likes: { increment: 1 } } });
    } else if (targetType === 'PROMPT') {
      await tx.prompt.update({ where: { id: targetId }, data: { likes: { increment: 1 } } });
    } else if (targetType === 'LAB') {
      await tx.experiment.update({ where: { id: targetId }, data: { likes: { increment: 1 } } });
    } else if (targetType === 'TOOL') {
      await tx.tool.update({ where: { id: targetId }, data: { likes: { increment: 1 } } });
    }
  }

  private async decrementLikesInTx(tx: any, targetType: string, targetId: string) {
    if (targetType === 'POST') {
      await tx.post.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } });
    } else if (targetType === 'PROMPT') {
      await tx.prompt.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } });
    } else if (targetType === 'LAB') {
      await tx.experiment.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } });
    } else if (targetType === 'TOOL') {
      await tx.tool.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } });
    }
  }
}
