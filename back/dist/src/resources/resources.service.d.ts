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
        createdAt: Date;
        isFeatured: boolean;
        id: string;
        description: string;
        updatedAt: Date;
        title: string;
        type: string;
        difficulty: string;
        contentUrl: string | null;
        authorId: string;
        reads: number;
    })[]>;
    findFeatured(): Promise<({
        author: {
            name: string | null;
            username: string;
        };
    } & {
        createdAt: Date;
        isFeatured: boolean;
        id: string;
        description: string;
        updatedAt: Date;
        title: string;
        type: string;
        difficulty: string;
        contentUrl: string | null;
        authorId: string;
        reads: number;
    })[]>;
    incrementReads(id: string): Promise<{
        createdAt: Date;
        isFeatured: boolean;
        id: string;
        description: string;
        updatedAt: Date;
        title: string;
        type: string;
        difficulty: string;
        contentUrl: string | null;
        authorId: string;
        reads: number;
    }>;
    getTypeCounts(): Promise<{
        type: string;
        count: number;
    }[]>;
}
