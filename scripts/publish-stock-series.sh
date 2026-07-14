#!/bin/bash
# 주식투자 에이전트 시리즈 자동 발행기 (하루 한 편).
# 매 실행마다: 아직 draft인 첫 편의 draft 줄을 지워 발행 → 커밋 → push → 텔레그램 알림.
# 4편이 모두 발행되면 스스로 launchd 등록을 해제한다(1회성 종료).
set -u

PROJECT="$HOME/projects/blog"
NODE="/opt/homebrew/bin/node"
LABEL="com.gogumi.blog.stockseries"
PLIST="$HOME/Library/LaunchAgents/${LABEL}.plist"
LOG="$PROJECT/logs/stock-series.log"

cd "$PROJECT" || exit 1

SLUGS=(claude-code-stock-agent-1-design claude-code-stock-agent-2-kis-api claude-code-stock-agent-3-analysts claude-code-stock-agent-4-trade-safety claude-code-stock-agent-5-operations)
TITLES=("① 목적과 설계" "② 한국투자증권 API 연결" "③ 분석가 3명의 두뇌" "④ 매매와 안전장치" "⑤ 운영 자동화")

published=""
URL=""
for i in "${!SLUGS[@]}"; do
  f="src/content/blog/${SLUGS[$i]}.md"
  if grep -q '^draft: true' "$f" 2>/dev/null; then
    sed -i '' '/^draft: true$/d' "$f"          # draft 줄 제거 = 발행
    git add "$f"
    git commit -m "post: 주식투자 에이전트 시리즈 ${TITLES[$i]} 발행" >> "$LOG" 2>&1
    git push >> "$LOG" 2>&1
    published="${TITLES[$i]}"
    URL="https://blog-x84m.vercel.app/blog/${SLUGS[$i]}/"
    break
  fi
done

# 남은 draft 편수
remain=0
for s in "${SLUGS[@]}"; do
  grep -q '^draft: true' "src/content/blog/${s}.md" 2>/dev/null && remain=$((remain+1))
done

if [ -n "$published" ]; then
  "$NODE" "$PROJECT/scripts/notify-telegram.mjs" "📝 주식투자 에이전트 시리즈 ${published} 발행 완료
${URL}
남은 예약 발행: ${remain}편" >> "$LOG" 2>&1
fi

# 전부 발행됐으면 launchd 해제(다시 발화하지 않음)
if [ "$remain" -eq 0 ]; then
  rm -f "$PLIST"
  launchctl bootout "gui/$(id -u)/${LABEL}" 2>/dev/null
fi
