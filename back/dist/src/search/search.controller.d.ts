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
            likes: number;
            title: string;
            toolName: string;
        }[];
        posts: {
            id: string;
            category: string;
            likes: number;
            createdAt: Date;
            title: string;
            views: number;
        }[];
        labs: {
            id: string;
            description: string;
            category: string;
            likes: number;
            title: string;
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
