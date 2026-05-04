import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetupDto } from './dto/create-meetup.dto';
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
        referenceLabId: string | null;
        maxParticipants: number | null;
        hostEmail: string | null;
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
        referenceLabId: string | null;
        maxParticipants: number | null;
        hostEmail: string | null;
    })[]>;
    createMeetup(dto: CreateMeetupDto, hostEmail: string): Promise<{
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
        referenceLabId: string | null;
        maxParticipants: number | null;
        hostEmail: string | null;
    }>;
    findById(id: string): Promise<({
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
        referenceLabId: string | null;
        maxParticipants: number | null;
        hostEmail: string | null;
    }) | null>;
    rsvpToggle(meetupId: string, userEmail: string, userName: string): Promise<{
        attending: boolean;
        attendeeCount: number;
    }>;
    getStatus(meetupId: string, userEmail: string): Promise<{
        attending: boolean;
    }>;
}
