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
    title: 'AI로 나만의 굿즈 만들고 오늘 판매 시작하기',
    emoji: '🛍️',
    difficulty: '입문',
    category: '크리에이티브',
    metric: '아이디어 → 실제 판매 시작까지 3시간',
    description: 'Midjourney로 디자인 뽑고, Printify에 올리고, Etsy에 판매 등록까지. 초기 비용 $0, 재고 없이 오늘 당장 굿즈 셀러가 되는 완전 가이드입니다.',
    stack: ['Midjourney', 'Recraft', 'Adobe Firefly', 'Printify', 'Canva AI'],
    likes: 0,
    color: 'from-orange-400 to-pink-500',
    content: `## 🎯 이 실험의 목표

AI 이미지 도구로 **나만의 오리지널 디자인**을 만들고,
POD(Print-On-Demand) 서비스를 연결해 **실제 판매 가능한 굿즈**를 오늘 바로 런칭한다.
초기 투자 비용 $0, 재고 보유 없이 주문이 오면 자동 제작·배송.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| **Midjourney** | 굿즈 메인 디자인 생성 | 무료 체험 / $10/월 |
| **Recraft** | 벡터(SVG) 변환 & 배경 제거 | 무료 |
| **Canva AI** | 목업 합성 & 상품 이미지 제작 | 무료 |
| **Printify** | POD 인쇄·제작·배송 플랫폼 | 무료 (수수료 방식) |
| **Etsy / 스마트스토어** | 판매 채널 | 등록비 $0.20/건 |

---

## 💡 Step 0: 어떤 굿즈를 만들까?

### AI가 잘 팔리는 디자인 유형 분석

Printify 베스트셀러 카테고리:

| 제품 | 추천 디자인 | 마진 |
|------|------------|------|
| **스티커 팩** | 귀여운 캐릭터, 밈, 명언 | 70~80% |
| **머그컵** | 유머 문구, 미니멀 일러스트 | 50~65% |
| **에코백** | 감성 타이포그래피, 자연 모티브 | 55~70% |
| **티셔츠** | 팝아트, 추상화, 유니크 그래픽 | 40~55% |
| **폰케이스** | 컬러풀 패턴, 개인화 텍스트 | 60~75% |

---

## 🎨 Step 1: Midjourney로 디자인 생성

### 굿즈용 프롬프트 핵심 규칙

\`\`\`
기본 구조:
[주제/컨셉] [스타일] [배경 처리] [해상도 옵션]
\`\`\`

**스티커용 프롬프트 예시:**
\`\`\`
Cute tiny capybara holding a coffee cup, kawaii style illustration,
sticker design, clean white background, vector art style,
bold outlines, pastel colors --ar 1:1 --v 6.1 --style raw
\`\`\`

**머그컵 패턴용 프롬프트:**
\`\`\`
Seamless pattern of minimalist coffee and book illustrations,
line art style, cream and navy color palette,
flat design, repeating pattern, white background --ar 2:1 --tile
\`\`\`

**타이포그래피 티셔츠용 프롬프트:**
\`\`\`
"Powered by Caffeine and Chaos" typography design,
hand-lettered style, bold sans-serif mixed with script,
black ink on white, t-shirt graphic design,
no background --ar 1:1
\`\`\`

> 💡 **팁**: \`--no background\`, \`white background\` 옵션을 꼭 추가해야 배경 제거가 쉬워진다.

---

## ✂️ Step 2: Recraft로 벡터 변환 & 배경 제거

Printify는 **고해상도 PNG (300 DPI 이상)** 를 요구한다.

1. **recraft.ai** 접속 → \`Vectorize\` 탭
2. Midjourney 생성 이미지 업로드
3. 자동으로 SVG 벡터 파일로 변환
4. \`Remove Background\` → 투명 배경 PNG 다운로드 (4000px 이상)

### 대안: Adobe Firefly 활용

Adobe Express에서 \`Remove background\` 클릭 한 번으로 배경 제거 가능.
투명 배경 상태에서 색상 보정 및 크기 조정 후 저장.

---

## 🖼️ Step 3: Canva AI로 상품 목업 이미지 제작

실제 판매할 때 소비자가 보는 '상품 이미지'가 매출을 결정한다.

1. Canva → 검색창에 \`Mockup\` 입력
2. 머그컵, 티셔츠 등 원하는 목업 템플릿 선택
3. 내 디자인 파일 업로드 후 목업에 배치
4. **Magic Edit**으로 배경을 감성적인 카페/아웃도어 장면으로 교체

**AI 배경 생성 프롬프트 예시:**
\`\`\`
Cozy morning coffee shop, warm sunlight, bokeh effect,
lifestyle product photography style
\`\`\`

---

## 🏭 Step 4: Printify에 상품 등록

1. **printify.com** 가입 → \`Create product\`
2. 카탈로그에서 제품 선택 (제조사, 배송 지역 비교 후 선택)
3. 디자인 업로드 → 위치/크기 조정
4. 가격 설정: **내 수익 목표 = 판매가 - Printify 제조비**

\`\`\`
예시: 머그컵
- Printify 제조비: $4.49
- 내 판매가 설정: $18.99
- 내 수익: $14.50 (76%)
\`\`\`

5. 상품 설명 자동 생성 (ChatGPT 활용):
\`\`\`
이 머그컵 굿즈의 Etsy 상품 설명을 작성해줘.
감성적이고 구매 욕구를 자극하는 톤. 영어로, SEO 키워드 포함.
디자인 컨셉: [내 디자인 설명]
\`\`\`

---

## 🛒 Step 5: 판매 채널 연동

### Etsy 연동 (글로벌 판매)
1. Etsy 셀러 계정 생성
2. Printify 대시보드 → \`Sales channels\` → Etsy 연결
3. 상품 자동 싱크 → 주문 발생 시 Printify가 자동 제작·발송

### 스마트스토어 (국내 판매)
- 상품 이미지와 설명 복사 후 수동 등록
- 배송은 국내 POD 업체 (마플샵, 위드아이템) 활용

---

## 📊 실험 결과 (실제 케이스)

| 제품 | 디자인 시간 | 등록 시간 | 첫 주문까지 |
|------|------------|----------|-----------|
| 카피바라 스티커 팩 | 45분 | 20분 | 3일 |
| 커피 머그컵 | 30분 | 15분 | 5일 |
| 에코백 (타이포) | 20분 | 15분 | 4일 |

- 전체 준비 시간: **약 3시간**
- 초기 비용: **$0** (Printify 기본 무료)
- 첫 달 수익 (스티커 6개 팩 x 12건): **$87**

---

## 💡 빠르게 팔리는 디자인 전략

**1. 트렌드 서핑**
- Google Trends, Etsy Best Sellers, Pinterest 트렌드 확인
- 계절/이벤트 테마: 크리스마스, 졸업, 새해 굿즈는 시즌 전 2달 먼저 준비

**2. 니치 마켓 공략**
\`\`\`
❌ "강아지 그림 머그컵"  →  경쟁 많음
✅ "닥스훈트 좋아하는 독서광을 위한 머그컵"  →  타겟 명확
\`\`\`

**3. SEO 키워드 (Etsy 검색 최적화)**
Claude에게 요청:
> "Etsy에서 '커피 머그컵'을 검색하는 구매자가 쓸 법한 롱테일 키워드 20개 뽑아줘"

---

## 🔥 응용: AI로 굿즈 라인업 확장

마음에 드는 디자인 하나를 모든 제품에 적용:
- 머그컵 → 폰케이스 → 쿠션 → 포스터 → 캔버스 → 노트북 스킨
Printify에서 같은 디자인 파일로 10개 제품 동시 등록 가능.`,
  },

  {
    title: 'AI 디자이너 되어보기 — 로고부터 브랜드 아이덴티티까지',
    emoji: '🎨',
    difficulty: '입문',
    category: '크리에이티브',
    metric: '브랜드 아이덴티티 패키지 디자이너 의뢰비 $0 · 2시간 완성',
    description: 'Midjourney, Recraft, Canva AI, Adobe Firefly를 조합해 로고 · 컬러팔레트 · 타이포그래피 · 명함 · SNS 키트까지 완성된 브랜드 디자인 패키지를 혼자 만들어봅니다.',
    stack: ['Midjourney', 'Recraft', 'Canva AI', 'Adobe Firefly', 'Ideogram'],
    likes: 0,
    color: 'from-violet-400 to-pink-400',
    content: `## 🎯 이 실험의 목표

AI 디자인 도구들을 체계적으로 조합해 **완성된 브랜드 아이덴티티 패키지**를 만든다.
디자인 경력 없이도 전문 디자이너가 수백만 원을 받고 납품하는 수준의 결과물 완성.

> **완성 목표물**: 로고 + 컬러 팔레트 + 타이포그래피 가이드 + 명함 + 소셜 미디어 키트

---

## 🛠️ 도구별 역할 분담

| 도구 | 담당 역할 |
|------|-----------|
| **Midjourney** | 로고 컨셉 & 브랜드 무드 이미지 생성 |
| **Ideogram** | 텍스트가 들어간 워드마크 로고 생성 |
| **Recraft** | 벡터 변환 & SVG 로고 추출 |
| **Adobe Firefly** | 브랜드 목업 & 배경 생성 |
| **Canva AI** | 명함 · SNS 키트 템플릿 완성 |

---

## 📋 Step 0: 브랜드 컨셉 정의 (Claude 활용)

디자인 시작 전 Claude에게 브랜드 방향을 잡아달라고 요청한다.

\`\`\`
다음 정보를 바탕으로 브랜드 아이덴티티 디자인 브리프를 작성해줘:

브랜드명: [이름]
업종/서비스: [설명]
타겟 고객: [연령, 성향]
브랜드 키워드 3개: [예: 신뢰, 혁신, 친근함]
참고하고 싶은 브랜드: [예: Notion, Linear, Apple]

출력:
1. 브랜드 포지셔닝 한 줄
2. 로고 방향 (심볼형/워드마크/조합형)
3. 컬러 팔레트 추천 (Hex 코드 포함)
4. 타이포그래피 추천 (구글 폰트 이름)
5. Midjourney 로고 프롬프트 3개
\`\`\`

---

## 🖼️ Step 1: Midjourney로 로고 컨셉 탐색

Claude가 뽑아준 프롬프트를 Midjourney에 입력:

**예시 — 테크 스타트업 브랜드:**
\`\`\`
Minimal logo design for tech startup called "Lumina",
abstract geometric symbol, electric blue and white,
clean vector style, professional, modern SaaS brand identity,
white background --ar 1:1 --v 6.1 --style raw
\`\`\`

**예시 — 로컬 카페 브랜드:**
\`\`\`
Hand-crafted logo for artisan coffee shop "Morgen",
vintage badge style, warm brown and cream tones,
serif typography mixed with coffee bean illustration,
circular emblem, white background --ar 1:1
\`\`\`

> 💡 **팁**: \`--style raw\`는 창의적 해석 없이 프롬프트를 정직하게 반영해 로고에 적합하다.

4개 결과물 중 방향성이 맞는 것 선택 → \`Vary (Subtle)\`로 10~20개 변형 생성

---

## ✍️ Step 2: Ideogram으로 워드마크 로고 생성

텍스트가 명확하게 들어간 로고는 Midjourney보다 **Ideogram**이 훨씬 정확하다.

\`\`\`
Wordmark logo "Lumina" in custom sans-serif typeface,
electric blue gradient, minimalist, tech brand,
clean white background, professional logo design
\`\`\`

- 마음에 드는 폰트 스타일 선택
- \`Remix\` 기능으로 폰트 굵기, 자간, 색상 조정

---

## 🎨 Step 3: 브랜드 컬러 팔레트 확정

Claude가 추천한 컬러를 실제로 시각화:

1. **Coolors.co** → Claude 추천 Hex 코드 입력
2. 팔레트 조화 여부 확인 & 미세 조정
3. 최종 팔레트 확정:

\`\`\`
Primary:   #2563EB (Electric Blue)
Secondary: #F0F9FF (Ice White)
Accent:    #7C3AED (Violet)
Neutral:   #1E293B (Slate Dark)
Background: #FFFFFF
\`\`\`

---

## ✂️ Step 4: Recraft로 벡터 로고 추출

Midjourney 결과물은 픽셀 이미지. 확대해도 깨지지 않는 벡터로 변환이 필수.

1. **recraft.ai** → \`Vectorize\` 업로드
2. SVG 파일 다운로드 (인쇄용, 웹용 모두 사용 가능)
3. 배경 제거 → 투명 PNG 버전도 저장

**최종 로고 파일 세트:**
- \`logo-primary.svg\` (컬러 버전)
- \`logo-white.svg\` (반전 버전, 어두운 배경용)
- \`logo-black.svg\` (단색 버전, 팩스/각인용)
- \`logo-transparent.png\` (웹 헤더용, 4000px)

---

## 📇 Step 5: Canva AI로 명함 & 브랜드 키트 제작

### 명함 제작
1. Canva → \`명함\` 검색 → 템플릿 선택
2. 로고 업로드 → 브랜드 컬러로 색상 교체
3. **Magic Edit**: "배경을 [Primary Color] 그라디언트로 바꿔줘"
4. 양면 명함: 앞면(로고+이름) / 뒷면(브랜드 패턴)

### SNS 프로필 키트
Canva에서 한 번에 여러 사이즈 생성:

| 항목 | 사이즈 |
|------|--------|
| 인스타그램 프로필 | 1:1 (1080×1080) |
| 인스타그램 스토리 | 9:16 (1080×1920) |
| 링크드인 배너 | 1584×396 |
| 유튜브 채널아트 | 2560×1440 |
| 트위터 헤더 | 1500×500 |

**Magic Design 활용:**
> "이 로고를 중심으로 미니멀하고 프로페셔널한 인스타그램 프로필 이미지 만들어줘"

---

## 🏆 Step 6: 브랜드 가이드라인 문서 완성

Claude에게 최종 정리 요청:

\`\`\`
우리 브랜드 가이드라인 문서를 작성해줘:
브랜드명: [이름]
로고: [설명]
컬러: [Hex 코드들]
폰트: [이름들]
톤앤매너: [키워드들]

포함 내용:
1. 브랜드 스토리 (2문단)
2. 로고 사용 규칙 (해도 되는 것 / 하면 안 되는 것)
3. 컬러 사용 가이드
4. 카피라이팅 톤 예시 (좋은 예 / 나쁜 예)
\`\`\`

Notion에 붙여넣어 팀과 공유하면 완성.

---

## 📊 실험 결과

| 항목 | 기존 방식 | AI 활용 |
|------|----------|---------|
| 로고 디자인 | 디자이너 의뢰 $300~800, 1~2주 | 2시간, $0 |
| 브랜드 가이드 | 추가 $200~500 | 30분, $0 |
| 명함 디자인 | $50~150 | 20분, $0 |
| SNS 키트 | $100~300 | 30분, $0 |
| **총계** | **$650~1,800 / 2~4주** | **$0 / 3시간** |

---

## 💡 디자이너처럼 생각하는 3가지 원칙

**1. 여백을 두려워하지 말 것**
로고, 명함 모두 여백(White Space)이 많을수록 고급스럽다.
프롬프트에 \`minimal\`, \`clean\`, \`lots of white space\` 추가.

**2. 컬러는 3개 이하로**
Primary 1개 + Accent 1개 + Neutral 1개 공식을 지키면 실패가 없다.

**3. 폰트 2개 조합 법칙**
- 제목: 굵은 Sans-serif (Sora, Plus Jakarta Sans)
- 본문: 가벼운 Sans-serif 또는 Serif (Inter, Lora)
절대 3개 이상 혼용하지 않는다.`,
  },

  {
    title: 'AI 기획자 되어보기 — PRD부터 MVP 로드맵까지',
    emoji: '📋',
    difficulty: '중급',
    category: '생산성',
    metric: '제품 기획서 작성 2주 → 하루 완성',
    description: 'Claude, Perplexity, Gamma를 조합해 시장 분석 → 사용자 페르소나 → PRD → 와이어프레임 개요 → MVP 로드맵까지 실제 기획자 수준의 산출물을 하루 만에 완성합니다.',
    stack: ['Claude', 'Perplexity AI', 'Gamma', 'ChatGPT', 'Notion AI'],
    likes: 0,
    color: 'from-sky-400 to-indigo-500',
    content: `## 🎯 이 실험의 목표

AI를 활용해 아이디어 단계의 제품을 **실제 개발팀에 넘길 수 있는 수준의 기획 산출물**로 만든다.

> **완성 목표 산출물**:
> 1. 시장 분석 보고서
> 2. 사용자 페르소나 (3종)
> 3. PRD (Product Requirements Document)
> 4. 유저 스토리 & 기능 명세
> 5. MVP 우선순위 로드맵
> 6. 경쟁사 포지셔닝 맵

---

## 🛠️ 도구별 역할

| 도구 | 기획 담당 영역 |
|------|--------------|
| **Perplexity AI** | 시장 조사 & 경쟁사 분석 (최신 데이터) |
| **Claude** | PRD 작성, 유저 스토리, 로드맵 구조화 |
| **ChatGPT** | 페르소나 생성, 창의적 네이밍/포지셔닝 |
| **Gamma** | 기획서 프레젠테이션 자동 완성 |
| **Notion AI** | 산출물 정리 & 문서화 |

---

## 🔍 Step 1: Perplexity로 시장 분석 (30분)

Deep Research 모드로 시장을 먼저 파악한다.

**프롬프트 템플릿:**
\`\`\`
[제품 아이디어]에 대한 시장 분석을 해줘:

1. 글로벌 및 국내 시장 규모 (2024~2026년)
2. 주요 경쟁 제품 5개와 각각의 강점/약점
3. 현재 시장의 주요 Pain Point (사용자 리뷰, 커뮤니티 분석 기반)
4. 최근 12개월 주요 트렌드 변화
5. 이 시장의 기회 요인과 위협 요인

출처 링크 포함, 최신 데이터 우선
\`\`\`

**결과 정리:**
Perplexity 결과를 Claude에 붙여넣고:
> "이 내용을 SWOT 분석 프레임워크로 정리하고, 한 페이지 Executive Summary로 압축해줘"

---

## 👥 Step 2: 사용자 페르소나 3종 생성 (20분)

ChatGPT에게 구체적인 페르소나를 요청:

\`\`\`
[제품명]의 핵심 타겟 사용자 페르소나를 3개 만들어줘.
각 페르소나마다 다음을 포함:

- 이름 / 나이 / 직업
- 하루 일과 (타임라인 형식)
- 핵심 목표 2가지
- 주요 불편함(Pain Points) 3가지
- 현재 사용 중인 대안 솔루션
- 이 제품에서 기대하는 핵심 가치
- 인용할 만한 가상의 한마디 (Quote)
- 기술 친숙도 (1~5점)
- 구매 결정 시 가장 중요시하는 것

페르소나가 서로 다른 직군/상황을 대표하도록 구성해줘.
\`\`\`

---

## 📄 Step 3: Claude로 PRD 초안 작성 (45분)

Product Requirements Document는 개발팀과의 계약서다.

**Claude 프롬프트:**
\`\`\`
다음 정보를 바탕으로 PRD(Product Requirements Document)를 작성해줘:

제품명: [이름]
한 줄 정의: [설명]
타겟 사용자: [페르소나 요약]
핵심 문제: [Pain Point]
해결 방법: [솔루션 개요]
성공 지표(KPI): [목표 수치]

PRD 구성:
1. Problem Statement (문제 정의)
2. Solution Overview (솔루션 개요)
3. User Stories (Epic → Story → 인수 조건)
4. Functional Requirements (기능 요구사항, MoSCoW 우선순위)
5. Non-Functional Requirements (성능, 보안, 확장성)
6. Out of Scope (이번 버전에서 제외)
7. Success Metrics (측정 방법 포함)
8. Assumptions & Risks

각 기능에 Must/Should/Could/Won't 라벨 붙여줘.
\`\`\`

---

## 📝 Step 4: 유저 스토리 & 기능 명세 세분화 (30분)

PRD의 각 기능을 개발 가능한 단위로 쪼개기:

\`\`\`
위 PRD의 [핵심 기능명] Epic을 개발팀이 바로 작업할 수 있는 수준으로 세분화해줘:

각 User Story 형식:
"[페르소나]로서, 나는 [행동]을 하고 싶다. 왜냐하면 [목표] 때문이다."

인수 조건(Acceptance Criteria):
- Given: [상황]
- When: [행동]
- Then: [결과]

예상 개발 포인트 (SP/시간 단위로):
- 프론트엔드: [시간]
- 백엔드: [시간]
- 디자인: [시간]
\`\`\`

---

## 🗺️ Step 5: MVP 로드맵 구성 (20분)

\`\`\`
위 기능 목록을 기반으로 3개월 MVP 로드맵을 만들어줘:

조건:
- 팀 규모: 개발 2명, 디자이너 1명, 기획 1명
- 기간: 3개월 (스프린트 2주 단위)
- MVP 목표: 핵심 가치 전달 + 초기 사용자 100명 확보

출력:
- 스프린트별 목표와 주요 기능 목록
- 각 스프린트의 완료 기준(Definition of Done)
- 의존성 관계 (선행되어야 하는 작업)
- 리스크 항목과 완충 시간
\`\`\`

---

## 📊 Step 6: 경쟁사 포지셔닝 맵 분석

\`\`\`
[경쟁사 리스트]를 다음 두 축으로 포지셔닝 매핑해줘:

X축: [가격 저렴 ←→ 가격 프리미엄]
Y축: [기능 단순 ←→ 기능 복잡]

각 경쟁사 위치 설명 + 우리 제품이 노릴 빈 공간(White Space) 제안
\`\`\`

---

## 🎯 Step 7: Gamma로 기획 발표 자료 완성 (15분)

1. **gamma.app** 접속 → \`Generate a presentation\`
2. 위에서 만든 PRD 핵심 내용 붙여넣기
3. 슬라이드 구성 자동 제안:
   - 문제 정의 → 시장 기회 → 솔루션 → 페르소나 → 기능 → 로드맵 → 팀/리소스

**Gamma 커스터마이징:**
- 브랜드 컬러 적용
- 도표/차트 자동 생성
- 출력: PDF, 웹 링크, PPT 모두 지원

---

## 📊 실험 결과

| 산출물 | 기존 소요 시간 | AI 활용 |
|--------|--------------|---------|
| 시장 분석 | 3~5일 | 30분 |
| 페르소나 | 1~2일 | 20분 |
| PRD 초안 | 3~5일 | 45분 |
| 유저 스토리 | 2~3일 | 30분 |
| 로드맵 | 1~2일 | 20분 |
| 발표 자료 | 1일 | 15분 |
| **전체** | **약 2주** | **약 3시간** |

---

## 💡 실제 기획자가 AI를 쓰는 방식

**1. AI는 초안 기계, 판단은 내가**
AI가 뽑은 PRD를 그대로 쓰지 않는다.
"이 기능이 정말 MVP에 필요한가?"를 스스로 검토하는 과정이 핵심.

**2. 사용자 인터뷰는 AI가 대체 불가**
AI 페르소나는 가설이다. 실제 잠재 사용자 5명 인터뷰로 반드시 검증.
(인터뷰 질문도 Claude가 만들어준다)

**3. 팀원에게 공유 전 검토 체크리스트**
Claude에게 요청:
> "이 PRD에서 개발팀이 헷갈릴 수 있는 모호한 요구사항을 찾아서 명확하게 수정해줘"

---

## 🔥 기획자 AI 활용 심화 팁

**피드백 루프 자동화:**
\`\`\`
사용자 인터뷰 녹취록을 붙여넣을게.
핵심 Pain Point와 Gain을 추출하고,
현재 PRD에서 보완해야 할 항목을 찾아줘.
\`\`\`

**우선순위 결정 프레임워크:**
\`\`\`
다음 기능 목록에 RICE Score를 적용해줘:
(Reach × Impact × Confidence) ÷ Effort
각 기능에 점수 제안과 이유 포함
\`\`\``,
  },
];

async function main() {
  const admin = await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' },
  });

  if (!admin) {
    throw new Error('유저가 없습니다.');
  }

  console.log(`✅ admin 유저: ${admin.email}`);
  console.log(`🌱 실험 Lab ${NEW_LABS.length}개 추가 시작\n`);

  for (const lab of NEW_LABS) {
    const existing = await prisma.experiment.findFirst({
      where: { title: lab.title },
    });

    if (existing) {
      await prisma.experiment.update({ where: { id: existing.id }, data: lab });
      console.log(`  ↺ 업데이트: ${lab.emoji} ${lab.title}`);
    } else {
      await prisma.experiment.create({
        data: { ...lab, authorId: admin.id },
      });
      console.log(`  ✅ 추가: ${lab.emoji} ${lab.title}`);
    }
  }

  const total = await prisma.experiment.count();
  console.log(`\n🎉 완료! DB 총 실험 수: ${total}개`);
}

main()
  .catch((e) => { console.error('❌ 오류:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
