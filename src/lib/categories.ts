// 블로그 카테고리 단일 정의(Single Source of Truth)
// URL 슬러그(영문) ↔ 표시 이름(한글) 매핑. 모든 페이지/스키마가 이 파일을 import 한다.
// 카테고리를 추가·변경하려면 여기만 수정하면 된다.

// 슬러그 순서 = 네비게이션 노출 순서. content.config.ts의 z.enum도 이 배열에서 파생된다.
export const CATEGORY_SLUGS = ['energy', 'economy', 'ai', 'life'] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const CATEGORY_NAMES: Record<CategorySlug, string> = {
  energy: '에너지',
  economy: '경제·경영',
  ai: 'AI·공부',
  life: '일상',
};

/** 슬러그를 한글 표시 이름으로 변환 */
export function categoryName(slug: CategorySlug): string {
  return CATEGORY_NAMES[slug];
}

/** 임의의 문자열이 유효한 카테고리 슬러그인지 확인(타입 가드) */
export function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value);
}
