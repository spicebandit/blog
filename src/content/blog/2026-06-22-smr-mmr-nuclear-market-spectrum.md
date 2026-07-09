---
title: "SMR은 하나가 아니다 — 300MW~5MW 3계층 시장 해부"
description: "소형 원전은 단일 제품이 아니다. 유틸리티 대체용 대형 SMR부터 데이터센터용 중형, 오지 디젤을 대체하는 마이크로리액터까지 — 3계층 시장과 주요 플레이어를 한눈에 정리했다."
pubDate: 2026-06-22T10:00:00+09:00
category: energy
tags: ["SMR", "원전", "소형원전", "마이크로리액터", "에너지전환"]
draft: false
---

"소형 원전"이라고 하면 하나의 기술을 떠올리기 쉽다. 그런데 실제로 SMR(Small Modular Reactor) 시장을 들여다보면 300MW짜리 대형 SMR과 5MW짜리 마이크로리액터가 같은 이름 아래 묶여 있다. 두 제품은 고객도, 비교 대상도, 경쟁 논리도 전혀 다르다. SMR 투자 붐 속에서 "어느 회사가 이길까"를 논하기 전에, **어느 시장에서 싸우는지**를 먼저 이해해야 한다.

![white concrete building under white clouds during daytime](https://images.unsplash.com/photo-1630142896875-d71a6ee6db03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMG1vZHVsYXIlMjByZWFjdG9yJTIwbnVjbGVhciUyMHBvd2VyJTIwcGxhbnR8ZW58MXwwfHx8MTc4MjEzNDY5Nnww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Lukáš Lehotský](https://unsplash.com/@llehotsky?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/white-concrete-building-under-white-clouds-during-daytime-ixcHGhae2mg?utm_source=spice-bandit-blog&utm_medium=referral)*

## 왜 지금 SMR/MMR인가

SMR 논의가 가속화된 직접적 계기는 두 가지다. 하나는 **AI 데이터센터 전력 폭증**이다. 마이크로소프트·아마존·구글 등 빅테크는 2025년 이후 SMR 10GW 이상 구매 의향을 공개적으로 표명했다. 기존 전력망만으로는 AI 인프라의 전력 수요를 감당하기 어렵다는 판단에서다.

다른 하나는 **탄소중립 목표와 에너지 안보**의 충돌이다. 재생에너지만으로는 24시간 안정적인 전력 공급이 어렵고, 대형 원전은 건설에 10~20년이 걸린다. SMR은 그 사이를 메우는 현실적 대안으로 떠올랐다.

그러나 '소형 원전'이라는 단어 하나로 뭉뚱그리면 중요한 차이가 사라진다. 시장은 크게 세 계층으로 나뉜다.

<figure style="margin:1.5rem 0;">
<svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SMR 3계층 출력 규모 스펙트럼 범위 막대 차트, 단위 메가와트" style="width:100%;height:auto;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;">
<text x="24" y="34" font-size="17" font-weight="700" fill="#23201D">SMR 3계층 출력 스펙트럼 — 단위: MWe</text>
<text x="24" y="56" font-size="12" fill="#8A8378">참고: 기존 대형 원전은 1,000+ MWe (축 범위 밖)</text>
<line x1="330" y1="68" x2="330" y2="194" stroke="#E5DECF"/>
<line x1="510" y1="68" x2="510" y2="194" stroke="#E5DECF"/>
<line x1="690" y1="68" x2="690" y2="194" stroke="#E5DECF"/>
<text x="140" y="96" text-anchor="end" font-size="13" fill="#23201D">1계층 유틸리티</text>
<rect x="330" y="80" width="360" height="24" rx="3" fill="#C8102E"/>
<text x="682" y="96" text-anchor="end" font-size="12" font-weight="700" fill="#FAF6EE">100~300 MWe</text>
<text x="140" y="136" text-anchor="end" font-size="13" fill="#23201D">2계층 데이터센터</text>
<rect x="186" y="120" width="144" height="24" rx="3" fill="#C8102E"/>
<text x="336" y="136" font-size="12" font-weight="700" fill="#C8102E">20~100 MWe</text>
<text x="140" y="176" text-anchor="end" font-size="13" fill="#23201D">3계층 MMR</text>
<rect x="152" y="160" width="34" height="24" rx="3" fill="#C8102E"/>
<text x="192" y="176" font-size="12" font-weight="700" fill="#C8102E">1~20 MWe</text>
<line x1="150" y1="194" x2="690" y2="194" stroke="#8A8378"/>
<line x1="150" y1="68" x2="150" y2="194" stroke="#8A8378"/>
<text x="150" y="212" text-anchor="middle" font-size="11" fill="#8A8378">0</text>
<text x="330" y="212" text-anchor="middle" font-size="11" fill="#8A8378">100</text>
<text x="510" y="212" text-anchor="middle" font-size="11" fill="#8A8378">200</text>
<text x="690" y="212" text-anchor="middle" font-size="11" fill="#8A8378">300</text>
</svg>
<figcaption style="font-size:12px;color:#8A8378;text-align:center;margin-top:4px;">같은 'SMR' 이름 아래 출력 규모가 전혀 다른 세 개의 시장이 묶여 있다.</figcaption>
</figure>

---

## 1계층: 유틸리티 SMR (100~300 MWe) — 전력망을 위한 소형 원전

**목적**: 노후 석탄·가스 발전소 대체, 국가 전력망 기저전력 공급

이 계층은 기존 대형 원전(1,000+ MWe)의 작은 버전이다. 설계 방식도 대부분 기존 원전(PWR·BWR)과 같아 규제 경험이 풍부하다. 공장에서 모듈로 제작한 뒤 현장에서 조립하기 때문에 건설 기간을 5~7년에서 3~4년으로 줄이는 것이 핵심 강점이다.

**주요 플레이어**

| 회사 | 제품 | 용량 | 특징 |
|------|------|------|------|
| GE Vernova | BWRX-300 | 300 MWe | 캐나다 Darlington 2029년 착공 목표, 가장 상용화 근접 |
| TerraPower | Natrium | 345 MWe | 나트륨 냉각 고속로, 빌 게이츠 투자, MS 데이터센터 전략 |
| 한수원 (한국) | i-SMR | ~170 MWe | 2028년 표준설계인가 목표, K-ARDP 2.5조 원 투입 |
| 한국원자력연구원 | SMART | 100 MWe | 이미 설계인가 보유, 중동·동남아 수출 타깃 |

**비용 구조**
- 자본비(CAPEX): 약 $4,000~6,000/kW (첫 호기 기준)
- LCOE 목표: BWRX-300 **$60/MWh**, NuScale VOYGR **$51~54/MWh** (설계사 발표)
- *현실 체크*: 독립 연구기관 추정치는 NOAK(양산) 기준에서도 **$80~120/MWh**. 설계사 목표와 30~50% 괴리가 있다.

**장점**: 안정적 대용량 기저전력, 기존 계통 연계 용이, 규제 경험 풍부  
**단점**: 대형 원전 대비 규모의 경제 불리, FOAK 비용 초과 리스크 (NuScale 아이다호 프로젝트 취소 선례), 부지 승인 수십 년 소요 가능

---

## 2계층: 산업·데이터센터 SMR (20~100 MWe) — AI 시대가 만든 새 시장

**목적**: AI 데이터센터 전력 직결, 원격 산업시설 열·전력 복합 공급

이 계층의 탄생에는 빅테크가 결정적 역할을 했다. 전력망에 기대지 않고 데이터센터 옆에 원전을 세우겠다는 발상이다. 모듈 단위로 증설할 수 있어 초기 투자 부담을 줄이고, 수요에 맞춰 단계적으로 키울 수 있다.

**주요 플레이어**

| 회사 | 제품 | 용량 | 특징 |
|------|------|------|------|
| NuScale | NuPower 모듈 | 77 MWe/모듈 (최대 12개) | PWR 방식, 모듈 단위 판매 유연성, 데이터센터 피벗 중 |
| X-energy | Xe-100 | 80 MWe/모듈 | 고온가스로(HTGR), 750°C 산업 공정열 동시 공급 가능 |
| Oklo | Aurora Powerhouse | 15~75 MWe | 고속로 방식, 소유·운영(Power-as-a-Service) BM, 2027년 INL 상업운전 목표 |

X-energy의 Xe-100은 단순 발전에 그치지 않는다. 고온가스로 방식으로 최고 750°C의 열을 만들어낼 수 있어, 철강·화학·수소 생산처럼 고온 공정이 필요한 산업에도 공급할 수 있다. "전기만 파는 원전"에서 "열도 파는 원전"으로의 진화다.

Oklo는 아예 비즈니스 모델 자체가 다르다. 원자로를 팔지 않고 Oklo가 소유한 채 전력을 장기계약으로 파는 방식이다. 고객 입장에서는 초기 자본 투입 없이 청정 전력을 조달할 수 있다.

**비용 구조**
- LCOE: Oklo 목표 **$40~90/MWh** (용량·운영 효율에 따라 범위 큼)
- 1계층 대비 kW당 단가 10~30% 높음
- 그러나 데이터센터 관점에서는 탄소비용·전력망 불안정 프리미엄을 감안하면 경쟁력 있음

**장점**: 부지 유연성, 빅테크 PPA 직결 가능, 모듈 단위 증설로 리스크 분산, 산업 공정열 복합 활용  
**단점**: 신형 노형(고속로·HTGR)은 규제 승인 불확실성 높음, 소형화에 따른 단가 상승

![a factory with smoke coming out of it's stacks](https://images.unsplash.com/photo-1635412537824-9c4bfc37db90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxzbWFsbCUyMG1vZHVsYXIlMjByZWFjdG9yJTIwbnVjbGVhciUyMHBvd2VyJTIwcGxhbnR8ZW58MXwwfHx8MTc4MjEzNDY5Nnww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Fusun Tut](https://unsplash.com/@fusun0tut?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-factory-with-smoke-coming-out-of-its-stacks-673Ok51r3Xs?utm_source=spice-bandit-blog&utm_medium=referral)*

---

## 3계층: 마이크로리액터 / MMR (1~20 MWe) — 디젤 발전기를 없애라

**목적**: 오지 광산·도서·군 기지에서 디젤 발전 대체, 이동식 전원

이 계층은 경쟁 상대가 전력망이 아니다. 수천 킬로미터 밖에서 연료를 날라야 하는 **디젤 발전기**다. 원격지 디젤 전기는 $200~500/MWh에 달하는데, 여기서는 마이크로리액터도 충분히 경쟁력이 생긴다.

**주요 플레이어**

| 회사 | 제품 | 용량 | 특징 |
|------|------|------|------|
| Oklo | Aurora (소형) | 15 MWe (하한) | 동일 플랫폼 소형화 버전, 군사·오지 타깃 |
| NANO Nuclear | KRONOS | 15 MWe | 마이크로리액터 세그먼트 전문 포지셔닝 |
| USNC | MMR | 5~10 MWe | 용융염·가스냉각, 군사 기지·원격 광산 특화 |
| 한국원자력연구원 | 마이크로원자로 | 수 MWe | 기초 연구 단계, 2030년대 중후반 목표 |

마이크로리액터는 연료 교체 없이 5~20년 운전이 목표다. 기술적으로는 트럭이나 헬기로 운반·재배치할 수 있는 크기까지 겨냥한다. 군사용으로 미 국방부(DoD)가 적극적으로 지원하는 배경이기도 하다.

**비용 구조**
- 자본비: **$5,000~25,000/kW** — 추정 범위가 매우 넓다. 전례가 없기 때문이다.
- LCOE: 원격지 기준 **$100~300/MWh**, 비교 대상은 원격지 디젤($200~500/MWh)
- *핵심 전제*: 이 계층의 "경제성"은 전력망과의 비교가 아니라 **고립된 현장의 대안 비용**과의 비교다

**장점**: 원격지 에너지 자립, CO₂ 없는 청정 전력, 이동·재배치 유연성, 절대 투자액 낮음  
**단점**: kW당 단가 3계층 중 최고, 규제 전례 없음(가장 큰 미지수), 핵 비확산·안전 감시 이슈, 폐기물 처리 미해결

---

## 한국의 포지션 — 이중 배팅 전략

한국은 특이하게도 1계층 수출 전략과 제조 허브 전략을 동시에 가져간다.

**i-SMR + SMART (1계층 수출)**: 한수원 주도로 i-SMR 표준설계인가를 2028년까지 완료하고 수출 시장을 노린다. 이미 설계인가를 보유한 SMART(100 MWe)는 사우디·요르단 등 중동 시장에 먼저 닿는 옵션이다.

**두산에너빌리티 (범용 제조 허브)**: 특정 노형에 묶이지 않는다. TerraPower·NuScale 핵심 기자재를 이미 수주했고, 창원 공장에 SMR 전용 라인을 증설하고 있다(2026~2031년, 8,068억 원). 연간 20기 제작 역량이 목표다. 어느 노형이 이기든 제조는 두산에서 하는 구조를 만드는 것이다.

이 이중 배팅이 왜 합리적인가. SMR 시장에서 어떤 노형이 최종 승자가 될지는 아직 아무도 모른다. 1계층에서 BWRX-300이 앞설 수도 있고, 2계층에서 Oklo가 선점할 수도 있다. 한국의 전략은 "우리 기술로 이긴다"는 단일 배팅 대신, **"누가 이기든 우리 공장을 거친다"**는 플랫폼 전략이다.

![black car parked near white building during daytime](https://images.unsplash.com/photo-1606237553327-3fb422389edc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxzbWFsbCUyMG1vZHVsYXIlMjByZWFjdG9yJTIwbnVjbGVhciUyMHBvd2VyJTIwcGxhbnR8ZW58MXwwfHx8MTc4MjEzNDY5Nnww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Romain Chollet](https://unsplash.com/@romainchllet?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-car-parked-near-white-building-during-daytime-tCVnUKDQuhQ?utm_source=spice-bandit-blog&utm_medium=referral)*

---

## 결론: "어느 게 싸냐"보다 "어디에 파냐"가 진짜 질문

3계층을 비용만으로 비교하면 이런 결론이 나온다. 1계층 LCOE 목표 $44~80/MWh, 2계층 $40~90/MWh, 3계층 $100~300/MWh. 숫자만 보면 3계층은 비싸 보인다.

그런데 이 비교는 의미가 없다. 계층마다 비교 대상이 다르기 때문이다.

- **1계층**은 LNG 복합발전($40~75/MWh), 해상풍력($80~120/MWh)과 경쟁한다.
- **2계층**은 전력망 불안정 리스크와 탄소 프리미엄까지 감수하는 빅테크의 PPA 단가와 경쟁한다.
- **3계층**은 수천 킬로미터 연료 수송 비용이 포함된 원격지 디젤($200~500/MWh)과 경쟁한다.

<figure style="margin:1.5rem 0;">
<svg viewBox="0 0 720 350" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SMR 계층별 LCOE와 경쟁 전원 비교 범위 막대 차트, 단위 달러 퍼 메가와트시" style="width:100%;height:auto;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;">
<text x="24" y="34" font-size="17" font-weight="700" fill="#23201D">계층별 LCOE vs 경쟁 전원 — 단위: $/MWh (낮을수록 유리)</text>
<line x1="258" y1="64" x2="258" y2="314" stroke="#E5DECF"/>
<line x1="366" y1="64" x2="366" y2="314" stroke="#E5DECF"/>
<line x1="474" y1="64" x2="474" y2="314" stroke="#E5DECF"/>
<line x1="582" y1="64" x2="582" y2="314" stroke="#E5DECF"/>
<line x1="690" y1="64" x2="690" y2="314" stroke="#E5DECF"/>
<text x="140" y="96" text-anchor="end" font-size="13" fill="#23201D">1계층 SMR</text>
<rect x="198" y="80" width="39" height="24" rx="3" fill="#C8102E"/>
<text x="243" y="96" font-size="12" font-weight="700" fill="#C8102E">$44~80</text>
<text x="140" y="136" text-anchor="end" font-size="13" fill="#23201D">LNG 복합발전</text>
<rect x="193" y="120" width="38" height="24" rx="3" fill="#8A8378"/>
<text x="237" y="136" font-size="12" fill="#8A8378">$40~75</text>
<text x="140" y="176" text-anchor="end" font-size="13" fill="#23201D">해상풍력</text>
<rect x="236" y="160" width="43" height="24" rx="3" fill="#8A8378"/>
<text x="285" y="176" font-size="12" fill="#8A8378">$80~120</text>
<text x="140" y="216" text-anchor="end" font-size="13" fill="#23201D">2계층 SMR</text>
<rect x="193" y="200" width="54" height="24" rx="3" fill="#C8102E"/>
<text x="253" y="216" font-size="12" font-weight="700" fill="#C8102E">$40~90</text>
<text x="140" y="256" text-anchor="end" font-size="13" fill="#23201D">3계층 MMR</text>
<rect x="258" y="240" width="216" height="24" rx="3" fill="#C8102E"/>
<text x="480" y="256" font-size="12" font-weight="700" fill="#C8102E">$100~300</text>
<text x="140" y="296" text-anchor="end" font-size="13" fill="#23201D">원격지 디젤</text>
<rect x="366" y="280" width="324" height="24" rx="3" fill="#8A8378"/>
<text x="682" y="296" text-anchor="end" font-size="12" font-weight="700" fill="#FAF6EE">$200~500</text>
<line x1="150" y1="314" x2="690" y2="314" stroke="#8A8378"/>
<line x1="150" y1="64" x2="150" y2="314" stroke="#8A8378"/>
<text x="150" y="332" text-anchor="middle" font-size="11" fill="#8A8378">0</text>
<text x="258" y="332" text-anchor="middle" font-size="11" fill="#8A8378">100</text>
<text x="366" y="332" text-anchor="middle" font-size="11" fill="#8A8378">200</text>
<text x="474" y="332" text-anchor="middle" font-size="11" fill="#8A8378">300</text>
<text x="582" y="332" text-anchor="middle" font-size="11" fill="#8A8378">400</text>
<text x="690" y="332" text-anchor="middle" font-size="11" fill="#8A8378">500</text>
</svg>
<figcaption style="font-size:12px;color:#8A8378;text-align:center;margin-top:4px;">계층마다 경쟁 상대가 다르다 — 3계층 MMR은 전력망이 아니라 원격지 디젤($200~500/MWh)과 경쟁한다.</figcaption>
</figure>

SMR/MMR 논의에서 가장 중요한 질문은 "어느 기술이 더 싸냐"가 아니라 **"이 원자로를 누구에게, 어디서 파는가"**다. 그 질문에 명확한 답을 갖고 있는 회사가 이 시장에서 살아남을 것이다.

---

*이 글에서 다룬 비용 데이터는 2026년 상반기 공개 자료 기준이며, FOAK(첫 호기) 비용과 NOAK(양산) 목표 비용 사이의 괴리가 크다. 투자 판단을 위한 자료로는 활용하지 말 것.*
