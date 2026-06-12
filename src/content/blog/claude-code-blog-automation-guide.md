---
title: "Claude Code로 블로그 자동화 시작하기"
description: "Claude Code로 블로그 글 작성부터 발행까지 자동화하는 방법을 단계별로 정리했습니다. Astro와 Vercel을 연결해 git push 한 번으로 배포되는 파이프라인을 만들어 보세요."
pubDate: 2026-06-11
category: ai
tags: ["Claude Code", "블로그 자동화", "Astro"]
---

Claude Code로 블로그 자동화를 시작하면 글 작성, 마크다운 변환, 배포까지 이어지는 반복 작업을 한 번에 위임할 수 있습니다. 이 글에서는 정적 블로그(Astro)와 Vercel을 연결해 "주제만 던지면 글이 발행되는" 파이프라인을 어떻게 구성하는지 단계별로 설명합니다. 처음 블로그 자동화를 고민하는 1인 운영자나 개발자라면 이 구조를 그대로 따라 해 볼 수 있습니다.

![person writing on brown wooden table near white ceramic mug](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxibG9nJTIwd3JpdGluZyUyMHdvcmtmbG93fGVufDF8MHx8fDE3ODExODc1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Unseen Studio](https://unsplash.com/@uns__nstudio?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/person-writing-on-brown-wooden-table-near-white-ceramic-mug-s9CC2SKySJM?utm_source=spice-bandit-blog&utm_medium=referral)*

## Claude Code 블로그 자동화의 핵심 구조

블로그 자동화의 출발점은 "어디서 글이 생성되고, 어떻게 배포되는가"를 명확히 나누는 것입니다. 이 블로그는 세 단계로 단순하게 돌아갑니다.

1. **글 생성**: Claude Code가 주제를 받아 SEO 규칙에 맞는 마크다운 파일을 `src/content/blog/`에 만듭니다.
2. **버전 관리**: 생성된 글을 git으로 커밋하고 main 브랜치에 push합니다.
3. **자동 배포**: Vercel이 main 브랜치의 변경을 감지해 정적 사이트를 다시 빌드하고 배포합니다.

핵심은 **사람이 손대는 단계를 최소화**하는 것입니다. 글의 형식(파일명 규칙, frontmatter 필수 항목, 본문 구조)을 미리 `CLAUDE.md`에 규칙으로 적어 두면, 매번 같은 품질의 글이 자동으로 만들어집니다. 즉 자동화의 품질은 "프롬프트"가 아니라 "저장소에 적어 둔 규칙"에서 나옵니다.

## Astro와 Vercel로 발행 파이프라인 만들기

자동화 파이프라인을 직접 구성하려면 다음 요소만 갖추면 됩니다. 복잡한 CI 설정이 필요 없다는 점이 정적 블로그의 장점입니다.

![MacBook Pro near white open book](https://images.unsplash.com/photo-1501504905252-473c47e087f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxibG9nJTIwd3JpdGluZyUyMHdvcmtmbG93fGVufDF8MHx8fDE3ODExODc1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Nick Morrison](https://unsplash.com/@nickmorrison?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/macbook-pro-near-white-open-book-FHnnjk1Yj7Y?utm_source=spice-bandit-blog&utm_medium=referral)*

- **Astro 프로젝트**: 콘텐츠 컬렉션(content collections) 기능으로 마크다운 글의 스키마를 강제합니다. `title`, `description`, `pubDate`, `tags` 같은 필드를 스키마로 정의하면 형식이 어긋난 글은 빌드 단계에서 바로 걸러집니다.
- **GitHub 저장소**: main 브랜치를 배포 기준으로 삼습니다. 글 하나가 곧 커밋 하나가 되므로, 발행 이력이 git 히스토리에 그대로 남습니다.
- **Vercel 연결**: GitHub 저장소를 Vercel에 연결해 두면 push가 곧 배포 트리거가 됩니다. 별도의 배포 명령이 필요 없습니다.

이 구조에서 글을 발행하는 명령은 결국 다음 한 줄로 끝납니다.

```bash
git add . && git commit -m "post: 글 제목" && git push
```

push가 끝나면 Vercel이 빌드를 시작하고, 보통 1~2분 안에 `/blog/<슬러그>/` 경로로 새 글이 공개됩니다. 슬러그는 파일명이 그대로 URL이 되므로, 파일명에 SEO 키워드를 영문 하이픈 형태로 넣는 것이 중요합니다.

## SEO 규칙을 자동화에 녹이는 방법

자동화가 SEO 품질까지 보장하려면, 검색 최적화 규칙을 사람이 매번 기억하는 대신 저장소 규칙으로 고정해야 합니다. 이 블로그가 따르는 핵심 규칙은 다음과 같습니다.

![person using MacBook Pro](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGxhcHRvcHxlbnwxfDB8fHwxNzgxMTg3NTMwfDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Glenn Carstens-Peters](https://unsplash.com/@glenncarstenspeters?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/person-using-macbook-pro-npxXWgQ33ZQ?utm_source=spice-bandit-blog&utm_medium=referral)*

- **제목(title)**: 타겟 키워드를 앞쪽에 배치하고 30자 내외로 작성합니다. 검색 결과에서 잘리지 않으면서 핵심 키워드가 먼저 보이도록 하기 위함입니다.
- **메타 디스크립션(description)**: 80~150자로 작성하고, 검색 결과에 노출되는 문장이므로 클릭을 유도하는 요약을 넣습니다.
- **본문 구조**: `##` 소제목을 3개 이상 두고, 각 소제목에도 연관 키워드를 자연스럽게 포함합니다. 첫 문단에는 핵심 키워드를 넣어 질문에 바로 답하는 구조로 시작합니다.
- **분량과 정확성**: 정보성 글은 1,500자 이상을 기준으로 하되, 과장이나 허위 정보를 넣지 않고 수치가 필요한 부분은 출처를 명시합니다.

이렇게 규칙을 `CLAUDE.md`에 문서로 적어 두면, Claude Code는 글을 쓸 때마다 같은 기준을 적용합니다. 사람이 매번 SEO 체크리스트를 확인하지 않아도 일정한 품질이 유지되는 것이 자동화의 진짜 이점입니다.

## 정리: 작게 시작해서 규칙으로 키우기

Claude Code 블로그 자동화는 거창한 인프라가 아니라 **명확한 규칙 + 단순한 배포 파이프라인**의 조합입니다. Astro로 형식을 강제하고, GitHub와 Vercel로 push 기반 배포를 연결하고, SEO 규칙을 저장소에 문서화하는 것. 이 세 가지만 갖추면 "주제만 정하면 글이 발행되는" 구조가 완성됩니다. 먼저 글 한 편을 이 파이프라인으로 발행해 보고, 운영하면서 규칙을 다듬어 가는 방식을 추천합니다.
