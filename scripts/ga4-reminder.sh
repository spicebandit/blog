#!/bin/bash
# 1회성 리마인더: GA4 방문자 자동조회 세팅 (월요일 오전 발화)
# 보낸 뒤 스스로 launchd 등록 해제 + 파일 정리 → 다시는 발화하지 않음.
set -u

PROJECT="/Users/yuntaekim/Projects/blog"
NODE="/opt/homebrew/bin/node"
LABEL="com.gogumi.blog.ga4reminder"
PLIST="$HOME/Library/LaunchAgents/${LABEL}.plist"

MSG="⏰ [리마인더] GA4 방문자 자동조회 세팅, 오늘 해볼까요?

지난주에 미뤄둔 작업이에요. 준비물(구글 클라우드, 약 7분):
1) Analytics Data API 켜기
2) 서비스 계정 만들어 JSON 키 다운로드
3) 그 계정 이메일을 GA4에 '뷰어'로 추가
4) GA4 '속성 ID'(숫자) 확인

저한테 'GA4 세팅하자' 한마디 주시면 단계별로 다시 안내해 드리고,
① 속성 ID(숫자) ② 'JSON 다운로드 완료'만 주시면 제가 조회 스크립트 만들어 마무리합니다.
천천히 하셔도 됩니다 🙂"

cd "$PROJECT" || exit 1
"$NODE" "$PROJECT/scripts/notify-telegram.mjs" "$MSG" >> "$PROJECT/logs/ga4-reminder.log" 2>&1

# 1회성: 파일 제거 후 launchd에서 부트아웃(이 시점엔 메시지 전송 완료)
rm -f "$PLIST"
rm -f "$PROJECT/scripts/ga4-reminder.sh"
launchctl bootout "gui/$(id -u)/${LABEL}" 2>/dev/null
