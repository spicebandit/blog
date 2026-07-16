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
  0703) ITEMS=(
    "$D/2026-07-02-local-llm-beginner-guide.md|2026-07-03T08:00:00+09:00"
    "$D/2026-07-02-sodium-ion-battery-outlook.md|2026-07-03T08:30:00+09:00"
  );;
  0704) ITEMS=(
    "$D/2026-07-03-local-llm-iphone-guide.md|2026-07-04T08:00:00+09:00"
    "src/content/blog-en/2026-07-03-local-llm-iphone-guide.md|2026-07-04T08:00:00+09:00"
    "$D/2026-07-03-hyman-minsky-model-korea-2026.md|2026-07-04T08:30:00+09:00"
    "$D/2026-07-03-tesla-fsd-korea-timeline.md|2026-07-04T09:00:00+09:00"
    "src/content/blog-en/2026-07-03-tesla-fsd-korea-timeline.md|2026-07-04T09:00:00+09:00"
  );;
  0705) ITEMS=(
    "$D/2026-07-04-lmp-rollout-progress-2026h2.md|2026-07-05T08:00:00+09:00"
  );;
  0706) ITEMS=(
    "$D/2026-07-05-paperclip-ai-agent-company-guide.md|2026-07-06T08:00:00+09:00"
    "src/content/blog-en/2026-07-05-paperclip-ai-agent-company-guide.md|2026-07-06T08:00:00+09:00"
    "$D/2026-07-05-claude-sonnet5-ai-agent-era.md|2026-07-06T08:30:00+09:00"
    "src/content/blog-en/2026-07-05-claude-sonnet5-ai-agent-era.md|2026-07-06T08:30:00+09:00"
    "$D/2026-07-05-samsung-q2-earnings-preview-july-7.md|2026-07-06T09:00:00+09:00"
    "$D/2026-07-06-supabase-beginner-guide.md|2026-07-06T09:30:00+09:00"
    "src/content/blog-en/2026-07-06-supabase-beginner-guide.md|2026-07-06T09:30:00+09:00"
  );;
  0707) ITEMS=(
    "$D/2026-07-06-stock-agent-trading-strategies-benchmark.md|2026-07-07T08:30:00+09:00"
    "src/content/blog-en/2026-07-06-stock-agent-trading-strategies-benchmark.md|2026-07-07T08:30:00+09:00"
    "$D/2026-07-07-toss-securities-open-api-guide.md|2026-07-07T09:00:00+09:00"
    "src/content/blog-en/2026-07-07-toss-securities-open-api-guide.md|2026-07-07T09:00:00+09:00"
    "$D/2026-07-07-rtx5090-ollama-local-llm-parameters.md|2026-07-07T09:30:00+09:00"
    "src/content/blog-en/2026-07-07-rtx5090-ollama-local-llm-parameters.md|2026-07-07T09:30:00+09:00"
    "$D/2026-07-07-korea-corporate-bond-issuance-timing-2026h2.md|2026-07-07T10:00:00+09:00"
  );;
  0708) ITEMS=(
    "$D/2026-07-05-paperclip-ai-newsroom-operations.md|2026-07-08T08:00:00+09:00"
    "src/content/blog-en/2026-07-05-paperclip-ai-newsroom-operations.md|2026-07-08T08:00:00+09:00"
    "$D/2026-07-08-macbook-local-llm-by-model.md|2026-07-08T08:30:00+09:00"
    "src/content/blog-en/2026-07-08-macbook-local-llm-by-model.md|2026-07-08T08:30:00+09:00"
    "$D/2026-07-07-rtx5090-ollama-local-llm-parameters.md|2026-07-08T09:00:00+09:00"
    "src/content/blog-en/2026-07-07-rtx5090-ollama-local-llm-parameters.md|2026-07-08T09:00:00+09:00"
    "$D/2026-07-08-doosan-enerbility-gas-turbine.md|2026-07-08T09:30:00+09:00"
  );;
  0713) ITEMS=(
    "$D/ai-agent-harness-engineering.md|2026-07-13T00:05:00+09:00"
    "src/content/blog-en/ai-agent-harness-engineering.md|2026-07-13T00:05:00+09:00"
  );;
  0715) ITEMS=(
    "$D/2026-07-15-mirofish-ai-prediction-engine-1-concept.md|2026-07-15T00:05:00+09:00"
    "src/content/blog-en/2026-07-15-mirofish-ai-prediction-engine-1-concept.md|2026-07-15T00:05:00+09:00"
  );;
  0717) ITEMS=(
    "$D/2026-07-17-mirofish-ai-prediction-engine-3-beginner.md|2026-07-17T00:05:00+09:00"
    "src/content/blog-en/2026-07-17-mirofish-ai-prediction-engine-3-beginner.md|2026-07-17T00:05:00+09:00"
  );;
  0718) ITEMS=(
    "$D/2026-07-18-mirofish-ai-prediction-engine-4-scaling.md|2026-07-18T00:05:00+09:00"
    "src/content/blog-en/2026-07-18-mirofish-ai-prediction-engine-4-scaling.md|2026-07-18T00:05:00+09:00"
  );;
  *) fail "알 수 없는 배치 태그: '$TAG'";;
