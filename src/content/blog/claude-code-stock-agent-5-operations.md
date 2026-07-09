---
title: "주식봇 자동화 운영 — 텔레그램 승인·launchd 무인화 [5편]"
description: "Claude Code 주식봇 운영편. 텔레그램 인라인 버튼으로 매매를 폰에서 승인하고, launchd로 매일 아침·장중·마감을 자동 실행합니다. 주식 에이전트 무인 운영 체계 완성 가이드."
pubDate: 2026-06-23T09:00:00+09:00
updatedDate: 2026-07-06T20:30:00+09:00
category: "ai"
tags: ["ClaudeCode", "주식자동매매", "텔레그램봇", "launchd", "자동화"]
---

> 📚 **연재 — 클로드코드로 주식투자 에이전트 만들기**
> [① 목적과 설계](/blog/claude-code-stock-agent-1-design/) · [② 한투 API 연결](/blog/claude-code-stock-agent-2-kis-api/) · [③ 분석가 두뇌](/blog/claude-code-stock-agent-3-analysts/) · [④ 매매와 안전장치](/blog/claude-code-stock-agent-4-trade-safety/) · **⑤ 운영 자동화**

## 예고했던 숙제를 갚는 편

지난 4편 마지막에 "다음에 할 일"로 세 가지를 적어뒀다. 텔레그램으로 제안과 승인을 폰으로 받기, launchd로 매일 자동 실행하기, 그리고 아침·마감 데일리 리포트. 봇은 이미 종목을 고르고 분석하고 사고팔 수 있었지만, 그걸 **매일, 내가 노트북 앞에 없어도** 돌아가게 만드는 건 또 다른 일이었다.

이번 편은 그 "운영" 부분이다. 코드 자체는 화려하지 않다. 대신 *기존에 잘 돌던 걸 하나도 깨뜨리지 않으면서* 위에 자동화를 얹는 게 핵심이었다. 그래서 모든 변경은 더하기만 했고, 매 단계 테스트로 기존 동작을 지켰다(최종 28개 테스트 통과).

