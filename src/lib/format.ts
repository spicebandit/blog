// 공통 포매팅·추출 유틸 (Single Source of Truth)
// 날짜 표기는 항상 KST(Asia/Seoul) 기준으로 통일한다.
// 오전 9시 이전(UTC 자정 이후)에 발행된 KST 글이 하루 밀려 표기되던 버그를
// 막기 위해, 모든 toLocaleDateString 호출에 timeZone을 강제한다.

const KST = 'Asia/Seoul';

/** 'YYYY년 M월 D일' (한국어 풀 날짜) — 기사 본문/카드 메타용 */
export function formatDateKR(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    timeZone: KST,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** 'M월 D일' (연도 생략) — 캐러셀/요약 카드용 */
export function formatDateKRShort(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    timeZone: KST,
    month: 'long',
    day: 'numeric',
  });
}

/** 'M. D.' (가장 짧은 형태) — 사이드바/리스트 메타용 */
export function formatDateKRCompact(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    timeZone: KST,
    month: 'short',
    day: 'numeric',
  });
}

/** 'Month D, YYYY' (영문) — 영어 페이지용 */
export function formatDateEN(date: Date): string {
  return date.toLocaleDateString('en-US', {
    timeZone: KST,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** 'YYYY-MM-DD' (KST 기준 ISO 날짜) — 빌드 시점/비교용 */
export function kstDateStr(date: Date): string {
  return date.toLocaleDateString('sv-SE', { timeZone: KST });
}

/** 마크다운 본문에서 첫 번째 이미지 URL을 뽑는다(heroImage 폴백용).
 *  외부 URL(http/https)뿐 아니라 사이트 내부 경로(/images/… 등 '/'로 시작)도 인식한다.
 *  (내부 경로 이미지만 있는 글이 목록 썸네일이 비던 문제 수정 2026-07-06) */
export function firstBodyImage(body: string | undefined): string | undefined {
  if (!body) return undefined;
  const m = body.match(/!\[[^\]]*\]\(((?:https?:\/\/|\/)[^)\s]+)\)/);
  return m?.[1];
}
