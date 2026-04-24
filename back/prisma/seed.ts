// @ts-nocheck
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { dummyTools } from './seed-tools';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seed starting...');

  // 1. Clean existing data
  await prisma.meetupAttendee.deleteMany();
  await prisma.meetup.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.experiment.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Admin Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@olalab.kr',
      username: 'ola_admin',
      name: 'Ola Admin',
      role: 'ADMIN',
    },
  });

  const creator1 = await prisma.user.create({
    data: {
      email: 'creator1@olalab.kr',
      username: 'Creative_Choi',
      name: 'Creator Choi',
      role: 'CREATOR',
    },
  });

  const creator2 = await prisma.user.create({
    data: {
      email: 'creator2@olalab.kr',
      username: 'Dev_Pastel',
      name: 'Dev Pastel',
      role: 'CREATOR',
    },
  });

  // 3. Seed Tools
  // dummyTools array is now imported from ./seed-tools.ts

  for (const tool of dummyTools) {
    await prisma.tool.create({ data: tool });
  }

  // 4. Seed Experiments (Labs)
  const experiments = [
    {
      title: '나노바나나로 쇼츠 찍자! 🍌✨',
      emoji: '🎬',
      difficulty: '입문',
      description: 'Nanobanana Pro로 숏폼 기획부터 제작까지 직접 만들어봤어요!',
      content: `## 🎬 Step 1: 숏폼 콘셉트 잡기
Nanobanana Pro의 "트렌드 분석" 탭에서 요즘 뜨는 숏폼 키워드를 확인합니다. "먹방 ASMR", "하루루틴" 등 카테고리별 인기 포맷을 추천받을 수 있어요.

## 🖼️ Step 2: AI로 썸네일 & 장면 구성
텍스트 한 줄로 장면별 이미지를 생성합니다. "귀여운 바나나 캐릭터가 카페에서 커피 마시는 장면" 같은 프롬프트면 충분!

## ✂️ Step 3: CapCut으로 편집 & 자막
생성된 이미지들을 CapCut에 넣고, AI 자동 자막 + BGM을 입혀 30초 쇼츠를 완성합니다.

## 📤 Step 4: 업로드 & 반응 확인
YouTube Shorts와 인스타 릴스에 동시 업로드! 첫 쇼츠의 조회수가 500을 넘겼어요 🎉`,
      stack: ['Nanobanana Pro', 'CapCut', 'Canva'],
      metric: '제작 시간 15분',
      authorId: creator1.id,
      likes: 234,
      category: '크리에이티브',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      title: '나도 바나나? 이제 진짜다 Nanobanana Pro',
      emoji: '🍌',
      difficulty: '입문',
      description: '포토샵 없이 AI로 이미지·광고 콘텐츠를 완성했어요!',
      content: `## 🍌 Step 1: 브랜드 이미지 생성
Nanobanana Pro에 "미니멀한 카페 브랜드 로고, 노란색 톤" 프롬프트를 입력하면 5초 만에 로고 시안 4개가 뿅!

## 🎨 Step 2: SNS 카드 뉴스 제작
생성된 브랜드 이미지로 인스타그램 카드 뉴스 템플릿을 만듭니다. Canva와 연동하면 레이아웃까지 자동으로!

## 📱 Step 3: 광고 배너 자동 생성
"여름 세일 20% 할인" 텍스트만 넣으면, 사이즈별(스토리/피드/배너) 광고 크리에이티브가 한 번에 생성됩니다.

## 📊 Step 4: A/B 테스트용 변형 생성
같은 콘셉트로 색상, 레이아웃, 문구를 바꾼 변형 3개를 자동으로 만들어 A/B 테스트 준비 완료!`,
      stack: ['Nanobanana Pro', 'Canva', 'Instagram'],
      metric: '디자인 비용 ₩0',
      authorId: creator1.id,
      likes: 189,
      category: '크리에이티브',
      color: 'from-yellow-300 to-amber-500',
    },
    {
      title: '직접 검색 ㄴㄴ, 코멧아 이거 해줘',
      emoji: '🧠',
      difficulty: '입문',
      description: '차세대 AI 브라우저로 리서치와 정리를 한 번에 경험했어요!',
      content: `## 🔍 Step 1: Perplexity Comet 설치 & 첫인상
Chrome 대신 Comet을 기본 브라우저로 설정합니다. 주소창 자체가 AI 검색창이에요!

## 🧠 Step 2: 리서치 자동화 테스트
"2026년 한국 AI 스타트업 투자 동향을 표로 정리해줘"를 입력하니, 10개 소스를 크롤링해서 깔끔한 표로 만들어줬어요.

## ✉️ Step 3: 행동(Action) 실행
"이 내용으로 팀 슬랙 채널에 요약 메시지 작성해줘" 한마디에 메시지 초안까지 완성. 검색 → 정리 → 공유가 원클릭!

## 📝 Step 4: Notion에 자동 저장
리서치 결과를 Notion 데이터베이스에 자동으로 정리해서 저장합니다. 나중에 다시 찾을 필요 없이 깔끔하게!`,
      stack: ['Perplexity Comet', 'Notion', 'Slack'],
      metric: '리서치 시간 80% 단축',
      authorId: creator2.id,
      likes: 312,
      category: '생산성',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: '주토피아2 감독 모집 — AI로 애니메이션 만들기',
      emoji: '🦊',
      difficulty: '중급',
      description: '스토리부터 캐릭터, 영상까지 AI로 제작했어요!',
      content: `## 📖 Step 1: ChatGPT로 스토리보드 작성
"주토피아 세계관에서 새로운 캐릭터가 등장하는 3분짜리 단편 시나리오를 작성해줘" 프롬프트로 장면별 시나리오를 뽑습니다.

## 🎨 Step 2: Midjourney로 캐릭터 디자인
시나리오 속 캐릭터 설명을 Midjourney에 넣어 일관된 스타일의 캐릭터 시트를 생성합니다. --sref로 스타일 고정!

## 🎬 Step 3: Sora 2로 장면 영상화
각 장면의 이미지를 Sora 2에 넣고 "카메라가 천천히 패닝하며 캐릭터가 걸어가는" 식으로 모션을 부여합니다.

## 🎵 Step 4: ElevenLabs로 성우 & BGM
캐릭터별 목소리를 ElevenLabs로 합성하고, Suno v4로 배경음악을 작곡합니다.

## ✂️ Step 5: 최종 편집 & 공개
CapCut에서 영상들을 이어붙이고 자막을 넣어 완성! YouTube에 "AI 단편 애니메이션" 시리즈로 올렸어요.`,
      stack: ['Sora 2', 'Midjourney', 'ElevenLabs', 'ChatGPT'],
      metric: '제작 비용 $5 이하',
      authorId: creator1.id,
      likes: 478,
      category: '크리에이티브',
      color: 'from-orange-500 to-red-600',
    },
    {
      title: '키워보자, 나의 AI 펫 인플루언서',
      emoji: '🐶',
      difficulty: '입문',
      description: 'AI 펫 캐릭터를 기획하고 광고 콘텐츠까지 만들어봤어요!',
      content: `## 🐾 Step 1: 펫 캐릭터 콘셉트 설정
ChatGPT로 "인스타 인플루언서 강아지 캐릭터, 이름은 모카, 성격은 호기심 많고 귀여운" 세계관을 만듭니다.

## 🎨 Step 2: Midjourney로 일관된 비주얼 생성
모카의 프로필 사진, 일상 사진, 계절별 코스튬 사진 등을 Midjourney로 대량 생성합니다. --cref로 얼굴 일관성 유지!

## 📸 Step 3: 인스타 피드 기획
Canva에서 모카의 인스타 피드를 기획합니다. "월요일은 모카의 산책 일기", "금요일은 모카의 간식 리뷰" 같은 시리즈를 만들어요.

## 💰 Step 4: 브랜드 협찬 콘텐츠 제작
가상의 펫 브랜드 협찬 포스트를 만들어봅니다. "모카가 직접 먹어본 유기농 사료 리뷰" — 실제 브랜드에서 DM이 왔어요!`,
      stack: ['Midjourney', 'ChatGPT', 'Canva'],
      metric: '팔로워 0→2,000 (2주)',
      authorId: creator1.id,
      likes: 267,
      category: '크리에이티브',
      color: 'from-amber-400 to-orange-500',
    },
    {
      title: '압도적 효율의 캘린더 앱 종결',
      emoji: '🗓️',
      difficulty: '입문',
      description: '구글캘린더 × 노션 × Lindy로 일정 관리를 완전 자동화했어요!',
      content: `## 📅 Step 1: 구글 캘린더 + 노션 캘린더 연동
Notion 캘린더로 구글 캘린더와 양방향 동기화를 설정합니다. 한 곳에서 모든 일정을 볼 수 있어요.

## 🤖 Step 2: Lindy 에이전트 연결
Lindy AI에 "매일 아침 9시에 오늘 일정 요약해서 슬랙으로 보내줘"를 설정합니다. 회의 전 30분 알림도 추가!

## 📋 Step 3: 일정 자동 분류
"회의", "딥워크", "개인", "운동" 등 카테고리를 만들고 Lindy가 새 일정을 자동 분류하도록 규칙을 세팅합니다.

## 📊 Step 4: 주간 리뷰 자동화
매주 금요일 오후 5시, Lindy가 "이번 주 시간 사용 분석 리포트"를 자동으로 만들어 Notion에 저장합니다.`,
      stack: ['Google Calendar', 'Notion', 'Lindy.ai'],
      metric: '일정 관리 시간 90% 절약',
      authorId: creator2.id,
      likes: 345,
      category: '생산성',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      title: '나도 아티스트 — 내 안의 예술혼을 찾아라',
      emoji: '🎨',
      difficulty: '입문',
      description: 'AI 이미지 생성 도구 3종을 비교하며 나만의 작품을 만들어봤어요!',
      content: `## 🖌️ Step 1: 같은 프롬프트로 3종 비교
"한국 전통 한옥 마을의 봄, 벚꽃이 만개한 수채화 스타일" 프롬프트를 Midjourney, DALL·E 3, Leonardo에 동시 입력!

## 🔍 Step 2: 스타일 실험
각 도구의 강점을 파악합니다. Midjourney = 분위기, DALL·E = 정확도, Leonardo = 스타일 컨트롤.

## 🎭 Step 3: 하이브리드 제작
Midjourney에서 생성한 이미지를 Leonardo의 img2img로 스타일 변환! 유화 → 수채화 → 팝아트까지.

## 🖼️ Step 4: 나만의 갤러리 완성
최종 작품 10개를 골라 "AI 아티스트 포트폴리오"를 만들었어요. 프린트 주문까지 해서 거실에 걸었습니다!`,
      stack: ['Midjourney', 'DALL·E 3', 'Leonardo AI'],
      metric: '작품 10개 완성',
      authorId: creator1.id,
      likes: 198,
      category: '크리에이티브',
      color: 'from-violet-500 to-purple-700',
    },
    {
      title: '나도 한 곡 뽑았다 — AI로 내 노래 만들기',
      emoji: '🎵',
      difficulty: '입문',
      description: 'Suno v4로 작사·작곡하고 ElevenLabs로 보컬까지 입혀봤어요!',
      content: `## 🎹 Step 1: 장르 & 무드 설정
Suno v4에서 "감성적인 K-인디 팝, 비 오는 날 카페에서 듣기 좋은, 여성 보컬" 프롬프트를 입력합니다.

## ✍️ Step 2: 가사 직접 쓰기
ChatGPT에게 "20대 후반의 서울 직장인이 퇴근길에 느끼는 감정을 담은 가사" 를 요청하고, 마음에 드는 부분만 편집합니다.

## 🎤 Step 3: ElevenLabs 보컬 합성
더 세밀한 보컬 컨트롤이 필요해서 ElevenLabs로 보컬 톤, 감정, 발음을 조정합니다.

## 🎧 Step 4: 마스터링 & 배포
최종 트랙을 SoundCloud에 업로드! 반응이 좋아서 시리즈로 이어가기로 했어요 🎶`,
      stack: ['Suno v4', 'ElevenLabs', 'ChatGPT'],
      metric: '제작 비용 $0',
      authorId: creator2.id,
      likes: 423,
      category: '크리에이티브',
      color: 'from-pink-500 to-rose-600',
    },
    {
      title: '키워드만 넣었는데 글이 써진다고?',
      emoji: '📝',
      difficulty: '입문',
      description: 'AI 자동화 블로그 글쓰기를 실습해봤어요!',
      content: `## 🔑 Step 1: 키워드 리서치
Claude에 "2026년 AI 트렌드 블로그 글 키워드 10개 추천해줘"를 요청합니다. SEO 검색량 데이터까지 분석!

## 📝 Step 2: 아웃라인 자동 생성
선택한 키워드를 Jasper에 넣으면 H1~H3 구조의 글 아웃라인이 자동 생성됩니다.

## ✍️ Step 3: 본문 작성 + 팩트체크
아웃라인별로 Claude가 본문을 작성하고, Perplexity로 수치와 출처를 교차 검증합니다.

## 🚀 Step 4: WordPress 자동 발행
완성된 글을 WordPress에 자동 발행! 메타 디스크립션, OG 이미지까지 AI가 생성합니다.

## 📈 Step 5: 성과 추적
2주 후 결과: 키워드 3개가 구글 1페이지에 노출되었어요!`,
      stack: ['Claude', 'Jasper', 'WordPress', 'Perplexity'],
      metric: '글 1편 작성 30분',
      authorId: admin.id,
      likes: 356,
      category: '자동화',
      color: 'from-emerald-500 to-green-600',
    },
    {
      title: 'Cursor × V0로 1시간 만에 SaaS MVP 배포',
      emoji: '💻',
      difficulty: '중급',
      description: '프론트엔드부터 DB 연동까지 AI 코딩 어시스턴트의 한계 테스트!',
      content: `## 💡 Step 1: v0로 UI 프로토타입
Vercel v0에 "SaaS 대시보드, 다크모드, 사이드바 내비게이션, 차트 위젯 4개" 프롬프트를 입력합니다. 10초 만에 프로토타입 완성!

## 🔧 Step 2: Cursor로 로직 구현
v0 코드를 Cursor에 붙여넣고 "Supabase 연동해서 실시간 데이터를 차트에 반영해줘"를 지시합니다.

## 🗄️ Step 3: Supabase 백엔드 세팅
Cursor가 알아서 Supabase 클라이언트 설정, 테이블 생성 SQL, Row Level Security까지 작성해줍니다.

## 🚀 Step 4: Vercel 배포
git push 한 방이면 Vercel이 자동 배포! 도메인 연결까지 총 소요 시간: 57분.

## 📊 Step 5: 결과
실제로 동작하는 SaaS MVP가 1시간 만에 완성되었습니다. 이전에는 2주 걸리던 작업이었어요.`,
      stack: ['Cursor', 'Vercel v0', 'Supabase'],
      metric: '개발 기간 2주 → 1시간',
      authorId: creator2.id,
      likes: 891,
      category: '개발',
      color: 'from-sky-500 to-indigo-700',
    },
    {
      title: '에이전트로 1인 마케팅 에이전시 굴리기',
      emoji: '🤖',
      difficulty: '고급',
      description: '타겟 분석부터 SEO 블로그 포스팅까지 완전 자동화한 파이프라인 구축기!',
      content: `## 🎯 Step 1: CrewAI로 에이전트 팀 구성
"마케팅 매니저", "카피라이터", "SEO 분석가", "소셜 미디어 매니저" 4개 에이전트를 CrewAI로 정의합니다.

## 🔍 Step 2: 타겟 고객 분석 자동화
마케팅 매니저 에이전트가 경쟁사 분석, 타겟 페르소나 정의, 키워드 리서치를 자동 수행합니다.

## ✍️ Step 3: 콘텐츠 생산 파이프라인
카피라이터 에이전트(Claude 3.5)가 블로그 글을 작성하고, SEO 분석가가 최적화하면, 소셜 미디어 매니저가 각 채널별 포스트로 변환합니다.

## 📊 Step 4: 자동 리포팅
매주 월요일 아침, 전주 성과 리포트가 Slack으로 자동 전송됩니다. CTR, 유입량, 전환율까지!

## 💰 Step 5: 실제 성과
1인 운영으로 월 100개 이상의 콘텐츠를 발행하고, 오가닉 트래픽 300% 증가를 달성했어요.`,
      stack: ['CrewAI', 'Claude 3.5', 'Jasper', 'Slack'],
      metric: '업무 시간 90% 단축',
      authorId: admin.id,
      likes: 542,
      category: '자동화',
      color: 'from-emerald-500 to-teal-700',
    },
    {
      title: '텍스트 한 줄로 4K 시네마틱 뮤직비디오',
      emoji: '🎥',
      difficulty: '중급',
      description: 'Suno v4로 작곡하고 Luma로 렌더링한 방구석 프로덕션 실험!',
      content: `## 🎹 Step 1: Suno v4로 음악 생성
"cinematic orchestral, epic trailer music, rising tension, 120bpm" 프롬프트로 2분짜리 영화 예고편 음악을 생성합니다.

## 🎨 Step 2: Midjourney로 키비주얼 제작
음악의 무드에 맞는 키비주얼 이미지 10장을 생성합니다. "광활한 사막, 석양, 실루엣, 시네마틱 4K" 스타일.

## 🎬 Step 3: Luma Dream Machine으로 영상화
키비주얼 이미지들을 Luma에 넣고 카메라 무빙을 지정합니다. 드론 숏, 팬, 줌인 등 다양한 앵글로!

## ✂️ Step 4: 편집 & 컬러 그레이딩
DaVinci Resolve에서 클립을 이어붙이고, 음악 비트에 맞춰 영상 전환을 동기화합니다.

## 🏆 Step 5: 결과
YouTube에 올린 뮤직비디오가 1만 조회를 돌파! 전문 영상팀 없이 혼자 만든 결과물이에요.`,
      stack: ['Suno v4', 'Luma', 'Midjourney'],
      metric: '제작 비용 $0',
      authorId: creator1.id,
      likes: 567,
      category: '크리에이티브',
      color: 'from-rose-500 to-pink-700',
    },
  ];

  for (const exp of experiments) {
    await prisma.experiment.create({ data: { ...exp, authorId: exp.authorId } });
  }

  // 5. Seed Prompts
  await prisma.prompt.createMany({
    data: [
      // ── 이미지 생성 (5개) ──
      {
        title: '초현실적인 사이버펑크 도시 배경',
        toolName: 'Midjourney v6.5',
        category: '이미지',
        content:
          '/imagine prompt: A hyper-realistic sprawling cyberpunk megacity at night, neon lights reflecting on wet pavement, cinematic lighting, 8k, highly detailed --ar 16:9 --v 6.5',
        authorId: creator1.id,
        likes: 124,
        views: 1200,
      },
      {
        title: '스튜디오 지브리 스타일 한국 시골 풍경',
        toolName: 'Midjourney v6.5',
        category: '이미지',
        content:
          '/imagine prompt: A serene Korean countryside village in Studio Ghibli animation style, vibrant green rice paddies, mountains in the background, warm golden sunset light, hand-painted watercolor texture, nostalgic and peaceful atmosphere --ar 16:9 --v 6.5 --style raw',
        authorId: creator1.id,
        likes: 287,
        views: 3100,
      },
      {
        title: '미니멀 3D 아이소메트릭 홈오피스',
        toolName: 'DALL·E 3',
        category: '이미지',
        content:
          'Create a cute minimalist 3D isometric illustration of a home office setup. Include a desk with a MacBook, a small cactus plant, noise-canceling headphones, a latte in a ceramic cup, and warm ambient lighting from a desk lamp. Soft pastel color palette with subtle shadows. White background.',
        authorId: creator2.id,
        likes: 198,
        views: 2400,
      },
      {
        title: '제품 사진 배경 교체 (화이트 → 라이프스타일)',
        toolName: 'DALL·E 3',
        category: '이미지',
        content:
          'Transform this product photo: Place the item on a beautiful marble kitchen countertop with morning sunlight streaming through a window, soft bokeh background with green plants, professional product photography lighting, commercial quality, 4K resolution.',
        authorId: admin.id,
        likes: 156,
        views: 1800,
      },
      {
        title: '앱 스토어 스크린샷용 목업 생성',
        toolName: 'Midjourney v6.5',
        category: '이미지',
        content:
          '/imagine prompt: Ultra-clean app store screenshot mockup, iPhone 15 Pro floating at 15-degree angle, modern finance app UI on screen showing charts and cards, gradient background from deep purple to midnight blue, soft light reflections on glass, professional presentation --ar 9:19 --v 6.5',
        authorId: creator2.id,
        likes: 342,
        views: 4200,
      },
      // ── 텍스트 (4개) ──
      {
        title: '블로그 글을 LinkedIn 바이럴 포스트로 변환',
        toolName: 'Claude 4',
        category: '텍스트',
        content:
          '다음 블로그 글을 LinkedIn 바이럴 포스트로 변환해줘. 규칙:\n1. 첫 줄은 강력한 훅 (질문이나 반직관적 주장)\n2. 한 줄에 한 문장씩 짧게\n3. 숫자와 구체적 성과를 강조\n4. 이모지는 핵심 포인트에만 사용 (과하지 않게)\n5. 마지막은 CTA (댓글 유도 질문)\n6. 해시태그 5개\n\n변환할 글:\n[여기에 블로그 글 붙여넣기]',
        authorId: admin.id,
        likes: 445,
        views: 6200,
      },
      {
        title: '회의록 → 실행 가능한 액션 아이템 추출',
        toolName: 'ChatGPT / Claude',
        category: '텍스트',
        content:
          '다음 회의 녹취록을 분석해서 아래 형식으로 정리해줘:\n\n## 📋 회의 요약 (3줄 이내)\n\n## ✅ 액션 아이템\n| 번호 | 할 일 | 담당자 | 마감일 | 우선순위 |\n|------|-------|--------|--------|----------|\n\n## ⚠️ 미결 사안\n- 추가 논의가 필요한 사항\n\n## 💡 주요 인사이트\n- 회의에서 나온 핵심 아이디어나 결정사항\n\n녹취록:\n[여기에 회의 내용 붙여넣기]',
        authorId: creator2.id,
        likes: 523,
        views: 7800,
      },
      {
        title: '영어 이메일 톤 조절 (격식 ↔ 캐주얼)',
        toolName: 'ChatGPT',
        category: '텍스트',
        content:
          'Rewrite the following email in two versions:\n\n**Version A - Formal/Professional:**\nUse polished business English, proper salutations, and diplomatic phrasing.\n\n**Version B - Friendly/Casual:**\nUse warm, conversational tone while maintaining professionalism. Add appropriate personality.\n\nFor both versions:\n- Keep the core message identical\n- Highlight action items in bold\n- Add a clear call-to-action at the end\n\nOriginal email:\n[Paste your email here]',
        authorId: admin.id,
        likes: 267,
        views: 3500,
      },
      {
        title: 'SEO 최적화 블로그 제목 10개 생성',
        toolName: 'Claude 4',
        category: '텍스트',
        content:
          '주제: [여기에 주제 입력]\n\n위 주제로 SEO에 최적화된 블로그 제목을 10개 생성해줘. 각 제목은:\n- 검색 의도를 반영 (정보형/비교형/방법형)\n- 숫자 또는 연도를 포함\n- 감정을 자극하는 파워 워드 사용\n- 60자 이내\n- 메타 디스크립션(155자)도 함께 작성\n\n형식:\n1. [제목]\n   → 메타: [디스크립션]\n   → 검색 의도: [정보/비교/방법]\n   → 예상 CTR: [상/중/하]',
        authorId: creator1.id,
        likes: 389,
        views: 5100,
      },
      // ── 코딩 (4개) ──
      {
        title: '논리적 추론이 가미된 파이썬 코드 최적화',
        toolName: 'OpenAI o3 / Cursor',
        category: '코딩',
        content:
          'Review this Python script for memory leaks and optimize the time complexity to O(n log n). Provide the explanation using step-by-step reasoning logic.',
        authorId: creator2.id,
        likes: 310,
        views: 4500,
      },
      {
        title: 'React 컴포넌트 → 테스트 코드 자동 생성',
        toolName: 'Cursor / Claude',
        category: '코딩',
        content:
          '다음 React 컴포넌트에 대해 포괄적인 테스트를 작성해줘:\n\n1. **단위 테스트** (Vitest + React Testing Library)\n   - 렌더링 테스트\n   - 사용자 인터랙션 (클릭, 입력, 폼 제출)\n   - 엣지 케이스 (빈 데이터, 에러 상태, 로딩)\n\n2. **접근성 테스트**\n   - ARIA 속성 검증\n   - 키보드 내비게이션\n\n3. **스냅샷 테스트**\n\n컴포넌트:\n```tsx\n[여기에 컴포넌트 코드 붙여넣기]\n```',
        authorId: creator2.id,
        likes: 278,
        views: 3800,
      },
      {
        title: 'SQL 쿼리 최적화 + 인덱스 추천',
        toolName: 'ChatGPT / Claude',
        category: '코딩',
        content:
          '다음 SQL 쿼리를 분석하고 최적화해줘:\n\n1. **현재 쿼리의 문제점** 분석 (풀 테이블 스캔, N+1, 불필요한 조인 등)\n2. **최적화된 쿼리** 작성\n3. **인덱스 추천** (CREATE INDEX 문 포함)\n4. **EXPLAIN 결과 예상** 비교 (before/after)\n5. **예상 성능 개선률** (%)\n\n테이블 스키마:\n[여기에 스키마]\n\n느린 쿼리:\n[여기에 쿼리]',
        authorId: admin.id,
        likes: 412,
        views: 5600,
      },
      {
        title: 'TypeScript 타입 에러 → 원인 분석 + 수정',
        toolName: 'Cursor',
        category: '코딩',
        content:
          '다음 TypeScript 에러를 분석해줘:\n\n```\n[여기에 에러 메시지 붙여넣기]\n```\n\n다음 형식으로 답변해줘:\n\n## 🔍 에러 원인\n- 왜 이 에러가 발생했는지 근본 원인 설명\n\n## ✅ 수정 방법 (3가지)\n1. **가장 권장하는 방법**: [코드]\n2. **대안 1**: [코드]\n3. **대안 2**: [코드]\n\n## 🛡️ 재발 방지\n- tsconfig.json 설정이나 린트 규칙으로 같은 문제를 예방하는 방법',
        authorId: creator2.id,
        likes: 234,
        views: 3200,
      },
      // ── 비디오 (3개) ──
      {
        title: '제품 소개 30초 광고 영상 프롬프트',
        toolName: 'OpenAI Sora 2',
        category: '비디오',
        content:
          'Generate a 30-second product advertisement video:\n\nScene 1 (0-5s): Close-up of hands unboxing a sleek tech product on a white marble surface, cinematic slow motion, warm studio lighting\n\nScene 2 (5-15s): Product floating and rotating in mid-air against a gradient background (deep navy to electric blue), holographic UI elements appearing around it showing features\n\nScene 3 (15-25s): Split-screen showing 3 use-cases: office, cafe, outdoor - each with smooth camera movement\n\nScene 4 (25-30s): Product lands on desk with a satisfying sound, logo appears with tagline\n\nStyle: Apple keynote aesthetics, shallow depth of field, anamorphic lens flare',
        authorId: creator1.id,
        likes: 189,
        views: 2100,
      },
      {
        title: 'HeyGen 영상 번역 — 최적 설정 가이드',
        toolName: 'HeyGen',
        category: '비디오',
        content:
          'HeyGen 영상 번역 최적 설정:\n\n1. **입력 영상**: 1080p 이상, 얼굴이 정면을 향한 영상\n2. **번역 언어 설정**: Source: Korean → Target: English\n3. **립싱크 모드**: Enhanced (정확도 우선)\n4. **보이스 클론**: Original Voice Cloning ON\n5. **얼굴 표정**: Natural Expression Mapping ON\n6. **후처리**: Background Noise Removal 활성화\n\n💡 팁: 원본 영상에서 화자가 안경을 쓰고 있으면 립싱크 정확도가 떨어질 수 있어요.\n💡 팁: 말 빠르기가 너무 빠른 구간은 0.9x 속도로 먼저 조정하세요.',
        authorId: creator1.id,
        likes: 156,
        views: 1900,
      },
      {
        title: 'Runway Gen-3로 일관된 캐릭터 영상 시리즈',
        toolName: 'Runway Gen-3 Alpha',
        category: '비디오',
        content:
          '일관된 캐릭터로 연속 영상을 만드는 프롬프트 체인:\n\n[Shot 1 - 등장]\nA young woman with short black hair and round glasses, wearing a navy blue turtleneck, sitting at a cafe table, looking up from her laptop with a curious expression, warm indoor lighting, shallow depth of field\n\n[Shot 2 - 리액션]\nSame woman (short black hair, round glasses, navy turtleneck) standing up excitedly, gesturing at her laptop screen, cafe background blurred, dynamic camera push-in\n\n[Shot 3 - 클로즈업]\nExtreme close-up of same woman smiling confidently, adjusting glasses, rack focus from background to face, golden hour light from window\n\n💡 핵심: 매 샷마다 외모 디스크립션을 정확히 반복해야 일관성이 유지됩니다.',
        authorId: creator2.id,
        likes: 298,
        views: 3700,
      },
      // ── 에이전트 (2개) ──
      {
        title: 'CrewAI 멀티에이전트 리서치 팀 구성',
        toolName: 'CrewAI / Claude',
        category: '에이전트',
        content:
          'CrewAI로 4인 리서치 에이전트 팀을 구성하는 설정:\n\n```python\nfrom crewai import Agent, Task, Crew\n\n# 에이전트 정의\nresearcher = Agent(\n    role="시니어 리서처",\n    goal="주제에 대한 포괄적인 데이터 수집",\n    backstory="10년 경력의 시장 조사 전문가",\n    tools=[search_tool, web_scraper],\n    verbose=True\n)\n\nanalyst = Agent(\n    role="데이터 분석가",\n    goal="수집된 데이터에서 핵심 인사이트 추출",\n    backstory="맥킨지 출신 전략 컨설턴트"\n)\n\nwriter = Agent(\n    role="테크 라이터",\n    goal="분석 결과를 읽기 쉬운 보고서로 작성",\n    backstory="테크 미디어 에디터 출신"\n)\n\neditor = Agent(\n    role="편집장",\n    goal="최종 보고서의 품질 검수 및 팩트체크",\n    backstory="저널리즘 원칙을 중시하는 편집자"\n)\n```\n\n💡 각 에이전트의 backstory가 구체적일수록 출력 품질이 올라갑니다.',
        authorId: admin.id,
        likes: 367,
        views: 4800,
      },
      {
        title: 'Lindy AI 주간 업무 자동화 레시피',
        toolName: 'Lindy.ai',
        category: '에이전트',
        content:
          'Lindy AI로 주간 업무를 자동화하는 5가지 레시피:\n\n**1. 아침 브리핑 봇** (매일 오전 9시)\n→ 트리거: 스케줄\n→ 액션: Google Calendar 오늘 일정 + Gmail 중요 메일 + Slack 멘션 요약 → Slack DM으로 전송\n\n**2. 회의 후속 처리** (회의 종료 직후)\n→ 트리거: Google Meet 종료\n→ 액션: 녹화 요약 + 액션아이템 추출 → Notion DB에 자동 저장 + 참석자에게 이메일 발송\n\n**3. 주간 보고서 생성** (매주 금요일 오후 4시)\n→ 트리거: 스케줄\n→ 액션: Jira 완료 티켓 + GitHub PR 목록 + Slack 주요 논의 수집 → 보고서 작성 → 팀 채널 공유\n\n**4. 경쟁사 모니터링** (매일)\n→ 트리거: 스케줄\n→ 액션: 지정 키워드 뉴스 검색 + 요약 + Notion 클리핑\n\n**5. 이메일 우선순위 분류** (실시간)\n→ 트리거: 새 이메일 수신\n→ 액션: 긴급/중요/일반/무시로 분류 → 긴급만 Slack 알림',
        authorId: creator2.id,
        likes: 456,
        views: 6100,
      },
      // ── 음악 (2개) ──
      {
        title: 'Lo-fi 재즈 힙합 공부 음악 생성',
        toolName: 'Suno v4',
        category: '음악',
        content:
          '[Genre: Lo-fi Jazz Hip Hop]\n[Mood: Relaxed, Nostalgic, Warm]\n[Tempo: 75 BPM]\n[Instruments: Rhodes piano, vinyl crackle, soft jazz guitar, muted trumpet, boom-bap drums]\n\n(Intro - 4 bars)\n♪ Soft piano chords with vinyl crackle\n\n(Verse)\n비 오는 창가에 앉아\n커피 한 잔의 온기\n오늘도 괜찮아\n이 순간이 전부니까\n\n(Chorus)\n천천히 흘러가는 시간 속에\n나만의 리듬을 찾아가\n\n(Outro)\n♪ Piano fades with rain sounds\n\n💡 Style: [lo-fi, jazz hop, study music, chill]\n💡 Suno에서 Instrumental 체크하면 보컬 없는 BGM 버전도 생성 가능!',
        authorId: creator1.id,
        likes: 234,
        views: 3100,
      },
      {
        title: '감성 K-Pop 발라드 작곡 프롬프트',
        toolName: 'Suno v4',
        category: '음악',
        content:
          '[Genre: K-Pop Ballad]\n[Mood: Emotional, Bittersweet, Cinematic]\n[Tempo: 68 BPM]\n[Instruments: Grand piano, strings orchestra, acoustic guitar, soft synth pad]\n[Voice: Female, soft and airy, Korean]\n\n(Intro - Piano only)\n♪ Delicate piano melody, single notes\n\n(Verse 1)\n너의 빈자리가\n이렇게 클 줄 몰랐어\n익숙했던 모든 것들이\n낯설게 느껴지는 밤\n\n(Pre-chorus)\n시간이 약이라 했지만\n\n(Chorus - Full orchestra)\n보고 싶다 그 한마디가\n이 밤을 가득 채울 때\n닿을 수 없는 너에게\n이 노래를 보낼게\n\n(Bridge - Stripped, acoustic guitar only)\n언젠가 다시 만나면\n웃으며 안녕이라 할게\n\n(Outro - Piano fade)\n\n💡 Style: [kpop ballad, emotional, cinematic, korean]\n💡 팁: Suno에서 "Custom Mode"로 각 섹션별 악기를 지정하면 퀄리티가 올라갑니다.',
        authorId: creator2.id,
        likes: 312,
        views: 4200,
      },
    ],
  });

  // 6. Seed Meetups
  await prisma.meetup.create({
    data: {
      title: 'AI 에이전트 실무 적용 4주 챌린지',
      description:
        'Lindy, CrewAI 등을 활용하여 내 업무를 돕는 자율형 에이전트를 직접 설계하고 테스트하는 오프라인 챌린지입니다.',
      date: new Date('2026-04-25T19:00:00Z'),
      location: '온라인 스터디 (Zoom)',
      isVirtual: true,
      status: 'UPCOMING',
    },
  });

  // 7. Seed Community Posts
  await prisma.post.createMany({
    data: [
      {
        title: 'Lindy로 개인 비서 에이전트 구축해본 후기',
        content:
          '안녕하세요! 지난 2주간 Lindy를 활용해서 개인 비서 에이전트를 직접 구축해봤습니다.\n\n주요 기능으로는 이메일 자동 분류 및 초안 작성, 캘린더 일정 관리, Slack 알림 요약 기능을 붙였는데요. 생각보다 훨씬 쉽게 구축할 수 있었고, 하루 평균 2시간 이상의 업무 시간을 절약하고 있습니다.\n\n특히 이메일 처리 부분이 인상적이었어요. 중요도에 따라 자동으로 분류하고 답변 초안까지 작성해주니 이제 받은 편지함 스트레스가 거의 없어졌습니다.',
        category: '실천형 노하우',
        authorId: creator2.id,
        likes: 45,
        views: 312,
      },
      {
        title: 'Cursor 유료 결제 전환, 가치가 있을까요?',
        content:
          '3개월째 Cursor Pro를 사용하고 있는 개발자입니다. 무료 플랜에서 유료로 전환할지 고민하시는 분들을 위해 솔직한 후기를 남겨봅니다.\n\n결론부터: 코드를 매일 작성하는 분이라면 절대적으로 가치 있습니다.\n\nClaude 3.5 Sonnet 기반 자동완성이 특히 좋았고, 복잡한 리팩터링도 대화로 해결할 수 있게 됐습니다.',
        category: '자유게시판',
        authorId: creator2.id,
        likes: 12,
        views: 189,
      },
      {
        title: '2026년 상반기 AI 트렌드 리포트 공유',
        content:
          '안녕하세요, Ola 운영팀입니다. 2026년 상반기 AI 트렌드를 정리한 리포트를 공유드립니다.\n\n주요 키워드: 멀티모달 에이전트, 온디바이스 AI, AI 네이티브 개발 도구\n\n올해 가장 눈에 띄는 변화는 에이전트 간의 협업(Multi-Agent Collaboration)이 실무에 본격 도입되기 시작했다는 점입니다.',
        category: '전문 리포트',
        authorId: admin.id,
        likes: 189,
        views: 1402,
      },
      {
        title: 'Suno v4로 작곡한 K-Pop 스타일 인디곡 들어봐주세요',
        content:
          '처음으로 AI 음악 생성을 제대로 활용해봤습니다. Suno v4의 Style Reference 기능을 사용해서 K-Pop 감성의 인디 팝 곡을 만들었어요.\n\n프롬프트: "melancholic k-indie pop, dreamy synth, female vocals, rainy day, introspective lyrics"\n\n총 3번의 시도 끝에 마음에 드는 결과물이 나왔고, 가사도 직접 수정해서 반영했습니다.',
        category: '작품 공유',
        authorId: creator1.id,
        likes: 34,
        views: 267,
      },
      {
        title: 'NotebookLM과 Claude를 활용한 논문 연구 방법',
        content:
          '대학원에서 AI 연구를 하고 있습니다. 최근 논문 리뷰 워크플로우를 완전히 바꾸게 된 방법을 소개드려요.\n\n1단계: NotebookLM에 논문 PDF 업로드 → 핵심 주장 및 방법론 자동 요약\n2단계: Claude에게 비판적 관점 리뷰 요청 → 논리적 허점 파악\n3단계: 두 결과를 비교하며 내 의견 정리\n\n이 방법으로 논문 1편당 평균 4시간이던 리뷰 시간이 45분으로 줄었습니다.',
        category: '실천형 노하우',
        authorId: admin.id,
        likes: 23,
        views: 198,
      },
      {
        title: 'GPT-4o vs Claude 3.5 Sonnet 실전 비교 후기',
        content:
          '6개월간 두 모델을 병행 사용하면서 실제 업무에서 느낀 차이점을 정리해봤습니다.\n\n코딩: Claude 승\n글쓰기: Claude 승 (한국어 자연스러움)\n이미지 분석: GPT-4o 승\n긴 문서 처리: Claude 승 (200K 컨텍스트)\n\n개인적으로는 개발/글쓰기 중심이라면 Claude를 추천드립니다.',
        category: '자유게시판',
        authorId: creator1.id,
        likes: 67,
        views: 543,
      },
    ],
  });

  console.log('✅ Seeding completed! Database is full of 2026 dummy data.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
