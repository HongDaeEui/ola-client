import { PrismaService } from '../prisma/prisma.service';
export declare class SearchService {
    private prisma;
    constructor(prisma: PrismaService);
    search(q: string): Promise<{
        tools: {
            id: string;
            category: string;
            name: string;
            pricingModel: string | null;
            shortDesc: string;
            iconUrl: string | null;
        }[];
        prompts: {
            id: string;
            title: string;
            likes: number;
            category: string;
            toolName: string;
        }[];
        posts: {
            id: string;
            title: string;
            likes: number;
            category: string;
            createdAt: Date;
            views: number;
        }[];
        labs: {
            id: string;
            title: string;
            description: string;
            difficulty: string | null;
            emoji: string | null;
            likes: number;
            category: string;
        }[];
    }>;
    suggest(q: string): Promise<{
        tools: {
            id: string;
            category: string;
            name: string;
            iconUrl: string | null;
        }[];
        prompts: {
            id: string;
            title: string;
            toolName: string;
        }[];
        posts: {
            id: string;
            title: string;
            category: string;
        }[];
        labs: {
            id: string;
            title: string;
            emoji: string | null;
        }[];
    }>;
}
