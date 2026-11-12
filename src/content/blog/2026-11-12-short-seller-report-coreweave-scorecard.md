---
title: "1년 전 그 공매도 리포트는 맞았나 — CoreWeave 채점"
description: "2025년 9월 Kerrisdale은 CoreWeave 적정가를 10달러로 제시했다. 14개월이 지난 지금 주가는 60달러다. 주장 일곱 개를 공시와 대조해 맞은 것과 틀린 것을 갈라봤다. 투자 조언이 아니다."
pubDate: 2026-11-12T11:52:19+09:00
category: economy
tags: ["공매도", "AI 데이터센터", "CoreWeave", "리포트 읽기"]
---

2025년 9월, 공매도 전문 리서치 Kerrisdale Capital이 CoreWeave를 겨눈 30페이지 리포트를 냈습니다. 제목은 **"Artificial Returns"**였고, 결론은 한 줄이었습니다. **주가 112달러, 적정가 10달러, 90% 하락.**

14개월 뒤인 2026년 11월 11일 CoreWeave 주가는 **60.84달러**입니다. 리포트가 말한 10달러는 오지 않았습니다. 점대점으로는 **46% 내렸으니** 평가이익 구간이었습니다. 다만 그 사이 주가는 두 번 되돌아갔고, 공매도는 대차비용을 매일 냅니다.

그러면 그 리포트는 맞은 걸까요, 틀린 걸까요. **답은 "주장마다 다르다"입니다.** 그리고 이 질문이 흥미로운 이유는, 어느 주장이 맞고 어느 주장이 틀렸는지에 **일정한 패턴**이 있다는 데 있습니다.

**결론부터 말하면 이렇습니다. 리포트는 구조를 맞췄고 속도를 틀렸습니다.** 고객 집중, 조달 비용, 마이크로소프트 이탈 — 회사의 뼈대에 관한 지적은 거의 다 들어맞았습니다. 반면 "수요가 과장됐다"는 전제는 크게 틀렸습니다. 매출은 1년 만에 168% 늘었습니다.

## 채점표 — 일곱 개 주장, 14개월 뒤

| 리포트 주장 (2025년 9월) | 2026년 11월 현재 | 판정 |
|---|---|---|
| ① 매출의 **70%가 마이크로소프트** | FY2025 10-K가 **약 67%**로 공시 | **맞았다** |
| ② 마이크로소프트가 이탈한다 | 11월, **협력 네오클라우드 축소·자체 데이터센터로** | **맞았다** |
| ③ 엔비디아와의 **순환 거래** | 미판매 용량 **63억 달러** 매입계약(2025-09), 지분 **20억 달러** 추가(2026-01) | **구조는 맞았다 · '순환'이라는 해석만 다툼 중** |
| ④ 자본비용보다 수익률이 낮다 | 조정 영업이익률 **10%** 달성 · 그러나 **순손실 7억 900만 달러** | **절반만 맞았다** |
| ⑤ GPU 내구연한 6년은 길다 | 회사는 **6년 유지** | **판정 유보** |
| ⑥ 조달이 끊기면 멈춘다 — 2028년 부채 **400억 달러** | 2026년 9월 말 **469억 달러** (6월 말 351억) | **2년 앞당겨 초과** |
| ⑦ **수요는 과장**이다, 성장이 꺾인다 | 3분기 매출 **+168%**, 백로그 **+138%** | **틀렸다** |
| **결론: 적정가 10달러** (당시 112달러) | **60.84달러** | **방향은 맞고 폭은 틀렸다** |

*출처: Kerrisdale Capital 리포트 원문(2025-09), CoreWeave 2026년 3분기 실적 발표(2026-11-10), 각 사 공시 및 보도*

**구조에 관한 네 개(①②③⑥)는 맞았고, 수요에 관한 하나(⑦)는 틀렸습니다.** 이 비대칭이 이 글의 핵심입니다.

*참고: 리포트는 적정가를 장부가 기준 6달러, 이익 기준 13달러로 함께 제시하며 결론에 10달러를 썼습니다. 그리고 법적 고지에서 **"이 추정 적정가는 목표가가 아니다"**라고 밝혔습니다.*

