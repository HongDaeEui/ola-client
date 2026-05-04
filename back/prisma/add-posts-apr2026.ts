// @ts-nocheck
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  console.log('🌱 2026년 4월 트렌드 커뮤니티 글 시딩 시작...\n');

  // 사용자 조회
  let minjun = await prisma.user.findUnique({ where: { email: 'minjun.kim@olalab.kr' } });
  let suyeon = await prisma.user.findUnique({ where: { email: 'suyeon.lee@olalab.kr' } });
  let jihoon = await prisma.user.findUnique({ where: { email: 'jihoon.park@olalab.kr' } });
  let ayoung = await prisma.user.findUnique({ where: { email: 'ayoung.choi@olalab.kr' } });
  let haeun = await prisma.user.findUnique({ where: { email: 'haeun.jung@olalab.kr' } });
  let taehyun = await prisma.user.findUnique({ where: { email: 'taehyun.oh@olalab.kr' } });

  if (!minjun) {
    const fallbackUser = await prisma.user.findFirst();
    if (!fallbackUser) {
      console.error('데이터베이스에 사용자가 전혀 없습니다.');
      process.exit(1);
    }
    console.log(`기존 사용자(${fallbackUser.email})를 대체 작성자로 사용합니다.`);
    minjun = fallbackUser;
    suyeon = fallbackUser;
    jihoon = fallbackUser;
    ayoung = fallbackUser;
    haeun = fallbackUser;
    taehyun = fallbackUser;
  }

  // ── 2026년 4월 트렌드 포스트 ──────────────────────────────
  const newPosts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Sora API 드디어 풀렸네요! 간단한 후기와 가격 계산',
        content: `어제 새벽에 드디어 Sora API Waitlist가 풀려서 바로 테스트해봤습니다.

**장점:**
1. 물리법칙 일관성이 작년 말 데모 때보다 훨씬 좋아졌습니다. 유체(물, 연기) 시뮬레이션은 진짜 실사 같아요.
2. 프롬프트 이해도가 압도적입니다. "카메라가 360도로 돌면서 피사체에 포커스 아웃" 같은 연출을 완벽하게 해냅니다.

**단점 & 가격:**
- 10초짜리 1080p 영상 생성에 약 $0.8 (약 1,100원) 듭니다.
- 실패작도 얄짤없이 돈이 나가서 프롬프트 엔지니어링이 진짜 중요해졌습니다. Runway나 Pika랑 비교하면 품질은 넘사벽인데 가격도 넘사벽이네요.

상업용 뮤직비디오나 광고 소스용으로는 충분히 쓸만합니다. 내일 Sora로 만든 30초짜리 단편 영화 티저 올려볼게요!`,
        category: '실천형 노하우',
        authorId: minjun.id,
        likes: 215,
        views: 3400,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1),
      },
    }),

    prisma.post.create({
      data: {
        title: 'Apple Intelligence 정식 연동 후 내 아이폰 사용 패턴 변화',
        content: `iOS 19와 함께 Apple Intelligence가 서드파티 앱까지 완벽 연동되기 시작한 지 한 달 됐습니다.

가장 크게 체감되는 부분은 "앱을 열지 않아도 된다"는 점이에요.

- **이전**: 당근마켓 앱 열기 -> 검색 -> 필터링 -> 판매자 채팅 -> 계좌 물어보기
- **지금**: Siri에게 "당근에서 10만원 이하 상태 좋은 아이패드 미니 매물 찾아서 판매자한테 직거래 가능한지 물어봐"

이 한 마디면 백그라운드에서 매물을 찾고, 제 이전 채팅 톤앤매너로 판매자에게 말을 겁니다 ㄷㄷ
어제는 배달앱에서 "항상 먹던 조합으로 시켜줘" 하니까 결제 창만 띄워주더라고요.

이제 앱의 UI/UX보다 AI 에이전트에게 얼마나 데이터를 잘 노출(App Intents)하느냐가 개발자들에게 가장 큰 숙제가 될 것 같습니다.`,
        category: '자유게시판',
        authorId: jihoon.id,
        likes: 189,
        views: 2100,
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2),
      },
    }),

    prisma.post.create({
      data: {
        title: 'Claude 4.0 (Opus) 코딩 실력 미쳤습니다... Devin이랑 비교 리뷰',
        content: `어젯밤 기습 발표된 Claude 4.0 Opus를 밤새 돌려봤습니다.

결론부터 말하면: **이제 진짜 "사수"가 생긴 느낌입니다.**

이전 버전(3.5 Sonnet)은 뛰어난 "타이피스트"였다면, 4.0은 프로젝트 전체의 아키텍처를 이해합니다.

**Devin과 비교:**
1. **자율성**: Devin이 스스로 환경을 셋업하고 터미널을 다루는 자율성은 여전히 앞섭니다.
2. **코드 품질**: Claude 4.0이 압도적입니다. 복잡한 의존성이 얽힌 레거시 코드를 던져줬는데, 기존 패턴을 완벽히 분석하고 부작용(Side Effect)까지 경고하면서 코드를 짜줍니다.
3. **통합**: Cursor IDE 안에서 Claude 4.0을 붙여 쓰니까 그냥 생각의 속도대로 개발이 되네요.

앞으로 주니어 개발자의 기준이 "Claude 4.0을 얼마나 잘 다루느냐"로 완전히 바뀔 것 같습니다.`,
        category: '전문 리포트',
        authorId: taehyun.id,
        likes: 312,
        views: 4500,
        createdAt: daysAgo(0),
        updatedAt: daysAgo(0),
      },
    }),

    prisma.post.create({
      data: {
        title: 'Gemini 2.5 Pro 200만 토큰으로 책 10권 동시 분석하기',
        content: `구글이 Gemini 2.5 Pro의 컨텍스트 윈도우를 200만 토큰으로 확장했길래 극한의 테스트를 해봤습니다.

**테스트 내용:**
마케팅 및 행동심리학 관련 베스트셀러 10권(PDF 합본, 약 180만 토큰)을 한 번에 업로드하고, "이 10권의 책들의 공통된 핵심 철학을 관통하는 하나의 마케팅 프레임워크를 도출해줘"라고 요청했습니다.

**결과:**
- 처리 시간: 약 45초 (생각보다 엄청 빠름)
- 정확도: 각 책의 고유한 개념(예: 넛지, 린치핀)을 정확히 인용하면서도 충돌하는 이론들을 기가 막히게 통합해냅니다. "A책에서는 X를 강조하지만 B책의 Y이론과 결합하면 Z라는 결론이 나온다"는 식의 통찰을 보여주네요.

RAG(검색 증강 생성) 기술이 결국 무한 컨텍스트 윈도우에 먹힐 거라는 예측이 2026년 들어 현실이 되고 있는 것 같습니다. 문서 검색 시스템 구축하시던 분들 멘붕오실듯...`,
        category: '실천형 노하우',
        authorId: ayoung.id,
        likes: 178,
        views: 2900,
        createdAt: daysAgo(3),
        updatedAt: daysAgo(3),
      },
    }),

    prisma.post.create({
      data: {
        title: '생성형 AI로 만든 "가상 인플루언서" 계정 3개월 운영 결산',
        content: `Midjourney v7 (사진) + Kling v2 (영상) + ElevenLabs (목소리) + ChatGPT (페르소나)
이 조합으로 실존하지 않는 가상의 뷰티 인플루언서를 만들어 인스타그램과 틱톡을 운영해봤습니다.

**3개월 성과:**
- 팔로워: 4.5만 명
- 협찬 문의: 12건 (실제 화장품 협찬 받아 AI에 입혀서 포스팅)
- 누적 수익: 약 350만 원

**가장 어려웠던 점 (일관성 유지):**
처음엔 얼굴이 계속 바뀌어서 고생했는데, LoRA 학습시키고 Seed 값 고정하는 파이프라인을 구축하니까 이제는 360도 회전 영상에서도 이목구비가 안 깨집니다.

**논란의 여지:**
팔로워 중 80%는 아직 AI인 줄 모르는 것 같습니다. (프로필에는 버추얼 휴먼이라고 적어둠) 이번에 EU AI 법안 통과되면서 워터마크 의무화 얘기가 나오던데, 앞으로 버추얼 휴먼 시장이 어떻게 될지 궁금하네요.

관련 파이프라인 구축 노하우는 조만간 Labs에 올려보겠습니다!`,
        category: '작품 공유',
        authorId: suyeon.id,
        likes: 289,
        views: 5100,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1),
      },
    }),
  ]);

  // 방금 생성한 글 중 일부에 댓글 달기
  await prisma.comment.createMany({
    data: [
      { content: 'Sora API 가격 진짜 살벌하네요... 그래도 클라이언트한테 청구할 수 있는 외주 작업용으로는 무조건 써야 할 듯', postId: newPosts[0].id, authorId: jihoon.id, createdAt: new Date() },
      { content: 'App Intents 연동 잘해놓은 앱들만 살아남는 시대가 오겠네요. 프론트엔드 개발자인데 이제 뭘 준비해야 할지 막막합니다.', postId: newPosts[1].id, authorId: haeun.id, createdAt: new Date() },
      { content: 'Claude 4.0 당장 결제하러 갑니다. Sonnet 3.5도 만족하면서 썼는데 대체 얼마나 좋길래 ㄷㄷ', postId: newPosts[2].id, authorId: minjun.id, createdAt: new Date() },
      { content: '저도 Gemini 200만 토큰 테스트해봤는데 환각(Hallucination)이 거의 없어서 놀랐습니다. RAG의 종말이 진짜 오고 있네요.', postId: newPosts[3].id, authorId: taehyun.id, createdAt: new Date() },
      { content: '가상 인플루언서 대박이네요. 실물 화장품을 AI 이미지에 어떻게 합성하셨는지 그 기술이 제일 궁금합니다!!', postId: newPosts[4].id, authorId: ayoung.id, createdAt: new Date() },
    ]
  });

  console.log(`  ✅ 2026년 4월 트렌드 포스트 5개, 댓글 5개 추가 완료\n`);
  console.log('✨ 시드 완료!');
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
