import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

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

    // RAG: Ola 백엔드 도구 검색으로 관련 도구 컨텍스트 주입
    const lastUserMsg = messages.filter((m: {role:string}) => m.role === 'user').at(-1)?.content ?? '';
    let toolContext = '';
    try {
      const searchRes = await fetch(
        `https://ola-backend-9f03.onrender.com/api/tools?q=${encodeURIComponent(lastUserMsg)}&limit=5`,
        { signal: AbortSignal.timeout(3000) }
      );
      if (searchRes.ok) {
        const found = await searchRes.json();
        if (Array.isArray(found) && found.length > 0) {
          toolContext = '\n\n[Ola DB 관련 도구]\n' +
            found.map((t: {name:string; shortDesc:string; pricingModel?:string; rating?:number}) =>
              `- ${t.name}: ${t.shortDesc} (${t.pricingModel ?? 'Free'}, ⭐${t.rating ?? '?'})`
            ).join('\n');
        }
      }
    } catch { /* graceful degradation */ }

    const systemPrompt = `당신은 Ola AI 비서입니다. AI 도구 커뮤니티 플랫폼 Ola(olalab.kr)의 도우미로, 사용자가 적합한 AI 도구를 찾고 활용하도록 돕습니다.${toolContext}

위 도구 정보를 참고해 답변하되, 모르는 내용은 솔직히 모른다고 하세요. 한국어로 친근하게 답변하세요.`;

    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages,
      system: systemPrompt,
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

