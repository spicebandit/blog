#!/bin/bash
#
# launchd가 매일 오전 8시(KST) 호출하는 월드컵 트래커 자동 갱신 래퍼.
#   1) 종료일(결승 다음다음날) 이후면: 텔레그램으로 종료 알림 + 자기 자신(launchd) 해제 후 종료
#   2) 평소: headless Claude Code(claude -p)로 글 갱신 → 빌드 → push → 텔레그램 알림
#
# 종료 로직: 2026 월드컵 결승은 7/19. 7/20 오전 실행이 결승 결과를 반영하므로,
#            7/21부터는 자동 갱신을 끝내고 launchd 등록을 스스로 제거한다.
#
# catch-up: plist는 StartCalendarInterval(매일 08:00) + RunAtLoad(부팅/로그인)를 둘 다 둔다.
#           자는 중 08:00이 지났으면 깨어날 때 밀린 실행 1회, 08:00에 꺼져 있었으면 다음 로그인 때 따라잡는다.
#           '오늘 이미 실행' 가드로 중복을 막는다.
#
# 수동 실행:        bash scripts/run-worldcup-update.sh
# 가드 무시 강제실행: FORCE=1 bash scripts/run-worldcup-update.sh

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT" || exit 1

LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/worldcup-update.log"
STATE_FILE="$LOG_DIR/.worldcup-last-run"
mkdir -p "$LOG_DIR"

LABEL="com.gogumi.blog.worldcup"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
END_DATE=20260721    # 이 날짜(YYYYMMDD) 이상이면 자동 갱신 종료

TS="$(date '+%Y-%m-%d %H:%M:%S')"
TODAY="$(date '+%Y-%m-%d')"
TODAY_NUM="$(date '+%Y%m%d')"
NOW_HM="$(date '+%H%M')"
TARGET_HM=800        # 08:00

# launchd는 PATH가 빈약하므로 보강 (homebrew의 node/claude 위치 포함)
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1 || true
fi

# ───────────── 종료 조건: 결승 종료 후 자기 자신 해제 ─────────────
if [ "$TODAY_NUM" -ge "$END_DATE" ]; then
  {
    echo "===== [$TS] 월드컵 종료 — 자동 갱신 해제 ====="
  } >> "$LOG_FILE" 2>&1
  node scripts/notify-telegram.mjs "🏁 2026 미국 월드컵이 끝났습니다. 트래커 자동 갱신을 종료합니다. 그동안의 기록은 블로그에 그대로 남아 있어요: https://blog-x84m.vercel.app/blog/2026-world-cup-tracker/" >> "$LOG_FILE" 2>&1
  # 상단 공지(핀)는 빌드 시 until(7/21) 경과로 자동 숨김 → 마지막 재배포 1회를 유발해 공지를 내린다
  git commit --allow-empty -m "chore: 월드컵 종료 — 상단 공지 자동 해제" >> "$LOG_FILE" 2>&1 && git push >> "$LOG_FILE" 2>&1
  rm -f "$PLIST"
  launchctl bootout "gui/$(id -u)/$LABEL" >/dev/null 2>&1
  exit 0
fi

# ───────────── 따라잡기 가드 (FORCE=1 이면 무시) ─────────────
if [ "${FORCE:-0}" != "1" ]; then
  if [ -f "$STATE_FILE" ] && [ "$(cat "$STATE_FILE" 2>/dev/null)" = "$TODAY" ]; then
    echo "[$TS] 오늘($TODAY) 이미 실행됨 — 스킵" >> "$LOG_FILE"
    exit 0
  fi
  if [ "$((10#$NOW_HM))" -lt "$TARGET_HM" ]; then
    echo "[$TS] 정규 시각(08:00) 이전 — 스킵하고 대기" >> "$LOG_FILE"
    exit 0
  fi
fi

CLAUDE_BIN="$(command -v claude || true)"

