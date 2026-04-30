// @ts-nocheck
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const NEW_LABS = [
  {
    title: 'Lovable로 풀스택 웹앱 30분 완성',
    emoji: '💜',
    difficulty: '입문',
    category: '개발',
    metric: '개발 시간 1주 → 30분',
    description: '코드 한 줄 안 써도 됩니다. "회원가입/로그인 + 대시보드 있는 SaaS 만들어줘" 한 문장으로 풀스택 앱이 나왔어요.',
    stack: ['Lovable', 'Supabase', 'Stripe'],
    likes: 312,
    content: `## 🎯 이 실험의 목표
Lovable.dev에 자연어로 요구사항을 입력해 **실제 배포 가능한 풀스택 웹앱을 30분 안에** 만든다.
백엔드(Supabase), 결제(Stripe), 인증까지 자동 세팅.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| **Lovable.dev** | 자연어 → 풀스택 앱 생성 | 무료 (월 5개 프로젝트) |
| **Supabase** | DB + 인증 | 무료 |
| **Vercel** | 배포 | 무료 |

---

## 💬 Step 1: 첫 프롬프트 작성

Lovable 대화창에 아래처럼 입력한다.

\`\`\`
SaaS 대시보드 앱을 만들어줘.
- 기능: Google 소셜 로그인, 사용자별 할일 목록 CRUD, 완료율 차트
- 디자인: 다크모드 지원, 사이드바 네비게이션
- DB: Supabase 연동
\`\`\`

Lovable이 **React + Tailwind + Supabase** 구조로 코드를 자동 생성한다.

---

## 🔧 Step 2: Supabase 연결

1. [supabase.com](https://supabase.com) → 새 프로젝트 생성
2. **Settings → API** 에서 URL과 anon key 복사
3. Lovable 환경변수 패널에 붙여넣기
4. Lovable이 테이블 스키마 자동 생성 제안 → **Accept All**

---

## 🎨 Step 3: 피드백으로 UI 수정

생성된 앱을 보고 채팅으로 수정 요청:

> "할일 카드에 우선순위 색상 배지 추가해줘. 높음=빨강, 보통=노랑, 낮음=초록"

> "사이드바에 오늘 완료한 항목 수를 실시간으로 보여줘"

한 번의 메시지로 컴포넌트 수준 수정이 즉시 반영된다.

---

## 🚀 Step 4: 원클릭 배포

1. 우측 상단 **Deploy** 버튼 클릭
2. Vercel 계정 연결 → 자동 배포
3. 고유 URL 발급 완료

총 소요 시간: **약 25분**

---

## 📊 실험 결과

| 항목 | 결과 |
|------|------|
| 개발 시간 | 25분 (기획 포함) |
| 코드 직접 작성 | 0줄 |
| 배포까지 | 28분 |
| 기능 구현율 | 요구사항 100% |

---

## 💡 이런 분께 추천

- 아이디어가 있는데 개발을 못 하는 기획자
- 프로토타입을 빠르게 만들어야 하는 스타트업
- 포트폴리오 프로젝트가 급한 취준생`,
  },
  {
    title: 'n8n × Claude — 유튜브 트렌드 리포트 자동 발송',
    emoji: '📊',
    difficulty: '중급',
    category: '자동화',
    metric: '리서치 시간 주 3시간 → 0분',
    description: '매주 월요일 아침, 내 분야 유튜브 트렌드 TOP 10이 이메일로 자동 도착합니다. n8n + YouTube Data API + Claude 조합.',
    stack: ['n8n', 'Claude API', 'YouTube Data API', 'Gmail'],
    likes: 198,
    content: `## 🎯 이 실험의 목표
n8n 워크플로우로 **매주 월요일 오전 8시**에 지정한 키워드의 유튜브 트렌드 영상을 자동 수집하고,
Claude가 한국어 요약 리포트로 정리해서 이메일로 보내도록 구성한다.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| **n8n** (Cloud or Self-host) | 워크플로우 자동화 | 무료 플랜 가능 |
| **YouTube Data API v3** | 영상 검색 | 무료 (일 10,000 units) |
| **Claude API** | 트렌드 분석/요약 | 유료 (매우 저렴) |
| **Gmail** | 리포트 수신 | 무료 |

---

## 🔑 Step 1: YouTube Data API 키 발급

1. [console.cloud.google.com](https://console.cloud.google.com) 접속
2. 프로젝트 생성 → **API 라이브러리** → "YouTube Data API v3" 활성화
3. **사용자 인증 정보 → API 키** 생성 후 복사

---

## ⚙️ Step 2: n8n 워크플로우 구성

### 노드 1: Schedule Trigger
- 매주 월요일 오전 08:00 실행

### 노드 2: HTTP Request (YouTube 검색)
- URL: \`https://www.googleapis.com/youtube/v3/search\`
- 파라미터:
\`\`\`
part=snippet
q=AI 도구 추천
maxResults=10
order=viewCount
publishedAfter={{ 7일 전 날짜 ISO 형식 }}
key={{ YouTube API Key }}
regionCode=KR
relevanceLanguage=ko
\`\`\`

### 노드 3: Code (데이터 정제)
\`\`\`javascript
const items = $input.all();
const videos = items[0].json.items.map(v => ({
  title: v.snippet.title,
  channel: v.snippet.channelTitle,
  publishedAt: v.snippet.publishedAt,
  videoId: v.id.videoId,
  url: \`https://youtu.be/\${v.id.videoId}\`
}));
return [{ json: { videos } }];
\`\`\`

### 노드 4: HTTP Request (Claude API)
- URL: \`https://api.anthropic.com/v1/messages\`
- Headers: \`x-api-key: {{ Claude API Key }}\`, \`anthropic-version: 2023-06-01\`
- Body:
\`\`\`json
{
  "model": "claude-haiku-4-5",
  "max_tokens": 1024,
  "messages": [{
    "role": "user",
    "content": "다음 유튜브 트렌드 영상 목록을 분석해서 이번 주 AI 콘텐츠 트렌드를 한국어로 요약해줘. 각 영상마다 한 줄 인사이트 포함.\n\n{{ $json.videos | json }}"
  }]
}
\`\`\`

### 노드 5: Gmail (리포트 발송)
- Subject: \`[Ola] 이번 주 AI 유튜브 트렌드 리포트 📊\`
- Body: Claude 응답 텍스트

---

## 📊 실험 결과

- 매주 월요일 오전 8시 자동 수신 확인
- 영상 10개 분석 + 요약 소요 시간: **약 8초**
- Claude API 비용: 리포트 1회당 **약 $0.003** (한 달 12원)

---

## 💡 응용 아이디어

- 키워드를 \`AI 도구\` → \`경쟁사 이름\`으로 바꾸면 **경쟁사 모니터링**
- Slack Webhook 노드로 교체하면 **팀 채널 자동 공유**
- 일간으로 바꾸면 뉴스레터 소재 자동 수집`,
  },
  {
    title: 'NotebookLM으로 논문 50페이지 10분 요약',
    emoji: '📚',
    difficulty: '입문',
    category: '생산성',
    metric: '논문 분석 시간 3시간 → 10분',
    description: 'Google NotebookLM에 PDF를 던져넣고 "핵심 논지와 방법론 요약해줘"라고 했더니 10분 만에 연구 요약 완성. 참고문헌 추적까지.',
    stack: ['NotebookLM', 'Google Drive'],
    likes: 421,
    content: `## 🎯 이 실험의 목표
Google NotebookLM을 활용해 **논문/보고서 PDF를 10분 안에 완전히 파악**하고,
핵심 논지, 방법론, 결론, 인용할 만한 문장까지 추출한다.

---

## 🛠️ 준비물

- [notebooklm.google.com](https://notebooklm.google.com) 계정 (Google 계정 무료)
- 분석할 PDF 또는 URL

---

## 📥 Step 1: 소스 추가

NotebookLM 새 노트북 생성 → **+ Add Source**
- PDF 업로드, Google Drive 연결, URL, 유튜브 링크 모두 지원
- 논문 여러 편을 한 번에 추가 가능 (최대 50개)

---

## 💬 Step 2: 구조화된 질문으로 요약

아래 질문들을 순서대로 입력하면 논문 전체를 체계적으로 파악할 수 있다.

**① 전체 구조 파악**
> "이 논문의 연구 목적, 방법론, 핵심 결과를 불릿포인트로 정리해줘"

**② 핵심 주장 추출**
> "저자가 가장 강조하는 주장 3가지와 그 근거를 찾아줘"

**③ 한계와 후속 연구**
> "이 연구의 한계점과 저자가 제안하는 후속 연구 방향은?"

**④ 인용구 추출**
> "인용하기 좋은 임팩트 있는 문장 5개를 원문 그대로 알려줘"

---

## 🔗 Step 3: 여러 논문 교차 분석

소스를 3~5개 추가한 후:

> "세 논문이 공통적으로 동의하는 부분과 서로 상충하는 부분을 비교해줘"

> "이 논문들을 종합했을 때 2026년 현재 이 분야의 연구 트렌드는?"

NotebookLM이 각 소스를 색으로 구분해서 출처를 명확히 표시해준다.

---

## 🎙️ Step 4: Audio Overview (팟캐스트 변환)

**Generate → Audio Overview** 클릭 시 논문 내용을 **두 호스트가 대화하는 팟캐스트 형식**으로 자동 변환.
출퇴근길에 들으면서 논문 복습 가능.

---

## 📊 실험 결과

| 논문 길이 | 기존 소요 시간 | NotebookLM 사용 시 |
|----------|-------------|-----------------|
| 15페이지 | 1.5시간 | 8분 |
| 50페이지 | 3시간 | 12분 |
| 영문 논문 | +30분 번역 | 한국어로 즉시 요약 |

---

## 💡 더 활용하는 방법

- 회사 내부 문서/제안서 분석에도 동일하게 적용 가능
- 경쟁사 IR 자료, 특허 문서, 규정집 빠르게 파악에 최적
- 스터디 그룹에서 논문 토론 자료 준비 시간 90% 절약`,
  },
  {
    title: 'Kling AI로 15초 브랜드 광고 영상 만들기',
    emoji: '🎬',
    difficulty: '입문',
    category: '크리에이티브',
    metric: '영상 제작 비용 $0 · 시간 20분',
    description: '텍스트 프롬프트 하나로 영화 같은 광고 영상이 나왔습니다. Kling 2.0의 카메라 모션 컨트롤로 시네마틱 무빙샷까지.',
    stack: ['Kling AI', 'CapCut', 'ElevenLabs'],
    likes: 267,
    content: `## 🎯 이 실험의 목표
Kling AI 2.0으로 **브랜드 제품 광고 영상 15초**를 텍스트 프롬프트만으로 제작.
전문 영상 장비나 촬영 없이 시네마틱 퀄리티 달성.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| **Kling AI** | 영상 생성 | 무료 (일 66 크레딧) |
| **CapCut** | 편집 + 자막 | 무료 |
| **ElevenLabs** | AI 내레이션 | 무료 (월 10분) |

---

## ✍️ Step 1: 영상 컨셉 기획

15초를 3컷으로 나눈다.

| 컷 | 시간 | 내용 |
|----|------|------|
| 1컷 | 0~5초 | 제품 클로즈업 / 문제 제시 |
| 2컷 | 5~10초 | 사용 장면 |
| 3컷 | 10~15초 | 결과 + 브랜드 로고 |

---

## 🎬 Step 2: Kling으로 영상 생성

**Text to Video** 탭에서 각 컷 프롬프트 입력:

**1컷 프롬프트:**
\`\`\`
A close-up shot of a sleek black coffee cup on a minimalist white desk,
steam rising slowly, morning sunlight through window,
cinematic lighting, shallow depth of field, 4K quality
Camera: slow zoom in
\`\`\`

**2컷 프롬프트:**
\`\`\`
A person's hands wrapping around the coffee cup,
warm and cozy atmosphere, soft bokeh background,
lifestyle product photography style
Camera: subtle handheld motion
\`\`\`

**3컷 프롬프트:**
\`\`\`
Top-down aerial view of the coffee cup with minimal flat lay props,
brand aesthetic, clean composition, warm tones
Camera: slow pull back
\`\`\`

---

## 🎙️ Step 3: ElevenLabs로 내레이션 생성

[elevenlabs.io](https://elevenlabs.io) 접속 → Speech Synthesis

내레이션 텍스트 입력:
> "하루의 시작은 한 잔의 여유에서. 당신의 아침을 더 특별하게."

음성: **Rachel** (따뜻하고 감성적인 톤) 선택 → Generate

---

## ✂️ Step 4: CapCut으로 최종 편집

1. 3개 영상 클립 순서대로 배치
2. ElevenLabs 내레이션 오디오 삽입
3. 자막 자동 생성 → 폰트/색상 브랜드에 맞게 수정
4. 배경음악: CapCut 무료 라이브러리에서 감성 BGM 선택
5. Export 4K

---

## 📊 실험 결과

- 총 제작 시간: **약 20분** (렌더링 포함)
- 비용: **$0** (무료 플랜 활용)
- 클라이언트 반응: "직접 촬영한 줄 알았어요"

---

## 💡 퀄리티 올리는 팁

- 프롬프트에 **카메라 무빙** 명시: \`slow zoom\`, \`pan left\`, \`dolly shot\`
- **Aspect ratio**: 세로형(9:16) 릴스용 / 가로형(16:9) 유튜브용 선택
- 같은 프롬프트로 여러 번 생성해 가장 나은 컷 선택`,
  },
  {
    title: 'Perplexity Deep Research로 시장 조사 보고서 완성',
    emoji: '🔍',
    difficulty: '입문',
    category: '생산성',
    metric: '시장조사 보고서 2일 → 30분',
    description: '"2026년 국내 SaaS 시장 현황 분석해줘"라고 했더니 출처 포함 20페이지 보고서가 30분 만에 나왔습니다.',
    stack: ['Perplexity AI', 'Notion', 'Claude API'],
    likes: 354,
    content: `## 🎯 이 실험의 목표
Perplexity의 **Deep Research** 기능으로 시장 조사 보고서를 자동 생성하고,
Claude로 전문 형식에 맞게 다듬어 실제 업무에 쓸 수 있는 문서를 만든다.

---

## 🛠️ 준비물

- [perplexity.ai](https://perplexity.ai) (Pro 플랜, 월 $20 — Deep Research 기능 필요)
- 노션 또는 문서 편집 도구

---

## 💬 Step 1: Deep Research 쿼리 작성법

Perplexity 검색창 → **Deep Research** 선택

❌ 나쁜 예: "SaaS 시장"
✅ 좋은 예:
\`\`\`
2025~2026년 국내 B2B SaaS 시장 현황 분석:
1. 시장 규모와 성장률
2. 주요 플레이어 현황 (스타트업 포함)
3. 주요 버티컬 (HR, 회계, CRM 등) 점유율
4. 2027년 전망
최신 보도자료, 투자 데이터, 업계 리포트 기반으로 정리해줘.
\`\`\`

Deep Research가 **수십 개의 소스를 자동 크롤링**한 뒤 종합 보고서를 작성한다.
(평균 소요 시간: 3~5분)

---

## 📋 Step 2: 결과물 구조화

Perplexity가 생성한 초안을 Claude에 붙여넣고:

> "이 내용을 컨설팅 보고서 형식으로 재구성해줘.
> 구조: Executive Summary → 시장 현황 → 경쟁 구도 → 기회 요인 → 리스크 → 결론
> 각 섹션마다 인사이트 박스(🔑 Key Insight) 포함"

---

## 🔍 Step 3: 팩트체크 & 보완

생성된 내용 중 의심스러운 수치는 Perplexity에서 재확인:

> "국내 SaaS 시장 규모 2025년 X조원이라는 데이터의 출처와 조사 방법론을 알려줘"

---

## 📊 실험 결과

| 항목 | 기존 방식 | Deep Research |
|------|----------|--------------|
| 소요 시간 | 1~2일 | 30분 |
| 소스 수 | 10~20개 | 60~100개 자동 수집 |
| 출처 명시 | 수동 | 자동 (클릭 가능한 링크) |
| 최신성 | 검색자 역량 의존 | 실시간 웹 크롤링 |

---

## 💡 이런 상황에 써먹는다

- 신규 사업 아이템 타당성 검토
- 투자사 미팅 전 경쟁 시장 파악
- RFP/제안서 시장 배경 섹션 작성
- 주간 업계 동향 브리핑 자료`,
  },
  {
    title: 'Suno AI로 브랜드 BGM 5분 완성',
    emoji: '🎵',
    difficulty: '입문',
    category: '크리에이티브',
    metric: '음악 제작 비용 $0 · 시간 5분',
    description: '작곡 지식 없이 브랜드 감성에 맞는 오리지널 BGM을 Suno로 5분 만에 만들었습니다. 유튜브/릴스/발표자료에 바로 사용.',
    stack: ['Suno AI', 'CapCut'],
    likes: 189,
    content: `## 🎯 이 실험의 목표
Suno AI로 **저작권 걱정 없는 브랜드 전용 BGM**을 5분 만에 제작.
유튜브 채널, SNS 콘텐츠, 발표자료 배경음악으로 즉시 활용.

---

## 🛠️ 준비물

- [suno.com](https://suno.com) (무료: 하루 50 크레딧 = 약 10곡)

---

## 🎼 Step 1: 프롬프트 작성법

**기본 구조:**
\`[장르] [분위기] [악기] [템포] [용도]\`

**예시 프롬프트들:**

\`\`\`
# IT 테크 브랜드용
upbeat corporate tech music, electronic synth, positive energy,
120bpm, professional background music for presentation

# 감성 카페/라이프스타일용
lo-fi chill hop, warm acoustic guitar, cozy afternoon feeling,
slow tempo, youtube background music

# AI/혁신 스타트업용
futuristic electronic, inspiring and motivational, building momentum,
cinematic orchestral synth blend, startup pitch background
\`\`\`

---

## ⚙️ Step 2: Custom Mode로 세밀하게 조정

**Custom** 탭 사용 시:
- **Style of Music**: \`Korean indie pop, minimalist\`
- **Lyrics**: 브랜드 슬로건을 가사로 넣거나 [Instrumental] 입력
- **Title**: 곡명 지정

---

## 🎛️ Step 3: 여러 버전 생성 후 선택

같은 프롬프트로 4~6개 생성 후 가장 맞는 것 선택.
**Extend** 기능으로 30초 → 2분으로 자동 연장 가능.

---

## ✂️ Step 4: CapCut에서 루프 편집

- 인트로/아웃트로 페이드 처리
- 영상 길이에 맞게 반복 루프 설정
- 볼륨 자동화로 말하는 구간에서 BGM 낮아지게 설정

---

## 📊 실험 결과

- 마음에 드는 곡 나올 때까지 시도 횟수: 평균 **3~4회**
- 총 소요 시간: **5~10분**
- 저작권 상태: **Suno 무료 플랜 — 비상업적 사용 무료**

> ⚠️ 상업적 사용은 Pro 플랜($8/월) 필요

---

## 💡 장르별 추천 키워드

| 용도 | 키워드 |
|------|--------|
| 발표/피치덱 | \`corporate inspiring, epic buildup\` |
| 유튜브 인트로 | \`energetic electronic, punchy beat\` |
| 감성 브이로그 | \`acoustic guitar, warm lo-fi\` |
| 제품 데모 영상 | \`tech minimal, clean synth\` |`,
  },
  {
    title: 'Claude 4 + MCP로 나만의 AI 업무 비서 세팅',
    emoji: '🤖',
    difficulty: '중급',
    category: '생산성',
    metric: '반복 업무 시간 70% 단축',
    description: 'Claude 4의 MCP(Model Context Protocol)로 내 캘린더, 이메일, Notion을 연결. "오늘 회의 준비해줘"라고 하면 일정 확인부터 자료 정리까지 자동으로.',
    stack: ['Claude 4', 'MCP', 'Notion', 'Google Calendar'],
    likes: 276,
    content: `## 🎯 이 실험의 목표
Claude의 **MCP(Model Context Protocol)** 를 활용해 실제 업무 툴들과 연결된
개인 AI 비서를 구성한다. 자연어 명령 하나로 여러 앱을 동시에 제어.

---

## 🛠️ 준비물

| 도구 | 역할 |
|------|------|
| **Claude Desktop** (무료 설치) | AI 비서 허브 |
| **MCP 서버** (오픈소스) | 각 앱 연결 브릿지 |
| **Node.js** | MCP 서버 실행 |

---

## ⚙️ Step 1: Claude Desktop + MCP 설치

1. [claude.ai/download](https://claude.ai/download) 에서 Claude Desktop 설치
2. \`claude_desktop_config.json\` 파일 열기:
   - Mac: \`~/Library/Application Support/Claude/\`
   - Windows: \`%APPDATA%\\Claude\\\`

---

## 📅 Step 2: Google Calendar MCP 연결

\`\`\`json
{
  "mcpServers": {
    "google-calendar": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-calendar"],
      "env": {
        "GOOGLE_CLIENT_ID": "your_client_id",
        "GOOGLE_CLIENT_SECRET": "your_secret",
        "GOOGLE_REFRESH_TOKEN": "your_refresh_token"
      }
    }
  }
}
\`\`\`

Google Cloud Console에서 OAuth 2.0 자격증명 발급 후 위 값 채우기.

---

## 📝 Step 3: Notion MCP 연결

\`\`\`json
"notion": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-notion"],
  "env": {
    "NOTION_API_KEY": "secret_xxxxx"
  }
}
\`\`\`

[notion.so/my-integrations](https://www.notion.so/my-integrations) 에서 API 키 발급.

---

## 🚀 Step 4: 실전 활용 명령어

Claude Desktop 실행 후 자연어로 명령:

**미팅 준비:**
> "내일 오후 2시 팀 미팅 전까지 지난주 업무 일지를 Notion에서 찾아서 요약해줘. 캘린더에도 '자료 준비 완료' 일정 추가해줘."

**주간 정리:**
> "이번 주 캘린더 일정을 기반으로 주간 업무 보고서 초안을 작성해서 Notion '주간 보고' 페이지에 저장해줘."

**일정 분석:**
> "다음 달 내 캘린더에서 가장 바쁜 3일을 찾아서 그 주에 집중 업무 블록을 만들어줘."

---

## 📊 실험 결과

- 주간 보고서 작성 시간: **45분 → 5분**
- 미팅 준비 시간: **30분 → 3분**
- 이메일 초안 작성: **10분 → 1분**
- 전체 반복 업무 시간 절감: **주 7~8시간**

---

## 💡 추가 MCP 서버 추천

| MCP | 기능 |
|-----|------|
| \`@mcp/filesystem\` | 로컬 파일 읽기/쓰기 |
| \`@mcp/github\` | PR, 이슈 관리 |
| \`@mcp/slack\` | 채널 메시지 관리 |
| \`@mcp/browser\` | 웹 자동화 |`,
  },
];

async function main() {
  const admin = await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' },
  });

  if (!admin) {
    throw new Error('유저가 없습니다. seed를 먼저 실행해주세요.');
  }

  console.log(`✅ admin 유저 확인: ${admin.email}`);

  for (const lab of NEW_LABS) {
    const created = await prisma.experiment.create({
      data: {
        ...lab,
        authorId: admin.id,
      },
    });
    console.log(`✅ 추가: [${created.category}] ${created.title}`);
  }

  console.log(`\n🎉 총 ${NEW_LABS.length}개 실험 추가 완료`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
