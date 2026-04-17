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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_gateway_1 = require("./notifications.gateway");
let NotificationsService = class NotificationsService {
    prisma;
    gateway;
    constructor(prisma, gateway) {
        this.prisma = prisma;
        this.gateway = gateway;
    }
    async getByUserEmail(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return [];
        return this.prisma.notification.findMany({
            where: { recipientId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 30,
        });
    }
    async getUnreadCount(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return { count: 0 };
        const count = await this.prisma.notification.count({
            where: { recipientId: user.id, read: false },
        });
        return { count };
    }
    async markRead(id) {
        return this.prisma.notification.update({ where: { id }, data: { read: true } });
    }
    async markAllRead(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return;
        await this.prisma.notification.updateMany({
            where: { recipientId: user.id, read: false },
            data: { read: true },
        });
        return { success: true };
    }
    async create(data) {
        const notification = await this.prisma.notification.create({ data });
        if (this.gateway) {
            const recipient = await this.prisma.user.findUnique({
                where: { id: data.recipientId },
                select: { email: true },
            });
            if (recipient) {
                this.gateway.notifyUser(recipient.email, notification);
            }
        }
        return notification;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_gateway_1.NotificationsGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map