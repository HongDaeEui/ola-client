import { PromptsService } from './prompts.service';
export declare class PromptsController {
    private readonly promptsService;
    private readonly logger;
    constructor(promptsService: PromptsService);
    getPrompts(category?: string, userEmail?: string, page?: string, limit?: string): Promise<({
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
    })[]>;
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
    }>;
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
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
        toolName: string;
        category: string;
        content: string;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private requireEmailFromAuthHeader;
}
