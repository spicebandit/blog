---
title: "미로피시 설치·시스템 완전정리 — 내 컴에 '가상 사회' 짓기 [2편]"
description: "오픈소스 AI 예측 엔진 미로피시(MiroFish)를 직접 굴려보자. 시스템 구조와 필요 환경(Python·Node·LLM API), 웹UI·API·도커 채널, 소스/도커 설치를 단계별 명령어로 정리한다. 비용 절약 팁까지."
pubDate: 2026-07-16T09:10:00+09:00
category: ai
tags: ["미로피시", "MiroFish", "설치", "멀티에이전트"]
---

> 📚 **연재 — 미로피시(MiroFish) 완전 가이드**
> ① 개념·역사·활용사례 · **② 시스템 개요·설치** · ③ 초보 활용법 · ④ 활용 확대

**미로피시를 내 컴퓨터에서 돌리는 데 필요한 건 딱 세 가지다 — 파이썬·노드가 깔린 맥(또는 도커), OpenAI 형식의 LLM API 키 하나, 그리고 명령어 다섯 줄.** [1편](/blog/2026-07-15-mirofish-ai-prediction-engine-1-concept/)에서 미로피시가 '가상 사회를 지어 미래를 예측하는' 엔진이라는 개념을 잡았다면, 이번 2편은 그 엔진을 실제로 손에 넣어 시동을 거는 단계다. 결론부터 말하면 — 미로피시는 백엔드(파이썬)와 프론트엔드(Vue) 두 덩어리로 이뤄진 웹 앱이고, 소스로 직접 깔거나 도커로 통째로 띄우는 두 갈래 길이 있으며, 어느 쪽이든 진짜 관문은 설치가 아니라 **'어떤 LLM을 뒤에 붙이고 비용을 어떻게 통제하느냐'**다. 이 글에서는 시스템 구조 → 필요 환경 → 활용 채널 → 설치 방법 → LLM·비용 설정 순으로, 처음 접하는 사람도 따라 할 수 있게 정리한다.

