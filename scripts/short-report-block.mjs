#!/usr/bin/env node
/**
 * 공매도 리포트 글 본문 블록 생성기
 *
 * 스톡봇이 공매도 리포트를 찾아오면, 그 내용을 JSON 스펙으로 정리해 이 스크립트에
 * 넘긴다. 블로그 본문(마크다운)에 그대로 붙일 수 있는 HTML 블록을 뱉는다.
 *
 *   node scripts/short-report-block.mjs spec.json            # stdout으로 출력
 *   node scripts/short-report-block.mjs spec.json -o out.html
 *   node scripts/short-report-block.mjs --example             # 스펙 예시 출력
 *
 * ── 왜 생성기로 만들었나 ──
 * 공매도 리포트 글은 매번 같은 구조(메타 → 주장 카드 → 흐름도 → 타임라인 → 반박)를
 * 쓴다. 손으로 HTML을 붙이면 ①팔레트가 어긋나고 ②'주장'을 '사실'처럼 쓰는 사고가
 * 반복된다. 스펙을 JSON으로 받으면 검증상태·반박·이해관계 공시를 '빠뜨릴 수 없는
 * 필드'로 만들 수 있다. 누락되면 아래 validate()가 에러로 막는다.
 *
 * ── 마크다운 주의 (CLAUDE.md의 SVG 사고와 동일 원인) ──
 * 마크다운은 빈 줄에서 raw HTML 블록을 끊는다. 그래서 이 생성기는 출력 HTML에
 * 빈 줄을 절대 넣지 않는다. 들여쓰기도 하지 않는다(4칸 들여쓰기는 코드블록이 된다).
 */

import { readFileSync, writeFileSync } from 'node:fs';

// ── 검증 상태 사다리 ────────────────────────────────────────────────
// 색이 진할수록 근거가 단단하다. 사이트 블루톤 팔레트만 쓴다(레드 금지).
const VERIFY = {
  record: { label: '공적 기록 확인', bg: '#1B4F8A', fg: '#FAF6EE', desc: '법원 문서·공시·세관 기록·정부 발표로 확인되는 사실' },
  press:  { label: '보도 교차확인',  bg: '#4E7FA8', fg: '#FAF6EE', desc: '복수 언론이 독립적으로 보도한 내용' },
  claim:  { label: '리포트 단독 주장', bg: '#A8BDD2', fg: '#23201D', desc: '리포트에만 있는 주장. 익명 증언·추정을 포함한다' },
  denied: { label: '회사가 부인',     bg: 'transparent', fg: '#23201D', desc: '대상 회사가 공식적으로 반박한 내용', outline: true },
};

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** 스펙 검증 — 안전장치가 비면 생성 자체를 막는다. */
function validate(s) {
  const err = [];
  if (!s.report?.publisher) err.push('report.publisher (리포트 발행사) 누락');
  if (!s.report?.date) err.push('report.date (리포트 발간일) 누락');
  if (!s.report?.target) err.push('report.target (대상 종목/회사) 누락');
  if (!s.report?.position) err.push("report.position (발행사 포지션, 예: '공매도') 누락 — 이해관계 공시에 쓴다");
  if (!Array.isArray(s.claims) || s.claims.length === 0) err.push('claims (리포트 주장 목록) 비어 있음');
  (s.claims || []).forEach((c, i) => {
    if (!c.title) err.push(`claims[${i}].title 누락`);
    if (!c.verify || !VERIFY[c.verify])
      err.push(`claims[${i}].verify 가 ${Object.keys(VERIFY).join('|')} 중 하나가 아니다 (현재: ${c.verify})`);
    if (!c.claim) err.push(`claims[${i}].claim (리포트가 주장하는 내용) 누락`);
  });
  if (!s.rebuttal || (!s.rebuttal.statements?.length && !s.rebuttal.note))
    err.push("rebuttal (회사 반박) 누락 — 반박이 없으면 rebuttal.note에 '회사가 입장을 내지 않았다'를 명시할 것");
  if (err.length) {
    console.error('✗ 스펙 오류:\n' + err.map((e) => '  - ' + e).join('\n'));
    process.exit(1);
  }
}

const badge = (key) => {
  const v = VERIFY[key];
  const style = v.outline
    ? `border:1px solid ${v.fg};color:${v.fg};background:transparent`
    : `background:${v.bg};color:${v.fg};border:1px solid ${v.bg}`;
  return `<span class="sr-badge" style="${style}" title="${esc(v.desc)}">${esc(v.label)}</span>`;
};

