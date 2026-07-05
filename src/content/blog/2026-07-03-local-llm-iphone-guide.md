---
title: "아이폰 로컬 LLM 돌리기: 스마트폰 AI 가이드 [2편]"
description: "아이폰에서 인터넷 없이 AI를 돌리는 법. PocketPal·Locally(LM Studio)·fullmoon 등 앱 비교, 기종별 가능 모델 표, 10분 시작 가이드까지 — 2026년 7월 기준 스마트폰 로컬 LLM 입문."
pubDate: 2026-07-04T00:20:00+09:00
category: ai
tags: ["로컬LLM", "아이폰AI", "온디바이스AI", "PocketPal"]
---

**아이폰 로컬 LLM** — 맥북도 게이밍 PC도 아닌, 주머니 속 스마트폰에서 AI를 직접 돌리는 이야기다. 결론부터 말하면 — **된다.** 2026년 7월 현재, 앱스토어에서 무료 앱 하나를 받고 2~3GB짜리 소형 모델을 내려받으면, 비행기 모드 상태의 아이폰에서 10분 안에 AI와 첫 대화를 나눌 수 있다. 다만 조건이 붙는다. 돌릴 수 있는 건 1~4B(10억~40억 파라미터)급 소형 모델이고, 품질은 ChatGPT의 대체재가 아니라 "오프라인에서도 작동하는 개인 비서 축소판"에 가깝다. [로컬 LLM 시작 가이드 1편](/blog/2026-07-02-local-llm-beginner-guide/)에서 컴퓨터 기준의 기초(양자화, GGUF, 메모리 계산)를 다뤘다면, 이번 2편은 ①아이폰 하드웨어로 어디까지 되는지 ②Apple Intelligence와 "직접 돌리기"의 차이 ③앱 비교와 추천 ④단계별 시작 가이드 ⑤현실적인 용도와 한계를 순서대로 정리한다. 핵심 메시지는 이것이다. **아이폰 로컬 LLM의 가치는 성능이 아니라 "항상 주머니에 있고, 전파가 없어도 되고, 아무에게도 안 보이는" 세 가지 속성에서 나온다.**

## 아이폰에서 정말 되나 — 기종별 RAM과 iOS 메모리 제한부터

