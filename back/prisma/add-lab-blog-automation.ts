// @ts-nocheck
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 기존 admin 계정 사용
  const admin = await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' },
  });

  if (!admin) {
    throw new Error('유저가 없습니다. seed를 먼저 실행해주세요.');
  }

  const lab = await prisma.experiment.create({
    data: {
      title: '비용 0원 블로그 자동화 — Make × Gemini × 티스토리',
      emoji: '⚙️',
      difficulty: '입문',
      description: 'Make 무료 플랜 + Gemini API로 티스토리 블로그를 완전 자동화! 월 1원도 안 쓰고 2시간마다 포스팅이 올라가는 파이프라인을 직접 만들어봤어요.',
      content: `## 🎯 이 실험의 목표
키워드 시트에 주제를 넣어두면 **Make가 2시간마다 자동으로 Gemini한테 글을 쓰게 하고, 티스토리에 자동 발행**하는 파이프라인을 만든다.
비용은 단 0원. 모든 도구의 무료 플랜만 사용한다.

---

## 🛠️ 준비물 (전부 무료)

| 도구 | 역할 | 무료 한도 |
|------|------|----------|
| **Make** | 자동화 워크플로우 | 월 1,000 Operations |
| **Google Gemini API** | AI 글쓰기 | 분당 15회, 일 1,500회 |
| **Google Sheets** | 키워드 목록 저장 | 무제한 |
| **티스토리 API** | 글 자동 발행 | 무료 |

---

## 📋 Step 1: 키워드 시트 준비

Google Sheets를 열고 아래 형태로 만든다.

| A열: 키워드 | B열: 카테고리 | C열: 발행여부 |
|------------|------------|------------|
| AI 이미지 생성 툴 비교 | IT/AI | FALSE |
| ChatGPT 프롬프트 모음 | IT/AI | FALSE |
| 노코드 자동화 툴 추천 | 생산성 | FALSE |

- **C열(발행여부)** 이 FALSE인 항목만 가져오게 설정할 것
- 글 발행 후 TRUE로 바꿔서 중복 발행 방지

---

## 🔑 Step 2: Gemini API 키 발급

1. [aistudio.google.com](https://aistudio.google.com) 접속
2. 우측 상단 **Get API key** → **Create API key**
3. 발급된 키 복사해두기 (나중에 Make에 붙여넣을 것)
4. 모델은 **Gemini 1.5 Flash** 선택 (속도 빠르고 무료 할당량 넉넉함)

---

## 🔐 Step 3: 티스토리 API 앱 등록

1. [tistory.com/guide/api](https://www.tistory.com/guide/api) 접속 → **앱 등록**
2. 앱 이름, 설명 입력 / CallbackURL: \`https://www.tistory.com\`
3. 등록 후 **App ID**와 **Secret Key** 저장
4. 브라우저 주소창에 아래 URL 입력해서 Access Token 발급:
\`\`\`
https://www.tistory.com/oauth/authorize
  ?client_id={App_ID}
  &redirect_uri=https://www.tistory.com
  &response_type=code
\`\`\`
5. 인증 후 리다이렉트 URL의 **code** 값 복사
6. 아래 API 호출로 Access Token 교환:
\`\`\`
POST https://www.tistory.com/oauth/access_token
  ?client_id={App_ID}
  &client_secret={Secret_Key}
  &redirect_uri=https://www.tistory.com
  &code={위에서 받은 code}
  &grant_type=authorization_code
\`\`\`

---

## ⚙️ Step 4: Make 시나리오 구성 (3단계)

Make에 접속 → **Create a new scenario**

### 모듈 1: Google Sheets — Search Rows
- 시트 연결 → **Filter** 설정: \`C열 = FALSE\`
- **Limit: 1** (한 번에 글 1개만 처리)

### 모듈 2: HTTP — Make a Request (Gemini 호출)
- URL: \`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API키}\`
- Method: POST
- Body (JSON):
\`\`\`json
{
  "contents": [{
    "parts": [{
      "text": "너는 IT 전문 블로거야. {{키워드}}에 대해 HTML 형식으로 티스토리 포스팅을 작성해줘. 제목 포함, 2000자 이상, 소제목은 <h2> 태그 사용."
    }]
  }]
}
\`\`\`
- 응답에서 \`candidates[0].content.parts[0].text\` 추출

### 모듈 3: HTTP — Make an OAuth 2.0 Request (티스토리 발행)
- URL: \`https://www.tistory.com/apis/post/write\`
- Method: POST
- Body:
\`\`\`json
{
  "access_token": "{Access_Token}",
  "blogName": "{블로그이름}",
  "title": "{{키워드}} — AI가 쓴 블로그",
  "content": "{{Gemini 응답}}",
  "visibility": "3",
  "category": "0"
}
\`\`\`

### 모듈 4: Google Sheets — Update a Row
- C열을 \`TRUE\`로 업데이트 → 중복 발행 방지

---

## ⏰ Step 5: 2시간 간격 스케줄 설정

Make 시나리오 좌측 하단 **시계 아이콘** → **Schedule** → \`Every 120 minutes\`

### 무료 Operation 계산

| 구분 | Operation 수 |
|------|------------|
| 1회 실행 (모듈 4개) | ~4 Ops |
| 하루 12회 실행 | ~48 Ops |
| 한 달 (30일) | ~1,440 Ops |

⚠️ Make 무료 플랜은 **월 1,000 Ops** → 한 달 내내 돌리려면 **3~4시간 간격** 권장

---

## 🖼️ 이미지 없이 0원 유지하는 팁

이미지 생성 API(DALL-E 등)는 유료. 대신:

**방법 1**: Gemini 프롬프트에 추가
> "본문 중 이미지가 필요한 자리에 [이미지: {설명}] 형식으로 표시해줘"

**방법 2**: Pexels 무료 API 연동
- [pexels.com/api](https://www.pexels.com/api) 에서 무료 키 발급
- Make에 모듈 추가: 키워드로 관련 이미지 URL 자동 검색 → 본문에 삽입

---

## 📊 실험 결과

- 글 1편 생성 시간: **약 30초**
- 한 달 운영 비용: **0원**
- 자동 발행된 글 수: **월 최대 30편** (3시간 간격 기준)
- SEO 반영 시작: 발행 후 평균 **3~7일**

---

## 💡 업그레이드 아이디어

- **Pexels API** 연동으로 썸네일 자동 삽입
- **Google Search Console API** 연동해서 반응 좋은 키워드 자동 보충
- 티스토리 대신 **WordPress / Notion** 연동도 동일 구조로 가능`,
      stack: ['Make', 'Google Gemini', '티스토리 API', 'Google Sheets'],
      metric: '월 운영비 0원 · 글 자동발행',
      authorId: admin.id,
      likes: 0,
      category: '자동화',
      color: 'from-violet-500 to-purple-700',
    },
  });

  console.log('✅ 실험실 콘텐츠 추가 완료:', lab.id, lab.title);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
