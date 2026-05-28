import { PrismaService } from '../prisma/prisma.service';
export declare class ResourcesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(type?: string, difficulty?: string): Promise<({
        author: {
            name: string | null;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        title: string;
        description: string;
        difficulty: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
        isFeatured: boolean;
        type: string;
        contentUrl: string | null;
        reads: number;
    })[]>;
    findFeatured(): Promise<({
        author: {
            name: string | null;
            username: string;
        };
    } & {
        id: string;
        title: string;
        description: string;
        difficulty: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
        isFeatured: boolean;
        type: string;
        contentUrl: string | null;
        reads: number;
    })[]>;
    incrementReads(id: string): Promise<{
        id: string;
        title: string;
        description: string;
        difficulty: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
        isFeatured: boolean;
        type: string;
        contentUrl: string | null;
        reads: number;
    }>;
    getTypeCounts(): Promise<{
        type: string;
        count: number;
    }[]>;
}
