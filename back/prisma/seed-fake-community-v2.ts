// @ts-nocheck
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return d;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const FAKE_USERS = [
  { email: 'user1@olalab.kr', username: 'AI_Explorer', name: '김지훈' },
  { email: 'user2@olalab.kr', username: 'Creative_Mind', name: '이수아' },
  { email: 'user3@olalab.kr', username: 'Dev_Master', name: '박민석' },
  { email: 'user4@olalab.kr', username: 'Design_Guru', name: '최유진' },
  { email: 'user5@olalab.kr', username: 'Data_Nerd', name: '정현우' },
  { email: 'user6@olalab.kr', username: 'Marketing_Pro', name: '강서연' },
  { email: 'user7@olalab.kr', username: 'Startup_Hustler', name: '윤도현' },
  { email: 'user8@olalab.kr', username: 'Tech_Enthusiast', name: '임예은' },
  { email: 'user9@olalab.kr', username: 'Future_Creator', name: '한건희' },
  { email: 'user10@olalab.kr', username: 'Prompt_Engineer', name: '송지아' },
];

const TOOLS = ['ChatGPT 4o', 'Claude 3.5 Sonnet', 'Midjourney v6', 'Notion AI', 'Cursor', 'Vercel v0', 'n8n', 'Suno v4', 'Runway Gen-3', 'Kling AI', 'Perplexity', 'NotebookLM', 'Gamma', 'Canva AI', 'Copilot'];
const ADJECTIVES = ['놀라운', '살짝 아쉬운', '실망스러운', '강력한', '가성비 최고인', '의외로 유용한', '혁신적인', '미친 성능의', '초보자도 쉬운'];
const TASKS = ['로고 디자인', '기획서 작성', '사이드 프로젝트 코딩', '에러 디버깅', '유튜브 쇼츠 제작', 'BGM 만들기', '경쟁사 데이터 분석', '해외 논문 번역', '회의록 요약', 'CS 자동화'];

const CATEGORIES = ['실천형 노하우', '작품 공유', '자유게시판', '전문 리포트'];

const COMMENT_TEMPLATES = [
  "진짜 공감됩니다 ㅋㅋ 저도 완전 비슷하게 쓰고 있어요.",
  "오 이런 꿀팁이 있었네요. 바로 스크랩해갑니다!",
  "프롬프트 조금만 더 자세히 공유해주실 수 있을까요?",
  "저도 써봤는데 생각보다 별로더라고요 ㅠㅠ 제가 잘못 쓴 건지...",
  "이거 유료 플랜 결제할 가치가 있나요?",
  "와 퀄리티 대박이네요. 추천 누르고 갑니다.",
  "이거 쓰다가 에러 나던데 혹시 해결 방법 아시나요?",
  "진짜 요즘 AI 발전 속도 무섭네요 ㄷㄷ",
  "감사합니다! 실무에 바로 적용해봐야겠어요.",
  "정성스러운 후기 감사합니다. 많은 도움 되었습니다.",
  "저는 다른 툴이랑 조합해서 쓰니까 더 좋더라고요.",
  "이거 모바일에서도 잘 되나요?",
  "다음 편도 기대하겠습니다!",
  "제가 찾던 딱 그 내용이네요. 감사합니다.",
  "혹시 이거 상업적 이용도 가능한 건가요?"
];

