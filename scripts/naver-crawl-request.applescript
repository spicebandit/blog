-- 네이버 서치어드바이저 '웹페이지 수집요청' 자동화 (로컬 사파리 세션 사용)
-- 출력(표준출력) 첫 토큰:
--   LOGIN_EXPIRED                 → 네이버 로그인 만료
--   DONE|added=..                 → 목표 URL 전부 요청 완료
--   PROGRESS|added=..|pending=..  → 일부 추가, 남은 것 있음
--
-- 2026-07-03 개편 대응 (그날 실측으로 확인):
--   ① 입력은 https:// 포함 전체 URL이어야 함 (경로만 넣으면 "올바른 URL 형식" 오류)
--   ② 값 주입은 execCommand insertText 사용 (네이티브 setter+input 이벤트는 폼이 인식 못 함)
--   ③ 요청 목록 테이블은 10행씩 페이지네이션 → 등록 확인은 1~3페이지를 모두 읽어서 판단
set siteParam to "https://searchadvisor.naver.com/console/site/request/crawl?site=https%3A%2F%2Fwww.baseload.co.kr"
set base to "https://www.baseload.co.kr"

-- (path, 매칭용 슬러그) 목표 목록
set targets to {¬
  {"/blog/2026-07-04-lmp-rollout-progress-2026h2/", "lmp-rollout-progress-2026h2"}, ¬
  {"/blog/2026-07-03-tesla-fsd-korea-timeline/", "tesla-fsd-korea-timeline"}, ¬
  {"/blog/2026-07-03-hyman-minsky-model-korea-2026/", "hyman-minsky-model-korea-2026"}, ¬
  {"/blog/2026-07-03-local-llm-iphone-guide/", "local-llm-iphone-guide"}}

set readRows to "(function(){return [].slice.call(document.querySelectorAll('table tbody tr')).map(function(r){return (r.textContent||'')}).join(' ');})();"

-- 페이지네이션 1~3페이지 텍스트 수집 핸들러
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
    -- 1페이지로 복귀
    do JavaScript "(function(){var a=[].slice.call(document.querySelectorAll('a,button')).filter(function(x){return x.offsetParent!==null && x.textContent.trim()==='1'})[0];if(a)a.click();})();" in front document
    delay 2
    return combined
  end tell
end readAllPages

tell application "Safari"
  activate
  make new document with properties {URL:siteParam}
  delay 5
  -- 로그인 확인 (이후 모두 front document 사용)
  set pageTitle to do JavaScript "document.title" in front document
  set pageURL to (URL of front document)
  if pageURL contains "nid.naver.com" or pageTitle contains "로그인" then
    return "LOGIN_EXPIRED"
  end if
end tell

set existing to my readAllPages(readRows)

tell application "Safari"
  set tried to 0
  repeat with t in targets
    set p to item 1 of t
    set slug to item 2 of t
    if (existing does not contain slug) and (tried < 3) then
      set tried to tried + 1
      set fullURL to base & p
      set fillJS to "(function(){var inp=[].slice.call(document.querySelectorAll('input[type=text]')).filter(function(i){return i.offsetParent!==null;})[0];if(!inp)return 'no';inp.focus();inp.select();document.execCommand('selectAll');document.execCommand('delete');document.execCommand('insertText',false,'" & fullURL & "');return 'ok';})();"
      do JavaScript fillJS in front document
      delay 1
      do JavaScript "(function(){var b=[].slice.call(document.querySelectorAll('button')).filter(function(x){return x.offsetParent!==null && /확인/.test((x.textContent||'').trim());})[0];if(b)b.click();})();" in front document
      delay 3
    end if
  end repeat

  -- 재조회(새로고침)로 실제 등록 검증
  set URL of front document to siteParam
  delay 5
end tell

set afterRows to my readAllPages(readRows)

tell application "Safari"
  close front document
end tell

set pendingCount to 0
set pendingNames to ""
set addedNames to ""
repeat with t in targets
  set slug to item 2 of t
  if afterRows contains slug then
    if existing does not contain slug then set addedNames to addedNames & slug & " "
  else
    set pendingCount to pendingCount + 1
    set pendingNames to pendingNames & slug & " "
  end if
end repeat

if pendingCount is 0 then
  return "DONE|added=" & addedNames
else
  return "PROGRESS|added=" & addedNames & "|pending=" & pendingNames
end if
