---
title: "무료로 쓰는 민간 공개 API 모음"
description: "카카오·네이버 지도/검색부터 날씨·환율·AI(Claude·OpenAI)·깃허브까지, 개인 프로젝트에 바로 쓰는 무료/프리티어 민간 API를 분야별로 정리한 개발자 가이드."
pubDate: 2026-06-27T10:00:00+09:00
category: ai
tags: ["무료API", "공개API", "개발자도구", "API활용"]
---

사이드프로젝트 하나를 굴리는 데 생각보다 많은 데이터가 필요하다. 지도에 가게를 찍고, 외국어를 번역하고, 오늘 날씨를 가져오고, 환율을 계산하고, 챗봇을 붙인다. 이 모든 걸 직접 만들 수는 없으니 **무료 API**를 끌어다 쓴다. 다행히 카카오·네이버 같은 국내 기업부터 OpenAI·DeepL 같은 글로벌 서비스까지, 개인 개발자에게 **공개 API**를 무료 또는 프리티어로 열어 둔 곳이 꽤 많다.

이 글의 핵심 메시지는 하나다. **개인 프로젝트라면 거의 모든 핵심 기능을 "무료 범위 안에서" 시작할 수 있다.** 다만 '무료'라는 단어를 셋으로 나눠서 봐야 한다. 첫째는 **완전 무료**(Frankfurter 환율, OpenStreetMap처럼 가입조차 필요 없는 경우), 둘째는 **프리티어**(가입하면 매달 일정량까지 공짜, 초과분만 과금), 셋째는 **호출 한도형**(분당·일당 N회까지만 허용, 넘으면 차단). 같은 "무료"라도 신용카드를 요구하는 곳과 그렇지 않은 곳이 갈리고, 상업적 사용을 막아 둔 곳도 있다. 이 구분을 모르고 시작하면 배포 직후 요금 폭탄이나 갑작스러운 차단을 맞는다. 아래 표와 체크포인트는 그 함정을 피하기 위한 것이다.

