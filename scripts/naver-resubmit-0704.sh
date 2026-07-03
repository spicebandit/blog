#!/bin/bash
# 일회성: 0704 발행 2건을 네이버 수집요청 재등록 (draft 상태(404)에서 먼저 요청됐던 것 재크롤 유도)
# 실행 후 자기 자신(plist)을 제거한다. 스크립트 파일은 커밋 이력용으로 남김.
set -uo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
REPO="$HOME/projects/blog"
LABEL="com.gogumi.blog.naverresubmit0704"
PLIST="$HOME/Library/LaunchAgents/${LABEL}.plist"
notify(){ node "$REPO/scripts/notify-telegram.mjs" "$1" >/dev/null 2>&1 || true; }

RES="$(osascript <<'EOF' 2>&1
set siteParam to "https://searchadvisor.naver.com/console/site/request/crawl?site=https%3A%2F%2Fwww.baseload.co.kr"
set urls to {"https://www.baseload.co.kr/blog/2026-07-03-local-llm-iphone-guide/", "https://www.baseload.co.kr/blog/2026-07-03-hyman-minsky-model-korea-2026/"}
tell application "Safari"
  activate
  make new document with properties {URL:siteParam}
  delay 6
  set pageURL to (URL of front document)
  if pageURL contains "nid.naver.com" then
    close front document
    return "LOGIN_EXPIRED"
  end if
  repeat with u in urls
    set fillJS to "(function(){var inp=[].slice.call(document.querySelectorAll('input[type=text]')).filter(function(i){return i.offsetParent!==null;})[0];if(!inp)return 'no';inp.focus();inp.select();document.execCommand('selectAll');document.execCommand('delete');document.execCommand('insertText',false,'" & u & "');return 'ok';})();"
    do JavaScript fillJS in front document
    delay 1
    do JavaScript "(function(){var b=[].slice.call(document.querySelectorAll('button')).filter(function(x){return x.offsetParent!==null && /확인/.test((x.textContent||'').trim());})[0];if(b)b.click();})();" in front document
    delay 3
  end repeat
  close front document
  return "SUBMITTED"
end tell
EOF
)"

if [ "$RES" = "SUBMITTED" ]; then
  notify "✅ 네이버 수집 재요청 완료 — 0704 발행 2건 (아이폰 LLM, 민스키)"
else
  notify "⚠️ 네이버 수집 재요청 실패(${RES}) — 수동 확인 필요 (서치어드바이저 → 웹페이지 수집)"
fi

launchctl bootout "gui/$(id -u)/${LABEL}" 2>/dev/null || launchctl unload "$PLIST" 2>/dev/null || true
rm -f "$PLIST"
exit 0
