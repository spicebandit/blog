---
title: "AI 직원으로 운영하는 회사 만들기 — Paperclip 입문 [1편]"
description: "AI 직원으로 굴러가는 회사를 진짜로 만들 수 있을까. 오픈소스 Paperclip으로 AI 에이전트에게 직함·보고라인·예산을 주고 회사처럼 조직하는 법 — npx 한 줄 설치부터 첫 조직 설계까지."
pubDate: 2026-07-06T08:00:00+09:00
category: ai
tags: ["AI 직원", "AI 에이전트 회사", "paperclip", "멀티에이전트"]
draft: true
---

AI 직원들이 알아서 굴러가는 회사 — 공상 같지만, 지금 오픈소스 도구로 실제로 만들 수 있다. AI 에이전트를 하나 잘 쓰는 것과, 여러 개를 **조직으로 굴리는 것**은 완전히 다른 문제다. 오픈소스 도구 **Paperclip**은 이 두 번째 문제를 정면으로 다룬다 — 에이전트들을 'AI 직원'으로 두고 직함과 보고라인을 주고, 월 예산을 걸고, 승인 없이는 전략을 못 바꾸게 묶는, 말 그대로 "AI 직원으로 운영되는 회사"를 만드는 플랫폼이다. 설치는 `npx paperclipai onboard --yes` 한 줄이면 끝나고, MIT 라이선스 오픈소스라 계정도 비용도 필요 없다. [헤르메스 시리즈](/blog/2026-06-28-hermes-agent-nous-research-install-guide/)에서 에이전트 '한 명'을 채용하는 법을 다뤘다면, 이번 2부작은 그 에이전트들로 '회사'를 차리는 이야기다. 1편인 이 글은 개념과 설치·첫 세팅까지, [2편](/blog/2026-07-05-paperclip-ai-newsroom-operations/)은 실제로 열흘간 AI 신문사를 운영하며 얻은 (비싼) 교훈을 다룬다.

## Paperclip이란 — "에이전트가 직원이라면, Paperclip은 회사다"

Paperclip 공식 사이트의 소개는 한 문장이다: "Manage a team of AI agents to run your business. Org charts, budgets, governance, and goals — all in one deployment." 에이전트 팀을 조직도·예산·거버넌스·목표와 함께 한 번에 배포해 관리한다는 뜻이다. 커뮤니티에서 통용되는 비유가 더 직관적이다 — **"OpenClaw(또는 헤르메스)가 직원이라면, Paperclip은 그 직원들이 다니는 회사다."**

구체적으로 Paperclip은 Node.js 서버와 React 대시보드로 구성된 셀프호스팅 앱이다. 여기에 에이전트를 등록하면 다음이 생긴다.

| 개념 | 회사에서의 의미 | Paperclip에서의 동작 |
|------|----------------|---------------------|
| Org Chart | 직함·보고라인 | 에이전트마다 역할·상급자·권한 지정 |
| Goal | 회사 미션·분기 목표 | 모든 작업이 목표에 연결돼 추적됨 |
| Issue | 업무 티켓 | 에이전트에 배정, 진행·코멘트 기록 |
| Heartbeat | 출근 | 에이전트가 스케줄에 따라 깨어나 할 일 확인 |
| Budget | 부서 예산 | 에이전트별 월 토큰 예산, 초과 시 자동 정지 |
| Governance | 이사회 결재 | 채용·전략 변경에 사람의 승인 필요 |

핵심 설계 철학은 마지막 두 줄에 있다. 에이전트가 폭주해도 **예산에서 멈추고**("When they hit the limit, they stop" — 공식 문구), 중요한 결정은 **사람 승인 없이 못 넘어간다**("You're in charge. Approve hires, override strategy, pause or terminate any agent at any time"). 자율 에이전트의 가장 큰 불안 두 가지 — 비용 폭주와 통제 상실 — 를 회사라는 오래된 제도의 장치로 눌러 놓은 것이다.

에이전트 종류를 가리지 않는다는 점도 실용적이다. 공식 문서 기준으로 Claude Code, Codex, Cursor, OpenClaw, HTTP/웹훅 봇, Bash 에이전트까지 붙는다. 슬로건대로 "If it can receive a heartbeat, it's hired" — 하트비트를 받을 수 있으면 채용된다.

