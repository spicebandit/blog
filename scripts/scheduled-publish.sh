#!/bin/bash
# 예약 발행(공용). launchd가 인자로 배치 태그(0627/0628/0629...)를 넘기면
# 해당 배치의 draft 글들을 발행(draft 제거 + pubDate 조정 → 빌드 → 커밋·푸시 → 옵시디언 → 텔레그램)하고
# 자기 자신(그 배치의 plist)만 제거한다(공용 스크립트는 남김).
set -uo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
REPO="$HOME/projects/blog"; cd "$REPO" || exit 1
TAG="${1:-}"
PLIST="$HOME/Library/LaunchAgents/com.gogumi.blog.publish${TAG}.plist"
D="src/content/blog"
notify(){ node "$REPO/scripts/notify-telegram.mjs" "$1" >/dev/null 2>&1 || true; }
cleanup(){ launchctl bootout "gui/$(id -u)/com.gogumi.blog.publish${TAG}" 2>/dev/null || launchctl unload "$PLIST" 2>/dev/null || true; rm -f "$PLIST"; }
fail(){ notify "⚠️ 예약발행(${TAG}) 실패: $1 — 수동 확인 필요"; exit 1; }

case "$TAG" in
  0627) ITEMS=(
    "$D/2026-06-26-multi-ai-strategy.md|2026-06-27T08:00:00+09:00"
    "$D/2026-06-26-power-settlement-manual-2-capacity-payment.md|2026-06-27T08:30:00+09:00"
    "$D/2026-06-22-korea-nuclear-sites-yeongdeok-gijang-smr.md|2026-06-27T09:00:00+09:00"
  );;
  0628) ITEMS=(
    "$D/2026-06-26-power-settlement-manual-3-settlement-coefficient.md|2026-06-28T08:00:00+09:00"
  );;
  0629) ITEMS=(
    "$D/2026-06-26-power-settlement-manual-4-coefficient-outlook.md|2026-06-29T08:00:00+09:00"
  );;
  *) fail "알 수 없는 배치 태그: '$TAG'";;
esac

changed=0; files=()
for it in "${ITEMS[@]}"; do
  f="${it%%|*}"; nd="${it##*|}"
  [ -f "$f" ] || fail "파일 없음: $f"
  files+=("$f")
  if grep -q "^draft: true" "$f"; then
    sed -i '' '/^draft: true$/d' "$f"
    sed -i '' "s|^pubDate:.*|pubDate: $nd|" "$f"
    changed=$((changed+1))
  fi
done

if [ "$changed" -eq 0 ]; then notify "ℹ️ 예약발행(${TAG}): 이미 발행 상태라 변경 없이 종료"; cleanup; exit 0; fi

if ! npm run build >/tmp/publish-${TAG}.log 2>&1; then
  git checkout -- "${files[@]}" 2>/dev/null || true
  fail "빌드 실패(롤백함). 로그 /tmp/publish-${TAG}.log"
fi

git add "${files[@]}"
git commit -q -m "post: 예약발행 ${TAG} (${#files[@]}건)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" || fail "커밋 실패"
git push origin main >/tmp/publish-${TAG}-push.log 2>&1 || fail "push 실패. 로그 /tmp/publish-${TAG}-push.log"
node "$REPO/scripts/sync-to-obsidian.mjs" >/dev/null 2>&1 || true

list=$(printf '• %s\n' "${files[@]##*/}")
notify "✅ 예약발행 완료(${TAG}) — ${changed}건
${list}빌드 통과 → push(Vercel 배포). 옵시디언 동기화 완료."
cleanup
exit 0
