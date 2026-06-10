# 블로그 자동 발행 가이드 (Claude Code용)

이 저장소는 Astro 정적 블로그다. 글은 `src/content/blog/*.md`에 저장되며,
main 브랜치에 push하면 Vercel이 자동 배포한다.

## 글 작성 규칙 (/blog 커맨드 또는 "OO 주제로 글 써줘" 요청 시)

1. 파일명: 영문 소문자 + 하이픈 슬러그 (예: `ai-automation-guide.md`) — URL이 되므로 SEO 키워드 포함
2. frontmatter 필수 항목:
   - `title`: 타겟 키워드를 앞쪽에 포함, 30자 내외
   - `description`: 80~150자 메타 디스크립션. 검색결과에 노출되는 문장이므로 클릭을 유도하는 요약
   - `pubDate`: 오늘 날짜 (YYYY-MM-DD)
   - `tags`: 2~4개
3. 본문 SEO 규칙:
   - h2(`##`) 소제목 3개 이상, 소제목에도 연관 키워드 자연스럽게 포함
   - 분량 1,500자 이상 (정보성 글 기준)
   - 첫 문단에 핵심 키워드 포함, 질문에 바로 답하는 구조
   - 과장/허위 정보 금지, 출처가 필요한 수치는 명시
4. 발행:
   ```bash
   git add . && git commit -m "post: <글 제목>" && git push
   ```
5. 발행 후 사용자에게 글 URL 예상 경로(`/blog/<슬러그>/`)를 알려줄 것

## 절대 하지 말 것
- draft가 아닌 기존 글 무단 수정/삭제
- astro.config.mjs의 site 값 변경 (사용자 승인 필요)
