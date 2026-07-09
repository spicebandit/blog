// 브랜드 자산 생성기 — 파비콘·OG 기본이미지·퍼블리셔 로고를 SVG→PNG로 굽는다.
// 실행: node scripts/gen-brand-assets.mjs  (sharp 사용)
// 산출물은 public/ 에 저장되어 그대로 배포된다. 색은 사이트 디자인 토큰과 일치.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

// ── 브랜드 색 (Base.astro 디자인 토큰과 동일) ──
const RED = '#C8102E';
const CREAM = '#F1EADD';
const INK = '#23201D';

// 파비콘: 잉크 라운드 사각 + 레드 언더라인 + 크림 세리프 'B' (신문 마스트헤드 느낌)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${INK}"/>
  <rect x="14" y="46" width="36" height="4" rx="2" fill="${RED}"/>
  <text x="32" y="42" font-family="Georgia, 'Times New Roman', serif" font-size="40" font-weight="700"
        text-anchor="middle" fill="${CREAM}">B</text>
</svg>`;

// 퍼블리셔 로고 (정사각, JSON-LD Organization.logo용) — 크림 배경에 레드 B + 워드마크
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${CREAM}"/>
  <rect x="96" y="150" width="320" height="6" fill="${INK}"/>
  <text x="256" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="150" font-weight="700"
        text-anchor="middle" fill="${INK}">BASE</text>
  <text x="256" y="410" font-family="Georgia, 'Times New Roman', serif" font-size="90" font-weight="700"
        text-anchor="middle" fill="${RED}">LOAD</text>
</svg>`;

// OG 기본 이미지 (1200×630) — 소셜 공유 폴백. 라틴 문자만(래스터 폰트 안전).
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${CREAM}"/>
  <rect x="0" y="0" width="1200" height="14" fill="${RED}"/>
  <rect x="80" y="150" width="1040" height="3" fill="${INK}"/>
  <text x="80" y="128" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-weight="700"
        letter-spacing="4" fill="${RED}">BASELOAD</text>
  <text x="80" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="92" font-weight="700"
        fill="${INK}">Energy &#183; Economy &#183; AI</text>
  <text x="80" y="410" font-family="Georgia, 'Times New Roman', serif" font-size="44" font-weight="400"
        fill="${INK}">In-depth reports for the agentic era</text>
  <rect x="80" y="500" width="70" height="6" fill="${RED}"/>
  <text x="80" y="560" font-family="Georgia, serif" font-size="30" fill="#6B635B">www.baseload.co.kr</text>
</svg>`;

async function png(svg, size) {
  const s = sharp(Buffer.from(svg));
  return size ? s.resize(size, size).png().toBuffer() : s.png().toBuffer();
}

// 파비콘 SVG는 그대로 (모던 브라우저·구글 지원), 라스터 폴백도 함께 굽는다.
await writeFile(join(PUBLIC, 'favicon.svg'), faviconSvg);
await writeFile(join(PUBLIC, 'favicon-32.png'), await png(faviconSvg, 32));
await writeFile(join(PUBLIC, 'apple-touch-icon.png'), await png(faviconSvg, 180));
await writeFile(join(PUBLIC, 'logo.png'), await png(logoSvg));                 // 512×512
await writeFile(join(PUBLIC, 'og-default.png'), await sharp(Buffer.from(ogSvg)).png().toBuffer());

console.log('✓ favicon.svg, favicon-32.png, apple-touch-icon.png, logo.png, og-default.png 생성 완료');
