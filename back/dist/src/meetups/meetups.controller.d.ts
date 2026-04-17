import { MeetupsService } from './meetups.service';
export declare class MeetupsController {
    private readonly meetupsService;
    constructor(meetupsService: MeetupsService);
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
    rsvp(id: string, body: {
        userEmail: string;
        userName: string;
    }): Promise<{
        attending: boolean;
        attendeeCount: number;
    }>;
    getStatus(id: string, userEmail: string): Promise<{
        attending: boolean;
    }>;
}
