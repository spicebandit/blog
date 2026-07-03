#!/bin/bash
# 일회성: feat/hreflang 브랜치를 새벽 4시에 main에 머지·배포 (2026-07-03 사용자 지시 — "내일 새벽 4시에 해줘")
# 실행 후 자기 자신(plist)을 제거한다.
set -uo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
REPO="$HOME/projects/blog"; cd "$REPO" || exit 1
LABEL="com.gogumi.blog.hreflang0400"
PLIST="$HOME/Library/LaunchAgents/${LABEL}.plist"
notify(){ node "$REPO/scripts/notify-telegram.mjs" "$1" >/dev/null 2>&1 || true; }
selfremove(){ launchctl bootout "gui/$(id -u)/${LABEL}" 2>/dev/null || launchctl unload "$PLIST" 2>/dev/null || true; rm -f "$PLIST"; }
fail(){ git merge --abort 2>/dev/null || true; notify "⚠️ hreflang 새벽 배포 실패: $1 — 수동 확인 필요 (브랜치 feat/hreflang 보존됨)"; selfremove; exit 1; }

git fetch origin || fail "fetch 실패"
git checkout main || fail "checkout 실패"
git pull --rebase origin main || fail "pull 실패"
git merge --no-edit origin/feat/hreflang || fail "머지 실패"
npm run build >/tmp/hreflang-build.log 2>&1 || { git reset --hard origin/main; fail "빌드 실패 (롤백함, 로그 /tmp/hreflang-build.log)"; }
git push origin main >/tmp/hreflang-push.log 2>&1 || fail "push 실패"
git push origin --delete feat/hreflang 2>/dev/null || true
git branch -d feat/hreflang 2>/dev/null || true

notify "✅ hreflang 상호선언 배포 완료 (새벽 4시 예약분) — 한↔영 페이지가 alternate 태그로 연결됐습니다. 구글 재크롤 후 영문 노출 개선 여부는 서치콘솔에서 1~2주 추적."
selfremove
exit 0
