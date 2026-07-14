-- 애드센스 승인 상태 확인 (사파리 로그인 세션 사용)
-- 반환: REVIEWING|<snippet> | APPROVED|<snippet> | LOGIN_EXPIRED | UNKNOWN|<snippet>
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
  if bodyText contains "검토 중" or bodyText contains "게재 가능 여부" or bodyText contains "reviewing" or bodyText contains "심사" then
    return "REVIEWING|" & snippet
  else if bodyText contains "축하" or bodyText contains "승인되" or bodyText contains "게재 준비" or bodyText contains "ready to serve" or bodyText contains "광고가 게재" then
    return "APPROVED|" & snippet
  else
    return "UNKNOWN|" & snippet
  end if
end tell
