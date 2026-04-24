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
    // targetType → (조회 함수, 한국어 라벨) 매핑
    // Tool 은 authorId 가 없어(외부 도구) 알림 대상 제외
    type TargetRow = { authorId: string; title: string } | null;
    const fetchers: Record<string, { fetch: () => Promise<TargetRow>; label: string }> = {
      POST: {
        fetch: () =>
          this.prisma.post.findUnique({
            where: { id: targetId },
            select: { authorId: true, title: true },
          }),
        label: '게시글',
      },
      PROMPT: {
        fetch: () =>
          this.prisma.prompt.findUnique({
            where: { id: targetId },
            select: { authorId: true, title: true },
          }),
        label: '프롬프트',
      },
      LAB: {
        fetch: () =>
          this.prisma.experiment.findUnique({
            where: { id: targetId },
            select: { authorId: true, title: true },
          }),
        label: '실험실',
      },
    };

    const entry = fetchers[targetType];
    if (!entry) return;

    const target = await entry.fetch();
    if (!target?.authorId) return;

    await this.notifications.create({
      recipientId: target.authorId,
      type: 'LIKE',
      message: `누군가 회원님의 ${entry.label}에 좋아요를 눌렀어요`,
      targetType,
      targetId,
      targetTitle: target.title,
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
