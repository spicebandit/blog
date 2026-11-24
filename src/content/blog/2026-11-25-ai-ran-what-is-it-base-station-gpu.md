---
title: "AI-RAN이란 — 기지국이 AI 서버가 된다는 말의 실제"
description: "AI-RAN은 기지국 장비에서 통신 처리와 AI 연산을 같은 하드웨어로 돌리는 구조다. 그런데 한 이름 아래 수익성이 전혀 다른 세 갈래가 섞여 있다. 한국이 450억을 넣은 쪽과 엔비디아가 2,000억 달러 RAN 시장 안의 기회로 가리키는 쪽을 갈라서 읽는다."
pubDate: 2026-11-25T05:36:51+09:00
category: ai
tags: ["AI-RAN", "6G", "데이터센터 전력", "엔비디아"]
---

**답부터.** AI-RAN은 기지국 장비 안에서 **통신 처리와 AI 연산을 같은 하드웨어로 돌리는 구조**다. 기지국에 GPU를 넣고, 통신이 쓰지 않는 연산력을 AI 추론에 빌려주자는 발상이다. 플랫폼 제품은 이미 발표됐지만 **상용 가용성은 2027년 목표**다. 노키아의 공개 로드맵 기준으로 2026년 파일럿, 2027년 상용 시작, 2028년 대규모 배치다.

그런데 "기지국이 AI 서버가 된다"는 한 문장에는 **돈의 성격이 전혀 다른 세 가지 사업**이 섞여 있다. 하나는 하드웨어를 더 사지 않아도 지금 수익이 계산되고, 하나는 수익률이 8.2배와 0.51배 사이에서 흔들리며, 하나는 아직 고객이 특정되지 않았다. 한국 정부가 450억 원을 넣은 과제는 이 중 **첫 번째**다. 엔비디아가 2,000억 달러 RAN 시장 안의 기회로 가리키는 것은 **두 번째**다. 같은 이름으로 불리지만 같은 이야기가 아니다.

이 글은 그 셋을 갈라 보여주는 데 목적이 있다. 특정 기업의 주식에 대한 의견이 아니며, 투자 조언도 아니다.

| 자주 찾는 질문 | 한 줄 답 |
|---|---|
| AI-RAN이 뭔가 | 기지국 장비에서 통신 신호 처리와 AI 연산을 같은 가속 하드웨어로 동시에 돌리는 구조 |
| 지금 쓸 수 있나 | 아니다. 2026년 실증·시험망 단계. 노키아 로드맵은 2027년 상용 시작, 2028년 대규모 배치 |
| 돈이 되나 | 갈린다. 소프트웨어만 얹는 쪽은 계산이 서고, GPU를 증설하는 쪽은 **AI 토큰 가격 하나에 회수율이 16배 차이**난다 |

