# Ola AI 플랫폼 — 에이전트 인계 가이드 (Agent Handover Guide)

> 이 문서는 Ola AI 플랫폼 개발을 이어받는 **모든 AI 에이전트**(Claude, Gemini, Cursor, ChatGPT 등)를 위한 통합 기술·협업 가이드입니다.
> 프로젝트를 처음 파악하거나 이어받는 에이전트는 반드시 이 가이드를 **처음부터 끝까지** 숙지해 주세요.

---

## 1. 프로젝트 개요

**Ola**는 AI 도구·튜토리얼·커뮤니티를 하나로 묶는 **AI 크리에이터 커뮤니티 플랫폼**입니다.

| 항목 | 내용 |
|------|------|
| 프로젝트 루트 | `./ola` (모노레포 단일 루트) |
| GitHub (모노레포) | `https://github.com/HONGDAEEUI-dev/ola` |
| 프론트엔드 배포 | Vercel — GitHub `ola-client` 레포 연동 자동배포 |
| 백엔드 배포 | **Render** — `ola-backend` 서비스, Node, Singapore |
| 백엔드 API URL | `https://ola-backend-9f03.onrender.com/api` |
| 데이터베이스 | Supabase (PostgreSQL) |

---

## 2. 기술 스택 (Tech Stack)

| 계층 | 기술 |
|------|------|
| **Frontend** | Next.js 16 (App Router), TailwindCSS v4, TypeScript |
| **Backend** | NestJS, Prisma ORM, Swagger (`/api/docs`) |
| **Database** | Supabase PostgreSQL (Connection Pooler + Direct URL) |
| **인증** | Supabase Auth (이메일 로그인, JWT) |
| **Hosting** | Vercel (Frontend) + Render (Backend) |
| **패키지 매니저** | npm, Node.js v24+ |

---

## 3. 디렉토리 구조

```
ola/
├── client_front/          # Next.js 프론트엔드 (포트 3000)
│   └── src/
│       ├── app/[locale]/
│       │   ├── admin/      # 관리자 콘솔 (3탭: 승인관리/도구추가/실험실추가)
│       │   ├── labs/       # 실험실(튜토리얼) 목록 & 상세
│       │   ├── tools/      # AI 도구 목록 & 상세
│       │   ├── prompts/    # 프롬프트 마켓플레이스
│       │   ├── meetups/    # 모임(Meetups) 목록 & 개설
│       │   ├── categories/ # 카테고리 필터
│       │   └── community/  # 커뮤니티 게시판
│       ├── components/
│       │   ├── AdUnit.tsx  # Google AdSense 광고 단위 컴포넌트
│       │   └── ...
│       └── lib/
│           └── api.ts      # API_BASE 상수 (NEXT_PUBLIC_API_URL 또는 Render URL)
├── back/                   # NestJS 백엔드 (포트 3002)
│   ├── prisma/
│   │   ├── schema.prisma   # DB 스키마 정의
│   │   └── seed.ts         # 시드 데이터
│   └── src/
│       ├── labs/           # 실험실 API (Experiment 모델)
│       ├── tools/          # 도구 API (Tool 모델, affiliateUrl 포함)
│       ├── posts/          # 커뮤니티 게시글 API
│       ├── meetups/        # 모임 API
│       ├── prompts/        # 프롬프트 API
│       ├── common/
│       │   ├── admin.guard.ts        # X-Admin-Secret 또는 Bearer JWT 인증
│       │   └── supabase-auth.util.ts # Supabase JWT 검증 유틸
│       ├── notifications/  # 알림 서비스 (WebSocket — Vercel 아님, Render에서 동작)
│       └── prisma/         # PrismaModule (Global)
├── admin_front/            # Vite+React 관리자 대시보드 (별도)
├── template/               # HarnessHub 파생 프로젝트 보일러플레이트 스크립트
├── .claude/                # ★ Harness 팀-아키텍처 프레임워크
│   └── skills/harness/     # 하네스 메인 스킬 & 레퍼런스
└── AGENT_HANDOVER.md       # 협업 규칙 요약
```

