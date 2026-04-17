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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SearchService = class SearchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(q) {
        const query = q.trim();
        if (!query)
            return { tools: [], prompts: [], posts: [], labs: [] };
        const [tools, prompts, posts, labs] = await Promise.all([
            this.prisma.tool.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { shortDesc: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { category: { contains: query, mode: 'insensitive' } },
                    ],
                    status: 'ACTIVE',
                },
                select: { id: true, name: true, shortDesc: true, category: true, iconUrl: true, pricingModel: true },
                take: 10,
            }),
            this.prisma.prompt.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { content: { contains: query, mode: 'insensitive' } },
                        { toolName: { contains: query, mode: 'insensitive' } },
                        { category: { contains: query, mode: 'insensitive' } },
                    ],
                },
                select: { id: true, title: true, category: true, toolName: true, likes: true },
                take: 10,
            }),
            this.prisma.post.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { content: { contains: query, mode: 'insensitive' } },
                        { category: { contains: query, mode: 'insensitive' } },
                    ],
                },
                select: { id: true, title: true, category: true, likes: true, views: true, createdAt: true },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
            this.prisma.experiment.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { category: { contains: query, mode: 'insensitive' } },
                    ],
                },
                select: { id: true, title: true, description: true, category: true, emoji: true, difficulty: true, likes: true },
                take: 10,
            }),
        ]);
        return { tools, prompts, posts, labs };
    }
    async suggest(q) {
        const query = q.trim();
        if (!query || query.length < 2)
            return { tools: [], prompts: [], posts: [], labs: [] };
        const condition = (fields) => ({
            OR: fields.map((f) => ({ [f]: { contains: query, mode: 'insensitive' } })),
        });
        const [tools, prompts, posts, labs] = await Promise.all([
            this.prisma.tool.findMany({
                where: { ...condition(['name', 'shortDesc', 'category']), status: 'ACTIVE' },
                select: { id: true, name: true, category: true, iconUrl: true },
                take: 4,
            }),
            this.prisma.prompt.findMany({
                where: condition(['title', 'toolName', 'category']),
                select: { id: true, title: true, toolName: true },
                take: 3,
            }),
            this.prisma.post.findMany({
                where: condition(['title', 'category']),
                select: { id: true, title: true, category: true },
                orderBy: { createdAt: 'desc' },
                take: 3,
            }),
            this.prisma.experiment.findMany({
                where: condition(['title', 'description', 'category']),
                select: { id: true, title: true, emoji: true },
                take: 3,
            }),
        ]);
        return { tools, prompts, posts, labs };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map