import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.baseload.co.kr',
  // 슬래시 없는 주소를 있는 쪽으로 통일한다. 기본값(ignore)에서는 같은 글이
  // /path 와 /path/ 두 주소로 모두 200을 반환해 GA4가 별개 페이지로 집계했다
  // (2026-08-23 확인: 클로드코드 요금제 영문판이 인기글에 두 번 잡힘).
  trailingSlash: 'always',
  // 정적 사이트 유지 + 일부 라우트(/api/admin-stats)만 서버 실행. 글 페이지는 그대로 정적.
  adapter: vercel(),
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [],
  markdown: {
    // 외부 링크(유튜브·Unsplash 등)는 새 창으로 열고 보안 속성 부여.
    // 내부(상대) 링크는 그대로 같은 탭에서 이동한다.
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
});
