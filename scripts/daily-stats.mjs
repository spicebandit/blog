#!/usr/bin/env node
/**
 * 블로그 일일 조회수 리포트 (GA4 → 텔레그램)
 *
 * 전날 하루치 조회수/방문자/세션 + 인기 글 TOP5를 GA4 Data API로 가져와
 * 텔레그램으로 전송한다. 매일 오전 7시 launchd가 실행한다.
 *
 * 의존성 없음: 서비스 계정 JSON으로 직접 JWT(RS256)를 서명해
 * access token을 발급받고 REST(batchRunReports)를 호출한다.
 *
 * 필요한 .env 값:
 *   GA4_PROPERTY_ID   GA4 속성 ID(숫자만, 예: 123456789)  ← '측정 ID' G-... 아님
 *   GA_SA_KEY_FILE    서비스 계정 JSON 키 파일 경로 (저장소 밖에 둘 것)
 *   TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID  (이미 설정됨)
 *
 * 사용:
 *   node scripts/daily-stats.mjs          # 전날 기준 리포트 전송
 *   node scripts/daily-stats.mjs --dry    # 텔레그램 전송 없이 콘솔 출력만
 */

import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { sendTelegram } from './notify-telegram.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const DRY = process.argv.includes('--dry');
// pageTitle 끝에 붙는 사이트명 접미사를 떼어낸다. 현재는 ' | BASELOAD'(Base.astro의 <title> 형식),
// 과거 데이터에는 옛 사이트명도 섞여 있어 둘 다 제거한다.
const SITE_SUFFIX = / \| (BASELOAD|세상은 니가 구해라)$/;
// Search Console 속성 (도메인 속성). .env GSC_SITE로 덮어쓸 수 있음.
const GSC_SITE = process.env.GSC_SITE || 'sc-domain:baseload.co.kr';

/** .env 직접 파싱 (다른 스크립트와 동일 패턴) */
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
  } catch {
    /* .env 없으면 이미 환경변수로 주입됐다고 가정 */
  }
}

