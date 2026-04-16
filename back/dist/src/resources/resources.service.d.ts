import { PrismaService } from '../prisma/prisma.service';
export declare class ResourcesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        author: {
            name: string | null;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        description: string;
        isFeatured: boolean;
        createdAt: Date;
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
        id: string;
        description: string;
        isFeatured: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: string;
        difficulty: string;
        contentUrl: string | null;
        authorId: string;
        reads: number;
    })[]>;
}
