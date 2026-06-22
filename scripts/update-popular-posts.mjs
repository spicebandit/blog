#!/usr/bin/env node
/**
 * 최근 7일 인기 글 업데이트 스크립트 (GA4 → src/data/popular-posts.json)
 *
 * GA4 Data API로 최근 7일간 /blog/* 경로별 조회수를 가져와
 * slug 순위 목록으로 저장한다. 홈페이지 빌드 전에 실행하면
 * 에디터픽 섹션이 인기순으로 정렬된다.
 *
 * 필요한 .env 값:
 *   GA4_PROPERTY_ID   GA4 속성 ID(숫자만, 예: 123456789)
 *   GA_SA_KEY_FILE    서비스 계정 JSON 키 파일 경로
 *
 * 사용:
 *   node scripts/update-popular-posts.mjs          # JSON 업데이트
 *   node scripts/update-popular-posts.mjs --dry    # 콘솔 출력만
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const DRY = process.argv.includes('--dry');
const OUTPUT_FILE = join(PROJECT_ROOT, 'src/data/popular-posts.json');

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
    /* .env 없으면 환경변수로 주입됐다고 가정 */
  }
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
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
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

/** 최근 7일 /blog/* 경로 조회수 TOP 50 */
async function fetchPopularPosts(token, propertyId) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        dimensionFilter: {
          filter: {
            fieldName: 'pagePath',
            stringFilter: {
              matchType: 'BEGINS_WITH',
              value: '/blog/',
            },
          },
        },
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 50,
      }),
    },
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`GA4 조회 실패: ${data.error?.message || res.status}`);
  }
  return data;
}

/** pagePath '/blog/some-slug/' → 'some-slug' */
function extractSlug(pagePath) {
  const m = pagePath.match(/^\/blog\/([^/]+)\/?$/);
  return m ? m[1] : null;
}

async function main() {
  loadEnv();
  const propertyId = process.env.GA4_PROPERTY_ID;
  const keyFile = process.env.GA_SA_KEY_FILE;

  if (!propertyId || !keyFile) {
    console.error('⚠️ GA4_PROPERTY_ID 또는 GA_SA_KEY_FILE 가 없습니다. .env를 확인하세요.');
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

  const token = await getAccessToken(sa);
  const report = await fetchPopularPosts(token, propertyId);

  const posts = (report.rows ?? [])
    .map((row) => {
      const slug = extractSlug(row.dimensionValues?.[0]?.value ?? '');
      const views = Number(row.metricValues?.[0]?.value ?? 0);
      return slug ? { slug, views } : null;
    })
    .filter(Boolean);

  const output = {
    updatedAt: new Date().toISOString(),
    period: '7d',
    posts,
  };

  if (DRY) {
    console.log('--- DRY RUN (파일 저장 안 함) ---');
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2) + '\n');
  console.log(`✅ popular-posts.json 업데이트 완료 (${posts.length}개 글, ${new Date().toISOString()})`);
  posts.slice(0, 5).forEach((p, i) => console.log(`  ${i + 1}. ${p.slug} (${p.views})`));
}

main().catch((err) => {
  console.error('⚠️ 오류:', err.message);
  process.exitCode = 1;
});
