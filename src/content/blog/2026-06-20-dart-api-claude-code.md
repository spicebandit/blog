---
title: "DART 전자공시 API를 클로드코드로 자동 조회하기"
description: "한국 전자공시(DART) 오픈API를 클로드코드(Claude Code)에 연결해 상장사 재무제표·공시·임원현황을 명령 한 줄로 뽑는 법. 텔레그램으로 지시하고 결과를 텍스트는 물론 PPT·엑셀로 받는 활용법까지."
pubDate: 2026-06-20T18:00:00+09:00
category: "ai"
tags: ["ClaudeCode", "DART", "전자공시", "OpenAPI", "Python"]
---

기업을 조사할 때 가장 답답한 순간은, 위키백과와 뉴스 기사마다 임원 명단이나 실적 숫자가 미묘하게 다를 때다. 누가 맞는지 확인하려면 결국 **DART 전자공시 원문**으로 가야 한다. 그런데 DART 사이트는 보고서를 일일이 클릭해 PDF를 뒤져야 해서 손이 많이 간다. 그래서 **DART 오픈API를 클로드코드(Claude Code)에 붙여**, "삼성전자 재무 보여줘" 한마디면 원문 숫자가 바로 나오게 만들었다. 이 글은 그 과정을 키 발급부터 실제 실행 화면까지 그대로 정리한 것이다.

