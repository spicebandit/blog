/**
 * rehype-inarticle-ad — 글 본문 중간에 카카오 애드핏 광고를 한 개 꽂는다.
 *
 * 왜 rehype(빌드 시점)인가:
 *   본문은 <Content />로 통째로 렌더되기 때문에 Astro 쪽에서는 "문단 사이"에
 *   컴포넌트를 끼워 넣을 자리가 없다. 클라이언트 JS로 나중에 DOM을 옮기는 방법은
 *   애드핏 로더(ba.min.js)가 이미 훑고 지나간 뒤라 광고가 안 붙는다.
 *   그래서 마크다운이 HTML로 바뀌는 단계에서 <ins>를 직접 끼워 넣는다.
 *
 * 넣는 위치: 두 번째 h2 바로 앞.
 *   맨 위는 리드(결론)라 끊으면 안 되고, 첫 소제목까지는 읽게 두는 편이 낫다.
 *
 * 안 넣는 경우:
 *   - PUBLIC_ADFIT_UNIT_IN_ARTICLE 미설정 (단위가 없으면 빈 칸만 생긴다)
 *   - noindex / draft 글 — 색인 제외 페이지에 광고를 내보내면 안 된다.
 *     애드센스 반려의 직접 원인이었던 패턴이라 광고망이 바뀌어도 그대로 지킨다.
 *   - h2가 4개 미만인 짧은 글 — 중간 광고를 넣을 만큼 길지 않다.
 *
 * ⚠️ 로컬에서 고칠 때 주의: Astro가 렌더된 본문을 .astro/ 와 node_modules/.astro 에
 *    캐시한다. 이 플러그인을 바꾸고 `npm run build`만 하면 **플러그인이 아예 호출되지
 *    않아** 수정이 반영되지 않은 것처럼 보인다(2026-11-04 실제로 한참 헤맸다).
 *    반드시 `rm -rf node_modules/.astro .astro/data-store.json` 후 빌드할 것.
 *    Vercel은 매번 새로 빌드하므로 배포에는 영향이 없다.
 */

const MIN_H2 = 4;
const INSERT_BEFORE_NTH_H2 = 2;

/** 애드핏 <ins> 한 덩이. AdSlot.astro의 마크업과 모양을 맞춘다. */
function adNode(unit) {
  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['ad-slot', 'ad-inarticle'] },
    children: [
      {
        type: 'element',
        tagName: 'span',
        properties: { className: ['ad-label'] },
        children: [{ type: 'text', value: '광고' }],
      },
      {
        type: 'element',
        tagName: 'ins',
        properties: {
          className: ['kakao_ad_area'],
          style: 'display:none;',
          'data-ad-unit': unit,
          'data-ad-width': '320',
          'data-ad-height': '100',
        },
        children: [],
      },
    ],
  };
}

/**
 * @param {{ unit?: string }} options
 *   unit — 애드핏 광고 단위(DAN-...). astro.config.mjs에서 Vite의 loadEnv로 읽어 넘긴다.
 *
 *   ⚠️ 여기서 process.env를 직접 읽으면 안 된다. 로컬(shell에 export한 경우)에서는
 *      동작하지만 Vercel 빌드에서는 비어 있어 광고가 안 붙는다(2026-11-04 실측:
 *      사이드바는 import.meta.env로 읽어 정상, 본문 중간만 계속 0건이었다).
 *      환경변수는 astro.config에서 loadEnv로 읽어 옵션으로 주입한다.
 */
export default function rehypeInArticleAd(options = {}) {
  const UNIT = options.unit ?? '';
  return (tree, file) => {
    if (!UNIT) return;

    const fm = file?.data?.astro?.frontmatter ?? {};
    if (fm.noindex === true || fm.draft === true) return;

    const kids = tree.children ?? [];
    const h2Indexes = [];
    for (let i = 0; i < kids.length; i++) {
      const n = kids[i];
      if (n.type === 'element' && n.tagName === 'h2') h2Indexes.push(i);
    }
    if (h2Indexes.length < MIN_H2) return;

    const at = h2Indexes[INSERT_BEFORE_NTH_H2 - 1];
    if (at === undefined) return;

    kids.splice(at, 0, adNode(UNIT));
  };
}
