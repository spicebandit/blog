// GA4 도시별 사용자 분포 (본인/외부 비중 가늠용) — 최근 7일·28일, 신규/재방문
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSign } from 'node:crypto';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
function loadEnv() { try { for (const line of readFileSync(join(ROOT, '.env'), 'utf8').split('\n')) { const t = line.trim(); if (!t || t.startsWith('#')) continue; const eq = t.indexOf('='); if (eq === -1) continue; const k = t.slice(0, eq).trim(); const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, ''); if (!(k in process.env)) process.env[k] = v; } } catch {} }
const b64 = (s) => Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function token(sa) { const now = Math.floor(Date.now() / 1000); const h = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' })); const c = b64(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })); const si = `${h}.${c}`; const s = createSign('RSA-SHA256'); s.update(si); const jwt = `${si}.${b64(s.sign(sa.private_key))}`; const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }) }); const d = await r.json(); if (!d.access_token) throw new Error(JSON.stringify(d)); return d.access_token; }
async function report(tok, pid, start, end) {
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${pid}:runReport`, {
    method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ dateRanges: [{ startDate: start, endDate: end }], dimensions: [{ name: 'city' }, { name: 'newVsReturning' }], metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }], orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }], limit: 25 }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(JSON.stringify(d.error || d)); return d.rows || [];
}
function show(title, rows) {
  console.log(`\n── ${title} ──`);
  let u = 0, s = 0, v = 0;
  rows.forEach((row) => { u += +row.metricValues[0].value; s += +row.metricValues[1].value; v += +row.metricValues[2].value; });
  console.log(`합계: 사용자 ${u} · 세션 ${s} · 조회 ${v}`);
  rows.forEach((row) => { const [city, nvr] = row.dimensionValues.map((x) => x.value); console.log(`  ${city || '(미상)'} [${nvr}] — 사용자 ${row.metricValues[0].value}·세션 ${row.metricValues[1].value}·조회 ${row.metricValues[2].value}`); });
}
async function main() {
  loadEnv();
  const pid = process.env.GA4_PROPERTY_ID; const kf = process.env.GA_SA_KEY_FILE;
  const path = kf.startsWith('~') ? join(process.env.HOME, kf.slice(1)) : kf;
  const sa = JSON.parse(readFileSync(path, 'utf8')); const tok = await token(sa);
  show('최근 7일 도시별 (사용자순)', await report(tok, pid, '7daysAgo', 'today'));
  show('최근 28일 도시별 (사용자순)', await report(tok, pid, '28daysAgo', 'today'));
  console.log('\n※ 도시는 IP 추정이라 본인 모바일이 여러 도시로 흩어져 잡힐 수 있음. new=신규, returning=재방문.\n');
}
main().catch((e) => { console.error('오류:', e.message); process.exit(1); });
