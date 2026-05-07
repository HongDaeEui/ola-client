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
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
let TelegramService = TelegramService_1 = class TelegramService {
    logger = new common_1.Logger(TelegramService_1.name);
    botToken;
    chatId;
    constructor() {
        this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
        this.chatId = process.env.TELEGRAM_CHAT_ID || '';
        if (!this.botToken || !this.chatId) {
            this.logger.warn('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing. Telegram webhooks will not be sent.');
        }
    }
    async sendMessage(text) {
        if (!this.botToken || !this.chatId)
            return;
        const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                }),
            });
            if (!response.ok) {
                const errorData = await response.text();
                this.logger.error(`Failed to send Telegram message: ${errorData}`);
            }
        }
        catch (error) {
            this.logger.error(`Error sending Telegram message: ${error.message}`);
        }
    }
    async sendToolSubmitNotification(data) {
        const title = data.title || '제목 없음';
        const description = data.description || '설명 없음';
        const link = data.websiteUrl || '링크 없음';
        const message = `
🤖 <b>[새로운 도구 제출 알림]</b>
━━━━━━━━━━━━━━━━━
📌 <b>이름:</b> ${title}
🔗 <b>링크:</b> ${link}

📝 <b>설명:</b>
${description}
━━━━━━━━━━━━━━━━━
<i>어드민 대시보드에서 승인 여부를 결정해주세요.</i>`;
        this.sendMessage(message).catch(() => { });
    }
    async sendPromptSubmitNotification(data) {
        const title = data.title || '제목 없음';
        const content = data.content || '내용 없음';
        const model = data.model || '모델 미지정';
        const message = `
✨ <b>[새로운 프롬프트 제출 알림]</b>
━━━━━━━━━━━━━━━━━
📌 <b>제목:</b> ${title}
🤖 <b>AI 모델:</b> ${model}

📝 <b>프롬프트 내용:</b>
<pre>${content.slice(0, 300)}${content.length > 300 ? '...' : ''}</pre>
━━━━━━━━━━━━━━━━━
<i>어드민 대시보드에서 승인 여부를 결정해주세요.</i>`;
        this.sendMessage(message).catch(() => { });
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map