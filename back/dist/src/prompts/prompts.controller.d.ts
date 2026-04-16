import { PromptsService } from './prompts.service';
export declare class PromptsController {
    private readonly promptsService;
    constructor(promptsService: PromptsService);
    getPrompts(category?: string): Promise<({
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
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__PromptClient<({
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(body: {
        title: string;
        toolName: string;
        category: string;
        content: string;
        userEmail: string;
        userName: string;
    }): Promise<{
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
    }>;
}
