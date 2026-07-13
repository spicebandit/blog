#!/usr/bin/env node
// IndexNow ping — Bing·Yandex·Naver 등 참여 검색엔진에 URL 색인을 즉시 통보.
// 사용:
//   node scripts/indexnow-ping.mjs <url> [<url> ...]   # 특정 URL 제출
//   node scripts/indexnow-ping.mjs --all               # 발행된 전체 글(한/영) 제출
// 인증키 파일: public/<KEY>.txt (내용 = KEY). keyLocation을 IndexNow가 대조해 소유권 확인.
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HOST = 'www.baseload.co.kr';
const BASE = `https://${HOST}`;

// public/ 에서 32자리 hex 키파일을 자동 탐색 (재생성해도 코드 수정 불필요)
const keyFile = readdirSync(join(ROOT, 'public')).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) { console.error('IndexNow 키파일(public/<32hex>.txt)이 없습니다.'); process.exit(1); }
const KEY = keyFile.replace(/\.txt$/, '');
const keyLocation = `${BASE}/${keyFile}`;

function frontmatter(txt) {
  const m = txt.match(/^---([\s\S]*?)---/);
  return m ? m[1] : '';
}
function isPublished(fm) {
  if (/^draft:\s*true/m.test(fm)) return false;
  const pd = (fm.match(/^pubDate:\s*(.+)$/m) || [])[1];
  if (!pd) return true;
  return new Date(pd.trim()).getTime() <= Date.now();
}

function collectAll() {
  const urls = [BASE + '/'];
  const ko = join(ROOT, 'src/content/blog');
  for (const f of readdirSync(ko).filter((f) => f.endsWith('.md'))) {
    if (isPublished(frontmatter(readFileSync(join(ko, f), 'utf8')))) urls.push(`${BASE}/blog/${f.replace(/\.md$/, '')}/`);
  }
  const en = join(ROOT, 'src/content/blog-en');
  for (const f of readdirSync(en).filter((f) => f.endsWith('.md'))) {
    if (isPublished(frontmatter(readFileSync(join(en, f), 'utf8')))) urls.push(`${BASE}/en/blog/${f.replace(/\.md$/, '')}/`);
  }
  return urls;
}

const args = process.argv.slice(2);
const urlList = args.includes('--all') ? collectAll() : args.filter((a) => a.startsWith('http'));
if (urlList.length === 0) { console.error('제출할 URL이 없습니다.'); process.exit(1); }

const body = { host: HOST, key: KEY, keyLocation, urlList };
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});
console.log(`IndexNow POST ${urlList.length}건 → HTTP ${res.status} ${res.statusText}`);
// 200 OK / 202 Accepted = 정상. 그 외는 본문 출력.
if (![200, 202].includes(res.status)) console.log(await res.text());
process.exit([200, 202].includes(res.status) ? 0 : 2);
