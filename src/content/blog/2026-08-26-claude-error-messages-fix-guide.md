---
title: "클로드 오류 메시지별 해결법 — 증상 보고 바로 찾기"
description: "'이 응답을 불러오지 못했습니다', 5시간 한도, 429·529 오류까지. 클로드에서 뜨는 오류를 메시지 그대로 찾아 원인과 해결법을 바로 확인하세요. 공식 문서 기준 2026년 8월 최신."
pubDate: 2026-08-26T12:03:26+09:00
category: ai
tags: ["클로드", "Claude", "오류해결", "클로드코드"]
---

클로드를 쓰다 보면 답변 대신 빨간 글씨가 뜬다. 이 글은 **뜬 메시지를 그대로 찾아 해법을 바로 보는 표**다. 아래 목차에서 자기 화면에 뜬 문장을 고르면 된다.

**가장 흔한 셋만 먼저 답한다.**

| 화면에 뜬 것 | 한 줄 해법 |
|---|---|
| "이 응답을 불러오지 못했습니다" (영문 "This response didn't load") | **상태페이지부터 확인한다.** 원인을 안 알려주는 문구라 장애일 수도 있다 |
| "Due to unexpected capacity constraints..." (용량 제약) | **몇 분 기다렸다 다시 보낸다.** 장애가 아니라 수요 관리 상태다 |
| API 429 / 529 | 429는 **내 계정** 한도, 529는 **전체 서버** 과부하. 대응이 다르다 |

가장 먼저 짚어야 할 구분이 있다. **비슷해 보이는 이 둘은 원인도 대응도 반대다.** 아래 두 절에서 나눠 설명한다.

