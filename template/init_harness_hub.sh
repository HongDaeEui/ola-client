#!/bin/bash

# ==============================================================================
# Harness Hub Project Initialization Script
# Description: Copies the Ola project boilerplate to a new Harness Hub directory
#              while ignoring heavy folders like node_modules and .git.
# ==============================================================================

SOURCE_DIR=".."
TARGET_DIR="../../harness_hub"

echo "🚀 [1/4] 하네스 허브(Harness Hub) 프로젝트 초기화를 시작합니다..."

# 1. 새 디렉토리 생성
if [ -d "$TARGET_DIR" ]; then
  echo "⚠️ 경고: '$TARGET_DIR' 디렉토리가 이미 존재합니다."
  read -p "덮어쓰시겠습니까? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "취소되었습니다."
    exit 1
  fi
fi

mkdir -p "$TARGET_DIR"

echo "📂 [2/4] 핵심 파일 및 폴더를 복사하는 중... (node_modules, .git 등 제외)"

# rsync를 사용하여 불필요한 폴더 제외하고 복사
rsync -av --progress "$SOURCE_DIR/" "$TARGET_DIR/" \
  --exclude node_modules \
  --exclude .git \
  --exclude .next \
  --exclude dist \
  --exclude build \
  --exclude .DS_Store \
  --exclude template # 템플릿 폴더 자신은 제외

echo "⚙️ [3/4] 환경변수(.env) 초기화 중..."

# .env 파일 템플릿 복사 또는 빈 파일 생성
cp "$TARGET_DIR/back/.env.example" "$TARGET_DIR/back/.env" 2>/dev/null || touch "$TARGET_DIR/back/.env"
cp "$TARGET_DIR/client_front/.env.example" "$TARGET_DIR/client_front/.env.local" 2>/dev/null || touch "$TARGET_DIR/client_front/.env.local"

echo "📝 [4/4] 기본 텍스트 치환 준비 완료!"
echo "---------------------------------------------------"
echo "✅ 초기화가 완료되었습니다!"
echo "👉 다음 단계:"
echo "   1. 'cd ../../harness_hub' 로 이동하세요."
echo "   2. HARNESS_HUB_HANDOVER.md 지침에 따라 텍스트 치환 및 스키마 변경을 진행하세요."
echo "   3. 각 폴더(client_front, back, admin_front)에서 'npm install'을 실행하세요."
echo "---------------------------------------------------"
