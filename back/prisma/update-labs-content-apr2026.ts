// @ts-nocheck
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CONTENTS: { title: string; content: string }[] = [
  {
    title: 'Cursor × V0로 1시간 만에 SaaS MVP 배포',
    content: `## 🎯 이 실험의 목표
Cursor AI와 Vercel V0를 조합해 아이디어 단계에서 실제 배포 가능한 SaaS MVP까지 단 1시간 안에 완성한다. 기존에 2주 걸리던 초기 개발을 AI 도구 체인으로 극적으로 단축하는 방법을 직접 체험한다.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| [Cursor](https://cursor.com) | AI 네이티브 코드 에디터 (Claude/GPT-4 내장) | 무료 (Pro $20/월) |
| [V0 by Vercel](https://v0.app) | 텍스트 프롬프트 → React UI 자동 생성 | 무료 티어 제공 |
| [Supabase](https://supabase.com) | PostgreSQL DB + Auth + Storage | 무료 (500MB) |
| [Vercel](https://vercel.com) | 1클릭 배포 플랫폼 | 무료 |

---

## Step 1: V0로 UI 뼈대 5분 만에 생성

[v0.app](https://v0.app) 에 접속해 다음 프롬프트를 입력한다:

\`\`\`
Create a SaaS dashboard for a task management app.
Include: sidebar navigation, stats cards (total tasks, completed, in-progress),
a task list table with status badges, and a "New Task" button.
Use shadcn/ui and Tailwind CSS. Dark mode support.
\`\`\`

V0가 생성한 React 컴포넌트 코드를 **"Open in StackBlitz"** 버튼으로 즉시 확인하거나, 우측 상단 **"Copy code"** 버튼으로 복사한다. 마음에 들지 않는 부분은 채팅으로 바로 수정 요청:

\`\`\`
"Make the sidebar collapsible and add a user avatar at the top"
\`\`\`

---

## Step 2: Cursor로 프로젝트 초기화 + 백엔드 연결

Cursor를 열고 터미널에서:

\`\`\`bash
npx create-next-app@latest my-saas --typescript --tailwind --app
cd my-saas
npm install @supabase/supabase-js @supabase/ssr
\`\`\`

V0에서 복사한 컴포넌트를 \`src/components/Dashboard.tsx\`로 붙여넣은 후, Cursor의 **Cmd+K** 단축키로 AI 채팅을 열고 입력:

\`\`\`
이 컴포넌트에 Supabase에서 tasks 테이블 데이터를 가져오는
useEffect 훅을 추가해줘. 로딩 스피너와 에러 핸들링도 포함.
환경변수는 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY 사용.
\`\`\`

Cursor가 전체 파일을 수정한 코드를 제안하면 **Accept** 클릭 — 끝.

---

## Step 3: Supabase DB 설정 (10분)

1. [supabase.com](https://supabase.com) → **New Project** 생성
2. SQL Editor에서 실행:

\`\`\`sql
create table tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  status text default 'pending' check (status in ('pending','in-progress','done')),
  user_id uuid references auth.users,
  created_at timestamptz default now()
);

alter table tasks enable row level security;
create policy "users can manage own tasks"
  on tasks for all using (auth.uid() = user_id);
\`\`\`

3. Settings → API에서 Project URL과 anon key를 복사해 \`.env.local\`에 저장:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
\`\`\`

---

## Step 4: Vercel 배포 (5분)

\`\`\`bash
npm run build  # 빌드 확인
git init && git add . && git commit -m "feat: SaaS MVP initial"
\`\`\`

[vercel.com](https://vercel.com) → **Import Git Repository** → 환경변수 입력 → **Deploy**

배포 완료 URL 형식: \`https://my-saas-xxxx.vercel.app\`

---

## 📊 실험 결과

| 항목 | 기존 방식 | AI 도구 사용 후 |
|------|-----------|----------------|
| UI 설계 시간 | 3일 | 5분 |
| 백엔드 연결 코드 | 4시간 | 15분 |
| 배포까지 총 시간 | 2주+ | **1시간** |
| 코드 품질 | 동일 | 동일 (production-ready) |
| 비용 | 개발자 비용 | **$0** |

---

## 💡 팁 & 응용 아이디어

- **Cursor의 \`.cursorrules\` 파일 활용**: 프로젝트 루트에 코딩 컨벤션을 정의해두면 AI가 항상 일관된 스타일로 코드를 작성한다
- **V0 반복 개선**: 생성된 UI가 마음에 들지 않아도 "이전 버전보다 더 미니멀하게"처럼 자연어로 계속 개선 가능
- **Supabase Edge Functions 확장**: 결제 웹훅, 이메일 알림 등 서버 로직도 Cursor로 10분 안에 추가 가능`,
  },
  {
    title: '텍스트 한 줄로 4K 시네마틱 뮤직비디오',
    content: `## 🎯 이 실험의 목표
Suno v4로 AI 작곡, Midjourney로 비주얼 제작, Luma Dream Machine으로 영상화하는 3단계 파이프라인을 통해 텍스트 한 줄에서 4K 시네마틱 뮤직비디오를 완성한다. 총 제작 비용 $0.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| [Suno v4](https://suno.com) | AI 음악 + 가사 생성 | 무료 (월 10곡) |
| [Midjourney](https://midjourney.com) | 시네마틱 스틸컷 생성 | 무료 체험 |
| [Luma Dream Machine](https://lumalabs.ai/dream-machine) | 이미지 → 영상 변환 | 무료 (월 30크레딧) |
| [CapCut](https://capcut.com) | 영상 + 음악 최종 편집 | 무료 |

---

## Step 1: Suno v4로 곡 만들기

[suno.com](https://suno.com) 접속 → **Create** → **Custom Mode** 활성화

**가사 프롬프트:**
\`\`\`
[Verse 1]
도시의 불빛 사이로 걷는 나
빗속에서 찾아낸 작은 온기

[Chorus]
이 밤이 지나면 새벽이 오고
우리가 남긴 흔적들이 빛날 거야

[Bridge]
(instrumental break)
\`\`\`

**스타일 태그:**
\`\`\`
cinematic K-pop, orchestral strings, emotional piano, 120 BPM,
female vocal, reverb, epic build-up
\`\`\`

Suno v4.5는 최대 8분 길이, 1,200개 이상 장르 지원. 생성된 곡에서 **Download** → MP3 저장.

---

## Step 2: Midjourney로 시네마틱 스틸컷 생성

**장면 1 — 오프닝:**
\`\`\`
/imagine cinematic wide shot, young woman walking alone in neon-lit rain-soaked Seoul street at night,
reflections on wet pavement, volumetric fog, anamorphic lens flare,
film grain, 4K --ar 16:9 --v 7 --style raw
\`\`\`

**장면 2 — 클라이맥스:**
\`\`\`
/imagine dramatic overhead drone shot, rooftop scene Seoul city lights sprawling below,
subject arms outstretched, golden hour glow, cinematic color grade,
epic atmosphere --ar 16:9 --v 7
\`\`\`

각 장면 이미지를 \`scene_01.png\`, \`scene_02.png\` 등으로 저장.

---

## Step 3: Luma Dream Machine으로 영상화

[lumalabs.ai/dream-machine](https://lumalabs.ai/dream-machine) 접속

1. **Image to Video** 탭 선택
2. \`scene_01.png\` 업로드
3. 모션 프롬프트 입력:
\`\`\`
Slow cinematic push-in toward the subject, slight camera shake,
rain particles falling, neon signs reflecting in puddles,
film grain overlay, 4K quality
\`\`\`
4. **Duration: 5s** / **Aspect: 16:9** 선택 → Generate

---

## Step 4: CapCut으로 최종 편집

1. 생성된 클립들을 시간순으로 배열
2. Suno에서 다운받은 MP3 추가
3. **자동 자막** 기능으로 가사 싱크 맞춤
4. **Color Grade** → Cinematic LUT 적용
5. 4K 해상도로 내보내기

---

## 📊 실험 결과

| 항목 | 전통적 뮤직비디오 | AI 파이프라인 |
|------|-----------------|---------------|
| 제작 비용 | $5,000~$50,000 | **$0** |
| 제작 기간 | 2~4주 | **3~4시간** |
| 필요 인력 | 10명+ | **1명** |
| 영상 품질 | 4K 전문 | 4K AI 생성 |

---

## 💡 팁 & 응용 아이디어

- **Suno Personas 기능**: 첫 번째 곡의 보컬 스타일을 저장해두면 시리즈 전체에 동일한 아티스트 목소리 유지 가능
- **Luma 시작·끝 프레임 제어**: 두 장면 이미지를 각각 시작/끝 프레임으로 지정하면 자연스러운 씬 전환 클립 생성
- **멀티 플랫폼 버전**: 9:16 세로형으로 재편집해 유튜브 쇼츠·인스타그램 릴스·틱톡용 버전도 동시 제작`,
  },
  {
    title: '에이전트로 1인 마케팅 에이전시 굴리기',
    content: `## 🎯 이 실험의 목표
CrewAI 멀티 에이전트 프레임워크로 리서치·카피라이팅·SNS 스케줄링을 자동화하는 1인 마케팅 에이전시 시스템을 구축한다. 기존 업무 시간의 90%를 절약하고 콘텐츠 생산량은 10배 늘린다.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| [CrewAI](https://crewai.com) | 멀티 에이전트 오케스트레이션 | 오픈소스 무료 |
| Claude 3.5 Sonnet API | 고품질 카피라이팅 LLM | API 종량제 |
| [Jasper](https://jasper.ai) | 마케팅 특화 콘텐츠 생성 | $49/월 |
| [Slack](https://slack.com) | 에이전트 결과물 수신 채널 | 무료 |

---

## Step 1: 환경 설치

\`\`\`bash
python -m venv marketing-crew
source marketing-crew/bin/activate
pip install crewai crewai-tools anthropic python-dotenv slack-sdk
\`\`\`

\`.env\` 파일 생성:
\`\`\`
ANTHROPIC_API_KEY=sk-ant-...
SLACK_BOT_TOKEN=xoxb-...
SLACK_CHANNEL_ID=C0...
\`\`\`

---

## Step 2: 에이전트 팀 정의 (\`crew.py\`)

\`\`\`python
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool

search_tool = SerperDevTool()

# 에이전트 1: 시장 조사 전문가
researcher = Agent(
    role="마케팅 리서처",
    goal="경쟁사 분석과 트렌드 리서치로 인사이트 도출",
    backstory="10년 경력의 디지털 마케팅 전략가. 데이터 기반 인사이트 전문.",
    tools=[search_tool],
    llm="claude-3-5-sonnet-20241022",
    verbose=True
)

# 에이전트 2: 카피라이터
copywriter = Agent(
    role="시니어 카피라이터",
    goal="리서치 기반으로 전환율 높은 마케팅 카피 작성",
    backstory="전환율 최적화에 특화된 카피라이터.",
    llm="claude-3-5-sonnet-20241022",
    verbose=True
)

# 에이전트 3: SNS 매니저
social_manager = Agent(
    role="SNS 콘텐츠 매니저",
    goal="각 플랫폼 특성에 맞게 콘텐츠를 최적화하고 스케줄 수립",
    backstory="인스타그램·링크드인·X 알고리즘 전문가.",
    llm="claude-3-5-sonnet-20241022",
    verbose=True
)
\`\`\`

---

## Step 3: 태스크 정의 및 크루 실행

\`\`\`python
research_task = Task(
    description="{product}에 대한 경쟁사 3개사 분석, 타깃 고객 페르소나, 핵심 차별화 포인트 도출",
    expected_output="구조화된 마케팅 인사이트 보고서",
    agent=researcher
)

copy_task = Task(
    description="리서치 결과를 바탕으로 SNS 포스트 5개, 이메일 제목 10개, 광고 헤드라인 5개 작성",
    expected_output="플랫폼별 최적화된 카피 패키지",
    agent=copywriter,
    context=[research_task]
)

schedule_task = Task(
    description="작성된 카피를 각 플랫폼 최적 시간대에 맞춰 2주치 콘텐츠 캘린더 작성",
    expected_output="날짜·시간·플랫폼·캡션·해시태그가 포함된 CSV 형식 콘텐츠 캘린더",
    agent=social_manager,
    context=[copy_task]
)

crew = Crew(
    agents=[researcher, copywriter, social_manager],
    tasks=[research_task, copy_task, schedule_task],
    process=Process.sequential,
    verbose=True
)

result = crew.kickoff(inputs={"product": "국산 수제 커피 원두 구독 서비스"})
\`\`\`

---

## Step 4: Slack 자동 알림 연결

\`\`\`python
from slack_sdk import WebClient
import os

slack = WebClient(token=os.environ["SLACK_BOT_TOKEN"])
slack.chat_postMessage(
    channel=os.environ["SLACK_CHANNEL_ID"],
    text=f"📢 마케팅 에이전트 작업 완료!\\n\\n{result}"
)
\`\`\`

---

## 📊 실험 결과

| 작업 항목 | 사람이 직접 | AI 에이전트 팀 |
|-----------|------------|---------------|
| 경쟁사 리서치 | 4시간 | **8분** |
| 카피라이팅 (20개) | 6시간 | **12분** |
| 콘텐츠 캘린더 작성 | 2시간 | **5분** |
| 총 소요 시간 | 12시간/주 | **25분/주** |
| 비용 | 프리랜서 $300+ | **$3 미만** |

---

## 💡 팁 & 응용 아이디어

- **Hierarchical Process**: \`Process.hierarchical\`로 매니저 에이전트를 추가하면 품질 검수까지 자동화
- **메모리 활성화**: \`memory=True\` 설정으로 에이전트가 이전 캠페인 결과를 기억해 점점 더 개인화된 전략 수립
- **Jasper 연동**: CrewAI 결과물을 Jasper API로 전송해 브랜드 보이스에 맞게 자동 다듬기 추가 가능`,
  },
  {
    title: '주토피아2 감독 모집 — AI로 애니메이션 만들기',
    content: `## 🎯 이 실험의 목표
ChatGPT로 스토리보드, Midjourney로 캐릭터와 배경, ElevenLabs로 더빙, Sora 2로 애니메이션 클립을 만들어 $5 이하 예산으로 완성도 높은 단편 AI 애니메이션을 제작한다.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| [ChatGPT](https://chatgpt.com) | 스크립트 + 스토리보드 | 무료 |
| [Midjourney v7](https://midjourney.com) | 캐릭터·배경 이미지 생성 | 무료 체험 |
| [ElevenLabs](https://elevenlabs.io) | 캐릭터 목소리 더빙 | 무료 (1만 자/월) |
| [Sora 2](https://openai.com/sora) | 이미지 → 애니메이션 클립 | 유료 ($5 이하) |
| CapCut | 최종 편집 | 무료 |

---

## Step 1: ChatGPT로 스크립트 작성

\`\`\`
도시 동물들이 사는 세계를 배경으로 한 3분짜리 단편 애니메이션 스크립트를 써줘.
주인공: 여우 소녀 '루나' (꿈을 쫓는 화가 지망생)
갈등: 현실과 예술 사이의 선택
장면 수: 6개
각 장면마다 (씬 번호, 배경 묘사, 대사, 무드/감정) 형식으로 작성해줘.
한국어 대사, 따뜻하고 감동적인 톤.
\`\`\`

---

## Step 2: Midjourney v7로 캐릭터 디자인

**주인공 캐릭터 생성:**
\`\`\`
/imagine cute fox girl character design, orange fur, purple beret, artist palette,
big expressive eyes, Zootopia Disney animation style,
full body reference sheet (front, side, back views),
soft lighting, clean lines --ar 3:4 --v 7 --style cute
\`\`\`

**배경 생성 (Omni Reference로 캐릭터 일관성 유지):**
\`\`\`
/imagine fox girl painting in colorful art studio,
big windows showing cityscape, warm afternoon light,
Zootopia style environment, cinematic --ar 16:9 --v 7 --oref [캐릭터 이미지URL] --ow 400
\`\`\`

---

## Step 3: ElevenLabs로 더빙 제작

1. [elevenlabs.io](https://elevenlabs.io) 접속 → **Text to Speech**
2. Voice 선택: "Aria" (따뜻한 여성 목소리)
3. 스크립트 대사 입력:
\`\`\`
"그림을 그릴 때만큼은, 이 세상이 나만의 것 같아요."
\`\`\`
4. **Stability: 0.5** / **Similarity: 0.8** 설정 → Generate
5. 각 대사를 \`line_01.mp3\` 형식으로 저장

한국어 지원: ElevenLabs는 32개 이상 언어 지원, 자연스러운 한국어 억양 구현.

---

## Step 4: Sora 2로 애니메이션 클립 생성

[openai.com/sora](https://openai.com/sora) (ChatGPT Plus 구독 필요)

Midjourney 이미지를 업로드 후:
\`\`\`
Animate this scene: the fox girl slowly turns toward the camera with a hopeful smile,
her paintbrush leaving colorful strokes in the air,
Disney animation style, smooth movement, warm lighting,
5 seconds, 24fps
\`\`\`

---

## Step 5: CapCut으로 최종 편집

1. 6개 영상 클립을 스토리보드 순서대로 배열
2. ElevenLabs 더빙 음성 싱크 맞춤
3. Suno에서 배경음악 생성 후 추가
4. 자막 스타일: 귀여운 둥근 폰트, 흰색 배경
5. 1080p 60fps 내보내기

---

## 📊 실험 결과

| 항목 | 전통 애니메이션 | AI 제작 |
|------|---------------|--------|
| 제작 비용 | $50,000+ | **$5 이하** |
| 제작 기간 | 6개월~ | **1일** |
| 필요 인력 | 10~50명 | **1명** |

---

## 💡 팁 & 응용 아이디어

- **Midjourney Omni Reference**: \`--oref\` 파라미터로 캐릭터 일관성 95% 유지 가능. 가중치 \`--ow 400\` 권장
- **ElevenLabs 감정 조절**: 대사 앞에 \`[excited]\`, \`[whispering]\`, \`[crying]\` 태그 삽입으로 감정 표현 제어
- **시리즈 확장**: 동일 캐릭터로 에피소드 시리즈 제작 시 유튜브 애니메이션 채널 운영 가능. 초기 10화 제작 비용 $50 이하`,
  },
  {
    title: '나도 한 곡 뽑았다 — AI로 내 노래 만들기',
    content: `## 🎯 이 실험의 목표
Suno v4와 ElevenLabs, ChatGPT를 사용해 음악 지식 없이도 내 이야기를 담은 완성도 높은 노래를 단 1시간 안에 만든다. 제작비 $0, 저작권은 내 것.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| [Suno v4](https://suno.com) | AI 음악 + 보컬 생성 | 무료 (월 10곡) |
| [ChatGPT](https://chatgpt.com) | 가사 초안 작성 도우미 | 무료 |
| [ElevenLabs](https://elevenlabs.io) | 내 목소리로 노래 커버 (선택) | 무료 |

---

## Step 1: ChatGPT로 가사 구성

\`\`\`
나에 대한 노래 가사를 써줘:
- 장르: 감성 인디팝
- 주제: 서울에서 꿈을 쫓는 20대의 일상
- 분위기: 새벽 3시, 혼자 있는 카페, 노트북 앞에서 느끼는 설렘과 외로움
- 구조: 벌스1 - 프리코러스 - 코러스 - 벌스2 - 코러스 - 브릿지 - 아웃트로
- 한국어, 군데군데 영어 섞기 OK
- 운율 맞추기
\`\`\`

---

## Step 2: Suno v4 Custom Mode 설정

[suno.com](https://suno.com) → Create → **Custom Mode 토글 ON**

**가사 입력창에 ChatGPT 가사 붙여넣기.**

**스타일 태그 (영어로 입력):**
\`\`\`
Korean indie pop, emotional, acoustic guitar, soft piano,
female vocal, breathy tone, lo-fi texture, 90 BPM,
café ambience, warm reverb, 2000s K-indie vibe
\`\`\`

**제목 입력:** \`새벽 세 시의 나에게\`

→ **Create** 클릭 (2개 버전 자동 생성됨)

마음에 드는 버전 선택 후 \`...\` 메뉴 → **Download** (MP3)

---

## Step 3: Suno v4 심화 기능 활용

**Remaster**: 이전에 만든 곡을 v4 품질로 업그레이드
- 이전 트랙 선택 → \`Remaster\` 버튼 클릭

**Covers**: 기존 곡 스타일 변환
- 마음에 드는 Suno 곡 → \`Cover\` → 내 가사 입력

**Personas**: 내 아티스트 정체성 저장
- 마음에 드는 생성 곡 → \`Save as Persona\` → 다음 곡에서 동일 보컬 스타일 재사용

---

## Step 4 (선택): ElevenLabs로 내 목소리 버전 만들기

1. [elevenlabs.io/voice-cloning](https://elevenlabs.io/voice-cloning) 접속
2. 내 목소리 1~2분 녹음 업로드 (조용한 환경에서 자연스럽게 읽기)
3. 클론 생성 후 가사를 Text-to-Speech로 변환
4. CapCut에서 Suno 반주 + ElevenLabs 보컬 합성

---

## 📊 실험 결과

| 항목 | 작곡가 의뢰 | AI 직접 제작 |
|------|-----------|-------------|
| 비용 | 50~500만원 | **$0** |
| 소요 시간 | 2~4주 | **1시간** |
| 수정 횟수 | 제한 있음 | **무제한** |
| 저작권 | 협의 필요 | **본인 소유** |
| 장르 제한 | 작곡가 역량 | **1,200개+ 장르** |

---

## 💡 팁 & 응용 아이디어

- **멜로디 고정 팁**: 마음에 드는 버전의 Song ID를 복사해두면 나중에 불러오기 가능
- **가사 태그 활용**: \`[Verse]\`, \`[Chorus]\`, \`[Bridge]\`, \`[Outro]\` 태그로 구조를 명시하면 더 자연스러운 곡 구성
- **콘텐츠 활용**: 완성된 곡에 Midjourney 이미지를 씌워 유튜브 리릭스 비디오나 인스타그램 릴스 제작 가능`,
  },
  {
    title: '키워드만 넣었는데 글이 써진다고?',
    content: `## 🎯 이 실험의 목표
Perplexity로 최신 정보를 수집하고, Claude로 초안을 작성하고, Jasper로 다듬는 3단계 자동화 파이프라인으로 SEO 최적화 블로그 포스트를 키워드 입력 30분 만에 완성한다.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| [Perplexity](https://perplexity.ai) | 실시간 정보 리서치 + 출처 수집 | 무료 |
| [Claude](https://claude.ai) | 고품질 긴 글 초안 생성 | 무료 |
| [Jasper](https://jasper.ai) | 브랜드 보이스 다듬기 + SEO 최적화 | $49/월 |
| WordPress | 발행 플랫폼 | 무료 |

---

## Step 1: Perplexity로 리서치 (5분)

[perplexity.ai](https://perplexity.ai) 에서 **Pro Search** 모드 활성화 후:

\`\`\`
"AI 도구로 소상공인 마케팅 자동화" 키워드로 2025년 기준 최신 트렌드,
실제 성공 사례 3개, 사용 가능한 무료 도구 목록,
관련 통계 수치를 찾아줘. 출처 URL 포함.
\`\`\`

Perplexity가 실시간 웹 검색으로 출처 있는 정보를 정리해 줌. **Export → Copy markdown** 으로 저장.

---

## Step 2: Claude로 초안 작성 (10분)

[claude.ai](https://claude.ai) 에서 새 대화 시작:

\`\`\`
아래 리서치 자료를 바탕으로 블로그 포스트를 작성해줘.

[Perplexity에서 복사한 리서치 내용 붙여넣기]

요구사항:
- 제목: 클릭 유도형, 숫자 포함
- 길이: 1,500~2,000자
- 구조: 후킹 도입부 → 문제 제기 → 해결책 3~5가지 → CTA
- 톤: 친근하고 실용적, 전문 용어 최소화
- SEO: 키워드 "AI 마케팅 자동화" 자연스럽게 5~7회 삽입
- 각 소제목에 이모지 추가
- 한국어
\`\`\`

---

## Step 3: Jasper로 다듬기 + SEO 최적화 (10분)

[jasper.ai](https://jasper.ai) → **Documents** → 새 문서 생성

1. Claude 초안 붙여넣기
2. **Brand Voice** 설정: 브랜드 tone & manner 학습시키기
3. **SEO Mode** 활성화 → 타깃 키워드 입력
4. **Improve** 버튼 → 문장 다듬기
5. **Plagiarism Check** 실행 → 고유성 확인

Jasper 없이도 Claude에 추가 지시로 가능:
\`\`\`
이 글의 메타 디스크립션(160자 이내), 제목 태그(60자 이내),
관련 키워드 10개, 내부 링크용 앵커 텍스트 5개를 만들어줘.
\`\`\`

---

## Step 4: WordPress 발행 (5분)

1. WordPress 관리자 → 글 → 새 글 추가
2. 완성된 콘텐츠 붙여넣기
3. **Yoast SEO** 플러그인에 메타 정보 입력
4. 대표 이미지: DALL·E 3 또는 Unsplash에서 무료 이미지
5. 예약 발행 설정 → 최적 시간대(화~목 오전 9~11시)

---

## 📊 실험 결과

| 항목 | 직접 작성 | AI 파이프라인 |
|------|----------|---------------|
| 리서치 시간 | 60분 | **5분** |
| 초안 작성 | 90분 | **10분** |
| 편집·최적화 | 30분 | **10분** |
| 총 소요 시간 | 3시간 | **30분** |
| 주당 발행 가능 편수 | 2~3편 | **10편+** |

---

## 💡 팁 & 응용 아이디어

- **Perplexity Pages**: 리서치 결과를 공유 가능한 페이지로 바로 발행 가능
- **Claude Projects**: 브랜드 가이드라인 문서를 Project에 업로드해두면 매번 동일한 톤으로 글 생성 자동화
- **배치 생산**: 키워드 리스트 20개를 준비해 하루 2~3시간 투자로 한 달치 콘텐츠 캘린더 완성 가능`,
  },
  {
    title: '압도적 효율의 캘린더 앱 종결',
    content: `## 🎯 이 실험의 목표
Lindy.ai를 Google Calendar, Notion과 연결해 일정 관리의 99%를 자동화한다. 매일 1~2시간 소비하던 일정 조율, 미팅 정리, 리마인더 설정을 AI가 대신 처리하게 만든다.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| [Lindy.ai](https://lindy.ai) | AI 캘린더 비서 | 무료 (기본) |
| Google Calendar | 일정 원본 소스 | 무료 |
| Notion | 미팅 노트 + 할일 관리 | 무료 |
| Gmail | 미팅 요청 이메일 처리 | 무료 |

---

## Step 1: Lindy.ai 계정 설정 및 캘린더 연결

1. [lindy.ai](https://lindy.ai) 접속 → Google 계정으로 가입
2. **Integrations** 탭 → **Google Calendar** 연결
3. **Gmail** 연결 (미팅 요청 이메일 감지용)
4. **Notion** 연결 (미팅 노트 자동 저장)
5. **AI Calendar Assistant** 템플릿 선택 → 활성화

---

## Step 2: 스마트 스케줄링 규칙 설정

Lindy 설정 화면에서 자연어로 규칙 입력:

\`\`\`
내 업무 시간: 평일 오전 10시 ~ 오후 6시
점심 시간 블록: 매일 오후 12:30 ~ 1:30 (미팅 불가)
집중 시간 블록: 매일 오전 10:00 ~ 12:00 (딥워크, 미팅 불가)
미팅 사이 버퍼: 최소 15분
하루 최대 미팅: 4개
\`\`\`

---

## Step 3: 자동 미팅 조율 기능 테스트

클라이언트가 미팅 요청 이메일 발송 시, Lindy가 자동으로:

1. 이메일에서 미팅 요청 감지
2. 내 캘린더에서 가능한 시간대 3개 선택 (규칙 적용)
3. 클라이언트에게 자동 응답 이메일 발송
4. 클라이언트 선택 시 Google Calendar에 자동 추가
5. Zoom/Google Meet 링크 자동 생성 및 공유

---

## Step 4: 미팅 전후 자동화 설정

**미팅 30분 전 자동 알림 (Notion 연동):**
\`\`\`
[미팅 제목]이 30분 후 시작됩니다.
참석자: [이름 목록]
지난 미팅 노트: [Notion 링크]
\`\`\`

**미팅 종료 후 자동 노트 생성:**
- Google Meet 녹화 자동 전사
- Notion에 미팅 요약 + 액션 아이템 자동 저장
- 참석자에게 후속 이메일 자동 발송

---

## 📊 실험 결과

| 항목 | 수동 관리 | Lindy 자동화 |
|------|----------|-------------|
| 미팅 조율 이메일 | 10~20분/건 | **0분 (자동)** |
| 미팅 노트 작성 | 20~30분/건 | **0분 (자동)** |
| 일정 충돌 확인 | 매번 수동 | **0번 (자동 방지)** |
| 하루 일정 관리 시간 | 60~90분 | **5~10분** |
| 월간 시간 절약 | — | **약 30시간** |

---

## 💡 팁 & 응용 아이디어

- **시간대 자동 변환**: 해외 팀과 미팅 시 각자의 현지 시간으로 자동 변환
- **우선순위 학습**: 미팅 중요도를 반복적으로 피드백하면 Lindy가 점점 더 정확하게 우선순위 판단
- **Slack 연동**: Slack에서 \`@Lindy 다음 주 팀 미팅 잡아줘\`처럼 채팅으로 일정 요청 가능`,
  },
  {
    title: '직접 검색 ㄴㄴ, 코멧아 이거 해줘',
    content: `## 🎯 이 실험의 목표
Perplexity Comet 브라우저의 AI 에이전트 기능을 활용해 복잡한 리서치, 폼 작성, 이메일 초안 작성, 가격 비교 등을 직접 검색·클릭 없이 자연어 명령만으로 처리한다. 리서치 시간을 80% 단축한다.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| [Perplexity Comet](https://perplexity.ai/comet) | AI 브라우저 에이전트 | 무료 |
| Notion | 리서치 결과 저장 | 무료 |
| Slack | 결과 공유 및 알림 | 무료 |

---

## Step 1: Comet 설치 및 초기 설정

1. [perplexity.ai/comet](https://perplexity.ai/comet) 접속
2. macOS/Windows 앱 다운로드 (Chromium 기반)
3. Perplexity 계정으로 로그인
4. 우측 사이드바의 **Comet Assistant** 패널 열기
5. Gmail, Google Calendar 연동 허용 (옵션)

Comet은 크롬 확장 프로그램 없이 브라우저 자체에 AI가 내장되어 있음.

---

## Step 2: 기본 리서치 자동화 실험

**실험 1 — 경쟁사 조사:**
\`\`\`
국내 AI 챗봇 SaaS 스타트업 TOP 5를 찾아서
각 회사의 가격, 주요 기능, 고객사를 표로 정리해줘.
\`\`\`
→ Comet이 자동으로 여러 사이트 방문, 정보 수집, 표 형태로 요약.

**실험 2 — 이메일 자동 처리:**
\`\`\`
내 Gmail에서 오늘 받은 미팅 요청 이메일을 찾아서
요약해주고, 가장 중요한 것부터 순서 매겨줘.
\`\`\`

**실험 3 — 구매 결정 보조:**
\`\`\`
맥북 M4 Pro 14인치를 가장 싸게 살 수 있는
국내 공식 판매처 3곳의 현재 가격 비교해줘.
\`\`\`

---

## Step 3: 복합 워크플로우 자동화

**시나리오: 콘텐츠 마케터의 아침 루틴**

Comet에 입력:
\`\`\`
아침 브리핑 준비해줘:
1. 오늘 AI 업계 뉴스 TOP 5 (한국어 요약)
2. 내 구글 캘린더에서 오늘 미팅 3개 요약
3. 경쟁사 SNS에서 어젯밤 올린 포스트
4. 위 내용을 Notion 페이지에 "2026-04-30 모닝 브리핑" 제목으로 저장
\`\`\`

Comet이 순차적으로 모든 작업을 자동 실행.

---

## Step 4: 폼 작성 & 반복 업무 자동화

\`\`\`
[URL] 이 보조금 신청 폼 작성해줘.
내 회사 정보: 회사명 OlaLab, 대표자 홍길동,
사업자번호 123-45-67890, 설립일 2024-03-15
나머지 빈칸은 최대한 논리적으로 채워주고 제출 전에 보여줘.
\`\`\`

---

## 📊 실험 결과

| 작업 항목 | 수동 처리 | Comet 처리 |
|-----------|----------|----------|
| 경쟁사 조사 (5개사) | 90분 | **8분** |
| 아침 브리핑 준비 | 30분 | **3분** |
| 이메일 분류·요약 | 20분 | **2분** |
| 폼 작성 | 20분 | **5분** |
| 일일 총 리서치 시간 | 2.5시간 | **18분** |

---

## 💡 팁 & 응용 아이디어

- **컨텍스트 유지**: Comet은 탭을 넘나들면서도 맥락을 기억 — "아까 찾은 두 번째 회사 홈페이지 가줘"처럼 후속 명령 가능
- **개인정보 주의**: Comet Assistant가 볼 수 있는 페이지 범위를 설정에서 제한 가능
- **Notion 연동**: 리서치 결과를 "Notion에 저장해줘"라고 명령하면 바로 Notion DB에 구조화된 형태로 저장`,
  },
  {
    title: '키워보자, 나의 AI 펫 인플루언서',
    content: `## 🎯 이 실험의 목표
Midjourney로 독창적인 AI 펫 캐릭터를 디자인하고, ChatGPT로 콘텐츠 전략을 수립하고, Canva로 SNS 포스트를 제작해 팔로워 0에서 2,000명까지 2주 안에 성장시키는 AI 인플루언서 계정을 만든다.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| [Midjourney v7](https://midjourney.com) | AI 펫 캐릭터 이미지 생성 | 무료 체험 |
| [ChatGPT](https://chatgpt.com) | 캐릭터 설정 + 캡션 작성 | 무료 |
| [Canva](https://canva.com) | 인스타그램 포스트 디자인 | 무료 |
| Instagram | 콘텐츠 발행 플랫폼 | 무료 |

---

## Step 1: 캐릭터 세계관 설계 (ChatGPT)

\`\`\`
인스타그램에서 인기를 끌 수 있는 AI 펫 인플루언서 캐릭터를 설계해줘.

조건:
- 독창적이고 사랑스러운 외모
- 명확한 성격과 세계관
- 반복 가능한 콘텐츠 포맷
- 타깃: 한국 20~35세 직장인

다음을 포함해서 제안해줘:
1. 캐릭터 이름과 종
2. 외모 특징 5가지 (Midjourney 프롬프트용)
3. 성격과 말투
4. 세계관 설정
5. 콘텐츠 시리즈 아이디어 5가지
\`\`\`

---

## Step 2: Midjourney v7로 캐릭터 비주얼 완성

**기본 캐릭터 시트 생성:**
\`\`\`
/imagine cute chubby cat character, office worker, wearing tiny business suit and glasses,
soft pastel colors, round eyes, expressive face, multiple poses (happy, tired, stressed, excited),
clean white background, sticker sheet style, chibi proportions --ar 3:4 --v 7
\`\`\`

**일상 씬 생성 (Omni Reference로 캐릭터 일관성):**
\`\`\`
/imagine cat character in Seoul subway,
packed morning commute, holding coffee cup, sleepy expression,
cute illustration style, warm color palette --ar 4:5 --v 7 --oref [캐릭터 이미지URL] --ow 350
\`\`\`

**콘텐츠 소재 리스트:**
월요일 출근길 표정 / 점심 도시락 언박싱 / 야근 중 컵라면 / 주말 카페 휴식 / 월급날 기쁨

---

## Step 3: 캡션 & 해시태그 자동화 (ChatGPT)

\`\`\`
인스타그램 AI 고양이 인플루언서 "복실이"의 캐릭터 설정:
- 직장인 고양이, 반말 사용, 솔직하고 공감 가는 말투
- 이모지 많이 사용, 짧은 문장

이 상황의 캡션 3가지 버전 써줘:
상황: 월요일 아침 지하철에서 커피 들고 졸고 있음

해시태그 20개도 함께 (직장인, 고양이, 일상, 공감 관련)
\`\`\`

---

## Step 4: Canva로 포스트 제작 + 스케줄링

1. Canva → **인스타그램 포스트 (1080×1080)** 템플릿 선택
2. Midjourney 이미지 업로드
3. 브랜드 색상 팔레트 고정 (파스텔 계열)
4. Meta Business Suite에서 **최적 시간대** 분석 후 예약 발행

**최적 발행 시간 (한국 직장인 타깃):**
- 평일 오전 7:30~8:30 (출근길)
- 평일 점심 12:00~13:00
- 평일 저녁 21:00~22:00

---

## 📊 실험 결과

| 지표 | 1일차 | 7일차 | 14일차 |
|------|-------|-------|--------|
| 팔로워 수 | 0 | 350 | **2,000+** |
| 포스트 수 | 1 | 14 | 28 |
| 평균 좋아요 | — | 45 | 120 |
| 일일 제작 시간 | — | 20분 | 15분 |

---

## 💡 팁 & 응용 아이디어

- **공감 코드 극대화**: 야근, 월급날, 월요병 등 한국 직장인의 보편적 경험을 소재로 사용하면 저장률·공유율 급등
- **릴스 확장**: Luma Dream Machine으로 15초 짧은 움직임 추가한 릴스가 알고리즘에 유리
- **수익화 경로**: 팔로워 2,000명 이상이면 반려동물 브랜드·직장인 용품 협찬 가능`,
  },
  {
    title: '나노바나나로 쇼츠 찍자! 🍌✨',
    content: `## 🎯 이 실험의 목표
Ola 플랫폼의 AI 영상 제작 도구 Nanobanana Pro와 CapCut을 활용해 아이디어 입력부터 완성된 유튜브 쇼츠 업로드까지 15분 안에 끝낸다. 영상 편집 경험이 없어도 전문적인 쇼츠를 바로 만들 수 있다.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| Nanobanana Pro (Ola) | AI 쇼츠 스크립트 + 콘티 자동 생성 | Ola 플랫폼 내 무료 |
| [CapCut](https://capcut.com) | 영상 편집 + 자동 자막 | 무료 |
| [Canva](https://canva.com) | 썸네일 제작 | 무료 |

---

## Step 1: Nanobanana Pro로 쇼츠 기획 (3분)

Ola 플랫폼 → **실험실** → **Nanobanana Pro** 접속

**주제 입력창에 입력:**
\`\`\`
주제: AI 도구로 돈 버는 방법 5가지
타깃: 20대 대학생 / 취준생
톤: 친근하고 빠른 템포, 반말
길이: 60초
\`\`\`

**Nanobanana Pro가 자동 생성하는 것:**
- 60초 짜리 쇼츠 대본 (훅 → 본문 → CTA 구조)
- 씬별 시각 제안
- 최적 해시태그 15개
- 썸네일 문구 3가지
- 최적 업로드 시간 제안

---

## Step 2: CapCut으로 영상 편집 (8분)

1. CapCut 앱 실행 → **새 프로젝트** → **9:16 세로형** 선택
2. **AI 스크립트 → 영상** 기능: Nanobanana Pro 스크립트 붙여넣기 → AI가 관련 스톡 영상 자동 매칭
3. **자동 자막** 기능 활성화 → 한국어 인식 → 스타일 선택 (팝업형 추천)
4. 텍스트 훅 추가: 0~3초에 큰 글씨로 메인 훅 문구
5. **속도 조절**: 1.1~1.15배속으로 약간 빠르게
6. 배경음악 볼륨: 20~30%로 낮추기
7. 내보내기: **1080p / 60fps**

---

## Step 3: Canva로 썸네일 제작 (3분)

1. Canva → **유튜브 썸네일 (1280×720)** 템플릿
2. Nanobanana Pro가 제안한 썸네일 문구 선택
3. 임팩트 있는 폰트 + 밝은 배경색
4. JPG 다운로드

---

## Step 4: 유튜브 업로드 최적화

- **제목**: \`AI로 돈 버는 법 5가지 (현실적인 방법만) #shorts\`
- **해시태그**: \`#shorts #AI #부업 #돈버는법\`
- **예약 발행**: 화~목 오전 7~9시 or 저녁 9~11시

---

## 📊 실험 결과

| 단계 | 기존 제작 시간 | Nanobanana Pro 활용 |
|------|--------------|-------------------|
| 기획 + 대본 | 30~60분 | **3분** |
| 영상 편집 | 30~60분 | **8분** |
| 썸네일 제작 | 15~30분 | **3분** |
| 업로드 최적화 | 10분 | **1분** |
| **총 소요 시간** | **1.5~2.5시간** | **15분** |

---

## 💡 팁 & 응용 아이디어

- **시리즈 기획**: Nanobanana Pro의 "시리즈 모드"로 같은 주제 10편 대본을 한 번에 생성
- **훅의 법칙**: 첫 3초가 전부. Nanobanana Pro는 알고리즘 분석 기반으로 클릭률 높은 훅 패턴을 자동 제안
- **A/B 테스트**: 같은 내용으로 훅만 다른 버전 2개를 만들어 초기 성과 높은 쪽에 집중`,
  },
  {
    title: '나도 아티스트 — 내 안의 예술혼을 찾아라',
    content: `## 🎯 이 실험의 목표
Midjourney, DALL·E 3, Leonardo AI 세 가지 도구를 모두 써보며 각각의 개성과 강점을 파악하고, 나만의 독창적인 AI 아트 작품 10개를 완성해 디지털 포트폴리오로 구성한다.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| [Midjourney v7](https://midjourney.com) | 시네마틱·감성 이미지 | 무료 체험 |
| [DALL·E 3](https://chatgpt.com) | 정확한 지시 따르기, 텍스트 포함 이미지 | ChatGPT 무료 |
| [Leonardo AI](https://leonardo.ai) | 사실적 인물·판타지·게임 아트 | 무료 (월 150크레딧) |

---

## Step 1: 나만의 아트 스타일 발견

ChatGPT에 먼저 물어보기:
\`\`\`
내가 좋아하는 것들: [애니메이션, 사이버펑크, 한국 전통문화, 자연 풍경]
내가 끌리는 색감: [파스텔, 네온, 흑백, 따뜻한 토닝]

위를 조합한 나만의 AI 아트 스타일 정의 +
Midjourney 프롬프트 핵심 키워드 10개 제안해줘.
\`\`\`

---

## Step 2: Midjourney v7 — 감성 작품 4점

**작품 1 — 사이버펑크 서울:**
\`\`\`
/imagine cyberpunk Gwanghwamun Seoul, neon signs in Korean,
rain-soaked streets, holographic advertisements,
traditional Korean architecture meets futuristic tech,
cinematic lighting, hyperrealistic --ar 16:9 --v 7 --style raw
\`\`\`

**작품 2 — 한국 전통 판타지:**
\`\`\`
/imagine Korean female warrior in traditional armor,
standing on mountain peak, cherry blossoms swirling,
dragons in the clouds, epic fantasy art, Studio Ghibli meets Korean folklore,
golden hour lighting --ar 2:3 --v 7
\`\`\`

**작품 3 — 감성 미니멀:**
\`\`\`
/imagine minimal illustration, Korean girl reading book
under a giant moon, cozy aesthetic, muted pastel colors,
loose watercolor texture, negative space --ar 1:1 --v 7 --style cute
\`\`\`

---

## Step 3: DALL·E 3 — 텍스트 포함 작품 3점

ChatGPT에서 이미지 생성 요청 (한국어 텍스트 포함 시 DALL·E 3가 최강):

\`\`\`
레트로 스타일 영화 포스터를 만들어줘.
제목: "서울의 밤" (한국어로 크게)
배경: 1980년대 홍대 골목, 네온 간판
분위기: 누아르 + 향수, 필름 그레인 질감
\`\`\`

---

## Step 4: Leonardo AI — 사실적·판타지 작품 3점

[leonardo.ai](https://leonardo.ai) 접속 → **Create** → 모델 선택

**Leonardo Phoenix 모델 (실사 인물):**
\`\`\`
young Korean woman in hanbok, cherry blossom forest,
cinematic portrait, soft bokeh background, golden ratio composition
Model: Leonardo Phoenix | Style: Cinematic
\`\`\`

**Fantasy + Game Art:**
\`\`\`
Epic fantasy game character, male Korean warrior,
glowing blue sword, dynamic action pose, particle effects,
game concept art style
Model: AlbedoBase XL
\`\`\`

---

## 📊 실험 결과

| 도구 | 강점 | 추천 용도 |
|------|------|----------|
| Midjourney v7 | 예술적 감성, 영화적 구도 | SNS 감성 포스팅, 앨범 아트 |
| DALL·E 3 | 텍스트 정확도, 지시 따르기 | 포스터, 로고, 인포그래픽 |
| Leonardo AI | 사실적 인물, 게임 아트 | 캐릭터 디자인, 포트폴리오 |
| 작품 완성 수 | 0개 | **10개** |
| 소요 시간 | — | **약 2시간** |

---

## 💡 팁 & 응용 아이디어

- **NFT/프린트 판매**: 완성된 작품을 Redbubble, Society6에 업로드해 포스터·머그컵 등으로 판매 가능
- **Midjourney 스타일 저장**: 마음에 드는 결과물의 Job ID를 \`--sref\` 파라미터로 재사용하면 동일한 스타일 계속 유지
- **포트폴리오 사이트**: Canva로 AI 아트 포트폴리오 웹사이트 무료 제작 후 링크드인 프로필에 추가`,
  },
  {
    title: '나도 바나나? 이제 진짜다 Nanobanana Pro',
    content: `## 🎯 이 실험의 목표
Ola 플랫폼의 Nanobanana Pro와 Canva를 활용해 브랜딩부터 SNS 콘텐츠 디자인, 인스타그램 피드 구성까지 디자인 비용 ₩0으로 전문가 수준의 개인 브랜드를 완성한다.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| Nanobanana Pro (Ola) | AI 브랜딩 + 콘텐츠 아이디어 생성 | Ola 플랫폼 내 무료 |
| [Canva](https://canva.com) | 비주얼 디자인 제작 | 무료 |
| Instagram | 콘텐츠 발행 | 무료 |

---

## Step 1: Nanobanana Pro로 브랜드 아이덴티티 설계

Ola 플랫폼 → **실험실** → **Nanobanana Pro** → **브랜드 빌더 모드**

**나에 대한 정보 입력:**
\`\`\`
이름/닉네임: [입력]
직업/관심사: UX 디자이너 + AI 도구 애호가
타깃 오디언스: 디자인 취업 준비 중인 20대
콘텐츠 방향: AI 도구 리뷰 + 디자인 팁
원하는 분위기: 전문적이지만 친근함, 미니멀
색감 선호: 흰색 베이스 + 포인트 컬러 1~2개
\`\`\`

**Nanobanana Pro가 생성하는 것:**
- 브랜드 컬러 팔레트 (HEX 코드 포함)
- 폰트 조합 2세트
- 인스타그램 바이오 3가지 버전
- 콘텐츠 필러 5개
- 계정 네임 후보 5개
- 첫 9개 포스트 아이디어

---

## Step 2: Canva로 브랜드 템플릿 제작

1. Canva → **브랜드 키트** 설정 → Nanobanana Pro가 제안한 색상 HEX 코드 입력
2. **인스타그램 포스트 템플릿 3종** 제작:
   - **정보형**: 흰 배경 + 타이포그래피 중심
   - **사진형**: 인물/스크린샷 + 브랜드 컬러 오버레이
   - **카드뉴스형**: 슬라이드 4장짜리 정보 시리즈
3. **인스타그램 하이라이트 커버** 5개 제작

---

## Step 3: 첫 9개 포스트 제작 (피드 구성)

Nanobanana Pro에 입력:
\`\`\`
첫 9개 인스타그램 포스트 상세 기획해줘:
- 각 포스트의 메인 카피 (30자 이내)
- 본문 캡션 (150자, 이모지 포함)
- 추천 이미지 방향
- 해시태그 15개
포스트 순서: 피드 첫인상이 전문적으로 보이도록 구성
\`\`\`

**Canva에서 실제 제작 (포스트 1개당 5~8분):**
1. 브랜드 템플릿 복사 → 텍스트 입력 → 이미지 교체 → PNG 다운로드

---

## Step 4: 인스타그램 프로필 최적화

Nanobanana Pro 제안 바탕으로:

\`\`\`
프로필 사진: Midjourney나 AI 프로필 생성기로 브랜드 캐릭터 제작
바이오 예시:
"AI × 디자인 🍌
매주 AI 도구 리뷰 + 디자인 팁
취준생 디자이너의 성장 기록
📩 협업: [이메일]"
링크: Notion 포트폴리오 or 링크트리
\`\`\`

---

## 📊 실험 결과

| 항목 | 디자이너 외주 | Nanobanana Pro + Canva |
|------|--------------|------------------------|
| 브랜드 아이덴티티 | 50~200만원 | **₩0** |
| 첫 피드 9장 | 30~100만원 | **₩0** |
| 제작 시간 | 2~4주 | **하루** |
| 수정 자유도 | 제한적 | **무제한** |

---

## 💡 팁 & 응용 아이디어

- **Canva Pro 없이도**: 커스텀 팔레트를 메모해두고 매번 HEX 코드 입력하면 동일 효과
- **피드 미리보기**: Canva의 "소셜 미디어 예약" 또는 Preview 앱으로 포스트 업로드 전 피드 전체 모습 확인
- **월간 콘텐츠 플랜**: 매월 1일 Nanobanana Pro에 "이번 달 콘텐츠 캘린더 30일치"를 요청해 콘텐츠 고갈 걱정 해소`,
  },
  {
    title: '[모임 가이드] AI로 블로그 초안 작성 & 이메일 자동 배달 공방',
    content: `## 🎯 이 실험의 목표
Google Sheets + ChatGPT + Make.com + Gmail을 연결해 키워드만 스프레드시트에 입력하면 블로그 초안이 자동으로 작성되고 이메일로 자동 배달되는 완전 자동화 파이프라인을 2시간 안에 완성한다. 비용 0원.

---

## 🛠️ 준비물

| 도구 | 역할 | 비용 |
|------|------|------|
| [Google Sheets](https://sheets.google.com) | 키워드 입력 + 결과물 저장 | 무료 |
| [ChatGPT API](https://platform.openai.com) | 블로그 초안 자동 생성 | 무료 ($5 크레딧 지급) |
| [Make.com](https://make.com) | 자동화 워크플로우 연결 | 무료 (월 1,000 오퍼레이션) |
| [Gmail](https://gmail.com) | 완성된 초안 자동 발송 | 무료 |
| MS Copilot | 초안 품질 검토 (선택) | 무료 |

---

## Step 1: Google Sheets 템플릿 준비 (15분)

새 Google Sheets 생성 → 시트 이름: "블로그 자동화"

**컬럼 설정:**
| A: 번호 | B: 키워드 | C: 타깃 독자 | D: 톤 | E: 상태 | F: 생성일 |

**샘플 데이터 입력:**
\`\`\`
1 | AI 생산성 도구 추천 | 직장인 | 친근하고 실용적 | 대기중 |
2 | 재테크 자동화 방법 | 20-30대 | 전문적이지만 쉽게 | 대기중 |
\`\`\`

---

## Step 2: ChatGPT API 키 발급 (5분)

1. [platform.openai.com](https://platform.openai.com) 접속 → 회원가입
2. **API Keys** → **Create new secret key** → 복사해두기
3. 신규 계정에 $5 무료 크레딧 자동 지급 (약 블로그 글 50편 생성 가능)

---

## Step 3: Make.com 시나리오 구성 (60분)

[make.com](https://make.com) 회원가입 → **Create a new scenario**

**모듈 1 — 트리거 (Google Sheets 감지):**
- 모듈: \`Google Sheets - Watch Rows\`
- 트리거 조건: E열(상태) = "대기중"
- 스케줄: 매일 오전 9시 실행

**모듈 2 — ChatGPT API 호출:**
- 모듈: \`OpenAI (ChatGPT) - Create a Completion\`
- Model: \`gpt-4o-mini\` (비용 효율)
- System: "당신은 SEO 최적화된 한국어 블로그 포스트를 작성하는 전문 작가입니다."
- User 프롬프트:
\`\`\`
키워드: {{B열 값}}
타깃 독자: {{C열 값}}
톤앤매너: {{D열 값}}

요구사항:
- 제목 (클릭유도형, 숫자 포함)
- 서론 (문제 제기)
- 본론 (소제목 3~5개)
- 결론 (CTA 포함)
- 메타 디스크립션 (160자)
- 추천 해시태그 10개
\`\`\`

**모듈 3 — Google Sheets 업데이트:**
- E열 = "완료", F열 = 현재 날짜, G열 = ChatGPT 생성 초안 전문

**모듈 4 — Gmail 자동 발송:**
- Subject: \`[블로그 초안] {{키워드}} - {{날짜}}\`
- Body: ChatGPT 생성 초안 (HTML 형식)

---

## Step 4: MS Copilot로 품질 검토 (선택)

이메일로 받은 초안을 Microsoft 365 문서에 붙여넣기 → Copilot 사이드바 활성화:

\`\`\`
이 블로그 글의 문법 오류 수정, 더 자연스러운 표현으로 개선,
SEO 키워드 밀도 확인해줘.
\`\`\`

---

## 📊 실험 결과

| 항목 | 수동 작성 | 자동화 파이프라인 |
|------|----------|-----------------|
| 블로그 1편 작성 시간 | 2~3시간 | **5분 (검토 포함)** |
| 주당 발행 가능 편수 | 2~3편 | **7편 이상** |
| 총 구축 시간 | — | **2시간 (1회)** |
| 월간 비용 | 외주 시 30~100만원 | **₩0** |

---

## 💡 팁 & 응용 아이디어

- **Make.com 무료 한도**: 월 1,000 오퍼레이션 = 블로그 글 250편 자동 생성 가능 (4 모듈 × 250회)
- **멀티 플랫폼 확장**: WordPress 모듈 추가 → 초안 검토 없이 바로 Draft 상태로 자동 업로드
- **팀 협업 버전**: Google Sheets 편집 권한을 팀원과 공유 → 누구나 키워드 입력 → 팀 전체 생산성 도구로 확장`,
  },
];

async function main() {
  let updated = 0;
  let notFound = 0;

  for (const item of CONTENTS) {
    const experiment = await prisma.experiment.findFirst({
      where: { title: item.title },
    });

    if (!experiment) {
      console.warn(`⚠️  찾을 수 없음: ${item.title}`);
      notFound++;
      continue;
    }

    await prisma.experiment.update({
      where: { id: experiment.id },
      data: { content: item.content },
    });

    console.log(`✅ 업데이트: ${item.title}`);
    updated++;
  }

  console.log(`\n🎉 완료: ${updated}개 업데이트, ${notFound}개 스킵`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
