#!/bin/bash
# 네이버 수집요청 대기열 — 세션 타이밍 의존을 없앤다.
#
# 문제: 서치어드바이저 세션이 짧다(2026-10-02 실측 약 77분 유휴 만료). 발행 시점에
# 로그인이 살아 있을 확률이 낮아서, 예약발행이든 수동발행이든 수집요청이 자주 실패했다.
# 이번 주에만 네 번 실패해 그때마다 사용자에게 재로그인을 요청해야 했다.
#
# 해결: 발행 시 URL을 대기열에 넣어두고, 로그인이 살아 있을 때 한 번에 비운다.
# 발행과 수집요청의 시점을 분리하는 것이 요지다.
#
# 사용:
#   scripts/naver-queue.sh add <url> [<url>...]   대기열에 추가(중복 무시)
#   scripts/naver-queue.sh drain                  로그인돼 있으면 전부 제출
#   scripts/naver-queue.sh list                   대기 중인 URL 보기
#
# drain 결과: 제출 성공(DONE)·이미 등록(ALREADY)은 대기열에서 빼고,
# LOGIN_EXPIRED면 즉시 중단하고 대기열을 그대로 둔다(다음 로그인 때 재시도).
set -uo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
QUEUE="$REPO/.naver-queue"
SUBMIT="$REPO/scripts/naver-submit-url.applescript"
touch "$QUEUE"

case "${1:-}" in
  add)
    shift
    [ $# -eq 0 ] && { echo "URL을 주세요"; exit 1; }
    for u in "$@"; do
      if grep -qxF "$u" "$QUEUE"; then
        echo "이미 대기열에 있음: $u"
      else
        echo "$u" >> "$QUEUE"
        echo "대기열 추가: $u"
      fi
    done
    ;;

  drain)
    if [ ! -s "$QUEUE" ]; then echo "대기열 비어 있음"; exit 0; fi
    total=$(wc -l < "$QUEUE" | tr -d ' ')
    echo "대기 ${total}건 제출 시작"
    ok=0; left=()
    while IFS= read -r u; do
      [ -z "$u" ] && continue
      res="$(osascript "$SUBMIT" "$u" 2>&1 | tail -1)"
      case "$res" in
        DONE*|ALREADY*)
          echo "  ✓ ${res%%|*} · $u"; ok=$((ok+1)) ;;
        LOGIN_EXPIRED)
          # 세션이 끊기면 남은 건 건드리지 않고 그대로 둔다
          echo "  ✗ LOGIN_EXPIRED — 중단. 남은 건 대기열에 유지"
          left+=("$u")
          while IFS= read -r rest; do [ -n "$rest" ] && left+=("$rest"); done
          break ;;
        *)
          echo "  ? $res · $u (대기열 유지)"; left+=("$u") ;;
      esac
    done < "$QUEUE"
    printf '%s\n' "${left[@]+"${left[@]}"}" | grep -v '^$' > "$QUEUE" || : > "$QUEUE"
    remain=$(grep -c . "$QUEUE" 2>/dev/null) || remain=0
    echo "완료 ${ok}건 · 남은 ${remain}건"
    ;;

  list)
    if grep -q . "$QUEUE" 2>/dev/null; then
      echo "대기 $(grep -c . "$QUEUE")건:"
      grep . "$QUEUE" | sed 's/^/  /'
    else echo "대기열 비어 있음"; fi
    ;;

  *)
    echo "사용: $0 {add <url>...|drain|list}"; exit 1 ;;
esac