---

## 4. 환경 변수 (Environment Variables)

### Backend (`back/.env` / Render 환경변수)
```
DATABASE_URL=postgresql://...@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://...@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres
ADMIN_SECRET=<관리자 전용 시크릿>
SUPABASE_JWT_SECRET=<Supabase JWT 시크릿>
```

### Frontend (`client_front/.env.local` / Vercel 환경변수)
```
NEXT_PUBLIC_API_URL=https://ola-backend-9f03.onrender.com/api
NEXT_PUBLIC_ADSENSE_ID=<Google AdSense Publisher ID — 승인 후 추가>
```

---

## 5. 로컬 실행 방법

```bash
# Node 버전 설정
nvm use v24.11.0

# 백엔드 실행 (포트 3002)
cd back && npm run start:dev

# 프론트엔드 실행 (포트 3000) — 별도 터미널
cd client_front && npm run dev
```

---

## 6. 배포 방법

**모노레포에서 각 서비스 레포로 subtree push 후 자동 배포됩니다.**
> ⚠️ 반드시 **모노레포 루트(`/ola`)** 에서 실행해야 합니다. 서브디렉토리에서 실행하면 실패합니다.

```bash
# 프론트엔드 배포 (Vercel 자동배포 트리거)
git push ola-client "$(git subtree split --prefix=client_front main):main" --force

# 백엔드 배포 — GitHub push 후 Render deploy hook 트리거
git push ola-backend "$(git subtree split --prefix=back main):main" --force
curl -s "https://api.render.com/deploy/srv-d7k76p28qa3s739bl2m0?key=E_EkloSBnJg"
```

| 서비스 | 플랫폼 | GitHub 레포 | 자동배포 |
|--------|--------|------------|---------|
| 프론트엔드 | Vercel | `ola-client` | GitHub push 시 자동 |
| 백엔드 | Render | `ola-backend` | deploy hook curl 필요 |

---

## 7. 현재 구현 완료된 기능

### 1차 개발 (MVP)
| 기능 | 상태 | 핵심 파일 |
|------|------|-----------|
| Labs(실험실) 목록 & 상세 | ✅ | `client_front/src/app/labs/`, `back/src/labs/` |
| Tools(도구) 목록 & 상세 | ✅ | `client_front/src/app/tools/`, `back/src/tools/` |
| 도구 → 관련 실험실 자동 연동 | ✅ | `back/src/tools/tools.service.ts` (`relatedLabs`) |
| 실험실 발표 모드 (Workshop Mode) | ✅ | `client_front/src/components/WorkshopClient.tsx` |
| 실험실 → 원클릭 모임 개설 파이프라인 | ✅ | `client_front/src/app/meetups/new/` |
| 카테고리 페이지 (24개 세부 카테고리) | ✅ | `client_front/src/app/categories/page.tsx` |
| 커뮤니티 게시판 (CRUD) | ✅ | `back/src/posts/`, `client_front/src/app/community/` |
| 좋아요 & 북마크 | ✅ | `back/src/likes/`, `back/src/bookmarks/` |
| 다크모드 | ✅ | 헤더 및 전역 테마 토글 |
| DiceBear 일러스트 카드 | ✅ | 도구/실험실 카드 이미지 |
| Swagger API 문서 | ✅ | `/api/docs` |

