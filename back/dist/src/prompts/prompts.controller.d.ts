import { PromptsService } from './prompts.service';
export declare class PromptsController {
    private readonly promptsService;
    constructor(promptsService: PromptsService);
    getPrompts(category?: string, userEmail?: string, page?: string, limit?: string): Promise<({
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
        toolName: string;
        views: number;
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
        toolName: string;
        views: number;
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
        toolName: string;
        views: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(body: {
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
        toolName: string;
        views: number;
    }>;
}
