---
title: "VS Code 사용법: 탭 지옥 탈출과 Claude Code 동거기"
description: "창 20개 띄우던 분들을 위한 VS Code 사용법. 폴더 열기, 파일 편집, 터미널, Claude Code 대화까지 한 화면에서 끝내는 작업 환경을 화면 영역별로 쉽게 정리했습니다."
pubDate: 2026-06-12T10:23:26+09:00
category: ai
tags: ["VS Code", "Claude Code", "개발 환경"]
---

VS Code 사용법을 한 문장으로 요약하면 "프로젝트 폴더 하나를 중심으로, 코딩에 필요한 모든 걸 한 화면에서 끝내는 법"입니다. 브라우저 탭 20개, 메모장, 터미널 창, AI 채팅 창을 번갈아 띄우며 마우스로 창 사이를 헤매던 분이라면 이 글이 반갑게 느껴질 겁니다. 특히 **Claude Code를 쓴다면 VS Code를 강력히 추천**합니다. 작업 중인 프로젝트(폴더)를 중심으로 파일 탐색·편집·터미널·AI 대화가 한 프로그램 안에 들어오기 때문입니다. 이 글에서는 VS Code 화면을 영역별로 나눠, 처음 쓰는 사람도 바로 따라 할 수 있게 정리했습니다.

