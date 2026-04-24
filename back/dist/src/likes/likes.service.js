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
const notifications_service_1 = require("../notifications/notifications.service");
let LikesService = class LikesService {
    prisma;
    notifications;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async toggle(userId, targetType, targetId) {
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.like.findUnique({
                where: { userId_targetType_targetId: { userId, targetType, targetId } },
            });
            if (existing) {
                await tx.like.delete({ where: { id: existing.id } });
                await this.decrementLikesInTx(tx, targetType, targetId);
                return { liked: false };
            }
            else {
                await tx.like.create({ data: { userId, targetType, targetId } });
                await this.incrementLikesInTx(tx, targetType, targetId);
                this.createLikeNotification(targetType, targetId).catch(() => { });
                return { liked: true };
            }
        });
    }
    async getStatus(userId, targetType, targetId) {
        const existing = await this.prisma.like.findUnique({
            where: { userId_targetType_targetId: { userId, targetType, targetId } },
        });
        return { liked: !!existing };
    }
    async createLikeNotification(targetType, targetId) {
        let authorId = null;
        let title = null;
        if (targetType === 'POST') {
            const post = await this.prisma.post.findUnique({ where: { id: targetId }, select: { authorId: true, title: true } });
            authorId = post?.authorId ?? null;
            title = post?.title ?? null;
        }
        else if (targetType === 'PROMPT') {
            const prompt = await this.prisma.prompt.findUnique({ where: { id: targetId }, select: { authorId: true, title: true } });
            authorId = prompt?.authorId ?? null;
            title = prompt?.title ?? null;
        }
        if (!authorId)
            return;
        const label = targetType === 'POST' ? '게시글' : '프롬프트';
        await this.notifications.create({
            recipientId: authorId,
            type: 'LIKE',
            message: `누군가 회원님의 ${label}에 좋아요를 눌렀어요`,
            targetType,
            targetId,
            targetTitle: title ?? undefined,
        });
    }
    async incrementLikesInTx(tx, targetType, targetId) {
        if (targetType === 'POST') {
            await tx.post.update({ where: { id: targetId }, data: { likes: { increment: 1 } } });
        }
        else if (targetType === 'PROMPT') {
            await tx.prompt.update({ where: { id: targetId }, data: { likes: { increment: 1 } } });
        }
        else if (targetType === 'LAB') {
            await tx.experiment.update({ where: { id: targetId }, data: { likes: { increment: 1 } } });
        }
        else if (targetType === 'TOOL') {
            await tx.tool.update({ where: { id: targetId }, data: { likes: { increment: 1 } } });
        }
    }
    async decrementLikesInTx(tx, targetType, targetId) {
        if (targetType === 'POST') {
            await tx.post.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } });
        }
        else if (targetType === 'PROMPT') {
            await tx.prompt.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } });
        }
        else if (targetType === 'LAB') {
            await tx.experiment.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } });
        }
        else if (targetType === 'TOOL') {
            await tx.tool.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } });
        }
    }
};
exports.LikesService = LikesService;
exports.LikesService = LikesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], LikesService);
//# sourceMappingURL=likes.service.js.map