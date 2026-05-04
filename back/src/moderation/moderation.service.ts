import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  constructor(private prisma: PrismaService) {}

  async moderateContent(text: string): Promise<{ isFlagged: boolean; reason: string | null }> {
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
      } catch (error) {
        this.logger.error(`AI moderation failed: ${(error as Error).message}`);
        // Fallback to mock on error
      }
    }

    // Mock Moderation (Fallback)
    this.logger.log('Using Mock Moderation (No API Key or Request Failed)');
    const badWords = ['도박', '카지노', '불법', '성인', '바카라', '토토'];
    for (const word of badWords) {
      if (text.includes(word)) {
        return { isFlagged: true, reason: `금지어 포함: ${word} (시스템 감지)` };
      }
    }

    return { isFlagged: false, reason: null };
  }

  async moderatePost(postId: string, content: string) {
    const { isFlagged, reason } = await this.moderateContent(content);
    if (isFlagged) {
      await this.prisma.post.update({
        where: { id: postId },
        data: { isFlagged, flagReason: reason },
      });
      this.logger.warn(`Post ${postId} flagged: ${reason}`);
    }
  }

  async moderatePrompt(promptId: string, content: string) {
    const { isFlagged, reason } = await this.moderateContent(content);
    if (isFlagged) {
      await this.prisma.prompt.update({
        where: { id: promptId },
        data: { isFlagged, flagReason: reason },
      });
      this.logger.warn(`Prompt ${promptId} flagged: ${reason}`);
    }
  }
}