![black android smartphone turned on screen](https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwdHJhZGluZyUyMG5vdGlmaWNhdGlvbiUyMGFwcHJvdmFsfGVufDF8MHx8fDE3ODE4NTU5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Marga Santoso](https://unsplash.com/@margabagus?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-android-smartphone-turned-on-screen-OmPqCwX422Y?utm_source=spice-bandit-blog&utm_medium=referral)*

## 폰에서 버튼 한 번으로 승인하기

지금까지 승인은 터미널에서 `y/n`을 타이핑하는 방식이었다. 노트북을 켜고 있어야만 가능하니, 무인 운영과는 거리가 멀었다.

그래서 매매 제안이 뜨면 텔레그램으로 **`✅ 승인` / `❌ 거부` 버튼이 달린 메시지**를 폰에 보내도록 바꿨다. 출근길에 알림이 오면, 내용을 보고 버튼만 누르면 된다. 승인을 누르면 봇이 곧장 발주하고, 메시지가 "✅ 발주완료(주문번호 …)"로 바뀐다.

여기서 절대 타협하지 않은 원칙이 있다. **버튼을 눌러도 주문이 곧바로 나가는 게 아니라, 4편에서 만든 실행 게이트를 똑같이 통과한다.** 승인은 게이트에 "사람이 OK 했다"는 플래그를 전달할 뿐, 킬스위치·수량·일일한도·중복 같은 하드룰 검증은 그대로 받는다. 편해졌다고 안전장치를 우회하지는 않았다.

상시로 메시지를 듣고 있어야 하니, 텔레그램을 long-polling으로 듣는 작은 데몬을 하나 띄웠다. 이 데몬은 버튼뿐 아니라 `잔고`, `내역`, `검토 005930` 같은 텍스트 명령도 처리한다. 폰에서 "잔고"라고 보내면 보유 종목과 손익이 답장으로 온다.

![a person holding a cell phone in front of a stock chart](https://images.unsplash.com/photo-1645226880663-81561dcab0ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxzbWFydHBob25lJTIwdHJhZGluZyUyMG5vdGlmaWNhdGlvbiUyMGFwcHJvdmFsfGVufDF8MHx8fDE3ODE4NTU5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Adam Śmigielski](https://unsplash.com/@smigielski?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-person-holding-a-cell-phone-in-front-of-a-stock-chart-K5mPtONmpHM?utm_source=spice-bandit-blog&utm_medium=referral)*

## 봇은 봇끼리 — 토큰을 분리한 이유

여기서 예상 못 한 함정에 빠졌다. 이미 다른 용도로 쓰던 텔레그램 봇 토큰이 있어서 "그거 재사용하면 되겠지" 했는데, 막상 연결하려니 문제가 보였다.

텔레그램에서 한 봇의 메시지를 long-polling으로 받는 프로세스는 **동시에 하나만** 정상 동작한다. 두 프로세스가 같은 토큰으로 `getUpdates`를 호출하면 업데이트를 서로 뺏어가서 둘 다 오작동한다. 기존 봇이 이미 폴링 중이었으니, 그 토큰을 주식봇이 또 쓰면 기존 연결이 깨질 판이었다.

답은 단순했다. **주식봇 전용 봇을 따로 판다.** BotFather로 새 봇을 만들고, 토큰만 갈아끼웠다. 채팅 ID(내 폰)는 봇이 달라도 동일하게 쓸 수 있어서, 새 봇과 한 번만 대화를 트면 끝이었다. "하나의 봇 = 하나의 수신자"라는 원칙을 지키니 둘 다 평화롭게 공존한다. 자동화에서 자원 소유권을 명확히 가르는 게 왜 중요한지 다시 배웠다.

## /kill — 손을 떼는 빨간 버튼

무인 시스템에서 가장 무서운 건 "뭔가 이상한데 멈출 방법이 없는" 상황이다. 그래서 폰에서 `/kill` 한 줄이면 **즉시 모든 발주가 차단**되게 했다.

`/kill`은 설정 파일의 킬스위치를 켜고, 게이트는 매 발주 때 이걸 가장 먼저 확인해 무조건 막는다. 데몬이 설정을 매 루프 다시 읽기 때문에 재시작도 필요 없다. 안정되면 `/kill해제`로 되돌린다. 작은 디테일이지만, 킬스위치를 켤 때 설정 파일 전체를 다시 쓰지 않고 **해당 줄만 고쳐서 주석을 보존**하도록 했다. 비상 상황에서 쓰는 안전장치일수록 부작용이 없어야 하니까.

## 매일 같은 시각에 — launchd 스케줄

자동 실행은 macOS의 launchd에 맡겼다. 평일에만 도는 작업 네 개를 등록했다.

- **상시**: 텔레그램 데몬(승인·명령 수신)
- **08:30**: 장전 브리핑
- **09:30**: 매매 사이클(제안 푸시)
- **15:40**: 마감 리포트

여기서도 사소하지만 골치 아픈 함정이 있었다. launchd는 작업을 실행하기 **전에** 로그 파일을 먼저 연다. 그래서 로그 폴더가 아직 없으면 작업이 조용히 실패한다. 설치 스크립트에서 로그 디렉터리를 미리 만들어주는 한 줄로 해결했다. 이런 건 코드 리뷰에서 잡아낸 것들인데, "돌아가는 것 같지만 로그가 안 남는" 류의 버그라 미리 막아둔 게 다행이었다.

![analog clock at 12 am](https://images.unsplash.com/photo-1456574808786-d2ba7a6aa654?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxhdXRvbWF0aW9uJTIwY2xvY2slMjBzY2hlZHVsZSUyMGFsYXJtfGVufDF8MHx8fDE3ODE4NTU5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Djim Loic](https://unsplash.com/@loic?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/analog-clock-at-12-am-ft0-Xu4nTvA?utm_source=spice-bandit-blog&utm_medium=referral)*

## 아침 브리핑과 마감 리포트

이게 1편에서 적었던 목표 중 하나, "데일리 리포트"다.

**아침 08:30 브리핑**은 장 시작 전에 보유 종목 평가손익, 현금, 그리고 오늘 스크리너가 주목하는 후보를 한눈에 보여준다. 출근하면서 오늘 장의 감을 잡는 용도다.

**마감 15:40 리포트**는 당일 체결 내역과 실현·평가 손익을 정리한다. 봇이 오늘 뭘 했고 계좌가 어떻게 변했는지 하루를 닫으며 확인한다.

둘 다 그냥 사실을 정리해 보낼 뿐, "이 종목 사라/팔아라" 같은 판단을 새로 하지는 않는다. 리포트는 거들 뿐, 결정은 분석가·게이트·사람 승인의 몫이다.

## 휴장일은 쉰다

launchd는 평일만 트리거할 수 있지만, 공휴일까지는 모른다. 그래서 주말과 한국 증시 휴장일을 거르는 작은 캘린더 모듈을 두고, 매매·리포트 작업이 시작될 때 휴장일이면 그냥 아무것도 안 하고 끝낸다.

여기서도 안전을 기본값으로 뒀다. 휴장일 목록이 혹시 틀려도, 잘못된 방향은 "쉬어야 할 날에 도는 것"이 아니라 "도는 날 안 도는 것"이다. 즉 틀렸을 때 손해가 큰 쪽(엉뚱한 발주)이 아니라 안전한 쪽(아무 일도 안 함)으로 실패하게 설계했다.

## 운영 체계가 완성되다

네 편까지가 "생각하고 사고파는 두뇌"였다면, 이번 편은 그 두뇌가 **매일 스스로 깨어나 일하고, 중요한 순간엔 내게 묻고, 위험하면 멈추는** 운영 체계다. 이제 흐름은 이렇게 돈다.

> 09:30 자동 실행 → 분석가 종합 → 리스크 산정 → 게이트 검증 → 폰으로 제안 → 내가 버튼 탭 → 게이트 경유 발주 → 마감 리포트

만들며 다시 확인한 건, 시리즈 내내 반복된 교훈 그대로다. **반복·스케줄·게이트 같은 결정론적인 일은 코드에게, 해석과 판단은 사람과 LLM에게.** 그리고 자동화로 편해질수록, 빨간 버튼(`/kill`)과 이중 안전장치는 더 분명히 둬야 한다는 것.

자동매매가 수익을 보장하진 않는다. 이 시스템이 진짜 해주는 건 *정해진 규칙을 감정 없이, 정해진 리스크 한도 안에서, 매일 같은 방식으로 실행하는 것*뿐이다. 성과를 검증하는 건 그다음, 시간과 데이터의 몫이다.

긴 시리즈를 끝까지 함께해주셔서 감사하다. 같은 걸 만들어보려는 분께, 이 기록이 똑같은 함정을 피해 가는 지도가 되길 바란다.

## 따라 하기 — 자동 실행·텔레그램 세팅

봇을 매일 무인으로 굴리려면 두 가지, 텔레그램 연결과 자동 실행을 세팅한다.

**1) 텔레그램 봇 만들기**
- 텔레그램 앱에서 `@BotFather`에게 새 봇을 만들고 **봇 토큰**을 받는다.
- 내 `chat_id`를 확인한다(봇에게 아무 메시지나 보낸 뒤 getUpdates로 확인).
- `.env`에 `TELEGRAM_BOT_TOKEN=...`, `TELEGRAM_CHAT_ID=...`를 넣는다.

**2) 자동 실행 (macOS launchd)**
- 평일 장 흐름에 맞춰 사이클이 돌도록 launchd 잡을 등록한다. 예: 개장 준비(08:30)·장중 사이클(09:30)·마감 보고(15:40).
- 실행 래퍼 스크립트(`run.sh`)로 파이썬 인터프리터와 작업 디렉터리를 고정하면, 스케줄러가 어디서 호출해도 안정적으로 돈다.

**3) 검증**
- 먼저 수동으로 한 번 실행해 텔레그램으로 리포트가 오는지 확인한다.
- 로그는 `state/logs/`에서 본다(사이클 로그·전송 로그).

**팁**: 특정 시간대에 네트워크가 순간 끊겨도 리포트가 통째로 날아가지 않도록, 전송에 **재시도 + 실패 시 저장 후 다음 전송 때 자동 재발송**을 넣어두면 누락을 막을 수 있다.

---

📚 [← ④ 매매와 안전장치](/blog/claude-code-stock-agent-4-trade-safety/) · [① 목적과 설계부터 보기](/blog/claude-code-stock-agent-1-design/)

*※ 이 글은 개인 프로젝트 제작기로, 특정 종목의 매수·매도 권유나 투자 조언이 아닙니다. 자동매매는 손실 위험이 있으며 모든 투자 판단과 책임은 본인에게 있습니다.*
