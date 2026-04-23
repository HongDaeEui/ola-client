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
  const admin = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
  if (!admin) throw new Error('유저가 없습니다. seed를 먼저 실행해주세요.');

  const lab = await prisma.experiment.create({
    data: {
      title: '[모임 가이드] AI로 블로그 초안 작성 & 이메일 자동 배달 공방',
      emoji: '📬',
      difficulty: '입문',
      description: 'Google Sheets에 키워드 입력 → AI로 글·썸네일 생성 → Make가 Gmail로 발송. 복잡한 코딩 없이 2시간 만에 완성하는 반자동화(Human-in-the-loop) 파이프라인 공방.',
      content: `## 🎯 모임 목표
이번 모임의 목표는 "자동화가 이런 거예요"를 듣는 것이 아니라, 직접 자동화 흐름 하나를 완벽하게 통제하며 연결해보는 것입니다.

오늘의 반자동화 파이프라인:
① Google Sheets에 키워드 입력 (status: ready)
② 무료 AI로 글과 썸네일 생성 후 시트에 복붙
③ Make가 'ready'인 행만 검색 → Gmail 발송 → 상태를 'done'으로 변경

API 비용 걱정 없이 누구나 쓸 수 있는 구조입니다. 내가 원할 때만 실행되고, 한 번 보낸 메일은 중복 발송되지 않게 제어합니다.

## 🧭 모임 분위기 가이드
이 모임은 강의형이 아니라 공방형 / 작업실형 / 같이 해보는 실습형 모임이에요.

• 막혀도 괜찮다. 오늘 다 완벽히 끝내는 게 목표는 아니다.
• "되게 만드는 감각"을 잡는 게 더 중요하다.
• 옆 사람에게 물어봐도 되고, 같이 해결해도 된다.

진행 멘트 예시:
"오늘은 개발자가 되는 날은 아니고요, 자동화가 진짜 어떻게 연결되는지 손으로 느껴보는 날입니다. 에러 나는 건 정상입니다. 오히려 에러가 나야 배우는 맛이 있어요."

## 🛠️ 준비물
참가자 준비물
• 노트북, 와이파이 연결
• 구글 계정 (Google Sheets 및 Gmail 연동용)
• Make 계정 (make.com — 무료)
• AI 서비스 로그인 (글쓰기: ChatGPT / 이미지: MS 코파일럿 권장)
• 설레는 마음 + 약간의 인내심

진행자 준비물
• 예시 Google Sheets 1개
• 예시 Make 시나리오 1개 (완성본)
• 복붙용 프롬프트 & Gmail용 HTML 템플릿 예시
• 막힐 때 보여줄 백업 데모

## ⏰ 전체 시간표 (2시간)
0:00~0:10  오프닝 & 아이스브레이킹
0:10~0:20  전체 구조 설명
0:20~0:35  STEP 1. Google Sheets 세팅
0:35~0:55  STEP 2. AI로 초안·썸네일 생성
0:55~1:15  STEP 3. 시트에 결과 기록
1:15~1:45  STEP 4. Make & Gmail 연결
1:45~1:55  STEP 5. 티스토리 발행 팁
1:55~2:00  마무리

## 🌅 오프닝 & 아이스브레이킹 (0:00~0:10)
인사, 오늘 왜 왔는지, 블로그 경험, 자동화 관심 이유 공유

질문 예시:
• "오늘 자동화하고 싶은 주제 하나만 말해볼까요?"
• "콘텐츠 자동화가 필요한 이유가 있나요?"

목적: 분위기 풀기, 참가자 수준 파악, 딱딱한 개발 느낌 지우기.

## 🗺️ 전체 구조 설명 (0:10~0:20)
완성형 SaaS를 만드는 게 아니라, "키워드 하나가 글과 사진이 되어 내 메일로 꽂히는 흐름"입니다.

블로그에 자동 발행해버리면 수정이 어렵지만, 메일로 받아 검토 후 발행하면 훨씬 실용적이고 안전합니다. 이것이 Human-in-the-loop 반자동화의 핵심입니다.

## STEP 1. Google Sheets 세팅 (0:20~0:35)
★ 에러 방지 핵심 — 시트의 가장 첫 번째 줄(1행)에 반드시 아래 영어 컬럼명을 적어야 Make가 에러 없이 인식합니다. 위에 제목을 병합해서 쓰면 절대 안 됩니다!

컬럼명 (1행에 그대로 입력):
  keyword | title | content | image_url | status

미니 챌린지: 각자 오늘 당장 써보고 싶은 키워드 2개 넣기.

## STEP 2. AI로 초안·썸네일 생성 (0:35~0:55)
우리가 매일 쓰는 AI 창을 띄워놓고 글과 사진을 생성합니다.

✍️ 글쓰기 프롬프트 (ChatGPT 등):
"너는 전문 블로거야. 키워드 '[키워드]'를 주제로 사람들이 클릭하고 싶어지는 블로그 글 초안을 작성해줘. 제목 1개, 흥미로운 소제목 3개를 포함하고 친근한 말투로 1000자 내외로 써줘."

🖼️ 썸네일 프롬프트 (MS 코파일럿 권장):
"이 블로그 글의 썸네일로 쓸 이미지를 그려줘. 실사 느낌의 고화질 이미지로, 키워드의 분위기가 잘 담기게 가로 비율로 만들어줘."

⚠️ 꿀팁: ChatGPT에서 그린 이미지는 보안 링크라 메일에서 엑박이 뜹니다. MS 코파일럿을 쓰거나 Unsplash 같은 무료 사진 사이트 링크를 사용하세요.

## STEP 3. 시트에 결과 기록 (0:55~1:15)
AI 결과물을 시트에 정리해 Make가 일할 준비를 마칩니다.

할 일:
① AI의 제목과 본문을 시트의 title, content 칸에 넣습니다.
② AI 이미지 우클릭 → '이미지 주소 복사' 후 image_url 칸에 넣습니다. (http로 시작하는 긴 주소 확인)
③ 발송 준비가 끝난 행의 status 칸에 ready 라고 적어둡니다.

## STEP 4. Make & Gmail 연결 (1:15~1:45)
오늘의 하이라이트! Make 시나리오 3단계 조립

━━━ 모듈 1: Google Sheets — Search Rows ━━━
• Filter: status가 ready와 일치(Equal to)할 때만
• Maximum number of returned rows: 1 로 설정! (메일 폭탄 방지)

━━━ 모듈 2: Gmail — Send an Email ━━━
• 구글 계정 연결 시 권한 체크박스 전부 허용 (403 에러 방지)
• 수신자: 본인 이메일
• 제목: [블로그 초안 도착] {{title}}
• Body type: HTML 선택 후 아래 코드 사용:

<h2>오늘의 블로그 초안이 도착했습니다!</h2>
<hr>
<img src="{{image_url}}" alt="썸네일" style="max-width:100%;border-radius:8px;">
<br><br>
<div style="white-space:pre-wrap;line-height:1.6;">{{content}}</div>

━━━ 모듈 3: Google Sheets — Update a Row ━━━
• Row number: 1번 모듈의 Row number 변수 클릭해서 넣기
• status 칸에: done 으로 타이핑 (나머지 칸은 빈칸 유지!)

미니 챌린지: Make 하단의 'Run once'를 누르고 메일함 확인! 시트의 ready가 done으로 바뀌었는지 확인하기.

## STEP 5. 티스토리 발행 & 응용 팁 (1:45~1:55)
메일 본문을 복사해서 티스토리에 그대로 붙여넣습니다.

단, 사진은 엑박 방지를 위해 메일에서 '다른 이름으로 저장'한 뒤 티스토리 에디터에서 직접 첨부하세요.

발행 전, 내 말투로 3분만 다듬어서 인간의 감성을 한 스푼 넣어주세요.

⏰ 스케줄링 팁: Make 화면 좌측 하단 스위치를 ON으로 켜고, 매일 아침 8시로 스케줄을 맞춰보세요. 퇴근 전 시트에 키워드만 채워두면 다음 날 출근길에 완성된 글이 메일로 와 있을 겁니다.

## 🎉 마무리 (1:55~2:00)
처음에는 막막해 보이던 자동화가, 시트-AI-지메일이라는 블록 조립으로 완성되었습니다.

오늘 만든 이 구조가 나중엔 엄청난 업무 자동화의 뼈대가 될 거예요. 한 번 직접 에러를 고쳐가며 해본 경험이 가장 든든한 무기입니다. 다들 고생하셨습니다!

마지막 체크: 막힌 부분, 추가로 해보고 싶은 아이디어 가볍게 묻고 종료.`,
      stack: ['Google Sheets', 'ChatGPT', 'MS Copilot', 'Make', 'Gmail'],
      metric: '2시간 안에 블로그 자동화 파이프라인 완성 · 비용 0원',
      authorId: admin.id,
      likes: 0,
      category: '자동화',
      color: 'from-blue-500 to-indigo-700',
    },
  });

  console.log('✅ 모임 가이드 추가 완료:', lab.id, lab.title);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
