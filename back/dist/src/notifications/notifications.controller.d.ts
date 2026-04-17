import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getByUserEmail(userEmail: string): any;
    getUnreadCount(userEmail: string): any;
    markAllRead(userEmail: string): any;
    markRead(id: string): any;
}
