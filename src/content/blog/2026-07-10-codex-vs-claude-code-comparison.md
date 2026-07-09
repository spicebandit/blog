---
title: "Codex vs Claude Code — 뭐가 다르고 뭘 써야 하나"
description: "OpenAI Codex와 Claude Code, 2026년 두 코딩 에이전트를 정면 비교한다. 로컬·대화형 vs 클라우드·자율이라는 철학 차이부터 벤치마크·비용·실전 선택 기준까지 정리했다."
pubDate: 2026-07-10T14:00:00+09:00
category: ai
tags: ["Codex", "Claude Code", "AI 코딩", "개발도구"]
draft: true
---

결론부터 말하면, 2026년 현재 **Codex와 Claude Code는 우열을 가리는 싸움이 아니라 성격이 다른 두 도구의 선택 문제**다. 벤치마크 점수는 상위 모델끼리 수 %p 안쪽으로 붙어 있고, 진짜 차이는 "코드를 내 컴퓨터에서 대화하듯 짜느냐(Claude Code), 클라우드에 맡겨두고 결과만 검수하느냐(Codex)"라는 **작동 철학**에 있다. 그래서 숙련 개발자일수록 둘 중 하나를 고르기보다 **둘 다 깔아두고 작업 성격에 따라 갈아 쓴다.** 이 글은 그 선택 기준을 취재 기반으로 정리한다.

