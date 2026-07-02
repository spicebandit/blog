---
title: "로컬 LLM 시작 가이드: 내 컴퓨터에서 AI 돌리기"
description: "로컬 LLM 완전 초보 가이드. LM Studio·Ollama 설치부터 Gemma 4·Qwen 모델 선택, 필요 메모리 계산, 양자화(GGUF) 기초까지 — 2026년 7월 기준으로 30분 만에 첫 대화를 시작하는 법."
pubDate: 2026-07-03T08:00:00+09:00
category: ai
tags: ["로컬LLM", "LM스튜디오", "Ollama", "오픈소스AI"]
---

**로컬 LLM**은 ChatGPT 같은 클라우드 AI를 인터넷 없이, 구독료 없이, 내 데이터를 밖으로 보내지 않고 내 컴퓨터에서 직접 돌리는 것이다. 결론부터 말하면 — 2026년 7월 현재, 로컬 LLM은 "취미"의 단계를 절반쯤 벗어났다. 최신 오픈모델(Gemma 4, Qwen 3.6 계열)은 1~2년 전 유료 프런티어 모델 수준의 품질을 내고, LM Studio 같은 도구 덕에 설치 난이도는 "앱 하나 까는 수준"까지 내려왔다. 다만 GPT나 Claude의 최신 모델을 대체하는 물건은 아니다. 이 글은 완전 초보자를 위해 ①로컬 LLM이 뭔지 ②시작 전에 내 컴퓨터 사양을 확인하는 법 ③LM Studio/Ollama로 첫 대화까지 가는 단계별 가이드 ④추천 모델 표 ⑤흔한 실수를 순서대로 정리한다. 핵심 메시지는 하나다. **"최고의 AI"가 아니라 "내 것인 AI"를 갖는 게 로컬 LLM의 본질이며, 그게 필요한 사람에게는 지금 시작할 가치가 충분하다.**

## 로컬 LLM이란 — ChatGPT와 무엇이 다른가

ChatGPT, Claude, Gemini는 모두 **클라우드 AI**다. 내가 입력한 질문이 인터넷을 타고 OpenAI·Anthropic·Google의 데이터센터로 전송되고, 거기 있는 수만 장의 GPU가 답을 계산해 돌려보낸다. 편리하지만 세 가지 전제가 붙는다. 인터넷이 연결돼 있어야 하고, 매달 구독료(또는 API 요금)를 내야 하며, 내 질문과 문서가 남의 서버를 거쳐 간다.

로컬 LLM은 이 구조를 뒤집는다. Meta의 Llama, Google의 Gemma, 알리바바의 Qwen, 프랑스 Mistral 같은 회사들이 **모델 가중치(모델 그 자체)를 무료로 공개**하고 있고, 이 파일을 내려받아 내 노트북·데스크톱에서 직접 실행하는 것이다. 그래서 얻는 것과 잃는 것이 명확하다.

| 구분 | 클라우드 AI (ChatGPT 등) | 로컬 LLM |
|------|------------------------|----------|
| 품질 | 최고 수준 (프런티어 모델) | 프런티어의 1~2년 전 수준 |
| 비용 | 월 $20~200 구독 / API 종량제 | 0원 (전기료 제외, 하드웨어는 기존 PC 활용) |
| 프라이버시 | 데이터가 외부 서버 경유 | 데이터가 내 기기 밖으로 안 나감 |
| 인터넷 | 필수 | 불필요 (완전 오프라인 동작) |
| 속도·사용량 제한 | 요금제별 제한 있음 | 무제한 (내 하드웨어가 한계) |
| 설정 난이도 | 없음 (가입만 하면 끝) | 앱 설치 + 모델 선택 필요 |

여기서 초보자가 가장 궁금해할 질문이 나온다. "품질이 떨어지는데 왜 쓰지?" 이 질문에 대한 가장 생생한 답이 레딧에 있다.

## "실제로 유용한가, 그냥 재밌는 장난감인가" — 레딧 220여 개 댓글의 현실 점검