![graphs of performance analytics on a laptop screen](https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBkYXRhJTIwYW5hbHlzaXMlMjBkYXNoYm9hcmR8ZW58MXwwfHx8MTc4MTk2MTI0MHww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Luke Chesser](https://unsplash.com/@lukechesser?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/graphs-of-performance-analytics-on-a-laptop-screen-JKUTrJ4vK00?utm_source=spice-bandit-blog&utm_medium=referral)*

## 왜 굳이 API로 붙이나

뉴스·위키 요약은 두 가지 약점이 있다. 첫째, **부정확**하다. 사외이사 명단이 옛날 정보거나, 옮겨 적는 과정에서 이름이 틀린다. 둘째, **시점이 뒤섞인다**. 작년 인사와 올해 인사가 한 문장에 섞여 누가 현직인지 헷갈린다.

DART 오픈API는 금융감독원이 운영하는 공식 전자공시 데이터다. 상장사가 의무적으로 제출한 사업보고서·분기보고서의 원문을 그대로 내려준다. 즉 **출처가 곧 1차 자료**다. 여기에 클로드코드를 얹으면, 자연어로 물어보면 클로드가 알아서 API를 호출하고 숫자를 정리해 준다. 사람이 corp_code를 외우거나 JSON을 파싱할 필요가 없다.

## 1단계 — OpenDART API 키 발급 (무료, 5분)

준비물은 키 하나뿐이다. 비용은 들지 않는다.

1. **opendart.fss.or.kr** 접속 → 우측 상단 **[인증키 신청/관리] → [인증키 신청]**
2. 이메일·이름·사용목적(예: "개인 투자분석")을 입력하고 신청
3. 가입한 **이메일로 40자리 API 키**가 도착한다 (즉시~수분)

사용 한도는 하루 2만 건이라 개인용으로는 차고 넘친다. 키를 받으면 코드에 직접 박지 말고 `.env` 파일에 보관한다. 이게 중요하다 — 키는 비밀번호와 같아서, 깃(git)에 올라가면 그대로 노출된다.

```bash
# ~/projects/stockbot/.env  (git에서 제외할 것)
DART_API_KEY=발급받은_40자리_키
```

## 2단계 — 클로드코드로 조회 스크립트 만들기

클로드코드에게 "DART API로 회사명만 넣으면 개요·재무·공시·임원을 뽑는 파이썬 스크립트를 만들어줘"라고 시키면 된다. 핵심 설계는 세 가지다.

- **회사명 → 고유번호(corp_code) 자동 변환**: DART는 회사를 8자리 코드로 식별한다. 전체 매핑 파일(corpCode.xml)을 한 번 받아 캐시해 두고, 회사 이름으로 검색하게 했다.
- **키는 `.env`에서만 읽기**: 소스에는 키를 남기지 않는다.
- **명령별로 분리**: 개요·재무·공시·임원을 각각 하나의 하위 명령으로 만들었다.

결과적으로 이런 인터페이스가 나왔다.

```bash
python3 dart.py company <회사명>   # 기업개황(대표자·업종·설립일)
python3 dart.py finance <회사명>   # 주요 재무계정
python3 dart.py filings <회사명>   # 최근 공시 목록
python3 dart.py execs   <회사명>   # 임원현황(출생·담당·경력)
```

![laptop computer on glass-top table](https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxmaW5hbmNpYWwlMjBkYXRhJTIwYW5hbHlzaXMlMjBkYXNoYm9hcmR8ZW58MXwwfHx8MTc4MTk2MTI0MHww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Carlos Muza](https://unsplash.com/@kmuza?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/laptop-computer-on-glass-top-table-hpjSkU2UYSU?utm_source=spice-bandit-blog&utm_medium=referral)*

## 실제 활용 화면

말로만 하면 와닿지 않으니, SK텔레콤을 실제로 조회한 결과를 그대로 옮긴다.

**① 기업개황** — 현재 대표자와 기본 정보가 한눈에 나온다.

```text
■ SK텔레콤 기업개황
  정식명칭   : SK텔레콤(주) (SK TELECOM CO.,LTD)
  대표자     : 정재헌
  종목코드   : 017670
  설립일     : 19840420   결산월: 12월
  주소       : 서울특별시 중구 을지로 65
```

**② 주요 재무** — 사업보고서의 핵심 계정을 당기·전기로 비교한다.

```text
■ SK텔레콤 주요 재무 (2024년 사업보고서 · 연결)
  매출액        당기 17,940,609,000,000   전기 17,608,511,000,000
  영업이익      당기  1,823,409,000,000   전기  1,753,204,000,000
  자산총계      당기 30,515,255,000,000   전기 30,119,227,000,000
  (단위: 원)
```

**③ 임원현황** — 이름뿐 아니라 **출생년월·담당·주요경력(학력 포함)**까지 나온다.

```text
■ SK텔레콤 임원현황 (사업보고서 기준 · 8명)
● 유영상  (사장) · 출생 1970년 05월 · 사내이사
   담당 : 대표이사
   경력 : 前 SK텔레콤 MNO 사업대표
● 김준모  (사외이사) · 출생 1976년 09월
   경력 : 現 KAIST 전기 및 전자공학부 교수
```

뉴스 기사로는 절대 한 번에 얻을 수 없는 밀도다. 출생년도와 경력까지 붙으니, 이사회 구성을 정성적으로 평가할 때 바로 쓸 수 있다.

## 함정 하나 — 원문도 '기준일'을 봐야 한다

여기서 흥미로운 일이 있었다. 위 ①번 기업개황에는 대표자가 **정재헌**으로 나오는데, ③번 임원현황(사업보고서)에는 대표이사가 **유영상**으로 나온다. 둘 다 DART 원문인데 왜 다를까?

답은 **기준일**이다. 사업보고서의 임원현황은 보통 **직전 사업연도말** 시점을 기준으로 작성된다. 그 사이 정기주주총회에서 대표이사가 바뀌면, 더 자주 갱신되는 기업개황(company)에는 새 대표가 반영되지만, 작년 말 기준인 사업보고서에는 옛 대표가 남는다. 그래서 "원문이니까 무조건 최신"이 아니라, **어느 시점의 원문인지**를 함께 봐야 한다.

그래서 클로드코드에게도 규칙을 박아뒀다. 임원·지분 같은 항목은 사업보고서(과거 기준)와 최신 뉴스를 **교차검증**하고, 시점이 다르면 둘 다 기준일을 밝혀 보고하도록.

![black and silver laptop computer](https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxmaW5hbmNpYWwlMjBkYXRhJTIwYW5hbHlzaXMlMjBkYXNoYm9hcmR8ZW58MXwwfHx8MTc4MTk2MTI0MHww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [path digital](https://unsplash.com/@pathdigital?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-and-silver-laptop-computer-tR0jvlsmCuQ?utm_source=spice-bandit-blog&utm_medium=referral)*

## 한 발 더 — 텔레그램으로 지시하고, PPT·엑셀로 받는다

여기까지 오면 자연스럽게 다음 욕심이 생긴다. **굳이 컴퓨터 앞에 앉아 명령어를 칠 필요가 있을까?** 그래서 이 도구를 텔레그램과 연결했다. 봇에게 메시지를 보내면, 클로드코드가 DART를 조회하고 분석해 **텔레그램으로 답을 회신**한다. 이동 중에 휴대폰으로 "○○ 최근 공시 정리해줘" 한 줄이면 끝이다.

핵심은 답변 형태가 **텍스트에만 묶이지 않는다**는 점이다. 요청에 따라 결과물의 형식을 바꿔 파일로 받는다.

- **텍스트** — 간단한 조회·요약은 채팅으로 바로
- **엑셀(.xlsx)** — "최근 5년 매출·영업이익 표로 정리해줘" → 숫자 데이터는 스프레드시트로 받아 그대로 가공
- **PPT(.pptx)** — "이 분석을 발표자료 10장으로" → 제목·본문·데이터가 들어간 슬라이드로 받아 회의에 바로 사용

같은 질문이라도 "표로", "PPT로"라는 말 한마디면 받아보는 형식이 달라진다. 데이터 조회(DART)부터 보고서·발표자료 생산까지가 하나의 대화 흐름으로 이어지는 셈이다. 1인 기업처럼 혼자 여러 역할을 해야 하는 환경에서, 이 "지시 → 가공 → 파일 수령"의 자동화는 체감 생산성이 크다.

## 마무리

DART 오픈API + 클로드코드 조합의 핵심은 "신뢰할 수 있는 원천 데이터를, 자연어로, 즉시"다. 키 발급은 5분, 스크립트는 클로드가 대신 짜 준다. 한 번 붙여 두면 기업 조사·이사회 분석·재무 비교가 클릭 없이 한 줄로 끝나고, 텔레그램과 엮으면 그 결과를 어디서든 PPT·엑셀로 받아볼 수 있다.

다만 데이터를 해석할 때는 위에서 본 '기준일 함정'처럼, 원문이라도 맥락을 함께 읽어야 한다는 점만 기억하면 된다.

> 이 글은 개인이 만든 도구의 사용기로, 특정 종목에 대한 투자 권유나 조언이 아닙니다. 모든 데이터의 최종 확인 책임은 본인에게 있습니다.
