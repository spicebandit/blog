---
title: "애플 Siri AI, Google Gemini 품다 — 빅테크 AI 전략의 변곡점"
description: "WWDC 2026에서 애플이 공개한 Siri AI는 Google Gemini 기반으로 완전 재설계됐다. 연간 10억 달러짜리 이 파트너십이 시사하는 것은 단순한 기술 제휴가 아니다."
pubDate: 2026-06-24T09:00:00+09:00
category: ai
tags: ["Apple", "Siri AI", "Google Gemini", "WWDC 2026"]
draft: true
---

올 6월 8일, 애플의 연례 개발자 컨퍼런스 WWDC 2026 키노트가 끝난 뒤 기술 업계에는 묘한 침묵이 흘렀다. 애플이 10년 넘게 독자 개발해온 시리(Siri)를 경쟁사 구글의 AI 모델 '제미나이(Gemini)'로 재설계했다는 발표 때문이다. 수직 통합의 대명사였던 애플이 핵심 사용자 인터페이스를 경쟁사 기술에 의탁하는 선택을 했다. 이것이 단순한 기술 파트너십인지, 아니면 AI 시대 빅테크 경쟁 구도의 근본적 변화를 알리는 신호인지를 따져볼 필요가 있다.

![apple logo on blue surface](https://images.unsplash.com/photo-1621768216002-5ac171876625?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxhcHBsZSUyMHNpcmklMjBhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDF8MHx8fDE3ODIyNTkzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Sumudu Mohottige](https://unsplash.com/@stm_2790?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/apple-logo-on-blue-surface-bIgpii04UIg?utm_source=spice-bandit-blog&utm_medium=referral)*

## Gemini를 품은 Siri: 연간 10억 달러짜리 선택

애플은 이번 WWDC 2026에서 새 AI 어시스턴트를 공식적으로 **'Siri AI'**라고 명명하며 별도 앱으로 독립시켰다. 기존 Siri가 제한된 명령어 기반 인터페이스였다면, Siri AI는 맥락을 이해하는 대화형 에이전트로 탈바꿈했다. 메시지·이메일·사진을 가로질러 개인 정보를 참조하고, 여러 앱에 걸친 복잡한 작업을 자율적으로 수행할 수 있다.

이 뒤에는 구글과의 밀약이 있다. 블룸버그 마크 거먼 등의 보도에 따르면 애플은 구글에 **연간 약 10억 달러(약 1조 4천억 원)**를 지불하고, 1.2조 개(1.2 trillion) 파라미터 규모의 커스텀 제미나이 모델 사용권을 확보했다. 이는 애플이 자체 클라우드 모델로 운용하던 1,500억 파라미터 규모보다 8배 큰 규모다. 아키텍처는 **전문가 혼합(MoE, Mixture of Experts)** 방식으로, 방대한 파라미터 중 쿼리에 필요한 전문가 그룹만 선택적으로 활성화해 효율을 높인다.

애플은 개인정보 보호 원칙을 지키기 위해 기존 **프라이빗 클라우드 컴퓨트(Private Cloud Compute)** 인프라와 제미나이 모델을 결합했다. 온디바이스 처리가 가능한 요청은 기기 내에서, 복잡한 추론이 필요한 요청은 서버로 전달하되 사용자 데이터를 외부에 저장하지 않는 구조다. 이 기능은 iOS 26.4 업데이트를 통해 전 세계 **15억 명 일일 사용자**에게 순차 배포될 예정이다.

## 시장이 냉담한 이유: "구글 따라가는 수준"

발표 당일 애플 주가는 하락했다. 한국경제 등 국내외 언론은 "구글을 따라가는 수준"이라고 혹평했다. 시장의 냉담한 반응에는 몇 가지 이유가 있다.

![people standing in front of white wall](https://images.unsplash.com/photo-1615725802642-936d9aade2ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMHNpcmklMjBhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDF8MHx8fDE3ODIyNTkzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Jimmy Jin](https://unsplash.com/@jimmyjin?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/people-standing-in-front-of-white-wall-IaDnLLFMqhk?utm_source=spice-bandit-blog&utm_medium=referral)*

첫째, **차별화 부재**다. 삼성 갤럭시 AI도 구글 제미나이를 핵심 엔진으로 사용한다. 결국 한국 소비자 입장에서는 아이폰 Siri AI와 갤럭시 AI가 같은 엔진을 쓰는 상황이 됐다. 애플이 그토록 강조해온 하드웨어-소프트웨어 수직 통합의 우위가 AI 레이어에서는 무의미해진 셈이다.

둘째, **타이밍이 늦었다**는 지적이다. ChatGPT가 2022년 말 세상을 놀라게 한 지 3년 반이 지났다. 구글 제미나이, 메타 라마, 앤트로픽 클로드가 치열하게 경쟁하는 사이 애플은 자체 모델 개발에 집착하다가 결국 경쟁사 기술을 수입하는 선택을 했다. AI 지각생이라는 오명은 쉽게 지워지지 않는다.

셋째, **성능 완성도**에 대한 의구심이다. 발표된 기능은 인상적이지만 실제 배포 범위가 제한적이고, iOS 26.4 업데이트를 통한 완전 출시까지 시간이 필요하다. 기대만큼의 실사용 경험을 언제 제공할 수 있을지가 관건이다.

## AI가 '공유 인프라'가 되고 있다

이번 파트너십의 더 큰 의미는 개별 기업의 전략 실패를 넘어선 곳에 있다.

애플-구글의 기존 관계를 보면, 구글은 애플 기기의 기본 검색 엔진 자리를 유지하기 위해 연간 **약 200억 달러($20B)**를 애플에 지불한다. 이번 Siri AI 제미나이 계약(연간 10억 달러)은 그 위에 추가되는 셈이다. 미국 법무부와 EU는 이미 두 회사 간 검색 기본값 계약을 반독점 심사 대상으로 보고 있는데, AI 파트너십이 더해지면 규제 리스크는 더 커질 수 있다.

![silhouette of people standing near wall](https://images.unsplash.com/photo-1579693409321-1be2df1ab130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxhcHBsZSUyMHNpcmklMjBhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDF8MHx8fDE3ODIyNTkzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Zhiyue](https://unsplash.com/@zhiyue?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/silhouette-of-people-standing-near-wall-7DOU5NlNIcE?utm_source=spice-bandit-blog&utm_medium=referral)*

한편 애플은 이 파트너십을 영구 전략으로 제시하지 않았다. 2027~2028년까지 자체 파운데이션 모델 개발을 완료해 서버 연산의 상당 부분을 인하우스로 전환한다는 로드맵을 내부적으로 유지하고 있는 것으로 알려졌다. 제미나이 의존은 일종의 '전략적 브리지'다.

그러나 여기서 주목해야 할 흐름이 있다. 파운데이션 모델 개발은 이미 수백억 달러 단위의 자본과 수천 명의 AI 연구 인력이 필요한 사업이 됐다. 애플처럼 시가총액 3조 달러짜리 기업도 독자 개발을 포기하고 타사 모델을 임대해 쓰기로 했다면, 이는 AI 파운데이션 모델이 개별 기업이 독점하기엔 너무 자본집약적인 **공유 기반 인프라**로 자리매김하고 있음을 시사한다. 마치 OS나 CPU가 그랬듯이, AI 모델도 특정 기업의 차별화 무기이기보다 업계 전체가 공유하는 플랫폼이 되어가고 있는 것이다.

Siri AI와 제미나이의 결합이 가져올 진짜 변화는 주가 등락보다 이 지점에 있다. 누가 파운데이션 모델을 만드느냐보다, 그 위에서 어떤 사용자 경험과 애플리케이션을 구축하느냐가 경쟁의 핵심으로 이동하고 있다.

---

**출처**
- [WWDC 2026: Apple unveils Siri AI, Gemini-powered Apple Intelligence](https://www.business-standard.com/technology/tech-news/wwdc-2026-apple-unveils-siri-ai-gemini-powered-apple-intelligence-more-126060900042_1.html) — Business Standard, 2026.06.09
- [Apple nears $1 billion Google deal for custom Gemini model to power Siri](https://9to5mac.com/2025/11/05/google-gemini-1-billion-deal-apple-siri/) — 9to5Mac, 2025.11.05
- [Apple Reveals New AI Architecture Built Around Google Gemini Models](https://www.macrumors.com/2026/06/08/apple-reveals-new-ai-architecture/) — MacRumors, 2026.06.08
- [애플 시리AI 내놨지만…구글 따라가는 수준](https://www.hankyung.com/amp/2026060964881) — 한국경제, 2026.06.09
- [애플의 'Siri AI' 승부수: 늦은 추격은 아이폰 생태계를 지킬 수 있나](https://www.koreabizreview.com/articles/global-radar-ai-tech-siri-ai-20260609-1nlw) — Korea Business Review, 2026.06.09
