import { CrawlerService } from './crawler.service';
export declare class CrawlerController {
    private readonly crawlerService;
    constructor(crawlerService: CrawlerService);
    run(): Promise<import("./crawler.service").CrawlRunResult>;
    status(): {
        running: boolean;
        lastRun: import("./crawler.service").CrawlRunResult | null;
    };
}
