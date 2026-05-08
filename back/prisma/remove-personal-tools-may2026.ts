// @ts-nocheck
/**
 * remove-personal-tools-may2026.ts
 *
 * 목적: Experiment(실험실) 콘텐츠에서 사이트 운영자만 보유한
 * "유료 구독 AI 도구"(ChatGPT Plus/Claude Pro/Gemini Pro/Perplexity Pro 등) 언급을
 * 모두 방문자가 무료로 쓸 수 있는 대안으로 교체한다.
 *
 * 정책:
 *  - ChatGPT(무료 GPT-4o mini), Claude(claude.ai 무료), Gemini(무료),
 *    Perplexity(무료), Suno(50/일 무료), Kling(66/일 무료) 등 "무료 플랜"은 OK.
 *  - "Plus / Pro / Advanced / 구독" 언급은 모두 제거하거나 무료 한도 안내로 대체.
 *  - "ChatGPT (DALL-E 3)" / "DALL-E 3"는 Ideogram·Adobe Firefly·Recraft로 교체.
 *  - "Cursor"(유료 $20/월)는 stack에서 제거하고 본문은 Claude Code/VSCode 가이드로 통일.
 *  - "Sora 2"(유료) 언급은 모두 제거.
 *  - "보유" / "이미 보유" 표시는 "무료" 표시로 변경.
 *
 * 사용:
 *   npx ts-node prisma/remove-personal-tools-may2026.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type LabPatch = {
  id: string;
  title: string;
  stack: string[];
  content: string;
};

/**
 * 실험실별 명시적 패치 (id 기준)
 * 데이터 dump를 직접 검토한 결과를 반영.
 */
