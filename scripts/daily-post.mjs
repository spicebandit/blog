#!/usr/bin/env node
/**
 * 매일 1편 자동 발행 (평일만) — 2026-11-04 실장님 지시로 '완전 위임' 전환.
 *
 *   · 주제 선정부터 발행까지 Claude Code가 한다. 사람 승인을 기다리지 않는다.
 *   · 단, 실장님이 키워드를 주신 날은 무조건 그 키워드로 쓴다(.next-keyword.json).
 *   · 발행 결과는 .last-post.json에 적어 두고, 알림은 07:02에 notify-post.mjs가 보낸다
 *     (실장님이 '발행은 6시 전후, 알림은 7시'로 분리를 지시 — 2026-11-04).
 *
 * 이 스크립트가 직접 글을 쓰지는 않는다. 요일·키워드·유형만 정해서 프롬프트를 만들고
 * `claude -p`에 넘긴다. 실제 취재·작성·검수·발행은 그 세션이 CLAUDE.md 규칙대로 한다.
 *
 * 실행:  node scripts/daily-post.mjs          (실제 실행)
 *        node scripts/daily-post.mjs --dry    (프롬프트만 출력, claude 호출 안 함)
 */

import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, unlinkSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const KEYWORD_FILE = join(ROOT, '.next-keyword.json');
const RESULT_FILE = join(ROOT, '.last-post.json');
const DRY = process.argv.includes('--dry');

/* 요일별 영역·유형 편성 (0=일 … 6=토)
   즉답형 3 : 분석형 2. 트래픽은 즉답형이 만들고(네이버 유입이 구글의 37배),
   분석형은 신뢰 자산으로 섞는다. */
const PLAN = {
  1: { area: 'energy',  kind: '분석형' },
  2: { area: 'economy', kind: '즉답형' },
  3: { area: 'ai',      kind: '즉답형' },
  4: { area: 'energy',  kind: '즉답형' },
  5: { area: 'economy', kind: '분석형' },
};
const AREA_LABEL = { energy: '에너지', economy: '경제·경영', ai: 'AI·AX' };

function loadKeyword() {
  if (!existsSync(KEYWORD_FILE)) return null;
  try {
    const k = JSON.parse(readFileSync(KEYWORD_FILE, 'utf8'));
    return k?.keyword ? k : null;
  } catch {
    return null;
  }
}

