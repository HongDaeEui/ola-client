import { PrismaService } from '../prisma/prisma.service';
export declare class PromptsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: {
        category?: string;
        userEmail?: string;
    }, skip?: number, take?: number): Promise<({
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
    }>;
}
