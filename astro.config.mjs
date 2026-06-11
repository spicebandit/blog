import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: 배포 후 실제 도메인으로 변경 (Vercel 주소 또는 커스텀 도메인)
export default defineConfig({
  site: 'https://blog-x84m.vercel.app',
  integrations: [sitemap()],
});
