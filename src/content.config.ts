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
    featured: z.boolean().default(false), // 1면 톱기사 — 편집국장이 홈에 노출할 기사에 설정
    heroImage: z.string().optional(),
    author: z.string().optional(),
    readingTime: z.number().optional(), // minutes
  }),
});

export const collections = { blog };