![Close-up of PHP code on a monitor, highlighting development and programming concepts.](https://images.pexels.com/photos/270557/pexels-photo-270557.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Pixabay](https://www.pexels.com/@pixabay) on [Pexels](https://www.pexels.com/photo/monitor-displaying-error-text-270557/)*

## "이 응답을 불러오지 못했습니다" — 상태페이지부터 본다

**답부터: 이건 기다리기 전에 [status.claude.com](https://status.claude.com)을 먼저 확인한다.**

영문 화면에서는 `This response didn't load`로 뜬다. 답변이 시작되다 만 자리에 회색 안내가 남는 형태다.

이 문구는 앤트로픽 공식 문서의 오류 목록에 항목으로 정리돼 있지 않다. 원인을 알려주는 문구가 아니라서, **이것만 보고는 일시적 문제인지 장애인지 가릴 수 없다.** 실제로 앤트로픽 장애 공지에는 "대화 완료 중 오류가 발생할 수 있다"는 식의 증상 서술이 등장한다([인시던트 예시](https://status.anthropic.com/incidents/t39s5hjpbs9v)). 그래서 **아래 '용량 제약'과 달리, 이 증상은 장애 가능성을 먼저 배제하는 편이 안전하다.**

순서는 이렇다.

1. **[status.claude.com](https://status.claude.com) 확인.** 진행 중인 장애가 있으면 기다리는 것 외에 할 일이 없다.
2. **공지가 없으면 재전송.** 일시적 네트워크·스트리밍 문제일 수 있다.
3. **그래도 반복되면 새 대화에서 같은 프롬프트를 시도.** 특정 대화의 상태 문제인지 가른다.

## "Due to unexpected capacity constraints..." — 이건 장애가 아니다

**답부터: 2~3분 뒤 같은 프롬프트를 다시 보낸다.** 대화를 새로 팔 필요도, 로그아웃할 필요도 없다.

> "Due to unexpected capacity constraints, Claude is unable to respond to your message. Please try again soon."

앤트로픽 지원 문서는 이 상황을 명확히 규정한다. 시스템은 정상 작동 중이고, 전체 사용자의 수요가 몰려 부하를 관리하는 중이라는 것이다. 원문은 이렇게 못 박는다.

> "These are not outages—the system functions normally while managing demand."

여기서 **앞 절과 결정적으로 갈리는 지점**이 있다. 공식 문서는 용량 제약이 **상태페이지에 뜨지 않는다**고 명시한다.

> "Capacity constraints won't appear on the status page because they represent normal load management rather than technical problems."

그러니 이 메시지를 보고 상태페이지를 열어봐야 아무것도 없다. 뒤집어 말하면, **상태페이지에 공지가 있다면 그건 용량 제약이 아니라 별개의 장애**다.

기다려도 반복된다면 **모델을 바꿔본다.** 용량은 모델별로 추적되므로 Opus가 막혀도 Sonnet은 열려 있을 수 있다. 공식 문서가 제시하는 처방은 "몇 분 뒤 재시도" 하나뿐이고, 모델 변경은 529 대응에서 문서가 권하는 방법이다.

## "5시간 한도" 계열 — 기다리는 것 외엔 방법이 없다

**답부터: 표시된 초기화 시각까지 기다린다.** 단 `Opus limit`이라면 모델을 바꿔 계속할 수 있다(아래 참조).

요금제 사용량과 관련된 메시지는 세 가지다. 뜨는 문장이 조금씩 다르고, 뜻도 다르다.

| 메시지 | 뜻 | 할 일 |
|---|---|---|
| "Approaching 5-hour limit." | 5시간 세션 한도에 **가까워짐** | 남은 작업 우선순위 조정. 무거운 요청은 뒤로 |
| "5-hour limit reached - resets [time]." | 한도 **도달**. 그 시각까지 사용 불가 | 표시된 초기화 시각까지 대기 |
| "5-hour limit resets [time] - continuing with usage credits." | 한도는 찼지만 **사용량 크레딧으로 계속** | 크레딧 잔액만 확인하면 됨 |

여기서 자주 하는 오해가 있다. 세션·주간 한도는 **계정에 걸린 할당량**이라 새로고침이나 재로그인, 다른 브라우저로 바꾼다고 풀리지 않는다.

**모델을 바꾸는 것도 대개 통하지 않는다.** 공식 문서는 이렇게 적는다.

> "세션 및 주간 한도는 모든 모델에서 공유되므로 모델을 전환해도 액세스가 복구되지 않습니다."

예외는 하나다. `You've hit your Opus limit`처럼 **Opus 전용 한도**에 걸린 경우라면 `/model`로 Sonnet 등으로 옮겨 계속 작업할 수 있다.

한도 자체를 늘리려면 요금제를 올리거나 사용량 크레딧을 쓰는 수밖에 없다. Pro·Max에서는 `/usage-credits`로 추가 사용량을 구매할 수 있다. 클로드 코드에서는 `/usage`로 현재 한도와 초기화 시각을 바로 확인할 수 있다.

## "메시지가 대화 길이 제한을 초과합니다" — 대화를 나눠야 한다

**답부터: 새 대화를 시작하거나 첨부를 줄인다.**

> "Your message will exceed the length limit for this chat. Try attaching fewer or smaller files or starting a new conversation."

이건 서버 문제가 아니라 **입력이 모델의 컨텍스트 한도를 넘은 것**이다. 대화가 길어질수록 지금까지의 내용 전부가 매번 함께 전달되기 때문에, 후반부로 갈수록 여유가 줄어든다.

세 가지 중 하나를 고른다.

- **긴 문서는 쪼갠다.** 한 번에 다 넣지 말고 장(章) 단위로 나눠 넣는다.
- **요약해서 넘긴다.** 앞부분 결론만 정리해 새 대화에 옮기면 맥락은 유지하면서 길이는 줄어든다.
- **새 대화를 판다.** 가장 확실하다.

클로드 코드라면 명령 하나로 끝난다. `/compact`가 대화 기록을 압축하고, `/clear`는 아예 새로 시작한다. `/context`로 지금 얼마나 찼는지 볼 수 있다.

## 로그인이 안 될 때 — VPN과 확장 프로그램부터 끈다

로그인 단계에서 막연한 오류가 뜬다면 원인은 대개 셋이다.

1. **VPN** — 끄고 다시 시도
2. **브라우저 확장 프로그램** — 특히 광고 차단·스크립트 차단 계열
3. **캐시와 쿠키** — 오래된 인증 정보가 남아 충돌

세 가지를 차례로 배제하고도 안 되면 [status.claude.com](https://status.claude.com)에서 로그인 관련 장애 공지가 있는지 본다.

![turned on gray laptop computer](https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxsYXB0b3AlMjBkZWJ1Z2dpbmclMjBjb2RlJTIwbmlnaHR8ZW58MXwwfHx8MTc4NzcwNjc1Nnww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Luca Bravo](https://unsplash.com/@lucabravo?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/turned-on-gray-laptop-computer-XJXWbfSo2f0?utm_source=spice-bandit-blog&utm_medium=referral)*

## API 오류 코드 — 숫자만 보면 원인이 갈린다

**답부터: 4xx는 내가 고칠 것, 5xx는 기다릴 것이다.** 다만 429는 성격이 둘로 갈리니 아래에서 따로 본다.

API나 클로드 코드를 쓰면 숫자 코드가 뜬다. 공식 문서 기준으로 정리하면 이렇다.

| 코드 | 이름 | 무슨 뜻인가 | 대응 |
|---|---|---|---|
| 400 | `invalid_request_error` | 요청 형식·내용 문제. 직접 설정한 **지출 한도** 도달 시에도 400 (단 클로드 코드 워크스페이스 한도는 429) | 요청 본문 확인, 콘솔에서 한도 확인 |
| 401 | `authentication_error` | API 키가 잘못됐거나 취소·만료됨 | 키 재발급 또는 `/login` |
| 402 | `billing_error` | 결제 정보 문제 | 콘솔에서 결제 수단 확인 |
| 403 | `permission_error` | 키에 해당 리소스 권한 없음 | 조직·워크스페이스 설정 확인 |
| 404 | `not_found_error` | 엔드포인트나 리소스 ID 오류 | URL·ID 확인 |
| 409 | `conflict_error` | 리소스 상태 충돌(동시 수정 등) | 충돌 해소 후 재시도 |
| 413 | `request_too_large` | 요청이 최대 크기 초과 | 아래 크기 제한 표 참조 |
| 429 | `rate_limit_error` | **내 조직**이 속도 제한 또는 **티어 월간 지출 상한** 도달 | `retry-after`가 있으면 그만큼 대기. **없으면 티어 지출 상한이라 대기해도 안 풀린다** |
| 500 | `api_error` | 앤트로픽 내부 오류 | 지수 백오프로 재시도 |
| 504 | `timeout_error` | 처리 중 시간 초과 | 스트리밍 API 사용 검토 |
| 529 | `overloaded_error` | **전체 사용자** 대상 일시 과부하 | 몇 분 뒤 재시도 |

*출처: [Claude API 오류 공식 문서](https://platform.claude.com/docs/ko/api/errors)*

### 429와 529를 헷갈리면 대응이 어긋난다

이 둘은 화면에 비슷하게 보이지만 원인이 정반대다.

- **429는 내 문제다.** 내 조직이 분당 요청 한도를 넘었거나 지출 상한에 닿았다. 요청 속도를 줄이거나 한도 상향을 논의해야 한다.
- **529는 내 문제가 아니다.** 앤트로픽 서버가 전체 사용자 트래픽으로 일시 포화된 상태다. 내가 요청을 줄여도 안 풀린다. 기다리거나 모델을 바꾼다.

한 가지 함정이 있다. **사용 티어의 월간 지출 상한 때문에 발생한 429에는 `retry-after` 헤더가 없다.** 이 경우 아무리 기다려도 계속 실패하므로, 재시도 로직만 믿고 방치하면 조용히 실패가 쌓인다. 헤더 유무로 두 종류의 429를 구분해야 한다.

또 하나. 사용량을 갑자기 크게 늘리면 가속 제한에 걸려 429가 날 수 있다. 트래픽은 점진적으로 올리는 편이 안전하다.

### 요청 크기 제한

413이 떴다면 이 표와 대조한다.

| 엔드포인트 | 최대 요청 크기 |
|---|---|
| Messages API | 32 MB |
| Token Counting API | 32 MB |
| Batch API | 256 MB |
| Files API | 500 MB |

## 클로드 코드에서 자주 만나는 오류

**답부터: 대부분 `/login`, `/compact`, `/clear` 셋 중 하나로 끝난다.**

터미널에서 쓰는 클로드 코드는 오류 메시지가 또 다르다. 빈도 높은 것부터 정리한다.

| 메시지 | 원인 | 해결 |
|---|---|---|
| `Not logged in · Please run /login` | 유효한 인증 정보 없음 | `/login` 실행. API 키 방식이면 `ANTHROPIC_API_KEY` 확인 |
| `Prompt is too long` | 대화가 컨텍스트 한도 초과 | `/compact` → `/clear` → `/context`로 무엇이 먹는지 분해 → `/mcp disable <이름>`으로 미사용 MCP 정리 → 비대해진 `CLAUDE.md` 축소 |
| `You've hit your session limit · resets 3:45pm` | 구독 사용량 한도 | 표시 시각까지 대기. `/usage`로 확인 |
| `Request timed out` | 기본 10분 안에 응답 없음 | 작업을 쪼갠다. 느린 망이면 `API_TIMEOUT_MS` 상향 |
| `Unable to connect to API` | 네트워크·프록시·TLS 설정 | 방화벽 확인, `ANTHROPIC_BASE_URL` 점검 |
| `Invalid API key · Fix external API key` | 키가 무효·취소·오타이거나 `.env`의 옛 키가 새어 들어옴 | `env \| grep ANTHROPIC`(PowerShell은 `Get-ChildItem Env:ANTHROPIC*`)로 확인 |
| `The response above may be incomplete` | 응답 중 연결 끊김 | **`continue`라고 답하면 마지막 블록부터 이어간다** |
| `SSL certificate verification failed` | 사내 프록시 등 인증서 문제 | `NODE_EXTRA_CA_CERTS`에 CA 번들 경로 지정 |
| `Error during compaction: Conversation too long` | 압축조차 안 될 만큼 대화가 김 | **Esc 두 번**으로 몇 턴 뒤로 이동 후 `/compact` 재실행. 안 되면 `/clear` |
| `Request too large (max 30 MB)` | 첨부가 CLI 한도 초과 (API 32MB와 별개) | Esc 두 번 눌러 첨부를 줄인다 |

*출처: [클로드 코드 오류 레퍼런스](https://code.claude.com/docs/ko/errors)*

### 응답이 끊겼을 때 다시 시키지 마라

`The response above may be incomplete`는 네 가지 상황에서 뜬다. 영문 문구를 그대로 적으면 이렇다.

- `Server error mid-response` — 스트리밍 중 5xx 서버 오류
- `Connection lost mid-response` — 응답 도중 연결 끊김
- `Your computer went to sleep mid-response` — **컴퓨터가 절전 모드로 진입**
- `The response stopped arriving` — 응답이 오다 멈춰 스트리밍 유휴 워치독이 연결을 끊음 (직접 Anthropic API 기준 바이트 워치독 180초, 그 외 300초)

여기서 처음부터 다시 물어보는 사람이 많은데 손해다. 이미 완료된 블록은 화면에 남아 있고, **`continue`라고 답하면 마지막 완료 지점부터 이어서 진행**한다. 토큰과 시간을 아낄 수 있다.

### 진단에 쓰는 명령과 환경변수

문제가 반복되면 상태부터 확인한다. 아래는 **클로드 코드 세션을 연 뒤 프롬프트에 그대로 입력하는 슬래시 명령**이다. 터미널 셸에 `claude /status` 식으로 치면 그 문자열이 첫 프롬프트로 전달될 뿐이니 주의한다.

| 입력 | 확인되는 것 |
|---|---|
| `/status` | 지금 어떤 인증을 쓰는지 (프록시·CA 로딩 상태 포함) |
| `/usage` | 플랜 한도와 초기화 시각 |
| `/context` | 컨텍스트를 무엇이 얼마나 쓰고 있는지 분해 |
| `/model` | 사용 가능한 모델 확인·변경 |
| `/doctor` | 설정 전반 진단 |

버전만 셸에서 확인한다.

```bash
claude --version
claude --debug     # 심층 로그. 출력은 ~/.claude/debug/<session-id>.txt 에 남는다
```

재시도 동작을 손보려면 환경변수를 쓴다.

| 변수 | 기본값 | 용도 |
|---|---|---|
| `CLAUDE_CODE_MAX_RETRIES` | 10 | 자동 재시도 횟수 (최대 15) |
| `CLAUDE_CODE_RETRY_WATCHDOG` | 미설정 | `1`로 두면 CI에서 429·529 무한 재시도 |
| `API_TIMEOUT_MS` | 600000 | 요청 타임아웃(밀리초) |
| `NODE_EXTRA_CA_CERTS` | — | CA 인증서 번들 경로 |

## 개발자용 — 오류를 코드로 다루는 법

직접 API를 붙인다면 세 가지만 지켜도 대부분의 오류가 조용히 처리된다.

**첫째, 공식 SDK를 쓴다.** 공식 SDK는 연결 오류·속도 제한·5xx를 지수 백오프로 **기본 2회 자동 재시도**하고, `retry-after` 헤더가 있으면 그 값을 따른다. 재시도 로직을 직접 짤 이유가 별로 없다.

**둘째, 문자열이 아니라 타입으로 잡는다.** SDK는 오류마다 타입 지정 예외를 던진다. 404는 파이썬에서 `anthropic.NotFoundError`, 루비에서 `Anthropic::Errors::NotFoundError`다. 오류 메시지 문자열을 매칭하면 문구가 바뀔 때 깨진다.

**셋째, `request_id`를 로그에 남긴다.** 모든 응답에는 `request-id` 헤더가 있고 오류 본문에도 같은 값이 들어간다. 지원팀에 문의할 때 이 ID가 있으면 해결이 훨씬 빠르다.

```json
{
  "type": "error",
  "error": {
    "type": "not_found_error",
    "message": "The requested resource could not be found."
  },
  "request_id": "req_011CSHoEeqs5C35K2UUqR7Fy"
}
```

긴 작업에는 스트리밍이나 배치를 쓰는 편이 안전하다. 일부 네트워크는 유휴 연결을 일정 시간 뒤 끊는데, 큰 `max_tokens`로 비스트리밍 요청을 던지면 응답도 못 받고 실패할 수 있다. 10분을 넘길 것 같으면 [스트리밍 Messages API](https://platform.claude.com/docs/ko/build-with-claude/streaming)나 Message Batches API를 검토한다.

## 자주 묻는 것들

**같은 오류인데 웹, 앱, 터미널에서 문구가 다르다?**
맞다. 같은 원인이라도 표시 방식이 다르다. 웹·앱은 사람이 읽는 문장(`Due to unexpected capacity constraints...`)으로, API와 클로드 코드는 숫자 코드(529)로 보여준다. **이 둘은 같은 용량 과부하다.**

반면 `This response didn't load`처럼 **원인을 말해주지 않는 표시**도 있다. 이건 용량 문제일 수도, 장애일 수도 있어 문구만으로는 못 가른다. 그래서 이 경우엔 상태페이지가 먼저다. **문구가 아니라 원인으로 묶어서 보는 게 맞다.**

**한도가 찼는데 다른 계정으로 우회해도 되나?**
약관은 **계정·API 키·자격증명 공유를 명시적으로 금지**하고, 사용 정책은 **다른 계정으로 차단을 우회하는 행위**를 금지한다. 한도 회피 목적의 다계정은 이 조항들에 정면으로 걸리지는 않지만 회색지대다. 사용량 크레딧을 사거나 요금제를 올리는 쪽이 안전하다.

**모델을 바꾸면 한도가 초기화되나?**
경우에 따라 다르다. **세션·주간 한도는 모든 모델이 함께 쓰므로 모델을 바꿔도 안 풀린다.** 반면 `You've hit your Opus limit`처럼 Opus 전용 한도라면 `/model`로 옮겨 계속할 수 있다. 그리고 **529 용량 과부하는 모델별로 추적**되므로 이때는 모델 변경이 유효한 우회책이다.

**재시도를 자동으로 돌리면 안 되나?**
대체로 되지만 한 가지 예외가 있다. 위에서 말한 **사용 티어의 월간 지출 상한 429는 `retry-after`가 없어 계속 실패**한다. 무한 재시도를 걸어두면 로그만 쌓인다. CI에서 `CLAUDE_CODE_RETRY_WATCHDOG=1`을 쓸 때 특히 주의해야 한다.

**"컴퓨터가 절전 모드로 들어갔다"는 오류가 뜬다?**
긴 응답을 받는 중에 맥이나 노트북이 잠들면 스트리밍이 끊긴다. 오래 걸릴 작업이라면 절전 설정을 잠시 꺼두는 편이 낫다. 이미 끊겼다면 `continue`로 이어받으면 된다.

## 정리 — 오류를 만났을 때의 순서

메시지를 못 찾겠다면 아래 순서대로 짚어 나간다. 위쪽부터 확인할수록 시간이 덜 든다.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px;margin:24px 0">
<svg viewBox="0 0 600 330" style="width:100%;height:auto" role="img" aria-label="클로드 오류 대응 순서도. 상태페이지 확인, 한도 확인, 요청 크기 확인, 환경 확인, 지원팀 문의 순으로 진행">
  <text x="20" y="24" font-size="15" font-weight="700" fill="#23201D">오류가 떴을 때 확인 순서 — 위에서부터 하나씩</text>
  <text x="20" y="44" font-size="11" fill="#8A8378">위쪽일수록 흔하고, 확인 비용도 싸다</text>
  <rect x="30" y="60" width="540" height="42" rx="6" fill="#1B4F8A"/>
  <text x="46" y="79" font-size="13" font-weight="700" fill="#FAF6EE">1. 장애인가?</text>
  <text x="46" y="95" font-size="11" fill="#FAF6EE">status.claude.com에 공지가 있으면 → 기다린다. 내가 할 게 없다</text>
  <rect x="30" y="114" width="540" height="42" rx="6" fill="#4E7FA8"/>
  <text x="46" y="133" font-size="13" font-weight="700" fill="#FAF6EE">2. 내 한도인가?</text>
  <text x="46" y="149" font-size="11" fill="#FAF6EE">5시간 한도 · 지출 상한 · 429 → 대기하거나 요금제·크레딧으로 해결</text>
  <rect x="30" y="168" width="540" height="42" rx="6" fill="#4E7FA8"/>
  <text x="46" y="187" font-size="13" font-weight="700" fill="#FAF6EE">3. 내 요청이 무거운가?</text>
  <text x="46" y="203" font-size="11" fill="#FAF6EE">컨텍스트 초과 · 413 · 타임아웃 → 쪼개거나 /compact로 압축</text>
  <rect x="30" y="222" width="540" height="42" rx="6" fill="#A8BDD2"/>
  <text x="46" y="241" font-size="13" font-weight="700" fill="#23201D">4. 내 환경인가?</text>
  <text x="46" y="257" font-size="11" fill="#23201D">로그인 실패 · TLS · 프록시 → VPN·확장 프로그램·인증서 점검</text>
  <rect x="30" y="276" width="540" height="38" rx="6" fill="#FAF6EE" stroke="#23201D" stroke-width="1.5"/>
  <text x="46" y="300" font-size="12" font-weight="700" fill="#23201D">5. 그래도 안 되면 → request_id를 챙겨 지원팀 문의</text>
</svg>
<figcaption style="font-size:13px;color:#8A8378;margin-top:8px">위 두 단계는 확인이 몇 초면 끝난다. 아래로 갈수록 손이 많이 간다.</figcaption>
</figure>

가장 흔한 오해 하나로 마무리한다. **빨간 글씨가 떴다고 클로드가 죽은 게 아니다.** 용량 제약은 장애가 아니고, 5시간 한도는 정상 동작이며, 529는 몇 분이면 풀린다. 진짜 장애는 상태페이지에 뜬다. 그것부터 확인하는 습관이 시간을 가장 많이 아껴준다.

## 참고 자료

- [Troubleshoot Claude error messages](https://support.claude.com/en/articles/12466728-troubleshoot-claude-error-messages) — 앤트로픽 지원 센터, 사용량·길이·로그인·용량 오류
- [Claude API 오류](https://platform.claude.com/docs/ko/api/errors) — HTTP 코드, 요청 크기 제한, SDK 예외, 요청 ID
- [Claude Code 오류 레퍼런스](https://code.claude.com/docs/ko/errors) — 클로드 코드 오류·진단 명령·환경변수
- [Claude 상태페이지](https://status.claude.com) — 실시간 장애 공지
- 관련 글: [클로드 상태 실시간 확인 — 지금 안 되면 장애? 1분 체크](/blog/2026-06-18-how-to-check-claude-ai-server-status/)
