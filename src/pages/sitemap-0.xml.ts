import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { CATEGORY_SLUGS } from '../lib/categories';

function toDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

// XML 본문에서 위험한 문자를 이스케이프(loc에 &가 그대로 들어가면 XML이 깨진다)
function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function entry(loc: string, lastmod: string, changefreq: string, priority: string) {
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.href ?? 'https://www.baseload.co.kr/').replace(/\/$/, '');
  const buildDate = toDate(new Date());

  const [koPosts, enPosts] = await Promise.all([
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('blog-en', ({ data }) => !data.draft),
  ]);

  const entries: string[] = [];

  // Homepage
  entries.push(entry(`${base}/`, buildDate, 'daily', '1.0'));

  // Korean blog posts — lastmod = updatedDate ?? pubDate
  for (const post of koPosts) {
    const lastmod = toDate(post.data.updatedDate ?? post.data.pubDate);
    entries.push(entry(`${base}/blog/${post.id}/`, lastmod, 'weekly', '0.8'));
  }

  // English blog posts
  for (const post of enPosts) {
    const lastmod = toDate(post.data.updatedDate ?? post.data.pubDate);
    entries.push(entry(`${base}/en/blog/${post.id}/`, lastmod, 'weekly', '0.8'));
  }

  // Category listing pages
  for (const cat of CATEGORY_SLUGS) {
    entries.push(entry(`${base}/category/${cat}/`, buildDate, 'daily', '0.6'));
  }

  // 정적 정보·정책 페이지 (신뢰 페이지 — 소개·연락처·개인정보처리방침·이용약관)
  for (const p of ['about', 'contact', 'privacy', 'terms']) {
    entries.push(entry(`${base}/${p}/`, buildDate, 'monthly', '0.5'));
  }

  // 태그 페이지·페이지네이션은 noindex 처리했으므로 sitemap에서 제외한다.
  // (태그 263개 같은 얇은 자동생성 페이지가 sitemap을 뒤덮으면 '가치 낮은 콘텐츠' 판정에 불리)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
