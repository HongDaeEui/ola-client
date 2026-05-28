import { LabsService } from './labs.service';
export declare class LabsController {
    private readonly labsService;
    constructor(labsService: LabsService);
    getExperiments(category?: string): Promise<{
        category: string;
        id: string;
        description: string;
        likes: number;
        createdAt: Date;
        title: string;
        difficulty: string | null;
        emoji: string | null;
        metric: string;
        stack: string[];
        color: string | null;
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
        category: string;
        id: string;
        description: string;
        likes: number;
        createdAt: Date;
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
    }>;
    adminCreate(body: {
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
        category: string;
        id: string;
        description: string;
        likes: number;
        createdAt: Date;
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
    }>;
    remove(id: string): Promise<{
        category: string;
        id: string;
        description: string;
        likes: number;
        createdAt: Date;
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
    }>;
}
