export declare class NotificationsService {
    private readonly logger;
    private webhookUrl;
    constructor();
    sendPostNotification(post: {
        id: string;
        title: string;
        content: string;
        category: string;
        author: {
            username: string;
        };
    }): Promise<void>;
}