PROMPT='너는 블로그의 "2026 미국 월드컵 라이브 트래커" 글을 매일 갱신하는 자동화 에이전트다. 작업 디렉터리는 현재 폴더(~/Projects/blog), 대상 파일은 src/content/blog/2026-world-cup-tracker.md 이다.

다음을 순서대로 수행하라:
1) WebSearch로 어제~오늘 2026 FIFA 월드컵(미국·캐나다·멕시코) 경기 결과와 최신 조별 순위, 토너먼트(32강~결승) 진행 상황을 확인한다. 출처는 FIFA, NBC Sports, ESPN, 연합뉴스 등 신뢰할 수 있는 곳을 쓴다.
2) 대상 .md 파일을 갱신한다. HTML/CSS 구조(.wc-* 클래스, <style> 블록, 브래킷 골격)는 절대 바꾸지 말고, 데이터 값만 바꾼다:
   - 각 조 순위표의 경기수·승점·득실을 갱신하고, 승점→득실 순으로 정렬한다. 현재 32강 진출권(상위 2팀)인 행에만 class="adv"를 둔다.
   - 토너먼트 브래킷: 대진이 확정/경기가 끝난 칸에 한국어 팀명+국기 이모지와 스코어를 채운다. 아직 안 정해진 칸은 "미정" 그대로 둔다.
   - "다가오는 경기" 표를 향후 1~2일 일정으로 갱신한다. 시각은 반드시 한국시간(KST = 미국 동부시간 ET + 13시간)으로 환산해 "M/D(요일) HH:MM" 형식으로 적고(td에 class="kst"), 이미 끝난 경기는 표에서 뺀다. 대한민국 경기 행에는 class="kr"을 주고 경기 끝에 ⭐를 붙인다.
   - 상단 "마지막 업데이트" 배지 텍스트와 frontmatter의 updatedDate를 현재 한국시각으로 갱신한다.
3) `npm run build`를 실행한다. 실패하면 push하지 말고 `node scripts/notify-telegram.mjs "⚠️ 월드컵 트래커 갱신 실패: 빌드 오류"`로 알린 뒤 멈춘다.
4) 빌드 성공 시 `git add -A && git commit -m "update: 월드컵 트래커 <오늘 날짜>" && git push` 한다.
5) `node scripts/notify-telegram.mjs "..."`로 갱신 요약을 보낸다. 메시지에는 주요 결과(특히 한국 경기)와 글 주소 https://blog-x84m.vercel.app/blog/2026-world-cup-tracker/ 를 포함한다. ※용어 주의: 2026 대회는 48개국 체제라 조별리그 다음 첫 토너먼트가 "32강"이다. 조별리그 통과·진출을 가리킬 때 절대 "16강"이라 쓰지 말고 "32강(진출권)"으로 표기한다. 16강은 32강 다음 라운드를 뜻한다.

안전 규칙: 결과를 지어내지 마라. 불확실하거나 출처가 엇갈리면 추정하지 말고 "미확정"으로 둔다. 어제 경기가 없었으면 updatedDate만 갱신한다. 확정된 사실만 반영한다.'

{
  echo "===== [$TS] 월드컵 트래커 갱신 시작 ====="
  if [ -z "$CLAUDE_BIN" ]; then
    echo "[$TS] ERROR: claude 를 찾을 수 없습니다. PATH=$PATH"
    node scripts/notify-telegram.mjs "⚠️ 월드컵 트래커 자동 갱신 실패: claude 실행파일을 찾지 못함" 2>/dev/null
  else
    echo "[$TS] claude: $CLAUDE_BIN"
    "$CLAUDE_BIN" -p "$PROMPT" --dangerously-skip-permissions
    rc=$?
    echo "[$TS] claude 종료코드: $rc"
    echo "$TODAY" > "$STATE_FILE"
  fi
  echo "===== [$TS] 월드컵 트래커 갱신 종료 ====="
  echo ""
} >> "$LOG_FILE" 2>&1
