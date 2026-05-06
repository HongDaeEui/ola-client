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
            createdAt: Date;
            id: string;
            name: string | null;
            updatedAt: Date;
            email: string;
            username: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        })[];
    }>;
    updateRole(id: string, role: string): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            id: string;
            name: string | null;
            updatedAt: Date;
            email: string;
            username: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    getMe(authorization?: string): Promise<{
        createdAt: Date;
        id: string;
        name: string | null;
        updatedAt: Date;
        email: string;
        username: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    updateUsername(authorization?: string, username?: string): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            id: string;
            name: string | null;
            updatedAt: Date;
            email: string;
            username: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    private extractUser;
}
