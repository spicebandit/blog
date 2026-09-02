-- 애드센스 승인 상태 확인 (사파리 로그인 세션 사용)
-- 반환: REVIEWING|<snippet> | APPROVED|<snippet> | ACTION_NEEDED|<snippet> | LOGIN_EXPIRED | UNKNOWN|<snippet>
--
-- 2026-09-02 수정: 반려 상태를 UNKNOWN으로 떨어뜨리던 문제를 고쳤다.
--   반려되면 온보딩 화면이 '문제 발생' / '일부 내용을 수정해야 합니다'를 띄우는데,
--   기존 판정에는 이 문구가 없어 UNKNOWN이 났고, 아침 브리프가 '상태 불명 — 수동 확인 권장'을
--   출력했다. 로그인은 멀쩡한데 로그인이 풀린 것처럼 읽혀 실장님이 두 번 확인하게 만들었다.
set adUrl to "https://adsense.google.com/adsense/new/u/0/pub-2188276151280033/onboarding"
tell application "Safari"
  activate
  make new document with properties {URL:adUrl}
  delay 9
  set pageURL to (URL of front document)
  set pageTitle to (do JavaScript "document.title" in front document)
  if pageURL contains "accounts.google.com" or pageTitle contains "로그인" or pageTitle contains "Sign in" then
    close front document
    return "LOGIN_EXPIRED"
  end if
  set snippet to do JavaScript "(function(){var h=[].slice.call(document.querySelectorAll('h1,h2,h3')).map(function(x){return (x.textContent||'').trim();}).filter(function(t){return t.length>2&&t.length<60;});return h.slice(0,6).join(' | ');})();" in front document
  set bodyText to do JavaScript "(document.body.innerText||'').slice(0,3000)" in front document
  close front document
  -- 판정: '검토/심사 중' 키워드가 있으면 REVIEWING
  -- 승인이 가장 강한 신호이므로 먼저 본다. 반려 화면에도 '검토' 같은 단어가 섞여 있어
  -- 순서를 바꾸면 반려를 심사중으로 오판한다.
  if bodyText contains "축하" or bodyText contains "승인되" or bodyText contains "게재 준비" or bodyText contains "ready to serve" or bodyText contains "광고가 게재" then
    return "APPROVED|" & snippet
  else if bodyText contains "수정해야" or bodyText contains "문제 발생" or bodyText contains "주의 필요" or bodyText contains "가치가 별로 없는" or bodyText contains "needs attention" or bodyText contains "action required" then
    return "ACTION_NEEDED|" & snippet
  else if bodyText contains "검토 중" or bodyText contains "게재 가능 여부" or bodyText contains "reviewing" or bodyText contains "심사" then
    return "REVIEWING|" & snippet
  else
    return "UNKNOWN|" & snippet
  end if
end tell
