-- 네이버 서치어드바이저 '웹페이지 수집요청' — 인자로 받은 URL을 제출한다.
--
-- 기존 naver-crawl-request.applescript는 2026-07-03 밀린 글 목록이 하드코딩돼 있어
-- 새 글에는 못 쓴다. 이 스크립트는 발행 직후 그 글 하나를 넣는 용도다.
--
-- 사용: osascript scripts/naver-submit-url.applescript "https://www.baseload.co.kr/blog/<슬러그>/"
--
-- 출력 첫 토큰:
--   LOGIN_EXPIRED   → 네이버 로그인 만료 (사파리에서 직접 로그인 필요)
--   NO_INPUT        → 입력 폼을 못 찾음 (SPA 렌더 지연 — 재시도하면 대개 됨)
--   ALREADY|<슬러그> → 이미 요청 목록에 있음
--   DONE|<슬러그>    → 제출 확인됨
--   FAILED|<슬러그>  → 제출했으나 목록에서 확인 안 됨
--
-- 주의 (2026-07-03 실측으로 확인된 제약, 그대로 유지):
--   ① 입력은 https:// 포함 전체 URL이어야 한다 (경로만 넣으면 형식 오류)
--   ② 값 주입은 execCommand insertText를 써야 한다 (네이티브 setter는 폼이 인식 못 함)
--   ③ 요청 목록은 10행씩 페이지네이션 → 등록 확인은 1~3페이지를 모두 읽어야 한다

on run argv
  if (count of argv) is 0 then return "NO_ARG"
  set fullURL to item 1 of argv

  -- URL 끝부분에서 슬러그 추출 (등록 확인용 매칭 키)
  set AppleScript's text item delimiters to "/"
  set parts to text items of fullURL
  set slug to ""
  repeat with i from (count of parts) to 1 by -1
    set candidate to item i of parts
    if candidate is not "" then
      set slug to candidate
      exit repeat
    end if
  end repeat
  set AppleScript's text item delimiters to ""
  if slug is "" then return "NO_ARG"

  set siteParam to "https://searchadvisor.naver.com/console/site/request/crawl?site=https%3A%2F%2Fwww.baseload.co.kr"
  set readRows to "(function(){return [].slice.call(document.querySelectorAll('table tbody tr')).map(function(r){return (r.textContent||'')}).join(' ');})();"

  with timeout of 180 seconds
    tell application "Safari"
      activate
      make new document with properties {URL:siteParam}
      delay 6
      set pageTitle to do JavaScript "document.title" in front document
      set pageURL to (URL of front document)
      if pageURL contains "nid.naver.com" or pageTitle contains "로그인" then
        close front document
        return "LOGIN_EXPIRED"
      end if
    end tell

    set existing to my readAllPages(readRows)

    if existing contains slug then
      tell application "Safari" to close front document
      return "ALREADY|" & slug
    end if

    -- 입력 후 제출
    tell application "Safari"
      set fillJS to "(function(){var inp=[].slice.call(document.querySelectorAll('input[type=text]')).filter(function(i){return i.offsetParent!==null;})[0];if(!inp)return 'no';inp.focus();inp.select();document.execCommand('selectAll');document.execCommand('delete');document.execCommand('insertText',false,'" & fullURL & "');return 'ok';})();"
      set filled to do JavaScript fillJS in front document
      if filled is "no" then
        close front document
        return "NO_INPUT"
      end if
      delay 1
      do JavaScript "(function(){var b=[].slice.call(document.querySelectorAll('button')).filter(function(x){return x.offsetParent!==null && /확인/.test((x.textContent||'').trim());})[0];if(b)b.click();})();" in front document
      delay 4

      -- 새로고침해서 실제 등록됐는지 확인
      set URL of front document to siteParam
      delay 6
    end tell

    set afterRows to my readAllPages(readRows)

    tell application "Safari" to close front document
  end timeout

  if afterRows contains slug then
    return "DONE|" & slug
  else
    return "FAILED|" & slug
  end if
end run

-- 요청 목록 1~3페이지를 모두 읽어 합친 텍스트를 돌려준다
on readAllPages(readRows)
  tell application "Safari"
    set combined to (do JavaScript readRows in front document)
    repeat with pg in {"2", "3"}
      set moved to do JavaScript "(function(){var a=[].slice.call(document.querySelectorAll('a,button')).filter(function(x){return x.offsetParent!==null && x.textContent.trim()==='" & pg & "'})[0];if(a){a.click();return 'y';}return 'n';})();" in front document
      if moved is "y" then
        delay 2
        set combined to combined & " " & (do JavaScript readRows in front document)
      end if
    end repeat
    do JavaScript "(function(){var a=[].slice.call(document.querySelectorAll('a,button')).filter(function(x){return x.offsetParent!==null && x.textContent.trim()==='1'})[0];if(a)a.click();})();" in front document
    delay 2
    return combined
  end tell
end readAllPages
