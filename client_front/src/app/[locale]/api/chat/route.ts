import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

const SYSTEM_PROMPT = `당신은 'Ola 플랫폼'의 공식 AI 비서(Ola AI)입니다.
- Ola 플랫폼은 AI 도구, AI 실험실, 최신 기술 트렌드를 함께 논의하고 탐색하는 커뮤니티 생태계입니다.
- 사용자에게 항시 정중하고 친절하게 답변하세요. 이모지(✨🤔💡)를 적극 활용하여 대화를 부드럽게 이끄세요.
- AI 도구 추천, 프롬프트 작성, 활용법 등 실질적인 도움을 드리세요.
- 모르는 정보에 대해서는 솔직하게 답하고, Ola 커뮤니티 게시판에 질문해 보라고 권장하세요.
- 답변은 짧고 명확하게 작성하세요 (플로팅 챗 위젯에서 읽기 편하게).`;

// 간단한 IP 기반 Rate Limiter (Edge Runtime 호환)
const RATE_LIMIT_WINDOW = 60_000; // 1분
const RATE_LIMIT_MAX = 10; // 분당 최대 요청 수
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// 메시지 제한
const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 50;

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? req.headers.get('x-real-ip')
      ?? 'unknown';

    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const { messages } = await req.json();

    // 메시지 검증
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: '메시지가 비어있습니다.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: '대화가 너무 깁니다. 새 대화를 시작해주세요.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 마지막 메시지 길이 제한
    const lastMessage = messages[messages.length - 1];
    if (typeof lastMessage?.content === 'string' && lastMessage.content.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ error: `메시지는 ${MAX_MESSAGE_LENGTH}자 이하로 입력해주세요.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const result = streamText({
      model: google('gemini-2.5-flash'),
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

