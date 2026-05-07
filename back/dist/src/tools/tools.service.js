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
const telegram_service_1 = require("../telegram/telegram.service");
const TOOL_LIST_SELECT = {
    id: true,
    name: true,
    shortDesc: true,
    category: true,
    pricingModel: true,
    rating: true,
    iconUrl: true,
    coverUrl: true,
    isFeatured: true,
    tags: true,
    likes: true,
    status: true,
    launchUrl: true,
    createdAt: true,
};
const LOGO_TOKEN = 'pk_HqFdbQC2T_GqjA12c910QQ';
function toLogoDevUrl(iconUrl) {
    if (!iconUrl)
        return null;
    const m = iconUrl.match(/logo\.clearbit\.com\/([^?#]+)/);
    if (m)
        return `https://img.logo.dev/${m[1]}?token=${LOGO_TOKEN}`;
    return iconUrl;
}
function applyLogoUrl(tool) {
    return { ...tool, iconUrl: toLogoDevUrl(tool.iconUrl ?? null) ?? undefined };
}
let ToolsService = class ToolsService {
    prisma;
    telegramService;
    constructor(prisma, telegramService) {
        this.prisma = prisma;
        this.telegramService = telegramService;
    }
    async findAll(filters) {
        const where = { status: 'ACTIVE' };
        if (filters?.category) {
            where.category = { in: filters.category.split(',').map(s => s.trim()) };
        }
        if (filters?.pricing) {
            where.pricingModel = { in: filters.pricing.split(',').map(s => s.trim()) };
        }
        if (filters?.tags) {
            where.tags = { hasSome: filters.tags.split(',').map(s => s.trim()) };
        }
        const orderBy = filters?.sort === 'rating' ? { rating: 'desc' }
            : filters?.sort === 'popular' ? { isFeatured: 'desc' }
                : { createdAt: 'desc' };
        const tools = await this.prisma.tool.findMany({ where, orderBy, select: TOOL_LIST_SELECT });
        return tools.map(applyLogoUrl);
    }
    async findFeatured() {
        const tools = await this.prisma.tool.findMany({
            where: { isFeatured: true },
            take: 5,
            select: TOOL_LIST_SELECT,
        });
        return tools.map(applyLogoUrl);
    }
    async findTopByRating(limit = 10) {
        const tools = await this.prisma.tool.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { rating: 'desc' },
            take: limit,
            select: TOOL_LIST_SELECT,
        });
        return tools.map(applyLogoUrl);
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
        const tool = await this.prisma.tool.findUnique({
            where: { id },
        });
        if (!tool)
            throw new common_1.NotFoundException(`도구(${id})를 찾을 수 없습니다.`);
        const relatedLabs = await this.prisma.experiment.findMany({
            where: {
                stack: {
                    has: tool.name,
                },
            },
            include: {
                author: {
                    select: { username: true, avatarUrl: true },
                },
            },
            orderBy: { likes: 'desc' },
            take: 4,
        });
        return { ...applyLogoUrl(tool), relatedLabs };
    }
    async findRelated(id) {
        const tool = await this.prisma.tool.findUnique({
            where: { id },
            select: { id: true, category: true },
        });
        if (!tool)
            throw new common_1.NotFoundException(`도구(${id})를 찾을 수 없습니다.`);
        const related = await this.prisma.tool.findMany({
            where: {
                category: tool.category,
                status: 'ACTIVE',
                NOT: { id: tool.id },
            },
            orderBy: { rating: 'desc' },
            take: 4,
            select: TOOL_LIST_SELECT,
        });
        return related.map(applyLogoUrl);
    }
    async create(data) {
        const tool = await this.prisma.tool.create({
            data: {
                ...data,
                status: 'PENDING',
                tags: data.tags ?? [],
            },
        });
        this.telegramService.sendToolSubmitNotification({
            title: tool.name,
            description: tool.shortDesc,
            websiteUrl: tool.launchUrl,
        }).catch(() => { });
        return tool;
    }
};
exports.ToolsService = ToolsService;
exports.ToolsService = ToolsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        telegram_service_1.TelegramService])
], ToolsService);
//# sourceMappingURL=tools.service.js.map