![a computer screen with a bunch of code on it](https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxhcGklMjBjb2RlJTIwZGV2ZWxvcGVyJTIwc2NyZWVufGVufDF8MHx8fDE3ODI0OTE0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Chris Ried](https://unsplash.com/@cdr6934?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-computer-screen-with-a-bunch-of-code-on-it-ieic5Tq8YMk?utm_source=spice-bandit-blog&utm_medium=referral)*

## 분야별 무료 공개 API 한눈에 보기

아래 표는 개인 프로젝트에서 활용도가 높은 민간 공개 API를 분야별로 정리한 것이다. **무료 범위는 제공처 정책에 따라 수시로 바뀌므로 반드시 각 제공처의 최신 요금/약관 페이지에서 직접 확인하자.** 표의 숫자는 2026년 6월 기준으로 확인한 대략적인 값이다.

| 분야 | API | 무료 범위(2026년 6월 기준, 변동 가능) | 인증 방식 |
| --- | --- | --- | --- |
| 지도/장소 | 카카오 지도·로컬·검색 | 개인 일 20만 건, 법인 일 30만 건 수준(쿼터 페이지 확인) | REST API Key(헤더 `Authorization: KakaoAK`) |
| 지도/장소 | 네이버 지도·검색 | 검색 일 25,000회 등 API별 상이, 지도는 사용량 기준 | Client ID/Secret(헤더) |
| 지도/장소 | OpenStreetMap(Nominatim 등) | 완전 무료(공정사용·초당 1회 권장) | 불필요(User-Agent 명시 권장) |
| 번역/언어 | 네이버 Papago | 무료 사용량 후 종량 과금(콘솔 확인) | Client ID/Secret(헤더) |
| 번역/언어 | DeepL API Free | 월 50만 자, 일 한도 없음, 이월 불가 | API Key(헤더 `Authorization: DeepL-Auth-Key`) |
| 날씨 | OpenWeatherMap | 클래식 분당 60회·월 100만 콜, One Call은 일 1,000콜(카드 등록) | API Key(쿼리 파라미터) |
| 날씨 | 기상청(공공데이터포털) | 공공 무료(일일 트래픽 한도, 신청 승인) | 서비스 키 |
| 환율/금융 | exchangerate.host | 무료 플랜 제공(월 호출 한도, 정책 확인) | API Key(가입) |
| 환율/금융 | Frankfurter | 완전 무료, 가입 불필요(ECB 기반) | 불필요 |
| 환율/금융 | Alpha Vantage | 프리티어(일 25회 수준, 변동) | API Key(쿼리) |
| AI/LLM | Claude(Anthropic) | 신규 콘솔 $5 테스트 크레딧, 이후 선불 종량 | API Key(헤더 `x-api-key`) |
| AI/LLM | OpenAI | 종량제 중심(프로모션 크레딧 시기별 상이) | API Key(헤더 `Authorization: Bearer`) |
| AI/LLM | Google Gemini | AI Studio 무료티어(카드 불필요, 모델별 분당·일당 한도) | API Key(쿼리/헤더) |
| 개발/기타 | GitHub API | 인증 시 시간당 5,000요청(미인증 60) | Personal Access Token |
| 개발/기타 | ipapi(IP 조회) | 무료 일/월 한도(키 없이 일부 가능) | API Key 또는 키리스 |
| 개발/기타 | NewsAPI | Developer 무료 일 100요청, 24시간 지연·비상업 | API Key |
| 개발/기타 | Unsplash | 데모 시간당 50요청, 승인 후 5,000요청 | Access Key(헤더) |
| 검색트렌드 | 네이버 데이터랩 | 무료(검색어 트렌드/쇼핑인사이트, 일 한도) | Client ID/Secret(헤더) |

표에서 눈여겨볼 패턴이 있다. 국내 서비스(카카오·네이버)는 **앱 등록 후 Client ID/Secret을 헤더에 넣는 방식**이 표준이고, 글로벌 서비스는 **API Key 하나를 쿼리나 헤더로 넘기는 방식**이 많다. 그리고 "가입조차 필요 없는" 진짜 완전 무료는 Frankfurter, OpenStreetMap 정도로 손에 꼽힌다는 점이다.

## 처음 시작하기: 등록 → 키 발급 → 첫 호출

거의 모든 API의 시작 절차는 동일하다. 흐름만 익혀두면 어떤 서비스든 30분이면 첫 응답을 받을 수 있다.

1. **개발자 콘솔에서 앱(애플리케이션) 등록.** 카카오는 [Kakao Developers](https://developers.kakao.com), 네이버는 네이버 개발자센터, 글로벌 서비스는 각자의 콘솔에서 새 앱을 만든다.
2. **인증 정보 발급.** 국내 서비스는 보통 `REST API Key` 또는 `Client ID`/`Client Secret` 한 쌍을 주고, 글로벌 서비스는 `API Key` 문자열 하나를 준다.
3. **도메인/리퍼러 등록(웹이면 필수).** 카카오·네이버 지도 JS는 등록된 도메인에서만 동작한다.
4. **첫 호출 테스트.** 키를 헤더나 쿼리에 실어 요청한다.

예를 들어 카카오 로컬 API로 "스타벅스"를 키워드 검색하는 호출은 이렇게 생겼다.

```bash
# REST API Key를 Authorization 헤더에 KakaoAK 접두어와 함께 전달
curl -G "https://dapi.kakao.com/v2/local/search/keyword.json" \
  -H "Authorization: KakaoAK ${KAKAO_REST_API_KEY}" \
  --data-urlencode "query=스타벅스" \
  --data-urlencode "size=5"
```

핵심은 `${KAKAO_REST_API_KEY}`처럼 **키를 환경변수로 빼고, 응답에서 필요한 필드만 파싱**하는 것이다. 글로벌 서비스는 `Authorization: Bearer ...`(OpenAI) 또는 `x-api-key: ...`(Claude)로 헤더 이름만 바뀔 뿐 구조는 같다.

> **보안 경고:** API 키는 절대 소스코드에 하드코딩하거나 깃 저장소에 커밋하지 말 것. `.env` 같은 환경변수 파일에 두고 `.gitignore`에 등록하며, 브라우저에 노출되면 안 되는 시크릿 키는 프론트엔드가 아니라 **서버(혹은 서버리스 함수)에서만** 호출하자. 실수로 푸시한 키는 즉시 폐기·재발급한다.

![A MacBook with lines of code on its screen on a busy desk](https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxzb2Z0d2FyZSUyMGRldmVsb3BlciUyMGxhcHRvcHxlbnwxfDB8fHwxNzgyNDkxNTAyfDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Christopher Gower](https://unsplash.com/@cgower?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-macbook-with-lines-of-code-on-its-screen-on-a-busy-desk-m_HRfLhgABo?utm_source=spice-bandit-blog&utm_medium=referral)*

## 분야별로 고를 때 실전 팁

같은 분야라도 프로젝트 성격에 따라 선택이 갈린다. 개인적으로 우선순위를 두는 기준은 이렇다.

- **지도/장소**: 국내 주소·상호 검색이면 카카오 로컬이 데이터 품질이 좋고 무료 한도도 넉넉하다. 글로벌 서비스나 라이선스 자유도가 중요하면 OpenStreetMap을 쓰되 Nominatim은 공정사용 정책(초당 1회)을 지켜야 한다.
- **번역**: 품질만 보면 DeepL Free(월 50만 자)가 강하다. 한국어 특화 톤이 필요하면 Papago를 함께 비교해보자.
- **날씨**: 글로벌 좌표 기반은 OpenWeatherMap, 국내 동네예보·기상특보는 기상청 공공데이터가 정답이다. OpenWeatherMap의 One Call은 무료라도 카드 등록을 요구하니 주의.
- **환율**: 단순 변환이면 가입 없는 Frankfurter가 가장 편하다. 주식·시계열 데이터까지 필요하면 Alpha Vantage 프리티어(일 호출이 매우 적음)를 보조로.
- **AI/LLM**: 카드 없이 무기한 무료로 테스트하려면 Google Gemini AI Studio가 진입장벽이 가장 낮다. Claude·OpenAI는 소액 크레딧으로 시작해 선불 종량으로 넘어가는 구조다.

## 무료 API를 고를 때 반드시 확인할 체크포인트

표의 숫자만 보고 결정하면 안 된다. 배포 전에 아래 네 가지를 점검하면 대부분의 사고를 막을 수 있다.

1. **무료 한도의 단위.** "월 50만 자"와 "일 1,000콜"은 전혀 다른 제약이다. 트래픽이 특정 시간에 몰리는 서비스라면 분당 한도(예: OpenWeatherMap 분당 60회)에 먼저 걸린다.
2. **상업적 사용 가능 여부.** NewsAPI 무료 플랜처럼 비상업·로컬 전용·24시간 지연 조건이 붙은 경우, 수익형 서비스에 그대로 쓰면 약관 위반이다.
3. **약관과 데이터 저장 정책.** 응답 데이터를 캐싱·재배포해도 되는지, 출처 표기 의무가 있는지(Unsplash·OSM은 출처 표기가 사실상 필수) 확인한다.
4. **신용카드 요구 여부.** 진짜 무료(Gemini AI Studio, Frankfurter)인지, 카드 등록 후 초과분 과금형(OpenWeatherMap One Call, Claude/OpenAI)인지 구분한다. 과금형은 콘솔에서 **지출 상한(spend limit)을 반드시 설정**해 두자.

내 결론은 명확하다. **프로토타입 단계에서는 카드 없이 시작 가능한 진짜 무료 API로 빠르게 검증하고, 트래픽이 늘면 한도와 약관을 다시 읽은 뒤 유료 전환을 결정하라.** 무료 한도는 언제든 바뀔 수 있으니, 위 표는 출발점으로만 쓰고 실제 적용 전에는 항상 각 제공처의 최신 공식 문서를 확인하기 바란다. 이 글은 정보 제공용이며, 특정 서비스 사용을 권유하거나 보장하지 않는다.
