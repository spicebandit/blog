#!/usr/bin/env node
/**
 * 월드컵 동적 업데이터 스케줄 빌더.
 *
 * logs/worldcup-today.json(플래너의 틱이 생성)을 읽어, '아직 안 끝났고 예상 종료시각이
 * 지금 이후'인 오늘 경기들의 종료시각마다 발화하도록 업데이터 launchd 잡의 plist를
 * 다시 쓰고 reload 한다. 발화 시각 = 예상 종료시각 + 약간의 버퍼.
 *
 * 이 스크립트는 플래너 잡(com.gogumi.blog.worldcup.plan)이 호출한다 — 자기 자신이 아니라
 * 다른 라벨(...update)을 reload 하므로 안전하다.
 *
 * 사용: node scripts/worldcup-build-schedule.mjs           (실제 적용)
 *       node scripts/worldcup-build-schedule.mjs --dry      (plist 내용만 출력, 적용 안 함)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const TODAY_JSON = join(PROJECT_ROOT, 'logs', 'worldcup-today.json');

const UID = process.getuid();
const UPDATE_LABEL = 'com.gogumi.blog.worldcup.update';
const UPDATE_PLIST = join(homedir(), 'Library', 'LaunchAgents', `${UPDATE_LABEL}.plist`);
const TICK = join(PROJECT_ROOT, 'scripts', 'worldcup-tick.sh');
const OUT_LOG = join(PROJECT_ROOT, 'logs', 'worldcup.launchd.out.log');
const ERR_LOG = join(PROJECT_ROOT, 'logs', 'worldcup.launchd.err.log');
const BUFFER_MIN = 5; // 예상 종료시각 + 버퍼 후 발화

const DRY = process.argv.includes('--dry');

function plistXml(intervals) {
  // intervals: [{Day, Hour, Minute}]
  const entries = intervals
    .map(
      (i) => `        <dict>
            <key>Day</key><integer>${i.Day}</integer>
            <key>Hour</key><integer>${i.Hour}</integer>
            <key>Minute</key><integer>${i.Minute}</integer>
        </dict>`
    )
    .join('\n');
  const sci = intervals.length
    ? `    <key>StartCalendarInterval</key>\n    <array>\n${entries}\n    </array>\n`
    : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${UPDATE_LABEL}</string>

    <!-- 경기 종료시각마다 발화 — 플래너(worldcup-plan.sh)가 매일 06:00 이 plist를 다시 쓴다. -->
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>${TICK}</string>
    </array>

${sci}    <key>StandardOutPath</key>
    <string>${OUT_LOG}</string>
    <key>StandardErrorPath</key>
    <string>${ERR_LOG}</string>
</dict>
</plist>
`;
}

function parseKst(s) {
  // "YYYY-MM-DDTHH:MM" (KST, 로컬이 KST라고 가정) → Date
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(s || '');
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], 0, 0);
}

function main() {
  let data;
  try {
    data = JSON.parse(readFileSync(TODAY_JSON, 'utf8'));
  } catch (e) {
    console.error(`worldcup-today.json 읽기 실패: ${e.message} — 빈 스케줄로 처리`);
    data = { matches: [] };
  }

  const now = new Date();
  const intervals = [];
  const picked = [];
  for (const mt of data.matches || []) {
    if (mt.status === 'finished') continue;
    const end = parseKst(mt.end_est_kst);
    if (!end) continue;
    const fire = new Date(end.getTime() + BUFFER_MIN * 60000);
    if (fire <= now) continue; // 이미 지난 종료시각은 06:00 catch-up이 처리
    intervals.push({ Day: fire.getDate(), Hour: fire.getHours(), Minute: fire.getMinutes() });
    picked.push(`${mt.match} → 발화 ${fire.getHours()}:${String(fire.getMinutes()).padStart(2, '0')}`);
  }

  const xml = plistXml(intervals);

  if (DRY) {
    console.log(`[DRY] 예정 발화 ${intervals.length}건:`);
    picked.forEach((p) => console.log('  - ' + p));
    console.log('\n--- plist ---\n' + xml);
    return;
  }

  writeFileSync(UPDATE_PLIST, xml, 'utf8');
  // 다른 라벨이므로 자기 자신 재로딩 위험 없음
  try {
    execSync(`launchctl bootout gui/${UID}/${UPDATE_LABEL}`, { stdio: 'ignore' });
  } catch {
    /* 안 떠 있으면 무시 */
  }
  if (intervals.length) {
    execSync(`launchctl bootstrap gui/${UID} ${JSON.stringify(UPDATE_PLIST)}`, { stdio: 'ignore' });
    console.log(`업데이터 재예약 완료: ${intervals.length}경기`);
    picked.forEach((p) => console.log('  - ' + p));
  } else {
    console.log('오늘 남은 경기 없음 — 업데이터 발화 없음(언로드 상태 유지).');
  }
}

main();
