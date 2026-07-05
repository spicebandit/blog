---
title: "주식봇 LLM 분석가 설계 — 재무·기술·뉴스 에이전트 프롬프트와 JSON 스키마 [3편]"
description: "Claude Code 주식 자동매매 봇의 두뇌 설계. 재무·기술·뉴스 분석가 3인의 프롬프트 설계, JSON 스키마 강제, LLM 재시도·폴백, 종목 스크리너까지 실전 구현을 공개합니다."
pubDate: 2026-06-21T09:00:00+09:00
category: "ai"
tags: ["ClaudeCode", "LLM", "Gemini", "프롬프트엔지니어링", "주식자동매매"]
---

> 📚 **연재 — 클로드코드로 주식투자 에이전트 만들기**
> [① 목적과 설계](/blog/claude-code-stock-agent-1-design/) · [② 한투 API 연결](/blog/claude-code-stock-agent-2-kis-api/) · **③ 분석가 두뇌** · [④ 매매와 안전장치](/blog/claude-code-stock-agent-4-trade-safety/) · [⑤ 운영 자동화](/blog/claude-code-stock-agent-5-operations/)

> **준비물**: 분석가의 두뇌로 쓸 LLM API 키가 필요하다. 나는 Google AI Studio에서 Gemini API 키를 발급받아 [2편](/blog/claude-code-stock-agent-2-kis-api/)에서 만든 `.env`의 `GEMINI_API_KEY`에 넣어뒀다. 기본 모델은 `gemini-2.5-flash`를 썼다(비용은 글 뒤에서).

## 세 개의 두뇌

이제 봇의 핵심, 분석가를 만들 차례다. 세 명을 만들되 성향이 서로 보완되게 설계했다.

- **재무 분석가 — 성장 중시**: 단순히 싼 주식이 아니라 이익이 빠르게 크고 ROE가 높은 기업을 선호한다. PER이 높아도 성장이 그걸 정당화하면 후한 점수를 준다.
- **기술적 분석가 — 절충**: 추세 방향(모멘텀)과 과열/과매도(평균회귀)를 함께 본다. 한쪽에 치우치지 않는다.
- **뉴스 분석가 — 악재 민감**: 좋은 종목을 찾는 역할이 아니라, 사면 안 될 위험 신호를 걸러내는 안전판이다.

좋은 종목을 찾는 둘과 사고를 막는 하나. 셋이 서로 견제하게 한 것이다.

