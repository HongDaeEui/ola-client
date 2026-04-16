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
exports.ToolsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ToolsService = class ToolsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = { status: 'ACTIVE' };
        if (filters?.category)
            where.category = filters.category;
        if (filters?.pricing)
            where.pricingModel = filters.pricing;
        const orderBy = filters?.sort === 'rating' ? { rating: 'desc' }
            : filters?.sort === 'popular' ? { isFeatured: 'desc' }
                : { createdAt: 'desc' };
        return this.prisma.tool.findMany({ where, orderBy });
    }
    async findFeatured() {
        return this.prisma.tool.findMany({
            where: { isFeatured: true },
            take: 5,
        });
    }
    async findTopByRating(limit = 10) {
        return this.prisma.tool.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { rating: 'desc' },
            take: limit,
            select: { id: true, name: true, shortDesc: true, category: true, rating: true, pricingModel: true, iconUrl: true, isFeatured: true },
        });
    }
    async getCategoryCounts() {
        const counts = await this.prisma.tool.groupBy({
            by: ['category'],
            where: { status: 'ACTIVE' },
            _count: { category: true },
            orderBy: { _count: { category: 'desc' } },
        });
        return counts.map(c => ({ category: c.category, count: c._count.category }));
    }
    async findPending() {
        return this.prisma.tool.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
        });
    }
    async approve(id) {
        return this.prisma.tool.update({ where: { id }, data: { status: 'ACTIVE' } });
    }
    async reject(id) {
        return this.prisma.tool.update({ where: { id }, data: { status: 'REJECTED' } });
    }
    async findOne(id) {
        return this.prisma.tool.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return this.prisma.tool.create({
            data: {
                ...data,
                status: 'PENDING',
                tags: data.tags ?? [],
            },
        });
    }
};
exports.ToolsService = ToolsService;
exports.ToolsService = ToolsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ToolsService);
//# sourceMappingURL=tools.service.js.map