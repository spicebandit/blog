#!/bin/bash
# 일회성: 네이버 수집요청 백로그 나머지 29건 등록 (2026-07-03 일일 한도초과분 이월)
# naver-bulk-submit.applescript에 URL들을 인자로 넘겨 제출하고, 자기 자신(plist)을 제거한다.
set -uo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
REPO="$HOME/projects/blog"
LABEL="com.gogumi.blog.naverbulk0704"
PLIST="$HOME/Library/LaunchAgents/${LABEL}.plist"
notify(){ node "$REPO/scripts/notify-telegram.mjs" "$1" >/dev/null 2>&1 || true; }

URLS=(
  "https://www.baseload.co.kr/blog/2026-06-12-solo-business-model-design/"
  "https://www.baseload.co.kr/blog/2026-06-18-how-to-check-claude-ai-server-status/"
  "https://www.baseload.co.kr/blog/2026-06-26-ot-security-resurgence-risk-cases/"
  "https://www.baseload.co.kr/blog/2026-06-26-power-settlement-manual-1-energy-smp/"
  "https://www.baseload.co.kr/blog/2026-06-26-power-settlement-manual-2-capacity-payment/"
  "https://www.baseload.co.kr/blog/2026-06-26-power-settlement-manual-3-settlement-coefficient/"
  "https://www.baseload.co.kr/blog/2026-06-26-power-settlement-manual-4-coefficient-outlook/"
  "https://www.baseload.co.kr/blog/2026-06-26-reading-recession-signals/"
  "https://www.baseload.co.kr/blog/2026-06-27-bok-july-rate-decision-inflation/"
  "https://www.baseload.co.kr/blog/2026-06-27-free-developer-apis-guide/"
  "https://www.baseload.co.kr/blog/2026-06-27-renewable-bidding-output-curtailment-2026/"
  "https://www.baseload.co.kr/blog/2026-06-29-hermes-agent-practical-use-cases/"
  "https://www.baseload.co.kr/blog/2026-06-29-weak-won-strong-exports-paradox/"
  "https://www.baseload.co.kr/blog/2026-world-cup-tracker/"
  "https://www.baseload.co.kr/blog/agentic-ai-delegation-era/"
  "https://www.baseload.co.kr/blog/agentic-ai-market-delegation/"
  "https://www.baseload.co.kr/blog/agentic-ai-organization-delegation/"
  "https://www.baseload.co.kr/blog/ai-agent-harness-engineering/"
  "https://www.baseload.co.kr/blog/boj-rate-hike-2026-outlook/"
  "https://www.baseload.co.kr/blog/claude-code-blog-automation-guide/"
  "https://www.baseload.co.kr/blog/claude-code-stock-agent-1-design/"
  "https://www.baseload.co.kr/blog/claude-code-stock-agent-3-analysts/"
  "https://www.baseload.co.kr/blog/claude-code-stock-agent-4-trade-safety/"
  "https://www.baseload.co.kr/blog/claude-code-stock-agent-5-operations/"
  "https://www.baseload.co.kr/blog/korea-lmp-regional-electricity-pricing-2026/"
  "https://www.baseload.co.kr/blog/korea-power-industry-2026-h2-outlook/"
  "https://www.baseload.co.kr/blog/materialism-and-the-poetry-of-life/"
  "https://www.baseload.co.kr/blog/oil-gas-price-outlook-iran-war-end/"
  "https://www.baseload.co.kr/blog/vscode-claude-code-usage-guide/"
)

RES="$(osascript "$REPO/scripts/naver-bulk-submit.applescript" "${URLS[@]}" 2>&1)"

case "$RES" in
  LOGIN_EXPIRED) notify "🔶 네이버 백로그 등록 실패: 사파리 네이버 로그인 만료 — 재로그인 필요 (잡은 제거됨, 수동 재실행: bash $REPO/scripts/naver-bulk-0704.sh)" ;;
  SUBMITTED*)    notify "✅ 네이버 수집요청 백로그 등록 — ${RES} (총 29건 제출, 서치어드바이저에서 확인 가능)" ;;
  *)             notify "⚠️ 네이버 백로그 등록 결과 불명(${RES}) — 수동 확인 필요" ;;
esac

launchctl bootout "gui/$(id -u)/${LABEL}" 2>/dev/null || launchctl unload "$PLIST" 2>/dev/null || true
rm -f "$PLIST"
exit 0
