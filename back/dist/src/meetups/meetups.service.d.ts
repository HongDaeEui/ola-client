import { PrismaService } from '../prisma/prisma.service';
export declare class MeetupsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            attendees: number;
        };
    } & {
        status: string;
        createdAt: Date;
        id: string;
        description: string;
        coverUrl: string | null;
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
        status: string;
        createdAt: Date;
        id: string;
        description: string;
        coverUrl: string | null;
        updatedAt: Date;
        title: string;
        date: Date;
        location: string;
        isVirtual: boolean;
    })[]>;
    rsvpToggle(meetupId: string, userEmail: string, userName: string): Promise<{
        attending: boolean;
        attendeeCount: number;
    }>;
    getStatus(meetupId: string, userEmail: string): Promise<{
        attending: boolean;
    }>;
}
