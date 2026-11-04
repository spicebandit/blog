#!/usr/bin/env node
/**
 * 다음 발행에 쓸 키워드를 적어 둔다.
 *
 * 실장님이 "내일은 ○○로 써줘"라고 하시면 이걸 실행해 둘 것.
 * 다음 평일 아침 자동 발행(scripts/daily-post.mjs)이 이 키워드를 읽어
 * 요일 편성보다 우선해서 쓰고, 쓰기 시작할 때 파일을 비운다.
 *
 *   node scripts/set-keyword.mjs "클로드 코드 터미널 오류"
 *   node scripts/set-keyword.mjs --show     현재 예약된 키워드 확인
 *   node scripts/set-keyword.mjs --clear    예약 취소
 */

import { writeFileSync, readFileSync, existsSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(ROOT, '.next-keyword.json');
const arg = process.argv.slice(2).join(' ').trim();

if (arg === '--show') {
  if (!existsSync(FILE)) {
    console.log('예약된 키워드 없음 — 다음 발행은 요일 편성대로 진행됩니다.');
  } else {
    const k = JSON.parse(readFileSync(FILE, 'utf8'));
    console.log(`예약된 키워드: "${k.keyword}"  (받은 시각: ${k.givenAt})`);
  }
} else if (arg === '--clear') {
  if (existsSync(FILE)) unlinkSync(FILE);
  console.log('예약 취소됨 — 다음 발행은 요일 편성대로 진행됩니다.');
} else if (!arg) {
  console.error('키워드를 넣으세요.  예:  node scripts/set-keyword.mjs "한전 전기요금 인상"');
  process.exitCode = 1;
} else {
  writeFileSync(FILE, JSON.stringify({ keyword: arg, givenAt: new Date().toISOString() }, null, 2));
  console.log(`예약 완료: "${arg}" — 다음 평일 발행에 이 키워드로 씁니다.`);
}
