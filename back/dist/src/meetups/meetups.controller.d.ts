import { MeetupsService } from './meetups.service';
import { CreateMeetupDto } from './dto/create-meetup.dto';
export declare class MeetupsController {
    private readonly meetupsService;
    private readonly logger;
    constructor(meetupsService: MeetupsService);
    create(dto: CreateMeetupDto, authorization?: string): Promise<{
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
    findOne(id: string): Promise<({
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
    rsvp(id: string, body: {
        userName: string;
    }, authorization?: string): Promise<{
        attending: boolean;
        attendeeCount: number;
    }>;
    getStatus(id: string, authorization?: string): Promise<{
        attending: boolean;
    }>;
    private requireEmailFromAuthHeader;
}
