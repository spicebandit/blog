---
title: "키미 K3 완전분석 — 요금제·성능·경제성 [2026]"
description: "문샷 키미 K3는 '제2의 딥시크'로 불리며 빅테크 주가를 흔들었다. 2.8조 파라미터 오픈웨이트 모델의 서비스 형태, API·앱 요금제, 그리고 실제로 경제성이 있는지를 딥시크·클로드와 비교해 파고든다."
pubDate: 2026-07-20T10:30:00+09:00
category: ai
tags: ["키미K3", "문샷", "AI요금제", "중국AI"]
---

**결론부터 말하면, 문샷(Moonshot AI)의 키미 K3는 '제2의 딥시크'라 불리지만 성격은 정반대다.** 2025년 초 딥시크가 '가격 파괴'로 세상을 놀라게 했다면, 2026년 7월 16일 공개된 키미 K3는 **가격이 아니라 '프런티어급 성능을 오픈웨이트로 푼 것'**으로 판을 흔들었다. 지능지표(Artificial Analysis Intelligence Index) 약 57점으로 현존 모델 중 상위권(집계 기준에 따라 3~4위)에 데뷔했고([Artificial Analysis](https://artificialanalysis.ai/articles/kimi-k3-achieves-3-in-the-artificial-analysis-intelligence-index-comparable-to-opus-4-8-and-gpt-5-5), [MarkTechPost](https://www.marktechpost.com/2026/07/18/kimi-k3-vs-deepseek-v4-pro-vs-glm-5-2-open-trillion-scale-moe-models-compared-on-benchmarks-license-and-serving-cost/)), 국내 언론(파이낸셜뉴스 「中 AI '키미 K3'의 역습」)이 '제2의 딥시크'로 소개할 만큼 미국 빅테크·반도체 주가의 투자심리를 흔들었다. 이 글은 K3가 **어떤 형태의 서비스인지, 요금제는 어떻게 짜였는지, 그래서 실제로 경제성이 있는지**를 딥시크·클로드·GPT와 나란히 놓고 따져본다. (특정 모델·종목 추천이 아니라 일반적 정보 분석이다.)

![코드 편집기 화면](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BlciUyMGNvZGluZyUyMHNjcmVlbnxlbnwxfDB8fHwxNzg0NTA4NDM5fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Ilya Pavlov](https://unsplash.com/@ilyapavlov?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/monitor-showing-java-programming-OqtafYT5kTw?utm_source=spice-bandit-blog&utm_medium=referral)*

## 키미 K3란 무엇인가 — 서비스의 세 얼굴

키미 K3를 한 줄로 정의하면 **'2.8조 파라미터 규모의 멀티모달 추론·에이전트 모델'**이다. 구조는 희소 혼합전문가(Stable LatentMoE)로, 토큰마다 896개 전문가 중 16개만 골라 활성화한다([MarkTechPost](https://www.marktechpost.com/2026/07/18/kimi-k3-vs-deepseek-v4-pro-vs-glm-5-2-open-trillion-scale-moe-models-compared-on-benchmarks-license-and-serving-cost/)). 즉 '덩치는 2.8조지만 매번 그 전부를 굴리지는 않는' 방식으로 거대 규모와 추론 효율을 함께 잡았다. 컨텍스트 창은 100만(1,048,576) 토큰, 이미지까지 읽는 네이티브 비전을 갖췄고, **추론이 항상 켜져 있는(always-on reasoning)** 것이 특징이다.

중요한 건 K3가 하나의 제품이 아니라 **세 가지 형태로 동시에 제공된다**는 점이다.

- **① 오픈웨이트(open-weight)** — 모델의 핵심 가중치를 누구나 내려받아 자체 서버에서 돌릴 수 있게 공개한다. 문샷은 K3 가중치를 **2026년 7월 27일까지 전면 공개**하겠다고 예고했고, 라이선스는 수정 MIT(Modified MIT)로 '월 활성사용자 1억 명 초과 시에만 귀속 표기'라는 조항 하나만 붙였다. 사실상 대부분의 개발자·기업에겐 제약 없는 오픈소스다.
- **② API** — 문샷 공식 플랫폼(platform.kimi.ai)과 OpenRouter 등에서 토큰 단위로 과금해 쓴다. 자체 인프라 없이 바로 붙여 쓰는 경로다.
- **③ 소비자 앱·구독** — kimi.com과 iOS 앱에서 챗봇 형태로 쓴다. 무료 티어로 체험하고, 유료 구독으로 컨텍스트·에이전트 크레딧·코드 배수를 늘린다.

이 '오픈웨이트 + API + 앱'의 3중 구조 자체가 전략이다. 무료로 뿌려 생태계를 넓히고(오픈웨이트), 편의를 원하는 사용자에겐 API·구독으로 매출을 낸다. K3가 겨냥한 주 용도도 분명하다 — 단순 질문답변이 아니라 **대규모 저장소를 넘나드는 장기 코딩, 도구 사용, 디버깅, 이미지·로그·테스트·실행결과를 보며 반복하는 에이전트 작업**이다.

## 요금제 뜯어보기 — API와 앱 구독

가장 궁금한 요금부터 보자. K3는 API와 소비자 구독이 완전히 다른 체계다.

**API 요금 (100만 토큰당)**

| 항목 | 가격 | 비고 |
|------|------|------|
| 입력 (캐시 미스) | $3.00 | 새 컨텍스트 |
| 입력 (캐시 히트) | $0.30 | 반복 컨텍스트, 90% 할인 |
| 출력 | $15.00 | 추론 토큰 포함 |
| 컨텍스트 창 | 1M(1,048,576) 토큰 | **길이별 할증 없음(균일가)** |

*출처: [Kimi API Platform](https://platform.kimi.ai/docs/pricing/chat-k3)·[eesel AI](https://www.eesel.ai/blog/kimi-k3-pricing) (2026년 7월 기준). 세금 별도.*

**소비자 앱 구독 (월 기준)**

| 티어 | 월 요금 | 연납 시 월 환산 |
|------|:------:|:------:|
| Free | $0 | — |
| Moderato | $19 | $15 |
| Allegretto | $39 | $31 |
| Allegro | $99 | $79 |
| Vivace | $199 | $159 |

*출처: [eesel AI](https://www.eesel.ai/blog/kimi-k3-pricing). 중국 내수 기준 ¥199(약 $28)부터 시작하며, 2026년 7월 15일~8월 11일 충전 보너스 10~30% 이벤트가 있었다. 무료 티어에서도 앱·kimi.com에서 표준 사용량 한도 내로 K3를 체험할 수 있다.*

포인트는 두 가지다. 첫째, **API는 1M 토큰 컨텍스트 전 구간이 균일가**라 긴 문서·대형 코드베이스를 넣어도 '롱컨텍스트 할증'이 없다. 클로드·GPT가 긴 입력에 프리미엄을 매기는 것과 대비된다. 둘째, 앱 구독은 Free→Vivace까지 5단계로, 상위 티어일수록 쓸 수 있는 컨텍스트 길이·에이전트 크레딧·'키미 코드' 배수가 커진다. 즉 무겁게 쓰는 개발자일수록 상위 구독이 유리한 설계다.

![데이터센터 서버](https://images.pexels.com/photos/17489163/pexels-photo-17489163.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [panumas nikhomkhai](https://www.pexels.com/@cookiecutter) on [Pexels](https://www.pexels.com/photo/computer-server-in-data-center-room-17489163/)*

## 경제성 분석 — 그래서 싼가, 비싼가

핵심 질문이다. 결론은 **"절대 단가는 싸지 않다. K3의 경제성은 가격표가 아니라 '반복작업 캐싱'과 '성능당 비용'에서 나온다."**

먼저 포지셔닝을 보자. K3의 $3/$15(입력/출력)는 딥시크식 초저가가 아니다. 앤스로픽 클로드 소네트와 **똑같은 값**이고, GPT-5.6 Sol(약 $2.5/$15)·제미나이 3 Pro(약 $2/$12)보다 오히려 조금 비싸다. 대신 클로드 오푸스(약 $5/$25)보다는 싸다([eesel AI](https://www.eesel.ai/blog/kimi-k3-pricing)). 반대로 같은 중국 진영의 딥시크 V4와 비교하면, 출력 토큰 기준 **약 13~21배 비싸다**(저가형 V4 Flash 대비 약 21배, 상위 V4 Pro의 블렌디드 기준으로도 13배 안팎). 한마디로 K3는 '가격으로 싸움을 거는' 모델이 아니라 **'프런티어 성능을 프런티어보다 조금 싼 값에, 게다가 오픈으로' 파는** 모델이다.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 14px;margin:1.5rem 0">
<svg viewBox="0 0 720 250" width="100%" height="auto" role="img" aria-label="주요 AI 모델의 출력 토큰 100만개당 API 가격 비교. 딥시크 약 0.7달러, 제미나이3 프로 12달러, GPT-5.6 Sol과 클로드 소네트와 키미 K3 15달러, 클로드 오푸스 25달러">
  <text x="20" y="26" font-size="15" font-weight="700" fill="#23201D">출력 100만 토큰당 API 가격 비교 (낮을수록 저렴, 단위 $)</text>
  <g font-size="12.5" fill="#23201D">
    <text x="150" y="62" text-anchor="end">딥시크 V4</text>
    <rect x="160" y="48" width="18" height="20" rx="3" fill="#8A8378"/>
    <text x="186" y="63" fill="#23201D">~$0.7</text>
    <text x="150" y="92" text-anchor="end">제미나이 3 Pro</text>
    <rect x="160" y="78" width="288" height="20" rx="3" fill="#E5DECF"/>
    <text x="456" y="93" fill="#23201D">~$12</text>
    <text x="150" y="122" text-anchor="end">GPT-5.6 Sol</text>
    <rect x="160" y="108" width="360" height="20" rx="3" fill="#E5DECF"/>
    <text x="528" y="123" fill="#23201D">~$15</text>
    <text x="150" y="152" text-anchor="end">키미 K3</text>
    <rect x="160" y="138" width="360" height="20" rx="3" fill="#C8102E"/>
    <text x="528" y="153" font-weight="700" fill="#C8102E">$15</text>
    <text x="150" y="182" text-anchor="end">클로드 소네트</text>
    <rect x="160" y="168" width="360" height="20" rx="3" fill="#E5DECF"/>
    <text x="528" y="183" fill="#23201D">$15</text>
    <text x="150" y="212" text-anchor="end">클로드 오푸스</text>
    <rect x="160" y="198" width="500" height="20" rx="3" fill="#23201D"/>
    <text x="668" y="213" text-anchor="end" font-weight="700" fill="#fff">~$25</text>
  </g>
</svg>
<figcaption style="font-size:0.85rem;color:#8A8378;text-align:center;margin-top:8px">키미 K3는 초저가 딥시크가 아니라 클로드 소네트와 같은 '프런티어 가격대'에 위치한다. 값은 시점·구간에 따라 변한다. 출처: <a href="https://www.eesel.ai/blog/kimi-k3-pricing">eesel AI</a> 등.</figcaption>
</figure>

그렇다면 경제성은 어디서 나오나. 세 가지다.

**첫째, 프롬프트 캐싱.** K3의 진짜 무기는 캐시 히트 가격 $0.30이다([eesel AI](https://www.eesel.ai/blog/kimi-k3-pricing)). 같은 컨텍스트(대형 코드베이스, 긴 지시문)를 반복해서 보내는 코딩·에이전트 작업에서는 캐시 적중률이 90%를 넘기기 일쑤인데, 이 경우 반복분의 입력비가 **$3.00에서 $0.30으로 90% 떨어진다.** 직접 계산해 보면 효과가 뚜렷하다. 10만 토큰이 캐시되고 신규 입력 2천·출력 3천 토큰이 붙는 전형적 코딩 호출을 예로 들면 — 캐시가 없을 땐 입력 10.2만×$3 + 출력 3천×$15 = 약 **$0.351**, 캐시가 적중하면 10만×$0.30 + 2천×$3 + 출력 3천×$15 = 약 **$0.081**로, **약 77% 저렴해진다**(요금표에 근거한 자체 계산 예시). K3의 요금 구조가 '반복 컨텍스트가 많은 워크로드'에 최적화됐다는 뜻이다.

**둘째, 성능당 비용.** K3는 코딩 특화 벤치마크에서 같은 오픈 진영을 큰 폭으로 앞선다. 문샷 자체 하니스 기준 DeepSWE 67.5(GLM-5.2 46.2), FrontierSWE 81.2(GLM-5.2 67.3)로 측정됐다([MarkTechPost](https://www.marktechpost.com/2026/07/18/kimi-k3-vs-deepseek-v4-pro-vs-glm-5-2-open-trillion-scale-moe-models-compared-on-benchmarks-license-and-serving-cost/)). 토큰 단가가 조금 비싸도, 한 번에 문제를 더 많이 풀어내면 '작업 하나를 끝내는 총비용'은 낮아질 수 있다. 경제성은 토큰 단가가 아니라 **작업 완수 비용**으로 봐야 한다는 얘기다.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 14px;margin:1.5rem 0">
<svg viewBox="0 0 720 200" width="100%" height="auto" role="img" aria-label="코딩 벤치마크에서 키미 K3와 GLM-5.2 점수 비교. DeepSWE는 K3 67.5 대 GLM 46.2, FrontierSWE는 K3 81.2 대 GLM 67.3으로 K3가 앞선다">
  <text x="20" y="26" font-size="15" font-weight="700" fill="#23201D">코딩 벤치마크 비교 (높을수록 우수, 점)</text>
  <g font-size="12.5" fill="#23201D">
    <text x="150" y="66" text-anchor="end">DeepSWE · K3</text>
    <rect x="160" y="52" width="338" height="20" rx="3" fill="#C8102E"/>
    <text x="506" y="67" font-weight="700" fill="#C8102E">67.5</text>
    <text x="150" y="94" text-anchor="end">DeepSWE · GLM-5.2</text>
    <rect x="160" y="80" width="231" height="20" rx="3" fill="#E5DECF"/>
    <text x="399" y="95" fill="#23201D">46.2</text>
    <text x="150" y="134" text-anchor="end">FrontierSWE · K3</text>
    <rect x="160" y="120" width="406" height="20" rx="3" fill="#C8102E"/>
    <text x="574" y="135" font-weight="700" fill="#C8102E">81.2</text>
    <text x="150" y="162" text-anchor="end">FrontierSWE · GLM-5.2</text>
    <rect x="160" y="148" width="337" height="20" rx="3" fill="#E5DECF"/>
    <text x="505" y="163" fill="#23201D">67.3</text>
  </g>
</svg>
<figcaption style="font-size:0.85rem;color:#8A8378;text-align:center;margin-top:8px">코딩 하니스에서 K3(레드)가 오픈 경쟁 모델 GLM-5.2를 앞선다. 벤더 자체 측정치로, 독립 검증치와 다를 수 있다. 출처: <a href="https://www.marktechpost.com/2026/07/18/kimi-k3-vs-deepseek-v4-pro-vs-glm-5-2-open-trillion-scale-moe-models-compared-on-benchmarks-license-and-serving-cost/">MarkTechPost</a>.</figcaption>
</figure>

**셋째, 오픈웨이트라는 선택지.** 7월 27일 가중치가 공개되면 대규모·민감 데이터를 다루는 조직은 K3를 **자체 인프라에 올려 토큰당 API 비용 없이** 돌릴 수 있다. 데이터 주권·규제 대응까지 감안하면 API 단가만으로는 잡히지 않는 가치다. 다만 2.8조 파라미터를 자가 호스팅하려면 그만한 GPU·운영 역량이 필요해, 셀프호스팅의 경제성은 '충분히 큰 사용량'에서만 성립한다.

경제성의 함정도 있다. K3는 **추론이 항상 최대치로 켜져 있어(reasoning_effort=max 고정)** 출력 토큰(추론 과정 포함)을 많이 쓴다. 더 싼 비추론 버전이 없다. 그래서 단순 요약·분류·챗봇처럼 추론이 필요 없는 작업에 K3를 쓰면 '과한 사양에 과한 비용'이 된다. **K3의 경제성은 어디까지나 장기 코딩·복잡한 에이전트 워크로드에 한정된다.**

## '제2의 딥시크'인가 — 시장이 주목한 이유

첨부한 파이낸셜뉴스 보도의 논지처럼, K3 공개는 단순한 신모델 출시를 넘어 **투자 이슈**로 번졌다. 고성능 AI 모델이 저비용·오픈으로 쏟아질수록, 미국 빅테크가 쏟아붓는 천문학적 AI 설비투자(capex)가 '과연 그만한 값을 하느냐'는 의문이 커지기 때문이다. 실제로 K3 공개 직후 관련 반도체·빅테크 종목의 투자심리가 흔들렸고, 시장은 마이크로소프트 등 대형 클라우드의 **자본지출 유지 여부**에 촉각을 세웠다.

월가의 평가도 이를 뒷받침한다. 모건스탠리는 "중국의 최첨단 대규모언어모델이 규모·성능·가격 세 축에서 **종합적 추격(comprehensive catch-up)**을 달성했다"고 진단했고([futunn](https://news.futunn.com/en/post/76208320/kimi-k3-debuts-amid-great-anticipation-morgan-stanley-china-s)), 골드만삭스는 "중국 오픈소스 모델이 글로벌 채택에서 **결정적 변곡점**에 도달했으며 고급 모델 경쟁이 격화하고 있다"고 평가했다([futunn](https://news.futunn.com/en/post/76225859/goldman-sachs-comments-on-kimi-k3-chinese-open-source-models)). 2025년 초 딥시크가 '싼값'으로 시장을 흔들었다면, K3는 '성능+개방'으로 같은 종류의 충격을 다시 준 셈이다.

다만 냉정히 볼 대목도 있다. 지능지표 상위권 '데뷔'가 곧 '실사용 최고'를 뜻하지는 않고, 벤치마크 순위는 측정 방법·버전에 따라 출렁인다. 벤더 자체 측정치와 독립 검증치의 간극도 늘 염두에 둬야 한다. '충격'의 강도와 별개로, 실제 도입 판단은 자기 워크로드에서의 검증을 거쳐야 한다.

## 역사적 맥락 — 오픈웨이트라는 후발주자의 무기

K3의 개방 전략은 갑자기 나온 것이 아니다. 후발주자가 앞선 자를 따라잡을 때 '표준을 공짜로 푸는' 수법은 IT 역사에서 반복돼 왔다. 1990~2000년대 리눅스가 값비싼 유닉스에 맞서 소스를 열어 서버 생태계를 장악했고, 2007~2008년 구글 안드로이드가 오픈소스(AOSP)로 스마트폰 OS 표준을 가져갔다. 더 거슬러 가면 1998년 넷스케이프가 브라우저 소스를 공개해(모질라) 마이크로소프트 IE의 독점에 맞선 것도 같은 문법이다 — **시장 열세를 '개방'으로 되받아친다.** '내가 가장 앞서지 못한다면, 판 자체를 공유지로 만들어 선두의 독점 이익을 무너뜨린다' — 이 논리를 중국 AI가 그대로 잇고 있다.

경제사학자 알렉산더 거센크론이 1962년 저서 『역사적 관점에서 본 경제적 후진성』에서 정리한 **'후발성의 이점(advantages of backwardness)'**도 여기에 겹친다. 뒤늦게 출발한 쪽은 선두의 시행착오를 건너뛰고, 자본·기술의 제약을 우회 전략으로 메우며 더 빠르게 따라붙는다. 거센크론이 19세기 독일·러시아에서 본 것은 '자본 부족을 대형은행·국가가 우회로로 메운' 그림이었는데, 2020년대 중국 AI에서 그 우회로는 **국가 보조·오픈웨이트 생태계·캐싱 최적화로 형태만 바뀌었을 뿐 '제약을 제도적 대체물로 건너뛴다'는 논리는 동일하다.** 딥시크가 '효율'로, K3가 '개방+성능'으로 비대칭 돌파를 시도하는 지금은 그 전형이다. 미국 최첨단 반도체 수출 통제라는 '목줄'을 찬 채 이룬 성취라는 점에서, 제약이 오히려 우회 혁신을 강제한 사례이기도 하다.

## So What — 한국 개발자·기업에 주는 의미

키미 K3가 던지는 실무적 메시지는 명확하다. **첫째, '프런티어급 오픈 모델'이라는 새 선택지가 생겼다.** 지금까지 클로드 오푸스·GPT 최상위를 써야 했던 장기 코딩·복잡한 에이전트 파이프라인이라면, K3는 비슷한 성능을 조금 더 싸게, 게다가 가중치까지 받아 쓸 수 있는 대안이 된다. 반복 컨텍스트가 많은 작업일수록 캐싱 덕에 실효 비용이 크게 떨어진다.

**둘째, 그러나 만능이 아니다.** 단순 챗봇·요약·분류처럼 추론이 필요 없는 작업엔 딥시크·큐원 같은 저가 모델이 여전히 압도적으로 경제적이다. always-on 추론과 $15 출력 단가는 '무거운 작업'에 최적화된 값이지, 가벼운 작업엔 낭비다. **모델 선택의 축이 '싸냐 비싸냐'에서 '내 작업이 추론·에이전트형이냐 단순형이냐'로 옮겨가고 있다.**

결국 K3가 보여주는 진짜 그림은 이것이다 — 중국 AI가 '싼 모델'을 넘어 **'프런티어 성능을 오픈으로 푸는 단계'**에 들어섰다는 것. 성능의 최전선은 여전히 미국이 쥐고 있지만, 그 최전선 '바로 아래'를 오픈웨이트가 빠르게 채우고 있다. 한국의 1인 개발자든 스타트업이든, 이제 '무엇을 쓸까'의 답은 하나가 아니라 **워크로드별 포트폴리오**여야 한다. (본 글은 일반적 정보 분석이며 특정 종목·제품의 투자·구매 권유가 아니다. 가격·성능 수치는 시점에 따라 갱신되므로 도입 시 최신 자료를 확인하기 바란다.)

## 자주 묻는 질문 (키미 K3)

**Q1. 키미 K3는 무료인가요?**
소비자 앱(kimi.com·iOS)에는 무료 티어가 있어 표준 사용량 한도 내에서 체험할 수 있습니다. 다만 대량으로 쓰려면 월 $19(Moderato)~$199(Vivace) 구독이나, 토큰당 과금하는 API가 필요합니다. 또 7월 27일 가중치가 공개되면 직접 내려받아 자체 서버에서 돌릴 수도 있습니다.

**Q2. API 요금은 얼마인가요?**
100만 토큰당 입력 $3.00, 출력 $15.00이며, 반복 컨텍스트(캐시 히트)는 입력이 $0.30으로 90% 저렴합니다. 컨텍스트 창은 100만 토큰이고 길이별 할증이 없습니다. 클로드 소네트와 같은 가격대입니다.

**Q3. 딥시크보다 비싼데 왜 쓰나요?**
성능이 다르기 때문입니다. K3는 장기 코딩·복잡한 에이전트 작업에서 강하고, 캐싱을 잘 활용하면 반복작업의 실효 비용이 크게 낮아집니다. 반대로 단순 요약·챗봇이라면 딥시크가 훨씬 경제적입니다. '작업 종류'에 따라 고르는 것이 핵심입니다.

**Q4. K3는 오픈소스인가요?**
가중치를 공개하는 오픈웨이트 모델입니다. 라이선스는 수정 MIT로, 월 활성사용자 1억 명 초과 시에만 귀속 표기 조항이 적용됩니다. 대부분의 개발자·기업에겐 사실상 제약 없이 쓸 수 있습니다.

---

*이 글은 2026년 7월 공개된 자료를 바탕으로 한 일반적 해설이며, 특정 기업·종목·제품의 투자·구매를 권유하는 조언이 아니다. 벤치마크·가격은 시점과 측정 방법에 따라 갱신되므로 실제 도입 시 최신 자료를 확인하기 바란다.*

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "키미 K3는 무료인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "소비자 앱(kimi.com·iOS)에는 무료 티어가 있어 표준 사용량 한도 내에서 체험할 수 있다. 대량 사용은 월 19달러(Moderato)~199달러(Vivace) 구독이나 토큰당 과금 API가 필요하다. 7월 27일 가중치가 공개되면 직접 내려받아 자체 서버에서 돌릴 수도 있다."
      }
    },
    {
      "@type": "Question",
      "name": "키미 K3 API 요금은 얼마인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "100만 토큰당 입력 3.00달러, 출력 15.00달러이며, 반복 컨텍스트(캐시 히트)는 입력이 0.30달러로 90% 저렴하다. 컨텍스트 창은 100만 토큰이고 길이별 할증이 없다. 클로드 소네트와 같은 가격대다."
      }
    },
    {
      "@type": "Question",
      "name": "딥시크보다 비싼데 키미 K3를 왜 쓰나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "성능이 다르기 때문이다. K3는 장기 코딩·복잡한 에이전트 작업에 강하고, 캐싱을 활용하면 반복작업의 실효 비용이 크게 낮아진다. 반대로 단순 요약·챗봇이라면 딥시크가 훨씬 경제적이다. 작업 종류에 따라 고르는 것이 핵심이다."
      }
    },
    {
      "@type": "Question",
      "name": "키미 K3는 오픈소스인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "가중치를 공개하는 오픈웨이트 모델이다. 라이선스는 수정 MIT로, 월 활성사용자 1억 명 초과 시에만 귀속 표기 조항이 적용된다. 대부분의 개발자·기업에겐 사실상 제약 없이 쓸 수 있다."
      }
    }
  ]
}
</script>
