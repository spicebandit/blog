#!/usr/bin/env node
/**
 * 블로그 글 → 옵시디언 보관함 동기화 (상호 연결 포함)
 *
 * 발행된(draft 아님) 글을 옵시디언 보관함의 'Blog/' 폴더에 노트로 등록한다:
 *   <vault>/Blog/<글제목>.md  — 프론트매터 + 본문 + 라이브 URL + 관련글 링크
 *
 * 옵시디언 노트는 같은 카테고리/태그를 공유하는 다른 블로그 노트와
 * [[위키링크]]로 상호 연결되고, 라이브 블로그 URL을 함께 담는다.
 * 충돌 방지를 위해 보관함의 전용 'Blog/' 폴더에만 쓴다(사용자 노트는 건드리지 않음).
 *
 * 사용:
 *   node scripts/sync-to-obsidian.mjs           # 전체 발행글 동기화
 *   node scripts/sync-to-obsidian.mjs <파일경로> # 특정 글만(그래도 관련글 링크는 전체 기준)
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const HOME = process.env.HOME;
const BLOG_DIR = join(PROJECT_ROOT, 'src/content/blog');
const VAULT_BLOG = join(HOME, 'Documents/obsidian/mynotes/Blog');
const SITE = 'https://blog-x84m.vercel.app';

// 라이브 데이터 페이지 등 옵시디언 노트로 부적합한 글은 제외
const SKIP_SLUGS = new Set(['2026-world-cup-tracker']);
const MAX_RELATED = 6;

/** 아주 단순한 frontmatter 파서 (이 저장소 글의 알려진 필드만 처리) */
function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split('\n')) {
    const eq = line.indexOf(':');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (key === 'tags') {
      try { data.tags = JSON.parse(val); } catch { data.tags = []; }
    } else {
      data[key] = val.replace(/^["']|["']$/g, '');
    }
  }
  return { data, body: m[2] };
}

/** 파일명/위키링크에서 쓸 수 없는 문자 제거(한글·공백·일부 기호는 유지).
 *  대괄호는 위키링크 [[...]]를 깨뜨리므로 소괄호로 바꾼다. */
function safeName(title) {
  return title
    .replace(/\[/g, '(').replace(/\]/g, ')')
    .replace(/[\/\\:*?"<>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dateOnly(pubDate) {
  return (pubDate || '').slice(0, 10);
}

function collectPosts() {
  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  const posts = [];
  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    if (SKIP_SLUGS.has(slug)) continue;
    const raw = readFileSync(join(BLOG_DIR, file), 'utf8');
    const { data, body } = parseFrontmatter(raw);
    if (String(data.draft) === 'true') continue; // 발행글만
    posts.push({
      file, slug, raw, body,
      title: data.title || slug,
      category: data.category || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      date: dateOnly(data.pubDate),
      url: `${SITE}/blog/${slug}/`,
    });
  }
  return posts;
}

/** 카테고리/태그 겹침으로 관련 글 선정 */
function relatedFor(post, all) {
  const scored = all
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const tagOverlap = p.tags.filter((t) => post.tags.includes(t)).length;
      const catMatch = p.category && p.category === post.category ? 1 : 0;
      return { p, score: tagOverlap * 2 + catMatch };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1));
  return scored.slice(0, MAX_RELATED).map((x) => x.p);
}

function buildObsidianNote(post, all) {
  const related = relatedFor(post, all);
  const tagsYaml = post.tags.length
    ? `tags:\n${post.tags.map((t) => `  - ${t}`).join('\n')}\n`
    : '';
  const fm =
    `---\n` +
    `title: "${post.title.replace(/"/g, "'")}"\n` +
    (post.category ? `category: ${post.category}\n` : '') +
    tagsYaml +
    (post.date ? `date: ${post.date}\n` : '') +
    `source: blog\n` +
    `url: ${post.url}\n` +
    `---\n\n`;

  const header = `> 🔗 블로그: ${post.url}\n\n`;

  const relatedSection = related.length
    ? `\n\n## 관련 글\n${related.map((p) => `- [[${safeName(p.title)}]]`).join('\n')}\n`
    : '';

  return fm + header + post.body.trim() + relatedSection;
}

function main() {
  mkdirSync(VAULT_BLOG, { recursive: true });

  const all = collectPosts();
  const argFile = process.argv[2] ? basename(process.argv[2]) : null;
  const targets = argFile ? all.filter((p) => p.file === argFile) : all;

  // 관련글 링크는 항상 전체(all) 기준으로 계산해 양방향이 맞도록 한다.
  let noteCount = 0;
  for (const post of targets) {
    writeFileSync(join(VAULT_BLOG, `${safeName(post.title)}.md`), buildObsidianNote(post, all));
    noteCount++;
  }

  console.log(`✅ 옵시디언 동기화 완료: Blog/ ${noteCount}개`);
  console.log(`   - 옵시디언: ${VAULT_BLOG}`);
}

main();
