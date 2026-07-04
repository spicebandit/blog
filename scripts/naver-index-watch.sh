#!/bin/bash
# 네이버 사이트 진단 '색인' 수 일일 추적 (로컬 사파리 세션).
# 값이 바뀌면 텔레그램 알림, 같으면 조용히 종료. 로그인 만료 시 1회 알림.
set -uo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
REPO="$HOME/projects/blog"
STATE="$REPO/.naver-index-last"
notify(){ node "$REPO/scripts/notify-telegram.mjs" "$1" >/dev/null 2>&1 || true; }

RES="$(osascript <<'EOF' 2>&1
tell application "Safari"
  activate
  make new document with properties {URL:"https://searchadvisor.naver.com/console/site/report/diagnosis?site=https%3A%2F%2Fwww.baseload.co.kr"}
  delay 8
  set pt to do JavaScript "document.title" in front document
  if pt contains "로그인" then
    close front document
    return "LOGIN_EXPIRED"
  end if
  set v to do JavaScript "(function(){var m=document.body.innerText.match(/색인[^0-9]*([0-9,]+)/);var u=document.body.innerText.match(/최근 업데이트[^0-9]*([0-9.]+)/);return (m?m[1]:'?')+'|'+(u?u[1]:'?');})();" in front document
  close front document
  return "OK|" & v
end tell
EOF
)"

case "$RES" in
  LOGIN_EXPIRED)
    notify "🔶 네이버 색인 추적: 사파리 네이버 로그인 만료 — 재로그인 필요합니다." ;;
  OK\|*)
    VAL="${RES#OK|}"; IDX="${VAL%%|*}"; UPD="${VAL##*|}"
    LAST="$(cat "$STATE" 2>/dev/null || echo '')"
    if [ "$IDX" != "$LAST" ]; then
      echo "$IDX" > "$STATE"
      if [ -n "$LAST" ]; then
        notify "📈 네이버 색인 변화: ${LAST} → ${IDX} 페이지 (진단 업데이트 ${UPD} 기준)"
      fi
    fi ;;
  *)
    : ;; # 일시 오류는 조용히 넘어감 (다음 날 재시도)
esac
exit 0
