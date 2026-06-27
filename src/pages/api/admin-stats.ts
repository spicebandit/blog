// 관리자 분석 API (서버 전용) — 비밀번호 검증 후 GA4 데이터를 JSON으로 반환.
// 환경변수(Vercel): ADMIN_PASSWORD, GA4_PROPERTY_ID, GA_SA_KEY(서비스계정 JSON 문자열)
// GA 서비스계정 키는 서버에서만 사용 — 브라우저에 절대 노출되지 않는다.
export const prerender = false;

import { createSign } from 'node:crypto';

const b64u = (s: string | Buffer) =>
  Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function getToken(sa: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64u(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  }));
  const signingInput = `${header}.${claim}`;
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  const jwt = `${signingInput}.${b64u(signer.sign(sa.private_key))}`;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  const d = await res.json();
  if (!d.access_token) throw new Error('token 발급 실패');
  return d.access_token as string;
}

const PID = () => process.env.GA4_PROPERTY_ID;
const API = (m: string) => `https://analyticsdata.googleapis.com/v1beta/properties/${PID()}:${m}`;

async function run(tok: string, body: any) {
  const r = await fetch(API('runReport'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error?.message || 'GA4 오류');
  return d.rows || [];
}
async function realtime(tok: string, dims: string[]) {
  const r = await fetch(API('runRealtimeReport'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ dimensions: dims.map((n) => ({ name: n })), metrics: [{ name: 'activeUsers' }], limit: 20 }),
  });
  const d = await r.json();
  return r.ok ? (d.rows || []) : [];
}
const num = (row: any, i: number) => Number(row?.metricValues?.[i]?.value ?? 0);
const dim = (row: any, i: number) => row?.dimensionValues?.[i]?.value ?? '';

async function totals(tok: string, start: string, end: string) {
  const rows = await run(tok, {
    dateRanges: [{ startDate: start, endDate: end }],
    metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }],
  });
  return { users: num(rows[0], 0), sessions: num(rows[0], 1), views: num(rows[0], 2) };
}

export async function POST({ request }: { request: Request }) {
  const J = (o: any, status = 200) =>
    new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json' } });
  try {
    const { password } = await request.json().catch(() => ({}));
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) return J({ error: '서버에 ADMIN_PASSWORD가 설정되지 않았습니다.' }, 500);
    if (!password || password !== expected) return J({ error: '비밀번호가 올바르지 않습니다.' }, 401);
    if (!process.env.GA_SA_KEY || !process.env.GA4_PROPERTY_ID)
      return J({ error: '서버에 GA_SA_KEY / GA4_PROPERTY_ID가 설정되지 않았습니다.' }, 500);

    const sa = JSON.parse(process.env.GA_SA_KEY);
    if (sa.private_key) sa.private_key = String(sa.private_key).replace(/\\n/g, '\n');
    const tok = await getToken(sa);

    // 요약
    const [today, yesterday, last7, last30] = await Promise.all([
      totals(tok, 'today', 'today'),
      totals(tok, 'yesterday', 'yesterday'),
      totals(tok, '7daysAgo', 'today'),
      totals(tok, '30daysAgo', 'today'),
    ]);

    // 일별(14일)
    const dailyRows = await run(tok, {
      dateRanges: [{ startDate: '13daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }], metrics: [{ name: 'totalUsers' }, { name: 'screenPageViews' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });
    const daily = dailyRows.map((r: any) => ({ date: dim(r, 0), users: num(r, 0), views: num(r, 1) }));

    // 외부/본인/봇 분류(7일) = 한국 신규 / 한국 재방문 / 그 외
    const clsRows = await run(tok, {
      dateRanges: [{ startDate: '6daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'country' }, { name: 'newVsReturning' }], metrics: [{ name: 'totalUsers' }],
    });
    let external = 0, owner = 0, bot = 0;
    for (const r of clsRows) {
      const kr = dim(r, 0) === 'South Korea', nvr = dim(r, 1), u = num(r, 0);
      if (kr && nvr === 'new') external += u; else if (kr && nvr === 'returning') owner += u; else bot += u;
    }

    // 도시(7일)
    const cityRows = await run(tok, {
      dateRanges: [{ startDate: '6daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'city' }, { name: 'country' }], metrics: [{ name: 'totalUsers' }, { name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }], limit: 15,
    });
    const cities = cityRows.map((r: any) => ({ city: dim(r, 0) || '(미상)', country: dim(r, 1), users: num(r, 0), views: num(r, 1) }));

    // 글별 조회 + 체류시간(7일)
    const pageRows = await run(tok, {
      dateRanges: [{ startDate: '6daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pageTitle' }], metrics: [{ name: 'screenPageViews' }, { name: 'userEngagementDuration' }, { name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 20,
    });
    const pages = pageRows.map((r: any) => {
      const views = num(r, 0), engSec = num(r, 1);
      return { title: dim(r, 0), views, users: num(r, 2), avgSec: views ? Math.round(engSec / views) : 0 };
    });

    // 유입경로(7일)
    const srcRows = await run(tok, {
      dateRanges: [{ startDate: '6daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }], metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 12,
    });
    const sources = srcRows.map((r: any) => ({ source: dim(r, 0), medium: dim(r, 1), sessions: num(r, 0) }));

    // 기기(7일)
    const devRows = await run(tok, {
      dateRanges: [{ startDate: '6daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'deviceCategory' }], metrics: [{ name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
    });
    const devices = devRows.map((r: any) => ({ device: dim(r, 0), users: num(r, 0) }));

    // 실시간
    const rtTotal = await realtime(tok, []);
    const rtCity = await realtime(tok, ['city']);
    const rtPage = await realtime(tok, ['unifiedScreenName']);
    const realtimeData = {
      active: rtTotal[0] ? num(rtTotal[0], 0) : 0,
      cities: rtCity.map((r: any) => ({ city: dim(r, 0) || '(미상)', n: num(r, 0) })),
      pages: rtPage.map((r: any) => ({ page: dim(r, 0), n: num(r, 0) })),
    };

    return J({
      generatedAt: new Date().toISOString(),
      summary: { today, yesterday, last7, last30 },
      daily, classify: { external, owner, bot }, cities, pages, sources, devices, realtime: realtimeData,
    });
  } catch (e: any) {
    return J({ error: 'GA4 조회 실패: ' + (e?.message || String(e)) }, 500);
  }
}
