#!/usr/bin/env node
/**
 * 오늘 자동 발행 결과를 아침에 알린다 (평일 07:02).
 *
 * 발행 자체는 새벽 05:03에 끝난다(scripts/daily-post.mjs). 실장님이 주무시는
 * 시간이라 그때는 알리지 않고, 결과만 .last-post.json에 적어 둔다.
 * 이 스크립트가 아침에 그 파일을 읽어 텔레그램으로 보낸다.
 * (2026-11-04 지시: "6시 3분에는 발행을 해주고, 나한테는 아침 7시에 알려줘")
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RESULT_FILE = join(ROOT, '.last-post.json');
const DRY = process.argv.includes('--dry');

function loadEnv() {
  try {
    for (const line of readFileSync(join(ROOT, '.env'), 'utf8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const i = t.indexOf('=');
      if (i < 0) continue;
      const k = t.slice(0, i).trim();
      const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch { /* .env 없으면 환경변수만 쓴다 */ }
}

async function send(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID ?? '60888622';
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN 미설정');
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: false }),
  });
  if (!r.ok) throw new Error('텔레그램 전송 실패: ' + (await r.text()).slice(0, 200));
}

function build(res) {
  if (res.status === 'ok') {
    const lines = [
      '📝 <b>오늘 글 올렸습니다</b>',
      '',
      `<b>${res.title ?? '(제목 없음)'}</b>`,
    ];
    if (res.reason) lines.push('', `왜 이 주제냐면 — ${res.reason}`);
    if (res.fixes) lines.push(`검수에서 고친 것 — ${res.fixes}`);
    if (res.url) lines.push('', res.url);
    lines.push('', '<i>고치고 싶은 곳 있으면 말씀만 주세요.</i>');
    return lines.join('\n');
  }
  return [
    '⚠️ <b>오늘 글을 올리지 못했습니다</b>',
    '',
    res.reason ?? '이유가 기록되지 않았습니다.',
    '',
    '<i>logs/daily-post.err.log 를 보면 자세한 내용이 있습니다. 지금 수동으로 쓸까요?</i>',
  ].join('\n');
}

async function main() {
  const dow = new Date().getDay();
  if (dow === 0 || dow === 6) return;          // 주말은 발행도 알림도 없다

  loadEnv();

  if (!existsSync(RESULT_FILE)) {
    // 발행 작업이 아예 안 돌았거나 결과를 못 남긴 경우. 침묵하면 실장님이 모른다.
    const text =
      '⚠️ <b>오늘 자동 발행 결과를 찾지 못했습니다</b>\n\n' +
      '새벽 작업이 실행되지 않았거나 결과를 남기지 못했습니다.\n' +
      '<i>logs/daily-post.err.log 확인이 필요합니다.</i>';
    if (DRY) { console.log(text); return; }   // --dry에서 실제 발송 금지
    await send(text);
    return;
  }

  const res = JSON.parse(readFileSync(RESULT_FILE, 'utf8'));

  // 이미 보낸 결과는 다시 보내지 않는다(수동 재실행·중복 실행 대비).
  if (res.notifiedAt) {
    console.log('[notify-post] 이미 알림 보냄:', res.notifiedAt);
    return;
  }

  const text = build(res);
  if (DRY) { console.log(text); return; }

  await send(text);
  writeFileSync(RESULT_FILE, JSON.stringify({ ...res, notifiedAt: new Date().toISOString() }, null, 2));
  console.log('[notify-post] 알림 전송 완료');
}

main().catch((e) => {
  console.error('[notify-post] 실패:', e?.message || e);
  process.exitCode = 1;
});
