import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    findAll(category?: string, userEmail?: string, page?: string, limit?: string, admin?: string): import("@prisma/client").Prisma.PrismaPromise<{
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
            name: string | null;
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
            email: string;
            username: string;
            name: string | null;
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
        isFlagged: boolean;
        flagReason: string | null;
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
        isFlagged: boolean;
        flagReason: string | null;
    }>;
    removeByUser(id: string, authorization?: string): Promise<{
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
        isFlagged: boolean;
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
        category: string;
        imageUrl: string | null;
        authorId: string;
        likes: number;
        views: number;
        createdAt: Date;
        updatedAt: Date;
        isFlagged: boolean;
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
            name: string | null;
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
        isFlagged: boolean;
        flagReason: string | null;
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
        isFlagged: boolean;
        flagReason: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    private extractUser;
}
