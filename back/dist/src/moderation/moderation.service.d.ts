import { PrismaService } from '../prisma/prisma.service';
export declare class ModerationService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    moderateContent(text: string): Promise<{
        isFlagged: boolean;
        reason: string | null;
    }>;
    moderatePost(postId: string, content: string): Promise<void>;
    moderatePrompt(promptId: string, content: string): Promise<void>;
}
