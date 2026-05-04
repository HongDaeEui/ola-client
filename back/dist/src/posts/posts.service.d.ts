import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ModerationService } from '../moderation/moderation.service';
export declare class PostsService {
    private prisma;
    private notificationsService;
    private moderationService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, moderationService: ModerationService);
    findAll(category?: string, skip?: number, take?: number, includeFlagged?: boolean): import("@prisma/client").Prisma.PrismaPromise<({
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
        isFlagged: boolean;
        imageUrl: string | null;
        views: number;
        flagReason: string | null;
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
        isFlagged: boolean;
        imageUrl: string | null;
        views: number;
        flagReason: string | null;
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
        isFlagged: boolean;
        imageUrl: string | null;
        views: number;
        flagReason: string | null;
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
        isFlagged: boolean;
        imageUrl: string | null;
        views: number;
        flagReason: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    getTagStats(): Promise<{
        category: string;
        postCount: number;
        totalLikes: number;
        totalViews: number;
    }[]>;
    findByUserEmail(userEmail: string, includeFlagged?: boolean): import("@prisma/client").Prisma.PrismaPromise<{
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        title: string;
        views: number;
    }[]>;
    remove(id: string): Promise<{
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
        isFlagged: boolean;
        imageUrl: string | null;
        views: number;
        flagReason: string | null;
    }>;
}
