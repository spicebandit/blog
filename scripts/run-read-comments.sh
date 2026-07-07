#!/bin/bash
# launchd가 하루 몇 번 호출 — 새 댓글을 읽어 텔레그램 알림(없으면 조용히 종료).
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
cd "$HOME/projects/blog" || exit 1
mkdir -p logs
echo "[$(date '+%F %T')] read-comments 실행" >> logs/read-comments.log
node scripts/read-comments.mjs >> logs/read-comments.log 2>&1
