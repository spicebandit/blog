/**
 * 아침 종합보고 (paperclip 대체) — 매일 07:00 launchd 실행.
 * 트래픽(GA4, 전일) + 어제 발행 글 + 검토 대기 초안을 한 통으로 텔레그램 전송.
 * paperclip(뉴스룸) 없이 동작. 사용:  node scripts/morning-brief.mjs [--dry]
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { sendTelegram } from './notify-telegram.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG = join(ROOT, 'src/content/blog');
const DRY = process.argv.includes('--dry');

function kstDate(d = new Date()) {
  return new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
}
// kstDate()가 돌려주는 Date는 '로컬 필드'에 KST 벽시계가 담겨 있다.
// toISOString()은 UTC로 재변환해 날짜가 하루 밀릴 수 있으므로, 로컬 필드로 직접 포맷한다.
function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const now = kstDate();
const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
const yStr = ymd(yesterday);

const CAT = { energy: '에너지', economy: '경제', ai: 'AI·AX', life: 'Editor' };

// frontmatter 파싱(간단)
function parse(file) {
  const t = readFileSync(join(BLOG, file), 'utf8');
  const m = t.match(/^---\n([\s\S]*?)\n---/);
  const d = {};
  if (m) for (const line of m[1].split('\n')) {
    const i = line.indexOf(':'); if (i === -1) continue;
    d[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return d;
}

const files = readdirSync(BLOG).filter(f => f.endsWith('.md'));
const publishedYesterday = [];
const pendingDrafts = [];
for (const f of files) {
  const d = parse(f);
  const isDraft = String(d.draft) === 'true';
  const pub = (d.pubDate || '').slice(0, 10);
  if (isDraft) pendingDrafts.push({ f, ...d });
  else if (pub === yStr) publishedYesterday.push({ f, ...d });
}

// 트래픽: daily-stats --dry 출력 재활용
let traffic = '';
try {
  traffic = execSync('node scripts/daily-stats.mjs --dry', { cwd: ROOT, encoding: 'utf8' })
    .replace(/^--- DRY RUN[^\n]*\n/, '').trim();
} catch (e) { traffic = '(트래픽 조회 실패 — GA4 확인 필요)'; }

const mm = now.getMonth() + 1, dd = now.getDate();
const lines = [`📋 <b>${mm}월 ${dd}일 블로그 데일리 브리프</b>`, ''];

lines.push(`📝 <b>어제 발행</b> (${publishedYesterday.length}건)`);
if (publishedYesterday.length) for (const p of publishedYesterday)
  lines.push(`• ${p.title} [${CAT[p.category] || p.category}]`);
else lines.push('• 없음');

lines.push('', `📄 <b>검토 대기 초안</b> (${pendingDrafts.length}건)`);
if (pendingDrafts.length) for (const p of pendingDrafts)
  lines.push(`• ${p.title} [${CAT[p.category] || p.category}] — ${p.f}`);
else lines.push('• 없음');

// 애드센스 승인 상태 (승인되면 Claude 클러스터 착수 트리거) — 사파리 세션으로 확인
let adsense = '';
try {
  const r = execSync('osascript scripts/adsense-status.applescript', { cwd: ROOT, encoding: 'utf8', timeout: 45000 }).trim();
  const head = r.split('|')[0];
  if (head === 'APPROVED') adsense = '🎉 <b>승인됨!</b> → Claude 클러스터 착수 가능 (설계 완료, "시작하자"만 주세요)';
  else if (head === 'REVIEWING') adsense = '🟡 심사 중 (승인 대기 — 승인되면 이 줄이 🎉로 바뀝니다)';
  else if (head === 'LOGIN_EXPIRED') adsense = '⚠️ 확인 실패 (사파리 애드센스 로그인 만료) — 재로그인 필요';
  else adsense = '❔ 상태 불명 — adsense.google.com 수동 확인 권장';
} catch (e) { adsense = '⚠️ 자동 확인 오류 — adsense.google.com 수동 확인 권장'; }
lines.push('', `💰 <b>애드센스</b>`, adsense);

lines.push('', traffic);

const msg = lines.join('\n');
if (DRY) { console.log(msg.replace(/<\/?[^>]+>/g, '')); }
else { const ok = await sendTelegram(msg); console.log(ok ? '✅ 브리프 전송' : '⚠️ 전송 실패'); }
