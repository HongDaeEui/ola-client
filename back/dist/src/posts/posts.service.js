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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let PostsService = class PostsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    findAll(category, skip = 0, take) {
        return this.prisma.post.findMany({
            where: category ? { category } : undefined,
            include: {
                author: {
                    select: {
                        username: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            ...(take !== undefined ? { take } : {}),
        });
    }
    async findOne(id) {
        const post = await this.prisma.post.findUnique({
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
        if (!post)
            throw new common_1.NotFoundException(`게시글(${id})을 찾을 수 없습니다.`);
        return post;
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
        const newPost = await this.prisma.post.create({
            data: {
                title: data.title,
                content: data.content,
                category: data.category,
                ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
                authorId: author.id,
            },
            include: {
                author: {
                    select: { username: true, avatarUrl: true },
                },
            },
        });
        return newPost;
    }
    findTopByViews(limit = 10) {
        return this.prisma.post.findMany({
            orderBy: [{ views: 'desc' }, { likes: 'desc' }],
            take: limit,
            select: {
                id: true,
                title: true,
                category: true,
                likes: true,
                views: true,
                createdAt: true,
                author: { select: { username: true, avatarUrl: true } },
            },
        });
    }
    incrementViews(id) {
        return this.prisma.post.update({
            where: { id },
            data: { views: { increment: 1 } },
        });
    }
    async getTagStats() {
        const groups = await this.prisma.post.groupBy({
            by: ['category'],
            _count: { id: true },
            _sum: { likes: true, views: true },
            orderBy: { _sum: { likes: 'desc' } },
        });
        return groups.map(g => ({
            category: g.category,
            postCount: g._count.id,
            totalLikes: g._sum.likes ?? 0,
            totalViews: g._sum.views ?? 0,
        }));
    }
    findByUserEmail(userEmail) {
        return this.prisma.post.findMany({
            where: { author: { email: userEmail } },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                category: true,
                likes: true,
                views: true,
                createdAt: true,
            },
        });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], PostsService);
//# sourceMappingURL=posts.service.js.map