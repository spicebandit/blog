#!/usr/bin/env node
/**
 * 오늘의 글감 선정기 (API 호출 없음, 순수 로직)
 *
 * 역할은 딱 두 가지:
 *   1) 오늘 요일 → 영역(카테고리) 결정 (요일별 로테이션)
 *   2) 영역별 주제 풀에서 날짜 기반으로 키워드 후보 3개 선정 + 1개 추천
 *
 * 실제 글 작성은 하지 않는다. 출력된 추천 키워드를 바탕으로
 * **Claude Code가 CLAUDE.md 규칙대로 초안(.md, draft:true)을 직접 작성**한다.
 * (Claude Max 구독으로 Claude Code를 쓰면 추가 API 비용이 없다.)
 *
 * 사용법:
 *   node scripts/daily-draft.mjs          # 사람이 읽는 출력
 *   node scripts/daily-draft.mjs --json    # 기계가 읽는 JSON (스케줄/자동화용)
 *
 * 매일 자동화 흐름:
 *   스케줄(cron 또는 Claude Code 루틴) → 이 스크립트로 '오늘의 영역+키워드' 확정
 *   → Claude Code가 그 키워드로 초안 md를 draft:true 로 작성 (발행은 사람이 검토 후)
 */

// 요일(0=일) → 영역. CLAUDE.md의 요일별 로테이션과 일치.
const DAY_CATEGORY = {
  0: 'life',     // 일: 개인 잡담
  1: 'energy',   // 월: 에너지/전력/LNG
  2: 'economy',  // 화: 경제/경영
  3: 'ai',       // 수: AI/공부
  4: 'energy',   // 목: 에너지
  5: 'economy',  // 금: 경제/경영
  6: 'ai',       // 토: AI/공부
};
const CATEGORY_LABEL = { energy: '에너지', economy: '경제·경영', ai: 'AI·AX', life: 'Editor' };
const DOW_KO = ['일', '월', '화', '수', '목', '금', '토'];

