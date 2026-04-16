import { LikesService } from './likes.service';
export declare class LikesController {
    private readonly likesService;
    constructor(likesService: LikesService);
    toggle(body: {
        userId: string;
        targetType: string;
        targetId: string;
    }): Promise<{
        liked: boolean;
    }>;
    getStatus(userId: string, targetType: string, targetId: string): Promise<{
        liked: boolean;
    }>;
}
