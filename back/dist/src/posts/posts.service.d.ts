import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class PostsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    findAll(category?: string, skip?: number, take?: number): import("@prisma/client").Prisma.PrismaPromise<({
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
        views: number;
        imageUrl: string | null;
    })[]>;
    findOne(id: string): Promise<{
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
        views: number;
        imageUrl: string | null;
    }>;
    create(data: {
        title: string;
        content: string;
        category: string;
        imageUrl?: string;
        userEmail: string;
        userName: string;
    }): Promise<{
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
        views: number;
        imageUrl: string | null;
    }>;
    findTopByViews(limit?: number): import("@prisma/client").Prisma.PrismaPromise<{
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        title: string;
        author: {
            username: string;
            avatarUrl: string | null;
        };
        views: number;
    }[]>;
    incrementViews(id: string): import("@prisma/client").Prisma.Prisma__PostClient<{
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
        views: number;
        imageUrl: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    getTagStats(): Promise<{
        category: string;
        postCount: number;
        totalLikes: number;
        totalViews: number;
    }[]>;
    findByUserEmail(userEmail: string): import("@prisma/client").Prisma.PrismaPromise<{
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        title: string;
        views: number;
    }[]>;
}
