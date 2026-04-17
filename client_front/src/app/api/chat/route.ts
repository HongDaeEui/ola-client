import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export const runtime = 'edge';

const SYSTEM_PROMPT = `당신은 'Ola 플랫폼'의 공식 AI 비서(Ola AI)입니다.
- Ola 플랫폼은 AI 도구, AI 실험실, 최신 기술 트렌드를 함께 논의하고 탐색하는 커뮤니티 생태계입니다.
- 사용자에게 항시 정중하고 친절하게 답변하세요. 이모지(✨🤔💡)를 적극 활용하여 대화를 부드럽게 이끄세요.
- AI 도구 추천, 프롬프트 작성, 활용법 등 실질적인 도움을 드리세요.
- 모르는 정보에 대해서는 솔직하게 답하고, Ola 커뮤니티 게시판에 질문해 보라고 권장하세요.
- 답변은 짧고 명확하게 작성하세요 (플로팅 챗 위젯에서 읽기 편하게).`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: anthropic('claude-haiku-4-5-20251001'),
      messages,
      system: SYSTEM_PROMPT,
      maxTokens: 1024,
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    console.error('Chat API Error:', error);
    const message = error instanceof Error ? error.message : 'An error occurred during chat';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
