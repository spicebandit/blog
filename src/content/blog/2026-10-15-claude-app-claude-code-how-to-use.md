---
title: "클로드 코드 사용방법 — 클로드 앱에서 터미널 없이 시작하기"
description: "클로드 코드 사용방법을 초보자용으로 단계별 정리했습니다. 클로드 데스크톱 앱의 Code 탭에서 터미널·CLI 설치 없이 시작해, 폴더 고르기부터 첫 지시·변경사항 검토·권한 모드까지 순서대로 따라갈 수 있습니다."
pubDate: 2026-10-15T16:44:34+09:00
category: ax
tags: ["클로드코드", "클로드앱", "AI코딩", "사용방법"]
---

"클로드 코드를 써보고 싶은데 터미널을 모른다"는 분을 위한 글입니다. 결론부터 말하면 **터미널을 몰라도 됩니다.** 클로드 데스크톱 앱 안에 클로드 코드가 이미 들어 있고, **CLI나 Node.js를 따로 설치할 필요가 없습니다.** 앱을 깔고 **Code 탭**을 누르면 바로 시작입니다. 아래 5단계를 순서대로만 따라가면 됩니다.

**먼저 가장 많이 막히는 세 가지부터 답하겠습니다.**

| 질문 | 답 |
|---|---|
| **터미널·CLI를 설치해야 하나요?** | **아니요.** 데스크톱 앱에 클로드 코드가 포함돼 있어 Node.js도 CLI도 설치할 필요가 없습니다 |
| **무료로 쓸 수 있나요?** | **아니요.** **Pro·Max·Team·Enterprise 중 하나의 유료 구독**이 필요합니다. Code 탭을 눌렀을 때 업그레이드 안내가 뜨면 구독이 없는 상태입니다 |
| **앱에 탭이 3개인데 어디로?** | **Code 탭**입니다. Chat은 파일 접근이 없고, Cowork는 혼자 알아서 일하는 백그라운드 에이전트입니다 |

