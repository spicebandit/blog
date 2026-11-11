---
title: "클로드 모델 뭘 써야 하나 — 두 배 값 페이블은 언제만 쓰나"
description: "클로드 모델이 넷으로 늘었다. 공식 문서는 오푸스 5.5부터 쓰라고 못 박았고, 값이 두 배인 페이블 5.2는 쓸 조건을 따로 적어뒀다. 네 모델 요금과 선택 기준, Claude Code에서 바꾸는 법, 올리기 전 깨지는 지점까지 정리했다."
pubDate: 2026-11-11T05:23:33+09:00
category: ai
tags: ["클로드", "Claude Code", "LLM 요금", "AI 개발도구"]
---

**답부터.** 2026년 11월 11일 현재 클로드 모델은 네 개다. **대부분의 작업은 `claude-opus-5-5`로 시작하면 된다.** 입력 100만 토큰에 $4, 출력에 $20이고, 공식 문서도 "most workloads start with Claude Opus 5.5"라고 못 박았다. 11월 9일 나온 **페이블 5.2(`claude-fable-5-2`)는 그 위 체급**이고, 값은 두 배($8/$40)다. 쓰라는 조건이 문서에 명시돼 있다 — **오푸스 5.5를 `xhigh` 또는 `max` effort로 돌려 봤는데도 평가 기준을 못 맞출 때.** 그게 아니면 돈만 두 배다.

이 글은 그 네 모델의 요금·성격·바뀐 규칙을 한 번에 정리한다. 가장 많이 검색되는 세 가지 질문에 먼저 한 줄로 답한다.

| 질문 | 한 줄 답 |
|------|----------|
| 뭘 쓰면 되나 | 기본은 **오푸스 5.5**. 일상 코딩·분량 많은 작업은 **소넷 5.5**, 분류·추출 같은 대량 처리는 **하이쿠 5.5**, 오푸스로 안 되는 난도만 **페이블 5.2** |
| 페이블 5.2는 얼마인가 | 입력 **$8**/출력 **$40** per MTok. 전작 페이블 5.1($10/$50)보다 **20% 인하**. 배치는 절반($4/$20), 고속 모드는 두 배($16/$80) |
| Claude Code에서 어떻게 바꾸나 | 세션 안에서 `/model fable`(또는 `opus`·`sonnet`·`haiku`). 영구 설정은 `~/.claude/settings.json`의 `"model"` 또는 환경변수 `ANTHROPIC_MODEL` |

