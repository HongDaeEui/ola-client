import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    findAll(category?: string, userEmail?: string, page?: string, limit?: string, admin?: string): import("@prisma/client").Prisma.PrismaPromise<{
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
            email: string;
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
        isFlagged: boolean;
        imageUrl: string | null;
        views: number;
        flagReason: string | null;
    }>;
    remove(id: string): Promise<{
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
        isFlagged: boolean;
        imageUrl: string | null;
        views: number;
        flagReason: string | null;
    }>;
    removeByUser(id: string, authorization?: string): Promise<{
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
        isFlagged: boolean;
        imageUrl: string | null;
        views: number;
        flagReason: string | null;
    }>;
    update(id: string, body: {
        title?: string;
        content?: string;
        category?: string;
        imageUrl?: string | null;
    }, authorization?: string): Promise<{
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
        isFlagged: boolean;
        imageUrl: string | null;
        views: number;
        flagReason: string | null;
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
        category: string;
        createdAt: Date;
        id: string;
        likes: number;
        updatedAt: Date;
        title: string;
        content: string;
        authorId: string;
        isFlagged: boolean;
        imageUrl: string | null;
        views: number;
        flagReason: string | null;
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
        isFlagged: boolean;
        imageUrl: string | null;
        views: number;
        flagReason: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    private extractUser;
}
