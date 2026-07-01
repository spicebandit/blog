/**
 * 예약 발행: 지정한 draft 글을 draft 해제 + pubDate=현재로 바꿔 발행(빌드→커밋→푸시→옵시디언→텔레그램 알림).
 * 사용:  node scripts/publish-one.mjs <slug> [--plist <label>]
 * 멱등: draft가 아니면(이미 발행/없음) 아무것도 안 하고 알림만. 성공 후 --plist 지정 시 해당 launchd 잡 제거.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { sendTelegram } from './notify-telegram.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
const plistLabel = process.argv.includes('--plist') ? process.argv[process.argv.indexOf('--plist') + 1] : null;
const file = join(ROOT, 'src/content/blog', `${slug}.md`);

function nowKstIso() {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:00+09:00`;
}

if (!slug || !existsSync(file)) {
  await sendTelegram(`⚠️ 예약발행 실패: 파일 없음 (${slug})`);
  process.exit(1);
}
let text = readFileSync(file, 'utf8');
if (!/^draft:\s*true\s*$/m.test(text)) {
  await sendTelegram(`ℹ️ 예약발행 건너뜀: '${slug}'은 이미 발행됐거나 draft가 아닙니다.`);
  process.exit(0);
}

// draft 줄 제거 + pubDate 교체
text = text.replace(/^draft:\s*true\s*\n/m, '');
text = text.replace(/^pubDate:.*$/m, `pubDate: ${nowKstIso()}`);
writeFileSync(file, text);

const title = (text.match(/^title:\s*"?(.+?)"?\s*$/m) || [])[1] || slug;

try {
  execSync('npm run build', { cwd: ROOT, stdio: 'pipe' });
} catch (e) {
  await sendTelegram(`⚠️ 예약발행 빌드 실패: ${title}\n(draft 상태로 되돌립니다)`);
  writeFileSync(file, readFileSync(file, 'utf8').replace(/^(pubDate:.*)$/m, `$1\ndraft: true`));
  process.exit(1);
}
try {
  execSync(`git add -A && git commit -q -m "post: ${title} (예약 발행)" && git push`, { cwd: ROOT, stdio: 'pipe' });
  try { execSync('node scripts/sync-to-obsidian.mjs', { cwd: ROOT, stdio: 'pipe' }); } catch {}
  await sendTelegram(`✅ 예약 발행 완료: ${title}\n🔗 https://baseload.co.kr/blog/${slug}/`);
  if (plistLabel) {
    try {
      execSync(`launchctl bootout gui/$(id -u)/${plistLabel} 2>/dev/null; rm -f "$HOME/Library/LaunchAgents/${plistLabel}.plist"`, { stdio: 'pipe', shell: '/bin/bash' });
    } catch {}
  }
} catch (e) {
  await sendTelegram(`⚠️ 예약발행 git 실패: ${title}\n${String(e).slice(0, 120)}`);
  process.exit(1);
}
