#!/bin/bash
#
# launchd가 12시간마다 호출하는 래퍼 — 버니 샌더스 숏츠 1개를 자동 발행한다.
#   1) 12시간 가드(중복 발화 방지: RunAtLoad + StartCalendarInterval 둘 다 트리거되므로)
#   2) claude -p 로 CLAUDE.md의 버니 아카이브 절차를 1회 실행
#      (번역·글 작성·git push·텔레그램 알림까지 claude가 수행)
#
# 수동 실행:        bash scripts/run-bernie.sh
# 가드 무시 강제실행: FORCE=1 bash scripts/run-bernie.sh

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT" || exit 1

LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/bernie.log"
STATE_FILE="$LOG_DIR/.bernie-last-run"   # 마지막 실행 epoch(초)
mkdir -p "$LOG_DIR"

TS="$(date '+%Y-%m-%d %H:%M:%S')"
NOW="$(date '+%s')"
MIN_GAP=$((11 * 3600))   # 최소 11시간 간격(12시간 스케줄의 중복 발화 방지)

# ---- 12시간 가드 ----
if [ "${FORCE:-0}" != "1" ] && [ -f "$STATE_FILE" ]; then
  LAST="$(cat "$STATE_FILE" 2>/dev/null || echo 0)"
  if [ -n "$LAST" ] && [ "$((NOW - LAST))" -lt "$MIN_GAP" ]; then
    echo "[$TS] 직전 실행 후 11시간 미만 — 스킵" >> "$LOG_FILE"
    exit 0
  fi
fi

# launchd 환경 PATH 보강 (node / claude / python3)
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$HOME/Library/Python/3.14/bin:$PATH"
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1 || true
fi

CLAUDE_BIN="$(command -v claude || true)"
PROMPT_FILE="$PROJECT_ROOT/scripts/bernie-prompt.txt"

{
  echo "===== [$TS] run-bernie 시작 ====="
  if [ -z "$CLAUDE_BIN" ]; then
    echo "[$TS] ERROR: claude CLI 를 찾을 수 없습니다. PATH=$PATH"
  elif [ ! -f "$PROMPT_FILE" ]; then
    echo "[$TS] ERROR: 프롬프트 파일 없음: $PROMPT_FILE"
  else
    echo "[$TS] claude: $CLAUDE_BIN"
    # 무인 실행이므로 권한 프롬프트 없이 진행. 이 잡은 버니 발행 한 가지만 수행한다.
    "$CLAUDE_BIN" -p "$(cat "$PROMPT_FILE")" --dangerously-skip-permissions
    rc=$?
    echo "[$TS] claude 종료코드: $rc"
    echo "$NOW" > "$STATE_FILE"
  fi
  echo "===== [$TS] run-bernie 종료 ====="
  echo ""
} >> "$LOG_FILE" 2>&1
