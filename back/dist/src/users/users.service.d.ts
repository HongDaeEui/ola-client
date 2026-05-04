import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
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
    updateRole(id: string, role: any): Promise<{
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
}
