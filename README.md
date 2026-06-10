# 고구미 자동화 블로그

Astro 정적 블로그. Claude Code가 글 생성 → git push → Vercel 자동 배포.

## 1. 처음 세팅 (맥북에서 1회)

```bash
cd ~/blog
npm install
npm run dev   # http://localhost:4321 미리보기
```

GitHub 새 저장소 만들고 연결 (예: spicebandit/blog):

```bash
git init && git add . && git commit -m "init"
git remote add origin git@github.com:spicebandit/blog.git
git push -u origin main
```

Vercel에서 Import → 끝. 이후 push만 하면 자동 배포.

## 2. 배포 직후 할 일 (SEO)

1. `astro.config.mjs`의 `site`와 `public/robots.txt`의 Sitemap URL을 실제 주소로 변경
2. **Google Search Console** (search.google.com/search-console)
   - 속성 추가 → HTML 태그 인증 코드 발급 → `src/layouts/Base.astro`의 google-site-verification 주석 해제 후 코드 입력
   - 사이트맵 제출: `/sitemap-index.xml`
3. **네이버 서치어드바이저** (searchadvisor.naver.com)
   - 사이트 등록 → HTML 태그 인증 → naver-site-verification 주석 해제 후 코드 입력
   - 사이트맵 제출: `/sitemap-index.xml`, RSS 제출: `/rss.xml`

## 3. 평소 사용법

Claude Code 실행 후:

```
"퇴직연금 DC형 운용 방법 주제로 블로그 글 써서 발행해줘"
```

CLAUDE.md의 규칙대로 SEO 최적화된 글을 생성하고 push까지 합니다.
텔레그램 연동이 되어 있으니 폰에서 메시지만 보내도 동일하게 동작.

## 구조

- `src/content/blog/` — 글(마크다운). 여기에 파일 추가 = 발행
- `src/layouts/Base.astro` — 공통 레이아웃 + SEO 메타태그
- `CLAUDE.md` — Claude Code 글쓰기 규칙
