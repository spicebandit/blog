---
title: "페이퍼클립에 클로드 코드 붙이는 두 방법 — MCP 연동 [3편]"
description: "페이퍼클립이 2026년 10월 MCP 연동을 열었습니다. 기존 Process Adapter가 클로드 코드를 '직원'으로 돌리는 방식이라면, 새 Assistant Connection은 클로드 코드가 '로그인 사용자'로 팀에 합류하는 반대 방향입니다. 두 방식의 차이와 전제조건을 정리했습니다."
pubDate: 2026-10-15T16:52:41+09:00
category: ax
tags: ["Paperclip", "클로드코드", "MCP", "AI 에이전트 회사"]
draft: true
---

[1편](/blog/2026-07-05-paperclip-ai-agent-company-guide/)과 [2편](/blog/2026-07-09-paperclip-ai-agent-company-how-to/)을 쓴 7월 이후 페이퍼클립에 **릴리스가 열두 번**(패치 포함, 기능 릴리스만 세면 아홉 번) 나왔습니다. 그중 가장 구조적인 변화는 2026년 10월 12일 릴리스의 **"Assistant Connection (MCP)"**입니다. 한 줄로 요약하면 **클로드 코드가 페이퍼클립에 로그인 사용자로 접속해 팀의 일원처럼 행동할 수 있게 됐습니다.**

여기서 많이 헷갈립니다. 페이퍼클립은 **원래도** 클로드 코드를 붙일 수 있었습니다. 그런데 그건 **방향이 반대**입니다. 이 글의 핵심은 그 두 방향을 구분하는 것입니다.

> ⚠️ **먼저 밝힙니다.** 이 글은 **설치해서 직접 연동해 본 기록이 아닙니다.** 페이퍼클립 공식 문서와 GitHub 릴리스 노트를 근거로 정리한 것이고, 화면·설정 키·절차는 모두 1차 자료에서 인용했습니다. 실제 동작 화면과 다를 수 있는 부분은 본문에 표시했습니다.

**가장 먼저 답이 필요한 세 가지**

| 질문 | 답 |
|---|---|
| **무엇이 새로 생겼나?** | Connections에 **"Assistant Connection (MCP)"** 카드. 클로드 코드·Codex·OpenCode·일반 MCP 클라이언트가 **브라우저 OAuth 또는 device-code 동의**로 접속해 **로그인한 사용자로서** 행동합니다 |
| **기존 방식과 뭐가 다른가?** | 방향이 반대입니다. 기존(Process Adapter)은 **페이퍼클립이 클로드 코드를 자식 프로세스로 실행**하는 것이고, 새 방식은 **클로드 코드가 페이퍼클립에 접속**하는 것입니다 |
| **바로 쓸 수 있나?** | 아직 **실험 기능**입니다. `Settings → Experimental → "Assistant connections (MCP)"`를 켜야 하고 **HTTPS `PAPERCLIP_PUBLIC_URL`**이 필요합니다 |

