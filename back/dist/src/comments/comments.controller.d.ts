import { CommentsService } from './comments.service';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    findByPost(postId: string): import("@prisma/client").Prisma.PrismaPromise<({
        author: {
            email: string;
            username: string;
            name: string | null;
            avatarUrl: string | null;
        };
        replies: ({
            author: {
                email: string;
                username: string;
                name: string | null;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            content: string;
            postId: string;
            authorId: string;
            parentId: string | null;
            updatedAt: Date;
            createdAt: Date;
        })[];
    } & {
        id: string;
        content: string;
        postId: string;
        authorId: string;
        parentId: string | null;
        updatedAt: Date;
        createdAt: Date;
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
            name: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        content: string;
        postId: string;
        authorId: string;
        parentId: string | null;
        updatedAt: Date;
        createdAt: Date;
    }>;
    update(id: string, body: {
        content: string;
    }, authorization?: string): Promise<{
        author: {
            email: string;
            username: string;
            name: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        content: string;
        postId: string;
        authorId: string;
        parentId: string | null;
        updatedAt: Date;
        createdAt: Date;
    }>;
    remove(id: string, authorization?: string): Promise<{
        id: string;
        content: string;
        postId: string;
        authorId: string;
        parentId: string | null;
        updatedAt: Date;
        createdAt: Date;
    }>;
    private extractUser;
}
