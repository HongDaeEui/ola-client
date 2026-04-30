import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postsService;
    private readonly logger;
    constructor(postsService: PostsService);
    findAll(category?: string, userEmail?: string, page?: string, limit?: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        title: string;
        category: string;
        likes: number;
        views: number;
        createdAt: Date;
    }[]>;
    findTopByViews(): import("@prisma/client").Prisma.PrismaPromise<{
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
        id: string;
        title: string;
        content: string;
        category: string;
        imageUrl: string | null;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        title: string;
        content: string;
        category: string;
        imageUrl: string | null;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(body: {
        title: string;
        content: string;
        category: string;
        imageUrl?: string;
        userName: string;
    }, authorization?: string): Promise<{
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        title: string;
        content: string;
        category: string;
        imageUrl: string | null;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    incrementViews(id: string): import("@prisma/client").Prisma.Prisma__PostClient<{
        id: string;
        title: string;
        content: string;
        category: string;
        imageUrl: string | null;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    private requireEmailFromAuthHeader;
}
