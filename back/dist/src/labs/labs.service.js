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
exports.LabsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LabsService = class LabsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(category) {
        const where = {};
        if (category)
            where.category = category;
        return this.prisma.experiment.findMany({
            where,
            select: {
                id: true,
                title: true,
                description: true,
                difficulty: true,
                emoji: true,
                metric: true,
                category: true,
                stack: true,
                color: true,
                likes: true,
                author: {
                    select: {
                        username: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { likes: 'desc' },
        });
    }
    async findOne(id) {
        const lab = await this.prisma.experiment.findUnique({
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
        if (!lab)
            throw new common_1.NotFoundException(`실험실(${id})을 찾을 수 없습니다.`);
        return lab;
    }
};
exports.LabsService = LabsService;
exports.LabsService = LabsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabsService);
//# sourceMappingURL=labs.service.js.map