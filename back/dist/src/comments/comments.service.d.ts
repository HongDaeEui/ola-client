import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class CommentsService {
    private prisma;
    private notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    findByPost(postId: string): import("@prisma/client").Prisma.PrismaPromise<({
        author: {
            name: string | null;
            email: string;
            username: string;
            avatarUrl: string | null;
        };
        replies: ({
            author: {
                name: string | null;
                email: string;
                username: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            content: string;
            authorId: string;
            createdAt: Date;
            updatedAt: Date;
            postId: string;
            parentId: string | null;
        })[];
    } & {
        id: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
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
            name: string | null;
            email: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        parentId: string | null;
    }>;
    update(id: string, userEmail: string, content: string): Promise<({
        author: {
            name: string | null;
            email: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        parentId: string | null;
    }) | null>;
    remove(id: string, userEmail: string): Promise<{
        id: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        parentId: string | null;
    } | null>;
}
