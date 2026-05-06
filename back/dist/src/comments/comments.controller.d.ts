import { CommentsService } from './comments.service';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    findByPost(postId: string): import("@prisma/client").Prisma.PrismaPromise<({
        author: {
            email: string;
            username: string;
            avatarUrl: string | null;
        };
        replies: ({
            author: {
                email: string;
                username: string;
                avatarUrl: string | null;
            };
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            content: string;
            authorId: string;
            postId: string;
            parentId: string | null;
        })[];
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
        parentId: string | null;
    })[]>;
    create(body: {
        content: string;
        postId: string;
        userName: string;
        parentId?: string;
    }, authorization?: string): Promise<{
        author: {
            email: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
        parentId: string | null;
    }>;
    update(id: string, body: {
        content: string;
    }, authorization?: string): Promise<{
        author: {
            email: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
        parentId: string | null;
    }>;
    remove(id: string, authorization?: string): Promise<{
        createdAt: Date;
        id: string;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
        parentId: string | null;
    }>;
    private extractUser;
}