### 2차 개발
| 기능 | 상태 | 핵심 파일 |
|------|------|-----------|
| ISR 캐싱 최적화 (revalidate 3600s) | ✅ | 전체 페이지 `revalidate` 값 상향, `cache:no-store` 제거 |
| Vercel 요청 하드닝 (rate limit 등) | ✅ | `back/src/tools/tools.controller.ts` (`@Throttle`) |
| 제휴 링크 (affiliateUrl) | ✅ | `back/prisma/schema.prisma`, `client_front/src/app/tools/[id]/page.tsx` |
| Google AdSense 인프라 | ✅ | `client_front/src/components/AdUnit.tsx`, `layout.tsx` |
| 관리자 콘솔 3탭 UI | ✅ | `client_front/src/app/[locale]/admin/page.tsx` |
| 관리자 도구 직접 추가 API | ✅ | `POST /api/tools/admin` (`back/src/tools/tools.controller.ts`) |
| 관리자 실험실 직접 추가 API | ✅ | `POST /api/labs/admin` (`back/src/labs/labs.controller.ts`) |
| AdminGuard Bearer JWT 인증 | ✅ | `back/src/common/admin.guard.ts` |

---

## 8. 주요 API 엔드포인트

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/api/tools` | 전체 도구 목록 | 없음 |
| GET | `/api/tools/:id` | 도구 상세 (relatedLabs 포함) | 없음 |
| POST | `/api/tools` | 도구 제출 (PENDING 상태) | Bearer JWT |
| POST | `/api/tools/admin` | 도구 직접 추가 (ACTIVE, 관리자용) | AdminGuard |
| PATCH | `/api/tools/:id/approve` | 도구 승인 | AdminGuard |
| PATCH | `/api/tools/:id/reject` | 도구 거절 | AdminGuard |
| GET | `/api/labs` | 실험실(Experiment) 목록 | 없음 |
| GET | `/api/labs/:id` | 실험실 상세 | 없음 |
| POST | `/api/labs/admin` | 실험실 직접 추가 (관리자용) | AdminGuard |
| GET | `/api/prompts` | 프롬프트 목록 | 없음 |
| GET | `/api/posts` | 커뮤니티 게시글 | 없음 |
| POST | `/api/posts` | 게시글 작성 | Bearer JWT |
| GET | `/api/meetups` | 모임 목록 | 없음 |
| GET | `/api/search/suggest?q=` | 통합 검색 | 없음 |
| POST | `/api/likes` | 좋아요 토글 | Bearer JWT |
| POST | `/api/bookmarks` | 북마크 토글 | Bearer JWT |

### AdminGuard 인증 방식
두 가지 방식 중 하나를 사용:
1. 헤더: `X-Admin-Secret: <ADMIN_SECRET 환경변수 값>`
2. 헤더: `Authorization: Bearer <Supabase JWT>` — 토큰의 email이 `admin@olalab.kr`이어야 함

---

## 9. 향후 작업 계획 (Upcoming Tasks)

우선순위 순으로 정리합니다:

1. **Google AdSense 활성화** — `adsense.google.com`에서 승인 후 `NEXT_PUBLIC_ADSENSE_ID` 환경변수 Vercel에 추가
2. **제휴 링크 등록** — 각 도구별 제휴 프로그램 가입 후 Supabase DB `affiliateUrl` 값 직접 입력
3. **소셜 로그인 구현** — Supabase Auth (Google/GitHub Provider), `AuthContext`, 마이페이지
4. **모임 개설 백엔드 API 연동** — 현재 프론트엔드 폼 UI만 구현, POST API 연결 필요
5. **개인화 기능 (My AI Toolbox)** — 유저가 도구와 실험실을 찜하는 북마크 시스템
6. **도구 비교 페이지** — 여러 도구 선택하여 요금제·성능 Side-by-side 비교
7. **커뮤니티 활성화** — 주간 인기 도구 랭킹, 크리에이터 뱃지 시스템

---

## 10. Harness 팀-아키텍처 프레임워크

### 이게 뭔가요?
[revfactory/harness](https://github.com/revfactory/harness)는 **Claude Code용 팀 아키텍처 팩토리**입니다.
복잡한 작업을 여러 전문가 에이전트가 분담·협업하도록 설계해주는 도구입니다.

### 설치 위치
```
ola/.claude/skills/harness/
├── SKILL.md                        # 메인 스킬 (6 Phase 워크플로우)
└── references/
    ├── agent-design-patterns.md    # 6가지 아키텍처 패턴 설명
    ├── orchestrator-template.md    # 오케스트레이터 템플릿
    ├── team-examples.md            # 실전 팀 구성 예시 5종
    ├── skill-writing-guide.md      # 스킬 작성 가이드
    ├── skill-testing-guide.md      # 테스트/평가 방법론
    └── qa-agent-guide.md           # QA 에이전트 통합 가이드
