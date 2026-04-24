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
exports.BookmarksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookmarksService = class BookmarksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async toggle(userId, targetType, targetId) {
        const existing = await this.prisma.bookmark.findUnique({
            where: { userId_targetType_targetId: { userId, targetType, targetId } },
        });
        if (existing) {
            await this.prisma.bookmark.delete({ where: { id: existing.id } });
            return { bookmarked: false };
        }
        else {
            await this.prisma.bookmark.create({ data: { userId, targetType, targetId } });
            return { bookmarked: true };
        }
    }
    async getStatus(userId, targetType, targetId) {
        const existing = await this.prisma.bookmark.findUnique({
            where: { userId_targetType_targetId: { userId, targetType, targetId } },
        });
        return { bookmarked: !!existing };
    }
    async getUserBookmarks(userId) {
        const bookmarks = await this.prisma.bookmark.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        if (bookmarks.length === 0)
            return [];
        const idsByType = {};
        for (const b of bookmarks) {
            (idsByType[b.targetType] ??= []).push(b.targetId);
        }
        const itemMap = new Map();
        if (idsByType['POST']?.length) {
            const posts = await this.prisma.post.findMany({
                where: { id: { in: idsByType['POST'] } },
                select: { id: true, title: true, category: true, createdAt: true },
            });
            posts.forEach((p) => itemMap.set(`POST:${p.id}`, p));
        }
        if (idsByType['PROMPT']?.length) {
            const prompts = await this.prisma.prompt.findMany({
                where: { id: { in: idsByType['PROMPT'] } },
                select: { id: true, title: true, category: true, toolName: true },
            });
            prompts.forEach((p) => itemMap.set(`PROMPT:${p.id}`, p));
        }
        if (idsByType['TOOL']?.length) {
            const tools = await this.prisma.tool.findMany({
                where: { id: { in: idsByType['TOOL'] } },
                select: { id: true, name: true, category: true, shortDesc: true },
            });
            tools.forEach((t) => itemMap.set(`TOOL:${t.id}`, t));
        }
        if (idsByType['LAB']?.length) {
            const labs = await this.prisma.experiment.findMany({
                where: { id: { in: idsByType['LAB'] } },
                select: { id: true, title: true, category: true },
            });
            labs.forEach((l) => itemMap.set(`LAB:${l.id}`, l));
        }
        return bookmarks
            .map((b) => {
            const item = itemMap.get(`${b.targetType}:${b.targetId}`);
            return item ? { ...b, item } : null;
        })
            .filter(Boolean);
    }
};
exports.BookmarksService = BookmarksService;
exports.BookmarksService = BookmarksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookmarksService);
//# sourceMappingURL=bookmarks.service.js.map