#!/usr/bin/env node
/**
 * 블로그 이미지 페처 (빌드 시점 고정용) — 멀티 소스 지원
 *
 * 글 작성 시점에 키워드로 이미지를 미리 가져와, 마크다운 본문에
 * 이미지 + 출처를 직접 삽입하기 위한 헬퍼다. 방문자 페이지 로드 시
 * 에는 외부 API를 호출하지 않는다(이미 박힌 URL만 사용).
 *
 * 사용법:
 *   node scripts/fetch-images.mjs "korean coffee shop" 3
 *   node scripts/fetch-images.mjs "ai automation"                 # 기본 3개, 기본 소스(unsplash)
 *   node scripts/fetch-images.mjs "nuclear power plant" 3 --source=wikimedia
 *   node scripts/fetch-images.mjs "samsung" 2 --source=wikimedia  # 실제 주제(인물·기업·시설)에 강함
 *
 * 소스(--source):
 *   unsplash  (기본) — 분위기용 고화질 스톡. UNSPLASH_ACCESS_KEY 필요.
 *   wikimedia        — 실제 인물·기업·시설·지도 등 시사 이미지. API 키 불필요(CC/PD 라이선스).
 *
 * 출력: JSON(파싱용) + 바로 붙여넣을 수 있는 마크다운 스니펫(이미지 + 출처)
 */

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

/**
 * 이미 발행 글에 쓰인 Unsplash 사진 ID 수집 — 같은 사진이 여러 글에 반복되는 것 방지.
 * (2026-07-04 사용자 지시: "똑같은 이미지가 여러 글에 지속 나타나는 건 적절하지 않아")
 */
function collectUsedPhotoIds() {
  const used = new Set();
  for (const dir of ['src/content/blog', 'src/content/blog-en']) {
    try {
      for (const f of readdirSync(join(PROJECT_ROOT, dir))) {
        if (!f.endsWith('.md')) continue;
        const body = readFileSync(join(PROJECT_ROOT, dir, f), 'utf8');
        for (const m of body.matchAll(/images\.unsplash\.com\/(photo-[0-9a-f-]+)/g)) {
          used.add(m[1]);
        }
      }
    } catch { /* 디렉터리 없으면 무시 */ }
  }
  return used;
}

// Unsplash 약관: referral UTM을 모든 attribution 링크에 붙여야 함
const UTM = 'utm_source=spice-bandit-blog&utm_medium=referral';
// Wikimedia API는 식별 가능한 User-Agent를 요구한다.
const WIKI_UA = 'baseload-blog-image-fetcher/1.0 (https://www.baseload.co.kr)';

/** .env를 직접 파싱해 process.env에 주입 (node 버전/실행 방식과 무관하게 동작) */
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
    // .env 없으면 process.env에 이미 있다고 가정
  }
}

function withUtm(url) {
  return url.includes('?') ? `${url}&${UTM}` : `${url}?${UTM}`;
}

