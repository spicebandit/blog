-- 네이버 수집요청 일괄 등록: 인자로 받은 전체 URL들을 순서대로 제출
-- 반환: LOGIN_EXPIRED | SUBMITTED n=<제출시도수>
on run argv
  set siteParam to "https://searchadvisor.naver.com/console/site/request/crawl?site=https%3A%2F%2Fwww.baseload.co.kr"
  tell application "Safari"
    activate
    make new document with properties {URL:siteParam}
    delay 6
    set pageURL to (URL of front document)
    if pageURL contains "nid.naver.com" or (do JavaScript "document.title" in front document) contains "로그인" then
      close front document
      return "LOGIN_EXPIRED"
    end if
    set n to 0
    repeat with u in argv
      set fillJS to "(function(){var inp=[].slice.call(document.querySelectorAll('input[type=text]')).filter(function(i){return i.offsetParent!==null;})[0];if(!inp)return 'no';inp.focus();inp.select();document.execCommand('selectAll');document.execCommand('delete');document.execCommand('insertText',false,'" & u & "');return 'ok';})();"
      do JavaScript fillJS in front document
      delay 1
      do JavaScript "(function(){var b=[].slice.call(document.querySelectorAll('button')).filter(function(x){return x.offsetParent!==null && /확인/.test((x.textContent||'').trim());})[0];if(b)b.click();})();" in front document
      delay 2
      set n to n + 1
    end repeat
    close front document
    return "SUBMITTED n=" & n
  end tell
end run
