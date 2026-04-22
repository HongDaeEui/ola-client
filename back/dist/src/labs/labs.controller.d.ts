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
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ExperimentClient<({
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
