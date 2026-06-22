---
title: "클로드코드로 주식투자 에이전트 만들기 (1) — 목적과 전체 설계"
description: "Claude Code와 멀티에이전트 구조로 한국 주식 자동매매 봇을 만든 과정. 첫 편은 왜 만드는지, 그리고 전체 아키텍처를 어떻게 잡았는지 다룬다."
pubDate: 2026-06-19T09:00:00+09:00
category: "ai"
tags: ["ClaudeCode", "주식자동매매", "멀티에이전트", "KIS API", "LLM"]
featured: true
---

## 시작하며

어느 날 문득 이런 생각이 들었다. "분석은 LLM이 잘하고, 시세 데이터는 증권사 API로 가져올 수 있는데, 이 둘을 엮으면 나 대신 주식을 분석해주는 봇을 만들 수 있지 않을까?"

그래서 만들기로 했다. 목표는 단순하다.

1. 시황에 따라 **스스로 분석**하고, 승률이 높아 보이는 종목을 **계좌 잔고 안에서** 운용한다.
2. 매일 장 시작·종료 시점에 잔고와 거래내역을 보고한다.
3. 내가 물어보면 언제든 현재 잔고나 거래내역을 알려준다.
4. 내가 따로 지정하는 종목은 검토 후 매수하거나 폐기한다.

이 시리즈는 그 과정을 기록한 것이다. 완성된 코드를 정리해서 보여주는 글이 아니라, 실제로 막히고 고치면서 간 과정을 그대로 담았다. 그래야 따라 하는 사람도 같은 함정을 피할 수 있으니까.