1편에서 강조했듯 로컬 LLM의 첫 번째 관문은 **메모리**다. 아이폰은 맥과 달리 RAM 사양을 공식 표기하지 않지만, 알려진 수치는 다음과 같다([MacRumors](https://www.macrumors.com/2025/09/09/iphone-17-pro-iphone-air-ram-amounts/) 기준). 특히 2025년 가을 출시된 아이폰 17 Pro 계열은 RAM이 8GB에서 12GB로 뛰었는데, 이는 역대 아이폰 중 가장 큰 폭의 메모리 증가로, 온디바이스 AI를 겨냥한 업그레이드라는 해석이 일반적이다.

| 기종 | RAM | 현실적으로 돌릴 수 있는 모델 (Q4 양자화 기준) |
|------|-----|---------------------------------------------|
| iPhone 17 Pro / Pro Max / Air | 12GB | 3~4B급 여유, 7~8B급도 시도 가능(느림) |
| iPhone 17 (기본형) | 8GB | 3~4B급 (Phi-4 Mini, Qwen 4B급) |
| iPhone 15 Pro / 16 시리즈 | 8GB | 3~4B급 (Gemma 4 E2B, Llama 3.2 3B) |
| iPhone 14 Pro / 15 (기본형) | 6GB | 1~2B급 (Llama 3.2 1B, SmolLM급) |
| iPhone SE·13 (기본형) 이하 | 4GB 이하 | 사실상 비추천 (1B급도 빠듯) |

*출처: [MacRumors — iPhone 17 시리즈 RAM](https://www.macrumors.com/2025/09/09/iphone-17-pro-iphone-air-ram-amounts/), [PromptQuorum — 아이폰 로컬 LLM 앱 가이드 2026](https://www.promptquorum.com/power-local-llm/best-local-llm-apps-iphone-2026)*

여기서 컴퓨터와 결정적으로 다른 제약이 하나 있다. iOS는 **앱 하나가 쓸 수 있는 메모리에 상한(jetsam limit)** 을 둔다. 한도를 넘는 앱은 시스템이 즉시 강제 종료시킨다. 정확한 수치는 기기·OS 버전마다 다르지만, 개발자 커뮤니티에서 보고된 값 기준으로 8GB 아이폰에서 앱 하나가 쓸 수 있는 메모리는 대략 4GB 안팎으로 알려져 있다([Apple 개발자 포럼](https://developer.apple.com/forums/thread/688973) 참고). 즉 "RAM 8GB니까 7B 모델(Q4 기준 약 4.2GB+α)도 되겠지"라는 계산은 앱 강제 종료로 끝나기 쉽다. **아이폰의 실전 상한은 3~4B급 모델**이라고 보는 게 안전하고, 그래서 양자화(1편에서 다룬 Q4 압축)는 선택이 아니라 필수다.

속도는 어떨까. 2026년 6월 기준 실측을 정리한 [PromptQuorum 가이드](https://www.promptquorum.com/power-local-llm/best-local-llm-apps-iphone-2026)에 따르면 iPhone 16 Pro에서 Phi-4 Mini(3.8B, Q4) 기준 초당 10~15토큰(Metal 가속 앱은 14~20토큰) 수준이다. 1B급 소형 모델은 최신 기종에서 초당 25~40토큰까지 나온다는 집계도 있다([Local AI Master](https://localaimaster.com/blog/run-llm-on-phone)). 사람이 글을 읽는 속도가 대략 초당 5~7토큰 수준임을 감안하면, **채팅 용도로는 충분히 실용적인 속도**다. 다만 두 가지를 각오해야 한다. 장문 생성을 10~15분 이상 계속하면 발열로 속도가 30~50% 떨어지고, 연속 추론 중 배터리는 시간당 20~30%씩 닳는다는 실측 보고가 있다. 아이폰 로컬 LLM은 "짧고 빈번한 대화"용이지, 장편 보고서 생성기가 아니다.

<figure>
<svg viewBox="0 0 800 260" role="img" aria-label="아이폰 16 Pro급 기준 모델 크기별 생성 속도 비교 바차트. 1B급 모델 초당 25에서 40토큰, 3~4B급 모델 초당 10에서 20토큰, 사람이 읽는 속도 초당 약 5에서 7토큰" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;font-family:system-ui">
  <text x="20" y="30" font-size="16" font-weight="700" fill="#23201D">아이폰(16 Pro급)에서 모델 크기별 생성 속도 (토큰/초 — 높을수록 빠름)</text>
  <g stroke="#E5DECF" stroke-width="1">
    <line x1="220" y1="50" x2="220" y2="210"/>
    <line x1="355" y1="50" x2="355" y2="210"/>
    <line x1="490" y1="50" x2="490" y2="210"/>
    <line x1="625" y1="50" x2="625" y2="210"/>
    <line x1="760" y1="50" x2="760" y2="210"/>
  </g>
  <g font-size="12" fill="#8A8378">
    <text x="220" y="228" text-anchor="middle">0</text>
    <text x="355" y="228" text-anchor="middle">10</text>
    <text x="490" y="228" text-anchor="middle">20</text>
    <text x="625" y="228" text-anchor="middle">30</text>
    <text x="760" y="228" text-anchor="middle">40 tok/s</text>
  </g>
  <text x="212" y="80" font-size="13" fill="#23201D" text-anchor="end">1B급 (Llama 3.2 1B 등)</text>
  <rect x="220" y="62" width="337" height="26" rx="4" fill="#C8102E"/>
  <rect x="557" y="62" width="203" height="26" rx="4" fill="#EBB1B4"/>
  <text x="560" y="80" font-size="13" font-weight="700" fill="#FAF6EE" text-anchor="end">25~40</text>
  <text x="212" y="130" font-size="13" fill="#23201D" text-anchor="end">3~4B급 (Phi-4 Mini 등)</text>
  <rect x="220" y="112" width="135" height="26" rx="4" fill="#8A8378"/>
  <rect x="355" y="112" width="135" height="26" rx="4" fill="#E5DECF"/>
  <text x="498" y="130" font-size="13" fill="#23201D">10~20</text>
  <text x="212" y="180" font-size="13" fill="#23201D" text-anchor="end">사람이 읽는 속도 (참고)</text>
  <rect x="220" y="162" width="81" height="26" rx="4" fill="#E5DECF"/>
  <text x="309" y="180" font-size="13" fill="#8A8378">약 5~7</text>
</svg>
<figcaption>모델 크기별 생성 속도 실측 범위(연한 색은 앱·양자화·발열 상태에 따른 변동 폭). 읽는 속도보다 빠르면 채팅용으로 실용적이다. 출처: PromptQuorum(2026-06), Local AI Master</figcaption>
</figure>

## 두 가지 길 — Apple Intelligence vs 오픈모델 직접 돌리기

아이폰에서 "로컬 AI"를 쓰는 길은 사실 두 갈래이고, 이 구분을 알아야 앱 선택이 쉬워진다.

잠깐 배경 하나. 아이폰이 AI 전용 하드웨어를 품기 시작한 건 최근 일이 아니다. 2017년 9월 iPhone 8·X에 실린 A11 Bionic 칩에 애플의 첫 '뉴럴엔진'(초당 6,000억 회 연산)이 들어갔는데, 당시 용도는 Face ID와 애니모지 정도였다([CNBC, 2017-09](https://www.cnbc.com/2017/09/12/apple-unveils-a11-bionic-neural-engine-ai-chip-in-iphone-x.html)). 6년 뒤 A17 Pro(iPhone 15 Pro)의 뉴럴엔진은 초당 35조 회로 약 60배가 됐다([Wikipedia — Apple A17](https://en.wikipedia.org/wiki/Apple_A17)). LLM이라는 소프트웨어가 도착하기 전에, 하드웨어는 이미 10년 가까이 조용히 준비되고 있었던 셈이다.

**첫째 길은 Apple이 깔아준 길이다.** 아이폰에는 이미 Apple Intelligence용 **약 3B 파라미터의 온디바이스 파운데이션 모델**이 내장돼 있다. Apple은 이 모델을 가중치당 2비트까지 압축해 넣었고, 한국어를 포함한 15개 언어를 지원한다([Apple ML Research](https://machinelearning.apple.com/research/apple-foundation-models-2025-updates)). 그리고 iOS 26부터는 **Foundation Models 프레임워크**를 통해 서드파티 앱도 이 내장 모델을 무료로, 인터넷 없이 호출할 수 있게 됐다([Apple Newsroom](https://www.apple.com/newsroom/2025/09/apples-foundation-models-framework-unlocks-new-intelligent-app-experiences/)). 일기 앱이 내 글을 요약해 주고, 운동 앱이 기록을 정리해 주는 식의 "조용한 AI 기능"이 이 길로 들어온다. 다만 이 모델은 범용 챗봇용이 아니다. 날짜 추출·분류·문장 다듬기 같은 제한된 작업에 강하고, 자유로운 장문 생성에는 약하다는 것이 개발자들의 공통된 평가다. 사용자 입장에서는 모델을 고를 수도, 바꿀 수도 없다.

**둘째 길이 이 글의 주제 — 오픈모델을 직접 내려받아 돌리는 것이다.** 1편에서 다룬 Gemma·Qwen·Llama 같은 공개 모델의 소형 버전을 전용 앱으로 실행한다. 모델을 내가 고르고, 시스템 프롬프트와 온도(temperature)까지 만질 수 있으며, Apple 생태계 밖의 최신 오픈모델을 바로 써볼 수 있다. 대신 앱 설치와 모델 다운로드라는 수고가 든다. 비유하면 첫째 길은 "건물에 내장된 공조 시스템", 둘째 길은 "내 방에 내가 고른 에어컨 설치"다. 이 글의 나머지는 둘째 길의 가이드다.

![space gray iPhone X](https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxpcGhvbmUlMjBhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYXBwfGVufDF8MHx8fDE3ODMwNDUzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [William Hook](https://unsplash.com/@williamtm?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/space-gray-iphone-x-9e9PD9blAto?utm_source=spice-bandit-blog&utm_medium=referral)*

## 아이폰용 로컬 LLM 앱 비교 — 2026년 7월 기준

앱스토어에는 로컬 LLM 앱이 여럿 올라와 있고, 2026년 들어 판도 변화도 있었다. 가장 큰 뉴스는 1편에서 데스크톱 표준으로 소개한 **LM Studio가 2026년 4월 아이폰 앱 'Locally AI'를 인수**하고([LM Studio 블로그](https://lmstudio.ai/blog/locally-ai-joins-lm-studio)), 6월에는 **LM Link** — 집에 있는 맥/PC의 LM Studio에서 돌아가는 큰 모델을 아이폰에서 종단간 암호화로 원격 사용하는 기능 — 를 내놓은 것이다([발표문](https://lmstudio.ai/blog/locally-lm-link)). "폰에서는 소형 모델, 집 컴퓨터의 큰 모델은 원격으로"라는 조합이 공식 지원되기 시작한 셈이다. 주요 앱을 표로 정리한다.

| 앱 | 가격 | 모델 형식 | 특징 | 이런 사람에게 |
|----|------|----------|------|--------------|
| **PocketPal AI** | 무료 (오픈소스) | GGUF (Hugging Face 자유 로드) | iOS·안드로이드 모두 지원, 내장 벤치마크, 설정 자유도 높음 | 처음 시작하는 대부분의 사람 ★ |
| **Locally (by LM Studio)** | 무료 | MLX (Apple Silicon 최적화) | LM Studio 공식 모바일 앱, LM Link로 데스크톱 모델 원격 사용 | 1편에서 LM Studio를 깐 사람 |
| **fullmoon** | 무료 (오픈소스) | MLX | Mainframe 제작, 미니멀 UI, iPhone·iPad·Mac·Vision Pro 지원 | 가볍고 예쁜 앱을 원하는 사람 |
| **Private LLM** | 유료 (약 1만 원대 일회성) | 자체 최적화 양자화 | Siri·단축어 연동, 140개 이상 큐레이션 모델 | 단축어 자동화에 엮고 싶은 사람 |
| **Enclave** | 로컬 모델 무료 | GGUF | PDF 문서 대화, 음성 대화 지원 (클라우드 모델만 유료) | 문서 요약 용도가 많은 사람 |
| **MLC Chat / LLM Farm** | 무료 (오픈소스) | MLC 컴파일 / GGUF | Metal 가속으로 빠름 / 세부 파라미터 노출 | 속도·설정을 파고드는 파워유저 |
| **Apollo (Liquid AI)** | 무료 | LEAP·LFM2 계열 | 온디바이스 특화 기업 Liquid AI가 인수, 자사 경량 모델 특화 | 신형 경량 모델이 궁금한 사람 |

*출처: [PromptQuorum(2026-06)](https://www.promptquorum.com/power-local-llm/best-local-llm-apps-iphone-2026), [LM Studio 블로그](https://lmstudio.ai/blog/locally-ai-joins-lm-studio), [fullmoon](https://fullmoon.app/), [Enclave](https://enclaveai.app/), [Liquid AI](https://www.liquid.ai/blog/liquid-ai-launches-leap-and-apollo-bringing-edge-ai-to-every-developer) — 가격·기능은 확인 시점 기준이며 변동될 수 있다.*

고르는 기준은 단순하다. **처음이라면 PocketPal AI**다. 무료·오픈소스인 데다 iOS와 안드로이드를 모두 지원하고, Hugging Face의 GGUF 모델을 자유롭게 얹을 수 있어 1편에서 배운 지식(Q4_K_M 고르기 등)이 그대로 통한다. 1편을 따라 맥에 LM Studio를 이미 깔았다면 **Locally**로 시작해 LM Link까지 묶는 조합이 자연스럽다. 디자인 취향이라면 fullmoon, 단축어 자동화가 목적이면 Private LLM이 대안이다.

## 10분 시작 가이드 — PocketPal로 첫 대화까지

PocketPal AI 기준으로 첫 대화까지의 단계는 다음과 같다. 와이파이 환경에서 모델을 받아두는 것 말고는 인터넷이 전혀 필요 없다.

1. **앱 설치**: 앱스토어에서 "PocketPal AI"를 검색해 설치한다. 무료이고 계정 가입도 없다(오픈소스 프로젝트다 — [GitHub](https://github.com/a-ghorbani/pocketpal-ai)).
2. **모델 다운로드**: 앱 하단 Models 탭 → 추천 목록에서 내 기종에 맞는 모델을 고른다. 8GB 기종(15 Pro~17)이면 3~4B급, 6GB 기종이면 1B급이 안전하다(아래 추천 표 참고). Q4_K_M 버전 기준 파일 크기는 1~3GB, 와이파이로 몇 분 걸린다.
3. **모델 로드**: 다운로드가 끝나면 모델 옆의 Load 버튼을 누른다. 수십 초 안에 메모리에 올라간다.
4. **첫 대화**: Chat 탭에서 말을 걸어본다. 확실하게 실감하고 싶다면 **비행기 모드를 켜고** 질문해 보자. 전파가 끊긴 상태에서 답이 흘러나오는 순간이 이 글의 하이라이트다.
5. **(선택) 벤치마크**: PocketPal에는 내 기기의 토큰 속도를 재는 벤치마크 기능이 내장돼 있다. 모델·양자화를 바꿔가며 내 기종의 한계를 직접 확인할 수 있다.

주의할 점 하나 — 모델을 로드한 채 다른 무거운 앱(카메라, 게임)을 오가면 iOS가 메모리 확보를 위해 앱을 종료시킬 수 있다. 로컬 LLM을 쓸 때는 그 앱에 집중하는 편이 좋다.

![black iphone 5 on brown wooden table](https://images.unsplash.com/photo-1596558450268-9c27524ba856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxpcGhvbmUlMjBhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYXBwfGVufDF8MHx8fDE3ODMwNDUzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Thom Bradley](https://unsplash.com/@thombradley?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-iphone-5-on-brown-wooden-table-A6qNzfJXRGQ?utm_source=spice-bandit-blog&utm_medium=referral)*

## 아이폰에 맞는 추천 모델 — 크기별 정리

1편의 공식(필요 메모리 ≈ 파라미터 수 × 0.5바이트 × 1.2, Q4 기준)은 아이폰에서도 그대로 통한다. 다만 앱당 메모리 상한 때문에 여유를 더 둬야 한다. 2026년 7월 기준 아이폰에서 검증된 소형 모델들이다.

| 모델 | 크기 | Q4 파일 크기(대략) | 최소 권장 기종 | 특징 |
|------|------|-------------------|---------------|------|
| Llama 3.2 1B | 1B | 약 0.8GB | 6GB RAM (14 Pro~) | 가장 가볍고 빠름(25~40 tok/s급), 모바일 튜닝 |
| Gemma 4 E2B | 유효 2B | 약 3GB | 8GB RAM (15 Pro~) | 이미지 인식 가능, 다국어 강함 — 실사용 보고 다수 |
| Llama 3.2 3B | 3B | 약 2GB | 8GB RAM | 128K 컨텍스트, 균형형 |
| Phi-4 Mini | 3.8B | 약 2.5GB | 8GB RAM | 3~4B급 중 벤치마크 상위, 추론·수학 강점 |
| Qwen 3 4B급 | 4B | 약 2.5~3GB | 8GB RAM (12GB면 여유) | 한국어 포함 다국어 성능 우수 |

*출처: [Local AI Master — 스마트폰 LLM 가이드](https://localaimaster.com/blog/run-llm-on-phone), [PromptQuorum](https://www.promptquorum.com/power-local-llm/best-local-llm-apps-iphone-2026), [XDA — 아이폰 16 실사용기(2026-05)](https://www.xda-developers.com/replaced-chatgpt-claude-gemini-on-phone-with-local-llm/)*

한국어로 쓸 거라면 다국어 성능이 검증된 **Gemma 계열과 Qwen 계열**을 우선 시도해 보길 권한다. 참고로 XDA의 2026년 5월 실사용기는 iPhone 16(8GB)에서 PocketPal + Gemma 4 E2B 조합으로 한 달을 지낸 기록인데, "응답이 대화체로 자연스럽고, 스크린샷을 찍어 이미지 분석까지 됐다"는 긍정 평가와 함께 뒤에서 다룰 한계도 솔직하게 적고 있다.

## 뭐에 쓸만한가 — 그리고 무엇을 기대하면 안 되는가

솔직한 현실 점검이다. 아이폰 로컬 LLM이 **실제로 쓸만한 장면**은 다음과 같다.

- **오프라인 상황**: 해외여행 기내, 로밍 없는 지역, 산행·캠핑에서 번역·문장 작성·상식 문답. 전파가 없어도 되는 AI는 생각보다 든든하다.
- **프라이버시가 걸린 메모**: 일기 정리, 건강·재정 관련 질문, 민감한 아이디어 브레인스토밍. 어떤 서버로도 전송되지 않는다는 확신이 주는 효용은 1편에서 본 로컬 LLM의 본질 그대로다.
- **짧은 반복 작업**: 문자·이메일 초안 다듬기, 스크린샷 내용 설명(비전 지원 모델), 요점 정리. 3~4B급 모델이 가장 잘하는 영역이다.

반대로 **기대하면 안 되는 것**도 명확하다. 첫째, 품질. 3~4B 모델은 1편에서 다룬 데스크톱용 20~30B급보다도 한참 아래고, 최신 클라우드 모델과 비교하는 건 무의미하다. 복잡한 추론, 긴 코드, 정확한 사실 확인이 필요한 작업엔 부적합하고 환각(그럴듯한 오답)도 잦다. 둘째, 지속 사용. 발열 스로틀링과 배터리 소모 때문에 장시간 생성 작업은 구조적으로 안 맞는다. 셋째, 편의 기능. 웹 검색, 세션 간 기억, 도구 호출 같은 클라우드 앱의 편의는 대부분 없다. 요컨대 **"주머니 속 작년 보급형 AI + 완전한 프라이버시 + 오프라인"이 정직한 기대치**다.

안드로이드 사용자를 위한 한 문단 — 사정은 아이폰과 거의 같고, 오히려 선택지가 조금 더 넓다. PocketPal AI가 [구글 플레이](https://play.google.com/store/apps/details?id=com.pocketpalai)에도 올라와 있어 이 글의 시작 가이드를 그대로 따라 하면 되고, 갤럭시 S24/S25급(12GB RAM 모델)은 앱당 메모리 제약이 iOS보다 느슨해 같은 값이면 조금 더 큰 모델을 돌리기도 한다. 파워유저는 Termux로 llama.cpp를 직접 돌리는 길도 있다.

![black iphone 4 displaying icons](https://images.unsplash.com/photo-1603515161074-3206aaeb03f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxpcGhvbmUlMjBhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYXBwfGVufDF8MHx8fDE3ODMwNDUzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [James Yarema](https://unsplash.com/@jamesyarema?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-iphone-4-displaying-icons-G3q7mxXkP-M?utm_source=spice-bandit-blog&utm_medium=referral)*

## So What — 폰 속 AI는 어디로 가는가

정리하자. 아이폰에서 로컬 LLM은 이미 "되느냐"의 문제가 아니라 "무엇에 쓰느냐"의 문제다. 그리고 2026년 상반기의 세 가지 움직임이 방향을 보여준다. **Apple은 iOS 26에서 내장 3B 모델을 모든 앱에 개방**했고, **LM Studio는 아이폰 앱을 인수해 데스크톱과 모바일을 연결**했으며, **아이폰 17 Pro의 RAM은 12GB로 뛰었다**. 플랫폼·도구·하드웨어가 같은 방향 — 온디바이스 AI — 을 가리키고 있다.

이는 컴퓨팅의 역사가 반복해 온 방향이기도 하다. 방 하나를 차지하던 메인프레임의 계산력이 1980년대 책상 위 PC로, 2000년대 주머니 속 스마트폰으로 내려왔듯, AI도 지금 데이터센터에서 개인 기기로 같은 경로를 밟는 중이다. 2019년 OpenAI가 15억(1.5B) 파라미터짜리 GPT-2를 악용 우려로 9개월에 걸쳐 단계적으로만 공개했던 일을 떠올리면([The Register, 2019-11](https://www.theregister.com/2019/11/06/openai_gpt2_released/)), 7년 뒤 그 두 배 크기의 모델이 전파가 끊긴 아이폰에서 돌아가는 지금의 풍경은 — 성능 수치와 별개로 — 그 자체가 하나의 이정표다.

초보자의 행동 지침은 1편과 같은 논리다. 거창한 준비 없이, 오늘 앱스토어에서 PocketPal을 받아 내 기종에 맞는 모델 하나로 비행기 모드 대화를 해보는 것. 그 10분이면 "내 폰이 AI를 품는다"는 게 어떤 감각인지, 그리고 그것이 내 생활에서 어떤 자리를 차지할 수 있는지 스스로 판단할 수 있다. 시리즈 다음 편에서는 로컬 LLM을 실제 업무 흐름(메모·문서·자동화)에 엮는 법을 다룰 예정이다.

## 자주 묻는 질문 (FAQ)

**Q1. 아이폰에서 인터넷 없이 ChatGPT 같은 AI를 쓸 수 있나?**
가능하다. PocketPal AI 같은 무료 앱으로 1~4B급 오픈모델을 내려받으면 비행기 모드에서도 대화할 수 있다. 다만 품질은 최신 클라우드 AI가 아니라 소형 모델 수준이다.

**Q2. 어떤 아이폰이 필요한가?**
RAM 8GB 이상(iPhone 15 Pro, 16 시리즈, 17 시리즈)이면 3~4B급 모델을 무난히 돌린다. 6GB 기종(14 Pro 등)은 1~2B급까지, 4GB 이하 구형 기종은 권하지 않는다.

**Q3. 비용은 얼마나 드나?**
0원으로 시작할 수 있다. PocketPal AI·Locally·fullmoon 같은 앱과 Gemma·Llama·Qwen 등 오픈모델이 모두 무료다. Siri 연동 등 특수 기능이 필요할 때만 유료 앱(Private LLM 등)을 고려하면 된다.

**Q4. Apple Intelligence가 있는데 굳이 따로 돌릴 이유가 있나?**
Apple Intelligence의 내장 모델(약 3B)은 앱 기능 속에 녹아 있는 보조 엔진이고, 사용자가 모델을 고르거나 자유 대화 챗봇으로 쓰기는 어렵다. 직접 돌리면 최신 오픈모델 선택권과 설정 자유가 생긴다.

**Q5. 배터리와 발열은 괜찮은가?**
짧은 대화는 문제없지만, 연속 생성 시 배터리가 시간당 20~30% 수준으로 소모되고 10분 이상 연속 사용하면 발열로 속도가 떨어진다는 실측 보고가 있다. 짧고 빈번한 사용에 맞는 도구다.

---

**참고 자료**

- [Best Local LLM Apps for iPhone in 2026 — PromptQuorum (2026-06-19)](https://www.promptquorum.com/power-local-llm/best-local-llm-apps-iphone-2026)
- [Run an LLM on Your Phone (2026) — Local AI Master](https://localaimaster.com/blog/run-llm-on-phone)
- [Updates to Apple's On-Device and Server Foundation Language Models — Apple ML Research](https://machinelearning.apple.com/research/apple-foundation-models-2025-updates)
- [Apple's Foundation Models framework unlocks new intelligent app experiences — Apple Newsroom (2025-09)](https://www.apple.com/newsroom/2025/09/apples-foundation-models-framework-unlocks-new-intelligent-app-experiences/)
- [Locally AI joins LM Studio — LM Studio Blog (2026-04)](https://lmstudio.ai/blog/locally-ai-joins-lm-studio) · [LM Link 발표 (2026-06-04)](https://lmstudio.ai/blog/locally-lm-link)
- [iPhone 17 시리즈 RAM — MacRumors (2025-09)](https://www.macrumors.com/2025/09/09/iphone-17-pro-iphone-air-ram-amounts/)
- [I replaced ChatGPT, Claude, and Gemini on my phone with a local LLM — XDA (2026-05-27)](https://www.xda-developers.com/replaced-chatgpt-claude-gemini-on-phone-with-local-llm/)
- [PocketPal AI — GitHub](https://github.com/a-ghorbani/pocketpal-ai) · [fullmoon](https://fullmoon.app/) · [Enclave AI](https://enclaveai.app/) · [Liquid Apollo](https://www.liquid.ai/blog/liquid-ai-launches-leap-and-apollo-bringing-edge-ai-to-every-developer)

*본 글은 2026년 7월 초 기준 공개 정보를 바탕으로 작성했으며, 앱 가격·기능과 모델 사양은 이후 업데이트로 달라질 수 있다.*

<script type="application/ld+json">
{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "아이폰에서 인터넷 없이 ChatGPT 같은 AI를 쓸 수 있나요?", "acceptedAnswer": {"@type": "Answer", "text": "가능합니다. PocketPal AI 같은 무료 앱으로 1~4B급 오픈모델을 내려받으면 비행기 모드에서도 AI와 대화할 수 있습니다. 다만 품질은 최신 클라우드 AI가 아닌 소형 모델 수준입니다."}}, {"@type": "Question", "name": "로컬 LLM을 돌리려면 어떤 아이폰이 필요한가요?", "acceptedAnswer": {"@type": "Answer", "text": "RAM 8GB 이상인 iPhone 15 Pro, 16 시리즈, 17 시리즈면 3~4B급 모델을 무난히 실행합니다. 6GB 기종은 1~2B급 소형 모델까지 가능하고, 4GB 이하 구형 기종은 권장하지 않습니다."}}, {"@type": "Question", "name": "아이폰 로컬 LLM은 무료인가요?", "acceptedAnswer": {"@type": "Answer", "text": "무료로 시작할 수 있습니다. PocketPal AI, Locally(LM Studio), fullmoon 같은 앱과 Gemma, Llama, Qwen 등 오픈모델이 모두 무료입니다. Siri 연동 같은 특수 기능이 필요할 때만 유료 앱을 고려하면 됩니다."}}, {"@type": "Question", "name": "Apple Intelligence와 직접 오픈모델을 돌리는 것은 무엇이 다른가요?", "acceptedAnswer": {"@type": "Answer", "text": "Apple Intelligence의 내장 모델(약 3B)은 iOS 26의 Foundation Models 프레임워크를 통해 앱 기능 속에서 작동하는 보조 엔진으로, 사용자가 모델을 선택할 수 없습니다. 오픈모델을 직접 돌리면 최신 모델 선택권과 설정의 자유를 얻습니다."}}, {"@type": "Question", "name": "아이폰에서 로컬 LLM을 쓰면 배터리와 발열은 괜찮은가요?", "acceptedAnswer": {"@type": "Answer", "text": "짧은 대화는 문제없지만 연속 생성 시 배터리가 시간당 20~30% 수준으로 소모되고, 10분 이상 연속 사용하면 발열로 속도가 떨어진다는 실측 보고가 있습니다. 짧고 빈번한 사용에 적합합니다."}}]}
</script>
