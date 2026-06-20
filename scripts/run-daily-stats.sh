#!/bin/bash
# 일일 조회수 리포트 실행 래퍼 (launchd가 매일 오전 7시에 호출)
set -u

PROJECT="/Users/yuntaekim/projects/blog"
NODE="/opt/homebrew/bin/node"

cd "$PROJECT" || exit 1
"$NODE" "$PROJECT/scripts/daily-stats.mjs" >> "$PROJECT/logs/daily-stats.log" 2>&1
