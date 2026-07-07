-- 베이스로드 자체 댓글 시스템 스키마
-- Supabase SQL Editor에 그대로 붙여넣어 1회 실행하면 된다.
-- 모든 접근은 서버함수(api/comments)가 service_role 키로만 처리하므로,
-- RLS를 켜고 공개 정책은 두지 않는다(anon 키로 직접 접근 차단).

create table if not exists public.comments (
  id           bigint generated always as identity primary key,
  slug         text        not null,                 -- 글 식별자(post.id, 영문판은 en- 접두)
  author       text        not null default '익명',
  body         text        not null,
  role         text        not null default 'public' -- public | owner_note | author_reply
                 check (role in ('public','owner_note','author_reply')),
  parent_id    bigint      references public.comments(id) on delete set null,
  status       text        not null default 'visible' -- visible | hidden | spam
                 check (status in ('visible','hidden','spam')),
  processed    boolean     not null default false,    -- 읽기 스크립트가 알림 처리했는지
  created_at   timestamptz not null default now()
);

create index if not exists comments_slug_idx      on public.comments (slug);
create index if not exists comments_processed_idx  on public.comments (processed);
create index if not exists comments_created_idx    on public.comments (created_at);

-- RLS: 켜되 공개 정책 없음 → 오직 service_role(서버함수)만 접근 가능
alter table public.comments enable row level security;
