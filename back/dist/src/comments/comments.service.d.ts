import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class CommentsService {
    private prisma;
    private notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    findByPost(postId: string): import("@prisma/client").Prisma.PrismaPromise<({
        author: {
            email: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        createdAt: Date;
        id: string;
        content: string;
        authorId: string;
        postId: string;
    })[]>;
    create(data: {
        content: string;
        postId: string;
        userEmail: string;
        userName: string;
    }): Promise<{
        author: {
            email: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        createdAt: Date;
        id: string;
        content: string;
        authorId: string;
        postId: string;
    }>;
    remove(id: string, userEmail: string): Promise<{
        createdAt: Date;
        id: string;
        content: string;
        authorId: string;
        postId: string;
    } | null>;
}
