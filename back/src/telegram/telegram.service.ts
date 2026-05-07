import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly chatId: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
    
    if (!this.botToken || !this.chatId) {
      this.logger.warn(
        'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing. Telegram webhooks will not be sent.',
      );
    }
  }

  private async sendMessage(text: string): Promise<void> {
    if (!this.botToken || !this.chatId) return;

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
    } catch (error) {
      this.logger.error(`Error sending Telegram message: ${error.message}`);
    }
  }

  async sendToolSubmitNotification(data: any): Promise<void> {
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

    // 비동기적으로 실행하여 메인 로직 블로킹 방지
    this.sendMessage(message).catch(() => {});
  }

  async sendPromptSubmitNotification(data: any): Promise<void> {
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

    this.sendMessage(message).catch(() => {});
  }
}