![MacBook Pro with images of computer language codes](https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjB0ZXJtaW5hbCUyMGNvZGluZyUyMGRhcmt8ZW58MXwwfHx8MTc4MzYyMjg3MHww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Caspar Camille Rubin](https://unsplash.com/@casparrubin?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/macbook-pro-with-images-of-computer-language-codes-fPkvU7RDmCo?utm_source=spice-bandit-blog&utm_medium=referral)*

## Codex란 무엇인가 — 죽었다 부활한 이름

먼저 이름부터 정리하자. 'Codex'는 사실 두 번 산 이름이다. 첫 Codex는 2021년 8월 OpenAI가 GPT-3를 코드로 파인튜닝해 내놓은 **독립 모델**이었고, 같은 해 6월 기술 프리뷰로 나온 GitHub Copilot이 바로 이 Codex를 엔진으로 얹으며 'AI가 코드를 짜준다'를 대중화했다. 그런데 이 1세대 Codex는 **2023년 3월 API가 공식 종료된다.** OpenAI가 내건 이유가 의미심장하다 — "이제는 범용 최신 모델(GPT-3.5·GPT-4)이 전용 코드 모델보다 코딩을 더 잘한다." 전용 코드 모델이 범용 LLM에 흡수돼 사라진 것이다.

그리고 2년 뒤, 같은 이름이 전혀 다른 몸으로 돌아온다. 지금 말하는 Codex는 **2025년 OpenAI가 이 이름을 되살려 내놓은 에이전트형 코딩 도구**다. 부활은 두 갈래로 시작됐다 — 2025년 4월 터미널에서 도는 오픈소스 **Codex CLI**, 그리고 5월 ChatGPT 안에서 비동기로 도는 **클라우드 에이전트**다. 로컬과 클라우드라는 두 몸으로 동시에 태어난 셈인데, 이 이중성이 뒤에서 볼 두 도구의 성격 대비를 그대로 예고한다. 2021년의 '한 줄씩 제안하던 Codex'와 2025년 이후의 'End-to-end로 일하는 Codex'는 이름만 같은 완전히 다른 물건이다.

2026년 4월 23일 OpenAI는 GPT-4.5 이후 처음으로 밑바닥부터 다시 훈련한 기반 모델 **GPT-5.5**를 공개하며 Codex를 이 위에 얹었다. Codex는 지금 네 개의 얼굴을 갖는다 — ChatGPT 웹(chatgpt.com/codex)의 클라우드 에이전트, Rust·TypeScript로 짜인 오픈소스 CLI, VS Code·Cursor 확장, 그리고 2026년 2월 나온 macOS 데스크톱 앱이다. 설정 파일로는 `AGENTS.md`라는 개방형 표준을 쓰는데, 수만 개 오픈소스 프로젝트가 이 포맷을 공유한다는 점이 특징이다.

사실 'AI가 코드를 대신 짜준다'는 개념 자체는 2021년 Copilot 자동완성으로 대중화됐다. 그 사이엔 채팅으로 코드를 묻고 답하던 시기(2023년 Copilot Chat, ChatGPT 코딩)가 있었고, 2025년에 판이 다시 바뀌었다. 한 줄씩 제안하고 채팅으로 답하던 도구가 **터미널에서 스스로 파일을 고치고 테스트를 돌리며 작업을 완주하는 '에이전트'로 진화**한 것이다. Claude Code와 되살아난 Codex가 이 흐름의 양대 축이었고, 2026년 들어 서브에이전트·클라우드 위임·훅·플러그인 마켓 같은 기능이 쏟아지며 이 장르 자체가 폭발했다. 두 도구를 비교한다는 건 사실상 '에이전트형 코딩'이라는 새 장르의 두 대표선수를 비교하는 일이다.

반대편의 **Claude Code**는 앤트로픽이 2025년 초 내놓은 터미널 네이티브 에이전트다(정확히는 2025년 2월 리서치 프리뷰, 5월 정식 출시로, 되살아난 Codex와 거의 같은 시기에 나란히 등장했다). 이쪽은 처음부터 "내 터미널, 내 파일시스템에서 직접 돈다"는 로컬 우선 철학을 밀었다. "터미널에서 산다"는 선택은 신기술이라기보다 **1970년대 유닉스 이래 개발자가 늘 머물던 터전(셸·파이프·파일시스템)으로 AI를 데려온 회귀**에 가깝다. CLI를 중심으로 VS Code·JetBrains 확장, 데스크톱 앱, 웹(claude.ai/code)까지 표면을 넓혔고, 설정은 `CLAUDE.md`에 계층적으로 쌓는다. 모델은 Claude Opus·Sonnet·Haiku 4.x 계열이며 2026년 7월 기준 최상위는 Opus 4.8, 균형형 기본값은 Sonnet 5다.

## 근본 차이: '내 컴퓨터·대화형' vs '클라우드·자율'

스펙 표보다 먼저 이해해야 할 건 두 도구의 작동 방식 자체가 다르다는 점이다. 한 줄로 요약하면 이렇다.

- **Claude Code**: "이렇게 할게요"라고 계획을 보여주고 **단계마다 승인을 받는다.** 코드는 내 기계에 그대로 있고, 위험한 명령(배포·DB·외부 API)은 자동 모드에서도 다시 묻는다. 대화하듯 중간에 방향을 틀 수 있다.
- **Codex**: 작업을 설명하면 **격리된 클라우드 샌드박스에서 알아서 처리하고**, 사용자는 결과를 받아 리뷰한다. 셋업 단계에서만 네트워크를 열고 에이전트 실행 중엔 네트워크를 끊어 안전성을 확보한다.

이 차이가 실제 경험을 가른다. Claude Code는 "옆에서 같이 짜는 페어 프로그래머"에 가깝고, Codex는 "일을 던져두고 나중에 PR을 검수하는 비동기 위임"에 가깝다. 그래서 설계 판단이 촘촘히 필요한 작업, 리팩터링처럼 맥락을 넓게 봐야 하는 작업은 Claude Code의 대화형 통제가 유리하고, 명세가 분명한 반복 작업·병렬 작업은 Codex에 던져두는 편이 시간을 아낀다.

두 도구 모두 2026년 들어 **서브에이전트(Subagents)**를 정식 기능으로 갖췄다는 점도 짚어둘 만하다. 한 작업을 쪼개 여러 에이전트가 병렬로 돌리는 구조인데, Codex는 매니저-워커 모델로 최대 8개 병렬 실행을 내세웠고 Claude Code는 스킬·훅·MCP와 엮어 팀처럼 굴리는 확장성을 강조한다.

![Vibrant close-up of multicolor programming code lines displayed on a screen.](https://images.pexels.com/photos/1921326/pexels-photo-1921326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Markus Spiske](https://www.pexels.com/@markusspiske) on [Pexels](https://www.pexels.com/photo/display-coding-programming-development-1921326/)*

## 설정 파일과 컨텍스트 — 오래 붙어 있을수록 벌어진다

짧은 작업에서는 두 도구가 비슷해 보인다. 차이는 **프로젝트가 크고 세션이 길어질수록** 드러난다. 핵심은 두 가지, 설정 표준과 컨텍스트 관리다.

먼저 설정 철학이 대비된다. Codex의 `AGENTS.md`는 특정 벤더에 묶이지 않은 **개방형 표준**을 지향한다. 수만 개 오픈소스 프로젝트가 이 포맷을 채택했다는 점은, 팀·도구를 바꿔도 규칙 파일을 그대로 재활용할 수 있다는 뜻이다. 반면 Claude Code의 `CLAUDE.md`는 앤트로픽 고유 포맷이지만, 계층적 설정·정책 강제·작업 전후에 실행되는 훅(hook)·MCP 연동까지 얹을 수 있어 **자동화 깊이**가 다르다. 개방성(Codex)이냐 통제력·확장성(Claude Code)이냐의 익숙한 대립이 설정 파일에서도 반복된다. 사실 이 구도는 개발자 문화에서 40년 넘게 반복돼 온 대립의 최신판이다 — vim과 Emacs, 유닉스 소도구 조합과 통합 IDE, 개방 표준과 벤더 생태계. "가볍고 열린 것 vs 무겁지만 강력하게 엮인 것" 사이의 이 진영 다툼은, 대개 한쪽의 '승리'가 아니라 개발자가 도구를 **병용**하는 것으로 끝나 왔다. 이 글이 뒤에서 내릴 '조합하라'는 결론이 새로운 처방이 아닌 이유다.

더 결정적인 건 컨텍스트를 잃지 않는 방식이다. Claude Code는 큰 도구 출력(최대 50만 자 규모)을 컨텍스트에 다 담지 않고 **파일로 저장했다가 필요할 때 다시 읽고**, 컨텍스트가 압축(compaction)된 뒤에도 `CLAUDE.md`를 재로딩해 프로젝트 규칙을 복구한다. Codex는 컨텍스트가 넘치면 앞뒤만 남기고 **가운데를 잘라내는(head/tail truncation)** 방식이라, 긴 세션에서 중간 맥락이 통째로 사라질 수 있다. 한 리뷰어는 밤새(약 8시간) 컨텍스트가 57만 토큰에서 1만 토큰으로 압축된 뒤에도 Claude Code(Opus 4.8)가 하루 전 자기 작업의 아키텍처 결정을 파일을 다시 읽지 않고 기억하더라고 기록했다. 대형 리포지토리·장시간 작업에서 이 차이는 생산성을 크게 가른다.

## 벤치마크·속도·비용 — 숫자로 보면

성능 논쟁을 숫자로 보자. 다만 **벤치마크 수치는 출처와 측정 하네스(setup)에 따라 편차가 있고, 상위 모델 간 격차는 대체로 수 %p 이내**라는 점을 먼저 못박아 둔다. 아래는 한 비교(Composio, 2026-06) 기준값이다.

| 벤치마크 | Claude Code (Opus 4.8) | Codex (GPT-5.5) | 우세 |
|---|---|---|---|
| SWE-bench Verified | 88.6% | 87.6% | 사실상 동률 |
| SWE-bench Pro (난이도↑) | 69.2% | 58.6% | Claude Code |
| Terminal-Bench 2.1 | 74.6% | 78.2% | Codex |

*출처: [Composio, "Claude Code vs OpenAI Codex" (2026-06)](https://composio.dev/content/claude-code-vs-openai-codex). 다른 비교에서는 SWE-bench Verified가 GPT-5.5 88.7% 등으로 집계돼 순위가 뒤집히기도 한다.*

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:18px 16px;margin:1.6em 0;">
<svg viewBox="0 0 720 360" width="100%" height="auto" role="img" aria-label="SWE-bench Verified, SWE-bench Pro, Terminal-Bench에서 Claude Code(Opus 4.8)와 Codex(GPT-5.5) 점수 비교 막대그래프">
  <line x1="70" y1="40" x2="70" y2="300" stroke="#8A8378" stroke-width="1"/>
  <line x1="70" y1="300" x2="690" y2="300" stroke="#23201D" stroke-width="1.5"/>
  <!-- y grid 25/50/75/100 -->
  <g font-family="sans-serif" font-size="11" fill="#8A8378">
    <line x1="70" y1="235" x2="690" y2="235" stroke="#E5DECF" stroke-width="1"/><text x="40" y="239">25</text>
    <line x1="70" y1="170" x2="690" y2="170" stroke="#E5DECF" stroke-width="1"/><text x="40" y="174">50</text>
    <line x1="70" y1="105" x2="690" y2="105" stroke="#E5DECF" stroke-width="1"/><text x="40" y="109">75</text>
    <text x="40" y="44">100</text>
  </g>
  <!-- Group 1: Verified (Claude 88.6->h230, Codex 87.6->h228) -->
  <rect x="130" y="70" width="46" height="230" fill="#C8102E"/>
  <rect x="182" y="72" width="46" height="228" fill="#23201D"/>
  <text x="179" y="316" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#23201D">SWE-bench Verified</text>
  <text x="153" y="64" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#C8102E">88.6</text>
  <text x="205" y="64" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#23201D">87.6</text>
  <!-- Group 2: Pro (Claude 69.2->h180, Codex 58.6->h152) -->
  <rect x="320" y="120" width="46" height="180" fill="#C8102E"/>
  <rect x="372" y="148" width="46" height="152" fill="#23201D"/>
  <text x="369" y="316" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#23201D">SWE-bench Pro</text>
  <text x="343" y="114" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#C8102E">69.2</text>
  <text x="395" y="142" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#23201D">58.6</text>
  <!-- Group 3: Terminal-Bench (Claude 74.6->h194, Codex 78.2->h203) -->
  <rect x="510" y="106" width="46" height="194" fill="#C8102E"/>
  <rect x="562" y="97" width="46" height="203" fill="#23201D"/>
  <text x="559" y="316" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#23201D">Terminal-Bench 2.1</text>
  <text x="533" y="100" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#C8102E">74.6</text>
  <text x="585" y="91" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#23201D">78.2</text>
  <!-- legend -->
  <rect x="430" y="20" width="12" height="12" fill="#C8102E"/><text x="448" y="30" font-family="sans-serif" font-size="12" fill="#23201D">Claude Code (Opus 4.8)</text>
  <rect x="600" y="20" width="12" height="12" fill="#23201D"/><text x="618" y="30" font-family="sans-serif" font-size="12" fill="#23201D">Codex (GPT-5.5)</text>
</svg>
<figcaption style="font-size:0.85rem;color:#8A8378;margin-top:8px;">난이도 높은 SWE-bench Pro는 Claude Code가, 터미널 실무형 Terminal-Bench는 Codex가 앞선다. 출처: Composio(2026-06).</figcaption>
</figure>

숫자가 말하는 그림은 이렇다. **쉬운 표준 벤치(Verified)는 사실상 동률, 난도 높은 리포지토리 수준 문제(Pro)는 Claude Code가, 터미널 실무형(Terminal-Bench)은 Codex가 앞선다.** 여러 리뷰가 공통적으로 지적하는 정성적 평가도 이와 맞물린다 — 블라인드 코드 리뷰에서 Claude Code의 결과물을 "더 깔끔하고 관용적"이라 평가한 비율이 높았던 반면(한 비교에서 67% 대 25%), 한 Reddit 개발자 커뮤니티 500여 명 투표에서는 "매일 쓰는 도구"로 Codex를 꼽은 비율이 약 65%였다. 후자는 정식 리서치가 아닌 비공식 투표이고, '품질'보다 레이트리밋·토큰 소진 없이 '실제로 계속 쓸 수 있느냐'를 택한 결과에 가깝다. 품질은 Claude Code, 손에 붙는 편의·속도·지속성은 Codex라는 인상이 반복된다.

Codex가 터미널·자율 실무에서 앞서는 데는 배경이 있다. GPT-5.5는 GPT-4.5 이후 처음으로 밑바닥부터 다시 훈련하며 **에이전트 우선(agentic-first)**을 명시적으로 겨냥한 모델이다. OpenAI는 Codex가 약 25시간 동안 사람 개입 없이 장시간 작업을 완주하며 수만 줄 코드를 만들어내는 시연을 공개했고, 초당 1,000토큰(1,000 TPS)에 이르는 처리량과 지속 WebSocket 연결로 왕복 지연을 크게 줄였다(첫 토큰까지 시간 약 45% 단축 등). OpenAI가 일부 추론을 엔비디아 외 Cerebras 하드웨어로 돌리기 시작한 흐름 위에 있기도 하다. '오래, 알아서, 빠르게 굴러가는' 자율성에 무게를 실은 설계라는 얘기다.

**비용과 토큰 효율**은 Codex 쪽이 유리하다는 보고가 많다. 한 리팩터링 비교 실험에서 Codex가 약 150만 토큰·15달러로 끝낸 작업을 Claude Code는 약 620만 토큰(약 4배)·155달러에 처리했다는 사례가 있다. 다만 같은 실험에서 **Claude Code는 Codex가 놓친 동시성(race condition) 버그를 잡아냈다** — 비용 우위와 코드 꼼꼼함이 맞바꿈 관계일 수 있다는 뜻이다. 이는 특정 작업의 예시일 뿐 보편 수치는 아니다. 진입 요금은 둘 다 월 20달러(ChatGPT Plus / Claude Pro)에서 시작하지만, Claude Code를 오래 물고 늘어지면 토큰 소모가 커 월 100~200달러 Max 티어로 올라가는 경우가 흔하다는 점은 감안해야 한다.

## 언제 무엇을 쓸까 — 1인 개발자·자동화 관점

그래서 실전에서는 어떻게 나눠 쓰나. 취재한 여러 개발자의 워크플로를 정리하면 다음 기준이 반복된다.

- **Claude Code를 고르는 경우**: 맥락을 넓게 봐야 하는 리팩터링, 아키텍처 설계, 여러 파일에 걸친 수정, 코드 품질과 관용성이 중요한 프로덕션 코드. 그리고 **코드를 로컬 밖으로 내보내기 꺼려지는 상황**(보안·규정). 스킬·MCP·훅으로 팀 규칙을 자동화해 두고 싶을 때도 강점이 크다.
- **Codex를 고르는 경우**: 명세가 분명한 반복 작업, 백그라운드로 던져두는 병렬 작업, 터미널 실무형 태스크, 그리고 **토큰·비용을 아껴야 하는 대량 작업.** 긴 세션에서 지시를 꾸준히 지키는 '안정감'도 Codex 쪽 강점으로 자주 꼽힌다.

작업 유형별로 정리하면 선택이 더 분명해진다.

| 작업 상황 | 더 나은 선택 | 이유 |
|---|---|---|
| 여러 파일 걸친 리팩터링·설계 | Claude Code | 넓은 맥락·대화형 통제, 코드 품질 |
| 명세 분명한 반복 작업·잡무 | Codex | 백그라운드 위임, 토큰 효율 |
| 대량·병렬 작업 | Codex | 클라우드 자율 실행, 서브에이전트 |
| 보안·규정상 로컬 유지 필요 | Claude Code | 코드가 내 기계 밖으로 안 나감 |
| 팀 규칙·워크플로 자동화 | Claude Code | 스킬·MCP·훅 생태계 |
| 비용을 빡빡하게 관리 | Codex | 동일 작업 토큰 소모가 대체로 적음 |

가장 흔한 결론은 **하이브리드**다. 많은 팀이 "Claude Code로 기능을 짜고, 병합 전 Codex로 리뷰를 돌린다"(또는 그 반대)는 식으로 둘을 조합한다. 실제로 Codex에는 이미 Claude Code 설정을 한 줄로 가져오는 임포트 기능까지 생겼다. 이는 두 진영이 서로를 경쟁자이자 보완재로 본다는 신호다.

우리 블로그가 여러 편에서 다룬 [Claude Code 경쟁 도구 비교](/blog/2026-06-27-claude-code-alternatives-comparison-2026/)의 관점과도 이어진다 — 도구를 하나로 통일하려 애쓰기보다, 작업의 성격에 맞춰 갈아 끼우는 쪽이 2026년의 현실적 정답이다.

## 한계와 주의점

어느 쪽도 만능은 아니다. 발행 전 반드시 알아둘 한계는 이렇다.

**Claude Code의 약점**: 거대한 모노레포에서는 디렉터리별 `CLAUDE.md`나 워크트리로 맥락을 층층이 쌓지 않으면 성능이 떨어진다. 긴 세션은 자동 요약(compaction)으로 컨텍스트를 압축하는데, 이 과정에서 초반 지시의 뉘앙스가 흐려질 수 있다. 토큰 소모가 커 헤비 유저에겐 비용 부담이 붙고, 오프라인 모드는 없다.

**Codex의 약점**: 클라우드 자율 실행이 강점이자 약점이다. 결과를 받아 검수하는 구조라 중간에 세밀하게 개입하기 어렵고, 코드가 외부 샌드박스를 거친다는 점이 보안·규정에 민감한 조직에는 걸림돌이다. 블라인드 리뷰에서 코드 품질·구조가 Claude Code보다 낮게 평가되는 경향도 감안해야 한다.

공통적으로, **벤치마크 점수를 곧 실무 실력으로 등치하지 말 것**. 위 표에서 봤듯 순위는 측정 방식에 따라 뒤집히고, 실제 체감은 프롬프트·설정·프로젝트 구조에 크게 좌우된다. "내 워크플로에서 30분 돌려보는 것"이 어떤 벤치마크보다 정확한 판단 기준이다.

## 결론: 경쟁이 아니라 조합

2026년의 코딩 에이전트 경쟁은 "누가 더 똑똑한가"에서 "어떤 성격이 내 작업에 맞는가"로 옮겨 갔다. Claude Code는 내 기계에서 대화하며 통제하는 정밀함과 코드 품질을, Codex는 클라우드에 위임하는 자율성과 속도·비용 효율을 대표한다. 상위 모델의 점수 차가 수 %p로 좁혀진 지금, 한쪽을 '정답'으로 못 박는 건 오히려 손해다.

흥미로운 대칭도 있다 — 2023년 전용 코드 모델 Codex는 "범용 모델이 더 낫다"는 이유로 흡수됐다가, 2025년 다시 '에이전트'라는 전용 형태로 분화해 돌아왔다. 범용 CPU가 전용 칩을 흡수했다가 GPU·NPU로 다시 분화했듯, AI 코딩 도구도 범용화와 전용화 사이를 오가는 진자 운동의 한 국면을 지나고 있는 셈이다.

그래서 이 글의 하나의 메시지는 분명하다 — **둘 중 무엇을 고를지 고민하기보다, 둘을 어떻게 조합할지 설계하라.** 설계 판단이 촘촘한 일은 Claude Code에게 맡겨 옆에서 같이 짜고, 명세가 분명한 반복·병렬 작업은 Codex에게 던져두고 검수하는 것. 그 조합을 자기 워크플로에 맞게 다듬는 사람이 2026년의 코딩 생산성 경쟁에서 앞선다.

---

### 출처

- [Composio, "Claude Code vs OpenAI Codex: 100+ Hours With Both" (2026-06)](https://composio.dev/content/claude-code-vs-openai-codex)
- [morphllm, "Codex vs Claude Code (July 2026): Benchmarks, Subagents & Limits"](https://www.morphllm.com/comparisons/codex-vs-claude-code)
- [DataCamp, "Codex vs. Claude Code: AI Coding Assistants Compared" (2026)](https://www.datacamp.com/blog/codex-vs-claude-code)
- [OpenAI Codex 공식](https://openai.com/codex/) · [Claude Code 공식 문서](https://code.claude.com/docs)

*이 글은 특정 제품의 구매를 권유하지 않으며, 도구 비교·기술 동향 해설을 목적으로 한다. 수치는 2026년 7월 기준이며 출처에 따라 편차가 있을 수 있다.*
