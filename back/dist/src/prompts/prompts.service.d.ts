import { PrismaService } from '../prisma/prisma.service';
import { ModerationService } from '../moderation/moderation.service';
import { TelegramService } from '../telegram/telegram.service';
export declare class PromptsService {
    private prisma;
    private moderationService;
    private telegramService;
    constructor(prisma: PrismaService, moderationService: ModerationService, telegramService: TelegramService);
    findAll(filters?: {
        category?: string;
        userEmail?: string;
    }, skip?: number, take?: number, includeFlagged?: boolean): Promise<({
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        title: string;
        toolName: string;
        category: string;
        content: string;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
        isFlagged: boolean;
        flagReason: string | null;
    })[]>;
    incrementViews(id: string): import("@prisma/client").Prisma.Prisma__PromptClient<{
        id: string;
        title: string;
        toolName: string;
        category: string;
        content: string;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
        isFlagged: boolean;
        flagReason: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findOne(id: string): Promise<{
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        title: string;
        toolName: string;
        category: string;
        content: string;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
        isFlagged: boolean;
        flagReason: string | null;
    }>;
    create(data: {
        title: string;
        toolName: string;
        category: string;
        content: string;
        userEmail: string;
        userName: string;
    }): Promise<{
        id: string;
        title: string;
        toolName: string;
        category: string;
        content: string;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
        isFlagged: boolean;
        flagReason: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        title: string;
        toolName: string;
        category: string;
        content: string;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
        isFlagged: boolean;
        flagReason: string | null;
    }>;
}
