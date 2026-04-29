import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    private readonly logger;
    constructor(notificationsService: NotificationsService);
    getByUserEmail(authorization?: string): Promise<{
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
    getUnreadCount(authorization?: string): Promise<{
        count: number;
    }>;
    markAllRead(authorization?: string): Promise<{
        success: boolean;
    } | undefined>;
    markRead(id: string, authorization?: string): Promise<{
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
    private requireEmailFromAuthHeader;
}
