---
title: "LM Studio로 Qwen 로컬 LLM API·AI 에이전트 연동하기"
description: "맥북에어 M5에 LM Studio로 Qwen3.5 9B를 띄우면 OpenAI 호환 API가 생긴다. base_url 한 줄만 바꿔 에이전트 프레임워크를 붙이는 법과 로컬 LLM의 진짜 한계까지 실전 정리."
pubDate: 2026-07-09T13:45:00+09:00
category: ai
tags: ["LM Studio", "Qwen", "로컬LLM", "AI에이전트"]
---

결론부터 말한다. **16GB 통합메모리를 얹은 맥북에어 M5라면, LM Studio로 Qwen3.5 9B 모델을 내려받아 클릭 한 번으로 `http://localhost:1234/v1`에 OpenAI 호환 API 서버를 띄울 수 있다.** 여기서 핵심은 '호환'이라는 두 글자다. OpenAI SDK로 짜인 거의 모든 에이전트 프레임워크는 `base_url`을 이 주소로 바꾸는 것만으로 로컬 모델에 그대로 붙는다. 월 구독료 0원, 토큰 과금 0원, 데이터는 노트북 밖으로 나가지 않는다. 다만 공짜에는 대가가 있다 — 속도와 도구 호출(tool calling)의 안정성이다. 이 글은 다운로드부터 에이전트 연결, 그리고 '무엇이 되고 무엇이 안 되는가'까지를 실전 기준으로 정리한다.

먼저 모델 선택부터 짚자. 2026년 3월 2일 공개된 **Qwen3.5 '스몰' 라인업**은 dense(단일 밀집형) 기준 **0.8B·2B·4B·9B·27B** 다섯 종으로, 모두 Apache 2.0 라이선스에 262K 토큰의 긴 컨텍스트를 지원한다. 이 중 맥북에어 M5의 메모리 사정에 가장 잘 맞는 '스위트 스폿'이 바로 **9B**다. 4비트로 양자화하면 약 5.5GB 안팎이라 16GB 통합메모리에 여유 있게 올라가고, 100개 넘는 언어(한국어 포함)와 도구 호출·추론에 두루 쓸 만한 균형을 갖췄다. 더 큰 27B는 32GB 구성에서, 더 가벼운 4B는 발열·배터리를 아끼고 싶을 때 대안이 된다. 이 글이 '9B'를 기준으로 삼는 이유가 여기 있다.

