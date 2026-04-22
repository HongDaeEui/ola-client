import { PrismaService } from '../prisma/prisma.service';
export declare class LabsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        category: string;
        createdAt: Date;
        id: string;
        description: string;
        likes: number;
        updatedAt: Date;
        title: string;
        content: string | null;
        difficulty: string | null;
        emoji: string | null;
        thumbnailUrl: string | null;
        metric: string;
        authorId: string;
        stack: string[];
        color: string | null;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ExperimentClient<({
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        category: string;
        createdAt: Date;
        id: string;
        description: string;
        likes: number;
        updatedAt: Date;
        title: string;
        content: string | null;
        difficulty: string | null;
        emoji: string | null;
        thumbnailUrl: string | null;
        metric: string;
        authorId: string;
        stack: string[];
        color: string | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
