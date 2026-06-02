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
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            username: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        })[];
    }>;
    updateRole(id: string, role: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            username: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    getMe(authorization?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        username: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    updateUsername(authorization?: string, username?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            username: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    private extractUser;
}
