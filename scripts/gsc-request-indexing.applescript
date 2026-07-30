-- 구글 서치콘솔 'URL 검사 → 색인 생성 요청' 자동화 (로컬 사파리 로그인 세션 사용)
-- argv: item1 = GSC 대시보드 URL(?resource_id=...), item2..N = 색인요청할 실제 페이지 URL(전체)
-- 출력: 각 대상 URL의 결과를 줄바꿈으로 반환
--   LOGIN_EXPIRED / OK|.. / CLICKED_NOCONFIRM|.. / BTN_NOTFOUND|.. / NOINPUT / ALREADY|..

on run argv
  set dash to item 1 of argv
  set outLines to {}

  tell application "Safari"
    activate
    if (count of documents) is 0 then
      make new document with properties {URL:dash}
    else
      set URL of front document to dash
    end if
    delay 12
    if (URL of front document) contains "accounts.google.com" then return "LOGIN_EXPIRED"
  end tell

  repeat with i from 2 to (count of argv)
    set tgt to (item i of argv) as text

    -- 매 대상마다 대시보드로 초기화(검색창 재사용)
    tell application "Safari"
      set URL of front document to dash
    end tell
    delay 8

    -- 검색창에 URL 입력 + Enter
    set fillJS to "(function(){var u='" & tgt & "';var inp=[].slice.call(document.querySelectorAll('input[type=text]')).filter(function(i){return i.offsetParent!==null && /\\uAC80\\uC0AC/.test(i.getAttribute('aria-label')||'');})[0];if(!inp)return 'NOINPUT';inp.focus();inp.select();document.execCommand('selectAll');document.execCommand('delete');document.execCommand('insertText',false,u);['keydown','keypress','keyup'].forEach(function(t){inp.dispatchEvent(new KeyboardEvent(t,{key:'Enter',code:'Enter',keyCode:13,which:13,bubbles:true}));});return 'FILLED';})();"
    set fillRes to ""
    tell application "Safari"
      try
        set fillRes to (do JavaScript fillJS in front document)
      on error
        set fillRes to "JSERR"
      end try
    end tell

    if fillRes is not "FILLED" then
      set end of outLines to (tgt & " => " & fillRes)
    else
      -- URL 검사 실행·로딩 대기
      delay 22

      -- '색인 생성 요청' 버튼 탐색·클릭
      set clickJS to "(function(){var t=['\\uC0C9\\uC778 \\uC0DD\\uC131 \\uC694\\uCCAD','\\uC0C9\\uC778 \\uC694\\uCCAD','Request indexing','Request Indexing'];var els=[].slice.call(document.querySelectorAll('span,div,button,a,[role=button]'));var hit=null;for(var k=0;k<els.length;k++){var e=els[k];if(e.offsetParent===null)continue;var s=(e.textContent||'').trim();if(s.length>25)continue;for(var j=0;j<t.length;j++){if(s===t[j]){hit=e;break;}}if(hit)break;}if(hit){hit.click();return 'CLICK|'+(hit.textContent||'').trim();}var b=(document.body.innerText||'');var m=b.match(/(\\uC0C9\\uC778 \\uC0DD\\uC131\\uC774 \\uC694\\uCCAD\\uB428|URL\\uC774 Google\\uC5D0 \\uB4F1\\uB85D|\\uC774\\uBBF8.{0,6}\\uC0C9\\uC778)/);return m?('ALREADY|'+m[0]):('NOBTN|'+b.slice(0,100));})();"
      set clickRes to ""
      tell application "Safari"
        try
          set clickRes to (do JavaScript clickJS in front document)
        on error
          set clickRes to "JSERR"
        end try
      end tell

      if clickRes starts with "CLICK" then
        delay 70
        set confirmJS to "(function(){var b=(document.body.innerText||'');var m=b.match(/(\\uC0C9\\uC778 \\uC0DD\\uC131\\uC774 \\uC694\\uCCAD\\uB428|\\uC694\\uCCAD\\uC774 \\uC811\\uC218|Indexing requested|\\uC6B0\\uC120\\uC21C\\uC704)/);return m?('CONF|'+m[0]):('NOCONF|'+b.slice(0,100));})();"
        set conf to ""
        tell application "Safari"
          try
            set conf to (do JavaScript confirmJS in front document)
          on error
            set conf to "NOCONF|"
          end try
        end tell
        if conf starts with "CONF" then
          set end of outLines to (tgt & " => OK|" & conf)
        else
          set end of outLines to (tgt & " => CLICKED_NOCONFIRM|" & conf)
        end if
      else if clickRes starts with "ALREADY" then
        set end of outLines to (tgt & " => ALREADY|" & clickRes)
      else
        set end of outLines to (tgt & " => BTN_NOTFOUND|" & clickRes)
      end if
    end if
  end repeat

  set AppleScript's text item delimiters to linefeed
  return (outLines as text)
end run
