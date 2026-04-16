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
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LikesService = class LikesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async toggle(userId, targetType, targetId) {
        const existing = await this.prisma.like.findUnique({
            where: { userId_targetType_targetId: { userId, targetType, targetId } },
        });
        if (existing) {
            await this.prisma.like.delete({ where: { id: existing.id } });
            await this.decrementLikes(targetType, targetId);
            return { liked: false };
        }
        else {
            await this.prisma.like.create({ data: { userId, targetType, targetId } });
            await this.incrementLikes(targetType, targetId);
            return { liked: true };
        }
    }
    async getStatus(userId, targetType, targetId) {
        const existing = await this.prisma.like.findUnique({
            where: { userId_targetType_targetId: { userId, targetType, targetId } },
        });
        return { liked: !!existing };
    }
    async incrementLikes(targetType, targetId) {
        if (targetType === 'POST') {
            await this.prisma.post.update({ where: { id: targetId }, data: { likes: { increment: 1 } } });
        }
        else if (targetType === 'PROMPT') {
            await this.prisma.prompt.update({ where: { id: targetId }, data: { likes: { increment: 1 } } });
        }
        else if (targetType === 'LAB') {
            await this.prisma.experiment.update({ where: { id: targetId }, data: { likes: { increment: 1 } } });
        }
    }
    async decrementLikes(targetType, targetId) {
        if (targetType === 'POST') {
            await this.prisma.post.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } });
        }
        else if (targetType === 'PROMPT') {
            await this.prisma.prompt.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } });
        }
        else if (targetType === 'LAB') {
            await this.prisma.experiment.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } });
        }
    }
};
exports.LikesService = LikesService;
exports.LikesService = LikesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LikesService);
//# sourceMappingURL=likes.service.js.map