![Business professionals discussing financial graphs on a flipchart during a daylight meeting.](https://images.pexels.com/photos/7876668/pexels-photo-7876668.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [www.kaboompics.com](https://www.pexels.com/@karola-g) on [Pexels](https://www.pexels.com/photo/a-man-in-eyeglasses-studying-the-graph-on-the-board-7876668/)*

## 출력을 JSON 스키마로 고정하기

가장 먼저 한 건 분석가들의 출력 형식을 못 박는 일이었다. 부모가 세 명의 결과를 받아 종합하려면 형식이 일정해야 한다. 그래서 공통 JSON 스키마를 정했다.

```json
{
  "analyst": "fundamental",
  "symbol": "005930",
  "stance": "neutral",       // bullish/neutral/bearish
  "score": 45,                // 0~100
  "confidence": 0.6,          // 확신도
  "key_points": ["..."],      // 수치 근거
  "risks": ["..."],
  "data_gaps": ["..."],       // 확인 못 한 항목 (추정 금지)
  "as_of": "2026-06-19"
}
```

`confidence`(확신도)와 `data_gaps`(확인 못 한 항목)를 넣은 게 핵심이다. 분석가가 데이터가 부족하면 솔직히 확신도를 낮추고, 없는 정보를 추측으로 메우지 않게 했다. 깡통 데이터로 "좋아 보여요!"라고 하는 걸 막기 위해서다.

## 처음엔 프롬프트로 부탁, 안 통해서 강제

첫 호출 결과는 절반의 성공이었다. 분석 내용은 훌륭했는데(삼성전자 PER 55에 52주 고점 근처라 신중하게 neutral), 필드명이 우리 스키마와 달랐다. `symbol` 대신 `stock_code`를 쓰고, `stance`는 아예 빼먹었다.

프롬프트로 "이 형식으로 답해줘"라고 부탁만 해서는 LLM이 자기 식대로 바꾼다. 그래서 Gemini API의 `responseSchema` 기능으로 **구조를 강제**했다. 부탁이 아니라 강제다. 이러면 정해진 9개 필드를, 정해진 순서로만 뱉는다.

## 또 환각 — 날짜를 지어내다

스키마를 강제하니 형식은 맞았는데, 이번엔 `as_of`(데이터 기준일)를 **2023-10-27**로 채웠다. 오늘은 2026년인데. LLM이 오늘 날짜를 모르니 자기 학습 시점으로 환각한 것이다.

해결은 1편에서 말한 원칙 그대로다. **LLM이 못 믿을 건 코드가 처리한다.** 응답을 받은 뒤 날짜와 종목코드는 파이썬이 강제로 덮어썼다.

```python
result["as_of"] = datetime.now().strftime("%Y-%m-%d")
result["symbol"] = symbol
```

## 지표는 파이썬이, 해석은 LLM이

기술적 분석가는 RSI, 이동평균, MDD 같은 지표가 필요하다. 그런데 LLM에게 가격 100개를 던지고 "RSI 계산해"라고 하면 부정확하고 토큰만 낭비한다. 그래서 지표는 파이썬이 정확히 계산해서 깔끔한 숫자로 넘기고, LLM은 그 숫자를 **해석만** 하게 했다.

```
일봉 100개 → indicators.py가 RSI·이평·MDD 계산 → 분석가는 해석만
```

실제로 삼성전자를 기술적 분석가에게 넣으니 이렇게 답했다. 정배열(상승추세)에 RSI 63.2로 "과열 직전이지만 건강한 모멘텀, bullish 75점". 다만 거래량이 줄고 고점 근처라는 점은 위험 요인으로 짚었다. 마냥 좋다고 하지 않고 약점도 본 것이다.

![a computer circuit board with a brain on it](https://images.unsplash.com/photo-1677442135703-1787eea5ce01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwZGF0YSUyMGFuYWx5c2lzfGVufDF8MHx8fDE3ODE4NTEzNDB8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Steve A Johnson](https://unsplash.com/@steve_j?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-computer-circuit-board-with-a-brain-on-it-_0iV9LmPDn0?utm_source=spice-bandit-blog&utm_medium=referral)*

## 무인 시스템의 생존 — 재시도와 모델 폴백

LLM 호출도 외부 API라 불안정하다. 실제로 `503 Service Unavailable`(서버 과부하)이 자주 떴다. 그래서 두 단계 방어를 넣었다.

1. **재시도(backoff)**: 503·429가 나면 1초, 2초, 4초로 점점 더 기다리며 재시도.
2. **모델 폴백 체인**: 그래도 안 되면 다른 모델로 자동 전환. `gemini-2.5-flash` → `flash-lite` → `2.0-flash` 순으로.

여기서 배운 점 하나. 503은 그 모델 서버가 붐비는 것이라, 더 비싼 모델로 "올린다"고 해결되지 않는다. 오히려 더 가벼운 다른 모델이 한가할 수 있다. 그래서 "올리기"가 아니라 "여러 후보를 차례로 시도"가 맞다. 실제로 장 마감 직후 주 모델이 붐빌 때 폴백이 여러 번 발동하며 봇을 살렸다.

## 운영 비용 — 하루 최대 300원

가장 궁금해할 비용 이야기. 분석가들은 하루에도 종목마다 LLM을 여러 번 부르지만, **`gemini-2.5-flash` 기준 API 비용은 하루 최대 300원 정도**였다. 솔직히 시작 전 예상보다 훨씬 쌌다.

이유는 앞서 세운 설계 원칙 덕분이다. RSI·이동평균·MDD 같은 무거운 계산은 파이썬이 끝내고, LLM에는 **이미 정리된 숫자 몇 개와 짧은 지시만** 넘긴다. 가격 100개를 통째로 던지지 않으니 입력 토큰이 적고, 출력도 9개 필드짜리 JSON으로 짧다. "LLM은 해석만 한다"는 경계가 정확도뿐 아니라 **비용에서도 이득**이었던 셈이다. 하루 커피 한 잔 값도 안 되는 돈으로 분석가 3명을 굴린 것이다. (가격은 모델·사용량·환율·시점에 따라 달라질 수 있다.)

## 종목을 알아서 고르게 — 스크리너

처음엔 내가 종목코드를 일일이 넣어줬다. 반쪽짜리였다. 봇이 "오늘 뭘 볼지"부터 정하게 해야 했다.

여기서 중요한 판단을 했다. **종목 발굴을 LLM에게 시키면 안 된다.** "오늘 살 만한 한국 주식 골라줘"라고 하면 환각으로 아무 종목이나 뱉거나, 옛날 정보로 고르거나, 없는 종목코드를 만들어낸다. 종목 발굴은 "수천 개를 객관적 숫자 기준으로 필터링"하는 일이고, 이건 LLM이 아니라 데이터 스크리닝(코드)이 할 일이다.

그래서 KIS의 거래대금 순위 API로 상위 종목을 뽑고, 가격·종류 필터(ETF·우선주 제외)를 거쳐 후보를 추렸다. 유동성 좋은 주류 종목 위주라 시장가 매매에도 안전하다. 구조는 2단계다.

```
[1단계] 스크리너(코드) — 거래대금 상위 → 후보 8개
[2단계] 분석가 3명(LLM) — 그 후보만 깊이 분석
```

실제로 돌리니 거래대금 상위에 SK하이닉스, 삼성전자, 삼성전기, SK스퀘어 같은 종목이 실시간으로 잡혔다. 그날은 반도체가 강세였다.

## 첫 종합 판단

분석가 3명을 병렬로 부르고 부모가 가중평균(재무 50%, 기술 30%, 뉴스 20%)으로 종합하게 했다. 삼성전자를 넣으니 이렇게 나왔다.

- 재무 50 (neutral) — PER 55 밸류 부담
- 기술 75 (bullish) — 강한 상승추세
- 뉴스 60 (neutral) — 데이터 없음
- **종합 59.5점 → 보류** (매수기준 65 미달)

기술적으론 끌리지만 재무 부담이 발목을 잡아 보류. 봇이 충동적으로 사지 않고 차분하게 판단한 것이다. 세 의견이 적절히 견제되며 합리적 결론이 나왔다.

종합 방식은 가중평균과 "전원 합의"(셋 다 bullish일 때만 매수) 중에 설정으로 전환할 수 있게 했다. 일단 가중평균으로 시작하고, 백테스트해보며 바꿀 수 있게.

## 다음 편

두뇌는 완성됐다. 종목을 고르고, 분석하고, 결론까지 낸다. 하지만 아직 사거나 팔지는 못한다. [다음 편에서는 리스크 매니저(잔고 안에서 수량을 정하는 안전판)와 실행 게이트(실제 주문을 내는 결정론적 방어선)를 만들고, 봇이 처음으로 실제 주식을 사는 순간](/blog/claude-code-stock-agent-4-trade-safety/)까지 간다.

---

📚 [← ② 한투 API 연결](/blog/claude-code-stock-agent-2-kis-api/) ·  **다음 편 →** [④ 매매와 안전장치](/blog/claude-code-stock-agent-4-trade-safety/)

*※ 이 글은 개인 프로젝트 제작기로, 특정 종목의 매수·매도 권유나 투자 조언이 아닙니다. 자동매매는 손실 위험이 있으며 모든 투자 판단과 책임은 본인에게 있습니다.*