```

### 사용법 (모든 에이전트 공통)
대규모 작업을 시작할 때, 다음 프롬프트를 입력하세요:

```
하네스 구성해줘
```
또는
```
이 프로젝트에 맞는 에이전트 팀 구축해줘
```

### 6가지 아키텍처 패턴
| 패턴 | 설명 | 적합한 상황 |
|------|------|-------------|
| **파이프라인** | 순차 의존 작업 | 단계별 순서가 중요한 빌드 플로우 |
| **팬아웃/팬인** | 병렬 독립 작업 | 여러 리서치를 동시에 수행 |
| **전문가 풀** | 상황별 선택 호출 | 도메인 전문가를 골라 쓰는 구조 |
| **생성-검증** | 생성 후 품질 검수 | 코드 생성 → QA 리뷰 |
| **감독자** | 중앙 에이전트가 동적 분배 | 실시간 조율이 필요한 복잡한 작업 |
| **계층적 위임** | 상위→하위 재귀적 위임 | 대규모 프로젝트를 분할 정복 |

### 요구사항 (Claude Code 전용)
하네스의 에이전트 팀 기능을 사용하려면 환경 변수가 필요합니다:
```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

---

## 11. 협업 규칙 (Working Agreement)

1. **단일 루트**: 모든 작업은 `./ola` 루트 디렉토리에서만 진행합니다.
2. **브랜치 전략**: 기능 작업 시 `feature/작업명` 브랜치를 만들고, 완료 후 `main`에 병합합니다.
3. **커밋 메시지**: 한국어, Conventional Commit 형식 (`feat:`, `fix:`, `chore:` 등) 으로 작성합니다.
4. **배포**: subtree push로 각 서비스 레포에 배포. 백엔드는 push 후 deploy hook curl 필수.
5. **대규모 작업**: 반드시 하네스를 먼저 구동하여 에이전트 팀을 스폰한 뒤 위임합니다.

---

## 12. 알려진 이슈 & 주의사항

- **Vercel Hobby 플랜 fair-use 한도**: Fast Origin Transfer 10GB, Edge Requests 1M/월. 초과 시 사이트 차단됨. ISR revalidate 3600s 적용 중. `generateStaticParams`는 빌드 시 API를 과다 호출하므로 **절대 사용 금지**.
- **AdminGuard 이중 인증**: `X-Admin-Secret` 헤더 또는 `admin@olalab.kr` Supabase Bearer JWT 둘 다 허용. 프론트에서는 Bearer JWT 방식 사용.
- **Pollinations 이미지 API 레이트 리밋**: 익명 사용 시 IP당 동시 1건 제한 → DiceBear Shapes API로 대체 완료.
- **PostsModule 의존성**: `NotificationsModule`을 반드시 import해야 함 (이미 수정 완료).
- **TypeScript `any` 타입**: 일부 페이지에 `any` 타입이 남아있어 인터페이스 정의 보강 필요.
- **Tailwind CSS v4 금지 클래스**: `bg-gradient-to-*`, `flex-shrink-0`, `flex-grow` 사용 금지.

---

*이 문서를 읽었다면, 당신은 이미 Ola 플랫폼의 든든한 동료입니다. 함께 전 세계 최고의 AI 커뮤니티를 만들어 봅시다!* 🚀✨
