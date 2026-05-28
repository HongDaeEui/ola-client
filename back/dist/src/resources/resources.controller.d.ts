import { ResourcesService } from './resources.service';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
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
    getTypeCounts(): Promise<{
        type: string;
        count: number;
    }[]>;
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
}
