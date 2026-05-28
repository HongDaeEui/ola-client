import { PrismaService } from '../prisma/prisma.service';
export declare class LabsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(category?: string): Promise<{
        id: string;
        title: string;
        description: string;
        difficulty: string | null;
        emoji: string | null;
        metric: string;
        likes: number;
        category: string;
        stack: string[];
        color: string | null;
        createdAt: Date;
        author: {
            username: string;
            avatarUrl: string | null;
        };
    }[]>;
    findOne(id: string): Promise<{
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        title: string;
        description: string;
        content: string | null;
        difficulty: string | null;
        emoji: string | null;
        thumbnailUrl: string | null;
        metric: string;
        authorId: string;
        likes: number;
        category: string;
        stack: string[];
        color: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        title: string;
        description: string;
        content: string | null;
        difficulty: string | null;
        emoji: string | null;
        thumbnailUrl: string | null;
        metric: string;
        authorId: string;
        likes: number;
        category: string;
        stack: string[];
        color: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    adminCreate(data: {
        title: string;
        description: string;
        content?: string;
        category: string;
        difficulty?: string;
        emoji?: string;
        metric: string;
        stack?: string[];
        color?: string;
        authorId?: string;
    }): Promise<{
        id: string;
        title: string;
        description: string;
        content: string | null;
        difficulty: string | null;
        emoji: string | null;
        thumbnailUrl: string | null;
        metric: string;
        authorId: string;
        likes: number;
        category: string;
        stack: string[];
        color: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
