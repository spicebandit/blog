---
title: "아이폰 로컬 LLM 활용 사례 6가지 — 뭐에 쓰나"
description: "아이폰에 로컬 LLM을 깔았는데 뭐에 쓸지 모르겠다면. 오프라인·민감문서·번역·단축어·개발 6가지 용도를 2026년 11월 실측 속도·배터리·컨텍스트 한계와 함께 정리했다."
pubDate: 2026-11-17T05:33:41+09:00
category: ax
tags: ["로컬LLM", "아이폰AI", "온디바이스AI", "단축어"]
---

**아이폰 로컬 LLM 활용 사례** — 앱을 깔고 모델을 내려받아 첫 대화까지는 해봤는데, 그다음이 막히는 사람을 위한 글이다. 답부터 말하면 아이폰 로컬 LLM이 실제로 값을 내는 자리는 여섯 군데다. ①전파 없는 환경 ②기기를 떠나면 안 되는 문서 ③번역·요약·글다듬기 ④단축어(Shortcuts) 자동화 ⑤개발자의 짧은 보조 작업 ⑥그리고 "이건 클라우드로 넘긴다"는 경계 판단. 설치 방법·앱 비교·기종별 RAM은 [아이폰 로컬 LLM 돌리기 2편](/blog/2026-07-03-local-llm-iphone-guide/)에 이미 정리해 뒀으니 이 글에서는 반복하지 않는다. 대신 **2026년 11월 기준 실측 숫자**를 깔고 시작한다. 속도가 얼마나 나오고, 몇 분 만에 발열로 반토막이 나고, 문서를 얼마나 넣을 수 있는지를 모르면 용도 판단이 전부 어긋난다.

| 가장 많이 묻는 것 | 한 줄 답 |
|---|---|
| **뭐에 쓸 만한가** | 번역·요약·글다듬기·분류·단축어 자동화. 사실 확인과 계산에는 쓰지 않는다 |
| **얼마나 빠른가** | A19(iPhone Air) 실측으로 2B급 35 tok/s, 4B급 14.7 tok/s. 사람이 읽는 속도(참고치 초당 5~7토큰)의 2~6배 |
| **배터리·발열은** | 20회 연속 추론에 배터리 5% 소모, 처리량은 3회차부터 꺾여 최종 −41.5% |

## 1. 지금 아이폰에서 실제로 얼마나 빠른가 — 18개 모델 실측표

답부터: **2B급이 초당 35토큰, 4B급이 14.7토큰이다.** 7월 글에서 인용했던 "3~4B급 10~20 tok/s"보다 올라갔고, 무엇보다 모델 세대가 한 번 갈렸다.

아래는 pocket-ai-lab이 iPhone Air(A19, RAM 11.5GB, iOS 26.6.1)에서 2026년 9월 3일~10월 23일에 18개 모델·40회를 돌려 공개한 측정값이다. 측정 절차가 명시돼 있다는 점이 중요하다 — 매 실행 전 발열 게이트(최대 60초 쿨다운), 콜드 로드 측정, 워밍업 생성, 디코드 3회 반복 측정, 그리고 채점은 LLM이 아니라 결정론적 규칙으로 한다. 품질 점수는 118개 과제 묶음을 0~100으로 환산한 값이다.

| 모델 | 형식 | 생성 속도(tok/s) | 최대 메모리 | 품질 점수 | 스로틀링 |
|---|---|---|---|---|---|
| LFM2 1.2B | GGUF | **77.3** ± 0.4 | 249 MB | 58.5 | 없음 |
| Qwen 3.5 0.8B | GGUF | 73.7 ± 0.2 | 598 MB | 46.6 | 없음 |
| Qwen 3.5 2B | GGUF | 36.6 ± 1.3 | 1,054 MB | 64.4 | 없음 |
| LFM2 2.6B | GGUF | 35.9 ± 0.7 | 266 MB | 60.2 | 없음 |
| Gemma 4 E2B | GGUF | 35.0 ± 2.3 | 1,490 MB | 63.6 | 없음 |
| Llama 3.2 3B | GGUF | 26.9 ± 0.6 | 721 MB | 59.3 | 없음 |
| Llama 3.2 3B | MLX | 23.9 ± 3.3 | 2,568 MB | 59.3 | −23% |
| Phi-3.5 Mini | GGUF | 23.2 ± 1.2 | 1,739 MB | 66.1 | −9% |
| Gemma 3 4B | GGUF | 20.7 ± 1.6 | 2,175 MB | 60.2 | −14% |
| Qwen 3.5 4B | GGUF | 14.7 ± 2.7 | 1,252 MB | **68.6** | −31% |
| Qwen2-VL 7B | MLX | 11.6 ± 4.8 | 5,461 MB | 63.6 | −59% |
| Llama 3.1 8B | MLX | 7.6 ± 3.8 | 5,121 MB | 57.6 | −66% |
| Qwen 2.5 1.5B | Core ML | 3.0 ± 0.3 | 4,354 MB | 24.6 | 없음 |

