// 유입 키워드 분석 (구글 Search Console + GA4 유입 소스)
// 일회성 분석용. 구글 검색 키워드 TOP, 페이지별 키워드, GA4 소스(네이버/구글 등) 비중.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSign } from 'node:crypto';

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv() {
  try {
    const raw = readFileSync(join(PROJECT_ROOT, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      const val = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {}
}

function b64url(input) {
  return Buffer.from(input).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  }));
  const signingInput = `${header}.${claim}`;
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  const jwt = `${signingInput}.${b64url(signer.sign(sa.private_key))}`;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) throw new Error(`토큰 발급 실패: ${data.error_description || data.error || res.status}`);
  return data.access_token;
}

const kst = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });

async function gsc(token, site, body) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`GSC 실패: ${data.error?.message || res.status}`);
  return data.rows ?? [];
}

async function ga4(token, propertyId, requests) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`,
    { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ requests }) },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`GA4 실패: ${data.error?.message || res.status}`);
  return data.reports ?? [];
}

async function main() {
  loadEnv();
  const site = process.env.GSC_SITE || 'sc-domain:baseload.co.kr';
  const propertyId = process.env.GA4_PROPERTY_ID;
  const keyFile = process.env.GA_SA_KEY_FILE;
  const resolvedKey = keyFile.startsWith('~')
    ? join(process.env.HOME, keyFile.slice(1))
    : keyFile.startsWith('/') ? keyFile : join(PROJECT_ROOT, keyFile);
  const sa = JSON.parse(readFileSync(resolvedKey, 'utf8'));
  const token = await getAccessToken(sa);

  const end = kst(Date.now());
  const start28 = kst(Date.now() - 28 * 86400000);

  console.log(`\n========== 유입 키워드 분석 (${start28} ~ ${end}, 최근 28일) ==========`);
  console.log(`사이트: ${site} / GA4: ${propertyId}\n`);

  // 1) 구글 검색 키워드 TOP 25
  const kw = await gsc(token, site, { startDate: start28, endDate: end, dimensions: ['query'], rowLimit: 25 });
  console.log('── [구글] 검색 키워드 TOP 25 (Search Console) ──');
  if (!kw.length) console.log('  (데이터 없음 — 색인 초기이거나 노출 부족)');
  kw.forEach((r, i) => {
    console.log(`${String(i + 1).padStart(2)}. ${r.keys[0]}  |  클릭 ${r.clicks} · 노출 ${r.impressions} · CTR ${(r.ctr * 100).toFixed(1)}% · 평균순위 ${r.position.toFixed(1)}`);
  });

  // 2) 구글 유입 상위 페이지
  const pages = await gsc(token, site, { startDate: start28, endDate: end, dimensions: ['page'], rowLimit: 10 });
  console.log('\n── [구글] 검색 유입 상위 페이지 TOP 10 ──');
  pages.forEach((r, i) => {
    const url = r.keys[0].replace('https://www.baseload.co.kr', '');
    console.log(`${String(i + 1).padStart(2)}. ${url}  |  클릭 ${r.clicks} · 노출 ${r.impressions} · 순위 ${r.position.toFixed(1)}`);
  });

  // 3) 노출은 많은데 클릭 적은 키워드 (CTR 개선 기회)
  const opp = [...kw].filter((r) => r.impressions >= 5).sort((a, b) => b.impressions - a.impressions);
  console.log('\n── [구글] 노출 대비 클릭 기회 키워드 (노출↑ 클릭↓ = 제목/메타 개선 여지) ──');
  opp.slice(0, 10).forEach((r) => {
    console.log(`   ${r.keys[0]}  |  노출 ${r.impressions} · 클릭 ${r.clicks} · CTR ${(r.ctr * 100).toFixed(1)}% · 순위 ${r.position.toFixed(1)}`);
  });

  // 4) GA4 유입 소스/매체 (네이버 vs 구글 vs 기타) — 28일
  const reports = await ga4(token, propertyId, [
    {
      dateRanges: [{ startDate: start28, endDate: end }],
      dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 15,
    },
    {
      dateRanges: [{ startDate: start28, endDate: end }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    },
  ]);

  console.log('\n── [GA4] 유입 소스/매체 TOP 15 (네이버·구글 등, 28일) ──');
  (reports[0].rows ?? []).forEach((r, i) => {
    const src = r.dimensionValues[0].value;
    const med = r.dimensionValues[1].value;
    console.log(`${String(i + 1).padStart(2)}. ${src} / ${med}  —  세션 ${r.metricValues[0].value} · 사용자 ${r.metricValues[1].value}`);
  });

  console.log('\n── [GA4] 채널 그룹 비중 (28일) ──');
  (reports[1].rows ?? []).forEach((r) => {
    console.log(`   ${r.dimensionValues[0].value}: 세션 ${r.metricValues[0].value}`);
  });

  console.log('\n※ 네이버는 organic 검색 키워드를 GA4/외부 API로 넘기지 않아, 키워드 단위 조회는 네이버 서치어드바이저 대시보드에서만 가능.\n');
}

main().catch((e) => { console.error('오류:', e.message); process.exit(1); });
