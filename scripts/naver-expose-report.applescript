-- 네이버 서치어드바이저 '콘텐츠 노출/클릭' 리포트 수집 (최근 30일)
--
-- 네이버는 이 데이터를 API로 제공하지 않아 사파리 로그인 세션으로 콘솔을 직접 읽는다.
-- 구글 서치콘솔만 보던 아침 리포트에 네이버를 합치기 위해 만들었다(2026-08-23).
-- 이 블로그는 네이버 클릭이 구글의 20배가 넘어, 네이버를 빼면 성과의 대부분이 안 보인다.
--
-- 반환 형식(한 줄): CLICKS=65|IMPR=930|CTR=7|KW=키워드(클릭/노출);키워드(클릭/노출);...
--          실패 시: LOGIN_EXPIRED | NO_DATA | SAFARI_BUSY
--
-- 주의: 콘솔 진입 시 OAuth 리디렉트(console → nid/authorize → auth/callback)가 일어나고
-- 콜백에서 딥링크가 보존되지 않는다. 그래서 ①세션 확립을 기다린 뒤 ②리포트 URL로
-- 다시 이동하는 2단계가 필요하다. 고정 delay로 중간 단계를 읽으면 오판한다.
--
-- 2026-09-04 수정: AppleEvent 타임아웃(-1712)으로 4회 연속 실패한 사고 대응.
--   ① 모든 사파리 명령을 `with timeout` 으로 감쌌다. 기본 AppleEvent 대기는 60초인데,
--      사파리가 응답을 못 하면 그 시간을 다 쓰고 -1712로 죽는다. 짧게 끊어 실패를 빨리 알린다.
--   ② 실행 전 이 스크립트가 남긴 잔여 콘솔 창을 먼저 정리한다. 앞선 실행이 창을 닫지 못하고
--      죽으면 창이 쌓이고, 그 상태가 다음 실행의 응답성을 떨어뜨린다.
--   ③ 중간에 어디서 실패하든 마지막에 반드시 창을 닫는다(cleanup 핸들러).

on closeStaleConsoleWindows()
  -- 이전 실행이 남긴 서치어드바이저 창을 닫는다. 사용자가 직접 연 다른 탭은 건드리지 않는다.
  try
    with timeout of 15 seconds
      tell application "Safari"
        repeat with d in (every document)
          try
            set du to (URL of d) as text
            if du contains "searchadvisor.naver.com" then close d
          end try
        end repeat
      end tell
    end timeout
  end try
end closeStaleConsoleWindows

on closeFrontSafely()
  try
    with timeout of 15 seconds
      tell application "Safari" to close front document
    end timeout
  end try
end closeFrontSafely

set entry to "https://searchadvisor.naver.com/console/site/request/crawl?site=https%3A%2F%2Fwww.baseload.co.kr"
set reportUrl to "https://searchadvisor.naver.com/console/site/report/expose?site=https%3A%2F%2Fwww.baseload.co.kr"

my closeStaleConsoleWindows()

try
  with timeout of 30 seconds
    tell application "Safari"
      activate
      make new document with properties {URL:entry}
    end tell
  end timeout
on error
  return "SAFARI_BUSY"
end try

-- ① OAuth 리디렉트가 끝나 세션이 잡힐 때까지 (최대 60초)
set authed to false
repeat 30 times
  delay 2
  set u to ""
  try
    with timeout of 10 seconds
      tell application "Safari" to set u to (URL of front document) as text
    end timeout
  end try
  if u contains "searchadvisor.naver.com" and (u does not contain "nid.naver.com") then
    set authed to true
    exit repeat
  end if
end repeat
if authed is false then
  my closeFrontSafely()
  return "LOGIN_EXPIRED"
end if
delay 2

-- ② 리포트 페이지로 재이동
try
  with timeout of 20 seconds
    tell application "Safari" to set URL of front document to reportUrl
  end timeout
on error
  my closeFrontSafely()
  return "SAFARI_BUSY"
end try

repeat 30 times
  delay 2
  set u2 to ""
  set rs to ""
  try
    with timeout of 10 seconds
      tell application "Safari"
        set u2 to (URL of front document) as text
        set rs to (do JavaScript "document.readyState" in front document) as text
      end tell
    end timeout
  end try
  if u2 contains "/console/site/report/expose" and rs is "complete" then exit repeat
end repeat
delay 8

-- ③ 총계 + 검색 키워드 TOP5 추출
set js to "(function(){" & ¬
  "var t=(document.body.innerText||'').replace(/[ \\t]+/g,' ');" & ¬
  "function num(label){var m=t.match(new RegExp(label+'\\\\s*\\\\n?\\\\s*([0-9.]+(?:백|천|만)?)'));return m?m[1]:'';}" & ¬
  "var c=num('최근 총 클릭'), i=num('최근 총 노출'), r=num('평균 CTR');" & ¬
  "var rows=[].slice.call(document.querySelectorAll('table')).map(function(tb){return tb;});" & ¬
  "var kw=[];" & ¬
  "for(var a=0;a<rows.length;a++){var tb=rows[a];var head=(tb.innerText||'').slice(0,40);" & ¬
  "if(head.indexOf('검색 키워드')>-1||head.indexOf('키워드')>-1){" & ¬
  "var trs=[].slice.call(tb.querySelectorAll('tbody tr'));" & ¬
  "for(var b=0;b<trs.length&&kw.length<5;b++){" & ¬
  "var tds=[].slice.call(trs[b].querySelectorAll('td')).map(function(x){return (x.innerText||'').trim();});" & ¬
  "if(tds.length>=4&&tds[1]){kw.push(tds[1].replace(/[;|]/g,' ')+'('+tds[2]+'/'+tds[3]+')');}}" & ¬
  "break;}}" & ¬
  "if(!c&&!i)return 'NO_DATA';" & ¬
  "return 'CLICKS='+c+'|IMPR='+i+'|CTR='+r+'|KW='+kw.join(';');})()"

-- 콘솔은 SPA라 readyState complete 뒤에도 숫자가 늦게 채워진다. 고정 대기로 한 번만
-- 읽으면 NO_DATA 오판이 난다(2026-09-04 실제 발생). 값이 나올 때까지 최대 40초 폴링한다.
set outp to "NO_DATA"
repeat 10 times
  try
    with timeout of 25 seconds
      tell application "Safari" to set outp to (do JavaScript js in front document) as text
    end timeout
  on error
    set outp to "NO_DATA"
  end try
  if outp is not "NO_DATA" then exit repeat
  delay 4
end repeat

my closeFrontSafely()
return outp
