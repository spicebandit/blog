// 네이버 노출 점검 + 검색어 트렌드 (네이버 검색 Open API + 데이터랩)
//
// 준비: developers.naver.com 에서 앱 등록 후 .env 에 추가
//   NAVER_CLIENT_ID=...
//   NAVER_CLIENT_SECRET=...
//   (사용 API: '검색' + '데이터랩(검색어 트렌드)' 체크)
//
// 사용법:
//   node scripts/naver-check.mjs "청정수소" "전력시장 정산"      # 키워드별 네이버 노출 점검
//   node scripts/naver-check.mjs --trend "청정수소" "양자컴퓨터"  # 검색어 트렌드(최근 3개월)
//
// 점검 내용: 각 키워드로 네이버 블로그·웹 검색결과를 받아 baseload.co.kr 글이
// 몇 위에 노출되는지 확인한다. (Open API 결과는 통합검색 랭킹과 완전히 같지는 않지만 좋은 프록시)
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'baseload.co.kr';

function loadEnv() {
  try {
    for (const line of readFileSync(join(ROOT, '.env'), 'utf8').split('\n')) {
      const t = line.trim(); if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('='); if (eq === -1) continue;
      const k = t.slice(0, eq).trim(); const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {}
}

const headers = () => ({
  'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
  'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
});

const strip = (s) => (s || '').replace(/<\/?b>/g, '').replace(/&[a-z]+;/g, ' ').trim();

/** 한 키워드를 vertical(blog/webkr)에서 검색해 내 사이트 노출 순위를 찾는다 */
async function checkKeyword(kw) {
  const out = { kw, hits: [] };
  for (const v of ['blog', 'webkr']) {
    try {
      const url = `https://openapi.naver.com/v1/search/${v}?query=${encodeURIComponent(kw)}&display=30`;
      const res = await fetch(url, { headers: headers() });
      if (!res.ok) { out.hits.push({ vertical: v, error: `${res.status} ${await res.text()}`.slice(0, 120) }); continue; }
      const data = await res.json();
      const items = data.items || [];
      const idx = items.findIndex((it) => (it.link || '').includes(SITE) || (it.bloggerlink || '').includes(SITE));
      out.hits.push({
        vertical: v,
        total: data.total,
        rank: idx >= 0 ? idx + 1 : null,
        title: idx >= 0 ? strip(items[idx].title) : null,
      });
    } catch (e) { out.hits.push({ vertical: v, error: e.message }); }
  }
  return out;
}

/** 데이터랩 검색어 트렌드 (최근 90일, 주간) — 상대 검색량(0~100) 추이 */
async function trend(keywords) {
  const end = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
  const start = new Date(Date.now() - 90 * 86400000).toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
  console.log(`\n── 네이버 검색어 트렌드 (${start} ~ ${end}, 주간 상대지수 0~100) ──`);
  // 데이터랩은 호출당 keywordGroups 최대 5개 → 5개씩 나눠 호출
  for (let i = 0; i < keywords.length; i += 5) {
    const chunk = keywords.slice(i, i + 5);
    const body = {
      startDate: start, endDate: end, timeUnit: 'week',
      keywordGroups: chunk.map((k) => ({ groupName: k, keywords: [k] })),
    };
    const res = await fetch('https://openapi.naver.com/v1/datalab/search', {
      method: 'POST', headers: { ...headers(), 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (!res.ok) { console.error('데이터랩 실패:', res.status, (await res.text()).slice(0, 200)); continue; }
    const data = await res.json();
    for (const r of data.results || []) {
      const pts = r.data || [];
      const last = pts.length ? pts[pts.length - 1].ratio : 0;
      const max = Math.max(0, ...pts.map((p) => p.ratio));
      console.log(`• ${r.title}: 최근 ${last.toFixed(0)} / 기간최고 ${max.toFixed(0)} (데이터포인트 ${pts.length}개)`);
    }
  }
}

async function main() {
  loadEnv();
  if (!process.env.NAVER_CLIENT_ID || !process.env.NAVER_CLIENT_SECRET) {
    console.error('❌ .env에 NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 가 없습니다. developers.naver.com 에서 앱 등록 후 추가하세요.');
    process.exit(1);
  }
  const args = process.argv.slice(2);
  const isTrend = args[0] === '--trend';
  const kws = (isTrend ? args.slice(1) : args).filter(Boolean);
  if (!kws.length) { console.error('키워드를 1개 이상 넘기세요. 예: node scripts/naver-check.mjs "청정수소"'); process.exit(1); }

  if (isTrend) { await trend(kws); return; }

  console.log(`\n네이버 노출 점검 (대상: ${SITE}) — 키워드 ${kws.length}개\n`);
  for (const kw of kws) {
    const r = await checkKeyword(kw);
    const parts = r.hits.map((h) => {
      if (h.error) return `${h.vertical}:오류(${h.error})`;
      return h.rank ? `${h.vertical} ${h.rank}위✅` : `${h.vertical} 미노출`;
    });
    console.log(`🔎 "${kw}"  →  ${parts.join(' · ')}`);
    r.hits.forEach((h) => { if (h.rank) console.log(`     └ ${h.vertical} ${h.rank}위: ${h.title}`); });
  }
  console.log('\n※ Open API 검색결과는 네이버 통합검색 노출과 완전히 같지는 않지만, 블로그 vertical은 좋은 프록시입니다.');
  console.log('※ "내 유입 검색어"는 네이버 서치어드바이저 대시보드에서만 확인됩니다(API 미제공).\n');
}

main().catch((e) => { console.error('오류:', e.message); process.exit(1); });
