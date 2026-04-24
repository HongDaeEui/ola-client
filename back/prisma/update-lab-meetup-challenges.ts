// @ts-nocheck
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CHALLENGE_CONTENT = `

## 🎯 오늘의 미니 챌린지 3종
모임의 마무리는 글쓰기로 끝내지 않고, 직접 만들어보는 챌린지로 이어집니다.
3가지 중 하나를 골라 도전해보세요!

## 챌린지 1. AI야… 이걸로 글 써봐
말도 안 되는 키워드로 블로그 글 만들기. 조금 황당하고 웃긴 키워드를 넣고, AI가 얼마나 그럴듯하게 글을 써주는지 보는 챌린지예요.

예시 키워드:
• 출근하기 싫을 때 합법적으로 눕는 법
• 카페에서 일하는 척 잘하는 방법
• 월요병이 과학적으로 생기는 이유
• 집에서 아무것도 안 했는데 바쁜 이유

💡 포인트:
• 분위기가 바로 풀림
• AI가 진지하게 써줘서 더 웃김
• "진짜 글이 되네?" 하는 첫 재미를 느끼기 좋음

🏆 선정 기준: 가장 웃긴 글 / 가장 현실 공감 터진 글

## 챌린지 2. 같은 키워드, 완전 다른 세계
같은 키워드를 문체만 바꿔서 전혀 다른 글 만들기. 프롬프트 차이에 따라 결과가 얼마나 달라지는지 바로 체감할 수 있어요.

예시 키워드:
• 서울 혼자 가기 좋은 카페
• 요즘 많이 쓰는 AI 툴
• 퇴근 후 생산성 회복법

문체 예시:
• 감성 블로그 스타일
• 정보형 정리 글 스타일
• 후기형 체험담 스타일
• 텐션 높은 유튜버 스타일

💡 포인트: AI를 "잘 시키는 법"을 체감하기 좋음. 같은 주제인데도 사람마다 결과가 달라서 비교가 재밌음.

🏆 선정 기준: 가장 사람 같은 글 / 가장 캐릭터 강한 글 / 제일 읽고 싶어지는 글

## 챌린지 3. 부업 감성 ON — 후기형 블로그 써보기
실제로 올릴 법한 후기형 / 체험형 / 비교형 글을 AI와 함께 써보는 챌린지예요. 블로그 부업이나 체험단 글에 바로 써먹을 수 있는 결과물을 만드는 게 목표입니다.

예시 주제:
• ChatGPT / Gemini / Claude 써본 후기
• 요즘 많이 쓰는 AI 툴 직접 써본 후기
• AI로 블로그 글 자동화 해본 후기
• 무료 AI 이미지 툴 비교 후기

추천 글 구조:
① 왜 써봤는지
② 실제 사용해보니 어땠는지
③ 장단점
④ 추천 대상
⑤ 한줄 결론

💡 포인트: 단순 정보글보다 "사람이 써본 느낌"을 연습하기 좋음. 실제로 티스토리에 올려볼 만한 결과물이 나옴.

🏆 선정 기준: 당장 올리고 싶은 후기상 / 제일 그럴듯한 후기상 / 부업 감성 제일 잘 살린 글상`;

async function main() {
  const lab = await prisma.experiment.findFirst({
    where: { title: { contains: 'AI로 블로그 초안 작성' } },
  });

  if (!lab) throw new Error('해당 실험실 콘텐츠를 찾을 수 없습니다.');

  const updated = await prisma.experiment.update({
    where: { id: lab.id },
    data: { content: (lab.content ?? '') + CHALLENGE_CONTENT },
  });

  console.log('✅ 챌린지 3종 추가 완료:', updated.id, updated.title);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
