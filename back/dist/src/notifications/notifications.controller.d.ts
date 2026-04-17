import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getByUserEmail(userEmail: string): Promise<any>;
    getUnreadCount(userEmail: string): Promise<{
        count: any;
    }>;
    markAllRead(userEmail: string): Promise<{
        success: boolean;
    } | undefined>;
    markRead(id: string): Promise<any>;
}
