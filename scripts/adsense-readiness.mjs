// 애드센스 재신청 준비 상태 점검
//
// 2026-08-31 4차 반려('가치 낮은 콘텐츠' + '복제된 콘텐츠 화면에 광고') 대응으로
// ①noindex 페이지 광고 전면 차단 ②검색 성과 0인 얇은 글 20편 noindex ③레퍼런스 글 해설 보강
// 을 마쳤다. 문제는 구글이 이 변경을 다시 크롤링해 색인에서 빼기까지 시간이 걸린다는 점이다.
// 색인에 남아 있는 상태로 심사에 들어가면 예전 상태를 보고 판단할 수 있으므로,
// 이 스크립트로 "실제로 빠졌는지"를 확인한 뒤 재신청한다.
//
// 사용: node scripts/adsense-readiness.mjs [--json]
// 종료코드: 0 = 재신청 가능, 1 = 아직 대기, 2 = 오류
//
// 필요 환경변수(.env): GA_SA_KEY_FILE, GSC_SITE(기본 sc-domain:baseload.co.kr)
// URL 검사 API 쿼터: 사이트당 하루 2,000회 — 수십 건 점검은 여유롭다.

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSign } from 'node:crypto';

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_BASE = 'https://www.baseload.co.kr';
const JSON_OUT = process.argv.includes('--json');

// 색인에서 빠졌다고 볼 판정 기준.
// 구글은 noindex를 확인하면 coverageState를 'Excluded by ‘noindex’ tag' 등으로 바꾼다.
const DROPPED = /noindex|not indexed|excluded|crawled - currently not indexed|discovered/i;

function loadEnv() {
  try {
    for (const line of readFileSync(join(PROJECT_ROOT, '.env'), 'utf8').split('\n')) {
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

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  };
  const input = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(JSON.stringify(claim))}`;
  const signer = createSign('RSA-SHA256');
  signer.update(input);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${input}.${b64url(signer.sign(sa.private_key))}`,
    }),
  });
  const d = await res.json();
  if (!res.ok || !d.access_token) throw new Error(`토큰 발급 실패: ${d.error_description || res.status}`);
  return d.access_token;
}

async function inspect(token, site, url) {
  const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: site }),
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error?.message || `HTTP ${res.status}`);
  const r = d.inspectionResult?.indexStatusResult ?? {};
  return { verdict: r.verdict ?? '?', coverage: r.coverageState ?? '?' };
}

// noindex가 걸린 글의 슬러그를 수집한다(한글·영문 각각 경로가 다르다)
function noindexTargets() {
  const out = [];
  for (const [dir, prefix] of [['src/content/blog', '/blog/'], ['src/content/blog-en', '/en/blog/']]) {
    let files = [];
    try { files = readdirSync(join(PROJECT_ROOT, dir)).filter((f) => f.endsWith('.md')); } catch { continue; }
    for (const f of files) {
      const t = readFileSync(join(PROJECT_ROOT, dir, f), 'utf8');
      const head = t.split('---')[1] ?? '';
      if (!/^noindex:\s*true/m.test(head)) continue;
      if (/^draft:\s*true/m.test(head)) continue; // draft는 애초에 색인 대상이 아니다
      out.push({ slug: f.slice(0, -3), url: `${SITE_BASE}${prefix}${f.slice(0, -3)}/` });
    }
  }
  return out;
}

async function main() {
  loadEnv();
  const site = process.env.GSC_SITE || 'sc-domain:baseload.co.kr';
  const keyFile = process.env.GA_SA_KEY_FILE;
  if (!keyFile) throw new Error('GA_SA_KEY_FILE 이 .env에 없습니다.');
  const sa = JSON.parse(readFileSync(keyFile.replace(/^~/, process.env.HOME), 'utf8'));
  const token = await getAccessToken(sa);

  const targets = noindexTargets();
  const still = [];
  const dropped = [];
  const unknown = [];

  for (const t of targets) {
    let r;
    try {
      r = await inspect(token, site, t.url);
    } catch (e) {
      unknown.push({ ...t, coverage: `조회 실패: ${e.message}` });
      continue;
    }
    const row = { ...t, ...r };
    if (DROPPED.test(r.coverage)) dropped.push(row);
    else if (/indexed/i.test(r.coverage)) still.push(row);
    else unknown.push(row);
    await new Promise((s) => setTimeout(s, 250)); // 분당 쿼터 여유
  }

  const total = targets.length;
  const ready = still.length === 0;

  // 아침 브리프가 읽어 갈 캐시. 이 검사는 수 분이 걸려 브리프에서 직접 돌릴 수 없다.
  writeFileSync(join(PROJECT_ROOT, '.adsense-readiness.json'), JSON.stringify({
    checkedAt: new Date().toISOString(),
    total, dropped: dropped.length, still: still.length, unknown: unknown.length, ready,
    stillList: still.map((s) => s.slug),
  }, null, 2));

  if (JSON_OUT) {
    console.log(JSON.stringify({ total, dropped: dropped.length, still: still.length, unknown: unknown.length, ready, stillList: still.map((s) => s.slug) }, null, 2));
  } else {
    console.log(`■ 애드센스 재신청 준비 점검 — noindex 대상 ${total}건`);
    console.log(`  색인에서 빠짐 ${dropped.length} · 아직 색인됨 ${still.length} · 판정 불가 ${unknown.length}\n`);
    if (still.length) {
      console.log('  아직 색인에 남아 있는 글:');
      for (const s of still) console.log(`    · ${s.slug} — ${s.coverage}`);
      console.log('');
    }
    if (unknown.length) {
      console.log('  판정 불가:');
      for (const s of unknown) console.log(`    · ${s.slug} — ${s.coverage}`);
      console.log('');
    }
    console.log(ready
      ? '✅ 재신청 가능 — noindex 글이 모두 색인에서 빠졌습니다.'
      : `⏳ 대기 — ${still.length}건이 아직 색인에 남아 있습니다. 일주일 뒤 다시 확인하세요.`);
  }
  process.exit(ready ? 0 : 1);
}

main().catch((e) => { console.error('오류:', e.message); process.exit(2); });