// 영역별 주제 풀. 모두 공개 정보 기반의 안전한 에버그린 주제(특정 기업 내부정보·종목추천 배제).
// keyword: 글감(한국어), slug: 파일명/URL용 영문 슬러그, reason: 추천 사유(간단).
const TOPIC_POOLS = {
  energy: [
    { keyword: 'LNG 가격을 움직이는 요인과 겨울철 수급', slug: 'lng-price-drivers-winter', reason: '계절성과 국제 가격이 맞물려 꾸준한 관심 주제' },
    { keyword: '재생에너지 확대와 전력망 안정성의 과제', slug: 'renewables-grid-stability', reason: '에너지 전환의 핵심 쟁점' },
    { keyword: '전기요금은 어떻게 결정되나', slug: 'how-electricity-bills-are-set', reason: '생활 밀착형 + 검색 수요 높음' },
    { keyword: '에너지 저장장치(ESS)의 원리와 역할', slug: 'energy-storage-ess-basics', reason: '재생에너지와 함께 부상하는 기술' },
    { keyword: '수소 경제, 어디까지 왔나', slug: 'hydrogen-economy-status', reason: '장기 에너지 전환 테마' },
    { keyword: '전력 수요 피크와 수요반응(DR) 이해하기', slug: 'peak-demand-and-demand-response', reason: '여름·겨울 전력 이슈와 연결' },
    { keyword: '탄소중립과 에너지 전환 로드맵', slug: 'carbon-neutral-energy-transition', reason: '정책·산업 전반의 큰 그림' },
    { keyword: '원자력 발전의 역할과 논쟁점', slug: 'nuclear-power-role-and-debate', reason: '에너지 믹스의 핵심 변수' },
  ],
  economy: [
    { keyword: '금리 인상이 경제에 미치는 영향', slug: 'interest-rate-hike-impact', reason: '통화정책의 파급효과를 이해하는 기본 주제' },
    { keyword: '인플레이션의 원인과 우리 생활에 미치는 영향', slug: 'inflation-causes-and-impact', reason: '체감도 높은 거시경제 주제' },
    { keyword: '환율은 왜 움직이고 생활에 어떤 영향을 주나', slug: 'exchange-rate-and-daily-life', reason: '수입물가·여행 등 생활 밀착' },
    { keyword: '분산투자와 리스크 관리의 원칙', slug: 'diversification-and-risk-management', reason: '특정 종목이 아닌 원칙 중심(투자 조언 아님)' },
    { keyword: '복리의 힘과 장기 투자의 이해', slug: 'compound-interest-long-term', reason: '재테크 기본기, 검색 수요 꾸준' },
    { keyword: '경기 침체 신호를 읽는 법', slug: 'reading-recession-signals', reason: '경제지표 해설형 주제' },
    { keyword: '소비자물가지수(CPI)란 무엇인가', slug: 'understanding-cpi', reason: '경제지표 입문' },
    { keyword: '1인 기업의 비즈니스 모델 설계', slug: 'solo-business-model-design', reason: '운영자 관심사 + 경영 관점' },
  ],
  ai: [
    { keyword: '프롬프트 엔지니어링 기초', slug: 'prompt-engineering-basics', reason: 'AI 활용의 출발점, 입문 수요 높음' },
    { keyword: 'RAG(검색증강생성) 개념 쉽게 이해하기', slug: 'understanding-rag', reason: 'LLM 실무의 핵심 패턴' },
    { keyword: 'AI 에이전트는 어떻게 작동하나', slug: 'how-ai-agents-work', reason: '에이전틱 AI 흐름과 연결' },
    { keyword: 'AI 시대의 효율적인 공부법', slug: 'studying-in-the-ai-era', reason: '공부 영역 + 실용성' },
    { keyword: '벡터 데이터베이스 입문', slug: 'vector-database-intro', reason: 'RAG·검색의 기반 기술' },
    { keyword: '노션과 AI로 지식관리 자동화하기', slug: 'notion-ai-knowledge-management', reason: '생산성 + 실습형' },
    { keyword: '파인튜닝과 프롬프트, 무엇이 다른가', slug: 'fine-tuning-vs-prompting', reason: '자주 헷갈리는 개념 정리' },
    { keyword: '온디바이스 AI의 부상과 의미', slug: 'on-device-ai-rise', reason: 'AI 트렌드 해설' },
  ],
  life: [
    { keyword: '1인 기업가의 하루 루틴', slug: 'solo-entrepreneur-daily-routine', reason: '운영자 일상, 공감형' },
    { keyword: '디지털 미니멀리즘 실천기', slug: 'digital-minimalism-practice', reason: '가벼운 에세이 소재' },
    { keyword: '집중력을 지키는 작업 환경 만들기', slug: 'focus-friendly-workspace', reason: '생산성 + 일상' },
    { keyword: '번아웃을 예방하는 작은 습관들', slug: 'small-habits-against-burnout', reason: '공감과 실용' },
    { keyword: '느리게 사는 연습', slug: 'practicing-slow-living', reason: '감성 에세이' },
    { keyword: '책 읽기 습관 들이기', slug: 'building-a-reading-habit', reason: '꾸준한 관심사' },
    { keyword: '산책이 주는 생각의 여백', slug: 'walking-and-mental-space', reason: '가벼운 일상 관찰' },
    { keyword: '혼자 일하는 사람의 외로움 다루기', slug: 'dealing-with-solo-work-loneliness', reason: '솔직한 1인 기업 이야기' },
  ],
};

function dayOfYear(d) {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / 86400000);
}

