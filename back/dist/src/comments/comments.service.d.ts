import { PrismaService } from '../prisma/prisma.service';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findByPost(postId: string): any;
    create(data: {
        content: string;
        postId: string;
        userEmail: string;
        userName: string;
    }): Promise<any>;
    remove(id: string, userEmail: string): Promise<any>;
}
