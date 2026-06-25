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

  // Tag pages — use the most recent post date for that tag
  const tagLatest = new Map<string, string>();
  for (const post of koPosts) {
    const postDate = toDate(post.data.updatedDate ?? post.data.pubDate);
    for (const tag of post.data.tags) {
      const cur = tagLatest.get(tag);
      if (!cur || postDate > cur) tagLatest.set(tag, postDate);
    }
  }
  for (const [tag, lastmod] of tagLatest) {
    // 태그 페이지의 실제 URL은 encodeURIComponent(tag)로 생성되므로 sitemap도 동일하게 인코딩한다.
    entries.push(entry(`${base}/tag/${encodeURIComponent(tag)}/`, lastmod, 'weekly', '0.5'));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
