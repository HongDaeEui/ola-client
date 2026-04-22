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
        createdAt: Date;
        isFeatured: boolean;
        id: string;
        description: string;
        updatedAt: Date;
        title: string;
        difficulty: string;
        authorId: string;
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
        createdAt: Date;
        isFeatured: boolean;
        id: string;
        description: string;
        updatedAt: Date;
        title: string;
        difficulty: string;
        authorId: string;
        type: string;
        contentUrl: string | null;
        reads: number;
    })[]>;
    getTypeCounts(): Promise<{
        type: string;
        count: number;
    }[]>;
    incrementReads(id: string): Promise<{
        createdAt: Date;
        isFeatured: boolean;
        id: string;
        description: string;
        updatedAt: Date;
        title: string;
        difficulty: string;
        authorId: string;
        type: string;
        contentUrl: string | null;
        reads: number;
    }>;
}
