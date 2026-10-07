---
title: "토스증권 오픈API 발급·이용법 [2026] — 한국투자증권과 비교"
description: "토스증권 Open API 발급받는 법과 이용 방법을 단계별로, 그리고 한국투자증권(KIS)과 뭐가 다른지 비교했다. OAuth 인증·시세·주문 범위부터 자동매매에 어떤 증권사 API를 골라야 할지까지 개발자 관점 실전 가이드."
pubDate: 2026-07-07T07:05:49+09:00
updatedDate: 2026-10-07T09:14:38+09:00
category: ax
tags: ["토스증권API", "오픈API", "자동매매", "증권API"]
---

주식 자동매매나 시세 분석 프로그램을 만들려면 증권사의 API가 필요하다. 윈도우 PC에 OCX를 깔고 HTS를 상주시켜야 했던 1세대와 달리 **토큰만 있으면 OS를 가리지 않는 REST 방식**은, 2022년 한국투자증권(KIS)이 몇 년간 거의 혼자 열어 둔 문이었다. 그 선택지가 2026년 **토스증권 Open API**로 넓어졌다. 5월부터 사전 신청자에게만 순차 제공되던 것이 **2026년 8월 13일 전체 고객 대상 정식 서비스로 전환**됐다 — 지금은 토스증권 계좌가 있으면 누구나 발급받을 수 있다. 그렇다면 토스증권 API는 무엇이 다르고, 어떻게 발급받아 쓰며, 기존 강자인 한국투자증권과 비교하면 무엇을 골라야 할까? 이 글은 토스증권 오픈API의 **특징 → 발급 방법 → 이용 방법 → 한도·에러 → 한투(KIS) 대비 장단점**을 개발자 관점에서 정리한다.

가장 많이 찾는 세 가지 질문부터 답하면 이렇다.

| 질문 | 답 |
|---|---|
| **어디서 발급하나?** | 토스증권 **WTS(PC 웹) 로그인 → 설정 > Open API**에서 `client_id`·`client_secret` 발급. 같은 화면 하단 **허용 IP 관리**에 호출할 IP를 등록해야 한다(미등록 IP는 403). |
| **실시간(웹소켓) 되나?** | **된다.** `wss://openapi-ws.tossinvest.com/ws/v1`로 체결·호가·내 주문 이벤트를 구독한다. 계정당 동시 연결 2개, 연결당 구독 100건. |
| **토큰을 두 프로세스에서 같이 쓰나?** | **반드시 공유해야 한다.** 클라이언트당 유효 토큰은 1개뿐이고, 새로 발급하면 직전 토큰이 즉시 `401 token-revoked`로 죽는다. |

> ⚠️ 이 글은 API 활용 방법을 안내하는 기술 가이드이며, 특정 종목의 매수·매도를 권유하는 투자 조언이 아니다. API 정책·수수료·제공 범위는 변경될 수 있으니 각 사 공식 문서를 확인하자.
>
> *2026년 10월 7일 갱신 — 공식 스펙(REST v1.2.19 / 실시간 v1.2.2) 기준으로 엔드포인트 전체 목록, 그룹별 호출 한도, 에러 코드를 보강했다. 특히 **초기에 없던 웹소켓 실시간 API가 추가**되어 해당 내용을 전면 수정했다.*

## 토스증권 오픈API란 — 무엇을 주나

토스증권 Open API는 **국내(KRX·NXT 통합)와 미국 주식의 시세·종목정보·환율·계좌·주문 기능을 제공하는 REST API**이고, 여기에 **실시간 스트리밍용 웹소켓 API**가 따로 붙어 있다. REST 주소는 `https://openapi.tossinvest.com`, 웹소켓은 `wss://openapi-ws.tossinvest.com/ws/v1` 하나다.

| 카테고리 | 주는 것 | 인증 |
|---|---|---|
| **인증(Auth)** | OAuth 2.0 액세스 토큰 발급, JWKS | — |
| **시세(Market Data)** | 현재가·호가·최근 체결·상하한가·캔들 | 토큰만 |
| **종목정보(Stock Info)** | 종목 마스터, 매수 유의사항, 투자자별 매매동향, 프로그램매매, 공매도, 신용거래, 대차거래 | 토큰만 |
| **시장정보(Market Info)** | 환율, 국내·미국 장 운영 정보 | 토큰만 |
| **랭킹·시장지표** | 주식 랭킹, 국내 지수·국채 현재가·캔들, 투자자별 매매대금 | 토큰만 |
| **계좌·자산** | 계좌 목록, 보유 주식 | 토큰 + 계좌 헤더 |
| **주문(Order)** | 주문 생성·정정·취소·조회, 조건주문(OCO/OTO), 매수가능금액·매도가능수량·수수료 | 토큰 + 계좌 헤더 |
| **실시간(WebSocket)** | 체결 틱, 호가 갱신, 본인 주문 이벤트 | 토큰(핸드셰이크 헤더) |

시세 같은 공개 데이터는 토큰만으로 되지만, **계좌·자산·주문·조건주문처럼 내 자산을 다루는 API는 토큰에 더해 계좌 식별 헤더(`X-Tossinvest-Account: {accountSeq}`)**를 함께 보내야 한다. 이 헤더를 빼먹으면 `400 account-header-required`가 떨어진다 — 처음 붙일 때 가장 많이 만나는 에러다.

주목할 만한 건 **공매도·대차거래·신용거래·프로그램매매·투자자별 매매동향**이 종목정보 카테고리에 통째로 들어 있다는 점이다. "토스 API는 단순 시세만 준다"는 인상과 달리, 수급 데이터를 종목 단위로 뽑아 쓸 수 있다. 반대로 **파생상품(선물·옵션)·채권 거래와 재무제표는 없다** — 국채는 시장 지표 현재가 조회로 값만 받을 수 있고, 매매 대상은 아니다. 범위의 경계가 거기에 그어져 있다.

그리고 특징 하나를 더 꼽으라면 **"AI 코딩 에이전트가 읽기 좋게 만든 문서"**다. 토스증권은 사람용 문서 외에 `llms.txt`, 연동 가이드 마크다운, 그리고 기계가 그대로 파싱하는 **OpenAPI 3.0 JSON·AsyncAPI 3.0 JSON**을 공개한다. 실제로 이 글의 엔드포인트·한도·에러 코드는 전부 그 스펙 파일에서 직접 뽑은 것이다. 커서·클로드 같은 AI 코딩 도구에 "토스 API로 시세 받아줘"라고 시키면 스키마를 정확히 읽어 코드를 짜기 좋다는 뜻이고, 자동매매의 진입장벽 자체를 낮추려는 설계로 읽힌다.

