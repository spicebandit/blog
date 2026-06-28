// GA4 글별 조회수·체류시간 (읽은 글 분석) — 최근 7일·28일
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
    body: JSON.stringify({ dateRanges: [{ startDate: start, endDate: end }], dimensions: [{ name: 'pageTitle' }], metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }, { name: 'userEngagementDuration' }], orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 20 }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(JSON.stringify(d.error || d)); return d.rows || [];
}
const dur = (s) => { s = Math.round(s); return s >= 60 ? `${Math.floor(s/60)}분 ${s%60}초` : `${s}초`; };
function show(title, rows) {
  console.log(`\n── ${title} ──`);
  let v = 0; rows.forEach((r) => v += +r.metricValues[0].value);
  console.log(`상위 ${rows.length}개 합계 조회 ${v}`);
  rows.forEach((row, i) => {
    const t = row.dimensionValues[0].value;
    const views = +row.metricValues[0].value, users = +row.metricValues[1].value, eng = +row.metricValues[2].value;
    const avg = views ? eng / views : 0;
    console.log(`${String(i+1).padStart(2)}. ${t}\n      조회 ${views} · 사용자 ${users} · 평균체류 ${dur(avg)}`);
  });
}
async function main() {
  loadEnv();
  const pid = process.env.GA4_PROPERTY_ID; const kf = process.env.GA_SA_KEY_FILE;
  const path = kf.startsWith('~') ? join(process.env.HOME, kf.slice(1)) : kf;
  const sa = JSON.parse(readFileSync(path, 'utf8')); const tok = await token(sa);
  console.log('========== 읽은 글 분석 (GA4 글별 조회·체류) ==========');
  show('최근 7일 많이 읽은 글', await report(tok, pid, '7daysAgo', 'today'));
  show('최근 28일 많이 읽은 글', await report(tok, pid, '28daysAgo', 'today'));
}
main().catch((e) => { console.error('오류:', e.message); process.exit(1); });
