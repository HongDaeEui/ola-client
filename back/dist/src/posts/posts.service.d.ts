import { PrismaService } from '../prisma/prisma.service';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(category?: string): import("@prisma/client").Prisma.PrismaPromise<({
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        title: string;
        content: string;
        category: string;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__PostClient<({
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        title: string;
        content: string;
        category: string;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(data: {
        title: string;
        content: string;
        category: string;
        userEmail: string;
        userName: string;
    }): Promise<{
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        title: string;
        content: string;
        category: string;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findTopByViews(limit?: number): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        title: string;
        category: string;
        likes: number;
        views: number;
        createdAt: Date;
        author: {
            username: string;
            avatarUrl: string | null;
        };
    }[]>;
    incrementViews(id: string): import("@prisma/client").Prisma.Prisma__PostClient<{
        id: string;
        title: string;
        content: string;
        category: string;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByUserEmail(userEmail: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        title: string;
        category: string;
        likes: number;
        views: number;
        createdAt: Date;
    }[]>;
}