![스마트폰 주식 앱과 노트북](https://images.unsplash.com/photo-1612461313144-fc1676a1bf17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxtb2JpbGUlMjBzdG9jayUyMHRyYWRpbmclMjBhcHAlMjBzbWFydHBob25lfGVufDF8MHx8fDE3ODMyOTc2MDh8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Dimitris Chapsoulas](https://unsplash.com/@synesthe2ia?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-android-smartphone-on-black-laptop-computer-CQFT1j8Ig30?utm_source=spice-bandit-blog&utm_medium=referral)*

## 발급 방법 — 클라이언트 등록부터 토큰까지

답부터: **WTS 설정 > Open API에서 자격증명을 받고, 같은 화면에서 허용 IP를 등록한 뒤, `POST /oauth2/token`으로 토큰을 받는다.** 공식 가이드의 순서는 다음 네 단계다.

1. **클라이언트 등록** — 토스증권 WTS(PC 웹)에 로그인해 **설정 > Open API** 메뉴에서 `client_id`와 `client_secret`을 발급받는다.
2. **허용 IP 등록** — 같은 메뉴 하단 **허용 IP 관리**에서 API를 호출할 IP를 등록한다. 목록에 없는 IP에서의 호출은 전부 403으로 차단된다.
3. **액세스 토큰 발급** — `POST /oauth2/token`을 Client Credentials Grant로 호출한다.
4. **API 호출** — 토큰을 `Authorization: Bearer {access_token}` 헤더에 담아 호출하고, 계좌·자산·주문·조건주문은 `X-Tossinvest-Account` 헤더를 추가한다.

```bash
curl -X POST https://openapi.tossinvest.com/oauth2/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=client_credentials' \
  -d "client_id=$TOSS_CLIENT_ID" \
  -d "client_secret=$TOSS_CLIENT_SECRET"
```

응답은 OAuth2 표준 형식이다. `token_type: "Bearer"`, 그리고 **`expires_in: 86400` — 유효기간 24시간**이다. 리프레시 토큰은 제공되지 않으므로, 만료되면 같은 엔드포인트로 다시 발급받는 구조다.

여기서 **처음 쓰는 사람이 거의 반드시 한 번 걸리는 함정이 두 개** 있다.

**첫째, 토큰은 클라이언트당 1개뿐이다.** 새로 발급하면 직전 토큰이 즉시 무효화되어 `401 token-revoked`로 거부된다. 국내 봇과 미국 주식 봇을 별도 프로세스로 돌리면서 각자 토큰을 발급받으면, 두 프로세스가 번갈아 상대방 토큰을 죽인다. 증상이 "잘 되다가 갑자기 401, 재발급하면 또 되다가 401"이라 원인 찾기가 고약하다. **토큰을 발급하는 주체를 하나로 두고(파일·Redis 등에 캐시해 공유), 모든 프로세스가 그 값만 읽게** 설계해야 한다.

**둘째, 허용 IP는 고정 IP여야 쓸 만하다.** 클라우드 인스턴스·서버리스·모바일 테더링처럼 호출마다 공인 IP가 바뀌는 환경이면 등록값과 실제 IP가 어긋나 계속 403이 난다. 공식 FAQ도 "고정 IP를 확보한 뒤 등록하라"고 안내한다(클라우드·데이터센터 대역이라서 막는 건 아니다). 서버리스로 매매 봇을 돌릴 계획이었다면, 설계 단계에서 고정 IP 경로(NAT 게이트웨이 등)를 먼저 확보해야 한다.

`client_secret`은 절대 외부(깃허브 등)에 노출하면 안 되며, 환경변수나 시크릿 매니저로 관리한다.

## 이용 방법 — 엔드포인트 전체 지도

공식 OpenAPI 스펙(v1.2.19) 기준 REST 엔드포인트는 다음과 같다. 추측이 아니라 스펙 파일에 적힌 실제 경로다.

| 메서드 · 경로 | 하는 일 | 계좌 헤더 |
|---|---|---|
| `POST /oauth2/token` | 액세스 토큰 발급 | — |
| `GET /api/v1/prices` | 현재가 조회 (심볼 최대 200개) | — |
| `GET /api/v1/orderbook` | 호가 조회 (KRX+NXT 통합 호가) | — |
| `GET /api/v1/trades` | 최근 체결 내역 (최대 50건) | — |
| `GET /api/v1/price-limits` | 상·하한가 조회 | — |
| `GET /api/v1/candles` | 캔들 조회 (`1m`·`1d`, 최대 200개) | — |
| `GET /api/v1/stocks` | 종목 기본 정보 | — |
| `GET /api/v1/stocks/all` | 마켓별 전체 종목 | — |
| `GET /api/v1/stocks/{symbol}/warnings` | 매수 유의사항 | — |
| `GET /api/v1/stocks/{symbol}/investor-trading` | 투자자별 매매동향 | — |
| `GET /api/v1/stocks/{symbol}/program-trades` | 프로그램매매 동향 | — |
| `GET /api/v1/stocks/{symbol}/short-selling` | 공매도 동향 | — |
| `GET /api/v1/stocks/{symbol}/credit-trades` | 신용거래 동향 | — |
| `GET /api/v1/stocks/{symbol}/securities-lending` | 대차거래 동향 | — |
| `GET /api/v1/exchange-rate` | KRW↔USD 환율 | — |
| `GET /api/v1/market-calendar/KR` · `/US` | 장 운영 정보(세션별 시각·휴장) | — |
| `GET /api/v1/rankings` | 주식 랭킹(거래대금·급등락 등) | — |
| `GET /api/v1/market-indicators/prices` | 시장 지표(지수) 현재가 | — |
| `GET /api/v1/market-indicators/{symbol}/candles` | 지수 캔들 | — |
| `GET /api/v1/market-indicators/{symbol}/investor-trading` | 투자자별 매매대금(KOSPI·KOSDAQ) | — |
| `GET /api/v1/accounts` | 계좌 목록(`accountSeq` 확인) | — |
| `GET /api/v1/holdings` | 보유 주식 조회 | 필요 |
| `POST /api/v1/orders` | 주문 생성 | 필요 |
| `GET /api/v1/orders` | 주문 목록 조회 | 필요 |
| `GET /api/v1/orders/{orderId}` | 주문 상세 조회 | 필요 |
| `POST /api/v1/orders/{orderId}/modify` · `/cancel` | 주문 정정·취소 | 필요 |
| `POST` · `GET /api/v1/conditional-orders` | 조건주문 생성(SINGLE·OCO·OTO)·목록 조회 | 필요 |
| `GET` · `DELETE /api/v1/conditional-orders/{conditionalOrderId}` | 조건주문 상세 조회·취소 | 필요 |
| `POST /api/v1/conditional-orders/{conditionalOrderId}/modify` | 조건주문 수정 | 필요 |
| `GET /api/v1/buying-power` | 매수 가능 금액 | 필요 |
| `GET /api/v1/sellable-quantity` | 매도 가능 수량 | 필요 |
| `GET /api/v1/commissions` | 매매 수수료 | 필요 |

*출처: [토스증권 Open API OpenAPI JSON](https://openapi.tossinvest.com/openapi-docs/latest/openapi.json) (v1.2.19, 2026-10-07 확인)*

파이썬으로 토큰 발급 → 시세 → 주문까지의 뼈대는 이렇게 짧다.

```python
import os, requests

BASE = "https://openapi.tossinvest.com"

# 1) 토큰 발급 (24시간 유효 · 클라이언트당 1개)
tok = requests.post(f"{BASE}/oauth2/token", data={
    "grant_type": "client_credentials",
    "client_id": os.environ["TOSS_CLIENT_ID"],
    "client_secret": os.environ["TOSS_CLIENT_SECRET"],
}).json()["access_token"]
h = {"Authorization": f"Bearer {tok}"}

# 2) 시세 조회 — 토큰만 필요
prices = requests.get(f"{BASE}/api/v1/prices", headers=h,
                      params={"symbols": "005930,AAPL"}).json()

# 3) 계좌 확인 → accountSeq 를 계좌 헤더에 사용
accounts = requests.get(f"{BASE}/api/v1/accounts", headers=h).json()["result"]
ha = {**h, "X-Tossinvest-Account": str(accounts[0]["accountSeq"])}

# 4) 지정가 매수 — clientOrderId 로 멱등성 확보
order = requests.post(f"{BASE}/api/v1/orders", headers=ha, json={
    "clientOrderId": "my-order-001",
    "symbol": "005930", "side": "BUY",
    "orderType": "LIMIT", "timeInForce": "DAY",
    "quantity": "10", "price": "70000",
}).json()
```

주문 요청에서 알아둘 필드가 네 개 있다.

- **`clientOrderId`(멱등성 키)**: 같은 값으로 재요청하면 이전 주문 결과를 그대로 돌려준다. 유효기간은 10분. 네트워크 타임아웃 뒤 재시도할 때 중복 주문을 막는 유일한 수단이니, **자동매매라면 안 넣을 이유가 없다.** 서버가 자동 생성해 주지는 않는다.
- **`timeInForce`**: `DAY`(기본) / `CLS`(장 마감, 미국 지정가 전용) / `OPG`(장 개시 시가단일가, 국내 전용). `LIMIT`+`CLS` 조합이 곧 LOC 주문이다.
- **`confirmHighValueOrder`**: **1억원 이상 주문은 이 플래그가 `true`가 아니면 `400 confirm-high-value-required`로 거부**된다. 착오주문 방지 장치다.
- **소수점·금액 주문**: `orderAmount`(금액 지정)는 **미국 시장가 전용**, 소수점 수량은 **미국 시장가 매도만** 허용된다. 둘 다 **정규장 시작부터 종료 1시간 전까지만** 접수되고, 그 외 시간엔 `422 amount-order-outside-regular-hours` / `422 fractional-quantity-outside-regular-hours`가 떨어진다.

## 호출 한도 — 그룹별로 따로 센다

답부터: **한도는 "클라이언트 × API 그룹" 단위 초당 요청 수(TPS)**이고, 공식 한도 표 기준으로 그룹이 18개로 쪼개져 있다(이 중 실제 엔드포인트 설명에 태깅된 것은 17개다). 시세를 많이 긁어도 주문 한도는 따로 남아 있다는 뜻이라 구조적으로는 유리하다. 다만 **계좌 목록과 전종목 조회는 초당 1회**라서, 이 둘을 루프 안에서 부르는 코드는 바로 막힌다.

| Rate Limits Group | 초당 한도 | 해당 API |
|---|---|---|
| `MARKET_DATA_CHART` | 20회 | 캔들 |
| `MARKET_DATA` | 15회 | 현재가·호가·체결·상하한가 |
| `STOCK_TRADING_TREND` | 10회 | 공매도·신용·대차·프로그램매매 등 |
| `ORDER` | 10회 | 주문 생성·정정·취소 |
| `MARKET_INDICATOR` · `MARKET_INDICATOR_PRICE` | 10회 | 시장 지표 |
| `CONDITIONAL_ORDER_HISTORY` | 10회 | 조건주문 조회 |
| `ORDER_INFO` | 6회 (09:00~09:10 KST 3회) | 매수가능금액·매도가능수량·수수료 |
| `AUTH` · `ASSET` · `STOCK` · `RANKING` · `ORDER_HISTORY` · `CONDITIONAL_ORDER` · `MARKET_INDICATOR_CHART` | 5회 | 토큰·보유주식·종목정보·랭킹·주문조회 등 |
| `MARKET_INFO` | 3회 | 환율·장 운영 정보 |
| `ACCOUNT` · `STOCK_ALL` | **1회** | 계좌 목록 · 마켓별 전체 종목 |

*출처: [토스증권 Open API 연동 가이드 — Rate Limits](https://openapi.tossinvest.com/openapi-docs/overview.md) (2026-10-07 확인). 한도는 사전 공지 없이 조정될 수 있다.*

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px;margin:24px 0;">
<svg viewBox="0 0 760 450" style="width:100%;height:auto" role="img" aria-label="토스증권 Open API 그룹별 초당 호출 한도 막대그래프. 캔들 20회, 시세 15회, 주문 10회, 수수료·가능금액 6회, 토큰·보유주식 5회, 환율·장운영 3회, 계좌목록·전종목 1회.">
<text x="0" y="18" font-size="15" font-weight="700" fill="#23201D">그룹별 초당 호출 한도 — 병목은 계좌 목록·전종목 조회(초당 1회)</text>
<text x="0" y="40" font-size="12" fill="#8A8378">단위: 초당 요청 수(TPS) · 클라이언트 × 그룹 단위로 별도 집계</text>
<line x1="160" y1="52" x2="160" y2="408" stroke="#E5DECF" stroke-width="1" />
<text x="152" y="76" font-size="12.5" fill="#23201D" text-anchor="end">캔들(CHART)</text>
<rect x="160" y="60" width="560" height="24" fill="#4E7FA8" rx="2" />
<text x="728" y="77" font-size="12.5" fill="#23201D">20</text>
<text x="152" y="110" font-size="12.5" fill="#23201D" text-anchor="end">시세(MARKET_DATA)</text>
<rect x="160" y="94" width="420" height="24" fill="#4E7FA8" rx="2" />
<text x="588" y="111" font-size="12.5" fill="#23201D">15</text>
<text x="152" y="144" font-size="12.5" fill="#23201D" text-anchor="end">수급 동향</text>
<rect x="160" y="128" width="280" height="24" fill="#A8BDD2" rx="2" />
<text x="448" y="145" font-size="12.5" fill="#23201D">10</text>
<text x="152" y="178" font-size="12.5" fill="#23201D" text-anchor="end">주문(ORDER)</text>
<rect x="160" y="162" width="280" height="24" fill="#4E7FA8" rx="2" />
<text x="448" y="179" font-size="12.5" fill="#23201D">10</text>
<text x="152" y="212" font-size="12.5" fill="#23201D" text-anchor="end">시장지표</text>
<rect x="160" y="196" width="280" height="24" fill="#A8BDD2" rx="2" />
<text x="448" y="213" font-size="12.5" fill="#23201D">10</text>
<text x="152" y="246" font-size="12.5" fill="#23201D" text-anchor="end">주문정보(ORDER_INFO)</text>
<rect x="160" y="230" width="168" height="24" fill="#A8BDD2" rx="2" />
<text x="336" y="247" font-size="12.5" fill="#23201D">6 (개장 직후 3)</text>
<text x="152" y="280" font-size="12.5" fill="#23201D" text-anchor="end">토큰·보유주식·종목</text>
<rect x="160" y="264" width="140" height="24" fill="#A8BDD2" rx="2" />
<text x="308" y="281" font-size="12.5" fill="#23201D">5</text>
<text x="152" y="314" font-size="12.5" fill="#23201D" text-anchor="end">환율·장 운영</text>
<rect x="160" y="298" width="84" height="24" fill="#A8BDD2" rx="2" />
<text x="252" y="315" font-size="12.5" fill="#23201D">3</text>
<text x="152" y="348" font-size="12.5" fill="#23201D" text-anchor="end">계좌 목록</text>
<rect x="160" y="332" width="28" height="24" fill="#1B4F8A" rx="2" />
<text x="196" y="349" font-size="12.5" font-weight="700" fill="#1B4F8A">1</text>
<text x="152" y="382" font-size="12.5" fill="#23201D" text-anchor="end">전종목 조회</text>
<rect x="160" y="366" width="28" height="24" fill="#1B4F8A" rx="2" />
<text x="196" y="383" font-size="12.5" font-weight="700" fill="#1B4F8A">1</text>
<line x1="160" y1="408" x2="720" y2="408" stroke="#E5DECF" stroke-width="1" />
<text x="160" y="426" font-size="11" fill="#8A8378">0</text>
<text x="300" y="426" font-size="11" fill="#8A8378">5</text>
<text x="440" y="426" font-size="11" fill="#8A8378">10</text>
<text x="580" y="426" font-size="11" fill="#8A8378">15</text>
<text x="714" y="426" font-size="11" fill="#8A8378">20</text>
</svg>
<figcaption style="font-size:13px;color:#8A8378;margin-top:10px;">그룹이 쪼개져 있어 시세를 많이 긁어도 주문 한도는 따로 남는다. 반대로 계좌 목록·전종목 조회는 초당 1회라, 이 둘을 루프 안에서 호출하는 코드는 즉시 429를 만난다. 출처: 토스증권 Open API 연동 가이드(2026-10-07 확인).</figcaption>
</figure>

한도 관리의 실무 포인트는 **헤더를 읽는 것**이다. `X-RateLimit-*`는 정상 응답과 429 응답 모두에 붙고, `Retry-After`는 429에만 붙는다.

| 헤더 | 의미 |
|---|---|
| `X-RateLimit-Limit` | 현재 허용된 초당 요청 수(버스트 용량) |
| `X-RateLimit-Remaining` | 버킷에 남은 토큰 수 (429일 때 0) |
| `X-RateLimit-Reset` | 토큰 1개가 재충전될 때까지 예상 초 |
| `Retry-After` | 429 응답에서 재시도 권장 초 |

토큰 버킷 방식이므로, **`X-RateLimit-Remaining`이 줄어드는 걸 보고 미리 속도를 줄이는** 쪽이 429를 맞고 백오프하는 것보다 안정적이다. 429를 받았다면 `Retry-After`를 따르고, 지수 백오프(1초 → 2초 → 4초, 지터 포함)로 재시도한다.

## 웹소켓 실시간 — 무엇을 어떻게 구독하나

이 부분이 초기 버전과 가장 크게 달라진 지점이다. **토스증권 Open API는 이제 웹소켓 실시간 스트리밍을 제공한다.** REST 폴링으로 시세를 긁어야 했던 제약이 사라졌다.

![모니터에 표시된 코드](https://images.pexels.com/photos/374563/pexels-photo-374563.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Digital Buggu](https://www.pexels.com/@digitalbuggu) on [Pexels](https://www.pexels.com/photo/computer-screen-screengrab-374563/)*

구조는 단순하다. 엔드포인트는 `wss://openapi-ws.tossinvest.com/ws/v1` 하나이고, 핸드셰이크에 REST와 **동일한 액세스 토큰**을 `Authorization: Bearer` 헤더로 실어 보낸다(토큰이 없거나 만료면 401, 허용 IP 미등록이면 403으로 연결 거부 — REST와 같은 IP 목록을 쓴다). 받을 데이터는 구독 메시지의 `type`으로 고른다.

구독 모델은 **선언형(full-replace)**이다. subscribe/unsubscribe 액션이 따로 없고, **클라이언트가 보내는 JSON 배열 1개가 곧 현재 구독 전체**다. 새 배열은 기존 구독을 전부 대체하고, 빠진 항목은 자동 해제되며, 빈 배열 `[]`은 전체 해제다.

```json
[
  {"id": "req-1"},
  {"type": "trade:kr",     "codes": ["005930", "000660"]},
  {"type": "orderbook:us", "codes": ["AAPL", "TSLA"]},
  {"type": "personal:order", "codes": ["3"]}
]
```

`type`에 따라 `codes`에 넣는 값이 다르다. `trade:kr`·`orderbook:kr`은 6자리 국내 종목코드, `trade:us`·`orderbook:us`는 미국 티커, 그리고 **`personal:order`는 종목이 아니라 계좌 `accountSeq`**를 넣는다(이걸 종목코드로 착각하면 구독이 거부된다). 선언 직후 확정·거부 결과가 ack 프레임으로 오고, `id`를 넣어 두면 그 값이 echo된다.

수신 프레임은 이런 모양이다.

```json
{"type": "message", "topic": "trade:us:AAPL",
 "data": {"price": "243.26", "volume": "8",
          "timestamp": "2026-06-18T23:30:00.000+09:00", "currency": "USD"}}
```

한도는 스펙에 숫자로 명시돼 있다.

| 항목 | 한도 | 초과 시 |
|---|---|---|
| 동시 연결 | 계정당 **2개** | 새 연결이 수락되고 **가장 오래된 연결이 종료** |
| 연결당 구독 수 | **100건** (`codes` 합산) | `too-many-topics` 에러 프레임 |
| 선언(요청) 빈도 | **5회/초** | `rate-limit-exceeded` 에러 프레임 (REST와 달리 `Retry-After` 없음 — 약 1초 대기 후 재선언) |

*출처: [토스증권 Open API AsyncAPI JSON](https://openapi.tossinvest.com/openapi-docs/latest/asyncapi.json) (실시간 스펙 v1.2.2, 2026-10-07 확인)*

구독 수는 **채널 × 종목 조합** 기준이다. 같은 삼성전자라도 체결과 호가를 같이 보면 2건으로 센다. 따라서 "체결+호가 둘 다"로 가면 실질 상한은 50종목이다.

운영에서 챙길 것은 세 가지다. **첫째, keepalive.** 서버는 **클라이언트로부터의 수신이 180초간 없으면 연결을 끊는데, 서버가 보내주는 데이터는 이 타이머를 리셋하지 않는다.** 즉 체결이 쏟아지는 중에도 가만히 받고만 있으면 끊긴다. 대문자 `PING` 텍스트 프레임(JSON 아님)을 60초 간격으로 보내고 `pong`을 받는 게 권장 방식이다. **둘째, 재연결.** 서버 배포 시엔 `server-shutdown` 에러 프레임이 먼저 오지만, idle 초과나 동시 연결 한도로 밀려날 때는 **별도 close code 없이 그냥 끊길 수 있다.** 끊김을 감지하면 지수 백오프로 재접속하고 구독을 다시 선언해야 한다. **셋째, 재연결 전에 기존 연결을 먼저 닫는 것.** 안 닫으면 새 연결이 앞 연결을 밀어내면서 끊김이 무한 반복된다 — 연결 한도가 2개라서 생기는 전형적인 자해 패턴이다.

그리고 실시간 호가는 **증분이 아니라 전체 스냅샷**으로 온다. 매 프레임에 그 시점의 매도호가·매수호가 전체가 담겨 오므로, 클라이언트에서 호가창 상태를 누적 병합할 필요가 없다. 구현이 쉬워지는 대신 프레임 크기는 커진다.

### 전달 보장 — 주문 이벤트를 "믿어도 되는" 범위

여기가 봇 안정성에 직결되는 대목인데 놓치기 쉽다. 채널마다 **전달 보장 수준이 다르다.**

| 채널 | 보장 | 뜻 |
|---|---|---|
| 시세 (`trade`·`orderbook`) | **LOSSY** | 수신이 밀리면 중간 프레임이 유실될 수 있다. 항상 최신 상태 우선이고, **유실 감지용 sequence 번호를 제공하지 않는다** |
| 주문 (`personal:order`) | **LOSSLESS** | 미소비분(backlog)을 건너뛰지 않는다. 단 **수신이 2초 이상 계속 막히면 연결이 종료**된다 |

시세가 LOSSY라는 건, 웹소켓 체결 틱을 모아 직접 분봉을 만들면 **거래량이 공식 캔들과 어긋날 수 있다**는 뜻이다. 집계가 중요하면 캔들 API를 쓰고, 웹소켓은 "지금 값"을 보는 데 쓰는 게 맞다.

더 중요한 건 주문 채널의 단서 조항이다. **LOSSLESS 보장은 연결 세션 내로만 한정된다.** 연결이 끊긴 구간에 발생한 주문 이벤트는 **다시 전달되지 않는다.** 그래서 `personal:order`만 믿고 포지션을 갱신하는 봇은, 새벽에 한 번 끊긴 뒤 체결을 놓친 상태로 계속 돌아간다. **재연결 직후에는 반드시 `GET /api/v1/orders`로 주문 상태를 재동기화**해야 한다 — 공식 가이드가 명시적으로 요구하는 절차다.

### 그래도 폴링이 남는 자리

웹소켓이 생겼다고 폴링이 필요 없어지는 건 아니다. 구독 한도가 **연결당 100건**이므로, 수백 종목을 훑는 스크리닝은 여전히 REST 쪽 일이다. 반대로 종목 수가 적고 반응 속도가 중요하면 웹소켓이 압도적으로 유리하다. 아래는 100종목을 1초 주기로 보려 할 때의 비교다.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px;margin:24px 0;">
<svg viewBox="0 0 760 240" style="width:100%;height:auto" role="img" aria-label="100종목을 1초 주기로 볼 때 필요한 초당 호출 수 비교 막대그래프. REST 폴링은 초당 100회가 필요하지만 시세 그룹 한도는 초당 15회이고, 웹소켓은 구독 선언 1회 뒤 추가 호출이 0회다.">
<text x="0" y="18" font-size="15" font-weight="700" fill="#23201D">100종목 · 1초 주기로 보려면 — 낮을수록 유리</text>
<text x="0" y="40" font-size="12" fill="#8A8378">단위: 초당 필요 호출 수</text>
<line x1="210" y1="52" x2="210" y2="196" stroke="#E5DECF" stroke-width="1" />
<text x="202" y="76" font-size="12.5" fill="#23201D" text-anchor="end">REST 폴링 (필요량)</text>
<rect x="210" y="60" width="500" height="26" fill="#1B4F8A" rx="2" />
<text x="222" y="78" font-size="12.5" font-weight="700" fill="#FAF6EE">100회 — 한도의 6.7배</text>
<text x="202" y="118" font-size="12.5" fill="#23201D" text-anchor="end">MARKET_DATA 한도</text>
<rect x="210" y="102" width="75" height="26" fill="#A8BDD2" rx="2" />
<text x="293" y="120" font-size="12.5" fill="#23201D">15회</text>
<text x="202" y="160" font-size="12.5" fill="#23201D" text-anchor="end">웹소켓 구독</text>
<rect x="210" y="144" width="3" height="26" fill="#4E7FA8" />
<text x="221" y="162" font-size="12.5" fill="#23201D">0회 — 선언 1회 뒤 서버가 푸시 (구독 100건 한도 내)</text>
<line x1="210" y1="196" x2="710" y2="196" stroke="#E5DECF" stroke-width="1" />
<text x="210" y="214" font-size="11" fill="#8A8378">0</text>
<text x="335" y="214" font-size="11" fill="#8A8378">25</text>
<text x="460" y="214" font-size="11" fill="#8A8378">50</text>
<text x="585" y="214" font-size="11" fill="#8A8378">75</text>
<text x="700" y="214" font-size="11" fill="#8A8378">100</text>
</svg>
<figcaption style="font-size:13px;color:#8A8378;margin-top:10px;">현재가 조회는 한 번에 심볼 200개를 묶어 보낼 수 있어 실제로는 1회로도 100종목을 커버하지만, 호가·체결을 종목별로 받아야 하는 경우엔 호출 수가 종목 수만큼 늘어난다. 그 구간이 웹소켓으로 넘어갈 자리다. 한도 출처: 토스증권 연동 가이드(2026-10-07 확인).</figcaption>
</figure>

실무적 결론은 이렇다. **감시 대상이 100건 이내면 웹소켓, 그보다 넓은 스크리닝은 REST**로 가는 2계층 구조가 정답에 가깝다. 현재가 조회(`/prices`)가 심볼을 한 번에 200개까지 받는다는 점이 여기서 크게 쓰인다 — 넓게 훑는 건 1회 호출로, 좁게 지켜보는 건 구독으로 나누면 한도 양쪽을 다 아끼게 된다.

## 자주 만나는 에러 — 코드만 보고 바로 고치기

답부터: **에러는 HTTP status보다 `code` 필드로 분기**해야 한다. 공식 OpenAPI 스펙의 `message` 필드 설명이 "내부 정책상 노출이 제한되는 경우 빈 문자열로 내려갈 수 있으므로 클라이언트는 `code` 기반으로 메시지를 자체 매핑할 것을 권장한다"고 못 박는다. 응답 envelope은 이렇다.

```json
{"error": {"requestId": "01HXYZABCDEFG123456789",
           "code": "invalid-request",
           "message": "주문 방향이 올바르지 않습니다.",
           "data": {"field": "side", "allowedValues": ["BUY", "SELL"]}}}
```

`requestId`는 응답 헤더 `X-Request-Id`와 같은 값이고, CS 문의 때 첨부하라고 안내된다. `data`에 해결 힌트(어느 필드가 틀렸는지, 올바른 호가 단위가 얼마인지 등)가 담겨 오므로 **로그에 `code`와 `data`를 같이 남기는 것**이 디버깅 시간을 가장 많이 줄여준다.

자동매매를 붙이면 실제로 자주 만나는 코드는 다음과 같다.

| HTTP | `code` | 원인 | 바로 할 조치 |
|---|---|---|---|
| 401 | `invalid_client` (토큰 발급 단계) | `client_id`·`client_secret` 오입력 | WTS 복사 버튼으로 다시 복사. 앞뒤 공백·줄바꿈 확인. 허용 IP와 무관 |
| 400 | `invalid_request` (토큰 발급 단계) | 값이 아니라 **요청 형식** 문제 | `application/x-www-form-urlencoded`인지, `grant_type` 누락 아닌지 확인 |
| 403 | `access_denied` / `edge-blocked` | 허용 IP 미등록 | WTS 설정 > Open API > 허용 IP 관리에 등록. 가변 IP면 고정 IP 확보 |
| 401 | `token-revoked` | 다른 프로세스가 토큰을 재발급해 무효화 | 토큰 발급 주체를 1개로 통일하고 캐시 공유 |
| 401 | `expired-token` | 24시간 만료 | 재발급 로직. 만료 전 선제 갱신 |
| 400 | `account-header-required` | `X-Tossinvest-Account` 누락 | 계좌·자산·주문 호출에 계좌 헤더 추가 |
| 400 | `confirm-high-value-required` | 1억원 이상 주문 | `confirmHighValueOrder: true` |
| 400 | `invalid-request` (호가 단위) | KR 지정가가 호가 단위에 안 맞음 | `data`에 올바른 `tickSize`가 담겨 온다 — 그 값으로 반올림 |
| 409 | `opposite-pending-order-exists` | 같은 종목에 반대 방향 미체결 주문 존재 | 기존 미체결 주문 취소 후 재주문 |
| 409 | `already-filled` · `already-canceled` | 정정·취소 대상이 이미 종료됨 | 주문 상태 재조회 후 분기 |
| 422 | `idempotency-key-conflict` | 같은 `clientOrderId`로 내용이 다른 주문 | 주문 내용이 바뀌면 키도 새로 생성 |
| 422 | `order-hours-closed` | 주문 접수 불가 시간 | 장 운영 정보 API로 세션 확인 후 대기 |
| 422 | `insufficient-buying-power` | 매수 가능 금액 부족 | 주문 직전 `/buying-power` 확인 |
| 422 | `insufficient-sellable-quantity` | 매도 가능 수량 부족 | 주문 직전 `/sellable-quantity` 확인 (보유 수량 ≠ 매도 가능 수량) |
| 422 | `price-out-of-range` | 주문 가격이 상·하한가 밖 | `/price-limits`로 범위 확인 후 가격 보정 |
| 409 | `request-in-progress` | 같은 `clientOrderId` 요청이 이미 처리 중 | 재시도하지 말고 결과를 기다린 뒤 주문 조회로 확인 |
| 422 | `prerequisite-required` | 약관 동의·위험 고지 미완료 (예: 미국 레버리지 ETF) | **앱에서** 해당 종목 구매 화면에 들어가 등록 절차 완료. API로는 불가 |
| 429 | `rate-limit-exceeded` · `edge-rate-limit-exceeded` | 초당 한도 초과 | `Retry-After` 준수 + 지수 백오프 |

*출처: [토스증권 Open API 연동 가이드 — 에러 응답](https://openapi.tossinvest.com/openapi-docs/overview.md), [OpenAPI JSON](https://openapi.tossinvest.com/openapi-docs/latest/openapi.json), [FAQ](https://openapi.tossinvest.com/openapi-docs/faq.md) (2026-10-07 확인)*

여기서 특히 성가신 건 **`opposite-pending-order-exists`**다. 같은 종목에 반대 방향 미체결 주문이 남아 있으면 **가격이 겹치지 않아도** 409로 거부된다. 분할 매수와 목표가 매도를 동시에 걸어두는 전략은 이 제약을 전제로 다시 설계해야 한다. 또 공식 FAQ는 "짧은 시간에 소액 주문을 수백 건 반복하면 어뷰징으로 판단돼 일정 시간 매매가 제한될 수 있다"고 명시한다 — 주문을 쪼개는 전략은 빈도 상한을 코드에 박아 두는 게 안전하다.

## 데이터 범위와 이용 조건 — 미리 알아야 설계가 안 꼬인다

캔들·체결 데이터에는 알아둘 전제가 몇 개 있다. 공식 FAQ 기준이다.

| 항목 | 내용 |
|---|---|
| 과거 데이터 시작 | 국내 **2022-11-23** 이후, 미국 **2021-11-30** 이후. 그 이전은 제공 안 됨 |
| 캔들 주기·건수 | `1m`·`1d` 두 종류, 한 번에 최대 200개(`before`로 과거 페이지네이션) |
| 최근 체결 | 최대 50건, **과거 방향 페이지네이션 없음** — 당일 전체 체결 조회 불가 |
| 1분봉 `timestamp` | **봉 종료 시각.** `09:01` 봉 = `09:00:00.000~09:00:59.999` 구간 |
| 국내 시세 범위 | **KRX + NXT 통합.** 거래소 지정 조회·식별 필드 없음 |
| 국내 1분봉 제공 시간 | 08:01 ~ 20:00 (프리마켓 시작 ~ 애프터마켓 종료) |
| 1분봉 합 ≠ 일봉 | 정상. 1분봉은 접속매매만, 일봉은 시간외종가·대량·바스켓 등 전 매매구분 합산 |
| 미국 시세 기준 | **NBBO가 아님.** 일부 미국 거래소 데이터 기준이며 세션별로 원천이 다를 수 있음 |
| 상장폐지 종목 | 과거 시세 조회 불가 (`404 stock-not-found`) |

*출처: [토스증권 Open API FAQ](https://openapi.tossinvest.com/openapi-docs/faq.md) (2026-10-07 확인)*

백테스트를 설계하다 보면 이 표의 첫 줄과 마지막 줄에서 막힌다. **국내 2022년 11월부터**라는 건 3년치 조금 넘는 데이터라는 뜻이고, 상장폐지 종목이 조회되지 않는다는 건 **생존 편향(survivorship bias)을 피할 수 없다**는 뜻이다. 10년치 백테스트나 폐지 종목까지 포함한 검증이 필요하면 시세 데이터는 다른 경로로 확보해야 한다. 반대로 "최근 몇 년, 지금 살아 있는 종목"으로 충분한 전략이라면 문제가 없다.

그리고 **가장 중요한 제약은 기술이 아니라 약관**이다. 공식 FAQ의 데이터 이용 정책은 이렇게 못 박는다.

> API를 통해 제공받는 정보는 투자자 본인의 매매 목적에 한하여 이용하여야 합니다. 상업적 이용이 제외될 뿐만 아니라 비상업적인 용도라 하더라도 제 3자에게 배포하는 행위는 엄격히 금지됩니다.

즉 **이 API로 받은 시세를 남에게 보여주는 서비스는 만들 수 없다.** 내 봇이 내 계좌를 돌리는 건 되지만, 시세 대시보드를 공개하거나 친구에게 알림을 보내는 것은 허용 범위를 벗어난다. 사이드 프로젝트를 서비스로 키울 생각이었다면 **코드를 쓰기 전에** 이 문장을 먼저 읽어야 한다.

## 한국투자증권(KIS)과 비교 — 장단점

![스마트폰과 개발 화면](https://images.unsplash.com/photo-1612043273453-8f005184fb15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHw1fHxtb2JpbGUlMjBzdG9jayUyMHRyYWRpbmclMjBhcHAlMjBzbWFydHBob25lfGVufDF8MHx8fDE3ODMyOTc2MDh8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Michael Förtsch](https://unsplash.com/@michael_f?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/white-samsung-android-smartphone-turned-on-displaying-google-search-wZw0B9u_1pg?utm_source=spice-bandit-blog&utm_medium=referral)*

웹소켓이 생기면서 비교의 축이 바뀌었다. 예전엔 "실시간이 되냐 안 되냐"가 갈림길이었는데, 이제 둘 다 되므로 **자산 범위와 모의투자 환경**이 실제 선택 기준이 된다.

| 항목 | 토스증권 Open API | 한국투자증권(KIS) API |
|---|---|---|
| 성숙도 | 신규 — 2026-08-13 전체 고객 정식 출시 | 성숙·안정, 레퍼런스 풍부 |
| 자산 범위 | 국내·미국 **주식 중심** | 주식 + **국내외 선물옵션·장내채권**까지 |
| 수급 데이터 | 공매도·대차·신용·프로그램매매·투자자별 동향 제공 | 폭넓게 제공 |
| 파생·채권 | 없음 | 있음 |
| 실시간 | **웹소켓 제공** (연결 2개 × 구독 100건) | 웹소켓 제공 |
| 호출 한도 공개 | **그룹별 TPS를 스펙에 숫자로 명시** | 포털에서 한도 수치를 바로 찾기 어려움 |
| 모의투자 | 없음 (실계좌만) | **TESTBED 제공** |
| 문서화 | **AI 친화적**(llms.txt·OpenAPI/AsyncAPI JSON) | 방대하나 다소 복잡 |
| 커뮤니티 | 아직 작음 | 크고 예제·라이브러리 많음 |

*출처: [토스증권 Open API 문서](https://developers.tossinvest.com/docs) · [KIS Developers API 서비스 목록](https://apiportal.koreainvestment.com/apiservice-category) (2026-10-07 확인). KIS의 구체적 호출 한도는 공식 포털에서 확인되지 않아 수치 비교는 생략했다.*

정리하면 이렇다.

- **토스증권의 강점**: 발급·인증이 간단하고, 문서가 AI 코딩에 최적화돼 있고, **한도와 에러 코드가 스펙에 숫자로 공개**돼 있어 운영 설계가 쉽다. 국내·미국 주식만 다루면 충분한 사람에게 잘 맞는다.
- **토스증권의 한계**: 파생·채권·재무데이터가 없고, **모의투자 환경이 없어 첫 주문부터 실계좌**다. 과거 데이터가 2022년 11월부터라 장기 백테스트에 부족하고, 레퍼런스·커뮤니티가 아직 작다. 그리고 약관상 데이터 재배포가 금지된다.
- **KIS의 강점**: 선물옵션·채권·해외파생까지 범위가 넓고, TESTBED로 모의 검증이 가능하며, 예제·라이브러리·질문답변이 풍부해 막혔을 때 해결이 쉽다.
- **KIS의 한계**: 문서가 방대하고 초기 설정이 다소 번거롭다.

**모의투자 환경의 유무**는 생각보다 큰 차이다. 주문 로직의 첫 버전은 거의 반드시 틀리는데, 토스에서는 그 틀린 코드가 실제 돈으로 체결된다. 생각해 보면 1세대 OCX 시대의 안전장치는 전제 자체에 있었다 — HTS가 떠 있고 사람이 로그인해 있어야 봇이 돌았으니, 화면 앞에 사람이 있었다. REST로 넘어오며 그 전제가 사라졌고, 모의투자 환경은 사라진 그 자리를 메우는 장치다. 토스는 2세대의 편의는 가져오면서 그 보완 장치는 아직 가져오지 않았다. 그러니 토스로 시작한다면 주문 수량·금액 상한을 코드에 하드코딩해 두는 안전장치를 **첫 커밋부터** 넣는 게 좋다.

## So What — 나는 무엇을 골라야 하나

선택 기준은 명확하다. **"국내·미국 주식으로 자동매매나 시세 분석"이 목표라면 토스증권 API**가 시작하기 편하다. 특히 AI 코딩 도구로 개발한다면 OpenAPI·AsyncAPI JSON을 그대로 물려줄 수 있다는 점이 실제로 시간을 아껴준다. 반대로 **파생상품·채권이 필요하거나, 모의투자로 먼저 검증하고 싶거나, 막혔을 때 참고할 레퍼런스가 중요하다면 한국투자증권 KIS**가 여전히 안전한 선택이다.

### 실제로 시간을 잡아먹는 곳은 API가 아니다

한 가지 덧붙이고 싶은 게 있다. 자동매매 봇을 처음 만들 때 사람들은 "어느 증권사 API가 좋은가"에 시간을 가장 많이 쓰는데, 막상 만들어 보면 **API 연동은 전체 작업의 작은 조각**이다. 토큰 받고 시세 부르고 주문 넣는 코드는 반나절이면 나온다.

시간을 잡아먹는 건 그 바깥이다.

**주문 상태 추적이 첫 번째다.** 주문을 냈다고 체결된 게 아니다. 일부만 체결될 수도, 정정 중일 수도, 장 마감으로 취소될 수도 있다. "주문 냈으니 샀겠지"로 가정한 코드는 어느 날 같은 종목을 두 번 산다. 토스 API에서 이걸 막아주는 장치가 `clientOrderId` 멱등성 키와 웹소켓 `personal:order` 채널이다. 전자는 재시도 중복을 막고, 후자는 상태 변화를 밀어준다. 다만 앞서 봤듯 **웹소켓이 끊긴 구간의 주문 이벤트는 재전달되지 않으므로, 재연결 직후 주문 조회로 맞추는 단계까지 포함해야** 비로소 추적이 완성된다. 둘 다 안 쓰고 주문 목록만 폴링하면, 공식 FAQ가 지적하듯 **주문 1건이 1행으로 평균 체결가로 합산돼** 내려오기 때문에 부분 체결의 흐름을 재구성할 수 없다.

**두 번째는 장 운영시간이다.** 정규장, 시간외단일가, 휴장일, 미국 주식이면 서머타임까지. 이걸 코드에 하드코딩하면 반드시 언젠가 틀린다. 토스 API가 장 운영 정보 조회를 제공하는 건 이 때문이고, 그걸 쓰는 편이 직접 달력을 관리하는 것보다 안전하다(국내 장 정보에서 `integrated`가 `null`이면 휴장일이다).

**세 번째는 재시작 이후의 상태 복구다.** 봇이 새벽에 죽었다가 다시 뜨면, 자기가 어떤 포지션을 들고 있는지 몰라야 정상이다. 메모리에만 상태를 두면 그렇게 된다. 보유 종목은 항상 계좌 조회 API로 다시 읽어 오는 걸 원칙으로 삼는 게 낫다. **증권사가 들고 있는 값이 진실이고, 내 프로그램의 변수는 캐시일 뿐이다.**

그러니 증권사 선택에 며칠을 쓰기보다는, 아무거나 하나 골라 위 세 가지를 먼저 겪어 보는 편이 빠르다. API를 바꾸는 비용은 생각보다 작고, 위 세 가지는 어느 증권사를 골라도 똑같이 겪는다.

가장 현실적인 전략은 **둘 다 열어두는 것**이다. 계좌 개설과 API 발급은 무료이니, 토스로 빠르게 프로토타입을 만들어보고 한계에 부딪히면 KIS로 확장하는 식이다.

넓어진 건 선택지의 개수가 아니라 **문의 종류**다. 키움 OpenAPI+·대신 Creon·LS xingAPI로 대표되는 1세대는 윈도우 전용 OCX/COM 컨트롤이라, 봇을 돌리려면 PC를 한 대 켜 두고 HTS를 상주시켜야 했다. 그 전제를 처음 깬 쪽이 2022년 4월 KIS 디벨로퍼스로, 당시 "국내 증권사 최초로 HTS 접속이나 별도 프로그램 설치 없이" 매매 인터페이스를 제공한다고 알렸다. 키움도 2025년 3월 윈도우·맥·리눅스를 지원하는 '키움 REST API'로 넘어왔고, 토스는 그 흐름의 가장 최근 항목이다. **리눅스 서버에 올려 24시간 무인으로 돌릴 수 있는 문이 이제 여러 개**라는 게 개인 개발자에게 진짜 달라진 부분이다.

한 걸음 더 보면, 토스가 **기계가 읽는 문서(OpenAPI·AsyncAPI JSON)를 1차 출처로 선언하고 사람용 문서를 그 파생물로 둔 것**은 상징적이다. 증권가가 AI 코딩을 겨냥한 게 토스가 처음은 아니다 — 키움은 2025년 REST API와 함께 자연어로 물으면 코드를 만들어 주는 'AI 코딩 어시스턴트'를 붙였다. 다만 방식이 다르다. 앞의 것이 "증권사가 만든 도구를 쓰게 하는" 쪽이라면, 토스는 스펙 파일을 그대로 공개해 **독자가 이미 쓰는 AI 도구**에 물려주는 쪽을 택했다. 1세대가 OCX라는 벤더 런타임을 내 PC에 깔게 했던 것과 정확히 반대 방향이다. 자동매매의 진입장벽이 낮아질수록 리스크 관리와 안전장치의 중요성은 오히려 커진다 — 도구가 쉬워졌다고 [손절·한도 같은 안전장치](/blog/claude-code-stock-agent-4-trade-safety/)를 건너뛰면, 빠르고 정확하게 손실을 자동화하게 된다는 점을 잊지 말자. 모의투자 환경이 없는 API라면 더더욱 그렇다.

---

**함께 보면 좋은 글**
- [주요 증권사 API 비교](/blog/2026-06-27-korea-stock-broker-api-comparison/)
- [KIS API(한국투자증권) Python 연결 가이드 [2편]](/blog/claude-code-stock-agent-2-kis-api/)
- [Claude Code로 주식 자동매매 봇 만들기 [1편]](/blog/claude-code-stock-agent-1-design/)

**출처**
- [토스증권 Open API 개발자 문서](https://developers.tossinvest.com/docs) — 인터랙티브 API 레퍼런스
- [OpenAPI 3.0 JSON (REST 스펙 v1.2.19)](https://openapi.tossinvest.com/openapi-docs/latest/openapi.json) — 엔드포인트·스키마·에러의 1차 출처
- [AsyncAPI 3.0 JSON (실시간 스펙 v1.2.2)](https://openapi.tossinvest.com/openapi-docs/latest/asyncapi.json) — 웹소켓 채널·구독·한도의 1차 출처
- [연동 가이드 Overview](https://openapi.tossinvest.com/openapi-docs/overview.md) — 발급 절차·Rate Limits·에러 코드 표
- [토스증권 Open API FAQ](https://openapi.tossinvest.com/openapi-docs/faq.md) — 캔들 집계 기준·데이터 제공 범위·이용 정책
- [토스증권 뉴스룸 — 오픈API 서비스 정식 출시](https://corp.tossinvest.com/ko/news-room/detail?id=52615) (2026-08-13 전체 고객 전환)
- [KIS Developers — 한국투자증권 오픈API](https://apiportal.koreainvestment.com/apiservice-category) (비교 대상)
- [뉴스핌 — 한국투자증권 'KIS 디벨로퍼스' 운영](https://www.newspim.com/news/view/20220414000474) (2022-04-14, "국내 증권사 최초로 HTS 접속이나 별도 프로그램 설치 없이")
- [핀포인트뉴스 — 키움증권 '키움 REST API' 출시](https://www.pinpointnews.co.kr/news/articleView.html?idxno=330671) (2025-03-24, 윈도우·맥·리눅스 지원)

*※ 다시 강조: 투자 조언이 아니며, API 정책·범위·한도는 사전 공지 없이 변경될 수 있으니 각 사 공식 문서 기준으로 확인이 필요하다.*
