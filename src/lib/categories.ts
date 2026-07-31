// 블로그 카테고리 단일 정의(Single Source of Truth)
// URL 슬러그(영문) ↔ 표시 이름(한글) 매핑. 모든 페이지/스키마가 이 파일을 import 한다.
// 카테고리를 추가·변경하려면 여기만 수정하면 된다.

// 슬러그 순서 = 네비게이션 노출 순서. content.config.ts의 z.enum도 이 배열에서 파생된다.
export const CATEGORY_SLUGS = ['energy', 'economy', 'ai', 'ax', 'life'] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const CATEGORY_NAMES: Record<CategorySlug, string> = {
  energy: '에너지',
  economy: '경제·경영',
  ai: 'AI Trend',
  ax: 'AX',
  life: 'Editor',
};

/** 카테고리 페이지 상단 한 줄 소개 (신문 섹션면 스타일) */
export const CATEGORY_DESCRIPTIONS: Record<CategorySlug, string> = {
  energy: '전력시장 · 재생에너지 · 전력망 — 에너지 전환을 데이터로 읽습니다',
  economy: '거시경제 · 산업 · 경영 전략 — 숫자 뒤의 흐름을 해설합니다',
  ai: 'AI 기술·정책·시장 동향 — AI 세계에서 지금 일어나는 일',
  ax: 'AI 전환(AX) 실전 — 도구·API·로컬LLM·에이전트로 직접 만들고 돌린다',
  life: '일과 삶, 그리고 기록 — 에디터의 시선',
};

/** 슬러그를 한글 표시 이름으로 변환 */
export function categoryName(slug: CategorySlug): string {
  return CATEGORY_NAMES[slug];
}

/** 카테고리 한 줄 소개 */
export function categoryDescription(slug: CategorySlug): string {
  return CATEGORY_DESCRIPTIONS[slug];
}

/** 임의의 문자열이 유효한 카테고리 슬러그인지 확인(타입 가드) */
export function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value);
}
