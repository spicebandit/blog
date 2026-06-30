---
title: "헤르메스 AI 설치·셋팅 완전 가이드 [1편]"
description: "Nous Research의 자율 AI 에이전트 Hermes Agent를 터미널에서 5분 만에 설치하는 방법, 초기 설정, 핵심 특징을 단계별로 설명합니다. 2편(실전 사용법)으로 연결되는 시리즈 1편."
pubDate: "2026-06-28T07:35:00+09:00"
category: "ai"
tags: ["hermes-agent", "nous-research", "ai-agent", "자율에이전트"]
---

**헤르메스 에이전트(Hermes Agent)**는 ChatGPT 창을 여는 AI가 아니다. 터미널·메신저·서버에서 상시 실행되며, 스스로 배우고, 대화가 끝나도 기억을 유지하는 **자율 에이전트**다. Nous Research가 2026년 2월 공개한 이 오픈소스 도구는 출시 4개월 만에 GitHub 스타 20만 4천 개를 넘겼다. 이 글에서는 헤르메스 에이전트가 무엇인지, 왜 지금 써볼 만한지, 그리고 어떻게 5분 안에 설치·셋팅하는지를 공식 문서 기반으로 단계별로 안내한다. *(2편: [실전 사용법·자동화 사례](/blog/2026-06-29-hermes-agent-practical-use-cases/)는 다음 편에서 이어진다.)*