function buildPrompt({ area, kind, keyword }) {
  const label = AREA_LABEL[area] ?? area;
  const topicRule = keyword
    ? `오늘 주제는 **실장님이 지정하신 키워드: "${keyword}"** 입니다. 이 키워드로 쓰십시오.
영역이 맞지 않으면 키워드를 우선하고, category는 키워드에 맞는 것으로 고르십시오.`
    : `오늘 영역은 **${label}(category: ${area})**, 유형은 **${kind}**입니다.
주제는 당신이 정하십시오. 고르는 순서는 이렇습니다.
1. **네이버 서치어드바이저의 실제 유입 검색어를 1순위로 보십시오.** 사람들이 실제로 친
   문장이 가장 잘 걸립니다. 조회가 어려우면 2번으로 갑니다.
2. 오늘 ${label} 영역에서 이슈가 되는 주제를 웹에서 확인해 고릅니다(NYT·연합뉴스 등).
3. ${kind === '즉답형'
      ? '즉답형이므로 "○○ 언제", "○○ 오류 해결", "○○ 하는 법"처럼 사람이 문제를 들고 그대로 검색하는 문장을 고르십시오. 제목에 그 문장을 그대로 넣습니다.'
      : '분석형이므로 숫자와 맥락으로 풀 수 있는 주제를 고르십시오.'}
4. 이미 쓴 글과 겹치지 않는지 src/content/blog/ 를 확인하십시오.

**★ 주제를 확정하기 전에 반드시 통과시킬 기준 — '우리가 아니면 못 쓰는 각도가 있는가'**
검색량이 많다는 이유만으로 고르지 마십시오. 이 블로그는 **에너지 업계 실무자가 쓰는
에너지·전력 / 경제·산업 / AI·개발도구 블로그**입니다. 독자도 그래서 옵니다.
- **쓴다 — 거시경제는 우리 영역입니다.** 금리·환율·물가·국채·무역·증시·원자재·산업 구조 같은
  **거시경제와 산업 분석은 제한 없이 씁니다.** 이 블로그의 경제 글은 원래 그쪽입니다.
- **쓰지 않는다**: 연말정산·부동산 매매·건강·보험·개인 재테크처럼 **개인의 생활 행정에 가깝고,
  전문 매체가 더 잘 쓰는 생활정보.** 검색량이 아무리 커도 안 됩니다. 사이트 정체성을 흐립니다.
- 가르는 선은 **'시장·산업을 보는 글'이냐 '개인 민원을 돕는 글'이냐**입니다.
  (예: '미국 국채 금리가 왜 오르나'는 쓴다. '연말정산 환급 더 받는 법'은 안 쓴다.
   '전기요금 아끼는 법'은 생활정보지만 '산업용 요금제가 공장 원가를 어떻게 바꾸나'는 우리 글이다.)
- 자문: **"이 글을 다른 블로그가 썼다면 더 잘 썼을까?"** 그렇다면 주제를 바꾸십시오.
- '블로그에 그 주제 글이 하나도 없다'는 것은 기회가 아니라 **영역 밖이라는 신호일 수 있습니다.**

**단, 주제를 고르기 전에 저장소 루트의 topics-backlog.md를 먼저 보십시오.**
실장님이 "언젠가 다뤄보자"고 남긴 주제가 모여 있습니다. 오늘 영역과 맞는 항목이 있으면
그것을 우선 고르고, 쓰고 나면 그 줄을 '발행 완료'로 옮기십시오.`;

  return `당신은 baseload 블로그(~/projects/blog)의 글을 쓰고 발행합니다.
오늘 분 1편을 **작성하고 발행까지** 마치십시오.

${topicRule}

## 반드시 지킬 것
- **~/projects/blog/CLAUDE.md의 글 작성·SEO·이미지·안전 규칙을 그대로 따르십시오.**
  분량·소제목 수·표/그래프·출처 3개 이상·인라인 SVG 색상 팔레트·이미지 출처 표기 전부 포함입니다.
- **SVG 안에 빈 줄을 넣지 마십시오.** 넣으면 그래프가 통째로 사라지는데 빌드는 성공합니다.
- **pubDate는 발행하는 그 시점의 실제 시각**으로 쓰고, **초를 00으로 두지 마십시오.**
- **발행 전 독립 검수를 거치십시오.** 팩트 검수 에이전트와 역사가 리뷰 에이전트를 띄우고,
  지적사항을 반영해 통과시킨 뒤 발행합니다. 자기 글을 자기가 검수하지 않습니다.
- category가 ai인 글은 영문판을 함께 만들어 발행합니다.
- 발행 = draft 제거 + git push. 그 뒤 아래 셋을 **모두** 실행합니다.
  1. node scripts/sync-to-obsidian.mjs
  2. node scripts/indexnow-ping.mjs <URL>   (빙·야후 등 IndexNow 참여 검색엔진)
  3. **scripts/naver-queue.sh add <URL>**   ← 빠뜨리지 마십시오.
     우리 블로그 유입의 대부분이 네이버인데 IndexNow로는 네이버 수집요청이 되지 않습니다.
     대기열에 넣어두면 로그인이 살아 있을 때 별도 작업이 자동으로 제출합니다.
- 배포가 실제로 반영됐는지 라이브 URL로 확인하십시오(Vercel이 가끔 빌드를 걸지 않습니다.
  그럴 땐 빈 커밋으로 다시 트리거하십시오).

## 발행 승인
**실장님이 2026-11-04에 완전 위임하셨습니다. 발행 전 사람 승인을 기다리지 마십시오.**

## 보고 방법 — 텔레그램을 직접 보내지 마십시오
실장님은 새벽에 주무십니다. 알림은 아침 7시 2분에 따로 나갑니다.
대신 **작업이 끝나면 저장소 루트의 .last-post.json 파일에 결과를 적으십시오.**

성공했으면:
{"status":"ok","title":"<글 제목>","url":"<글 URL>","reason":"<이 주제를 고른 이유 한 줄>","fixes":"<검수에서 고친 것 한 줄, 없으면 빈 문자열>"}

발행하지 못했으면:
{"status":"fail","reason":"<무엇이 막혔는지>"}

이 파일을 쓰지 않으면 실장님께 아무 알림도 가지 않습니다. 반드시 쓰십시오.`;
}

/**
 * claude CLI 실행.
 *
 * ⚠️ stdin을 반드시 닫아야 한다(2026-11-06 실제 실패).
 *    launchd가 node를 직접 띄우면 stdin이 연결되지 않는데, claude CLI는 파이프 입력을
 *    기다리다가 "no stdin data received in 3s" 경고를 내고 비정상 종료했다.
 *    execFile은 stdin을 열어둔 채로 두기 때문에 spawn으로 바꾸고 'ignore'를 준다.
 *    (아침 영어 스크립트가 멀쩡했던 건 osascript의 do shell script를 거쳐
 *     stdin이 정상적으로 /dev/null에 연결됐기 때문이다.)
 *
 * 실패 시 stdout도 함께 남긴다. 경고만 stderr에 찍히고 진짜 원인이 stdout에 있는
 * 경우가 있어서, stderr만 보면 원인을 못 찾는다.
 */
