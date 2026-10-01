// 서울 방문자 프로파일 — 신규/재방문, 기기, 브라우저, 랜딩, 일자별
// 사용: node scripts/traffic-visitor.mjs 2026-09-26 2026-10-02
import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const [START, END] = [process.argv[2], process.argv[3]];
if (!START || !END) { console.error('node scripts/traffic-visitor.mjs <시작> <끝>'); process.exit(1); }

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
const input = `${b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64(JSON.stringify({
  iss: sa.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly',
  aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }))}`;
const signer = createSign('RSA-SHA256'); signer.update(input);
const tok = (await (await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${input}.${b64(signer.sign(sa.private_key))}` }),
})).json()).access_token;

const D = { startDate: START, endDate: END };
// 서울만 떼어 본다 — 봇(체류 0초 해외)과 섞이면 프로파일이 흐려진다
const KR = { filter: { fieldName: 'city', stringFilter: { value: 'Seoul' } } };
async function q(reqs) {
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:batchRunReports`,
    { method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ requests: reqs }) });
  const j = await r.json(); if (j.error) throw new Error(j.error.message); return j.reports;
}

const [ret, dev, daily, land] = await q([
  { dateRanges: [D], dimensionFilter: KR, dimensions: [{ name: 'newVsReturning' }], metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }, { name: 'averageSessionDuration' }] },
  { dateRanges: [D], dimensionFilter: KR, dimensions: [{ name: 'deviceCategory' }, { name: 'browser' }, { name: 'operatingSystem' }], metrics: [{ name: 'sessions' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 8 },
  { dateRanges: [D], dimensionFilter: KR, dimensions: [{ name: 'date' }, { name: 'newVsReturning' }], metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }], orderBys: [{ dimension: { dimensionName: 'date' } }], limit: 30 },
  { dateRanges: [D], dimensionFilter: KR, dimensions: [{ name: 'landingPage' }], metrics: [{ name: 'sessions' }, { name: 'averageSessionDuration' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 10 },
]);

console.log(`■ 서울 방문자 — 신규 vs 재방문 (${START}~${END})`);
for (const r of ret.rows ?? []) console.log(`  ${r.dimensionValues[0].value.padEnd(10)} 세션 ${String(r.metricValues[0].value).padStart(3)} · 조회 ${String(r.metricValues[1].value).padStart(3)} · 평균체류 ${Math.round(r.metricValues[2].value)}초`);

console.log('\n■ 기기 · 브라우저 · OS');
for (const r of dev.rows ?? []) console.log(`  ${String(r.metricValues[0].value).padStart(3)}세션 · ${r.dimensionValues.map(x=>x.value).join(' / ')}`);

console.log('\n■ 일자별 (신규/재방문)');
for (const r of daily.rows ?? []) { const d = r.dimensionValues[0].value; console.log(`  ${d.slice(4,6)}/${d.slice(6,8)} ${r.dimensionValues[1].value.padEnd(10)} 세션 ${String(r.metricValues[0].value).padStart(3)} · 조회 ${String(r.metricValues[1].value).padStart(3)}`); }

console.log('\n■ 진입 페이지');
for (const r of land.rows ?? []) console.log(`  ${String(r.metricValues[0].value).padStart(2)}세션 · ${String(Math.round(r.metricValues[1].value)).padStart(4)}초 · ${r.dimensionValues[0].value}`);