async function main() {
  console.log('🌱 커뮤니티 데이터 리셋 및 생성 시작...');

  // 1. Delete existing community data (safely)
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});

  // 2. Create users
  const users = [];
  for (const u of FAKE_USERS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, role: 'USER' },
    });
    users.push(user);
  }
  console.log(`✅ ${users.length}명의 유저 준비 완료`);

  // 3. Generate 45 Posts
  const posts = [];
  for (let i = 0; i < 45; i++) {
    const tool = sample(TOOLS);
    const adj = sample(ADJECTIVES);
    const task = sample(TASKS);
    const category = sample(CATEGORIES);
    const author = sample(users);
    
    let title = '';
    let content = '';

    if (category === '실천형 노하우') {
      title = `${tool}로 ${task} 해본 ${adj} 후기 + 꿀팁`;
      content = `요즘 ${tool} 많이들 쓰시길래 저도 ${task}에 적용해봤습니다.\n\n결론부터 말씀드리면 ${adj} 경험이었습니다. 기존에 3시간 걸리던 작업이 30분으로 줄었어요.\n\n**제가 사용한 프롬프트/방식:**\n1. 먼저 기본 구조를 잡아달라고 요청\n2. 구체적인 예시를 제공하면서 디테일 수정\n3. 마지막으로 톤앤매너 다듬기\n\n처음엔 좀 헤맸는데 익숙해지니 정말 편하네요. 다른 분들도 꼭 한번 써보시길 추천드립니다!`;
    } else if (category === '작품 공유') {
      title = `${tool} 활용해서 만든 ${task} 결과물 공유합니다`;
      content = `주말에 시간 내서 ${tool} 찍먹해보다가 결과물이 꽤 잘 나와서 공유해봅니다.\n\n원래 이쪽 디자인/개발 지식이 전혀 없는데도 이 정도 퀄리티가 나온다는 게 정말 신기하네요.\n특히 디테일한 부분 수정할 때 프롬프트를 조금만 다르게 줘도 확확 바뀌는 게 재밌습니다.\n\n다음에는 다른 툴이랑 섞어서도 만들어보려고요. 피드백 환영합니다!`;
    } else if (category === '자유게시판') {
      title = `다들 ${tool} 유료 결제해서 쓰시나요?`;
      content = `무료 버전으로 간간이 쓰다가 한계가 와서 유료 결제 고민 중입니다.\n\n주로 ${task} 용도로 쓸 것 같은데, 매달 구독료 내면서 쓸 만큼 뽕을 뽑을 수 있을지 걱정이네요.\n\n실제로 결제해서 쓰시는 분들 체감상 어떤가요? 무료랑 차이가 많이 날까요? 의견 부탁드립니다 🙏`;
    } else {
      title = `[분석] ${tool} 업데이트 이후 ${task} 워크플로우 변화`;
      content = `최근 ${tool} 대규모 업데이트가 있었죠.\n이번 업데이트로 인해 ${task} 관련 업무 프로세스가 어떻게 바뀔지 분석해봤습니다.\n\n**핵심 변화 3가지:**\n- 처리 속도 약 2배 향상\n- 컨텍스트 유지 능력 대폭 개선\n- 외부 API 연동 편의성 증가\n\n단기적으로는 학습 곡선이 있겠지만, 장기적으로는 업계 표준이 될 가능성이 높아 보입니다. 다들 어떻게 대비하고 계신가요?`;
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        authorId: author.id,
        likes: randInt(2, 25),
        views: randInt(15, 150),
        createdAt: daysAgo(randInt(1, 30)),
        updatedAt: daysAgo(randInt(0, 5)),
      }
    });
    posts.push(post);
  }
  console.log(`✅ 45개의 게시글 생성 완료`);

  // 4. Generate 180 Comments
  let commentCount = 0;
  for (let i = 0; i < 180; i++) {
    const post = sample(posts);
    const author = sample(users);
    
    // 80% chance for root comment, 20% chance for reply
    const isReply = Math.random() < 0.2;
    let parentId = null;
    
    if (isReply) {
      // Find an existing root comment on this post
      const existingComments = await prisma.comment.findMany({
        where: { postId: post.id, parentId: null }
      });
      if (existingComments.length > 0) {
        parentId = sample(existingComments).id;
      }
    }

    // Comment creation time should be after post creation time
    const postTime = new Date(post.createdAt).getTime();
    const now = new Date().getTime();
    const commentTime = new Date(postTime + Math.random() * (now - postTime));

    await prisma.comment.create({
      data: {
        content: sample(COMMENT_TEMPLATES),
        postId: post.id,
        authorId: author.id,
        parentId,
        createdAt: commentTime,
        updatedAt: commentTime,
      }
    });
    commentCount++;
  }
  
  console.log(`✅ ${commentCount}개의 댓글 생성 완료`);
  console.log('✨ 커뮤니티 데이터 생성 완료!');
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
