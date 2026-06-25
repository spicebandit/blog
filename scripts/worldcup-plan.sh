#!/bin/bash
#
# 월드컵 플래너 — 매일 06:00(KST) + 부팅/로그인 시 발화하는 launchd 잡이 호출.
#   1) 틱 1회 실행: 밤사이 끝난 경기 catch-up 반영 + 오늘 일정(logs/worldcup-today.json) 생성
#   2) 그 일정으로 동적 업데이터(...update) 잡을 '경기 종료시각마다 발화'하도록 재예약
#
# 즉, 폴링 없이 "오늘 경기 종료시각에만" 업데이터가 깨어난다. 플래너는 매일 한 번
# 스케줄을 다시 깔아주는 자가복구 하트비트 역할도 한다.
#
# 수동 실행: bash scripts/worldcup-plan.sh

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT" || exit 1

LOG_FILE="$PROJECT_ROOT/logs/worldcup-update.log"
PLAN_PLIST="$HOME/Library/LaunchAgents/com.gogumi.blog.worldcup.plan.plist"
TS="$(date '+%Y-%m-%d %H:%M:%S')"

export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1 || true
fi

echo "===== [$TS] 월드컵 플래너 시작 =====" >> "$LOG_FILE"

# 1) 틱(catch-up 반영 + 오늘 일정 JSON 생성). 종료일이면 tick이 두 잡을 해제하고 끝낸다.
bash "$SCRIPT_DIR/worldcup-tick.sh"

# 종료일 이후라 플래너 plist가 제거됐으면 스케줄 빌드 생략
if [ ! -f "$PLAN_PLIST" ]; then
  echo "[$TS] 종료 처리됨 — 스케줄 빌드 생략" >> "$LOG_FILE"
  exit 0
fi

# 2) 오늘 경기 종료시각으로 업데이터 재예약
node "$SCRIPT_DIR/worldcup-build-schedule.mjs" >> "$LOG_FILE" 2>&1

echo "===== [$TS] 월드컵 플래너 종료 =====" >> "$LOG_FILE"
