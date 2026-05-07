// @ts-nocheck
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const UPDATES = [
  // ── 1. 굿즈 만들기 ───────────────────────────────────────────────────
  {
    title: 'AI로 나만의 굿즈 만들고 오늘 판매 시작하기',
    patch: {
      stack: ['ChatGPT (DALL-E 3)', 'Ideogram', 'Recraft', 'Printify', 'Canva'],
      metric: '아이디어 → 실제 판매 시작까지 3시간 · 초기 비용 $0',
      description: 'ChatGPT와 Ideogram으로 디자인을 뽑고, Recraft로 벡터화, Printify에 올려 오늘 판매를 시작합니다. 재고 없는 POD 구조라 초기 비용 $0. 유료 구독 없이 전부 무료 도구로 완성 가능합니다.',
      content: `## 🎯 이 실험의 목표

AI 이미지 도구로 **나만의 오리지널 디자인**을 만들고,
POD(Print-On-Demand) 서비스를 연결해 **실제 판매 가능한 굿즈**를 오늘 바로 런칭한다.
초기 투자 비용 **$0**, 재고 보유 없이 주문이 오면 자동 제작·배송.

---

## 💸 비용 총정리 — 전부 무료로 가능

| 도구 | 무료 한도 | 유료 업그레이드 필요? |
|------|----------|---------------------|
| **ChatGPT (DALL-E 3)** | Plus 구독 시 무제한 (보유) | ❌ 이미 보유 |
| **Ideogram** | 하루 25장 무료 | ❌ 무료로 충분 |
| **Recraft** | 하루 50장 무료 + 벡터 변환 | ❌ 무료로 충분 |
| **Canva** | 무료 플랜으로 목업 제작 | ❌ 무료 가능 |
| **Printify** | 수수료 방식, 가입비 없음 | ❌ 무료 |
| **Etsy** | 등록비 $0.20/건만 발생 | ✅ $0.20 정도만 |

> 💡 **Midjourney($10/월)는 필요 없습니다.** ChatGPT DALL-E 3와 Ideogram으로 동급 결과물이 나옵니다.

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

## 🎨 Step 1: ChatGPT (DALL-E 3)로 디자인 생성

ChatGPT에서 이미지 생성 아이콘 클릭 후 아래 프롬프트 입력:

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
> "같은 스타일로 3가지 색상 버전 더 만들어줘"로 변형도 쉽게 가능.

---

## ✍️ Step 2: 텍스트 로고는 Ideogram으로

DALL-E 3는 텍스트 렌더링이 불안정할 수 있다. 브랜드명이나 문구가 들어가는 디자인은 **Ideogram**을 쓴다.

[ideogram.ai](https://ideogram.ai) 접속 (Google 계정으로 무료 가입):

\`\`\`
"COFFEE CHAOS" wordmark logo design,
bold condensed sans-serif font, espresso brown and cream,
minimal badge style, clean white background,
suitable for mug and tote bag printing
\`\`\`

- 오른쪽 패널에서 Style → **Design** 선택 시 로고에 최적화된 결과 출력
- \`Remix\` 버튼으로 폰트/색상 빠르게 변형
- 하루 25장 무료, 충분히 여러 버전 시도 가능

---

## ✂️ Step 3: Recraft로 벡터 변환 (배경 제거 포함)

Printify는 **300 DPI 이상 고해상도 PNG**가 필요.
픽셀 이미지를 벡터로 변환하고 배경을 제거한다.

1. [recraft.ai](https://recraft.ai) 접속 (무료 가입)
2. 상단 메뉴 → **Vectorize** 탭
3. ChatGPT 또는 Ideogram 이미지 업로드
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
   - 또는: ChatGPT에게 배경 이미지 생성 요청 후 합성

**ChatGPT 배경 생성 프롬프트:**
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

5. **상품 설명 자동 생성** — ChatGPT에게 요청:
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

**1. 트렌드 서핑 — ChatGPT에게 물어보기**
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
  },

  // ── 2. AI 디자이너 되어보기 ──────────────────────────────────────────
  {
    title: 'AI 디자이너 되어보기 — 로고부터 브랜드 아이덴티티까지',
    patch: {
      stack: ['ChatGPT (DALL-E 3)', 'Ideogram', 'Recraft', 'Adobe Firefly', 'Canva'],
      metric: '브랜드 아이덴티티 패키지 완성 · 디자이너 의뢰비 $0 · 2시간',
      description: 'ChatGPT(DALL-E 3)와 Ideogram으로 로고를 뽑고, Recraft로 벡터화, Canva로 명함·SNS 키트까지 마무리합니다. Midjourney 없이 전부 무료로 완성 가능합니다.',
      content: `## 🎯 이 실험의 목표

AI 디자인 도구들을 체계적으로 조합해 **완성된 브랜드 아이덴티티 패키지**를 만든다.
디자인 경력 없이도 전문 디자이너가 납품하는 수준의 결과물 완성.

> **완성 목표물**: 로고 + 컬러 팔레트 + 타이포그래피 가이드 + 명함 + SNS 키트

---

## 💸 비용 총정리

| 도구 | 무료 한도 | 내 상황 |
|------|----------|--------|
| **ChatGPT (DALL-E 3)** | Plus 플랜 무제한 | ✅ 이미 보유 |
| **Ideogram** | 하루 25장 무료 | ✅ 무료 가능 |
| **Recraft** | 하루 50장 + 벡터 무료 | ✅ 무료 가능 |
| **Adobe Firefly** | 월 25 크레딧 무료 | ✅ 무료 가능 |
| **Canva** | 무료 플랜으로 충분 | ✅ 무료 가능 |
| **Coolors** | 팔레트 생성 완전 무료 | ✅ 무료 |

> 💡 **Midjourney($10/월) 없이 완성 가능합니다.**
> ChatGPT DALL-E 3 + Ideogram 조합이 로고 작업에서 동급 이상 결과를 냅니다.

---

## 🛠️ 도구별 역할 분담

| 도구 | 맡은 역할 |
|------|-----------|
| **Claude** | 브랜드 전략 수립 · 프롬프트 설계 |
| **ChatGPT (DALL-E 3)** | 로고 컨셉 이미지 · 무드보드 생성 |
| **Ideogram** | 텍스트가 들어간 워드마크 로고 생성 |
| **Recraft** | 벡터(SVG) 변환 · 배경 제거 |
| **Adobe Firefly** | 브랜드 배경 이미지 · 목업 배경 생성 |
| **Canva** | 명함 · SNS 키트 · 최종 편집 |

---

## 📋 Step 0: Claude로 브랜드 전략 먼저 잡기

디자인 시작 전 Claude에게 방향을 잡아달라고 요청.
이 단계가 결과물 품질을 결정한다.

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
5. DALL-E 3용 로고 이미지 프롬프트 3가지 (영문으로)
6. 절대 피해야 할 디자인 방향
\`\`\`

---

## 🖼️ Step 1: ChatGPT (DALL-E 3)로 로고 컨셉 탐색

Claude가 작성해준 프롬프트를 ChatGPT 이미지 생성에 그대로 입력.

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
- "같은 스타일로 심플하게 다시" / "색상만 [색]으로 바꿔줘"
- "배경 없는 버전으로 다시 만들어줘"
- 4~5개 버전 뽑고 방향성 결정 후 집중

---

## ✍️ Step 2: Ideogram으로 워드마크 로고 완성

브랜드명 텍스트가 명확하게 들어가야 하는 로고는 **Ideogram**이 압도적.
DALL-E 3는 텍스트 렌더링 오류가 생기지만, Ideogram은 정확하게 출력된다.

[ideogram.ai](https://ideogram.ai) → 무료 가입 → 이미지 생성:

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

**팔레트 사용 규칙 (Claude에게 요청):**
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

ChatGPT/Ideogram 결과물은 픽셀 이미지.
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

## 📄 Step 7: Claude로 브랜드 가이드라인 문서 완성

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

**검증 체크리스트 (Claude에게 요청):**
\`\`\`
내가 만든 로고 디자인 설명이야: [설명]
전문 디자이너 관점에서 개선할 점과,
실수하기 쉬운 아마추어 디자인 실수를 피했는지 체크해줘.
\`\`\``,
    },
  },

  // ── 3. AI 기획자 되어보기 ────────────────────────────────────────────
  {
    title: 'AI 기획자 되어보기 — PRD부터 MVP 로드맵까지',
    patch: {
      stack: ['Claude', 'ChatGPT', 'Perplexity AI', 'Gamma', 'FigJam'],
      metric: '제품 기획 전체 산출물 6종 · 2주 작업 → 하루 완성',
      description: '보유 중인 Claude, ChatGPT, Perplexity로 시장 분석 → 페르소나 → PRD → 유저 스토리 → MVP 로드맵 → 발표 자료까지 실제 개발팀에 넘길 수 있는 기획 산출물을 완성합니다. 추가 비용 $0.',
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

## 💸 비용 총정리 — 전부 무료

| 도구 | 역할 | 비용 |
|------|------|------|
| **Claude** | PRD 작성, 구조화, 검토 | ✅ 이미 보유 |
| **ChatGPT** | 페르소나, 창의적 네이밍, 카피 | ✅ 이미 보유 |
| **Perplexity AI** | 시장 조사, 최신 경쟁사 분석 | ✅ 이미 보유 |
| **Gamma** | 발표 자료 자동 완성 | ✅ 무료 플랜 (10 덱/월) |
| **FigJam** | 시각적 로드맵 · 마인드맵 | ✅ 무료 (3 파일) |
| **Notion** | 산출물 정리·공유 | ✅ 무료 플랜 |

> 💡 Notion AI($10/월)는 필요 없습니다.
> Claude가 훨씬 더 잘 씁니다. Claude 결과물을 Notion에 붙여넣기만 하면 됩니다.

---

## 🔍 Step 1: Perplexity로 시장 분석 (30분)

Perplexity Pro의 **Deep Research** 모드로 시작.

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

**결과 → Claude로 구조화:**
\`\`\`
이 Perplexity 리서치 결과를 아래 형식으로 정리해줘:

1. SWOT 분석 (표 형식)
2. 한 페이지 Executive Summary (불릿 포인트)
3. 우리 제품이 노릴 수 있는 차별화 기회 3가지
\`\`\`

---

## 👥 Step 2: ChatGPT로 사용자 페르소나 3종 (20분)

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

## 📄 Step 3: Claude로 PRD 초안 작성 (45분)

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
  },

  // ── 4. Perplexity 시장조사 Lab — Claude API → claude.ai 수정 ──────────
  {
    title: 'Perplexity Deep Research로 시장 조사 보고서 완성',
    patch: {
      stack: ['Perplexity AI', 'Claude', 'Notion'],
      content: `## 🎯 이 실험의 목표

Perplexity의 **Deep Research** 기능으로 시장 조사 보고서를 자동 생성하고,
Claude로 전문 형식에 맞게 다듬어 실제 업무에 쓸 수 있는 문서를 만든다.

---

## 💸 비용 확인

| 도구 | 조건 | 비용 |
|------|------|------|
| **Perplexity Deep Research** | Pro 구독 필요 | ✅ 이미 보유 |
| **Claude** | claude.ai | ✅ 이미 보유 |
| **Notion** | 무료 플랜 | ✅ 무료 |

> Deep Research는 Perplexity **Pro 플랜**에서만 사용 가능. 이미 구독 중이면 추가 비용 없음.

---

## 💬 Step 1: Deep Research 쿼리 작성법

Perplexity 검색창 → **Focus: Deep Research** 선택 (Pro 전용)

❌ 나쁜 예: "SaaS 시장"
✅ 좋은 예:
\`\`\`
2025~2026년 국내 B2B SaaS 시장 현황 분석:
1. 시장 규모와 성장률 (출처 포함)
2. 주요 플레이어 현황 (스타트업 포함, 투자액 데이터)
3. 주요 버티컬 (HR, 회계, CRM 등) 점유율 비교
4. 2027년 전망 및 핵심 성장 동인
최신 보도자료, 투자 데이터, 업계 리포트 기반으로 정리해줘.
\`\`\`

Deep Research가 수십 개의 소스를 자동 크롤링 후 종합 보고서를 작성한다.
소요 시간: **약 3~5분**

---

## 📋 Step 2: Claude로 컨설팅 보고서 형식 변환

Perplexity 결과물을 **claude.ai**에 붙여넣고:

\`\`\`
이 내용을 컨설팅 보고서 형식으로 재구성해줘:

구조:
1. Executive Summary (핵심 인사이트 5줄)
2. 시장 현황 (수치 중심)
3. 경쟁 구도 분석
4. 기회 요인
5. 리스크 요인
6. 결론 및 제언

각 섹션마다 🔑 Key Insight 박스 포함.
전문 컨설팅 리포트 어조로 작성.
\`\`\`

---

## 🔍 Step 3: 데이터 검증 & 보완

생성된 수치 중 의심스러운 항목은 Perplexity에서 재확인:

\`\`\`
"국내 SaaS 시장 규모 2025년 X조원"이라는 수치의
출처와 조사 방법론, 측정 범위를 정확히 알려줘.
다른 기관의 추정치와 비교도 해줘.
\`\`\`

---

## 📊 실험 결과

| 항목 | 기존 방식 | Perplexity Deep Research |
|------|----------|--------------------------|
| 소요 시간 | 1~2일 | 30분 |
| 소스 수 | 10~20개 수동 수집 | 60~100개 자동 수집 |
| 출처 명시 | 수동 | 자동 (클릭 가능한 링크) |
| 최신성 | 검색자 역량 의존 | 실시간 웹 크롤링 |

---

## 💡 이런 상황에 활용한다

- 신규 사업 아이디어 타당성 검토
- 투자사 미팅 전 경쟁 시장 파악
- RFP/제안서의 시장 배경 섹션 작성
- 주간 업계 동향 브리핑 자료 자동 생성`,
    },
  },

  // ── 5. Claude MCP Lab — API 언급 수정 ────────────────────────────────
  {
    title: 'Claude 4 + MCP로 나만의 AI 업무 비서 세팅',
    patch: {
      stack: ['Claude Desktop', 'MCP', 'Google Calendar', 'Notion', 'GitHub'],
      metric: '반복 업무 주 7~8시간 단축 · 설치 비용 $0',
      content: `## 🎯 이 실험의 목표

Claude Desktop의 **MCP(Model Context Protocol)** 를 활용해
캘린더·노션·파일 시스템과 연결된 개인 AI 비서를 구성한다.
자연어 한 마디로 여러 앱을 동시에 제어.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **Claude Desktop** | ✅ 무료 설치 (claude.ai 계정 사용) |
| **MCP 서버들** | ✅ 오픈소스, 무료 |
| **Google Calendar** | ✅ 무료 |
| **Notion** | ✅ 무료 플랜 |
| **GitHub MCP** | ✅ 무료 |

> 별도 Claude API 키나 추가 비용 없음. Claude.ai 구독으로 사용 가능.

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
  },
];

async function main() {
  console.log(`🔄 Labs 업데이트 시작 — 총 ${UPDATES.length}개\n`);

  for (const u of UPDATES) {
    const existing = await prisma.experiment.findFirst({ where: { title: u.title } });
    if (!existing) {
      console.log(`  ⚠️ 찾을 수 없음: ${u.title}`);
      continue;
    }
    await prisma.experiment.update({
      where: { id: existing.id },
      data: u.patch,
    });
    console.log(`  ✅ 업데이트: ${u.title}`);
  }

  console.log('\n🎉 모든 Lab 업데이트 완료!');
}

main()
  .catch((e) => { console.error('❌ 오류:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