![a tower with several cell phones on top of it](https://images.unsplash.com/photo-1643155193188-38eb08e2b54f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxjZWxsJTIwdG93ZXIlMjBhbnRlbm5hfGVufDF8MHx8fDE3OTU1NTA5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [David Arrowsmith](https://unsplash.com/@devarrowsmith?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-tower-with-several-cell-phones-on-top-of-it-SsAFdirwkXc?utm_source=spice-bandit-blog&utm_medium=referral)*

## AI-RAN이란 무엇인가 — 세 갈래를 먼저 갈라야 한다

AI-RAN 얼라이언스는 2024년 2월 26일 MWC에서 출범했다. 소프트뱅크와 엔비디아가 주도했고, 2026년 10월 기준 17개국 이상에서 **142개 이상의 기관**이 참여한다(2026년 2월 MWC 시점에는 132개였다). 집행 멤버에는 ARM·에릭슨·마이크로소프트·노키아·엔비디아·삼성전자·소프트뱅크·T-Mobile·SK텔레콤·퀄컴·보다폰·노스이스턴대·도쿄대·딥시그가 들어 있다.

중요한 것은 이 얼라이언스가 **작업반을 셋으로 나눠 놓았다는 점**이다. 이 구분을 모르면 기사와 보도자료가 전부 같은 말처럼 읽힌다.

| 갈래 | 무엇을 하는가 | 추가 하드웨어 | 수익이 어디서 오나 |
|---|---|---|---|
| **AI for RAN** | AI로 무선 성능 자체를 개선. 채널 추정, 간섭 제거, 스케줄링, 이동성 관리 | 필요 없음(기존 장비에 소프트웨어) | 주파수 효율 상승 → **설비 증설 연기** |
| **AI and RAN** | 통신과 AI 연산이 **같은 인프라를 공유**. 남는 연산력을 AI에 동적 배분 | GPU 증설 필수 | 외부 AI 사업자에게 **연산력 임대** |
| **AI on RAN** | 망과 엣지 인프라로 **AI 서비스를 전달** | 엣지 설비 | 서비스 매출(아직 미특정) |

*출처: AI-RAN Alliance 작업반 구성 및 Light Reading, "Nvidia threatens to reshape telecom with AI-plus-RAN plan"*

세 갈래의 돈 흐름이 다르다는 게 핵심이다. **AI for RAN은 비용을 줄이는 이야기**다. 하드웨어를 더 사지 않고 소프트웨어로 주파수 효율을 올리면, 원래 내년에 증설해야 했던 기지국을 1년 미룰 수 있다. 절감액이 그대로 수익이다.

반면 **AI and RAN은 매출을 새로 만드는 이야기**다. GPU를 사서 꽂고, 그 연산력을 외부에 팔아 투자비를 회수한다. 투자가 먼저 나가고 수익은 "누가 사 줄 것인가"에 달려 있다. 이 구조적 차이가 뒤에 나올 모든 숫자의 갈림길이 된다.

## 엔비디아의 숫자 — 1달러당 5달러, 219%는 어디서 나왔나

엔비디아와 소프트뱅크가 2024년 11월 12일 보도자료에서 제시한 수치는 구체적이다. 2년 전 추정임을 염두에 두고 읽어야 한다. 엔비디아 뉴스룸의 원문은 이렇다.

> "NVIDIA and SoftBank estimate that telco operators can earn roughly **$5 in AI inference revenue from every $1 of capex** it invests in new AI-RAN infrastructure."

그리고 수익률 수치도 함께 나온다.

> "**Taking into account its opex and capex costs,** SoftBank estimates it can achieve a **return of up to 219%** for every AI-RAN server it adds to its infrastructure."

이 숫자가 서는 전제가 바로 뒤에 적혀 있다. 이 문장이 AI-RAN 서사 전체의 토대다.

> "Traditional telco networks are designed to handle peak loads and, on average, have used **only one-third of that capacity**. With the common computing capability provided by AI-RAN, it is expected that telcos now have the opportunity to monetize the **remaining two-thirds** capacity for AI inference services."

즉 논리는 "통신망은 피크 대응용으로 지어져 평소엔 용량의 3분의 1만 쓴다 → 남는 3분의 2를 판다"다. 깔끔하다. 다만 **이 추정치는 양사가 직접 낸 것**이고, 양사 모두 이 구조가 팔리면 이익을 얻는 당사자다. 소프트뱅크는 가나가와현 야외 실증에서 "통신 품질을 유지하면서 잔여 용량으로 AI 추론을 동시 수행"하는 데 성공했다고 밝혔고, 게이오대 쇼난후지사와 캠퍼스에서는 GH200 서버 **한 대로 100MHz 4T4R 프로파일 20셀**을 처리하며 100대 기기 영상 스트리밍과 LLM 기반 4족 로봇, 자율주행 AI를 동시에 돌렸다. 기술 실증은 실제로 됐다. 문제는 경제성이다.

## 학술 모델은 범위로 답한다 — 8.2배와 0.51배를 함께 내놓는다

양사 추정을 수치 모델로 다시 계산한 자료가 2026년 3월에 나왔다. 노스이스턴대의 가브리엘레 젬미·미켈레 폴레세·토마소 멜로디아가 발표한 「개방형·프로그래머블 AI-RAN의 비용 모델링과 수익 기회를 위한 기술경제 프레임워크」(arXiv 2603.28680)다. 논문은 5G 물리계층 처리 벤치마크에 실제 트래픽 모델과 LLM 추론 수요 프로파일을 결합해 비용과 수익을 함께 계산했다.

다만 **이 논문도 완전한 외부자의 것은 아니다.** 폴레세는 AI-RAN 얼라이언스의 'AI-and-RAN' 작업반 의장이고, 노스이스턴대는 2024년 소프트뱅크·엔비디아와 함께 얼라이언스를 창립한 집행 멤버다. 이 글이 뒤에서 "누가 추정한 숫자인가"를 점검 항목으로 내세우는 만큼, 같은 기준을 이 근거에도 적용해 둔다.

논문의 출발점은 냉정하다. 초록은 이렇게 시작한다.

> "The large-scale deployment of 5G networks has **not delivered the expected return on investment** for mobile network operators, raising concerns about the economic viability of future 6G rollouts. … However, **the economic case for such systems remains unsubstantiated**."

이 전제는 5G만의 것이 아니다. 2000년 4월 영국 3G 주파수 경매 낙찰총액은 225억 파운드였고, 넉 달 뒤 독일 경매는 505억 유로를 걷었다. 둘 다 "영상통화와 모바일 인터넷이라는 새 수익원"을 깔고 계산한 값이었다. 1996년 미국 통신법 이후 5년간 업계가 설비에 쏟은 돈은 5,000억 달러가 넘고 대부분 차입이었다. 2002년 상원 청문회에서 FCC 의장 마이클 파월은 업계 부채를 "1조 달러"라고 말했고, 회사채 투자자가 건진 것은 20% 남짓이었다.

국내 사례는 더 짧고 선명하다. KT와 SK텔레콤은 2006년 와이브로 상용화 이후 2조 1,000억 원을 투자했다. 가입자는 2012년 12월 104만 명으로 정점을 찍고 2018년 1월 33만 4,000명으로 줄었다. 누적 매출은 2,300억 원 — 투자비의 10분의 1이다. 2018년 12월 31일 자정에 전파를 껐다. 세대마다 "통신 요금 말고 다른 데서 번다"는 약속이 붙었고, 회수는 결국 요금제에서 났다.

그런데 논문의 결론은 긍정적이다. "토큰 감가, 수요 변동, GPU 서빙 밀도를 달리한 여러 시나리오에서 GPU 중심 배치의 추가 자본·운영 비용이 AI-on-RAN 매출로 상쇄되며 **최대 8배의 투자 회수율**을 낸다"고 적었다.

여기서 읽어야 할 단어는 "최대(up to)"다. 2026년 10월, RCR Wireless의 애널리스트 비시 난달이 같은 모델을 인용해 10년 투자 기준으로 다시 돌렸다. 결과는 절벽이 아니라 계단이었다. 효율 개선이 토큰 가격 하락을 상쇄하면 8.2배, 가격이 다소 빠르게 떨어지면 2.7배, 더 벌어지면 약 1.3배, 가장 공격적인 가정에서는 **0.51배**다. 0.51배는 원금의 절반만 돌아온다는 뜻이다.

<figure>
<svg viewBox="0 0 680 312" role="img" aria-label="토큰 가격 가정에 따라 투자 회수율이 8.2배에서 2.7배, 1.3배를 거쳐 0.51배까지 떨어진다" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px">
<text x="24" y="36" font-size="17" font-weight="700" fill="#23201D">같은 설비, 같은 모델 — 회수율은 16배 갈린다</text>
<text x="24" y="58" font-size="12.5" fill="#8A8378">기지국 GPU에 AI 추론을 얹었을 때 10년 투자 회수 배수. 높을수록 유리</text>
<line x1="150" y1="80" x2="150" y2="252" stroke="#E5DECF" stroke-width="1"/>
<text x="140" y="107" font-size="13" fill="#23201D" text-anchor="end">효율 개선이 상쇄</text>
<rect x="150" y="86" width="460" height="32" fill="#A8BDD2"/>
<text x="598" y="108" font-size="14" font-weight="700" fill="#23201D" text-anchor="end">8.2배</text>
<text x="140" y="149" font-size="13" fill="#23201D" text-anchor="end">토큰가 다소 하락</text>
<rect x="150" y="128" width="151" height="32" fill="#A8BDD2"/>
<text x="311" y="150" font-size="14" font-weight="700" fill="#23201D">2.7배</text>
<text x="140" y="191" font-size="13" fill="#23201D" text-anchor="end">더 하락</text>
<rect x="150" y="170" width="73" height="32" fill="#4E7FA8"/>
<text x="233" y="192" font-size="14" font-weight="700" fill="#23201D">1.3배</text>
<text x="140" y="233" font-size="13" fill="#23201D" text-anchor="end">가장 공격적 가정</text>
<rect x="150" y="212" width="29" height="32" fill="#1B4F8A"/>
<text x="233" y="234" font-size="14" font-weight="700" fill="#1B4F8A">0.51배 — 원금 손실</text>
<line x1="206" y1="80" x2="206" y2="252" stroke="#8A8378" stroke-width="1" stroke-dasharray="4 3"/>
<text x="206" y="272" font-size="12" fill="#8A8378" text-anchor="middle">1.0배 = 원금 회수선</text>
<text x="24" y="298" font-size="12" fill="#8A8378">출처: Gemmi·Polese·Melodia(arXiv 2603.28680) 모델을 RCR Wireless가 재계산한 시나리오</text>
</svg>
<figcaption>토큰 가격이 결정적 변수다. 같은 설비·같은 모델인데 한쪽 끝과 다른 쪽 끝이 16배 차이 난다.</figcaption>
</figure>

**이것이 AI-RAN 경제성 논쟁의 핵심이다.** 8.2배는 거짓이 아니고 0.51배도 거짓이 아니다. 둘은 같은 과잉투자 시나리오의 양 끝이다. 그리고 그 사이를 가르는 변수는 통신사가 통제할 수 없는 것 — **AI 추론 가격**이다. 지난 2년간 주요 모델의 토큰 단가가 어떤 속도로 떨어졌는지를 떠올리면, 어느 쪽 끝이 더 현실적인지는 각자 판단할 문제다.

## "남는 시간에 판다"는 전제가 흔들린다

엔비디아 논리의 뼈대는 "평소엔 용량의 3분의 1만 쓰니 나머지를 판다"였다. 흔히 "새벽에 트래픽이 적을 때 GPU를 빌려준다"로 옮겨진다. 그런데 **빌려줄 시간과 사 갈 시간이 겹치지 않는다**는 문제가 있다.

앞의 학술 모델은 RAN 수요와 LLM 수요가 **오후 2시에서 6시 사이에 가장 세게 충돌**한다고 보고했다. 당연하다. 기업과 개인이 AI를 가장 많이 쓰는 시간은 업무 시간이고, 통신 트래픽이 많은 시간도 사람이 깨어 있는 시간이다. 연산력이 남는 새벽 3시에는 그것을 사 갈 수요도 함께 줄어든다. "남는 용량"과 "팔리는 용량"은 같은 말이 아니다.

유휴 설비를 팔아 새 사업을 만든 사례로 가장 자주 인용되는 것이 아마존 웹서비스다. 그런데 그 이야기가 사실이 아니다. 2003년 AWS 최초 제안서를 공동 작성한 벤저민 블랙은 쇼핑몰의 남는 서버를 빌려줘 AWS가 됐다는 통설에 대해 "그 얘기는 왜 안 죽나. 완전히 거짓이다"라고 못 박았다. 그의 설명은 이렇다 — "첫날부터 AWS의 모든 부분은 AWS를 위해 따로 만들어졌다." 2003년 제안은 애플리케이션과 인프라를 분리하자는 것이었고, EC2는 2006년에 전용 설비로 출시됐다. 연산력 임대가 사업이 된 가장 큰 선례는 **남는 것을 판 쪽이 아니라 팔 것을 따로 지은 쪽**이었다는 뜻이다. 엔비디아 논리의 뼈대인 "남는 3분의 2"는 전자에 기대 있다.

난달의 계산은 더 구체적이다. GPU 200장에 하드웨어 추가 비용 400만 달러를 5년에 걸쳐 회수하려면, GPU-시간당 공헌이익 1달러를 가정할 때 **가용 시간의 약 60%가 매시간 돈을 벌어야** 한다. 그것도 자본비만 겨우 덮는 수준이고, 유지보수와 예비 용량 확보는 아직 계산에 들어가지도 않았다.

통신사 쪽에서도 같은 우려가 공개적으로 나왔다. SK텔레콤 6G 기술팀의 김동욱 박사는 2026년 9월 인텔리전트 RAN 포럼에서 "AI-RAN의 가장 큰 위험은 기술적 실패가 아니라 **초기 5G의 실수를 반복하는 것**"이라고 지적했다. 5G 때 모바일 엣지 컴퓨팅(MEC)과 네트워크 슬라이싱은 규격은 다 나왔는데 상용 서비스로 내려오지 못했다. 수요가 없었고, 공급도 늦었다. 슬라이싱은 5G 단독규격(SA) 코어를 전제로 하는데 BT EE는 2024년 9월에야 5G SA를 켰고, 2025년 말까지 '정적 슬라이스'를 내놓겠다던 약속은 이행되지 않았다. 2026년 현재 영국 3사(EE·버진미디어O2·보다폰스리) 가운데 상용 슬라이싱을 판매하는 곳은 없다.

그 약속의 원문을 보면 기분이 묘해진다. 2014년 9월, 화웨이·IBM·인텔·노키아네트웍스·NTT도코모·보다폰 6사가 공동으로 낸 모바일 엣지 컴퓨팅 기술백서는 이렇게 적었다. "사업자는 무선망 엣지를 제3자 파트너에게 열어, 그들이 혁신적인 애플리케이션과 서비스를 가입자·기업·버티컬 영역에 빠르게 배치하도록 할 수 있다." 백서의 2장 제목은 「이동통신 기지국의 진화」였다. ETSI는 그해 10월 30일 산업규격그룹(ISG) 신설을 발표하고 12월에 작업을 시작했으며, 2015년 중반까지 용어·서비스 시나리오·기술 요구사항·PoC 프레임워크·참조 아키텍처 5건을 내놓기로 했다. 규격은 예정대로 나왔다. 12년이 지난 지금, BT가 운영하는 AWS 웨이브렝스 사이트는 2023년 3월 개소한 맨체스터 1곳이고, BT 홀세일 담당 임원은 "웨이브렝스 사이트를 더 깔 계획은 현재 없다"고 말했다. 그리고 지금 AI-RAN 얼라이언스 집행 멤버 명단에는 노키아와 보다폰이, 노키아가 꼽은 AI-RAN 참여 사업자 명단에는 NTT도코모가 다시 올라 있다. 같은 회사들이 같은 문장을 12년 만에 다시 쓰고 있다.

AI-RAN 얼라이언스의 AI-on-RAN 작업반이 2026년 10월 범위를 "기술이 아니라 서비스 중심"으로 바꿔 엣지 추론·피지컬 AI·시맨틱 통신·멀티모달 스펙트럼 센싱 네 가지 주제를 내세운 것도 같은 문제의식이다. RCR Wireless는 얼라이언스 의장 알렉스 최(소프트뱅크 선진기술연구소 프린시펄 펠로)의 문제의식을 이렇게 정리했다.

> "The central question for telco-based edge inference is to determine **when it provides real advantages** to have the compute close to the user."

기술이 되는지를 묻던 단계는 지났고, **왜 꼭 기지국이어야 하는지**를 묻는 단계에 와 있다는 뜻이다.

## 전력과 냉각 — 에너지 쪽에서 보면 문제가 하나 더 있다

이 지점이 통신 기사에서 잘 다뤄지지 않는다. GPU를 기지국에 넣는다는 것은 **전국에 흩어진 수만 개 지점의 전기 설비를 건드린다**는 뜻이다.

먼저 에너지가 어디서 쓰이는지 보자. NGMN 자료에 따르면 이동통신망 전기 사용량의 **약 4분의 3이 무선 접속망(RAN)**에서 쓰인다. RAN 안에서는 기지국 장비가 50%, 냉각이 40%, 기타가 10%다. 그리고 기지국 장비 안에서는 **무선장비(RU)가 4G 기준 약 80%, 5G에서는 약 90%**를 차지하고 기저대역(BBU)이 13%, 주제어부가 7%다. 트래픽이 전혀 없을 때도 주 밴드가 켜진 무선장비 하나는 약 207W를 계속 끌어당긴다(내부 전자부 152W + 송신 대기 RF 55W).

사이트 한 곳의 절대값은 이렇다. 2021년 GSMA 조사를 인용한 6G 에너지 설계 서베이 논문(arXiv:2509.11289)에 따르면 통신 사이트 한 곳의 연간 전력 사용량은 약 **28,665kWh**다. 8,760시간으로 나누면 평균 **약 3.3kW**다. GSMA 원 보고서가 특정되어 있지 않은 재인용 수치이므로 어림값으로 읽는 편이 맞다.

여기에 가속기를 더하면 어떻게 되는가. 소프트뱅크 실증에 쓰인 엔비디아 GH200 모듈의 TDP는 데이터시트상 **450W에서 1,000W까지 프로그래밍 가능**(CPU+GPU+메모리 합산)이다. 냉각은 "공냉 또는 액체냉각"으로 병기돼 있다. 기지국 캐비닛에서 1kW급 발열을 공냉으로 빼기 어렵다는 것은 이 글의 판단이며, 엔비디아의 권고 사항은 아니다.

<figure>
<svg viewBox="0 0 680 264" role="img" aria-label="통신 사이트 평균 전력 3.3킬로와트에 가속기 1장을 더하면 3.75에서 4.3킬로와트가 된다" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px">
<text x="24" y="36" font-size="17" font-weight="700" fill="#23201D">가속기 한 장에 사이트 전력은 14~31% 늘어난다</text>
<text x="24" y="58" font-size="12.5" fill="#8A8378">통신 사이트 1곳 연평균 전력과 GH200 모듈 TDP를 더한 값. 낮을수록 유리</text>
<line x1="150" y1="80" x2="150" y2="206" stroke="#E5DECF" stroke-width="1"/>
<text x="140" y="124" font-size="13" fill="#23201D" text-anchor="end">통신 설비만</text>
<rect x="150" y="100" width="308" height="36" fill="#A8BDD2"/>
<text x="446" y="123" font-size="13.5" font-weight="700" fill="#23201D" text-anchor="end">3.3kW</text>
<text x="140" y="184" font-size="13" fill="#23201D" text-anchor="end">가속기 1장 추가</text>
<rect x="150" y="160" width="308" height="36" fill="#A8BDD2"/>
<rect x="458" y="160" width="42" height="36" fill="#1B4F8A"/>
<rect x="500" y="160" width="51" height="36" fill="#4E7FA8"/>
<text x="561" y="183" font-size="13.5" font-weight="700" fill="#1B4F8A">최대 4.3kW</text>
<rect x="150" y="218" width="12" height="12" fill="#1B4F8A"/>
<text x="168" y="229" font-size="12" fill="#8A8378">가속기 최소 450W</text>
<rect x="300" y="218" width="12" height="12" fill="#4E7FA8"/>
<text x="318" y="229" font-size="12" fill="#8A8378">최대 1,000W</text>
<text x="24" y="254" font-size="12" fill="#8A8378">출처: GSMA 2021 조사 재인용(arXiv:2509.11289), NVIDIA GH200 데이터시트</text>
</svg>
<figcaption>한 사이트만 보면 1kW 남짓이다. 문제는 이것이 34만 국 규모로 곱해질 때다.</figcaption>
</figure>

한 곳만 보면 큰 숫자가 아니다. 그런데 국내 5G 기지국은 **2024년 3분기 공개 집계 기준 34만 343국**이다(상용화 첫해인 2019년 9만 2,840국에서 약 4배). 사업자별로는 SK텔레콤 12만 1,046국, KT 11만 1,505국, LG유플러스 10만 7,792국이다. 2025~2026년 최신 집계는 신뢰할 1차 출처로 확인되지 않아 2024년 값을 그대로 쓴다.

여기서 간단한 산술을 해 보자. **아래 계산은 공개된 수치를 필자가 직접 곱한 것이며, 실제 사업 계획이 아니다.**

| 가정 | 추가 전력 | 연간 추가 전력량 |
|---|---|---|
| 서버 1대가 20셀 담당(소프트뱅크 실증 비율, 약 1만 7,000대) | 약 17MW | 약 0.15TWh |
| 기지국의 10%에 1국당 1kW | 약 34MW | 약 0.30TWh |
| 기지국의 30%에 1국당 1kW | 약 102MW | 약 0.89TWh |
| 기지국의 100%에 1국당 1kW | 약 340MW | 약 2.98TWh |

*계산 근거: 2024년 3분기 5G 기지국 34만 343국, 가속기 1kW, 연 8,760시간. 기지국 수는 전자신문(2024-10-31) 보도 기준*

**첫 줄과 마지막 줄의 차이가 20배라는 데 주의해야 한다.** 1국당 1kW는 상한 가정이다. 소프트뱅크 실증처럼 가속기 서버 한 대가 20셀을 담당하는 구성이라면 필요 서버는 약 1만 7,000대, 추가 전력은 약 17MW로 한 자리 수 아래가 된다. 아래로 읽든 위로 읽든 숫자 자체는 계통이 감당 못 할 규모가 아니다.

문제는 총량이 아니라 **분포**다. 상한 가정의 340MW는 대형 데이터센터 캠퍼스 한 곳에 맞먹는 규모지만, 성격이 전혀 다르다. 데이터센터 340MW는 한 지점에서 한 번 계통 연계를 받는다. AI-RAN은 **수만 개 지점에서 각각 수전 설비를 손봐야** 하는 일이다. (기지국 집계는 사업자·주파수별 무선국 단위이므로 물리적 사이트 수는 34만보다 적다. 공용화된 사이트가 많다.) 기지국의 수전 용량은 무선장비 기준으로 설계돼 있고, 무선장비가 기지국 장비 전력의 80~90%를 먹는 구조에 1kW급 가속기와 그에 딸린 냉각을 끼워 넣는 것은 설계 전제를 바꾸는 작업이다.

소유 구조도 걸린다. 지난 10년간 통신사들은 기지국을 수익 자산이 아니라 **떼어내 팔 비용**으로 취급했다. 보다폰은 2019년 6월 유럽 철탑 6만 1,700기를 분리한다고 발표하고, 2021년 3월 18일 반티지타워스를 프랑크푸르트 증시에 상장했다. 공모가 24유로, 조달액 약 22억 유로로 그해 유럽 최대 IPO였다. 명분은 부채 상환이었다 — 당시 보다폰 순부채는 약 690억 유로였다. 2022년 11월에는 KKR·GIP와 합작법인을 세워 지분을 더 넘겼고 기업가치는 161억 유로로 매겨졌다. 텔레포니카는 텔시우스 철탑을 아메리칸타워에 팔았고, 셀넥스는 CK허치슨의 유럽 6개국 철탑을 약 100억 유로에 사들였다. 그래서 "기지국에 GPU를 꽂는다"는 말은, 상당수 사이트를 더 이상 소유하지 않는 회사가 남의 철탑에 1kW급 열원을 들이고 수전·냉각 설비를 고치겠다는 말이 된다. 2010년대에 비용센터라고 팔아치운 자산을 2020년대에 수익 자산이라고 되부르는 셈이다. 전력 공사 견적보다 임대 계약 재협상이 먼저 올 수 있다.

그래서 업계 안에서 "**RAN 지출과 에너지 소비를 동시에 늘리는 것이 정당한가**"라는 반론이 나온다. RAN 로드맵과 AI 연구를 모두 해 온 세바스티안 바로스는 이 구조를 이렇게 요약했다.

> "The GPU looks like a **Ferrari engine dropped into a bicycle**: technically impressive, but absurd in context."

그가 제시한 단가 비교도 같은 방향이다. 기존 5G 기저대역 장비(BBU)가 약 1만 달러인데, 호퍼 세대 GPU 보드는 2만 5,000~4만 달러다. 보드 하나로 **2.5~4배**다.

<figure>
<svg viewBox="0 0 680 236" role="img" aria-label="기존 5G 기저대역 장비는 약 1만 달러, GPU 보드는 2만5천에서 4만 달러로 2.5배에서 4배 비싸다" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px">
<text x="24" y="36" font-size="17" font-weight="700" fill="#23201D">장비 단가 — 보드 하나로 2.5~4배</text>
<text x="24" y="58" font-size="12.5" fill="#8A8378">기지국 연산 보드 1장당 가격. 낮을수록 유리</text>
<line x1="150" y1="80" x2="150" y2="206" stroke="#E5DECF" stroke-width="1"/>
<text x="140" y="124" font-size="13" fill="#23201D" text-anchor="end">기존 5G BBU</text>
<rect x="150" y="100" width="105" height="36" fill="#A8BDD2"/>
<text x="265" y="123" font-size="13.5" font-weight="700" fill="#23201D">약 1만 달러</text>
<text x="140" y="184" font-size="13" fill="#23201D" text-anchor="end">GPU 보드</text>
<rect x="150" y="160" width="262" height="36" fill="#1B4F8A"/>
<rect x="412" y="160" width="158" height="36" fill="#4E7FA8"/>
<text x="400" y="183" font-size="13.5" font-weight="700" fill="#FAF6EE" text-anchor="end">2.5만 ~ 4만 달러</text>
<text x="24" y="226" font-size="12" fill="#8A8378">출처: Sebastian Barros, "We are getting AI-RAN wrong"</text>
</svg>
<figcaption>장비값만 2.5~4배다. 여기에 전력과 냉각이 더 붙는다.</figcaption>
</figure>

![Detailed view of server racks with glowing lights in a data center environment.](https://images.pexels.com/photos/17489153/pexels-photo-17489153.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [panumas nikhomkhai](https://www.pexels.com/@cookiecutter) on [Pexels](https://www.pexels.com/photo/light-on-computer-17489153/)*

## 한국이 450억 원을 넣은 곳은 정확히 어디인가

여기서 앞의 세 갈래 구분이 실제로 쓸모가 있다. ETRI가 주관하는 'AI-RAN 글로벌 선도 프로젝트'의 예산 구조는 이렇다.

| 구분 | 기간 | 정부지원 R&D |
|---|---|---|
| 1단계 | 2026~2028년 | 290억 원 |
| 2단계 | 2029~2030년 | 160억 원 |
| **총계** | **5년** | **450억 원 이내** |
| (1년차) | 2026년 4~12월 | 90억 원 이내 |

*출처: 아이티데일리, 「6G 향한 AI-RAN 프로젝트 시동 — ETRI, 통신 3사, 엔비디아 등 참여」*

참여 구성은 주관 ETRI, 공동연구 SK텔레콤·KT·LG유플러스, 협력 엔비디아·HFR, 그 밖에 차세대모바일연구조합(NGMA)과 서울대·연세대·성균관대·아주대다.

**그런데 이 과제의 내용은 AI and RAN이 아니다.** 개발 대상으로 명시된 것은 AI-RAN 소프트웨어, AI-RAN 가상 네트워크 플랫폼, 실 기지국 기반 연구 시험망이고, 목표는 트래픽 처리·자원 관리·장애 대응의 자동화와 최적화다. 즉 **기지국 자체를 더 똑똑하게 만드는 쪽(AI for RAN)**이며, 기지국이 외부 AI 연산을 받아 처리하는 사업이 아니다.

이 구분이 왜 중요한가. **세 갈래 중 경제성이 가장 확실한 쪽이 바로 이쪽**이기 때문이다. 앞서 본 애널리스트 분석이 투자 우선순위 1번으로 꼽은 것도 "이미 깔린 장비에 AI 소프트웨어를 얹는 것"이었다. 에릭슨이 소프트뱅크 상용 5G망에서 AI 링크적응으로 실측한 주파수 효율 10% 개선은 새 하드웨어가 필요 없다. 용량의 91%까지 차 있던 셀을 83%로 내리면 **20만 달러짜리 증설을 1년 미룰 수 있고**, 자본비용 10%를 적용한 현재가치로 약 1만 8,000달러를 번다. 화려하지 않지만 숫자가 선다.

그리고 규모를 보자. 5년 450억 원은 **연 90억 원**이다. 전국 34만 기지국에 장비를 깔 돈이 아니다. 이것은 연구개발 예산이며, 실제 발주는 주파수 경매와 6G 상용화 시점에 붙는다. 과학기술정보통신부는 2026년 '하이퍼 AI네트워크 전략'에서 2030년 6G 상용화와 함께 '지능형 기지국(AI-RAN) 전국 구축·확산'을 명시했지만, 전략 문서의 목표 연도와 올해 집행되는 R&D 예산은 다른 층위의 숫자다. **"정부가 AI-RAN에 450억을 투입했다"는 헤드라인을 장비 발주 신호로 읽으면 안 된다는 뜻이다.**

## 상용화는 언제인가 — 공개된 일정표

날짜를 묻는 독자를 위해 공개 자료에 적힌 일정만 모았다.

| 시점 | 무슨 일이 있었나 / 예정인가 |
|---|---|
| 2024년 2월 26일 | AI-RAN 얼라이언스 출범(MWC) |
| 2024년 11월 12일 | 엔비디아·소프트뱅크, AI-RAN 수익 추정치 공개(1달러당 5달러, 219%) |
| 2025년 10월 28일 | 엔비디아, 노키아에 **10억 달러 투자**(주당 6.01달러). ARC-Pro 공개 |
| 2026년 2월 26일 | SK텔레콤, 노키아·HFR과 AI-RAN 실증 성공(엔비디아 GPU 기반 범용 서버) |
| 2026년 2월 | MWC에서 얼라이언스 3개 작업반 데모 33건 공개 |
| 2026년 4월 | ETRI 'AI-RAN 글로벌 선도 프로젝트' 1년차 착수 |
| 2026년 7월 15일 | 노키아, **업계 첫 상용 AI-RAN 플랫폼** 발표(anyRAN + 엔비디아 Aerial) |
| 2026년 10월 17일 | T-Mobile·노키아·엔비디아, 미 워싱턴주 벨뷰 상용 셀 사이트에서 **세계 첫 AI-RAN 통화**(10월 21일 발표) |
| 2026년 말 | 노키아 로드맵상 파일럿 |
| 2027년 | **상용 가용성 목표**(T-Mobile US). 주파수 효율 50% 개선 목표 |
| 2028년 | **대규모 배치** 목표. 주파수 효율 100% 이상 개선 목표 |
| 2030년 | 한국 6G 상용화 목표 |

*출처: NVIDIA 뉴스룸(2024-11-12, 2025-10-28), Nokia 뉴스룸·블로그, RCR Wireless(2026-10-14), 아이티데일리*

엔비디아가 제시한 시장 규모는 "2030년까지 누적 **2,000억 달러를 넘어설 RAN 시장**"이고(옴디아 인용), AI-RAN은 그 안의 기회로 설명된다. 주파수 효율 개선은 현재 20% 이상이 실증된 단계다. 노키아가 AI-RAN 참여 사업자로 거론한 곳은 T-Mobile US·보다폰·BT·오랑주·도이치텔레콤·엘리사·소프트뱅크·NTT도코모·인도사트 우레두 허치슨 9곳이다. 다만 노키아는 수익화를 **소프트웨어 구독** 모델로 하겠다고 밝혔고, 가격은 아직 공개하지 않았다. 여기서도 돈이 먼저 도는 쪽은 소프트웨어다.

## 그래서 무엇을 봐야 하나

AI-RAN을 한 문장으로 정리하면 이렇다. **통신사가 AI 시대에 인프라 사업자로 남으려는 시도이고, 기술은 이미 실증됐으며, 경제성은 세 갈래 중 하나에서만 확실하다.**

다음 기사나 보도자료를 읽을 때 쓸 점검 목록을 남긴다.

1. **세 갈래 중 어느 것인가.** "AI-RAN 실증 성공"이라는 제목을 봤을 때, 소프트웨어로 무선 성능을 올린 것(AI for RAN)인지, GPU를 꽂아 외부 AI 연산을 돌린 것(AI and RAN)인지 확인한다. 전자가 훨씬 많다.
2. **수익률 숫자에 "최대(up to)"가 붙어 있는가.** 8.2배와 0.51배는 같은 모델의 양 끝이다. 어느 쪽 가정을 쓴 숫자인지 묻는다.
3. **누가 추정한 숫자인가.** 1달러당 5달러, 219%는 장비를 파는 쪽과 사는 쪽이 함께 낸 2024년 추정이다. 학술 모델은 범위로 답하고, 그 모델의 저자도 얼라이언스 안에 있다.
4. **연구개발 예산인가 설비 발주인가.** 연 90억 원과 전국 34만 기지국 사이에는 두 자리 수의 간격이 있다.
5. **전력과 냉각을 언급했는가.** 450~1,000W 가속기와 그 발열을 빼는 방법을 빼놓고 "기지국에 GPU를 넣는다"고 쓴 글은 가장 비싼 항목을 생략한 글이다. 사이트를 소유하지 않은 사업자라면 임대 계약 재협상도 함께 봐야 한다.
6. **고객이 특정됐는가.** 김동욱 박사가 경고한 "5G의 실수"는 기술이 아니라 수요와 공급이 동시에 밀린 실패였다. 연산력을 **누가 사 가는지** 이름이 나오는 순간이 기술 서사가 사업으로 바뀌는 지점이다.

마지막으로 하나. 기지국이 AI 서버가 될 수 있는지는 이미 증명됐다. 그런데 증명은 이번이 처음이 아니다. 2014년 백서가 "무선망 엣지를 제3자에게 연다"고 쓴 뒤 규격은 예정대로 나왔고, 시연도 끝났다. 12년이 지나 BT의 엣지 사이트는 하나다. **증명이 배치를 만들지 않는다**는 것이 지난 사이클의 결론이었다.

그래서 이번 사이클에서 "언제 실제 이점을 주는가"를 먼저 꺼낸 사람이 누구인지가 중요하다. 알렉스 최는 2012년부터 2017년까지 SK텔레콤 CTO였고, 도이치텔레콤 T-Labs를 거쳐 2022년 6월부터 2024년 6월까지 O-RAN 얼라이언스 의장을 지낸 뒤 AI-RAN 얼라이언스 의장석에 앉았다. MEC와 슬라이싱을 집행했던 사람이 다음 사이클의 첫 질문으로 기술이 아니라 수요를 꺼낸 것이다. 산업이 학습했다는 가장 구체적인 증거다. 동시에, 묻는 것이 답은 아니다.

그리고 연산력 임대가 사업이 된 가장 큰 선례는 남는 설비를 판 쪽이 아니라 팔 설비를 따로 지은 쪽이었다. 그렇다면 이 산업의 분기점은 "기지국 GPU로 AI를 돌릴 수 있는가"가 아니다. **"AI를 위해 기지국을 처음부터 다시 설계할 것인가"**다. 수만 곳의 전기 설비를 손대야 하는 일이라면, 답은 "남는 걸 쓰자"보다 분명해야 한다.

*이 글은 공개된 시장·정책·기술 정보를 바탕으로 한 산업 분석이며, 특정 종목에 대한 투자 조언이 아니다.*

## 출처

- [NVIDIA 뉴스룸 — NVIDIA and SoftBank Corp. Accelerate Japan's Journey to Global AI Powerhouse](https://nvidianews.nvidia.com/news/nvidia-and-softbank-accelerate-japans-journey-to-global-ai-powerhouse) (2024-11-12, 1달러당 5달러, 219%, 3분의 1 가동률 전제, 가나가와 실증)
- [NVIDIA 뉴스룸 — NVIDIA and Nokia to Pioneer the AI Platform for 6G](https://nvidianews.nvidia.com/news/nvidia-nokia-ai-telecommunications) (2025-10-28, 10억 달러 투자, ARC-Pro, 2030년 누적 2,000억 달러 RAN 시장)
- [Gemmi, Polese, Melodia — A Techno-Economic Framework for Cost Modeling and Revenue Opportunities in Open and Programmable AI-RAN (arXiv:2603.28680)](https://arxiv.org/abs/2603.28680) (2026-03-30, 최대 8배 회수율, 경제성 미검증 전제)
- [RCR Wireless — Which AI-RAN investment makes sense for an operator?](https://rcrwireless.com/20261013/analyst-angle/which-ai-ran-investment-makes-sense-for-an-operator-nandlall) (2026-10-13, 8.2→2.7→1.3→0.51배, GPU-시간당 1달러 가정 시 60% 가동 요건, 14~18시 수요 충돌, 에릭슨 10%)
- [RCR Wireless — AI-RAN Alliance moves to implementation blueprints and edge business models](https://rcrwireless.com/20261014/ai-infrastructure/ai-ran-alliance-moves-to-implementation-blueprints-and-edge-business-models) (2026-10-14, 142개 기관·17개국, AI-on-RAN 작업반 네 주제, 최 의장 문제의식)
- [RCR Wireless — "Biggest risk with AI-RAN is repeating mistakes of 5G", says SK Telecom](https://rcrwireless.com/20260928/ai-infrastructure/biggest-risk-with-ai-ran-is-repeating-mistakes-of-5g-says-sk-telecom) (2026-09-28, SK텔레콤 6G 기술팀 김동욱 박사)
- [SoftBank — From Proof-of-Concept to Commercial Deployment of AI-RAN](https://www.softbank.jp/en/corp/technology/research/topics/224/) (게이오대 SFC GH200 실증, 서버 1대로 20셀, FY2026 이후 상용망 도입)
- [SoftBank — 알렉스 최 프린시펄 펠로 소개](https://www.softbank.jp/en/corp/technology/research/team/mem_alexchoijinsung/) · [AI-RAN Alliance 의장 선임(2024-08-15)](https://www.businesswire.com/news/home/20240815774457/en/AI-RAN-Alliance-Announces-Appointment-of-Dr.-Alex-Jinsung-Choi-as-Chair)
- [Nokia 블로그 — From the lab to the live network: Nokia, T-Mobile and NVIDIA complete world's first AI-RAN call](https://www.nokia.com/blog/from-the-lab-to-the-live-network-nokia-t-mobile-and-nvidia-complete-worlds-first-ai-ran-call/) (2026-10-17 통화, 10-21 발표)
- [Light Reading — Nvidia threatens to reshape telecom with AI-plus-RAN plan](https://www.lightreading.com/ai-machine-learning/nvidia-threatens-to-reshape-telecom-with-ai-plus-ran-plan) (AI for RAN / AI and RAN / AI on RAN 세 갈래 정의)
- [Sebastian Barros — We are getting AI-RAN wrong](https://sebastianbarros.substack.com/p/we-are-getting-ai-ran-wrong) (BBU 1만 달러 대 GPU 보드 2.5~4만 달러, 보드당 350~400W)
- [아이티데일리 — 6G 향한 AI-RAN 프로젝트 시동…ETRI, 통신 3사, 엔비디아 등 참여](http://www.itdaily.kr/news/articleView.html?idxno=239169) (450억 원, 1·2단계 예산, 참여기관, 과제 내용)
- [전자신문 — 5G 기지국 수도권 '쏠림세' 줄었다](https://www.etnews.com/20241031000312) (2024년 3분기 34만 343국, 사업자별 기지국 수)
- [NGMN — Network Energy Efficiency Phase 2](https://www.ngmn.org/wp-content/uploads/NGMN_Network_Engergy_Efficiency_Phase2.pdf) (RAN 약 4분의 3, RAN 내 기지국 장비 50%·냉각 40%, 무선장비 4G 80%·5G 약 90%, BBU 13%)
- [Energy-Aware 6G Network Design: A Survey (arXiv:2509.11289)](https://arxiv.org/pdf/2509.11289) (2021년 GSMA 조사 재인용 — 사이트 연 28,665kWh)
- [RCR Wireless — Energy measurement in open RAN](https://www.rcrwireless.com/20260323/opinion/readerforum/energy-open-ran) (무선장비 무부하 207W 내역)
- [NVIDIA GH200 Grace Hopper Superchip Datasheet](https://resources.nvidia.com/en-us-grace-cpu/grace-hopper-superchip) (TDP 450~1,000W 프로그래밍 가능, 공냉 또는 액체냉각)
- [ETSI — Mobile-Edge Computing Introductory Technical White Paper (2014-09)](https://portal.etsi.org/portals/0/tbpages/mec/docs/mobile-edge_computing_-_introductory_technical_white_paper_v1%2018-09-14.pdf) · [ETSI MEC ISG 신설 발표(2014-10-30)](https://www.etsi.org/newsroom/news/838-2014-10-news-etsi-announces-first-meeting-of-new-standardization-group-on-mobile-edge-computing)
- [The Mobile Network — BT, 맨체스터 1개 엣지 사이트·추가 계획 없음](https://the-mobile-network.com/2025/12/bt-marks-aws-based-mec-service-launches-for-2026/) · [Light Reading — 5G network slicing not ready for prime time in UK](https://www.lightreading.com/5g/5g-network-slicing-not-ready-for-prime-time-in-uk)
- [Network World — The myth about how Amazon's Web service started just won't die](https://www.networkworld.com/article/936248/the-myth-about-how-amazon-s-web-service-started-just-won-t-die.html) (AWS 유휴 서버 재활용 통설 반박)
- [DCD — Vodafone spins off telco tower assets as Vantage Towers](https://www.datacenterdynamics.com/en/news/vodafone-spins-telco-tower-assets-vantage-towers/) · [Dgtl Infra — Vodafone Sells Stake in €16.2bn Vantage Towers to KKR and GIP](https://dgtlinfra.com/vodafone-vantage-towers-kkr-gip/)
- [Wikipedia — Telecoms crash](https://en.wikipedia.org/wiki/Telecoms_crash) (영국 225억 파운드, 독일 505억 유로 경매, 파월 "1조 달러") · [전자신문 — KT·SK텔레콤 와이브로 중단](https://www.etnews.com/20180313000261) (투자 2조 1,000억 원, 누적 매출 2,300억 원)
</content>
