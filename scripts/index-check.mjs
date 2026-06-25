// 구글 색인 상태 점검 (Search Console URL Inspection API)
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSign } from 'node:crypto';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
function loadEnv() {
  try {
    for (const line of readFileSync(join(ROOT, '.env'), 'utf8').split('\n')) {
      const t = line.trim(); if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('='); if (eq === -1) continue;
      const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {}
}
const b64 = (s) => Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function token(sa) {
  const now = Math.floor(Date.now() / 1000);
  const h = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const c = b64(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const si = `${h}.${c}`; const s = createSign('RSA-SHA256'); s.update(si);
  const jwt = `${si}.${b64(s.sign(sa.private_key))}`;
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }) });
  const d = await r.json(); if (!d.access_token) throw new Error(JSON.stringify(d)); return d.access_token;
}
async function inspect(tok, siteUrl, url) {
  const r = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inspectionUrl: url, siteUrl }),
  });
  const d = await r.json();
  if (!r.ok) return { url, error: d.error?.message || r.status };
  const i = d.inspectionResult?.indexStatusResult ?? {};
  return { url, verdict: i.verdict, coverage: i.coverageState, lastCrawl: i.lastCrawlTime, robots: i.robotsTxtState, indexing: i.indexingState, canonical: i.googleCanonical };
}
async function main() {
  loadEnv();
  const kf = process.env.GA_SA_KEY_FILE;
  const path = kf.startsWith('~') ? join(process.env.HOME, kf.slice(1)) : kf;
  const sa = JSON.parse(readFileSync(path, 'utf8'));
  const site = process.env.GSC_SITE || 'sc-domain:baseload.co.kr';
  const tok = await token(sa);
  const urls = process.argv.slice(2);
  const targets = urls.length ? urls : [
    'https://www.baseload.co.kr/',
    'https://www.baseload.co.kr/blog/2026-06-25-micron-fy26-q3-earnings-ai-memory/',
    'https://www.baseload.co.kr/blog/2026-06-25-us-quantum-computing-white-house-policy/',
    'https://www.baseload.co.kr/blog/claude-code-stock-agent-2-kis-api/',
    'https://www.baseload.co.kr/blog/vscode-claude-code-usage-guide/',
    'https://www.baseload.co.kr/blog/2026-06-18-nuclear-power-role-and-debate/',
  ];
  console.log(`\n구글 색인 상태 점검 (${site})\n`);
  for (const u of targets) {
    const res = await inspect(tok, site, u);
    if (res.error) { console.log(`✗ ${res.url.replace('https://www.baseload.co.kr', '')}\n   오류: ${res.error}`); continue; }
    const mark = res.verdict === 'PASS' ? '✅' : res.verdict === 'NEUTRAL' ? '⏳' : '⚠️';
    console.log(`${mark} ${res.url.replace('https://www.baseload.co.kr', '')}`);
    console.log(`   판정:${res.verdict} · 색인:${res.coverage} · 크롤:${res.lastCrawl || '없음'} · robots:${res.robots}`);
  }
  console.log('\n[해석] coverage="Submitted and indexed"=색인완료 / "Crawled - currently not indexed"=크롤됐으나 보류 / "Discovered - currently not indexed"=발견만, 크롤 대기 / "URL is unknown to Google"=아직 모름\n');
}
main().catch((e) => { console.error('오류:', e.message); process.exit(1); });
