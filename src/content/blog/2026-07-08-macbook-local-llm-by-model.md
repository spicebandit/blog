---
title: "맥북으로 로컬 LLM 돌리기 — 모델·메모리별 가능 여부 총정리"
description: "맥북/맥북에어에서 로컬 LLM이 되나? 통합 메모리(8·16·32·64GB)별로 돌릴 수 있는 모델 크기와 Air·Pro 차이, RTX 5090과의 비교까지 구매 전 알아야 할 기준을 정리했다."
pubDate: 2026-07-08T07:21:45+09:00
category: ai
tags: ["맥북", "로컬LLM", "애플실리콘", "Ollama"]
---

"맥북으로 로컬 LLM이 돌아가?"의 답은 **"어떤 맥북이냐가 아니라, 통합 메모리가 몇 GB냐"**로 거의 결정된다. 결론부터: **16GB면 14B급까지 쾌적, 32GB면 32B급, 64GB면 70B까지** 넘본다. 흥미로운 건 맥북이 로컬 AI에서 의외의 강자라는 점이다 — 게이밍 GPU가 24~32GB VRAM에서 막힐 때, 맥은 통합 메모리 덕에 64GB·128GB짜리 거대 모델도 '올릴 수는' 있기 때문이다. 이 글은 맥북/맥북에어에서 메모리별로 어떤 모델이 되는지, Air와 Pro는 뭐가 다른지, [RTX 5090](/blog/2026-07-07-rtx5090-ollama-local-llm-parameters/)과 비교하면 어떤지까지 구매 기준으로 정리한다.

## 맥북의 특수성 — '통합 메모리'가 곧 VRAM

일반 PC는 CPU용 RAM과 GPU용 VRAM이 따로다. 로컬 LLM은 GPU의 VRAM에 올라가야 빨라서, 그래픽카드 VRAM(보통 8~32GB)이 상한선이 된다. 반면 **애플 실리콘 맥은 CPU와 GPU가 하나의 '통합 메모리(Unified Memory)'를 공유**한다. 즉 맥의 RAM이 곧 VRAM이라, 64GB 맥이면 이론상 그 대부분을 모델에 쓸 수 있다.

이게 맥이 로컬 AI에서 갖는 결정적 강점이다. **큰 메모리를 상대적으로 저렴하게** 확보할 수 있어서, 개인이 70B급 대형 모델을 노트북 한 대로 돌리는 게 가능해진다. 다만 두 가지 단서가 붙는다. 첫째, macOS가 시스템용으로 일부를 잡아두므로 **실사용 가능한 양은 통합 메모리의 약 70% 안팎**이다(8GB 맥이 실제로 모델에 쓸 수 있는 건 5~6GB뿐). 둘째, 용량은 커도 **메모리 대역폭(속도)은 칩 등급마다 크게 달라서**, 같은 모델이라도 체감 속도가 천차만별이다(뒤에서 상술).