![회의실의 팀](https://images.pexels.com/photos/7869111/pexels-photo-7869111.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Pavel Danilyuk](https://www.pexels.com/@pavel-danilyuk) on [Pexels](https://www.pexels.com/photo/colleagues-in-meeting-at-office-7869111/)*

## 두 방향 — 누가 누구를 고용하는가

답부터: **Process Adapter는 페이퍼클립이 사장, MCP 연동은 클로드 코드가 동료**입니다.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px;margin:24px 0;">
<svg viewBox="0 0 760 330" style="width:100%;height:auto" role="img" aria-label="페이퍼클립과 클로드 코드를 연결하는 두 방향 비교 그림. 위쪽 Process Adapter는 페이퍼클립이 클로드 코드를 자식 프로세스로 실행해 직원처럼 일을 시키는 방향이고, 아래쪽 Assistant Connection은 클로드 코드가 MCP로 페이퍼클립에 로그인 사용자로 접속해 태스크를 읽고 만들고 위임하는 방향이다.">
<text x="0" y="18" font-size="15" font-weight="700" fill="#23201D">같은 두 도구, 정반대 방향 — 화살표가 어디서 어디로 가는지가 전부입니다</text>
<!-- 기존 방식 -->
<text x="0" y="48" font-size="12.5" font-weight="700" fill="#4E7FA8">기존 — Process Adapter (adapterType: claude_local)</text>
<rect x="0" y="58" width="190" height="62" fill="#4E7FA8" rx="4" />
<text x="16" y="84" font-size="13" font-weight="700" fill="#FAF6EE">페이퍼클립</text>
<text x="16" y="104" font-size="11" fill="#E5DECF">사장 — 일을 시킴</text>
<line x1="190" y1="89" x2="320" y2="89" stroke="#4E7FA8" stroke-width="2.5" />
<path d="M320 89 L310 84 L310 94 Z" fill="#4E7FA8" />
<text x="200" y="80" font-size="11" fill="#8A8378">자식 프로세스로 실행</text>
<text x="200" y="106" font-size="11" fill="#8A8378">(같은 머신)</text>
<rect x="320" y="58" width="190" height="62" fill="#A8BDD2" rx="4" />
<text x="336" y="84" font-size="13" font-weight="700" fill="#23201D">클로드 코드</text>
<text x="336" y="104" font-size="11" fill="#23201D">직원 — 일을 받음</text>
<text x="528" y="80" font-size="11" fill="#8A8378">일감이 위에서 내려옴</text>
<text x="528" y="106" font-size="11" fill="#8A8378">하트비트로 돌아감</text>
<!-- 구분선 -->
<line x1="0" y1="146" x2="760" y2="146" stroke="#E5DECF" stroke-width="1" />
<!-- 신규 방식 -->
<text x="0" y="178" font-size="12.5" font-weight="700" fill="#1B4F8A">신규(2026-10-12) — Assistant Connection (MCP)</text>
<rect x="0" y="188" width="190" height="62" fill="#A8BDD2" rx="4" />
<text x="16" y="214" font-size="13" font-weight="700" fill="#23201D">페이퍼클립</text>
<text x="16" y="234" font-size="11" fill="#23201D">일하는 곳 — 접속 대상</text>
<line x1="320" y1="219" x2="190" y2="219" stroke="#1B4F8A" stroke-width="2.5" />
<path d="M190 219 L200 214 L200 224 Z" fill="#1B4F8A" />
<text x="200" y="210" font-size="11" fill="#8A8378">OAuth·device-code로 접속</text>
<text x="200" y="236" font-size="11" fill="#8A8378">(로그인 사용자 자격)</text>
<rect x="320" y="188" width="190" height="62" fill="#1B4F8A" rx="4" />
<text x="336" y="214" font-size="13" font-weight="700" fill="#FAF6EE">클로드 코드</text>
<text x="336" y="234" font-size="11" fill="#E5DECF">동료 — 일을 만들고 맡김</text>
<text x="528" y="210" font-size="11" fill="#8A8378">내가 쓰던 클로드 코드가</text>
<text x="528" y="236" font-size="11" fill="#8A8378">회사 업무에 손을 뻗음</text>
<text x="0" y="288" font-size="12" fill="#8A8378">※ 둘은 배타적이지 않습니다. 직원으로 돌리는 에이전트와, 내가 쓰는 클로드 코드를 동시에 둘 수 있습니다.</text>
<text x="0" y="310" font-size="12" fill="#8A8378">※ MCP 쪽은 아직 Experimental 플래그가 필요한 실험 기능입니다.</text>
</svg>
<figcaption style="font-size:13px;color:#8A8378;margin-top:10px;">같은 두 이름이 등장하지만 역할이 뒤바뀝니다. 기존 방식에서 클로드 코드는 지시를 받는 직원이고, 새 방식에서는 태스크를 만들고 위임하는 쪽입니다. 출처: 페이퍼클립 공식 문서 및 v2026.1012.0 릴리스 노트(2026-10-15 확인).</figcaption>
</figure>

이 구분이 왜 중요한가. **2편에서 설명한 "AI 직원 회사"는 위쪽 방향**입니다. 에이전트를 정의하고, 하트비트로 돌리고, 예산을 걸어 통제하는 구조죠. 새로 생긴 것은 **아래쪽** — 내가 평소 쓰는 클로드 코드가 그 회사의 업무 시스템에 직접 손을 뻗는 경로입니다.

## 기존 방식 — Process Adapter로 클로드 코드를 '직원'으로

답부터: **`adapterType: "claude_local"`**로 설정하면 페이퍼클립이 로컬 `claude` CLI를 자식 프로세스로 실행합니다. 공식 문서는 이를 "세션 지원과 스킬 통합을 포함해 Anthropic의 Claude CLI를 실행한다"고 설명합니다.

설정 키는 이렇게 생겼습니다.

| 설정 키 | 역할 |
|---|---|
| `adapterType` | `claude_local` — 클로드 코드용 어댑터 |
| `command` | 실행할 명령 (`claude`) |
| `cwd` | 작업 디렉터리. **세션 재개 조건에 관여** |
| `instructionsFilePath` | 여기 적힌 지침이 **모든 프롬프트 앞에 붙습니다** |
| `model` / `effort` | 모델과 사고 강도 |
| `maxTurnsPerRun` | 한 번의 실행에서 허용할 최대 턴 |
| `promptTemplate` | `{{agent.name}}`·`{{agent.id}}`·`{{context.*}}` 치환 지원 |
| `env` | 환경변수 (API 키 등) |
| `timeoutSec` / `graceSec` | 실행 제한 시간과 SIGTERM 후 유예 |
| `dangerouslySkipPermissions` | **권한 확인 생략 플래그.** 문서 예시는 `false`입니다. 자율 실행을 위해 켜는 유혹이 있는데, 에이전트가 사람 승인 없이 파일·명령을 집행하게 된다는 뜻이므로 격리된 환경에서만 고려할 항목입니다 |

**알아둘 제약 네 가지** (공식 문서 기준)

1. **타임아웃 기본 900초.** 초과하면 SIGTERM을 보내고 유예 뒤 SIGKILL입니다. 긴 작업은 이 값을 늘려야 합니다
2. **`maxTurnsPerRun`을 넘기면 세션이 초기화**됩니다
3. **세션 재개는 조건부** — 에이전트에 저장된 `sessionId`가 있고 **`cwd`가 저장된 작업 디렉터리와 일치할 때만** 이어집니다. 작업 폴더를 바꾸면 맥락이 이어지지 않습니다
4. **단일 머신 전제.** 공식 문서는 Process Adapter가 "개발용에 적합"하고 **분산 실행은 HTTP 어댑터**가 맞다고 안내합니다

여기서 하나 주의할 게 있습니다. **공식 문서의 모델 목록이 릴리스보다 늦습니다.** 문서에는 Claude Opus 4.6·Sonnet 4.5(권장)·Haiku 4.5가 적혀 있는데, 10월 12일 릴리스 노트는 **클로드 코드 에이전트에 Claude Sonnet 5.5를 Low~Max effort로 선택할 수 있다**고 합니다.

그렇다고 "릴리스 노트를 보고 적으면 된다"고 말할 수는 없습니다. **릴리스 노트는 표시명만 주고 설정에 넣을 모델 ID 문자열을 공개하지 않습니다.** 그래서 `model` 값은 **제품 UI의 모델 메뉴에서 확인하는 쪽이 안전**합니다. 두 가지를 더 챙겨야 합니다.

- **`effort` 허용값이 다릅니다.** 문서의 Process Adapter 설정은 `low`·`medium`·`high`를 예시로 듭니다. 릴리스 노트가 말하는 "Max effort"가 프로세스 어댑터 설정값으로 그대로 들어가는지는 **확인하지 못했습니다**
- **샌드박스 이미지 재빌드 조건이 있습니다.** 릴리스 노트 원문 — "**Claude Code 2.1.284보다 오래된 버전으로 빌드한 커스텀 샌드박스 이미지는 CLI 경로에서 Sonnet 5.5가 동작하기 전에 다시 빌드해야 한다**". 같은 릴리스에서 하네스 핀이 Claude Code 2.1.286으로 올라갔습니다

## 새 방식 — Assistant Connection (MCP)로 팀에 합류

답부터: **Connections의 "Assistant Connection (MCP)" 카드**를 통해 클로드 코드가 접속합니다. 릴리스 노트 원문은 이렇습니다.

> Connections의 새 "Assistant Connection (MCP)" 카드는 Claude Code, Codex, OpenCode, 일반 MCP 클라이언트가 브라우저 OAuth 또는 device-code 동의를 통해 페이퍼클립에 접속해 **로그인한 사용자로서 행동**하게 합니다.

**접속한 클로드 코드가 할 수 있는 일**

| 할 수 있는 것 | 의미 |
|---|---|
| 태스크 **읽기·검색** | 회사에 어떤 일이 돌고 있는지 조회 |
| 일 **만들고 위임** | 태스크를 생성해 다른 에이전트에게 넘김 |
| **사람 코멘트** 남기기 | 에이전트 코멘트가 아니라 사람 자격의 코멘트 |
| 문서·**산출물 읽기** | 에이전트가 만든 결과물에 접근 |
| **서명된 이벤트 웹훅**으로 결과 추적 | 일이 끝났는지 따라갈 수 있음 |

통제 장치도 함께 들어 있습니다 — **쓰기 권한 제한**(읽기 전용으로 묶기)과 **단일 회사 고정**(하나의 회사에만 접근하게 핀)이 옵션으로 제공됩니다. 로그인 사용자 권한을 그대로 빌려주는 구조이므로, 이 두 옵션은 켜고 시작하는 쪽이 안전합니다.

**켜는 절차 (공식 릴리스 노트 기준)**

1. `Settings → Experimental → "Assistant connections (MCP)"` 활성화 — **아직 실험 기능**입니다(설정 키 `enablePublicMcp`). 릴리스 노트는 이 스위치가 "공개 MCP 엔드포인트를 노출하며 `PAPERCLIP_PUBLIC_URL`이 HTTPS 오리진이어야 한다"고 적습니다
2. **HTTPS `PAPERCLIP_PUBLIC_URL`** 설정 — OAuth 리다이렉트가 필요하므로 HTTP 로컬호스트로는 안 됩니다
3. Connections에서 **Assistant Connection (MCP)** 카드로 클라이언트를 연결 (브라우저 OAuth 또는 device-code)
4. 로컬 stdio 클라이언트는 **`paperclip mcp` CLI 브리지**를 device login과 함께 사용

2번이 실질적인 관문입니다. 2편에서 설명한 로컬 실행(`npx`로 띄우고 localhost로 접속) 상태라면 **HTTPS 공개 URL을 먼저 마련해야** 합니다.

**여기서 헷갈리기 쉬운 게 하나 있습니다.** 8월 24일 릴리스에 Tailscale 기반 HTTPS 노출 기능(`PAPERCLIP_MANAGED_RUNTIME_HTTPS`)이 들어왔지만, **이건 다른 레이어입니다.** 릴리스 노트가 대상을 명확히 적어뒀습니다 — "관리형 **워크트리 런타임**"을 `tailscale_https`로 노출하는 것이고, 해결하려는 문제는 "**에이전트의 브랜치 프리뷰**를 폰이나 다른 컴퓨터에서 못 보던 것"입니다. 즉 **에이전트 작업물 미리보기용**이고, MCP가 요구하는 `PAPERCLIP_PUBLIC_URL`(페이퍼클립 본체의 HTTPS 오리진)과는 관계가 없습니다.

같은 릴리스가 언급한 **TLS 종단 플랫폼(Railway·Render·Fly 등) 뒤에 두는 구성**이 공개 HTTPS 오리진을 얻는 더 직접적인 경로로 보입니다. 다만 **이 부분은 실제로 확인하지 못했습니다** — 설치해서 세워본 결과가 아닙니다.

![공장의 자동화 설비](https://images.unsplash.com/photo-1647427060118-4911c9821b82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMGF1dG9tYXRpb24lMjBtYWNoaW5lcnl8ZW58MXwwfHx8MTc5MjA1MDQyN3ww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Simon Kadula](https://unsplash.com/@simonkadula?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-factory-filled-with-lots-of-orange-machines-8gr6bObQLOI?utm_source=spice-bandit-blog&utm_medium=referral)*

## 그래서 무엇을 고를까

답부터: **일을 자동으로 돌리고 싶으면 Process Adapter, 내가 지휘하면서 회사를 쓰고 싶으면 MCP**입니다.

| 목적 | 고를 것 | 이유 |
|---|---|---|
| 사람 없이 **밤새 일이 돌아가게** | **Process Adapter** | 하트비트로 주기 실행되는 '직원'이 필요합니다. MCP 연결은 내 클라이언트가 접속해 있는 동안 동작하는 구조로 보입니다(자료에 명시된 서술은 아닙니다) |
| 내가 쓰는 클로드 코드에서 **회사 업무를 조회·지시** | **Assistant Connection (MCP)** | 태스크 검색·생성·위임이 내 세션에서 바로 됩니다 |
| 원격·여러 머신에 **분산 실행** | **HTTP 어댑터** | 공식 문서가 Process Adapter는 단일 머신·개발용이라고 명시합니다 |
| 결과물을 **내 쪽 파이프라인으로 끌어오기** | **MCP + 이벤트 웹훅** | 문서·산출물 읽기와 서명된 웹훅 추적이 한 경로에 있습니다 |
| 권한을 **최소로 묶고 실험만** | **MCP (읽기 전용 + 단일 회사 고정)** | 두 옵션으로 범위를 좁힐 수 있습니다 |

둘은 배타적이지 않습니다. **직원으로 돌리는 에이전트를 그대로 두고, 그 위에 내 클로드 코드를 동료로 붙이는 조합**이 실제로는 가장 자연스러운 그림입니다.

## 2편 이후 바뀐 것들 — 글 보고 따라오신 분께

답부터: **기본 UI가 바뀌었습니다.** 2편의 화면 설명이 지금과 다릅니다.

| 변경 | 언제 | 2편 독자가 알아야 할 점 |
|---|---|---|
| **채팅형 태스크가 기본** | 8/24 | 2편에서 설명한 **이슈형 화면(페이지 헤더 + 코멘트 스레드 + Properties 사이드바)은 선택지로 밀렸습니다.** `enableClassicTaskInterface` 설정으로 되돌릴 수 있지만, 채팅 전용 기능은 거기서 동작하지 않습니다 |
| **Decisions — propose/decide 워크플로** | 8/17 | 의사결정이 1급 기능이 됐습니다. 승인 흐름을 다시 볼 가치가 있습니다 |
| **Import/Export가 Cloud Sync를 대체** | 8/17 | 회사 데이터 이전 방식이 바뀌었습니다 |
| **릴리스 채널 분리** | 8/17 | canary → nightly → beta → stable. 안정성을 원하면 채널을 지정하세요 |
| **AI 자격증명이 Connections로 이관** | 9/16 | 2편의 환경변수 중심 키 관리와 위치가 달라졌습니다 |
| **GitHub 접근이 "공유 토큰"에서 "신원"으로** | 9/16 | 토큰 하나를 돌려쓰는 구조가 아니게 됐습니다 |
| **에이전트 전용 이메일**(AgentMail) | 9/16 | 에이전트가 자기 메일 주소를 갖습니다 |
| **에이전트가 PR 리뷰**(예약 봇) | 10/1 | 코드 리뷰를 에이전트에게 상설로 맡길 수 있습니다 |
| **스킬 GitHub 동기화** | 10/5 | 스킬 라이브러리를 저장소에서 동기화합니다 |
| **Slack 양방향** | 10/5 | 알림만이 아니라 양쪽으로 오갑니다 |

이 중 **첫 줄 하나가 2편을 따라오는 분께 가장 혼란**을 줍니다. 글의 흐름 자체가 틀린 건 아니지만, 기본 화면이 달라져서 설명과 눈앞의 화면이 어긋납니다.

## 전제조건과 함정

실제로 붙이기 전에 확인할 것들입니다.

1. **실험 기능입니다.** `Settings → Experimental`에서 켜야 하고, 실험 기능은 사양이 바뀔 수 있습니다. 운영 업무에 바로 끼우기 전에 분리된 회사(company)로 시험하는 편이 안전합니다
2. **HTTPS 공개 URL이 필수입니다.** 로컬 localhost 구성이라면 이 단계가 가장 오래 걸립니다
3. **권한은 로그인 사용자 수준입니다.** 접속한 어시스턴트가 "나"로서 행동하므로, **읽기 전용 제한과 단일 회사 고정을 먼저 켜고** 범위를 넓히는 순서를 권합니다
4. **공식 문서가 릴리스보다 늦습니다.** 확인한 시점(2026-10-15) 기준으로 호스팅 문서 색인에 **MCP 전용 페이지가 없고**, 모델 목록도 구버전입니다. **GitHub 릴리스 노트가 더 최신**입니다
5. **문서에 없는 화면은 바뀔 수 있습니다.** 이 글의 절차는 릴리스 노트 서술 기준이므로, 실제 카드 위치·문구는 버전에 따라 다를 수 있습니다

## So What — 역할이 뒤집힌 게 핵심입니다

페이퍼클립의 원래 그림은 **"AI 직원들이 모인 회사를 내가 경영한다"**였습니다. 1·2편이 그 이야기였습니다. MCP 연동이 더한 것은 기능 하나가 아니라 **관계의 역전**입니다. 이제 **내가 쓰는 코딩 에이전트가 그 회사의 업무 시스템에 직접 접근**합니다.

실무적으로 이게 왜 의미가 있나. 지금까지 "AI 에이전트 회사"의 약점은 **내 일상 작업과 분리돼 있다는 점**이었습니다. 회사는 회사대로 돌고, 나는 터미널에서 따로 일하고, 둘을 잇는 건 사람의 손이었습니다. MCP 연결은 **그 사이의 손을 지웁니다** — 내 클로드 코드가 회사의 태스크를 읽고, 만들고, 위임하고, 산출물을 가져옵니다.

그래서 권하는 순서는 이렇습니다.

1. **읽기 전용 + 단일 회사 고정**으로 먼저 붙여, 내 클로드 코드가 회사 상태를 **조회**만 하게 해본다
2. 조회가 쓸 만하다고 판단되면 쓰기를 열어 **태스크 생성·위임**까지 넓힌다
3. 밤새 돌 일은 여전히 **Process Adapter 직원**에게 맡기고, MCP는 **내가 지휘하는 창구**로 쓴다

**두 방향을 섞어 쓰는 게 목표 지점이고, 어느 하나로 다른 하나를 대체하려는 시도는 방향을 잘못 읽은 것입니다.** 하나는 자동 실행, 하나는 내 지휘 창구입니다.

---

**함께 보면 좋은 글**
- [AI 직원으로 운영하는 회사 만들기 — Paperclip 입문 [1편]](/blog/2026-07-05-paperclip-ai-agent-company-guide/)
- [Paperclip 실전 사용법 — AI 직원 회사 세팅·운영 [2편]](/blog/2026-07-09-paperclip-ai-agent-company-how-to/)
- [클로드 코드 사용방법 — 클로드 앱에서 터미널 없이 시작하기](/blog/2026-10-15-claude-app-claude-code-how-to-use/)

**출처**
- [Paperclip v2026.1012.0 릴리스 노트](https://github.com/paperclipai/paperclip/releases/tag/v2026.1012.0) — Assistant Connection (MCP), 접속 방식·권한·전제조건, 모델 지원
- [Paperclip 릴리스 목록](https://github.com/paperclipai/paperclip/releases) — 7월 이후 변경 이력(채팅형 기본, Decisions, Connections 개편 등)
- [Process Adapter 공식 문서](https://mintlify.wiki/paperclipai/paperclip/agents/process-adapter.md) — `claude_local` 설정 키와 제약(타임아웃·턴 제한·세션 재개·단일 머신)
- [Agent Integration 공식 문서](https://mintlify.wiki/paperclipai/paperclip/agents/overview.md) — 어댑터 체계
- [Paperclip 공식 문서 색인](https://mintlify.com/paperclipai/paperclip/llms.txt) — 확인 시점에 MCP 전용 페이지가 없다는 근거
- [Paperclip GitHub 저장소](https://github.com/paperclipai/paperclip)

*※ 이 글은 설치·실측이 아니라 2026년 10월 15일 기준 공식 문서와 릴리스 노트를 근거로 작성했습니다. 실험 기능이라 화면과 사양이 바뀔 수 있으니, 적용 전 릴리스 노트를 다시 확인하세요.*
