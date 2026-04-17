import { PrismaService } from '../prisma/prisma.service';
export declare class SearchService {
    private prisma;
    constructor(prisma: PrismaService);
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
            title: string;
            likes: number;
            toolName: string;
        }[];
        posts: {
            category: string;
            createdAt: Date;
            id: string;
            title: string;
            likes: number;
            views: number;
        }[];
        labs: {
            category: string;
            id: string;
            description: string;
            title: string;
            difficulty: string | null;
            emoji: string | null;
            likes: number;
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
