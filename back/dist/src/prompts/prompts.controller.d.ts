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
        updatedAt: Date;
        title: string;
        authorId: string;
        content: string;
        likes: number;
        toolName: string;
        views: number;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__PromptClient<({
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        category: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        title: string;
        authorId: string;
        content: string;
        likes: number;
        toolName: string;
        views: number;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    incrementViews(id: string): import("@prisma/client").Prisma.Prisma__PromptClient<{
        category: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        title: string;
        authorId: string;
        content: string;
        likes: number;
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
        updatedAt: Date;
        title: string;
        authorId: string;
        content: string;
        likes: number;
        toolName: string;
        views: number;
    }>;
}
