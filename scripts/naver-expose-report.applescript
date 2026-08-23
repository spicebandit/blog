-- 네이버 서치어드바이저 '콘텐츠 노출/클릭' 리포트 수집 (최근 30일)
--
-- 네이버는 이 데이터를 API로 제공하지 않아 사파리 로그인 세션으로 콘솔을 직접 읽는다.
-- 구글 서치콘솔만 보던 아침 리포트에 네이버를 합치기 위해 만들었다(2026-08-23).
-- 이 블로그는 네이버 클릭이 구글의 20배가 넘어, 네이버를 빼면 성과의 대부분이 안 보인다.
--
-- 반환 형식(한 줄): CLICKS=65|IMPR=930|CTR=7|KW=키워드(클릭/노출);키워드(클릭/노출);...
--          실패 시: LOGIN_EXPIRED | NO_DATA
--
-- 주의: 콘솔 진입 시 OAuth 리디렉트(console → nid/authorize → auth/callback)가 일어나고
-- 콜백에서 딥링크가 보존되지 않는다. 그래서 ①세션 확립을 기다린 뒤 ②리포트 URL로
-- 다시 이동하는 2단계가 필요하다. 고정 delay로 중간 단계를 읽으면 오판한다.

set entry to "https://searchadvisor.naver.com/console/site/request/crawl?site=https%3A%2F%2Fwww.baseload.co.kr"
set reportUrl to "https://searchadvisor.naver.com/console/site/report/expose?site=https%3A%2F%2Fwww.baseload.co.kr"

tell application "Safari"
  activate
  make new document with properties {URL:entry}

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

  -- ② 리포트 페이지로 재이동
  set URL of front document to reportUrl
  repeat 30 times
    delay 2
    try
      set u2 to (URL of front document) as text
      set rs to (do JavaScript "document.readyState" in front document) as text
    on error
      set u2 to ""
      set rs to ""
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
  try
    set outp to (do JavaScript js in front document) as text
  on error
    set outp to "NO_DATA"
  end try
  close front document
  return outp
end tell