![책상 위 맥북](https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwbGFwdG9wJTIwZGVzayUyMGFwcGxlfGVufDF8MHx8fDE3ODMyOTg5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Maxim Hopman](https://unsplash.com/@nampoh?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/silver-macbook-on-white-table-Hin-rzhOdWs?utm_source=spice-bandit-blog&utm_medium=referral)*

## 메모리 용량별 가능 모델 — 한눈에

통합 메모리별로 Q4 양자화 기준 어떤 모델이 실용적인지 정리하면 이렇다.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 12px 8px;">
<svg viewBox="0 0 640 300" width="100%" height="auto" role="img" aria-label="맥북 통합메모리별 로컬LLM 가능 모델. 8기가 3~4B, 16기가 14B까지, 24기가 20B급, 32기가 32B급, 64기가 70B, 128기가 70B 이상.">
  <text x="12" y="22" fill="#23201D" font-size="15" font-weight="bold">맥북 통합메모리별 실용 모델 크기 (Q4 기준)</text>
  <text x="12" y="58" fill="#23201D" font-size="13" font-weight="bold">8GB</text>
  <rect x="90" y="44" width="60" height="20" fill="#E5DECF"/>
  <text x="158" y="58" fill="#8A8378" font-size="12">3~4B (7~8B는 빠듯) — 입문·경량</text>
  <text x="12" y="94" fill="#23201D" font-size="13" font-weight="bold">16GB</text>
  <rect x="90" y="80" width="120" height="20" fill="#E5DECF"/>
  <text x="218" y="94" fill="#8A8378" font-size="12">~14B 쾌적 — 지금 사는 최소 권장</text>
  <text x="12" y="130" fill="#23201D" font-size="13" font-weight="bold">24GB</text>
  <rect x="90" y="116" width="180" height="20" fill="#E5DECF"/>
  <text x="278" y="130" fill="#8A8378" font-size="12">~20B급</text>
  <text x="12" y="166" fill="#23201D" font-size="13" font-weight="bold">32GB</text>
  <rect x="90" y="152" width="250" height="20" fill="#C8102E"/>
  <text x="348" y="166" fill="#23201D" font-size="12" font-weight="bold">32B급 — 실용 스위트스폿</text>
  <text x="12" y="202" fill="#23201D" font-size="13" font-weight="bold">64GB</text>
  <rect x="90" y="188" width="360" height="20" fill="#C8102E"/>
  <text x="458" y="202" fill="#23201D" font-size="12" font-weight="bold">70B급</text>
  <text x="12" y="238" fill="#23201D" font-size="13" font-weight="bold">128GB</text>
  <rect x="90" y="224" width="480" height="20" fill="#8A8378"/>
  <text x="12" y="270" fill="#8A8378" font-size="11">* 실사용 가능 메모리는 통합메모리의 약 70%. 컨텍스트가 길면 더 필요.</text>
  <text x="12" y="288" fill="#8A8378" font-size="11">* 용량이 '올라가는가'의 기준. 속도(tok/s)는 칩 등급(대역폭)에 따라 별개.</text>
</svg>
<figcaption style="color:#8A8378;font-size:0.85em;margin-top:6px;">"어디까지 올라가나"는 메모리가, "얼마나 빠른가"는 칩 등급이 정한다.</figcaption>
</figure>

핵심만 짚으면 — **8GB는 로컬 LLM 입문용으로도 빠듯하다.** 3~4B 소형은 되지만 7~8B만 돼도 버겁다. 지금 새로 산다면 **16GB가 최소 마지노선**이고(요즘 맥북에어도 16GB부터 시작), 진지하게 쓸 거면 **32GB가 가성비 스위트스폿**이다(32B급 최신 모델이 쾌적). 70B를 노린다면 64GB 이상이 필요하다.

## Air vs Pro — 메모리만이 아니다

같은 16GB라도 맥북에어와 맥북프로는 로컬 LLM 경험이 다르다. 이유는 두 가지다.

- **메모리 대역폭**: 모델을 얼마나 빨리 읽어오느냐가 생성 속도(tok/s)를 좌우한다. 기본 M칩(에어)은 대역폭이 낮고, Pro·Max·Ultra로 갈수록 몇 배씩 넓어진다. 즉 **같은 모델도 맥북프로(Max)가 에어보다 훨씬 빠르다.** 용량이 커도 대역폭이 좁으면 큰 모델은 답답하게 느껴진다.
- **발열(쓰로틀링)**: 맥북에어는 **팬이 없다.** LLM처럼 오래 GPU를 굴리는 작업은 열이 쌓여 성능이 점차 깎인다(쓰로틀링). 잠깐 쓰는 데는 문제없지만, 긴 생성이나 연속 작업은 팬이 있는 맥북프로가 안정적이다.

정리하면 — **가볍게·이동 중에 소형 모델을 쓴다면 맥북에어(16~24GB)로 충분**하고, **32B 이상을 자주·오래 돌리며 속도가 중요하다면 맥북프로(Pro/Max, 32~64GB+)**가 맞다.

![책상 위 맥북프로](https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxtYWNib29rJTIwbGFwdG9wJTIwZGVzayUyMGFwcGxlfGVufDF8MHx8fDE3ODMyOTg5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Giorgio Trovato](https://unsplash.com/@giorgiotrovato?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/macbook-pro-on-white-table-8krX0HkXw8c?utm_source=spice-bandit-blog&utm_medium=referral)*

## 실전 — 맥북에서 Ollama 돌리기

맥에서 로컬 LLM을 돌리는 가장 쉬운 길은 [Ollama](/blog/2026-07-02-local-llm-beginner-guide/)다. 설치하면 **애플 실리콘의 Metal 백엔드를 자동으로 감지·사용**하므로 별도 GPU 설정이 필요 없다.

```bash
# 16GB 맥북 — 8~14B 권장
ollama run llama3.1:8b

# 32GB 맥북 — 32B급 스위트스폿
ollama run qwen2.5:32b
```

실전 팁 두 가지. 첫째, **메모리 압박(memory pressure)을 보라.** 모델+컨텍스트가 실사용 가능 메모리를 넘으면 macOS가 스왑을 쓰며 급격히 느려진다. 활성 상태 보기(Activity Monitor)에서 메모리 압박이 노랑·빨강이면 한 단계 작은 모델이나 강한 양자화로 내려야 한다. 둘째, **컨텍스트 길이도 메모리를 먹는다** — 긴 문서를 넣을수록 여유 메모리가 필요하니, 위 표의 상한보다 한 급 여유를 두는 게 안전하다.

## 맥북 vs RTX 5090 — 뭘 골라야 하나

로컬 AI용으로 맥북과 게이밍 GPU를 저울질한다면, 성격이 정반대다.

| 항목 | 맥북 (통합 메모리) | RTX 5090 (32GB) |
|---|---|---|
| 최대 모델 | 64GB↑면 70B, 128GB면 그 이상 | 32B 쾌적, 70B는 타협 |
| 속도(대역폭) | 칩 등급별 편차(Max/Ultra 빠름) | 매우 빠름(약 1.8TB/s) |
| 장점 | 큰 메모리 저렴·조용·저전력·이동성 | 순수 속도, 작은 모델 초고속 |
| 단점 | 대역폭이 GPU보다 낮음 | 32GB 용량 상한, 전력·소음 |

한 줄로 — **"큰 모델을 조용히·이동하며"가 맥북, "작은~중형 모델을 최대 속도로"가 5090**이다. 자세한 5090 기준은 [RTX 5090으로 로컬 LLM 몇 B까지 글](/blog/2026-07-07-rtx5090-ollama-local-llm-parameters/)에서 다뤘다.

## So What — 로컬 AI용 맥북, 어떻게 사야 하나

구매 기준을 한 문장으로 압축하면 — **"용량은 미래를 위해 넉넉히, 등급은 용도에 맞게"**다. 로컬 LLM을 진지하게 쓸 생각이면 **최소 16GB, 가능하면 32GB**를 권한다. 메모리는 나중에 못 늘리니(애플 실리콘은 온칩 고정) 살 때 한 단계 올리는 게 두고두고 이득이다. 속도까지 중요하면 맥북프로의 Pro·Max 칩을, 가볍게 쓸 거면 맥북에어 16~24GB면 족하다.

무엇보다 — 하드웨어 숫자에 앞서 **"내 작업에 어느 크기 모델이 충분한가"**를 먼저 정하자. 요약·코딩·문서 Q&A 같은 실무는 대개 14~32B로 충분하고, 그렇다면 굳이 128GB 최상위 모델을 좇을 필요가 없다. 대부분의 개인에게는 **32GB 맥북이 로컬 AI의 현실적 스위트스폿**이다.

---

**로컬 LLM 시리즈**
- [1편 — 로컬 LLM 시작 가이드](/blog/2026-07-02-local-llm-beginner-guide/)
- [2편 — 아이폰에서 로컬 LLM 돌리기](/blog/2026-07-03-local-llm-iphone-guide/)
- [헤르메스 AI × LM Studio 로컬 연동](/blog/2026-07-05-hermes-agent-lm-studio-local-llm/)
- [RTX 5090으로 로컬 LLM 몇 B까지](/blog/2026-07-07-rtx5090-ollama-local-llm-parameters/)

**출처**
- [SitePoint — Local LLMs on Apple Silicon (2026)](https://www.sitepoint.com/local-llms-apple-silicon-mac-2026/) (메모리 티어별 모델)
- [InsiderLLM — Best Local LLMs for Mac 2026](https://insiderllm.com/guides/best-local-llms-mac-2026/) (M1~M5 벤치)
- [ModelFit — Best LLM for MacBook by RAM tier](https://modelfit.io/guides/best-llm-for-macbook/) (RAM 등급별 추천)
