import { LabsService } from './labs.service';
export declare class LabsController {
    private readonly labsService;
    constructor(labsService: LabsService);
    getExperiments(): Promise<({
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        description: string;
        category: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        difficulty: string | null;
        authorId: string;
        content: string | null;
        emoji: string | null;
        thumbnailUrl: string | null;
        metric: string;
        likes: number;
        stack: string[];
        color: string | null;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ExperimentClient<({
        author: {
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        description: string;
        category: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        difficulty: string | null;
        authorId: string;
        content: string | null;
        emoji: string | null;
        thumbnailUrl: string | null;
        metric: string;
        likes: number;
        stack: string[];
        color: string | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
