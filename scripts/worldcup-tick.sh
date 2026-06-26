#!/bin/bash
#
# 월드컵 트래커 "틱" — 경기 결과를 반영하는 워커.
#   동적 업데이터(com.gogumi.blog.worldcup.update)가 '경기 종료시각'마다 호출하고,
#   플래너(worldcup-plan.sh)도 매일 06:00 catch-up으로 한 번 호출한다.
#
# 하는 일:
#   1) 종료일(7/21) 이후면 종료 알림 + 두 launchd 잡 자체 해제 후 exit
#   2) headless Claude(claude -p)로:
#      - 최신 경기 결과를 WebSearch로 확인 → 트래커 글(.md) 갱신 → 빌드 → push
#      - 새로 끝난 경기가 있으면 텔레그램 공유(없으면 updatedDate만)
#      - 오늘 경기 일정(KST 킥오프/예상 종료시각/상태)을 logs/worldcup-today.json 으로 출력
#
# 이 스크립트는 자기 자신(launchd)을 재예약하지 않는다. 스케줄링은 플래너가 담당.
#
# 수동 실행: bash scripts/worldcup-tick.sh

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT" || exit 1

LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/worldcup-update.log"
TODAY_JSON="$LOG_DIR/worldcup-today.json"
mkdir -p "$LOG_DIR"

UID_NUM="$(id -u)"
PLAN_LABEL="com.gogumi.blog.worldcup.plan"
UPDATE_LABEL="com.gogumi.blog.worldcup.update"
PLAN_PLIST="$HOME/Library/LaunchAgents/$PLAN_LABEL.plist"
UPDATE_PLIST="$HOME/Library/LaunchAgents/$UPDATE_LABEL.plist"
END_DATE=20260721    # 이 날짜(YYYYMMDD) 이상이면 자동 갱신 종료
POST_URL="https://www.baseload.co.kr/blog/2026-world-cup-tracker/"

TS="$(date '+%Y-%m-%d %H:%M:%S')"
TODAY_NUM="$(date '+%Y%m%d')"

# launchd는 PATH가 빈약하므로 보강
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1 || true
fi

# ───────────── 종료 조건: 결승 종료 후 두 잡 모두 자기 해제 ─────────────
if [ "$TODAY_NUM" -ge "$END_DATE" ]; then
  {
    echo "===== [$TS] 월드컵 종료 — 자동 갱신 해제 ====="
  } >> "$LOG_FILE" 2>&1
  node scripts/notify-telegram.mjs "🏁 2026 월드컵이 끝났습니다. 트래커 자동 갱신을 종료합니다. 기록은 그대로 남아 있어요: ${POST_URL}" >> "$LOG_FILE" 2>&1
  git commit --allow-empty -m "chore: 월드컵 종료 — 상단 공지 자동 해제" >> "$LOG_FILE" 2>&1 && git push >> "$LOG_FILE" 2>&1
  rm -f "$UPDATE_PLIST" "$PLAN_PLIST"
  launchctl bootout "gui/$UID_NUM/$UPDATE_LABEL" >/dev/null 2>&1
  launchctl bootout "gui/$UID_NUM/$PLAN_LABEL" >/dev/null 2>&1
  exit 0
fi

CLAUDE_BIN="$(command -v claude || true)"

PROMPT='너는 블로그의 "2026 미국 월드컵 라이브 트래커" 글을 갱신하는 자동화 에이전트다. 작업 디렉터리는 현재 폴더(~/projects/blog), 대상 파일은 src/content/blog/2026-world-cup-tracker.md 이다.

