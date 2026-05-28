import { PrismaService } from '../prisma/prisma.service';
export declare class BookmarksService {
    private prisma;
    constructor(prisma: PrismaService);
    toggle(userId: string, targetType: string, targetId: string): Promise<{
        bookmarked: boolean;
    }>;
    getStatus(userId: string, targetType: string, targetId: string): Promise<{
        bookmarked: boolean;
    }>;
    getUserBookmarks(userId: string): Promise<({
        item: Record<string, unknown>;
        id: string;
        createdAt: Date;
        userId: string;
        targetType: string;
        targetId: string;
    } | null)[]>;
}
