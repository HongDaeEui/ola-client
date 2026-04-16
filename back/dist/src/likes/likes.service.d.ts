import { PrismaService } from '../prisma/prisma.service';
export declare class LikesService {
    private prisma;
    constructor(prisma: PrismaService);
    toggle(userId: string, targetType: string, targetId: string): Promise<{
        liked: boolean;
    }>;
    getStatus(userId: string, targetType: string, targetId: string): Promise<{
        liked: boolean;
    }>;
    private incrementLikes;
    private decrementLikes;
}
