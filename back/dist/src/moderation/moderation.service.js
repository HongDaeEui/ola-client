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
var ModerationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ModerationService = ModerationService_1 = class ModerationService {
    prisma;
    logger = new common_1.Logger(ModerationService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async moderateContent(text) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (apiKey) {
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are an AI moderator for an AI community platform. Respond ONLY with a JSON object containing "isFlagged" (boolean) and "reason" (string or null). Flag the content if it contains spam, adult content, gambling, severe profanity, or illegal advertisements.',
                            },
                            { role: 'user', content: text },
                        ],
                        response_format: { type: 'json_object' },
                        temperature: 0,
                    }),
                });
                if (!response.ok) {
                    throw new Error(`OpenAI API error: ${response.statusText}`);
                }
                const data = await response.json();
                const result = JSON.parse(data.choices[0].message.content);
                return {
                    isFlagged: result.isFlagged ?? false,
                    reason: result.isFlagged ? (result.reason ?? 'AI 정책 위반으로 감지됨') : null,
                };
            }
            catch (error) {
                this.logger.error(`AI moderation failed: ${error.message}`);
            }
        }
        this.logger.log('Using Mock Moderation (No API Key or Request Failed)');
        const badWords = ['도박', '카지노', '불법', '성인', '바카라', '토토'];
        for (const word of badWords) {
            if (text.includes(word)) {
                return { isFlagged: true, reason: `금지어 포함: ${word} (시스템 감지)` };
            }
        }
        return { isFlagged: false, reason: null };
    }
    async moderatePost(postId, content) {
        const { isFlagged, reason } = await this.moderateContent(content);
        if (isFlagged) {
            await this.prisma.post.update({
                where: { id: postId },
                data: { isFlagged, flagReason: reason },
            });
            this.logger.warn(`Post ${postId} flagged: ${reason}`);
        }
    }
    async moderatePrompt(promptId, content) {
        const { isFlagged, reason } = await this.moderateContent(content);
        if (isFlagged) {
            await this.prisma.prompt.update({
                where: { id: promptId },
                data: { isFlagged, flagReason: reason },
            });
            this.logger.warn(`Prompt ${promptId} flagged: ${reason}`);
        }
    }
};
exports.ModerationService = ModerationService;
exports.ModerationService = ModerationService = ModerationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ModerationService);
//# sourceMappingURL=moderation.service.js.map