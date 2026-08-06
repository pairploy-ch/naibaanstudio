-- Blog posts managed by admin and shown on the home page + /blogs
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  content text not null,
  cover_image text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- This project's pages use the anon key for both read and admin writes
-- (same pattern as the `reviews` / `discount_codes` tables), so keep RLS off.
alter table public.blogs disable row level security;

-- ============================================================================
-- SLUG MIGRATION (run once) — adds a URL-friendly slug used by /blogs/[slug]
-- instead of the raw uuid, and backfills any existing rows from their title.
-- ============================================================================
alter table public.blogs add column if not exists slug text;

update public.blogs b
set slug = base.slug || case when base.rn > 1 then '-' || base.rn::text else '' end
from (
  select
    id,
    trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')) as slug,
    row_number() over (
      partition by trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g'))
      order by created_at
    ) as rn
  from public.blogs
) base
where b.id = base.id and b.slug is null;

alter table public.blogs alter column slug set not null;

drop index if exists blogs_slug_key;
alter table public.blogs drop constraint if exists blogs_slug_unique;
alter table public.blogs add constraint blogs_slug_unique unique (slug);

-- Storage bucket for blog cover images (run once; ignore error if it already exists)
insert into storage.buckets (id, name, public)
values ('blogs', 'blogs', true)
on conflict (id) do nothing;

-- ============================================================================
-- STORAGE POLICIES for the "blogs" bucket
-- The admin page uploads with the anon key, so allow public read + write
-- on this bucket only. (storage.objects always has RLS enabled.)
-- ============================================================================

drop policy if exists "blogs public read" on storage.objects;
create policy "blogs public read"
  on storage.objects
  for select
  using (bucket_id = 'blogs');

drop policy if exists "blogs public insert" on storage.objects;
create policy "blogs public insert"
  on storage.objects
  for insert
  with check (bucket_id = 'blogs');

drop policy if exists "blogs public update" on storage.objects;
create policy "blogs public update"
  on storage.objects
  for update
  using (bucket_id = 'blogs')
  with check (bucket_id = 'blogs');

drop policy if exists "blogs public delete" on storage.objects;
create policy "blogs public delete"
  on storage.objects
  for delete
  using (bucket_id = 'blogs');
