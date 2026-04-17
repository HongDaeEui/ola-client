import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService {
    private prisma;
    private gateway?;
    constructor(prisma: PrismaService, gateway?: NotificationsGateway | undefined);
    getByUserEmail(email: string): Promise<any>;
    getUnreadCount(email: string): Promise<{
        count: any;
    }>;
    markRead(id: string): Promise<any>;
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
    }): Promise<any>;
}
