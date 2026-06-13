#!/usr/bin/env node
/**
 * 버니 샌더스 숏츠 아카이브 — 영상 분류기 & '다음 처리할 영상' 선정기
 *
 * 배경(중요):
 *   - 채널 숏츠 245개 중 옛 영상(2016~2020 등)은 영어 자막이 아예 없거나,
 *     버니 본인 연설이 아닌 지지자 후기·홍보 클립이 많다.
 *   - 매 실행마다 이런 영상을 처음부터 훑으면 유튜브 throttling이 걸린다.
 *   => 그래서 '한 번 전체를 분류(scan)해 연설+자막 있는 영상만 큐로 캐싱'하고,
 *      이후 실행은 캐시에서 다음 1개만 꺼낸다(네트워크 호출 없음).
 *
 * 처리 상태:
 *   - 분류 캐시  : scripts/.bernie/classified.json  (영상별 {자막정제본, 글자수, hasSpeech})
 *   - 목록 캐시  : scripts/.bernie/videos.json       (오래된 순 id 목록)
 *   - 발행 완료  : src/content/blog 의 bernie 글 frontmatter `videoId` 에서 자동 도출
 *   - 수동 스킵  : scripts/bernie-skipped.json (커밋) — 자막은 있으나 버니 연설이 아니라
 *                  Claude가 판단해 제외한 영상
 *
 * 사용법:
 *   node scripts/bernie-next.mjs --scan          # 전체 분류(증분·재개 가능, 느림). 한 번 돌려두면 됨
 *   node scripts/bernie-next.mjs --scan --limit 30  # 앞에서 30개만 분류(테스트)
 *   node scripts/bernie-next.mjs --json          # 다음 후보 1개 JSON (캐시 기반, 빠름)
 *   node scripts/bernie-next.mjs                 # 사람이 읽는 다음 후보 요약
 *   node scripts/bernie-next.mjs --status        # 진행 현황
 *   node scripts/bernie-next.mjs --refresh        # 채널 목록 캐시 재생성(새 숏츠 반영)
 *   node scripts/bernie-next.mjs --skip <id> "<사유>"   # 영상 영구 스킵
 *
 * 의존성: yt-dlp (python3 -m yt_dlp), node(JS 런타임으로 사용)
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const BLOG_DIR = join(PROJECT_ROOT, 'src', 'content', 'blog');
const CACHE_DIR = join(__dirname, '.bernie');
const VIDEOS_CACHE = join(CACHE_DIR, 'videos.json');
const CLASSIFIED = join(CACHE_DIR, 'classified.json');
const SKIP_FILE = join(__dirname, 'bernie-skipped.json');

const CHANNEL = 'https://www.youtube.com/@BernieSanders/shorts';
// 정제 후 영문 글자수가 이 값 미만이면 '연설 아님(대사 빈약/자막없음)'으로 본다
const MIN_SPEECH_CHARS = 140;
// 분류 스캔 시 요청 간 간격(ms). throttling 회피용. 환경변수로 조절 가능.
const SCAN_DELAY = Number(process.env.BERNIE_SCAN_DELAY ?? 4000);

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const argVal = (f) => (args.indexOf(f) >= 0 ? args[args.indexOf(f) + 1] : undefined);
const asJson = has('--json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --js-runtimes node + --remote-components ejs:github:
//   유튜브가 요구하는 JS 챌린지(n-sig)를 풀어야 자막 포맷이 누락되지 않는다.
//   솔버 lib는 최초 1회만 내려받아 캐시된다. 이게 없으면 자막이 간헐적으로 빠진다.
const YTDLP_BASE = ['--js-runtimes', 'node', '--remote-components', 'ejs:github'];
function ytdlp(extraArgs, { allowFail = false } = {}) {
  try {
    return execFileSync('python3', ['-m', 'yt_dlp', ...YTDLP_BASE, ...extraArgs], {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    if (allowFail) return null;
    throw err;
  }
}

function ensureYtDlp() {
  if (!ytdlp(['--version'], { allowFail: true })) {
    const msg = 'yt-dlp 를 찾을 수 없습니다. 설치: python3 -m pip install --user yt-dlp';
    if (asJson) console.log(JSON.stringify({ error: msg }));
    else console.error('⚠️ ' + msg);
    process.exit(1);
  }
}

// ---- 채널 목록(오래된 순) ----
function buildVideoList() {
  const raw = ytdlp(['--flat-playlist', '--print', '%(id)s\t%(title)s', CHANNEL]);
  const rows = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const t = l.indexOf('\t');
      return t === -1 ? { id: l, title: '' } : { id: l.slice(0, t), title: l.slice(t + 1) };
    })
    .filter((v) => v.id && v.id !== 'NA');
  rows.reverse();
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(VIDEOS_CACHE, JSON.stringify(rows, null, 2));
  return rows;
}
function getVideoList({ refresh = false } = {}) {
  if (!refresh && existsSync(VIDEOS_CACHE)) {
    try {
      return JSON.parse(readFileSync(VIDEOS_CACHE, 'utf8'));
    } catch {
      /* 재생성 */
    }
  }
  return buildVideoList();
}

