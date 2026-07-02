---
title: "나트륨이온 배터리 — 리튬 대체가 아니라 '제2 표준'이다"
description: "나트륨이온 배터리는 리튬의 대체재가 아니라 저가 ESS·이륜차·보급형 EV부터 침투하는 보완재입니다. CATL Naxtra 175Wh/kg 양산, 셀 원가 $59/kWh, -40°C 저온 성능까지 2026년 최신 수치로 정리했습니다."
pubDate: 2026-07-03T08:30:00+09:00
category: energy
tags: ["나트륨이온 배터리", "ESS", "배터리 트렌드", "CATL"]
---

![sodium-ion battery cells](https://images.unsplash.com/photo-1722289016701-7661d52f38c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxzb2RpdW0lMjBpb24lMjBiYXR0ZXJ5JTIwZW5lcmd5JTIwc3RvcmFnZXxlbnwxfDB8fHwxNzgzMDAwMTU4fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Igor Omilaev](https://unsplash.com/@omilaev?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-bunch-of-black-and-white-objects-with-a-green-arrow-above-them-73taIS3YeNQ?utm_source=spice-bandit-blog&utm_medium=referral)*

**나트륨이온 배터리**를 둘러싼 가장 흔한 오해는 "리튬이온을 대체할 차세대 배터리"라는 것이다. 결론부터 말하면 틀렸다. 나트륨이온의 실제 위치는 **리튬의 대체재가 아니라 보완재**, 정확히는 **LFP(리튬인산철) 아래쪽에 새로 열리는 '초저가·저온·안전' 시장의 제2 표준 후보**다. 2026년 현재 나트륨이온은 전 세계 배터리 생산량의 **1% 미만**(우드매켄지)에 불과하지만, CATL이 에너지밀도 **175Wh/kg**의 나트륨이온 배터리 'Naxtra'로 올해 스왑·승용·상용·ESS 4개 분야 대규모 적용을 공식화했고, CATL·창안이 '세계 첫 양산 나트륨 승용차'로 내세우는 Nevo A06가 올해 중반 중국 시장에 나온다. 즉 **2026년은 나트륨이온의 '양산 원년'**이다. 이 글은 원리부터 원가·양산·적용처·한계까지, 확인된 숫자만으로 나트륨이온의 실제 위치를 짚는다. 어제 다룬 [LFP vs 전고체 — ESS 배터리는 무엇이 표준인가](/blog/2026-07-02-ess-battery-lfp-solid-state-trend/)에서 '다크호스'로 한 단락만 언급했던 그 주인공을, 오늘은 본편으로 다룬다.

## 원리 — 리튬이온과 무엇이 같고, 무엇이 다른가

나트륨이온 배터리의 작동 원리는 리튬이온과 **사실상 같다**. 충전하면 양극의 이온이 음극으로 이동해 저장되고, 방전하면 반대로 돌아오는 '흔들의자(rocking chair)' 방식이다. 다른 점은 그 이온이 리튬(Li⁺)이 아니라 **나트륨(Na⁺)**이라는 것뿐이다. 그런데 이 한 가지 차이가 소재·원가·성능 전반을 바꾼다.

- **이온이 크고 무겁다**: 나트륨의 원자량은 약 23으로 리튬(약 6.9)의 3배가 넘는다. 같은 부피·무게에 담을 수 있는 에너지가 적을 수밖에 없어, **에너지밀도에서 구조적으로 불리**하다.
- **음극이 흑연이 아니라 하드카본**: 나트륨 이온은 커서 리튬이온 배터리의 표준 음극인 흑연 층 사이에 잘 들어가지 못한다. 그래서 층 간격이 넓은 **하드카본**을 쓴다. 하드카본 공급망이 아직 작다는 점이 뒤에서 다룰 한계로 이어진다.
- **집전체가 양쪽 모두 알루미늄**: 리튬이온은 음극 집전체에 비싼 **구리**를 써야 하지만(알루미늄은 리튬과 합금화되어 못 씀), 나트륨은 알루미늄과 반응하지 않아 **양극·음극 모두 값싼 알루미늄**을 쓴다. 원가가 내려갈 뿐 아니라, **0V까지 완전 방전한 상태로 운송·보관이 가능**해 물류 안전성이 획기적으로 좋아진다.
- **저온에 강하다**: 전해질 특성상 영하의 저온에서 이온 전도도 저하가 리튬 대비 완만하다. CATL은 Naxtra의 작동 범위를 **-40°C~+70°C**로 제시했다.

핵심 특성을 표로 비교하면 이렇다.

| 구분 | 나트륨이온(Na-ion) | LFP(리튬인산철) | NCM(삼원계) |
|---|---|---|---|
| 에너지밀도(셀) | 120~160Wh/kg, 최상급 **175Wh/kg**(CATL Naxtra) | 90~160Wh/kg | 150~250Wh/kg |
| 셀 원가(2025년 평균) | **$59/kWh** | **$52/kWh** | LFP보다 높음 |
| 저온 성능 | **매우 강함**(-40°C 작동, 이륜차용 셀 -20°C 용량유지 92%) | 약함(저온 출력 저하) | 보통 |
| 수명(사이클) | 상용 셀 1,500회 수준~개발 목표 10,000회 | 3,000~5,000회(ESS용 10,000회급도 등장) | 1,000~2,000회급 |
| 안전성 | 높음(열폭주 저항, 0V 방전 운송 가능) | 높음 | 상대적 낮음 |
| 원료 | 나트륨(소금·소다회) — 지각에 풍부, 편재 없음 | 리튬 필요 | 리튬+니켈·코발트 |
| 상용화 단계 | **2026년 양산 원년** | 성숙(ESS 표준) | 성숙 |

*출처: Wood Mackenzie(2025-11), CATL 발표(2025-04), electrive·carnewschina 보도. 수치는 셀 사양·제조사·시점에 따라 달라지는 범위값.*

<figure style="margin:1.5rem 0;">
<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="나트륨이온·LFP·NCM 에너지밀도 범위 비교 그래프" style="width:100%;height:auto;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#fafafa;border:1px solid #eee;border-radius:8px;">
  <text x="24" y="34" font-size="17" font-weight="700" fill="#111">에너지밀도 비교 — 높을수록 유리 (Wh/kg, 셀 기준)</text>
  <!-- 차트영역 x:170~690 (520px), 0~260Wh/kg → 2px/Wh -->
  <line x1="170" y1="60" x2="170" y2="210" stroke="#ccc" stroke-width="1"/>
  <line x1="170" y1="210" x2="690" y2="210" stroke="#ccc" stroke-width="1"/>
  <g font-size="11" fill="#999" text-anchor="middle">
    <text x="170" y="228">0</text><text x="300" y="228">65</text><text x="430" y="228">130</text><text x="560" y="228">195</text><text x="690" y="228">260</text>
  </g>
  <!-- Na-ion 120~175 → x 410~520 -->
  <text x="160" y="84" font-size="13" fill="#333" text-anchor="end" font-weight="700">나트륨이온</text>
  <rect x="410" y="70" width="110" height="24" rx="3" fill="#2563eb"/>
  <text x="528" y="87" font-size="12" fill="#2563eb" font-weight="700">120~175</text>
  <!-- LFP 90~160 → x 350~490 -->
  <text x="160" y="134" font-size="13" fill="#333" text-anchor="end">LFP</text>
  <rect x="350" y="120" width="140" height="24" rx="3" fill="#9ca3af"/>
  <text x="498" y="137" font-size="12" fill="#6b7280">90~160</text>
  <!-- NCM 150~250 → x 470~670 -->
  <text x="160" y="184" font-size="13" fill="#333" text-anchor="end">NCM(삼원계)</text>
  <rect x="470" y="170" width="200" height="24" rx="3" fill="#d1d5db"/>
  <text x="560" y="187" font-size="12" fill="#6b7280" font-weight="700">150~250</text>
</svg>
<figcaption style="font-size:12px;color:#888;text-align:center;margin-top:4px;">나트륨이온 최상급(CATL Naxtra 175Wh/kg)은 이미 LFP 상단을 넘본다. 다만 범용 셀은 아직 120~160Wh/kg대다.</figcaption>
</figure>

주목할 부분은 에너지밀도의 '역전 조짐'이다. 몇 년 전까지 나트륨이온은 100~120Wh/kg대로 LFP에 한참 못 미쳤지만, CATL Naxtra가 **175Wh/kg**을 달성하면서 **범용 LFP와 겹치는 구간**까지 올라왔다. "밀도가 낮아서 못 쓴다"는 반론이 절대적이지 않게 된 것 — 이것이 2026년 나트륨이온을 다시 봐야 하는 첫 번째 이유다.

## 왜 지금 주목받나 — 원자재의 정치학과 가격의 수렴

나트륨이온이 주목받는 근본 이유는 성능이 아니라 **원자재**다.

**첫째, 나트륨은 사실상 무한하다.** 나트륨은 지각과 바닷물에 풍부한 원소로, 소금(염화나트륨)과 소다회에서 바로 얻는다. 지각 존재비 기준으로 리튬보다 수백 배 흔하고, 무엇보다 **특정 국가에 매장이 편중되지 않는다**. 리튬이 '남미 삼각지대·호주·중국 정제'라는 지정학 리스크를 안고 있는 것과 대조적이다. 2022년 탄산리튬 가격이 톤당 60만 위안 근처까지 폭등했다가 이후 10분의 1 수준으로 폭락한 롤러코스터를 겪은 배터리 업계에, "리튬 가격과 무관한 화학"은 그 자체로 보험이다.

**둘째, 구리가 필요 없다.** 앞서 본 대로 음극 집전체까지 알루미늄을 쓰므로, 배터리 원가에서 무시 못 할 구리 비용이 빠진다. 전력망·AI 데이터센터 붐으로 구리 수요가 구조적으로 늘어나는 국면에서 이 차이는 시간이 갈수록 벌어진다.

**셋째, 가격이 실제로 수렴하고 있다.** 우드매켄지는 2025년 11월 분석에서 평균 셀 원가를 **LFP $52/kWh, 나트륨이온 $59/kWh**로 추정했다. 아직 나트륨이 13%가량 비싸지만, 하락 기울기는 나트륨 쪽이 더 가파르며 **2035년경 파리티(가격 동등)**에 도달할 것으로 봤다. 학계는 더 낙관적이다. 핀란드 LUT대·독일 카를스루에공대(KIT) 공동 연구(에너지저장저널 게재)는 나트륨이온 셀이 "이미 리튬이온과 원가 파리티에 근접했다"며, 학습곡선이 유지되면 2050년 저장 균등화비용(LCOS)에서 나트륨이온(11~14유로/MWh)이 리튬이온(16~22유로/MWh)을 앞선다고 전망했다.

<figure style="margin:1.5rem 0;">
<svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="2025년 나트륨이온과 LFP 셀 원가 비교 그래프" style="width:100%;height:auto;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#fafafa;border:1px solid #eee;border-radius:8px;">
  <text x="24" y="34" font-size="17" font-weight="700" fill="#111">셀 원가 비교 — 낮을수록 유리 ($/kWh, 2025년 평균 추정)</text>
  <!-- 차트영역 x:170~690 (520px), 0~80$/kWh → 6.5px/$ -->
  <line x1="170" y1="60" x2="170" y2="170" stroke="#ccc" stroke-width="1"/>
  <line x1="170" y1="170" x2="690" y2="170" stroke="#ccc" stroke-width="1"/>
  <g font-size="11" fill="#999" text-anchor="middle">
    <text x="170" y="188">0</text><text x="300" y="188">20</text><text x="430" y="188">40</text><text x="560" y="188">60</text><text x="690" y="188">80</text>
  </g>
  <!-- LFP 52 → width 338 -->
  <text x="160" y="84" font-size="13" fill="#333" text-anchor="end">LFP</text>
  <rect x="170" y="70" width="338" height="26" rx="3" fill="#9ca3af"/>
  <text x="516" y="88" font-size="12" fill="#6b7280" font-weight="700">$52</text>
  <!-- Na-ion 59 → width 383.5 -->
  <text x="160" y="134" font-size="13" fill="#333" text-anchor="end" font-weight="700">나트륨이온</text>
  <rect x="170" y="120" width="384" height="26" rx="3" fill="#2563eb"/>
  <text x="562" y="138" font-size="12" fill="#2563eb" font-weight="700">$59 (격차 13%)</text>
</svg>
<figcaption style="font-size:12px;color:#888;text-align:center;margin-top:4px;">우드매켄지 2025년 평균 추정. 아직 나트륨이 비싸지만 하락 기울기가 더 가팔라 2035년경 파리티 전망이다.</figcaption>
</figure>

여기서 So What을 하나 짚자. **나트륨이온의 경제성은 '나트륨이 싸다'가 아니라 '리튬이 언제 다시 비싸지느냐'에 달려 있다.** 원료(소금)는 셀 원가의 극히 일부라, 규모의 경제가 붙기 전까지는 리튬이온보다 비싸다. 반대로 리튬 가격이 재차 급등하는 순간 나트륨의 원가 우위는 즉시 벌어진다. 즉 나트륨이온 투자는 배터리 업계가 **리튬 가격 변동성에 거는 헤지(hedge)**로 읽는 것이 정확하다.

## 양산 현황 — CATL·BYD가 열고, 한국이 뒤쫓는다

공개된 정보 기준으로 양산 지형을 정리하면, 중국이 압도적으로 앞서 있다.

**CATL — 'Naxtra'로 본격 양산.** CATL은 2025년 4월 나트륨이온 브랜드 Naxtra를 발표했다. 승용차용 셀은 에너지밀도 **175Wh/kg**(나트륨이온 양산품 기준 최고 수준), 작동온도 **-40°C~+70°C**, -40°C 극저온에서도 사용 가능 용량의 90%를 유지한다고 밝혔다. 이어 2025년 12월에는 **2026년에 배터리 교환(스왑)·승용차·상용차·에너지저장(ESS) 4개 분야에서 대규모 적용**에 들어간다고 공식화했다. 다만 대규모 공급 시점은 고정된 일정이 아니라 고객사 롤아웃 일정에 맞춰 진행한다고 밝혔다. 실제로 2026년 2월 창안자동차와 함께 **'세계 첫 나트륨이온 양산 승용차'를 표방하는 'Nevo A06'**을 공개했고(주행거리 400km 이상, 2026년 중반 출시), 이보다 앞서 2024년 1월에는 하이나(HiNa)배터리 셀을 얹은 JAC 이웨이 소형차가 '첫 나트륨 EV' 타이틀을 가져간 바 있다.

**BYD — 이륜차·ESS 양동 작전.** BYD는 2024년 1월 장쑤성 쉬저우에 **연산 30GWh 규모 나트륨이온 전용 공장**(투자 100억 위안, 약 14억 달러)을 착공했다. 파트너가 전기 이륜·삼륜차 제조사 화이하이(Huaihai)라는 점이 시사적이다 — 첫 타깃이 승용차가 아니라 **마이크로 모빌리티**라는 뜻이다. ESS 쪽에서는 2024년 12월 블레이드 폼팩터 기반 나트륨이온 ESS 제품 **'MC Cube-SIB'(유닛당 2.3MWh)**를 내놨고, 2026년 2월에는 **1만 사이클을 달성했다고 주장하는 3세대 나트륨이온 플랫폼**을 공개했다(양산 시점은 미정).

**한국 — '2026년 상용화 기틀' 단계.** LG에너지솔루션은 대전 연구소에서 R&D, 오창에서 초기 시제품(샘플 A)을 만들고, 나트륨 소재 공급망이 갖춰진 **중국 난징 공장에 파일럿 라인을 구축해 양산 직전 단계(샘플 B·C) 검증**을 진행하는 전략을 공개했다. 타깃은 보급형 EV·상용차·ESS용 초저가 라인업이다. 인터배터리 2026에서는 배터리 3사 중 처음으로 나트륨이온 셀을 전시했고, 소재 쪽에서는 에코프로비엠이 나트륨이온 양극재로 중국과의 차별화를 공언했다. 다만 국내 언론이 지적하듯 **기술·가격 경쟁력 모두 중국과 격차가 있고, 상용화도 LG에너지솔루션의 2027년 1세대 양산 목표 등 이제 일정이 잡히는** 단계라 "추격 초입"으로 보는 게 정직하다.

숫자로 보면 냉정해진다. 나트륨이온은 아직 **글로벌 배터리 생산의 1% 미만**이고, 실질 양산 캐파·수주는 중국에 몰려 있다. 그러나 방향은 분명하다 — 2024년이 '실증', 2025년이 '제품 발표'의 해였다면, **2026년은 스왑·승용차·상용차·ESS 네 갈래에서 동시에 상업 적용이 시작되는 해**다.

## 적용처별 전망 — 어디부터 침투하나

나트륨이온의 침투 순서는 "에너지밀도 요구가 낮고, 가격·저온·안전에 민감한 곳부터"라는 한 문장으로 예측할 수 있다. 순서대로 보자.

**1순위: 전기 이륜차·배터리 스왑 (이미 진행 중).** 세계 최대 전기 이륜차 업체 야디아(Yadea)는 2025년 1월 **나트륨이온 스쿠터 4종을 3,299~4,299위안(약 450~590달러)**에 출시했다. 탑재 셀은 145Wh/kg, 상온 1,500사이클, **-20°C에서 용량유지율 92%**, 15분 만에 80% 충전. 여기에 배터리 교환(스왑) 인프라 사업도 병행하고 있다. 이륜차는 주행거리 부담이 작아 밀도 열세가 문제되지 않고, 겨울철 배달 기사의 저온 성능 불만을 정확히 해결한다. **나트륨이온의 '아이폰 이전 스마트폰' 시장**이 여기다.

**2순위: ESS (초기 상업화, 단 LFP 벽이 높다).** BYD MC Cube-SIB 같은 제품이 나왔고, 미국에서는 피크에너지(Peak Energy)가 **4.75GWh 나트륨이온 공급 계약**(1차 배치 720MWh — 발표 기준 최대 규모 단일 나트륨 ESS)을 따내는 등 '탈(脫)리튬 공급망' 수요가 붙고 있다. 다만 [앞선 글](/blog/2026-07-02-ess-battery-lfp-solid-state-trend/)에서 본 대로 ESS는 kWh당 원가와 사이클 수명이 전부인 시장인데, 현재 나트륨이온은 원가($59 vs $52)와 수명 모두에서 LFP에 밀린다. ESS 침투는 **저온 지역(북미 북부·북유럽·내륙 고지대)과 공급망 다변화 수요**라는 틈새에서 시작해, 파리티 시점에 본류로 확산되는 경로가 유력하다.

**3순위: 보급형 EV (2026년 개막, 검증은 이제부터).** 창안 Nevo A06이 시장 테스트의 첫 사례다. 175Wh/kg이면 400km급 보급형 세단이 가능하다는 걸 보여줬지만, 소비자가 같은 값이면 검증된 LFP 대신 나트륨을 고를 이유는 아직 '저온 성능'뿐이다. 중국 동북부·러시아·북유럽처럼 **겨울이 혹독한 시장의 엔트리 EV**가 교두보가 될 것이다.

정리하면 침투 경로는 **이륜차·스왑 → 저온·틈새 ESS → 한랭지 보급형 EV** 순이고, 프리미엄 EV는 나트륨이온의 시장이 애초에 아니다. 그 자리는 전고체가 노린다.

## 한계와 반론 — 세 개의 벽

낙관 시나리오만 쓰면 반쪽짜리 글이다. 나트륨이온 앞에는 뚜렷한 벽이 세 개 있다.

**첫째, 에너지밀도의 물리적 상한.** 175Wh/kg는 인상적이지만, 나트륨의 원자량·전위 특성상 삼원계(250Wh/kg급)를 따라잡을 화학적 경로가 현재로선 없다. 나트륨이온은 구조적으로 '아래쪽 시장'의 화학이며, 이는 극복 대상이 아니라 **전제 조건**으로 받아들여야 한다.

**둘째, 사이클 수명과 효율의 검증 부족.** ESS 업계의 시선은 차갑다. 중국 셀 업체 REPT의 임원은 BYD의 나트륨 ESS 발표에 대해 **"나트륨이온은 LFP의 5~7년 전 수준"**이라며 사이클 수명·왕복효율(RTE)이 아직 게임이 안 된다고 평가했다. 실제 ESS용 LFP가 1만 사이클·20년 수명을 광고하는 동안, 상용 나트륨 셀 다수는 수천 사이클 초반대에 머문다. BYD의 '1만 사이클 3세대'도 아직 **자체 주장**이지 검증된 양산 제품이 아니다.

**셋째, 공급망의 역설.** 나트륨 원료는 어디에나 있지만, **하드카본 음극·전해질·셀 양산 캐파는 중국에 집중**돼 있다. "리튬 지정학에서 벗어나려고 나트륨을 택했더니 결국 중국산"이라는 역설이 당분간 유효하다. 그리고 가장 근본적인 반론 — **리튬이 계속 싸면 나트륨의 존재 이유가 흐려진다.** 우드매켄지의 파리티 전망이 2035년으로 보수적인 이유도 리튬 저가 국면이 길어질 가능성 때문이다. 나트륨이온의 성패는 자기 기술만큼이나 '경쟁자(리튬)의 가격'이라는 외생변수에 달려 있다.

## So What — '리튬 킬러'가 아니라 포트폴리오다

이 글의 결론은 하나다. **나트륨이온 배터리는 리튬을 죽이러 온 기술이 아니라, 배터리 산업이 리튬 가격 변동성과 지정학 리스크에 대비해 쌓는 두 번째 기둥이다.**

- **단기(지금~2027)**: 이륜차·배터리 스왑·한랭지 틈새에서 상업화가 실제 진행된다. ESS와 보급형 EV는 '첫 상업 사례'가 나오는 단계다. 시장점유율 숫자(1% 미만)에 실망할 때가 아니라, 침투 경로가 맞게 가는지를 볼 때다.
- **중기(2028~2035)**: 우드매켄지 기준 LFP와의 원가 파리티가 가시권에 든다. 파리티가 오면 '원가가 왕'인 ESS 시장에서 LFP·나트륨 이원 체제가 현실이 된다.
- **한국 관점**: LG에너지솔루션·에코프로비엠 등이 추격을 시작했지만 격차는 분명하다. 관전 포인트는 셀보다 **하드카본·양극재 등 소재 공급망의 탈중국 수요**를 한국이 가져갈 수 있느냐다. (이는 기술·시장 동향 해설이며, 특정 종목에 대한 투자 조언이 아니다.)

LFP가 "무게보다 안전·수명·원가"라는 ESS의 규칙을 증명했다면, 나트륨이온은 그 규칙의 다음 문장을 쓰고 있다 — **"원가의 바닥은 화학을 바꿔야 뚫린다."** 2026년 말 CATL의 풀 양산과 창안 A06의 실판매 성적표가 나오면, 이 문장이 참인지 거짓인지 첫 채점 결과를 보게 될 것이다.

---

**출처**

- CATL, "Naxtra Battery Breakthrough & Dual-Power Architecture" (2025-04): [catl.com/en/news/6401.html](https://www.catl.com/en/news/6401.html)
- CATL, "CATL and CHANGAN Launch World's First Mass-Production Sodium-Ion Passenger Vehicle" (2026-02): [catl.com/en/news/6720.html](https://www.catl.com/en/news/6720.html)
- CarNewsChina, "CATL confirms 2026 large-scale sodium-ion battery deployment in multiple sectors" (2025-12-28): [carnewschina.com](https://carnewschina.com/2025/12/28/catl-confirms-2026-large-scale-sodium-ion-battery-deployment-in-multiple-sectors/)
- Wood Mackenzie, "Sodium-ion batteries enter energy storage market" (2025-11-24): [woodmac.com](https://www.woodmac.com/blogs/energy-pulse/sodium-ion-batteries-enter-energy-storage-market/)
- Energy-Storage.news, "Industry reacts to BYD's sodium-ion BESS news" (2024-12): [energy-storage.news](https://www.energy-storage.news/sodium-ion-battery-storage-technology-dominance-industry-reacts-byd-bess-launch/)
- CarNewsChina, "BYD starts construction of 30 GWh sodium-ion battery plant in China" (2024-01-05): [carnewschina.com](https://carnewschina.com/2024/01/05/byd-starts-construction-of-30-gwh-sodium-ion-battery-plant-in-china/)
- electrive, "Yadea starts integrating sodium-ion batteries in electric scooters" (2025-01-09): [electrive.com](https://www.electrive.com/2025/01/09/yadea-starts-integrating-sodium-ion-batteries-in-electric-scooters/)
- 녹색경제신문, "나트륨이온 배터리, 에코프로·LG엔솔 개발 속도 내지만…" : [greened.kr](https://www.greened.kr/news/articleView.html?idxno=324317)
- 글로벌이코노믹, "LG에너지솔루션, 中 난징에 '나트륨 배터리' 라인 구축" (2026-01): [g-enews.com](https://www.g-enews.com/article/Global-Biz/2026/01/2026012107505562350c8c1c064d_1)

*이 글은 공개된 기술·시장 자료와 언론 보도를 바탕으로 한 정보 정리이며, 투자 조언이 아닙니다. 특정 종목의 매수·매도를 권유하지 않습니다. 에너지밀도·원가·수명 수치는 셀 사양·제조사·시점에 따라 달라질 수 있습니다.*