function todayStr(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** 날짜 기반으로 풀에서 3개를 고르고 첫 번째를 추천. 같은 날 재실행 시 동일 결과(idempotent). */
function pickCandidates(pool, seed) {
  const n = pool.length;
  const stride = Math.max(1, Math.floor(n / 3));
  const start = seed % n;
  const picks = [];
  const used = new Set();
  let i = start;
  while (picks.length < 3 && used.size < n) {
    const idx = i % n;
    if (!used.has(idx)) {
      used.add(idx);
      picks.push(pool[idx]);
    }
    i += stride;
  }
  return { candidates: picks, recommendedIndex: 0 };
}

function buildAssignment(now = new Date()) {
  const dow = now.getDay();
  const category = DAY_CATEGORY[dow];
  const label = CATEGORY_LABEL[category];
  const dateStr = todayStr(now);
  const seed = now.getFullYear() * 366 + dayOfYear(now);
  const { candidates, recommendedIndex } = pickCandidates(TOPIC_POOLS[category], seed);
  const recommended = candidates[recommendedIndex];
  // 제안 파일명(영문 슬러그) — Claude Code가 이 경로로 초안을 만든다.
  const suggestedFile = `src/content/blog/${dateStr}-${recommended.slug}.md`;
  return {
    date: dateStr,
    weekday: DOW_KO[dow] + '요일',
    category,
    categoryLabel: label,
    candidates,
    recommendedIndex,
    recommended,
    suggestedFile,
  };
}

function printHuman(a) {
  console.log('━━━━━━━━━━ 오늘의 글감 ━━━━━━━━━━');
  console.log(`날짜      : ${a.date} (${a.weekday})`);
  console.log(`영역      : ${a.categoryLabel} (${a.category})`);
  console.log(`추천 키워드 : ${a.recommended.keyword}`);
  console.log(`제안 파일  : ${a.suggestedFile}  (draft: true 로 작성)`);
  console.log('\n키워드 후보 3개:');
  a.candidates.forEach((c, i) => {
    const mark = i === a.recommendedIndex ? ' ★추천' : '';
    console.log(`  ${i + 1}. ${c.keyword}${mark}`);
    console.log(`     - 슬러그: ${c.slug} / 사유: ${c.reason}`);
  });
  console.log('\n다음 단계: Claude Code가 위 추천 키워드로 CLAUDE.md 규칙대로 초안을 작성한다.');
  console.log('  · frontmatter category=' + a.category + ', draft: true');
  console.log('  · 본문 SEO·문체·안전 규칙 + 이미지(scripts/fetch-images.mjs) 적용');
  console.log('  · 발행은 사람이 검토 후 draft 제거하고 git push');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

/** HTML 특수문자 이스케이프 (텔레그램 parse_mode=HTML 안전) */
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** 텔레그램 알림 메시지 본문 구성 */
function buildTelegramMessage(a) {
  const lines = [];
  lines.push('📝 <b>오늘의 블로그 주제 후보 (글감 선정기)</b>');
  lines.push('');
  lines.push(`<b>추천 주제</b>: ${escapeHtml(a.recommended.keyword)}`);
  lines.push(`<b>카테고리</b>: ${escapeHtml(a.categoryLabel)}`);
  lines.push('');
  lines.push('<b>키워드 후보 3개</b>:');
  a.candidates.forEach((c, i) => {
    const mark = i === a.recommendedIndex ? ' ★추천' : '';
    lines.push(`  ${i + 1}. ${escapeHtml(c.keyword)}${mark}`);
  });
  lines.push('');
  lines.push(`<b>제안 파일</b>: <code>${escapeHtml(a.suggestedFile)}</code>`);
  lines.push('');
  lines.push('ℹ️ Paperclip 시스템: <b>EditorInChief</b>가 초안 작성 담당.');
  lines.push('직접 작성이 필요하면 Claude Code에서 위 키워드로 요청하세요.');
  return lines.join('\n');
}

const wantJson = process.argv.includes('--json');
const assignment = buildAssignment();
if (wantJson) {
  console.log(JSON.stringify(assignment, null, 2));
} else {
  printHuman(assignment);
  // 초안 글감 선정 결과를 텔레그램으로 알림. 실패해도 스크립트는 죽지 않게 try/catch.
  try {
    const { sendTelegram } = await import('./notify-telegram.mjs');
    const result = await sendTelegram(buildTelegramMessage(assignment));
    if (result.ok) {
      console.log('\n📨 텔레그램 알림 전송 완료');
    } else {
      console.log('\n⚠️ 텔레그램 알림 전송 실패 (스크립트는 계속 진행):', result.reason);
    }
  } catch (err) {
    console.log('\n⚠️ 텔레그램 알림 중 예외 (스크립트는 계속 진행):', err?.message ?? String(err));
  }
}

export { buildAssignment, TOPIC_POOLS, DAY_CATEGORY };
