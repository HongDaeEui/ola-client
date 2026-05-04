import { PrismaService } from '../prisma/prisma.service';
import { ModerationService } from '../moderation/moderation.service';
export declare class PromptsService {
    private prisma;
    private moderationService;
    constructor(prisma: PrismaService, moderationService: ModerationService);
    findAll(filters?: {
        category?: string;
        userEmail?: string;
    }, skip?: number, take?: number, includeFlagged?: boolean): Promise<({
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
        views: number;
        flagReason: string | null;
        toolName: string;
    })[]>;
    incrementViews(id: string): import("@prisma/client").Prisma.Prisma__PromptClient<{
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
        isFlagged: boolean;
        views: number;
        flagReason: string | null;
        toolName: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
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
        views: number;
        flagReason: string | null;
        toolName: string;
    }>;
    create(data: {
        title: string;
        toolName: string;
        category: string;
        content: string;
        userEmail: string;
        userName: string;
    }): Promise<{
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
        isFlagged: boolean;
        views: number;
        flagReason: string | null;
        toolName: string;
    }>;
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
        views: number;
        flagReason: string | null;
        toolName: string;
    }>;
}
