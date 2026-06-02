import { PrismaService } from '../prisma/prisma.service';
export interface CrawlSourceResult {
    source: 'TAAFT' | 'ProductHunt';
    scanned: number;
    inserted: number;
    skipped: number;
    errors: number;
    skippedReason?: string;
}
export interface CrawlRunResult {
    startedAt: string;
    finishedAt: string;
    durationMs: number;
    results: CrawlSourceResult[];
}
export declare class CrawlerService {
    private readonly prisma;
    private readonly logger;
    private lastRun;
    private running;
    constructor(prisma: PrismaService);
    getLastRun(): {
        running: boolean;
        lastRun: CrawlRunResult | null;
    };
    scheduledProductHunt(): Promise<void>;
    scheduledTAAFT(): Promise<void>;
    runAll(): Promise<CrawlRunResult>;
    private safeRun;
    crawlTAAFT(): Promise<CrawlSourceResult>;
    crawlProductHunt(): Promise<CrawlSourceResult>;
    private upsertPendingTool;
}
