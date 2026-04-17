import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class CommentsService {
    private prisma;
    private notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    findByPost(postId: string): any;
    create(data: {
        content: string;
        postId: string;
        userEmail: string;
        userName: string;
    }): Promise<any>;
    remove(id: string, userEmail: string): Promise<any>;
}
