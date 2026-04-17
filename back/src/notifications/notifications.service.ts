import { Injectable, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    @Optional() private gateway?: NotificationsGateway,
  ) {}

  async getByUserEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return [];
    return this.prisma.notification.findMany({
      where: { recipientId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  async getUnreadCount(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { count: 0 };
    const count = await this.prisma.notification.count({
      where: { recipientId: user.id, read: false },
    });
    return { count };
  }

  async markRead(id: string) {
    return this.prisma.notification.update({ where: { id }, data: { read: true } });
  }

  async markAllRead(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return;
    await this.prisma.notification.updateMany({
      where: { recipientId: user.id, read: false },
      data: { read: true },
    });
    return { success: true };
  }

  async create(data: {
    recipientId: string;
    type: string;
    message: string;
    targetType: string;
    targetId: string;
    targetTitle?: string;
  }) {
    const notification = await this.prisma.notification.create({ data });

    // Real-time push via WebSocket
    if (this.gateway) {
      const recipient = await this.prisma.user.findUnique({
        where: { id: data.recipientId },
        select: { email: true },
      });
      if (recipient) {
        this.gateway.notifyUser(recipient.email, notification);
      }
    }

    return notification;
  }
}