esac

changed=0; files=()
for it in "${ITEMS[@]}"; do
  f="${it%%|*}"; spec="${it##*|}"
  # 발행일 = 스크립트가 실제로 도는 날(작성일·예정일 아님). 시각(HH:MM:SS)만 스펙에서 가져와 같은 날 정렬 순서를 유지.
  timepart="${spec#*T}"                       # 예: 08:30:00+09:00
  [ "$timepart" = "$spec" ] && timepart="09:00:00+09:00"
  nd="$(date +%Y-%m-%d)T${timepart}"
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

# IndexNow: 발행 URL(한/영)을 Bing·Yandex·네이버(참여 검색엔진)에 즉시 색인 통보.
indexnow_urls=()
for f in "${files[@]}"; do
  slug="$(basename "$f" .md)"
  case "$f" in
    *src/content/blog-en/*) indexnow_urls+=("https://www.baseload.co.kr/en/blog/${slug}/") ;;
    *src/content/blog/*)    indexnow_urls+=("https://www.baseload.co.kr/blog/${slug}/") ;;
  esac
done
indexnow_msg=""
if [ "${#indexnow_urls[@]}" -gt 0 ]; then
  if node "$REPO/scripts/indexnow-ping.mjs" "${indexnow_urls[@]}" >/tmp/indexnow-${TAG}.log 2>&1; then
    indexnow_msg="IndexNow(Bing 등) ${#indexnow_urls[@]}건 통보."
  else
    indexnow_msg="⚠️ IndexNow 통보 확인 필요(로그 /tmp/indexnow-${TAG}.log)."
  fi
fi

# 네이버 자동 수집요청: 방금 발행한 한글 글(blog-en 제외)의 라이브 URL을 서치어드바이저에 등록.
# 사파리 로그인 세션에 의존하므로 실패해도 비치명(발행 자체는 이미 완료). 결과는 아래 알림에 합산.
naver_urls=()
for f in "${files[@]}"; do
  case "$f" in
    *src/content/blog/*) slug="$(basename "$f" .md)"; naver_urls+=("https://www.baseload.co.kr/blog/${slug}/") ;;
  esac
done
naver_msg=""
if [ "${#naver_urls[@]}" -gt 0 ]; then
  nres="$(osascript "$REPO/scripts/naver-bulk-submit.applescript" "${naver_urls[@]}" 2>&1)"
  case "$nres" in
    SUBMITTED*) naver_msg="네이버 수집요청 ${#naver_urls[@]}건 등록." ;;
    LOGIN_EXPIRED) naver_msg="⚠️ 네이버 수집요청 실패(사파리 로그인 만료) — 수동 등록 필요." ;;
    *) naver_msg="⚠️ 네이버 수집요청 확인 필요: ${nres}" ;;
  esac
fi

list=$(printf '• %s\n' "${files[@]##*/}")
notify "✅ 예약발행 완료(${TAG}) — ${changed}건
${list}빌드 통과 → push(Vercel 배포). 옵시디언 동기화 완료.
${indexnow_msg}
${naver_msg}"
cleanup
exit 0
