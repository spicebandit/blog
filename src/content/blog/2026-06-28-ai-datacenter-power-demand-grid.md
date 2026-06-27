---
title: "AI 데이터센터 전력수요, 전력망이 못 따라간다"
description: "한전 데이터센터 전기사용 신청이 4년 새 8배 급증했지만 송전망은 제자리. 수도권 쏠림과 전력계통영향평가, 지방 분산 정책을 전력시장 관점에서 해설한다."
pubDate: 2026-06-28T09:30:00+09:00
category: energy
tags: ["데이터센터", "전력수요", "전력계통", "AI전력"]
draft: true
---

AI 데이터센터 전력수요가 한국 전력망의 가장 뜨거운 변수로 떠올랐다. 핵심은 간단하다. 전기를 쓰겠다는 신청은 폭발적으로 늘었는데, 그 전기를 실어 나를 송전망과 변전소가 그 속도를 따라가지 못한다는 것이다. 발전 설비를 더 짓는 문제가 아니라 '어디에, 어떻게 연결할 것인가'라는 계통(grid)의 문제로 무게중심이 옮겨갔다. 이 글은 데이터센터 전력수요 급증이 전력시장과 계통 운영에 보내는 신호를 전력거래·정책 관점에서 해설한다.

![cable network](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxkYXRhJTIwY2VudGVyJTIwc2VydmVyJTIwcG93ZXJ8ZW58MXwwfHx8MTc4MjU5NTg4NXww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Taylor Vick](https://unsplash.com/@tvick?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/cable-network-M5tzZtFCOfs?utm_source=spice-bandit-blog&utm_medium=referral)*

## 신청은 8배, 송전망은 제자리 — 숫자가 말하는 병목

가장 먼저 봐야 할 숫자는 한전에 접수된 데이터센터 전기사용 신청 용량이다. 보도에 따르면 이 수치는 2023년 약 906MW에서 2027년 약 7343MW로, 4년 사이 약 8배 늘어난 것으로 집계됐다. 그러나 실제 공급 가능한 전력은 그 절반에도 못 미친다는 분석이 함께 제기됐다. '신청'과 '공급 가능'의 간극이 곧 병목의 크기다.

실제 전력소비 전망도 가파르다. 에너지경제연구원(KEEI) 분석을 인용한 보도에 따르면 데이터센터발 전력소비는 2023년 5.0TWh에서 2038년 15.5TWh 수준으로 약 3배 늘어날 것으로 추정된다. 다만 이런 장기 전망치는 AI 투자 속도·반도체 효율·정책 변수에 따라 폭이 크다는 점에서 단정적으로 받아들이기보다 '방향성'으로 읽는 편이 안전하다.

So-What은 분명하다. 전력시장에서 부하(수요)는 보통 완만하게 변하지만, 하이퍼스케일 AI 데이터센터는 단일 부지에서 100MW를 넘는 대규모 단일 부하를 24시간 상시 고부하로 끌어다 쓴다. 이런 '덩어리 수요'가 특정 변전소에 몰리면 송전망 포화, 변전소 증설 부담, 전력 품질 저하가 동시에 발생한다. 발전 총량이 부족한 게 아니라, 특정 지점의 계통 여유가 먼저 바닥난다는 뜻이다.

![server room aisle with metal equipment racks](https://images.unsplash.com/photo-1584169417032-d34e8d805e8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxkYXRhJTIwY2VudGVyJTIwc2VydmVyJTIwcG93ZXJ8ZW58MXwwfHx8MTc4MjU5NTg4NXww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [İsmail Enes Ayhan](https://unsplash.com/@ismailenesayhan?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/server-room-aisle-with-metal-equipment-racks-lVZjvw-u9V8?utm_source=spice-bandit-blog&utm_medium=referral)*

## 수도권 쏠림과 전력계통영향평가 — 입지가 곧 정책 변수

문제를 키우는 두 번째 축은 '쏠림'이다. 보도에 따르면 2024년 8월부터 2025년 6월까지 약 11개월간 전국에서 290건의 데이터센터 전력사용 신청이 접수됐는데, 이 가운데 195건(약 67%)이 수도권에 집중됐고 수도권 신청 용량만 약 20GW에 달했다. 정작 송전망 여유는 비수도권에 더 있는데, 수요는 수도권으로 몰리는 구조적 미스매치다.

정부의 대응 카드가 바로 '전력계통영향평가' 제도다. 2024년 8월 시행된 이 제도는 신규 대규모 전력수요 사업의 입지가 적정한지를 전력공급 가능성·송전망 여건·사회경제적 영향 등으로 종합 평가한다. 핵심 취지는 전력수요의 비수도권 분산이며, 평가에서 '수요 분산 효과'를 주요 요소로 반영하도록 설계됐다. 실제로 수도권 신청 195건 중 산업부 심사를 통과한 사례는 소수에 그친 것으로 전해진다(보도에 따라 통과 건수는 다르게 인용되므로 확정 수치는 정부 공식 집계로 확인할 필요가 있다).

이 대목의 So-What은 전력시장 참여자 모두에게 향한다. 데이터센터 사업자에게 '입지 선택'은 더 이상 부지·통신 인프라만의 문제가 아니라 계통 접속 가능성과 정부 평가를 통과하느냐의 문제가 됐다. 한전과 전력거래소(KPX) 입장에서는 송배전 투자 우선순위를 어디에 둘지가 곧 국가 AI 경쟁력과 직결되는 사안이 됐다. 입지가 곧 정책 변수이자 비용 변수가 된 것이다.

## 지방 분산과 분산에너지 특구 — 전력시장 개편과 맞물린다

세 번째 흐름은 '분산'이다. 수도권 인입이 막히면서 전기요금 할인·세제 혜택·보조금 등 데이터센터의 지방 이전 인센티브 논의가 본격화하고 있다. 송전망에 여유가 있는 곳으로 대규모 부하를 옮기는 것이 가장 현실적인 해법이라는 공감대가 형성되는 모습이다.

여기서 전력시장 개편 흐름과의 연결고리가 생긴다. 2025년 11월 정부는 제주·전남·부산·경기 4곳을 분산에너지 특화지역(분산특구)으로 지정했다(울산·충남·경북 등은 추가 검토). 분산특구는 원거리 송전 대신 지역에서 생산한 전기를 지역에서 쓰는 '지산지소형' 모델을 지향하며, 전기사업법상 발전·판매 겸업 금지의 예외를 적용해 발전사업자와 사용자 간 직접거래(P2P)와 새로운 요금제 실증을 허용한다. 대규모 상시 부하인 데이터센터는 이런 지역 직접거래·맞춤 요금제의 유력한 수요처가 될 수 있다.

다만 균형 있게 볼 점도 있다. 지방 분산이 만능은 아니다. 지방 역시 신규 송전 보강과 변전소 확보가 필요하고, 데이터센터 운영사는 지연(latency)·인력·금융 인프라가 수도권에 있다는 이유로 이전을 주저한다. 인센티브 규모와 계통 보강 속도가 맞물리지 않으면 '신청만 분산되고 실제 건설은 안 되는' 공회전이 생길 수 있다. 결국 데이터센터 전력 문제는 발전·송배전·요금제·입지정책이 한 묶음으로 움직여야 풀리는 시스템 과제다.

![a bunch of blue wires connected to each other](https://images.unsplash.com/photo-1683322499436-f4383dd59f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxkYXRhJTIwY2VudGVyJTIwc2VydmVyJTIwcG93ZXJ8ZW58MXwwfHx8MTc4MjU5NTg4NXww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Scott Rodgerson](https://unsplash.com/@scottrodgerson?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-bunch-of-blue-wires-connected-to-each-other-PSpf_XgOM5w?utm_source=spice-bandit-blog&utm_medium=referral)*

## 정리: 발전이 아니라 '연결'의 시대

데이터센터 전력수요 급증이 전력시장에 보내는 신호는 '전기가 부족하다'가 아니라 '필요한 곳에 제때 연결하기 어렵다'에 가깝다. 신청 8배 증가, 수도권 67% 쏠림, 계통영향평가를 통한 입지 규제, 분산특구를 통한 지역 직접거래 실증 — 이 네 가지는 모두 같은 곳을 가리킨다. 앞으로 전력시장의 핵심 경쟁력은 '얼마나 많이 발전하느냐'보다 '어디에 어떤 조건으로 연결하느냐'에서 갈린다. 데이터센터는 그 변화를 가장 먼저, 가장 크게 시험하는 부하다.

---

### 참고 자료(1차 자료 우선 확인 권장)
- 산업통상자원부 전력계통영향평가 제도 및 운영기준(2024년 8월 시행) — 정부 보도자료·고시
- 한국전력공사(KEPCO) 데이터센터 전기사용 신청 통계
- 에너지경제연구원(KEEI) 「AI 시대 데이터센터 증가의 국내 에너지 소비 시사점」(기본연구 25-09)
- 분산에너지 특화지역 지정(2025년 11월) — 산업통상자원부 보도자료, 대한민국 정책브리핑
- 전기신문·파이낸셜뉴스·전기저널 등 보도(2026)

> ※ 본 글의 수치는 공개 보도·연구자료를 바탕으로 정리한 것으로, 신청·통과 건수 등 일부 수치는 인용 시점·출처에 따라 차이가 있을 수 있습니다. 정확한 값은 정부·한전·KPX 공식 집계로 확인하시기 바랍니다.
