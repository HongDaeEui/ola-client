import { BookmarksService } from './bookmarks.service';
export declare class BookmarksController {
    private readonly bookmarksService;
    constructor(bookmarksService: BookmarksService);
    toggle(body: {
        targetType: string;
        targetId: string;
    }, authorization?: string): Promise<{
        bookmarked: boolean;
    }>;
    getStatus(targetType: string, targetId: string, authorization?: string): Promise<{
        bookmarked: boolean;
    }>;
    getUserBookmarks(authorization?: string): Promise<({
        item: Record<string, unknown>;
        createdAt: Date;
        id: string;
        userId: string;
        targetType: string;
        targetId: string;
    } | null)[]>;
    private extractUser;
}
