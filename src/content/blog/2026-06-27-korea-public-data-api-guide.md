---
title: "개발자를 위한 정부 공개 API 총정리"
description: "공공데이터포털부터 OpenDART·기상청·한국은행 ECOS·교통·법령까지, 무료로 쓰는 정부 공개 API를 분야별로 정리하고 신청·인증·활용법을 가이드합니다."
pubDate: 2026-06-27T09:30:00+09:00
category: ai
tags: ["공공데이터", "공개API", "OpenAPI", "데이터분석"]
draft: true
---

사이드 프로젝트를 만들거나 데이터 분석을 하다 보면 늘 같은 벽에 부딪힌다. "쓸 만한 데이터를 어디서 구하지?" 이때 가장 먼저 떠올려야 할 답이 **정부 공개 API**다. 정부와 공공기관이 운영하는 **공공데이터** API는 무료이고, 출처가 명확해 신뢰도가 높으며, 상업적 활용까지 폭넓게 허용된다. 날씨, 주가 공시, 금리, 버스 도착 시간, 법령 조문까지 — 민간 유료 서비스가 비싸게 파는 데이터의 상당수가 사실은 정부 공개 API로 공짜로 풀려 있다. 이 글의 핵심 메시지는 단순하다. **"데이터를 사기 전에 공공데이터포털부터 검색하라."**

그 출발점이자 허브가 바로 **공공데이터포털(data.go.kr)**이다. 여기 한 곳에서 수만 개 기관의 API를 검색하고, 활용신청을 넣고, 하나의 계정으로 인증키를 관리할 수 있다. 기관별로 흩어진 사이트를 일일이 뒤지기 전에, 대부분의 API가 이 포털에 모여 있다는 점만 알아도 작업 시간이 절반으로 준다.

