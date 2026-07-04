---
title: "헤르메스 AI 실전 사용법·자동화 사례 완전 가이드 [2편]"
description: "헤르메스 에이전트(Hermes Agent) 텔레그램 봇 연동, cron 자동화, MCP 서버 연결, 스킬 공유까지 실전 활용법을 사례 중심으로 정리합니다."
pubDate: "2026-06-29T17:35:00+09:00"
category: "ai"
tags: ["hermes-agent", "nous-research", "ai-자동화", "텔레그램봇"]
---

설치는 됐다. 이제 어떻게 써야 하는가? **헤르메스 에이전트(Hermes Agent)** 실전 활용의 핵심은 세 가지다. 첫째, 터미널 UI와 슬래시 명령에 익숙해지는 것. 둘째, 메모리와 스킬 시스템을 의도적으로 쌓는 것. 셋째, 텔레그램 봇·cron 자동화·MCP 서버를 연결해 반복 업무를 에이전트에게 넘기는 것. 이 글에서는 공식 문서 기반으로 헤르메스의 기본 사용 흐름부터 실전 자동화 사례 3가지까지 단계별로 정리한다. 설치 및 초기 셋팅은 [1편](/blog/2026-06-28-hermes-agent-nous-research-install-guide/)을 먼저 확인하자.

