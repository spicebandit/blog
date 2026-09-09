// 심층 접속 분석 — GA4 + 구글 서치콘솔을 한 번에
//
// 아침 브리프(morning-brief.mjs)는 요약만 준다. 이 스크립트는 "왜 늘었나/줄었나"를
// 따질 때 쓰는 상세판이다. 국가별로 쪼개 봇과 실제 방문자를 가르고, 유입원별
// 랜딩 페이지까지 보여 준다. 트래픽 스파이크의 원인을 짚을 때 이게 필요하다.
//
// 사용: node scripts/traffic-deep.mjs [일수]     (기본 14일)
//
// 주의: GA4 batchRunReports는 요청 5개가 한도다. 그 이상 묶으면 400이 난다.

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSign } from 'node:crypto';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DAYS = Number(process.argv[2] ?? 14);

function loadEnv() {
  try {
    for (const line of readFileSync(join(ROOT, '.env'), 'utf8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      const k = t.slice(0, eq).trim();
      const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {}
}

const b64url = (i) => Buffer.from(i).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function token(sa) {
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  };
  const input = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(JSON.stringify(claim))}`;
  const signer = createSign('RSA-SHA256');
  signer.update(input);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${input}.${b64url(signer.sign(sa.private_key))}` }),
  });
  const d = await res.json();
  if (!d.access_token) throw new Error(`토큰 실패: ${d.error_description ?? res.status}`);
  return d.access_token;
}

// 날짜 문자열(KST 기준). GA4·GSC 모두 YYYY-MM-DD를 받는다.
const ymd = (offsetDays) => {
  const d = new Date(Date.now() - offsetDays * 86400000);
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
};

async function ga4(tok, pid, requests) {
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${pid}:batchRunReports`, {
    method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests }),
  });
  const j = await res.json();
  if (j.error) throw new Error(`GA4: ${j.error.message}`);
  return j.reports ?? [];
}

async function gsc(tok, site, body) {
  const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
    method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await res.json();
  if (j.error) throw new Error(`GSC: ${j.error.message}`);
  return j.rows ?? [];
}

async function main() {
  loadEnv();
  const sa = JSON.parse(readFileSync(process.env.GA_SA_KEY_FILE.replace(/^~/, process.env.HOME), 'utf8'));
  const tok = await token(sa);
  const pid = process.env.GA4_PROPERTY_ID;
  const site = process.env.GSC_SITE || 'sc-domain:baseload.co.kr';
  const range = { startDate: ymd(DAYS), endDate: ymd(0) };

  // ── 1) 일자별 추이 + 국가/소스 분해 (요청 3개)
  const [daily, byCountry, bySource] = await ga4(tok, pid, [
    { dateRanges: [range], dimensions: [{ name: 'date' }], metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }], orderBys: [{ dimension: { dimensionName: 'date' } }], limit: 60 },
    { dateRanges: [range], dimensions: [{ name: 'date' }, { name: 'country' }], metrics: [{ name: 'screenPageViews' }], limit: 500 },
    { dateRanges: [range], dimensions: [{ name: 'date' }, { name: 'sessionSource' }], metrics: [{ name: 'sessions' }], limit: 500 },
  ]);

  const kr = new Map(), abroad = new Map(), naver = new Map();
  for (const r of byCountry.rows ?? []) {
    const [d, c] = r.dimensionValues.map((x) => x.value);
    const n = Number(r.metricValues[0].value);
    (c === 'South Korea' ? kr : abroad).set(d, ((c === 'South Korea' ? kr : abroad).get(d) ?? 0) + n);
  }
  for (const r of bySource.rows ?? []) {
    const [d, s] = r.dimensionValues.map((x) => x.value);
    if (/naver/i.test(s)) naver.set(d, (naver.get(d) ?? 0) + Number(r.metricValues[0].value));
  }

  console.log(`■ 일자별 (최근 ${DAYS}일)`);
  console.log('날짜    조회  방문  한국  해외  네이버');
  for (const r of daily.rows ?? []) {
    const d = r.dimensionValues[0].value;
    const pv = Number(r.metricValues[0].value);
    console.log(
      `${d.slice(4, 6)}/${d.slice(6, 8)} ${String(pv).padStart(5)} ${String(r.metricValues[1].value).padStart(5)}` +
      ` ${String(kr.get(d) ?? 0).padStart(5)} ${String(abroad.get(d) ?? 0).padStart(5)} ${String(naver.get(d) ?? 0).padStart(6)}  ${'█'.repeat(Math.round(pv / 4))}`);
  }

  // ── 2) 어제 상세: 페이지 · 유입원×랜딩 (요청 2개)
  const y = { startDate: ymd(1), endDate: ymd(1) };
  const [pages, landing] = await ga4(tok, pid, [
    { dateRanges: [y], dimensions: [{ name: 'pageTitle' }], metrics: [{ name: 'screenPageViews' }], limit: 10 },
    { dateRanges: [y], dimensions: [{ name: 'sessionSource' }, { name: 'landingPage' }], metrics: [{ name: 'sessions' }], limit: 15 },
  ]);
  console.log(`\n■ 어제(${ymd(1)}) 읽힌 글`);
  for (const r of pages.rows ?? []) console.log(`  ${String(r.metricValues[0].value).padStart(3)} · ${r.dimensionValues[0].value.slice(0, 58)}`);
  console.log(`\n■ 어제 유입원 × 랜딩페이지`);
  for (const r of landing.rows ?? []) console.log(`  ${String(r.metricValues[0].value).padStart(2)} · ${r.dimensionValues[0].value.padEnd(20)} ${r.dimensionValues[1].value}`);

  // ── 3) 구글 서치콘솔 (GSC는 집계가 2~3일 늦다)
  const gRange = { startDate: ymd(DAYS + 2), endDate: ymd(2) };
  const gDaily = await gsc(tok, site, { ...gRange, dimensions: ['date'] });
  const gKw = await gsc(tok, site, { ...gRange, dimensions: ['query'], rowLimit: 8 });
  let c = 0, i = 0;
  for (const r of gDaily) { c += r.clicks; i += r.impressions; }
  console.log(`\n■ 구글 서치콘솔 (${gRange.startDate}~${gRange.endDate}, 집계 지연 2일)`);
  console.log(`  클릭 ${c} · 노출 ${i} · CTR ${i ? (c / i * 100).toFixed(2) : 0}%`);
  if (gKw.length) {
    console.log('  키워드:');
    for (const r of gKw) console.log(`    클릭 ${String(r.clicks).padStart(2)} · 노출 ${String(r.impressions).padStart(4)} · ${r.keys[0]}`);
  } else {
    console.log('  키워드 데이터 없음');
  }
}

main().catch((e) => { console.error('오류:', e.message); process.exit(1); });
