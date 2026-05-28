import { CommentsService } from './comments.service';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    findByPost(postId: string): import("@prisma/client").Prisma.PrismaPromise<({
        author: {
            name: string | null;
            email: string;
            username: string;
            avatarUrl: string | null;
        };
        replies: ({
            author: {
                name: string | null;
                email: string;
                username: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            content: string;
            authorId: string;
            createdAt: Date;
            updatedAt: Date;
            postId: string;
            parentId: string | null;
        })[];
    } & {
        id: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
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
            name: string | null;
            email: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        parentId: string | null;
    }>;
    update(id: string, body: {
        content: string;
    }, authorization?: string): Promise<{
        author: {
            name: string | null;
            email: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        parentId: string | null;
    }>;
    remove(id: string, authorization?: string): Promise<{
        id: string;
        content: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        parentId: string | null;
    }>;
    private extractUser;
}