![macbook pro on brown wooden table](https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwbGFwdG9wJTIwZGV2ZWxvcGVyJTIwY29kaW5nfGVufDF8MHx8fDE3ODM1NzE0MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Joshua Reddekopp](https://unsplash.com/@joshuaryanphoto?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/macbook-pro-on-brown-wooden-table-SyYmXSDnJ54?utm_source=spice-bandit-blog&utm_medium=referral)*

## 왜 지금 로컬 LLM인가 — 맥북에어 M5가 바꾼 계산

불과 3~4년 전만 해도 "노트북에서 대형언어모델을 돌린다"는 말은 농담에 가까웠다. GPT-3급 모델은 데이터센터의 A100 여러 장을 요구했고, 개인이 만질 수 있는 물건이 아니었다. 판을 바꾼 건 두 가지 흐름의 교차다. 하나는 **양자화(quantization)** 기술의 성숙 — 32비트 부동소수점 가중치를 4비트로 압축해도 성능이 크게 무너지지 않는다는 게 2023년 이후 GGUF·GPTQ·AWQ 같은 포맷으로 실증됐다. 이 흐름의 방아쇠는 2023년 3월 게오르기 게르가노프(Georgi Gerganov)가 공개한 **llama.cpp**였다. 메타의 라마(LLaMA) 가중치를 C/C++로 CPU에서도 돌아가게 만든 이 오픈소스 프로젝트가, 뒤이어 자체 양자화 포맷 GGUF를 낳으며 "개인 컴퓨터에서 LLM을 돌린다"는 발상을 현실로 끌어내렸다. 오늘날 LM Studio가 GUI로 감싸 편하게 쓰게 해주는 엔진의 뿌리도 여기에 있다.

다른 하나는 애플 실리콘의 **통합메모리(unified memory)** 구조다. CPU와 GPU가 같은 메모리 풀을 공유하기 때문에, 그래픽카드 VRAM 8GB에 갇힌 PC와 달리 시스템 메모리 전체를 모델 적재에 쓸 수 있다. 2026년 3월 애플이 내놓은 M5 맥북에어는 이 흐름의 현재 도달점이다. 애플 발표에 따르면 M5는 10코어 CPU에 GPU는 구성에 따라 8~10코어, **153GB/s 메모리 대역폭**(M4 대비 28% 향상)을 갖췄고, 기본 16GB에서 24GB·32GB로 구성할 수 있다. 여기에 GPU 코어마다 얹힌 '뉴럴 가속기(Neural Accelerator)'가 행렬 연산을 거들면서, 9B급 모델의 실사용 토큰 생성 속도가 초당 수십 토큰 수준까지 올라온다. 즉, 몇 년 전 서버가 하던 일을 이제 카페에서 커피 한 잔 값의 전기로 돌리는 셈이다.

이게 왜 중요한가. 클라우드 API는 편하지만 세 가지 비용을 청구한다 — **돈**(토큰당 과금), **지연**(네트워크 왕복), 그리고 **프라이버시**(입력이 외부 서버를 거친다). 로컬 LLM은 이 셋을 한꺼번에 제거한다. 특히 사내 문서·개인 메모·미공개 코드처럼 밖으로 내보내기 꺼려지는 데이터를 다루는 개인 개발자·1인 기업에게, "내 노트북 안에서 끝나는 AI"는 성능이 조금 부족해도 충분히 매력적인 트레이드오프다.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px;margin:24px 0">
<svg viewBox="0 0 640 300" width="100%" height="auto" role="img" aria-label="Qwen3.5 dense 모델 크기별 4비트 양자화 메모리 사용량과 맥북에어 M5 구성별 권장 모델">
<text x="20" y="28" font-family="sans-serif" font-size="16" font-weight="700" fill="#23201D">Qwen3.5 크기별 메모리(4비트 양자화, 근사치) — 낮을수록 가벼움</text>
<text x="20" y="48" font-family="sans-serif" font-size="12" fill="#8A8378">회색 점선 = 16GB 맥북에어 실질 상한(모델+컨텍스트 여유 감안)</text>
<line x1="150" y1="80" x2="150" y2="250" stroke="#E5DECF" stroke-width="1"/>
<!-- scale 1GB = 22px, start x=150 -->
<!-- 0.8B ~0.7GB -->
<rect x="150" y="90" width="16" height="24" fill="#8A8378"/>
<text x="110" y="107" font-family="sans-serif" font-size="13" fill="#23201D" text-anchor="end">0.8B</text>
<text x="174" y="107" font-family="sans-serif" font-size="12" fill="#23201D">~0.7GB</text>
<!-- 4B ~2.5GB -->
<rect x="150" y="128" width="55" height="24" fill="#8A8378"/>
<text x="110" y="145" font-family="sans-serif" font-size="13" fill="#23201D" text-anchor="end">4B</text>
<text x="213" y="145" font-family="sans-serif" font-size="12" fill="#23201D">~2.5GB</text>
<!-- 9B ~5.5GB -->
<rect x="150" y="166" width="121" height="24" fill="#C8102E"/>
<text x="110" y="183" font-family="sans-serif" font-size="13" font-weight="700" fill="#23201D" text-anchor="end">9B</text>
<text x="279" y="183" font-family="sans-serif" font-size="12" fill="#23201D">~5.5GB · 16GB 쾌적</text>
<!-- 27B ~16.5GB -->
<rect x="150" y="204" width="363" height="24" fill="#23201D"/>
<text x="110" y="221" font-family="sans-serif" font-size="13" fill="#23201D" text-anchor="end">27B</text>
<text x="521" y="221" font-family="sans-serif" font-size="12" fill="#23201D">~16.5GB · 32GB 필요</text>
<!-- 16GB usable limit ~11GB => 150+11*22=392 -->
<line x1="392" y1="80" x2="392" y2="250" stroke="#8A8378" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="392" y="270" font-family="sans-serif" font-size="11" fill="#8A8378" text-anchor="middle">16GB 실사용 상한</text>
</svg>
<figcaption style="font-family:sans-serif;font-size:12px;color:#8A8378;margin-top:8px">양자화 용량은 빌드·컨텍스트 길이에 따라 달라지는 근사치다. OS·앱이 쓰는 메모리를 남겨야 하므로 '전체 메모리 = 모델 예산'이 아니다.</figcaption>
</figure>

## LM Studio로 Qwen 모델 띄우기 — 다운로드부터 서버까지

여기서 잠깐, Qwen이 왜 로컬 LLM의 사실상 기본 선택지가 됐는지 짚어두면 이해가 빠르다. 2023년 메타가 라마(Llama)를 사실상 오픈웨이트로 풀며 "가중치를 내려받아 내 기계에서 돌리는" 생태계의 문을 열었고, 이후 미스트랄(Mistral)·알리바바 Qwen·딥시크(DeepSeek) 같은 후발 주자가 잇따라 개방형 모델을 내놓으며 성능 격차를 빠르게 좁혔다. 특히 Qwen은 다국어(한국어 포함)와 작은 크기(dense)까지 촘촘히 라인업을 갖춰, 메모리가 제한된 노트북 환경에서 즐겨 쓰인다.

LM Studio는 로컬 LLM을 '앱 설치하듯' 다루게 해주는 데스크톱 도구다. 터미널 명령어를 몰라도 되는 GUI가 핵심 가치다. 순서는 이렇다.

**1) 설치와 모델 다운로드.** [lmstudio.ai](https://lmstudio.ai)에서 앱을 받아 실행한 뒤, 상단 검색창에 `qwen3.5-9b`를 입력한다. 검색 결과에서 양자화 버전을 고르는데, 초보자는 **Q4_K_M**(4비트, 품질·용량 균형)로 시작하는 게 무난하다. 맥에서는 가능하면 **MLX** 빌드를 고르자. MLX는 애플이 만든 실리콘 전용 머신러닝 프레임워크로, 같은 모델이라도 범용 GGUF보다 M1~M5 칩에서 토큰 생성이 눈에 띄게 빠르다.

**2) 채팅으로 먼저 검증.** 다운로드가 끝나면 좌측 채팅 탭에서 모델을 로드해 몇 마디 나눠 본다. 여기서 응답 속도(초당 토큰)와 한국어 품질이 쓸 만한지 감을 잡는다. Qwen3.5 9B는 '사고 모드(thinking)'와 '비사고 모드'를 전환할 수 있어 복잡한 추론과 빠른 응답을 상황에 맞게 쓸 수 있고, 262K 토큰의 긴 컨텍스트 덕에 문서 몇 개를 통째로 넣고 다루기에도 여유가 있다.

