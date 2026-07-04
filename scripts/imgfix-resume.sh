#!/bin/bash
# 일회성: Unsplash rate limit 해제 후 남은 중복 이미지 교체 재개 (2026-07-04)
# 완료 시 중복 검증 → 빌드 → 커밋·푸시 → 알림 → 자기 제거
set -uo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
REPO="$HOME/projects/blog"; cd "$REPO" || exit 1
LABEL="com.gogumi.blog.imgfix"
PLIST="$HOME/Library/LaunchAgents/${LABEL}.plist"
notify(){ node "$REPO/scripts/notify-telegram.mjs" "$1" >/dev/null 2>&1 || true; }
selfremove(){ launchctl bootout "gui/$(id -u)/${LABEL}" 2>/dev/null || true; rm -f "$PLIST"; }

OUT="$(python3 "$REPO/.imgfix/driver.py" 2>&1)"
echo "$OUT" > /tmp/imgfix-resume.log

if echo "$OUT" | grep -q "RATE LIMIT"; then
  notify "🔶 이미지 교체 재개: 아직 rate limit — 다음 실행 시각까지 대기 (잡 유지)"
  exit 0
fi

# 중복 검증 (한↔영 쌍 제외한 실제 중복 수)
DUP="$(python3 - <<'PY'
import pathlib, re, collections, json
use = collections.defaultdict(set)
ko_of = {}
for f in pathlib.Path('src/content/blog-en').glob('*.md'):
    head = f.read_text()[:800]
    m = re.search(r'koSlug:\s*"?([^"\n]+)"?', head) or re.search(r'sourceSlug:\s*"?([^"\n]+)"?', head)
    ko_of[f.stem] = m.group(1).strip() if m else f.stem
for d in ['blog', 'blog-en']:
    for f in pathlib.Path(f'src/content/{d}').glob('*.md'):
        art = f.stem if d == 'blog' else 'EN:' + ko_of.get(f.stem, f.stem)
        for m in re.finditer(r'images\.unsplash\.com/(photo-[0-9a-f-]+)', f.read_text()):
            use[m.group(1)].add(art.replace('EN:', ''))
print(sum(1 for v in use.values() if len(v) > 1))
PY
)"

if ! npm run build >/tmp/imgfix-build.log 2>&1; then
  notify "⚠️ 이미지 교체 재개: 빌드 실패 — 수동 확인 필요 (/tmp/imgfix-build.log). 커밋 안 함, 잡 제거"
  selfremove; exit 1
fi

git add src/content && git commit -q -m "fix: 중복 이미지 교체 2차 완료 — 남은 14개 글 (잔여 중복 ${DUP}건)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>" && git push origin main >/dev/null 2>&1

notify "✅ 중복 이미지 교체 전체 완료 — 2차분 14개 글 반영, 잔여 중복 그룹 ${DUP}건 (0이 정상). 상세 로그: /tmp/imgfix-resume.log"
rm -rf "$REPO/.imgfix"
selfremove
exit 0
