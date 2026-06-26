---
title: "전력시장 정산 구조와 용량요금(CP) 입문"
description: "한국 전력시장(CBP)에서 발전사는 어떻게 돈을 받나. SMP·MEP·MWP와 용량요금(CP)을 중심으로 에너지정산금과 용량정산금의 차이, 정산의 큰 틀을 1차 자료로 정리했습니다. (CP계수 전망 2부작 1편)"
pubDate: 2026-06-26T09:30:00+09:00
category: energy
tags: ["전력시장", "정산", "SMP", "용량요금"]
draft: true
---

한국 전력시장에서 발전사는 전기를 만들어 팔 때 **딱 두 종류의 대가**를 받는다. 하나는 실제로 발전한 전력량에 대한 '에너지정산금', 다른 하나는 발전설비를 보유하고 대기한 것에 대한 '용량정산금(CP)'이다. 이 글은 **전력시장 정산 구조**의 큰 틀을 잡는 입문 explainer다. SMP(계통한계가격), CP(용량가격), MEP(시장에너지가격), MWP(변동비보전정산금) 같은 약어가 각각 무엇이고, 발전사 수익이 어떻게 계산되는지 전력거래소(KPX) 전력시장운영규칙을 근거로 풀어낸다. 이 1편은 곧 이어질 2편 'CP계수(정산조정계수) 전망'을 읽기 위한 토대다.

