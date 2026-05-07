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
            name: string | null;
            avatarUrl: string | null;
        };
        replies: ({
            author: {
                email: string;
                username: string;
                name: string | null;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            content: string;
            postId: string;
            authorId: string;
            parentId: string | null;
            updatedAt: Date;
            createdAt: Date;
        })[];
    } & {
        id: string;
        content: string;
        postId: string;
        authorId: string;
        parentId: string | null;
        updatedAt: Date;
        createdAt: Date;
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
            name: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        content: string;
        postId: string;
        authorId: string;
        parentId: string | null;
        updatedAt: Date;
        createdAt: Date;
    }>;
    update(id: string, userEmail: string, content: string): Promise<({
        author: {
            email: string;
            username: string;
            name: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        content: string;
        postId: string;
        authorId: string;
        parentId: string | null;
        updatedAt: Date;
        createdAt: Date;
    }) | null>;
    remove(id: string, userEmail: string): Promise<{
        id: string;
        content: string;
        postId: string;
        authorId: string;
        parentId: string | null;
        updatedAt: Date;
        createdAt: Date;
    } | null>;
}
