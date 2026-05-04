import { PromptsService } from './prompts.service';
export declare class PromptsController {
    private readonly promptsService;
    private readonly logger;
    constructor(promptsService: PromptsService);
    getPrompts(category?: string, userEmail?: string, page?: string, limit?: string, admin?: string): Promise<({
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
    create(body: {
        title: string;
        toolName: string;
        category: string;
        content: string;
        userName: string;
    }, authorization?: string): Promise<{
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
    private requireEmailFromAuthHeader;
}
