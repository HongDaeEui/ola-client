// @ts-nocheck
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type Patch = {
  stack?: string[];
  metric?: string;
  description?: string;
  content?: string;
};

const UPDATES: { title: string; patch: Patch }[] = [
  // 1
  {
    title: '나노바나나로 쇼츠 찍자! 🍌✨',
    patch: {
      stack: ['ChatGPT', 'CapCut', 'Canva', 'YouTube Studio'],
      metric: '아이디어 → 쇼츠 업로드 15분 · 비용 $0',
      description:
        'ChatGPT로 스크립트를 짜고, CapCut AI 자동 편집으로 15분 만에 유튜브 쇼츠를 올립니다. 촬영·편집 경험 없이도 바로 시작할 수 있어요.',
      content: `## 🎯 이 실험의 목표

ChatGPT로 바이럴 스크립트를 뽑고, CapCut AI 자동 편집 기능으로
**아이디어 입력부터 유튜브 쇼츠 업로드까지 15분** 안에 완성한다.
카메라 앞에 서지 않아도, 편집을 몰라도 OK.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **ChatGPT** | ✅ 이미 보유 |
| **CapCut** | ✅ 무료 (모바일/PC) |
| **Canva** | ✅ 무료 플랜 |
| **YouTube Studio** | ✅ 무료 |

> 전체 비용 **$0**

---

## 💡 Step 0: 어떤 쇼츠가 터질까?

ChatGPT에게 먼저 물어보자:

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

## ✍️ Step 1: ChatGPT로 스크립트 작성 (3분)

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
4. **ChatGPT로 썸네일 문구 뽑기:**

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

**ChatGPT로 분석 요청:**
\`\`\`
유튜브 쇼츠에서 100만 뷰 넘은 영상들의 공통 패턴을 분석해줘.
특히 첫 3초 후킹 방식, 편집 템포, CTA 방식을 중심으로.
내 채널 방향: [분야]에 적용할 수 있는 구체적인 팁도 알려줘.
\`\`\`
`,
    },
  },

  // 2 (title 유지)
  {
    title: '나도 바나나? 이제 진짜다 Nanobanana Pro',
    patch: {
      stack: ['ChatGPT', 'Canva', 'Gemini', 'Instagram'],
      metric: '인스타 브랜딩 완성 · 디자인 비용 ₩0 · 2시간',
      description:
        'ChatGPT로 브랜드 컨셉을 잡고, Gemini로 캡션을 뽑고, Canva로 피드를 디자인합니다. 팔로워 0에서 시작하는 인스타 브랜딩 완전 가이드.',
      content: `## 🎯 이 실험의 목표

ChatGPT로 나만의 인스타그램 브랜드 컨셉을 잡고,
Canva AI로 통일된 피드를 디자인하고,
Gemini로 매력적인 캡션까지 완성한다.
팔로워 0에서 **브랜드가 있는 계정**으로 탈바꿈하는 2시간짜리 실험.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **ChatGPT** | ✅ 이미 보유 |
| **Gemini** | ✅ 이미 보유 |
| **Canva** | ✅ 무료 플랜으로 충분 |
| **Instagram** | ✅ 무료 |

---

## 📋 Step 1: ChatGPT로 인스타 브랜드 전략 수립 (20분)

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

## ✍️ Step 3: Gemini로 캡션 대량 생성 (30분)

Gemini는 검색 연동이 강해서 트렌드 파악 + 캡션에 탁월:

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

## 📅 Step 4: ChatGPT로 30일 콘텐츠 캘린더 (10분)

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
  },

  // 3
  {
    title: '직접 검색 ㄴㄴ, 코멧아 이거 해줘',
    patch: {
      stack: ['Perplexity AI', 'Claude', 'Notion'],
      metric: '반복 리서치 업무 80% 자동화',
      description:
        'Perplexity AI의 에이전트 검색 기능과 Claude를 조합해 복잡한 리서치, 자료 정리, 이메일 초안 작성을 직접 클릭하지 않고 자연어 명령으로 처리합니다.',
      content: `## 🎯 이 실험의 목표

Perplexity AI와 Claude를 조합해 **검색·리서치·문서 작성**을
직접 클릭하지 않고 자연어 명령만으로 처리하는 워크플로를 만든다.

> ✅ Perplexity Pro 보유 + Claude 보유 → 추가 비용 $0

---

## 💡 이 실험의 핵심 아이디어

\`\`\`
Perplexity = 최신 웹 데이터 수집 (실시간)
Claude = 수집한 데이터를 구조화·요약·문서화
\`\`\`

두 도구를 파이프라인으로 연결하면 리서치 전 과정이 자동화된다.

---

## 🔍 패턴 1: 경쟁사 즉석 분석 (5분)

**Perplexity에서:**
\`\`\`
[회사명/서비스명]의 최근 6개월 동향을 분석해줘:
1. 신규 기능/업데이트 내역
2. 언론 보도 주요 내용
3. 소셜미디어 반응 (긍정/부정)
4. 최근 채용 공고에서 보이는 전략적 방향
출처 링크 포함
\`\`\`

**Claude에서 (Perplexity 결과 붙여넣기):**
\`\`\`
이 경쟁사 분석 결과를 바탕으로:
1. 우리가 주목해야 할 위협 요인 3가지
2. 오히려 우리의 기회가 될 수 있는 것 2가지
3. 즉시 대응해야 할 액션 아이템 5개
를 정리해줘. 실무진에게 공유할 수 있는 간결한 형식으로.
\`\`\`

---

## 📰 패턴 2: 업계 트렌드 주간 브리핑 자동화

**Perplexity에:**
\`\`\`
지난 7일간 [분야] 업계에서 가장 중요한 뉴스/트렌드 10개를
중요도 순으로 정리해줘. 각 항목마다:
- 한 줄 요약
- 왜 중요한지
- 출처
\`\`\`

**Claude에서 변환:**
\`\`\`
이 트렌드를 우리 팀 주간 브리핑 슬랙 메시지 형식으로 바꿔줘:
- 이모지 사용
- 각 항목 3줄 이내
- 마지막에 "이번 주 우리가 할 수 있는 것" 1가지 추가
\`\`\`

---

## 📧 패턴 3: 이메일·제안서 초안 자동 생성

**Perplexity에서 배경 조사:**
\`\`\`
[상대방 회사명]에 대해 조사해줘:
창업 연도, 주요 서비스, 최근 성과, 현재 고민거리.
우리 [우리 서비스]를 제안할 때 어필 포인트를 찾아줘.
\`\`\`

**Claude에서 이메일 초안:**
\`\`\`
위 조사 내용 바탕으로 콜드 이메일을 써줘:
발신자: [내 이름, 직책]
목적: [미팅 제안 / 파트너십 / 데모 요청]
조건: 3문단 이내, 구체적 가치 제안 포함, 부담 없는 CTA
\`\`\`

---

## 🗂️ 패턴 4: 회의록 → 액션 아이템 즉시 변환

회의 후 메모/녹취 요약본을 Claude에 붙여넣고:
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
`,
    },
  },

  // 4 (title 유지)
  {
    title: '주토피아2 감독 모집 — AI로 애니메이션 만들기',
    patch: {
      stack: ['ChatGPT', 'DALL-E 3', 'Kling AI', 'ElevenLabs', 'CapCut'],
      metric: '단편 AI 애니메이션 3분 완성 · $5 이하',
      description:
        'ChatGPT로 스토리보드, DALL-E 3로 캐릭터와 배경, Kling AI로 영상 클립, ElevenLabs로 더빙까지. Sora 없이도 완성도 높은 AI 애니메이션을 만듭니다.',
      content: `## 🎯 이 실험의 목표

ChatGPT로 스토리 기획, DALL-E 3로 캐릭터 시각화,
Kling AI로 영상 클립 생성, ElevenLabs로 더빙까지.
**비용 $5 이하**로 완성도 있는 3분짜리 단편 AI 애니메이션을 제작한다.

---

## 💸 비용 확인

| 도구 | 무료 한도 | 비용 |
|------|----------|------|
| **ChatGPT** | 이미 보유 | ✅ $0 |
| **DALL-E 3** | ChatGPT에 포함 | ✅ $0 |
| **Kling AI** | 하루 66 크레딧 | ✅ $0 |
| **ElevenLabs** | 월 10분 무료 | ✅ $0 (단편 기준) |
| **CapCut** | 완전 무료 | ✅ $0 |

> Sora 2($20/월+) 없이도 가능. Kling AI 무료 크레딧으로 충분.

---

## 📖 Step 1: ChatGPT로 3분짜리 스토리 설계 (15분)

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
5. DALL-E 3용 주인공 이미지 프롬프트 (영문)
\`\`\`

---

## 🎨 Step 2: ChatGPT (DALL-E 3)로 캐릭터·배경 생성

**캐릭터 생성 프롬프트:**
\`\`\`
[ChatGPT가 만든 캐릭터 설명]을 바탕으로 이미지를 만들어줘.
스타일: pixar animation style, 3D render, soft lighting
배경: pure white (캐릭터 추출용)
포즈: [neutral standing pose / action pose]
\`\`\`

**배경 이미지 생성:**
\`\`\`
씬 1 배경: [장소 설명]
애니메이션 배경 스타일, 스튜디오 지브리 feels,
부드러운 채색, 16:9 비율
\`\`\`

> 💡 같은 캐릭터 여러 장면에 등장시키려면:
> "이전 이미지와 동일한 캐릭터인데 [다른 포즈/표정]으로 만들어줘"

---

## 🎬 Step 3: Kling AI로 씬 영상화 (핵심!)

[klingai.com](https://klingai.com) → 이미지-투-비디오 기능:

1. DALL-E 3로 만든 씬 이미지 업로드
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
내레이션 텍스트를 ChatGPT로 먼저 작성:

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
| 총 비용 | **$0** (무료 한도 내) |
| 씬 수 | 8~10개 |
| 완성 길이 | 3분 내외 |

---

## 💡 퀄리티 UP 팁

**일관된 캐릭터 유지:**
ChatGPT에게 첫 캐릭터 이미지 시드 프롬프트를 고정해서 요청하면
동일한 스타일로 여러 포즈를 뽑을 수 있다.

**Kling 프롬프트 공식:**
\`\`\`
[카메라 무빙] + [캐릭터 동작] + [감정/분위기] + [조명]
예: "slow push in, character turns around surprised,
    dramatic lighting, dusk atmosphere"
\`\`\`
`,
    },
  },

  // 5
  {
    title: '키워보자, 나의 AI 펫 인플루언서',
    patch: {
      stack: ['ChatGPT (DALL-E 3)', 'Canva', 'Ideogram', 'Instagram'],
      metric: '팔로워 0 → 1,000 목표 · AI 캐릭터 운영 비용 $0',
      description:
        'ChatGPT DALL-E 3로 독창적인 AI 펫 캐릭터를 만들고, Canva로 SNS 콘텐츠를 제작해 인플루언서 계정을 운영합니다. Midjourney 없이 전부 무료.',
      content: `## 🎯 이 실험의 목표

ChatGPT (DALL-E 3)로 독창적인 AI 펫 캐릭터를 디자인하고,
Canva로 콘텐츠를 양산해 **팔로워 1,000명짜리 AI 인플루언서 계정**을 만든다.
촬영 장비, 실제 반려동물 없이도 운영 가능.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **ChatGPT (DALL-E 3)** | ✅ 이미 보유, $0 |
| **Ideogram** | ✅ 무료 25장/일 |
| **Canva** | ✅ 무료 |
| **Instagram** | ✅ 무료 |

---

## 🐾 Step 1: ChatGPT로 캐릭터 설계 (15분)

\`\`\`
나만의 AI 펫 인플루언서 캐릭터를 설계해줘:

장르: [예: 귀여운 / 멋진 / 병맛 / 고급스러운]
동물 종류: [예: 고양이 / 카피바라 / 판다 / 펭귄]

다음을 만들어줘:
1. 캐릭터 이름 (3가지 후보)
2. 성격 특성 5가지
3. 말버릇/자주 쓰는 표현 5개
4. 콘텐츠 컨셉 (예: "직장인 공감 카피바라")
5. DALL-E 3용 캐릭터 기본 포즈 프롬프트 (영문)
6. 팔로워 타겟 페르소나
\`\`\`

---

## 🎨 Step 2: DALL-E 3로 캐릭터 시각화

캐릭터 기준 이미지 확정:

\`\`\`
ChatGPT에서 이미지 생성:

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

## 📅 Step 4: ChatGPT로 30일 콘텐츠 전략

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

1. **공감 카드**: DALL-E 3 캐릭터 + 텍스트 오버레이
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
  },

  // 6 (title 유지)
  {
    title: '압도적 효율의 캘린더 앱 종결',
    patch: {
      stack: ['Claude Desktop', 'Google Calendar', 'Notion', 'MCP'],
      metric: '일정 관리 시간 주 5시간 → 30분',
      description:
        'Claude Desktop과 MCP를 활용해 구글 캘린더·노션을 자연어로 제어합니다. 일정 조율, 미팅 준비, 주간 정리를 자동화하는 실전 설정 가이드.',
      content: `## 🎯 이 실험의 목표

Claude Desktop + MCP로 Google Calendar와 Notion을 연결해
**일정 관리 업무 90%를 자연어 명령으로 처리**한다.
Lindy.ai($49/월) 없이 Claude(보유)만으로 동일한 결과.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **Claude Desktop** | ✅ 무료 설치 |
| **MCP 서버** | ✅ 오픈소스, 무료 |
| **Google Calendar** | ✅ 무료 |
| **Notion** | ✅ 무료 플랜 |

> Lindy.ai($49/월) 대신 Claude(보유) + MCP(무료)로 동일하게 구현.

---

## ⚙️ Step 1: 빠른 설치 가이드

**Claude Desktop 설치:**
→ [claude.ai/download](https://claude.ai/download)

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
  },

  // 7
  {
    title: '나도 아티스트 — 내 안의 예술혼을 찾아라',
    patch: {
      stack: ['ChatGPT (DALL-E 3)', 'Ideogram', 'Canva', 'Adobe Firefly'],
      metric: 'AI 아트 포트폴리오 10작품 · 비용 $0',
      description:
        'ChatGPT DALL-E 3, Ideogram, Adobe Firefly를 활용해 나만의 AI 아트 스타일을 개발하고 디지털 포트폴리오를 완성합니다. Midjourney 없이 전부 무료.',
      content: `## 🎯 이 실험의 목표

세 가지 무료 AI 이미지 도구를 모두 써보며 각각의 강점을 익히고,
**나만의 시그니처 스타일**을 개발해 10개 작품으로 구성된 디지털 포트폴리오를 완성한다.

---

## 💸 비용 확인

| 도구 | 무료 한도 | 비용 |
|------|----------|------|
| **ChatGPT (DALL-E 3)** | Plus 플랜 포함 | ✅ $0 |
| **Ideogram** | 하루 25장 | ✅ $0 |
| **Adobe Firefly** | 월 25 크레딧 | ✅ $0 |
| **Canva** | 무료 플랜 | ✅ $0 |

> Midjourney($10/월) 없이 동급 결과물 가능.

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
| **DALL-E 3** | 지시 정확도 최고, 텍스트 포함 가능 | 스타일 다양성 제한 |
| **Ideogram** | 텍스트·로고 완벽, 디자인 특화 | 사진 현실감 낮음 |
| **Adobe Firefly** | 저작권 안전, 프로페셔널 | 창의성 보수적 |

---

## 🎨 Step 2: 도구별 특화 사용법

### DALL-E 3 — "내 머릿속 이미지를 정확하게"
\`\`\`
[장면 설명], [스타일], [색감], [분위기], [카메라 앵글]
예:
"A tiny red umbrella in the middle of an endless grey ocean,
watercolor illustration style, muted tones,
melancholic atmosphere, bird's eye view"
\`\`\`

**리파인 방법:**
ChatGPT 채팅에서 이미지 클릭 후:
"이 이미지에서 [요소]만 바꿔줘" / "더 [형용사]하게 만들어줘"

---

### Ideogram — "텍스트가 들어간 작품"
\`\`\`
Vintage travel poster for "Seoul 2026",
retro illustration style, korean hanok skyline,
bold sans-serif typography, warm orange and navy
\`\`\`

Style 옵션: Design / Illustration / Photo / Render / 3D

---

### Adobe Firefly — "상업적 사용 가능한 아트"
\`\`\`
Ethereal forest with glowing mushrooms,
fantasy nature photography, soft magical light,
editorial style, high fashion magazine
\`\`\`

**Generative Fill 활용:**
기존 사진 업로드 → 영역 선택 → "이 부분을 [설명]으로 바꿔줘"

---

## 🖼️ Step 3: 나만의 시그니처 스타일 개발

ChatGPT에게 방향 잡기:
\`\`\`
AI 아트로 나만의 시그니처 스타일을 만들고 싶어.
내 취향: [좋아하는 영화/그림/색감 키워드]

다음을 제안해줘:
1. 나만의 스타일 이름
2. 핵심 시각 요소 5가지
3. 시그니처 컬러 팔레트 (Hex 코드)
4. 이 스타일로 만들 10개 작품 아이디어
5. DALL-E 3 고정 스타일 프롬프트 (모든 작품에 공통으로 붙일 것)
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
  },

  // 8
  {
    title: '나도 한 곡 뽑았다 — AI로 내 노래 만들기',
    patch: {
      stack: ['Suno v4', 'ChatGPT', 'ElevenLabs', 'CapCut'],
      metric: '완성된 AI 노래 1곡 · 제작비 $0 · 1시간',
      description:
        'ChatGPT로 가사를 쓰고, Suno v4로 보컬까지 포함된 완성된 노래를 만들고, ElevenLabs로 목소리를 입힙니다. 음악 지식 0이어도 OK.',
      content: `## 🎯 이 실험의 목표

ChatGPT로 가사를 쓰고, Suno v4로 보컬까지 포함된 풀 트랙을 생성한다.
음악 이론 몰라도 OK. **1시간, $0**으로 내 노래를 완성한다.

---

## 💸 비용 확인

| 도구 | 무료 한도 | 비용 |
|------|----------|------|
| **ChatGPT** | 이미 보유 | ✅ $0 |
| **Suno v4** | 하루 50 크레딧 ≈ 10곡 | ✅ $0 |
| **ElevenLabs** | 월 10분 무료 | ✅ $0 |
| **CapCut** | 완전 무료 | ✅ $0 |

> 상업적 사용 시 Suno Pro($8/월) 필요.
> 개인 감상·공유 목적은 무료 OK.

---

## ✍️ Step 1: ChatGPT로 가사 작성 (15분)

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

Suno v4에서 각 파트가 인식될 수 있도록
[Verse 1], [Pre-chorus], [Chorus] 등 태그 포함해줘.
\`\`\`

---

## 🎵 Step 2: Suno v4로 곡 생성

[suno.com](https://suno.com) → **Custom** 탭:

**Style of Music (장르 지정):**
\`\`\`
# 밝은 K-pop 발라드
Korean ballad, piano-driven, emotional vocals,
orchestral strings, 75bpm, 2024 K-pop production style

# 신나는 뉴진스 스타일
NewJeans style, hyperpop, cute girl group vocal,
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

4개 씬 설명 + DALL-E 3용 이미지 프롬프트 포함
\`\`\`

DALL-E 3로 씬 이미지 생성 → CapCut에서 슬라이드쇼 + 음악 조합

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
  },

  // 9
  {
    title: '키워드만 넣었는데 글이 써진다고?',
    patch: {
      stack: ['Perplexity AI', 'Claude', 'ChatGPT', 'Notion'],
      metric: 'SEO 블로그 글 1편 30분 완성 · 비용 $0',
      description:
        'Perplexity로 최신 자료를 수집하고, Claude로 고품질 초안을 쓰고, ChatGPT로 SEO를 최적화합니다. Jasper($49/월) 없이 보유한 도구만으로 완성.',
      content: `## 🎯 이 실험의 목표

Perplexity → Claude → ChatGPT 3단계 파이프라인으로
**SEO 최적화된 블로그 포스트 한 편을 30분** 만에 완성한다.
유료 도구 Jasper 없이, 이미 보유한 도구만으로.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **Perplexity AI** | ✅ 이미 보유 |
| **Claude** | ✅ 이미 보유 |
| **ChatGPT** | ✅ 이미 보유 |
| **Notion** (저장) | ✅ 무료 |

---

## 🔄 전체 파이프라인

\`\`\`
키워드 입력
    ↓
Perplexity (리서치 + 최신 데이터 수집) — 5분
    ↓
Claude (고품질 초안 생성) — 10분
    ↓
ChatGPT (SEO 최적화 + 제목/메타) — 5분
    ↓
Notion 저장 → 워드프레스/티스토리 업로드 — 5분
\`\`\`

---

## 🔍 Step 1: Perplexity로 리서치 (5분)

\`\`\`
"[키워드]"에 대한 블로그 포스트 리서치를 해줘:

1. 이 주제의 핵심 정보 5가지 (최신 데이터 포함)
2. 독자들이 자주 묻는 질문 5개 (FAQ용)
3. 경쟁 상위 포스트들이 다루는 소제목 목록
4. 이 주제에서 아직 다뤄지지 않은 독창적 앵글 2개
5. 통계/수치 데이터 3개 (출처 포함)
\`\`\`

---

## ✍️ Step 2: Claude로 초안 작성 (10분)

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

## 🔍 Step 3: ChatGPT로 SEO 최적화 (5분)

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

| 항목 | 기존 방식 | AI 파이프라인 |
|------|----------|------------|
| 리서치 | 1~2시간 | 5분 |
| 초안 작성 | 2~3시간 | 10분 |
| SEO 최적화 | 1시간 | 5분 |
| **합계** | **4~6시간** | **20~30분** |
| 비용 | $49/월(Jasper) | **$0** |

---

## 💡 고품질 포스트를 위한 Claude 팁

\`\`\`
이 초안에서:
1. 독자가 "이미 아는 내용이다"라고 느낄 만한 문단 찾아서 삭제
2. 데이터/수치가 없는 주장에 Perplexity 자료로 뒷받침 추가
3. 마지막 문단을 독자가 행동하게 만드는 강한 CTA로 바꿔줘
\`\`\`
`,
    },
  },

  // 10
  {
    title: 'Cursor × V0로 1시간 만에 SaaS MVP 배포',
    patch: {
      stack: ['Cursor', 'Claude Code', 'Vercel v0', 'Supabase'],
      metric: 'SaaS MVP 배포 2주 → 1시간 · 무료 한도 내 가능',
      description:
        'Cursor AI IDE에서 V0로 UI를 뽑고, Supabase로 DB를 연결해 1시간 안에 실제 배포 가능한 SaaS MVP를 완성합니다.',
      content: `## 🎯 이 실험의 목표

Cursor + V0 + Supabase 체인으로
**아이디어 → 실제 배포 가능한 SaaS MVP까지 1시간** 안에 완성한다.

---

## 💸 비용 확인

| 도구 | 무료 한도 | 비용 |
|------|----------|------|
| **Cursor** | 14일 무료 체험 / 이후 $20/월 | △ |
| **V0 by Vercel** | 월 200 크레딧 무료 | ✅ $0 |
| **Supabase** | 무료 플랜 (2 프로젝트) | ✅ $0 |
| **Vercel** | 무료 호스팅 | ✅ $0 |

> 대안: Cursor 대신 **Claude Code**(보유, 추가 비용 없음) + VSCode로도 동일하게 가능.

---

## 🚀 1시간 타임라인

\`\`\`
0:00 ~ 0:15  V0로 UI 컴포넌트 생성
0:15 ~ 0:30  Cursor/Claude Code로 비즈니스 로직 추가
0:30 ~ 0:45  Supabase DB 연결
0:45 ~ 1:00  Vercel 배포 + 테스트
\`\`\`

---

## 🎨 Step 1: V0로 UI 순식간에 생성 (15분)

[v0.dev](https://v0.dev) 접속:

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

## 💻 Step 2: Cursor (또는 Claude Code)로 기능 구현 (15분)

**Cursor 사용 시:**
\`\`\`
Cursor 채팅 (Cmd+L):
"이 대시보드에 Supabase 연동을 추가해줘.
users 테이블에서 데이터를 가져와서 stat 카드에 실시간으로 표시해줘.
인증은 Supabase Auth (Google 소셜 로그인)로 구현해줘."
\`\`\`

**Claude Code 사용 시 (터미널):**
\`\`\`bash
# 프로젝트 폴더에서
claude
> Supabase와 연동해서 이 대시보드를 실제로 작동하게 만들어줘.
> users 테이블 CRUD + Google OAuth 인증 포함
\`\`\`

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

| 항목 | 기존 방식 | AI 체인 |
|------|----------|--------|
| UI 개발 | 3~5일 | 15분 |
| 백엔드 API | 3~5일 | 15분 |
| DB 설계 | 1~2일 | 5분 |
| 배포 설정 | 반나절 | 15분 |
| **합계** | **1~2주** | **1시간** |
`,
    },
  },

  // 11
  {
    title: '에이전트로 1인 마케팅 에이전시 굴리기',
    patch: {
      stack: ['Claude', 'ChatGPT', 'Make.com', 'Canva', 'Buffer'],
      metric: '마케팅 콘텐츠 월 50편 · 순 제작 시간 주 2시간',
      description:
        'Claude로 콘텐츠 전략을 잡고, ChatGPT로 카피를 양산하고, Make.com으로 자동화 파이프라인을 구성합니다. CrewAI 없이 보유한 도구만으로 1인 마케팅 에이전시를 운영합니다.',
      content: `## 🎯 이 실험의 목표

Claude + ChatGPT + Make.com 조합으로
**1인이 마케팅 에이전시 수준의 콘텐츠를 생산**하는 시스템을 만든다.
CrewAI(기술 필요) + Jasper($49/월) 대신 보유한 도구만으로.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **Claude** | ✅ 이미 보유 |
| **ChatGPT** | ✅ 이미 보유 |
| **Make.com** | ✅ 무료 (월 1,000 ops) |
| **Canva** | ✅ 무료 플랜 |
| **Buffer** | ✅ 무료 (3채널) |

---

## 🏭 전체 시스템 구조

\`\`\`
[Claude] 월간 콘텐츠 전략 + 컨텐츠 캘린더 수립
    ↓
[ChatGPT] 카피라이팅 대량 생산 (50개/월)
    ↓
[Canva] 비주얼 자동 제작
    ↓
[Make.com] 구글 시트 → Buffer SNS 자동 스케줄링
    ↓
[Buffer] 인스타/링크드인/트위터 자동 발행
\`\`\`

---

## 📋 Step 1: Claude로 월간 콘텐츠 전략 (1시간/월)

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

## ✍️ Step 2: ChatGPT로 카피 대량 생산 (2시간/월)

Claude의 전략을 바탕으로 ChatGPT에서 실제 카피 생성:

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
한 번의 ChatGPT 대화에서 주제별로 10개씩,
한 달 치 50개를 5번의 요청으로 완성.

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

| 항목 | 기존 1인 마케터 | AI 시스템 |
|------|--------------|---------|
| 월 콘텐츠 생산량 | 10~20개 | **50개** |
| 실제 작업 시간 | 주 20시간 | **주 2시간** |
| 도구 비용 | $200+/월 | **$0** |
| 발행 일관성 | 불규칙 | 자동 스케줄 |
`,
    },
  },

  // 12
  {
    title: '텍스트 한 줄로 4K 시네마틱 뮤직비디오',
    patch: {
      stack: ['Suno v4', 'ChatGPT (DALL-E 3)', 'Luma Dream Machine', 'CapCut'],
      metric: '시네마틱 뮤직비디오 완성 · 비용 $0 · 3시간',
      description:
        'Suno로 음악을 만들고, DALL-E 3로 비주얼을 뽑고, Luma AI로 영상화하는 파이프라인. Midjourney 없이 무료로 완성합니다.',
      content: `## 🎯 이 실험의 목표

Suno로 음악 생성 → DALL-E 3로 비주얼 제작 → Luma AI로 영상화.
**비용 $0, 3시간**으로 시네마틱 뮤직비디오를 완성한다.

---

## 💸 비용 확인

| 도구 | 무료 한도 | 비용 |
|------|----------|------|
| **Suno v4** | 하루 50 크레딧 | ✅ $0 |
| **ChatGPT (DALL-E 3)** | Plus 포함 | ✅ $0 |
| **Luma Dream Machine** | 하루 5~10 생성 (무료) | ✅ $0 |
| **CapCut** | 완전 무료 | ✅ $0 |

> Midjourney($10/월) 대신 DALL-E 3(보유)로 동급 비주얼 가능.

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

## 🎨 Step 2: DALL-E 3로 씬 비주얼 제작 (40분)

ChatGPT에서 먼저 씬 구성 요청:
\`\`\`
이 음악 [장르/분위기]에 어울리는 뮤직비디오 씬 8개를 설계해줘.
각 씬:
- 시간 (00:00~00:20 등)
- 장소/상황 설명
- 감정/색감 톤
- DALL-E 3 이미지 프롬프트 (영문)
\`\`\`

씬별 이미지 생성:
\`\`\`
씬 1: "Lone figure standing on a misty mountain peak at dawn,
  dramatic silhouette, golden hour light rays,
  cinematic wide angle, ethereal atmosphere,
  film photography style, 16:9 composition"
\`\`\`

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
모든 DALL-E 프롬프트 끝에 붙일 색감 설명어로 만들어줘.
\`\`\`
`,
    },
  },

  // 13 (title 유지)
  {
    title: '[모임 가이드] AI로 블로그 초안 작성 & 이메일 자동 배달 공방',
    patch: {
      stack: ['Google Sheets', 'ChatGPT', 'Make.com', 'Gmail', 'Claude'],
      metric: '키워드 입력 → 블로그 초안 이메일 수신까지 완전 자동화 · 비용 0원',
      description:
        'Google Sheets에 키워드를 입력하면 ChatGPT가 초안을 쓰고 Gmail로 자동 발송하는 파이프라인을 Make.com으로 2시간 안에 구축합니다. ChatGPT API 없이 Make.com 웹훅으로 가능합니다.',
      content: `## 🎯 이 실험의 목표

Google Sheets에 키워드를 입력하면
**ChatGPT가 블로그 초안을 작성하고 Gmail로 자동 발송**하는
파이프라인을 Make.com으로 구축한다. 코딩 없이.

---

## 💸 비용 확인

| 도구 | 비용 |
|------|------|
| **Google Sheets** | ✅ 무료 |
| **Make.com** | ✅ 무료 (월 1,000 ops) |
| **Gmail** | ✅ 무료 |
| **ChatGPT** | △ API 키 필요 ($0.002/1000 토큰, 매우 저렴) |

> ChatGPT API 1개월 사용료 예상: **$1~3** (10~30편 기준)
> API 없이: Make.com → Claude API (동일 가격대) 대체 가능

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

### 노드 2: HTTP (ChatGPT API 호출)
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
- Body: ChatGPT 응답 내용

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

## 🚀 Step 4: Claude로 퀄리티 업그레이드 (옵션)

ChatGPT 초안을 Claude에 붙여넣고:
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

## 💡 확장 아이디어

**Claude API 연동 버전:**
Make.com → Anthropic API 연결
\`\`\`
URL: https://api.anthropic.com/v1/messages
Header: x-api-key: [Claude API Key]
         anthropic-version: 2023-06-01
\`\`\`
Claude가 더 긴 글, 높은 품질의 초안을 생성.
`,
    },
  },
];

async function main() {
  let success = 0;
  let missing = 0;
  for (const u of UPDATES) {
    const existing = await prisma.experiment.findFirst({ where: { title: u.title } });
    if (!existing) {
      console.log('⚠️ 못 찾음:', u.title);
      missing++;
      continue;
    }
    await prisma.experiment.update({ where: { id: existing.id }, data: u.patch });
    console.log('✅', u.title);
    success++;
  }
  console.log(`\n🎉 완료 — 성공: ${success}, 누락: ${missing}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
