import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(q: string): Promise<{
        tools: {
            id: string;
            name: string;
            shortDesc: string;
            category: string;
            pricingModel: string | null;
            iconUrl: string | null;
        }[];
        prompts: {
            id: string;
            category: string;
            title: string;
            toolName: string;
            likes: number;
        }[];
        posts: {
            id: string;
            category: string;
            createdAt: Date;
            title: string;
            likes: number;
            views: number;
        }[];
        labs: {
            id: string;
            description: string;
            category: string;
            title: string;
            likes: number;
            difficulty: string | null;
            emoji: string | null;
        }[];
    }>;
    suggest(q: string): Promise<{
        tools: {
            id: string;
            name: string;
            category: string;
            iconUrl: string | null;
        }[];
        prompts: {
            id: string;
            title: string;
            toolName: string;
        }[];
        posts: {
            id: string;
            category: string;
            title: string;
        }[];
        labs: {
            id: string;
            title: string;
            emoji: string | null;
        }[];
    }>;
}
