---
title: "발전사 정산 실무 ① 에너지정산금과 SMP"
description: "발전사 신입사원을 위한 전력시장 정산 실무 매뉴얼 1편. 하루 시장운영 흐름부터 SMP 결정 원리, 에너지정산금 계산까지 예시 발전기로 단계별로 풀었습니다."
pubDate: 2026-06-26T14:00:00+09:00
category: energy
tags: ["전력시장", "정산실무", "SMP", "에너지정산금"]
---

발전사에 입사하면 한 달 안에 반드시 마주치는 질문이 있습니다. "그래서 우리 발전기가 어제 하루 동안 에너지로 얼마를 벌었나요?" 이 글은 그 질문에 신입사원이 직접 숫자를 두드려 답할 수 있게 만드는 것이 목표입니다. 핵심 개념은 딱 두 개, **에너지정산금**과 **SMP(계통한계가격)**입니다. 이 두 가지만 손에 익으면 정산서의 가장 큰 항목 하나를 읽을 수 있습니다.

이 글은 **발전사 정산 실무 매뉴얼 3부작 중 1편**입니다. 1편에서는 매일 정산되는 에너지정산금과 그 단가인 SMP를 다루고, 2편에서 발전기를 보유하고 대기시키는 대가인 용량요금(CP), 3편에서 공기업·석탄에 적용되는 정산조정계수와 실제 정산서 읽는 법을 다룹니다. 1편을 건너뛰면 2·3편이 어려워지니 천천히 따라오세요.

> 본문에 등장하는 모든 단가·SMP·변동비 숫자는 **개념 설명을 위한 예시값이며 실제 시세가 아닙니다.** 실제 SMP와 변동비는 매시간·매일 바뀌고 KPX(전력거래소) 시스템에서 확인해야 합니다.

