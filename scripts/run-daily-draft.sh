#!/bin/bash
#
# launchd가 매일 호출하는 래퍼 스크립트.
#   1) 블로그 폴더로 이동
#   2) node scripts/daily-draft.mjs 실행 (글감 선정 + 텔레그램 알림)
#   3) 실행 로그를 logs/daily-draft.log 에 타임스탬프와 함께 append
#
# 놓친 실행 따라잡기(catch-up):
#   plist는 StartCalendarInterval(매일 07:30)과 RunAtLoad(부팅/로그인 시)를 둘 다 트리거한다.
#   - 자는 중 07:30이 지나갔으면 깨어날 때 StartCalendarInterval이 밀린 실행을 1회 발화한다.
#   - 07:30에 꺼져 있었으면, 다음 부팅/로그인 때 RunAtLoad가 따라잡는다.
#   하루 1회만 실제 실행되도록 아래 '오늘 이미 실행했는지' 가드로 중복을 막는다.
#   (07:30 이전이면 너무 이른 실행이므로 건너뛰고 정규 시각을 기다린다.)
#
# 수동 실행:        bash scripts/run-daily-draft.sh
# 가드 무시 강제실행: FORCE=1 bash scripts/run-daily-draft.sh   (테스트용)

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT" || exit 1

LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/daily-draft.log"
STATE_FILE="$LOG_DIR/.last-run"
mkdir -p "$LOG_DIR"

TS="$(date '+%Y-%m-%d %H:%M:%S')"
TODAY="$(date '+%Y-%m-%d')"
NOW_HM="$(date '+%H%M')"          # 예: 0730
TARGET_HM=730                     # 07:30 (10진수 비교용, 앞 0 제거)

# ---- 따라잡기 가드 (FORCE=1 이면 무시) ----
if [ "${FORCE:-0}" != "1" ]; then
  # 1) 오늘 이미 실행했으면 스킵
  if [ -f "$STATE_FILE" ] && [ "$(cat "$STATE_FILE" 2>/dev/null)" = "$TODAY" ]; then
    echo "[$TS] 오늘($TODAY) 이미 실행됨 — 스킵" >> "$LOG_FILE"
    exit 0
  fi
  # 2) 정규 시각(07:30) 이전이면 너무 이른 실행 — 스킵하고 대기
  if [ "$((10#$NOW_HM))" -lt "$TARGET_HM" ]; then
    echo "[$TS] 정규 시각(07:30) 이전 — 스킵하고 대기" >> "$LOG_FILE"
    exit 0
  fi
fi

# launchd 환경은 PATH가 빈약하므로 node 경로를 보강 (homebrew / nvm 등 흔한 위치)
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1 || true
fi
NODE_BIN="$(command -v node || true)"

{
  echo "===== [$TS] run-daily-draft 시작 ====="
  if [ -z "$NODE_BIN" ]; then
    echo "[$TS] ERROR: node 를 찾을 수 없습니다. PATH=$PATH"
  else
    echo "[$TS] node: $NODE_BIN ($("$NODE_BIN" --version 2>/dev/null))"
    "$NODE_BIN" scripts/daily-draft.mjs
    rc=$?
    echo "[$TS] daily-draft.mjs 종료코드: $rc"
    # 성공/실패와 무관하게 '오늘 실행함' 기록 (중복 발화 방지)
    echo "$TODAY" > "$STATE_FILE"
  fi
  echo "===== [$TS] run-daily-draft 종료 ====="
  echo ""
} >> "$LOG_FILE" 2>&1
