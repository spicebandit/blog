// 자체 댓글 API (서버 전용). Supabase REST를 service_role 키로 호출한다.
// 환경변수(Vercel): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OWNER_COMMENT_KEY
//   - service_role 키와 소유자 키는 서버에서만 사용 — 브라우저에 절대 노출되지 않는다.
// GET  /api/comments?slug=<글식별자>  → 공개 댓글(public + author_reply) 목록
// POST /api/comments  { slug, author, body, ownerKey? }
//   - ownerKey가 OWNER_COMMENT_KEY와 일치하면 role=owner_note(비공개, 편집자에게만)
//   - 아니면 role=public(즉시 노출)
export const prerender = false;

const J = (o: any, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json' } });

const SB = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 미설정');
  return { url: url.replace(/\/$/, ''), key };
};

// Supabase PostgREST 호출 헬퍼
async function sb(path: string, init: RequestInit = {}) {
  const { url, key } = SB();
  const r = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await r.text();
  const data = text ? JSON.parse(text) : null;
  if (!r.ok) throw new Error(data?.message || `Supabase ${r.status}`);
  return data;
}

const clip = (s: any, n: number) => String(s ?? '').trim().slice(0, n);

export async function GET({ url }: { url: URL }) {
  try {
    const slug = clip(url.searchParams.get('slug'), 200);
    if (!slug) return J({ error: 'slug 필요' }, 400);
    // 공개용: 편집자 비공개 메모(owner_note)는 제외
    const rows = await sb(
      `comments?slug=eq.${encodeURIComponent(slug)}` +
        `&role=in.(public,author_reply)&status=eq.visible` +
        `&order=created_at.asc&select=id,author,body,role,parent_id,created_at`,
    );
    return J({ comments: rows || [] });
  } catch (e: any) {
    return J({ error: '조회 실패: ' + (e?.message || String(e)) }, 500);
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const bodyJson = await request.json().catch(() => ({}));
    const slug = clip(bodyJson.slug, 200);
    const author = clip(bodyJson.author, 40) || '익명';
    const body = clip(bodyJson.body, 4000);
    const ownerKey = typeof bodyJson.ownerKey === 'string' ? bodyJson.ownerKey : '';

    if (!slug) return J({ error: 'slug가 필요합니다.' }, 400);
    if (!body) return J({ error: '내용을 입력해주세요.' }, 400);
    if (body.length < 2) return J({ error: '내용이 너무 짧습니다.' }, 400);

    // 소유자 판정: 서버의 OWNER_COMMENT_KEY와 정확히 일치할 때만
    const ownerSecret = process.env.OWNER_COMMENT_KEY;
    const isOwner = !!ownerSecret && ownerKey === ownerSecret;
    const role = isOwner ? 'owner_note' : 'public';

    const inserted = await sb('comments', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ slug, author: isOwner ? '편집자' : author, body, role }),
    });
    const row = Array.isArray(inserted) ? inserted[0] : inserted;

    // 소유자 메모는 화면에 돌려주지 않는다(비공개). 공개댓글만 반환.
    if (isOwner) {
      return J({ ok: true, owner: true, message: '편집자에게 전달되었습니다(비공개).' });
    }
    return J({
      ok: true,
      owner: false,
      comment: {
        id: row.id,
        author: row.author,
        body: row.body,
        role: row.role,
        parent_id: row.parent_id,
        created_at: row.created_at,
      },
    });
  } catch (e: any) {
    return J({ error: '등록 실패: ' + (e?.message || String(e)) }, 500);
  }
}
