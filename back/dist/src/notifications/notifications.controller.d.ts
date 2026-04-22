import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getByUserEmail(userEmail: string): Promise<{
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
    getUnreadCount(userEmail: string): Promise<{
        count: number;
    }>;
    markAllRead(userEmail: string): Promise<{
        success: boolean;
    } | undefined>;
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
}
