---
title: "클로드 서버 상태 확인 — 지금 장애인지 1분 체크"
description: "클로드(Claude)가 지금 안 되나요? 내 문제인지 서버 장애인지 1분 만에 가리는 법. 공식 상태페이지 한 곳부터 실시간 장애 알림·RSS·API·다운디텍터까지 한눈에 정리했습니다."
pubDate: 2026-06-18T16:20:00+09:00
updatedDate: 2026-06-29T18:10:00+09:00
category: ai
tags: ["클로드 서버 상태", "클로드", "Claude", "장애 확인"]
draft: false
---

<div id="cc-status" class="cc-status" data-loading>
  <div class="cc-row">
    <span class="cc-dot cc-load"></span>
    <div class="cc-main">
      <div class="cc-title">🚦 클로드(Claude) 실시간 상태</div>
      <div class="cc-desc" id="cc-desc">상태 확인 중…</div>
    </div>
    <a class="cc-link" href="https://status.claude.com" target="_blank" rel="noopener">공식 페이지 ↗</a>
  </div>
  <div class="cc-grid" id="cc-grid"></div>
  <div class="cc-meta" id="cc-meta">출처: status.claude.com · 60초마다 자동 새로고침</div>
</div>

<script>
(function(){
  var EL=document.getElementById('cc-status'); if(!EL) return;
  var MAP={none:['#4A6741','모든 시스템 정상'],minor:['#C89B3C','일부 경미한 문제'],major:['#B85C1E','일부 장애 발생'],critical:['#C8102E','심각한 장애'],maintenance:['#23201D','점검 중']};
  var CMAP={operational:['#4A6741','정상'],degraded_performance:['#C89B3C','지연'],partial_outage:['#B85C1E','부분 장애'],major_outage:['#C8102E','전면 장애'],under_maintenance:['#23201D','점검']};
  function fmt(){return new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});}
  function render(data){
    var ind=(data.status&&data.status.indicator)||'none';
    var m=MAP[ind]||MAP.none;
    var dot=EL.querySelector('.cc-dot'); dot.className='cc-dot'; dot.style.background=m[0];
    document.getElementById('cc-desc').textContent=m[1];
    var order=['Claude Code','claude.ai','Claude API (api.anthropic.com)','Claude Console (platform.claude.com)','Claude Cowork','Claude for Government'];
    var byName={}; (data.components||[]).forEach(function(c){byName[c.name]=c;});
    var g=document.getElementById('cc-grid'); g.innerHTML='';
    order.forEach(function(n){var c=byName[n]; if(!c) return; var cm=CMAP[c.status]||['#8A8378','—'];
      var el=document.createElement('div'); el.className='cc-cell'+(n==='Claude Code'?' cc-hi':'');
      el.innerHTML='<span class="cc-d" style="background:'+cm[0]+'"></span>'+n.replace(/ \(.*\)/,'')+' <b>'+cm[1]+'</b>';
      g.appendChild(el);});
    document.getElementById('cc-meta').textContent='출처: status.claude.com · '+fmt()+' 기준 · 60초마다 자동 새로고침';
    EL.removeAttribute('data-loading');
  }
  function load(){fetch('https://status.claude.com/api/v2/summary.json',{cache:'no-store'}).then(function(r){return r.json();}).then(render).catch(function(){
    document.getElementById('cc-desc').textContent='상태를 불러오지 못했습니다 — 공식 페이지에서 확인하세요';
    EL.querySelector('.cc-dot').style.background='#8A8378'; EL.querySelector('.cc-dot').className='cc-dot';
  });}
  load(); setInterval(load,60000);
})();
</script>

