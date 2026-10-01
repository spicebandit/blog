// 특정 날짜 스파이크 원인 분해 — 글·유입원·도시·시간대 + 체류시간(봇 판별)
// 사용: node scripts/traffic-spike.mjs 2026-09-29
import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DAY = process.argv[2];
if (!DAY) { console.error('날짜를 주세요: node scripts/traffic-spike.mjs 2026-09-29'); process.exit(1); }

for (const line of readFileSync(ROOT + '/.env', 'utf8').split('\n')) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq < 0) continue;
  const k = t.slice(0, eq).trim();
  const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
  if (!(k in process.env)) process.env[k] = v;
}

const sa = JSON.parse(readFileSync(process.env.GA_SA_KEY_FILE.replace(/^~/, process.env.HOME), 'utf8'));
const b64 = (i) => Buffer.from(i).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const now = Math.floor(Date.now() / 1000);
const claim = {
  iss: sa.client_email,
  scope: 'https://www.googleapis.com/auth/analytics.readonly',
  aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
};
const input = `${b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64(JSON.stringify(claim))}`;
const signer = createSign('RSA-SHA256'); signer.update(input);
const tr = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${input}.${b64(signer.sign(sa.private_key))}` }),
});
const tok = (await tr.json()).access_token;

const D = { startDate: DAY, endDate: DAY };
async function q(reqs) {
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:batchRunReports`,
    { method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ requests: reqs }) });
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  return j.reports;
}

const [pages, src, city, hour] = await q([
  { dateRanges: [D], dimensions: [{ name: 'pageTitle' }], metrics: [{ name: 'screenPageViews' }], orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 12 },
  { dateRanges: [D], dimensions: [{ name: 'sessionSource' }, { name: 'landingPage' }], metrics: [{ name: 'sessions' }, { name: 'averageSessionDuration' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 15 },
  { dateRanges: [D], dimensions: [{ name: 'city' }, { name: 'country' }], metrics: [{ name: 'screenPageViews' }, { name: 'averageSessionDuration' }], orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 10 },
  { dateRanges: [D], dimensions: [{ name: 'hour' }], metrics: [{ name: 'screenPageViews' }], orderBys: [{ dimension: { dimensionName: 'hour' } }], limit: 24 },
]);

console.log(`■ ${DAY} 읽힌 글`);
for (const r of pages.rows ?? []) console.log(`  ${String(r.metricValues[0].value).padStart(3)} · ${r.dimensionValues[0].value.slice(0, 62)}`);

console.log(`\n■ ${DAY} 유입원 × 랜딩 (평균 체류)`);
for (const r of src.rows ?? []) console.log(`  ${String(r.metricValues[0].value).padStart(2)}세션 · ${String(Math.round(r.metricValues[1].value)).padStart(4)}초 · ${r.dimensionValues[0].value.padEnd(18)} ${r.dimensionValues[1].value.slice(0, 48)}`);

console.log(`\n■ ${DAY} 도시 (평균 체류)`);
for (const r of city.rows ?? []) console.log(`  ${String(r.metricValues[0].value).padStart(3)} · ${String(Math.round(r.metricValues[1].value)).padStart(4)}초 · ${r.dimensionValues[0].value} / ${r.dimensionValues[1].value}`);

console.log(`\n■ ${DAY} 시간대별 (KST)`);
for (const r of hour.rows ?? []) {
  const n = Number(r.metricValues[0].value);
  if (n > 0) console.log(`  ${r.dimensionValues[0].value.padStart(2, '0')}시 ${String(n).padStart(3)} ${'█'.repeat(Math.min(n, 60))}`);
}
