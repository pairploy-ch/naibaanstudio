-- Photo gallery managed by admin (/admin/gallery) and shown on /gallery.
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  file_name text,
  file_size bigint,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- This project's pages use the anon key for both read and admin writes
-- (same pattern as the `reviews` / `faqs` tables), so keep RLS off.
alter table public.gallery_images disable row level security;

-- Storage bucket for gallery photos (run once; ignore error if it already exists)
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- ============================================================================
-- STORAGE POLICIES for the "images" bucket
-- The admin page uploads with the anon key, so allow public read + write
-- on this bucket only. (storage.objects always has RLS enabled.)
-- ============================================================================

drop policy if exists "gallery images public read" on storage.objects;
create policy "gallery images public read"
  on storage.objects
  for select
  using (bucket_id = 'images');

drop policy if exists "gallery images public insert" on storage.objects;
create policy "gallery images public insert"
  on storage.objects
  for insert
  with check (bucket_id = 'images');

drop policy if exists "gallery images public update" on storage.objects;
create policy "gallery images public update"
  on storage.objects
  for update
  using (bucket_id = 'images')
  with check (bucket_id = 'images');

drop policy if exists "gallery images public delete" on storage.objects;
create policy "gallery images public delete"
  on storage.objects
  for delete
  using (bucket_id = 'images');
