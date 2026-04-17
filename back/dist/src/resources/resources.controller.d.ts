import { ResourcesService } from './resources.service';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
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
    getTypeCounts(): Promise<{
        type: string;
        count: number;
    }[]>;
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
}
