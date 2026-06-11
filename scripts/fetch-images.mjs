#!/usr/bin/env node
/**
 * Unsplash 이미지 페처 (빌드 시점 고정용)
 *
 * 글 작성 시점에 키워드로 이미지를 미리 가져와, 마크다운 본문에
 * 이미지 + 출처를 직접 삽입하기 위한 헬퍼다. 방문자 페이지 로드 시
 * 에는 Unsplash API를 호출하지 않는다(이미 박힌 URL만 사용).
 *
 * 사용법:
 *   node scripts/fetch-images.mjs "korean coffee shop" 3
 *   node scripts/fetch-images.mjs "ai automation"        # 기본 3개
 *
 * 출력: JSON(파싱용) + 바로 붙여넣을 수 있는 마크다운 스니펫
 *
 * 환경변수: UNSPLASH_ACCESS_KEY (.env 에서 자동 로드)
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

// Unsplash 약관: referral UTM을 모든 attribution 링크에 붙여야 함
const UTM = 'utm_source=spice-bandit-blog&utm_medium=referral';

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

async function fetchImages(keyword, count) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    throw new Error('UNSPLASH_ACCESS_KEY가 없습니다. .env에 설정하세요.');
  }

  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', keyword);
  url.searchParams.set('per_page', String(Math.min(Math.max(count, 1), 10)));
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('content_filter', 'high');

  const res = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      'Accept-Version': 'v1',
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Unsplash API 오류 ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const results = (data.results || []).slice(0, count);

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

async function main() {
  loadEnv();

  const keyword = process.argv[2];
  const count = Number.parseInt(process.argv[3] ?? '3', 10) || 3;

  if (!keyword) {
    console.error('사용법: node scripts/fetch-images.mjs "<영문 키워드>" [개수=3]');
    process.exit(1);
  }

  const images = await fetchImages(keyword, count);

  if (images.length === 0) {
    console.error(`"${keyword}" 키워드로 이미지를 찾지 못했습니다.`);
    process.exit(2);
  }

  // 1) 파싱용 JSON
  console.log(JSON.stringify({ keyword, count: images.length, images }, null, 2));

  // 2) 바로 붙여넣을 수 있는 마크다운 스니펫
  console.log('\n--- MARKDOWN SNIPPETS ---\n');
  for (const img of images) {
    console.log(img.markdown + '\n');
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

export { fetchImages };