// ---- 분류 캐시 ----
function loadClassified() {
  if (!existsSync(CLASSIFIED)) return {};
  try {
    return JSON.parse(readFileSync(CLASSIFIED, 'utf8'));
  } catch {
    return {};
  }
}
function saveClassified(map) {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(CLASSIFIED, JSON.stringify(map, null, 2));
}

// ---- 상태 ----
function getDoneIds() {
  const done = new Set();
  let files = [];
  try {
    files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  } catch {
    return done;
  }
  for (const f of files) {
    let txt;
    try {
      txt = readFileSync(join(BLOG_DIR, f), 'utf8');
    } catch {
      continue;
    }
    const fmEnd = txt.indexOf('\n---', 3);
    const fm = fmEnd === -1 ? txt : txt.slice(0, fmEnd);
    const m = fm.match(/videoId:\s*["']?([\w-]{6,})["']?/);
    if (m) done.add(m[1]);
  }
  return done;
}
function loadSkipped() {
  if (!existsSync(SKIP_FILE)) return [];
  try {
    return JSON.parse(readFileSync(SKIP_FILE, 'utf8'));
  } catch {
    return [];
  }
}
function addSkip(id, reason) {
  const list = loadSkipped();
  if (!list.some((s) => s.id === id)) {
    list.push({ id, reason: reason || 'manual' });
    writeFileSync(SKIP_FILE, JSON.stringify(list, null, 2) + '\n');
  }
}

// ---- 자막 정제 ----
function cleanVtt(vtt) {
  const lines = [];
  for (let ln of vtt.split('\n')) {
    if (
      ln.includes('-->') ||
      ln.trim() === '' ||
      ln.startsWith('WEBVTT') ||
      ln.startsWith('Kind:') ||
      ln.startsWith('Language:')
    )
      continue;
    ln = ln.replace(/<[^>]+>/g, '').trim();
    if (!ln) continue;
    if (lines.length && lines[lines.length - 1] === ln) continue;
    lines.push(ln);
  }
  let text = lines.join(' ');
  text = text.replace(/\[(Applause|Music|Laughter|Cheering|Cheers|Crowd)\]/gi, ' ');
  return text.replace(/\s+/g, ' ').trim();
}

/** 한 영상의 메타 + 정제 영문 스크립트. 자막 없으면 english:'' */
function fetchVideo(id) {
  const url = `https://www.youtube.com/watch?v=${id}`;
  const work = join(tmpdir(), `bernie-${id}-${process.pid}-${Math.abs((id.charCodeAt(0) || 0))}`);
  mkdirSync(work, { recursive: true });
  try {
    // -j(dump-json)는 --simulate 를 함의해 자막 파일이 안 써진다.
    // --no-simulate 를 함께 줘야 json도 받고 자막도 디스크에 기록된다.
    const metaRaw = ytdlp(
      ['-j', '--no-simulate', '--write-auto-subs', '--sub-lang', 'en', '--sub-format', 'vtt', '--skip-download', '-o', join(work, '%(id)s.%(ext)s'), url],
      { allowFail: true }
    );
    if (!metaRaw) return null;
    let meta = {};
    try {
      meta = JSON.parse(metaRaw.split('\n').find((l) => l.trim().startsWith('{')) || '{}');
    } catch {
      /* 메타 파싱 실패 무시 */
    }
    const subFiles = readdirSync(work).filter((f) => f.endsWith('.vtt'));
    const english = subFiles.length ? cleanVtt(readFileSync(join(work, subFiles[0]), 'utf8')) : '';
    const up = meta.upload_date || '';
    return {
      id,
      url,
      title: meta.title || '',
      uploadDate: up.length === 8 ? `${up.slice(0, 4)}-${up.slice(4, 6)}-${up.slice(6, 8)}` : '',
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      english,
      speechChars: english.length,
    };
  } finally {
    try {
      rmSync(work, { recursive: true, force: true });
    } catch {
      /* 무시 */
    }
  }
}

// ---- 명령들 ----
async function cmdScan() {
  ensureYtDlp();
  const list = getVideoList();
  const cache = loadClassified();
  const limit = argVal('--limit') ? Number(argVal('--limit')) : list.length;
  const rescan = has('--rescan');
  let processed = 0,
    speech = 0,
    n = 0;
  for (const v of list) {
    if (n >= limit) break;
    n++;
    if (!rescan && cache[v.id]) {
      if (cache[v.id].hasSpeech) speech++;
      continue;
    }
    let info = fetchVideo(v.id);
    if (info && !info.english) {
      // 자막 없음일 때 1회 재시도(throttling 구분)
      await sleep(SCAN_DELAY);
      const retry = fetchVideo(v.id);
      if (retry && retry.english) info = retry;
    }
    if (!info) info = { id: v.id, url: `https://www.youtube.com/watch?v=${v.id}`, title: v.title, uploadDate: '', thumbnail: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`, english: '', speechChars: 0 };
    info.hasSpeech = info.speechChars >= MIN_SPEECH_CHARS;
    cache[v.id] = info;
    saveClassified(cache); // 매번 저장 → 중단해도 재개 가능
    processed++;
    if (info.hasSpeech) speech++;
    console.log(`[${n}/${list.length}] ${v.id} ${info.uploadDate || '????'} speech:${info.speechChars} ${info.hasSpeech ? '✅' : '·'} ${(info.title || v.title).slice(0, 40)}`);
    await sleep(SCAN_DELAY);
  }
  const total = Object.values(cache).filter((e) => e.hasSpeech).length;
  console.log(`\n분류 완료: 이번 실행 ${processed}개 처리, 누적 연설영상(hasSpeech) ${total}개`);
}

function pickNextFromCache() {
  const list = getVideoList();
  const cache = loadClassified();
  const done = getDoneIds();
  const skip = new Set(loadSkipped().map((s) => s.id));
  let scanned = 0,
    unscanned = 0;
  for (const v of list) {
    const e = cache[v.id];
    if (!e) {
      unscanned++;
      continue;
    }
    scanned++;
    if (!e.hasSpeech || done.has(v.id) || skip.has(v.id)) continue;
    return { candidate: e, unscanned };
  }
  return { candidate: null, unscanned };
}

function cmdNext() {
  const { candidate, unscanned } = pickNextFromCache();
  if (candidate) {
    if (asJson) console.log(JSON.stringify(candidate, null, 2));
    else {
      console.log('━━━━━━ 다음 버니 숏츠 후보 ━━━━━━');
      console.log(`제목   : ${candidate.title}`);
      console.log(`등록일 : ${candidate.uploadDate}`);
      console.log(`링크   : ${candidate.url}`);
      console.log(`썸네일 : ${candidate.thumbnail}`);
      console.log(`영문   : ${candidate.speechChars}자`);
      console.log('--- 영문(앞부분) ---');
      console.log(candidate.english.slice(0, 400) + (candidate.english.length > 400 ? ' …' : ''));
      console.log('\n다음: Claude가 연설 여부 최종판단 → 번역·글 작성 → 발행');
    }
    return;
  }
  if (asJson) console.log(JSON.stringify({ done: true, unscanned }));
  else console.log(unscanned > 0 ? `후보 없음. 아직 분류 안 된 영상 ${unscanned}개 — 먼저 --scan 필요.` : '처리할 새 영상이 없습니다(모두 완료/스킵).');
}

function cmdStatus() {
  const list = getVideoList();
  const cache = loadClassified();
  const done = getDoneIds();
  const skip = new Set(loadSkipped().map((s) => s.id));
  const classified = Object.keys(cache).length;
  const speech = Object.values(cache).filter((e) => e.hasSpeech).length;
  const remaining = list.filter((v) => cache[v.id]?.hasSpeech && !done.has(v.id) && !skip.has(v.id));
  console.log('━━━━━━ 버니 아카이브 현황 ━━━━━━');
  console.log(`전체 숏츠      : ${list.length}`);
  console.log(`분류 완료      : ${classified}`);
  console.log(`연설영상(쓸것) : ${speech}`);
  console.log(`발행 완료      : ${done.size}`);
  console.log(`수동 스킵      : ${skip.size}`);
  console.log(`남은 큐        : ${remaining.length}`);
  if (remaining[0]) console.log(`다음 후보      : ${remaining[0].id} (${cache[remaining[0].id].uploadDate}) ${cache[remaining[0].id].title.slice(0, 40)}`);
}

// ---- main ----
if (has('--refresh')) {
  ensureYtDlp();
  console.log(`채널 목록 캐시 재생성 완료: ${buildVideoList().length}개`);
} else if (has('--scan')) {
  await cmdScan();
} else if (has('--skip')) {
  const id = argVal('--skip');
  if (!id) {
    console.error('사용법: --skip <videoId> "<사유>"');
    process.exit(1);
  }
  addSkip(id, args[args.indexOf('--skip') + 2] || 'not-bernie-speech');
  console.log(`스킵 등록: ${id}`);
} else if (has('--status')) {
  cmdStatus();
} else {
  cmdNext();
}
