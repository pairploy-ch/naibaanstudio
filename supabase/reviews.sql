-- Customer reviews managed by admin and shown on the home page
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text,
  rating int not null default 5 check (rating >= 1 and rating <= 5),
  comment text not null,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- This project's pages use the anon key for both read and admin writes
-- (same pattern as the `menus` / `discount_codes` tables), so keep RLS off.
alter table public.reviews disable row level security;

-- Storage bucket for review images (run once; ignore error if it already exists)
insert into storage.buckets (id, name, public)
values ('reviews', 'reviews', true)
on conflict (id) do nothing;

-- ============================================================================
-- STORAGE POLICIES for the "reviews" bucket
-- The admin page uploads with the anon key, so allow public read + write
-- on this bucket only. (storage.objects always has RLS enabled.)
-- ============================================================================

-- Public can VIEW review images
drop policy if exists "reviews public read" on storage.objects;
create policy "reviews public read"
  on storage.objects
  for select
  using (bucket_id = 'reviews');

-- Public (admin via anon key) can UPLOAD review images
drop policy if exists "reviews public insert" on storage.objects;
create policy "reviews public insert"
  on storage.objects
  for insert
  with check (bucket_id = 'reviews');

-- Public (admin via anon key) can UPDATE review images
drop policy if exists "reviews public update" on storage.objects;
create policy "reviews public update"
  on storage.objects
  for update
  using (bucket_id = 'reviews')
  with check (bucket_id = 'reviews');

-- Public (admin via anon key) can DELETE review images
drop policy if exists "reviews public delete" on storage.objects;
create policy "reviews public delete"
  on storage.objects
  for delete
  using (bucket_id = 'reviews');