![Detailed image of illuminated server racks showcasing modern technology infrastructure.](https://images.pexels.com/photos/17489160/pexels-photo-17489160.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [panumas nikhomkhai](https://www.pexels.com/@cookiecutter) on [Pexels](https://www.pexels.com/photo/box-server-illuminated-on-blue-17489160/)*

## 리포트를 분해하면

아래는 그 리포트의 주장을 **근거의 단단함**에 따라 갈라놓은 것입니다. 공매도 리포트를 읽을 때 가장 중요한 작업이 이것입니다 — 리포트는 확인되는 사실과 추론을 같은 문단에 섞어 씁니다.

<div class="short-report">
<div class="sr-meta"><div class="sr-meta-head"><span class="sr-kicker">공매도 리포트 해부</span><strong class="sr-meta-title">CoreWeave, Inc. (CRWV) — Artificial Returns</strong></div><dl class="sr-meta-grid"><div class="sr-meta-row"><dt>발행사</dt><dd>Kerrisdale Capital</dd></div><div class="sr-meta-row"><dt>발간일</dt><dd>2025년 9월 15일 (발간 직전 종가 $112, 발간일 종가 $120.71)</dd></div><div class="sr-meta-row"><dt>대상</dt><dd>CoreWeave (NASDAQ: CRWV)</dd></div><div class="sr-meta-row"><dt>리포트 투자의견</dt><dd>적정가 $10 — 90% 하락 여력 (리포트는 장부가 기준 $6, EBIT 기준 $13 두 값을 함께 제시하며 '목표가가 아니다'라고 고지했다)</dd></div><div class="sr-meta-row"><dt>원문</dt><dd><a href="https://www.kerrisdalecap.com/wp-content/uploads/2025/09/Kerrisdale-CoreWeave.pdf" rel="nofollow noopener" target="_blank">리포트 원문 보기</a></dd></div></dl><p class="sr-disclosure"><strong>이해관계 공시 —</strong> Kerrisdale Capital는 CoreWeave (NASDAQ: CRWV)에 대해 <strong>공매도</strong> 포지션을 공개했습니다. 즉 주가가 내려갈 때 이익을 얻는 쪽이 작성한 문서입니다. 아래 내용은 <strong>그 발행사의 주장</strong>이며, 이 글은 그 주장의 사실 여부를 보증하지 않습니다.</p></div>
<div class="sr-section"><h3 class="sr-h">리포트가 제기한 주장</h3><p class="sr-lede">각 주장 옆 배지는 <strong>근거의 단단함</strong>을 나타냅니다. 색이 진할수록 공적 기록으로 확인되는 사실이고, 연할수록 리포트에만 있는 주장입니다.</p><ul class="sr-cards" role="list"><li class="sr-card"><div class="sr-card-head"><span class="sr-card-no">주장 01</span><span class="sr-badge" style="background:#1B4F8A;color:#FAF6EE;border:1px solid #1B4F8A" title="법원 문서·공시·세관 기록·정부 발표로 확인되는 사실">공적 기록 확인</span></div><h4 class="sr-card-title">매출의 70%가 마이크로소프트 한 곳에서 나온다</h4><p class="sr-card-claim"><span class="sr-tag">리포트 주장</span>리포트는 마이크로소프트가 CoreWeave 매출의 70%를 차지한다고 적었다. 고객 한 곳이 빠지면 사업 모델이 흔들리는 구조라는 것이다.</p><p class="sr-card-company"><span class="sr-tag">회사 입장</span>CoreWeave는 집중도 자체를 부인하지 않았다. 2025년 3월 공시에서 마이크로소프트가 2024년 매출의 62%를 차지했다고 스스로 밝혔다.</p><p class="sr-card-ev"><span class="sr-tag">확인 가능한 자료</span>CoreWeave FY2025 10-K가 마이크로소프트를 이름까지 들어 매출의 약 67%라고 적었다. 연도 비교는 S-1의 2024년 62%를 쓰는 게 맞다 — 10-K은 2024년을 상위 2개사 합산 77%로 묶어 표기한다. 숫자는 누구나 공시로 확인할 수 있다.</p></li><li class="sr-card"><div class="sr-card-head"><span class="sr-card-no">주장 02</span><span class="sr-badge" style="background:#4E7FA8;color:#FAF6EE;border:1px solid #4E7FA8" title="복수 언론이 독립적으로 보도한 내용">보도 교차확인</span></div><h4 class="sr-card-title">마이크로소프트가 증설을 거절하고 경쟁사로 갔다</h4><p class="sr-card-claim"><span class="sr-tag">리포트 주장</span>리포트는 마이크로소프트가 2025년 3월 120억 달러 규모 증설 옵션을 거절하고, 더 큰 174억 달러 계약을 경쟁사 Nebius와 맺었다고 적었다. 전직 마이크로소프트 데이터센터 임원 인터뷰를 인용해 CoreWeave의 실행 차질과 공급망 다변화를 이유로 들었다.</p><p class="sr-card-company"><span class="sr-tag">회사 입장</span>CoreWeave는 수요가 넘친다는 입장을 유지했고, 이후 OpenAI 등으로 고객을 넓혔다.</p><p class="sr-card-ev"><span class="sr-tag">확인 가능한 자료</span>Nebius-마이크로소프트 174억 달러 계약은 공개 발표된 사실이다. '증설 거절'의 내부 사정은 리포트가 인용한 익명 인터뷰에 기댄다.</p></li><li class="sr-card"><div class="sr-card-head"><span class="sr-card-no">주장 03</span><span class="sr-badge" style="border:1px solid #23201D;color:#23201D;background:transparent" title="대상 회사가 공식적으로 반박한 내용">회사가 부인</span></div><h4 class="sr-card-title">엔비디아와의 순환 거래 — 칩 공급자가 투자자이자 고객이다</h4><p class="sr-card-claim"><span class="sr-tag">리포트 주장</span>리포트는 엔비디아가 CoreWeave에 GPU 100%를 공급하면서 동시에 투자자이자 고객이라고 지적했다. 2023년 초 1억 달러 지분 투자와 2027년까지 13억 달러 임대 계약(엔비디아가 GPU를 되빌림)을 맺어 2023년 엔비디아가 매출의 15%를 차지하는 2대 고객이 됐고, IPO 때도 2억 5천만 달러어치를 사들였다는 것이다.</p><p class="sr-card-company"><span class="sr-tag">회사 입장</span>마이클 인트레이터 CEO는 2026년 1월 14일 '터무니없다(ridiculous)'고 반박했다. 엔비디아 투자는 두 라운드 합쳐 약 3억 달러인데 회사가 조달한 자본은 250억 달러를 넘는다며, 그 지분으로 수요를 떠받칠 수 없다고 했다. 다만 그 발언 12일 뒤 엔비디아는 20억 달러를 추가로 투자했다.</p><p class="sr-card-ev"><span class="sr-tag">확인 가능한 자료</span>지분 금액과 엔비디아 지분율 7%는 양측 설명이 일치한다. 그런데 1년 사이 규모가 커졌다 — 리포트가 나온 2025년 9월 15일 당일 엔비디아는 CoreWeave의 미판매 용량을 2032년 4월까지 최대 63억 달러 매입하는 계약을 공시했고(문제 삼은 13억 달러 되빌림의 약 5배), 2026년 1월 26일에는 주당 87.20달러로 20억 달러를 추가 투자했다. 계약과 공시는 확인되는 사실이고, 이를 '순환 거래'로 볼지가 다툼의 지점이다.</p></li><li class="sr-card"><div class="sr-card-head"><span class="sr-card-no">주장 04</span><span class="sr-badge" style="background:#A8BDD2;color:#23201D;border:1px solid #A8BDD2" title="리포트에만 있는 주장. 익명 증언·추정을 포함한다">리포트 단독 주장</span></div><h4 class="sr-card-title">자본비용보다 낮은 수익률 — 주주가치를 창출하지 않는다</h4><p class="sr-card-claim"><span class="sr-tag">리포트 주장</span>리포트는 CoreWeave가 가장 기본적인 재무 시험을 통과하지 못한다고 썼다. 하이퍼스케일러보다 30~50% 싸게 팔면서 초기 투자비는 15~20% 더 들고(SemiAnalysis 분석 인용), 계약 기간 중 주주에게 돌아오는 것은 없으며 5년 된 칩의 잔존가치에 기대야 겨우 본전이라는 것이다. 전직 CoreWeave 데이터센터 엔지니어 인터뷰를 근거로 들었다.</p><p class="sr-card-company"><span class="sr-tag">회사 입장</span>CoreWeave는 규모가 커지면 수익성이 따라온다는 입장이었다. 2026년 3분기에 조정 영업이익률 10%를 계획보다 한 분기 앞당겨 달성했다.</p><p class="sr-card-ev"><span class="sr-tag">확인 가능한 자료</span>유닛 이코노믹스 계산은 리포트와 SemiAnalysis의 추정이다. 반면 이자비용·순손실은 공시로 확인된다 — 2026년 3분기 이자비용 8억 4,600만 달러, 순손실 7억 900만 달러.</p></li><li class="sr-card"><div class="sr-card-head"><span class="sr-card-no">주장 05</span><span class="sr-badge" style="background:#1B4F8A;color:#FAF6EE;border:1px solid #1B4F8A" title="법원 문서·공시·세관 기록·정부 발표로 확인되는 사실">공적 기록 확인</span></div><h4 class="sr-card-title">GPU 내구연한 6년은 경쟁사보다 길다</h4><p class="sr-card-claim"><span class="sr-tag">리포트 주장</span>CoreWeave는 GPU 내구연한을 6년으로 잡는데 Nebius는 4년, 아마존은 AI 기술 변화 속도를 들어 일부 장비를 6년에서 5년으로 줄였다. 리포트는 내구연한을 줄이면 CoreWeave의 유닛 이코노믹스와 마진이 무너진다고 봤다.</p><p class="sr-card-company"><span class="sr-tag">회사 입장</span>회사는 6년 기준을 유지하고 있다.</p><p class="sr-card-ev"><span class="sr-tag">확인 가능한 자료</span>CoreWeave의 6년 기준과 아마존이 2024년 4분기 실적 발표에서 일부 장비를 6년에서 5년으로 줄인 것은 공개 자료다. 맥락이 하나 더 있다 — CoreWeave는 2023년 1월 1일부로 내구연한을 5년에서 6년으로 늘렸고 그 결과 2023년 비용이 2,000만 달러 줄었다. 리포트가 지적한 '6년'은 회사가 직전에 늘린 숫자였다. 다만 'Nebius 4년'은 리포트의 서술이며 이 글은 Nebius 공시로 따로 확인하지 않았다. '줄이면 마진이 무너진다'는 결론은 리포트의 추정이다.</p></li><li class="sr-card"><div class="sr-card-head"><span class="sr-card-no">주장 06</span><span class="sr-badge" style="background:#A8BDD2;color:#23201D;border:1px solid #A8BDD2" title="리포트에만 있는 주장. 익명 증언·추정을 포함한다">리포트 단독 주장</span></div><h4 class="sr-card-title">자금 조달이 끊기면 성장이 멈춘다 — 2028년 부채 400억 달러</h4><p class="sr-card-claim"><span class="sr-tag">리포트 주장</span>리포트는 성장을 이어가려면 자본시장 접근이 끊기지 않아야 한다고 봤다. 조달 수단별 금리를 GPU·고객계약 담보 지연인출 대출(DDTL) 11~15%, OEM 벤더 금융 9~10%, 그 외 하이일드 채권으로 열거하며 경영진이 '부채가 엔진이고 연료다'라고 말한 것을 인용했다. 추정은 2025년 한 해 현금 소진 190억 달러, 2028년까지 누적 400억 달러이며, 2028년 총부채가 400억 달러를 넘어서는 시점에도 잉여현금흐름은 흑자가 아닐 것이라고 했다. 2025년 순레버리지는 약 6.0배로 봤다.</p><p class="sr-card-company"><span class="sr-tag">회사 입장</span>CoreWeave는 조달 비용을 낮추는 것이 전략의 핵심이라고 밝혀 왔다. 2026년 3분기에는 가중평균 차입금리가 약 7.9%이고 원금 40억 달러를 이미 상환했으며, 현재 금리 수준에서는 2027년까지 모회사 차원의 신규 무담보채를 발행하지 않고 계약담보대출과 고객 선수금으로 조달하겠다고 했다(모회사 차원 증분 조달은 50억 달러 미만 전망). 다만 같은 분기에 전환사채 42억 달러를 발행했다. 조정 순이익은 2028년 상반기에 흑자로 돌아설 것으로 봤다.</p><p class="sr-card-ev"><span class="sr-tag">확인 가능한 자료</span>2025년 7월 발행한 18억 달러 선순위 무담보채의 금리 9.00%는 공개된 발행 조건이다. 총부채는 추정치 400억 달러를 이미 넘었다 — 2026년 9월 말 469억 달러로, 6월 말 351억에서 한 분기에 118억 달러 늘었다. 190억·400억 달러는 리포트의 추정치다.</p></li><li class="sr-card"><div class="sr-card-head"><span class="sr-card-no">주장 07</span><span class="sr-badge" style="background:#A8BDD2;color:#23201D;border:1px solid #A8BDD2" title="리포트에만 있는 주장. 익명 증언·추정을 포함한다">리포트 단독 주장</span></div><h4 class="sr-card-title">수요는 과장됐다 — 성장이 꺾인다</h4><p class="sr-card-claim"><span class="sr-tag">리포트 주장</span>리포트는 '연산 수요가 끝없다'는 서사가 CoreWeave의 몫을 보장하지 않는다고 봤다. 3분기 매출 가이던스가 신규 순증 6,700만 달러에 불과해 2분기 순증 2억 3,100만 달러에서 급격히 둔화했고, 백로그 300억 달러도 OpenAI 150억 달러를 빼면 전분기 대비 거의 늘지 않았다는 것이다. 향후 24개월 매출 커버리지가 시장 전망 대비 80억 달러 부족하다고 계산했다.</p><p class="sr-card-company"><span class="sr-tag">회사 입장</span>CoreWeave는 수요가 넘친다는 입장을 유지했다. 2026년 3분기 매출은 전년 대비 168% 늘었고 백로그는 1,325억 달러로 138% 증가했다.</p><p class="sr-card-ev"><span class="sr-tag">확인 가능한 자료</span>가이던스·백로그 수치는 당시 공시로 확인되는 값이고, '둔화가 이어진다'는 해석은 리포트의 추정이었다. 1년 뒤 실적이 그 추정과 반대로 나왔다.</p></li></ul></div>
<div class="sr-section"><h3 class="sr-h">리포트가 지적한 구조 — 돈과 칩이 도는 고리</h3><p class="sr-lede">엔비디아가 칩을 팔고 투자하고 되빌리는 사이, 부채는 CoreWeave에 남는다는 것이 리포트의 구조 주장이다.</p><ol class="sr-flow" role="list"><li class="sr-step"><span class="sr-step-no">1</span><strong class="sr-step-name">엔비디아</strong><span class="sr-step-role">공급자 · 투자자 · 고객</span><span class="sr-step-detail">GPU 100% 공급, 지분 1억 달러, IPO 2억 5천만 달러 매입, 지분율 7%</span></li><li class="sr-step"><span class="sr-step-no">2</span><strong class="sr-step-name">CoreWeave</strong><span class="sr-step-role">GPU 임대</span><span class="sr-step-detail">담보 차입(DDTL 11~15%)으로 칩을 사서 장기계약으로 임대. 가중평균 차입금리는 약 7.9%</span></li><li class="sr-step"><span class="sr-step-no">3</span><strong class="sr-step-name">대형 고객</strong><span class="sr-step-role">마이크로소프트 · OpenAI</span><span class="sr-step-detail">30~50% 싼 가격에 장기계약. 선수금 15~25%</span></li><li class="sr-step"><span class="sr-step-no">4</span><strong class="sr-step-name">담보 대출자</strong><span class="sr-step-role">자금 공급</span><span class="sr-step-detail">계약 현금흐름을 담보로 이자를 먼저 받는다 — 리포트는 주주가 마지막이라고 봤다</span></li></ol><p class="sr-flow-cap">※ 위 도식은 리포트가 주장하는 구조를 옮긴 것입니다. 각 연결의 사실 여부는 별개로 확인이 필요합니다.</p></div>
<div class="sr-section"><h3 class="sr-h">시간순으로 본 경과</h3><p class="sr-lede">총 12개 국면. 날짜 옆 배지는 그 사건이 공적 기록으로 확인되는지를 표시합니다.</p><ol class="sr-tl" role="list"><li class="sr-tl-item"><span class="sr-tl-no">1</span><div class="sr-tl-body"><div class="sr-tl-head"><time class="sr-tl-date">2022년 말</time><span class="sr-tl-kind">배경</span><span class="sr-badge" style="background:#4E7FA8;color:#FAF6EE;border:1px solid #4E7FA8" title="복수 언론이 독립적으로 보도한 내용">보도 교차확인</span></div><strong class="sr-tl-title">ChatGPT 이후의 연산 쟁탈전</strong><p class="sr-tl-text">2018년 암호화폐 폭락으로 채굴을 접고 2019년 GPU를 클라우드로 돌려놨던 전직 이더리움 채굴업체 CoreWeave가, 하이퍼스케일러들이 OpenAI의 연산 수요에 대비가 안 된 틈을 메우기 시작했다.</p></div></li><li class="sr-tl-item"><span class="sr-tl-no">2</span><div class="sr-tl-body"><div class="sr-tl-head"><time class="sr-tl-date">2023년 초</time><span class="sr-tl-kind">엔비디아</span><span class="sr-badge" style="background:#4E7FA8;color:#FAF6EE;border:1px solid #4E7FA8" title="복수 언론이 독립적으로 보도한 내용">보도 교차확인</span></div><strong class="sr-tl-title">엔비디아의 지분 투자와 되빌림 계약</strong><p class="sr-tl-text">엔비디아가 1억 달러를 투자하고 2027년까지 13억 달러 규모 임대 계약을 맺었다. 그 결과 엔비디아가 2023년 CoreWeave 매출의 15%를 차지하는 2대 고객이 됐다.</p></div></li><li class="sr-tl-item"><span class="sr-tl-no">3</span><div class="sr-tl-body"><div class="sr-tl-head"><time class="sr-tl-date">2025년 3월</time><span class="sr-tl-kind">고객</span><span class="sr-badge" style="background:#4E7FA8;color:#FAF6EE;border:1px solid #4E7FA8" title="복수 언론이 독립적으로 보도한 내용">보도 교차확인</span></div><strong class="sr-tl-title">IPO와 마이크로소프트의 증설 거절</strong><p class="sr-tl-text">주당 40달러로 상장했다. 공시에서 마이크로소프트가 2024년 매출의 62%를 차지했다고 밝혔다. 같은 달 마이크로소프트가 120억 달러 증설 옵션을 거절했다는 것이 리포트의 서술이다.</p></div></li><li class="sr-tl-item"><span class="sr-tl-no">4</span><div class="sr-tl-body"><div class="sr-tl-head"><time class="sr-tl-date">2025년 7월</time><span class="sr-tl-kind">조달</span><span class="sr-badge" style="background:#1B4F8A;color:#FAF6EE;border:1px solid #1B4F8A" title="법원 문서·공시·세관 기록·정부 발표로 확인되는 사실">공적 기록 확인</span></div><strong class="sr-tl-title">18억 달러 무담보채를 9.00%에 발행</strong><p class="sr-tl-text">조달 비용을 낮추려는 시도였지만 금리 자체가 9%대였다. 리포트는 이 숫자를 '싸지 않은 돈'의 근거로 들었다.</p></div></li><li class="sr-tl-item"><span class="sr-tl-no">5</span><div class="sr-tl-body"><div class="sr-tl-head"><time class="sr-tl-date">2025년 9월 8일</time><span class="sr-tl-kind">고객</span><span class="sr-badge" style="background:#1B4F8A;color:#FAF6EE;border:1px solid #1B4F8A" title="법원 문서·공시·세관 기록·정부 발표로 확인되는 사실">공적 기록 확인</span></div><strong class="sr-tl-title">마이크로소프트–Nebius 174억 달러 계약</strong><p class="sr-tl-text">마이크로소프트가 CoreWeave의 가장 가까운 경쟁사와 더 큰 계약을 맺었다. 1주 뒤 나온 Kerrisdale 리포트가 이 계약을 핵심 근거로 인용한다.</p></div></li><li class="sr-tl-item"><span class="sr-tl-no">6</span><div class="sr-tl-body"><div class="sr-tl-head"><time class="sr-tl-date">2025년 9월 15일</time><span class="sr-tl-kind">리포트 발간</span><span class="sr-badge" style="background:#1B4F8A;color:#FAF6EE;border:1px solid #1B4F8A" title="법원 문서·공시·세관 기록·정부 발표로 확인되는 사실">공적 기록 확인</span></div><strong class="sr-tl-title">Kerrisdale 공매도 리포트 — 적정가 $10</strong><p class="sr-tl-text">발간 직전 종가 112달러에서 적정가를 10달러로 제시했다. 1주 전 발표된 마이크로소프트–Nebius 계약을 '차별화가 없다'는 증거로 들었다. 그런데 발간 당일 주가는 7.8% 올라 120.71달러로 마감했다. 엔비디아가 CoreWeave의 미판매 용량을 최대 63억 달러 매입하는 계약을 같은 날 공시했기 때문이다.</p></div></li><li class="sr-tl-item"><span class="sr-tl-no">7</span><div class="sr-tl-body"><div class="sr-tl-head"><time class="sr-tl-date">2026년 1월 26일</time><span class="sr-tl-kind">엔비디아</span><span class="sr-badge" style="background:#1B4F8A;color:#FAF6EE;border:1px solid #1B4F8A" title="법원 문서·공시·세관 기록·정부 발표로 확인되는 사실">공적 기록 확인</span></div><strong class="sr-tl-title">엔비디아가 20억 달러를 추가 투자</strong><p class="sr-tl-text">엔비디아가 주당 87.20달러로 20억 달러를 추가 투자했다. 2030년까지 5GW 확장을 위한 것이라고 밝혔다. 인트레이터 CEO가 순환 거래 주장을 '터무니없다'고 반박한 날로부터 12일 뒤였다.</p></div></li><li class="sr-tl-item"><span class="sr-tl-no">8</span><div class="sr-tl-body"><div class="sr-tl-head"><time class="sr-tl-date">2026년 2~3분기</time><span class="sr-tl-kind">실적</span><span class="sr-badge" style="background:#1B4F8A;color:#FAF6EE;border:1px solid #1B4F8A" title="법원 문서·공시·세관 기록·정부 발표로 확인되는 사실">공적 기록 확인</span></div><strong class="sr-tl-title">매출이 리포트 전망과 반대로 폭증</strong><p class="sr-tl-text">2분기 매출 26억 달러(전년 대비 +112%), 3분기 36억 6,100만 달러(+168%)를 기록했다. 수요가 과장됐다는 전제가 흔들렸다.</p></div></li><li class="sr-tl-item"><span class="sr-tl-no">9</span><div class="sr-tl-body"><div class="sr-tl-head"><time class="sr-tl-date">2026년 10월</time><span class="sr-tl-kind">시장</span><span class="sr-badge" style="background:#4E7FA8;color:#FAF6EE;border:1px solid #4E7FA8" title="복수 언론이 독립적으로 보도한 내용">보도 교차확인</span></div><strong class="sr-tl-title">네오클라우드 동반 급락, 공매도 60억 달러 평가이익</strong><p class="sr-tl-text">AI 부채의 지속 가능성 우려로 CoreWeave·Nebius·IREN·Applied Digital·Core Scientific이 함께 밀렸다. 공매도 비중은 유통주식의 20~26%였고, 한 달 평가이익이 60억 달러(Nebius 29.4억, CoreWeave 17억)에 달했다.</p></div></li><li class="sr-tl-item"><span class="sr-tl-no">10</span><div class="sr-tl-body"><div class="sr-tl-head"><time class="sr-tl-date">2026년 11월 7일</time><span class="sr-tl-kind">조달</span><span class="sr-badge" style="background:#4E7FA8;color:#FAF6EE;border:1px solid #4E7FA8" title="복수 언론이 독립적으로 보도한 내용">보도 교차확인</span></div><strong class="sr-tl-title">채권 수익률이 16%를 넘어섰다</strong><p class="sr-tl-text">불과 다섯 달 전인 2026년 6월 쿠폰 9.625%로 발행한 12억 5,000만 달러 무담보채(2032년 만기)가 유통시장에서 16%를 넘는 수익률로 거래됐다. 다만 같은 분기 회사의 가중평균 차입금리는 약 7.9%였다.</p></div></li><li class="sr-tl-item"><span class="sr-tl-no">11</span><div class="sr-tl-body"><div class="sr-tl-head"><time class="sr-tl-date">2026년 11월 6~9일</time><span class="sr-tl-kind">고객</span><span class="sr-badge" style="background:#4E7FA8;color:#FAF6EE;border:1px solid #4E7FA8" title="복수 언론이 독립적으로 보도한 내용">보도 교차확인</span></div><strong class="sr-tl-title">마이크로소프트가 네오클라우드를 줄인다</strong><p class="sr-tl-text">마이크로소프트가 협력 네오클라우드 수를 줄이고 자체 데이터센터에 집중하기로 했다고 보도됐다. 블룸버그는 마이크로소프트가 '지연을 통제할 수 없고 비용이 자체 프로젝트보다 높다'고 판단하고 있다고 전했다. 마이크로소프트 자신은 '인프라 전략은 유연성과 선택에 기반하며 고객 수요에 비춰 투자를 정기적으로 재검토한다'고만 밝혔다. 오라클 계약 하나는 '용량이 사양에 맞지 않고 구세대 엔비디아 칩을 쓴다'는 이유로 갱신하지 않았다.</p></div></li><li class="sr-tl-item"><span class="sr-tl-no">12</span><div class="sr-tl-body"><div class="sr-tl-head"><time class="sr-tl-date">2026년 11월 10~11일</time><span class="sr-tl-kind">실적</span><span class="sr-badge" style="background:#1B4F8A;color:#FAF6EE;border:1px solid #1B4F8A" title="법원 문서·공시·세관 기록·정부 발표로 확인되는 사실">공적 기록 확인</span></div><strong class="sr-tl-title">3분기 실적 발표, 이튿날 주가 24.9% 반등</strong><p class="sr-tl-text">10일 장 마감 뒤 발표에서 매출 36억 6,100만 달러, 백로그 1,325억 달러(전년 대비 138% 증가), 조정 영업이익 3억 7,900만 달러(이익률 10%)를 내놨다. 다만 이자비용 8억 4,600만 달러에 순손실 7억 900만 달러, 설비투자는 금융리스 포함 145억 1,100만 달러였다. 9월 말 총부채는 469억 달러다. 주가는 10일 48.73달러로 마감한 뒤 11일 24.9% 올라 60.84달러가 됐다.</p></div></li></ol></div>
<div class="sr-section sr-reb"><h3 class="sr-h">대상 회사의 반박</h3><ul class="sr-reb-list" role="list"><li class="sr-reb-item"><strong>마이클 인트레이터 CEO</strong> <span class="sr-muted">(2026년 1월 14일)</span> — 엔비디아와의 순환 거래 주장을 '터무니없다'고 일축했다. 엔비디아 투자는 두 라운드 합쳐 약 3억 달러인데 회사가 조달한 자본은 250억 달러가 넘고 기업가치는 420억 달러인데, 그 지분으로 수요를 만들어낼 수는 없다는 것이다.</li><li class="sr-reb-item"><strong>CoreWeave</strong> <span class="sr-muted">(2026년 11월 10일)</span> — 3분기 매출 36억 6,100만 달러(전년 대비 168% 증가), 백로그 1,325억 달러, 조정 영업이익 3억 7,900만 달러(이익률 10%) 달성을 발표했다. 2026년 연간 매출 가이던스를 130~133억 달러로 올리고, 2026년 말 연환산 매출 200~210억 달러를 내다봤다.</li><li class="sr-reb-item"><strong>CoreWeave</strong> <span class="sr-muted">(2026년 11월 10일)</span> — 가중평균 차입금리가 약 7.9%이고 원금 40억 달러를 이미 상환했다고 밝혔다. 현재 금리 수준에서는 2027년까지 모회사 차원의 신규 무담보채를 발행하지 않고 계약담보대출과 고객 선수금으로 조달하겠다고 했다(모회사 차원 증분 조달은 50억 달러 미만 전망). 조정 순이익은 2028년 상반기 흑자 전환을 전망했다.</li></ul><p class="sr-lede">CoreWeave는 리포트에 조목조목 반박하는 별도 자료를 내지 않았다. 위 내용은 CEO 발언과 실적 발표에서 추린 것이다.</p></div>
<div class="sr-disclaimer"><strong>이 글은 투자 조언이 아닙니다.</strong> 위 내용은 Kerrisdale Capital가 발간한 공매도 리포트의 주장과 그에 대한 공개 자료를 정리한 것입니다. 이 블로그는 특정 종목의 매수·매도를 권유하지 않으며, 리포트의 주장에 동의하거나 반대하는 입장을 취하지 않습니다. 공매도 리포트는 작성자가 주가 하락에서 이익을 얻는 구조에서 나온 문서이고, 대상 회사의 반박과 이후 수사·재판 결과에 따라 사실관계가 달라질 수 있습니다. 투자 판단은 원문과 회사 공시를 직접 확인한 뒤 본인 책임으로 하십시오.</div>
</div>

## 왜 구조는 맞고 속도는 틀렸나

패턴에는 이유가 있습니다.

**구조는 공시에 적혀 있습니다.** 고객 집중도는 10-Q에 숫자로 나옵니다. 채권 금리는 발행 조건에 박혀 있습니다. 내구연한 회계 정책도 공개됩니다. 공매도 리서치는 이 숫자들을 모아 "이 회사의 약한 지점은 여기"라는 지도를 만드는 일에 능합니다. **애널리스트가 지나가는 숫자를 끝까지 파는 것이 그들의 일**이기 때문입니다.

**반면 속도는 아무도 모릅니다.** 2025년 9월에 2026년의 AI 연산 수요를 맞히는 것은 리포트의 일이 아니라 점쟁이의 일입니다. Kerrisdale은 3분기 가이던스가 꺾인 것을 보고 "성장이 멈춘다"고 읽었습니다. 실제로는 그 분기가 저점이었습니다.

이 비대칭은 공매도 리포트를 읽는 법을 말해줍니다. **리포트의 '진단'은 신뢰도가 높고 '처방'과 '시점'은 신뢰도가 낮습니다.** 적정가 10달러는 처방입니다. 매출 70%가 한 고객이라는 건 진단입니다. 둘을 같은 무게로 읽으면 안 됩니다.

실제로 이 리포트의 운명이 그랬습니다. 발간 당일 주가는 7.8% 올라 **120.71달러로 마감했습니다.** 같은 날 엔비디아가 미판매 용량을 최대 63억 달러 매입하는 계약을 공시했기 때문입니다. 그 뒤 두 달도 안 돼 65달러까지 빠졌고, 2026년 5월에는 다시 **138달러**까지 올랐다가 7월에 60달러로 내려왔습니다. **진단이 맞아도 주가는 제 속도로 움직입니다.** 적정가 10달러를 기다린 사람이 견뎌야 한 것은 1년의 상승이 아니라 **두 번의 왕복**이었습니다.

**그리고 1년은 짧은 기다림입니다.** 2016년 2월 24일, 'Zatarra'라는 가명을 쓴 공매도 투자자들이 독일 결제회사 와이어카드를 겨눈 101페이지 리포트를 냈습니다. 그 지적이 옳았음이 확정된 것은 **2020년 6월 25일**, 와이어카드가 19억 유로가 "없다"는 사실과 함께 파산을 신청한 날입니다. **4년 4개월입니다.** 그 사이 독일 금융감독청 BaFin은 와이어카드 주식의 공매도를 두 달간 금지했고, 바이에른 검찰은 리포트를 쓴 쪽을 시세조종으로 수사했습니다. **진단이 맞는 것과 그 진단으로 돈을 버는 것은 다른 문제입니다.**

와이어카드는 회계 부정 사건이고, CoreWeave에는 그런 혐의가 없습니다. 여기서 비교하는 것은 회사가 아니라 **리포트가 입증되기까지 걸린 시간**입니다.

**이 비대칭 자체도 처음이 아닙니다.** 1999년부터 2001년까지 미국 통신사들은 부채로 광섬유를 깔았습니다. 근거가 된 문장은 "인터넷 트래픽이 100일마다 두 배가 된다"였고, 이 문장은 1998년 미국 상무부 보고서 「The Emerging Digital Economy」에까지 실렸습니다. 출처를 거슬러 가면 1997년 민간 백서 하나, 그 백서의 출처는 한 통신사 임원의 1996년 말 발언이었습니다. **1년도 더 된 말 한마디가 산업 전체의 설비투자 계획서가 된 것입니다.**

실제 트래픽은 100일마다가 아니라 **1년마다** 두 배였습니다. 앤드루 오들리즈코가 집계한 미국 백본 트래픽은 2000년 12월 월 2만~3만 5천 테라바이트에서 2002년 12월 월 8만~14만 테라바이트로 늘었습니다. **붕괴기에도 2년 만에 네 배입니다. 수요는 진짜였습니다.**

그런데 망을 깐 회사가 죽었습니다. 글로벌크로싱은 한 번도 연간 흑자를 내지 못한 채 2002년 1월 파산을 신청했습니다. 자산 224억 달러, 부채 124억 달러, 연간 이자 6억 달러. 1999년 한때 470억 달러로 평가받던 회사입니다. **수요 전망이 맞아도 조달 구조가 틀리면 사업자는 죽습니다.** 수요와 생존은 다른 질문입니다.

다만 결정적인 차이가 하나 있습니다. 1999년의 광섬유는 **계약 없이** 수요 예측만으로 깔렸습니다. CoreWeave는 백로그 1,325억 달러, 즉 서명된 계약을 놓고 깝니다. 그래서 리포트의 '수요 과장' 주장이 틀린 것이고, 동시에 그래서 **위험이 "수요가 있나"에서 "고객이 그 계약을 지키나"로 옮겨간** 것입니다.

## 지금 숫자가 말하는 것

2026년 3분기 실적을 한 표로 놓으면 양쪽 주장이 동시에 보입니다.

| 항목 | 2026년 3분기 | 의미 |
|---|---|---|
| 매출 | **36억 6,100만 달러** (전년 대비 +168%) | 수요 과장론은 틀렸다 |
| 백로그 | **1,325억 달러** (+138%) | 계약은 쌓이고 있다 |
| 조정 영업이익 | **3억 7,900만 달러** (이익률 10%) | 가이던스 2억~2억 6천만을 넘겼다 |
| 이자비용 | **8억 4,600만 달러** | 조정 영업이익의 2.2배 · GAAP 영업이익의 4.1배 |
| 순손실 | **−7억 900만 달러** | 영업으로 벌어 이자를 못 낸다 |
| 설비투자 | **145억 1,100만 달러** (금융리스 포함) | 성장을 사려면 계속 써야 한다 |
| 총부채 (9월 말) | **469억 달러** (6월 말 351억) | 한 분기에 118억 늘었다 |
| 조달 금리 | 가중평균 **약 7.9%** · 2032년물 유통 **16% 초과** | 평균은 낮고 한계는 높다 |

*출처: CoreWeave 2026년 3분기 실적 발표(2026-11-10). 채권 유통 수익률은 2026-11-07 보도 기준*

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px;margin:24px 0;">
<svg viewBox="0 0 760 250" style="width:100%;height:auto" role="img" aria-label="CoreWeave 2026년 3분기 손익 구조. 매출 36억 6,100만 달러에서 공시된 조정 영업이익은 3억 7900만 달러인데 이자비용이 8억 4600만 달러로 그보다 커서 순손실 7억 900만 달러가 났다.">
<text x="0" y="18" font-size="15" font-weight="700" fill="#23201D">영업으로 번 돈보다 이자가 크다</text>
<text x="0" y="38" font-size="11.5" fill="#8A8378">CoreWeave 2026년 3분기 · 단위 백만 달러</text>
<text x="0" y="76" font-size="12" fill="#23201D">조정 영업이익</text>
<rect x="150" y="60" width="143" height="24" fill="#A8BDD2" rx="3" />
<text x="162" y="78" font-size="12.5" font-weight="700" fill="#23201D">379</text>
<text x="303" y="78" font-size="11" fill="#8A8378">공시값 · 가이던스 200~260 상회</text>
<text x="0" y="124" font-size="12" font-weight="700" fill="#23201D">이자비용</text>
<rect x="150" y="108" width="320" height="24" fill="#1B4F8A" rx="3" />
<text x="162" y="126" font-size="12.5" font-weight="700" fill="#FAF6EE">846</text>
<text x="480" y="126" font-size="11" fill="#8A8378">조정 영업이익의 2.2배</text>
<text x="0" y="172" font-size="12" fill="#23201D">순손실</text>
<rect x="150" y="156" width="268" height="24" fill="#4E7FA8" rx="3" />
<text x="162" y="174" font-size="12.5" font-weight="700" fill="#FAF6EE">−709</text>
<text x="428" y="174" font-size="11" fill="#8A8378">같은 분기 설비투자 14,511</text>
<text x="0" y="212" font-size="11" fill="#8A8378">※ 매출은 1년에 168% 늘었다. 그런데도 순손실인 이유는 이자와 감가상각이 함께 커지기 때문이다.</text>
<text x="0" y="232" font-size="11" fill="#8A8378">출처: CoreWeave 2026년 3분기 실적 발표(2026-11-10). 모두 공시값이다.</text>
</svg>
<figcaption style="font-size:13px;color:#8A8378;margin-top:10px;">Kerrisdale이 맞춘 쪽과 틀린 쪽이 같은 표에 있습니다. 성장은 리포트 전망을 넘겼고, 조달 비용 구조는 리포트가 본 대로입니다.</figcaption>
</figure>

**성장과 재무가 서로 다른 말을 합니다.** 매출은 168% 늘었는데 순손실입니다. 조정 영업이익률 10%를 달성했지만, 그렇게 번 **3억 7,900만 달러**보다 이자 **8억 4,600만 달러**가 큽니다. 그리고 그 성장을 유지하려면 분기당 145억 달러(금융리스 포함)를 더 써야 합니다.

**그래서 질문이 "수요가 있나"에서 "돈을 계속 빌릴 수 있나"로 옮겨갔습니다.** 1년 전 리포트가 지적한 지점이 정확히 여기입니다. 회사도 이걸 알아서, 현재 금리 수준에서는 2027년까지 모회사 차원의 신규 무담보채를 발행하지 않고 계약담보대출과 고객 선수금으로 버티겠다고 밝혔습니다.

## 한국 기업에는 어떻게 닿나

CoreWeave 주가는 한국 투자자 대부분에게 남의 일입니다. 그런데 **이 회사의 설비투자는 남의 일이 아닙니다.**

설비투자의 상당 부분이 엔비디아 시스템 구매로 나가고, 그 시스템에 들어가는 HBM은 SK하이닉스와 삼성전자가 공급합니다. 나머지는 데이터센터 건물과 전력설비, 네트워킹입니다. CoreWeave는 3분기 기준 **데이터센터 52곳, 가동 용량 1.7GW, 계약 용량 4.6GW**를 운영합니다. 공시에 GPU 조달 비중이 따로 나오지 않으니 비율을 단정할 수는 없지만, **네오클라우드의 조달 조건이 한국 공급망의 주문으로 번역될 수 있다**는 것까지는 말할 수 있습니다.

그래서 지금 눈여겨볼 숫자는 CoreWeave의 매출이 아니라 **조달 비용**입니다. 다섯 달 전 쿠폰 9.625%로 발행한 채권이 지금 16% 넘는 수익률로 거래됩니다. 가중평균 차입금리 7.9%와 비교하면, **평균은 아직 낮은데 새로 빌리는 돈의 가격이 올라가 있다**는 뜻입니다.

여기에 **마이크로소프트가 협력 네오클라우드 수를 줄이고 자체 데이터센터로 돌아서고 있습니다.** 블룸버그는 마이크로소프트가 "지연을 통제할 수 없고 비용이 자체 프로젝트보다 높다"고 판단하고 있다고 전했습니다. 마이크로소프트 자신은 "인프라 전략은 유연성과 선택에 기반한다"고만 밝혔습니다.

**둘이 겹치면 설비투자 속도가 느려집니다.** 10월에 네오클라우드 다섯 곳이 함께 밀리고 공매도 측이 한 달 만에 60억 달러 평가이익을 낸 것도 같은 걱정이었습니다. 공매도 비중이 유통주식의 20~26%까지 올라간 상태였습니다.

![Electrical substation transformer, Love Lane, Liverpool, England.](https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/Electrical_substation_transformer%2C_Love_Lane%2C_Liverpool.JPG/1280px-Electrical_substation_transformer%2C_Love_Lane%2C_Liverpool.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail)
*이미지: Rept0n1x · [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Electrical_substation_transformer,_Love_Lane,_Liverpool.JPG) · [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)*

다만 반대쪽도 봐야 합니다. 백로그 1,325억 달러는 **이미 받아둔 계약**입니다. 선수금을 15~25% 받는 구조라면 고객이 돈을 먼저 넣은 물량입니다. 이게 무너지려면 고객 쪽에서 계약을 깨야 하는데, 그건 다른 차원의 사건입니다.

## So What — 공매도 리포트는 답이 아니라 점검표다

정리하면 이렇습니다.

**Kerrisdale 리포트의 가치는 적정가 10달러에 있지 않았습니다.** 그 숫자는 틀렸습니다. 가치는 **"이 회사가 깨지려면 무엇이 먼저 깨져야 하는지"의 목록**에 있었습니다. 고객 한 곳이 매출의 70%다. 담보 대출 금리가 11~15%다. 부채가 2028년 400억 달러를 넘는다. 1년이 지나 실제로 흔들린 지점이 정확히 그 목록 안에 있습니다.

**반대로 리포트가 가장 자신 있게 쓴 문장이 가장 많이 틀렸습니다.** "수요는 과장됐다", "성장이 멈춘다", "적정가 10달러". 공매도 리포트는 발행사가 하락에 돈을 걸고 쓰는 문서이고, 그 베팅이 설득력을 가지려면 결론이 선명해야 합니다. 그래서 **진단은 과소평가되고 처방은 과대평가되는 쪽으로 기울어집니다.**

이건 저자의 실력 문제가 아니라 장르의 구조 문제입니다. **공매도는 시간에 비용이 붙는 포지션입니다.** 대차 수수료가 매일 나가고 손실에는 상한이 없습니다. 그래서 공매도 리포트는 "언젠가 드러난다"고 쓸 수 없고 "지금 90% 하락"이라고 써야 합니다. **처방이 과격해지는 것은 분석의 결론이 아니라 포지션의 요구입니다.** 와이어카드에서는 4년을 기다리는 동안 감독당국이 공매도를 금지하고 작성자를 수사했습니다 — 진단이 맞아도 포지션이 먼저 죽을 수 있습니다.

그러니 다음에 공매도 리포트를 받으면 순서를 이렇게 바꿔보십시오.

1. **목표가를 먼저 가립니다.** 그건 저자의 베팅이지 분석이 아닙니다
2. **공시로 확인되는 숫자만 따로 적습니다.** 고객 집중도, 부채, 금리, 회계 정책 — 이건 누구나 검증할 수 있습니다
3. **회사가 무엇을 부인하지 않았는지 봅니다.** CoreWeave는 순환 거래는 "터무니없다"고 했지만 고객 집중도는 부인하지 않았습니다. 부인하지 않은 항목이 더 중요합니다
4. **"그래서 무엇이 먼저 깨지나"만 남깁니다.** 그게 리포트에서 건질 전부입니다

**공매도 리포트의 쓸모는 주가 전망이 아니라 취약점 지도입니다.** 1년 전 그 지도는 꽤 정확했습니다. 다만 지도에 "여기서 무너진다"고 적혀 있어도, 언제 무너지는지는 적혀 있지 않았습니다.

---

**함께 보면 좋은 글**
- [블루쓰나미 속 AI 데이터센터, 미국 민주당의 생각은?](/blog/2026-11-06-us-data-center-democrats-electricity/) — 데이터센터 전기요금을 누가 부담하나
- [민주당이 의회를 가져갔다, K배터리는 살아나나](/blog/2026-11-10-us-democrats-energy-policy-korea-battery/) — 미국 정책이 한국 공급망에 닿는 경로

**출처**
- [Kerrisdale Capital — CoreWeave, Inc. (CRWV): Artificial Returns (2025년 9월, 리포트 원문 PDF)](https://www.kerrisdalecap.com/wp-content/uploads/2025/09/Kerrisdale-CoreWeave.pdf) — 주장 전문, 적정가 10달러, 고객집중도·엔비디아 관계·유닛 이코노믹스
- [CoreWeave — 2026년 3분기 실적 발표문](https://investors.coreweave.com/news/news-details/2026/CoreWeave-Reports-Strong-Third-Quarter-2026-Results/default.aspx) — 매출 36억 6,100만 달러, 백로그 1,325억 달러, 조정 영업이익 3억 7,900만 달러, 이자비용·순손실·설비투자, 9월 말 총부채 469억 달러, 가중평균 차입금리 7.9% (1차 출처)
- [CoreWeave — FY2025 Form 10-K (SEC)](https://www.sec.gov/Archives/edgar/data/1769628/000176962826000104/crwv-20251231.htm) — 마이크로소프트 매출 비중 약 67%, GPU 내구연한 6년 (1차 출처)
- [Investing.com — CoreWeave Q3 2026 slides: revenue surges 168%, margins expand](https://www.investing.com/news/company-news/coreweave-q3-2026-slides-revenue-surges-168-margins-expand-93CH-5017372) — 3분기 실적 슬라이드 해설
- [24/7 Wall St. — CoreWeave's Bonds Now Yield More Than 16%](https://247wallst.com/investing/2026/11/07/coreweaves-bonds-now-yield-more-than-16-days-before-earnings/) — 채권 유통 수익률
- [Reuters(US News 게재) — Short Sellers Make $6 Billion in Unrealized Profits as Neoclouds Slide on AI Debt Fears](https://money.usnews.com/investing/news/articles/2026-10-22/short-sellers-pocket-6-billion-in-profits-as-neoclouds-slide-on-ai-debt-fears) — 10월 급락, 공매도 비중 20~26%, 평가이익 내역
- [Benzinga — Microsoft Scales Back Neocloud Partnerships](https://www.benzinga.com/markets/tech/26/11/63017347/microsoft-cuts-neocloud-partners-ai-data-center-expansion) · [Dataconomy — Microsoft Cuts Neocloud Partners To Favor Own Data Centers](https://dataconomy.com/2026/11/09/microsoft-cuts-neocloud-partners-to-favor-own-data-centers/) — 마이크로소프트의 네오클라우드 축소
- [Benzinga — CoreWeave CEO Calls Nvidia Circular Financing Claims 'Ridiculous'](https://www.benzinga.com/markets/equities/26/01/49834939/coreweave-ceo-calls-nvidia-circular-financing-claims-ridiculous-says-stake-too-small-to-prop-up-42-billion-company) — 인트레이터 CEO 반박
- [CNBC — CoreWeave earnings put debt-fueled AI build-out under scrutiny](https://www.cnbc.com/2026/11/10/coreweave-earnings-preview-debt-capex.html) — 부채 구조 쟁점 (실적 발표 전 프리뷰, 수치는 2분기 기준)
- [CoreWeave — NVIDIA and CoreWeave Strengthen Collaboration (2026-01-26)](https://investors.coreweave.com/news/news-details/2026/NVIDIA-and-CoreWeave-Strengthen-Collaboration-to-Accelerate-Buildout-of-AI-Factories/default.aspx) · [CNBC 보도](https://www.cnbc.com/2026/01/26/3coreweave-nvidia-stock-ai-data-centers.html) — 엔비디아 20억 달러 추가 투자, 주당 87.20달러, 2030년까지 5GW
- [Investing.com — CoreWeave prices $1.25B and €2B senior notes offering (2026-06-11)](https://www.investing.com/news/company-news/coreweave-prices-125b-and-2b-senior-notes-offering-93CH-4738152) — 2032년 7월 만기 쿠폰 9.625%, 12억 5,000만 달러 발행 조건
- [Andrew M. Odlyzko — Internet traffic growth: Sources and implications (미네소타대)](https://www-users.cse.umn.edu/~odlyzko/doc/itcom.internet.growth.pdf) — '100일마다 두 배' 통설의 기원과 실제 백본 트래픽 집계
- [Wikipedia — Global Crossing](https://en.wikipedia.org/wiki/Global_Crossing) — 파산 당시 자산·부채·이자비용, 1999년 기업가치
- [Wikipedia — Wirecard scandal](https://en.wikipedia.org/wiki/Wirecard_scandal) · [Columbia Law School Blue Sky — The Fall of Wirecard](https://clsbluesky.law.columbia.edu/2020/07/08/the-fall-of-wirecard/) — 2020년 6월 파산, BaFin의 공매도 금지와 작성자 수사
- [Nebius Group 6-K (SEC, 2025-09)](https://www.sec.gov/Archives/edgar/data/1513845/000110465925088312/tm2525580d1_6k.htm) — 마이크로소프트 174억 달러 계약 발표 시점

*※ 이 글은 특정 종목의 매수·매도를 권유하지 않습니다. 본문에 언급된 국내 기업에 대한 실적·주가 전망도 아닙니다. 공매도 리포트는 발행사가 주가 하락에서 이익을 얻는 구조에서 나온 문서이며, 이 글은 그 주장의 사실 여부를 보증하지 않습니다. 수치는 2026년 11월 12일 기준입니다.*
