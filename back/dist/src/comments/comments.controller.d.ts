import { CommentsService } from './comments.service';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    findByPost(postId: string): any;
    create(body: {
        content: string;
        postId: string;
        userEmail: string;
        userName: string;
    }): Promise<any>;
    remove(id: string, userEmail: string): Promise<any>;
}
