import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    findAll(category?: string, userEmail?: string, page?: string, limit?: string): import("@prisma/client").Prisma.PrismaPromise<{
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        title: string;
        views: number;
    }[]>;
    findTopByViews(): import("@prisma/client").Prisma.PrismaPromise<{
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        title: string;
        author: {
            username: string;
            avatarUrl: string | null;
        };
        views: number;
    }[]>;
    getTagStats(): Promise<{
        category: string;
        postCount: number;
        totalLikes: number;
        totalViews: number;
    }[]>;
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
        views: number;
        imageUrl: string | null;
    }>;
    create(body: {
        title: string;
        content: string;
        category: string;
        imageUrl?: string;
        userEmail: string;
        userName: string;
    }): Promise<{
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
        views: number;
        imageUrl: string | null;
    }>;
    incrementViews(id: string): import("@prisma/client").Prisma.Prisma__PostClient<{
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
        views: number;
        imageUrl: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