const PATCHES: LabPatch[] = [
  // ──────────────────────────────────────────────────────────────────────
  // 1) AI로 나만의 굿즈 만들고 오늘 판매 시작하기
  // ──────────────────────────────────────────────────────────────────────
  {
    id: '7e47cb4d-7883-4e61-9e1c-2e7ea9b450a0',
    title: 'AI로 나만의 굿즈 만들고 오늘 판매 시작하기',
    stack: ['Ideogram', 'Adobe Firefly', 'Recraft', 'Printify', 'Canva'],
    content: `## 🎯 이 실험의 목표

AI 이미지 도구로 **나만의 오리지널 디자인**을 만들고,
POD(Print-On-Demand) 서비스를 연결해 **실제 판매 가능한 굿즈**를 오늘 바로 런칭한다.
초기 투자 비용 **$0**, 재고 보유 없이 주문이 오면 자동 제작·배송.

---

## 💸 비용 총정리 — 전부 무료로 가능

| 도구 | 무료 한도 | 유료 업그레이드 필요? |
|------|----------|---------------------|
| **Ideogram** | 하루 25장 무료 | ❌ 무료로 충분 |
| **Adobe Firefly** | 월 25 크레딧 무료 | ❌ 무료로 충분 |
| **Recraft** | 하루 50장 무료 + 벡터 변환 | ❌ 무료로 충분 |
| **Canva** | 무료 플랜으로 목업 제작 | ❌ 무료 가능 |
| **Printify** | 수수료 방식, 가입비 없음 | ❌ 무료 |
| **Etsy** | 등록비 $0.20/건만 발생 | ✅ $0.20 정도만 |

> 💡 **유료 구독은 필요 없습니다.** Ideogram + Adobe Firefly + Recraft 조합만으로 동급 결과물이 나옵니다.

---

## 💡 Step 0: 어떤 굿즈가 잘 팔릴까?

잘 팔리는 굿즈는 **니치 타겟 + 명확한 감성**이 핵심.

| 제품 | 추천 디자인 | 예상 마진 |
|------|------------|----------|
| **스티커 팩** | 귀여운 캐릭터, 밈, 명언 | 70~80% |
| **머그컵** | 유머 문구, 미니멀 일러스트 | 50~65% |
| **에코백** | 감성 타이포그래피 | 55~70% |
| **티셔츠** | 팝아트, 추상화 그래픽 | 40~55% |
| **폰케이스** | 컬러풀 패턴 | 60~75% |

\`\`\`
❌ "강아지 그림 머그컵" → 경쟁 수만 개
✅ "닥스훈트 집사를 위한 월요일 생존 머그컵" → 타겟 명확
\`\`\`

---

## 🎨 Step 1: Ideogram으로 디자인 생성

[ideogram.ai](https://ideogram.ai) 접속 (Google 계정으로 무료 가입, 하루 25장).

**스티커용 프롬프트:**
\`\`\`
Cute kawaii capybara holding a coffee cup, sticker design,
clean white background, bold black outlines, pastel colors,
flat illustration style, transparent-ready design.
Make it look like a professional sticker pack item.
\`\`\`

**머그컵 문구 디자인:**
\`\`\`
Typography design: "Powered by Caffeine & Chaos",
hand-lettered bold font mixed with script,
black ink style on white background, t-shirt / mug graphic design,
no decorative elements except subtle coffee cup icon
\`\`\`

**패턴 (에코백·쿠션용):**
\`\`\`
Seamless repeating pattern of tiny minimalist coffee cups and books,
line art style, navy and cream color palette, flat design,
white background, tile-ready pattern for fabric printing
\`\`\`

> 💡 **핵심 팁**: 반드시 \`white background\`, \`clean background\` 포함.
> Ideogram은 \`Remix\` 버튼으로 색상/스타일 변형이 매우 쉽다.

---

## ✍️ Step 2: 텍스트 로고는 Ideogram Design 모드로

브랜드명이나 문구가 들어가는 디자인은 Ideogram의 **Style → Design** 모드가 최적.

\`\`\`
"COFFEE CHAOS" wordmark logo design,
bold condensed sans-serif font, espresso brown and cream,
minimal badge style, clean white background,
suitable for mug and tote bag printing
\`\`\`

- 오른쪽 패널에서 Style → **Design** 선택 시 로고에 최적화된 결과 출력
- \`Remix\` 버튼으로 폰트/색상 빠르게 변형
- 하루 25장 무료, 충분히 여러 버전 시도 가능

상업적 사용이 걱정되면 **Adobe Firefly** ([firefly.adobe.com](https://firefly.adobe.com), 월 25 크레딧 무료)를 함께 쓰면 안전하다. Adobe Stock 학습 데이터라 저작권 클리어.

---

## ✂️ Step 3: Recraft로 벡터 변환 (배경 제거 포함)

Printify는 **300 DPI 이상 고해상도 PNG**가 필요.
픽셀 이미지를 벡터로 변환하고 배경을 제거한다.

1. [recraft.ai](https://recraft.ai) 접속 (무료 가입)
2. 상단 메뉴 → **Vectorize** 탭
3. Ideogram 또는 Firefly 이미지 업로드
4. 자동으로 SVG 벡터 변환 → 다운로드
5. **Remove Background** → 투명 PNG 저장 (최소 4000×4000px 권장)

**최종 파일 세트 (모두 저장):**
- \`design-color.svg\` — 컬러 벡터 (확대해도 깨짐 없음)
- \`design-transparent.png\` — 투명 배경 PNG (Printify 업로드용)
- \`design-white.png\` — 흰 배경 버전 (미리보기용)

---

## 🖼️ Step 4: Canva로 상품 목업 이미지 제작

판매 페이지 이미지가 매출의 70%를 결정한다.
실제 촬영 없이 Canva 무료 목업으로 완성.

1. **[canva.com](https://canva.com)** → 검색창에 \`Mockup\` 입력
2. 원하는 제품 목업 템플릿 선택 (머그컵, 티셔츠, 에코백 등)
3. 내 디자인 파일 업로드 → 목업에 배치
4. 배경을 감성적인 장면으로 바꾸기:
   - **Edit photo → Smart Mockup → AI background** 활용
   - 또는: Adobe Firefly에서 배경 이미지 생성 후 합성

**Firefly 배경 생성 프롬프트:**
\`\`\`
Cozy morning coffee shop interior, warm golden hour light,
blurred bokeh background, lifestyle product photography style,
no people, horizontal composition, high quality
\`\`\`

---

## 🏭 Step 5: Printify 상품 등록

1. **[printify.com](https://printify.com)** 무료 가입
2. \`Create product\` → 카탈로그에서 제품 선택
   - 제조사별 배송 지역, 가격, 품질 비교 후 선택
   - 국내 배송: **Printful 한국 파트너** 또는 **마플샵** 추천
3. 투명 PNG 업로드 → 위치·크기 조정 → 프리뷰 확인
4. **가격 계산:**

\`\`\`
머그컵 예시:
- Printify 제조비: $4.49 (약 6,000원)
- 내 판매가: $18.99 (약 26,000원)
- 내 수익: $14.50 (약 20,000원, 마진 76%)
\`\`\`

5. **상품 설명 자동 생성** — Claude.ai 무료 플랜 또는 Gemini 무료에 요청:
\`\`\`
Etsy 상품 설명을 영어로 작성해줘.
제품: 커피 테마 머그컵
디자인: "Powered by Caffeine & Chaos" 타이포그래피
타겟: 커피 좋아하는 직장인, 재치있는 선물 찾는 사람
톤: 유머러스하고 친근하게
SEO 키워드 포함, 150단어 이내
\`\`\`

---

## 🛒 Step 6: 판매 채널 연동

### Etsy (글로벌 판매 — 추천)
1. [etsy.com/sell](https://etsy.com/sell) → 셀러 계정 생성
2. Printify 대시보드 → \`Sales channels\` → Etsy 연결
3. 상품 자동 싱크 → **주문 발생 시 Printify가 자동 제작·발송**
4. 등록비: 상품 1개당 $0.20 (약 280원)

### 마플샵 (국내 판매 — 한국어 환경)
- [marpple.shop](https://marpple.shop) — 한국 POD 서비스
- 스티커, 폰케이스, 에코백 등 국내 제작·배송
- 별도 적립금 등록 없이 판매 시작 가능
- 마플샵 자체 쇼핑몰 + 스마트스토어 동시 연동 가능

---

## 📊 실제 케이스 결과

| 제품 | AI 디자인 시간 | 등록 소요 | 첫 주문까지 |
|------|--------------|---------|-----------|
| 카피바라 스티커 팩 (4종) | 40분 | 25분 | 3일 |
| 커피 타이포 머그컵 | 25분 | 15분 | 5일 |
| 미니멀 감성 에코백 | 30분 | 20분 | 4일 |

- **전체 준비 시간: 약 2~3시간**
- **초기 비용: $0** (Etsy 등록비 $0.20만 발생)
- **첫 달 수익 사례**: 스티커 6종 세트 x 9건 = 약 $90

---

## 🔥 빠르게 팔리는 전략 3가지

**1. 트렌드 서핑 — Gemini 무료에게 물어보기**
\`\`\`
Etsy에서 2026년 5월 기준 잘 팔리는 굿즈 디자인 트렌드를 알려줘.
머그컵/스티커 카테고리 중심으로, 아직 경쟁이 적은 니치 아이디어 10개 제안해줘.
\`\`\`

**2. 같은 디자인으로 모든 제품 확장**
하나의 디자인 → 머그컵 + 폰케이스 + 에코백 + 쿠션 + 포스터 동시 등록
Printify에서 디자인 파일 1개로 10가지 제품 한 번에 생성 가능.

**3. SEO 키워드 최적화**
\`\`\`
Etsy에서 "funny coffee mug" 검색 시 뜨는 상품들의 공통 키워드를 분석하고,
내 상품 제목과 태그에 넣을 상위 15개 키워드를 추천해줘
\`\`\``,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 2) AI 디자이너 되어보기 — 로고부터 브랜드 아이덴티티까지
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'c21420fe-596b-473f-9d4f-42dd20b27ed5',
    title: 'AI 디자이너 되어보기 — 로고부터 브랜드 아이덴티티까지',
    stack: ['Ideogram', 'Adobe Firefly', 'Recraft', 'Canva', 'Coolors'],
    content: `## 🎯 이 실험의 목표

AI 디자인 도구들을 체계적으로 조합해 **완성된 브랜드 아이덴티티 패키지**를 만든다.
디자인 경력 없이도 전문 디자이너가 납품하는 수준의 결과물 완성.

> **완성 목표물**: 로고 + 컬러 팔레트 + 타이포그래피 가이드 + 명함 + SNS 키트

---

## 💸 비용 총정리 — 전부 무료

| 도구 | 무료 한도 | 비용 |
|------|----------|------|
| **Ideogram** | 하루 25장 무료 | ✅ $0 |
| **Adobe Firefly** | 월 25 크레딧 무료 | ✅ $0 |
| **Recraft** | 하루 50장 + 벡터 무료 | ✅ $0 |
| **Canva** | 무료 플랜으로 충분 | ✅ $0 |
| **Coolors** | 팔레트 생성 완전 무료 | ✅ $0 |
| **Claude.ai 무료** | 일 사용 제한 있지만 무료 | ✅ $0 |

> 💡 **유료 구독 없이 완성 가능합니다.**
> Ideogram + Adobe Firefly 조합이 로고/브랜드 작업에서 동급 이상 결과를 냅니다.

---

## 🛠️ 도구별 역할 분담

| 도구 | 맡은 역할 |
|------|-----------|
| **Claude.ai 무료** | 브랜드 전략 수립 · 프롬프트 설계 |
| **Ideogram** | 워드마크 · 심볼 로고 생성 (텍스트 정확) |
| **Adobe Firefly** | 브랜드 무드 이미지 · 목업 배경 (저작권 안전) |
| **Recraft** | 벡터(SVG) 변환 · 배경 제거 |
| **Canva** | 명함 · SNS 키트 · 최종 편집 |

---

## 📋 Step 0: Claude.ai 무료로 브랜드 전략 먼저 잡기

디자인 시작 전 Claude.ai 무료 플랜에게 방향을 잡아달라고 요청.
이 단계가 결과물 품질을 결정한다. (무료 일 사용 제한이 있지만 충분)

\`\`\`
내 브랜드 아이덴티티 디자인을 위한 브리프를 작성해줘:

브랜드명: [이름]
업종: [설명]
타겟 고객: [연령대, 성향]
브랜드 키워드 3개: [예: 신뢰, 혁신, 친근함]
참고 브랜드 스타일: [예: Notion처럼 미니멀, Apple처럼 프리미엄]

다음을 출력해줘:
1. 브랜드 포지셔닝 한 줄 (슬로건 형식)
2. 로고 방향 추천 (심볼형/워드마크/조합형)
3. 컬러 팔레트 3색 추천 (Hex 코드 포함 + 각 색상의 의미)
4. 한국어/영문 폰트 추천 (Google Fonts 기준)
5. Ideogram용 로고 이미지 프롬프트 3가지 (영문으로)
6. 절대 피해야 할 디자인 방향
\`\`\`

---

## 🖼️ Step 1: Ideogram으로 로고 컨셉 탐색

Ideogram은 **텍스트가 들어간 로고**에 가장 강하다. (워드마크 텍스트 정확도 1위)
[ideogram.ai](https://ideogram.ai) → 무료 가입 → 이미지 생성:

**테크 스타트업 예시:**
\`\`\`
Minimal logo mark for a tech startup called "Lumina",
abstract geometric hexagon with light ray symbol,
electric blue and white color scheme,
clean vector style, white background,
professional SaaS brand identity, 1:1 ratio
\`\`\`

**로컬 카페 예시:**
\`\`\`
Hand-crafted coffee shop logo badge for "Morgen Café",
vintage circular emblem, warm espresso brown and cream,
coffee bean and leaf illustration elements,
serif typography, clean white background
\`\`\`

**리파인 팁:**
- Ideogram의 \`Remix\` 버튼으로 같은 스타일 → 다른 색상/구도
- "Style → Design" 선택 시 로고/포스터에 최적
- 4~5개 버전 뽑고 방향성 결정 후 집중

---

## ✍️ Step 2: Ideogram으로 워드마크 로고 완성

브랜드명 텍스트가 명확하게 들어가야 하는 워드마크 로고는 Ideogram이 가장 정확.

\`\`\`
Wordmark logo "LUMINA" in custom bold sans-serif typeface,
electric blue with subtle gradient, minimalist tech brand,
clean white background, letter spacing is wide,
professional logo suitable for SaaS company
\`\`\`

**Style 선택 팁:**
- **Design** → 로고, 포스터에 최적
- **Illustration** → 캐릭터, 아이콘에 최적

\`Remix\` 버튼으로 폰트 스타일, 굵기, 자간을 빠르게 조정.

---

## 🎨 Step 3: 컬러 팔레트 & 타이포그래피 확정

### 컬러 팔레트
[coolors.co](https://coolors.co) → Claude가 제안한 Hex 코드 입력:

\`\`\`
Primary:    #2563EB  (Electric Blue — 신뢰, 혁신)
Secondary:  #F0F9FF  (Ice White — 청결, 미래)
Accent:     #7C3AED  (Violet — 창의, 차별화)
Neutral:    #1E293B  (Slate Dark — 안정감)
Background: #FFFFFF
\`\`\`

**팔레트 사용 규칙 (Claude.ai 무료에게 요청):**
\`\`\`
이 컬러 팔레트의 사용 가이드를 만들어줘:
- 각 색상을 언제 쓰는지 (배경/텍스트/버튼/강조)
- 웹/인쇄에서 다르게 쓰는 방법
- 절대 조합하면 안 되는 경우
\`\`\`

### 타이포그래피
Google Fonts 기준 추천 조합:

| 용도 | 폰트 | 특성 |
|------|------|------|
| 제목 (한국어) | Noto Sans KR Bold | 안정적, 가독성 최고 |
| 제목 (영문) | Sora / Plus Jakarta Sans | 모던, SaaS 느낌 |
| 본문 | Inter / Pretendard | 화면 가독성 최적 |
| 감성 포인트 | Noto Serif KR | 고급스러움 |

---

## ✂️ Step 4: Recraft로 벡터 로고 추출

Ideogram 결과물은 픽셀 이미지.
명함 인쇄, 현수막 제작 등에 쓰려면 벡터 변환 필수.

1. [recraft.ai](https://recraft.ai) → **Vectorize** 탭
2. 최종 로고 이미지 업로드
3. SVG 자동 변환 → 다운로드
4. **Remove Background** → 투명 배경 PNG 저장

**로고 파일 세트 저장:**
\`\`\`
logo/
├── logo-primary.svg      ← 컬러 벡터 (기본 사용)
├── logo-white.svg        ← 흰색 반전 (어두운 배경용)
├── logo-black.svg        ← 단색 (각인·팩스용)
├── logo-4000px.png       ← 투명 배경 고해상도
└── logo-favicon-32px.png ← 웹 파비콘용
\`\`\`

---

## 🏢 Step 5: Adobe Firefly로 브랜드 무드 이미지 생성

[firefly.adobe.com](https://firefly.adobe.com) (무료, 월 25 크레딧):

브랜드 소개 이미지, SNS 배경, 프레젠테이션 커버용:

\`\`\`
Abstract technology background, electric blue light particles,
clean minimalist corporate aesthetic, deep navy gradient,
suitable for SaaS company presentation cover,
16:9 horizontal composition
\`\`\`

> Firefly는 Adobe Stock 데이터로 학습해 **저작권 걱정이 없다**.
> 기업 프레젠테이션, 마케팅 자료에 안전하게 사용 가능.

---

## 📇 Step 6: Canva로 명함 & SNS 키트 완성

### 명함 제작 (무료)
1. Canva → 새 디자인 → \`명함\` (85×55mm)
2. 로고 PNG 업로드 → 배치
3. **배경색**: Primary 컬러 적용
4. 앞면: 로고 + 이름 + 직함 + 연락처
5. 뒷면: 브랜드 슬로건 + 심볼 패턴

### SNS 프로필 키트 (무료)
Canva에서 \`Brand Kit\` 설정 후 사이즈별 자동 생성:

| SNS | 사이즈 | 용도 |
|-----|--------|------|
| 인스타그램 프로필 | 1080×1080 | 피드 포스트 |
| 인스타그램 스토리 | 1080×1920 | 스토리 배경 |
| 유튜브 채널아트 | 2560×1440 | 채널 배너 |
| 링크드인 배너 | 1584×396 | 프로필 커버 |
| 이메일 서명 | 600×150 | 이메일 하단 |

**Canva AI 활용:**
> "이 로고를 중심으로 미니멀하고 프로페셔널한 인스타그램 피드 그리드 9장 구성해줘"

---

## 📄 Step 7: Claude.ai 무료로 브랜드 가이드라인 문서 완성

\`\`\`
우리 브랜드 가이드라인을 Notion에 정리할 수 있도록 마크다운 형식으로 작성해줘:

브랜드명: [이름]
슬로건: [한 줄]
컬러: Primary #[코드], Secondary #[코드], Accent #[코드]
폰트: 제목 [이름], 본문 [이름]
톤앤매너 키워드: [3가지]

포함 내용:
1. 브랜드 스토리 (2문단)
2. 로고 사용 규칙
   - DO: 해도 되는 것 3가지
   - DON'T: 하면 안 되는 것 5가지
3. 컬러 배합 가이드 (배경/텍스트/CTA 버튼별)
4. 카피라이팅 톤 예시
   - 좋은 예 vs 나쁜 예 비교 3쌍
5. SNS별 콘텐츠 방향성
\`\`\`

---

## 📊 실험 결과 — 비용 비교

| 항목 | 디자이너 의뢰 | AI 활용 (이번 실험) |
|------|-------------|-------------------|
| 로고 디자인 | $300~800 / 1~2주 | **$0 / 1시간** |
| 브랜드 가이드라인 | $200~500 / 추가 | **$0 / 30분** |
| 명함 디자인 | $50~150 | **$0 / 20분** |
| SNS 키트 5종 | $100~300 | **$0 / 30분** |
| **합계** | **$650~1,800 / 2~4주** | **$0 / 약 2시간** |

---

## 💡 디자이너처럼 보이는 3가지 원칙

**1. 여백(White Space)이 고급스러움을 만든다**
로고, 명함 모두 여백이 많을수록 프리미엄으로 보인다.
프롬프트에 \`minimal\`, \`clean\`, \`plenty of white space\` 추가.

**2. 컬러는 3개 이하 공식**
Primary(주색) + Accent(강조색) + Neutral(배경/텍스트) 구조.
4개 이상 쓰면 아마추어처럼 보인다.

**3. 폰트 2개 조합만 기억**
- 제목: 굵은 Sans-serif (Sora, Plus Jakarta Sans)
- 본문: 얇은 Sans-serif (Inter, Pretendard)
절대 3개 이상 혼용 금지.

**검증 체크리스트 (Claude.ai 무료에게 요청):**
\`\`\`
내가 만든 로고 디자인 설명이야: [설명]
전문 디자이너 관점에서 개선할 점과,
실수하기 쉬운 아마추어 디자인 실수를 피했는지 체크해줘.
\`\`\``,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 3) AI 기획자 되어보기 — PRD부터 MVP 로드맵까지
  // ──────────────────────────────────────────────────────────────────────
  {
    id: '12d78101-7260-45c5-b276-8822ac1e1553',
    title: 'AI 기획자 되어보기 — PRD부터 MVP 로드맵까지',
    stack: ['Claude.ai', 'ChatGPT', 'Perplexity', 'Gamma', 'FigJam'],
    content: `## 🎯 이 실험의 목표

AI를 활용해 아이디어 단계의 제품을 **실제 개발팀에 넘길 수 있는 기획 산출물 6종**으로 만든다.

> **완성 산출물**:
> 1. 시장 분석 보고서 (SWOT 포함)
> 2. 사용자 페르소나 3종
> 3. PRD (Product Requirements Document)
> 4. 유저 스토리 & 기능 명세 (MoSCoW)
> 5. MVP 3개월 로드맵
> 6. 경쟁사 포지셔닝 맵 + 발표 자료

---

## 💸 비용 총정리 — 전부 무료 플랜으로 가능

| 도구 | 역할 | 무료 한도 |
|------|------|----------|
| **Claude.ai 무료** | PRD 작성, 구조화, 검토 | 일 사용 제한 있지만 무료 |
| **ChatGPT 무료** (GPT-4o mini) | 페르소나, 창의적 네이밍, 카피 | 무료 |
| **Perplexity 무료** | 시장 조사, 최신 경쟁사 분석 | 무료 (일 검색 제한 있음) |
| **Gamma** | 발표 자료 자동 완성 | 무료 (10 덱/월) |
| **FigJam** | 시각적 로드맵 · 마인드맵 | 무료 (3 파일) |
| **Notion** | 산출물 정리·공유 | 무료 플랜 |

> 💡 **유료 구독 없이 가능합니다.**
> Notion AI($10/월)는 필요 없습니다. Claude.ai 무료 결과물을 Notion에 붙여넣기만 하면 됩니다.

---

## 🔍 Step 1: Perplexity 무료로 시장 분석 (30분)

[perplexity.ai](https://perplexity.ai) 무료 가입 → 검색창에 아래 입력.

**프롬프트 템플릿:**
\`\`\`
[제품 아이디어]에 대한 시장 분석 리포트를 작성해줘:

1. 글로벌 및 국내 시장 규모 (2024~2026년, 출처 포함)
2. 주요 경쟁 제품 5개 — 각각의 강점/약점/가격
3. 현재 사용자들이 가장 많이 불평하는 Pain Point
   (앱스토어 리뷰, Reddit, 커뮤니티 분석 기반)
4. 최근 12개월 주요 트렌드 변화
5. 이 시장의 기회 요인과 위협 요인

모든 데이터에 출처(링크 포함), 최신 데이터 우선으로
\`\`\`

> 무료 플랜으로도 일반 검색은 충분. 다만 "Deep Research" 기능은 Pro 전용이라 본 실험에서는 일반 검색을 여러 번 나눠서 쓴다.

**결과 → Claude.ai 무료로 구조화:**
\`\`\`
이 Perplexity 리서치 결과를 아래 형식으로 정리해줘:

1. SWOT 분석 (표 형식)
2. 한 페이지 Executive Summary (불릿 포인트)
3. 우리 제품이 노릴 수 있는 차별화 기회 3가지
\`\`\`

---

## 👥 Step 2: ChatGPT 무료(GPT-4o mini)로 사용자 페르소나 3종 (20분)

\`\`\`
[제품명]의 사용자 페르소나 3개를 만들어줘.
각각 서로 다른 직군/상황을 대표해야 해.

각 페르소나 형식:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 이름: [실명처럼 구체적으로]
나이/직업: [구체적으로]
기술 친숙도: ★★★☆☆ (5점 만점)

📅 하루 일과 (타임라인):
- 08:00: ...
- 12:00: ...
- 19:00: ...

🎯 핵심 목표:
1. [목표 1]
2. [목표 2]

😤 주요 불편함:
1. [Pain Point 1]
2. [Pain Point 2]
3. [Pain Point 3]

🔧 현재 사용 중인 대안:
[현재 어떻게 해결하고 있는지]

💬 이 제품에 대해 할 법한 한마디:
"[실제로 말할 것 같은 인용구]"

💳 구매 결정 기준: [가장 중요시하는 것]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

---

## 📄 Step 3: Claude.ai 무료로 PRD 초안 작성 (45분)

PRD는 개발팀과의 계약서다. 모호하면 안 된다.

**PRD 작성 요청:**
\`\`\`
다음 정보를 바탕으로 완성도 높은 PRD를 작성해줘:

제품명: [이름]
한 줄 정의: [설명]
핵심 문제: [Pain Point]
해결 방법: [솔루션]
타겟: [페르소나 1, 2, 3 요약]
성공 지표: [구체적 수치]

PRD 구성:
## 1. Problem Statement
현재 상황 → 문제 → 영향 구조로

## 2. Solution Overview
핵심 가치 제안 (Value Proposition) + 차별점

## 3. User Stories
Epic → Story → 인수 조건(Given/When/Then) 형식으로

## 4. Functional Requirements
MoSCoW 방식으로 분류:
- Must Have: (이게 없으면 제품이 아님)
- Should Have: (있으면 좋은 핵심 기능)
- Could Have: (여유 있으면 추가)
- Won't Have: (이번 버전에서 제외)

## 5. Non-Functional Requirements
성능/보안/확장성 기준

## 6. Out of Scope
이번 버전에서 명시적으로 제외하는 것

## 7. Success Metrics
어떻게 측정할 것인지 방법 포함

## 8. Assumptions & Risks
가정과 리스크 목록
\`\`\`

---

## 📝 Step 4: 유저 스토리 세분화 (30분)

PRD의 각 기능을 개발팀이 바로 작업할 수 있는 단위로 쪼개기:

\`\`\`
PRD의 [핵심 기능명] 을 개발팀이 바로 작업할 수 있도록 세분화해줘.

각 User Story 형식:
"[페르소나]로서, 나는 [행동]을 원한다. 왜냐하면 [목표] 때문이다."

인수 조건:
- ✅ Given: [사전 상황]
- ✅ When: [사용자 행동]
- ✅ Then: [시스템 반응]
- ❌ 예외 케이스: [오류 상황 처리]

개발 예상 공수:
- 프론트엔드: [시간]
- 백엔드: [시간]
- 디자인: [시간]
\`\`\`

**우선순위 자동 계산 (RICE 스코어):**
\`\`\`
아래 기능 목록에 RICE Score를 계산해줘:
RICE = (Reach × Impact × Confidence) ÷ Effort

기능 목록: [A, B, C, D, E]

각 기능에 점수 제안 이유와 함께, 최종 우선순위 랭킹 출력
\`\`\`

---

## 🗺️ Step 5: MVP 3개월 로드맵 구성 (20분)

\`\`\`
위 기능 목록으로 3개월 MVP 로드맵을 만들어줘:

팀 구성: 개발 2명 / 디자이너 1명 / 기획 1명
기간: 12주 (스프린트 2주 단위, 총 6 스프린트)
목표: 핵심 가치 전달 + 초기 사용자 100명 확보

각 스프린트 형식:
## Sprint [N]: [테마]
- 목표: 한 줄
- 주요 기능: [기능 1, 2, 3]
- 완료 기준(Definition of Done): [측정 가능한 기준]
- 의존성: [선행 작업]
- 리스크: [위험 요소 + 대응 방안]
\`\`\`

---

## 📊 Step 6: 경쟁사 포지셔닝 맵

\`\`\`
[경쟁사 A, B, C, D]를 두 축으로 포지셔닝 분석해줘:

X축: 가격 저렴 ←→ 가격 프리미엄
Y축: 기능 단순 ←→ 기능 풍부

각 경쟁사 위치 설명 (X: 1~10점, Y: 1~10점)
우리 제품이 차별화로 노릴 빈 공간(White Space) 제안
\`\`\`

FigJam에서 시각화:
1. [figma.com/figjam](https://www.figma.com/figjam/) 무료 접속
2. 2×2 매트릭스 그리기 (무료 템플릿 있음)
3. 각 경쟁사와 우리 제품 스티커로 배치
4. 팀 공유 링크 생성

---

## 🎯 Step 7: Gamma로 기획 발표 자료 15분 완성

[gamma.app](https://gamma.app) → \`Generate\` → PRD 핵심 내용 붙여넣기:

\`\`\`
이 PRD 내용으로 투자자/팀 발표용 슬라이드 덱을 만들어줘.
구성: 문제 정의 → 시장 기회 → 솔루션 → 페르소나 →
      핵심 기능 → MVP 로드맵 → 팀 → 다음 단계
10~12 슬라이드, 각 슬라이드 핵심 메시지 1개씩만
\`\`\`

Gamma 자동 생성 후:
- 브랜드 컬러 적용 (테마 변경 1초)
- 차트/표 자동 생성됨
- PDF, 웹 링크, PPT 모두 내보내기 가능

---

## 📊 실험 결과

| 산출물 | 경험 많은 기획자 소요 | AI 활용 시 | 추가 비용 |
|--------|-------------------|-----------|---------|
| 시장 분석 | 2~3일 | 30분 | $0 |
| 페르소나 3종 | 1~2일 | 20분 | $0 |
| PRD 초안 | 3~5일 | 45분 | $0 |
| 유저 스토리 | 2일 | 30분 | $0 |
| MVP 로드맵 | 1~2일 | 20분 | $0 |
| 발표 자료 | 반나절 | 15분 | $0 |
| **합계** | **약 2주** | **약 3시간** | **$0** |

---

## 💡 실제 기획자가 AI를 쓰는 방법

**1. AI는 초안, 판단은 내가**
AI가 뽑은 PRD를 그대로 쓰지 않는다.
"이 기능이 정말 MVP에 필요한가?" 스스로 검토가 핵심.

**2. 모호함을 없애는 검토 요청**
\`\`\`
이 PRD에서 개발팀이 헷갈릴 수 있는 모호한 요구사항을 찾아서
각각 더 명확한 표현으로 수정해줘.
기준: 개발자가 "어떻게 구현할지" 바로 알 수 있어야 함.
\`\`\`

**3. 사용자 인터뷰 질문도 AI가 만든다**
\`\`\`
[제품 아이디어]의 잠재 고객 5명을 인터뷰할 질문 목록을 만들어줘.
형식: 오픈형 질문만, 유도 질문 금지
목적: Pain Point 발굴과 현재 해결 방식 파악
총 15개 질문, 도입/핵심/마무리 3단계로 구성
\`\`\`

**4. 인터뷰 결과 → PRD 반영**
\`\`\`
인터뷰 녹취 요약본을 첨부할게.
현재 PRD에서 수정하거나 추가해야 할 기능과 우선순위를 제안해줘.
특히 내가 놓친 Pain Point가 있다면 강조해줘.
\`\`\``,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 4) Claude 4 + MCP로 나만의 AI 업무 비서 세팅
  //    → 본문은 이미 Claude Desktop 무료 설치 기반이므로 표현만 정리
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'eb15bf43-1cf2-4fc8-9f28-f2944962d3a7',
    title: 'Claude 4 + MCP로 나만의 AI 업무 비서 세팅',
    stack: ['Claude Desktop', 'MCP', 'Google Calendar', 'Notion', 'GitHub'],
    content: `## 🎯 이 실험의 목표

Claude Desktop의 **MCP(Model Context Protocol)** 를 활용해
캘린더·노션·파일 시스템과 연결된 개인 AI 비서를 구성한다.
자연어 한 마디로 여러 앱을 동시에 제어.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **Claude Desktop** | ✅ 무료 설치 (claude.ai 무료 계정 사용 가능) |
| **MCP 서버들** | ✅ 오픈소스, 무료 |
| **Google Calendar** | ✅ 무료 |
| **Notion** | ✅ 무료 플랜 |
| **GitHub MCP** | ✅ 무료 |

> 별도 Claude API 키나 추가 비용 없음. **claude.ai 무료 계정**으로 사용 가능.
> 무료 플랜은 일일 메시지 한도가 있지만 가벼운 비서 용도로는 충분.

---

## ⚙️ Step 1: Claude Desktop + MCP 설치

1. [claude.ai/download](https://claude.ai/download) → Claude Desktop 설치
2. 설정 파일 위치:
   - Mac: \`~/Library/Application Support/Claude/claude_desktop_config.json\`
   - Windows: \`%APPDATA%\\Claude\\claude_desktop_config.json\`
3. Node.js 설치 필요: [nodejs.org](https://nodejs.org) (LTS 버전)

---

## 📅 Step 2: Google Calendar MCP 연결

\`claude_desktop_config.json\` 파일 열고 아래 내용 추가:

\`\`\`json
{
  "mcpServers": {
    "google-calendar": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-calendar"],
      "env": {
        "GOOGLE_CLIENT_ID": "여기에 입력",
        "GOOGLE_CLIENT_SECRET": "여기에 입력",
        "GOOGLE_REFRESH_TOKEN": "여기에 입력"
      }
    }
  }
}
\`\`\`

**OAuth 토큰 발급:**
1. [console.cloud.google.com](https://console.cloud.google.com)
2. 프로젝트 생성 → API 라이브러리 → Google Calendar API 활성화
3. 사용자 인증정보 → OAuth 2.0 클라이언트 ID 생성
4. [oauth2.googleapis.com/token](https://oauth2.googleapis.com/token) 에서 Refresh Token 발급

---

## 📝 Step 3: Notion MCP 연결

config에 추가:
\`\`\`json
"notion": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-notion"],
  "env": {
    "NOTION_API_KEY": "secret_로 시작하는 키"
  }
}
\`\`\`

Notion API 키 발급:
1. [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. \`새 통합 만들기\` → 이름 입력 → 비밀 토큰 복사
3. 연결할 Notion 페이지에서 \`연결 추가\` → 방금 만든 통합 선택

---

## 🗂️ Step 4: 파일 시스템 MCP (로컬 파일 제어)

\`\`\`json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem",
           "/Users/본인이름/Documents"]
}
\`\`\`

이제 Claude가 내 Documents 폴더를 직접 읽고 쓸 수 있다.

---

## 🚀 Step 5: 실전 자연어 명령 모음

Claude Desktop 실행 후 그대로 입력:

**📅 미팅 준비 자동화:**
\`\`\`
내일 오후 2시 팀 미팅이 있어.
지난주 Notion '회의록' 페이지에서 미결 액션 아이템 찾아서 요약하고,
캘린더에 '자료 준비 완료' 이벤트도 오전 11시에 추가해줘.
\`\`\`

**📊 주간 보고서 자동 생성:**
\`\`\`
이번 주 캘린더 일정을 보고 주간 업무 보고서 초안을 작성해줘.
완료된 일정은 '완료', 지연된 일정은 '지연' 표시.
결과물을 Notion '주간 보고' 페이지에 저장해줘.
\`\`\`

**📁 문서 정리:**
\`\`\`
Documents/작업폴더 안에 있는 파일들을 확인하고
날짜별로 정리할 수 있는 폴더 구조를 제안해줘.
동의하면 실제로 이동해줄게.
\`\`\`

**🔍 일정 분석:**
\`\`\`
다음 달 내 캘린더에서 가장 바쁜 3일을 찾아줘.
그 날들 전후로 집중 작업 블록(Deep Work 2시간)을 만들어줘.
\`\`\`

---

## 🔌 추가 MCP 서버 추천

| MCP 서버 | 설치 명령 | 기능 |
|---------|---------|------|
| GitHub | \`@modelcontextprotocol/server-github\` | PR, 이슈, 코드 관리 |
| Slack | \`@modelcontextprotocol/server-slack\` | 채널 메시지 읽기/전송 |
| Brave Search | \`@modelcontextprotocol/server-brave-search\` | 실시간 웹 검색 |
| SQLite | \`@modelcontextprotocol/server-sqlite\` | 로컬 DB 분석 |
| Puppeteer | \`@modelcontextprotocol/server-puppeteer\` | 웹 자동화 |

전체 MCP 서버 목록: [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

---

## 📊 실험 결과

| 업무 | 기존 소요 시간 | MCP 활용 후 |
|------|-------------|------------|
| 주간 보고서 작성 | 45분 | 3분 |
| 미팅 준비 (자료 수집) | 30분 | 2분 |
| 파일 정리 계획 수립 | 20분 | 즉시 |
| 일정 분석 & 최적화 | 15분 | 1분 |
| **주간 절감** | — | **약 7~8시간** |

---

## 💡 MCP 설정 트러블슈팅

**Claude Desktop에서 MCP가 안 보일 때:**
\`\`\`bash
# config 파일 문법 확인
cat ~/Library/Application\\ Support/Claude/claude_desktop_config.json | python3 -m json.tool
\`\`\`

**MCP 연결 상태 확인:**
Claude Desktop 좌측 하단 🔌 아이콘 → 연결된 서버 목록 확인

**Node.js 버전 문제:**
\`\`\`bash
node --version  # v18 이상 필요
\`\`\``,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 5) 나노바나나로 쇼츠 찍자!
  //    → ChatGPT 무료 플랜으로 명시. 본문은 거의 그대로.
  // ──────────────────────────────────────────────────────────────────────
  {
    id: '5e12c04c-3727-493a-a74a-e6bc9e5cd6e6',
    title: '나노바나나로 쇼츠 찍자! 🍌✨',
    stack: ['ChatGPT 무료', 'CapCut', 'Canva', 'YouTube Studio'],
    content: `## 🎯 이 실험의 목표

ChatGPT 무료 플랜(GPT-4o mini)으로 바이럴 스크립트를 뽑고,
CapCut AI 자동 편집 기능으로
**아이디어 입력부터 유튜브 쇼츠 업로드까지 15분** 안에 완성한다.
카메라 앞에 서지 않아도, 편집을 몰라도 OK.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **ChatGPT 무료** (GPT-4o mini) | ✅ 무료 (chat.openai.com) |
| **CapCut** | ✅ 무료 (모바일/PC) |
| **Canva** | ✅ 무료 플랜 |
| **YouTube Studio** | ✅ 무료 |

> 전체 비용 **$0** — 계정만 만들면 끝.

---

## 💡 Step 0: 어떤 쇼츠가 터질까?

ChatGPT 무료에게 먼저 물어보자:

\`\`\`
요즘 유튜브 쇼츠에서 가장 많이 조회되는 콘텐츠 유형 10가지를 알려줘.
내가 관심 있는 분야: [AI / 자기계발 / 맛집 / 게임 / 재테크 등]
각 유형별로 60초 이내 쇼츠 아이디어 3개씩 제안해줘.
\`\`\`

쇼츠 알고리즘이 좋아하는 공식:
- **후킹 첫 3초**: "이거 몰랐으면 큰일 날 뻔했어"
- **빠른 템포**: 한 문장에 1.5초 이내
- **강한 마무리**: 저장·공유 유도

---

## ✍️ Step 1: ChatGPT 무료로 스크립트 작성 (3분)

\`\`\`
다음 조건으로 유튜브 쇼츠 스크립트를 써줘:

주제: [예: "ChatGPT로 자소서 10분 만에 쓰는 법"]
길이: 50초 (약 150단어)
형식:
- 후킹 (0~3초): 충격적인 첫 문장
- 본론 (3~45초): 3가지 핵심 포인트, 각 10초씩
- CTA (45~50초): 팔로우/저장 유도

톤: 친근하고 빠른 말투, MZ 세대 타겟
자막에 넣을 강조 키워드도 [ ] 로 표시해줘
\`\`\`

> 무료 플랜의 GPT-4o mini도 짧은 스크립트 작성에는 충분. 일일 한도 도달하면 Gemini 무료([gemini.google.com](https://gemini.google.com))로 갈아타도 OK.

---

## 🎬 Step 2: CapCut으로 AI 영상 제작 (7분)

### 방법 A: 텍스트→영상 자동 생성
1. CapCut 앱 → **AI 기능** → **텍스트로 영상 만들기**
2. 스크립트 붙여넣기 → AI가 자동으로 스톡 영상 + 자막 조합
3. 배경음악 자동 삽입

### 방법 B: 직접 촬영 후 자동 편집
1. 스크립트 보면서 스마트폰으로 세로 촬영 (9:16)
2. CapCut → **자동 캡션** → 자막 자동 생성
3. **AI 편집** → 눈 감은 장면, 어색한 부분 자동 컷

**퀄리티 올리는 CapCut 설정:**
- 자막 폰트: **Freesentation 9 Black** (한국어 최강)
- 자막 색: 흰색 + 검정 외곽선
- 배경음악 볼륨: 원본의 10~15%

---

## 🖼️ Step 3: Canva로 썸네일 제작 (3분)

1. Canva → **YouTube 쇼츠 썸네일** (1080×1920)
2. 배경: 강렬한 단색 또는 그라디언트
3. 텍스트: 3단어 이내, 초대형 볼드
4. **ChatGPT 무료로 썸네일 문구 뽑기:**

\`\`\`
이 쇼츠 주제에서 클릭률 높은 썸네일 문구를 3가지 제안해줘.
주제: [주제]
조건: 3단어 이내, 궁금증 유발, 숫자 포함 권장
\`\`\`

---

## 🚀 Step 4: 업로드 최적화 (2분)

**YouTube Studio 설정:**
\`\`\`
이 쇼츠 영상의 제목, 설명, 해시태그를 최적화해줘:
주제: [주제]
타겟: [타겟 시청자]

출력:
- 제목 후보 3개 (이모지 포함, 30자 이내)
- 설명 (200자, 핵심 키워드 3개 포함)
- 해시태그 10개 (#쇼츠 #shorts 포함)
\`\`\`

---

## 📊 실험 결과

| 지표 | 수치 |
|------|------|
| 전체 제작 시간 | **15분** |
| 첫 주 평균 조회수 | 500~2,000 (주제에 따라 다름) |
| 구독자 전환율 | 조회수의 약 0.5~2% |
| 제작 비용 | **$0** |

---

## 💡 조회수 폭발하는 쇼츠 공식

**ChatGPT 무료에 분석 요청:**
\`\`\`
유튜브 쇼츠에서 100만 뷰 넘은 영상들의 공통 패턴을 분석해줘.
특히 첫 3초 후킹 방식, 편집 템포, CTA 방식을 중심으로.
내 채널 방향: [분야]에 적용할 수 있는 구체적인 팁도 알려줘.
\`\`\`
`,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 6) 나도 바나나? 이제 진짜다 Nanobanana Pro
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'dfc768a0-3686-434d-9036-c4dd325b5777',
    title: '나도 바나나? 이제 진짜다 Nanobanana Pro',
    stack: ['ChatGPT 무료', 'Canva', 'Gemini 무료', 'Instagram'],
    content: `## 🎯 이 실험의 목표

ChatGPT 무료 플랜으로 나만의 인스타그램 브랜드 컨셉을 잡고,
Canva AI로 통일된 피드를 디자인하고,
Gemini 무료(gemini.google.com)로 매력적인 캡션까지 완성한다.
팔로워 0에서 **브랜드가 있는 계정**으로 탈바꿈하는 2시간짜리 실험.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **ChatGPT 무료** (GPT-4o mini) | ✅ chat.openai.com 무료 |
| **Gemini 무료** | ✅ gemini.google.com 무료 (구독 불필요) |
| **Canva** | ✅ 무료 플랜으로 충분 |
| **Instagram** | ✅ 무료 |

---

## 📋 Step 1: ChatGPT 무료로 인스타 브랜드 전략 수립 (20분)

\`\`\`
내 인스타그램 브랜딩 전략을 짜줘:

나에 대해:
- 직업/관심사: [예: 직장인 / AI에 관심 많음]
- 인스타 목표: [예: 팔로워 1,000명 / 부업 / 나 표현]
- 내가 잘하는 것: [예: 책 읽기 / 요리 / 운동]

다음을 만들어줘:
1. 계정 콘셉트 한 줄 (포지셔닝)
2. 타겟 팔로워 페르소나 (1명)
3. 콘텐츠 3가지 유형 (각 비율 포함)
4. 피드 컬러 팔레트 추천 (Hex 코드 포함)
5. 계정 바이오 문구 3가지 후보 (150자 이내)
6. 첫 9개 포스트 아이디어
\`\`\`

---

## 🎨 Step 2: Canva로 피드 디자인 통일 (40분)

**피드 그리드 전략 (9등분):**
인스타 피드는 3×3 격자로 보인다. 패턴을 만들면 프로페셔널해 보인다.

\`\`\`
체커보드 패턴:
  [텍스트] [이미지] [텍스트]
  [이미지] [텍스트] [이미지]
  [텍스트] [이미지] [텍스트]
\`\`\`

Canva 설정:
1. 1080×1080 정방형 포스트 템플릿 선택
2. ChatGPT가 추천한 컬러 팔레트 → 브랜드 색상으로 저장
3. 폰트 2개만 고정 (제목용 + 본문용)
4. 같은 템플릿으로 9개 포스트 만들기

**Canva AI 활용:**
> "이 레이아웃을 더 미니멀하게 바꿔줘"
> "배경을 파스텔 계열로 변경해줘"

---

## ✍️ Step 3: Gemini 무료로 캡션 대량 생성 (30분)

Gemini 무료(gemini.google.com)는 검색 연동이 강해서 트렌드 파악 + 캡션에 탁월:

\`\`\`
인스타그램 포스트 캡션을 작성해줘:

포스트 내용: [예: "AI로 자소서 10분 만에 쓰는 법 3가지"]
타겟: [예: 취준생, 20대]
톤: [예: 친근하고 실용적]

형식:
- 첫 줄: 후킹 문장 (이모지 포함, 150자 이내)
- 본문: 3~4줄, 핵심 내용
- CTA: 저장/팔로우 유도 1줄
- 해시태그: 30개 (대형 5개 + 중형 15개 + 소형 10개)
- 인기 해시태그 찾아서 최신 트렌드 반영해줘
\`\`\`

**30일치 캡션 한 번에:**
\`\`\`
위 방식으로 [주제] 관련 인스타 포스트 캡션을 30개 만들어줘.
각각 다른 앵글로, 월~금 업로드 기준으로 구성해줘.
\`\`\`

---

## 📅 Step 4: ChatGPT 무료로 30일 콘텐츠 캘린더 (10분)

\`\`\`
내 인스타 계정의 30일 콘텐츠 캘린더를 짜줘:

계정 방향: [Step 1에서 나온 콘셉트]
업로드 빈도: 주 3회 (월/수/금)

각 포스트 형식:
- 날짜 / 요일
- 콘텐츠 유형 (정보형/감성형/참여형)
- 포스트 주제
- 캡션 핵심 키워드
- 사용할 해시태그 카테고리
\`\`\`

---

## 📊 실험 결과

| 항목 | 수치 |
|------|------|
| 브랜드 세팅 시간 | **2시간** |
| 첫 달 평균 팔로워 증가 | 50~200명 (업로드 일관성에 따라) |
| 포스트 제작 시간 (개당) | 10분 이내 |
| 비용 | **₩0** |

---

## 💡 팔로워가 빠르게 느는 전략

\`\`\`
내 인스타 계정 [계정 방향] 기준으로
첫 100명 팔로워를 2주 안에 모으는 구체적인 전략을 짜줘.
무료로 할 수 있는 방법만, 단계별로 알려줘.
\`\`\`
`,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 7) 직접 검색 ㄴㄴ, 코멧아 이거 해줘
  //    Perplexity Pro 언급을 무료 플랜으로 정리
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'bb847442-8bba-4519-8a52-a31cdd5c366a',
    title: '직접 검색 ㄴㄴ, 코멧아 이거 해줘',
    stack: ['Perplexity 무료', 'Claude.ai 무료', 'Notion'],
    content: `## 🎯 이 실험의 목표

Perplexity 무료와 Claude.ai 무료 플랜을 조합해 **검색·리서치·문서 작성**을
직접 클릭하지 않고 자연어 명령만으로 처리하는 워크플로를 만든다.

> ✅ Perplexity 무료 + Claude.ai 무료 → 추가 비용 $0

---

## 💡 이 실험의 핵심 아이디어

\`\`\`
Perplexity 무료 = 최신 웹 데이터 수집 (실시간, 출처 포함)
Claude.ai 무료 = 수집한 데이터를 구조화·요약·문서화
\`\`\`

두 도구를 파이프라인으로 연결하면 리서치 전 과정이 자동화된다.
무료 플랜이라 일일 사용 한도는 있지만, 가벼운 업무는 충분히 커버.

---

## 🔍 패턴 1: 경쟁사 즉석 분석 (5분)

**Perplexity 무료에서:**
\`\`\`
[회사명/서비스명]의 최근 6개월 동향을 분석해줘:
1. 신규 기능/업데이트 내역
2. 언론 보도 주요 내용
3. 소셜미디어 반응 (긍정/부정)
4. 최근 채용 공고에서 보이는 전략적 방향
출처 링크 포함
\`\`\`

**Claude.ai 무료에서 (Perplexity 결과 붙여넣기):**
\`\`\`
이 경쟁사 분석 결과를 바탕으로:
1. 우리가 주목해야 할 위협 요인 3가지
2. 오히려 우리의 기회가 될 수 있는 것 2가지
3. 즉시 대응해야 할 액션 아이템 5개
를 정리해줘. 실무진에게 공유할 수 있는 간결한 형식으로.
\`\`\`

---

## 📰 패턴 2: 업계 트렌드 주간 브리핑 자동화

**Perplexity 무료에:**
\`\`\`
지난 7일간 [분야] 업계에서 가장 중요한 뉴스/트렌드 10개를
중요도 순으로 정리해줘. 각 항목마다:
- 한 줄 요약
- 왜 중요한지
- 출처
\`\`\`

**Claude.ai 무료에서 변환:**
\`\`\`
이 트렌드를 우리 팀 주간 브리핑 슬랙 메시지 형식으로 바꿔줘:
- 이모지 사용
- 각 항목 3줄 이내
- 마지막에 "이번 주 우리가 할 수 있는 것" 1가지 추가
\`\`\`

---

## 📧 패턴 3: 이메일·제안서 초안 자동 생성

**Perplexity 무료에서 배경 조사:**
\`\`\`
[상대방 회사명]에 대해 조사해줘:
창업 연도, 주요 서비스, 최근 성과, 현재 고민거리.
우리 [우리 서비스]를 제안할 때 어필 포인트를 찾아줘.
\`\`\`

**Claude.ai 무료에서 이메일 초안:**
\`\`\`
위 조사 내용 바탕으로 콜드 이메일을 써줘:
발신자: [내 이름, 직책]
목적: [미팅 제안 / 파트너십 / 데모 요청]
조건: 3문단 이내, 구체적 가치 제안 포함, 부담 없는 CTA
\`\`\`

---

## 🗂️ 패턴 4: 회의록 → 액션 아이템 즉시 변환

회의 후 메모/녹취 요약본을 Claude.ai 무료에 붙여넣고:
\`\`\`
이 회의록을 다음 형식으로 정리해줘:
1. 결정된 사항 (날짜 포함)
2. 담당자별 액션 아이템 (Due date 포함)
3. 다음 회의 전 확인이 필요한 열린 이슈
4. 슬랙에 공유할 한 줄 요약

형식: 노션 복사 붙여넣기 가능한 마크다운
\`\`\`

---

## 📊 실험 결과

| 업무 유형 | 기존 소요 시간 | 조합 활용 후 |
|-----------|-------------|------------|
| 경쟁사 분석 | 2~3시간 | 10분 |
| 주간 브리핑 작성 | 1시간 | 5분 |
| 이메일 초안 | 30분 | 3분 |
| 회의록 정리 | 20분 | 2분 |

---

## 💡 이 조합 더 잘 쓰는 법

**나만의 리서치 템플릿 만들기:**
\`\`\`
내가 매주 반복하는 리서치 업무 목록을 알려줄게.
각 업무에 최적화된 Perplexity 검색 쿼리 템플릿을 만들어줘.

반복 업무:
1. [업무 1]
2. [업무 2]
3. [업무 3]
\`\`\`

> 무료 플랜의 일일 한도에 걸리면 Gemini 무료(gemini.google.com)로 같은 흐름을 돌릴 수 있다.
`,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 8) 나도 아티스트
  // ──────────────────────────────────────────────────────────────────────
  {
    id: '20f4c79d-b97f-4fd4-a516-e9e664cafc61',
    title: '나도 아티스트 — 내 안의 예술혼을 찾아라',
    stack: ['Ideogram', 'Adobe Firefly', 'Recraft', 'Canva'],
    content: `## 🎯 이 실험의 목표

세 가지 무료 AI 이미지 도구를 모두 써보며 각각의 강점을 익히고,
**나만의 시그니처 스타일**을 개발해 10개 작품으로 구성된 디지털 포트폴리오를 완성한다.

---

## 💸 비용 확인

| 도구 | 무료 한도 | 비용 |
|------|----------|------|
| **Ideogram** | 하루 25장 | ✅ $0 |
| **Adobe Firefly** | 월 25 크레딧 | ✅ $0 |
| **Recraft** | 하루 50장 + 벡터 무료 | ✅ $0 |
| **Canva** | 무료 플랜 | ✅ $0 |

> 유료 구독 도구 없이 동급 결과물 가능.

---

## 🔬 Step 1: 3개 도구 비교 실험 (30분)

동일한 주제로 세 도구에서 각각 생성해 강점을 파악한다.

**테스트 프롬프트:**
\`\`\`
"A solitary lighthouse on a dramatic rocky cliff at golden hour,
cinematic atmosphere, oil painting style"
\`\`\`

| 도구 | 강점 | 약점 |
|------|------|------|
| **Ideogram** | 텍스트·로고 완벽, 디자인 특화 | 사진 현실감 다소 낮음 |
| **Adobe Firefly** | 저작권 안전, 프로페셔널 | 창의성 보수적 |
| **Recraft** | 벡터 변환 + 일러스트 스타일 | 사실적 사진은 약함 |

---

## 🎨 Step 2: 도구별 특화 사용법

### Ideogram — "텍스트가 들어간 작품"
\`\`\`
Vintage travel poster for "Seoul 2026",
retro illustration style, korean hanok skyline,
bold sans-serif typography, warm orange and navy
\`\`\`

Style 옵션: Design / Illustration / Photo / Render / 3D

**리파인 방법:**
\`Remix\` 버튼으로 같은 스타일 → 다른 색상/구도로 빠르게 변형.

---

### Adobe Firefly — "상업적 사용 가능한 아트"
\`\`\`
Ethereal forest with glowing mushrooms,
fantasy nature photography, soft magical light,
editorial style, high fashion magazine
\`\`\`

**Generative Fill 활용:**
기존 사진 업로드 → 영역 선택 → "이 부분을 [설명]으로 바꿔줘"

> Adobe Stock 학습 데이터 → 상업적 사용 안전.

---

### Recraft — "일러스트 + 벡터"
\`\`\`
Whimsical watercolor illustration of a cat reading a book,
soft pastel palette, storybook style, white background
\`\`\`

추가 기능:
- **Vectorize**: 픽셀 이미지를 SVG로 자동 변환
- **Remove Background**: 원클릭 누끼

---

## 🖼️ Step 3: 나만의 시그니처 스타일 개발

Claude.ai 무료에 방향 잡기:
\`\`\`
AI 아트로 나만의 시그니처 스타일을 만들고 싶어.
내 취향: [좋아하는 영화/그림/색감 키워드]

다음을 제안해줘:
1. 나만의 스타일 이름
2. 핵심 시각 요소 5가지
3. 시그니처 컬러 팔레트 (Hex 코드)
4. 이 스타일로 만들 10개 작품 아이디어
5. Ideogram/Firefly 고정 스타일 프롬프트 (모든 작품에 공통으로 붙일 것)
\`\`\`

---

## 🗂️ Step 4: Canva로 포트폴리오 제작

1. Canva → **프레젠테이션** (16:9)
2. 커버: 시그니처 스타일 + 작가명
3. 각 작품 페이지: 이미지 + 제목 + 사용 도구 + 프롬프트 공개
4. 마지막 페이지: 연락처 + 커미션 문의

**포트폴리오 PDF 내보내기** → Behance, 아트스테이션에 업로드

---

## 📊 실험 결과

| 항목 | 내용 |
|------|------|
| 작품 수 | 10개 |
| 총 제작 시간 | 3~4시간 |
| 비용 | **$0** |
| 포트폴리오 완성도 | Behance 업로드 수준 |
`,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 9) 나도 한 곡 뽑았다
  //    DALL-E 언급 제거. ChatGPT는 무료 플랜으로 정리.
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'ca6541de-df50-4645-a28f-ef515ddbd2ec',
    title: '나도 한 곡 뽑았다 — AI로 내 노래 만들기',
    stack: ['Suno', 'ChatGPT 무료', 'ElevenLabs', 'CapCut'],
    content: `## 🎯 이 실험의 목표

ChatGPT 무료 플랜으로 가사를 쓰고, Suno로 보컬까지 포함된 풀 트랙을 생성한다.
음악 이론 몰라도 OK. **1시간, $0**으로 내 노래를 완성한다.

---

## 💸 비용 확인

| 도구 | 무료 한도 | 비용 |
|------|----------|------|
| **ChatGPT 무료** (GPT-4o mini) | 일 한도 내 무료 | ✅ $0 |
| **Suno** | 하루 50 크레딧 ≈ 10곡 | ✅ $0 |
| **ElevenLabs** | 월 10분 무료 | ✅ $0 |
| **CapCut** | 완전 무료 | ✅ $0 |

> 상업적 사용은 별도 라이선스 필요. 개인 감상·공유 목적은 무료 OK.

---

## ✍️ Step 1: ChatGPT 무료로 가사 작성 (15분)

\`\`\`
다음 조건으로 K-pop 스타일 가사를 써줘:

주제/감정: [예: 이별 / 설레임 / 여름 / 성장]
분위기: [예: 애절한 / 밝고 경쾌한 / 몽환적]
언어: 한국어 (일부 영어 후렴 가능)

구성:
- Verse 1 (8줄)
- Pre-chorus (4줄)
- Chorus (8줄, 반복 가능한 멜로디 고려)
- Verse 2 (8줄)
- Bridge (4줄)
- Final Chorus (8줄)

Suno에서 각 파트가 인식될 수 있도록
[Verse 1], [Pre-chorus], [Chorus] 등 태그 포함해줘.
\`\`\`

> 일일 한도 도달하면 Gemini 무료(gemini.google.com)나 Claude.ai 무료로 갈아타면 된다.

---

## 🎵 Step 2: Suno로 곡 생성

[suno.com](https://suno.com) → **Custom** 탭:

**Style of Music (장르 지정):**
\`\`\`
# 밝은 K-pop 발라드
Korean ballad, piano-driven, emotional vocals,
orchestral strings, 75bpm, 2024 K-pop production style

# 신나는 뉴진스 스타일
Newjeans style, hyperpop, cute girl group vocal,
bouncy beat, Y2K aesthetic, 120bpm

# 감성 인디
Korean indie folk, acoustic guitar, warm male vocal,
coffeehouse atmosphere, intimate recording feel
\`\`\`

**가사 붙여넣기** → Generate
→ 같은 가사로 4~6개 생성 후 가장 마음에 드는 것 선택

**Extend 기능:**
30초 → Full 3분 트랙으로 자동 확장

---

## 🎙️ Step 3: ElevenLabs로 특별한 보이스 추가 (옵션)

Suno 보컬이 마음에 안 들 경우:

1. Suno에서 **Instrumental** 버전 따로 생성
2. ElevenLabs에서 내 목소리로 가사 녹음 (또는 AI 보이스 선택)
3. CapCut에서 Instrumental + 보이스 합성

**ElevenLabs 추천 보이스:**
- 여성 발라드: **Bella** / **Elli**
- 남성 발라드: **Antoni** / **Josh**
- 팝 느낌: **Charlotte** / **Freya**

---

## 🎬 Step 4: CapCut으로 뮤직비디오 만들기 (보너스)

\`\`\`
이 노래의 뮤직비디오 컨셉과 각 씬 설명을 만들어줘:
노래 분위기: [분위기]
가사 키워드: [주요 단어들]

4개 씬 설명 + Ideogram/Adobe Firefly용 이미지 프롬프트 포함
\`\`\`

Ideogram(하루 25장 무료) 또는 Adobe Firefly(월 25 크레딧 무료)로 씬 이미지 생성 → CapCut에서 슬라이드쇼 + 음악 조합.

---

## 📊 실험 결과

| 항목 | 내용 |
|------|------|
| 가사 작성 | 15분 |
| Suno 생성 (4~5번 시도) | 20분 |
| 최종 편집 | 10분 |
| **총 시간** | **45분~1시간** |
| **비용** | **$0** |

---

## 💡 Suno 프롬프트 공식

장르 키워드 + 악기 + 보컬 스타일 + BPM + 분위기

\`\`\`
예: "lo-fi hip hop, mellow piano, female whisper vocal,
    85bpm, late night cozy, rain outside"
\`\`\`

같은 프롬프트 여러 번 돌리면서 가장 마음에 드는 버전 선택하는 게 핵심.
`,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 10) 키워드만 넣었는데 글이 써진다고?
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'cfa290a0-510f-4c7b-afc0-2a8f91f16ecb',
    title: '키워드만 넣었는데 글이 써진다고?',
    stack: ['Perplexity 무료', 'Claude.ai 무료', 'Gemini 무료', 'Notion'],
    content: `## 🎯 이 실험의 목표

Perplexity 무료 → Claude.ai 무료 → Gemini 무료 3단계 파이프라인으로
**SEO 최적화된 블로그 포스트 한 편을 30분** 만에 완성한다.
유료 도구 Jasper 없이, 무료 플랜 3개만으로.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **Perplexity 무료** | ✅ 무료 (일 한도 내) |
| **Claude.ai 무료** | ✅ 무료 (일 한도 내) |
| **Gemini 무료** | ✅ gemini.google.com 무료 |
| **Notion** (저장) | ✅ 무료 |

---

## 🔄 전체 파이프라인

\`\`\`
키워드 입력
    ↓
Perplexity 무료 (리서치 + 최신 데이터 수집) — 5분
    ↓
Claude.ai 무료 (고품질 초안 생성) — 10분
    ↓
Gemini 무료 (SEO 최적화 + 제목/메타) — 5분
    ↓
Notion 저장 → 워드프레스/티스토리 업로드 — 5분
\`\`\`

---

## 🔍 Step 1: Perplexity 무료로 리서치 (5분)

\`\`\`
"[키워드]"에 대한 블로그 포스트 리서치를 해줘:

1. 이 주제의 핵심 정보 5가지 (최신 데이터 포함)
2. 독자들이 자주 묻는 질문 5개 (FAQ용)
3. 경쟁 상위 포스트들이 다루는 소제목 목록
4. 이 주제에서 아직 다뤄지지 않은 독창적 앵글 2개
5. 통계/수치 데이터 3개 (출처 포함)
\`\`\`

---

## ✍️ Step 2: Claude.ai 무료로 초안 작성 (10분)

\`\`\`
다음 조건으로 블로그 포스트를 작성해줘:

키워드: [메인 키워드]
타겟 독자: [예: 직장인, 취준생, 사업자]
글 길이: 1,500~2,000자
리서치 자료: [Perplexity 결과 붙여넣기]

구성:
- 후킹 도입부 (독자 공감 or 충격적 사실)
- H2 소제목 3~4개 (각 300~400자)
- 실용적인 팁 or 단계별 방법
- 강력한 마무리 + CTA

톤: [예: 친근하고 전문적 / 학술적 / 캐주얼]
이미 알려진 내용 반복 최소화, 독창적 시각 강조
\`\`\`

---

## 🔍 Step 3: Gemini 무료로 SEO 최적화 (5분)

\`\`\`
이 블로그 포스트를 SEO 관점에서 최적화해줘:

메인 키워드: [키워드]

다음을 만들어줘:
1. 클릭률 높은 제목 5개 (숫자/후킹 포함)
2. 메타 디스크립션 (160자 이내, 키워드 포함)
3. H1~H3 헤딩 구조 추천
4. LSI 키워드 10개 (본문에 자연스럽게 삽입)
5. 내부링크로 연결할 관련 주제 5개
6. 포스트 하단 FAQ 3개 (검색 노출용)
\`\`\`

---

## 📤 Step 4: 발행 최적화

**티스토리/워드프레스 업로드 체크리스트:**
\`\`\`
다음 블로그 포스트의 업로드 전 최종 체크리스트를 만들어줘:
- 키워드 밀도 체크 (2~3% 권장)
- 이미지 alt text 문구
- 내부 링크 삽입 위치
- SNS 공유용 요약 (인스타/트위터/링크드인 각각)
\`\`\`

---

## 📊 실험 결과

| 항목 | 기존 방식 | 무료 AI 파이프라인 |
|------|----------|------------|
| 리서치 | 1~2시간 | 5분 |
| 초안 작성 | 2~3시간 | 10분 |
| SEO 최적화 | 1시간 | 5분 |
| **합계** | **4~6시간** | **20~30분** |
| 비용 | $49/월(Jasper) | **$0** |

---

## 💡 고품질 포스트를 위한 Claude.ai 무료 팁

\`\`\`
이 초안에서:
1. 독자가 "이미 아는 내용이다"라고 느낄 만한 문단 찾아서 삭제
2. 데이터/수치가 없는 주장에 Perplexity 자료로 뒷받침 추가
3. 마지막 문단을 독자가 행동하게 만드는 강한 CTA로 바꿔줘
\`\`\`

> 무료 플랜의 일일 한도 도달 시 세 도구를 번갈아 쓰면 끊김 없이 작업 가능.
`,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 11) 주토피아2 감독 모집 — DALL-E 3 → Ideogram/Firefly로 교체
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'd718c6b9-1c68-4ed4-b437-d6d9f4c43a28',
    title: '주토피아2 감독 모집 — AI로 애니메이션 만들기',
    stack: ['ChatGPT 무료', 'Ideogram', 'Adobe Firefly', 'Kling AI', 'ElevenLabs', 'CapCut'],
    content: `## 🎯 이 실험의 목표

ChatGPT 무료로 스토리 기획, Ideogram/Adobe Firefly로 캐릭터 시각화,
Kling AI로 영상 클립 생성, ElevenLabs로 더빙까지.
**비용 $0**으로 완성도 있는 3분짜리 단편 AI 애니메이션을 제작한다.

---

## 💸 비용 확인

| 도구 | 무료 한도 | 비용 |
|------|----------|------|
| **ChatGPT 무료** (GPT-4o mini) | 일 한도 내 무료 | ✅ $0 |
| **Ideogram** | 하루 25장 무료 | ✅ $0 |
| **Adobe Firefly** | 월 25 크레딧 무료 | ✅ $0 |
| **Kling AI** | 하루 66 크레딧 | ✅ $0 |
| **ElevenLabs** | 월 10분 무료 | ✅ $0 (단편 기준) |
| **CapCut** | 완전 무료 | ✅ $0 |

> 유료 영상 도구 없이도 가능. Kling AI 무료 크레딧으로 충분.

---

## 📖 Step 1: ChatGPT 무료로 3분짜리 스토리 설계 (15분)

\`\`\`
3분짜리 단편 애니메이션 스토리를 설계해줘:

장르: [예: 감동 / 코미디 / SF / 공포]
컨셉: [예: 외로운 로봇이 친구를 찾는 여정]

출력:
1. 스토리 한 줄 요약 (High Concept)
2. 3막 구조:
   - 1막 (0:00~0:45): 주인공 소개 + 문제 발생
   - 2막 (0:45~2:00): 갈등 + 시도
   - 3막 (2:00~3:00): 클라이맥스 + 해결
3. 씬 목록 (총 8~10개 씬)
4. 주인공 캐릭터 설명 (외모, 성격, 특징)
5. Ideogram/Firefly용 주인공 이미지 프롬프트 (영문)
\`\`\`

---

## 🎨 Step 2: Ideogram / Adobe Firefly로 캐릭터·배경 생성

**캐릭터 생성 (Ideogram, 하루 25장 무료):**
\`\`\`
[ChatGPT가 만든 캐릭터 설명]을 바탕으로 이미지를 만들어줘.
스타일: pixar animation style, 3D render, soft lighting
배경: pure white (캐릭터 추출용)
포즈: [neutral standing pose / action pose]
\`\`\`

**배경 이미지 (Adobe Firefly, 월 25 크레딧 무료):**
\`\`\`
씬 1 배경: [장소 설명]
애니메이션 배경 스타일, 스튜디오 지브리 feels,
부드러운 채색, 16:9 비율
\`\`\`

> 💡 같은 캐릭터 여러 장면에 등장시키려면:
> Ideogram에서 \`Remix\` 버튼으로 같은 시드 유지하며 포즈만 바꾸기.

---

## 🎬 Step 3: Kling AI로 씬 영상화 (핵심!)

[klingai.com](https://klingai.com) → 이미지-투-비디오 기능:

1. Ideogram/Firefly로 만든 씬 이미지 업로드
2. **Motion 프롬프트** 입력 (영문):
\`\`\`
# 씬 1: 캐릭터 등장
The character slowly walks into frame from the left,
looks around curiously, warm morning light,
gentle camera pull back, cinematic atmosphere

# 씬 2: 감정 클로즈업
Close-up of the character's face,
eyes slowly moving from sad to hopeful expression,
subtle breathing animation, soft focus background
\`\`\`

3. 설정: 5초 / HD / Cinematic
4. 1 씬당 약 10~15 크레딧 (하루 66 크레딧)
5. 하루 4~6개 씬 생성 가능 → 2일이면 전체 완성

---

## 🎙️ Step 4: ElevenLabs로 더빙·내레이션

[elevenlabs.io](https://elevenlabs.io) 무료 플랜 (월 10분):

\`\`\`
내레이션 텍스트를 ChatGPT 무료로 먼저 작성:

이 씬의 내레이션/대사를 써줘:
씬 내용: [설명]
톤: [따뜻한 / 긴박한 / 슬픈]
길이: 30초 이내
\`\`\`

ElevenLabs에서:
- 보이스: **Bella** (따뜻함) / **Adam** (힘있음) / **Elli** (어린이)
- 감정 강도 조절 슬라이더 활용
- 3분 영상 기준 내레이션 약 3~4분 분량 → 무료 한도 내

---

## ✂️ Step 5: CapCut으로 최종 편집 (30분)

1. Kling AI 영상 클립 순서대로 타임라인 배치
2. ElevenLabs 내레이션 + 배경음악 삽입
3. **자막 자동 생성** → 스타일 통일
4. 씬 전환 효과 (Fade / Cross Dissolve)
5. 4K Export → YouTube/인스타 업로드

---

## 📊 실험 결과

| 항목 | 내용 |
|------|------|
| 총 제작 기간 | 2일 (Kling 크레딧 충전 포함) |
| 총 비용 | **$0** (모든 무료 한도 내) |
| 씬 수 | 8~10개 |
| 완성 길이 | 3분 내외 |

---

## 💡 퀄리티 UP 팁

**일관된 캐릭터 유지:**
Ideogram의 \`Remix\` 기능으로 첫 캐릭터 이미지의 시드/스타일을 고정 유지하면 동일한 스타일의 여러 포즈를 뽑을 수 있다.

**Kling 프롬프트 공식:**
\`\`\`
[카메라 무빙] + [캐릭터 동작] + [감정/분위기] + [조명]
예: "slow push in, character turns around surprised,
    dramatic lighting, dusk atmosphere"
\`\`\`
`,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 12) 키워보자, 나의 AI 펫 인플루언서
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'c358d20d-b726-4569-a265-b1e253a9b959',
    title: '키워보자, 나의 AI 펫 인플루언서',
    stack: ['Ideogram', 'Adobe Firefly', 'Canva', 'Instagram'],
    content: `## 🎯 이 실험의 목표

Ideogram·Adobe Firefly로 독창적인 AI 펫 캐릭터를 디자인하고,
Canva로 콘텐츠를 양산해 **팔로워 1,000명짜리 AI 인플루언서 계정**을 만든다.
촬영 장비, 실제 반려동물 없이도 운영 가능.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **Ideogram** | ✅ 무료 25장/일 |
| **Adobe Firefly** | ✅ 무료 월 25 크레딧 |
| **Canva** | ✅ 무료 |
| **Instagram** | ✅ 무료 |

---

## 🐾 Step 1: ChatGPT 무료로 캐릭터 설계 (15분)

\`\`\`
나만의 AI 펫 인플루언서 캐릭터를 설계해줘:

장르: [예: 귀여운 / 멋진 / 병맛 / 고급스러운]
동물 종류: [예: 고양이 / 카피바라 / 판다 / 펭귄]

다음을 만들어줘:
1. 캐릭터 이름 (3가지 후보)
2. 성격 특성 5가지
3. 말버릇/자주 쓰는 표현 5개
4. 콘텐츠 컨셉 (예: "직장인 공감 카피바라")
5. Ideogram용 캐릭터 기본 포즈 프롬프트 (영문)
6. 팔로워 타겟 페르소나
\`\`\`

> ChatGPT 무료 플랜(GPT-4o mini)이면 충분. 일일 한도 걸리면 Gemini 무료로 대체.

---

## 🎨 Step 2: Ideogram으로 캐릭터 시각화

캐릭터 기준 이미지 확정:

\`\`\`
[ideogram.ai](https://ideogram.ai) (하루 25장 무료):

[캐릭터 설명]을 귀여운 캐릭터로 만들어줘.
스타일: flat illustration, cute character design,
bold outlines, pastel color palette,
white background, sticker-ready design
포즈: neutral standing, slightly tilted head, smile
\`\`\`

**캐릭터 표정 시트 (한 번에 여러 표정):**
\`\`\`
위 캐릭터와 동일한 스타일로 표정 8가지를 그려줘:
행복, 슬픔, 놀람, 화남, 졸림, 신남, 부끄러움, 생각중
2×4 그리드 레이아웃, 각 표정에 한글 라벨 포함
\`\`\`

상업적 사용이 걱정되면 **Adobe Firefly**(저작권 안전)로 같은 캐릭터를 추가 생성.

---

## 🏷️ Step 3: Ideogram으로 캐릭터 이름 로고

[ideogram.ai](https://ideogram.ai) 에서:
\`\`\`
Character logo for "[캐릭터 이름]",
cute bubbly font, the name in Korean and English,
pastel pink and white, adorable mascot style,
suitable for Instagram profile
\`\`\`

---

## 📅 Step 4: Gemini 무료로 30일 콘텐츠 전략

\`\`\`
AI 펫 인플루언서 [캐릭터 이름] 계정의 30일 콘텐츠 캘린더:

계정 컨셉: [컨셉]
업로드: 주 5회 (월~금)

각 포스트:
- 날짜/요일
- 콘텐츠 유형 (공감형/정보형/이벤트형/질문형)
- 캐릭터가 하는 행동/상황
- 캡션 핵심 문구
- 이미지 생성용 프롬프트 (영문)
\`\`\`

---

## 🖼️ Step 5: Canva로 피드 콘텐츠 제작

**콘텐츠 유형별 Canva 제작:**

1. **공감 카드**: Ideogram 캐릭터 + 텍스트 오버레이
   \`\`\`
   "월요일 아침인데 아직도 이불 속에 있는 사람 🐾"
   \`\`\`

2. **정보 카드**: 캐릭터가 설명하는 스타일의 인포그래픽

3. **릴스 썸네일**: 클릭 유도하는 캐릭터 표정 + 문구

---

## 📊 실험 결과

| 기간 | 지표 |
|------|------|
| 1주차 | 계정 세팅 + 9개 포스트 |
| 2주차 | 팔로워 50~200명 (해시태그·댓글 참여 의존) |
| 1개월 | 팔로워 200~1,000명 |
| 비용 | **$0** |

---

## 💡 팔로워 빠르게 모으는 전략

\`\`\`
[캐릭터 컨셉] AI 펫 인플루언서 계정을
팔로워 0에서 1,000명까지 3개월 안에 키우는
무료 성장 전략을 단계별로 알려줘.
특히 초반 인게이지먼트를 만드는 방법 중심으로.
\`\`\`
`,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 13) 압도적 효율의 캘린더 앱 종결
  //    Lindy.ai($49/월) 비교 표현 정리, "보유" → "무료"
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'f198d6ad-753d-4600-bc8c-232b2044c0d1',
    title: '압도적 효율의 캘린더 앱 종결',
    stack: ['Claude Desktop', 'Google Calendar', 'Notion', 'MCP'],
    content: `## 🎯 이 실험의 목표

Claude Desktop + MCP로 Google Calendar와 Notion을 연결해
**일정 관리 업무 90%를 자연어 명령으로 처리**한다.
Lindy.ai($49/월) 같은 유료 자동화 도구 없이 **무료 도구만으로** 동일한 결과.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **Claude Desktop** | ✅ 무료 설치 (claude.ai 무료 계정) |
| **MCP 서버** | ✅ 오픈소스, 무료 |
| **Google Calendar** | ✅ 무료 |
| **Notion** | ✅ 무료 플랜 |

> Lindy.ai($49/월) 대신 **Claude.ai 무료** + **MCP(무료)** 로 동일하게 구현.

---

## ⚙️ Step 1: 빠른 설치 가이드

**Claude Desktop 설치:**
→ [claude.ai/download](https://claude.ai/download)
무료 계정으로 로그인하면 즉시 사용 가능.

**config 파일 열기:**
\`\`\`
Mac: ~/Library/Application Support/Claude/claude_desktop_config.json
Windows: %APPDATA%\\Claude\\claude_desktop_config.json
\`\`\`

**Google Calendar MCP 추가:**
\`\`\`json
{
  "mcpServers": {
    "google-calendar": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-calendar"],
      "env": {
        "GOOGLE_CLIENT_ID": "발급한 ID",
        "GOOGLE_CLIENT_SECRET": "발급한 Secret",
        "GOOGLE_REFRESH_TOKEN": "발급한 Token"
      }
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": { "NOTION_API_KEY": "secret_xxxxx" }
    }
  }
}
\`\`\`

Google OAuth 발급: [console.cloud.google.com](https://console.cloud.google.com)
→ API 라이브러리 → Calendar API 활성화 → OAuth 2.0 자격증명

---

## 🗓️ Step 2: 일정 자동화 명령 모음

**미팅 일정 분석:**
\`\`\`
이번 주 내 캘린더에서:
1. 집중 업무 가능한 2시간 블록 3개 찾아줘
2. 연속 미팅이 3개 이상 붙어있는 날 알려줘 (조정 필요)
3. 점심 시간이 없는 날 있으면 알려줘
\`\`\`

**미팅 준비 자동화:**
\`\`\`
내일 오전 10시 [회의명] 미팅 준비해줘:
- Notion에서 지난달 관련 회의록 찾아서 요약
- 오늘 남은 일정 확인해서 준비 시간 있는지 체크
- 캘린더에 '자료 준비' 블록 1시간 추가해줘 (가능한 빈 시간에)
\`\`\`

**주간 정리 자동화:**
\`\`\`
이번 주 캘린더 기반으로 주간 업무 보고서 작성:
- 완료된 미팅/일정 목록
- 내주 주요 일정 미리보기
- 지연되거나 빠진 것 있으면 표시
Notion '주간 보고' 페이지에 마크다운으로 저장해줘.
\`\`\`

---

## ⏰ Step 3: 반복 업무 시간 블록 자동 설정

\`\`\`
내 작업 패턴에 맞는 시간 블록을 캘린더에 만들어줘:

원하는 루틴:
- 월~금 오전 9~11시: 딥워크 블록 (회의 없는 집중 시간)
- 매일 오후 12~1시: 점심 블록
- 월/수/금 오후 4시: 이메일 처리 30분

단, 이미 잡힌 회의와 겹치는 날은 건너뛰고,
빈 슬롯에만 추가해줘.
\`\`\`

---

## 📊 실험 결과

| 업무 | 기존 | Claude MCP |
|------|------|-----------|
| 주간 일정 파악 | 10분 | 30초 |
| 미팅 준비 자료 수집 | 30분 | 2분 |
| 주간 보고서 작성 | 45분 | 3분 |
| 빈 시간 블록 찾기 | 5분 | 즉시 |
| **주간 절감** | — | **약 5시간** |
`,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 14) Suno AI로 브랜드 BGM 5분 완성 — 변경 거의 없음
  //     "Pro 플랜($8/월) 필요" 표현은 사실 안내라 유지.
  // ──────────────────────────────────────────────────────────────────────
  {
    id: '337c32ac-ff3f-41bb-9665-0077fd70c259',
    title: 'Suno AI로 브랜드 BGM 5분 완성',
    stack: ['Suno', 'CapCut'],
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

> ⚠️ 상업적 사용은 별도 라이선스 필요 (Suno 약관 확인)

---

## 💡 장르별 추천 키워드

| 용도 | 키워드 |
|------|--------|
| 발표/피치덱 | \`corporate inspiring, epic buildup\` |
| 유튜브 인트로 | \`energetic electronic, punchy beat\` |
| 감성 브이로그 | \`acoustic guitar, warm lo-fi\` |
| 제품 데모 영상 | \`tech minimal, clean synth\` |`,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 15) Perplexity Deep Research → "Perplexity 기본 검색"으로 톤 변경
  //     Pro 전용 기능 의존을 버리고 무료 검색을 여러 번 + Claude 무료로 종합
  // ──────────────────────────────────────────────────────────────────────
  {
    id: '91474f26-f562-4a99-a8fb-afd6693f8aea',
    title: 'Perplexity로 시장 조사 보고서 완성',
    stack: ['Perplexity 무료', 'Claude.ai 무료', 'Notion'],
    content: `## 🎯 이 실험의 목표

**Perplexity 무료 플랜**의 검색 기능과 **Claude.ai 무료 플랜**을 조합해
시장 조사 보고서를 자동 생성하고, 컨설팅 형식에 맞게 다듬어
실제 업무에 쓸 수 있는 문서를 만든다.

---

## 💸 비용 확인

| 도구 | 조건 | 비용 |
|------|------|------|
| **Perplexity 무료** | 일 검색 한도 내 무료 | ✅ $0 |
| **Claude.ai 무료** | 일 메시지 한도 내 무료 | ✅ $0 |
| **Notion** | 무료 플랜 | ✅ $0 |

> 유료 구독 없이 Perplexity 무료 + Claude.ai 무료만으로 진행.
> Pro 전용 "Deep Research" 대신, 무료 검색을 **3~5번 쪼개서 던지고** Claude.ai 무료가 종합하는 방식.

---

## 💬 Step 1: 무료 검색용 쿼리 분할 작성법

Perplexity 무료 검색은 한 번에 너무 광범위한 질문을 던지면 답이 얕다.
**범위를 좁힌 질문 3~5개로 쪼개서** 각각 던지는 게 핵심.

❌ 나쁜 예: "SaaS 시장 현황 알려줘"
✅ 좋은 예 (분할 쿼리):

\`\`\`
1) 2025~2026년 한국 B2B SaaS 시장 규모와 성장률 데이터를
   IDC, Gartner, 한국SW산업협회 자료 기준으로 알려줘. 출처 링크 포함.

2) 2025년 기준 한국 B2B SaaS 주요 플레이어 Top 10을
   투자 유치액, 매출 규모, 주력 버티컬과 함께 정리해줘.

3) HR Tech, 회계/재무 SaaS, CRM 카테고리 각각의
   최근 12개월 트렌드 변화와 신규 진입 스타트업을 알려줘.

4) 2027년까지 한국 B2B SaaS 시장 전망과
   주요 성장 동인/저해 요인을 분석해줘.
\`\`\`

각 쿼리를 따로 던져 결과를 모은다. 소요 시간: **약 10~15분**.

---

## 📋 Step 2: Claude.ai 무료로 컨설팅 보고서 형식 변환

위에서 모은 4개 답변을 모두 **claude.ai** 채팅에 붙여넣고:

\`\`\`
이 시장 조사 자료들을 컨설팅 보고서 형식으로 재구성해줘:

구조:
1. Executive Summary (핵심 인사이트 5줄)
2. 시장 현황 (수치 중심)
3. 경쟁 구도 분석
4. 기회 요인
5. 리스크 요인
6. 결론 및 제언

각 섹션마다 🔑 Key Insight 박스 포함.
전문 컨설팅 리포트 어조로 작성.
출처 링크는 보고서 마지막 References 섹션에 모아줘.
\`\`\`

---

## 🔍 Step 3: 데이터 검증 & 보완

생성된 수치 중 의심스러운 항목은 Perplexity 무료에서 재확인:

\`\`\`
"국내 SaaS 시장 규모 2025년 X조원"이라는 수치의
출처와 조사 방법론, 측정 범위를 정확히 알려줘.
다른 기관의 추정치와 비교도 해줘.
\`\`\`

---

## 📊 실험 결과

| 항목 | 기존 방식 | 무료 AI 조합 |
|------|----------|--------------------------|
| 소요 시간 | 1~2일 | 30~40분 |
| 소스 수 | 10~20개 수동 수집 | 검색당 5~15개 자동 수집 |
| 출처 명시 | 수동 | 자동 (클릭 가능한 링크) |
| 최신성 | 검색자 역량 의존 | 실시간 웹 크롤링 |
| 비용 | 시간 비용만 | **$0** |

---

## 💡 이런 상황에 활용한다

- 신규 사업 아이디어 타당성 검토
- 투자사 미팅 전 경쟁 시장 파악
- RFP/제안서의 시장 배경 섹션 작성
- 주간 업계 동향 브리핑 자료 자동 생성

> 무료 플랜의 검색 한도에 걸리면 Gemini 무료(gemini.google.com)로 같은 흐름을 보완할 수 있다.`,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 16) Lovable로 풀스택 웹앱 30분 완성 — 변경 거의 없음
  // ──────────────────────────────────────────────────────────────────────
  {
    id: '3ad9055f-9f6e-4799-9d7b-111ea87d8b4d',
    title: 'Lovable로 풀스택 웹앱 30분 완성',
    stack: ['Lovable', 'Supabase', 'Stripe'],
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

  // ──────────────────────────────────────────────────────────────────────
  // 17) n8n × Claude — Claude API는 유료지만 매우 저렴 → 그대로 유지
  //     단, "Claude API"는 유료라 stack에 그대로 두되 본문 톤만 살짝 정리
  // ──────────────────────────────────────────────────────────────────────
  {
    id: '0e707d95-a665-4c8d-aa94-24657459757b',
    title: 'n8n × Claude — 유튜브 트렌드 리포트 자동 발송',
    stack: ['n8n', 'Claude API', 'YouTube Data API', 'Gmail'],
    content: `## 🎯 이 실험의 목표
n8n 워크플로우로 **매주 월요일 오전 8시**에 지정한 키워드의 유튜브 트렌드 영상을 자동 수집하고,
Claude가 한국어 요약 리포트로 정리해서 이메일로 보내도록 구성한다.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| **n8n** (Cloud or Self-host) | 워크플로우 자동화 | 무료 플랜 가능 |
| **YouTube Data API v3** | 영상 검색 | 무료 (일 10,000 units) |
| **Claude API** | 트렌드 분석/요약 | 사용량 과금, 매우 저렴 |
| **Gmail** | 리포트 수신 | 무료 |

> Claude API는 토큰 사용량 기준으로 과금되며, 본 실험 규모에서는 **월 12원~** 수준.
> 개인 구독($20/월) 같은 정기 결제 없이 쓴 만큼만 결제됩니다.

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
    "content": "다음 유튜브 트렌드 영상 목록을 분석해서 이번 주 AI 콘텐츠 트렌드를 한국어로 요약해줘. 각 영상마다 한 줄 인사이트 포함.

{{ $json.videos | json }}"
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
- 일간으로 바꾸면 뉴스레터 소재 자동 수집
`,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 18) NotebookLM은 Google 무료 → 변경 없음
  // ──────────────────────────────────────────────────────────────────────
  {
    id: '72def022-1bd5-481a-9798-22356e8cbbc5',
    title: 'NotebookLM으로 논문 50페이지 10분 요약',
    stack: ['NotebookLM', 'Google Drive'],
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

  // ──────────────────────────────────────────────────────────────────────
  // 19) [모임 가이드] AI로 블로그 초안
  //     OpenAI/Claude API는 사용량 과금이라 그대로. ChatGPT 무료 톤 명시.
  // ──────────────────────────────────────────────────────────────────────
  {
    id: '89e2380a-ec90-457b-bc3f-3fe26e0d9015',
    title: '[모임 가이드] AI로 블로그 초안 작성 & 이메일 자동 배달 공방',
    stack: ['Google Sheets', 'ChatGPT API', 'Make.com', 'Gmail', 'Claude API'],
    content: `## 🎯 이 실험의 목표

Google Sheets에 키워드를 입력하면
**OpenAI API(GPT-4o mini)가 블로그 초안을 작성하고 Gmail로 자동 발송**하는
파이프라인을 Make.com으로 구축한다. 코딩 없이.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **Google Sheets** | ✅ 무료 |
| **Make.com** | ✅ 무료 (월 1,000 ops) |
| **Gmail** | ✅ 무료 |
| **OpenAI API** (GPT-4o mini) | △ 사용량 과금, 매우 저렴 ($0.002/1000 토큰) |

> API는 토큰 단위로 쓴 만큼만 결제 — 정기 구독 아님.
> 1개월 사용료 예상: **$1~3** (10~30편 기준)
> Claude API로 대체해도 가격대 비슷.

---

## ⚙️ Step 1: Google Sheets 템플릿 설정

구글 시트에 다음 컬럼 생성:

| 키워드 | 타겟독자 | 톤앤매너 | 글길이 | 발송이메일 | 상태 | 생성일시 |
|--------|---------|---------|--------|-----------|------|---------|

**예시 데이터:**
\`\`\`
| AI 부업 방법 | 직장인 | 친근하고 실용적 | 1500자 | my@email.com | 대기중 | |
\`\`\`

---

## 🔧 Step 2: Make.com 시나리오 구성

**Make.com 무료 가입** → 새 시나리오 → 다음 노드 순서로:

### 노드 1: Google Sheets Watch Rows
- 트리거: 새 행 추가 시 실행

### 노드 2: HTTP (OpenAI API 호출)
- URL: \`https://api.openai.com/v1/chat/completions\`
- Method: POST
- Headers: \`Authorization: Bearer [API Key]\`
- Body:
\`\`\`json
{
  "model": "gpt-4o-mini",
  "messages": [{
    "role": "user",
    "content": "다음 조건으로 블로그 포스트를 작성해줘:\\n키워드: {{1.keyword}}\\n타겟: {{1.target}}\\n톤: {{1.tone}}\\n길이: {{1.length}}\\n\\nH2 소제목 3개, 마무리 CTA 포함"
  }],
  "max_tokens": 2000
}
\`\`\`

### 노드 3: Gmail 발송
- To: \`{{1.email}}\`
- Subject: \`[자동생성] {{1.keyword}} 블로그 초안\`
- Body: API 응답 내용

### 노드 4: Google Sheets 상태 업데이트
- 해당 행의 '상태' → "완료"
- '생성일시' → 현재 시각

---

## ✅ Step 3: 테스트 & 검증

1. Google Sheets에 테스트 행 추가
2. Make.com → Run Once
3. 이메일 수신 확인
4. 전체 시나리오 **활성화(On)**

이후부터는 시트에 키워드 추가만 하면 자동 발송.

---

## 🚀 Step 4: Claude API로 퀄리티 업그레이드 (옵션)

OpenAI 초안을 Claude API로 한 번 더 다듬으려면 Make.com에 노드 하나 더 추가:
\`\`\`
URL: https://api.anthropic.com/v1/messages
Header: x-api-key: [Claude API Key]
         anthropic-version: 2023-06-01
\`\`\`

**프롬프트 예시:**
\`\`\`
이 블로그 초안을 업그레이드해줘:
1. 독창적이지 않은 문단 삭제
2. 구체적 사례/데이터 추가
3. 마지막 CTA를 더 강하게
4. 제목 5가지 대안 제시
\`\`\`

---

## 📊 실험 결과

| 항목 | 수동 작성 | 자동화 시스템 |
|------|---------|------------|
| 초안 생성 시간 | 2~3시간 | **3분** (자동) |
| 월 콘텐츠 | 4~8편 | **30편+** |
| 파이프라인 구축 | - | **2시간 (1회)** |
| 월 비용 | $0 (시간만) | **$1~3** (API) |

---

## 💡 100% 무료로 돌리고 싶다면

OpenAI/Claude API 노드를 빼고, 대신 매일 한 번씩 시트에 키워드를 추가한 뒤
**ChatGPT 무료 플랜(GPT-4o mini)** 또는 **Gemini 무료**에 직접 붙여넣어 초안을 받는 반자동 흐름으로도 충분.
하루 5~10편까지는 무료 한도 안에서 가능.
`,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 20) Kling AI 15초 광고 — 변경 거의 없음
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'b4632ba2-80a6-42f8-a33e-894ad1acef8a',
    title: 'Kling AI로 15초 브랜드 광고 영상 만들기',
    stack: ['Kling AI', 'CapCut', 'ElevenLabs'],
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

  // ──────────────────────────────────────────────────────────────────────
  // 21) Cursor × V0 → Cursor 제거, Claude Code 무료 활용 강조
  // ──────────────────────────────────────────────────────────────────────
  {
    id: '19f0a97d-0ada-4a98-81dd-a163264feb2b',
    title: 'V0 × Claude Code로 1시간 만에 SaaS MVP 배포',
    stack: ['Vercel v0', 'Claude Code', 'Supabase', 'Vercel'],
    content: `## 🎯 이 실험의 목표

V0 + Claude Code + Supabase 체인으로
**아이디어 → 실제 배포 가능한 SaaS MVP까지 1시간** 안에 완성한다.
유료 IDE 구독 없이, 무료/무료 한도 도구만으로.

---

## 💸 비용 확인

| 도구 | 무료 한도 | 비용 |
|------|----------|------|
| **V0 by Vercel** | 월 200 크레딧 무료 | ✅ $0 |
| **Claude Code (CLI)** | claude.ai 무료 계정으로 일 한도 내 사용 | ✅ $0 |
| **VSCode** | 완전 무료 IDE | ✅ $0 |
| **Supabase** | 무료 플랜 (2 프로젝트) | ✅ $0 |
| **Vercel** | 무료 호스팅 | ✅ $0 |

> **유료 IDE 구독 없이** 진행. VSCode + Claude Code(터미널 CLI) 조합이면 충분.

---

## 🚀 1시간 타임라인

\`\`\`
0:00 ~ 0:15  V0로 UI 컴포넌트 생성
0:15 ~ 0:30  VSCode + Claude Code로 비즈니스 로직 추가
0:30 ~ 0:45  Supabase DB 연결
0:45 ~ 1:00  Vercel 배포 + 테스트
\`\`\`

---

## 🎨 Step 1: V0로 UI 순식간에 생성 (15분)

[v0.dev](https://v0.dev) 접속 (Vercel 계정 무료):

\`\`\`
Build a SaaS dashboard with:
- Left sidebar navigation (Dashboard, Analytics, Settings, Billing)
- Main content area with 4 stat cards (users, revenue, conversion, churn)
- Recent activity table with 10 rows
- Dark mode support
- Responsive design (mobile + desktop)
Tech stack: Next.js, Tailwind CSS, shadcn/ui
\`\`\`

V0가 완성된 React 컴포넌트 코드 생성 → **Copy Code** → 프로젝트에 붙여넣기

**V0 수정 명령:**
\`\`\`
"stat 카드 색상을 브랜드 블루 계열로 바꿔줘"
"사이드바에 사용자 아바타와 이름 추가해줘"
"테이블에 정렬 기능 추가해줘"
\`\`\`

---

## 💻 Step 2: VSCode + Claude Code로 기능 구현 (15분)

VSCode([code.visualstudio.com](https://code.visualstudio.com))는 무료. Claude Code CLI는 claude.ai 무료 계정으로 사용 가능.

**터미널에서 Claude Code 실행:**
\`\`\`bash
# 프로젝트 폴더에서
claude
> Supabase와 연동해서 이 대시보드를 실제로 작동하게 만들어줘.
> users 테이블 CRUD + Google OAuth 인증 포함
\`\`\`

Claude Code가 파일을 직접 읽고 수정해준다. 추가 비용 없음(claude.ai 계정 사용량 한도 내).

---

## 🗄️ Step 3: Supabase DB 연결 (15분)

1. [supabase.com](https://supabase.com) → 새 프로젝트
2. Table Editor → 필요한 테이블 생성
3. Settings → API → URL + anon key 복사
4. \`.env.local\`에 추가:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
\`\`\`
5. Authentication → Providers → Google 활성화 (OAuth 앱 연결)

---

## 🚀 Step 4: Vercel 배포 (15분)

\`\`\`bash
# Git 초기화
git init && git add . && git commit -m "initial"

# GitHub 푸시
gh repo create my-saas --public && git push -u origin main
\`\`\`

[vercel.com](https://vercel.com) → Import Project → GitHub 연결
→ 환경변수 입력 → Deploy

배포 URL 자동 생성 완료!

---

## 📊 실험 결과

| 항목 | 기존 방식 | 무료 AI 체인 |
|------|----------|--------|
| UI 개발 | 3~5일 | 15분 |
| 백엔드 API | 3~5일 | 15분 |
| DB 설계 | 1~2일 | 5분 |
| 배포 설정 | 반나절 | 15분 |
| **합계** | **1~2주** | **1시간** |
| **도구 비용** | — | **$0** |
`,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 22) 에이전트로 1인 마케팅 에이전시 굴리기
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'c6a389b8-1744-4eca-85b9-339e6db743a8',
    title: '에이전트로 1인 마케팅 에이전시 굴리기',
    stack: ['Claude.ai 무료', 'ChatGPT 무료', 'Make.com', 'Canva', 'Buffer'],
    content: `## 🎯 이 실험의 목표

Claude.ai 무료 + ChatGPT 무료 + Make.com 조합으로
**1인이 마케팅 에이전시 수준의 콘텐츠를 생산**하는 시스템을 만든다.
CrewAI(기술 필요) + Jasper($49/월) 같은 유료 도구 없이 무료 플랜만으로.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **Claude.ai 무료** | ✅ 일 메시지 한도 내 무료 |
| **ChatGPT 무료** (GPT-4o mini) | ✅ 일 한도 내 무료 |
| **Make.com** | ✅ 무료 (월 1,000 ops) |
| **Canva** | ✅ 무료 플랜 |
| **Buffer** | ✅ 무료 (3채널) |

> 유료 카피라이팅 도구($49/월) 없이 무료 플랜 조합으로 충분.

---

## 🏭 전체 시스템 구조

\`\`\`
[Claude.ai 무료] 월간 콘텐츠 전략 + 컨텐츠 캘린더 수립
    ↓
[ChatGPT 무료] 카피라이팅 대량 생산 (50개/월)
    ↓
[Canva] 비주얼 자동 제작
    ↓
[Make.com] 구글 시트 → Buffer SNS 자동 스케줄링
    ↓
[Buffer] 인스타/링크드인/트위터 자동 발행
\`\`\`

---

## 📋 Step 1: Claude.ai 무료로 월간 콘텐츠 전략 (1시간/월)

\`\`\`
[브랜드/서비스명]의 5월 소셜 미디어 콘텐츠 전략을 수립해줘:

브랜드 정보:
- 서비스: [설명]
- 타겟: [타겟 고객]
- 톤앤매너: [예: 전문적이고 친근한]
- 목표: [인지도 / 리드 / 트래픽]

출력:
1. 5월 이슈/트렌드 캘린더 (이벤트 날짜 포함)
2. 콘텐츠 유형 배분 (교육형 40% / 참여형 30% / 홍보형 30%)
3. 주차별 핵심 주제 4주치
4. 각 주제별 SNS 포스트 아이디어 (인스타/링크드인)
5. 반드시 포함해야 할 키워드 10개
\`\`\`

---

## ✍️ Step 2: ChatGPT 무료로 카피 대량 생산 (2시간/월)

Claude.ai 무료의 전략을 바탕으로 ChatGPT 무료에서 실제 카피 생성:

\`\`\`
다음 주제로 SNS 포스트 10개를 한 번에 만들어줘:

주제: [Claude가 뽑은 주제]
브랜드 톤: [톤]
각 포스트 형식:
- 인스타그램 버전: 후킹 첫 줄 + 본문 4줄 + CTA + 해시태그 20개
- 링크드인 버전: 전문적 첫 줄 + 3포인트 인사이트 + 질문으로 마무리

번호 붙여서 10개 연속 출력해줘.
\`\`\`

**배치 생성 팁:**
한 번의 ChatGPT 무료 대화에서 주제별로 10개씩,
한 달 치 50개를 5번의 요청으로 완성.
일일 한도 도달 시 Gemini 무료로 갈아타기.

---

## 🎨 Step 3: Canva로 비주얼 양산

Canva 브랜드 키트 설정 후:
1. **카피+비주얼 1세트** 만들기 (약 10분)
2. **Bulk Create** 기능: 구글 시트에 텍스트 목록 입력 → 자동으로 카드 50장 생성

구글 시트 컬럼:
\`\`\`
| 포스트 번호 | 헤드라인 | 본문 요약 | 해시태그 |
\`\`\`

→ Canva "Bulk Create" → 연결 → 자동 생성!

---

## ⚙️ Step 4: Make.com 자동화 파이프라인

**무료 자동화 흐름:**
\`\`\`
Google Sheets (포스트 목록 추가)
    → Make.com 트리거 감지
    → Buffer API (예약 포스팅 등록)
    → Slack 알림 발송 (오늘 발행될 포스트 확인)
\`\`\`

Make.com 시나리오 설정 (노코드):
1. Trigger: Google Sheets → "새 행 추가 시"
2. Action 1: Buffer → "SNS 예약 포스팅 생성"
3. Action 2: Slack → "오늘 발행 예정 확인 알림"

---

## 📊 실험 결과

| 항목 | 기존 1인 마케터 | 무료 AI 시스템 |
|------|--------------|---------|
| 월 콘텐츠 생산량 | 10~20개 | **50개** |
| 실제 작업 시간 | 주 20시간 | **주 2시간** |
| 도구 비용 | $200+/월 | **$0** |
| 발행 일관성 | 불규칙 | 자동 스케줄 |
`,
  },

  // ──────────────────────────────────────────────────────────────────────
  // 23) 텍스트 한 줄로 4K 시네마틱 뮤직비디오
  //    DALL-E 3 → Ideogram/Adobe Firefly. ChatGPT 무료로 명시.
  // ──────────────────────────────────────────────────────────────────────
  {
    id: '92dac4c2-149a-42b4-8c82-933dd8e1c683',
    title: '텍스트 한 줄로 4K 시네마틱 뮤직비디오',
    stack: ['Suno', 'Ideogram', 'Adobe Firefly', 'Luma Dream Machine', 'CapCut'],
    content: `## 🎯 이 실험의 목표

Suno로 음악 생성 → Ideogram/Adobe Firefly로 비주얼 제작 → Luma AI로 영상화.
**비용 $0, 3시간**으로 시네마틱 뮤직비디오를 완성한다.

---

## 💸 비용 확인

| 도구 | 무료 한도 | 비용 |
|------|----------|------|
| **Suno** | 하루 50 크레딧 | ✅ $0 |
| **Ideogram** | 하루 25장 | ✅ $0 |
| **Adobe Firefly** | 월 25 크레딧 | ✅ $0 |
| **Luma Dream Machine** | 하루 5~10 생성 (무료) | ✅ $0 |
| **CapCut** | 완전 무료 | ✅ $0 |

> 유료 이미지 도구 없이 Ideogram + Adobe Firefly 조합으로 동급 비주얼 가능.

---

## 🎵 Step 1: Suno로 음악 완성 (20분)

[suno.com](https://suno.com) → Custom 탭:

\`\`\`
# 시네마틱 팝 발라드
cinematic orchestral pop, emotional female vocal,
sweeping strings and piano, building to epic chorus,
3 minutes, movie soundtrack quality, 75bpm

# 드라마틱 전자음악
dark electronic ambient, pulsing synth, haunting vocal,
cinematic trailer music, tension building, no lyrics
\`\`\`

**곡 구조 확인:**
- Verse → Chorus 전환이 자연스러운 버전 선택
- Extend로 풀 3분 트랙 완성

---

## 🎨 Step 2: Ideogram / Adobe Firefly로 씬 비주얼 제작 (40분)

ChatGPT 무료에서 먼저 씬 구성 요청:
\`\`\`
이 음악 [장르/분위기]에 어울리는 뮤직비디오 씬 8개를 설계해줘.
각 씬:
- 시간 (00:00~00:20 등)
- 장소/상황 설명
- 감정/색감 톤
- Ideogram/Adobe Firefly 이미지 프롬프트 (영문)
\`\`\`

씬별 이미지 생성 (Ideogram 또는 Firefly):
\`\`\`
씬 1: "Lone figure standing on a misty mountain peak at dawn,
  dramatic silhouette, golden hour light rays,
  cinematic wide angle, ethereal atmosphere,
  film photography style, 16:9 composition"
\`\`\`

> **사실적인 풍경/인물** → Adobe Firefly가 강점 (저작권 안전)
> **그래픽/디자인 톤** → Ideogram이 강점 (텍스트 정확)

---

## 🎬 Step 3: Luma AI로 이미지 → 영상 변환 (1시간)

[lumalabs.ai/dream-machine](https://lumalabs.ai/dream-machine):

1. 각 씬 이미지 업로드
2. Motion 프롬프트 입력:
\`\`\`
씬 1: "Slow camera pan left, fog drifting across scene,
      hair blowing gently in wind, 5 second clip"

씬 2: "Gradual zoom into face, soft blink animation,
      particles of light floating upward, cinematic"
\`\`\`

3. 5초 클립 생성 → 8씬 × 5초 = 40초 원본
4. 중요 씬은 **Extend** 기능으로 10~15초로 늘리기
5. 같은 씬 2~3번 생성해서 가장 나은 버전 선택

---

## ✂️ Step 4: CapCut으로 최종 편집 (30분)

1. 8개 영상 클립 음악 비트에 맞게 배치
2. 음악 피크 구간(코러스)에 가장 드라마틱한 씬 배치
3. 전환 효과: Fade / Cross Dissolve (너무 화려한 효과 지양)
4. 색보정: 영화 필터 적용 (시네마틱 룩)
5. 자막 (가사) 자동 생성 후 스타일 통일
6. **4K Export → YouTube 업로드**

---

## 📊 실험 결과

| 항목 | 내용 |
|------|------|
| 총 제작 시간 | **3시간** |
| 비용 | **$0** |
| 해상도 | 1080p (Luma 무료 기준) |
| 완성도 | YouTube 업로드 수준 |

---

## 💡 퀄리티 높이는 팁

**색감 통일이 핵심:**
\`\`\`
이 뮤직비디오의 모든 씬에 공통으로 적용할
시네마틱 색 팔레트와 분위기를 정해줘.
참고: [좋아하는 영화/뮤직비디오 스타일]
모든 Ideogram/Firefly 프롬프트 끝에 붙일 색감 설명어로 만들어줘.
\`\`\`
`,
  },
];