function b64url(input) {
  return Buffer.from(input).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** 서비스 계정으로 GA 읽기 권한 access token 발급 */
async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: sa.client_email,
    // analytics(GA4) + Search Console(검색 키워드) 둘 다 읽기
    scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const signingInput = `${header}.${claim}`;
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  const jwt = `${signingInput}.${b64url(signer.sign(sa.private_key))}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(`토큰 발급 실패: ${data.error_description || data.error || res.status}`);
  }
  return data.access_token;
}

/** 전날 합계(어제 vs 그제) + 인기 글 TOP5를 한 번에 조회 */
async function fetchReport(token, propertyId) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            // 합계: 어제 / 그제 두 구간을 함께 받아 증감 계산
            dateRanges: [
              { startDate: 'yesterday', endDate: 'yesterday' },
              { startDate: '2daysAgo', endDate: '2daysAgo' },
            ],
            metrics: [
              { name: 'screenPageViews' },
              { name: 'totalUsers' },
              { name: 'sessions' },
            ],
          },
          {
            // 인기 글 TOP5 (어제)
            dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
            dimensions: [{ name: 'pageTitle' }],
            metrics: [{ name: 'screenPageViews' }],
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 5,
          },
          {
            // 최근 7일 일별 추이 (그제까지 말고 어제까지 7일)
            dateRanges: [{ startDate: '7daysAgo', endDate: 'yesterday' }],
            dimensions: [{ name: 'date' }],
            metrics: [{ name: 'screenPageViews' }],
            orderBys: [{ dimension: { dimensionName: 'date' } }],
          },
          {
            // 유입 경로 TOP (어제) — 검색/직접/SNS 등
            dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
            dimensions: [{ name: 'sessionDefaultChannelGroup' }],
            metrics: [{ name: 'sessions' }],
            orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
            limit: 5,
          },
          {
            // 국가별 방문자 (어제). 해외(특히 미국 데이터센터)는 대부분 크롤러봇이라
            // 방문자=조회수 1:1로 잡힌다. 조회수까지 함께 받아 사람/봇 구분에 참고한다.
            dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
            dimensions: [{ name: 'country' }],
            metrics: [{ name: 'totalUsers' }, { name: 'screenPageViews' }],
            orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
            limit: 6,
          },
        ],
      }),
    },
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`GA4 조회 실패: ${data.error?.message || res.status}`);
  }
  return data;
}

/**
 * Search Console 검색 키워드 TOP (최근 7일).
 * GSC는 2~3일 지연이 있어 '어제'만 보면 비기 쉬우므로 7일 창으로 조회한다.
 * 실패(권한/전파 지연 등)해도 GA 리포트를 막지 않도록 throw하지 않고 []를 돌려준다.
 */
async function fetchSearchKeywords(token) {
  try {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
    const start = new Date(Date.now() - 7 * 86400000).toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
    const res = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: start, endDate: today, dimensions: ['query'], rowLimit: 5 }),
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.rows ?? []).map((row) => ({
      query: row.keys?.[0] ?? '',
      clicks: Number(row.clicks ?? 0),
      impressions: Number(row.impressions ?? 0),
      position: Number(row.position ?? 0),
    }));
  } catch {
    return [];
  }
}

/** 두 dateRange 합계 응답에서 어제/그제 지표를 뽑는다 */
function parseTotals(report) {
  const out = {
    yesterday: { views: 0, users: 0, sessions: 0 },
    before: { views: 0, users: 0, sessions: 0 },
  };
  for (const row of report?.rows ?? []) {
    const idx = row.dimensionValues?.[0]?.value; // 'date_range_0' / 'date_range_1'
    const target = idx === 'date_range_0' ? out.yesterday : out.before;
    target.views = Number(row.metricValues?.[0]?.value ?? 0);
    target.users = Number(row.metricValues?.[1]?.value ?? 0);
    target.sessions = Number(row.metricValues?.[2]?.value ?? 0);
  }
  return out;
}

function parseTopPages(report) {
  return (report?.rows ?? []).map((row) => ({
    title: (row.dimensionValues?.[0]?.value ?? '(제목없음)').replace(SITE_SUFFIX, ''),
    views: Number(row.metricValues?.[0]?.value ?? 0),
  }));
}

/** 최근 7일 일별 [{date:'YYYYMMDD', views}] (날짜 오름차순) */
function parseDailySeries(report) {
  return (report?.rows ?? []).map((row) => ({
    date: row.dimensionValues?.[0]?.value ?? '',
    views: Number(row.metricValues?.[0]?.value ?? 0),
  }));
}

// GA4 채널 그룹(영문) → 한글
const CHANNEL_KR = {
  'Direct': '직접 유입',
  'Organic Search': '검색',
  'Organic Social': 'SNS',
  'Social': 'SNS',
  'Referral': '외부 링크',
  'Email': '이메일',
  'Organic Video': '동영상',
  'Unassigned': '미분류',
  '(Other)': '기타',
};

function parseChannels(report) {
  return (report?.rows ?? []).map((row) => {
    const raw = row.dimensionValues?.[0]?.value ?? '미분류';
    return { channel: CHANNEL_KR[raw] ?? raw, sessions: Number(row.metricValues?.[0]?.value ?? 0) };
  });
}

// GA4 국가명(영문) → 한글 + 국기
const COUNTRY_KR = {
  'South Korea': '🇰🇷 한국',
  'United States': '🇺🇸 미국',
  'United Kingdom': '🇬🇧 영국',
  'Japan': '🇯🇵 일본',
  'China': '🇨🇳 중국',
  'Netherlands': '🇳🇱 네덜란드',
  'Poland': '🇵🇱 폴란드',
  'Germany': '🇩🇪 독일',
  'France': '🇫🇷 프랑스',
  'India': '🇮🇳 인도',
  'Canada': '🇨🇦 캐나다',
  'Singapore': '🇸🇬 싱가포르',
};

function parseCountries(report) {
  return (report?.rows ?? []).map((row) => {
    const raw = row.dimensionValues?.[0]?.value ?? '(미상)';
    return {
      country: COUNTRY_KR[raw] ?? raw,
      users: Number(row.metricValues?.[0]?.value ?? 0),
      views: Number(row.metricValues?.[1]?.value ?? 0),
    };
  });
}

/** 값 배열 → 블록문자 스파크라인 */
function sparkline(values) {
  const blocks = '▁▂▃▄▅▆▇█';
  const max = Math.max(...values, 1);
  return values.map((v) => blocks[Math.min(7, Math.round((v / max) * 7))]).join('');
}

/** 증감 화살표 문자열 */
function delta(now, prev) {
  const d = now - prev;
  if (d > 0) return ` (▲${d})`;
  if (d < 0) return ` (▼${Math.abs(d)})`;
  return ' (─)';
}

/** 'YYYYMMDD' → 'M/D' */
function mdLabel(ymd) {
  if (!ymd || ymd.length !== 8) return ymd;
  return `${Number(ymd.slice(4, 6))}/${Number(ymd.slice(6, 8))}`;
}

function formatMessage(totals, topPages, dailySeries, channels, keywords, countries) {
  // 어제 날짜 (KST)
  const y = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const dateStr = y.toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul', month: 'long', day: 'numeric', weekday: 'short',
  });

  const t = totals.yesterday;
  const p = totals.before;
  const lines = [
    `📊 <b>블로그 일일 리포트</b> · ${dateStr}`,
    '',
    `👀 조회수 <b>${t.views.toLocaleString()}</b>${delta(t.views, p.views)}`,
    `🧑 방문자 <b>${t.users.toLocaleString()}</b>${delta(t.users, p.users)}`,
    `🖱 세션 <b>${t.sessions.toLocaleString()}</b>${delta(t.sessions, p.sessions)}`,
    `<i>(괄호는 그제 대비 증감)</i>`,
  ];

  // 최근 7일 추이 (스파크라인 + 합계/일평균)
  if (dailySeries.length > 0) {
    const vals = dailySeries.map((d) => d.views);
    const total7 = vals.reduce((s, v) => s + v, 0);
    const avg7 = Math.round(total7 / vals.length);
    const range = `${mdLabel(dailySeries[0].date)}~${mdLabel(dailySeries[dailySeries.length - 1].date)}`;
    lines.push(
      '',
      `📅 <b>최근 7일</b> · 총 ${total7.toLocaleString()} · 일평균 ${avg7.toLocaleString()}`,
      `<code>${sparkline(vals)}</code> <i>${range}</i>`,
    );
  }

  // 유입 경로 (어제)
  if (channels.length > 0 && t.sessions > 0) {
    const top = channels.slice(0, 4).map((c) => `${c.channel} ${c.sessions}`).join(' · ');
    lines.push('', `🚪 <b>유입경로</b> ${top}`);
  }

  // 국가별 방문자 (어제). 한국이 아닌데 조회수가 방문자 수 이하(1인 1페이지)면
  // 데이터센터 크롤러봇일 가능성이 높아 '봇 추정'으로 표시한다.
  if (countries && countries.length > 0 && t.users > 0) {
    lines.push('', '🌍 <b>국가별 방문자</b>');
    countries.forEach((c) => {
      const isKR = c.country.includes('한국');
      const botish = !isKR && c.views <= c.users;
      lines.push(`· ${c.country} ${c.users}명 (조회 ${c.views})${botish ? ' <i>↩봇 추정</i>' : ''}`);
    });
  }

  // 검색 키워드 (최근 7일, Search Console) — 데이터 있을 때만 노출
  if (keywords && keywords.length > 0) {
    lines.push('', '🔑 <b>검색 키워드 TOP</b> <i>(최근 7일)</i>');
    keywords.forEach((k, i) => {
      lines.push(`${i + 1}. ${k.query} — 클릭 ${k.clicks} · 노출 ${k.impressions}`);
    });
  }

  if (topPages.length > 0 && t.views > 0) {
    lines.push('', '🔥 <b>인기 글 TOP5</b>');
    topPages.forEach((page, i) => {
      lines.push(`${i + 1}. ${page.title} — ${page.views.toLocaleString()}`);
    });
  } else {
    lines.push('', '어제는 집계된 조회가 없었어요.');
  }

  return lines.join('\n');
}

async function main() {
  loadEnv();
  const propertyId = process.env.GA4_PROPERTY_ID;
  const keyFile = process.env.GA_SA_KEY_FILE;

  if (!propertyId || !keyFile) {
    const msg = 'GA4_PROPERTY_ID 또는 GA_SA_KEY_FILE 가 .env에 없습니다.';
    console.error('⚠️', msg);
    process.exitCode = 1;
    return;
  }

  let sa;
  try {
    sa = JSON.parse(readFileSync(keyFile.replace(/^~/, process.env.HOME), 'utf8'));
  } catch (err) {
    console.error('⚠️ 서비스 계정 키 파일을 읽지 못했습니다:', keyFile, '-', err.message);
    process.exitCode = 1;
    return;
  }

  try {
    const token = await getAccessToken(sa);
    const data = await fetchReport(token, propertyId);
    const totals = parseTotals(data.reports?.[0]);
    const topPages = parseTopPages(data.reports?.[1]);
    const dailySeries = parseDailySeries(data.reports?.[2]);
    const channels = parseChannels(data.reports?.[3]);
    const keywords = await fetchSearchKeywords(token);
    const countries = parseCountries(data.reports?.[4]);
    const message = formatMessage(totals, topPages, dailySeries, channels, keywords, countries);

    if (DRY) {
      console.log('--- DRY RUN (전송 안 함) ---');
      console.log(message.replace(/<\/?[^>]+>/g, ''));
      return;
    }

    const result = await sendTelegram(message);
    if (result.ok) {
      console.log('✅ 일일 리포트 전송 완료', new Date().toISOString());
    } else {
      console.error('⚠️ 텔레그램 전송 실패:', result.reason);
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('⚠️ 리포트 생성 실패:', err.message);
    process.exitCode = 1;
  }
}

main();
