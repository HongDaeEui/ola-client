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
        title: string;
        description: string;
        date: Date;
        location: string;
        isVirtual: boolean;
        status: string;
        coverUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findUpcoming(): Promise<({
        _count: {
            attendees: number;
        };
    } & {
        id: string;
        title: string;
        description: string;
        date: Date;
        location: string;
        isVirtual: boolean;
        status: string;
        coverUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    rsvpToggle(meetupId: string, userEmail: string, userName: string): Promise<{
        attending: boolean;
        attendeeCount: number;
    }>;
    getStatus(meetupId: string, userEmail: string): Promise<{
        attending: boolean;
    }>;
}