![프로그래밍 코드가 떠 있는 개발 화면](https://images.pexels.com/photos/7325498/pexels-photo-7325498.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Al Nahian](https://www.pexels.com/@alnahian2003) on [Pexels](https://www.pexels.com/photo/computer-program-on-computer-screen-7325498/)*

## 시스템 개요 — 미로피시는 무엇으로 이뤄져 있나

미로피시는 하나의 프로그램이 아니라, 역할이 다른 부품들이 맞물린 **파이프라인**이다. 1편에서 본 다섯 단계(지식 그래프 → 페르소나 생성 → 이중 플랫폼 시뮬레이션 → 리포트 → 인터랙션)가 소프트웨어로는 크게 세 층으로 나뉜다.

첫째, **프론트엔드(Frontend)** — 사용자가 브라우저에서 보는 화면이다. Vue와 Node.js로 만들어졌고, 시뮬레이션을 시작하고 에이전트들의 대화를 실시간으로 지켜보는 대시보드 역할을 한다. 기본적으로 `localhost:3000`에 뜬다.

둘째, **백엔드(Backend)** — 실제 두뇌다. 파이썬으로 작성됐고, 씨앗 텍스트에서 지식 그래프를 뽑고(GraphRAG), 에이전트 페르소나를 찍어내고, 두 소셜 플랫폼에서 시뮬레이션을 굴리고, 리포트를 만드는 모든 연산을 담당한다. REST API 형태로 `localhost:5001`에서 프론트엔드와 통신한다.

셋째, **외부 서비스(External Services)** — 미로피시 자체가 지능을 갖는 게 아니라, 뒤에 붙는 두 개의 외부 두뇌를 빌려 쓴다. 하나는 에이전트들이 말하고 생각하게 하는 **LLM API**(오픈AI 형식이면 무엇이든), 다른 하나는 각 에이전트의 '장기 기억'을 저장하는 **메모리 서비스**(권장 구성은 Zep Cloud)다. 이 구조 때문에 미로피시는 가볍게 설치되지만, 실제 연산과 비용은 대부분 이 외부 서비스에서 발생한다.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 12px;margin:1.5rem 0">
<svg viewBox="0 0 720 220" width="100%" height="auto" role="img" aria-label="미로피시 시스템 구조: 프론트엔드(3000)와 백엔드(5001)가 통신하고, 백엔드가 LLM API와 메모리 서비스를 호출한다">
  <rect x="20" y="80" width="150" height="60" rx="8" fill="#fff" stroke="#23201D" stroke-width="1.5"/>
  <text x="95" y="105" text-anchor="middle" font-size="14" font-weight="700" fill="#23201D">프론트엔드</text>
  <text x="95" y="124" text-anchor="middle" font-size="11" fill="#8A8378">Vue · localhost:3000</text>

  <rect x="285" y="80" width="150" height="60" rx="8" fill="#fff" stroke="#C8102E" stroke-width="2"/>
  <text x="360" y="105" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">백엔드(두뇌)</text>
  <text x="360" y="124" text-anchor="middle" font-size="11" fill="#8A8378">Python · localhost:5001</text>

  <rect x="550" y="20" width="150" height="55" rx="8" fill="#FAF6EE" stroke="#8A8378" stroke-width="1.5"/>
  <text x="625" y="43" text-anchor="middle" font-size="13" font-weight="700" fill="#23201D">LLM API</text>
  <text x="625" y="61" text-anchor="middle" font-size="10.5" fill="#8A8378">OpenAI 형식</text>

  <rect x="550" y="145" width="150" height="55" rx="8" fill="#FAF6EE" stroke="#8A8378" stroke-width="1.5"/>
  <text x="625" y="168" text-anchor="middle" font-size="13" font-weight="700" fill="#23201D">메모리 서비스</text>
  <text x="625" y="186" text-anchor="middle" font-size="10.5" fill="#8A8378">Zep Cloud(권장)</text>

  <line x1="170" y1="110" x2="285" y2="110" stroke="#23201D" stroke-width="1.5"/>
  <polygon points="285,110 277,106 277,114" fill="#23201D"/>
  <polygon points="170,110 178,106 178,114" fill="#23201D"/>
  <text x="227" y="102" text-anchor="middle" font-size="10" fill="#8A8378">REST API</text>

  <line x1="435" y1="100" x2="550" y2="55" stroke="#C8102E" stroke-width="1.5" stroke-dasharray="4 3"/>
  <polygon points="550,55 541,55 546,63" fill="#C8102E"/>
  <line x1="435" y1="120" x2="550" y2="165" stroke="#C8102E" stroke-width="1.5" stroke-dasharray="4 3"/>
  <polygon points="550,165 541,165 546,157" fill="#C8102E"/>
</svg>
<figcaption style="font-size:0.85rem;color:#8A8378;text-align:center;margin-top:8px">미로피시 3층 구조 — 화면(프론트)·두뇌(백엔드)·빌려 쓰는 외부 지능(LLM·메모리). 연산과 비용은 대부분 오른쪽 외부 서비스에서 발생한다.</figcaption>
</figure>

이 구조가 중요한 이유는, **설치와 운영의 난이도가 다른 곳에서 온다**는 점을 미리 알려주기 때문이다. 프론트·백엔드를 까는 건 명령어 몇 줄로 끝난다. 하지만 시뮬레이션을 실제로 굴리려면 오른쪽의 LLM·메모리 서비스 키를 발급받아 연결해야 하고, 여기서부터 비용과 설정이 시작된다.

## 필요 환경 — 무엇을 미리 깔아둬야 하나

설치에 들어가기 전, 아래 준비물이 갖춰졌는지 확인하자. 저장소가 명시한 요구 사항은 다음과 같다([MiroFish GitHub](https://github.com/666ghj/MiroFish)).

| 구분 | 요구 사항 | 비고 |
|------|-----------|------|
| 운영체제 | macOS 최적화 | 윈도우 호환은 개발 중, 도커로 우회 가능 |
| Python | 3.11 이상 ~ 3.12 이하 | 3.13은 아직 비권장 |
| Node.js | 18 이상 | 프론트엔드 빌드·구동용 |
| 파이썬 패키지 매니저 | `uv` (최신) | pip 대신 사용, 가상환경 자동 생성 |
| 노드 패키지 매니저 | `npm` | Node 설치 시 함께 딸려 옴 |
| LLM API 키 | OpenAI 형식 호환 1개 | 권장: Alibaba Qwen(qwen-plus) |
| 메모리 서비스 키 | Zep Cloud | 무료 월 quota 제공 |

*출처: MiroFish 저장소 README([GitHub](https://github.com/666ghj/MiroFish)), 2026년 7월 기준.*

여기서 초보자가 가장 자주 막히는 지점은 세 가지다. **첫째, 파이썬 버전.** 3.13을 쓰고 있다면 3.11이나 3.12 가상환경을 따로 만들어야 한다. **둘째, `uv`.** 미로피시는 전통적인 pip 대신 최신 패키지 매니저 `uv`를 쓴다. 없다면 `curl -LsSf https://astral.sh/uv/install.sh | sh` 한 줄로 설치할 수 있다. **셋째, API 키 두 개.** 미로피시는 껍데기일 뿐 실제 지능은 외부에서 빌려 오므로, LLM 키(Qwen 등)와 메모리 키(Zep)가 없으면 설치는 돼도 시뮬레이션이 돌지 않는다.

윈도우 사용자라면 어떨까. 현재 미로피시는 macOS에 최적화돼 있고 윈도우 네이티브 구동은 완성되지 않았다. 이 경우 아래 **도커(Docker)** 설치법을 쓰는 것이 가장 확실하다 — 운영체제와 무관하게 컨테이너 안에서 리눅스 환경으로 돌기 때문이다.

## 활용할 수 있는 채널 — 어디로 미로피시를 만나나

설치한 미로피시는 하나의 창구로만 쓰는 게 아니다. 목적에 따라 네 갈래로 접근할 수 있다.

- **웹 UI(`localhost:3000`)** — 가장 기본이자 초보자용 창구. 브라우저에서 시뮬레이션을 설정하고, 에이전트들이 두 플랫폼(트위터형·레딧형)에서 주고받는 대화를 실시간으로 지켜본다. 대부분의 사용자는 여기서 시작한다.
- **백엔드 REST API(`localhost:5001`)** — 프로그램이 미로피시를 부르는 창구. 다른 서비스·스크립트에서 시뮬레이션을 자동으로 걸거나, 결과를 받아 후처리하고 싶을 때 쓴다. 3편·4편에서 다룰 '자동화·확장'의 토대다.
- **도커 컨테이너** — 설치 방식이자 동시에 배포 채널이다. `docker compose`로 프론트·백엔드를 한 번에 띄우므로, 서버나 남의 컴퓨터에 미로피시를 통째로 옮겨 심을 때 유용하다.
- **에이전트 다이렉트 챗** — 시뮬레이션 안의 특정 가상 인물에게 직접 말을 거는 창구. "당신은 왜 그렇게 생각하나요?"를 개별 에이전트에게 물어, 집단 결과 뒤의 개별 논리를 파고들 수 있다. 미로피시가 '숫자'가 아니라 '서사'를 준다는 특징이 가장 잘 드러나는 채널이다.

정리하면, **처음엔 웹 UI로 감을 잡고, 익숙해지면 API로 자동화하고, 배포는 도커로** 하는 흐름이 자연스럽다. 이번 편은 그 출발점인 설치와 웹 UI 구동까지를 목표로 한다.

## 설치 방법 ① — 소스 코드로 직접 깔기

가장 표준적인 방법이다. 자기 맥에 파이썬·Node·uv가 준비됐다면 아래 순서를 그대로 따르면 된다. (명령어는 저장소 README 기준이며, 버전 업데이트로 세부가 바뀔 수 있으니 실제 설치 시 [공식 저장소](https://github.com/666ghj/MiroFish)를 함께 확인하자.)

**1단계 — 내려받기.** 저장소를 클론하고 폴더로 들어간다.

```bash
git clone https://github.com/666ghj/MiroFish.git
cd MiroFish
```

**2단계 — 환경 설정 파일 만들기.** 예시 파일을 복사해 내 설정 파일(`.env`)을 만든다.

```bash
cp .env.example .env
```

그런 다음 `.env`를 열어 발급받은 키를 채운다. 핵심 항목은 네 개다.

```bash
LLM_API_KEY=발급받은_LLM_키
LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
LLM_MODEL_NAME=qwen-plus
ZEP_API_KEY=발급받은_Zep_키
```

`LLM_BASE_URL`과 `LLM_MODEL_NAME`은 어떤 LLM을 쓰느냐에 따라 달라진다. 위 예시는 권장 구성인 Alibaba Qwen(bailian 플랫폼)이고, 오픈AI나 다른 호환 API를 쓴다면 그에 맞는 주소·모델명으로 바꾸면 된다.

**3단계 — 의존성 설치.** 프론트·백엔드에 필요한 패키지를 한 번에 설치한다.

```bash
npm run setup:all
```

이 한 줄이 노드 의존성과 파이썬 의존성을 모두 잡아준다(파이썬 가상환경은 `uv`가 자동 생성). 나눠서 하고 싶다면 `npm run setup`(노드)과 `npm run setup:backend`(파이썬)를 따로 실행할 수도 있다.

**4단계 — 실행.** 프로젝트 루트에서 프론트·백엔드를 함께 띄운다.

```bash
npm run dev
```

정상적으로 뜨면 프론트엔드는 `http://localhost:3000`, 백엔드 API는 `http://localhost:5001`에서 응답한다. 브라우저로 `localhost:3000`에 접속하면 미로피시 대시보드가 보인다. 백엔드·프론트엔드를 따로 돌리고 싶으면 각각 `npm run backend`, `npm run frontend`를 쓴다.

## 설치 방법 ② — 도커로 통째로 띄우기

윈도우 사용자거나, 내 시스템에 파이썬·Node 버전을 건드리기 싫다면 도커가 답이다. 도커 데스크톱(또는 도커 엔진)만 깔려 있으면 두 줄로 끝난다.

```bash
cp .env.example .env      # 위와 동일하게 키를 채운다
docker compose up -d
```

`docker compose`가 프론트엔드·백엔드 컨테이너를 함께 빌드해 백그라운드로 띄우고, 포트도 소스 방식과 똑같이 프론트 3000·백엔드 5001로 연결해 준다. 즉 접속 주소는 동일하다. 도커 방식의 장점은 **재현성** — 내 맥에서든 팀 서버에서든 같은 환경이 보장되므로, 4편에서 다룰 '여러 시뮬레이션 대규모 운영'에도 유리하다.

두 방식을 비교하면 이렇다.

| 구분 | 소스 설치 | 도커 설치 |
|------|-----------|-----------|
| 준비물 | Python 3.11–3.12, Node 18+, uv | 도커만 |
| 명령어 수 | 4단계 | 2줄 |
| OS | macOS 권장 | OS 무관(윈도우 OK) |
| 수정·디버깅 | 코드 직접 수정 쉬움 | 컨테이너 안이라 다소 번거로움 |
| 추천 대상 | 코드를 뜯어볼 개발자 | 빠르게 돌려만 볼 사람·윈도우 |

*출처: MiroFish 저장소 배포 문서([GitHub](https://github.com/666ghj/MiroFish)).*

## LLM 백엔드와 비용 — 진짜 관문은 여기

설치가 끝나도 시뮬레이션을 굴리려면 뒤에 붙일 LLM이 필요하다. 미로피시는 "오픈AI SDK 형식을 따르는 어떤 LLM API든" 붙일 수 있게 설계됐다. 즉 특정 회사에 묶이지 않는다. 저장소가 권장하는 기본 구성은 비용 대비 성능이 좋은 **Alibaba Qwen(qwen-plus)**이고, 기억 저장에는 무료 월 quota를 주는 **Zep Cloud**를 쓴다. 물론 오픈AI, 그 밖의 호환 API로 바꿔도 된다 — `.env`의 `LLM_BASE_URL`·`LLM_MODEL_NAME`만 갈아 끼우면 된다.

여기서 반드시 짚어야 할 게 **비용**이다. 미로피시의 시뮬레이션은 수백~수천 명의 에이전트가 수십 라운드에 걸쳐 서로 글을 쓰고 반응하는 구조라, 라운드가 늘수록 LLM 호출이 기하급수로 불어난다. 1편에서 봤듯 800~1,200명 규모를 30~50라운드 돌리면 상당한 API 비용이 든다. 그래서 저장소 자체가 **"처음엔 40라운드 미만의 작은 시뮬레이션부터 시도하라"**고 권한다. 초보자라면 에이전트 수와 라운드를 최소로 잡고 파이프라인이 끝까지 도는지부터 확인한 뒤, 조금씩 키우는 것이 비용을 태우지 않는 정석이다.

정리하면 초기 세팅의 체크리스트는 이렇다. ① LLM 키·Zep 키를 `.env`에 정확히 넣었는가 ② 파이썬 3.11–3.12·Node 18+·uv가 맞는가 ③ `localhost:3000`이 열리는가 ④ 첫 시뮬레이션은 소규모(에이전트·라운드 최소)로 잡았는가. 이 네 가지만 통과하면 미로피시는 돌기 시작한다.

## So What — 설치는 5분, 통제는 계속

미로피시 설치가 주는 진짜 교훈은 '얼마나 쉬운가'가 아니라 '어디에 무게가 실려 있는가'다. 프론트·백엔드를 깔고 웹 UI를 띄우는 건 명령어 다섯 줄, 몇 분이면 끝난다. 1편에서 본 '학부생 10일'이 상징하듯, **만들고 설치하는 장벽은 이미 무너졌다.** 남은 병목은 코드가 아니라 운영 — 어떤 LLM을 붙여 비용을 통제하고, 어떤 씨앗을 넣어 무엇을 물을 것인가다. 도구를 손에 넣는 일은 시작일 뿐, 그 도구로 의미 있는 질문을 던지는 건 전적으로 사용자의 몫이라는 뜻이다.

다음 [3편]에서는 이렇게 설치한 미로피시로 **첫 시뮬레이션을 돌리는 초보 실전 활용법**을 다룬다. 어떤 씨앗을 어떻게 넣고, 에이전트 수와 라운드를 어떻게 잡으며, 결과 리포트를 어떻게 읽는지 — 개념과 설치를 지났으니, 이제 진짜로 가상 사회를 굴려볼 차례다.

## 자주 묻는 질문 (미로피시 설치)

**Q1. 미로피시를 쓰려면 뭘 미리 깔아야 하나요?**
macOS 기준 Python 3.11~3.12, Node.js 18 이상, 파이썬 패키지 매니저 `uv`가 필요합니다. 그리고 에이전트를 구동할 LLM API 키(오픈AI 형식, 권장은 Qwen)와 기억 저장용 Zep Cloud 키가 있어야 시뮬레이션이 돌아갑니다.

**Q2. 윈도우에서도 되나요?**
현재 미로피시는 macOS에 최적화돼 있고 윈도우 네이티브 구동은 개발 중입니다. 윈도우 사용자는 도커(`docker compose up -d`)로 설치하면 운영체제와 무관하게 컨테이너 안에서 구동할 수 있습니다.

**Q3. 설치 명령어는 어떻게 되나요?**
소스 설치는 `git clone` → `cp .env.example .env`(키 입력) → `npm run setup:all` → `npm run dev` 순서입니다. 실행하면 웹 UI가 `localhost:3000`, 백엔드 API가 `localhost:5001`에 뜹니다. 도커는 `.env`를 채운 뒤 `docker compose up -d` 한 줄이면 됩니다.

**Q4. 비용은 얼마나 드나요?**
미로피시 자체는 오픈소스로 무료지만, 뒤에 붙는 LLM API 호출에 비용이 듭니다. 수백~수천 에이전트를 수십 라운드 돌리면 호출이 급증하므로, 저장소는 처음엔 40라운드 미만의 소규모 시뮬레이션부터 시작하길 권장합니다.

---

*이 글은 2026년 7월 공개된 정보와 공식 저장소 문서를 바탕으로 한 일반적 설치 해설이며, 명령어·요구 사항은 버전 업데이트로 바뀔 수 있으므로 실제 설치 시 공식 저장소를 함께 확인하기를 권한다.*

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "미로피시를 쓰려면 무엇을 미리 깔아야 하나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "macOS 기준 Python 3.11~3.12, Node.js 18 이상, 파이썬 패키지 매니저 uv가 필요하다. 그리고 에이전트를 구동할 LLM API 키(오픈AI 형식, 권장은 Qwen)와 기억 저장용 Zep Cloud 키가 있어야 시뮬레이션이 돌아간다."
      }
    },
    {
      "@type": "Question",
      "name": "미로피시는 윈도우에서도 되나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "현재 미로피시는 macOS에 최적화돼 있고 윈도우 네이티브 구동은 개발 중이다. 윈도우 사용자는 도커(docker compose up -d)로 설치하면 운영체제와 무관하게 컨테이너 안에서 구동할 수 있다."
      }
    },
    {
      "@type": "Question",
      "name": "미로피시 설치 명령어는 어떻게 되나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "소스 설치는 git clone 후 cp .env.example .env로 키를 입력하고, npm run setup:all로 의존성을 설치한 뒤 npm run dev로 실행한다. 웹 UI는 localhost:3000, 백엔드 API는 localhost:5001에 뜬다. 도커는 .env를 채운 뒤 docker compose up -d 한 줄이면 된다."
      }
    },
    {
      "@type": "Question",
      "name": "미로피시 사용 비용은 얼마나 드나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "미로피시 자체는 오픈소스로 무료지만 뒤에 붙는 LLM API 호출에 비용이 든다. 수백~수천 에이전트를 수십 라운드 돌리면 호출이 급증하므로, 저장소는 처음엔 40라운드 미만의 소규모 시뮬레이션부터 시작하길 권장한다."
      }
    }
  ]
}
</script>
