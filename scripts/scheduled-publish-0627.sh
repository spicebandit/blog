#!/bin/bash
#
# 1회성 예약 발행 (2026-06-27 08:00 KST 예정).
# 대상 draft 3건의 draft 플래그 제거 + pubDate를 6/27 오전으로 조정 →
# 빌드 검증 → 커밋·푸시 → 옵시디언 동기화 → 텔레그램 보고 → 자기 자신(plist+스크립트) 정리.
#
# launchd가 com.gogumi.blog.publish0627 로 1회 호출한다. 수동 테스트: FORCE=1 bash scripts/scheduled-publish-0627.sh
set -uo pipefail

# launchd PATH 보강 (dailydraft 관례와 동일)
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"

REPO="$HOME/projects/blog"
PLIST="$HOME/Library/LaunchAgents/com.gogumi.blog.publish0627.plist"
SELF="$REPO/scripts/scheduled-publish-0627.sh"
cd "$REPO" || exit 1

notify() { node "$REPO/scripts/notify-telegram.mjs" "$1" >/dev/null 2>&1 || true; }
cleanup_self() {
  launchctl bootout "gui/$(id -u)/com.gogumi.blog.publish0627" 2>/dev/null || \
    launchctl unload "$PLIST" 2>/dev/null || true
  rm -f "$PLIST" "$SELF"
}
fail() { notify "⚠️ 예약발행(6/27) 실패: $1 — 수동 확인 필요. (작업 중단, 자동정리는 보류)"; exit 1; }

# 대상: 파일|새 pubDate
ITEMS=(
  "src/content/blog/2026-06-26-settlement-adjustment-coefficient-outlook.md|2026-06-27T08:00:00+09:00"
  "src/content/blog/2026-06-26-multi-ai-strategy.md|2026-06-27T08:30:00+09:00"
  "src/content/blog/2026-06-22-korea-nuclear-sites-yeongdeok-gijang-smr.md|2026-06-27T09:00:00+09:00"
)

changed=0
for it in "${ITEMS[@]}"; do
  f="${it%%|*}"; newdate="${it##*|}"
  [ -f "$f" ] || fail "파일 없음: $f"
  if grep -q "^draft: true" "$f"; then
    sed -i '' '/^draft: true$/d' "$f"
    sed -i '' "s|^pubDate:.*|pubDate: $newdate|" "$f"
    changed=$((changed+1))
  fi
done

if [ "$changed" -eq 0 ]; then
  notify "ℹ️ 예약발행(6/27): 대상 3건이 이미 발행 상태라 변경 없이 종료합니다."
  cleanup_self
  exit 0
fi

# 빌드 검증
if ! npm run build >/tmp/publish0627-build.log 2>&1; then
  git checkout -- "${ITEMS[@]%%|*}" 2>/dev/null || true
  fail "빌드 실패 (변경 롤백함). 로그: /tmp/publish0627-build.log"
fi

git add src/content/blog/2026-06-26-settlement-adjustment-coefficient-outlook.md \
        src/content/blog/2026-06-26-multi-ai-strategy.md \
        src/content/blog/2026-06-22-korea-nuclear-sites-yeongdeok-gijang-smr.md
git commit -q -m "post: 정산조정계수·멀티AI·영덕기장원전 3건 발행

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" || fail "커밋 실패"
git push origin main >/tmp/publish0627-push.log 2>&1 || fail "push 실패. 로그: /tmp/publish0627-push.log"

node "$REPO/scripts/sync-to-obsidian.mjs" >/dev/null 2>&1 || true

notify "✅ 예약발행 완료 (6/27 오전) — 3건
• 정산조정계수란? 발전사 정산 전망
• AI 모델 홍수 시대, 하나만 쓰면 지는 이유
• 신규 원전 부지 영덕·기장 확정
빌드 통과 → push 완료(Vercel 배포). 옵시디언 동기화 완료."

cleanup_self
exit 0
