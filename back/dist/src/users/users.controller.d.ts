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
            email: string;
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            username: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        })[];
    }>;
    updateRole(id: string, role: string): Promise<{
        success: boolean;
        data: {
            email: string;
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            username: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    getMe(authorization?: string): Promise<{
        email: string;
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    updateUsername(authorization?: string, username?: string): Promise<{
        success: boolean;
        data: {
            email: string;
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            username: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    private extractUser;
}
