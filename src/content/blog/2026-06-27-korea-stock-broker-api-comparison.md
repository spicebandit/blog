---
title: "주식 자동매매 API 비교 — 한투·키움·토스"
description: "한국투자증권(KIS)·키움·토스증권·LS·대신 등 증권사 오픈 API를 자동매매/시세조회 관점에서 비교했습니다. REST vs OCX, 인증·모의투자·OS 지원까지 개발자 선택 가이드."
pubDate: 2026-06-27T09:00:00+09:00
category: ai
tags: ["주식API", "자동매매", "한국투자증권", "오픈API"]
draft: true
---

증권사 오픈 API는 "내 증권 계좌를 코드로 조종하는 공식 통로"입니다. 주식 자동매매 API를 한 번 붙여 두면 시세를 실시간으로 받아 매수·매도 주문을 자동으로 내거나, 종목 화면을 띄우지 않고도 데이터를 긁어와 퀀트 분석·시세봇을 돌릴 수 있습니다. 같은 "오픈 API"라는 이름을 달고 있어도 증권사마다 연결 방식, 인증 절차, 돌아가는 운영체제(OS)가 전혀 다릅니다. 잘못 고르면 "리눅스 서버에 올리려다 윈도우 전용이라 포기"하는 일이 생깁니다. 이 글은 한국투자증권·키움·토스증권·LS·대신을 **자동매매와 시세조회 관점에서** 비교해, 내 환경에 맞는 API를 고르는 실전 가이드입니다.

먼저 분명히 해 둘 점. 이 글은 **API라는 개발 도구를 비교**하는 글이지 투자 권유가 아닙니다. 특정 종목의 매수·매도를 추천하지 않으며, 모든 투자 판단과 자동매매 운용의 책임은 본인에게 있습니다. **투자 조언이 아닙니다.**

