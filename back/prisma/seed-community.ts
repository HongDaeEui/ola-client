// @ts-nocheck
/**
 * 커뮤니티 활성화 시드 스크립트
 * - 기존 데이터 삭제 없음 (additive only)
 * - 실행: ts-node prisma/seed-community.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 날짜 헬퍼: 지금으로부터 N일 전
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  console.log('🌱 커뮤니티 활성화 시드 시작...\n');

  // ─────────────────────────────────────────
  // 1. 유저 생성 (upsert — 중복 실행 안전)
  // ─────────────────────────────────────────
  console.log('👥 유저 생성 중...');

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'minjun.kim@olalab.kr' },
      update: {},
      create: {
        email: 'minjun.kim@olalab.kr',
        username: 'MinjunKim_AI',
        name: '김민준',
        role: 'CREATOR',
      },
    }),
    prisma.user.upsert({
      where: { email: 'suyeon.lee@olalab.kr' },
      update: {},
      create: {
        email: 'suyeon.lee@olalab.kr',
        username: 'Suyeon_Creates',
        name: '이수연',
        role: 'CREATOR',
      },
    }),
    prisma.user.upsert({
      where: { email: 'jihoon.park@olalab.kr' },
      update: {},
      create: {
        email: 'jihoon.park@olalab.kr',
        username: 'Jihoon_Builder',
        name: '박지훈',
        role: 'USER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'ayoung.choi@olalab.kr' },
      update: {},
      create: {
        email: 'ayoung.choi@olalab.kr',
        username: 'Ayoung_Analyst',
        name: '최아영',
        role: 'CREATOR',
      },
    }),
    prisma.user.upsert({
      where: { email: 'haeun.jung@olalab.kr' },
      update: {},
      create: {
        email: 'haeun.jung@olalab.kr',
        username: 'Haeun_Explorer',
        name: '정하은',
        role: 'USER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'taehyun.oh@olalab.kr' },
      update: {},
      create: {
        email: 'taehyun.oh@olalab.kr',
        username: 'Taehyun_Design',
        name: '오태현',
        role: 'CREATOR',
      },
    }),
  ]);

  const [minjun, suyeon, jihoon, ayoung, haeun, taehyun] = users;
  console.log(`  ✅ ${users.length}명 생성 완료\n`);

  // ─────────────────────────────────────────
  // 2. 커뮤니티 포스트 생성
  // ─────────────────────────────────────────
  console.log('📝 포스트 작성 중...');

  // ── 실천형 노하우 ──────────────────────────
  const post1 = await prisma.post.create({
    data: {
      title: 'Cursor + Claude로 사이드 프로젝트 배포까지 3일 만에 끝낸 후기',
      content: `개발자 4년차인데 이번에 사이드 프로젝트를 Cursor + Claude 조합으로 완전히 새롭게 작업해봤습니다.

결론부터 말씀드리면 **평소 2주 걸리던 작업이 3일**만에 끝났어요.

**워크플로우 공유:**

1. **기획 단계**: Claude에게 요구사항 정리 요청 → 바로 ERD, API 설계서 나옴
2. **코딩 단계**: Cursor Composer에서 "@파일명 이 기능 추가해줘" → 거의 완성 수준의 코드
3. **디버깅**: 에러 메시지를 그대로 붙여넣으면 원인 분석 + 수정 코드 동시 제공
4. **배포**: Vercel 배포 설정도 물어보니 vercel.json까지 작성해줌

특히 놀라웠던 건 "이 코드 리팩토링해줘"라고 하면 단순 리팩토링이 아니라 테스트 코드까지 같이 써주는 부분이었어요.

**주의사항:**
- 복잡한 비즈니스 로직은 컨텍스트를 잘 설명해야 함
- 긴 대화가 이어지면 앞 내용을 잊어버리는 경우 있음 (새 창 열기 추천)
- Claude Pro 기준 월 $20인데 이 생산성이면 완전 본전 뽑음

혹시 Cursor 셋업 방법이나 프롬프트 궁금하신 분 있으면 댓글 달아주세요!`,
      category: '실천형 노하우',
      authorId: minjun.id,
      likes: 87,
      views: 1240,
      createdAt: daysAgo(12),
      updatedAt: daysAgo(12),
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'n8n + ChatGPT로 고객 문의 자동 분류 & 답변 파이프라인 구축기',
      content: `스타트업에서 혼자 CS를 처리하다가 n8n으로 자동화한 경험을 공유합니다.

**기존 문제**: 하루 평균 30~40건의 고객 문의를 수동으로 처리 → 응답 시간 평균 4시간

**자동화 이후**: 간단한 문의 90%는 자동 답변, 복잡한 건만 직접 처리 → 응답 시간 평균 15분

**파이프라인 구조:**

```
이메일/카카오톡 수신
    ↓
n8n Webhook 트리거
    ↓
ChatGPT로 문의 유형 분류 (환불/기술/일반)
    ↓
분류별 템플릿 + GPT로 개인화 답변 생성
    ↓
담당자 알림 (Slack) + 고객 자동 회신
```

**핵심 프롬프트 (공개):**
"다음 고객 문의를 분석하여 '환불/교환', '기술지원', '일반문의' 중 하나로 분류하고, 친절하고 전문적인 답변을 한국어로 작성해주세요. 회사명: [회사명], 정책: [정책내용]"

n8n 설치부터 배포까지 궁금하신 분 계시면 DM 주세요. 노션으로 정리된 가이드 공유해드립니다.`,
      category: '실천형 노하우',
      authorId: jihoon.id,
      likes: 64,
      views: 890,
      createdAt: daysAgo(9),
      updatedAt: daysAgo(9),
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'NotebookLM으로 100페이지 경쟁사 보고서 30분 안에 소화하는 루틴',
      content: `전략팀에서 일하면서 주 2회 경쟁사 동향 보고서를 읽어야 하는데, NotebookLM으로 시간을 극단적으로 줄인 방법을 공유합니다.

**기존 루틴 (4~5시간):**
- 보고서 출력 또는 PDF 열기
- 형광펜 치며 전체 읽기
- 주요 내용 엑셀에 정리
- 인사이트 뽑아서 팀에 공유

**NotebookLM 루틴 (30분):**

1. PDF 업로드 (여러 개 동시 가능)
2. "이 보고서의 핵심 인사이트 5가지를 불릿포인트로" 요청
3. "우리 회사 전략과 비교했을 때 리스크 요인은?" 질문
4. "임원 보고용 1페이지 요약본 작성해줘" 요청
5. Audio Overview 기능으로 이동 중 청취

**특히 유용한 기능:**
- 여러 문서를 동시에 올려서 교차 분석 가능
- 인용 출처 표시 → 정확도 검증 용이
- 팀 전체 공유 노트북 만들어서 협업 가능

다음 주에 이 루틴으로 만든 보고서 템플릿도 공유할게요!`,
      category: '실천형 노하우',
      authorId: ayoung.id,
      likes: 112,
      views: 1560,
      createdAt: daysAgo(7),
      updatedAt: daysAgo(7),
    },
  });

  const post4 = await prisma.post.create({
    data: {
      title: 'Claude API + Zod로 구조화된 데이터 추출 파이프라인 만들기',
      content: `최근 Claude API의 structured outputs 기능과 Zod를 조합해서 비정형 텍스트에서 구조화된 데이터를 추출하는 파이프라인을 만들었습니다.

**사용 케이스**: 네이버/다음 블로그 텍스트에서 제품 스펙 정보 자동 추출

**핵심 코드 패턴:**
\`\`\`typescript
const schema = z.object({
  productName: z.string(),
  price: z.number(),
  specs: z.array(z.object({
    name: z.string(),
    value: z.string()
  })),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
});

const result = await anthropic.messages.create({
  model: 'claude-haiku-4-5-20251001', // 비용 효율적
  max_tokens: 1024,
  messages: [{
    role: 'user',
    content: \`다음 텍스트에서 제품 정보를 JSON으로 추출해주세요:\n\n\${text}\`
  }],
});
\`\`\`

**비용 팁**: 단순 추출 작업은 Claude Haiku로도 충분히 정확합니다. Sonnet 대비 비용 약 10배 저렴!

전체 코드는 GitHub에 올려뒀으니 링크 원하시면 댓글 주세요.`,
      category: '실천형 노하우',
      authorId: minjun.id,
      likes: 79,
      views: 1100,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
  });

  const post5 = await prisma.post.create({
    data: {
      title: 'AI 도구 스택 정리: 2026년 개인 생산성 세팅 공개합니다',
      content: `1년간 여러 AI 도구를 테스트하면서 지금 실제로 쓰는 스택을 정리했습니다.

**월 비용 총합: 약 12만원**

**코어 스택:**
- **Claude Pro** ($20): 글쓰기, 분석, 코딩 전반. Sonnet이 메인
- **Cursor Pro** ($20): 코딩. Copilot 대체 완료
- **Perplexity Pro** ($20): 리서치, 최신 정보 검색

**스페셜리스트:**
- **Midjourney** ($10): 썸네일, SNS 이미지
- **ElevenLabs** (무료): 영상 나레이션 가끔
- **Kling AI** (무료 티어): 숏폼 영상 클립

**버린 것들:**
- ChatGPT Plus → Claude Pro로 완전 대체
- GitHub Copilot → Cursor로 완전 대체
- Jasper → 가성비 안 나옴

**완전 무료인데 유용한 것:**
- NotebookLM (Google): 문서 분석
- Meta AI: 인스타에서 이미지 생성
- Microsoft Copilot: Edge에서 PDF 요약

스택 선택 기준이나 궁금한 도구 있으면 댓글 달아주세요!`,
      category: '실천형 노하우',
      authorId: haeun.id,
      likes: 143,
      views: 2100,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    },
  });

  // ── 작품 공유 ──────────────────────────────
  const post6 = await prisma.post.create({
    data: {
      title: 'Midjourney v7로 만든 한국 고궁 사이버펑크 시리즈 공개',
      content: `경복궁, 창덕궁, 덕수궁을 사이버펑크 세계관으로 재해석한 이미지 시리즈를 완성했습니다.

**프롬프트 기법 공유:**

기본 구조: \`[장소 설명], cyberpunk aesthetic, neon lights, holographic signs, Korean traditional architecture, cinematic lighting, 8k, hyperrealistic\`

**경복궁 시리즈 프롬프트:**
\`Gyeongbokgung Palace at night, cyberpunk city 2077, neon signs in Korean, floating holograms, rain-soaked streets, blade runner atmosphere, ultra wide shot, photorealistic\`

**작업 팁:**
- Aspect ratio: --ar 16:9 (유튜브 썸네일 최적화)
- Stylize 파라미터: --s 750 (아티스틱한 느낌 강화)
- 시리즈 통일성: --seed 값 고정해서 스타일 유지

총 30장을 만들었는데 그 중 베스트 10장을 인스타에 올렸고, 팔로워 800명에서 2400명으로 늘었어요. AI 아트도 콘텐츠 전략이 중요한 것 같습니다.

원본 파일 필요하신 분은 댓글 주세요 (저해상도는 무료, 원본은 크레딧 1개).`,
      category: '작품 공유',
      authorId: suyeon.id,
      likes: 198,
      views: 3200,
      createdAt: daysAgo(11),
      updatedAt: daysAgo(11),
    },
  });

  const post7 = await prisma.post.create({
    data: {
      title: 'Suno v4 + 직접 쓴 가사로 EP 앨범 만들어봤습니다 🎵',
      content: `음악은 전혀 모르는 디자이너인데, AI로 6곡짜리 로파이 EP를 만들어서 Spotify에 올렸어요.

**과정:**

1. **컨셉 기획**: Claude에게 "새벽 2시, 혼자 작업하는 분위기의 로파이 앨범 컨셉 잡아줘" → 트랙리스트와 분위기 설명 받음

2. **가사 작성**: Claude로 초안 → 내가 직접 감성 수정. 영어/한국어 혼용 스타일

3. **음악 생성 (Suno v4)**:
   - 장르: \`lo-fi hip hop, melancholic, late night study vibes\`
   - BPM: 75~85 유지
   - 총 6곡 생성에 크레딧 약 30개 사용

4. **커버 아트**: Midjourney로 통일된 무드 3장 제작

5. **배포**: DistroKid으로 Spotify, Apple Music, YouTube Music 동시 배포 ($22/년)

현재 Spotify 스트리밍 수: 1,847회 (올린 지 3주)

음악으로 돈 벌겠다는 게 아니라 내가 만든 걸 세상에 올렸다는 게 너무 신기했어요. AI 덕분에 진입장벽이 완전히 없어진 느낌입니다.`,
      category: '작품 공유',
      authorId: taehyun.id,
      likes: 156,
      views: 2400,
      createdAt: daysAgo(8),
      updatedAt: daysAgo(8),
    },
  });

  const post8 = await prisma.post.create({
    data: {
      title: 'Claude + Notion API로 만든 자동 독서 노트 시스템 공개',
      content: `책 읽을 때 하이라이트한 내용을 자동으로 분석하고 지식 베이스로 만드는 시스템을 개발했습니다.

**동작 방식:**

1. Kindle 하이라이트 → Readwise 동기화
2. Readwise → n8n Webhook 트리거 (새 하이라이트 발생 시)
3. n8n → Claude API 호출:
   - 하이라이트의 핵심 개념 추출
   - 기존 노트와 연결점 분석
   - 실생활 적용 아이디어 생성
4. 결과를 Notion 데이터베이스에 자동 저장

**Claude 프롬프트 구조:**
\`\`\`
당신은 독서 노트 도우미입니다.
하이라이트: {highlight}
책 제목: {book_title}
저자: {author}

다음을 JSON 형식으로 추출하세요:
- 핵심 개념 (1-2문장)
- 연관 키워드 (3-5개)
- 실행 가능한 인사이트 (1개)
- 관련 질문 (성찰을 위한 질문 1개)
\`\`\`

3개월 운영 후 노션 데이터베이스에 2,400개 인사이트가 쌓였는데, 이걸 다시 Claude에게 물어보면 제 독서 이력 기반으로 추천을 해줘서 개인화된 학습 시스템이 됩니다.

설정 파일 GitHub에 공개해뒀습니다. 링크 원하시면 댓글 달아주세요!`,
      category: '작품 공유',
      authorId: minjun.id,
      likes: 134,
      views: 1870,
      createdAt: daysAgo(6),
      updatedAt: daysAgo(6),
    },
  });

  // ── 자유게시판 ────────────────────────────
  const post9 = await prisma.post.create({
    data: {
      title: '이번 달 AI 구독 정리해봤는데 월 20만원 나오더라고요 😅',
      content: `다들 AI 구독료 얼마나 쓰세요? 저 이번 달에 처음으로 제대로 계산해봤는데 충격받았습니다.

**제 구독 목록:**
- Claude Pro: $20 (≈ 27,000원)
- Cursor Pro: $20 (≈ 27,000원)
- ChatGPT Plus: $20 (≈ 27,000원)
- Midjourney Basic: $10 (≈ 13,500원)
- Perplexity Pro: $20 (≈ 27,000원)
- Notion AI add-on: $10 (≈ 13,500원)

**합계: 약 135,000원/월**

근데 생각해보면 이 도구들 없었으면 못 했을 일들이 너무 많아서... 정당화가 되긴 하는데 ㅋㅋㅋ

여러분은 어떻게 구독 관리하시나요? 혹시 꼭 필요한 것만 남기고 줄이는 팁 있으시면 공유 부탁드려요!`,
      category: '자유게시판',
      authorId: jihoon.id,
      likes: 89,
      views: 1450,
      createdAt: daysAgo(10),
      updatedAt: daysAgo(10),
    },
  });

  const post10 = await prisma.post.create({
    data: {
      title: 'AI 못 믿는 팀원 설득하는 방법 있을까요?',
      content: `마케팅팀에서 일하는데, AI 도구 도입을 제안하면 팀원 한 분이 매번 "AI가 만든 건 가짜다", "창의성이 없다"고 하셔서 고민입니다.

사실 틀린 말은 아닌데... 저는 AI를 "대체"가 아니라 "증폭"으로 쓰는 거라고 생각하거든요.

**제가 시도한 것들:**
1. 결과물 비교 보여주기 → "그래도 AI는 싫다"
2. 시간 절약 수치 제시 → 관심 없음
3. 직접 써보게 권유 → "나는 괜찮아"

혹시 비슷한 경험 있으신 분들 어떻게 하셨나요?

아니면 그냥 포기하고 저 혼자 쓰는 게 나을까요 ㅠㅠ 팀 전체가 쓰면 시너지가 날 것 같은데...`,
      category: '자유게시판',
      authorId: haeun.id,
      likes: 67,
      views: 980,
      createdAt: daysAgo(4),
      updatedAt: daysAgo(4),
    },
  });

  const post11 = await prisma.post.create({
    data: {
      title: 'Ola에서 발견한 AI 도구로 실제 수익 내고 있는 분 있나요?',
      content: `Ola 커뮤니티 가입한 지 한 달 됐는데, AI 도구를 단순히 "업무 효율화"가 아니라 직접적인 수익 창출에 쓰시는 분들이 궁금합니다.

**제 케이스 (참고용):**
- Midjourney + 크몽 클라이언트: 로고/배너 작업으로 월 50~80만원 추가 수입
- ChatGPT + 블로그: SEO 최적화 글쓰기로 애드센스 수익 전월 대비 200% 증가

근데 이게 지속 가능한 모델인지는 모르겠어요. AI 생성 콘텐츠에 대한 플랫폼 정책이 계속 바뀌고 있어서...

**궁금한 점:**
1. 어떤 도구로 어떤 방식으로 수익을 내고 계신가요?
2. 법적/윤리적으로 문제없는 방식인지 어떻게 판단하시나요?
3. 지속성 있는 AI 비즈니스 모델이 뭐라고 생각하시나요?

솔직한 경험 공유 부탁드립니다!`,
      category: '자유게시판',
      authorId: suyeon.id,
      likes: 78,
      views: 1230,
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
    },
  });

  // ── 전문 리포트 ────────────────────────────
  const post12 = await prisma.post.create({
    data: {
      title: '2026 Q2 AI 에이전트 생태계 트렌드 분석: 지금 주목해야 할 3가지',
      content: `전략 컨설팅 회사에서 일하면서 분기마다 AI 트렌드를 분석하는데, Q2 인사이트를 커뮤니티에 공유합니다.

## 1. 멀티 에이전트 협업의 상용화

2025년까지 "에이전트"가 단일 AI 작업자였다면, 2026 Q2는 **에이전트 팀**의 시대입니다.

- **Devin 2.0**: 단순 코딩을 넘어 PM, QA, 배포까지 역할 분담
- **Claude 팀 워크스페이스**: Anthropic의 다중 에이전트 오케스트레이션 공개 베타
- **AutoGen 3.0**: 마이크로소프트의 엔터프라이즈 멀티에이전트 프레임워크 GA

**시사점**: 혼자 개발하는 indie developer에게 "가상의 개발팀"을 갖는 게 현실화.

## 2. 추론 비용의 극적 하락

GPT-4 수준 추론의 비용이 1년 전 대비 **약 95% 하락** (토큰당 기준).

- Claude Haiku 4.5: $0.0008/1K tokens (입력 기준)
- Gemini 1.5 Flash: 무료 티어로도 상당 수준 처리 가능
- Groq: 오픈소스 모델 추론 속도 GPT-4o 대비 10배 이상 빠름

**시사점**: 비용이 더 이상 AI 도입의 장벽이 아님. 아이디어와 실행력이 핵심.

## 3. 버티컬 AI의 부상

범용 AI보다 **특정 산업에 특화된 AI**의 성능이 범용 모델을 뛰어넘기 시작.

- 법률: Harvey AI (계약 검토 정확도 GPT-4 + 법률 문서 파인튜닝)
- 의료: Med-PaLM 2 → 미국 의사 면허시험 통과 수준
- 금융: Bloomberg GPT → 금융 NLP 태스크 범용 LLM 대비 30% 성능 우위

---

다음 편에서는 국내 기업 AI 도입 실태와 ROI 분석을 다룰 예정입니다. 궁금한 분야 있으시면 댓글 달아주세요!`,
      category: '전문 리포트',
      authorId: ayoung.id,
      likes: 234,
      views: 4100,
      createdAt: daysAgo(14),
      updatedAt: daysAgo(14),
    },
  });

  const post13 = await prisma.post.create({
    data: {
      title: 'LLM API 비용 최적화 실전 가이드: Haiku vs Sonnet vs GPT-4o 가성비 비교',
      content: `실제 프로덕션에서 3개월간 약 $2,000의 LLM API를 사용하면서 최적화한 경험을 공유합니다.

## 모델별 가성비 매트릭스 (2026.04 기준)

| 모델 | 입력 비용 | 출력 비용 | 추론 속도 | 권장 사용 케이스 |
|------|----------|----------|---------|---------------|
| Claude Haiku 4.5 | $0.0008/1K | $0.004/1K | 매우 빠름 | 분류, 추출, 간단 요약 |
| Claude Sonnet 4.6 | $0.003/1K | $0.015/1K | 빠름 | 일반 생성, 분석 |
| Claude Opus 4.7 | $0.015/1K | $0.075/1K | 보통 | 복잡한 추론, 장문 |
| GPT-4o mini | $0.00015/1K | $0.0006/1K | 매우 빠름 | 초저비용 분류 |
| GPT-4o | $0.005/1K | $0.015/1K | 빠름 | 범용 |

## 실전 최적화 전략

**1. 태스크별 모델 라우팅**
\`\`\`
입력 텍스트 길이 < 500자 + 분류 작업 → Haiku
일반 생성/분석 → Sonnet
복잡한 추론/코딩 → Opus
\`\`\`

**2. 프롬프트 캐싱 활용** (Anthropic Claude만 해당)
반복되는 시스템 프롬프트를 캐싱하면 **입력 비용 90% 절감** 가능.

**3. 배치 처리**
실시간이 필요 없는 작업은 Batch API 사용 → **50% 할인**.

## 결과
최적화 전: 월 $680 → 최적화 후: 월 $180 (73% 절감)

자세한 코드 샘플 필요하시면 댓글 달아주세요.`,
      category: '전문 리포트',
      authorId: minjun.id,
      likes: 189,
      views: 3500,
      createdAt: daysAgo(13),
      updatedAt: daysAgo(13),
    },
  });

  const post14 = await prisma.post.create({
    data: {
      title: '국내 중소기업 AI 도입 실태 조사: 현실은 생각보다 뒤처져 있다',
      content: `지난 분기에 국내 중소기업 47개사를 대상으로 AI 도입 현황 인터뷰를 진행한 결과를 요약합니다.

## 핵심 발견

**도입률: 생각보다 낮다**
- "AI 도구를 업무에 적극 활용 중": 12% (6개사)
- "가끔 써봄": 38% (18개사)
- "아직 안 써봄": 50% (23개사)

**안 쓰는 이유 (복수 응답):**
1. "어떻게 시작해야 할지 모르겠다" - 67%
2. "직원 교육 비용이 부담" - 45%
3. "데이터 보안이 걱정" - 43%
4. "아직은 때가 아닌 것 같다" - 38%
5. "AI가 만든 결과물은 믿기 어렵다" - 31%

## 적극 도입 기업의 공통점

놀랍게도 대표자의 나이보다 **대표자의 "직접 써본 경험"**이 도입 여부를 가장 잘 예측했습니다.

직접 써본 대표: 도입률 89%
안 써본 대표: 도입률 4%

## 시사점

AI 도입의 가장 큰 장벽은 기술이나 비용이 아니라 **"첫 경험의 부재"**입니다. Ola 같은 커뮤니티가 이 격차를 줄이는 데 실질적인 역할을 할 수 있을 것 같습니다.

전체 보고서(32페이지)가 필요하신 분은 이메일 주소 남겨주세요. 무료로 공유해드립니다.`,
      category: '전문 리포트',
      authorId: ayoung.id,
      likes: 167,
      views: 2800,
      createdAt: daysAgo(15),
      updatedAt: daysAgo(15),
    },
  });

  console.log(`  ✅ 포스트 14개 생성 완료\n`);

  // ─────────────────────────────────────────
  // 3. 댓글 생성
  // ─────────────────────────────────────────
  console.log('💬 댓글 작성 중...');

  await prisma.comment.createMany({
    data: [
      // post1 댓글 (Cursor + Claude)
      { content: '저도 Cursor 쓰는데 진짜 생산성이 달라요. 특히 Tab 키로 코드 완성하는 게 중독성 있음 ㅋㅋ', postId: post1.id, authorId: jihoon.id, createdAt: daysAgo(11) },
      { content: '컨텍스트 잃어버리는 문제는 저도 겪었는데, .cursorrules 파일에 프로젝트 컨텍스트 미리 적어두면 많이 해결돼요!', postId: post1.id, authorId: ayoung.id, createdAt: daysAgo(10) },
      { content: '프롬프트 공유 해주실 수 있나요? 특히 리팩토링할 때 쓰는 프롬프트가 궁금합니다', postId: post1.id, authorId: haeun.id, createdAt: daysAgo(10) },
      { content: '저는 Windsurf도 써봤는데 Cursor가 확실히 더 낫더라고요. 특히 대형 코드베이스에서', postId: post1.id, authorId: taehyun.id, createdAt: daysAgo(9) },

      // post2 댓글 (n8n 자동화)
      { content: 'n8n vs Make 중에 고민했는데 n8n 선택한 이유가 있으신가요? 저는 아직 Make 쓰는데', postId: post2.id, authorId: minjun.id, createdAt: daysAgo(8) },
      { content: '카카오톡 연동은 어떻게 하셨어요? 카카오 채널 API가 복잡해서 포기했었는데', postId: post2.id, authorId: suyeon.id, createdAt: daysAgo(7) },
      { content: '노션 가이드 공유 부탁드려요! 비슷한 시스템 만들려고 했는데 중간에 막혀서요', postId: post2.id, authorId: haeun.id, createdAt: daysAgo(7) },

      // post3 댓글 (NotebookLM)
      { content: 'Audio Overview 기능 진짜 좋죠! 출퇴근길에 듣는 용도로 완전 애용중입니다', postId: post3.id, authorId: jihoon.id, createdAt: daysAgo(6) },
      { content: '한국어 문서도 잘 처리되나요? 저는 영어 문서는 잘 되는데 한국어는 좀 아쉬웠어서', postId: post3.id, authorId: taehyun.id, createdAt: daysAgo(5) },
      { content: '팀 공유 노트북 기능 설명 좀 더 부탁드려도 될까요? 팀원들이랑 같이 쓰고 싶은데', postId: post3.id, authorId: minjun.id, createdAt: daysAgo(5) },

      // post5 댓글 (AI 도구 스택)
      { content: 'ChatGPT Plus랑 Claude Pro 둘 다 쓰시는 분들 많을 줄 알았는데 대체하셨군요. 저도 고민 중이에요', postId: post5.id, authorId: jihoon.id, createdAt: daysAgo(2) },
      { content: 'Perplexity는 리서치 용도로는 진짜 최고인 것 같아요. 출처 보여주는 게 특히 신뢰가 가서', postId: post5.id, authorId: ayoung.id, createdAt: daysAgo(2) },
      { content: '저는 여기에 Runway Gen-3 추가해서 쓰는데, 영상 관련 작업하시면 추천드려요', postId: post5.id, authorId: suyeon.id, createdAt: daysAgo(1) },

      // post6 댓글 (Midjourney 사이버펑크)
      { content: '와 진짜 퀄리티 대박이에요. 경복궁 이미지 보고 소름 돋았습니다. 프롬프트 공유 감사해요!', postId: post6.id, authorId: haeun.id, createdAt: daysAgo(10) },
      { content: 'Stylize 750은 제가 쓰던 수치보다 훨씬 높네요. 저는 보통 250~500 사이를 쓰는데 차이가 확실한가요?', postId: post6.id, authorId: minjun.id, createdAt: daysAgo(9) },
      { content: '인스타 팔로워 3배 늘었다고요?! 어떤 해시태그 전략 쓰셨는지도 궁금합니다', postId: post6.id, authorId: jihoon.id, createdAt: daysAgo(8) },
      { content: 'AI 아트도 이제 포트폴리오가 되는 세상이 됐네요. 멋있습니다 👏', postId: post6.id, authorId: taehyun.id, createdAt: daysAgo(7) },

      // post7 댓글 (Suno 앨범)
      { content: '음악 전혀 모르는데 EP까지 만들었다니 진짜 대단하세요! Spotify 링크 공유해주실 수 있나요?', postId: post7.id, authorId: suyeon.id, createdAt: daysAgo(7) },
      { content: 'DistroKid 사용해보려고 했는데 실제 사용 경험 어때요? 가입부터 배포까지 얼마나 걸렸나요', postId: post7.id, authorId: haeun.id, createdAt: daysAgo(6) },
      { content: '저도 Suno로 BGM 만들어봤는데 v4가 v3보다 확실히 자연스럽더라고요. 가사 일관성이 특히', postId: post7.id, authorId: ayoung.id, createdAt: daysAgo(5) },

      // post8 댓글 (독서 노트 시스템)
      { content: 'Readwise 유료 결제해야 하나요? 무료 플랜으로도 연동 가능한지 궁금합니다', postId: post8.id, authorId: taehyun.id, createdAt: daysAgo(5) },
      { content: 'GitHub 링크 공유 부탁드려요! n8n 워크플로우 JSON도 있으면 더 좋겠습니다 🙏', postId: post8.id, authorId: jihoon.id, createdAt: daysAgo(4) },
      { content: '2400개 인사이트에서 검색할 때 Claude 어떻게 연결하시나요? Notion AI랑은 다른 건가요?', postId: post8.id, authorId: suyeon.id, createdAt: daysAgo(3) },

      // post9 댓글 (AI 구독비)
      { content: '저는 Claude Pro + Cursor만 40달러인데, 이 조합으로 거의 모든 걸 해결하고 있어요. 선택과 집중!', postId: post9.id, authorId: minjun.id, createdAt: daysAgo(9) },
      { content: 'ChatGPT랑 Claude 둘 다 유지하시는 이유가 있나요? 저는 Claude로 완전히 갔는데', postId: post9.id, authorId: ayoung.id, createdAt: daysAgo(8) },
      { content: '저는 반년에 한 번씩 "정말 쓰고 있나?" 체크해서 안 쓰는 건 잘라내요. 최근에 Jasper 끊었습니다', postId: post9.id, authorId: haeun.id, createdAt: daysAgo(8) },
      { content: '회사 비용으로 처리하면 훨씬 편한데 ㅋㅋ 개인 카드로 매달 나가는 거 보면 좀 아프긴 하죠', postId: post9.id, authorId: taehyun.id, createdAt: daysAgo(7) },

      // post10 댓글 (AI 설득)
      { content: '저도 비슷한 상황인데, 결국 작은 성공 사례를 직접 보여주는 게 제일 효과적이었어요. 이론이 아니라 실제 결과로', postId: post10.id, authorId: jihoon.id, createdAt: daysAgo(3) },
      { content: '"창의성이 없다"는 말에 공감하면서도... AI를 도구로 쓰는 사람의 창의성은 여전히 중요하다고 생각해요', postId: post10.id, authorId: suyeon.id, createdAt: daysAgo(3) },
      { content: '억지로 설득하려 하지 않는 게 오히려 나을 수도 있어요. 주변에서 결과 보면 자연스럽게 관심 갖게 됩니다', postId: post10.id, authorId: minjun.id, createdAt: daysAgo(2) },

      // post12 댓글 (AI 에이전트 트렌드)
      { content: '멀티 에이전트 협업 부분이 특히 흥미롭네요. Claude 팀 워크스페이스는 어디서 신청할 수 있나요?', postId: post12.id, authorId: jihoon.id, createdAt: daysAgo(13) },
      { content: '버티컬 AI 부분 동의합니다. 저희 회사도 법률 쪽으로 Harvey AI 도입 검토 중인데, 범용 모델이랑 차이가 확실히 느껴지더라고요', postId: post12.id, authorId: minjun.id, createdAt: daysAgo(12) },
      { content: '다음 편 기대됩니다! ROI 분석에서 어떤 지표를 사용하실 건지도 미리 알고 싶어요', postId: post12.id, authorId: haeun.id, createdAt: daysAgo(11) },
      { content: '추론 비용 95% 하락 수치가 놀랍네요. 출처 공유해주실 수 있나요?', postId: post12.id, authorId: taehyun.id, createdAt: daysAgo(10) },

      // post13 댓글 (LLM 비용 최적화)
      { content: '프롬프트 캐싱은 몰랐던 기능인데 90% 절감이라니... 당장 적용해봐야겠어요. 코드 샘플 공유 부탁드립니다!', postId: post13.id, authorId: suyeon.id, createdAt: daysAgo(12) },
      { content: '배치 API도 50% 할인이군요! 야간에 배치 돌리는 용도로 써봐야겠습니다. 감사합니다', postId: post13.id, authorId: jihoon.id, createdAt: daysAgo(11) },
      { content: '73% 절감 대단하네요. 태스크별 라우팅 로직을 어떻게 자동화하셨는지 궁금합니다', postId: post13.id, authorId: haeun.id, createdAt: daysAgo(10) },

      // post14 댓글 (국내 기업 AI 도입)
      { content: '"첫 경험의 부재"라는 표현이 정확한 것 같아요. 저도 직접 써보기 전엔 반신반의했는데 한 번 써보고 완전히 바뀌었거든요', postId: post14.id, authorId: minjun.id, createdAt: daysAgo(14) },
      { content: '대표자의 직접 경험이 도입률과 상관관계가 있다는 게 인상적이네요. 보고서 전체 파일 받고 싶습니다!', postId: post14.id, authorId: taehyun.id, createdAt: daysAgo(13) },
      { content: '데이터 보안 우려가 43%나 된다는 게 현실적으로 공감이 가요. 이 부분을 어떻게 설득하셨는지 궁금합니다', postId: post14.id, authorId: suyeon.id, createdAt: daysAgo(12) },
    ],
  });

  const commentCount = await prisma.comment.count();
  console.log(`  ✅ 댓글 생성 완료 (총 DB 댓글 수: ${commentCount})\n`);

  console.log('✨ 커뮤니티 활성화 시드 완료!');
  console.log('   - 유저 6명');
  console.log('   - 포스트 14개 (실천형 노하우 5 | 작품 공유 3 | 자유게시판 3 | 전문 리포트 3)');
  console.log('   - 댓글 40개+');
}

main()
  .catch((e) => {
    console.error('❌ 시드 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
