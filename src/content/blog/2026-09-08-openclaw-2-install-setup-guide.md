---
title: "오픈클로(OpenClaw) 2.0 설치·사용법 — 명령어 3줄"
description: "OpenClaw 2.0을 설치하고 쓰는 법을 명령어 단위로 정리했다. macOS·윈도우·리눅스 설치 한 줄, 온보딩에서 무엇을 고르는지, 텔레그램·슬랙 같은 메신저 연결과 자주 나는 오류 해결까지."
pubDate: 2026-09-08T10:45:08+09:00
category: ax
tags: ["OpenClaw", "AI에이전트", "자동화", "오픈소스"]
---

**답부터. 명령어 세 줄이면 돌아간다.**

```bash
curl -fsSL https://openclaw.ai/install.sh | bash   # 설치
openclaw onboard --install-daemon                  # 초기 설정
openclaw dashboard                                 # 대시보드 열기
```

윈도우는 첫 줄만 다르다. 나머지는 같다. 이 글은 이 세 줄이 각각 무엇을 하는지, 중간에 뭘 물어보고 어떻게 답해야 하는지, 그리고 끝난 뒤 어디로 들어가면 되는지를 정리한다.

| 자주 묻는 것 | 한 줄 답 |
|---|---|
| 뭐 하는 물건인가 | **내 컴퓨터에서 돌아가는 오픈소스 AI 비서.** 메신저로 시키면 컴퓨터를 대신 조작한다 |
| 코딩 몰라도 되나 | **된다.** 설치는 명령어 복붙, 그 뒤로는 대화창에서 말로 시킨다 |
| 돈 드나 | OpenClaw는 무료·오픈소스. 다만 **AI 모델 사용료는 따로** 든다 |
| 어디로 들어가나 | 설치 후 `http://localhost:18789` |

