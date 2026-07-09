---
title: "RTX 5090으로 로컬 LLM 몇 B까지? — VRAM별 모델 총정리"
description: "RTX 5090(32GB)으로 Ollama에서 몇 B 파라미터 모델까지 돌릴 수 있나. VRAM 계산법, 모델 크기별 가능 여부와 속도(tok/s), 32B·70B 실전 기준까지 정리했다."
pubDate: 2026-07-08T07:12:02+09:00
category: ai
tags: ["RTX5090", "로컬LLM", "Ollama", "VRAM"]
---

RTX 5090을 샀거나 살까 고민하는 사람의 최대 관심사 중 하나 — **"이걸로 로컬 LLM 몇 B짜리까지 돌아가?"**다. 결론부터 말하면, RTX 5090의 **32GB VRAM으로는 32B 모델을 아주 편하게, 70B 모델은 양자화를 세게 조이거나 일부 CPU에 넘기는 조건으로** 돌릴 수 있다. 이 글은 그 답이 왜 그렇게 나오는지 — VRAM 계산법, 모델 크기별 가능 여부와 속도, Ollama 실전 팁까지 — 한 번에 정리한다. 로컬 LLM이 처음이라면 [로컬 LLM 시작 가이드 [1편]](/blog/2026-07-02-local-llm-beginner-guide/)을 먼저 보면 좋다.

## 결론 먼저 — RTX 5090의 답

RTX 5090은 **32GB GDDR7 VRAM**을 탑재했다. 로컬 LLM에서 가장 중요한 건 GPU 연산력이 아니라 이 **VRAM 용량**이다. 모델이 통째로 VRAM에 올라가면 빠르고, 넘치면 느려지거나 안 돌아간다. 32GB 기준 한 줄 요약은 이렇다.

- **7B~14B**: 여유롭게, 아주 빠르게. 고민할 필요 없음.
- **32B**: **스위트스폿.** Q4~Q8 양자화로 편하게 올라가고 속도도 실용적(40~55 tok/s).
- **70B**: Q4(약 40GB)는 32GB에 안 들어감. **Q3(약 34GB)조차 32GB를 살짝 넘겨** 일부를 CPU에 넘기는 오프로딩이 필요하다(오프로딩 없이 겨우 태우면 20 tok/s 안팎, RAM으로 넘치면 한 자릿수로 급락).
- **100B 이상**: 단일 5090으로는 무리. 다중 GPU나 강한 양자화가 필요.

