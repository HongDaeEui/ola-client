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
        replies: ({
            author: {
                email: string;
                username: string;
                avatarUrl: string | null;
            };
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            content: string;
            authorId: string;
            postId: string;
            parentId: string | null;
        })[];
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
        parentId: string | null;
    })[]>;
    create(data: {
        content: string;
        postId: string;
        userEmail: string;
        userName: string;
        parentId?: string;
    }): Promise<{
        author: {
            email: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
        parentId: string | null;
    }>;
    update(id: string, userEmail: string, content: string): Promise<({
        author: {
            email: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
        parentId: string | null;
    }) | null>;
    remove(id: string, userEmail: string): Promise<{
        createdAt: Date;
        id: string;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
        parentId: string | null;
    } | null>;
}