/** ① 리포트 메타 + 이해관계 공시 */
function metaBlock(s) {
  const r = s.report;
  const rows = [
    ['발행사', r.publisher],
    ['발간일', r.date],
    ['대상', r.target],
    ['리포트 투자의견', r.opinion || '명시 없음'],
    r.url ? ['원문', `<a href="${esc(r.url)}" rel="nofollow noopener" target="_blank">리포트 원문 보기</a>`] : null,
  ].filter(Boolean);
  return [
    '<div class="sr-meta">',
    '<div class="sr-meta-head"><span class="sr-kicker">공매도 리포트 해부</span>',
    `<strong class="sr-meta-title">${esc(r.title || r.target)}</strong></div>`,
    '<dl class="sr-meta-grid">',
    ...rows.map(([k, v]) => `<div class="sr-meta-row"><dt>${esc(k)}</dt><dd>${k === '원문' ? v : esc(v)}</dd></div>`),
    '</dl>',
    '<p class="sr-disclosure"><strong>이해관계 공시 —</strong> ',
    `${esc(r.publisher)}는 ${esc(r.target)}에 대해 <strong>${esc(r.position)}</strong> 포지션을 공개했습니다. `,
    '즉 주가가 내려갈 때 이익을 얻는 쪽이 작성한 문서입니다. ',
    '아래 내용은 <strong>그 발행사의 주장</strong>이며, 이 글은 그 주장의 사실 여부를 보증하지 않습니다.</p>',
    '</div>',
  ].join('');
}

/** ② 주장 카드 — 주장 / 회사 입장 / 확인 가능한 자료를 한 칸씩 분리한다 */
function claimsBlock(s) {
  const cards = s.claims.map((c, i) => [
    '<li class="sr-card">',
    '<div class="sr-card-head">',
    `<span class="sr-card-no">주장 ${String(i + 1).padStart(2, '0')}</span>`,
    badge(c.verify),
    '</div>',
    `<h4 class="sr-card-title">${esc(c.title)}</h4>`,
    `<p class="sr-card-claim"><span class="sr-tag">리포트 주장</span>${esc(c.claim)}</p>`,
    c.company
      ? `<p class="sr-card-company"><span class="sr-tag">회사 입장</span>${esc(c.company)}</p>`
      : '<p class="sr-card-company sr-muted"><span class="sr-tag">회사 입장</span>확인된 공식 입장 없음</p>',
    c.evidence
      ? `<p class="sr-card-ev"><span class="sr-tag">확인 가능한 자료</span>${esc(c.evidence)}</p>`
      : '',
    '</li>',
  ].join(''));
  return [
    '<div class="sr-section">',
    '<h3 class="sr-h">리포트가 제기한 주장</h3>',
    '<p class="sr-lede">각 주장 옆 배지는 <strong>근거의 단단함</strong>을 나타냅니다. ',
    '색이 진할수록 공적 기록으로 확인되는 사실이고, 연할수록 리포트에만 있는 주장입니다.</p>',
    '<ul class="sr-cards" role="list">',
    ...cards,
    '</ul>',
    '</div>',
  ].join('');
}

/** ③ 구조 흐름도 — 외부 라이브러리 없이 CSS 그리드로 */
function flowBlock(s) {
  if (!Array.isArray(s.flow) || !s.flow.length) return '';
  const steps = s.flow.map((f, i) => [
    '<li class="sr-step">',
    `<span class="sr-step-no">${i + 1}</span>`,
    `<strong class="sr-step-name">${esc(f.name)}</strong>`,
    f.role ? `<span class="sr-step-role">${esc(f.role)}</span>` : '',
    f.detail ? `<span class="sr-step-detail">${esc(f.detail)}</span>` : '',
    '</li>',
  ].join(''));
  return [
    '<div class="sr-section">',
    `<h3 class="sr-h">${esc(s.flowTitle || '리포트가 주장하는 흐름')}</h3>`,
    s.flowNote ? `<p class="sr-lede">${esc(s.flowNote)}</p>` : '',
    '<ol class="sr-flow" role="list">',
    ...steps,
    '</ol>',
    '<p class="sr-flow-cap">※ 위 도식은 리포트가 주장하는 구조를 옮긴 것입니다. 각 연결의 사실 여부는 별개로 확인이 필요합니다.</p>',
    '</div>',
  ].join('');
}

/** ④ 타임라인 — JS 없이, 분류 라벨만 붙인 정적 목록 */
function timelineBlock(s) {
  if (!Array.isArray(s.timeline) || !s.timeline.length) return '';
  const items = s.timeline.map((t, i) => [
    '<li class="sr-tl-item">',
    `<span class="sr-tl-no">${i + 1}</span>`,
    '<div class="sr-tl-body">',
    '<div class="sr-tl-head">',
    `<time class="sr-tl-date">${esc(t.date)}</time>`,
    t.kind ? `<span class="sr-tl-kind">${esc(t.kind)}</span>` : '',
    t.verify && VERIFY[t.verify] ? badge(t.verify) : '',
    '</div>',
    `<strong class="sr-tl-title">${esc(t.title)}</strong>`,
    t.body ? `<p class="sr-tl-text">${esc(t.body)}</p>` : '',
    '</div>',
    '</li>',
  ].join(''));
  return [
    '<div class="sr-section">',
    '<h3 class="sr-h">시간순으로 본 경과</h3>',
    `<p class="sr-lede">총 ${s.timeline.length}개 국면. 날짜 옆 배지는 그 사건이 공적 기록으로 확인되는지를 표시합니다.</p>`,
    '<ol class="sr-tl" role="list">',
    ...items,
    '</ol>',
    '</div>',
  ].join('');
}

