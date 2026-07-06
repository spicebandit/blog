---
title: "토스증권 오픈API 완전정리 — 발급·이용법과 한국투자증권 비교"
description: "토스증권 Open API의 특징과 발급·이용 방법, 그리고 한국투자증권(KIS) 대비 장단점을 정리했다. OAuth 인증·시세·주문 범위부터 어떤 증권사 API를 골라야 할지까지 개발자 관점 가이드."
pubDate: 2026-07-07T07:05:49+09:00
category: ai
tags: ["토스증권API", "오픈API", "자동매매", "증권API"]
---

주식 자동매매나 시세 분석 프로그램을 만들려면 증권사의 API가 필요하다. 오랫동안 이 시장은 한국투자증권(KIS)의 독무대에 가까웠는데, 2026년 들어 **토스증권이 Open API를 열면서** 개인 개발자에게 새로운 선택지가 생겼다. 그렇다면 토스증권 API는 무엇이 다르고, 어떻게 발급받아 쓰며, 기존 강자인 한국투자증권과 비교하면 무엇을 골라야 할까? 이 글은 토스증권 오픈API의 **특징 → 발급 방법 → 이용 방법 → 한투(KIS) 대비 장단점**을 개발자 관점에서 정리한다.

> ⚠️ 이 글은 API 활용 방법을 안내하는 기술 가이드이며, 특정 종목의 매수·매도를 권유하는 투자 조언이 아니다. API 정책·수수료·제공 범위는 변경될 수 있으니 각 사 공식 문서를 확인하자.

## 토스증권 오픈API란 — 무엇을 주나

토스증권 Open API는 **국내(KRX)와 미국 주식의 시세·종목정보·환율·계좌·주문 기능을 제공하는 REST API**다. 공식 문서 기준으로 기능은 네 카테고리로 나뉜다.

| 카테고리 | 주는 것 | 인증 |
|---|---|---|
| **인증(Auth)** | OAuth 2.0 액세스 토큰 발급 | — |
| **시세·종목정보** | 현재가·호가·체결·캔들, 종목 마스터, 환율, 장 운영시간 | 토큰만 |
| **계좌·자산** | 계좌 목록, 보유 주식 조회 | 토큰 + 계좌 헤더 |
| **주문(Order)** | 주문 생성·정정·취소, 주문 조회, 매수가능금액·수수료 | 토큰 + 계좌 헤더 |

주소는 `https://openapi.tossinvest.com`이고, 모든 호출에 OAuth 2.0 토큰이 필요하다. 시세 같은 공개 데이터는 토큰만으로 되지만, **계좌·주문처럼 내 자산을 다루는 API는 토큰에 더해 계좌 식별 헤더(`X-Tossinvest-Account`)**를 함께 보내야 한다.

가장 큰 특징 하나를 꼽으라면 **"AI 코딩 에이전트가 읽기 좋게 만든 문서"**다. 토스증권은 사람용 문서 외에 `llms.txt`, `overview.md`, 그리고 기계가 그대로 파싱하는 **OpenAPI JSON 스펙**을 공개한다. 커서·클로드 같은 AI 코딩 도구에게 "토스 API로 시세 받아줘"라고 시키면 스키마를 정확히 읽어 코드를 짜기 좋다는 뜻이다. 자동매매의 진입장벽 자체를 낮추려는 설계로 읽힌다.

