import { LabsService } from './labs.service';
export declare class LabsController {
    private readonly labsService;
    constructor(labsService: LabsService);
    getExperiments(category?: string): Promise<{
        category: string;
        id: string;
        description: string;
        likes: number;
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
    }>;
}
