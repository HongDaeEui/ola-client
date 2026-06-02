"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crawler_service_1 = require("./crawler.service");
const admin_guard_1 = require("../common/admin.guard");
let CrawlerController = class CrawlerController {
    crawlerService;
    constructor(crawlerService) {
        this.crawlerService = crawlerService;
    }
    async run() {
        return this.crawlerService.runAll();
    }
    status() {
        return this.crawlerService.getLastRun();
    }
};
exports.CrawlerController = CrawlerController;
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiSecurity)('x-admin-secret'),
    (0, swagger_1.ApiOperation)({
        summary: '크롤러 수동 실행',
        description: '모든 소스를 순차 실행하고 통계를 반환합니다. X-Admin-Secret 헤더 필요.',
    }),
    (0, common_1.Post)('run'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrawlerController.prototype, "run", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiSecurity)('x-admin-secret'),
    (0, swagger_1.ApiOperation)({
        summary: '크롤러 상태 조회',
        description: '마지막 실행 결과와 현재 실행 여부를 반환합니다.',
    }),
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrawlerController.prototype, "status", null);
exports.CrawlerController = CrawlerController = __decorate([
    (0, swagger_1.ApiTags)('crawler'),
    (0, common_1.Controller)('crawler'),
    __metadata("design:paramtypes", [crawler_service_1.CrawlerService])
], CrawlerController);
//# sourceMappingURL=crawler.controller.js.map