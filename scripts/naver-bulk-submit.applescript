-- 네이버 수집요청 일괄 등록: 인자로 받은 전체 URL들을 순서대로 제출
-- 반환: LOGIN_EXPIRED | NO_FORM | SUBMITTED n=<제출시도수>
--
-- 2026-08-18 수정: 고정 delay 대신 2단계 대기로 바꿨다.
--   기존에는 `delay 6` 뒤 URL에 nid.naver.com이 있으면 곧바로 LOGIN_EXPIRED를 반환했는데,
--   로그인돼 있어도 OAuth 리디렉트(console → nid/authorize → auth/callback)가 6초 안에
--   끝나지 않으면 중간 단계를 읽고 오판했다. 게다가 콜백 이후 딥링크(site=...)가 보존되지
--   않아 콘솔 페이지까지 자동으로 가지 않는다. 그래서 ①세션이 잡힐 때까지 기다린 뒤
--   ②콘솔 URL로 한 번 더 이동하고, ③입력폼 존재를 확인하고서야 제출한다.
on run argv
  set siteParam to "https://searchadvisor.naver.com/console/site/request/crawl?site=https%3A%2F%2Fwww.baseload.co.kr"
  tell application "Safari"
    activate
    make new document with properties {URL:siteParam}

    -- ① OAuth 리디렉트가 끝나 세션이 잡힐 때까지 (최대 60초)
    set authed to false
    repeat 30 times
      delay 2
      try
        set u to (URL of front document) as text
      on error
        set u to ""
      end try
      if u contains "searchadvisor.naver.com" and (u does not contain "nid.naver.com") then
        set authed to true
        exit repeat
      end if
    end repeat
    if authed is false then
      close front document
      return "LOGIN_EXPIRED"
    end if
    delay 2

    -- ② 세션이 생겼으니 콘솔 딥링크로 다시 이동 (콜백에서 멈추기 때문)
    set URL of front document to siteParam
    repeat 30 times
      delay 2
      try
        set u2 to (URL of front document) as text
        set rs to (do JavaScript "document.readyState" in front document) as text
      on error
        set u2 to ""
        set rs to ""
      end try
      if u2 contains "/console/site/request/crawl" and rs is "complete" then exit repeat
    end repeat
    delay 3

    -- ③ 입력폼이 실제로 있는지 확인한 뒤에만 제출
    try
      set inputCount to (do JavaScript "String([].slice.call(document.querySelectorAll('input[type=text]')).filter(function(i){return i.offsetParent!==null;}).length)" in front document) as text
    on error
      set inputCount to "0"
    end try
    if inputCount is "0" then
      close front document
      return "NO_FORM"
    end if

    set n to 0
    repeat with u in argv
      set fillJS to "(function(){var inp=[].slice.call(document.querySelectorAll('input[type=text]')).filter(function(i){return i.offsetParent!==null;})[0];if(!inp)return 'no';inp.focus();inp.select();document.execCommand('selectAll');document.execCommand('delete');document.execCommand('insertText',false,'" & u & "');return 'ok';})();"
      do JavaScript fillJS in front document
      delay 1
      do JavaScript "(function(){var b=[].slice.call(document.querySelectorAll('button')).filter(function(x){return x.offsetParent!==null && /확인/.test((x.textContent||'').trim());})[0];if(b)b.click();})();" in front document
      delay 3
      set n to n + 1
    end repeat
    close front document
    return "SUBMITTED n=" & n
  end tell
end run
