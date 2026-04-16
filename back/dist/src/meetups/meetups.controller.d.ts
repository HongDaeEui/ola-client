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
