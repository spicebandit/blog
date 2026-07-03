-- 네이버 서치어드바이저 '웹페이지 수집요청' 자동화 (로컬 사파리 세션 사용)
-- 출력(표준출력) 첫 토큰:
--   LOGIN_EXPIRED                 → 네이버 로그인 만료
--   DONE|added=..                 → 목표 URL 전부 요청 완료
--   PROGRESS|added=..|pending=..  → 일부 추가, 남은 것 있음
set siteParam to "https://searchadvisor.naver.com/console/site/request/crawl?site=https%3A%2F%2Fwww.baseload.co.kr"

-- (path, 매칭용 슬러그) 목표 목록
set targets to {¬
  {"/blog/2026-07-03-hyman-minsky-model-korea-2026/", "hyman-minsky-model-korea-2026"}, ¬
  {"/blog/2026-07-03-local-llm-iphone-guide/", "local-llm-iphone-guide"}, ¬
  {"/blog/2026-07-02-local-llm-beginner-guide/", "local-llm-beginner-guide"}, ¬
  {"/blog/2026-07-02-sodium-ion-battery-outlook/", "sodium-ion-battery-outlook"}, ¬
  {"/blog/2026-06-27-korea-stock-broker-api-comparison/", "korea-stock-broker-api-comparison"}, ¬
  {"/blog/2026-06-27-korea-public-data-api-guide/", "korea-public-data-api-guide"}, ¬
  {"/blog/claude-code-stock-agent-2-kis-api/", "claude-code-stock-agent-2-kis-api"}, ¬
  {"/blog/2026-06-28-hermes-agent-nous-research-install-guide/", "hermes-agent-nous-research-install-guide"}, ¬
  {"/blog/2026-06-27-claude-code-alternatives-comparison-2026/", "claude-code-alternatives-comparison-2026"}, ¬
  {"/blog/2026-06-29-summer-electricity-bill-2026-progressive-rate/", "summer-electricity-bill-2026-progressive-rate"}, ¬
  {"/blog/2026-06-28-gpt-56-europa-ai-sovereignty-war/", "gpt-56-europa-ai-sovereignty-war"}, ¬
  {"/blog/2026-06-30-bernie-sanders-ai-arguments/", "bernie-sanders-ai-arguments"}, ¬
  {"/blog/2026-07-01-ess-auction-market-rps-transition/", "ess-auction-market-rps-transition"}, ¬
  {"/blog/2026-07-01-krx-aftermarket-extended-trading-hours/", "krx-aftermarket-extended-trading-hours"}, ¬
  {"/blog/2026-06-30-ai-agent-enterprise-adoption-gap/", "ai-agent-enterprise-adoption-gap"}, ¬
  {"/blog/2026-06-30-korea-summer-power-supply-2026/", "korea-summer-power-supply-2026"}, ¬
  {"/blog/2026-06-30-2026-h1-korea-economy-review-h2-outlook/", "2026-h1-korea-economy-review-h2-outlook"}, ¬
  {"/blog/2026-06-30-anthropic-mythos-export-control/", "anthropic-mythos-export-control"}, ¬
  {"/blog/2026-07-02-ess-battery-lfp-solid-state-trend/", "ess-battery-lfp-solid-state-trend"}}

set readRows to "(function(){return [].slice.call(document.querySelectorAll('table tbody tr')).map(function(r){return (r.textContent||'')}).join(' ');})();"

tell application "Safari"
  activate
  make new document with properties {URL:siteParam}
  delay 5
  -- 로그인 확인 (이후 모두 front document 사용)
  set pageTitle to do JavaScript "document.title" in front document
  set pageURL to (URL of front document)
  if pageURL contains "nid.naver.com" or pageTitle does not contain "서치어드바이저" then
    return "LOGIN_EXPIRED"
  end if

  set existing to do JavaScript readRows in front document

  set tried to 0
  repeat with t in targets
    set p to item 1 of t
    set slug to item 2 of t
    if (existing does not contain slug) and (tried < 3) then
      set tried to tried + 1
      set fillJS to "(function(){var inp=[].slice.call(document.querySelectorAll('input[type=text],textarea')).filter(function(i){return i.offsetParent!==null;})[0];if(!inp)return 'no';var s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(inp,'');inp.dispatchEvent(new Event('input',{bubbles:true}));s.call(inp,'" & p & "');inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));return 'ok';})();"
      do JavaScript fillJS in front document
      delay 1
      do JavaScript "(function(){var b=[].slice.call(document.querySelectorAll('button')).filter(function(x){return x.offsetParent!==null && /확인/.test((x.textContent||'').trim());})[0];if(b)b.click();})();" in front document
      delay 2
    end if
  end repeat

  -- 재조회(새로고침)로 실제 등록 검증
  set URL of front document to siteParam
  delay 5
  set afterRows to do JavaScript readRows in front document

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

  close front document

  if pendingCount is 0 then
    return "DONE|added=" & addedNames
  else
    return "PROGRESS|added=" & addedNames & "|pending=" & pendingNames
  end if
end tell