![laptop screen displaying colorful code](https://images.unsplash.com/photo-1607799279861-4dd421887fb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHx2aXN1YWwlMjBzdHVkaW8lMjBjb2RlJTIwZWRpdG9yJTIwc2NyZWVufGVufDF8MHx8fDE3ODEyMjczMDN8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Mohammad Rahmani](https://unsplash.com/@afgprogrammer?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/laptop-screen-displaying-colorful-code-8qEB0fTe9Vw?utm_source=spice-bandit-blog&utm_medium=referral)*

## 왜 Claude Code를 VS Code에서 써야 할까

Claude Code는 터미널에서도 잘 돌아가지만, **VS Code 안에서 쓰면 "프로젝트 폴더"가 작업의 중심**이 됩니다. 핵심은 컨텍스트입니다. 내가 작업하는 폴더를 통째로 열어 두면, Claude Code가 같은 폴더의 파일들을 보고 수정하고, 나는 그 변경을 바로 옆에서 눈으로 확인할 수 있습니다.

흩어져 있던 도구들이 하나로 합쳐지는 그림은 대략 이렇습니다.

- **이전**: 파일 탐색기(폴더 확인) + 메모장/에디터(코드 수정) + 터미널 앱(명령 실행) + 브라우저 AI 채팅(질문) → 창 4개를 알트탭으로 곡예
- **이후**: VS Code 한 창 = 왼쪽 폴더 + 가운데 편집기 + 아래 터미널 + 오른쪽 Claude Code 대화

창을 옮겨 다니며 "그 파일 어디 있더라"를 반복하지 않아도 됩니다. 화면 하나만 보면 되니까요. 아래 레이아웃을 머릿속에 넣어 두면 이 글의 나머지가 쉽게 읽힙니다.

```
┌──────┬───────────────────────────┬──────────────┐
│ 왼쪽 │  가운데 상단: 파일 편집      │   오른쪽:     │
│ 메뉴 │  (코드를 보고 고치는 곳)     │  Claude Code │
│ 폴더 ├───────────────────────────┤   대화 패널   │
│ 탐색 │  가운데 하단: 터미널         │  (AI와 대화)  │
│      │  (명령어 실행)              │              │
└──────┴───────────────────────────┴──────────────┘
```

## 왼쪽 메뉴: 폴더 열기와 파일 탐색

VS Code 사용법의 출발점은 **왼쪽 메뉴(액티비티 바 + 사이드바)**입니다. 화면 가장 왼쪽에 세로로 늘어선 아이콘들이 있고, 아이콘을 누르면 그 옆으로 사이드바 패널이 펼쳐집니다. 가장 많이 쓰는 것은 맨 위 아이콘입니다.

가장 먼저 할 일은 **폴더 열기**입니다. 상단 메뉴의 `File → Open Folder`(또는 단축키)로 작업 중인 프로젝트 폴더를 통째로 엽니다. 그러면 왼쪽에 그 폴더 안의 파일·하위 폴더가 트리 구조로 쭉 보입니다. 이게 모든 작업의 기준점이 됩니다.

왼쪽 세로 아이콘(액티비티 바)은 위에서부터 대략 이런 역할입니다.

- 📄 **탐색기(Explorer)**: 열어 둔 폴더의 파일 목록. 가장 자주 쓰는 화면입니다. 파일을 클릭하면 가운데 편집기에서 열립니다.
- 🔍 **검색(Search)**: 프로젝트 전체에서 특정 단어/코드를 한 번에 찾고 바꿉니다.
- 🔀 **소스 컨트롤(Source Control)**: git 변경 사항을 확인하고 커밋합니다. 어떤 파일이 바뀌었는지 한눈에 보입니다.
- ▶️ **실행/디버그(Run and Debug)**: 코드를 실행하거나 디버깅합니다.
- 🧩 **확장(Extensions)**: 플러그인을 설치합니다. Claude Code 확장도 여기서 설치합니다.

> 💡 참고: VS Code의 실제 왼쪽 메뉴(아이콘이 세로로 배치된 모습) 스크린샷을 이 자리에 넣으면 가장 직관적입니다. 본인 화면을 캡처해 두면 글을 다시 볼 때도 도움이 됩니다.

![black flat screen computer monitor](https://images.unsplash.com/photo-1607706189992-eae578626c86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHx2aXN1YWwlMjBzdHVkaW8lMjBjb2RlJTIwZWRpdG9yJTIwc2NyZWVufGVufDF8MHx8fDE3ODEyMjczMDN8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Mohammad Rahmani](https://unsplash.com/@afgprogrammer?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-flat-screen-computer-monitor-oXlXu2qukGE?utm_source=spice-bandit-blog&utm_medium=referral)*

## 가운데 상단: 파일을 보고 고치는 편집기

화면 가운데 위쪽은 **실제로 코드를 읽고 고치는 편집기 영역**입니다. 왼쪽 탐색기에서 파일을 클릭하면 여기에 열립니다. 여러 파일을 열면 위쪽에 브라우저처럼 **탭**으로 나란히 쌓이고, 탭을 클릭해 오갈 수 있습니다.

편집기에서 알아 두면 편한 기본기는 이 정도입니다.

- **문법 강조(색상)**: 코드 종류에 맞춰 색이 입혀져 가독성이 좋아집니다.
- **자동 저장**: `File → Auto Save`를 켜 두면 일일이 저장하지 않아도 됩니다.
- **나란히 보기(Split)**: 편집기를 좌우로 쪼개 두 파일을 동시에 비교할 수 있습니다.

Claude Code가 파일을 수정하면, 바로 이 편집기에서 **어디가 어떻게 바뀌었는지** 색으로 표시되어 확인됩니다. "AI가 뭘 바꿨는지 모르겠다"는 불안을 줄여 주는 부분입니다.

## 가운데 하단: 명령어를 실행하는 터미널

편집기 아래쪽에는 **터미널**이 들어옵니다. 별도의 터미널 앱을 따로 켤 필요 없이, `Terminal → New Terminal`(또는 단축키)로 VS Code 안에서 바로 명령어를 칠 수 있습니다. 열려 있는 폴더가 자동으로 작업 위치가 되므로 `cd`로 경로를 옮길 일도 줄어듭니다.

터미널에서 주로 하는 일은 이렇습니다.

- 프로젝트 실행(예: 개발 서버 켜기)이나 설치 명령
- `git add`, `git commit`, `git push` 같은 버전 관리
- 그리고 **`claude` 명령으로 Claude Code 실행** — 터미널 방식으로 쓸 때의 진입점입니다

편집기와 터미널이 위아래로 붙어 있으니, 코드를 고치고 → 바로 아래에서 실행해 결과를 확인하는 흐름이 끊기지 않습니다.

## 오른쪽: Claude Code와 대화하는 패널

화면 오른쪽은 **Claude Code와 대화하는 공간**입니다(확장을 설치하면 패널 형태로 붙습니다). 여기서 "이 함수 버그 고쳐줘", "이 폴더 구조 설명해줘", "이 글 발행해줘"처럼 자연어로 요청하면, Claude Code가 왼쪽에 열린 프로젝트의 파일들을 직접 읽고 고쳐 줍니다.

이 배치의 진짜 장점은 **"보면서 시킨다"**는 점입니다.

- 오른쪽에서 요청 → 가운데 편집기에서 변경 내용 확인 → 아래 터미널에서 실행/배포
- 모든 과정이 한 화면에서 일어나므로, AI에게 맡긴 작업을 눈으로 검토하며 진행할 수 있습니다

즉 VS Code는 Claude Code에게 "작업할 폴더와 도구"를 한 자리에 차려 주는 작업대 역할을 합니다.

## 정리: 한 화면에서 끝내는 작업 흐름

VS Code 사용법의 핵심은 화면을 네 영역으로 기억하는 것입니다. **왼쪽(폴더·파일 탐색) → 가운데 위(편집) → 가운데 아래(터미널) → 오른쪽(Claude Code 대화)**. 이 구조에 익숙해지면 창을 옮겨 다니던 습관이 사라지고, 프로젝트 폴더 하나를 중심으로 탐색·수정·실행·AI 협업이 매끄럽게 이어집니다. 아직 Claude Code를 터미널로만 쓰고 있다면, 오늘 작업 폴더를 VS Code로 열어 보는 것부터 시작해 보세요. 탭 지옥에서 벗어나는 첫걸음이 됩니다.
