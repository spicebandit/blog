-- 네이버 서치어드바이저 '웹페이지 수집요청' — 인자로 받은 URL을 제출한다.
--
-- 기존 naver-crawl-request.applescript는 2026-07-03 밀린 글 목록이 하드코딩돼 있어
-- 새 글에는 못 쓴다. 이 스크립트는 발행 직후 그 글 하나를 넣는 용도다.
--
-- 사용: osascript scripts/naver-submit-url.applescript "https://www.baseload.co.kr/blog/<슬러그>/"
--
-- 출력 첫 토큰:
--   LOGIN_EXPIRED   → 네이버 로그인 자체가 만료 (사파리에서 직접 로그인 필요)
--   CONSOLE_BLOCKED → 네이버 로그인은 살아 있는데 콘솔이 안 열림 (아래 2026-10-07 참고)
--   NO_INPUT        → 입력 폼을 못 찾음 (SPA 렌더 지연 — 재시도하면 대개 됨)
--   ALREADY|<슬러그> → 이미 요청 목록에 있음
--   DONE|<슬러그>    → 제출 확인됨
--   FAILED|<슬러그>  → 제출했으나 목록에서 확인 안 됨
--
-- 주의 (2026-07-03 실측으로 확인된 제약, 그대로 유지):
--   ① 입력은 https:// 포함 전체 URL이어야 한다 (경로만 넣으면 형식 오류)
--   ② 값 주입은 execCommand insertText를 써야 한다 (네이티브 setter는 폼이 인식 못 함)
--   ③ 요청 목록은 10행씩 페이지네이션 → 등록 확인은 1~3페이지를 모두 읽어야 한다
--
-- 주의 (2026-10-07 실측 — 로그인 판정을 또 한 번 고쳤다):
--   네이버 로그인이 멀쩡해도(naver.com에서 '로그아웃' 보임, 서치어드바이저 헤더에 계정명
--   노출) 콘솔 라우트(/console/*)가 렌더되지 않는 상태가 있다. 이때 화면에는 헤더·푸터만
--   남고 document.title 은 '로그인 - 네이버 서치어드바이저'로 고정된다. 즉 **제목에
--   '로그인'이 있다는 이유로 LOGIN_EXPIRED를 반환하면 멀쩡한 세션을 또 오판한다.**
--   그래서 판정을 두 갈래로 나눴다 — naver.com 로그인 여부를 실제로 확인해서,
--   로그인이 살아 있으면 CONSOLE_BLOCKED(사람이 사파리에서 콘솔을 한 번 열어주면 해결)를,
--   죽어 있으면 LOGIN_EXPIRED를 반환한다.
--   또한 사파리에 이미 열려 있는 콘솔 탭이 있으면 새 창을 만들지 않고 그 탭을 재사용한다
--   (딥링크 진입이 실패하는 상태에서도 사람이 열어둔 탭으로는 제출이 된다).

global reusedTab

on run argv
  if (count of argv) is 0 then return "NO_ARG"
  set fullURL to item 1 of argv
  set reusedTab to false

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
    -- ① 사람이 이미 열어둔 콘솔 탭이 있으면 그걸 쓴다. 딥링크로 새 창을 띄우면
    --    콘솔 라우트가 렌더되지 않는 상태가 있어서(2026-10-07), 열린 탭이 가장 확실하다.
    tell application "Safari"
      activate
      set foundTab to false
      repeat with w from 1 to (count of windows)
        try
          repeat with t from 1 to (count of tabs of window w)
            if ((URL of tab t of window w) as text) contains "searchadvisor.naver.com/console" then
              set current tab of window w to tab t of window w
              set index of window w to 1
              set foundTab to true
              exit repeat
            end if
          end repeat
        end try
        if foundTab then exit repeat
      end repeat

      if foundTab then
        set reusedTab to true
        if ((URL of front document) as text) does not contain "request/crawl" then
          set URL of front document to siteParam
          delay 5
        end if
      else
        make new document with properties {URL:siteParam}
        delay 5
      end if
      -- 로그인 판정은 한 번만 보면 안 된다. 네이버는 OAuth 리다이렉트를 2단계로 타기
      -- 때문에, 고정 delay 직후에는 아직 nid.naver.com에 머물러 있어 멀쩡한 세션을
      -- 만료로 오판한다(2026-10-07 실측: 로그인 직후인데 LOGIN_EXPIRED 반환).
      -- 콘솔 URL에 정착하고 입력칸이 렌더될 때까지 폴링한다.
      set settled to false
      repeat 10 times
        set pageURL to (URL of front document) as text
        if pageURL does not contain "nid.naver.com" then
          set inputCount to (do JavaScript "(function(){var i=[].slice.call(document.querySelectorAll('input[type=text]')).filter(function(x){return x.offsetParent!==null});return String(i.length);})();" in front document) as text
          if inputCount is not "0" then
            set settled to true
            exit repeat
          end if
        end if
        delay 3
      end repeat
      if not settled then
        set pageURL to (URL of front document) as text
        if not reusedTab then close front document
      end if
    end tell

    if not settled then
      -- ② 여기서 끝내지 않고 네이버 로그인 자체를 확인한다. 제목에 '로그인'이 있다는
      --    이유만으로 LOGIN_EXPIRED를 반환하면 멀쩡한 세션을 오판한다(2026-10-07).
      if pageURL contains "nid.naver.com" then
        return "LOGIN_EXPIRED"
      else if my naverLoggedIn() then
        return "CONSOLE_BLOCKED"
      else
        return "LOGIN_EXPIRED"
      end if
    end if

    set existing to my readAllPages(readRows)

    if existing contains slug then
      my closeIfOwned()
      return "ALREADY|" & slug
    end if

    -- 입력 후 제출
    tell application "Safari"
      set fillJS to "(function(){var inp=[].slice.call(document.querySelectorAll('input[type=text]')).filter(function(i){return i.offsetParent!==null;})[0];if(!inp)return 'no';inp.focus();inp.select();document.execCommand('selectAll');document.execCommand('delete');document.execCommand('insertText',false,'" & fullURL & "');return 'ok';})();"
      set filled to do JavaScript fillJS in front document
      if filled is "no" then
        if not reusedTab then close front document
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

    my closeIfOwned()
  end timeout

  if afterRows contains slug then
    return "DONE|" & slug
  else
    return "FAILED|" & slug
  end if
end run

-- 사람이 열어둔 탭이면 닫지 않는다
on closeIfOwned()
  global reusedTab
  if reusedTab then return
  tell application "Safari" to close front document
end closeIfOwned

-- naver.com 로그인이 살아 있는지 실제로 확인한다 (콘솔 렌더 실패와 구분하기 위함)
on naverLoggedIn()
  set okLogin to false
  try
    with timeout of 60 seconds
      tell application "Safari"
        make new document with properties {URL:"https://www.naver.com"}
        delay 6
        set t to (do JavaScript "(function(){return /로그아웃/.test(document.body.innerText||'')?'Y':'N';})();" in front document) as text
        close front document
        if t is "Y" then set okLogin to true
      end tell
    end timeout
  end try
  return okLogin
end naverLoggedIn

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
