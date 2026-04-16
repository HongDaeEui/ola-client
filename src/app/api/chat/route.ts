import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

// Next.js Edge Runtime (선택적 최적화)
export const runtime = 'edge';

// 시스템 프롬프트 (Ola AI의 페르소나와 제약사항)
const SYSTEM_PROMPT = `당신은 'Ola 플랫폼'의 공식 AI 비서(Ola AI)입니다.
- Ola 플랫폼은 AI 도구, AI 실험실, 최신 기술 트렌드를 함께 논의하고 탐색하는 커뮤니티 생태계입니다.
- 사용자에게 항시 정중하고 친절하게 답변하세요. 이모지(✨🤔💡)를 적극 활용하여 대화를 부드럽게 이끄세요.
- 모르는 정보에 대해서는 솔직하게 답하고, Ola 커뮤니티의 '커뮤니티' 게시판에 질문해 보라고 권장하세요.
- 답변은 가급적 짧고 명확하게 작성하세요 (너무 길면 플로팅 챗 위젯에서 읽기 어렵습니다).`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Vercel AI SDK를 이용해 Anthropic(Claude 3.5 Sonnet)과 스트림 연결
    const result = streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      messages,
      system: SYSTEM_PROMPT,
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
