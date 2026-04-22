---
name: ola-orchestrator
description: "Ola AI 플랫폼 개발 오케스트레이터. (1) 새로운 기능 구현, 페이지 추가, API 개발 요청 시, (2) 버그 수정, 에러 해결 요청 시, (3) UI/UX 개선, 디자인 변경 요청 시, (4) 데이터베이스 스키마 변경, 시드 데이터 추가 시, (5) '다시 실행', '재실행', '업데이트', '수정', '보완', '이어서' 등의 후속 작업 요청 시 사용. Ola 플랫폼 관련 개발 작업이면 이 스킬을 트리거하라."
---

# Ola Platform Orchestrator

Ola AI 커뮤니티 플랫폼의 개발 작업을 4인 전문가 팀으로 분해·조율하는 오케스트레이터.

## 팀 구성

| 에이전트 | 역할 | 정의 파일 |
|----------|------|-----------|
| **Analyst** | 요구사항 분석, 영향 범위 파악, 작업 분할 | `.claude/agents/analyst.md` |
| **Frontend Builder** | Next.js 프론트엔드 구현 | `.claude/agents/frontend-builder.md` |
| **Backend Builder** | NestJS 백엔드 API 구현 | `.claude/agents/backend-builder.md` |
| **QA Engineer** | 경계면 교차 검증, 빌드 테스트 | `.claude/agents/qa.md` |

## 아키텍처 패턴: 파이프라인 + 팬아웃/팬인 하이브리드

```
Phase 1: Analyst (분석·설계)
    ↓ 구현 계획서
Phase 2: Frontend Builder ←→ Backend Builder (병렬 구현, 상호 API shape 교환)
    ↓ 구현 완료
Phase 3: QA Engineer (경계면 교차 검증)
    ↓ 버그 발견 시 → Phase 2 해당 빌더에게 수정 요청 (최대 2회 반복)
Phase 4: 배포 및 보고
```

## 워크플로우

### Phase 0: 컨텍스트 확인

1. `_workspace/` 디렉토리 존재 여부를 확인한다
2. 실행 모드를 결정한다:
   - `_workspace/` 미존재 → **초기 실행** (Phase 1부터 전체 실행)
   - `_workspace/` 존재 + 사용자가 부분 수정 요청 → **부분 재실행** (해당 에이전트만)
   - `_workspace/` 존재 + 새 기능 요청 → **새 실행** (`_workspace/`를 `_workspace_prev/`로 이동)

### Phase 1: 분석 (Analyst)
**실행 모드:** 서브 에이전트

1. Analyst 에이전트를 호출하여 사용자 요청을 분석한다
2. Analyst는 코드베이스를 탐색하고 `_workspace/01_analyst_plan.md`에 구현 계획을 작성한다
3. 프론트엔드/백엔드 각각의 작업 항목과 의존 순서를 명확히 분리한다

### Phase 2: 구현 (Frontend Builder + Backend Builder)
**실행 모드:** 에이전트 팀 (팬아웃/팬인)

1. Analyst의 계획서를 기반으로 두 빌더를 동시에 호출한다
2. **의존 순서 판단:**
   - 백엔드 먼저 필요 (새 API 엔드포인트): Backend Builder → Frontend Builder
   - 프론트만 변경 (UI 개선): Frontend Builder만 호출
   - 병렬 가능: 두 빌더를 에이전트 팀으로 동시 실행, API shape은 메시지로 교환
3. 각 빌더는 완료 후 변경 내역 문서를 `_workspace/`에 작성한다

### Phase 3: 검증 (QA Engineer)
**실행 모드:** 서브 에이전트

1. QA Engineer를 호출하여 빌더들의 산출물을 검증한다
2. 빌드 테스트를 실행한다:
   - `cd back && npm run build`
   - `cd client_front && npm run build`
3. 경계면 교차 비교를 수행한다 (API 응답 ↔ 프론트 인터페이스)
4. 검증 결과를 `_workspace/03_qa_report.md`에 기록한다
5. **버그 발견 시:** 해당 빌더에게 수정 요청 → 수정 후 재검증 (최대 2회 반복)

### Phase 4: 배포 및 보고

1. QA 통과 후 Git 커밋·푸시를 수행한다
   - 커밋 메시지는 한국어, Conventional Commit 포맷
2. 필요 시 Vercel 배포를 실행한다
   - Backend: `cd back && npx vercel --prod --yes`
   - Frontend: `cd client_front && npx vercel --prod --yes`
3. 사용자에게 변경 내용을 한국어로 요약 보고한다

## 데이터 전달 프로토콜

| 단계 | 출발 | 도착 | 전달 방식 | 전달 내용 |
|------|------|------|-----------|-----------|
| Phase 1→2 | Analyst | Builders | 파일 기반 | `_workspace/01_analyst_plan.md` |
| Phase 2 내 | Builders 상호 | 메시지 기반 | API 응답 TypeScript 인터페이스 |
| Phase 2→3 | Builders | QA | 파일 기반 | `_workspace/02_*_changes.md` |
| Phase 3→2 | QA | Builders | 메시지 기반 | 버그 수정 요청 (코드 인용 + 수정 제안) |
| Phase 3→4 | QA | Orchestrator | 파일 기반 | `_workspace/03_qa_report.md` |

## 에러 핸들링

| 에러 유형 | 전략 |
|-----------|------|
| Analyst 분석 실패 | 사용자에게 요청 명확화 요청 |
| Builder 빌드 에러 | 에러 로그를 QA에게 전달, QA가 원인 분석 후 수정 지시 |
| QA 검증 실패 (반복) | 2회 수정 반복 후에도 실패 시, 실패 항목을 사용자에게 보고하고 판단 위임 |
| 배포 실패 | 에러 로그를 분석하여 자동 수정 1회 시도, 실패 시 사용자에게 보고 |

## 테스트 시나리오

### 정상 흐름
```
사용자: "모임 상세 페이지를 만들어줘"
→ Analyst: 영향 파일 분석 (back/src/meetups/, client_front/src/app/meetups/[id]/)
→ Backend Builder: GET /api/meetups/:id 엔드포인트 구현
→ Frontend Builder: meetups/[id]/page.tsx 페이지 구현
→ QA: 빌드 성공, API shape 일치 확인
→ 배포 + 보고
```

### 에러 흐름
```
사용자: "새로운 '갤러리' 기능을 추가해줘"
→ Analyst: 새 모듈 필요 판단 (Gallery module)
→ Backend Builder: GalleryModule 생성 (app.module.ts 등록 누락!)
→ QA: npm run build 실패 → "UnknownDependenciesException" 감지
→ QA → Backend Builder: "app.module.ts에 GalleryModule import 누락" 수정 요청
→ Backend Builder: 수정
→ QA: 재검증 통과
→ 배포 + 보고
```
