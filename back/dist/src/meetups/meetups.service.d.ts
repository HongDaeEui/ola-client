import { PrismaService } from '../prisma/prisma.service';
export declare class MeetupsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            attendees: number;
        };
    } & {
        id: string;
        description: string;
        coverUrl: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        date: Date;
        location: string;
        isVirtual: boolean;
    })[]>;
    findUpcoming(): Promise<({
        _count: {
            attendees: number;
        };
    } & {
        id: string;
        description: string;
        coverUrl: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        date: Date;
        location: string;
        isVirtual: boolean;
    })[]>;
}