![노트북과 커피](https://images.unsplash.com/photo-1482745637430-91c0bbcea3e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxsYXB0b3AlMjBzY3JlZW4lMjBjb2RlJTIwZWRpdG9yJTIwZGVza3xlbnwxfDB8fHwxNzkyMDQ5NjkwfDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Artem Sapegin](https://unsplash.com/@sapegin?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/macbook-pro-beside-brown-mug-DErxVSSQNdM?utm_source=spice-bandit-blog&utm_medium=referral)*

## 시작 전에 — 준비물은 두 개뿐입니다

답부터: **유료 구독 하나, 그리고 작업할 폴더 하나**입니다.

| 준비물 | 확인 방법 |
|---|---|
| **유료 구독** | Pro·Max·Team·Enterprise 중 하나. Code 탭에서 업그레이드 안내가 뜨면 아직 없는 상태입니다 |
| **데스크톱 앱** | macOS(인텔·애플실리콘 통합 빌드), Windows(x64 / ARM64 별도), Linux(우분투·데비안은 apt로, **베타**) |
| ~~Node.js·CLI~~ | **불필요.** 앱이 클로드 코드를 포함합니다 |
| **작업할 폴더** | 내 컴퓨터에 있는 프로젝트 폴더 하나. 처음이면 **내가 잘 아는 작은 프로젝트**로 시작하는 게 가장 빠릅니다 |

마지막 줄이 의외로 중요합니다. 공식 문서도 "처음엔 잘 아는 작은 프로젝트로 시작하라"고 권합니다. 코드를 모르는 폴더에서 시작하면 클로드가 무엇을 바꿨는지 판단할 수 없어서, 결과를 검토할 수가 없습니다.

## 1단계 — 앱 설치하고 로그인

답부터: **운영체제에 맞는 설치 파일을 받아 실행하고, 앱을 열어 Anthropic 계정으로 로그인**합니다.

1. 공식 문서의 다운로드 링크에서 내 운영체제용 설치 파일을 받습니다 (macOS는 인텔·애플실리콘 공용 한 개, Windows는 **x64와 ARM64가 다른 파일**입니다)
2. 설치한 뒤 실행합니다 — macOS는 응용 프로그램 폴더, Windows는 시작 메뉴, Linux는 앱 런처
3. **Anthropic 계정으로 로그인**합니다

리눅스(우분투·데비안)는 아직 **베타**이고 apt로 설치합니다. 윈도우에서 ARM64 기기(스냅드래곤 계열 노트북 등)를 쓰는데 x64 파일을 받으면 설치가 꼬일 수 있으니, 내 기기가 어느 쪽인지 먼저 확인하세요.

## 2단계 — Code 탭 열기 (탭 3개의 차이)

답부터: **화면 상단 가운데의 Code 탭**입니다. 여기서 많이 헤매는데, 앱에 탭이 세 개 있고 셋 다 "클로드"지만 하는 일이 다릅니다.

| 탭 | 하는 일 | 내 파일을 건드리나 |
|---|---|---|
| **Chat** | claude.ai와 비슷한 일반 대화 | **아니요 — 파일 접근 없음** |
| **Cowork** | 내가 다른 일을 하는 동안 **혼자 알아서** 작업을 진행하는 백그라운드 에이전트 | 예 (자율적으로) |
| **Code** | **대화형 코딩.** 내 로컬 파일에 직접 접근하고, 권한 모드에 따라 변경 전 승인을 받거나 변경 후 검토하게 함 | **예 (이 글의 대상)** |

초보자가 "클로드한테 내 코드 고쳐달라고 했는데 파일이 안 바뀐다"고 하는 경우, 대개 **Chat 탭에서 물어본 것**입니다. Chat은 설계상 파일을 못 봅니다.

**Code 탭을 눌렀을 때 생기는 세 가지 상황**

- **업그레이드 안내가 뜬다** → 유료 구독이 없는 상태입니다. 구독 후 다시 시도합니다
- **온라인 로그인을 요구한다** → 로그인을 마친 뒤 **앱을 재시작**합니다
- **403 오류가 뜬다** → 인증 문제로, 공식 문서의 인증 트러블슈팅 항목을 보면 됩니다

## 3단계 — 어디서 실행할지, 어느 폴더에서 할지 고르기

답부터: 처음이면 **Local**을 고르고 **Select folder**로 내 프로젝트 폴더를 지정합니다.

Code 탭은 실행 위치를 네 가지로 고를 수 있습니다. 초보자가 알아야 할 건 사실상 첫 줄 하나입니다.

| 선택 | 어디서 돌아가나 | 언제 쓰나 |
|---|---|---|
| **Local** | **내 컴퓨터, 내 파일 직접** | **처음이면 이것.** 가장 단순하고 결과를 눈으로 확인하기 쉽습니다 |
| **Cloud** | 클라우드 — **앱을 닫아도 계속 진행** | 오래 걸리는 작업을 걸어두고 나중에 확인할 때 |
| **SSH** | 내 서버·클라우드 VM·개발 컨테이너 등 원격 머신 | 작업 대상이 원격에 있을 때. 첫 연결 시 원격에 클로드 코드를 자동 설치해 줍니다 |
| **WSL** (윈도우) | WSL 2 배포판 안 — 클로드 코드·도구·git이 리눅스 쪽에서 네이티브 경로로 실행 | 윈도우에서 리눅스 환경으로 개발할 때 |

그다음 **보내기 버튼 옆 드롭다운에서 모델을 고릅니다.** 나중에 같은 드롭다운에서 바꿀 수 있으니 처음엔 기본값으로 두고 진행해도 됩니다.

## 4단계 — 첫 지시 내리기

답부터: **평소 말하듯이 한국어로 적어도 됩니다.** 공식 문서가 첫 작업으로 제시하는 예시는 이 세 가지입니다.

- `TODO 주석을 찾아서 고쳐줘` (원문: *Find a TODO comment and fix it*)
- `메인 함수에 테스트를 추가해줘` (원문: *Add tests for the main function*)
- `이 코드베이스용 CLAUDE.md를 만들어줘` (원문: *Create a CLAUDE.md with instructions for this codebase*)

세 번째가 특히 초보자에게 유용합니다. **CLAUDE.md**는 프로젝트 루트에 두는 마크다운 파일로, 클로드 코드가 **모든 세션 시작 때마다 읽는** 파일입니다. 코딩 규칙·아키텍처 결정·선호 라이브러리 같은 걸 적어두면 매번 설명하지 않아도 됩니다. 처음엔 클로드에게 직접 만들어 달라고 하는 편이 빠릅니다.

이렇게 시작한 대화 하나를 **세션(session)**이라고 부릅니다. 세션마다 자기 맥락과 변경 내역을 따로 관리합니다.

![노트북으로 학습하는 모습](https://images.pexels.com/photos/9159651/pexels-photo-9159651.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Mikhail Nilov](https://www.pexels.com/@mikhail-nilov) on [Pexels](https://www.pexels.com/photo/woman-in-white-long-sleeves-using-a-laptop-9159651/)*

## 5단계 — 변경 내용 검토하고 수락하기 (가장 중요한 단계)

답부터: **보내기 버튼 옆의 권한 모드(permission mode)가 무엇으로 돼 있는지에 따라 동작이 완전히 달라집니다.** 이 단계를 모르고 넘어가면 "왜 내 파일이 벌써 바뀌었지" 또는 "왜 아무것도 안 바뀌지"가 됩니다.

- **Auto 또는 Accept edits** — 클로드가 **먼저 파일을 바꾸고**, `+12 -1` 같은 표시가 나타나 그걸 눌러 diff(변경 내용 비교)로 확인합니다. 단 Accept edits는 **파일 편집과 `mkdir`·`touch`·`mv` 같은 기본 파일 명령만 자동 수락**하고, 그 밖의 터미널 명령은 여전히 물어봅니다
- **Manual** — 클로드가 변경을 **제안하고 내 승인을 기다립니다.** 내가 수락하기 전까지 **파일은 바뀌지 않습니다.** 거절하면 클로드가 어떻게 할지 다시 물어봅니다

Manual 모드에서는 이 세 가지가 보입니다.

1. 각 파일에서 **무엇이 어떻게 바뀔지** 보여주는 diff 화면
2. 변경별 **Accept / Reject 버튼**
3. 클로드가 작업하는 동안의 실시간 업데이트

### 권한 모드 — 자율성과 통제의 교환

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px;margin:24px 0;">
<svg viewBox="0 0 760 290" style="width:100%;height:auto" role="img" aria-label="클로드 코드 데스크톱 앱의 주요 권한 모드를 통제 수준 순서로 배열한 그림. Plan은 읽기와 탐색은 하되 소스를 수정하지 않고, Manual은 편집과 명령 실행 전에 매번 승인을 받고, Accept edits는 파일 편집과 기본 파일 명령만 자동 수락하며 그 외 터미널 명령은 묻고, Auto는 일상적 확인 없이 진행하되 셸과 네트워크 실행 전 분류기가 요청과 맞는지 검사한다.">
<text x="0" y="18" font-size="15" font-weight="700" fill="#23201D">권한 모드 — 왼쪽이 내 통제가 강하고, 오른쪽이 클로드 자율이 큽니다</text>
<text x="0" y="38" font-size="12" fill="#8A8378">공식 권고: 복잡한 작업은 Plan부터 → 승인 후 Accept edits·Manual로 실행</text>
<line x1="40" y1="186" x2="720" y2="186" stroke="#E5DECF" stroke-width="1" />
<text x="40" y="208" font-size="11" fill="#8A8378">내 통제 강함</text>
<text x="720" y="208" font-size="11" fill="#8A8378" text-anchor="end">클로드 자율 큼</text>
<rect x="40" y="56" width="160" height="118" fill="#1B4F8A" rx="4" />
<text x="56" y="80" font-size="13" font-weight="700" fill="#FAF6EE">Plan</text>
<text x="56" y="102" font-size="11.5" fill="#FAF6EE">읽기·탐색은 하되</text>
<text x="56" y="120" font-size="11.5" fill="#FAF6EE">소스는 수정 안 함</text>
<text x="56" y="146" font-size="11" fill="#A8BDD2">범위 큰 작업 전에</text>
<text x="56" y="163" font-size="11" fill="#A8BDD2">접근 방법부터 볼 때</text>
<rect x="212" y="56" width="160" height="118" fill="#4E7FA8" rx="4" />
<text x="228" y="80" font-size="13" font-weight="700" fill="#FAF6EE">Manual</text>
<text x="228" y="102" font-size="11.5" fill="#FAF6EE">파일 편집·명령 실행</text>
<text x="228" y="120" font-size="11.5" fill="#FAF6EE">전에 매번 물어봄</text>
<text x="228" y="146" font-size="11" fill="#FAF6EE" font-weight="700">★ 초보자 시작점</text>
<text x="228" y="163" font-size="11" fill="#E5DECF">수락 전엔 파일 그대로</text>
<rect x="384" y="56" width="160" height="118" fill="#A8BDD2" rx="4" />
<text x="400" y="80" font-size="13" font-weight="700" fill="#23201D">Accept edits</text>
<text x="400" y="102" font-size="11.5" fill="#23201D">파일 편집·기본 파일명령</text>
<text x="400" y="120" font-size="11.5" fill="#23201D">(mkdir·touch·mv)은 자동</text>
<text x="400" y="146" font-size="11" fill="#23201D">그 외 터미널 명령은</text>
<text x="400" y="163" font-size="11" fill="#23201D">여전히 물어봄</text>
<rect x="556" y="56" width="164" height="118" fill="#23201D" rx="4" />
<text x="572" y="80" font-size="13" font-weight="700" fill="#FAF6EE">Auto</text>
<text x="572" y="102" font-size="11.5" fill="#FAF6EE">일상적 확인 없이 진행</text>
<text x="572" y="120" font-size="11.5" fill="#FAF6EE">셸·네트워크 실행 전엔</text>
<text x="572" y="146" font-size="11" fill="#A8BDD2">분류기가 요청과 맞는지</text>
<text x="572" y="163" font-size="11" fill="#A8BDD2">검사한 뒤 실행</text>
<text x="0" y="246" font-size="12" fill="#8A8378">※ Auto는 모델 요건(Opus 4.6+·Sonnet 4.6+·Haiku 5.5·Fable)이 있고 관리자가 끌 수 있습니다.</text>
<text x="0" y="268" font-size="12" fill="#8A8378">※ 이 밖에 Bypass permissions가 있으나 공식 문서가 샌드박스·VM 전용으로 못 박은 모드입니다.</text>
</svg>
<figcaption style="font-size:13px;color:#8A8378;margin-top:10px;">네 모드의 동작 설명과 "복잡한 작업은 Plan부터" 권고는 클로드 코드 공식 문서(2026-10-15 확인) 기준입니다. 그 아래 "작고 처음이면 Manual부터"는 글쓴이 의견입니다.</figcaption>
</figure>

**공식 문서의 권고는 "복잡한 작업이라면 Plan으로 접근 방법을 먼저 받고, 승인한 뒤 Accept edits나 Manual로 실행하라"입니다.** 그래서 작업 범위로 나누는 편이 맞습니다 — **범위가 큰 작업이면 Plan부터, 작고 처음 해보는 작업이면 Manual부터**.

제가 초보자에게 Manual을 권하는 이유는 따로 있습니다(이건 제 의견입니다). **처음 필요한 건 결과물이 아니라 "클로드가 무슨 일을 하는지 보는 경험"**이기 때문입니다. diff를 몇 번 읽어보면 어디를 건드리는지 감이 생기고, 그때 Accept edits로 옮기면 속도가 붙습니다. 반대로 처음부터 Auto로 두면 뭐가 바뀌었는지 모르는 상태로 파일이 누적됩니다.

**Auto는 아예 안 보일 수도 있습니다.** 모델 요건(Opus 4.6 이상·Sonnet 4.6 이상·Haiku 5.5·Fable 계열)이 붙고, 회사 계정은 관리자가 managed settings의 `disableAutoMode`로 끌 수 있어 모드 선택기에 나타나지 않는 경우가 있습니다. 그리고 이 네 개 말고 **Bypass permissions**(권한 확인을 전면 생략, CLI의 `--dangerously-skip-permissions`에 해당)가 하나 더 있는데, 공식 문서가 **"샌드박스 컨테이너나 VM에서만 쓰라"**고 못 박은 모드입니다. 초보자 선택지가 아니므로 여기서는 다루지 않습니다.

## 처음 쓸 때 꼭 알아둘 네 가지

답부터: **멈추는 법, 파일을 집어주는 법, 되돌려 보는 법, 그리고 검토를 맡기는 법**입니다.

**① 중간에 끼어들 수 있습니다.** 작업이 끝날 때까지 기다리거나 처음부터 다시 시작할 필요가 없습니다.
- **정지 버튼**을 누르면 즉시 중단됩니다 (단축키 **Esc**)
- 또는 **수정 지시를 타이핑하고 Enter** — 돌아가는 작업을 멈추지 않고 방향만 바꿉니다

**② 맥락을 더 주면 결과가 좋아집니다.**
- 프롬프트 창에 **`@파일명`**을 치면 특정 파일을 대화에 끌어옵니다
- 첨부 버튼으로 **이미지·PDF**를 넣거나, 파일을 **끌어다 놓기**도 됩니다

**③ 변경 내용은 커밋 전에 봅니다.** 클로드가 파일을 편집하면 `+12 -1` 표시가 나타납니다. 그걸 누르면 diff 화면이 열려 파일별로 검토할 수 있고, **특정 줄을 클릭해 코멘트를 달 수 있고, 다 쓴 뒤 macOS는 `Cmd+Enter`, 윈도우는 `Ctrl+Enter`로 코멘트를 한꺼번에 제출합니다.** 클로드가 그걸 읽고 수정합니다.

**④ 검토 자체를 클로드에게 맡길 수도 있습니다.** 프롬프트 창에 **`/code-review`**를 입력하면 클로드가 자기 변경을 스스로 리뷰합니다.

반복 작업이 생기면 **`/`를 입력하거나 + → Slash commands**에서 내장 명령·커스텀 스킬·플러그인 스킬을 찾아 쓸 수 있습니다.

## 익숙해진 다음에 — 데스크톱 앱에만 있는 것들

터미널 CLI 대신 데스크톱 앱을 쓰는 실질적 이유가 여기 있습니다.

| 기능 | 무엇을 할 수 있나 |
|---|---|
| **작업 공간 배치** | 채팅·diff·터미널·파일·브라우저 창을 원하는 배치로 끌어다 놓기. 터미널은 **Ctrl+`** |
| **앱 미리보기** | 개발 서버를 띄우면 브라우저 창에 앱이 열리고, **클로드가 실행 중인 앱을 직접 보면서** 엔드포인트를 테스트하고 로그를 확인하며 고침 |
| **병렬 세션** | 사이드바에서 여러 작업을 동시에. 각 세션을 **Git worktree로 분리**할 수도 있음 |
| **사이드 챗** | 메인 대화를 흐트러뜨리지 않고 따로 질문 |
| **클라우드로 넘기기** | 오래 걸리는 작업을 클라우드로 보내 앱을 닫아도 계속 진행. 이미 시작한 세션도 옮길 수 있음 |
| **PR 추적** | PR을 연 뒤 CI 결과를 모니터링하고, 실패를 자동 수정하거나 체크 통과 시 병합 |
| **예약 작업** | 매일 아침 코드 리뷰, 주간 의존성 점검처럼 반복 작업을 정해진 주기로 실행 |
| **플러그인** | **+ 버튼 → Plugins**에서 스킬·에이전트·MCP 서버를 추가 |

이 중 초보자가 가장 빨리 체감하는 건 **앱 미리보기**입니다. "코드를 고쳤는데 화면이 왜 이러지"를 클로드가 직접 보고 고치는 흐름은 터미널에서는 만들기 번거롭습니다.

## So What — 터미널 장벽이 사라진 게 핵심입니다

클로드 코드는 원래 터미널 도구였습니다. 그래서 "AI 코딩을 해보고 싶지만 CLI부터 막힌다"는 사람이 많았습니다. 데스크톱 앱이 바꾼 건 기능이 아니라 **진입 지점**입니다. 같은 엔진에 같은 `CLAUDE.md`·설정·MCP 서버가 돌아가고, **설치 단계에서 Node.js와 CLI가 빠졌습니다.**

그래서 처음 시작하는 사람에게 권하는 순서는 이렇습니다.

1. **데스크톱 앱 + Local + Manual 모드**로 작은 프로젝트에서 시작해, diff를 직접 읽으며 클로드가 무엇을 바꾸는지 눈에 익힌다
2. `CLAUDE.md`를 만들어 프로젝트 규칙을 적어둔다 — 매번 설명하는 비용이 사라진다
3. 패턴이 보이면 **Accept edits**로 옮겨 속도를 올리고, 반복 작업은 슬래시 명령으로 묶는다
4. 터미널이 필요해지는 시점이 오면 그때 CLI를 깔면 된다. 같은 엔진이라 `CLAUDE.md`·설정·MCP 서버가 그대로 따라오고, 이동도 됩니다 — **터미널 세션은 `/desktop`으로 데스크톱에서 이어받고**(macOS·x64 윈도우), **웹·모바일에 걸어둔 작업은 `claude --teleport`로 터미널로 당겨옵니다**. 둘 다 claude.ai 구독이 필요합니다. 반대로 **데스크톱 세션 자체**는 세션 메뉴의 **Open in**에서 Cloud나 설치된 에디터로 넘깁니다(단 SSH·WSL로 돌아가는 세션은 이 방식으로 클라우드에 못 옮깁니다)

**순서를 거꾸로 하지 않는 게 중요합니다.** 도구 세팅을 완벽히 갖춘 뒤 시작하려 하면 대개 시작을 못 합니다. 앱을 깔고, 아는 폴더를 열고, "TODO 주석 하나 고쳐줘"를 쳐보는 게 가장 빠른 출발입니다.

---

**함께 보면 좋은 글**
- [클로드 코드 요금제 비교 2026 — 프로로 충분할까](/blog/2026-07-12-claude-code-pricing-pro-max-comparison/)
- [VS Code + Claude Code 사용법 완전 가이드](/blog/vscode-claude-code-usage-guide/)
- [Claude Code 경쟁 도구 비교 2026](/blog/2026-06-27-claude-code-alternatives-comparison-2026/)

**출처**
- [Claude Code — 데스크톱 앱 시작하기(공식 문서)](https://code.claude.com/docs/en/desktop-quickstart) — 설치·Code 탭·환경 선택·권한 모드·첫 세션 절차
- [Claude Code 개요(공식 문서)](https://code.claude.com/docs/en/overview) — 지원 표면(터미널·IDE·데스크톱·웹), 앱에 클로드 코드가 포함된다는 설명
- [Claude Code 데스크톱 앱 레퍼런스(공식 문서)](https://code.claude.com/docs/en/desktop) — 권한 모드, diff 검토, 병렬 세션, 작업 공간 배치
- [CLAUDE.md와 메모리(공식 문서)](https://code.claude.com/docs/en/memory) — 세션마다 읽히는 프로젝트 지침 파일

*※ 화면 구성과 메뉴 이름은 앱 업데이트로 달라질 수 있습니다. 이 글은 2026년 10월 15일 기준 공식 문서를 확인해 작성했습니다.*
