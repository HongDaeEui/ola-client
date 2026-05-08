import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const MAY_2026_EXPERIMENTS = [
  {
    title: '나만의 고품질 AI 팟캐스트 제작하기',
    description: '긴 PDF 문서나 논문을 10분짜리 몰입형 팟캐스트 오디오로 변환하는 실습',
    content: '## 모임 목표\n평소 읽기 부담스러웠던 긴 PDF/논문을 10분짜리 오디오 팟캐스트로 만들어 봅니다.\n\n## 2시간 타임라인\n- **0~30분**: NotebookLM에 자료 업로드 및 대본(Script) 추출\n- **30~60분**: ElevenLabs로 두 명의 호스트가 대화하는 오디오 생성\n- **60~90분**: Suno v4로 인트로/아웃트로 음악 생성\n- **90~120분**: 오디오 믹싱 및 결과물 공유',
    difficulty: '입문',
    emoji: '🎙️',
    thumbnailUrl: 'https://picsum.photos/seed/podcast-ai/800/400',
    metric: '팟캐스트 생성 • 소요 시간 2시간',
    likes: Math.floor(Math.random() * 90) + 10,
    category: '크리에이티브',
    stack: ['NotebookLM', 'ElevenLabs', 'Suno v4'],
    color: 'bg-purple-500',
  },
  {
    title: 'Cursor와 Claude로 2시간 만에 웹 게임 배포하기',
    description: '코딩을 전혀 모르는 비개발자도 브라우저에서 돌아가는 미니 게임을 만들고 배포합니다.',
    content: '## 모임 목표\n코딩 지식 없이 테트리스나 2048 같은 나만의 커스텀 미니 웹 게임을 제작하고 세상에 배포합니다.\n\n## 2시간 타임라인\n- **0~45분**: Cursor에서 Claude 3.5 Sonnet을 활용해 기본 게임 로직(HTML/JS) 생성\n- **45~90분**: 프롬프트로 디자인 요소 수정 및 버그 디버깅 (에러 복붙)\n- **90~120분**: Vercel을 통해 무료 도메인으로 전 세계 배포 및 플레이',
    difficulty: '입문',
    emoji: '🕹️',
    thumbnailUrl: 'https://picsum.photos/seed/web-game-ai/800/400',
    metric: '게임 배포 1개 • 소요 시간 2시간',
    likes: Math.floor(Math.random() * 90) + 10,
    category: '개발',
    stack: ['Cursor', 'Claude 3.5 Sonnet', 'Vercel'],
    color: 'bg-blue-500',
  },
  {
    title: '언어장벽 파괴: 내 얼굴과 목소리로 3개국어 영상 만들기',
    description: '한국어로 찍은 1분짜리 영상을 영어, 스페인어로 완벽하게 립싱크 번역하기',
    content: '## 모임 목표\n단 1분의 한국어 자기소개 영상을 바탕으로, 완벽한 립싱크와 억양을 갖춘 다국어 영상을 제작합니다.\n\n## 2시간 타임라인\n- **0~30분**: 자기소개 대본 작성 및 스마트폰으로 1분 원본 영상 촬영\n- **30~90분**: HeyGen에 영상 업로드 및 다국어 번역/비디오 렌더링 대기\n- **90~120분**: 렌더링된 결과물 비교 및 AI 아바타 윤리에 대한 5분 토론',
    difficulty: '입문',
    emoji: '🌍',
    thumbnailUrl: 'https://picsum.photos/seed/heygen-translate/800/400',
    metric: '다국어 영상 2개 • 소요 시간 2시간',
    likes: Math.floor(Math.random() * 90) + 10,
    category: '크리에이티브',
    stack: ['HeyGen', 'ChatGPT'],
    color: 'bg-emerald-500',
  },
  {
    title: '나만의 업무용 노코드 RAG 챗봇 구축',
    description: '회사의 사규나 개인의 일기장 PDF를 먹여서 나만 아는 답변을 해주는 챗봇 만들기',
    content: '## 모임 목표\n외부에 공개되지 않은 프라이빗 데이터(PDF 등)를 기반으로 정확하게 답변하는 나만의 커스텀 챗봇을 만듭니다.\n\n## 2시간 타임라인\n- **0~45분**: Dify 클라우드 가입 및 데이터(PDF/TXT) 업로드 (지식 베이스 구축)\n- **45~90분**: 챗봇 프롬프트 작성 및 검색(Retrieval) 노드 연결\n- **90~120분**: 웹링크로 챗봇 배포 후 다른 사람의 챗봇과 교차 테스트',
    difficulty: '중급',
    emoji: '🤖',
    thumbnailUrl: 'https://picsum.photos/seed/rag-dify-bot/800/400',
    metric: 'RAG 챗봇 배포 • 소요 시간 2시간',
    likes: Math.floor(Math.random() * 90) + 10,
    category: '생산성',
    stack: ['Dify', 'OpenAI API'],
    color: 'bg-orange-500',
  },
  {
    title: 'AI로 \'가짜 뉴스\' 만들고 판별 대회하기',
    description: '생성형 AI의 한계와 위험성을 직접 체험하고 판별력을 기르는 리터러시 실험',
    content: '## 모임 목표\n직접 최신 AI로 조작된 정보와 미디어를 만들어 보며 딥페이크 리터러시를 키웁니다.\n\n## 2시간 타임라인\n- **0~60분**: 팀별로 가장 그럴싸한 가짜 뉴스 기사와 조작된 현장 사진/짧은 영상 생성\n- **60~100분**: 서로 결과물을 교환하여 이미지 내의 AI 특유의 오류(손가락, 텍스트 등) 찾아내기\n- **100~120분**: 딥페이크 리터러시에 대한 모임 회고',
    difficulty: '중급',
    emoji: '🕵️',
    thumbnailUrl: 'https://picsum.photos/seed/ai-deepfake-news/800/400',
    metric: '판별력 훈련 • 소요 시간 2시간',
    likes: Math.floor(Math.random() * 90) + 10,
    category: '교육',
    stack: ['Midjourney', 'Kling AI', 'ChatGPT'],
    color: 'bg-red-500',
  },
  {
    title: 'Make.com으로 지루한 반복 업무 영구 자동화',
    description: '지메일에 영수증이 오면 구글 시트에 자동 기록하는 노코드 워크플로우 완성',
    content: '## 모임 목표\n단순 반복되는 귀찮은 업무를 Make.com의 노코드 시각화 도구로 영구 자동화합니다.\n\n## 2시간 타임라인\n- **0~45분**: Make.com에서 Gmail 모듈과 Google Sheets 모듈 연결 (OAuth 인증)\n- **45~90분**: 중간에 ChatGPT 모듈을 넣어 메일 본문에서 \'금액\'과 \'사용처\'만 JSON으로 추출\n- **90~120분**: 실제 이메일을 발송하여 시트에 기록되는지 테스트 및 트러블슈팅',
    difficulty: '중급',
    emoji: '⚙️',
    thumbnailUrl: 'https://picsum.photos/seed/make-automation/800/400',
    metric: '자동화 시나리오 1개 • 소요 시간 2시간',
    likes: Math.floor(Math.random() * 90) + 10,
    category: '자동화',
    stack: ['Make.com', 'ChatGPT', 'Google Workspace'],
    color: 'bg-teal-500',
  }
];

async function main() {
  console.log('🌱 2026년 5월 신규 실험실(모임용) 데이터 주입 시작...');

  // Get a user to act as the author
  const author = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!author) {
    throw new Error('Admin user not found. Please run user seed first.');
  }

  let count = 0;
  for (const exp of MAY_2026_EXPERIMENTS) {
    await prisma.experiment.create({
      data: {
        ...exp,
        authorId: author.id,
      }
    });
    count++;
  }

  console.log(`✅ ${count}개의 새로운 2시간 모임용 실험실 콘텐츠 생성 완료`);
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