/** ⑤ 회사 반박 — 전용 섹션. 비워둘 수 없다. */
function rebuttalBlock(s) {
  const r = s.rebuttal;
  const list = (r.statements || []).map(
    (x) => `<li class="sr-reb-item"><strong>${esc(x.who || s.report.target)}</strong>${x.date ? ` <span class="sr-muted">(${esc(x.date)})</span>` : ''} — ${esc(x.text)}</li>`
  );
  return [
    '<div class="sr-section sr-reb">',
    '<h3 class="sr-h">대상 회사의 반박</h3>',
    list.length
      ? `<ul class="sr-reb-list" role="list">${list.join('')}</ul>`
      : `<p class="sr-lede">${esc(r.note)}</p>`,
    r.note && list.length ? `<p class="sr-lede">${esc(r.note)}</p>` : '',
    '</div>',
  ].join('');
}

/** ⑥ 면책 — 우리 글은 투자의견이 아니다 */
function disclaimerBlock(s) {
  return [
    '<div class="sr-disclaimer">',
    '<strong>이 글은 투자 조언이 아닙니다.</strong> ',
    `위 내용은 ${esc(s.report.publisher)}가 발간한 공매도 리포트의 주장과 그에 대한 공개 자료를 정리한 것입니다. `,
    '이 블로그는 특정 종목의 매수·매도를 권유하지 않으며, 리포트의 주장에 동의하거나 반대하는 입장을 취하지 않습니다. ',
    '공매도 리포트는 작성자가 주가 하락에서 이익을 얻는 구조에서 나온 문서이고, ',
    '대상 회사의 반박과 이후 수사·재판 결과에 따라 사실관계가 달라질 수 있습니다. ',
    '투자 판단은 원문과 회사 공시를 직접 확인한 뒤 본인 책임으로 하십시오.',
    '</div>',
  ].join('');
}

function build(s) {
  validate(s);
  return [
    '<div class="short-report">',
    metaBlock(s),
    claimsBlock(s),
    flowBlock(s),
    timelineBlock(s),
    rebuttalBlock(s),
    disclaimerBlock(s),
    '</div>',
  ].filter(Boolean).join('\n');
}

const EXAMPLE = {
  report: {
    publisher: '발행사 이름',
    date: '2026-05-13',
    target: '대상 회사 (티커)',
    position: '공매도',
    opinion: '리포트가 제시한 투자의견 문구를 그대로',
    title: '리포트 제목',
    url: 'https://example.com/report',
  },
  claims: [
    {
      title: '주장의 핵심을 한 줄로',
      verify: 'record',
      claim: '리포트가 주장하는 내용. 반드시 "리포트는 ~라고 주장한다" 식으로 쓸 수 있는 문장이어야 한다.',
      company: '회사의 공식 입장. 없으면 생략하면 "확인된 공식 입장 없음"으로 표시된다.',
      evidence: '독자가 직접 확인할 수 있는 1차 자료 (공시 번호, 법원 사건번호, 세관 통계 등)',
    },
  ],
  flowTitle: '리포트가 주장하는 자금·공급 흐름',
  flowNote: '한 줄 설명',
  flow: [{ name: '주체 이름', role: '역할', detail: '무엇을 했다고 주장되는지' }],
  timeline: [{ date: '2026년 4월', kind: '규제·정책', verify: 'press', title: '사건 제목', body: '사건 내용' }],
  rebuttal: {
    statements: [{ who: '회사명', date: '2026-05-14', text: '반박 내용' }],
    note: '반박이 없으면 이 줄에 "회사가 입장을 내지 않았다"를 명시한다.',
  },
};

// ── CLI ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.includes('--example')) {
  console.log(JSON.stringify(EXAMPLE, null, 2));
  process.exit(0);
}
const specPath = args.find((a) => !a.startsWith('-'));
if (!specPath) {
  console.error('사용: node scripts/short-report-block.mjs <spec.json> [-o out.html]\n      node scripts/short-report-block.mjs --example');
  process.exit(1);
}
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const html = build(spec);
const oi = args.indexOf('-o');
if (oi !== -1 && args[oi + 1]) {
  writeFileSync(args[oi + 1], html + '\n');
  console.error(`✓ ${args[oi + 1]} (${html.length.toLocaleString()}자)`);
  const blanks = html.split('\n').filter((l) => l.trim() === '').length;
  console.error(blanks ? `✗ 빈 줄 ${blanks}개 — 마크다운이 HTML을 끊는다` : '✓ 빈 줄 0 (마크다운 안전)');
} else {
  console.log(html);
}