*출처: [pocket-ai-lab — iPhone LLM benchmarks](https://ananasdda.github.io/pocket-ai-lab/benchmarks/) (iPhone Air·A19·iOS 26.6.1, 2026-09-03~10-23 측정, 전체 18개 모델 중 발췌). 속도 내림차순 정렬이며 Core ML 변환본은 비교용으로 맨 아래 배치했다.*

이 표에서 용도 판단에 바로 쓰이는 사실 세 가지를 뽑으면 이렇다.

**첫째, 같은 모델이라도 형식에 따라 메모리가 3배 넘게 벌어진다.** Llama 3.2 3B는 GGUF로 721MB, MLX로 2,568MB를 썼다. 품질 점수는 둘 다 59.3으로 같다. 같은 지능을 3.5배 메모리로 사는 셈이니, 8GB 이하 기종에서는 GGUF 쪽을 먼저 보는 게 합리적이다(그리고 메모리 여유가 곧 컨텍스트 여유다 — 4절에서 다룬다). 가장 극단적인 사례는 표 맨 아래 Core ML 변환본이다. Qwen 2.5 1.5B는 1.5B에 불과한데 4,354MB를 쓰고 속도는 3.0 tok/s, 품질은 24.6으로 측정 대상 중 최하였다. **형식 선택이 모델 선택보다 결과를 더 크게 흔든다.**

**둘째, 속도와 품질은 뒤집혀 있다.** 가장 빠른 LFM2 1.2B는 품질 58.5, 가장 품질이 좋은 Qwen 3.5 4B는 14.7 tok/s로 가장 느린 축이다. "제일 빠른 모델"과 "제일 똑똑한 모델"은 다른 물건이고, 용도에 따라 갈라 쓰는 게 맞다. 분류·태깅처럼 짧게 자주 때리는 작업은 1~2B급, 문장을 다시 써야 하는 작업은 4B급이다.

**셋째, 4B를 넘기면 발열이 지배한다.** 7~8B 모델은 속도 자체도 낮은데 편차(±3.8~4.8)가 평균의 절반에 달한다. 측정 중 스로틀링이 −59~−66%로 찍혔다는 뜻이고, 이건 "조금 느리다"가 아니라 "쓰다 보면 멈춘 것처럼 보인다"는 체감이다.

<figure>
<svg viewBox="0 0 820 420" role="img" aria-label="iPhone Air(A19)에서 측정한 모델별 생성 속도 막대그래프. LFM2 1.2B 초당 77.3토큰, Qwen 3.5 0.8B 73.7, Qwen 3.5 2B 36.6, LFM2 2.6B 35.9, Gemma 4 E2B 35.0, Llama 3.2 3B 26.9, Phi-3.5 Mini 23.2, Qwen 3.5 4B 14.7, Llama 3.1 8B 7.6, 사람이 읽는 속도 약 6토큰" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;font-family:system-ui">
  <text x="20" y="28" font-size="16" font-weight="700" fill="#23201D">모델별 생성 속도 (tok/s — 높을수록 빠름) · 괄호는 118과제 품질 점수</text>
  <text x="20" y="48" font-size="12" fill="#8A8378">iPhone Air(A19, RAM 11.5GB, iOS 26.6.1) 실측 · 2026-09~10 · 출처 pocket-ai-lab</text>
  <g stroke="#E5DECF" stroke-width="1">
    <line x1="250" y1="62" x2="250" y2="364"/>
    <line x1="380" y1="62" x2="380" y2="364"/>
    <line x1="510" y1="62" x2="510" y2="364"/>
    <line x1="640" y1="62" x2="640" y2="364"/>
    <line x1="770" y1="62" x2="770" y2="364"/>
  </g>
  <!-- row 1 -->
  <text x="242" y="83" font-size="12" fill="#23201D" text-anchor="end">LFM2 1.2B (GGUF)</text>
  <rect x="250" y="70" width="502" height="18" rx="3" fill="#1B4F8A"/>
  <text x="742" y="83" font-size="12" font-weight="700" fill="#FAF6EE" text-anchor="end">77.3 (58.5)</text>
  <!-- row 2 -->
  <text x="242" y="113" font-size="12" fill="#23201D" text-anchor="end">Qwen 3.5 0.8B</text>
  <rect x="250" y="100" width="479" height="18" rx="3" fill="#A8BDD2"/>
  <text x="719" y="113" font-size="12" fill="#23201D" text-anchor="end">73.7 (46.6)</text>
  <!-- row 3 -->
  <text x="242" y="143" font-size="12" fill="#23201D" text-anchor="end">Qwen 3.5 2B</text>
  <rect x="250" y="130" width="238" height="18" rx="3" fill="#4E7FA8"/>
  <text x="496" y="143" font-size="12" fill="#23201D">36.6 (64.4)</text>
  <!-- row 4 -->
  <text x="242" y="173" font-size="12" fill="#23201D" text-anchor="end">LFM2 2.6B</text>
  <rect x="250" y="160" width="233" height="18" rx="3" fill="#A8BDD2"/>
  <text x="491" y="173" font-size="12" fill="#23201D">35.9 (60.2)</text>
  <!-- row 5 -->
  <text x="242" y="203" font-size="12" fill="#23201D" text-anchor="end">Gemma 4 E2B</text>
  <rect x="250" y="190" width="228" height="18" rx="3" fill="#4E7FA8"/>
  <text x="486" y="203" font-size="12" fill="#23201D">35.0 (63.6)</text>
  <!-- row 6 -->
  <text x="242" y="233" font-size="12" fill="#23201D" text-anchor="end">Llama 3.2 3B (GGUF)</text>
  <rect x="250" y="220" width="175" height="18" rx="3" fill="#A8BDD2"/>
  <text x="433" y="233" font-size="12" fill="#23201D">26.9 (59.3)</text>
  <!-- row 7 -->
  <text x="242" y="263" font-size="12" fill="#23201D" text-anchor="end">Phi-3.5 Mini (GGUF)</text>
  <rect x="250" y="250" width="151" height="18" rx="3" fill="#4E7FA8"/>
  <text x="409" y="263" font-size="12" fill="#23201D">23.2 (66.1)</text>
  <!-- row 8 -->
  <text x="242" y="293" font-size="12" fill="#23201D" text-anchor="end">Qwen 3.5 4B (GGUF)</text>
  <rect x="250" y="280" width="96" height="18" rx="3" fill="#1B4F8A"/>
  <text x="354" y="293" font-size="12" font-weight="700" fill="#23201D">14.7 (68.6 — 최고 품질)</text>
  <!-- row 9 -->
  <text x="242" y="323" font-size="12" fill="#23201D" text-anchor="end">Llama 3.1 8B (MLX)</text>
  <rect x="250" y="310" width="49" height="18" rx="3" fill="#A8BDD2"/>
  <text x="307" y="323" font-size="12" fill="#23201D">7.6 (57.6 · 스로틀링 −66%)</text>
  <!-- row 10 -->
  <text x="242" y="353" font-size="12" fill="#8A8378" text-anchor="end">사람이 읽는 속도(참고치)</text>
  <rect x="250" y="340" width="39" height="18" rx="3" fill="#E5DECF"/>
  <text x="297" y="353" font-size="12" fill="#8A8378">약 6</text>
  <g font-size="11" fill="#8A8378">
    <text x="250" y="382" text-anchor="middle">0</text>
    <text x="380" y="382" text-anchor="middle">20</text>
    <text x="510" y="382" text-anchor="middle">40</text>
    <text x="640" y="382" text-anchor="middle">60</text>
    <text x="770" y="382" text-anchor="middle">80 tok/s</text>
  </g>
  <text x="20" y="408" font-size="11" fill="#8A8378">진한 막대 = 속도 1위(LFM2 1.2B)와 품질 1위(Qwen 3.5 4B). 둘은 서로 반대편에 있다.</text>
</svg>
<figcaption>속도 1위와 품질 1위가 표의 반대쪽 끝에 있다. 아이폰에서는 "제일 좋은 모델" 하나를 고르는 게 아니라 용도별로 두 개를 번갈아 쓰는 편이 낫다. 출처: pocket-ai-lab(2026-10).</figcaption>
</figure>

## 2. 배터리와 발열 — 몇 분 쓰면 반토막 나는가

답부터: **연속 추론 20회에 배터리 5%가 빠지고, 처리량은 3회차부터 꺾여 최종 −41.5%까지 떨어진다.** 이것이 "짧고 빈번하게"라는 사용 원칙의 근거다.

출처는 2026년 3월 공개(6월 개정)된 논문 「LLM Inference at the Edge: Mobile, NPU, and GPU Performance Efficiency Trade-offs Under Sustained Load」다. iPhone 16 Pro에서 Qwen 2.5 1.5B(4비트)에 258토큰 프롬프트를 20회 연속 투입하며 상태를 기록했다.

| 측정 항목 | iPhone 16 Pro (MLX) | Galaxy S24 Ultra | RTX 4050(참고) |
|---|---|---|---|
| 최고 처리량 | 40.49 tok/s | — | 131.70 ± 2.87 tok/s |
| 지속(Hot) 처리량 | 23.67 ± 0.28 tok/s | 10.38 ± 0.44 tok/s | — |
| 최고 대비 하락 | **−41.5%** | 안정 구간(8회차~) 편차 4.2% | — |
| 20회 중 배터리 소모 | 5% (100%→95%) | 7% | 해당 없음 |
| 토큰당 에너지 | iOS 제약으로 측정 불가 | 146.4 ± 10.8 mJ | 297.3 ± 6.5 mJ |

*출처: Tummalapalli 외, [LLM Inference at the Edge (arXiv:2603.23640)](https://arxiv.org/abs/2603.23640), 2026-03 제출·2026-06 개정. Qwen 2.5 1.5B 4비트, 258토큰 프롬프트 20회 반복.*

눈여겨볼 대목은 **상태 전이 시점**이다. 논문은 기기가 Normal(1~2회차) → Warm(3~16회차) → Hot(17~20회차)으로 넘어갔고, Warm에 들어서는 순간 처리량이 약 38% 떨어졌다고 기록했다. 즉 성능 저하는 "10분쯤 쓰면" 오는 게 아니라 **세 번째 요청부터** 온다. 아이폰 로컬 LLM에서 첫 응답이 유난히 빠르게 느껴지는 건 착각이 아니다. 그게 유일한 Normal 상태 응답이기 때문이다.

발열이 성능 상한을 정하는 건 휴대폰만의 사정이 아니라 20년 된 구조적 조건이다. 1974년 로버트 데나드가 내놓은 스케일링 법칙은 트랜지스터를 줄여도 전력 밀도가 유지된다고 했지만, 누설 전류가 크기에 따라 줄지 않아 2000년대 중반 깨졌다([Dennard 외, IEEE JSSC SC-9(5), 1974](https://doi.org/10.1109/JSSC.1974.1050511)). 그 뒤 칩의 한계는 "몇 개를 넣나"에서 "몇 개를 동시에 켜 두나"로 옮겨갔고, 2011년 ISCA 논문은 전력 때문에 꺼둬야 하는 면적을 **다크 실리콘**이라 부르며 22nm에서 21%, 8nm에서 50% 이상이 꺼져 있어야 한다고 계산했다([Esmaeilzadeh 외, ISCA 2011](https://www.microsoft.com/en-us/research/publication/dark-silicon-and-the-end-of-multicore-scaling/)). 팬도 방열판도 없는 아이폰은 그 제약의 가장 극단적인 형태다. 3회차에서 꺾이는 그래프는 앱의 결함이 아니라, 20년간 좁아져 온 열 예산이 손바닥 안에서 드러난 것이다.

같은 표에서 안드로이드 쪽이 느리지만 안정적이라는 점도 읽어둘 만하다. Galaxy S24 Ultra는 10.38 tok/s로 느린 대신 안정 구간 편차가 4.2%에 불과했다. 아이폰은 "빠르게 시작해서 빠르게 식는" 쪽, 안드로이드는 "낮은 데서 오래 버티는" 쪽이다. 긴 작업을 맡길 생각이라면 이 성격 차이가 기종 선택보다 중요하다.

에너지 효율 관점에서 한 가지 더. 2026년 7월 공개된 「The Battery Price of edge AI」는 iPhone 14와 Pixel 8을 서버 추론과 비교해, 연구의 모델링 가정 아래 로컬 추론이 **배치 처리된 서버 추론보다 토큰당 5~7배 환경 영향이 크다**고 보고했다. 그 영향의 88~90%(초록 기준)는 전기가 아니라 기기 제조에 묶인 탄소이고, 배터리 열화가 교체 주기를 앞당기기 때문이다. 양자화는 4비트가 가장 효율적이었다. 로컬 LLM의 가치는 효율이 아니라 **프라이버시와 가용성**이라는 점을 숫자가 확인해 준다.

<figure>
<svg viewBox="0 0 820 300" role="img" aria-label="iPhone 16 Pro 연속 추론 시 발열 상태별 처리량 막대그래프. Normal 상태 초당 40.49토큰, Warm 상태 약 25토큰, Hot 상태 23.67토큰" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;font-family:system-ui">
  <text x="20" y="28" font-size="16" font-weight="700" fill="#23201D">연속 추론 시 발열 상태별 처리량 — 3회차부터 꺾인다</text>
  <text x="20" y="48" font-size="12" fill="#8A8378">iPhone 16 Pro · Qwen 2.5 1.5B(4bit) · 258토큰 프롬프트 20회 반복 · 출처 arXiv:2603.23640</text>
  <g stroke="#E5DECF" stroke-width="1">
    <line x1="200" y1="62" x2="200" y2="238"/>
    <line x1="336" y1="62" x2="336" y2="238"/>
    <line x1="471" y1="62" x2="471" y2="238"/>
    <line x1="607" y1="62" x2="607" y2="238"/>
    <line x1="742" y1="62" x2="742" y2="238"/>
  </g>
  <text x="192" y="92" font-size="13" fill="#23201D" text-anchor="end">Normal (1~2회차)</text>
  <rect x="200" y="74" width="549" height="34" rx="4" fill="#1B4F8A"/>
  <text x="739" y="96" font-size="14" font-weight="700" fill="#FAF6EE" text-anchor="end">40.49 tok/s</text>
  <text x="192" y="152" font-size="13" fill="#23201D" text-anchor="end">Warm (3~16회차)</text>
  <rect x="200" y="134" width="340" height="34" rx="4" fill="#4E7FA8"/>
  <text x="530" y="156" font-size="14" font-weight="700" fill="#FAF6EE" text-anchor="end">약 25 (−38%)</text>
  <text x="192" y="212" font-size="13" fill="#23201D" text-anchor="end">Hot (17~20회차)</text>
  <rect x="200" y="194" width="321" height="34" rx="4" fill="#A8BDD2"/>
  <text x="511" y="216" font-size="14" font-weight="700" fill="#23201D" text-anchor="end">23.67 (−41.5%)</text>
  <g font-size="11" fill="#8A8378">
    <text x="200" y="256" text-anchor="middle">0</text>
    <text x="336" y="256" text-anchor="middle">10</text>
    <text x="471" y="256" text-anchor="middle">20</text>
    <text x="607" y="256" text-anchor="middle">30</text>
    <text x="742" y="256" text-anchor="middle">40 tok/s</text>
  </g>
  <text x="20" y="282" font-size="12" fill="#23201D">같은 20회 구간에서 배터리는 100% → 95%로 5% 감소. 발열이 성능을 먼저 깎고, 배터리는 그다음이다.</text>
</svg>
<figcaption>성능 저하가 "장시간 사용"의 문제가 아니라 "세 번째 요청"의 문제라는 점이 핵심이다. 출처: arXiv:2603.23640(2026-06 개정).</figcaption>
</figure>

## 3. 비행기·지하철·해외 로밍 없는 환경 — 가장 확실한 자리

답부터: **여섯 용도 중 가장 확실하다. 다만 한국어 번역은 기대치를 낮춰야 한다.**

모델을 메모리에 올린 뒤에는 네트워크 요청이 0이므로, 기내·지하철·로밍 꺼둔 해외에서 그대로 작동한다. 이 점은 1편·2편에서 이미 확인했으니, 여기서는 "그래서 그 환경에서 무엇을 맡기느냐"만 보자.

| 상황 | 로컬 LLM이 나은 것 | 전용 앱·기능이 나은 것 |
|---|---|---|
| 기내에서 메일 초안 | 한국어 초안 다듬기, 톤 바꾸기, 요점 3줄 정리 | — |
| 해외 식당 메뉴판 | 비전 모델로 사진 설명 → 재료·조리법 추정 | 단어 단위 번역은 Apple 번역 오프라인 모드가 빠르고 정확 |
| 지하철에서 긴 문서 읽기 | 단락별 요약, 모르는 용어 풀이 | 문서 전체 요약은 컨텍스트 한계로 불가(4절 참조) |
| 여행 중 회화 | 문장 만들기, 상황별 표현 제안 | 실시간 음성 통역은 전용 앱 |
| 산행·캠핑 메모 | 음성 입력 → 정리, 체크리스트 생성 | — |

번역을 따로 짚을 필요가 있다. 솔직하게 적자면, **아이폰에서 돌아가는 소형 모델의 한국어 품질을 기종·모델별로 체계적으로 측정한 공개 자료는 아직 드물다.** 1절에서 인용한 118과제 묶음도 종합 점수이고 다국어 과제는 그중 일부다 — Qwen 3.5 2B의 64.4를 한국어 성능 근거로 읽으면 안 된다. 다만 모델 쪽 공식 문서에 기댄 선택은 가능하다. Qwen 계열은 모델 카드에서 "한국어를 포함한 29개 이상 언어를 지원한다"고 밝히고 있어([Qwen2.5-7B-Instruct 모델 카드](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct)), 한국어 작업이면 **Qwen 3.5 계열을 먼저 시험해 보는 편이 시간이 덜 든다.** 공개된 다국어 지원 서술은 Qwen2.5 세대 문서 기준이며, 3.5 계열도 같은 노선을 잇는다고 보고 고른 것이다. 요컨대 이 권고는 제3자 측정이 아니라 모델 측 문서와 커뮤니티 평가에 기댄 것임을 밝힌다.

오프라인 참조 도구는 늘 이런 모양이었다. 1985년 그롤리어가 21권짜리 『아카데믹 아메리칸 백과사전』 전문(약 3만 항목·900만 단어)을 CD-ROM 한 장에 담아 내놓았을 때, 그것은 삽화도 지도도 없는 텍스트 전용 판본이었다([Academic American Encyclopedia](https://en.wikipedia.org/wiki/Academic_American_Encyclopedia)). 사람들은 깎인 판본을 받아들였다 — 언제나 손에 있고 전문 검색이 된다는 것이 삽화보다 값졌기 때문이다. 아이폰의 로컬 모델도 같은 거래다. 더 못한 모델을 받는 대신, 전파가 없을 때도 있는 쪽을 산다.

실용적인 결론은 이렇다. **번역을 "대신 해주는 도구"가 아니라 "초안을 만들어 주는 도구"로 쓴다.** 내가 아는 언어로 된 문장을 다듬거나 요약하는 작업은 지금 수준에서도 충분히 쓸 만하고, 모르는 언어를 믿고 맡기는 작업은 아직 아니다.

![A woman records a video of the sky through an airplane window using her smartphone.](https://images.pexels.com/photos/15923452/pexels-photo-15923452.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Asad Photo Maldives](https://www.pexels.com/@asadphoto) on [Pexels](https://www.pexels.com/photo/woman-recording-video-through-airplane-window-15923452/)*

## 4. 민감한 문서 요약 — 프라이버시는 진짜, 컨텍스트가 벽이다

답부터: **데이터가 기기를 떠나지 않는 건 사실이지만, 긴 문서는 애초에 들어가지 않는다.** iPhone 16급(RAM 6GB)에서 실사용 가능한 컨텍스트는 1,024~1,500토큰 수준으로 보고된다.

이유는 KV 캐시다. 추론 중 모델은 지금까지 읽은 토큰의 키·밸류를 메모리에 쌓아두는데, 이 양이 문맥 길이에 비례해 늘고 추론 중간에 줄지 않는다. 계산식과 실제 숫자를 보면 벽의 높이가 눈에 보인다.

```text
KV 캐시 바이트 = 2 × 레이어수 × 헤드수 × 헤드차원 × 토큰수 × 자료형바이트
예) 32레이어·32헤드·헤드차원 128·float16·2,048토큰
  = 2 × 32 × 32 × 128 × 2048 × 2 ≈ 1.07 GB
```

여기에 3B 모델을 4비트로 압축한 가중치 약 1.7GB를 더하면 **합계 2.8GB**다. 원문 표현대로 이는 6GB 기종의 jetsam 한도를 "훌쩍 넘어선(well past)" 수준이고, iOS는 한도를 넘는 앱을 jetsam으로 즉시 종료시킨다. 짧은 프롬프트로 테스트할 때는 멀쩡하던 앱이 긴 문서를 붙여넣는 순간 튕기는 전형적인 실패가 여기서 나온다.

<figure>
<svg viewBox="0 0 820 260" role="img" aria-label="3B 4비트 모델의 메모리 구성 막대그래프. 가중치만 1.7기가바이트, 2048토큰 KV캐시를 더하면 2.77기가바이트로 6GB 기종 jetsam 한도 추정선 2기가바이트를 초과한다" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;font-family:system-ui">
  <text x="20" y="28" font-size="16" font-weight="700" fill="#23201D">문서를 붙여넣는 순간 메모리가 jetsam 한도를 넘는다 (3B·4bit 기준)</text>
  <text x="20" y="48" font-size="12" fill="#8A8378">가중치 1.7GB + 2,048토큰 KV 캐시 1.07GB ≈ 2.77GB · 점선은 6GB 기종 jetsam 한도 추정선</text>
  <g stroke="#E5DECF" stroke-width="1">
    <line x1="210" y1="62" x2="210" y2="186"/>
    <line x1="404" y1="62" x2="404" y2="186"/>
    <line x1="598" y1="62" x2="598" y2="186"/>
    <line x1="791" y1="62" x2="791" y2="186"/>
  </g>
  <text x="202" y="96" font-size="13" fill="#23201D" text-anchor="end">가중치만</text>
  <rect x="210" y="76" width="329" height="32" rx="4" fill="#4E7FA8"/>
  <text x="529" y="97" font-size="13" font-weight="700" fill="#FAF6EE" text-anchor="end">1.70 GB</text>
  <text x="202" y="156" font-size="13" fill="#23201D" text-anchor="end">+ 2,048토큰 문맥</text>
  <rect x="210" y="136" width="329" height="32" rx="4" fill="#4E7FA8"/>
  <rect x="539" y="136" width="207" height="32" rx="4" fill="#1B4F8A"/>
  <text x="736" y="157" font-size="13" font-weight="700" fill="#FAF6EE" text-anchor="end">2.77 GB</text>
  <line x1="597" y1="66" x2="597" y2="182" stroke="#23201D" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="604" y="76" font-size="12" font-weight="700" fill="#23201D">한도 추정 2GB</text>
  <g font-size="11" fill="#8A8378">
    <text x="210" y="204" text-anchor="middle">0</text>
    <text x="404" y="204" text-anchor="middle">1.0</text>
    <text x="598" y="204" text-anchor="middle">2.0</text>
    <text x="791" y="204" text-anchor="middle">3.0 GB</text>
  </g>
  <text x="20" y="232" font-size="12" fill="#23201D">진한 구간이 문맥(KV 캐시)이다. 문서가 길어질수록 이 구간만 선형으로 늘어난다.</text>
  <text x="20" y="250" font-size="11" fill="#8A8378">한도를 넘으면 iOS가 앱을 즉시 종료(jetsam)한다 — 빌드나 테스트에서는 드러나지 않는 실패다.</text>
</svg>
<figcaption>모델을 키우는 게 아니라 문서를 쪼개는 쪽이 정답인 이유. 계산식·메모리 수치 출처: MVP Factory 기술노트(2026-11-10). 2GB 한도선은 원문에 없는 필자 추정이다.</figcaption>
</figure>

그래서 실무 규칙은 "모델을 키운다"가 아니라 "문서를 쪼갠다"가 된다. 한국어는 글자 하나가 대략 토큰 1~1.5개를 먹는다(영어보다 토큰 효율이 낮다). 그래서 1,500토큰은 **한글 약 1,000~1,500자** 정도로 보면 된다 — 토크나이저에 따라 달라지므로 어림값이다.

| 문서 | 대략 분량 | 로컬에서 되나 | 방법 |
|---|---|---|---|
| 문자·카톡 대화 묶음 | 수백 자 | ○ | 그대로 붙여넣기 |
| 진단서·검사 결과지 1장 | 1,000자 안팎 | ○ (용어 풀이까지만) | 요점 정리까지. 판단·진단은 범위 밖 |
| 근로계약서·임대차계약서 | 3,000~8,000자 | △ | 조항 단위로 끊어 질문 |
| 사업계획서·IR 자료 | 2만 자 이상 | ✕ | 로컬로는 비현실적 |
| 녹취록·회의록 | 1만 자 이상 | ✕ | 구간별로 나눠 반복 요약 |

여기서 반드시 구분해야 할 함정이 하나 있다. **Apple 단축어의 'Use Model' 액션에서 On-Device를 고르지 않으면 데이터는 기기를 떠난다.** Apple 지원 문서는 이 액션의 선택지를 On-Device(네트워크 불필요), Cloud(Private Cloud Compute), Cloud Pro(확장 컨텍스트), Extension Model(ChatGPT)로 명시한다. PCC는 Apple이 설계한 프라이버시 보호 구조이지만 어쨌든 기기 밖 연산이고, Extension Model은 외부 사업자다. 민감 문서를 다룰 때 "온디바이스 계층이 보장되지 않으면 쓰지 않는다"는 원칙이 나오는 이유다. 검증 가능한 데이터 상주가 필요하면 선택지는 On-Device 고정 또는 직접 돌리는 로컬 모델 둘뿐이다.

의료 기록은 한 단계 더 보수적으로 가야 한다. 임상 추론 과제로 온디바이스 모델을 비교한 연구(「Medicine on the Edge」, 2025-02)는 Phi-3 Mini 같은 범용 소형 모델이 속도·정확도 균형은 좋지만 최고 정확도는 의료 특화 모델 몫이고, 구형 기기에서는 연산력보다 메모리가 더 큰 제약이라고 보고했다. 요컨대 **용어 풀이와 요점 정리까지가 안전한 범위이고, 판단·진단은 범위 밖**이다. 이 글은 의료·법률 조언이 아니다.

## 5. 단축어(Shortcuts) 연동 — 실제로 자동화되는 것

답부터: **두 갈래다. 설치 없이 쓰는 Apple 내장 모델(Use Model 액션)과, 모델을 골라 쓰는 앱 쪽 App Intents.** 한국어 작업이면 2026년 10월 26일 이후 둘 다 선택지가 된다.

Apple 쪽 조건은 문서에 명시돼 있다. Use Model 액션은 iOS 27 이상, iPhone 15 Pro·15 Pro Max 또는 iPhone 16 이후 기종에서 쓸 수 있고, 입력에 이전 액션의 결과·변수·캘린더·미리알림·사진을 넣을 수 있다. 한국어는 iOS 27.2에서 Siri AI 지원 언어에 추가됐다(프랑스어·일본어·한국어·포르투갈어·스페인어, 2026-10-26). 서버 쪽 선택지에는 일일 사용 한도가 적용될 수 있다고 적혀 있다.

앱 전반 비교는 [2편](/blog/2026-07-03-local-llm-iphone-guide/)에 있다. 아래 표는 **단축어·자동화 지원 여부 한 축만** 본 것이다.

| 경로 | 조건 | 모델 선택 | 비용 | 쓸 자리 |
|---|---|---|---|---|
| **Apple Use Model (On-Device)** | iOS 27+, 15 Pro/16 이후 | 불가(약 3B 내장) | 무료 | 분류·추출·문장 다듬기 등 정형 작업 |
| **PocketPal AI** | v1.11.5(2025-10-24)에서 단축어 지원 | 자유(GGUF 전부) | 무료(MIT) | 모델을 바꿔 쓰고 싶을 때 |
| **PocketPal 로컬 API 서버** | v1.23.0, Plus 기능 — 아직 POC 표기 | 자유 | 일회성 결제(소스 빌드 시 포함) | 다른 앱·기기에서 폰 모델 호출 |
| **Private LLM** | v1.9.18(2026-10-28) | 큐레이션된 오픈모델 다수(Llama·Gemma·Phi·Qwen 계열) | 일회성 $4.99 | Siri 음성 트리거까지 엮을 때 |
| **Locally (LM Studio) + LM Link** | v1.67.0(2026-11-04) | MLX·LFM3·Bonsai 2 등 | 무료 | 집 맥의 큰 모델로 넘길 때 |

*출처: [Apple 지원 — 단축어에서 Apple Intelligence 사용](https://support.apple.com/guide/shortcuts/use-apple-intelligence-in-shortcuts-tpg3vrvwmclv/ios), [Apple Newsroom(2026-10-26)](https://www.apple.com/newsroom/2026/10/siri-ai-is-available-in-more-languages-starting-today/), [PocketPal AI GitHub](https://github.com/a-ghorbani/pocketpal-ai), [Private LLM](https://privatellm.app/blog/run-local-gpt-on-ios-complete-guide)*

자동화가 로컬 LLM의 체감을 바꾸는 이유는 단순하다. **채팅창을 열어 질문을 입력하는 비용이 사라지면 쓰는 횟수가 달라진다.** 실제로 조립해 둘 만한 레시피 셋을 적어둔다.

1. **공유 시트 → 요약 → 메모 저장.** 기사·PDF를 공유 시트에서 단축어로 넘겨 "핵심 3줄 + 내가 확인할 것 1줄"로 정리한 뒤 메모 앱에 날짜별로 쌓는다. 입력 길이를 1,000자 안팎으로 자르는 단계를 반드시 넣어야 4절의 jetsam을 피한다.
2. **받은 문자 분류 → 알림 조절.** 자동화로 들어온 문자 내용을 모델에 넣어 "광고/업무/개인" 한 단어로 분류하게 하고, 결과에 따라 집중 모드를 바꾼다. 분류는 1~2B급으로 충분하고 응답이 짧아 발열이 거의 없다.
3. **음성 메모 → 할 일 추출.** 음성 입력으로 받아쓴 텍스트를 넣어 동작 항목만 뽑아 미리알림에 넣는다. PocketPal은 기기 내 Whisper로 음성 입력까지 처리하므로 이 흐름 전체가 오프라인으로 닫힌다.

세 레시피의 공통점을 보면 로컬 모델의 적정 용도가 보인다. **입력이 짧고, 출력이 더 짧고, 틀려도 복구가 쉬운 작업**이다. 반대로 긴 글을 새로 써내는 작업은 발열·컨텍스트·품질 세 군데서 동시에 걸린다.

## 6. 개발자 활용 — 커밋 메시지·정규식·에러 해설까지

답부터: **커밋 메시지 초안, 정규식 설명, 에러 메시지 해설까지는 쓸 만하다. 코드 생성과 디버깅은 아니다.**

근거는 1절의 품질 측정에서 나온다. pocket-ai-lab은 **지시 따르기(instruction following)가 모델 간 변별력이 가장 큰 항목**이었고, **수학은 8문제 중 1~5개로 전반적으로 약했다**고 기록했다. 이 조합이 개발 작업에 그대로 대응된다. "형식을 지켜서 다시 써라"는 작업은 되고, "스스로 계산하고 추론해서 맞춰라"는 작업은 안 된다.

| 작업 | 로컬 3~4B급 | 이유 |
|---|---|---|
| git diff → 커밋 메시지 초안 | ○ | 입력 요약 + 형식 준수. 지시 따르기 영역 |
| 정규식 읽고 설명 | ○ | 패턴 해석은 짧은 변환 작업 |
| 에러 메시지 1차 해설 | ○ | 전형적 문구가 많아 소형 모델도 맞춤 |
| 변수·함수 이름 후보 뽑기 | ○ | 짧은 출력, 검증 즉시 가능 |
| 정규식 **작성** | △ | 그럴듯한데 틀린 패턴이 흔하다. 반드시 테스트 |
| 함수 작성·리팩터링 | ✕ | 컨텍스트 1,500토큰 ≈ 코드 40~60줄. 애초에 안 들어간다 |
| 버그 원인 추적 | ✕ | 여러 파일 교차 추론 — 소형 모델의 약점 |
| 알고리즘 복잡도·수치 계산 | ✕ | 수학 영역에서 측정 자체가 나쁘다 |

여기서 2026년에 새로 생긴 쓸모가 하나 있다. **PocketPal v1.23.0(2026-11-10)이 개념검증(POC) 단계로 넣은 로컬 API 서버**는 폰에서 돌아가는 모델을 같은 네트워크의 다른 기기에 OpenAI 호환 엔드포인트로 노출한다. 맥에서 짠 스크립트가 폰의 모델을 때릴 수 있다는 뜻이고, "전기를 거의 안 쓰는 상시 추론 노드"로 폰을 쓰는 구성이 가능해진다. 다만 릴리스 노트에 아직 POC 표기가 붙어 있어 상시 운용을 전제하기엔 이르다. 반대 방향인 Locally의 **LM Link**(2편에서 소개)는 v1.67.0(2026-11-04)에서 Liquid AI의 LFM3 모델 지원, Bonsai 2의 이미지 이해, 연결 속도 개선이 들어갔다.

정리하면 개발자에게 아이폰 로컬 LLM은 **코딩 도구가 아니라 "오프라인 사전 + 형식 변환기"**다. 그 선을 넘기려 하면 1절·2절·4절의 벽에 차례로 부딪힌다.

![person facing computer desktop](https://images.unsplash.com/photo-1511376777868-611b54f68947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxkZXZlbG9wZXIlMjB3cml0aW5nJTIwY29kZSUyMGxhcHRvcCUyMHRlcm1pbmFsfGVufDF8MHx8fDE3OTQ4NTk2ODV8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [charlesdeluvio](https://unsplash.com/@charlesdeluvio?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/person-facing-computer-desktop-pjAH2Ax4uWk?utm_source=spice-bandit-blog&utm_medium=referral)*

## 7. 못 하는 일 — 클라우드로 넘겨야 하는 경계

답부터: **다섯 가지 중 하나라도 걸리면 넘긴다.** ①사실을 확인해야 함 ②계산이 들어감 ③입력이 1,500토큰을 넘음 ④틀렸을 때 피해가 큼 ⑤여러 번 연속 생성이 필요함.

| 판단 질문 | 걸리면 | 왜 |
|---|---|---|
| 답을 내가 검증할 수 있나? | 못 하면 → 클라우드 | 소형 모델의 환각은 문체가 자연스러워 더 위험하다 |
| 숫자·날짜 계산이 들어가나? | 들어가면 → 클라우드 | 118과제 측정에서 수학은 8문제 중 1~5개 |
| 입력이 한글 1,500자를 넘나? | 넘으면 → 클라우드 | KV 캐시가 jetsam 한도를 넘어 앱이 종료된다 |
| 틀리면 돈·건강·계약이 걸리나? | 걸리면 → 클라우드 + 사람 | 로컬은 초안 생성기지 검증자가 아니다 |
| 요청을 세 번 이상 연속으로 하나? | 그러면 → 전원 연결 또는 클라우드 | 3회차부터 처리량 −38% |
| 최신 정보가 필요한가? | 필요하면 → 클라우드 | 모델 가중치는 학습 시점에 고정돼 있다 |

반대로 **네 가지가 모두 참이면 로컬이 더 낫다**: 데이터가 기기를 떠나면 안 되고, 전파를 못 믿고, 입력이 짧고, 출력이 짧다. 이 네 조건은 생각보다 자주 동시에 성립한다. 받은 문자 분류, 진단서 용어 풀이, 기내 메일 초안, 커밋 메시지 — 앞 절들의 사례가 모두 이 교집합 안에 있다.

## 8. 7월 글에서 낡은 부분 — 2026년 11월 기준 업데이트

답부터: **네 군데가 바뀌었다.** iOS 세대, 모델 세대, 하드웨어, 그리고 형식 선택 기준이다. 7월 글의 설치 절차와 앱 선택 기준 자체는 지금도 유효하다.

| 항목 | 2026년 7월 | 2026년 11월 |
|---|---|---|
| iOS | 26 — Foundation Models 프레임워크 공개 | **27**(2026-09-14 출시) — 이미지 입력 지원, LanguageModel 프로토콜로 Claude·Gemini 등 외부 모델도 같은 코드로 교체 가능 |
| 한국어 Apple Intelligence | 지원 언어 확대 중 | **iOS 27.2(2026-10-26)에서 Siri AI 한국어 추가** |
| 추천 모델 | Llama 3.2 1B/3B, Gemma 4 E2B, Phi-4 Mini, Qwen 3 4B | **LFM2 1.2B/2.6B, Qwen 3.5 0.8B/2B/4B, Ternary Bonsai 2, LFM3** |
| 최상위 기종 | iPhone 17 Pro — RAM 12GB | **iPhone 18 Pro — 12GB LPDDR5X, 96비트 버스로 메모리 대역폭 +50%, 뉴럴엔진 32코어** |
| 형식 선택 | GGUF/MLX 둘 다 소개 | **같은 품질이면 GGUF가 메모리 3.5배 유리**(Llama 3.2 3B 721MB vs 2,568MB) |

모델 쪽 변화를 한 줄 더 보탤 가치가 있다. 2026년 10월 15일 PrismML이 공개한 **Ternary Bonsai 2**는 가중치를 −1·0·+1 세 값으로만 표현해 2B를 0.43GB, 4B를 0.95GB, 9B를 2GB에 담았다(Apache 2.0, Qwen3.5 기반). 발표된 측정치로 iPhone 18 Pro Max에서 2B가 120 tok/s, 9B가 34 tok/s다. 다만 **전부 자체 발표 자료 기준**이고, 압축에 따른 손실이 과제별로 고르지 않다. 발표 표의 비전 종합 보존율은 2B 89.0%·4B 91.3%·9B 92.5%지만 2B는 문서 이해(Omni_doc)에서 77.5%까지 떨어지고, 지식·추론 종합 보존율은 2B가 82.9%, GPQA Diamond는 67.7%로 비전보다 손실이 크다. 요약하면 **외워서 답하거나 길게 추론하는 능력이 먼저 깎인다** — 이 글이 권한 "짧은 변환 작업" 쪽에는 덜 아프고, 7절에서 넘기라고 한 작업에는 더 아픈 손실이다. 그래도 방향은 분명하다. **"9B를 2GB에 담는다"는 흐름이 유지되면, 4절에서 본 컨텍스트 벽이 가장 먼저 낮아진다.** 가중치가 작아진 만큼 KV 캐시에 쓸 메모리가 남기 때문이다. 제3자 측정이 쌓이는 걸 보고 판단하는 게 안전하다.

하드웨어 쪽도 같은 방향이다. 토큰 생성 속도는 연산력보다 메모리 대역폭에 더 묶여 있는데, iPhone 18 Pro는 메모리 버스를 64비트에서 96비트로 넓혀 대역폭을 50% 올렸다(버스 폭은 보도된 다이 분석 기준이다). 숫자를 늘린 게 뉴럴엔진 코어 수(16→32)만이 아니라는 점이 로컬 LLM 입장에서 더 중요한 변화다.

이 병목에는 이름이 있고, 생각보다 오래됐다. 1977년 튜링상 강연에서 존 배커스는 CPU와 메모리 사이로 데이터를 한 단어씩 퍼 올려야 하는 구조를 **"폰 노이만 병목"**이라 불렀다([Backus, CACM 21(8), 1978](https://dl.acm.org/doi/10.1145/359576.359579)). 반세기 뒤 뉴럴엔진은 32코어까지 왔지만, 토큰 하나를 뱉을 때마다 가중치를 메모리에서 다시 읽어 와야 하는 구조는 바뀌지 않았다. 로컬 LLM의 체감을 "코어 몇 개"보다 "버스 몇 비트"가 결정하는 이유다.

![Silver Apple iPhone 18 Pro -- still in a box](https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/Apple_iPhone_18_Pro_box_%282026-11-12%29.jpg/1280px-Apple_iPhone_18_Pro_box_%282026-11-12%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail)
*이미지: Olgierd Rudak · [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Apple_iPhone_18_Pro_box_(2026-11-12).jpg) · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)*

## So What — 성능표가 아니라 '경계표'를 손에 들어야 한다

아이폰 로컬 LLM을 깔고 나서 실망하는 사람과 계속 쓰는 사람의 차이는 기종이나 모델이 아니다. **경계를 아는가**다.

온디바이스 연산이 "작은 클라우드"였던 적은 없다. 아이폰에 뉴럴엔진이 처음 들어간 2017년 A11(초당 최대 6,000억 연산)이 맡은 일도 범용 AI가 아니라 Face ID와 Animoji였다([Apple Newsroom, 2017-09](https://www.apple.com/newsroom/2017/09/the-future-is-here-iphone-x/)). 서버를 대체한 게 아니라, 얼굴 데이터처럼 기기를 떠나선 안 되고 전파를 기다릴 수도 없는 작업 하나를 가져온 것이다. 9년 뒤 로컬 LLM이 서 있는 자리도 같다. **경계가 먼저 정해지고, 용도는 그 안에서 나온다.**

숫자가 그 경계를 꽤 선명하게 그려준다. 속도는 2B급 35 tok/s로 읽는 속도의 다섯 배가 넘으니 체감이 느린 게 아니다. 발열은 3회차부터 −38%이니 "짧게 끊어 쓰라"는 뜻이다. 컨텍스트는 한글 1,000~1,500자가 상한이니 "문서를 쪼개라"는 뜻이다. 품질은 지시 따르기에 강하고 수학에 약하니 "변환은 맡기고 판단은 맡기지 마라"는 뜻이다. 이 네 문장이 이 글 전체의 요약이고, 앞의 여섯 용도는 모두 그 안에서 나온 조합이다.

그리고 이 경계는 고정된 게 아니다. 7월부터 11월까지 넉 달 사이에 iOS는 외부 모델까지 같은 코드로 바꿔 끼울 수 있게 열렸고, 9B가 2GB에 들어갔고, 메모리 대역폭은 50% 넓어졌다. 네 달 단위로 벽이 밀린다는 뜻이다. 그러니 지금 할 일은 "언제 쓸 만해지나"를 기다리는 게 아니라, **지금 되는 네 조건(짧은 입력·짧은 출력·기기 밖으로 못 나가는 데이터·전파 없음)에 해당하는 내 작업 한 가지를 단축어로 묶어보는 것**이다. 그 하나가 돌아가면 나머지는 벽이 밀릴 때마다 따라 들어온다.

## 자주 묻는 질문 (FAQ)

**Q1. 아이폰 로컬 LLM, 결국 뭐에 쓰는 게 제일 현실적인가?**
입력과 출력이 모두 짧은 변환 작업이다. 받은 문자 분류, 메일 초안 다듬기, 용어 풀이, 커밋 메시지 초안, 요점 3줄 정리. 단축어로 묶어 자동 실행하면 가치가 가장 크다.

**Q2. 긴 문서를 요약시킬 수 있나?**
아니다. RAM 6GB급 기종에서 실사용 컨텍스트는 1,024~1,500토큰(한글 약 1,000~1,500자)으로 보고된다. 그 이상을 넣으면 KV 캐시가 늘어 iOS가 앱을 종료시킨다. 조항·구간 단위로 쪼개 반복 질문하는 방식이 현실적이다.

**Q3. 배터리와 발열은 실제로 얼마나 심한가?**
iPhone 16 Pro에서 1.5B 모델로 20회 연속 추론한 측정에서 배터리 5%가 소모되고, 처리량은 3회차(Warm 상태)부터 약 38% 떨어져 최종 −41.5%까지 갔다. 짧게 끊어 쓰면 체감 문제는 거의 없다.

**Q4. 한국어 번역에 써도 되나?**
내가 아는 언어의 문장을 다듬거나 요약하는 데는 쓸 만하지만, 모르는 언어를 믿고 맡기기엔 이르다. 아이폰용 소형 모델의 한국어 품질을 체계적으로 측정한 공개 자료는 아직 드물어, 쓰기 전 내 용례로 직접 비교해 보는 게 가장 빠르다. 모델 카드에서 한국어를 지원 언어로 명시한 Qwen 계열(3.5 포함)을 먼저 시험하는 편이 시간이 덜 든다.

**Q5. 단축어의 'Use Model'을 쓰면 내용이 기기 밖으로 나가나?**
On-Device를 고르면 나가지 않는다. 하지만 Cloud·Cloud Pro는 Private Cloud Compute로, Extension Model은 ChatGPT로 나간다. 민감한 문서를 다룬다면 On-Device로 고정하거나 직접 돌리는 로컬 모델을 쓰는 것이 확실하다.

**Q6. 설치는 어떻게 하나?**
이 글은 설치 이후를 다룬다. 앱 설치·모델 선택·기종별 RAM 기준은 [아이폰 로컬 LLM 돌리기 2편](/blog/2026-07-03-local-llm-iphone-guide/)에, 양자화·GGUF 등 기초는 [로컬 LLM 시작 가이드 1편](/blog/2026-07-02-local-llm-beginner-guide/)에 정리해 뒀다.

---

**참고 자료**

- [pocket-ai-lab — iPhone LLM benchmarks: tok/s, memory and quality for 18 models](https://ananasdda.github.io/pocket-ai-lab/benchmarks/) (iPhone Air·A19·iOS 26.6.1, 2026-09-03~10-23) · [기종별 추천(2026-10-27)](https://ananasdda.github.io/pocket-ai-lab/best-local-llm-iphone/)
- Tummalapalli 외, [LLM Inference at the Edge: Mobile, NPU, and GPU Performance Efficiency Trade-offs Under Sustained Load (arXiv:2603.23640)](https://arxiv.org/abs/2603.23640), 2026-03 제출·2026-06 개정
- [The Battery Price of edge AI: A study of the Environmental Impact of LLM Inference on Mobile Devices (arXiv:2609.11940)](https://arxiv.org/html/2609.11940v1), 2026-07
- [Medicine on the Edge: Comparative Performance Analysis of On-Device LLMs for Clinical Reasoning (arXiv:2502.08954)](https://arxiv.org/abs/2502.08954), 2025-02
- [Apple 지원 — iPhone·iPad의 단축어에서 Apple Intelligence 사용하기](https://support.apple.com/guide/shortcuts/use-apple-intelligence-in-shortcuts-tpg3vrvwmclv/ios) · [Apple Newsroom — Siri AI 지원 언어 확대(2026-10-26)](https://www.apple.com/newsroom/2026/10/siri-ai-is-available-in-more-languages-starting-today/)
- [PocketPal AI — GitHub(MIT)](https://github.com/a-ghorbani/pocketpal-ai) · [App Store(v1.23.0)](https://apps.apple.com/us/app/pocketpal-ai/id6502579498)
- [Locally AI by LM Studio — App Store(v1.67.0, 2026-11-04)](https://apps.apple.com/us/app/locally-ai-by-lm-studio/id6741426692) · [Private LLM — 공식 가이드](https://privatellm.app/blog/run-local-gpt-on-ios-complete-guide)
- [PrismML — Introducing Ternary Bonsai 2 2B, 4B, and 9B(2026-10-15)](https://prismml.com/news/bonsai-2-family)
- [MVP Factory — Wiring CoreML to on-device LLMs: KV-cache, ANE, and the token budget for iPhone 16(2026-11-10)](https://mvpfactory.io/blog/wiring-coreml-to-a-quantized-on-device-llm-for-streaming-text-generation-kv)
- [Qwen2.5-7B-Instruct 모델 카드](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct) — "한국어 포함 29개 이상 언어 지원" 서술 · [Qwen2.5 Technical Report (arXiv:2412.15115)](https://arxiv.org/abs/2412.15115) — 학습 규모·벤치마크(KMMLU 포함) 기준
- A20 Pro 사양: [Wikipedia — Apple A20 Pro](https://en.wikipedia.org/wiki/Apple_A20_Pro) · [MacRumors — What M6 tells us about A20(2026-09-05)](https://www.macrumors.com/2026/09/05/what-m6-tells-us-about-a20/)
- 역사적 배경: [Dennard 외, IEEE JSSC SC-9(5), 1974](https://doi.org/10.1109/JSSC.1974.1050511) · [Esmaeilzadeh 외, Dark Silicon and the End of Multicore Scaling, ISCA 2011](https://www.microsoft.com/en-us/research/publication/dark-silicon-and-the-end-of-multicore-scaling/) · [Backus, 1977 ACM 튜링상 강연(CACM 21(8), 1978)](https://dl.acm.org/doi/10.1145/359576.359579) · [Apple Newsroom — iPhone X·A11 Bionic(2017-09)](https://www.apple.com/newsroom/2017/09/the-future-is-here-iphone-x/)

*이 글의 속도·배터리·발열 수치는 필자가 직접 측정한 값이 아니라 위에 밝힌 제3자 공개 측정값이며, 기종·iOS 버전·주변 온도·앱 버전에 따라 달라진다. 앱 가격·버전은 2026년 11월 17일 확인 기준이다(2편에 적은 Private LLM 가격 표기는 당시 환산치이며, 현재 App Store 가격은 일회성 $4.99다). 의료·법률·투자 조언이 아니다.*

<script type="application/ld+json">
{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "아이폰 로컬 LLM은 결국 뭐에 쓰는 게 제일 현실적인가요?", "acceptedAnswer": {"@type": "Answer", "text": "입력과 출력이 모두 짧은 변환 작업이 가장 현실적입니다. 받은 문자 분류, 메일 초안 다듬기, 용어 풀이, 커밋 메시지 초안, 요점 3줄 정리 등이며 단축어로 묶어 자동 실행할 때 가치가 가장 큽니다."}}, {"@type": "Question", "name": "아이폰 로컬 LLM으로 긴 문서를 요약할 수 있나요?", "acceptedAnswer": {"@type": "Answer", "text": "어렵습니다. RAM 6GB급 기종에서 실사용 컨텍스트는 1,024~1,500토큰(한글 약 1,000~1,500자)으로 보고됩니다. 그 이상을 넣으면 KV 캐시가 늘어 iOS가 앱을 강제 종료합니다. 조항이나 구간 단위로 쪼개 반복 질문하는 방식이 현실적입니다."}}, {"@type": "Question", "name": "아이폰에서 로컬 LLM을 쓰면 배터리와 발열이 얼마나 심한가요?", "acceptedAnswer": {"@type": "Answer", "text": "iPhone 16 Pro에서 1.5B 모델로 20회 연속 추론한 공개 측정에서 배터리 5%가 소모됐고, 처리량은 3회차부터 약 38% 떨어져 최종 41.5% 감소했습니다. 짧게 끊어 쓰면 체감 문제는 거의 없습니다."}}, {"@type": "Question", "name": "아이폰 로컬 LLM을 한국어 번역에 써도 되나요?", "acceptedAnswer": {"@type": "Answer", "text": "아는 언어의 문장을 다듬거나 요약하는 용도로는 쓸 만하지만, 모르는 언어를 맡기기에는 이릅니다. 아이폰용 소형 모델의 한국어 품질을 체계적으로 측정한 공개 자료는 아직 드물어 직접 비교해 보는 것이 가장 빠릅니다. 모델 카드에서 한국어를 지원 언어로 명시한 Qwen 계열을 먼저 시험하는 편이 시간이 덜 듭니다."}}, {"@type": "Question", "name": "단축어의 Use Model 액션을 쓰면 내용이 기기 밖으로 나가나요?", "acceptedAnswer": {"@type": "Answer", "text": "On-Device를 선택하면 나가지 않습니다. 다만 Cloud와 Cloud Pro는 Private Cloud Compute로, Extension Model은 ChatGPT로 전송됩니다. 민감한 문서를 다룬다면 On-Device로 고정하거나 직접 설치한 로컬 모델을 쓰는 것이 확실합니다."}}]}
</script>
