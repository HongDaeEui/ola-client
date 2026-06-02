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
        id: string;
        title: string;
        content: string;
        authorId: string;
        likes: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
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
        id: string;
        title: string;
        content: string;
        authorId: string;
        likes: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
        isFlagged: boolean;
        views: number;
        flagReason: string | null;
        toolName: string;
    }>;
    incrementViews(id: string): import("@prisma/client").Prisma.Prisma__PromptClient<{
        id: string;
        title: string;
        content: string;
        authorId: string;
        likes: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
        isFlagged: boolean;
        views: number;
        flagReason: string | null;
        toolName: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): Promise<{
        id: string;
        title: string;
        content: string;
        authorId: string;
        likes: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
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
        id: string;
        title: string;
        content: string;
        authorId: string;
        likes: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
        isFlagged: boolean;
        views: number;
        flagReason: string | null;
        toolName: string;
    }>;
    private extractUser;
}