![a computer chip with the letter a on top of it](https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcm9ib3QlMjB0ZXJtaW5hbHxlbnwxfDB8fHwxNzgyNTY2Mjc2fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Igor Omilaev](https://unsplash.com/@omilaev?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-computer-chip-with-the-letter-a-on-top-of-it-eGGFZ5X2LnA?utm_source=spice-bandit-blog&utm_medium=referral)*

## 헤르메스 vs Claude Code·CrewAI·Paperclip — 경쟁 도구와 무엇이 다른가

글을 더 읽기 전에 한 가지부터 정리하자. 2026년 현재 "AI 에이전트" 카테고리에는 비슷해 보이는 도구가 넘쳐나지만, 실제로는 **서로 다른 레이어를 커버**한다. 헤르메스 에이전트가 자주 비교되는 **Claude Code(클로드 코드)**, **CrewAI**, **Paperclip**과 어떻게 다른지 먼저 이해하면 나머지 내용이 훨씬 선명해진다.

### 도구별 한 줄 포지셔닝

- **Hermes Agent** — 서버·터미널·메신저에서 **상시 실행**되며, 대화를 쌓을수록 스스로 성장하는 1인용 자율 에이전트.
- **Claude Code(클로드 코드)** — Anthropic의 터미널·IDE 통합 AI. **코딩·리팩토링·버그 수정** 등 개발 작업에 특화된 세션 기반 에이전트.
- **CrewAI** — Python 코드로 "마케터·리서처·라이터" 등 **역할 기반 멀티에이전트 팀**을 구성하는 개발자용 오케스트레이션 프레임워크.
- **Paperclip** — 여러 AI 에이전트에게 태스크를 배정하고 팀처럼 관리하는 **에이전트 관리 SaaS 플랫폼**. 직접 코드를 실행하기보다 워크플로를 감독한다.

### 핵심 기능 비교표

| 기준 | Hermes Agent | Claude Code | CrewAI | Paperclip |
|------|-------------|-------------|--------|-----------|
| **유형** | 단일 자율 에이전트 | 코딩 전문 에이전트 | 멀티에이전트 프레임워크 | 에이전트 관리 플랫폼 |
| **실행 환경** | 터미널·메신저·서버 상시 | 터미널·IDE (세션 기반) | Python 스크립트 실행 | 웹 보드 UI |
| **영속 메모리** | ✅ 디스크에 저장, 세션 간 유지 | ❌ 세션 종료 시 초기화 | ❌ (외부 DB 별도 연동) | ✅ 이슈·댓글·컨텍스트 저장 |
| **LLM 프로바이더** | 40+ 프로바이더, 300+ 모델 | Anthropic 전용 | LangChain 경유 다수 | Anthropic Claude 기반 |
| **자가 학습·스킬 누적** | ✅ 스킬 자동 저장·재사용 | ❌ | ❌ | ✅ 에이전트별 메모리 |
| **메신저 게이트웨이** | ✅ Telegram·Discord·Slack 등 20+ | ❌ | ❌ | ✅ (플러그인 방식) |
| **코딩 없이 사용 가능** | ✅ CLI·자연어 | ✅ 자연어 | ❌ Python 필수 | ✅ 보드 UI |
| **멀티 에이전트** | ⚡ 병렬 서브에이전트(실험적) | ❌ 단일 | ✅ 핵심 기능 | ✅ 팀 구조 지원 |
| **오픈소스** | ✅ MIT 라이선스 | ❌ 상용 (Anthropic 구독) | ✅ MIT 라이선스 | ❌ 상용 SaaS |
| **셋업 난이도** | ★★★☆☆ 중간 | ★★☆☆☆ 낮음 | ★★★★☆ 높음 | ★★☆☆☆ 낮음 |
| **주 대상** | 개발자·자동화 파워유저 | 개발자 (코딩 작업) | Python 개발자 | 1인기업·소규모 팀 |

### 각 도구를 선택하는 상황

**Hermes Agent가 맞는 경우:**
- LLM 벤더에 종속되지 않고 언제든 모델을 교체하고 싶을 때 (오늘은 Claude, 내일은 GPT-4o)
- 텔레그램·슬랙 등 메신저로 이동 중에도 서버의 에이전트에 원격 접근하고 싶을 때
- 오픈소스 코드를 직접 수정하거나 사내 인프라에 자체 호스팅이 필요할 때
- 반복할수록 더 똑똑해지는 AI 동료를 원할 때

**Claude Code가 맞는 경우:**
- 코딩·리팩토링·PR 리뷰 등 개발 업무가 주 목적일 때
- Anthropic Claude의 최신 모델을 최고 품질로 쓰고 싶을 때
- 별도 설정 없이 즉시 시작할 수 있는 개발 에이전트가 필요할 때

**CrewAI가 맞는 경우:**
- Python 개발자로서 복잡한 멀티에이전트 워크플로를 코드로 정밀 제어하고 싶을 때
- "리서처 에이전트 → 분석 에이전트 → 작성 에이전트" 같은 역할 분업 파이프라인이 필요할 때
- 엔터프라이즈 수준의 AI 자동화 시스템을 직접 구축하는 것이 목적일 때

**Paperclip이 맞는 경우:**
- 코딩 없이 여러 AI 에이전트에게 업무를 배정하고 진척을 관리하고 싶을 때
- 이슈 트래커처럼 에이전트를 팀원으로 운용하고 싶을 때
- AI 에이전트를 직접 만들기보다 **관리·감독**하는 레이어가 필요할 때

### 결론: 레이어가 다르다, 혼합 사용이 정답

네 도구는 경쟁이라기보다 **보완 관계**다. 실제로 Paperclip으로 태스크를 관리하면서 Hermes Agent가 실행·자동화를 담당하게 하거나, CrewAI로 파이프라인을 짜고 Claude Code로 코드 품질을 검토하는 조합도 가능하다. 다만 단 하나를 골라야 한다면: **서버에서 상시 실행되며, LLM 종속 없이, 메신저로 어디서나 접근 가능한 자율 에이전트**가 필요하다면 헤르메스가 2026년 현재 가장 명확한 선택지다.

---

## 헤르메스 에이전트란? — 코딩 어시스턴트와 무엇이 다른가

흔히 쓰는 AI 도구는 두 가지 유형이다. ChatGPT·Claude처럼 **웹 채팅창에서만 동작하는 챗봇**, 그리고 GitHub Copilot처럼 **IDE 안에서만 작동하는 코딩 보조도구**. 둘 다 창을 닫으면 대화가 사라지고, 다음에 접속하면 처음부터 다시 시작해야 한다.

헤르메스 에이전트는 이 두 유형에 속하지 않는다. Nous Research 공식 문서는 이를 **"자기 개선형 자율 에이전트(self-improving autonomous agent)"**로 정의한다. 구체적으로 세 가지가 다르다.

**첫째, 어디서나 실행된다.** $5짜리 VPS, GPU 서버, 혹은 서버리스 인프라에서 상시 동작한다. 노트북을 닫아도 서버에서 계속 실행된다. **둘째, 기억이 쌓인다.** 디스크에 영속 메모리가 저장되므로, 어제 나눈 대화와 학습한 내용을 다음 세션에서도 그대로 이어간다. **셋째, 스킬이 누적된다.** 어려운 문제를 해결할 때마다 헤르메스는 그 방법을 재사용 가능한 스킬 문서로 기록한다. 사용할수록 더 잘하게 되는 구조다.

요약하면: 챗봇은 **대화를 처리**하고, 코딩 어시스턴트는 **IDE를 보조**한다. 헤르메스는 **서버에서 상시 동작하며 성장**한다. 단순 도구가 아니라 AI 동료에 가깝다.

---

## 핵심 특징·장점 — 왜 헤르메스인가

### 어디서든 접근하는 메시징 게이트웨이

헤르메스는 CLI(터미널)만이 아니라 **Telegram, Discord, Slack, WhatsApp, Signal, iMessage** 등 20개 이상의 메시징 플랫폼을 단일 게이트웨이 프로세스로 연결한다(v0.17.0 기준 iMessage 통합 추가). 한 번 설정하면 스마트폰 텔레그램으로도 동일한 에이전트에게 말을 걸 수 있다.

### 300+ 모델, 40+ 프로바이더를 하나로

헤르메스는 어떤 LLM에도 종속되지 않는다. 공식 문서 기준으로 **40개 이상의 AI 프로바이더**를 지원한다.

- **Nous Portal** (권장): OAuth 단일 로그인으로 Claude, GPT-4o, Gemini, DeepSeek, Qwen, Grok 등 **300개 이상의 프론티어 모델** 접근 가능. 웹 검색·이미지 생성·TTS·브라우저 자동화 Tool Gateway 포함.
- **OpenRouter**: 200개 이상 모델 라우팅. 비용·처리량·지연 기반 자동 최적화.
- **Anthropic, OpenAI, Google Gemini, DeepSeek**: 네이티브 API 직접 연결.
- **자체 호스팅**: Ollama, vLLM, LM Studio, llama.cpp 등 로컬 모델 연결 가능.

### 60개 이상 내장 도구 + MCP 서버 연동

웹 검색, 이미지 생성, TTS, 파일 조작, 코드 실행, cron 스케줄링, 병렬 서브에이전트 생성 등 **60개 이상의 내장 도구**를 기본 제공한다. 또한 MCP(Model Context Protocol) 서버를 연동하면 기능을 무제한 확장할 수 있다.

### 학습하는 스킬 시스템

헤르메스가 특정 문제를 처음 해결하면 그 방법을 **스킬 문서**로 저장한다. 같은 상황이 다시 오면 저장된 스킬을 검색해 즉시 적용한다. 스킬은 [agentskills.io](https://agentskills.io) 공개 표준과 호환되어 다른 사용자와 공유도 가능하다.

![two hands touching each other in front of a pink background](https://images.unsplash.com/photo-1694903110330-cc64b7e1d21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcm9ib3QlMjB0ZXJtaW5hbHxlbnwxfDB8fHwxNzgyNTY2Mjc2fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Igor Omilaev](https://unsplash.com/@omilaev?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/two-hands-touching-each-other-in-front-of-a-pink-background-gVQLAbGVB6Q?utm_source=spice-bandit-blog&utm_medium=referral)*

---

## 설치 방법 — Linux·macOS·Windows 단계별 가이드

> **최신 버전**: v0.17.0 (2026년 6월 19일 릴리스, "The Reach Release")  
> **공식 저장소**: [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)  
> **공식 문서**: [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs/)

### Linux / macOS (권장 방법)

터미널을 열고 아래 명령어를 실행한다. 설치 스크립트가 `uv`, Python 3.11, hermes 바이너리를 자동으로 설치한다. **sudo 권한 불필요.**

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

> ⚠️ **보안 주의**: `curl | bash` 방식은 스크립트를 그대로 실행하는 방식이다. 실행 전 `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | less`로 스크립트 내용을 먼저 확인하는 것을 권장한다. (출처: [Hermes 공식 설치 문서](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart))

설치 후 셸을 새로 고친다.

```bash
source ~/.bashrc   # bash 사용자
# 또는
source ~/.zshrc    # zsh 사용자(macOS 기본)
```

설치 확인:

```bash
hermes --version
```

### Windows (WSL2 경유)

Windows에서는 **WSL2(Windows Subsystem for Linux)** 환경에서 위 Linux 방법과 동일하게 진행한다.

PowerShell 네이티브 설치를 원하는 경우 공식 제공하는 PowerShell 스크립트를 사용할 수 있다.

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

### Hermes Desktop (GUI 대안)

터미널이 익숙하지 않다면 **Hermes Desktop**을 다운로드해도 된다. macOS·Windows·Linux 네이티브 앱을 공식 사이트([hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com))에서 제공한다. GUI 방식이지만 CLI와 동일한 기능을 갖는다.

---

## 초기 셋팅 — Nous Portal로 5분 만에 시작하기

설치 후 첫 실행 전에 AI 프로바이더를 연결해야 한다. 공식 문서가 권장하는 **Quick Setup** 경로를 따라간다.

### 1단계: 셋업 마법사 실행

```bash
hermes setup --portal
```

`--portal` 플래그를 붙이면 **Nous Portal**을 기본 프로바이더로 설정한다. Nous Portal은 OAuth 단일 로그인만으로 300개 이상의 모델과 Tool Gateway(웹 검색, 이미지 생성, TTS, 브라우저)를 한 번에 활성화한다. 가장 빠른 시작 방법이다.

### 2단계: 모델 선택 (언제든 변경 가능)

```bash
hermes model
```

대화형 메뉴가 나타난다. 처음에는 Nous Portal의 기본 모델을 선택하고, 이후 언제든 변경 가능하다. 주의사항: 공식 문서는 **최소 컨텍스트 길이 64,000 토큰** 이상의 모델을 사용할 것을 권고한다. 이보다 작은 모델은 메모리·스킬 기능이 제대로 동작하지 않을 수 있다.

### 3단계: 다른 AI 프로바이더 직접 키 등록 (선택)

Nous Portal 대신 Anthropic, OpenAI 등의 API 키를 직접 등록하려면 `~/.hermes/.env` 파일에 추가한다.

```bash
# 예시: Anthropic Claude 직접 연결
echo "ANTHROPIC_API_KEY=sk-ant-..." >> ~/.hermes/.env

# 예시: OpenAI 직접 연결
echo "OPENAI_API_KEY=sk-..." >> ~/.hermes/.env
```

그 다음 `hermes model`로 해당 프로바이더·모델을 선택하면 된다.

### 4단계: 메시징 게이트웨이 연결 (선택)

텔레그램 등 메시지 앱에서 헤르메스와 대화하려면 게이트웨이를 시작한다.

```bash
hermes gateway
```

셋업 마법사가 각 플랫폼의 봇 토큰 등록 과정을 안내한다. 설정 후에는 텔레그램 채팅창에서 설치한 서버의 헤르메스와 직접 대화할 수 있다.

### 5단계: 첫 대화 시작

```bash
hermes
```

이제 터미널 UI(TUI)에서 헤르메스와 첫 대화를 할 수 있다. 이전 세션을 이어가려면:

```bash
hermes --continue
```

### 자주 쓰는 명령어 요약

| 명령어 | 기능 |
|--------|------|
| `hermes` | 새 대화 시작 |
| `hermes --continue` | 마지막 세션 재개 |
| `hermes model` | LLM 프로바이더·모델 변경 |
| `hermes tools` | 활성화된 도구 확인·조정 |
| `hermes gateway` | 메시징 게이트웨이 시작 |
| `hermes doctor` | 설치 문제 자동 진단 |
| `hermes update` | 최신 버전으로 업데이트 |

![A white robot is standing in front of a black background](https://images.unsplash.com/photo-1737644467636-6b0053476bb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcm9ib3QlMjB0ZXJtaW5hbHxlbnwxfDB8fHwxNzgyNTY2Mjc2fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Gabriele Malaspina](https://unsplash.com/@gabrielemalaspina?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-white-robot-is-standing-in-front-of-a-black-background-CjWsslYVnPI?utm_source=spice-bandit-blog&utm_medium=referral)*

---

## So What — 어떤 사람에게 맞는가, 왜 지금인가

헤르메스 에이전트는 모든 사람을 위한 도구가 아니다. 그러나 다음 유형이라면 지금 당장 시도해볼 만하다.

**개발자·엔지니어**: 서버에 상시 실행되는 개인 AI 도우미가 필요한 사람. 특히 여러 AI 모델을 비용·성능에 따라 자동 교체하고 싶은 경우, 헤르메스의 멀티 프로바이더 구조가 맞는다.

**자동화를 원하는 1인 기업·프리랜서**: 텔레그램으로 외출 중에도 AI에게 리서치·초안·일정 관리를 맡기고 싶다면, 메시징 게이트웨이가 핵심 기능이다. cron 스케줄링으로 반복 작업을 자동화할 수도 있다.

**AI를 '직접 구축'하고 싶은 사람**: MIT 라이선스 오픈소스이기 때문에 소스를 수정하거나, MCP 서버를 붙이거나, 사내 인프라에 자체 호스팅하는 것이 자유롭다. 단, Python 환경 기본 지식은 필요하다.

**아직 이른 사람**: 터미널 기반이고 설정 단계가 몇 단계 있다. ChatGPT 웹사이트처럼 즉시 쓰는 방식을 원한다면 Hermes Desktop을 먼저 써보는 것을 권한다.

헤르메스가 '왜 지금인가'에 대한 답은 간단하다. v0.17.0 "The Reach Release"(2026년 6월 19일)에서 iMessage 통합과 에이전트 네트워크 연결이 추가되며 완성도가 크게 올라갔다. 반복 명령을 AI에게 위임하는 흐름이 대세가 되는 지금, 로컬·원격 어디서나 동작하는 자율 에이전트의 시대가 시작되고 있다.

---

**[2편 보기]** 헤르메스를 실제로 어떻게 활용하는지 — 텔레그램 봇 연동, cron 자동화, 스킬 작성·공유, MCP 서버 연결 등 실전 사용법과 사례는 [헤르메스 AI 실전 사용법·자동화 사례 완전 가이드 [2편]](/blog/2026-06-29-hermes-agent-practical-use-cases/)에서 이어진다.

---

**출처·참고자료**  
- [Hermes Agent 공식 문서](https://hermes-agent.nousresearch.com/docs/) (Nous Research, 2026)  
- [NousResearch/hermes-agent GitHub 저장소](https://github.com/NousResearch/hermes-agent) (MIT License)  
- [Hermes Agent Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)  
- [AI Providers 지원 목록](https://hermes-agent.nousresearch.com/docs/integrations/providers)  
- [v0.17.0 릴리스 노트](https://github.com/NousResearch/hermes-agent/releases/tag/v0.17.0) (2026.6.19)
