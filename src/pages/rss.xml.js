import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { isNoindexCategory } from '../lib/categories';

export async function GET(context) {
  // 색인 제외 카테고리(bernie)는 피드로도 내보내지 않는다 — 검색엔진이 RSS로 URL을 줍는다
  const posts = (await getCollection('blog', ({ data }) => !data.draft && !data.noindex && !isNoindexCategory(data.category)))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return rss({
    title: 'BASELOAD',
    description: '에너지·경제·AI·일상을 다루는 뉴스 블로그',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
