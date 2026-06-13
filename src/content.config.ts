import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_SLUGS } from './lib/categories';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(), // 메타 디스크립션 (SEO 핵심, 80~150자)
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // 4개 카테고리 중 하나만 허용. 누락/오타면 빌드 에러로 막는다.
    category: z.enum(CATEGORY_SLUGS),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // 버니 샌더스 숏츠 아카이브(category: bernie) 전용 선택 필드
    videoId: z.string().optional(), // 유튜브 영상 ID (중복 발행 방지 키)
    videoUrl: z.string().optional(), // 유튜브 숏츠 링크
    videoDate: z.string().optional(), // 유튜브 등록일자(YYYY-MM-DD)
  }),
});

export const collections = { blog };
