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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let CommentsService = class CommentsService {
    prisma;
    notifications;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    findByPost(postId) {
        return this.prisma.comment.findMany({
            where: { postId },
            include: {
                author: { select: { username: true, avatarUrl: true, email: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
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
        const comment = await this.prisma.comment.create({
            data: { content: data.content, postId: data.postId, authorId: author.id },
            include: {
                author: { select: { username: true, avatarUrl: true, email: true } },
            },
        });
        const post = await this.prisma.post.findUnique({
            where: { id: data.postId },
            select: { authorId: true, title: true },
        });
        if (post && post.authorId !== author.id) {
            await this.notifications.create({
                recipientId: post.authorId,
                type: 'COMMENT',
                message: `${data.userName}님이 회원님의 게시글에 댓글을 남겼어요`,
                targetType: 'POST',
                targetId: data.postId,
                targetTitle: post.title,
            }).catch(() => { });
        }
        return comment;
    }
    async remove(id, userEmail) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
            include: { author: { select: { email: true } } },
        });
        if (!comment || comment.author.email !== userEmail)
            return null;
        return this.prisma.comment.delete({ where: { id } });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map