![게이밍 그래픽카드](https://images.pexels.com/photos/34552811/pexels-photo-34552811.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Matheus Bertelli](https://www.pexels.com/@bertellifotografia) on [Pexels](https://www.pexels.com/photo/close-up-of-gaming-graphics-card-fans-with-red-lighting-34552811/)*

## VRAM 계산법 — 몇 B가 몇 GB인가

'몇 B까지 되나'는 결국 **모델이 VRAM에 들어가는가**의 문제다. 필요 메모리는 대략 이렇게 계산한다.

> **필요 VRAM ≈ (파라미터 수) × (파라미터당 바이트) + 컨텍스트용 여유**

파라미터당 바이트는 **양자화(quantization)** 수준으로 정해진다. 양자화란 모델 가중치를 더 적은 비트로 압축해 메모리를 줄이는 기술이다.

| 정밀도 | 파라미터당 | 품질 | 70B 예시 |
|---|---|---|---|
| FP16 (원본) | 2 바이트 | 최상 | 약 140GB |
| Q8 | 1 바이트 | 거의 원본급 | 약 70GB |
| Q4 (가장 흔함) | 약 0.5 바이트 | 실용적 균형 | 약 40GB |
| Q3 | 약 0.4 바이트 | 품질 저하 시작 | 약 30GB |

즉 **같은 모델도 양자화에 따라 필요 메모리가 몇 배씩 달라진다.** 로컬에서 가장 널리 쓰는 건 Q4(품질·용량 균형)이고, VRAM이 빠듯할 때 Q3까지 내린다. 여기에 **컨텍스트 길이만큼 KV 캐시가 추가로 VRAM을 먹는다** — 긴 문서를 넣을수록 메모리가 더 필요하다는 뜻이라, 위 계산값에 여유를 둬야 한다.

## 모델 크기별 총정리 — RTX 5090(32GB) 기준

위 계산을 5090의 32GB에 대입하면 이런 표가 나온다. Q4 기준이며, 속도는 대략치다.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 12px 8px;">
<svg viewBox="0 0 640 280" width="100%" height="auto" role="img" aria-label="RTX 5090 32GB VRAM에서 모델 크기별 Q4 필요 메모리 막대그래프. 8B 약 5기가, 14B 약 9기가, 32B 약 20기가는 32기가 안에 들어감. 70B 약 40기가는 초과.">
  <text x="12" y="22" fill="#23201D" font-size="15" font-weight="bold">RTX 5090(32GB)에서 Q4 모델별 필요 VRAM</text>
  <line x1="200" y1="40" x2="200" y2="230" stroke="#C8102E" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text x="205" y="52" fill="#C8102E" font-size="11" font-weight="bold">← 32GB 한계선</text>
  <text x="150" y="76" fill="#23201D" font-size="13">8B</text>
  <rect x="70" y="62" width="20" height="20" fill="#E5DECF"/>
  <text x="95" y="76" fill="#8A8378" font-size="11">약 5GB · 매우 빠름</text>
  <text x="140" y="116" fill="#23201D" font-size="13">14B</text>
  <rect x="70" y="102" width="36" height="20" fill="#E5DECF"/>
  <text x="112" y="116" fill="#8A8378" font-size="11">약 9GB · 빠름</text>
  <text x="140" y="156" fill="#23201D" font-size="13">32B</text>
  <rect x="70" y="142" width="80" height="20" fill="#C8102E"/>
  <text x="156" y="156" fill="#23201D" font-size="11" font-weight="bold">약 20GB · 스위트스폿(40~55 tok/s)</text>
  <text x="140" y="196" fill="#23201D" font-size="13">70B</text>
  <rect x="70" y="182" width="160" height="20" fill="#8A8378"/>
  <text x="234" y="196" fill="#8A8378" font-size="11">약 40GB · 초과 → Q3나 오프로딩 필요</text>
  <text x="12" y="252" fill="#8A8378" font-size="11">* Q4 파일 크기 기준 대략값. 실제론 컨텍스트 길이만큼 VRAM이 더 필요하다.</text>
  <text x="12" y="270" fill="#8A8378" font-size="11">* 속도(tok/s)는 하드웨어·모델·설정에 따라 달라지는 대략치.</text>
</svg>
<figcaption style="color:#8A8378;font-size:0.85em;margin-top:6px;">32B까지는 32GB 안에 편하게 들어가고, 70B는 한계선을 넘어 타협이 필요하다.</figcaption>
</figure>

정리하면 **RTX 5090의 현실적 상한선은 "Q4로 32B, Q3로 70B"**다. 32B는 Q4로 약 20GB라 컨텍스트 여유까지 넉넉하고, 원하면 Q6~Q8로 올려 품질을 더 높일 수도 있다. 반면 70B는 Q4가 32GB를 크게 넘어서고, 품질을 포기한 Q3(약 34GB)조차 32GB를 살짝 넘겨, 결국 일부 레이어를 CPU 메모리로 넘기는 오프로딩이 불가피하다. 그만큼 속도가 크게 떨어진다.

## Ollama 실전 — 어떻게 돌리나

[Ollama](/blog/2026-07-02-local-llm-beginner-guide/)로 돌리면 이 과정이 대부분 자동이다. 모델을 받을 때 태그로 양자화를 고르면 된다.

```bash
# 32B 모델 (5090의 스위트스폿)
ollama run qwen2.5:32b

# 70B는 양자화 태그를 조여서 (Q3 계열)
ollama run llama3.3:70b-instruct-q3_K_M
```

기억할 실전 포인트 세 가지.

- **Ollama는 자동 오프로딩을 한다.** 모델이 VRAM보다 크면 안 죽고, 넘치는 레이어를 CPU/RAM으로 자동으로 넘긴다. 대신 그만큼 느려진다 — 70B를 굳이 5090에 욱여넣으면 돌긴 하지만 속도를 감수해야 한다.
- **컨텍스트 길이를 챙겨라.** 긴 문서를 넣을수록 KV 캐시가 VRAM을 더 먹는다. 32B를 넉넉히 쓰다가도 컨텍스트를 크게 잡으면 빠듯해질 수 있다.
- **태그(Q4_K_M 등)를 확인하라.** 같은 모델도 태그에 따라 용량·품질이 다르다. 기본값이 내 VRAM에 맞는지 보고 받자.

## 5090 vs 4090 vs 맥 — 잠깐 비교

- **RTX 4090(24GB)**: 5090보다 VRAM이 8GB 적어, 70B는 더 빠듯하고 32B가 사실상 상한이다. 5090의 32GB가 "70B를 조건부로나마 건드릴 수 있는" 선을 열어준 셈이다.
- **맥(통합 메모리)**: 맥은 RAM을 GPU가 함께 쓰는 구조라, 64GB·128GB 맥이면 VRAM 관점에선 5090보다 큰 모델을 '올릴 수는' 있다. 다만 대역폭·연산속도는 5090이 앞서, 같은 모델이면 5090이 대체로 빠르다. (맥 모델별 상세는 다음 글에서 다룬다.)

## So What — '몇 B'보다 '어느 작업에 충분한가'

"5090으로 70B가 되나?"라는 질문의 진짜 답은 **"굳이?"**에 가깝다. 70B를 Q3으로 힘겹게 돌리는 것보다, **32B를 Q6~Q8 고품질로 여유롭게 돌리는 편이 실사용 만족도가 높은 경우가 많다.** 최근 32B급 모델들의 성능이 크게 올라와서, 코딩·요약·문서 Q&A 같은 실무 작업 대부분은 32B로 충분하다.

그래서 결론은 이렇다 — RTX 5090은 **"32B를 쾌적하게 돌리는 로컬 LLM 머신"**으로 보는 게 정확하다. 70B는 '가능하지만 타협이 따르는 보너스'다. 하드웨어 스펙 숫자('몇 B')에 매몰되기보다, **내 작업에 어느 크기 모델이 충분한지**를 먼저 정하면 5090은 대부분의 개인 로컬 AI 니즈를 시원하게 소화한다.

---

**로컬 LLM 시리즈**
- [1편 — 로컬 LLM 시작 가이드](/blog/2026-07-02-local-llm-beginner-guide/)
- [2편 — 아이폰에서 로컬 LLM 돌리기](/blog/2026-07-03-local-llm-iphone-guide/)
- [헤르메스 AI × LM Studio 로컬 연동](/blog/2026-07-05-hermes-agent-lm-studio-local-llm/)

**출처**
- [ModelFit — RTX 5090 Local LLM 벤치마크](https://modelfit.io/gpu/rtx-5090/) (32GB, 모델별 tok/s)
- [InsiderLLM — VRAM Requirements Cheat Sheet](https://insiderllm.com/guides/vram-requirements-local-llms/) (양자화별 필요 VRAM)
- [ToolHalla — Best Local LLMs for RTX 5090 (2026)](https://toolhalla.ai/blog/best-local-llms-rtx-5090-2026) (모델 추천·양자화)