![화이트보드 앞에 모인 팀](https://images.unsplash.com/photo-1681949270990-cecd4728d2e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxvcmdhbml6YXRpb24lMjBjaGFydCUyMHRlYW13b3JrJTIwb2ZmaWNlfGVufDF8MHx8fDE3ODMyMTY3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Sable Flow](https://unsplash.com/@sableflow?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-group-of-women-standing-around-a-white-board-pNodosEZ5Oc?utm_source=spice-bandit-blog&utm_medium=referral)*

## 왜 '회사' 메타포인가 — 멀티에이전트의 오래된 난제

에이전트를 여러 개 돌려본 사람이라면 안다. 두세 개까지는 채팅창 몇 개로 버티지만, 그 이상이 되면 세 가지 질문이 터진다. **누가 무슨 일을 하고 있는가**(가시성), **누가 누구에게 시키는가**(권한), **얼마나 쓰고 있는가**(비용). 이건 사실 AI의 문제가 아니라 조직의 문제고, 인류는 이 문제를 수백 년간 회사라는 제도로 풀어왔다. 직함, 보고라인, 결재, 예산 — Paperclip은 이 검증된 장치들을 소프트웨어로 옮겼을 뿐이다.

역사를 조금만 들추면 이 메타포의 무게가 보인다. 주식회사라는 제도는 1602년 네덜란드 동인도회사까지 거슬러 올라가지만, 그때 발명된 것은 자본을 모으는 장치였지 사람을 관리하는 장치가 아니었다. 직함·보고라인·내부 결재 같은 **경영 계층**이 처음 체계화된 곳은 19세기 미국의 철도회사다 — 수천 킬로미터에 흩어진 직원과 열차를 소유주 한 사람의 눈으로 볼 수 없게 되자, 중간관리자와 보고 체계와 내부 회계가 발명됐다. 경영사학자 앨프리드 챈들러가 『보이는 손』(1977)에서 정리한 이 이야기는 정확히 위의 세 질문 — 가시성·권한·비용 — 에 대한 답이었다. 에이전트가 늘어나자 조직도가 필요해진 지금 상황은, 철도가 길어지자 관리자가 필요해진 그때의 반복인 셈이다.

이 접근이 유일한 답은 아니다. 스크립트로 에이전트들을 파이프라인처럼 엮는 방식(오케스트레이션 프레임워크), 에이전트끼리 자유롭게 대화하게 두는 방식(스웜)도 있다. Paperclip의 차별점은 **사람이 이사회 의장으로 상주하는 위계 구조**라는 데 있다. 모든 대화가 티켓으로 추적되고("Every conversation traced. Every decision explained.") 최종 권한은 항상 사람에게 남는다. 1인 기업가가 "내 밑에 AI 부서를 두는" 그림에 가장 가까운 형태다.

## 설치 — npx 한 줄, 5분 세팅

요구사항은 **Node.js 20 이상, pnpm 9.15 이상** 두 가지다. 준비됐다면:

```bash
npx paperclipai onboard --yes
```

이 한 줄이 하는 일: ① 내장 PostgreSQL 데이터베이스를 자동 생성하고(별도 DB 설치 불필요) ② API 서버를 `http://localhost:3100`에 띄우고 ③ React 대시보드를 연다. 모든 것이 내 컴퓨터 안에서 돈다 — Paperclip 계정도, 외부 서버도 없다. 소스로 받고 싶다면 GitHub에서 클론해도 된다.

```bash
git clone https://github.com/paperclipai/paperclip.git
cd paperclip && pnpm install && pnpm dev
```

다음은 회사 설립이다. CLI로:

```bash
paperclipai company create --name "MyStartup" --goal "블로그를 성장시킨다"
```

대시보드에서 GUI로 해도 같다. 여기까지 하면 빈 회사가 생긴다 — 이제 직원(에이전트)을 채용할 차례다.

## 첫 조직 설계 — 미니멀하게 시작하라

에이전트 등록은 대시보드의 Agents 메뉴에서 한다. 등록 시 정하는 것은 크게 네 가지다.

1. **종류** — Claude Code, Codex, Cursor, OpenClaw 등 어떤 실행기를 붙일지
2. **작업 디렉터리** — 이 에이전트가 파일을 읽고 쓸 프로젝트 폴더 (예: 블로그 저장소)
3. **모델** — 에이전트별로 다르게 배정할 수 있다. 관리직이라고 무조건 최상위 모델을 줄 필요가 없다는 걸 나는 비싸게 배웠다(2편 참고)
4. **지시문(instructions)** — 그 에이전트의 '직무기술서'. 역할, 품질 기준, 보고 방식, 하지 말아야 할 일을 여기에 적는다

등록을 마치면 거버넌스가 작동하기 시작한다. 예컨대 편집장 에이전트가 "기자를 한 명 더 채용하자"고 제안하면 그 채용은 이사회(사람)의 승인 대기 상태로 멈추고, 대시보드에 결재 항목으로 올라온다. 발행·배포처럼 대외적 영향이 있는 작업도 마찬가지로 승인 관문을 걸 수 있다. 티켓(이슈) 하나하나에 어떤 에이전트가 무슨 코멘트를 달고 어떤 결정을 했는지가 전부 기록되므로, 나중에 "왜 이렇게 됐지?"를 추적할 수 있다 — 공식 문구 그대로 "Every conversation traced. Every decision explained." 이때 조직을 어떻게 짜느냐가 사실상 Paperclip 사용의 전부인데, 내가 실제 운영(2편에서 상세)에서 배운 원칙은 하나다: **사람 회사를 흉내 내지 말고, 일에서 역으로 설계하라.**

블로그 운영을 예로 들면 이런 최소 구성이 가능하다.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 12px 8px;">
<svg viewBox="0 0 640 260" width="100%" height="auto" role="img" aria-label="블로그 운영용 최소 AI 조직도. 사람(이사회) 아래 편집장 에이전트, 그 아래 기자 에이전트와 개발 에이전트가 있는 3단 구조.">
  <text x="12" y="22" fill="#23201D" font-size="15" font-weight="bold">블로그 운영용 최소 조직도 예시 (사람 1 + 에이전트 3)</text>
  <rect x="240" y="40" width="160" height="40" fill="#C8102E" rx="6"/>
  <text x="320" y="65" fill="#FAF6EE" font-size="14" font-weight="bold" text-anchor="middle">나 (이사회·승인)</text>
  <line x1="320" y1="80" x2="320" y2="110" stroke="#8A8378" stroke-width="2"/>
  <rect x="240" y="110" width="160" height="40" fill="#23201D" rx="6"/>
  <text x="320" y="135" fill="#FAF6EE" font-size="13" text-anchor="middle">편집장 에이전트</text>
  <line x1="320" y1="150" x2="180" y2="185" stroke="#8A8378" stroke-width="2"/>
  <line x1="320" y1="150" x2="460" y2="185" stroke="#8A8378" stroke-width="2"/>
  <rect x="100" y="185" width="160" height="40" fill="#E5DECF" rx="6"/>
  <text x="180" y="210" fill="#23201D" font-size="13" text-anchor="middle">기자 에이전트</text>
  <rect x="380" y="185" width="160" height="40" fill="#E5DECF" rx="6"/>
  <text x="460" y="210" fill="#23201D" font-size="13" text-anchor="middle">개발(CTO) 에이전트</text>
  <text x="12" y="248" fill="#8A8378" font-size="11">* 콘텐츠 승인권은 사람이 보유. 편집장이 기자에게 위임, 개발 에이전트는 코드·배포만 담당.</text>
</svg>
<figcaption style="color:#8A8378;font-size:0.85em;margin-top:6px;">직함이 아니라 권한 경계가 핵심이다 — 누가 발행할 수 있고, 누가 코드를 만질 수 있는가.</figcaption>
</figure>

여기서 두 가지만 미리 강조한다(자세한 근거는 2편에서).

- **하트비트는 아껴라.** 하트비트는 에이전트를 주기적으로 깨우는 출근 스케줄인데, 짧게 잡을수록 토큰이 기하급수로 샌다. 처음엔 전부 '필요할 때만 깨우기(wake-on-demand)'로 두고, 정말 상시 감시가 필요한 에이전트에만 하트비트를 켜라.
- **예산부터 걸어라.** 에이전트별 월 예산은 사후 장치가 아니라 사전 안전벨트다. 소액으로 시작해서 늘리는 쪽이 반대 방향보다 훨씬 싸다.

## 헤르메스와 뭐가 다른가 — 계층이 다르다

[헤르메스](/blog/2026-06-28-hermes-agent-nous-research-install-guide/) 같은 에이전트와 Paperclip은 경쟁 관계가 아니라 **계층 관계**다. 헤르메스·Claude Code·OpenClaw가 '일하는 개인'이라면, Paperclip은 그 개인들을 묶는 '조직 인프라'다. 실제로 Paperclip에 등록되는 에이전트가 바로 이런 도구들이다.

| | 에이전트 (헤르메스 등) | Paperclip |
|---|---|---|
| 하는 일 | 실제 작업 수행 (코딩·리서치·글쓰기) | 작업 배분·추적·예산·승인 |
| 비유 | 직원 | 회사 (인사·재무·결재 시스템) |
| 필요해지는 시점 | 지금 당장 | 에이전트가 3개 이상, 서로 협업할 때 |
| 모델 종속 | 모델별 상이 | 모델 불문 ("Model-Agnostic") |

그래서 도입 순서도 자연스럽다. 먼저 에이전트 하나를 제대로 부려보고([헤르메스 1편](/blog/2026-06-28-hermes-agent-nous-research-install-guide/)·[2편](/blog/2026-06-29-hermes-agent-practical-use-cases/)), 로컬 모델로 비용 구조를 익히고([3편](/blog/2026-07-05-hermes-agent-lm-studio-local-llm/)), 에이전트가 늘어나 관리가 버거워지는 순간 Paperclip을 씌우는 것이다.

## So What — '에이전트 관리'가 다음 병목이다

2023년이 "AI가 글을 쓸 수 있네"의 해였고 2024~25년이 "AI가 일을 할 수 있네"의 해였다면, 지금의 병목은 명확히 **"일하는 AI들을 어떻게 관리하나"**로 옮겨왔다. 개인용 에이전트는 이미 차고 넘친다. 부족한 것은 그것들을 묶는 관리 계층이고, Paperclip은 그 계층을 회사라는 가장 익숙한 제도로 구현한 오픈소스 시도다.

다만 미리 말해두면 — 조직은 공짜가 아니다. 사람 회사에 관리비용이 있듯 AI 회사에도 있고, 그 비용은 토큰으로 청구된다. 다음 편에서는 실제로 이 도구 위에 AI 신문사를 차려 열흘간 돌리면서 겪은 일들을 공개한다. 사흘 만에 3억 토큰이 증발한 사건, 같은 알림이 세 번 오던 버그의 원인, 그리고 "1인 블로그에 5명짜리 AI 회사는 과잉이었나"라는 질문까지.

---

**AI 에이전트 조직 시리즈**
- 1편 — Paperclip 입문: 개념·설치·첫 조직 설계 (이 글)
- 2편 — Paperclip 실전 운영기: AI 신문사 한 달의 교훈 (내일 발행)

**헤르메스 AI 시리즈**: [1편 설치](/blog/2026-06-28-hermes-agent-nous-research-install-guide/) · [2편 실전 활용](/blog/2026-06-29-hermes-agent-practical-use-cases/) · [3편 LM Studio 연동](/blog/2026-07-05-hermes-agent-lm-studio-local-llm/)

**출처**
- [Paperclip 공식 사이트](https://paperclip.ing/) (소개 문구, 기능 목록, 라이선스)
- [Paperclip GitHub 저장소](https://github.com/paperclipai/paperclip) (설치 명령, 요구사항, 지원 에이전트)
- [Paperclip 공식 문서](https://paperclipai-paperclip.mintlify.app/) (퀵스타트, heartbeat·budget·governance 개념)
