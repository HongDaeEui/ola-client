import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(q: string): Promise<{
        tools: {
            category: string;
            pricingModel: string | null;
            id: string;
            name: string;
            shortDesc: string;
            iconUrl: string | null;
        }[];
        prompts: {
            category: string;
            id: string;
            likes: number;
            title: string;
            toolName: string;
        }[];
        posts: {
            category: string;
            createdAt: Date;
            id: string;
            likes: number;
            title: string;
            views: number;
        }[];
        labs: {
            category: string;
            id: string;
            description: string;
            likes: number;
            title: string;
            difficulty: string | null;
            emoji: string | null;
        }[];
    }>;
    suggest(q: string): Promise<{
        tools: {
            category: string;
            id: string;
            name: string;
            iconUrl: string | null;
        }[];
        prompts: {
            id: string;
            title: string;
            toolName: string;
        }[];
        posts: {
            category: string;
            id: string;
            title: string;
        }[];
        labs: {
            id: string;
            title: string;
            emoji: string | null;
        }[];
    }>;
}
