#!/bin/bash
# blog 전용 텔레그램 대화봇 세션. 이 창을 켜두면 @blog봇으로 대화 가능.
export TELEGRAM_STATE_DIR="$HOME/.claude/channels/telegram/blog"
cd "/Users/yuntaekim/projects/blog"
exec claude --channels plugin:telegram@claude-plugins-official
