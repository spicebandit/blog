#!/bin/bash
# 네이버 수집요청 자동 재시도 (로컬 사파리 세션). launchd가 매일 1회 호출.
# 남은 핵심 URL을 한도 회복분만큼 요청하고, 전부 완료되면 자기 자신(launchd)을 제거한다.
set -uo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
REPO="$HOME/projects/blog"; cd "$REPO" || exit 1
LABEL="com.gogumi.blog.navercrawl"
PLIST="$HOME/Library/LaunchAgents/${LABEL}.plist"
notify(){ node "$REPO/scripts/notify-telegram.mjs" "$1" >/dev/null 2>&1 || true; }
selfremove(){ launchctl bootout "gui/$(id -u)/${LABEL}" 2>/dev/null || launchctl unload "$PLIST" 2>/dev/null || true; rm -f "$PLIST"; }

RES="$(osascript "$REPO/scripts/naver-crawl-request.applescript" 2>&1)"
HEAD="${RES%%|*}"

case "$HEAD" in
  LOGIN_EXPIRED)
    notify "🔶 네이버 수집요청 자동재시도: 사파리에서 서치어드바이저 로그인이 만료됐습니다. 재로그인 후 다시 시도됩니다(작업은 유지)." ;;
  DONE*)
    notify "✅ 네이버 수집요청 자동재시도 완료 — 목표 URL 전부 요청됨. 자동작업을 종료합니다.
${RES}"
    selfremove ;;
  PROGRESS*)
    notify "🔄 네이버 수집요청 자동재시도: 일부 추가 요청 성공. 남은 URL은 한도 회복 시 내일 다시 시도합니다.
${RES}" ;;
  *)
    notify "⚠️ 네이버 수집요청 자동재시도: 예기치 못한 결과 — 수동 확인 필요.
${RES}" ;;
esac
exit 0
