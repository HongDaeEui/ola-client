import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

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
      return { liked: true };
    }
  }

  async getStatus(userId: string, targetType: string, targetId: string) {
    const existing = await this.prisma.like.findUnique({
      where: { userId_targetType_targetId: { userId, targetType, targetId } },
    });
    return { liked: !!existing };
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
