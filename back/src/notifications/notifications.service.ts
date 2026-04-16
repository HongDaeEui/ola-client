import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';
    if (!this.webhookUrl) {
      this.logger.warn('DISCORD_WEBHOOK_URL is not configured in environment variables.');
    }
  }

  async sendPostNotification(post: {
    id: string;
    title: string;
    content: string;
    category: string;
    author: { username: string };
  }) {
    if (!this.webhookUrl) return;

    // 카테고리별 디스코드 색상 매핑 (Decimal)
    const categoryColors: Record<string, number> = {
      '실천형 노하우': 1474148, // Sky Blue
      '전문 리포트': 8490488,  // Indigo
      '자유게시판': 9739416,   // Slate
      '작품 공유': 16478597,   // Rose
    };

    const color = categoryColors[post.category] || 9739416;
    const shortContent =
      post.content.length > 150
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
          url: `https://ola-client-psi.vercel.app/community/${post.id}`, // FIXME: 나중에 실제 도메인으로 변경 가능
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
      // 논블로킹으로 전송 (await 생략 안 함, 단 호출 측에서 Promise 무시 등 활용 가능)
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
    } catch (err) {
      this.logger.error(`Discord Webhook 오류: ${err.message}`);
    }
  }
}
