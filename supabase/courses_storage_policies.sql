-- Lets the new /admin/course page upload cover/dish photos to the existing
-- "courses" storage bucket with the anon key (same pattern as the
-- `reviews` / `blogs` / `addons` buckets).
insert into storage.buckets (id, name, public)
values ('courses', 'courses', true)
on conflict (id) do nothing;

drop policy if exists "courses public read" on storage.objects;
create policy "courses public read"
  on storage.objects
  for select
  using (bucket_id = 'courses');

drop policy if exists "courses public insert" on storage.objects;
create policy "courses public insert"
  on storage.objects
  for insert
  with check (bucket_id = 'courses');

drop policy if exists "courses public update" on storage.objects;
create policy "courses public update"
  on storage.objects
  for update
  using (bucket_id = 'courses')
  with check (bucket_id = 'courses');

drop policy if exists "courses public delete" on storage.objects;
create policy "courses public delete"
  on storage.objects
  for delete
  using (bucket_id = 'courses');
