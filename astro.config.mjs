import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  site: 'https://www.baseload.co.kr',
  integrations: [sitemap()],
  markdown: {
    // 외부 링크(유튜브·Unsplash 등)는 새 창으로 열고 보안 속성 부여.
    // 내부(상대) 링크는 그대로 같은 탭에서 이동한다.
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
});
