#!/usr/bin/env node
/**
 * 텔레그램 알림 헬퍼 (재사용 가능 모듈)
 *
 * Telegram Bot API(sendMessage)로 메시지를 보낸다.
 * .env 의 TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID 를 사용한다.
 *
 * 모듈로 사용:
 *   import { sendTelegram } from './notify-telegram.mjs';
 *   await sendTelegram('보낼 메시지');   // 실패해도 throw 하지 않고 {ok:false} 반환
 *
 * 단독 실행(테스트):
 *   node scripts/notify-telegram.mjs "테스트 메시지"
 *
 * 설계 원칙: 토큰이 없거나 전송 실패해도 호출한 쪽 스크립트가 죽지 않도록
 * 절대 throw 하지 않고 {ok, reason} 형태로 결과만 돌려준다.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

/** .env를 직접 파싱해 process.env에 주입 (fetch-images.mjs와 동일 패턴) */
function loadEnv() {
  try {
    const raw = readFileSync(join(PROJECT_ROOT, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // .env 없어도 (이미 환경변수로 주입된 경우 등) 조용히 통과
  }
}

/**
 * 텔레그램으로 메시지 전송.
 * @param {string} text 보낼 본문
 * @param {object} [opts] { parseMode } parseMode 기본 'HTML'
 * @returns {Promise<{ok: boolean, reason?: string}>} 절대 throw 하지 않음
 */
export async function sendTelegram(text, opts = {}) {
  try {
    loadEnv();
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return { ok: false, reason: 'TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID 가 없음 (.env 확인)' };
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const body = {
      chat_id: chatId,
      text,
      parse_mode: opts.parseMode ?? 'HTML',
      disable_web_page_preview: true,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const j = await res.json();
        if (j && j.description) detail += ` - ${j.description}`;
      } catch {
        // 응답 본문 파싱 실패는 무시
      }
      return { ok: false, reason: `텔레그램 API 오류: ${detail}` };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, reason: `전송 예외: ${err?.message ?? String(err)}` };
  }
}

// 단독 실행 시: 인자로 받은 텍스트를 테스트 전송
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const msg = process.argv.slice(2).join(' ') || '✅ 텔레그램 알림 테스트입니다.';
  const result = await sendTelegram(msg);
  if (result.ok) {
    console.log('✅ 텔레그램 전송 성공');
  } else {
    console.error('⚠️ 텔레그램 전송 실패:', result.reason);
    process.exitCode = 1;
  }
}
