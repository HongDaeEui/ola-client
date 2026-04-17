import { PrismaService } from '../prisma/prisma.service';
export declare class ResourcesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(type?: string, difficulty?: string): Promise<({
        author: {
            username: string;
            name: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        title: string;
        description: string;
        type: string;
        difficulty: string;
        contentUrl: string | null;
        authorId: string;
        reads: number;
        isFeatured: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findFeatured(): Promise<({
        author: {
            username: string;
            name: string | null;
        };
    } & {
        id: string;
        title: string;
        description: string;
        type: string;
        difficulty: string;
        contentUrl: string | null;
        authorId: string;
        reads: number;
        isFeatured: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    incrementReads(id: string): Promise<{
        id: string;
        title: string;
        description: string;
        type: string;
        difficulty: string;
        contentUrl: string | null;
        authorId: string;
        reads: number;
        isFeatured: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getTypeCounts(): Promise<{
        type: string;
        count: number;
    }[]>;
}
