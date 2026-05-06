import { LikesService } from './likes.service';
export declare class LikesController {
    private readonly likesService;
    constructor(likesService: LikesService);
    toggle(body: {
        targetType: string;
        targetId: string;
    }, authorization?: string): Promise<{
        liked: boolean;
    }>;
    getStatus(targetType: string, targetId: string, authorization?: string): Promise<{
        liked: boolean;
    }>;
    private extractUser;
}