<style>
.cc-status{border:1px solid #E5DECF;border-radius:14px;padding:14px 16px;margin:0 0 1.5rem;background:#FAF6EE;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.cc-status .cc-row{display:flex;align-items:center;gap:12px}
.cc-status .cc-dot{width:18px;height:18px;border-radius:50%;flex:none;background:#E5DECF;box-shadow:0 0 0 4px rgba(0,0,0,.04)}
.cc-status .cc-dot.cc-load{animation:ccpulse 1s infinite}
@keyframes ccpulse{0%,100%{opacity:.35}50%{opacity:1}}
.cc-status .cc-main{flex:1;min-width:0}
.cc-status .cc-title{font-weight:800;font-size:.92rem}
.cc-status .cc-desc{font-size:1.05rem;font-weight:700}
.cc-status .cc-link{font-size:.8rem;white-space:nowrap;text-decoration:none;color:#C8102E}
.cc-status .cc-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:10px}
.cc-status .cc-cell{font-size:.83rem;display:flex;align-items:center;gap:6px;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:5px 8px}
.cc-status .cc-cell.cc-hi{border-color:#C8102E;background:#F1EADD}
.cc-status .cc-cell .cc-d{width:9px;height:9px;border-radius:50%;flex:none}
.cc-status .cc-cell b{margin-left:auto;font-weight:700}
.cc-status .cc-meta{font-size:.72rem;color:#8A8378;margin-top:8px}
@media(max-width:480px){.cc-status .cc-grid{grid-template-columns:1fr}}
</style>

**지금 바로 클로드 서버 상태를 확인하려면 → 공식 상태페이지 [status.claude.com](https://status.claude.com) 한 곳이면 됩니다.** 아래에서 그 외 방법(장애 알림·RSS·API·다운디텍터)까지 정리합니다. 위 신호등은 공식 상태 API를 실시간으로 불러와 표시합니다.

클로드(Claude)로 한창 작업하다 갑자기 화면이 멈추거나 접속이 안 되면 가장 먼저 드는 생각은 하나입니다. **"내 인터넷 문제야, 아니면 클로드 서버가 죽은 거야?"** 이걸 1분 안에 가려내면 괜히 라우터를 재부팅하거나 캐시를 지우는 헛수고를 안 해도 됩니다. 이 글에서는 **클로드 서버 상태**(장애 여부)를 실시간으로 확인하는 방법을, 가장 쉬운 것부터 개발자용까지 순서대로 정리합니다.

![graphs of performance analytics on a laptop screen](https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxzZXJ2ZXIlMjBzdGF0dXMlMjBtb25pdG9yaW5nJTIwZGFzaGJvYXJkJTIwdXB0aW1lfGVufDF8MHx8fDE3ODE3NjY4ODV8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Luke Chesser](https://unsplash.com/@lukechesser?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/graphs-of-performance-analytics-on-a-laptop-screen-JKUTrJ4vK00?utm_source=spice-bandit-blog&utm_medium=referral)*

## 가장 확실한 곳: 공식 상태페이지

제일 먼저 봐야 할 곳은 앤트로픽(Anthropic)의 **공식 상태페이지**입니다.

- 주소: **[status.claude.com](https://status.claude.com)** (예전 주소 `status.anthropic.com`으로 들어가도 같은 페이지로 연결됩니다)

여기가 중요한 이유는, 클로드가 하나의 서비스가 아니라 **여러 컴포넌트로 쪼개져 표시**되기 때문입니다. 즉 "claude.ai 웹은 죽었는데 API는 멀쩡한" 상황도 한눈에 구분됩니다. 현재 공개되는 컴포넌트는 다음 6가지입니다.

- **claude.ai** — 우리가 쓰는 웹/앱 채팅
- **Claude API (api.anthropic.com)** — 개발자용 API
- **Claude Code** — 터미널/IDE용 코딩 도구
- **Claude Console (platform.claude.com)** — 콘솔·결제·키 관리
- **Claude Cowork** — 협업 기능
- **Claude for Government** — 정부용

각 컴포넌트 옆에는 상태가 색으로 표시됩니다. 의미는 이렇게 읽으면 됩니다.

<div class="status-legend">
  <div class="st"><span class="dot op"></span><b>Operational</b><br>정상</div>
  <div class="st"><span class="dot deg"></span><b>Degraded</b><br>느림·일부 지연</div>
  <div class="st"><span class="dot part"></span><b>Partial Outage</b><br>부분 장애</div>
  <div class="st"><span class="dot major"></span><b>Major Outage</b><br>전면 장애</div>
  <div class="st"><span class="dot maint"></span><b>Maintenance</b><br>점검 중</div>
</div>

페이지 맨 위에 **"All Systems Operational"**이라고 떠 있으면 클로드 쪽은 멀쩡하다는 뜻 — 문제가 내 환경에 있다는 신호입니다.

## 매번 확인하기 싫다면: 알림 구독

상태페이지를 띄울 필요도 없이, **장애가 나면 먼저 알려주게** 만들 수 있습니다. status.claude.com 우측 상단의 **Subscribe(구독)** 버튼을 누르면 다음 채널로 인시던트 알림을 받을 수 있습니다.

- 이메일
- SMS(문자)
- Slack
- Microsoft Teams

업무에 클로드를 깊게 쓰는 1인 기업가·개발자라면 **Slack이나 이메일 구독을 한 번 걸어두는 것**을 추천합니다. 장애 발생·복구 시점을 자동으로 통지받으니, "왜 안 되지?" 하고 시간을 허비할 일이 사라집니다.

## 과거 이력과 RSS로 추적하기

"지난주에도 이러더니 또?" 싶을 때는 **인시던트 히스토리**를 봅니다.

- 과거 장애 이력: [status.claude.com/history](https://status.claude.com/history)
- RSS/Atom 피드: `https://status.claude.com/history.rss` — RSS 리더에 등록해두면 새 인시던트가 자동으로 들어옵니다.

최근 들어 짧은 지연·부분 장애가 잦아지는 추세라, 이력 페이지를 한 번 훑어보면 "오늘 일시적인 문제인지, 며칠째 반복되는 문제인지" 감을 잡을 수 있습니다.

![turned on monitoring screen](https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxzZXJ2ZXIlMjBzdGF0dXMlMjBtb25pdG9yaW5nJTIwZGFzaGJvYXJkJTIwdXB0aW1lfGVufDF8MHx8fDE3ODE3NjY4ODV8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Stephen Dawson](https://unsplash.com/@dawson2406?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/turned-on-monitoring-screen-qwtCeJ5cLYs?utm_source=spice-bandit-blog&utm_medium=referral)*

## 개발자라면: 상태를 코드로 확인하기

상태페이지는 Atlassian Statuspage 기반이라, **JSON API로 상태를 직접 조회**할 수 있습니다. 모니터링 스크립트나 대시보드에 붙이기 좋습니다.

```bash
# 전체 상태 한 줄 요약
curl -s https://status.claude.com/api/v2/status.json

# 예시 응답
# {"status":{"indicator":"none","description":"All Systems Operational"}}
```

`indicator` 값의 의미는 다음과 같습니다.

- `none` → 정상
- `minor` → 경미한 문제
- `major` → 중대한 장애
- `critical` → 심각한 전면 장애

컴포넌트별 상세나 진행 중인 인시던트가 필요하면 `/api/v2/summary.json`, `/api/v2/incidents/unresolved.json`을 쓰면 됩니다. 더 자동화하고 싶다면 **웹훅(webhook)**을 등록해, 인시던트 생성·갱신·복구 이벤트를 서버로 직접 받을 수도 있습니다.

## 보조 수단: 다운디텍터와 X

공식 페이지가 아직 장애를 반영하지 못한 '초기 몇 분'에는 **사용자 체감 제보**가 더 빠를 때가 있습니다.

- **다운디텍터(Downdetector)**: "Claude"로 검색하면 제보 급증 그래프로 체감 장애를 확인할 수 있습니다.
- **X(트위터) [@AnthropicAI](https://x.com/AnthropicAI)**: 대규모 장애 때는 공식 계정이나 사용자 트윗이 가장 빠른 신호가 되기도 합니다.

단, 이들은 어디까지나 '체감' 지표입니다. **최종 판단은 공식 상태페이지로** 확인하는 습관을 들이세요.

## 그래도 안 될 때: 30초 자가진단

상태페이지가 "정상"인데 나만 안 된다면, 문제는 내 쪽일 가능성이 큽니다. 아래만 빠르게 점검해보세요.

1. **다른 기기·네트워크로 접속** (휴대폰 LTE로 시도) → 되면 내 와이파이/회사망 문제
2. **시크릿 창 또는 캐시 삭제** → 로그인·세션 꼬임 해결
3. **VPN·확장프로그램 끄기** → 광고 차단기나 VPN이 막는 경우 많음
4. **claude.ai / Claude Code / API 중 무엇이 안 되는지 구분** → 상태페이지 컴포넌트와 대조

이 4단계로 "클로드 장애 vs 내 환경 문제"가 거의 가려집니다.

## 마치며

정리하면, **1순위는 언제나 공식 상태페이지([status.claude.com](https://status.claude.com))**입니다. 여기에 **알림 구독**을 한 번 걸어두면, 앞으로는 "왜 안 되지?" 하고 헤매는 대신 자동으로 통지를 받게 됩니다. 개발자라면 JSON API로 모니터링에 붙이고, 공식 반영이 느릴 땐 다운디텍터로 교차 확인하면 됩니다. 클로드를 업무 도구로 쓰는 사람일수록, 이 확인 루틴 하나가 멈춰 선 시간을 분 단위로 줄여줍니다.

> 💡 클로드 같은 클라우드 AI가 자주 멈춰 답답하다면, 장애·인터넷과 무관하게 내 컴퓨터에서 돌아가는 대안도 있습니다 — [로컬 LLM 시작 가이드: 내 컴퓨터에서 AI 돌리기](/blog/2026-07-02-local-llm-beginner-guide/)를 참고하세요.

<style>
.status-legend{display:flex;flex-wrap:wrap;gap:.6rem;margin:1.2rem 0}
.status-legend .st{flex:1;min-width:96px;border:1px solid #E5DECF;border-radius:10px;padding:.6rem .5rem;background:#FAF6EE;font-size:.8rem;line-height:1.45;text-align:center}
.status-legend .dot{display:inline-block;width:11px;height:11px;border-radius:50%;margin-bottom:.35rem}
.dot.op{background:#4A6741}.dot.deg{background:#C89B3C}.dot.part{background:#B85C1E}.dot.major{background:#C8102E}.dot.maint{background:#23201D}
@media(max-width:640px){.status-legend .st{min-width:44%}}
</style>