![코드가 떠 있는 노트북 화면](https://images.pexels.com/photos/34803986/pexels-photo-34803986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Daniil Komov](https://www.pexels.com/@dkomov) on [Pexels](https://www.pexels.com/photo/modern-laptop-displaying-code-in-cozy-workspace-34803986/)*

## 답부터: 네 모델의 요금과 성격 한 장 정리

공식 모델 비교표(platform.claude.com, 2026-11-11 조회) 기준이다. 네 모델 모두 컨텍스트 100만 토큰, 동기 호출 최대 출력 12만 8천 토큰, 텍스트·이미지 입력을 지원하고, 신뢰 지식 컷오프는 2026년 6월로 같다.

| 모델 | API 모델 ID | 입력 $/MTok | 출력 $/MTok | 캐시 적중 $/MTok | API 기본 effort | 상대 지연 |
|------|-------------|------------|------------|----------------|----------------|-----------|
| **클로드 페이블 5.2** | `claude-fable-5-2` | **$8** | **$40** | $0.20 (0.025배) | `high` | 보통 |
| **클로드 오푸스 5.5** | `claude-opus-5-5` | **$4** | **$20** | $0.20 (0.05배) | `medium` | 보통 |
| **클로드 소넷 5.5** | `claude-sonnet-5-5` | **$2** | **$10** | $0.10 (0.05배) | `high` | 빠름 |
| **클로드 하이쿠 5.5** | `claude-haiku-5-5` | **$0.10부터** | **$0.50부터** | $0.01부터 | `medium` | 가장 빠름 |

*출처: [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview), [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) (Anthropic 공식 문서, 2026-11-11 조회)*

하이쿠 5.5의 "부터"에는 조건이 붙는다. **프롬프트가 10만 토큰 이하일 때 $0.10/$0.50이고, 10만 토큰을 넘으면 $0.50/$2.50으로 다섯 배가 된다.** 긴 문서를 하이쿠에 통째로 밀어 넣는 설계는 요금표가 보여주는 것보다 훨씬 비싸진다. 캐시 적중 단가도 $0.01에서 $0.05로 같이 뛴다.

표에 네 번 등장하는 **미토스 5.2**는 페이블 5.2와 사양·가격이 같은 동급 모델인데, Cyber Verification Program 같은 Anthropic 검증 프로그램을 통과한 조직만 쓸 수 있다. 일반 고객에게는 사실상 페이블 5.2 한 줄로 읽으면 된다.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 12px;margin:28px 0">
<svg viewBox="0 0 700 300" role="img" aria-label="클로드 네 모델의 100만 토큰당 입력·출력 가격 비교 막대그래프. 페이블 5.2가 입력 8달러·출력 40달러로 가장 비싸고, 하이쿠 5.5가 입력 0.1달러·출력 0.5달러로 가장 싸다." style="width:100%;height:auto">
<text x="12" y="22" font-size="14" font-weight="700" fill="#23201D">100만 토큰당 가격 — 낮을수록 저렴 (USD)</text>
<text x="12" y="40" font-size="11" fill="#8A8378">위 막대 = 입력 · 아래 막대 = 출력</text>
<line x1="120" y1="56" x2="120" y2="262" stroke="#E5DECF" stroke-width="1"/>
<line x1="220" y1="56" x2="220" y2="262" stroke="#E5DECF" stroke-width="1"/>
<line x1="320" y1="56" x2="320" y2="262" stroke="#E5DECF" stroke-width="1"/>
<line x1="420" y1="56" x2="420" y2="262" stroke="#E5DECF" stroke-width="1"/>
<line x1="520" y1="56" x2="520" y2="262" stroke="#E5DECF" stroke-width="1"/>
<!-- 페이블 5.2 -->
<text x="112" y="76" font-size="12" font-weight="700" text-anchor="end" fill="#23201D">페이블 5.2</text>
<rect x="120" y="60" width="80" height="14" fill="#4E7FA8"/>
<text x="208" y="71" font-size="11" fill="#23201D">$8</text>
<rect x="120" y="78" width="400" height="14" fill="#1B4F8A"/>
<text x="528" y="89" font-size="11" font-weight="700" fill="#1B4F8A">$40</text>
<!-- 오푸스 5.5 -->
<text x="112" y="134" font-size="12" font-weight="700" text-anchor="end" fill="#23201D">오푸스 5.5</text>
<rect x="120" y="118" width="40" height="14" fill="#A8BDD2"/>
<text x="168" y="129" font-size="11" fill="#23201D">$4</text>
<rect x="120" y="136" width="200" height="14" fill="#4E7FA8"/>
<text x="328" y="147" font-size="11" fill="#23201D">$20</text>
<!-- 소넷 5.5 -->
<text x="112" y="192" font-size="12" font-weight="700" text-anchor="end" fill="#23201D">소넷 5.5</text>
<rect x="120" y="176" width="20" height="14" fill="#A8BDD2"/>
<text x="148" y="187" font-size="11" fill="#23201D">$2</text>
<rect x="120" y="194" width="100" height="14" fill="#A8BDD2"/>
<text x="228" y="205" font-size="11" fill="#23201D">$10</text>
<!-- 하이쿠 5.5 -->
<text x="112" y="250" font-size="12" font-weight="700" text-anchor="end" fill="#23201D">하이쿠 5.5</text>
<rect x="120" y="234" width="2" height="14" fill="#A8BDD2"/>
<text x="130" y="245" font-size="11" fill="#8A8378">$0.10</text>
<rect x="120" y="252" width="5" height="14" fill="#A8BDD2"/>
<text x="133" y="263" font-size="11" fill="#8A8378">$0.50 (프롬프트 10만 토큰 이하 구간)</text>
<text x="116" y="280" font-size="10" fill="#8A8378">0</text>
<text x="212" y="280" font-size="10" fill="#8A8378">10</text>
<text x="312" y="280" font-size="10" fill="#8A8378">20</text>
<text x="412" y="280" font-size="10" fill="#8A8378">30</text>
<text x="512" y="280" font-size="10" fill="#8A8378">40</text>
</svg>
<figcaption style="font-size:12px;color:#8A8378;margin-top:8px">출력 단가 격차가 결정적이다. 페이블 5.2는 오푸스 5.5의 2배, 소넷 5.5의 4배, 하이쿠 5.5 하위 단가 구간($0.50/MTok)의 80배다. 출처: Anthropic Pricing 문서(2026-11-11 조회).</figcaption>
</figure>

체감으로 환산해 보자. **입력 100만 토큰 + 출력 20만 토큰을 쓰는 작업 하나**를 가정하면(캐시 미적중, 정가 기준 단순 계산) 페이블 5.2는 $16, 오푸스 5.5는 $8, 소넷 5.5는 $4다. 하이쿠 5.5는 **$1.00**이다 — 요금표 첫 줄($0.10/$0.50)로 계산하면 $0.20이 나오지만, 입력이 100만 토큰이면 10만 토큰 임계값을 열 배 넘으므로 상위 구간($0.50/$2.50)이 적용된다. 요금표를 두 줄 읽지 않으면 다섯 배를 틀린다.

에이전트를 하루에 수십 번 돌리는 팀이라면 이 배수가 그대로 월 청구서에 곱해진다.

## 11월 9일에 바뀐 것 — 페이블 5.2는 전작보다 20% 싸졌다

페이블 5.2와 미토스 5.2는 **2026년 11월 9일** 출시됐다. 공식 문서가 적어 둔 은퇴 시점은 "2027년 11월 9일 이전은 아니다"다. 즉 최소 1년은 이 모델 ID를 그대로 쓸 수 있다.

가격은 전작에서 내려왔다.

| 항목 | 페이블 5.1 (전작) | 페이블 5.2 | 변화 |
|------|------------------|-----------|------|
| 입력 | $10 / MTok | **$8 / MTok** | −20% |
| 출력 | $50 / MTok | **$40 / MTok** | −20% |
| 5분 캐시 쓰기 | $12.50 / MTok | $10 / MTok | −20% |
| 1시간 캐시 쓰기 | $20 / MTok | $16 / MTok | −20% |
| 캐시 적중·갱신 | $0.25 / MTok | $0.20 / MTok | −20% (배수는 0.025배 동일) |

*출처: [Pricing](https://platform.claude.com/docs/en/about-claude/pricing), [What's new in Claude Fable 5.2](https://platform.claude.com/docs/en/models/fable-5-2/whats-new-fable-5-2)*

성능은 Anthropic이 공개한 자체 벤치마크로 비교할 수 있다. 전작뿐 아니라 **한 체급 아래인 오푸스 5.5와도 같이 놓고 봐야** 교체 가치가 보인다.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 12px;margin:28px 0">
<svg viewBox="0 0 700 390" role="img" aria-label="페이블 5.1, 오푸스 5.5, 페이블 5.2의 벤치마크 점수 비교 막대그래프. FrontierCode 2.0은 32.4·45.5·49.1퍼센트, AutomationBench는 31.4·42.5·51.4퍼센트, AA-Briefcase는 61.5·61.2·66.1퍼센트다." style="width:100%;height:auto">
<text x="12" y="22" font-size="14" font-weight="700" fill="#23201D">벤치마크 점수 (%, 높을수록 우수)</text>
<text x="12" y="40" font-size="11" fill="#8A8378">연한 막대 = 페이블 5.1 · 중간 막대 = 오푸스 5.5 · 진한 막대 = 페이블 5.2</text>
<line x1="230" y1="56" x2="230" y2="352" stroke="#E5DECF" stroke-width="1"/>
<line x1="335" y1="56" x2="335" y2="352" stroke="#E5DECF" stroke-width="1"/>
<line x1="440" y1="56" x2="440" y2="352" stroke="#E5DECF" stroke-width="1"/>
<line x1="545" y1="56" x2="545" y2="352" stroke="#E5DECF" stroke-width="1"/>
<!-- FrontierCode 2.0 -->
<text x="222" y="84" font-size="11" font-weight="700" text-anchor="end" fill="#23201D">FrontierCode 2.0</text>
<rect x="230" y="62" width="113" height="11" fill="#A8BDD2"/>
<text x="349" y="71" font-size="10" fill="#8A8378">32.4</text>
<rect x="230" y="75" width="159" height="11" fill="#4E7FA8"/>
<text x="395" y="84" font-size="10" fill="#23201D">45.5</text>
<rect x="230" y="88" width="172" height="11" fill="#1B4F8A"/>
<text x="408" y="97" font-size="10" font-weight="700" fill="#1B4F8A">49.1</text>
<!-- FrontierSWE v2 -->
<text x="222" y="146" font-size="11" font-weight="700" text-anchor="end" fill="#23201D">FrontierSWE v2</text>
<rect x="230" y="124" width="197" height="11" fill="#A8BDD2"/>
<text x="433" y="133" font-size="10" fill="#8A8378">56.3</text>
<rect x="230" y="137" width="218" height="11" fill="#4E7FA8"/>
<text x="454" y="146" font-size="10" fill="#23201D">62.3</text>
<rect x="230" y="150" width="245" height="11" fill="#1B4F8A"/>
<text x="481" y="159" font-size="10" font-weight="700" fill="#1B4F8A">69.9</text>
<!-- AutomationBench -->
<text x="222" y="208" font-size="11" font-weight="700" text-anchor="end" fill="#23201D">AutomationBench</text>
<rect x="230" y="186" width="110" height="11" fill="#A8BDD2"/>
<text x="346" y="195" font-size="10" fill="#8A8378">31.4</text>
<rect x="230" y="199" width="149" height="11" fill="#4E7FA8"/>
<text x="385" y="208" font-size="10" fill="#23201D">42.5</text>
<rect x="230" y="212" width="180" height="11" fill="#1B4F8A"/>
<text x="416" y="221" font-size="10" font-weight="700" fill="#1B4F8A">51.4</text>
<!-- Terminal-Bench-Science 0.1 -->
<text x="222" y="270" font-size="11" font-weight="700" text-anchor="end" fill="#23201D">Terminal-Bench-Science 0.1</text>
<rect x="230" y="248" width="184" height="11" fill="#A8BDD2"/>
<text x="420" y="257" font-size="10" fill="#8A8378">52.6</text>
<rect x="230" y="261" width="205" height="11" fill="#4E7FA8"/>
<text x="441" y="270" font-size="10" fill="#23201D">58.7</text>
<rect x="230" y="274" width="261" height="11" fill="#1B4F8A"/>
<text x="497" y="283" font-size="10" font-weight="700" fill="#1B4F8A">74.6</text>
<!-- AA-Briefcase v1.1 -->
<text x="222" y="332" font-size="11" font-weight="700" text-anchor="end" fill="#23201D">AA-Briefcase v1.1</text>
<rect x="230" y="310" width="215" height="11" fill="#A8BDD2"/>
<text x="451" y="319" font-size="10" fill="#8A8378">61.5</text>
<rect x="230" y="323" width="214" height="11" fill="#4E7FA8"/>
<text x="450" y="332" font-size="10" fill="#23201D">61.2</text>
<rect x="230" y="336" width="231" height="11" fill="#1B4F8A"/>
<text x="467" y="345" font-size="10" font-weight="700" fill="#1B4F8A">66.1</text>
<text x="226" y="372" font-size="10" fill="#8A8378">0</text>
<text x="326" y="372" font-size="10" fill="#8A8378">30</text>
<text x="431" y="372" font-size="10" fill="#8A8378">60</text>
<text x="536" y="372" font-size="10" fill="#8A8378">90</text>
</svg>
<figcaption style="font-size:12px;color:#8A8378;margin-top:8px">코딩(FrontierCode 2.0)·자동화(AutomationBench)는 전작과 20%p 안팎 벌어졌지만, 지식 업무(AA-Briefcase)에서는 페이블 5.2 66.1%, 오푸스 5.5 61.2% — 4.9%p 차이다. 같은 벤치마크의 Elo는 오푸스 5.5가 1800, 페이블 5.2가 1785다. 모든 점수는 각 모델의 최고 effort 기준. 출처: Anthropic 제품 페이지(claude/fable), 2026-11-11 조회.</figcaption>
</figure>

**이 그래프가 알려주는 건 가격이 아니라 적용 범위다.** 코딩·과학 계산·자동화 쪽은 전작과 20%p 안팎으로 벌어졌고 오푸스 5.5와도 뚜렷한 간격이 있다. 그런데 지식 업무 벤치마크(AA-Briefcase)에서는 루브릭 점수가 4.9%p 차이고, **같은 벤치마크의 Elo는 오푸스 5.5(1800)가 페이블 5.2(1785)보다 오히려 높다.** 문서 요약과 리포트 작성이 주업인 팀이 "최신 모델이니까"로 페이블 5.2로 갈아타면 비용은 두 배인데 체감 개선은 거의 없을 수 있다는 뜻이다. 벤치마크는 벤더 자체 수치이기도 하니, 공식 권고대로 **자기 평가셋으로 effort를 쓸어 보는 쪽**이 먼저다.

## 요금표만 보면 틀린다 — 캐시·배치·고속 모드

실무 청구서는 표의 기본 단가로 결정되지 않는다. 세 가지 변수가 더 크다.

**첫째, 캐시 적중 단가.** 프롬프트 캐시는 모델별로 배수가 다르다. 공식 문서는 세 그룹으로 나눠 놓았다.

| 캐시 적중 배수 | 해당 모델 |
|---------------|-----------|
| **기본 입력가의 0.025배** | 페이블 5.2 · 미토스 5.2 · 페이블 5.1 · 미토스 5.1 |
| **0.05배** | 오푸스 5.5 · 소넷 5.5 |
| **0.1배 (표준)** | 그 외 모든 모델 |

여기서 재미있는 숫자가 나온다. **페이블 5.2의 캐시 적중 단가($0.20)는 오푸스 5.5의 캐시 적중 단가($0.20)와 같다.** 기본 입력가는 두 배인데 캐시 읽기 값은 동일하다. 배수가 0.025배 대 0.05배라서 그렇다.

그래서 **같은 시스템 프롬프트와 도구 정의를 수십 턴 재사용하는 긴 에이전트 세션에서는 두 모델의 입력 비용 격차가 크게 줄어든다.** 다만 완전히 사라지지는 않는다 — 캐시 **쓰기** 단가는 여전히 두 배(5분 $10 대 $5, 1시간 $16 대 $8)이고, 캐시를 비껴간 입력도 두 배다. 남는 격차는 결국 출력($40 대 $20)과 캐시 쓰기 쪽이다. 반대로 매번 새 프롬프트를 던지는 단발성 호출에서는 표에 적힌 두 배 격차가 그대로 나온다. 캐시 설계를 해둔 팀과 안 해둔 팀의 페이블 5.2 도입 비용이 다르다는 뜻이다.

이 구조 자체는 낯선 것이 아니다. 캐시 요금제는 **쓸 때 기본가보다 더 내고(1.25~2배) 읽을 때 아주 조금 내는(0.025~0.05배) 이부 요금제(two-part tariff)**이고, 클라우드는 같은 형태를 17년 전에 내놨다. AWS가 2009년 3월 12일 발표한 EC2 예약 인스턴스는 1년 약정 Small 인스턴스에 **선불 $325 + 시간당 $0.030**을 매겼고, 같은 인스턴스의 온디맨드 가격은 시간당 $0.10이었다. 이런 요금제의 성질은 늘 같다. **할인은 재사용을 전제로 설계한 쪽에만 돌아가고, 매번 프롬프트가 바뀌는 쪽은 캐시 쓰기 프리미엄만 더 내고 적중은 한 번도 못 본다.**

**둘째, 배치 API.** 비동기로 돌려도 되는 작업이면 입력·출력 모두 50% 할인이다. 페이블 5.2는 $4/$20이 되어 오푸스 5.5의 정가와 같아진다. 야간에 돌리는 분석·분류·대량 리팩터링은 여기로 보내는 게 맞다.

**셋째, 고속 모드.** 페이블 5.2와 미토스 5.2는 Messages API에서 고속 모드를 쓸 수 있고, 가격은 $16/$80 — 정가의 두 배다. 공식 문서는 최대 2.5배 높은 출력 속도를 제시한다. 사람이 기다리는 대화형 UI라면 값어치가 있다. 반대로 배치로 돌려도 되는 작업에 고속 모드를 쓰면 **정가의 두 배, 배치 대비 네 배**를 내는 셈이다(고속 모드와 배치 API는 함께 쓸 수 없다).

배치 50% 할인과 고속 모드 2배는 사실 같은 축의 양 끝이다. **연산량이 아니라 "언제 결과를 받고 싶은가"에 값을 매기는 구조**이고, 이 역시 클라우드가 먼저 정착시켰다. AWS는 2009년 12월 스팟 인스턴스를 내놓으며 적합한 작업으로 이미지·영상 변환과 렌더링, 데이터 처리, 금융 모델링, 웹 크롤링, 부하 테스트를 들었다 — 지금 배치 API로 보내라고 권고되는 목록과 사실상 같다. 달라진 것은 과금 단위가 인스턴스 시간에서 토큰으로 바뀌었다는 점이다.

![데이터센터 랙 뒷면 근접 촬영](https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Rear_of_rack_at_NERSC_data_center_-_closeup.jpg/1280px-Rear_of_rack_at_NERSC_data_center_-_closeup.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail)
*이미지: Derrick Coetzee from Berkeley, CA, USA · [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Rear_of_rack_at_NERSC_data_center_-_closeup.jpg) · [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en)*

여기에 숨은 변수가 하나 더 있다. **토크나이저가 달라졌다.** 오푸스 4.7 세대부터 도입된 현재 토크나이저는 같은 텍스트에 대해 **약 30% 많은 토큰**을 만든다(소넷 4.6 이전 모델은 이전 토크나이저). 정확한 증가폭은 콘텐츠와 워크로드 형태에 따라 다르다. 즉 소넷 4.6에서 소넷 5.5로 옮기면 단가가 $3 → $2로 내려가도 토큰 수가 늘어 실제 청구액 감소폭은 표에서 계산한 것보다 작다. 모델 교체 전에 `count_tokens`로 자기 프롬프트를 다시 재 보라는 권고가 문서에 명시돼 있는 이유다. [클로드 오류 메시지 대응법](/blog/2026-08-26-claude-error-messages-fix-guide/)에서 다룬 한도 초과 계열 오류도 이 토큰 증가와 겹칠 수 있다.

## Claude Code에서 모델 바꾸는 법 — 명령 한 줄

답부터: **세션 중이면 `/model`.** 별칭을 바로 붙여도 되고, 인자 없이 치면 대화형 선택기가 열린다.

```bash
# 세션 중 전환
/model fable          # 페이블 계열
/model opus           # 최신 오푸스
/model sonnet         # 최신 소넷
/model haiku          # 빠른 하이쿠
/model opusplan       # 계획은 오푸스, 실행은 소넷
/model default        # 계정 기본값으로 복귀

# 시작할 때 지정
claude --model fable

# 환경변수
export ANTHROPIC_MODEL=claude-fable-5-2
```

영구 설정은 `~/.claude/settings.json`에 적는다.

```json
{
  "model": "opus",
  "modelSettings": {
    "claude-opus-5-5": { "effortLevel": "medium" }
  }
}
```

최상위 `"effortLevel"`도 있지만 **오푸스 5.5 이상에는 적용되지 않는다.** 5.5 세대 모델의 effort는 위처럼 `modelSettings` 안에서 모델 ID별로 지정해야 실제로 먹는다. 이걸 모르고 최상위에만 적어 두면 설정은 들어갔는데 아무 일도 일어나지 않는다.

별칭이 **어느 모델로 풀리는지는 접속 경로에 따라 다르다.** 이게 "같은 `/model sonnet`인데 왜 회사 계정에서는 구형이 뜨나" 하는 혼란의 원인이다.

| 접속 경로 | `opus` | `sonnet` | `haiku` |
|-----------|--------|----------|---------|
| Anthropic API | 오푸스 5.5 | 소넷 5.5 | 하이쿠 5.5 |
| Claude Platform on AWS | 오푸스 5.5 | 소넷 4.6 | 하이쿠 4.5 |
| Amazon Bedrock · Google Cloud Agent Platform | 오푸스 5.5 | 소넷 4.5 | 하이쿠 4.5 |
| Microsoft Foundry | 오푸스 4.6 | 소넷 4.5 | 하이쿠 4.5 |

*출처: [Claude Code — Model configuration](https://code.claude.com/docs/en/model-config) (2026-11-11 조회)*

`fable` 별칭도 경로를 탄다. 따라서 **특정 모델을 확실히 쓰려면 별칭이 아니라 모델 ID(`claude-fable-5-2`)를 직접 지정하는 게 안전하다.** 기본 모델은 Pro·Max·Ultra·Team·Enterprise·Anthropic API 모두 **오푸스 5.5**다(Microsoft Foundry만 소넷 4.5). 페이블 5.2는 Claude API 전 고객, Claude Code, 그리고 Anthropic 제품 페이지 기준 claude.ai의 Pro·Max·Ultra·Team·Enterprise에서 쓸 수 있다. Claude Code 설치와 기본 사용법은 [클로드 앱과 Claude Code 사용법](/blog/2026-10-15-claude-app-claude-code-how-to-use/)에 정리해 뒀다.

**effort는 모델 선택보다 더 중요한 레버다.** 공식 문서가 직접 그렇게 쓴다 — "effort를 조정하는 것이 모델을 바꾸는 것보다 나은 레버인 경우가 많다". Claude Code에서는 `/effort`로 바꾼다.

```bash
/effort high          # low · medium · high · xhigh · max
/effort ultracode     # 동적 워크플로 계획 모드
export CLAUDE_CODE_EFFORT_LEVEL=high
```

페이블 5.2·오푸스 5.5·소넷 5.5·하이쿠 5.5는 다섯 단계(`low`~`max`)를 모두 지원한다. **기본값이 API와 Claude Code에서 다르다는 점만 주의하면 된다** — API 기본값은 페이블 5.2와 소넷 5.5가 `high`, 오푸스 5.5와 하이쿠 5.5가 `medium`인데, Claude Code는 이 네 모델 모두 `medium`에서 시작한다. 페이블 5.2 문서의 권고는 명확하다. **기본값 `high`에서 시작하고, 측정으로 이득이 확인된 가장 어려운 장시간 작업에만 `xhigh`로 올리고, `max`는 모델 천장을 재 볼 때만 쓰라.**

## 올리기 전에 알아야 할 코드 깨지는 변경 4가지

모델 ID만 바꿔 배포하면 터지는 지점이 정해져 있다. 공식 문서가 "코드를 깨뜨릴 수 있는 변경 4가지"로 따로 묶어 놨다.

| 증상 / 조건 | 원인 | 해법 |
|-------------|------|------|
| `The block is bound to a different conversation` (400) | 이전 턴을 수정하면 thinking 블록이 무효화된다. 페이블 5.2는 **계정 생성일과 무관하게** 전 계정에 이 검사를 적용한다 | `system`·`tools`·과거 메시지를 바꾸지 않고 `messages`에 **추가만** 한다. 임시로는 베타 헤더 `thinking-binding-controls-2026-08-01` + `prefix_mismatch_behavior: "drop_block"` |
| 모델을 바꿨더니 추론 맥락이 사라짐 (오류는 안 남) | 페이블 5.2의 thinking 블록은 **페이블 5.2·미토스 5.2만 읽는다.** 다른 모델로 넘기면 블록이 조용히 폐기된다(요청은 성공하고 과금도 안 됨) | 라우터·폴백이 모델을 섞어 쓰는지 점검. 페이블 5.2의 폴백 대상은 오푸스 4.8과 오푸스 5로 정해져 있다 |
| computer use 도구가 400 | 구형 `computer_20251124`는 Amazon Bedrock을 제외한 모든 플랫폼에서 거부된다 | `computer_toolset_20260801` 툴셋으로 교체 |
| advisor 도구가 400 | 페이블 5.2를 executor로 쓰면 advisor도 페이블 5.2 또는 미토스 5.2여야 한다 | advisor 정의의 `model`을 `claude-fable-5-2`로. 단 `tools` 변경은 새 대화에서 적용 |

여기에 **모든 요청에 걸리는 Messages API 규칙 두 가지**가 더 있다. 오푸스 5 이전 세대에서 올라오는 코드는 거의 반드시 걸린다.

- **적응형 사고(adaptive thinking)는 항상 켜져 있고 끌 수 없다.** `thinking: {"type": "enabled", "budget_tokens": N}`과 `{"type": "disabled"}`는 둘 다 400을 반환한다. `thinking`을 아예 생략하거나 `{"type": "adaptive"}`를 보내고, 깊이는 effort로 조절한다.
- **강제 도구 호출이 안 된다.** `tool_choice`를 `{"type": "any"}`나 `{"type": "tool", "name": ...}`로 주면 400이다. 스키마가 보장된 JSON이 필요하면 `tool_choice: {"type": "auto"}`를 유지하고 `strict: true`(strict tool use)를 쓰거나 JSON outputs를 쓴다.

파라미터 쪽에서는 `temperature`·`top_p`·`top_k`를 보내지 않는 것도 함께 확인해야 한다. 그리고 코드와 무관한 계약 조건이 하나 있다. **페이블 5.2와 미토스 5.2는 30일 데이터 보존을 요구하며, Anthropic의 명시적 승인 없이는 제로 데이터 보존(ZDR) 환경에서 쓸 수 없다.** 금융·공공처럼 ZDR을 전제로 계약한 조직이라면 이 한 줄이 도입 가능 여부를 가른다. 모델 성능을 비교하기 전에 계약 조건부터 확인해야 한다는 뜻이고, 한국의 많은 기업 환경에서 실질적인 제약이다.

## 그래서 어떤 기준으로 고르나

공식 문서가 제시하는 두 가지 출발 전략은 이렇게 정리된다.

**효율 우선(Option 1)** — 하이쿠 5.5로 구현해서 돌려 보고, 기능 공백이 확인될 때만 올린다. 초기 프로토타입, 지연 요건이 빡빡한 서비스, 대량 단순 작업에 맞는다.

**역량 우선(Option 2)** — 오푸스 5.5로 구현하고 프롬프트를 거기에 맞춰 최적화한 다음, effort를 낮추거나 더 싼 모델로 내려가며 효율을 올린다. 복잡한 추론, 과학·수학, 고자율 에이전트 작업에 맞는다. 그리고 **`xhigh`·`max`에서도 평가 기준을 못 맞출 때 페이블 5.2로 간다.**

선택 매트릭스는 다음과 같다.

| 필요한 것 | 시작할 모델 | 예시 작업 |
|-----------|------------|-----------|
| 현재 가능한 최고 역량 | 페이블 5.2 | 몇 시간 돌아가는 에이전트 세션, 다단계 심층 리서치, 완성 문서·스프레드시트·덱까지 가는 분석 |
| 복잡한 에이전틱 코딩·기업 업무 | 오푸스 5.5 | 수 시간 자율 코딩 에이전트, 대규모 리팩터링, 복잡한 시스템 엔지니어링, 비전 작업, computer use |
| 일상 코딩·에이전트의 속도와 역량 | 소넷 5.5 | 코드 생성, 데이터 분석, 콘텐츠 작성, 시각 이해, 에이전틱 도구 사용 |
| 최저 지연·최저 단가 | 하이쿠 5.5 | 실시간 애플리케이션, 대량 처리, 서브에이전트 작업 |

*출처: [Choosing the right model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)*

여기에 실무에서 효과가 큰 설계가 하나 더 있다. **모델을 섞는 것이다.** 문서가 소개하는 두 패턴은 ① 저가 모델을 executor로 두고 어려운 판단만 상위 모델 advisor에게 올리는 구조, ② 오케스트레이터가 대량 작업을 저가 워커에게 분배하는 구조다. 토큰 대부분이 낮은 단가로 청구되므로, 단일 모델로 전부 처리하는 것보다 같은 품질을 싸게 낸다. Claude Code의 `opusplan`(계획은 오푸스, 실행은 소넷)이 이 사고방식을 그대로 제품화한 예다.

**정리하면 이 글의 결론은 하나다. 새 모델이 나왔다는 사실은 교체 이유가 아니다.** 페이블 5.2는 분명 전작보다 싸고 강해졌지만, 공식 문서조차 "대부분의 워크로드는 오푸스 5.5로 시작하라"고 쓰고 페이블 5.2는 조건부 상위 선택지로 둔다. 지식 업무 벤치마크의 Elo가 오푸스 5.5 쪽이 높다는 숫자도 같은 얘기를 한다. 비용을 두 배로 올리기 전에 먼저 할 일은 **effort를 한 단계 올려 보는 것, 캐시 설계를 점검하는 것, 그리고 자기 평가셋으로 측정하는 것**이다. 그 셋을 다 해보고도 모자랄 때 쓰라고 만들어 둔 모델이 페이블 5.2다.

같은 질문을 다른 벤더에서 따져본 글로는 [딥시크 피크·오프피크 요금제](/blog/2026-08-14-deepseek-peak-offpeak-pricing/)와 [Kimi K3 요금 구조 분석](/blog/2026-07-20-kimi-k3-pricing-economics-analysis/)이 있다.

## 출처

- Anthropic, [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) — 모델별 ID·컨텍스트·가격·기본 effort 비교표 (2026-11-11 조회)
- Anthropic, [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) — 전 모델 입력/출력·캐시 쓰기·캐시 적중 단가, 배치 할인, 토크나이저 변경 안내 (2026-11-11 조회)
- Anthropic, [What's new in Claude Fable 5.2](https://platform.claude.com/docs/en/models/fable-5-2/whats-new-fable-5-2) — 코드를 깨뜨리는 변경 4가지, thinking·tool_choice 규칙, 고속 모드·배치 가격, 데이터 보존 요건 (2026-11-11 조회)
- Anthropic, [Claude Fable 5.2 모델 페이지](https://platform.claude.com/docs/en/models/fable-5-2/overview) — 출시일(2026-11-09), 은퇴 시점, 플랫폼별 모델 ID (2026-11-11 조회)
- Anthropic, [Choosing the right model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model) — 선택 전략과 모델 선택 매트릭스 (2026-11-11 조회)
- Anthropic, [Claude Code — Model configuration](https://code.claude.com/docs/en/model-config) — `/model`·`/effort` 명령, 별칭 해석표, 플랜별 기본 모델, `effortLevel` 적용 범위 (2026-11-11 조회)
- Anthropic, [Claude Fable 제품 페이지](https://www.anthropic.com/claude/fable) — 벤치마크 수치(FrontierCode 2.0, FrontierSWE v2, AutomationBench, Terminal-Bench-Science 0.1, AA-Briefcase v1.1)와 플랜별 제공 범위 (2026-11-11 조회)
- Amazon Web Services, [Announcing Amazon EC2 Reserved Instances](https://aws.amazon.com/blogs/aws/announcing-ec2-reserved-instances/) — 예약 인스턴스 선불 $325 + 시간당 $0.030, 온디맨드 시간당 $0.10 (2009-03-12)
- Amazon Web Services, [Amazon Web Services Announces Spot Instances for Amazon EC2](https://press.aboutamazon.com/2009/12/amazon-web-services-announces-spot-instances-for-amazon-ec2) — 스팟 인스턴스 입찰·중단 조건과 적합 워크로드 목록 (2009-12)

*이 글은 특정 제품의 구매를 권유하지 않으며, 가격·사양은 벤더 정책에 따라 바뀔 수 있다. 중요한 의사결정 전에는 반드시 공식 문서의 최신 값을 확인하기 바란다.*
