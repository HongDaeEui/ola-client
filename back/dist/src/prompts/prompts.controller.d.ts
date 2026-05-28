import { PromptsService } from './prompts.service';
export declare class PromptsController {
    private readonly promptsService;
    constructor(promptsService: PromptsService);
    getPrompts(category?: string, userEmail?: string, page?: string, limit?: string, admin?: string): Promise<({
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        category: string;
        id: string;
        title: string;
        toolName: string;
        content: string;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
        isFlagged: boolean;
        flagReason: string | null;
    })[]>;
    findOne(id: string): Promise<{
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        category: string;
        id: string;
        title: string;
        toolName: string;
        content: string;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
        isFlagged: boolean;
        flagReason: string | null;
    }>;
    incrementViews(id: string): import("@prisma/client").Prisma.Prisma__PromptClient<{
        category: string;
        id: string;
        title: string;
        toolName: string;
        content: string;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
        isFlagged: boolean;
        flagReason: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): Promise<{
        category: string;
        id: string;
        title: string;
        toolName: string;
        content: string;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
        isFlagged: boolean;
        flagReason: string | null;
    }>;
    create(body: {
        title: string;
        toolName: string;
        category: string;
        content: string;
        userName: string;
    }, authorization?: string): Promise<{
        category: string;
        id: string;
        title: string;
        toolName: string;
        content: string;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
        isFlagged: boolean;
        flagReason: string | null;
    }>;
    private extractUser;
}