![Focused view of programming code displayed on a laptop](https://images.pexels.com/photos/34600/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Negative Space](https://www.pexels.com/@negativespace) on [Pexels](https://www.pexels.com/photo/coffee-writing-computer-blogging-34600/)*

## 설치 전에 확인할 것 하나

답부터: **Node.js 버전만 맞으면 된다.**

**Node 24.16 이상 또는 26.1 이상**이 필요하고, 공식 문서는 **26을 권장**한다. 터미널에서 확인한다.

```bash
node --version
```

`v26.x.x`나 `v24.16` 이상이 나오면 그대로 진행하면 된다. 버전이 낮거나 Node가 아예 없어도 괜찮다. **아래 설치 스크립트가 필요하면 알아서 런타임까지 깔아준다.**

지원 OS는 **macOS, 리눅스, 윈도우**다. **윈도우는 세 갈래가 있다** — ①네이티브 Windows Hub 앱 ②PowerShell 설치 명령(아래) ③WSL2에 게이트웨이를 올리는 방식. **대부분 ②로 충분하고 WSL2는 선택이다.** 굳이 WSL2를 먼저 깔 필요는 없다.

npm으로 설치할 생각이라면 npm 버전도 함께 본다. 아래에서 명령이 갈린다.

```bash
npm -v
```

## 1단계 — 설치 (한 줄)

**macOS · 리눅스 · WSL2**

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**윈도우 (PowerShell)**

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

**Node.js를 직접 관리하는 사람이라면** npm으로 깔아도 된다. **다만 npm 버전에 따라 명령이 다르다.**

| npm 버전 | 설치 명령 |
|---|---|
| **12 이상** | `npm install -g openclaw@latest --allow-scripts=openclaw` (플래그 필수) |
| **11.16 ~ 11.x** | 위와 동일 (플래그 없으면 경고만 뜨고 진행) |
| **11.15 이하** | `npm install -g openclaw@latest` (**플래그를 쓰면 에러 난다**) |

npm 12부터 패키지 설치 스크립트를 기본 차단하기 때문에, OpenClaw의 설치 단계를 허용하려면 저 플래그가 필요하다. 반대로 구버전 npm에는 그 옵션 자체가 없다.

**완료 신호**: 설치가 끝나면 버전을 찍어 확인한다.

```bash
openclaw --version
```

버전 번호가 나오면 설치는 끝난 것이다. `command not found`가 나오면 터미널을 새로 열고 다시 해본다. PATH가 갱신되지 않아 생기는 흔한 증상이다.

## 2단계 — 온보딩 (뭘 물어보나)

```bash
openclaw onboard --install-daemon
```

`--install-daemon`을 붙이면 **게이트웨이가 백그라운드 서비스로 등록**된다. 터미널을 닫아도 계속 돌게 하려면 이 옵션을 넣는 게 좋다.

온보딩은 몇 가지를 순서대로 물어본다. **가장 중요한 건 두 번째다.**

**① 보안 안내 확인**
이 도구가 실제로 컴퓨터를 조작한다는 경고가 뜬다. 무엇을 허용하는지 읽고 넘어간다.

**② 게이트웨이를 어디서 돌릴 것인가**
- **이 컴퓨터(로컬)** — 대부분 이걸 고르면 된다
- **원격(SSH/Tailnet)** — 서버에 두고 쓸 때
- **나중에 설정**

**③ AI 모델 연결 — 여기가 실제로 걸리는 지점이다**
쓸 모델 제공자를 고르고 API 키를 넣는다. 이미 쓰고 있는 AI 도구가 있으면 온보딩이 먼저 찾아본다.

중요한 건 **여기서 실제 호출 테스트가 돌아간다**는 점이다. 키가 틀렸거나 크레딧이 없으면 이 단계에서 걸린다. 통과해야 다음으로 넘어간다.

**완료 신호**: 게이트웨이 상태를 확인한다.

```bash
openclaw gateway status
```

실행 중이라고 나오면 된다. 문제가 있으면 진단 명령이 따로 있다.

```bash
openclaw doctor
```

## 3단계 — 대시보드 열기

```bash
openclaw dashboard
```

브라우저가 열리면서 **컨트롤 UI**가 뜬다. 주소는 **`http://localhost:18789`** 이고, 게이트웨이는 이 포트를 쓴다. 나중에는 명령어 없이 이 주소로 바로 들어가도 된다.

**완료 신호**: 대화창에 아무 말이나 걸어 보고 답이 오면 정상이다. 여기까지가 기본 설치다.

![a wooden desk topped with a computer monitor and keyboard](https://images.unsplash.com/photo-1677100091694-a09a1e468a7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxob21lJTIwb2ZmaWNlJTIwZGVzayUyMGNvbXB1dGVyJTIwc2V0dXB8ZW58MXwwfHx8MTc4ODgzMTIwOXww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Nubelson Fernandes](https://unsplash.com/@nublson?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-wooden-desk-topped-with-a-computer-monitor-and-keyboard-QNch8putqnU?utm_source=spice-bandit-blog&utm_medium=referral)*

## 4단계 — 메신저 연결 (이게 진짜다)

답부터: **`openclaw channels login` 한 줄이면 된다.**

여기서부터가 이 도구를 쓰는 이유다. 대시보드에서만 쓰면 그냥 또 하나의 챗봇이지만, 메신저에 붙이면 **평소 쓰는 앱에서 컴퓨터를 시킬 수 있다.**

```bash
openclaw channels login
```

연결 가능한 채널은 텔레그램, 슬랙, 디스코드, 왓츠앱, 시그널, 구글 챗, iMessage 등 **20개가 넘는다.** 명령을 실행하면 어느 채널을 붙일지 고르고 각 서비스의 인증을 거친다.

**완료 신호**: 해당 메신저에서 봇에게 말을 걸어 답이 오면 연결된 것이다.

**전체 상태를 한 번에 보려면** 다음 명령이 있다.

```bash
openclaw health
```

## 2.0에서 새로 생긴 것

답부터: **웹 UI·메모리·네이티브 앱·컴퓨터 제어·스케줄링 다섯 축이 바뀌었다.**

| 영역 | 무엇이 달라졌나 |
|---|---|
| **웹 UI** | 대화를 화면 중심에 두고 파일·승인·설정을 그 주변에 배치하도록 재구성 |
| **메모리** | 이전 대화에서 맥락을 끌어온다. 검색·확인·가져오기·삭제를 화면에서 처리 |
| **네이티브 앱** | 아이폰·아이패드·안드로이드·macOS·Wear OS. 음성 입력, 첨부파일, 모델 선택 지원 |
| **브라우저·컴퓨터 제어** | 격리된 전용 프로필 또는 쓰던 크롬 탭 공유. Mac·윈도우에서 컴퓨터 조작 |
| **자동화** | 에이전트·UI·CLI·문서에 흩어져 있던 스케줄링을 하나로 통합 |

규모도 참고할 만하다. 공식 블로그 기준 이 릴리스에는 **933명이 참여했고 약 7주 동안 1만 6,000건이 넘는 풀 리퀘스트**가 반영됐다(릴리스 노트의 최종 집계는 987명·1만 6,977건이다).

**메모리와 스케줄링이 실질적으로 가장 큰 변화다.** 이전에는 매번 맥락을 다시 설명해야 했고 반복 작업을 걸어두기 번거로웠는데, 2.0은 둘 다 화면에서 다룰 수 있게 됐다.

## 버전 함정 하나 — 숫자가 큰 게 최신이 아니다

**주의할 게 하나 있다.** `2026.9.1-beta.1`로 배포된 패키지가 있는데, **이건 버전 표기 오류다.** 실제 내용은 `2026.8.1-beta.4`이고, **안정판 `2026.8.1`보다 최신이 아니다.**

숫자만 보고 베타를 깔면 오히려 구버전을 쓰게 된다. **그냥 안정판 2026.8.1(= OpenClaw 2.0)을 쓰면 된다.** 위의 설치 명령이 안정판을 가져온다.

## 막혔을 때 — 자주 나는 오류 네 가지

답부터: **거의 다 PATH, 권한, Node 버전, 게이트웨이 넷 중 하나다.**

**① `openclaw: command not found`**
설치는 됐는데 명령어를 못 찾는 경우다. openclaw 실행 파일이 있는 폴더가 셸의 `PATH`에 없어서 생긴다. **터미널을 완전히 닫았다가 새로 열면** 대부분 해결된다. 그래도 안 되면 npm의 전역 bin 경로를 PATH에 직접 추가한다.

```bash
npm prefix -g       # 전역 설치 경로 확인 (실행 파일은 그 아래 bin 폴더)
echo $PATH          # 그 경로가 들어 있는지 확인
```

**② npm 설치가 권한 오류(EACCES)로 실패**
npm이 시스템 폴더에 쓰려다 막힌 것이다. **`sudo`를 붙이는 것은 권하지 않는다.** 뒤에 파일 소유권이 꼬여 더 성가신 문제가 생긴다. npm 전역 설치 경로를 사용자 홈 아래로 바꿔 두면 sudo 없이 깔린다. 애초에 이 문제를 피하려면 앞의 **설치 스크립트 방식**을 쓰는 편이 낫다.

**③ 온보딩이 모델 연결에서 안 넘어간다**
가장 흔한 진짜 실패 지점이다. 온보딩은 **실제로 모델을 한 번 호출해 본다.** 그래서 여기서 막히면 원인은 셋 중 하나다 — API 키 오타, 크레딧 소진, 또는 그 키로 해당 모델을 쓸 권한이 없음. 제공자 콘솔에서 키와 잔액을 먼저 확인한다.

**④ 게이트웨이에 연결이 안 된다**
게이트웨이가 떠 있는지, 닿는지를 나눠서 본다.

```bash
openclaw gateway status   # 떠 있는가
openclaw gateway probe    # 닿는가
openclaw doctor           # 설정·경로·상태 한 번에 진단
```

참고로 `RPC: limited - missing scope: operator.read` 같은 메시지는 **연결 실패가 아니라 진단 기능이 제한됐다는 뜻**이다. 이것만 보고 재설치할 필요는 없다.

**재설치는 마지막 수단이다.** 위 명령으로 어느 단계에서 깨졌는지부터 확인하는 편이 훨씬 빠르다.

## 서버에 두고 쓰려면 — Docker

답부터: **Docker Compose 방식이 준비돼 있다.** 24시간 돌리거나 화면 없는 서버에 올릴 때 쓴다.

**저장소를 먼저 받아야 한다.** 설치 스크립트가 저장소 안에 들어 있다.

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
export OPENCLAW_IMAGE="ghcr.io/openclaw/openclaw:latest"
./scripts/docker/setup.sh
```

운영에 필요한 명령은 이 정도다.

```bash
docker compose up -d openclaw-gateway     # 시작
docker compose logs -f openclaw-gateway   # 로그 보기
docker compose down                       # 중지
```

포트는 기본 **18789**이고, 호스트 포트를 바꾸려면 `OPENCLAW_GATEWAY_PORT`를 지정한다(컨테이너 내부는 그대로 18789를 쓴다).

**두 가지만 기억하면 된다.** 첫째, 컨테이너 안에서 호스트의 로컬 서비스를 부를 때는 `127.0.0.1`이 아니라 **`host.docker.internal`** 을 써야 한다. 둘째, 화면 없이 자동 설정하려면 `.env`에 키를 미리 넣고 비대화형 온보딩을 돌린다.

## 설정과 데이터는 어디 저장되나

옮기거나 백업할 때 알아야 할 위치다. 전부 홈 디렉터리 아래 `~/.openclaw/`에 모여 있다.

| 경로 | 들어 있는 것 |
|---|---|
| `~/.openclaw/openclaw.json` | 설정 파일 |
| `~/.openclaw/credentials/` | 채널·모델 제공자 인증 정보 |
| `~/.openclaw/workspace/` | 스킬, 프롬프트, 메모리 |

**컴퓨터를 옮길 때는 이 폴더를 통째로 가져가면 된다.** 다만 `credentials/`에는 API 키와 메신저 인증 정보가 들어 있으니 **깃 저장소에 올리거나 클라우드에 그냥 두면 안 된다.**

## 업그레이드와 제거

답부터: **각각 전용 명령이 있다. 설치 명령을 다시 돌릴 필요 없다.**

**업그레이드**

```bash
openclaw update
```

전역 패키지를 갱신하고 플러그인을 맞춘 뒤 게이트웨이까지 재시작해 준다. 업데이트 채널도 이 명령에서 고른다.

**제거**

```bash
openclaw uninstall --all
```

`--all`은 네 가지 범위를 한 번에 지운다 — `--service`(서비스), `--state`(상태 디렉터리), `--workspace`(워크스페이스), `--app`(앱).

**여기서 주의할 게 있다. `--workspace`에는 위 표의 스킬·프롬프트·메모리가 들어 있다.** 설정만 정리하고 그동안 쌓아둔 것은 남기고 싶다면 `--all` 대신 범위를 골라 쓴다.

```bash
openclaw uninstall --service --state
```

플래그 없이 실행하면 무엇을 지울지 고르는 대화형이 뜨고, 기본값은 게이트웨이 서비스만이다. 스크립트로 무인 제거하려면 `--all --yes --non-interactive`를 쓴다.

**제거해도 CLI는 남는다.** `openclaw` 명령 자체는 위 명령으로 지워지지 않는다. 공식 문서도 CLI는 npm이나 pnpm으로 따로 지우라고 안내한다. 설치할 때 쓴 도구에 맞춰 마저 정리한다.

```bash
npm rm -g openclaw
```

그리고 메신저나 모델 제공자 쪽에 걸어둔 연결을 끊는 것은 각 서비스 콘솔에서 따로 해야 한다.

## 시작하기 전에 알아둘 것

이 도구는 **실제로 내 컴퓨터를 조작한다.** 파일을 읽고 쓰고, 브라우저를 열고, 명령을 실행한다. 편리한 만큼 위험도 같이 온다. 세 가지만 지키자.

**첫째, 처음에는 승인을 켜 두고 쓴다.** 뭘 하려는지 보고 허락하는 방식으로 시작해서, 익숙해지면 자주 하는 작업만 자동으로 넘긴다.

**둘째, 중요한 폴더에서 시작하지 않는다.** 회사 문서나 개인 자료가 든 폴더 말고, 실습용 폴더를 하나 만들어 거기서 감을 잡는 편이 낫다.

**셋째, 모델 사용료를 확인한다.** OpenClaw 자체는 무료지만 뒤에 붙는 AI 모델은 유료다. 에이전트가 알아서 여러 번 호출하면 생각보다 빨리 쌓인다. 제공자 콘솔에서 **지출 상한을 먼저 걸어두는 것**을 권한다.

**넷째 — 이게 제일 중요하다. 컨트롤 UI를 외부에 열지 마라.** 공식 문서도 명시적으로 경고한다. 이 화면은 대화창이 아니라 **관리자 화면**이다. 설정을 바꾸고 명령 실행을 승인하는 곳이라, 열려 있으면 그 컴퓨터를 통째로 내주는 것과 같다.

서버에 올려 두고 밖에서 쓰고 싶다면 포트를 여는 대신 **SSH 터널**을 쓴다.

```bash
ssh -N -L 18789:127.0.0.1:18789 사용자명@서버주소
```

이렇게 하면 내 PC의 `localhost:18789`가 서버의 게이트웨이로 연결되고, 포트는 외부에 노출되지 않는다.

## 정리 — 명령어만 모아보면

```bash
# 1. 설치 (macOS·리눅스·WSL2)
curl -fsSL https://openclaw.ai/install.sh | bash

# 2. 설치 확인
openclaw --version

# 3. 온보딩 (게이트웨이를 서비스로 등록)
openclaw onboard --install-daemon

# 4. 게이트웨이 상태 확인
openclaw gateway status

# 5. 대시보드 열기 → http://localhost:18789
openclaw dashboard

# 6. 메신저 연결
openclaw channels login

# 문제가 생기면
openclaw doctor
openclaw health

# 업그레이드 / 제거
openclaw update
openclaw uninstall --all
```

막히는 지점은 대개 정해져 있다. **`command not found`면 터미널을 새로 열고**, 온보딩이 안 넘어가면 **모델 API 키와 크레딧**을 확인하면 된다. 그 둘이 아니면 `openclaw doctor`가 원인을 짚어 준다.

*이 글은 공식 문서 기준의 설치 안내이며 특정 서비스 사용을 권유하지 않는다. 명령어와 화면 구성은 버전에 따라 바뀔 수 있으므로 실제 설치 시 공식 문서의 최신 안내를 확인하기 바란다. AI 모델 사용료는 각 제공자 정책에 따른다.*

## 참고 자료

- [OpenClaw 공식 사이트](https://openclaw.ai) · [GitHub 저장소](https://github.com/openclaw/openclaw) — 설치 스크립트, Node 요구 버전, 지원 OS
- [OpenClaw Docs — Install](https://docs.openclaw.ai/install) — OS별 설치 명령, `--version`·`doctor`·`gateway status` 확인 절차
- [OpenClaw Docs — Setup](https://docs.openclaw.ai/start/setup) — `channels login`, `health`, 설정·자격증명·워크스페이스 저장 경로
- [OpenClaw Docs — v2026.8.1 릴리스 노트](https://docs.openclaw.ai/releases/2026.8.1) — 2.0 변경점과 `2026.9.1-beta.1` 버전 표기 오류 안내
- [OpenClaw 공식 블로그 — OpenClaw 2.0](https://openclaw.ai/blog/openclaw-2-accidentally) — 933명·약 7주·1만 6,000건 이상 기여 규모
- [OpenClaw Docs — 일반 문제 해결(한국어)](https://docs.openclaw.ai/ko/help/troubleshooting) — 게이트웨이·RPC 스코프 진단
- [OpenClaw Docs — Docker](https://docs.openclaw.ai/install/docker) — 컨테이너 설치, 포트·볼륨, 헤드리스 운영
