# Harness Hub (하네스 허브) 프로젝트 인계 가이드

> 👋 **다음 AI 에이전트(Claude, Cursor 등)에게 드리는 인사**
> 
> 안녕하세요! 이 문서를 읽고 계신다면, 당신은 완성된 'OlaLab' 보일러플레이트를 기반으로 **'Harness Hub(하네스 허브)'**라는 새로운 하네스 마켓플레이스 프로젝트를 셋업하는 임무를 맡으셨습니다. 
> 
> 이 문서는 Ola 프로젝트의 유산을 빠르고 정확하게 Harness Hub로 변환하기 위한 마이그레이션 및 셋업 가이드입니다.

---

## 1. 프로젝트 개요 (Project Overview)
* **기존 프로젝트(OlaLab):** AI 도구 큐레이션 및 커뮤니티 플랫폼
* **새 프로젝트(Harness Hub):** 하네스(Harness) 상품 마켓플레이스 및 스토어 플랫폼
* **목표:** 기존의 Next.js(Client) / NestJS(API) / React(Admin) 모노레포 구조와 Prisma 설정을 그대로 유지하되, 비즈니스 도메인을 커뮤니티에서 **커머스(마켓)**로 변경합니다.

---

## 2. 프로젝트 초기화 스크립트 실행 (Initialization)
동봉된 `init_harness_hub.sh` 스크립트를 실행하면 기존 프로젝트를 바탕으로 깨끗한 `harness_hub` 프로젝트 폴더가 생성됩니다.

```bash
cd template
chmod +x init_harness_hub.sh
./init_harness_hub.sh
```
*주의: 이 스크립트는 `node_modules`나 `.git` 등 무거운 히스토리를 빼고 순수 코드만 복사합니다.*

---

## 3. 도메인 용어 마이그레이션 (Renaming Guide)
복사된 코드 내에서 다음 키워드들을 프로젝트 성격에 맞게 일괄 치환(Find & Replace) 해주세요.

| 기존 (OlaLab) | 변경 (Harness Hub) | 설명 |
|---|---|---|
| `OlaLab`, `ola` | `HarnessHub`, `harness` | 메인 타이틀 및 로고 텍스트 |
| `Tool` | `Product` 또는 `Harness` | 핵심 상품 엔티티 (AI 도구 -> 하네스 상품) |
| `Labs`, `Meetups` | `Market`, `Store` | 오프라인 실험실 -> 마켓플레이스 뷰 |
| 카테고리: 개발/마케팅 등 | 견종 사이즈(소형/대형), 재질 등 | 상품 카테고리로 변경 |

---

## 4. 데이터베이스 스키마 개조 (Database Schema)
마켓플레이스의 특성에 맞게 결제, 장바구니, 재고 개념이 추가되어야 합니다.
`template/HARNESS_DB_SCHEMA_DRAFT.prisma` 파일에 하네스 마켓용 DB 스키마 초안을 작성해 두었습니다. 
이 파일을 `back/prisma/schema.prisma`로 복사한 뒤, `npx prisma db push` (또는 `migrate dev`)를 실행하여 데이터베이스를 재구성하세요.

### 주요 추가된 모델:
- `Order` (주문 내역)
- `Review` (상품 리뷰)
- `CartItem` (장바구니)

---

## 5. UI/UX 디자인 테마 변경
하네스 마켓의 성격에 맞게 컬러 팔레트를 수정하세요.
- `client_front/tailwind.config.ts` 에서 `primary` 색상을 커머스에 어울리는 색상(예: 베이지, 테라코타, 파스텔 톤)으로 조정합니다.
- `client_front/src/components/HomeClient.tsx`에 있는 트렌딩 도구 섹션을 **"이번 주 인기 하네스 (Best Sellers)"** 로 변경하세요.

---
**Good Luck! 🚀 하네스 허브 프로젝트의 성공적인 런칭을 응원합니다.**