![graphical user interface, application](https://images.unsplash.com/photo-1651341050677-24dba59ce0fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMHRyYWRpbmclMjBzY3JlZW58ZW58MXwwfHx8MTc4MjQ5MTQyOXww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Anne Nygård](https://unsplash.com/@polarmermaid?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/graphical-user-interface-application-x07ELaNFt34?utm_source=spice-bandit-blog&utm_medium=referral)*

## 핵심 축: 1세대 OCX vs 2세대 REST

증권사 API 선택에서 가장 먼저 갈리는 기준은 "기술 세대"입니다. 이 한 줄이 나머지 모든 차이를 결정합니다.

**1세대 — OCX/COM 방식.** 키움 OpenAPI+, 대신 Creon, LS XingAPI가 여기 속합니다. 윈도우 전용 컴포넌트(OCX/COM)를 내 PC에 설치하고, 증권사가 만든 프로그램(예: 키움 영웅문)이 백그라운드에 **상주**해야 동작합니다. 즉 "윈도우 PC를 한 대 켜 두고, 그 위에서 내 매매 프로그램이 증권사 프로그램에 말을 거는" 구조입니다. 보통 32비트 환경에 묶이고, 리눅스 서버나 클라우드에는 올릴 수 없습니다. 대신 오래된 만큼 자료와 예제가 풍부합니다.

**2세대 — REST/WebSocket/gRPC 방식.** 한국투자증권 KIS, 토스증권 Open API, LS OpenAPI, 키움의 신규 Open API NEXT가 여기 속합니다. HTTP로 토큰을 받아 주문·조회를 호출하므로 **OS를 가리지 않습니다.** 파이썬·자바스크립트 등 어떤 언어로도 붙일 수 있고, 리눅스 클라우드 서버에 올려 24시간 무인 운용이 가능합니다. 실시간 시세는 WebSocket(또는 gRPC 스트림)으로 받습니다.

정리하면 선택의 핵심은 이렇습니다. **"클라우드/리눅스에서 무인으로 돌릴 거면 2세대 REST, 이미 윈도우 기반 자산이 있으면 1세대."** 시장 전체도 REST/gRPC 쪽으로 빠르게 이동하는 중이라, 지금 새로 시작한다면 2세대가 기본값입니다.

## 증권사별 비교 표

아래 표는 자동매매·시세조회 관점의 핵심 항목만 추렸습니다. 수수료, 정확한 호출 한도(분당 요청 수)는 정책이 자주 바뀌므로 단정하지 않습니다. **반드시 각 사 개발자센터에서 최신값을 확인**하세요.

| 증권사 | 방식 | 인증 | 모의투자 | OS/서버 | 특징 |
|---|---|---|---|---|---|
| 한국투자증권(KIS) | REST + WebSocket | 앱키/시크릿 → 접근토큰 | 지원 | OS 무관, 클라우드 OK | 가장 성숙, 공식 GitHub·파이썬 자료 풍부, 무료 |
| 키움 OpenAPI+ | OCX/COM (1세대) | 영웅문 로그인 상주 | 지원 | Windows 32bit 전용 | 사용자층 두텁고 예제 많음, 구형 제약 큼 |
| 키움 Open API NEXT | REST/gRPC (2026) | 토큰 기반 | 확인 필요 | OS 무관 지향 | 신규 REST로 전환, gRPC 실시간 도입 |
| 토스증권 Open API | REST | OAuth2.0 client credentials | 확인 필요 | OS 무관, 서버간 인증 | 진입 가장 쉬움, 국내+미국주식, 앱 사전신청 |
| LS증권 | XingAPI(OCX) + LS OpenAPI(REST) | OCX 상주 / 토큰 | 지원 | 둘 다 제공 | 구형·신형 병행, 마이그레이션 과도기 |
| 대신증권 Creon | COM (1세대) | HTS 로그인 상주 | 확인 필요 | Windows 전용 | 윈도우 COM 기반, 기존 사용자층 |

> 모의투자·세부 지원 범위는 시점에 따라 달라질 수 있어 "확인 필요"로 표기했습니다. 적용 전 각 개발자센터 문서를 확인하는 것이 안전합니다.

## 증권사별로 누구에게 맞나

**한국투자증권 KIS Developers.** 2022년부터 REST API와 실시간 WebSocket을 제공하며, 모의투자도 지원합니다. 공식 GitHub 저장소(koreainvestment/open-trading-api)에 파이썬 예제가 잘 정리돼 있고 무료라, 국내 개인 개발자 사이에서 사실상 표준에 가깝습니다. **자료가 가장 많고 막혔을 때 검색으로 풀기 쉽다**는 점이 최대 강점입니다. 처음 자동매매를 만드는 사람, 파이썬으로 시세봇·퀀트를 돌리려는 사람에게 1순위로 권합니다.

**키움증권.** 오랫동안 1세대 OpenAPI+(OCX/COM)로 개인 자동매매 생태계를 키워 왔습니다. 윈도우 PC에 영웅문을 상주시켜야 하고 32비트 환경에 묶이지만, 그만큼 블로그·책·예제가 방대합니다. 2026년 신규 'Open API NEXT'로 REST와 gRPC를 도입하며 2세대로 넘어오는 중입니다. **기존 키움 기반 코드가 있거나 자료 많은 1세대 환경이 익숙한 사람**, 그리고 신규 REST로 갈아탈 의향이 있는 사람에게 맞습니다.

**토스증권.** 2026년 새로 연 Open API로, REST와 OAuth2.0 client credentials(서버간 인증) 방식을 씁니다. 국내(KRX)와 미국주식 주문 자동화를 지원하고, 앱에서 사전신청·계좌 개설만 하면 별도 수수료 없이 시작할 수 있습니다. **진입 장벽이 가장 낮아** 모바일 세대나 가볍게 자동 주문을 붙여 보고 싶은 사람에게 좋습니다.

**LS증권(구 이베스트)·대신증권.** LS는 1세대 XingAPI(OCX)와 신형 LS OpenAPI(REST)를 함께 제공해 과도기 선택지가 넓습니다. 대신증권 Creon은 윈도우 COM 기반의 전형적 1세대로, 기존 Creon 사용자층이 탄탄합니다. **둘 다 이미 해당 증권사 자산이 있는 경우**에 자연스러운 선택입니다.

![a computer screen with a bunch of code on it](https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGUlMjBsYXB0b3B8ZW58MXwwfHx8MTc4MjQ5MTQzNXww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Chris Ried](https://unsplash.com/@cdr6934?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-computer-screen-with-a-bunch-of-code-on-it-ieic5Tq8YMk?utm_source=spice-bandit-blog&utm_medium=referral)*

## 인증 흐름은 어떻게 생겼나

2세대 REST API는 인증 흐름이 거의 비슷합니다. "발급받은 키로 먼저 토큰을 받고, 그 토큰을 헤더에 실어 주문·조회를 호출"하는 OAuth2.0 토큰 패턴입니다. 아래는 KIS 스타일의 의사코드입니다(실제 엔드포인트·필드명은 개발자센터 문서 기준).

```python
import requests

BASE = "https://openapi.example-broker.com"  # 실서버/모의서버 분리됨

# 1) 앱키·시크릿으로 접근토큰 발급
res = requests.post(f"{BASE}/oauth2/tokenP", json={
    "grant_type": "client_credentials",
    "appkey": APP_KEY,
    "appsecret": APP_SECRET,
})
token = res.json()["access_token"]

# 2) 토큰을 헤더에 실어 현재가 조회
headers = {"authorization": f"Bearer {token}", "appkey": APP_KEY, "appsecret": APP_SECRET}
price = requests.get(f"{BASE}/quotations/price",
                     headers=headers, params={"symbol": "005930"})

# 3) 실시간 시세는 별도 WebSocket(또는 gRPC 스트림)으로 구독
```

토스증권의 client credentials도 같은 골격입니다. 토큰은 만료 시간이 있으니 캐싱·자동 재발급 로직을 넣고, 키와 시크릿은 코드에 박지 말고 환경변수로 분리하세요. 1세대 OCX/COM은 이런 토큰 발급 대신 "HTS 로그인 세션에 프로그램이 붙는" 방식이라 인증 개념 자체가 다릅니다.

## 선택 가이드 — So What?

세 가지 상황으로 정리합니다.

- **자동매매 입문자 / 파이썬 시세봇·퀀트:** 한국투자증권 KIS. 무료에 자료가 압도적이라 막혀도 검색으로 풀립니다. 모의투자로 먼저 검증하세요.
- **클라우드에서 24시간 무인 운용:** REST/gRPC 2세대(KIS·토스·LS OpenAPI·키움 NEXT). 리눅스 서버에 올려 PC를 끄지 않아도 됩니다. 1세대는 윈도우 상주가 필요해 이 용도에 부적합합니다.
- **가장 쉽게 시작 / 미국주식 포함:** 토스증권. 앱 사전신청만으로 OAuth 기반 주문 자동화를 빠르게 붙일 수 있습니다.
- **기존 윈도우 자산이 있는 경우:** 키움 OpenAPI+, 대신 Creon, LS XingAPI. 이미 돌아가는 코드가 있다면 무리해서 옮길 필요는 없지만, 신규 REST 전환 로드맵은 챙겨 두세요.

제 관점은 분명합니다. **지금 새로 시작한다면 2세대 REST가 기본값**이고, 그중 KIS가 학습 곡선 대비 가성비가 가장 좋습니다. OCX/COM은 "이미 거기에 자산이 있을 때만" 합리적인 선택이라고 봅니다.

마지막으로 경고 한 줄. 자동매매는 코드 한 줄의 버그, 과최적화(백테스트만 잘 되는 전략), 시장 급변으로 **실제 손실이 날 수 있고 그 책임은 전적으로 본인에게** 있습니다. 반드시 모의투자에서 충분히 검증하고, 주문 수량·일일 손실 한도 같은 안전장치를 코드에 넣은 뒤 소액으로 시작하세요. 다시 강조하지만 이 글은 개발 도구 비교일 뿐 **투자 조언이 아닙니다.**
