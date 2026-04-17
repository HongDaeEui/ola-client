import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class LikesService {
    private prisma;
    private notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    toggle(userId: string, targetType: string, targetId: string): Promise<{
        liked: boolean;
    }>;
    getStatus(userId: string, targetType: string, targetId: string): Promise<{
        liked: boolean;
    }>;
    private createLikeNotification;
    private incrementLikes;
    private decrementLikes;
}