![black and white industrial machine](https://images.unsplash.com/photo-1563968743333-044cef800494?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxhdXRvbWF0aW9uJTIwd29ya2Zsb3clMjByb2JvdCUyMGRlc2t8ZW58MXwwfHx8MTc4MzEzNDgyMXww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Franck V.](https://unsplash.com/@possessedphotography?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-and-white-industrial-machine-dRMQiAubdws?utm_source=spice-bandit-blog&utm_medium=referral)*

## 헤르메스 기본 사용 흐름: 터미널 UI부터 슬래시 명령까지

### 첫 대화 시작과 세션 관리

설치 후 터미널에서 `hermes`를 입력하면 **TUI(터미널 사용자 인터페이스)**가 열린다. 채팅창처럼 생겼지만 일반 채팅과 근본적으로 다르다. 헤르메스는 대화 내용을 디스크에 저장하기 때문에, 창을 닫았다가 `hermes --continue`로 재접속하면 이전 세션이 그대로 이어진다.

```bash
hermes              # 새 대화 시작
hermes --continue   # 마지막 세션 재개
```

세션을 여럿 관리하거나 특정 주제별로 분리하고 싶다면 세션 이름을 지정할 수 있다(공식 문서: Sessions 섹션 참고).

### 주요 CLI 명령 한눈에 보기

| 명령어 | 역할 |
|--------|------|
| `hermes` | 새 대화 시작 |
| `hermes --continue` | 이전 세션 재개 |
| `hermes model` | LLM 프로바이더·모델 변경 |
| `hermes tools` | 활성화된 도구 확인·조정 |
| `hermes gateway` | 메시징 게이트웨이 시작 (텔레그램·Discord 등) |
| `hermes mcp` | MCP 서버 목록·연결 관리 |
| `hermes doctor` | 설치 문제 자동 진단 |
| `hermes update` | 최신 버전 업데이트 |

### 작업 지시 방법과 스트리밍 출력

헤르메스에게 작업을 지시하는 방법은 일반 AI 채팅과 같다. 자연어로 입력하면 된다. 차이는 **스트리밍 도구 출력**에 있다. 웹 검색, 파일 조작, 코드 실행 등 도구를 사용할 때는 TUI에서 각 단계의 출력이 실시간으로 스트리밍된다. "지금 무엇을 하고 있는지"가 투명하게 보인다.

긴 작업을 지시할 때는 구체적일수록 좋다. "오늘 AI 뉴스 요약해줘"보다 "구글 검색으로 오늘(2026-06-30) AI 관련 뉴스 3건을 찾아 각각 핵심 한 줄과 출처 URL을 표로 정리해줘"처럼 입력·동작·결과 형식을 명시하면 원하는 결과를 얻기 쉽다.

---

## 메모리·스킬 시스템: 사용할수록 성장하는 에이전트

헤르메스를 다른 AI 도구와 가장 크게 구분짓는 기능이 여기에 있다. **영속 메모리(persistent memory)**와 **자가 학습 스킬 시스템**이다.

### 영속 메모리: 어제를 기억하는 AI

헤르메스는 대화 내용, 사용자 선호도, 프로젝트 컨텍스트를 `~/.hermes/` 디렉토리에 디스크로 저장한다(공식 문서: Memory Architecture 참고). 새 세션을 시작해도 이전 대화에서 배운 정보가 유지된다.

예를 들어, 첫 대화에서 "나는 한국어로만 답변받고 싶어. 보고서는 항상 요약→분석→액션아이템 순서로 써줘"라고 말해두면, 이후 세션에서도 그 규칙을 기억한다. 사용자가 반복해서 설명할 필요가 없다.

메모리는 컨텍스트 길이 제한을 초과하면 자동으로 요약·압축되어 핵심 정보만 유지된다. 이것이 헤르메스가 **64,000 토큰 이상 컨텍스트 길이를 가진 모델**을 권장하는 이유다.

### 스킬 누적: 한 번 해결하면 다음엔 더 빠르게

헤르메스가 새로운 문제를 처음 해결할 때, 그 방법을 **재사용 가능한 스킬 문서**로 자동 저장한다(공식 문서: Skills System 참고). 동일한 상황이 다시 생기면 저장된 스킬을 검색해 즉시 적용한다.

```
예: 처음으로 "Notion API에서 데이터 추출해줘" 요청 →
    헤르메스가 해결 과정을 스킬로 저장 →
    다음에 같은 요청 시 저장된 스킬로 3배 빠르게 처리
```

스킬은 **[agentskills.io](https://agentskills.io)** 공개 표준과 호환된다. 직접 작성한 스킬을 커뮤니티에 공유하거나, 다른 사람이 공유한 스킬을 가져다 쓸 수 있다. 예를 들어 "매일 아침 뉴스 요약" 스킬을 커뮤니티에서 설치하면 별도 설정 없이 바로 사용 가능하다.

![white robotic arm in display showroom](https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxhdXRvbWF0aW9uJTIwd29ya2Zsb3clMjByb2JvdCUyMGRlc2t8ZW58MXwwfHx8MTc4MzEzNDgyMXww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [ZHENYU LUO](https://unsplash.com/@mrnuclear?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/white-robotic-arm-in-display-showroom-kE0JmtbvXxM?utm_source=spice-bandit-blog&utm_medium=referral)*

---

## 텔레그램 봇 연동·cron 자동화·MCP 서버 연결 실전 가이드

### 텔레그램 봇 연동: 외출 중에도 에이전트에 접근

헤르메스의 메시징 게이트웨이 기능을 사용하면 서버에서 실행 중인 에이전트에 텔레그램으로 접근할 수 있다. 스마트폰에서 텔레그램 메시지를 보내면, 서버의 헤르메스가 응답한다.

**설정 단계:**

1. Telegram BotFather에서 새 봇 생성 → API 토큰 발급
2. 서버에서 게이트웨이 시작:

```bash
hermes gateway
```

3. 게이트웨이 설정 마법사에서 Telegram 선택 → 발급받은 토큰 입력
4. 연결 확인 후, 텔레그램 앱에서 생성한 봇에 메시지 전송

설정 완료 후에는 텔레그램에서 "오늘 할 일 정리해줘", "지난 주 리포트 작성해줘" 등 자연어로 지시하면 서버의 헤르메스가 작업을 수행한다. v0.17.0 기준으로 Telegram, Discord, Slack, WhatsApp, Signal, iMessage 등 **20개 이상의 플랫폼**을 동일한 방식으로 연결할 수 있다(출처: [Hermes Gateway 공식 문서](https://hermes-agent.nousresearch.com/docs/integrations/gateway)).

### cron 자동화: 반복 작업을 에이전트에게 위임

헤르메스는 **내장 cron 스케줄링** 기능을 제공한다(v0.17.0 기준, 공식 문서: Scheduled Tasks 섹션). 특정 시간에 자동으로 작업을 실행하도록 설정할 수 있다.

```bash
hermes tools   # 도구 목록에서 schedule 도구 확인
```

TUI 내에서 "매일 오전 8시에 오늘의 AI 뉴스 3건을 요약해서 텔레그램으로 보내줘"처럼 자연어로 스케줄을 등록하면, 헤르메스가 cron 작업으로 등록한다. 서버를 종료하지 않고 상시 실행(`hermes --continue` 또는 `nohup`/`screen`/`tmux` 활용)해야 cron이 동작한다.

> **운영 팁**: VPS를 사용하는 경우 `systemd` 서비스로 등록하면 서버 재시작 후에도 헤르메스가 자동 복구된다.

### MCP 서버 연결: 기능 무제한 확장

MCP(Model Context Protocol)는 AI 에이전트가 외부 서비스·API에 연결하는 표준 프로토콜이다. 헤르메스는 MCP 서버를 연결해 기본 내장 60개 도구 이외의 기능을 추가할 수 있다.

```bash
hermes mcp     # 현재 연결된 MCP 서버 목록 확인
```

설정 파일(`~/.hermes/config.yaml` 또는 공식 문서의 MCP 설정 섹션 참고)에 MCP 서버 주소를 추가하면, 헤르메스가 해당 서버의 도구를 자동으로 인식한다.

**연결 가능한 MCP 서버 예시:**
- Notion, Google Drive, GitHub, Linear 등 협업 도구
- 커스텀 데이터베이스 쿼리 서버
- 사내 API 래퍼 서버

---

## 실전 자동화 사례 3가지

### 사례 1: 매일 아침 뉴스 브리핑 + 텔레그램 전송

**상황**: 1인 기업 대표가 매일 아침 AI·테크·경제 분야 뉴스를 정리해서 받고 싶다.

**설정 흐름:**
1. 텔레그램 봇 연동 완료 (위 가이드 참고)
2. 헤르메스에게 스케줄 지시:
   > "매일 오전 7시 30분에 구글 검색으로 AI, 테크, 경제 분야 최신 뉴스 각 2건씩 찾아서, 제목·한 줄 요약·출처 URL을 포함한 표로 만들어 텔레그램으로 보내줘"
3. 헤르메스가 cron 등록 → 이후 자동 실행

**결과**: 매일 아침 스마트폰 텔레그램으로 뉴스 브리핑 도착. 별도 앱 없이 단 한 번의 설정으로 자동화 완료.

### 사례 2: 반복 문서 초안 자동 생성

**상황**: 주간 업무 보고서 초안을 매주 금요일 자동으로 작성하고 싶다.

**설정 흐름:**
1. 헤르메스에게 보고서 양식 학습 지시:
   > "앞으로 내 주간 업무 보고서는 항상 이 양식을 써줘: [양식 붙여넣기]. 이걸 스킬로 저장해줘."
2. 스케줄 등록:
   > "매주 금요일 오후 4시에 이번 주 완료된 작업 목록을 물어보고, 위 양식으로 주간 보고서 초안을 작성해서 ~/Documents/reports/ 폴더에 저장해줘"

**결과**: 금요일 오후마다 헤르메스가 자동으로 보고서 초안 생성. 담당자는 검토·수정만 하면 된다.

### 사례 3: 코드 저장소 모니터링 + 이슈 요약

**상황**: GitHub 저장소의 새 이슈를 매일 오전에 요약해서 받고 싶다.

**설정 흐름:**
1. GitHub MCP 서버 연결 (공식 MCP 서버 목록 참고)
2. 스케줄 지시:
   > "매일 오전 9시에 [저장소명] GitHub 저장소의 어제 생성된 이슈 목록을 가져와서, 제목·요약·우선순위 추정을 표로 정리해서 텔레그램으로 보내줘"

**결과**: 아침마다 깃허브 이슈 현황 자동 브리핑. 별도 대시보드를 열지 않아도 된다.

![closeup photo of white robot arm](https://images.unsplash.com/photo-1531746790731-6c087fecd65a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxhdXRvbWF0aW9uJTIwd29ya2Zsb3clMjByb2JvdCUyMGRlc2t8ZW58MXwwfHx8MTc4MzEzNDgyMXww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Franck V.](https://unsplash.com/@possessedphotography?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/closeup-photo-of-white-robot-arm-jIBMSMs4_kA?utm_source=spice-bandit-blog&utm_medium=referral)*

---

## 운영 팁과 주의사항: 비용·보안·한계

### 비용 관리

헤르메스는 도구 자체는 무료(MIT 라이선스)지만, LLM API 사용 비용은 별도로 발생한다. Nous Portal을 사용하는 경우 포털 요금제 기준, 직접 API 키를 연결하는 경우 각 프로바이더 요금이 적용된다.

**비용 줄이는 방법:**
- 상시 실행보다 cron 필요 시점에만 실행되도록 설계
- 단순 반복 작업에는 비용 대비 성능이 높은 소형 모델 사용 (`hermes model`로 모델별 전환)
- 메모리 요약 기능을 활용해 컨텍스트 토큰 과다 사용 방지

### 보안과 키 관리

API 키는 `~/.hermes/.env` 파일에 저장된다. 이 파일은 절대 git 저장소에 올리거나 공유하지 않는다. `.gitignore`에 `~/.hermes/` 경로를 추가하는 것을 권장한다.

텔레그램 봇 설정 시 **봇 접근 권한을 본인 계정으로만 제한**해야 한다. 봇 토큰이 유출되면 외부에서 에이전트에 접근할 수 있다. 공식 문서의 Gateway Security 섹션에서 화이트리스트 설정 방법을 확인하자.

### 한계와 현실적인 기대

헤르메스는 강력하지만 만능이 아니다. 현실적인 기대치를 정리하면:

- **컨텍스트 길이**: 아무리 긴 메모리 요약 기능이 있어도, 매우 복잡한 프로젝트 전체 히스토리를 완벽히 유지하기엔 한계가 있다.
- **도구 오류**: 웹 검색 결과가 부정확하거나 API 호출이 실패할 수 있다. 중요한 자동화 결과는 사람이 한 번 검토하는 것을 권장한다.
- **모델 의존성**: 헤르메스의 출력 품질은 연결된 LLM 모델에 크게 좌우된다. 공식 문서 권장 사항대로 64,000 토큰 이상, 성능이 검증된 프론티어 모델을 사용할 것을 권한다.

### So What: 어떤 업무에 붙이면 가장 효과적인가

헤르메스가 빛나는 영역은 **반복적이고 정형화된 정보 처리 작업**이다. 뉴스 수집·요약, 보고서 초안, 코드 저장소 모니터링처럼 "매일 같은 흐름을 반복하는 작업"에 적합하다. 반면 창의적 판단, 복잡한 이해관계자 조율, 미묘한 뉘앙스가 중요한 커뮤니케이션은 여전히 사람이 주도해야 한다.

결론: 헤르메스를 제대로 활용하려면 처음 1~2주간 "어떤 작업을 에이전트에게 넘길 수 있는가"를 의식적으로 기록하는 것이 가장 빠른 방법이다. 반복 횟수가 많고, 입력·출력이 명확하고, 결과 검토 부담이 낮은 작업부터 시작해 점진적으로 자동화 범위를 넓히는 것이 베스트 프랙티스다.

---

**[1편으로 돌아가기]** 설치·초기 셋팅은 [헤르메스 AI 설치·셋팅 완전 가이드 [1편]](/blog/2026-06-28-hermes-agent-nous-research-install-guide/)을 참고하자.

---

**출처·참고자료**
- [Hermes Agent 공식 문서](https://hermes-agent.nousresearch.com/docs/) (Nous Research, 2026)
- [NousResearch/hermes-agent GitHub 저장소](https://github.com/NousResearch/hermes-agent) (MIT License)
- [Hermes Gateway 공식 문서](https://hermes-agent.nousresearch.com/docs/integrations/gateway)
- [Hermes Skills System](https://hermes-agent.nousresearch.com/docs/core-concepts/skills)
- [agentskills.io — 커뮤니티 스킬 공유 플랫폼](https://agentskills.io)
- [v0.17.0 릴리스 노트](https://github.com/NousResearch/hermes-agent/releases/tag/v0.17.0) (2026.6.19)
