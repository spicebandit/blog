// 블로그 접속 종합 분석 (유입경로·키워드·국가·도시) — 최근 7일·28일, '본인 제외'
//
// 본인 제외 방식: 본인은 한국에서 거의 재방문(returning)으로 잡히므로,
// GA4 차원 집계를 newVsReturning='new'(신규 방문자)로 필터해 본인 트래픽을 대부분 배제한다.
// 비교용으로 '전체(필터 없음)' 합계도 함께 보여준다.
// 검색 키워드는 Search Console(query) — 본인 검색 유입이 거의 없어 그대로 사용.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSign } from 'node:crypto';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
function loadEnv() { try { for (const l of readFileSync(join(ROOT, '.env'), 'utf8').split('\n')) { const t = l.trim(); if (!t || t.startsWith('#')) continue; const e = t.indexOf('='); if (e < 0) continue; const k = t.slice(0, e).trim(), v = t.slice(e + 1).trim().replace(/^["']|["']$/g, ''); if (!(k in process.env)) process.env[k] = v; } } catch {} }
const b64 = (s) => Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function token(sa) { const now = Math.floor(Date.now() / 1000); const h = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' })); const c = b64(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })); const si = `${h}.${c}`; const s = createSign('RSA-SHA256'); s.update(si); const jwt = `${si}.${b64(s.sign(sa.private_key))}`; const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }) }); const d = await r.json(); if (!d.access_token) throw new Error(JSON.stringify(d)); return d.access_token; }

const newOnly = { filter: { fieldName: 'newVsReturning', stringFilter: { value: 'new' } } };

async function ga4(tok, pid, requests) {
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${pid}:batchRunReports`, {
    method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(JSON.stringify(d.error || d)); return d.reports ?? [];
}
async function gsc(tok, site, body) {
  const r = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
    method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const d = await r.json(); if (!r.ok) return []; return d.rows ?? [];
}
const kst = (ms) => new Date(ms).toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });

const CHANNEL_KR = { 'Direct': '직접 유입', 'Organic Search': '검색', 'Organic Social': 'SNS', 'Social': 'SNS', 'Referral': '외부 링크', 'Email': '이메일', 'Organic Video': '동영상', 'Unassigned': '미분류', '(Other)': '기타' };
const COUNTRY_KR = { 'South Korea': '🇰🇷 한국', 'United States': '🇺🇸 미국', 'United Kingdom': '🇬🇧 영국', 'Japan': '🇯🇵 일본', 'China': '🇨🇳 중국', 'Netherlands': '🇳🇱 네덜란드', 'Poland': '🇵🇱 폴란드', 'Germany': '🇩🇪 독일', 'France': '🇫🇷 프랑스', 'India': '🇮🇳 인도', 'Canada': '🇨🇦 캐나다', 'Singapore': '🇸🇬 싱가포르', 'Hong Kong': '🇭🇰 홍콩', 'Ireland': '🇮🇪 아일랜드', 'Vietnam': '🇻🇳 베트남', 'Taiwan': '🇹🇼 대만' };

function rows(rep) { return rep?.rows ?? []; }
const n = (s) => Number(s ?? 0);

async function main() {
  loadEnv();
  const pid = process.env.GA4_PROPERTY_ID;
  const site = process.env.GSC_SITE || 'sc-domain:baseload.co.kr';
  const kf = process.env.GA_SA_KEY_FILE;
  const path = kf.startsWith('~') ? join(process.env.HOME, kf.slice(1)) : kf;
  const sa = JSON.parse(readFileSync(path, 'utf8'));
  const tok = await token(sa);

  const end = kst(Date.now());
  const start7 = kst(Date.now() - 7 * 86400000);
  const start28 = kst(Date.now() - 28 * 86400000);

  // 차원별 신규(new) 사용자 기준 리포트 (7일/28일)
  const mk = (start, dim, limit = 25) => ({
    dateRanges: [{ startDate: start, endDate: end }],
    dimensions: dim.map((name) => ({ name })),
    metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }],
    dimensionFilter: newOnly,
    orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
    limit,
  });

  // GA4 batchRunReports는 1회 최대 5요청 → 두 번에 나눠 호출
  const repsA = await ga4(tok, pid, [
    mk(start7, ['sessionDefaultChannelGroup'], 10),     // 0 채널 7일
    mk(start28, ['sessionDefaultChannelGroup'], 10),    // 1 채널 28일
    mk(start28, ['sessionSource', 'sessionMedium'], 15),// 2 소스/매체 28일
    mk(start7, ['country'], 12),                        // 3 국가 7일
    mk(start28, ['country'], 12),                       // 4 국가 28일
  ]);
  const repsB = await ga4(tok, pid, [
    mk(start7, ['city'], 20),                           // 5 도시 7일
    mk(start28, ['city'], 20),                          // 6 도시 28일
  ]);
  const reps = [...repsA, ...repsB];

  const sum = (rs, i = 0) => rs.reduce((a, r) => a + n(r.metricValues[i].value), 0);

  const head = (t) => console.log(`\n${'='.repeat(58)}\n${t}\n${'='.repeat(58)}`);

  head('블로그 접속 분석 (본인 제외 = 신규 방문자 기준)');
  console.log(`사이트: ${site} · 기간: 7일(${start7}~${end}) / 28일(${start28}~${end})`);
  console.log('※ 본인은 대부분 한국 재방문으로 잡혀 신규(new) 집계에서 제외됨.\n   해외(미국/네덜란드 등 데이터센터)는 크롤러봇이 다수 — 참고만.');

  // 1) 유입경로
  head('1) 유입경로 (채널 그룹)');
  const fmtCh = (rs) => rs.map((r) => `${(CHANNEL_KR[r.dimensionValues[0].value] ?? r.dimensionValues[0].value)} ${n(r.metricValues[0].value)}명·세션${n(r.metricValues[1].value)}`);
  console.log(`[7일]  신규 ${sum(rows(reps[0]))}명  →  ${fmtCh(rows(reps[0])).join(' / ') || '(없음)'}`);
  console.log(`[28일] 신규 ${sum(rows(reps[1]))}명  →  ${fmtCh(rows(reps[1])).join(' / ') || '(없음)'}`);
  console.log('\n── 유입 소스/매체 TOP (28일, 신규) ──');
  rows(reps[2]).forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. ${r.dimensionValues[0].value} / ${r.dimensionValues[1].value} — ${n(r.metricValues[0].value)}명·세션${n(r.metricValues[1].value)}`));

  // 2) 키워드 (Search Console)
  head('2) 검색 유입 키워드 (구글 Search Console, 28일)');
  const kw = await gsc(tok, site, { startDate: start28, endDate: end, dimensions: ['query'], rowLimit: 25 });
  if (!kw.length) console.log('  (데이터 없음 — 색인 초기/노출 부족이거나 GSC 권한 미설정)');
  kw.forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. ${r.keys[0]}  |  클릭 ${r.clicks} · 노출 ${r.impressions} · CTR ${(r.ctr * 100).toFixed(1)}% · 순위 ${r.position.toFixed(1)}`));
  console.log('\n※ 네이버 organic 키워드는 GA4/API로 안 넘어와 여기 안 잡힘 → 네이버 서치어드바이저에서 확인.');

  // 3) 국가
  head('3) 국가별 (신규 방문자)');
  const fmtCo = (rs) => rs.forEach((r, i) => {
    const raw = r.dimensionValues[0].value;
    const users = n(r.metricValues[0].value), views = n(r.metricValues[2].value);
    const botish = raw !== 'South Korea' && views <= users;
    console.log(`${String(i + 1).padStart(2)}. ${COUNTRY_KR[raw] ?? raw} — ${users}명 · 조회 ${views}${botish ? '  ↩봇 추정' : ''}`);
  });
  console.log(`[7일] 신규 ${sum(rows(reps[3]))}명`); fmtCo(rows(reps[3]));
  console.log(`\n[28일] 신규 ${sum(rows(reps[4]))}명`); fmtCo(rows(reps[4]));

  // 4) 도시
  head('4) 도시별 (신규 방문자)');
  const fmtCi = (rs) => rs.forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. ${r.dimensionValues[0].value || '(미상)'} — ${n(r.metricValues[0].value)}명 · 조회 ${n(r.metricValues[2].value)}`));
  console.log(`[7일] 신규 ${sum(rows(reps[5]))}명`); fmtCi(rows(reps[5]));
  console.log(`\n[28일] 신규 ${sum(rows(reps[6]))}명`); fmtCi(rows(reps[6]));
  console.log('\n※ 도시는 IP 추정이라 통신사 게이트웨이 위치로 뭉칠 수 있음(서울/경기 과대 집계 경향).');
}
main().catch((e) => { console.error('오류:', e.message); process.exit(1); });
