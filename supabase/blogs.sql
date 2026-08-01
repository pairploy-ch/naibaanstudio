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
