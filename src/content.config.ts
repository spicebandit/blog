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
    noindex: z.boolean().default(false), // 검색엔진 비노출(색인 제외) — 자동갱신·얇은 데이터 페이지 등
    featured: z.boolean().default(false), // 1면 톱기사 — 편집국장이 홈에 노출할 기사에 설정
    heroImage: z.string().optional(),
    author: z.string().optional(),
    readingTime: z.number().optional(), // minutes
  }),
});

// English pilot: translated articles. Korean slug stored in koSlug for hreflang cross-linking.
const blogEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog-en' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(CATEGORY_SLUGS),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    heroImage: z.string().optional(),
    author: z.string().optional(),
    lang: z.string().optional(), // article language tag (e.g. 'en')
    noindex: z.boolean().default(false), // 검색엔진 비노출 — 한글 원문이 noindex이거나 중복 영문판인 경우
    koSlug: z.string().optional(), // original Korean article slug for hreflang alternate
    sourceSlug: z.string().optional(), // alias used by EditorInChief translations
  }),
});

// 서재(독서노트). 블로그 글과 완전히 분리된 컬렉션이다.
// 분리한 이유: 블로그 글 스키마는 description 80~150자·6,000자 본문·SEO 규칙을 전제하는데,
// 독서메모는 한 줄짜리도 쌓여야 해서 같은 틀에 넣으면 둘 다 망가진다.
// /books 전체가 noindex + 광고 미게재라 애드센스 심사 대상에서 빠진다(Base.astro가 noindex면 광고 로더도 안 내보냄).
const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string().optional(),
    translator: z.string().optional(),
    publisher: z.string().optional(),
    published: z.string().optional(), // 출간 시점. 'YYYY' 또는 'YYYY-MM-DD' 등 자유 표기
    pages: z.number().optional(),
    cover: z.string().optional(), // 표지 이미지 URL. 없으면 타이포그래피 표지로 자동 생성
    status: z.enum(['reading', 'done', 'wishlist']).default('reading'),
    rating: z.number().min(0).max(5).optional(), // 0.5 단위 허용
    startDate: z.coerce.date().optional(),
    finishDate: z.coerce.date().optional(),
    addedDate: z.coerce.date(), // 서재에 등록한 날 — 목록 정렬 기준
    oneLiner: z.string().optional(), // 한줄평
    tags: z.array(z.string()).default([]),
    reviewSlug: z.string().optional(), // 블로그 글로 승격한 경우 그 글의 슬러그
    // 밑줄·메모. 텔레그램에서 한 건씩 append 하는 것을 전제로 배열로 둔다.
    notes: z
      .array(
        z.object({
          page: z.number().optional(),
          quote: z.string().optional(), // 책에서 옮긴 문장
          thought: z.string().optional(), // 내 생각
          date: z.coerce.date().optional(),
        }),
      )
      .default([]),
  }),
});

export const collections = { blog, 'blog-en': blogEn, books };