![스마트폰 주식 앱과 노트북](https://images.unsplash.com/photo-1612461313144-fc1676a1bf17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxtb2JpbGUlMjBzdG9jayUyMHRyYWRpbmclMjBhcHAlMjBzbWFydHBob25lfGVufDF8MHx8fDE3ODMyOTc2MDh8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Dimitris Chapsoulas](https://unsplash.com/@synesthe2ia?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-android-smartphone-on-black-laptop-computer-CQFT1j8Ig30?utm_source=spice-bandit-blog&utm_medium=referral)*

## 발급 방법 — 클라이언트 등록부터 토큰까지

토스증권 API는 **client_id와 client_secret**을 발급받아 그것으로 액세스 토큰을 얻는 OAuth 2.0 방식이다. 발급 절차는 이렇다.

1. **제공 여부·조건 확인**: 토스증권 Open API의 제공 범위·이용 조건은 공식 안내 페이지에서 최신 상태를 확인한다(신청 절차나 이용 자격이 있을 수 있으니 발급 전 공식 문서를 볼 것).
2. **클라이언트 등록**: 토스증권 PC 웹(WTS)에 로그인해 **설정 → Open API** 메뉴에서 `client_id`와 `client_secret`을 발급받는다.
3. **액세스 토큰 발급**: 발급받은 자격증명으로 토큰 엔드포인트를 호출한다.

```
POST https://openapi.tossinvest.com/oauth2/token
(grant_type=client_credentials, client_id, client_secret)
```

발급은 토스증권 웹(WTS) 로그인 후 설정 화면에서 자격증명을 만드는 방식이라, 별도 공동인증서 절차 없이 비교적 간단하다. `client_secret`은 절대 외부(깃허브 등)에 노출하면 안 되며, 환경변수로 관리한다.

## 이용 방법 — 실제 호출 흐름

받은 토큰을 `Authorization: Bearer {access_token}` 헤더에 실어 API를 호출한다. 대표 엔드포인트는 다음과 같다.

```
# 현재가 조회 (토큰만 필요)
GET  https://openapi.tossinvest.com/api/v1/prices

# 호가 조회
GET  https://openapi.tossinvest.com/api/v1/orderbook

# 캔들(분봉·일봉) 조회
GET  https://openapi.tossinvest.com/api/v1/candles

# 보유 주식 조회 (토큰 + X-Tossinvest-Account 헤더 필요)
GET  https://openapi.tossinvest.com/api/v1/... (account/holdings)

# 주문 생성 (토큰 + 계좌 헤더 필요)
POST https://openapi.tossinvest.com/api/v1/... (order)
```

파이썬으로 토큰 발급 → 시세 호출까지의 뼈대는 이렇게 짧다.

```python
import os, requests

# 1) 토큰 발급
tok = requests.post("https://openapi.tossinvest.com/oauth2/token", data={
    "grant_type": "client_credentials",
    "client_id": os.environ["TOSS_CLIENT_ID"],
    "client_secret": os.environ["TOSS_CLIENT_SECRET"],
}).json()["access_token"]

# 2) 시세 조회
h = {"Authorization": f"Bearer {tok}"}
prices = requests.get("https://openapi.tossinvest.com/api/v1/prices",
                      headers=h, params={"code": "005930"}).json()
print(prices)
```

계좌·주문 API를 쓸 때만 헤더에 `X-Tossinvest-Account`를 추가하면 된다. 연동 방식은 현재 **REST만** 제공되며, 실시간 스트리밍(웹소켓) 대신 REST 폴링으로 시세를 받는다. 자동매매 로직의 큰 틀은 [주식봇 만들기 시리즈](/blog/claude-code-stock-agent-2-kis-api/)에서 다룬 KIS 기반 구조와 거의 같다 — 인증 방식과 엔드포인트 이름만 토스 것으로 바꾸면 된다.

실전에서 두 가지는 처음부터 챙기는 게 좋다. 첫째, **호출 한도(rate limit)**다. 공개 API에는 초당·분당 호출 제한이 있으므로, 시세를 짧은 주기로 폴링하는 봇이라면 요청을 몰지 말고 간격을 두거나 캐싱해야 한다(정확한 한도는 공식 OpenAPI 스펙에서 확인). 둘째, **토큰 만료**다. OAuth 토큰은 유효기간이 있으니, 만료되면 자동으로 재발급받는 로직을 넣어야 봇이 밤새 멈추지 않는다. 이 두 가지는 KIS든 토스든 모든 증권사 API에 공통으로 적용되는 기본기다.

## 한국투자증권(KIS)과 비교 — 장단점

![스마트폰과 개발 화면](https://images.unsplash.com/photo-1612043273453-8f005184fb15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHw1fHxtb2JpbGUlMjBzdG9jayUyMHRyYWRpbmclMjBhcHAlMjBzbWFydHBob25lfGVufDF8MHx8fDE3ODMyOTc2MDh8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Michael Förtsch](https://unsplash.com/@michael_f?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/white-samsung-android-smartphone-turned-on-displaying-google-search-wZw0B9u_1pg?utm_source=spice-bandit-blog&utm_medium=referral)*

그럼 기존 강자 한국투자증권 KIS API와 비교하면 어떨까? 핵심을 표로 정리한다.

| 항목 | 토스증권 Open API | 한국투자증권(KIS) API |
|---|---|---|
| 성숙도 | 신규(2026) | 성숙·안정, 레퍼런스 풍부 |
| 인증 | OAuth2 + 토스앱 간편 승인(지문) | OAuth2, 앱키·시크릿 |
| 문서화 | **AI 친화적**(llms.txt·OpenAPI JSON) | 방대하나 다소 복잡 |
| 범위 | 국내·미국 **주식 중심** | 주식+**파생·해외·채권 등 광범위** |
| 실시간 | REST 폴링(웹소켓 미제공) | **웹소켓 실시간** 지원 |
| 커뮤니티 | 아직 작음 | 크고 예제·라이브러리 많음 |

정리하면 이렇다.

- **토스증권의 강점**: 발급·인증이 간편하고(지문 승인), 문서가 AI 코딩에 최적화돼 있어 **처음 자동매매를 시작하는 개인에게 진입장벽이 낮다.** 국내·미국 주식만 다루면 충분한 사람에게 잘 맞는다.
- **토스증권의 한계**: 아직 신규라 범위가 좁다(파생·채권·재무데이터 약함), 실시간 웹소켓이 없어 초단타엔 부적합, 레퍼런스·커뮤니티가 작다.
- **KIS의 강점**: 파생상품·해외주식·실시간까지 범위가 넓고 안정적이며, 예제·라이브러리·질문답변이 풍부해 막혔을 때 해결이 쉽다.
- **KIS의 한계**: 문서가 방대하고 초기 설정이 다소 번거롭다.

## So What — 나는 무엇을 골라야 하나

선택 기준은 명확하다. **"국내·미국 주식으로 심플한 자동매매/시세 분석"이 목표라면 토스증권 API**가 시작하기 편하다. 특히 AI 코딩 도구로 개발한다면 토스의 AI 친화적 문서가 큰 장점이다. 반대로 **파생상품·해외·실시간처럼 넓고 정교한 기능이 필요하거나, 막혔을 때 참고할 레퍼런스가 중요하다면 한국투자증권 KIS**가 여전히 안전한 선택이다.

가장 현실적인 전략은 **둘 다 열어두는 것**이다. 계좌 개설과 API 발급은 무료이니, 토스로 빠르게 프로토타입을 만들어보고 한계에 부딪히면 KIS로 확장하는 식이다. 증권사 API 선택지가 늘었다는 것 자체가 개인 개발자에겐 반가운 변화다 — 몇 년 전만 해도 사실상 하나뿐이던 문이 이제 둘로 늘었다.

한 걸음 더 보면, 토스가 문서를 AI 코딩 에이전트가 읽기 좋게(llms.txt·OpenAPI JSON) 공개한 것은 상징적이다. "사람이 문서를 읽고 코드를 짜던" 시대에서 "AI에게 API를 물려주고 봇을 만드는" 시대로의 전환을 증권사가 먼저 겨냥한 셈이다. 자동매매의 진입장벽이 낮아질수록 리스크 관리와 안전장치의 중요성은 오히려 커진다 — 도구가 쉬워졌다고 [손절·한도 같은 안전장치](/blog/claude-code-stock-agent-4-trade-safety/)를 건너뛰면, 빠르고 정확하게 손실을 자동화하게 된다는 점을 잊지 말자.

---

**함께 보면 좋은 글**
- [주요 증권사 API 비교](/blog/2026-06-27-korea-stock-broker-api-comparison/)
- [KIS API(한국투자증권) Python 연결 가이드 [2편]](/blog/claude-code-stock-agent-2-kis-api/)
- [Claude Code로 주식 자동매매 봇 만들기 [1편]](/blog/claude-code-stock-agent-1-design/)

**출처**
- [토스증권 Open API 개발자 문서](https://developers.tossinvest.com/docs) (API 카테고리·인증·엔드포인트)
- [토스증권 Open API 공식 안내](https://corp.tossinvest.com/ko/open-api) (서비스 소개·발급)
- [KIS Developers — 한국투자증권 오픈API](https://apiportal.koreainvestment.com/intro) (비교 대상)

*※ 다시 강조: 투자 조언이 아니며, API 정책·범위는 각 사 공식 문서 기준으로 확인이 필요하다.*
