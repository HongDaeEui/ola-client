import { MeetupsService } from './meetups.service';
export declare class MeetupsController {
    private readonly meetupsService;
    private readonly logger;
    constructor(meetupsService: MeetupsService);
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
