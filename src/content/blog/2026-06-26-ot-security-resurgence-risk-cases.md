---
title: "OT보안 재확산, 왜 지금 핵심인프라인가"
description: "발전·공장·수처리를 제어하는 OT(운영기술) 보안이 다시 떠오른다. NIS2 등 규제 강화와 IT/OT 융합이라는 두 축, 콜로니얼 파이프라인·우크라이나 전력망 같은 실제 사고, 그리고 기업이 당장 점검해야 할 대응까지 정리했다."
pubDate: 2026-06-26T09:00:00+09:00
category: energy
tags: ["OT보안", "산업제어시스템", "핵심인프라", "사이버보안"]
draft: true
---

발전소·공장·수처리장·교통망을 움직이는 **OT(Operational Technology, 운영기술) 보안**이 2026년 들어 다시 산업계 핵심 의제로 떠오르고 있다. OT는 PLC·SCADA·DCS처럼 물리설비를 직접 제어하는 시스템을 말한다. 이메일과 데이터를 다루는 IT와 달리, OT가 뚫리면 화면 속 정보가 아니라 **현실의 터빈·밸브·송전 차단기**가 멈추거나 오작동한다. 이 글은 "왜 다시 확산되는가 → 무엇이 위험한가 → 실제 사고 → 무엇을 고쳐야 하나 → 앞으로 어떻게"라는 다섯 질문에 차례로 답한다.

