import { CommentsService } from './comments.service';
export declare class CommentsController {
    private readonly commentsService;
    private readonly logger;
    constructor(commentsService: CommentsService);
    findByPost(postId: string): import("@prisma/client").Prisma.PrismaPromise<({
        author: {
            email: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        createdAt: Date;
        id: string;
        content: string;
        authorId: string;
        postId: string;
    })[]>;
    create(body: {
        content: string;
        postId: string;
        userEmail: string;
        userName: string;
    }): Promise<{
        author: {
            email: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        createdAt: Date;
        id: string;
        content: string;
        authorId: string;
        postId: string;
    }>;
    remove(id: string, authorization?: string): Promise<{
        createdAt: Date;
        id: string;
        content: string;
        authorId: string;
        postId: string;
    }>;
    private extractEmailFromToken;
}
