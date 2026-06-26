// GA4 최근/실시간 방문 조회 (도시·페이지·유입원·기기) — "어디서 무슨 글 봤나" 확인용
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSign } from 'node:crypto';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
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
const b64 = (s) => Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function token(sa) {
  const now = Math.floor(Date.now() / 1000);
  const h = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const c = b64(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const si = `${h}.${c}`; const s = createSign('RSA-SHA256'); s.update(si);
  const jwt = `${si}.${b64(s.sign(sa.private_key))}`;
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }) });
  const d = await r.json(); if (!d.access_token) throw new Error(JSON.stringify(d)); return d.access_token;
}
async function realtime(tok, pid) {
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${pid}:runRealtimeReport`, {
    method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ dimensions: [{ name: 'city' }, { name: 'unifiedScreenName' }], metrics: [{ name: 'activeUsers' }], limit: 30 }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(JSON.stringify(d.error || d));
  return d.rows || [];
}
async function recent(tok, pid, city) {
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${pid}:runReport`, {
    method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dateRanges: [{ startDate: '2daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'city' }, { name: 'pageTitle' }, { name: 'sessionSource' }, { name: 'deviceCategory' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
      dimensionFilter: city ? { filter: { fieldName: 'city', stringFilter: { matchType: 'CONTAINS', value: city, caseSensitive: false } } } : undefined,
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 40,
    }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(JSON.stringify(d.error || d));
  return d.rows || [];
}
async function main() {
  loadEnv();
  const pid = process.env.GA4_PROPERTY_ID;
  const kf = process.env.GA_SA_KEY_FILE;
  const path = kf.startsWith('~') ? join(process.env.HOME, kf.slice(1)) : kf;
  const sa = JSON.parse(readFileSync(path, 'utf8'));
  const tok = await token(sa);
  const cityArg = process.argv[2] || 'Busan';

  console.log(`\n=== 실시간(최근 30분) 활성 사용자 — 도시 / 화면 ===`);
  const rt = await realtime(tok, pid);
  if (!rt.length) console.log('  (지금 활성 사용자 없음)');
  rt.forEach((r) => console.log(`  ${r.dimensionValues[0].value} · ${r.dimensionValues[1].value} — ${r.metricValues[0].value}명`));

  console.log(`\n=== 최근 3일 '${cityArg}' 방문 상세 (페이지 · 유입원 · 기기) ===`);
  const rows = await recent(tok, pid, cityArg);
  if (!rows.length) console.log(`  ('${cityArg}' 방문 기록 없음)`);
  rows.forEach((r) => {
    const [city, title, src, dev] = r.dimensionValues.map((x) => x.value);
    console.log(`  ${city} | ${title} | 유입:${src} | ${dev} — 조회 ${r.metricValues[0].value}·사용자 ${r.metricValues[1].value}`);
  });
  console.log('\n※ 봇/크롤러 판별 힌트: 유입원이 데이터센터/직접+초단기 체류, 같은 도시에서 다수 페이지 순차조회면 크롤러일 가능성. 모바일+특정 글 1개면 사람일 가능성이 큼.\n');
}
main().catch((e) => { console.error('오류:', e.message); process.exit(1); });
