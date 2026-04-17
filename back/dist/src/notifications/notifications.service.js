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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    logger = new common_1.Logger(NotificationsService_1.name);
    webhookUrl;
    constructor() {
        this.webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';
        if (!this.webhookUrl) {
            this.logger.warn('DISCORD_WEBHOOK_URL is not configured in environment variables.');
        }
    }
    async sendPostNotification(post) {
        if (!this.webhookUrl)
            return;
        const categoryColors = {
            '실천형 노하우': 1474148,
            '전문 리포트': 8490488,
            '자유게시판': 9739416,
            '작품 공유': 16478597,
        };
        const color = categoryColors[post.category] || 9739416;
        const shortContent = post.content.length > 150
            ? post.content.substring(0, 150) + '...'
            : post.content;
        const payload = {
            username: 'Ola 알리미 봇',
            avatar_url: 'https://olalab.kr/favicon.ico',
            embeds: [
                {
                    author: {
                        name: `${post.author.username} 님의 새로운 글`,
                        icon_url: 'https://olalab.kr/favicon.ico',
                    },
                    title: post.title,
                    url: `https://ola-client-psi.vercel.app/community/${post.id}`,
                    description: shortContent,
                    color: color,
                    fields: [
                        {
                            name: '카테고리',
                            value: post.category,
                            inline: true,
                        },
                    ],
                    footer: {
                        text: 'Ola AI Community',
                        icon_url: 'https://olalab.kr/favicon.ico',
                    },
                    timestamp: new Date().toISOString(),
                },
            ],
        };
        try {
            const res = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                this.logger.error(`Discord Webhook 발송 실패: ${res.statusText}`);
            }
        }
        catch (err) {
            this.logger.error(`Discord Webhook 오류: ${err.message}`);
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map