![a large machine in a large building](https://images.unsplash.com/photo-1717386255773-1e3037c81788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZmFjdG9yeSUyMGF1dG9tYXRpb24lMjBjb250cm9sJTIwcm9vbXxlbnwxfDB8fHwxNzgyMzY1Njc0fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Homa Appliances](https://unsplash.com/@homaappliances?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-large-machine-in-a-large-building-pWUyHVJgLhg?utm_source=spice-bandit-blog&utm_medium=referral)*

## 왜 다시 확산되나 — 규제와 융합, 두 개의 동인

OT보안 자체는 새로운 개념이 아니다. 다시 뜨는 이유는 **규제(법·제도)**와 **환경(기술·지정학)**이라는 두 축이 동시에 밀어붙이고 있기 때문이다.

**규제 동인.** 가장 강한 신호는 EU의 **NIS2 지침(Directive (EU) 2022/2555)**이다. 회원국 국내법 이행 기한은 2024년 10월 17일이었지만 당시 이를 맞춘 나라는 소수였고, 이후 입법이 빠르게 진행돼 2026년 초 기준 27개국 중 20개국 이상이 국내법으로 옮긴 것으로 알려져 있다(독일은 2025년 12월 이행법 마련). 기업의 첫 컴플라이언스 점검 기한도 2026년 6월 말로 조정되며, 2026년은 사실상 **집행·과징금이 본격화되는 첫 해**로 평가된다. 에너지·제조·수도 등 핵심 인프라 운영사가 규제 대상에 폭넓게 포함된 것이 핵심이다.

한국에는 NIS2가 직접 적용되지 않지만, 독자 체계가 이미 작동한다. **정보통신기반보호법**은 발전·교통 등을 '주요정보통신기반시설'로 지정해 취약점 분석·평가, 제어망 망분리, 보조기억매체(USB) 통제 등을 의무화하고 있고, KISA가 제어시스템 취약점 점검을 지원한다. EU의 집행 강화는 글로벌 공급망에 속한 국내 기업의 보안 요구 수준을 함께 끌어올린다.

**환경 동인.** 과거 OT는 외부망과 분리된 '폐쇄망(에어갭)'이라는 가정 위에 있었다. 그러나 스마트팩토리·원격감시·예지정비를 위해 IT와 OT가 빠르게 융합되면서 그 가정이 깨졌다. IBM의 X-Force 위협 인텔리전스 보고서에 따르면 **제조업은 5년 연속 가장 많이 공격받은 산업**으로, 2025년 전체 사이버공격의 약 27.7%를 차지했다. 침투 경로에서는 **공개된 애플리케이션 취약점 악용**이 가장 두드러져 전년 대비 44% 늘었고 제조업 사례의 약 32%를 차지했으며, 도난·유효 계정(자격증명) 악용이 또 다른 큰 축이었다. IT와 OT가 연결될수록 공격면이 넓어진다는 뜻이다.

## IT 보안과 무엇이 다른가 — OT 고유의 리스크

OT보안을 'IT 보안을 공장에 옮긴 것'으로 이해하면 위험하다. 우선순위 자체가 다르기 때문이다.

- **가용성·안전이 최우선.** IT는 기밀성(C)을 가장 앞에 두지만, OT는 가용성(A)과 안전(Safety)이 먼저다. 데이터 유출보다 '설비가 멈추거나 폭주하는' 물리적 사고가 더 치명적이다. 그래서 IT라면 당연한 '의심되면 즉시 차단·재부팅'이 OT에서는 곧 가동 중단을 의미해 함부로 적용하기 어렵다.
- **레거시와 패치 곤란.** 산업설비는 10~20년 이상 쓰는 경우가 많아 보안 지원이 끝난 구형 OS·펌웨어가 현장에 남아 있다. 24시간 가동되는 라인은 패치를 위한 정지 시간을 내기 어려워 알려진 취약점이 그대로 방치되기 쉽다.
- **융합으로 넓어진 공격면.** IT/OT가 연결되면 공격자는 상대적으로 보안이 약한 IT(사무망·원격접속·협력사 계정)를 발판 삼아 OT로 횡이동(lateral movement)할 수 있다. 실제 사고 다수가 'OT를 직접' 뚫기보다 'IT를 통해' OT에 도달했다.

![a line of electrical equipment in a factory](https://images.unsplash.com/photo-1716191300020-b52dec5b70a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxpbmR1c3RyaWFsJTIwZmFjdG9yeSUyMGF1dG9tYXRpb24lMjBjb250cm9sJTIwcm9vbXxlbnwxfDB8fHwxNzgyMzY1Njc0fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Homa Appliances](https://unsplash.com/@homaappliances?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-line-of-electrical-equipment-in-a-factory-ERXFD4jLpJc?utm_source=spice-bandit-blog&utm_medium=referral)*

## 실제로 무슨 일이 있었나 — 대표 사고들

추상적 위협이 아니라 이미 현실이 됐다는 점이 OT보안의 핵심 메시지다.

- **스턱스넷(Stuxnet, 2010 발견).** 이란 나탄즈 핵시설의 우라늄 농축 원심분리기를 겨냥해 PLC를 조작, 설비를 물리적으로 손상시킨 것으로 알려진 사례다. 사이버 공격이 현실 설비를 파괴할 수 있음을 처음으로 각인시켰다.
- **우크라이나 전력망 공격(2015·2016).** 2015년 12월 다수 배전사가 원격 조작으로 차단돼 수십만 가구가 정전됐고, 2016년에도 재차 공격이 이어진 것으로 보고됐다. 전력 계통을 노린 대표적 OT 사고다.
- **콜로니얼 파이프라인(2021).** 미국 동부 연료를 공급하는 송유관 운영사가 랜섬웨어에 감염돼 가동을 멈추면서 연료 공급에 차질이 빚어졌다. 직접 감염된 곳은 IT 시스템이었지만, 운영 중단이라는 결과는 OT/물리 공급망으로 번졌다 — IT/OT 경계의 위험을 보여준 사례다.
- **최근 핵심 인프라(2024~2025).** 수처리·수자원 설비와 에너지망을 겨냥한 공격 시도가 잇따른 것으로 보고된다. Dragos·Claroty 등 OT 전문 보안기관은 2024~2025년 산업 운영사를 노린 랜섬웨어와 원격 접근 시도가 증가 추세라고 밝히고 있다. 구체적 수치·정황은 조사기관에 따라 차이가 있으며, 미공개·진행 중인 사건도 포함될 수 있어 단정하기보다 '추세'로 읽는 편이 안전하다.

## 무엇을 조심하고 고쳐야 하나 — 실질 대응

기업·기관 관점에서 우선순위가 높은 대응은 다음과 같다.

1. **자산 가시성 확보.** 무엇을 지키는지 모르면 지킬 수 없다. 현장 PLC·HMI·엔지니어링 워크스테이션, 외부와의 연결점, 협력사 원격접속 경로까지 'OT 자산 인벤토리'를 먼저 만든다.
2. **망 분리·세분화(Segmentation).** IT망과 OT망을 분리하고, OT 내부도 구역(zone)과 통로(conduit)로 나눠 한 곳이 뚫려도 횡이동이 번지지 않게 한다. 이는 IEC 62443이 제시하는 zone·conduit 개념과 직접 연결된다.
3. **표준·프레임워크 채택.** 산업제어시스템 보안 국제표준인 **IEC 62443**, 미국 **NIST SP 800-82(ICS 보안 가이드)**, **CISA**의 권고를 자사 환경에 맞춰 적용한다. 국내라면 정보통신기반보호법상 취약점 분석·평가 체계와 정합을 맞춘다.
4. **계정·원격접속 통제와 백업.** 가장 흔한 침투 경로가 유효 계정 도용과 외부 접속인 만큼, 다단계 인증·최소권한·원격접속 점검이 효과가 크다. 가용성이 생명인 OT 특성상 안전한 백업과 복구 훈련도 필수다.

![birds eye photography of concrete structure](https://images.unsplash.com/photo-1509390288171-ce2088f7d08e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxwb3dlciUyMHBsYW50JTIwaW5kdXN0cmlhbCUyMGluZnJhc3RydWN0dXJlfGVufDF8MHx8fDE3ODIzNjU2NzV8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [American Public Power Association](https://unsplash.com/@publicpowerorg?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/birds-eye-photography-of-concrete-structure-bv2pvCGMtzg?utm_source=spice-bandit-blog&utm_medium=referral)*

## 앞으로 어떻게 — 규제 집행과 융합 가속

향후 흐름은 두 단어로 압축된다. **집행 본격화**와 **융합 가속**이다. EU NIS2가 2026년부터 실제 과징금·감독으로 이어지고, 미국·한국도 핵심 인프라 보안 요구를 강화하면서 OT보안은 '권고'에서 '의무'로 넘어가는 국면에 들어섰다. 동시에 AI·클라우드·원격운영이 산업 현장에 더 깊이 들어오면서 IT/OT 융합은 되돌릴 수 없는 방향이다. 보안을 사후 비용이 아니라 **설비 설계 단계의 기본요건(security by design)**으로 끌어올리는 기업과 그렇지 못한 기업의 격차가 향후 몇 년간 더 벌어질 가능성이 크다.

결국 OT보안은 IT 부서만의 일도, 일회성 점검도 아니다. 발전·제조·수처리처럼 '멈추면 사회가 멈추는' 설비를 다루는 조직에게는 **안전(Safety)과 보안(Security)을 하나로 보는 운영 철학**의 문제다. 지금이 그 전환을 미루지 말아야 할 시점이다.

---

*※ 이 글은 일반적인 정보 제공을 위한 것으로, 특정 기업·제품에 대한 평가나 투자 조언이 아닙니다.*

**주요 출처**
- EU NIS2 지침(Directive (EU) 2022/2555) 및 이행 현황 — European Commission, ECSO NIS2 Transposition Tracker
- IBM X-Force Threat Intelligence Index(2025~2026, 제조업 피격·침투경로 통계)
- 산업제어시스템 보안 표준 — IEC 62443, NIST SP 800-82, CISA 권고
- 한국 정보통신기반보호법·주요정보통신기반시설 보호지침 — KISA·법제처
- 주요 사고 보도 및 보안기관(Dragos·Claroty·Honeywell 등) 분석 — Stuxnet, 우크라이나 전력망(2015·2016), Colonial Pipeline(2021), 2024~2025년 핵심 인프라 공격 동향