![stock market candlestick chart on dark screen](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxzdG9jayUyMHRyYWRpbmclMjBhdXRvbWF0aW9ufGVufDF8MHx8fDE3ODE4NTEzMzd8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Maxim Hopman](https://unsplash.com/@nampoh?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/stock-market-candlestick-chart-on-dark-screen-fiXLQXAhCfk?utm_source=spice-bandit-blog&utm_medium=referral)*

## 왜 멀티에이전트인가

처음엔 "LLM 하나한테 '이 종목 분석해서 살지 말지 알려줘' 하면 되지 않나?" 싶었다. 하지만 그건 위험하다. 한 모델에게 재무도 보고, 차트도 보고, 뉴스도 보고, 결론까지 내라고 하면 분석이 두루뭉술해진다. 사람도 그렇지 않은가. 재무 전문가, 차트 전문가, 뉴스 분석가가 따로 있고, 그들의 의견을 종합해 결정하는 사람이 따로 있다.

그래서 역할을 나눴다. 참고한 건 멀티에이전트 트레이딩 프레임워크들의 공통 구조였다. 분석가들이 각자 정보를 모으고, 그 위에서 종합·판단이 이뤄지고, 마지막에 리스크를 점검한 뒤 실행하는 계층 구조다.

핵심 원칙은 하나로 요약된다. **분석가는 편향 없이 데이터만 보고, 결정은 종합 단계에서, 실행은 결정론적 코드가 한다.**

## 전체 구조

설계한 구조는 이렇게 생겼다.

**1층 — 분석가 3명 (읽기 전용, 병렬 실행)**
- 재무 분석가: 회사가 돈을 잘 버는지, 지금 주가가 싼지 비싼지
- 기술적 분석가: 차트 흐름, 지금이 사기 좋은 타이밍인지
- 뉴스 분석가: 공시·뉴스에 악재나 호재가 있는지

이 셋은 의견(점수)만 낼 뿐 직접 사고팔지 않는다. 각자 자기 영역만 깊게 파고, 동시에 병렬로 돌려 속도를 확보한다.

**2층 — 종합·판단 (부모)**
세 분석가의 점수를 모아 "그래서 살까 말까"를 정한다. 여기서 중요한 설계 결정을 하나 했다. 흔히 보이는 "공격적 투자전략가" 같은 편향된 에이전트를 두지 않았다. 정체성에 "공격적으로 사라"가 박혀 있으면 분석 결과와 무관하게 매수 쪽으로 끌려가기 때문이다. 강세 논리와 약세 논리를 부모가 직접 양쪽 다 세워 균형을 잡는다.

**3층 — 리스크 매니저**
종목이 아무리 좋아도, 계좌 사정이 허락하지 않으면 막는다. "이 종목이 계좌의 몇 %가 되나? 한 종목에 몰빵 아닌가? 현금은 충분한가?" 목표 1번의 "잔고 안에서 운용"이 바로 이 역할이다.

**4층 — 실행 게이트 (결정론적 코드)**
이게 가장 중요하다. 실제 주문은 LLM이 내지 않는다. 킬스위치, 일일 손실 한도, 단일종목 비중 한도 같은 **타협 없는 하드룰**을 통과해야만 발주된다. LLM은 "사자"고 제안만 할 뿐, 실제 발주 버튼은 결정론적 게이트만 누른다.

![graphical user interface, application](https://images.unsplash.com/photo-1651341050677-24dba59ce0fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxzdG9jayUyMHRyYWRpbmclMjBhdXRvbWF0aW9ufGVufDF8MHx8fDE3ODE4NTEzMzd8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Anne Nygård](https://unsplash.com/@polarmermaid?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/graphical-user-interface-application-x07ELaNFt34?utm_source=spice-bandit-blog&utm_medium=referral)*

## LLM이 잘하는 것과 못 믿을 것

작업하면서 계속 지킨 원칙이 하나 있다. **LLM이 잘하는 것(해석·판단)은 맡기고, LLM이 못 믿을 것(숫자 계산·날짜·종목코드)은 코드가 처리한다.**

예를 들어 RSI나 이동평균 같은 기술적 지표는 파이썬이 정확히 계산해서 분석가에게 넘긴다. LLM에게 가격 100개를 던지고 "RSI 계산해"라고 하면 부정확하고 비싸다. 마찬가지로 리스크 매니저의 수량 계산도 전부 파이썬이 한다. 돈 계산은 한 푼도 틀리면 안 되니까.

실제로 작업 후반에 LLM이 분석 날짜(`as_of`)를 자기 학습 시점인 2023년으로 지어내는 일이 있었다. 오늘 날짜를 모르니 환각으로 채운 것이다. 이런 건 코드가 강제로 오늘 날짜를 박아 해결했다.

## 안전 우선

돈이 실제로 움직이는 시스템이라, 처음부터 끝까지 안전을 최우선에 뒀다.

- **모의투자로 시작**: 가짜 돈으로 충분히 검증한 뒤에야 실전을 생각한다.
- **manual 모드 기본값**: 봇은 "이거 살까요?"라고 제안만 하고, 내가 승인해야 실제로 산다. 신뢰가 쌓이면 자동(auto)으로 전환한다.
- **LLM 교체 가능 구조**: 분석가의 두뇌는 Claude든 Gemini든 갈아끼울 수 있게 추상화했다. 출력을 JSON 스키마로 고정해두면 어떤 모델을 쓰든 부모 입장에선 똑같기 때문이다.

## 다음 편 예고

설계는 이쯤이면 됐다. 다음 편부터는 실제 코드다. [2편에서는 API 키 발급·설치(준비물)부터 시작해, 모든 것의 토대가 되는 한국투자증권 API 연결](/blog/claude-code-stock-agent-2-kis-api/)을 다룬다. 토큰 발급의 1분 제한, 모의투자 서버의 변덕스러운 500 에러 등 실제로 부딪힌 함정들과 그 해결법까지 솔직하게 담을 예정이다. 따라 만들고 싶다면 2편의 "시작 전 준비"부터 보면 된다.

만드는 내내 느낀 건, 이런 시스템에서 화려한 분석 로직보다 훨씬 중요한 게 **"외부 API는 언제든 불안정하다고 가정하고 방어하는 것"** 이라는 점이었다. 그 이야기를 다음 편에서.

---

📚 **다음 편 →** [② 한국투자증권 API 연결](/blog/claude-code-stock-agent-2-kis-api/)

*※ 이 글은 개인 프로젝트 제작기로, 특정 종목의 매수·매도 권유나 투자 조언이 아닙니다. 자동매매는 손실 위험이 있으며 모든 투자 판단과 책임은 본인에게 있습니다.*
