-- 네이버 서치어드바이저 '검색 키워드' 전체(최대 30행) 수집
--
-- 기존 naver-expose-report.applescript는 아침 리포트용으로 총계 + 키워드 TOP5만 뽑는다.
-- 실장님이 콘솔에서 '검색키워드 탑30'을 보시고 "클릭이 많은 것 같다"고 하셔서(2026-11-18),
-- 30행 전체를 컬럼째로 가져오는 전용 스크립트를 따로 만들었다. 기존 스크립트는 건드리지 않는다
-- (아침 리포트가 그걸 쓰고 있어 형식을 바꾸면 깨진다).
--
-- 반환: 첫 줄 TOTAL<TAB>클릭<TAB>노출<TAB>CTR
--       둘째 줄 HEAD<TAB>헤더셀들...   (컬럼 순서를 눈으로 확인하기 위해 그대로 싣는다)
--       이후 각 줄 ROW<TAB>셀1<TAB>셀2<TAB>...
--       실패 시: LOGIN_EXPIRED | NO_DATA | SAFARI_BUSY
--
-- 주의(기존 스크립트에서 얻은 교훈 그대로):
--   · 콘솔 진입 시 OAuth 리디렉트가 일어나고 콜백이 딥링크를 잃는다 → 세션 확립 후 재이동 2단계.
--   · SPA라 readyState complete 뒤에도 표가 늦게 채워진다 → 값이 나올 때까지 폴링.
--   · 사파리 명령은 전부 with timeout 으로 감싼다(AppleEvent 기본 60초 대기 → -1712 사고).

on closeStaleConsoleWindows()
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

-- ① 세션 확립 대기
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

-- ③ 총계 + 키워드 표 전체(최대 30행) 추출
set js to "(function(){" & ¬
  "var t=(document.body.innerText||'').replace(/[ \\t]+/g,' ');" & ¬
  "function num(label){var m=t.match(new RegExp(label+'\\\\s*\\\\n?\\\\s*([0-9.,]+(?:백|천|만)?)'));return m?m[1]:'';}" & ¬
  "var c=num('최근 총 클릭'), i=num('최근 총 노출'), r=num('평균 CTR');" & ¬
  "var tbs=[].slice.call(document.querySelectorAll('table'));" & ¬
  "var target=null;" & ¬
  "for(var a=0;a<tbs.length;a++){var head=(tbs[a].innerText||'').slice(0,60);" & ¬
  "if(head.indexOf('키워드')>-1){target=tbs[a];break;}}" & ¬
  "if(!target&&!c&&!i)return 'NO_DATA';" & ¬
  "var out=['TOTAL\\t'+c+'\\t'+i+'\\t'+r];" & ¬
  "if(target){" & ¬
  "var ths=[].slice.call(target.querySelectorAll('thead th,thead td')).map(function(x){return (x.innerText||'').trim().replace(/\\s+/g,' ');});" & ¬
  "if(ths.length)out.push('HEAD\\t'+ths.join('\\t'));" & ¬
  "var trs=[].slice.call(target.querySelectorAll('tbody tr'));" & ¬
  "for(var b=0;b<trs.length&&b<30;b++){" & ¬
  "var tds=[].slice.call(trs[b].querySelectorAll('td,th')).map(function(x){return (x.innerText||'').trim().replace(/\\s+/g,' ');});" & ¬
  "if(tds.length)out.push('ROW\\t'+tds.join('\\t'));}}" & ¬
  "return out.join('\\n');})()"

set outp to "NO_DATA"
repeat 12 times
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
