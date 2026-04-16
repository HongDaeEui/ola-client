# Ola Platform Project Handover Document (Ola AI 플랫폼 인계 문서)

이 문서는 Ola AI 플랫폼 개발을 이어받을 Claude를 위한 상세 기술 가이드입니다.

## 🛠 현재 기술 스택 (Tech Stack)
- **Frontend**: Next.js 15 (App Router), TailwindCSS, TypeScript
- **Backend**: NestJS, Prisma ORM, Swagger
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (Frontend & Backend)

## 📍 현재 진행 상태 (Current Status)
1. **DB 클라우드 이전 완료**: 로컬 PostgreSQL에서 Supabase 클라우드 DB로 이전 및 데이터 시딩 완료.
2. **백엔드 클라우드 배포 완료**: NestJS 백엔드를 Vercel Serverless로 배포 성공.
   - **API Base URL**: `https://ola-backend-psi.vercel.app/api`
3. **프론트엔드 연동 완료**: `Labs`, `Prompts`, `Tools` 의 메인 목록 페이지들을 가짜 데이터(Mock)에서 실제 배포된 백엔드 API 호출 방식으로 전환 완료.
4. **CORS 설정**: 백엔드에서 `olalab.kr` 및 로컬 환경의 접속을 허용하도록 설정함.

## 🚀 다음 미션 (Upcoming Tasks for Claude)

### 1. 동적 상세 페이지 구현 (Dynamic Routing)
- **목표**: 카드 클릭 시 상세 페이지로 이동하고 개별 데이터를 렌더링.
- **작업 파일**:
  - `client_front/src/app/labs/[id]/page.tsx`
  - `client_front/src/app/tools/[id]/page.tsx`
  - `client_front/src/app/prompts/[id]/page.tsx`
- **핵심 로직**: `params.id`를 사용하여 백엔드 API(`GET /api/tools/:id` 등) 호출.
- **디자인 방향**: 프리미엄 AI 커뮤니티 느낌의 Hero 섹션, 상세 설명, 기술 스택 뱃지 적용.

### 2. 소셜 로그인 구현 (Supabase Auth)
- **목표**: 사용자가 로그인을 통해 북마크, 좋아요, 본인 프롬프트 업로드를 할 수 있게 함.
- **작업 내용**:
  - Supabase Auth 설정 (Google/GitHub Provider).
  - 프론트엔드에 `AuthContext` 또는 `LoginButton` 구현.
  - 마이페이지(`app/profile/page.tsx`) 구축.

## 🔑 주요 환경 변수 (Environment Variables)
- **Backend (.env)**:
  - `DATABASE_URL`: Supabase Connection Pooler 주소
  - `DIRECT_URL`: Supabase Direct Connection 주소
- **Frontend (.env.local)**:
  - `NEXT_PUBLIC_API_URL`: `https://ola-backend-psi.vercel.app/api`

## ⚠️ 주의 사항 (Important Notes)
- 백엔드 배포는 `npx vercel --prod` 명령어를 사용하거나, `.prisma` 엔진 파일을 포함하도록 `vercel.json`에 `includeFiles` 설정이 되어 있어야 함 (이미 적용 완료).
- 프론트엔드의 `page.tsx` 파일들에 TypeScript `any` 타입을 인터페이스로 정의하여 보완할 필요가 있음.

---
Claude, 이어서 오라 AI 플랫폼을 전 세계 1등 AI 커뮤니티로 만들어주길 바래! 🧙‍♂️✨
