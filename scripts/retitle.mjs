// 일회성: 발행글 제목 다듬기(30자 규칙). 슬러그(파일명)는 그대로 → URL 불변.
// 각 항목의 old 문자열이 파일에 정확히 있을 때만 교체하고, 없으면 경고.
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = 'src/content/blog';
const MAP = [
  ['claude-code-stock-agent-2-kis-api',
    'KIS API(한국투자증권 Open API) Python 연결 가이드 — 실전 함정과 해결법 [2편]',
    'KIS API Python 연동 가이드 — 실전 함정과 해결법 [2편]'],
  ['claude-code-stock-agent-1-design',
    'Claude Code로 주식 자동매매 봇 만들기 — 설계부터 운영까지 아키텍처 전체 공개 [1편]',
    'Claude Code로 주식 자동매매 봇 만들기 — 설계와 아키텍처 [1편]'],
  ['vscode-claude-code-usage-guide',
    'VS Code + Claude Code 사용법 완전 가이드 — 개발환경 세팅부터 AI 코딩까지',
    'VS Code + Claude Code 사용법 완전 가이드 — 세팅부터 AI 코딩'],
  ['claude-code-stock-agent-5-operations',
    '주식봇 자동화 운영 — 텔레그램 승인·launchd 스케줄링으로 무인 자동매매 완성 [5편]',
    '주식봇 자동화 운영 — 텔레그램 승인·launchd 무인화 [5편]'],
  ['claude-code-stock-agent-4-trade-safety',
    '주식봇 리스크 관리와 자동매매 실행 — 안전장치·KIS API 매수·수동 승인 흐름 [4편]',
    '주식봇 리스크 관리·자동매매 실행 — 안전장치와 매수 흐름 [4편]'],
  ['claude-code-stock-agent-3-analysts',
    '주식봇 LLM 분석가 설계 — 재무·기술·뉴스 에이전트 프롬프트와 JSON 스키마 [3편]',
    '주식봇 LLM 분석가 설계 — 프롬프트와 JSON 스키마 [3편]'],
  ['2026-06-22-chatgpt-1-billion-users-ai-market-shift',
    'ChatGPT 사용자 10억 명 돌파했지만 점유율은 50% 아래로: AI 3강 시대 열렸다',
    'ChatGPT 10억 명 돌파, 점유율은 50% 아래로 — AI 3강 시대'],
  ['2026-07-05-claude-sonnet5-ai-agent-era',
    '클로드 소넷5 출시·캘리포니아 전면 도입·메타 지연… AI 에이전트 전쟁의 승자가 갈린다',
    '클로드 소넷5 출시·캘리포니아 전면 도입 — AI 에이전트 전쟁의 승자'],
  ['2026-07-07-rtx5090-ollama-local-llm-parameters',
    'RTX 5090으로 로컬 LLM 몇 B까지? — VRAM별 돌릴 수 있는 모델 총정리',
    'RTX 5090으로 로컬 LLM 몇 B까지? — VRAM별 모델 총정리'],
  ['2026-06-23-claude-fable5-us-government-suspension',
    "미국 정부가 AI 모델을 '정지'시킨 날: Claude Fable 5 수출통제 사태",
    "미국 정부가 AI 모델을 '정지'시킨 날 — Claude Fable 5 사태"],
  ['2026-06-27-claude-code-alternatives-comparison-2026',
    'Claude Code 경쟁 도구 비교 2026: 어떤 AI 코딩 도구를 써야 할까',
    'Claude Code 경쟁 도구 비교 2026 — 어떤 AI 코딩 도구를?'],
  ['2026-06-24-apple-siri-ai-google-gemini-partnership',
    'Siri AI 실제로 뭐가 달라지나 — iOS 27 9월 출시 기대와 우려 총정리',
    'Siri AI 뭐가 달라지나 — iOS 27 9월 출시 총정리'],
  ['2026-07-06-stock-agent-trading-strategies-benchmark',
    '주식 자동매매 전략 총정리 — AI 에이전트가 쓸 수 있는 6가지 전략 벤치마킹',
    '주식 자동매매 전략 총정리 — AI 에이전트용 6가지 전략'],
  ['2026-06-28-gpt-56-europa-ai-sovereignty-war',
    "GPT-5.6부터 EUROPA까지: AI 패권 전쟁이 '자국 AI'로 불 붙었다",
    "GPT-5.6부터 EUROPA까지 — AI 패권 전쟁과 '자국 AI'"],
  ['2026-07-06-supabase-beginner-guide',
    '초보자를 위한 Supabase 사용법 — 요금제·주의점·회사 성장까지 [입문]',
    '초보자를 위한 Supabase 사용법 — 요금제·주의점 총정리 [입문]'],
  ['2026-07-05-hermes-agent-lm-studio-local-llm',
    '헤르메스 AI LM Studio 연동 — API 비용 0원 로컬 구동 [3편]',
    '헤르메스 AI LM Studio 연동 — 로컬 구동 비용 0원 [3편]'],
  ['2026-07-09-paperclip-ai-agent-company-how-to',
    'Paperclip 실전 사용법 — AI 직원 회사 세팅부터 운영까지 [2편]',
    'Paperclip 실전 사용법 — AI 직원 회사 세팅·운영 [2편]'],
  ['2026-06-26-eu-europa-ai-sovereign-model',
    "EU, 독자 프론티어 AI '유로파' 개발 착수 — AI 주권 확보의 승부수",
    "EU, 독자 AI '유로파' 개발 착수 — AI 주권 확보 승부수"],
  ['2026-07-07-korea-corporate-bond-issuance-timing-2026h2',
    '하반기 회사채 금리 전망과 발행 타이밍 — 자금 부족 기업의 최적 시점은',
    '하반기 회사채 금리 전망과 발행 타이밍 — 최적 시점은?'],
  ['2026-07-06-opendart-api-guide-usage-cases',
    '전자공시 OpenDART API 완전정복 — 인증키 발급부터 활용사례까지',
    '전자공시 OpenDART API 완전정복 — 발급부터 활용까지'],
  ['2026-06-24-kospi-crash-june-23-cause-outlook',
    "코스피 대폭락 원인과 2주 전망: 서킷브레이커까지 발동된 '검은 화요일'",
    "코스피 대폭락 원인과 2주 전망 — 서킷브레이커 '검은 화요일'"],
  ['2026-06-22-smr-mmr-nuclear-market-spectrum',
    'SMR은 하나가 아니다: 300MW부터 5MW까지 3계층 시장 완전 해부',
    'SMR은 하나가 아니다 — 300MW~5MW 3계층 시장 해부'],
];

let ok = 0, fail = 0;
for (const [slug, oldT, newT] of MAP) {
  const path = join(DIR, `${slug}.md`);
  const src = await readFile(path, 'utf8');
  const oldLine = `title: "${oldT}"`;
  const newLine = `title: "${newT}"`;
  if (!src.includes(oldLine)) {
    console.log(`✗ MISS ${slug} (원본 제목 불일치)`);
    fail++;
    continue;
  }
  await writeFile(path, src.replace(oldLine, newLine));
  console.log(`✓ ${[...newT].length}자  ${slug}`);
  ok++;
}
console.log(`\n적용 ${ok} / 실패 ${fail}`);