**3) API 서버 켜기.** 좌측 **Developer(개발자)** 탭으로 이동해 상단 토글을 **Running**으로 바꾸면 끝이다. 이 순간 `http://localhost:1234`에 OpenAI 호환 HTTP 서버가 뜬다. GUI가 부담스럽다면 터미널에서 `lms server start` 명령으로도 헤드리스 구동이 된다. 서버가 켜졌는지는 아래 한 줄로 확인한다.

```bash
curl http://localhost:1234/v1/models
```

로드된 모델 목록이 JSON으로 돌아오면 성공이다. 이때 응답에 찍힌 정확한 모델 ID 문자열을 그대로 코드의 `model` 값에 써야 한다(불일치 시 오류가 난다).

| 구성 | 통합메모리 | 권장 Qwen3.5 크기 | 체감 |
|------|-----------|------------------|------|
| M5 기본 | 16GB | **9B** (MLX Q4) | 채팅·코딩 보조 쾌적 |
| M5 중간 | 24GB | 9B(여유) | 컨텍스트 길게, 멀티태스킹 여유 |
| M5 최대 | 32GB | 27B(빠듯) / 9B(넉넉) | 무거운 작업 가능, 발열·속도 주의 |

*출처: [Apple Newsroom, "MacBook Air with M5" (2026-03)](https://www.apple.com/newsroom/2026/03/apple-introduces-the-new-macbook-air-with-m5/), [Qwen3.5 Small Models — Artificial Analysis](https://artificialanalysis.ai/articles/qwen3-5-small-models) — 크기별 메모리는 빌드에 따른 근사치*

![Detailed view of a server rack with a focus on technology and data storage.](https://images.pexels.com/photos/17489157/pexels-photo-17489157.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [panumas nikhomkhai](https://www.pexels.com/@cookiecutter) on [Pexels](https://www.pexels.com/photo/close-up-of-computer-hardware-17489157/)*

## OpenAI 호환 API 3분 요약 — 엔드포인트·curl·파이썬

LM Studio 서버의 진짜 힘은 **OpenAI가 정한 API 규격을 그대로 흉내 낸다**는 점이다. 요청·응답의 JSON 모양이 OpenAI와 같기 때문에, OpenAI를 쓰던 코드에서 주소만 바꾸면 된다.

여기엔 짚어둘 역사가 있다. 2020~2022년 GPT-3 API가 앞서 나가면서 수많은 라이브러리·튜토리얼·에이전트 프레임워크가 OpenAI의 요청·응답 규격에 맞춰 만들어졌고, 그 결과 이 규격이 **사실상의 업계 표준(de facto standard)**으로 굳었다. 나중에 등장한 로컬 런타임들(LM Studio·Ollama·vLLM 등)이 저마다 새 규격을 강요하는 대신 "OpenAI 호환"을 표방한 건, 이미 쌓인 생태계에 무임승차하는 가장 빠른 길이었기 때문이다. base_url 한 줄로 클라우드와 로컬이 바꿔 끼워지는 오늘의 편의는, 이 표준화의 역사가 남긴 배당금인 셈이다. 공식 문서 기준 지원 엔드포인트는 다음과 같다.

| 엔드포인트 | 메서드 | 용도 |
|-----------|--------|------|
| `/v1/models` | GET | 로드된 모델 목록 |
| `/v1/chat/completions` | POST | 채팅(주력) |
| `/v1/responses` | POST | 도구 호출·에이전트용 신규 규격 |
| `/v1/embeddings` | POST | 임베딩(검색·RAG용) |
| `/v1/completions` | POST | 레거시 텍스트 완성 |

*출처: [LM Studio Developer Docs — OpenAI Compatibility](https://lmstudio.ai/docs/developer/openai-compat)*

가장 많이 쓰는 채팅 호출을 파이썬 `openai` SDK로 보면 이렇게 짧다. 로컬이라 API 키는 아무 값이나 넣어도 통과하는데, 관례적으로 `lm-studio`나 `not-needed`를 쓴다.

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:1234/v1",   # ← 이 한 줄이 전부
    api_key="lm-studio",                    # 로컬은 아무 값이나 OK
)

resp = client.chat.completions.create(
    model="qwen3.5-9b",   # /v1/models가 돌려준 정확한 ID를 넣을 것
    messages=[{"role": "user", "content": "로컬 LLM의 장점 3가지를 알려줘"}],
    temperature=0.7,
)
print(resp.choices[0].message.content)
```

`base_url` 딱 한 줄만 클라우드 주소에서 `localhost`로 바꿨다. 나머지는 OpenAI를 쓸 때와 토씨 하나 다르지 않다. 바로 이 '한 줄 교체'가 다음 절의 에이전트 연동을 가능하게 하는 열쇠다.

## API를 AI 에이전트에 연결하기 — base_url 한 줄의 마법

에이전트란 결국 'LLM이 스스로 도구(tool)를 골라 호출하며 여러 단계를 밟아 일을 끝내는 구조'다. 이걸 밑바닥부터 짤 필요는 없다. 시중의 에이전트 프레임워크 대부분이 OpenAI SDK 위에 얹혀 있어서, **OpenAI 클라이언트가 바라보는 주소만 로컬로 돌리면** 그대로 로컬 모델로 동작한다. 원리는 앞 절과 똑같다.

| 프레임워크 | 연결 방식 | 메모 |
|-----------|----------|------|
| **LangChain** | `ChatOpenAI(base_url="http://localhost:1234/v1")` | 체인·RAG에 즉시 로컬화 |
| **OpenAI Agents SDK** | 클라이언트 `base_url`을 로컬로 지정 | 공식 에이전트 루프를 로컬로 |
| **LlamaIndex / smolagents / AutoGen** | OpenAI 클라이언트의 base URL만 변경 | "OpenAI 주소 받는 것은 다 됨" |
| **n8n 등 노코드** | OpenAI 노드의 Custom Base URL에 로컬 주소 | 워크플로 자동화에 결합 |

*출처: [LM Studio Developer Docs](https://lmstudio.ai/docs/developer), [LM Studio — Tool Use](https://lmstudio.ai/docs/developer/openai-compat/tools)*

여기서 한 걸음 더 들어가면 **도구 호출(tool/function calling)**이다. LM Studio는 `/v1/chat/completions`와 `/v1/responses`에서 OpenAI식 함수 호출 포맷을 지원한다. 즉 모델에게 "이런 함수들이 있으니 필요하면 호출해"라고 알려주면, 모델이 `날씨_조회(서울)` 같은 호출을 JSON으로 되돌려 준다. 파이썬 SDK를 쓰면 `model.act(...)`라는 고수준 호출로 **여러 라운드의 도구 호출을 자동으로 돌려** 모델을 로컬 기계 위에서 파일을 만들고 프로그램을 실행하는 '자율 에이전트'로 만들 수도 있다. 개념적으로는 클라우드 API로 에이전트를 짜는 것과 완전히 같고, 다른 건 청구서가 오지 않는다는 점뿐이다.

정리하면 스택은 이렇게 쌓인다. **모델(Qwen3.5 9B) → 런타임(LM Studio, OpenAI 호환 서버) → 에이전트 프레임워크(LangChain 등) → 도구(파일·웹·DB).** 각 층이 표준 규격으로 맞물려 있어, 나중에 모델을 27B로 키우거나 프레임워크를 바꿔도 나머지 층을 다시 짤 필요가 없다. 이 '레고 블록' 같은 교체 가능성이 로컬 스택의 진짜 자산이다.

## 로컬 에이전트의 한계 — 무엇이 되고 무엇이 안 되나

여기까지만 읽으면 장밋빛이지만, 정직하게 한계도 짚어야 한다. 결론은 **"채팅·요약·코드 보조는 훌륭하고, 복잡한 다단계 자율 에이전트는 아직 조심스럽다"**이다.

**첫째, 도구 호출의 안정성.** 2026년 한 독립 평가는 로컬 LLM 13종을 40개 테스트 케이스로 도구 호출 능력을 측정했는데, 흥미롭게도 **덩치가 클수록 도구 호출을 더 잘하는 건 아니었다.** 상대적으로 작은 모델이 더 큰 모델들을 제친 사례가 나왔다. 뒤집어 말하면, 9B 모델이라고 무조건 안심할 수 없고 모델·빌드에 따라 함수 인자를 틀리게 채우거나 호출을 건너뛰는 실패가 생긴다는 뜻이다. 자율 에이전트가 10단계를 완주하려면 각 단계 도구 호출이 거의 완벽해야 하는데, 로컬 소형 모델에선 이 신뢰도가 클라우드 프런티어 모델에 아직 못 미친다.

**둘째, 속도와 컨텍스트.** 노트북 한 대의 연산량은 데이터센터와 비교할 수 없다. 9B 모델은 짧은 대화에선 쾌적하지만, 262K 컨텍스트를 실제로 가득 채워 여러 번 왕복하는 에이전트 작업에선 응답이 느려지고 발열·배터리 소모가 커진다. 컨텍스트 창을 길게 잡을수록 메모리도 더 먹는다.

**셋째, 최상단 품질.** 미묘한 추론, 최신 지식, 복잡한 코드 생성에서 로컬 9~27B 모델은 여전히 클라우드 대형 모델에 뒤진다. 그래서 현실적인 답은 '전부 로컬'이 아니라 **하이브리드**다. 프라이버시가 중요하거나 반복적인 작업은 로컬 Qwen에 맡기고, 어렵고 드문 작업만 클라우드로 넘기는 라우팅이 비용·품질 균형점이다.

| 잘 되는 것 | 아직 조심할 것 |
|-----------|--------------|
| 오프라인 채팅·번역·요약 | 10단계+ 완전 자율 에이전트 |
| 코드 자동완성·리팩터링 보조 | 정밀한 다중 도구 오케스트레이션 |
| 사내/개인 문서 RAG(로컬 검색) | 초장문 컨텍스트 반복 처리 |
| 반복 작업 자동화(비용 0) | 최상급 추론·최신 지식 |

*출처: [jdhodges, "I Tested 13 Local LLMs on Tool Calling" (2026)](https://www.jdhodges.com/blog/local-llms-on-tool-calling-2026-pt1-local-lm/)*

## So What — 누구에게, 왜 이득인가

맥북에어 M5 + LM Studio + Qwen3.5 9B라는 조합의 의미는 "GPT를 공짜로 대체한다"가 아니다. 그건 과장이다. 진짜 의미는 **AI 실험의 한계비용이 0에 수렴한다**는 데 있다. 클라우드 API로 에이전트를 이것저것 굴려보면 토큰 과금이 쌓여 실험을 주저하게 된다. 반면 로컬 스택에선 프롬프트를 1만 번 돌려도 추가 청구가 없다. 개인 개발자·1인 기업·학생에게 이건 '마음껏 틀려볼 자유'다.

PC의 역사가 이를 예고했다. 1970~80년대에도 연산은 소수가 소유한 메인프레임 안에 갇혀 있었지만, 마이크로프로세서가 그 능력을 책상 위로 끌어내리며 개인의 도구가 됐다. 지금 데이터센터에 갇혀 있던 AI가 노트북으로 내려오는 장면은, 그 다운사이징의 두 번째 막처럼 보인다. 그리고 그때처럼, 판을 여는 힘은 값싼 하드웨어와 **개방된 표준**이다.

그래서 이렇게 시작하길 권한다. ① LM Studio로 Qwen3.5 9B(MLX)를 받아 채팅으로 품질을 검증하고, ② Developer 탭에서 API 서버를 켠 뒤 `base_url`만 바꿔 파이썬 몇 줄로 호출해 보고, ③ 익숙해지면 LangChain이나 OpenAI Agents SDK로 간단한 도구 호출 에이전트를 붙여 본다. ④ 그리고 처음부터 하이브리드를 전제로 설계하라 — 로컬을 기본값으로, 어려운 일만 클라우드로. 노트북 안에서 끝나는 AI는 이제 취미가 아니라 실전 도구다. 그 문을 여는 열쇠가 `base_url` 한 줄이라는 사실이, 이 흐름에서 가장 근사한 대목이다.

> 이 글은 일반적인 도구 사용법과 기술 동향을 정리한 것으로, 특정 제품 구매나 투자에 대한 조언이 아니다. 모델·앱의 사양과 성능은 버전에 따라 달라질 수 있으니 공식 문서로 최신 정보를 확인하기 바란다.
