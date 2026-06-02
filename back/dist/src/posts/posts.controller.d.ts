import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    findAll(category?: string, userEmail?: string, page?: string, limit?: string, admin?: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        title: string;
        likes: number;
        category: string;
        createdAt: Date;
        views: number;
    }[]>;
    findTopByViews(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        title: string;
        likes: number;
        category: string;
        createdAt: Date;
        author: {
            name: string | null;
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
            name: string | null;
            email: string;
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
        imageUrl: string | null;
        views: number;
        flagReason: string | null;
    }>;
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
        imageUrl: string | null;
        views: number;
        flagReason: string | null;
    }>;
    removeByUser(id: string, authorization?: string): Promise<{
        id: string;
        title: string;
        content: string;
        authorId: string;
        likes: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
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
        id: string;
        title: string;
        content: string;
        authorId: string;
        likes: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
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
            name: string | null;
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
        imageUrl: string | null;
        views: number;
        flagReason: string | null;
    }>;
    incrementViews(id: string): import("@prisma/client").Prisma.Prisma__PostClient<{
        id: string;
        title: string;
        content: string;
        authorId: string;
        likes: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
        isFlagged: boolean;
        imageUrl: string | null;
        views: number;
        flagReason: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    private extractUser;
}