async function main() {
  console.log('=== Personal paid tools removal — May 2026 ===');
  console.log(`patches: ${PATCHES.length}`);

  // 1) 사전 sanity check: DB에 있는 모든 lab id가 우리 패치 set에 포함되는지 확인.
  const labs = await prisma.experiment.findMany({
    select: { id: true, title: true, stack: true },
  });
  const dbIds = new Set(labs.map((l) => l.id));
  const patchIds = new Set(PATCHES.map((p) => p.id));

  const missingInPatches = [...dbIds].filter((id) => !patchIds.has(id));
  const orphanPatches = [...patchIds].filter((id) => !dbIds.has(id));

  if (missingInPatches.length) {
    console.warn(
      `[WARN] DB에 있지만 패치 누락된 lab id (${missingInPatches.length}):`,
    );
    for (const id of missingInPatches) {
      const lab = labs.find((l) => l.id === id);
      console.warn(`  - ${id}  ${lab?.title ?? ''}`);
    }
  }
  if (orphanPatches.length) {
    console.warn(
      `[WARN] 패치에 정의되었지만 DB에 없는 id (${orphanPatches.length}):`,
      orphanPatches,
    );
  }

  // 2) 패치 적용
  let updated = 0;
  for (const patch of PATCHES) {
    const lab = labs.find((l) => l.id === patch.id);
    if (!lab) {
      console.warn(`  [skip] DB에 없음: ${patch.id} ${patch.title}`);
      continue;
    }

    console.log('---');
    console.log(`📝 ${patch.title}`);
    console.log(`   id    : ${patch.id}`);
    console.log(`   BEFORE stack: ${JSON.stringify(lab.stack)}`);
    console.log(`   AFTER  stack: ${JSON.stringify(patch.stack)}`);

    await prisma.experiment.update({
      where: { id: patch.id },
      data: {
        title: patch.title,
        stack: patch.stack,
        content: patch.content,
      },
    });
    updated += 1;
  }

  console.log('---');
  console.log(`✅ updated: ${updated} / ${PATCHES.length}`);
  console.log('=== done ===');
}

main()
  .catch((e) => {
    console.error('FAILED:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
