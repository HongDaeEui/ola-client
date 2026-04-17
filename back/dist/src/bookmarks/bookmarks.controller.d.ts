import { BookmarksService } from './bookmarks.service';
export declare class BookmarksController {
    private readonly bookmarksService;
    constructor(bookmarksService: BookmarksService);
    toggle(body: {
        userId: string;
        targetType: string;
        targetId: string;
    }): Promise<{
        bookmarked: boolean;
    }>;
    getStatus(userId: string, targetType: string, targetId: string): Promise<{
        bookmarked: boolean;
    }>;
    getUserBookmarks(userId: string): Promise<({
        item: Record<string, unknown>;
        createdAt: Date;
        id: string;
        userId: string;
        targetType: string;
        targetId: string;
    } | null)[]>;
}