/** HTML 조각(주로 위키미디어 Artist 필드)을 평문으로 정리 */
function stripHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** ── 소스 1: Unsplash ─────────────────────────────────────── */
async function fetchUnsplash(keyword, count) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    throw new Error('UNSPLASH_ACCESS_KEY가 없습니다. .env에 설정하세요.');
  }

  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', keyword);
  // 기존 글에서 쓴 사진을 걸러야 하므로 여유 있게 받아온다
  url.searchParams.set('per_page', String(Math.min(Math.max(count * 3, 9), 30)));
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('content_filter', 'high');

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${accessKey}`, 'Accept-Version': 'v1' },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Unsplash API 오류 ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  // 이미 다른 글에 쓰인 사진은 제외 (중복 노출 방지)
  const used = collectUsedPhotoIds();
  const results = (data.results || [])
    .filter((p) => {
      const m = /photo-[0-9a-f-]+/.exec(p.urls?.regular || '');
      return !m || !used.has(m[0]);
    })
    .slice(0, count);

  // Unsplash 가이드라인: 이미지를 실제 "사용(다운로드)"할 때 download_location 트리거
  await Promise.all(
    results.map((p) =>
      p.links?.download_location
        ? fetch(p.links.download_location, {
            headers: { Authorization: `Client-ID ${accessKey}` },
          }).catch(() => {})
        : Promise.resolve()
    )
  );

  return results.map((p) => {
    const photographer = p.user?.name || 'Unknown';
    const profileLink = withUtm(p.user?.links?.html || 'https://unsplash.com');
    const photoLink = withUtm(p.links?.html || 'https://unsplash.com');
    const imageUrl = p.urls?.regular;
    const alt = p.alt_description || p.description || keyword;
    const attribution = `Photo by [${photographer}](${profileLink}) on [Unsplash](${photoLink})`;
    return {
      source: 'unsplash',
      imageUrl,
      photographer,
      profileLink,
      photoLink,
      alt,
      attribution,
      markdown: `![${alt}](${imageUrl})\n*${attribution}*`,
    };
  });
}

/** ── 소스 2: Wikimedia Commons ────────────────────────────── */
async function fetchWikimedia(keyword, count) {
  // 파일 네임스페이스(6)에서 검색 → imageinfo로 URL/라이선스/작가 메타 조회
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('format', 'json');
  url.searchParams.set('generator', 'search');
  url.searchParams.set('gsrsearch', `filetype:bitmap ${keyword}`);
  url.searchParams.set('gsrnamespace', '6'); // File:
  url.searchParams.set('gsrlimit', String(Math.min(Math.max(count * 3, 6), 30)));
  url.searchParams.set('prop', 'imageinfo');
  url.searchParams.set('iiprop', 'url|extmetadata|mime|size');
  url.searchParams.set('iiurlwidth', '1080'); // 본문용 썸네일 폭
  url.searchParams.set('iiextmetadatafilter', 'Artist|LicenseShortName|LicenseUrl|Credit|ImageDescription');

  const res = await fetch(url, { headers: { 'User-Agent': WIKI_UA, Accept: 'application/json' } });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Wikimedia API 오류 ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const pages = Object.values(data?.query?.pages || {});

  const items = [];
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (!info) continue;
    const mime = info.mime || '';
    if (!mime.startsWith('image/')) continue; // 영상/문서 제외
    if ((info.width || 0) < 600) continue; // 너무 작은 아이콘 제외
    const meta = info.extmetadata || {};
    const imageUrl = info.thumburl || info.url;
    if (!imageUrl) continue;

    const artist = stripHtml(meta.Artist?.value) || 'Unknown author';
    const license = stripHtml(meta.LicenseShortName?.value) || 'see source';
    const licenseUrl = meta.LicenseUrl?.value || '';
    const descUrl =
      info.descriptionurl ||
      (page.title
        ? `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`
        : 'https://commons.wikimedia.org');
    const alt = stripHtml(meta.ImageDescription?.value).slice(0, 120) || page.title?.replace(/^File:/, '') || keyword;

    const licenseMd = licenseUrl ? `[${license}](${licenseUrl})` : license;
    // 위키미디어 라이선스 준수: 작가 + 출처(파일 페이지) 링크 + 라이선스 표기
    const attribution = `이미지: ${artist} · [Wikimedia Commons](${descUrl}) · ${licenseMd}`;

    items.push({
      source: 'wikimedia',
      imageUrl,
      photographer: artist,
      profileLink: descUrl,
      photoLink: descUrl,
      license,
      licenseUrl,
      alt,
      attribution,
      markdown: `![${alt}](${imageUrl})\n*${attribution}*`,
    });
    if (items.length >= count) break;
  }
  return items;
}

const SOURCES = {
  unsplash: fetchUnsplash,
  wikimedia: fetchWikimedia,
};

/** 소스를 지정해 이미지를 가져온다 (기본: unsplash) */
async function fetchImagesFrom(keyword, count, source = 'unsplash') {
  const fn = SOURCES[source];
  if (!fn) {
    throw new Error(`알 수 없는 소스: ${source} (가능: ${Object.keys(SOURCES).join(', ')})`);
  }
  return fn(keyword, count);
}

/** 하위 호환: 기존 import 사용처(Unsplash 기본) */
async function fetchImages(keyword, count) {
  return fetchUnsplash(keyword, count);
}

function parseArgs(argv) {
  const positional = [];
  let source = 'unsplash';
  for (const a of argv) {
    const m = /^--source=(.+)$/.exec(a);
    if (m) {
      source = m[1].toLowerCase();
    } else if (!a.startsWith('--')) {
      positional.push(a);
    }
  }
  return { keyword: positional[0], count: Number.parseInt(positional[1] ?? '3', 10) || 3, source };
}

async function main() {
  loadEnv();

  const { keyword, count, source } = parseArgs(process.argv.slice(2));

  if (!keyword) {
    console.error('사용법: node scripts/fetch-images.mjs "<영문 키워드>" [개수=3] [--source=unsplash|wikimedia]');
    process.exit(1);
  }

  const images = await fetchImagesFrom(keyword, count, source);

  if (images.length === 0) {
    console.error(`"${keyword}" 키워드(소스: ${source})로 이미지를 찾지 못했습니다.`);
    process.exit(2);
  }

  // 1) 파싱용 JSON
  console.log(JSON.stringify({ keyword, source, count: images.length, images }, null, 2));

  // 2) 바로 붙여넣을 수 있는 마크다운 스니펫
  console.log('\n--- MARKDOWN SNIPPETS ---\n');
  for (const img of images) {
    console.log(img.markdown + '\n');
  }
}

// 직접 실행할 때만 main 실행. 다른 스크립트가 import 하면 함수만 노출한다.
const isDirectRun =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

export { fetchImages, fetchImagesFrom, fetchUnsplash, fetchWikimedia };
