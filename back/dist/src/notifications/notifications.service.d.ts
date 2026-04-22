import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService {
    private prisma;
    private gateway?;
    constructor(prisma: PrismaService, gateway?: NotificationsGateway | undefined);
    getByUserEmail(email: string): Promise<{
        createdAt: Date;
        id: string;
        type: string;
        recipientId: string;
        message: string;
        targetType: string;
        targetId: string;
        targetTitle: string | null;
        read: boolean;
    }[]>;
    getUnreadCount(email: string): Promise<{
        count: number;
    }>;
    markRead(id: string): Promise<{
        createdAt: Date;
        id: string;
        type: string;
        recipientId: string;
        message: string;
        targetType: string;
        targetId: string;
        targetTitle: string | null;
        read: boolean;
    }>;
    markAllRead(email: string): Promise<{
        success: boolean;
    } | undefined>;
    create(data: {
        recipientId: string;
        type: string;
        message: string;
        targetType: string;
        targetId: string;
        targetTitle?: string;
    }): Promise<{
        createdAt: Date;
        id: string;
        type: string;
        recipientId: string;
        message: string;
        targetType: string;
        targetId: string;
        targetTitle: string | null;
        read: boolean;
    }>;
}
