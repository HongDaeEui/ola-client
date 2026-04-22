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
exports.PromptsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PromptsService = class PromptsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters, skip = 0, take) {
        const where = {};
        if (filters?.category)
            where.category = filters.category;
        if (filters?.userEmail)
            where.author = { email: filters.userEmail };
        return this.prisma.prompt.findMany({
            where,
            include: {
                author: {
                    select: {
                        username: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { views: 'desc' },
            skip,
            ...(take !== undefined ? { take } : {}),
        });
    }
    incrementViews(id) {
        return this.prisma.prompt.update({
            where: { id },
            data: { views: { increment: 1 } },
        });
    }
    async findOne(id) {
        const prompt = await this.prisma.prompt.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        username: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        if (!prompt)
            throw new common_1.NotFoundException(`프롬프트(${id})를 찾을 수 없습니다.`);
        return prompt;
    }
    async create(data) {
        const base = data.userName.replace(/\s+/g, '_').toLowerCase();
        const suffix = Math.random().toString(36).slice(2, 6);
        const author = await this.prisma.user.upsert({
            where: { email: data.userEmail },
            update: {},
            create: {
                email: data.userEmail,
                username: `${base}_${suffix}`,
                name: data.userName,
            },
        });
        return this.prisma.prompt.create({
            data: {
                title: data.title,
                toolName: data.toolName,
                category: data.category,
                content: data.content,
                authorId: author.id,
            },
        });
    }
};
exports.PromptsService = PromptsService;
exports.PromptsService = PromptsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromptsService);
//# sourceMappingURL=prompts.service.js.map