![a control room with a desk and two chairs](https://images.unsplash.com/photo-1639313521811-fdfb1c040ddb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxwb3dlciUyMHBsYW50JTIwY29udHJvbCUyMHJvb218ZW58MXwwfHx8MTc4MjQ0ODkwNHww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Miha Meglic](https://unsplash.com/@miha_meglic?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-control-room-with-a-desk-and-two-chairs-p7Bfwn_VKRQ?utm_source=spice-bandit-blog&utm_medium=referral)*

## 1. 전력시장의 하루는 이렇게 돌아간다 (CBP 흐름)

우리나라 도매 전력시장은 **CBP(Cost Based Pool, 변동비반영시장)** 방식입니다. 이름이 핵심을 다 말해줍니다. 발전기들이 "내가 부르고 싶은 가격"을 입찰하는 게 아니라, **사전에 검증·등록된 변동비를 기준으로** 거래소가 운영한다는 뜻입니다. 신입사원 입장에서 하루가 어떻게 흘러가는지 네 단계로 끊어 보겠습니다.

| 단계 | 누가 | 무엇을 | 신입사원인 내가 확인할 것 |
| --- | --- | --- | --- |
| ① 변동비 신고 | 발전사 | 발전기별 변동비(연료비 등)를 거래소에 등록 | 우리 발전기의 등록 변동비가 맞게 들어갔는지 |
| ② 가격결정발전계획 | KPX(전력거래소) | 다음날 수요예측 + merit order로 시간대별 급전계획 수립 | 우리 발전기가 어느 시간대에 "들어갈" 계획인지 |
| ③ 실시간 급전지시 | KPX 급전소 | 실제 수요 변화에 맞춰 출력 증감 지시(AGC 등) | 계획 대비 실제로 얼마나 발전하라는 지시가 왔는지 |
| ④ 정산 | KPX | 실제 계량 발전량과 SMP로 정산금 산정 | 우리가 받을 에너지정산금이 얼마인지 |

①에서 신고하는 **변동비**는 연료를 태워 1kWh를 더 만들 때 드는 비용입니다. 이게 시장의 모든 가격을 결정하는 출발점이라 정확성이 생명입니다. ②의 **가격결정발전계획**은 "내일 0시부터 24시까지 각 시간대에 어떤 발전기를 얼마나 돌릴지"를 미리 짠 계획표입니다. ③ 실시간 급전은 날씨·수요가 예측과 달라지므로 계획을 실제 상황에 맞게 보정하는 과정입니다. ④ 정산은 계획이 아니라 **실제로 계량기에 찍힌 발전량**을 기준으로 돈을 정산합니다. 이 네 번째 단계가 이 글의 무대입니다.

> **실무 팁 ① — 가격결정발전계획 ≠ 실시간 급전**
> 신입이 가장 많이 헷갈리는 지점입니다. 가격결정발전계획은 SMP를 정하기 위한 "이론상의 계획"이고, 실시간 급전지시는 실제로 발전소를 돌리라는 "현장 명령"입니다. SMP는 ② 계획 단계에서 정해지지만, 정산금은 ④ 실제 발전량으로 계산됩니다. 계획과 실제가 다를 수 있다는 점을 항상 의식하세요.

## 2. SMP는 어떻게 정해지나 — merit order와 한계발전기

**SMP(System Marginal Price, 계통한계가격)**는 특정 시간대 전력의 도매 단가입니다. 결정 원리는 의외로 단순합니다. KPX는 그 시간대 필요한 전력량(수요)을 채우기 위해 **변동비가 싼 발전기부터 차례로 켭니다.** 이 정렬 순서를 **merit order(경제급전순위)**라고 합니다.

그림으로 상상해 보세요. 변동비가 낮은 원자력·석탄을 맨 왼쪽에 깔고, 그 위에 가스복합을 쌓고, 더 비싼 첨두발전기를 오른쪽 끝에 둔 막대들을 왼쪽부터 차곡차곡 켭니다. 수요선이 어디까지 닿느냐에 따라 **마지막으로 켜진 가장 비싼 발전기**가 결정되고, 바로 그 발전기의 변동비가 그 시간대 SMP가 됩니다. 이 마지막 발전기를 **한계발전기(marginal unit)**라고 부릅니다.

핵심 규칙은 두 가지입니다.

- SMP는 **그 시간 한계발전기의 변동비**로 정해진다.
- 그 시간 발전한 **모든 발전기에 동일한 SMP가 적용**된다. (변동비가 싸든 비싸든 같은 단가를 받습니다.)

그래서 변동비가 SMP보다 낮은 발전기는 **(SMP − 변동비)만큼 마진**을 남깁니다. 예를 들어 어느 시간대에 가스복합이 한계발전기가 되어 SMP가 150원/kWh로 정해지면, 변동비 70원/kWh짜리 석탄발전기는 1kWh당 80원을 남기고, 변동비 120원/kWh짜리 가스복합은 30원을 남깁니다. 같은 시장 가격을 받아도 변동비가 낮은 발전기일수록 마진이 큰 구조입니다.

<figure style="margin:1.5rem 0;">
<svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="예시 SMP 150원과 가스복합 변동비 120원, 석탄 변동비 70원을 비교한 가로 막대 그래프" style="width:100%;height:auto;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#fafafa;border:1px solid #eee;border-radius:8px;">
<text x="24" y="34" font-size="17" font-weight="700" fill="#111">SMP와 발전기 변동비 비교 — 단위: 원/kWh (예시값)</text>
<line x1="150" y1="70" x2="150" y2="196" stroke="#ccc"/>
<line x1="150" y1="196" x2="690" y2="196" stroke="#ccc"/>
<text x="150" y="214" font-size="11" fill="#999" text-anchor="middle">0</text>
<text x="285" y="214" font-size="11" fill="#999" text-anchor="middle">40</text>
<text x="420" y="214" font-size="11" fill="#999" text-anchor="middle">80</text>
<text x="555" y="214" font-size="11" fill="#999" text-anchor="middle">120</text>
<text x="690" y="214" font-size="11" fill="#999" text-anchor="middle">160</text>
<text x="140" y="97" font-size="13" fill="#333" text-anchor="end">SMP</text>
<rect x="150" y="80" width="506" height="24" rx="3" fill="#2563eb"/>
<text x="648" y="97" font-size="12" font-weight="700" fill="#fff" text-anchor="end">150원</text>
<text x="140" y="137" font-size="13" fill="#333" text-anchor="end">가스복합 변동비</text>
<rect x="150" y="120" width="405" height="24" rx="3" fill="#9ca3af"/>
<text x="563" y="137" font-size="12" fill="#6b7280">120원 (마진 30원)</text>
<text x="140" y="177" font-size="13" fill="#333" text-anchor="end">석탄 변동비</text>
<rect x="150" y="160" width="236" height="24" rx="3" fill="#d1d5db"/>
<text x="394" y="177" font-size="12" fill="#6b7280">70원 (마진 80원)</text>
</svg>
<figcaption style="font-size:12px;color:#888;text-align:center;margin-top:4px;">한계발전기(가스복합)의 변동비가 SMP가 되고, SMP와 변동비의 차이가 각 발전기의 마진이 된다 (예시값)</figcaption>
</figure>

![A large control room with lots of control knobs](https://images.unsplash.com/photo-1738918937796-743064feefa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxwb3dlciUyMHBsYW50JTIwY29udHJvbCUyMHJvb218ZW58MXwwfHx8MTc4MjQ0ODkwNHww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Frantisek Duris](https://unsplash.com/@modry_dinosaurus?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-large-control-room-with-lots-of-control-knobs-C3DfIgig1j8?utm_source=spice-bandit-blog&utm_medium=referral)*

## 3. 에너지정산금 계산 — 기본식과 MWP

이제 돈 계산입니다. 에너지정산금의 기본식은 외워둘 만큼 단순합니다.

> **에너지정산금 = 정산전력량(kWh) × SMP(원/kWh)**

여기서 **정산전력량**은 "실제로 계량기에 찍혀 정산 대상이 되는 발전량"입니다. 발전소가 만든 총 발전량에서 발전소 자체가 쓰는 소내소비전력 등을 제외한, 계통으로 내보낸 전력량이라고 이해하면 됩니다. 단위 환산만 주의하세요. 1MWh = 1,000kWh입니다. SMP는 보통 원/kWh로 표기되니 MWh를 kWh로 바꿔 곱해야 자릿수가 맞습니다.

> **실무 팁 ② — 발전량 vs 정산전산량은 다르다**
> "우리가 500MWh 발전했다"와 "정산전력량이 500MWh다"는 같지 않을 수 있습니다. 소내소비전력, 계량 보정 등이 빠지기 때문입니다. 정산은 항상 **계량값(정산전력량)** 기준이라는 것을 기억하세요. 본문 예시에서는 설명을 단순하게 하려고 발전량 = 정산전력량으로 가정합니다.

한 가지 보호장치를 더 알아야 합니다. **변동비보전정산금(MWP, Make-Whole Payment)**입니다. 발전기를 가동하면 연료비(변동비) 외에도 기동비용·최소운전비용처럼 무조건 드는 돈이 있습니다. 만약 그 시간 시장에서 받은 수익(에너지정산금)이 발전기를 돌리는 데 든 **최소한의 운전비용에 못 미치면**, 그 차액을 보전해 주는 장치가 MWP입니다. "거래소 지시로 켰는데 손해 보게 둘 수는 없다"는 취지의 안전망이라고 이해하면 됩니다. 즉 에너지정산금이 기본 수입이고, 부족분이 생기면 MWP가 메워 주는 구조입니다.

참고로 **공기업 발전기나 석탄발전기에는 정산조정계수가 추가로 곱해져** 위 기본식이 그대로 적용되지 않는 경우가 많습니다. 이건 시리즈 3편에서 정산서와 함께 자세히 다룹니다. 1편에서는 "기본식 = 정산전력량 × SMP"라는 뼈대를 먼저 확실히 잡으세요.

## 4. 워크드 예시 — A·B 발전기로 직접 계산

말로만 보면 와닿지 않으니, 시리즈 내내 함께 갈 예시 발전기 두 대로 직접 계산해 보겠습니다. (아래 숫자는 모두 설명용 예시값입니다.)

**예시 설정**

| 발전기 | 종류 | 설비용량 | 변동비 |
| --- | --- | --- | --- |
| A발전기 | 가스복합 | 500MW | 120원/kWh |
| B발전기 | 석탄 | 500MW | 70원/kWh |

이 시간대에는 **가스복합이 한계발전기**가 되어 **SMP = 150원/kWh**로 결정됐다고 합시다. 두 발전기 모두 이 시간 **500MWh(= 500,000kWh)**를 발전했다고 가정합니다.

**에너지정산금과 마진 계산**

| 항목 | A발전기(가스, 변동비 120) | B발전기(석탄, 변동비 70) |
| --- | --- | --- |
| 정산전력량 | 500,000 kWh | 500,000 kWh |
| SMP | 150 원/kWh | 150 원/kWh |
| 에너지정산금 (= 정산전력량 × SMP) | 75,000,000 원 (7,500만원) | 75,000,000 원 (7,500만원) |
| 변동비 (= 변동비 × 정산전력량) | 60,000,000 원 (6,000만원) | 35,000,000 원 (3,500만원) |
| 마진 (= (SMP − 변동비) × 정산전력량) | (150−120)×500,000 = 15,000,000 원 (1,500만원) | (150−70)×500,000 = 40,000,000 원 (4,000만원) |

<figure style="margin:1.5rem 0;">
<svg viewBox="0 0 720 350" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A발전기와 B발전기의 에너지정산금, 변동비, 마진을 비교한 가로 막대 그래프" style="width:100%;height:auto;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#fafafa;border:1px solid #eee;border-radius:8px;">
<text x="24" y="34" font-size="17" font-weight="700" fill="#111">A·B 발전기 정산 비교 — 단위: 만원 (예시값)</text>
<line x1="150" y1="70" x2="150" y2="316" stroke="#ccc"/>
<line x1="150" y1="316" x2="690" y2="316" stroke="#ccc"/>
<text x="150" y="334" font-size="11" fill="#999" text-anchor="middle">0</text>
<text x="285" y="334" font-size="11" fill="#999" text-anchor="middle">2,000</text>
<text x="420" y="334" font-size="11" fill="#999" text-anchor="middle">4,000</text>
<text x="555" y="334" font-size="11" fill="#999" text-anchor="middle">6,000</text>
<text x="690" y="334" font-size="11" fill="#999" text-anchor="middle">8,000</text>
<text x="140" y="97" font-size="13" fill="#333" text-anchor="end">A 에너지정산금</text>
<rect x="150" y="80" width="506" height="24" rx="3" fill="#9ca3af"/>
<text x="648" y="97" font-size="12" fill="#fff" text-anchor="end">7,500만원</text>
<text x="140" y="137" font-size="13" fill="#333" text-anchor="end">A 변동비</text>
<rect x="150" y="120" width="405" height="24" rx="3" fill="#d1d5db"/>
<text x="563" y="137" font-size="12" fill="#6b7280">6,000만원</text>
<text x="140" y="177" font-size="13" fill="#333" text-anchor="end">A 마진</text>
<rect x="150" y="160" width="101" height="24" rx="3" fill="#2563eb"/>
<text x="259" y="177" font-size="12" font-weight="700" fill="#2563eb">1,500만원</text>
<text x="140" y="217" font-size="13" fill="#333" text-anchor="end">B 에너지정산금</text>
<rect x="150" y="200" width="506" height="24" rx="3" fill="#9ca3af"/>
<text x="648" y="217" font-size="12" fill="#fff" text-anchor="end">7,500만원</text>
<text x="140" y="257" font-size="13" fill="#333" text-anchor="end">B 변동비</text>
<rect x="150" y="240" width="236" height="24" rx="3" fill="#d1d5db"/>
<text x="394" y="257" font-size="12" fill="#6b7280">3,500만원</text>
<text x="140" y="297" font-size="13" fill="#333" text-anchor="end">B 마진</text>
<rect x="150" y="280" width="270" height="24" rx="3" fill="#2563eb"/>
<text x="428" y="297" font-size="12" font-weight="700" fill="#2563eb">4,000만원</text>
</svg>
<figcaption style="font-size:12px;color:#888;text-align:center;margin-top:4px;">에너지정산금(매출)은 7,500만원으로 같지만, 변동비가 낮은 B(석탄)의 마진이 A(가스)보다 훨씬 크다 (예시값)</figcaption>
</figure>

여기서 신입사원이 반드시 챙겨야 할 두 가지 인사이트가 있습니다.

첫째, **에너지정산금은 두 발전기가 7,500만원으로 똑같습니다.** SMP는 그 시간 발전한 모든 발전기에 동일하게 적용되기 때문입니다. 발전량(500MWh)과 SMP(150원)만 같으면 연료가 무엇이든 매출은 같습니다.

둘째, **마진은 변동비가 낮은 B발전기(석탄)가 4,000만원으로 A발전기(가스)의 1,500만원보다 훨씬 큽니다.** 같은 단가를 받지만 원가가 싸기 때문입니다. 이것이 merit order에서 싼 발전기부터 켜는 이유이자, 변동비 경쟁력이 발전사 수익성을 가르는 핵심인 이유입니다.

> **실무 팁 ③ — "SMP가 높으면 무조건 좋다"는 함정**
> SMP가 오르면 에너지정산금(매출)은 늘어납니다. 하지만 SMP가 높다는 건 보통 비싼 연료(가스 등)가 한계발전기로 들어왔다는 뜻이고, 우리 발전기가 가스복합이라면 그 비싼 연료비를 함께 부담하고 있을 수 있습니다. 매출(에너지정산금)과 마진((SMP−변동비)×전력량)을 **항상 분리해서** 보는 습관을 들이세요.

![white electric power generator](https://images.unsplash.com/photo-1509390144018-eeaf65052242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwc3Vic3RhdGlvbiUyMHBvd2VyJTIwZ3JpZHxlbnwxfDB8fHwxNzgzMTM0ODM0fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [American Public Power Association](https://unsplash.com/@publicpowerorg?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/white-electric-power-generator-VuR4oHZ3ucc?utm_source=spice-bandit-blog&utm_medium=referral)*

## 5. 정리 — 1편에서 가져갈 것

- 전력시장의 하루는 **①변동비 신고 → ②가격결정발전계획(merit order) → ③실시간 급전 → ④실제 발전량 정산** 순으로 돈다.
- **SMP**는 그 시간 가장 비싼 한계발전기의 변동비로 정해지고, 그 시간 발전한 **모든 발전기에 동일 적용**된다.
- **에너지정산금 = 정산전력량(kWh) × SMP**. 매출은 같아도 **마진은 변동비가 낮을수록 크다.**
- 시장수익이 최소운전비용에 못 미치면 **MWP(변동비보전정산금)**가 차액을 메운다.
- 공기업·석탄의 **정산조정계수**, 그리고 보유·대기 대가인 **용량요금(CP)**은 다음 편에서.

이제 우리 발전기가 어제 한 시간 동안 에너지로 번 돈을 직접 계산할 수 있어야 합니다. 정산전력량과 그 시간 SMP만 알면 끝입니다. 손에 익을 때까지 위 예시 표를 직접 한 번 다시 채워 보세요.

---

### 시리즈 내비게이션

**① 에너지정산금과 SMP (이 글)** → [② 용량요금(CP)](/blog/2026-06-26-power-settlement-manual-2-capacity-payment/) → [③ 정산조정계수와 정산서](/blog/2026-06-26-power-settlement-manual-3-settlement-coefficient/) → [④ 정산조정계수, 어디로 가나](/blog/2026-06-26-power-settlement-manual-4-coefficient-outlook/)
