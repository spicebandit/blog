/**
 * 새 댓글 읽기 → 텔레그램 알림. (편집자 수정요청 = owner_note는 별도로 강조)
 *
 * Supabase에서 processed=false 댓글을 가져와 요약 전송하고, 전송한 건은 processed=true로 표시한다.
 * 편집자(소유자) 댓글(owner_note)은 "✍️ 편집요청"으로 앞에 모아, 내가 본문 수정에 반영하도록 한다.
 * 공개 독자 댓글은 참고 알림.
 *
 * 사용:
 *   node scripts/read-comments.mjs          # 새 댓글 전송 + processed 표시
 *   node scripts/read-comments.mjs --dry     # 전송/표시 없이 콘솔 출력만
 *
 * 환경변수(.env): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sendTelegram } from './notify-telegram.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');

// .env 로드(다른 스크립트와 동일 패턴)
try {
  for (const line of readFileSync(join(ROOT, '.env'), 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    if (!(k in process.env)) process.env[k] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
} catch {}

const URL_ = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!URL_ || !KEY) {
  console.error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 가 .env에 없습니다.');
  process.exit(1);
}

async function sb(path, init = {}) {
  const r = await fetch(`${URL_}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  const text = await r.text();
  const data = text ? JSON.parse(text) : null;
  if (!r.ok) throw new Error(data?.message || `Supabase ${r.status}`);
  return data;
}

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clip = (s, n) => { s = String(s ?? ''); return s.length > n ? s.slice(0, n) + '…' : s; };

async function main() {
  const rows = await sb(
    'comments?processed=eq.false&order=created_at.asc&select=id,slug,author,body,role,created_at',
  );
  if (!rows.length) {
    console.log('새 댓글 없음.');
    return;
  }

  const owner = rows.filter((r) => r.role === 'owner_note');
  const pub = rows.filter((r) => r.role !== 'owner_note');

  const lines = [`💬 <b>새 댓글 ${rows.length}건</b>`];
  if (owner.length) {
    lines.push(`\n✍️ <b>편집요청(비공개) ${owner.length}건</b> — 본문 반영 검토`);
    owner.forEach((r) => {
      lines.push(`• <code>${esc(r.slug)}</code>\n  ${esc(clip(r.body, 300))}`);
    });
  }
  if (pub.length) {
    lines.push(`\n🗣 <b>공개 댓글 ${pub.length}건</b>`);
    pub.forEach((r) => {
      lines.push(`• <b>${esc(clip(r.author, 20))}</b> · <code>${esc(r.slug)}</code>\n  ${esc(clip(r.body, 200))}`);
    });
  }
  const text = lines.join('\n');

  if (DRY) {
    console.log('--- DRY RUN ---\n' + text);
    return;
  }

  const ok = await sendTelegram(text).catch(() => false);
  // 전송 성공 시에만 processed 표시(실패하면 다음 실행에 재시도)
  if (ok !== false) {
    const ids = rows.map((r) => r.id);
    await sb(`comments?id=in.(${ids.join(',')})`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ processed: true }),
    });
    console.log(`전송 완료 · ${rows.length}건 processed 표시.`);
  } else {
    console.log('전송 실패 — processed 표시 안 함(다음 실행에 재시도).');
  }
}

main().catch((e) => { console.error('read-comments 오류:', e.message); process.exit(1); });