![graphical user interface](https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxkYXRhJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzfGVufDF8MHx8fDE3ODI0OTE0NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Deng Xiang](https://unsplash.com/@dengxiangs?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/graphical-user-interface--WXQm_NTK0U?utm_source=spice-bandit-blog&utm_medium=referral)*

## 분야별 대표 공개 API 한눈에 보기

아래 표는 실무에서 가장 자주 쓰이는 정부·공공 API를 분야별로 정리한 것이다. "제공처"가 자체 포털을 운영하는 경우도 있지만, 상당수는 data.go.kr을 통해서도 신청할 수 있다. 세부 스펙(파라미터·응답 필드)은 수시로 바뀌므로 **각 제공처/포털에서 최신 명세를 확인**하는 것을 전제로 한다.

| 분야 | API / 제공처 | 쓸 수 있는 데이터 | 인증 / 키 |
| --- | --- | --- | --- |
| 종합 허브 | **공공데이터포털 (data.go.kr)** | 수만 개 기관 API의 검색·신청·통합 관리 | 회원가입 → API별 활용신청 → 인증키(serviceKey) |
| 금융/기업 | **OpenDART (금융감독원 전자공시)** | 상장·외감 기업의 재무제표, 정기·수시 공시, 지분·임원 정보 | OpenDART 사이트에서 API 키 발급 |
| 거시경제 | **한국은행 ECOS** | 기준금리, 환율, 물가, GDP 등 통계 시계열 | ECOS에서 인증키 발급 |
| 금융정책 | **금융위원회(FSC) 계열 API** | 금융상품, 기업·금융 통계 등 | data.go.kr 활용신청 |
| 날씨 | **기상청 단기예보·동네예보** | 동네예보, 초단기실황, 중기예보 | data.go.kr / 기상청 API허브 인증키 |
| 환경 | **에어코리아 (한국환경공단)** | 미세먼지(PM10/PM2.5), 대기오염 측정소 데이터 | data.go.kr 활용신청 |
| 교통 | **국토부 TAGO (국가대중교통정보)** | 전국 버스 노선·도착·위치, 지하철, 고속·시외버스 | data.go.kr 활용신청 |
| 교통 | **한국도로공사 / 지하철 실시간** | 고속도로 교통·휴게소, 지하철 실시간 도착 | data.go.kr / 지자체 포털 |
| 통계/인구 | **통계청 KOSIS** | 인구·고용·물가 등 국가통계 시계열 | KOSIS 공유서비스 인증키 |
| 행정 | **행정안전부 계열 API** | 행정구역, 주민등록 인구통계, 공공시설 등 | data.go.kr 활용신청 |
| 법령/정책 | **국가법령정보센터 (법제처) OPEN API** | 법령·시행령·자치법규 본문, 개정 이력 | 법제처 OPEN API 신청(이메일 ID 등록 방식) |
| 지도/주소 | **도로명주소 API (행안부)** | 주소 검색, 좌표 변환, 우편번호 | 도로명주소 개발자센터 승인키 |
| 공간정보 | **브이월드(V-World, 국토부)** | 지도·위성영상·3D, 지적·토지 공간정보 | V-World에서 인증키 발급 |

![graphs of performance analytics on a laptop screen](https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxkYXRhJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzfGVufDF8MHx8fDE3ODI0OTE0NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Luke Chesser](https://unsplash.com/@lukechesser?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/graphs-of-performance-analytics-on-a-laptop-screen-JKUTrJ4vK00?utm_source=spice-bandit-blog&utm_medium=referral)*

표만 봐도 감이 오겠지만, **금융·날씨·교통·법령**은 거의 모든 도메인 서비스의 기본 재료다. 예컨대 부동산 앱이라면 V-World(지도)+도로명주소(주소)+KOSIS(인구) 세 개만 조합해도 핵심 기능이 나온다. 데이터를 "사는" 대신 "조합하는" 사고방식이 공공 API 활용의 본질이다.

## 시작하기: 활용신청부터 첫 호출까지

가장 흔한 진입 경로인 **공공데이터포털 기준** 절차는 다음과 같다.

1. **회원가입 & 로그인** — data.go.kr에 가입한다(공동/간편 인증 지원).
2. **API 검색** — 예: "기상청 단기예보", "TAGO 버스도착". 결과에서 *오픈API* 항목을 고른다.
3. **활용신청** — "활용신청" 버튼 → 활용목적 입력 → 제출. 일반 API는 대체로 자동 승인(보통 수십 분~1~2시간)이고, 일부는 담당자 검토로 며칠 걸릴 수 있다.
4. **인증키 확인** — 마이페이지 → 데이터활용 → 개발계정에서 `serviceKey`를 확인한다.
5. **호출** — 발급된 키를 쿼리 파라미터에 넣어 GET 요청을 보낸다.

호출 예시(기상청 동네예보 형태의 의사 URL):

```text
GET https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst
  ?serviceKey=발급받은인증키
  &dataType=JSON
  &numOfRows=10
  &pageNo=1
  &base_date=20260627
  &base_time=0500
  &nx=60
  &ny=127
```

```python
# Python 의사코드
import requests

params = {
    "serviceKey": "발급받은_디코딩_인증키",  # requests가 자동 인코딩
    "dataType": "JSON",
    "numOfRows": 10, "pageNo": 1,
    "base_date": "20260627", "base_time": "0500",
    "nx": 60, "ny": 127,
}
r = requests.get(URL, params=params)
print(r.json())
```

**흔한 함정 한 줄**: 포털은 인증키를 *Encoding*과 *Decoding* 두 가지로 보여준다. 키에 `+` `/` `=` 같은 문자가 섞여 있을 때, 라이브러리가 이미 URL 인코딩을 한 번 해주는데 거기에 인코딩된 키를 또 넣으면 이중 인코딩이 되어 `SERVICE_KEY_IS_NOT_REGISTERED_ERROR`가 난다. requests의 `params=`처럼 자동 인코딩되는 경로에는 **Decoding 키**를, URL에 직접 문자열로 박을 때는 **Encoding 키**를 쓴다고 기억하면 대부분 해결된다.

## 무엇을 만들 수 있나: 활용 아이디어

조합하기 나름이지만, 곧장 만들어볼 만한 것들이 있다. 출퇴근 시간에 우리 동네 버스 도착(TAGO)과 미세먼지(에어코리아)를 한 화면에 띄우는 위젯, OpenDART 재무 데이터로 관심 종목의 매출·영업이익 추이를 자동 정리하는 대시보드, ECOS 기준금리와 환율을 끌어와 알림을 보내는 봇, 법제처 API로 특정 법령 개정 이력을 추적하는 도구 같은 것들이다. 정부 API의 진짜 가치는 "남들이 일일이 복붙하던 작업을 자동화"하는 데 있다. 앞서 말한 부동산 앱 예시처럼, 핵심은 단일 API의 화려함이 아니라 **여러 출처를 엮어 만드는 조합의 힘**이다.

## 현실적인 주의점과 운영 팁

다만 실무에서 반드시 염두에 둘 제약이 있다.

| 주의 항목 | 내용 |
| --- | --- |
| 트래픽 한도 | 개발계정은 보통 일 1,000~10,000회 등 호출 제한이 있다. 운영 서비스는 별도 *운영계정* 전환·증설 신청이 필요하다. |
| 승인 대기 | 자동 승인이 다수지만 일부 API·민감 데이터는 검토에 며칠 걸린다. 일정에 버퍼를 둘 것. |
| 데이터 갱신주기 | "실시간"이라 해도 갱신 간격이 다르다(예: 동네예보 시간대별 발표). 캐싱·폴링 주기를 갱신주기에 맞춰라. |
| 응답 포맷·스펙 변경 | XML/JSON, 필드명, 엔드포인트가 개편될 수 있다. 코드에 방어 로직과 명세 버전 확인을 둘 것. |
| 이용약관·출처표기 | 상업적 활용 범위와 출처 표기 의무는 API마다 다르다. 배포 전 약관 확인 필수. |

![white concrete building under sky](https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwYnVpbGRpbmclMjBkYXRhfGVufDF8MHx8fDE3ODI0OTE0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Katie Moum](https://unsplash.com/@katiemoum?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/white-concrete-building-under-sky-o0kbc907i20?utm_source=spice-bandit-blog&utm_medium=referral)*

개인적으로 정부 공개 API를 여러 번 써본 입장에서, 가장 큰 장점은 "공짜"보다 "출처의 권위"다. 기상청·한국은행·금감원이 직접 제공하는 숫자라는 사실 자체가 서비스의 신뢰를 만든다. 반대로 가장 큰 단점은 문서 품질의 편차다. 잘 정리된 API가 있는가 하면, 예시 하나 없이 XML 스키마만 던져주는 곳도 있다. 그래서 실전 팁은 이렇다 — **새 API를 붙이기 전에 포털의 "활용사례"와 깃허브에 공개된 래퍼/예제부터 검색하라.** 누군가 이미 함정을 다 밟아두었을 확률이 높다.

정리하면, 데이터가 필요할 때의 첫 행동은 결제가 아니라 검색이다. data.go.kr에서 키워드 한 번 쳐보는 것. 거기서 시작하면 대부분의 데이터 문제는 무료로, 그리고 신뢰할 수 있는 출처로 풀린다.

---

*세부 신청 절차·파라미터·이용 한도는 수시로 바뀌므로 각 제공처와 공공데이터포털의 최신 안내를 확인하시기 바랍니다. 본 글은 정보 제공 목적이며 특정 서비스 이용을 권유하지 않습니다.*
