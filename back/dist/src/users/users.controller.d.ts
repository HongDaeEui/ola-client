import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        success: boolean;
        data: ({
            _count: {
                experiments: number;
                prompts: number;
                posts: number;
            };
        } & {
            id: string;
            email: string;
            username: string;
            name: string | null;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    updateRole(id: string, role: string): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            username: string;
            name: string | null;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
