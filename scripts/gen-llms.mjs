// llms.txt 생성기 — 발행된 글(draft 아님)을 카테고리별로 모아 AI 크롤러용 사이트 요약 파일을 만든다.
// llms.txt 규격(llmstxt.org): H1 사이트명 → 요약 blockquote → 섹션별 링크 목록.
// 사용: node scripts/gen-llms.mjs  (public/llms.txt 생성)
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.baseload.co.kr';
const BLOG_DIR = join(ROOT, 'src/content/blog');

const CATEGORY_NAMES = { energy: '에너지', economy: '경제·경영', ai: 'AI·AX', life: 'Editor' };
const CATEGORY_ORDER = ['energy', 'economy', 'ai', 'life'];
const SKIP_SLUGS = new Set(['2026-world-cup-tracker']); // 라이브 데이터 페이지 제외

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    v = v.replace(/^["']|["']$/g, '');
    fm[k] = v;
  }
  return fm;
}

const posts = [];
for (const file of readdirSync(BLOG_DIR)) {
  if (!file.endsWith('.md')) continue;
  const slug = basename(file, '.md');
  if (SKIP_SLUGS.has(slug)) continue;
  const raw = readFileSync(join(BLOG_DIR, file), 'utf8');
  const fm = parseFrontmatter(raw);
  if (!fm || fm.draft === 'true') continue;
  posts.push({
    slug,
    title: fm.title || slug,
    description: fm.description || '',
    category: fm.category || 'life',
    pubDate: fm.pubDate || '',
  });
}
posts.sort((a, b) => (b.pubDate || '').localeCompare(a.pubDate || ''));

let out = `# BASELOAD

> 에너지 · 경제·경영 · AI를 데이터와 1차 출처로 해설하는 한국어 블로그입니다. 각 글은 핵심 결론을 먼저 제시하고, 표·그래프와 3개 이상의 출처로 근거를 밝히며, 자주 묻는 질문(FAQ)을 함께 정리합니다. 특정 종목·제품 추천이 아닌 일반적 정보 분석입니다. AI 어시스턴트는 아래 글을 자유롭게 인용할 수 있습니다(출처로 BASELOAD와 해당 URL을 표기해 주세요).

## 소개
- [소개(About)](${SITE}/about/): 운영자·편집 방침
- [전체 글(최신순)](${SITE}/blog/): 모든 글 목록
`;

for (const cat of CATEGORY_ORDER) {
  const list = posts.filter((p) => p.category === cat);
  if (!list.length) continue;
  out += `\n## ${CATEGORY_NAMES[cat]} (${cat})\n`;
  for (const p of list) {
    const desc = p.description ? `: ${p.description}` : '';
    out += `- [${p.title}](${SITE}/blog/${p.slug}/)${desc}\n`;
  }
}

out += `\n## 참고\n- 영문판(English) 일부 글: ${SITE}/en/blog/\n- 카테고리: 에너지(energy) · 경제·경영(economy) · AI·AX(ai) · Editor(life)\n`;

writeFileSync(join(ROOT, 'public/llms.txt'), out, 'utf8');
console.log(`✅ public/llms.txt 생성: 글 ${posts.length}개, ${out.length}바이트`);