![white windmill during daytime](https://images.unsplash.com/photo-1562519990-50eb51e282b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxwb3dlciUyMHBsYW50JTIwdHVyYmluZSUyMGVuZXJneXxlbnwxfDB8fHwxNzgyMzY2NTU2fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Thomas Réaubourg](https://unsplash.com/@thomasreaubourg?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/white-windmill-during-daytime-JRUVbgJJTBM?utm_source=spice-bandit-blog&utm_medium=referral)*

## 한국 전력시장(CBP) 정산은 누가 누구에게 지불하나

한국의 도매 전력시장은 **변동비반영시장(CBP, Cost-Based Pool)** 이다. 발전사가 스스로 가격을 부르는 입찰시장이 아니라, 발전기별 변동비(연료비 등)를 미리 KPX에 신고해 두고, 그 변동비를 기준으로 가격과 급전 순서가 정해지는 구조다. 흐름은 단순하다. ① 발전사가 변동비를 신고하면, ② KPX가 다음 날 수요를 맞추도록 싼 발전기부터 차례로 돌리는 '발전계획'을 짜고(급전), ③ 실제 발전 결과에 맞춰 정산한다.

정산의 큰 틀에서 돈의 흐름은 이렇게 정리된다.

| 구분 | 무엇에 대한 대가인가 | 핵심 가격변수 | 지급 주체 |
|---|---|---|---|
| 에너지정산금 | 실제 발전한 전력량(kWh) | SMP(계통한계가격) | 전력거래소(KPX)가 정산·중개 |
| 용량정산금(CP) | 발전설비를 보유·대기시킨 것(kW) | 용량가격(CP) | 〃 |
| 부가정산금 | 계통 운영상 불가피하게 생긴 손익 보정 | MWP·CON·COFF 등 | 〃 |

표에서 핵심은 **전력거래소(KPX)가 정산의 중심에 있다**는 점이다. 발전사는 KPX를 통해 전력을 팔고, 최대 구매자인 한국전력공사(한전)가 그 전력을 사들여 소비자에게 공급한다. 즉 도매 정산(발전사↔KPX)과 소매 요금(한전↔소비자)은 별개의 층위다. 이 글이 다루는 것은 앞쪽, 발전 단계의 도매 정산이다.

## 에너지정산금 vs 용량정산금 — '발전한 대가'와 '보유한 대가'

전력시장 정산을 이해하는 가장 빠른 길은 **두 가지 대가를 분리해서 보는 것**이다.

**에너지정산금**은 실제로 전기를 만든 전력량(kWh)에 대한 대가다. 기본 골격은 '시장가격 × 발전량'이며, 여기서 시장가격 역할을 하는 것이 **SMP(계통한계가격)** 다. SMP는 특정 시간대에 수요를 맞추기 위해 마지막으로 투입된 가장 비싼 발전기의 변동비로 결정되고, 그 시간대에 발전한 모든 발전기에 동일하게 적용된다. 가스 발전이 한계 발전기가 되는 시간대에 SMP가 높아지고, 원전·석탄처럼 변동비가 낮은 발전기는 그 차액만큼 이윤을 얻는 식이다.

**용량정산금(CP)** 은 성격이 전혀 다르다. 이것은 전기를 '얼마나 만들었나'가 아니라 발전설비를 '얼마나 갖추고 대기시켰나'에 대한 대가다. 산정의 기본 골격은 '용량가격 × 공급가능용량'으로, **실제 가동 여부와 무관하게** 설비를 시장에 제공할 수 있는 상태로 유지하면 지급된다. 한여름 피크에 대비해 평소 거의 돌지 않는 발전기라도, 그 설비가 비상시 동원될 수 있다는 사실 자체에 값을 매기는 것이다.

![black transmission towers under green sky](https://images.unsplash.com/photo-1413882353314-73389f63b6fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxlbGVjdHJpY2l0eSUyMHBvd2VyJTIwdHJhbnNtaXNzaW9uJTIwZ3JpZHxlbnwxfDB8fHwxNzgyMzY2NTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Fré Sonneveld](https://unsplash.com/@fresonneveld?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-transmission-towers-under-green-sky-q6n8nIrDQHE?utm_source=spice-bandit-blog&utm_medium=referral)*

## SMP·CP·MEP·MWP·CON·COFF — 핵심 변수 정의

약어가 많아 헷갈리기 쉽다. KPX 전력시장운영규칙(정산 기준)을 기준으로 핵심 변수를 정리하면 다음과 같다.

| 약어 | 명칭 | 역할 |
|---|---|---|
| SMP | 계통한계가격(System Marginal Price) | 시간대별 에너지 거래에 적용되는 시장가격. 한계 발전기 변동비로 결정 |
| CP | 용량가격(Capacity Price) | 공급가능용량 보유에 지급되는 용량요금의 단가 |
| MEP | 시장에너지가격(Market Energy Price) | 에너지 거래분에 적용되는 시장가격을 가리키는 용어 |
| MWP | 변동비보전정산금(Make-Whole Payment) | 시장수익이 비용에 못 미칠 때 차액을 보전하는 부가정산금 |
| CON | 제약발전 전력량 정산금 | 계획보다 더 발전한 전력량(송전제약 등)에 대한 정산금 |
| COFF | 제약비발전 전력량 정산금 | 계획됐으나 발전하지 못한 전력량의 기대이익 보상 |

여기서 두 가지는 특히 주의해서 읽어야 한다.

첫째, **MWP는 '가격'이 아니라 '보전 정산금'** 이다. 영문 그대로 'make-whole payment', 즉 발전기가 시장에서 번 수익이 실제 비용(예: 최소 운전을 위한 비용)보다 작을 때 그 차액을 메워 주는 보완장치다. SMP·CP와 같은 단가 개념과 혼동하기 쉬우나, 성격이 다르다.

둘째, **MEP(시장에너지가격)는 '에너지 거래분에 적용되는 시장가격'** 을 가리키는 용어다. 현행 전국 단위 CBP 시장에서 그 역할을 실제로 수행하는 가격이 바로 SMP다. 다만 'MEP'라는 표기와 15분 단위의 에너지 가격 정산은 실시간시장을 도입하는 제도개편(제주 시범사업 등) 논의에서 더 분명하게 등장한다. 따라서 MEP를 SMP와 완전히 같은 것으로 단정하기보다, **에너지 가격 구성요소를 가리키는 개념으로 이해**하고, 정확한 규칙상 정의·적용 범위는 KPX 최신 운영규칙으로 확인하는 것이 안전하다.

CON·COFF는 '제약(constraint)' 정산금이다. 송전망 혼잡 같은 계통 제약 때문에 KPX가 경제급전 순서를 벗어나 특정 발전기를 더 돌리거나(CON), 반대로 돌릴 계획이었는데 못 돌리게 했을 때(COFF) 발생한 손익을 보정한다. 발전사 입장에서는 자기 의사와 무관하게 계통 운영상 생긴 결과이므로, 시장이 이를 보상하거나 회수하는 장치다.

## CP(용량요금)는 왜 가동 여부와 무관하게 지급하나

전력시장 정산에서 가장 자주 오해받는 항목이 CP다. "안 돌린 발전기에 왜 돈을 주나"라는 질문이 자연스럽게 나오기 때문이다.

답은 **전력의 특성**에 있다. 전기는 대규모 저장이 어렵고, 수요는 한여름·한겨울 피크에 급등한다. 그 피크를 견디려면 평소에는 거의 돌지 않더라도 비상시 동원할 수 있는 발전설비가 시스템에 충분히 남아 있어야 한다. 그런데 발전사가 에너지정산금(SMP×발전량)만으로 수익을 낸다면, 거의 안 도는 발전기는 적자를 면치 못하고 결국 폐쇄될 것이다. 그러면 정작 피크 때 쓸 설비가 사라진다.

CP는 이 문제를 푸는 장치다. **발전 여부와 무관하게 '쓸 수 있는 설비를 갖춰 둔 것' 자체에 고정비 성격의 대가를 지급**함으로써, 신규 발전설비 투자 유인을 유지하고 적정 예비력을 확보하려는 것이다. 용량가격의 기준이 되는 **기준용량가격은 KPX가 산정해 공개**하며, kW 단위로 정해진다. 구체적 단가 수준과 그것을 발전기별 실제 지급액으로 바꾸는 보정 장치(정산조정계수 등)는 시기에 따라 달라지므로, 정확한 값은 KPX 정보공개 자료로 확인해야 한다. (이 보정 장치의 동향이 곧 2편의 주제다.)

![silhouette of electric post during sunset](https://images.unsplash.com/photo-1610028290816-5d937a395a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxlbGVjdHJpY2l0eSUyMHBvd2VyJTIwdHJhbnNtaXNzaW9uJTIwZ3JpZHxlbnwxfDB8fHwxNzgyMzY2NTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Andrey Metelev](https://unsplash.com/@metelevan?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/silhouette-of-electric-post-during-sunset-qpAOxji4dAo?utm_source=spice-bandit-blog&utm_medium=referral)*

## So What — 이 구조가 발전사·요금·투자에 주는 함의

정산 구조를 굳이 따져 보는 이유는, **이 구조가 발전사의 수익과 신규 투자, 나아가 전기요금의 방향을 결정**하기 때문이다.

발전사의 수익은 결국 '에너지정산금(SMP 기반) + 용량정산금(CP 기반) + 부가정산금'의 합이다. 두 기둥 중 SMP는 연료 가격과 수급에 따라 출렁이는 변동성 수익이고, CP는 상대적으로 안정적인 고정 수익이다. 그래서 **CP 단가와 그 보정 장치가 어떻게 설계되느냐**는 곧 어떤 발전원이 시장에 남고 어떤 설비에 신규 투자가 일어날지를 좌우하는 정책 레버가 된다. 재생에너지 비중이 커지고 기존 발전기의 가동률이 떨어질수록, 가동과 무관한 CP의 역할은 오히려 더 중요해진다는 것이 이 구조의 핵심 함의다.

정리하면, 한국 전력시장 정산은 ① 발전한 만큼 받는 에너지정산금(SMP·MEP), ② 갖춰 둔 만큼 받는 용량정산금(CP), ③ 계통 운영상 불가피한 손익을 메우는 부가정산금(MWP·CON·COFF)의 세 층으로 이뤄진다. 이 가운데 **시장의 투자 신호를 쥐고 있는 것이 CP**라는 점이 오늘의 한 줄 결론이다.

다음 **2편에서는 이 CP가 발전기별로 실제 얼마가 되는지를 좌우하는 '정산조정계수(CP계수)'의 구조와 전망**을 다룬다. 왜 같은 용량가격을 적용해도 발전사마다 손에 쥐는 용량정산금이 달라지는지, 그 보정 장치가 어디로 향하는지를 이어서 살펴본다.

---

※ 이 글은 전력시장 제도를 설명하는 정보성 콘텐츠이며, 특정 종목·기업에 대한 투자 조언이 아닙니다.

**참고 출처(1차 자료 우선)**
- 전력거래소(KPX) 「전력시장운영규칙」 정산 기준([별표2] 정산 기준 등), marketrule.kpx.or.kr
- 전력거래소(KPX) 「전력시장 제도개선 제주 시범사업 운영규칙(안)」, new.kpx.or.kr
- 전력거래소 EPSIS 전력통계정보시스템(SMP·정산단가), epsis.kpx.or.kr
- 전기신문, 'COFF정산금 줄이고 보조서비스 보상은 늘린다'(제약비발전정산금 개념 참고), electimes.com
- 한국에너지경제연구원(KEEI), 「전력시장 용량요금(CP) 적정성 연구」, keei.re.kr