2026년 4월, 레딧 r/LocalLLM에 ["로컬 LLM은 실제로 유용한가, 아니면 그냥 만지작거리는 재미인가?"](https://www.reddit.com/r/LocalLLM/comments/1sm4i2m/are_local_llms_actually_useful_or_just_fun_to/)라는 스레드가 올라와 추천 160여 개, 댓글 220여 개가 달렸다. 질문자의 고민은 초보자라면 누구나 부딪히는 것이었다. "프라이버시와 무료라는 건 좋다. 그런데 설정이 번거롭고, 계속 만져줘야 하고, 클라우드 모델보다 성능이 떨어진다. 이게 실용적인가?"

댓글의 논점을 정리하면 세 갈래다.

**첫째, "민감한 데이터"에서는 로컬이 압승한다는 진영.** 최다 추천 댓글의 요지는 이렇다 — "메모, 초안, 사내 문서, 개인 데이터 처리처럼 민감한 작업에서는 로컬이 진짜로 이긴다. API 비용도 없고 데이터가 시스템 밖으로 안 나가니 아무 걱정 없이 돌려놓을 수 있다." 실사용 사례도 구체적이다. 어떤 사용자는 세금 신고철에 영수증 수백 장을 로컬 비전 모델(Qwen 4B급)로 파싱해 회계사에게 넘길 CSV를 만들었다. "영수증을 제3자 API에 보내고 싶지 않았다"는 이유다. 또 다른 사용자는 아내와의 개인 대화와 고객 업무 문자가 섞인 휴대폰 데이터를 로컬 32B 모델로 먼저 걸러서, **업무 관련 내용만** 클라우드 API로 넘기는 '프라이버시 필터'를 만들었다. 로컬과 클라우드를 적대 관계가 아니라 역할 분담으로 보는 것이다.

**둘째, "진짜 장벽은 모델 성능이 아니라 설정 마찰"이라는 관찰.** 같은 최다 추천 댓글의 한 문장이 스레드 전체를 관통한다. *"대부분의 사람들은 로컬 모델의 성능 한계에 부딪히는 게 아니다. 모델을 제대로 돌아가게 만드는 일의 한계에 부딪힌다."* 즉 모델은 이미 쓸 만한데, 설치·설정·유지보수의 번거로움이 실용화를 막는다는 것이다. 이 글이 존재하는 이유이기도 하다 — 그 마찰은 2026년 현재 도구(LM Studio 등)로 상당 부분 해소됐다.

**셋째, 회의론.** "DeepSeek API를 한 달 내내 써도 3~4달러였다. 그 돈이면 로컬보다 훨씬 좋고 빠른 모델을 쓴다. 전기료를 생각하면 로컬이 더 비쌀 수도 있다"는 반론, "구독 하나 값으로 항상 최신 모델을 쓰는 사람과, 수백만 원짜리 하드웨어를 사서 유지보수까지 하는 사람 — 후자가 합리적일 리 없다"는 반론이 만만치 않은 추천을 받았다. 냉정하게, 이 반론은 **품질과 비용 효율만 따지면 옳다.**

그래서 균형점은 어디인가. 한 댓글의 비유가 정확하다. *"클라우드는 가구 딸린 아파트를 임대하는 것, 로컬은 집을 사는 것이다. 집은 시간과 돈이 더 들지만, 매달 월세가 없고 무엇보다 내 집, 내 규칙이다."* 그리고 또 다른 댓글 — *"로컬 모델은 1년 전 유료 모델이 하던 걸 전부 할 수 있다. 그때 그 모델들이 쓸모없었나?"* 기대치를 이렇게 설정하면 된다. **로컬 LLM은 "작년의 ChatGPT"를 무료·무제한·완전 비공개로 쓰는 것이다.**

![black flat screen computer monitor on white desk](https://images.unsplash.com/photo-1615938165708-feda49ca470c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHNlcnZlciUyMGhvbWUlMjBsYWJ8ZW58MXwwfHx8MTc4Mjk4MTE3OXww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Boitumelo](https://unsplash.com/@writecodenow?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-flat-screen-computer-monitor-on-white-desk-1gZQ5chmcH0?utm_source=spice-bandit-blog&utm_medium=referral)*

## 시작 전 체크리스트 — 내 컴퓨터 메모리 확인과 양자화(GGUF) 기초

로컬 LLM에서 가장 중요한 하드웨어 스펙은 CPU 속도가 아니라 **메모리 용량**이다. 모델 전체가 메모리에 올라가야 돌아가기 때문이다. 확인 방법은 1분이면 된다.

- **Mac (Apple Silicon)**: 왼쪽 위  메뉴 → "이 Mac에 관하여" → **메모리** 항목. M1~M5 맥은 CPU와 GPU가 **통합 메모리(unified memory)** 를 공유하므로, 이 숫자가 곧 AI용 메모리다. 16GB면 7B급 모델, 24~32GB면 14~30B급, 64GB 이상이면 70B급까지 무난하다는 것이 통설이다([APXML 가이드](https://apxml.com/posts/best-local-llm-apple-silicon-mac) 기준).
- **Windows (NVIDIA GPU)**: `Ctrl+Shift+Esc`로 작업 관리자 → 성능 탭 → GPU → **전용 GPU 메모리(VRAM)** 확인. 로컬 LLM은 이 VRAM 안에 모델이 다 들어갈 때 빠르다. 참고로 흔한 게이밍 GPU의 VRAM은 RTX 4060 8GB, RTX 3060 12GB, RTX 4070 12GB, RTX 4090 24GB, RTX 5090 32GB다. VRAM을 넘치는 모델도 일반 RAM으로 흘려보내(오프로딩) 돌릴 수는 있지만 속도가 크게 떨어진다.

그럼 모델은 얼마나 메모리를 먹나? 여기서 **양자화(quantization)** 개념이 나온다. 원본 모델은 파라미터 하나당 16비트(2바이트)를 쓰는데, 이를 4비트(0.5바이트)로 압축한 것이 흔히 보는 **Q4** 양자화다. 커뮤니티에서 통용되는 어림 공식은 다음과 같다.

> **필요 메모리(GB) ≈ 파라미터 수(B) × 바이트(Q4=0.5, Q8=1, FP16=2) × 1.2(오버헤드)**

예를 들어 31B 모델을 Q4로 돌리면 31 × 0.5 × 1.2 ≈ 18.6GB. 여기에 대화 기록(컨텍스트)용 메모리가 추가로 필요하니 24GB급이 안전하다. Q4로 압축하면 메모리가 원본 대비 약 4분의 1로 줄어드는 대신 벤치마크 품질 저하는 수 % 수준이라, **초보자는 대체로 Q4(정확히는 Q4_K_M) 버전을 받으면 된다.** 단, E2B·E4B 같은 소형 모델은 원래 크기가 작아 Q4의 품질 손실이 상대적으로 크게 느껴지므로, 메모리 여유가 있다면 Q8을 고르는 편이 더 좋다. 그리고 이렇게 양자화된 모델을 담는 표준 파일 형식이 **GGUF**다([Hugging Face 문서](https://huggingface.co/docs/hub/gguf)). LM Studio나 Ollama에서 모델을 검색하면 나오는 "Q4_K_M", "GGUF" 같은 꼬리표가 바로 이것이다. Mac이라면 GGUF 대신 Apple 최적화 형식인 **MLX** 버전을 골라도 좋다.

## 첫 세팅 단계별 가이드 — LM Studio로 10분 만에 첫 대화

도구는 두 가지가 표준이다. 화면(GUI)으로 조작하는 **[LM Studio](https://lmstudio.ai/docs/app)** 와, 터미널·API 중심의 **[Ollama](https://ollama.com/download)**. 둘 다 무료이고 내부적으로 같은 엔진(llama.cpp — 로컬 LLM 실행의 표준 오픈소스 엔진) 계열을 쓰므로 속도 차이는 거의 없다. **완전 초보자에게는 LM Studio를 권한다.** 모델 검색·다운로드·채팅·설정이 전부 한 앱 안에서 클릭으로 끝나기 때문이다. Ollama는 2025년 중반부터 데스크톱 앱을 제공해 문턱이 낮아졌고, 2026년 들어서는 Apple Silicon에서 Gemma 4를 멀티토큰 예측(MTP — 한 번에 여러 토큰을 예측해 생성 속도를 높이는 기법)으로 크게 가속하는 등 업데이트가 활발하지만, 기본 성격은 여전히 개발자용에 가깝다.

LM Studio 기준 첫 대화까지의 단계는 다음과 같다.

1. **설치**: [lmstudio.ai](https://lmstudio.ai/docs/app)에서 내 OS(Mac/Windows/Linux)용 설치 파일을 받아 실행한다. 회원가입도 필요 없다.
2. **모델 검색**: 앱 왼쪽의 돋보기(Discover) 탭에서 모델 이름을 검색한다. 처음이라면 아래 추천 표에서 내 메모리에 맞는 것 하나를 고른다. LM Studio가 내 하드웨어에 맞는지("Full GPU Offload Possible" 등) 자동으로 표시해 준다.
3. **다운로드**: Q4_K_M(또는 Mac이면 MLX 4bit) 버전을 클릭해 받는다. 수 GB이므로 몇 분 걸린다.
4. **첫 대화**: 채팅 탭에서 방금 받은 모델을 로드하고 말을 걸면 끝이다. 와이파이를 꺼도 답이 나오는 걸 확인해 보면 "내 컴퓨터가 답하고 있다"는 게 실감난다.
5. **(선택) 컨텍스트 길이 조정**: 모델 로드 옵션에서 컨텍스트(대화 기억 길이)를 늘릴 수 있는데, 길수록 메모리를 더 먹는다. 처음엔 기본값(4k~8k)으로 시작하자.

Ollama를 쓴다면 설치 후 터미널에 `ollama run gemma4` 한 줄이면 다운로드부터 대화까지 자동으로 진행된다. 나중에 다른 앱(메모 도구, 코딩 도구)과 연동하고 싶어지면 그때 Ollama의 API 서버 기능이 빛을 발한다. LM Studio도 개발자 모드를 켜면 `localhost:1234`에서 OpenAI 호환 API 서버로 쓸 수 있어, 어느 쪽으로 시작해도 막다른 길은 아니다.

![a laptop sits on a desk](https://images.unsplash.com/photo-1650661926447-9efb2610f64c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwZGVzayUyMGNvZGluZyUyMGFpfGVufDF8MHx8fDE3ODI5ODExODZ8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Faraaz Zuberi](https://unsplash.com/@ffz_20?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-laptop-sits-on-a-desk-YoIq2GyYcAU?utm_source=spice-bandit-blog&utm_medium=referral)*

## 초보자 추천 모델 — 내 메모리에 맞는 것부터 (2026년 7월 기준)

2026년 상반기 오픈모델의 양대 산맥은 **Google Gemma 4 패밀리**와 **알리바바 Qwen 3.6 패밀리**다. 앞서 본 레딧 스레드에서도 실사용 보고의 대부분이 이 두 계열이었다("Gemma 4가 처음으로 코딩 도구에서 제대로 쓸 만한 로컬 모델", "Qwen 35B-A3B로 실제 클라이언트 코딩 작업을 한다" 등). 초보자 기준 추천을 표로 정리하면 다음과 같다.

| 모델 | 파라미터 | 필요 메모리 (Q4 기준) | 맞는 하드웨어 | 주 용도 |
|------|----------|----------------------|---------------|---------|
| Gemma 4 E2B | 유효 2B급 | 약 4~5GB | 8GB RAM 노트북도 가능 | 가벼운 요약·문답 입문 |
| Gemma 4 E4B | 유효 4B급 | 약 6GB (여유 있게 8GB 권장) | 16GB Mac, VRAM 8GB GPU | 일상 대화·요약·번역 |
| Gemma 4 26B A4B (MoE) | 26B(활성 4B) | 약 16~24GB | 32GB 통합메모리 Mac, RTX 5090(32GB)급* | 문서 작업·긴 글 |
| Qwen3.6-35B-A3B (MoE) | 35B(활성 3B) | 약 20GB (Q4_K_M) | 24GB VRAM(RTX 4090), 36GB+ Mac | 코딩·리서치 보조 |
| Gemma 4 31B (dense) | 31B | 약 17~20GB | RTX 5090, 48GB+ Mac | 고품질 글쓰기·코딩 |

*출처: [Google AI for Developers — Gemma 4 개요](https://ai.google.dev/gemma/docs/core), [Unsloth — Gemma 4 실행 가이드](https://unsloth.ai/docs/models/gemma-4), [APXML — Qwen 35B-A3B 사양](https://apxml.com/models/qwen36-35b-a3b), [Qwen 공식 블로그 — Qwen3.6-35B-A3B](https://qwen.ai/blog?id=qwen3.6-35b-a3b)*

*\* VRAM이 16GB 이하인 GPU에서 26B A4B를 돌리려면 MoE 전문가 레이어를 일반 RAM으로 내리는 오프로딩 설정이 필요하고, 그만큼 속도는 떨어진다. 또한 표의 수치는 모델 가중치 기준이라, Gemma 4 31B 같은 큰 모델을 긴 컨텍스트로 쓰려면 24GB 이상 메모리 여유를 권장한다.*

여기서 "A4B", "A3B"가 붙은 모델은 **MoE(Mixture of Experts)** 구조다. 전체 파라미터 중 매 토큰마다 일부(3~4B)만 활성화돼 계산이 가볍고 빠르다. 반대로 표의 "dense"는 모든 파라미터를 항상 사용하는 일반 구조를 말한다. 단, 주의할 점 — **메모리는 전체 파라미터 기준으로 필요하다.** 35B-A3B는 계산은 3B처럼 하지만 35B 전체가 메모리에 올라가야 한다. MoE가 아끼는 건 연산이지 메모리가 아니라는 것, 초보자가 가장 많이 헷갈리는 지점이다.

<figure>
<svg viewBox="0 0 800 400" role="img" aria-label="초보자 추천 로컬 LLM 모델별 필요 메모리 비교 바차트. Gemma 4 E2B 약 4GB, Gemma 4 E4B 약 6GB, Gemma 4 26B A4B 16에서 24GB, Qwen3.6-35B-A3B 약 20GB, Gemma 4 31B 17에서 20GB" style="width:100%;height:auto;background:#fafafa;border:1px solid #eee;border-radius:8px;font-family:system-ui">
  <text x="20" y="30" font-size="16" font-weight="700" fill="#111">추천 모델별 필요 메모리 (Q4 양자화 기준, GB — 낮을수록 진입장벽 낮음)</text>
  <!-- gridlines: 0,8,16,24,32 GB -->
  <g stroke="#e5e7eb" stroke-width="1">
    <line x1="200" y1="52" x2="200" y2="330"/>
    <line x1="344" y1="52" x2="344" y2="330"/>
    <line x1="488" y1="52" x2="488" y2="330"/>
    <line x1="632" y1="52" x2="632" y2="330"/>
    <line x1="776" y1="52" x2="776" y2="330"/>
  </g>
  <g font-size="12" fill="#6b7280">
    <text x="200" y="348" text-anchor="middle">0</text>
    <text x="344" y="348" text-anchor="middle">8GB</text>
    <text x="488" y="348" text-anchor="middle">16GB</text>
    <text x="632" y="348" text-anchor="middle">24GB</text>
    <text x="776" y="348" text-anchor="middle">32GB</text>
  </g>
  <!-- Gemma 4 E2B: ~4GB -->
  <text x="192" y="80" font-size="13" fill="#374151" text-anchor="end">Gemma 4 E2B</text>
  <rect x="200" y="62" width="72" height="28" rx="4" fill="#9ca3af"/>
  <text x="280" y="82" font-size="13" fill="#374151">약 4GB</text>
  <!-- Gemma 4 E4B: ~6GB (hero) -->
  <text x="192" y="135" font-size="13" fill="#374151" text-anchor="end">Gemma 4 E4B ★입문 추천</text>
  <rect x="200" y="117" width="108" height="28" rx="4" fill="#2563eb"/>
  <text x="316" y="137" font-size="13" font-weight="700" fill="#2563eb">약 6GB</text>
  <!-- Gemma 4 26B A4B: 16~24GB range -->
  <text x="192" y="190" font-size="13" fill="#374151" text-anchor="end">Gemma 4 26B A4B</text>
  <rect x="200" y="172" width="288" height="28" rx="4" fill="#9ca3af"/>
  <rect x="488" y="172" width="144" height="28" rx="4" fill="#d1d5db"/>
  <text x="640" y="192" font-size="13" fill="#374151">16~24GB</text>
  <!-- Qwen3.6-35B-A3B: ~20GB -->
  <text x="192" y="245" font-size="13" fill="#374151" text-anchor="end">Qwen3.6-35B-A3B</text>
  <rect x="200" y="227" width="360" height="28" rx="4" fill="#9ca3af"/>
  <text x="568" y="247" font-size="13" fill="#374151">약 20GB</text>
  <!-- Gemma 4 31B: 17~20GB range -->
  <text x="192" y="300" font-size="13" fill="#374151" text-anchor="end">Gemma 4 31B</text>
  <rect x="200" y="282" width="306" height="28" rx="4" fill="#9ca3af"/>
  <rect x="506" y="282" width="54" height="28" rx="4" fill="#d1d5db"/>
  <text x="568" y="302" font-size="13" fill="#374151">17~20GB</text>
</svg>
<figcaption>Q4 양자화 기준 필요 메모리(모델 가중치 기준, 컨텍스트용 메모리 별도). 연한 회색은 양자화 수준·컨텍스트 설정에 따른 범위. 출처: Google AI for Developers, Unsloth, APXML</figcaption>
</figure>

시작 조합은 단순하게 가자. **16GB 메모리라면 Gemma 4 E4B**, **24GB 이상이라면 Qwen3.6-35B-A3B 또는 Gemma 4 26B A4B**. 8GB뿐이라면 E2B로 감을 잡은 뒤 하드웨어 업그레이드를 고민해도 늦지 않다.

## 흔한 실수와 팁 — 첫 주에 겪는 시행착오 줄이기

- **실수 1: 메모리보다 큰 모델을 받는다.** "클수록 좋겠지"라며 70B 모델을 받으면 메모리를 넘쳐 1초에 한두 단어 나오는 속도를 경험하게 된다. 모델 크기 ≤ 내 메모리의 70~80%가 안전선이다.
- **실수 2: 클라우드 최신 모델과 비교하며 실망한다.** 레딧 스레드의 표현을 빌리면 "16GB 맥미니로 Opus(최상위 유료 모델)를 돌리는 것처럼 말하는 사람들은 현실적이지 않다". 기대치는 '작년의 ChatGPT'다. 요약·번역·초안·분류 같은 작업엔 충분하고, 최첨단 추론·복잡한 코딩엔 부족하다.
- **실수 3: 처음부터 이것저것 만진다.** 온도(temperature), 시스템 프롬프트, 컨텍스트 길이… 기본값으로 일주일 써본 뒤에 만져도 늦지 않다. 설정 마찰이야말로 로컬 LLM 최대의 적임을 기억하자.
- **팁 1: 용도를 하나 정해 두고 시작한다.** 레딧에서 성공 사례를 올린 사람들의 공통점은 "명확한 한 가지 용도"였다. 이메일 요약, 영수증 정리, 회의록 정돈, 일기 상담 — 민감해서 클라우드에 넣기 꺼려지던 것 하나를 골라 보자.
- **팁 2: 로컬 + 클라우드 병행이 정답이다.** 민감한 데이터 전처리·반복 작업은 로컬로, 고난도 작업은 클라우드로. 스레드의 여러 파워유저들이 정착한 구도다.
- **팁 3: 검증은 습관으로.** 작은 모델일수록 그럴듯한 오답(환각)이 잦다. 사실 확인이 필요한 답은 반드시 교차 검증한다.

## So What — 누구에게 로컬 LLM이 맞는가

정리하자. 레딧 220여 개 댓글이 도달한 결론과 내 판단은 같다. **로컬 LLM은 "모두를 위한 ChatGPT 대체재"가 아니라 "특정한 사람을 위한 확실한 도구"다.**

당신이 다음 중 하나에 해당하면 지금 시작할 가치가 있다. ①회사 문서·고객 데이터·개인 기록처럼 **외부 서버에 못 올리는 데이터**로 AI를 쓰고 싶은 사람 ②API 요금 걱정 없이 **대량 반복 작업**(문서 분류, 요약 파이프라인)을 돌리고 싶은 사람 ③오프라인 환경이 잦거나, AI가 어떻게 돌아가는지 **직접 배우고 싶은** 사람. 반대로 "그냥 제일 똑똑한 AI와 대화하고 싶다"면 월 몇만 원의 구독이 여전히 압도적으로 합리적이다.

그리고 한 가지 흐름은 기억해 둘 만하다. 오픈모델 품질은 프런티어와의 격차를 1년 안팎으로 유지한 채 함께 올라가고 있고, 도구의 마찰은 빠르게 사라지고 있다. "모델의 한계가 아니라 설정의 한계"라던 그 장벽이 무너지는 중이라는 뜻이다. 오늘 16GB 노트북에 LM Studio와 Gemma 4 E4B를 깔아 보는 30분의 투자는, 취미로 끝나더라도 AI가 내 손안에서 어떻게 움직이는지 이해하게 해 주는 가장 싼 수업료다.

---

**참고 자료**

- [r/LocalLLM — "Are Local LLMs actually useful… or just fun to tinker with?"](https://www.reddit.com/r/LocalLLM/comments/1sm4i2m/are_local_llms_actually_useful_or_just_fun_to/) (Reddit, 2026-04)
- [Gemma 4 model overview — Google AI for Developers](https://ai.google.dev/gemma/docs/core)
- [Gemma 4 — How to Run Locally, Unsloth Documentation](https://unsloth.ai/docs/models/gemma-4)
- [Qwen 35B-A3B — Specifications and GPU VRAM Requirements, APXML](https://apxml.com/models/qwen36-35b-a3b)
- [Qwen3.6-35B-A3B — Qwen 공식 블로그](https://qwen.ai/blog?id=qwen3.6-35b-a3b)
- [GGUF 파일 형식 — Hugging Face Docs](https://huggingface.co/docs/hub/gguf)
- [The Best Local LLMs To Run On Every Mac (Apple Silicon) — APXML](https://apxml.com/posts/best-local-llm-apple-silicon-mac)
- [LM Studio Docs](https://lmstudio.ai/docs/app) · [Ollama Download](https://ollama.com/download)

*본 글은 2026년 7월 초 기준 공개 정보를 바탕으로 작성했으며, 모델·도구 사양은 이후 업데이트로 달라질 수 있다.*

<script type="application/ld+json">
{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "로컬 LLM이란 무엇인가요?", "acceptedAnswer": {"@type": "Answer", "text": "ChatGPT처럼 클라우드 서버에 접속하는 대신, 오픈모델을 내 컴퓨터에서 직접 실행하는 AI를 말합니다. 인터넷 없이 작동하고 대화 내용이 내 기기 밖으로 나가지 않습니다."}}, {"@type": "Question", "name": "로컬 LLM을 돌리려면 어떤 컴퓨터 사양이 필요한가요?", "acceptedAnswer": {"@type": "Answer", "text": "메모리가 핵심입니다. 8GB면 소형 모델, 16GB면 12B급, 24GB 이상이면 20~30B급 모델까지 실행할 수 있습니다. Apple Silicon Mac은 통합메모리, 윈도우 PC는 GPU VRAM 용량이 기준입니다."}}, {"@type": "Question", "name": "초보자가 로컬 LLM을 시작하는 가장 쉬운 방법은?", "acceptedAnswer": {"@type": "Answer", "text": "LM Studio를 설치하고 내 메모리에 맞는 추천 모델(GGUF)을 내려받아 채팅을 시작하는 것입니다. 10분이면 첫 대화가 가능하며, 터미널이 익숙하다면 Ollama도 좋은 선택입니다."}}, {"@type": "Question", "name": "로컬 LLM은 무료인가요?", "acceptedAnswer": {"@type": "Answer", "text": "LM Studio·Ollama 같은 실행 도구와 Gemma·Qwen 같은 오픈모델은 무료입니다. 이미 가진 컴퓨터와 전기료 외에 사용량 과금이 없어 무제한으로 쓸 수 있습니다."}}]}
</script>