다음을 순서대로 수행하라:
1) WebSearch로 지금 시점 기준 최근 2026 FIFA 월드컵(미국·캐나다·멕시코) 경기 결과와 최신 조별 순위, 토너먼트(32강~결승) 진행 상황, 그리고 오늘(한국시간 기준)·내일 경기 일정을 확인한다. 출처는 FIFA, NBC Sports, ESPN, 연합뉴스 등 신뢰할 수 있는 곳을 쓴다.
2) 대상 .md 파일을 갱신한다. HTML/CSS 구조(.wc-* 클래스, <style> 블록, 브래킷 골격)는 절대 바꾸지 말고, 데이터 값만 바꾼다:
   - 각 조 순위표의 경기수·승점·득실을 갱신하고, 승점→득실 순으로 정렬한다. 현재 32강 진출권(상위 2팀)인 행에만 class="adv"를 둔다.
   - 토너먼트 브래킷: 대진이 확정/경기가 끝난 칸에 한국어 팀명+국기 이모지와 스코어를 채운다. 아직 안 정해진 칸은 "미정" 그대로 둔다.
   - "다가오는 경기" 표를 향후 1~2일 일정으로 갱신한다. 시각은 반드시 한국시간(KST = 미국 동부시간 ET + 13시간)으로 환산해 "M/D(요일) HH:MM" 형식으로 적고(td에 class="kst"), 이미 끝난 경기는 표에서 뺀다. 대한민국 경기 행에는 class="kr"을 주고 경기 끝에 ⭐를 붙인다.
   - 대회 개요 표(class="wc-overview")의 "현재 단계" 셀(td)을 최신 진행상황으로 갱신한다. 표의 다른 행과 .wc-overview HTML 구조는 그대로 둔다.
   - 상단 "마지막 업데이트" 배지 텍스트와 frontmatter의 updatedDate를 현재 한국시각으로 갱신한다.
3) `npm run build`를 실행한다. 실패하면 push하지 말고 `node scripts/notify-telegram.mjs "⚠️ 월드컵 트래커 갱신 실패: 빌드 오류"`로 알린 뒤 멈춘다.
4) 빌드 성공 시 `git add -A && git commit -m "update: 월드컵 트래커 <오늘 날짜 시각>" && git push` 한다. (실제로 바뀐 내용이 없으면 커밋 생략 가능)
5) **직전 갱신 이후 새로 종료된 경기가 있을 때만** `node scripts/notify-telegram.mjs "..."`로 결과를 공유한다(없으면 텔레그램 전송 생략). 메시지에는 방금 끝난 경기 결과(특히 한국 경기)와 글 주소 '"${POST_URL}"' 를 포함한다. ※용어 주의: 2026 대회는 48개국 체제라 조별리그 다음 첫 토너먼트가 "32강"이다. "16강"은 32강 다음 라운드다.
6) **반드시** 오늘(한국시간 기준) 경기 일정을 다음 JSON 형식으로 파일 logs/worldcup-today.json 에 저장하라(경기 없으면 matches: []):
   {"date":"YYYY-MM-DD(KST 오늘)","generated_kst":"ISO시각","matches":[{"match":"A vs B","kickoff_kst":"YYYY-MM-DDTHH:MM","end_est_kst":"YYYY-MM-DDTHH:MM","status":"scheduled|live|finished"}]}
   - end_est_kst(예상 종료시각)는 보수적으로: 조별리그=킥오프+2시간20분, 토너먼트(연장·승부차기 가능)=킥오프+3시간10분 으로 계산해 넣어라.
   - 시각은 모두 한국시간(KST), 24시간제. status는 지금 시점 기준 상태.

안전 규칙: 결과를 지어내지 마라. 불확실하거나 출처가 엇갈리면 추정하지 말고 "미확정"으로 둔다. 확정된 사실만 반영한다. logs/worldcup-today.json 작성은 생략하지 말 것(스케줄링에 쓰인다).'

{
  echo "===== [$TS] 월드컵 틱 시작 ====="
  if [ -z "$CLAUDE_BIN" ]; then
    echo "[$TS] ERROR: claude 를 찾을 수 없습니다. PATH=$PATH"
    node scripts/notify-telegram.mjs "⚠️ 월드컵 트래커 자동 갱신 실패: claude 실행파일을 찾지 못함" 2>/dev/null
  else
    echo "[$TS] claude: $CLAUDE_BIN"
    "$CLAUDE_BIN" -p "$PROMPT" --dangerously-skip-permissions
    rc=$?
    echo "[$TS] claude 종료코드: $rc"
  fi
  echo "===== [$TS] 월드컵 틱 종료 ====="
  echo ""
} >> "$LOG_FILE" 2>&1