function runClaude(prompt) {
  return new Promise((resolve, reject) => {
    const child = spawn('/opt/homebrew/bin/claude', ['-p', prompt], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let out = '', err = '';
    // 타임아웃 120분 (2026-11-09에 45분으로는 모자란다는 게 두 번 확인됐다.
    // 취재 → 작성 → 팩트검수 → 역사가리뷰 → 발행까지 한 시간을 넘긴다.
    // 11/6과 11/9 모두 '글은 완성됐는데 발행 직전에 끊긴' 사고였다.)
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      setTimeout(() => { try { child.kill('SIGKILL'); } catch {} }, 10000);
      reject(new Error('120분 안에 끝나지 않아 중단했습니다.'));
    }, 120 * 60 * 1000);

    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    child.on('error', (e) => { clearTimeout(timer); reject(e); });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) return resolve({ stdout: out, stderr: err });
      reject(new Error(
        `claude가 코드 ${code}로 종료했습니다.\n` +
        `[stderr] ${err.trim().slice(-400)}\n[stdout] ${out.trim().slice(-400)}`,
      ));
    });
  });
}

async function main() {
  const now = new Date();
  const dow = now.getDay();
  const plan = PLAN[dow];

  if (!plan) {
    console.log(`[daily-post] ${now.toISOString()} 주말(${dow}) — 건너뜀`);
    return;
  }

  const kw = loadKeyword();
  const prompt = buildPrompt({ ...plan, keyword: kw?.keyword });

  if (DRY) {
    console.log(`[요일=${dow}] 영역=${plan.area} 유형=${plan.kind} 키워드=${kw?.keyword ?? '(없음)'}`);
    console.log('─'.repeat(60));
    console.log(prompt);
    return;
  }

  // 키워드는 '쓰기 시작한 시점에' 비운다. 실패해도 같은 키워드로 두 번 쓰지 않게 하되,
  // 무엇을 쓰려 했는지는 남겨 둔다.
  if (kw) {
    writeFileSync(
      join(ROOT, '.next-keyword.used.json'),
      JSON.stringify({ ...kw, usedAt: now.toISOString() }, null, 2),
    );
    unlinkSync(KEYWORD_FILE);
  }

  // 지난 결과를 지운다. 안 지우면 오늘 실패했을 때 어제 것이 다시 나갈 수 있다.
  if (existsSync(RESULT_FILE)) unlinkSync(RESULT_FILE);

  try {
    const { stdout } = await runClaude(prompt);
    console.log(`[daily-post] ${now.toISOString()} 완료 · ${plan.area}/${plan.kind}` +
                (kw ? ` · 지정키워드="${kw.keyword}"` : ''));
    console.log(stdout.trim().slice(-2000));
  } catch (e) {
    const msg = (e?.message || String(e)).trim().slice(0, 800);
    console.error('[daily-post] 실패:', msg);

    // 세션이 결과 파일을 이미 남겼으면 그게 사실이다. 덮어쓰지 않는다.
    // (중단돼도 글은 다 써놓은 경우가 있다 — 11/6, 11/9 실제 사례)
    if (existsSync(RESULT_FILE)) {
      console.error('[daily-post] 세션이 남긴 결과가 있어 유지합니다.');
      process.exitCode = 1;
      return;
    }

    // 중단됐지만 오늘 날짜 글 파일이 새로 생겼는지 확인한다. 있으면 '초안 완성, 발행 미완'으로
    // 알린다. 무조건 실패로 적으면 멀쩡한 원고를 놓친다.
    const today = new Date().toISOString().slice(0, 10);
    let draft = null;
    try {
      draft = readdirSync(join(ROOT, 'src/content/blog'))
        .filter((f) => f.startsWith(today) && f.endsWith('.md'))
        .sort()
        .pop() ?? null;
    } catch { /* 디렉터리를 못 읽으면 그냥 실패로 간다 */ }

    writeFileSync(RESULT_FILE, JSON.stringify(
      draft
        ? {
            status: 'fail',
            reason: `원고는 완성됐는데 발행 단계에서 중단됐습니다 (${plan.area}/${plan.kind}). ` +
                    `초안 파일: src/content/blog/${draft} — 검수 후 수동 발행이 필요합니다. 사유: ${msg}`,
            draft,
            at: new Date().toISOString(),
          }
        : {
            status: 'fail',
            reason: `자동 실행이 중단됐습니다 (${plan.area}/${plan.kind}` + (kw ? `, 지정키워드 "${kw.keyword}"` : '') + `): ${msg}`,
            at: new Date().toISOString(),
          },
      null, 2));
    process.exitCode = 1;
  }
}

main();
