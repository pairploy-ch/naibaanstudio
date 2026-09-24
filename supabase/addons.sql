-- Bookable add-ons (e.g. "NaiBaan Sweets & Tea") offered at checkout.
-- available_days holds weekday names matching weekly_template.date (e.g. 'Saturday','Sunday');
-- an empty array means "every day".
create table if not exists public.addons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null default 0, -- VAT-inclusive, per person
  description text,
  image_urls text[] not null default '{}'::text[],
  available_days text[] not null default '{}'::text[],
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- This project's pages use the anon key for both read and admin writes
-- (same pattern as the `reviews` / `discount_codes` tables), so keep RLS off.
alter table public.addons disable row level security;

-- Storage bucket for add-on photos (run once; ignore error if it already exists)
insert into storage.buckets (id, name, public)
values ('addons', 'addons', true)
on conflict (id) do nothing;

-- ============================================================================
-- STORAGE POLICIES for the "addons" bucket
-- ============================================================================

drop policy if exists "addons public read" on storage.objects;
create policy "addons public read"
  on storage.objects
  for select
  using (bucket_id = 'addons');

drop policy if exists "addons public insert" on storage.objects;
create policy "addons public insert"
  on storage.objects
  for insert
  with check (bucket_id = 'addons');

drop policy if exists "addons public update" on storage.objects;
create policy "addons public update"
  on storage.objects
  for update
  using (bucket_id = 'addons')
  with check (bucket_id = 'addons');

drop policy if exists "addons public delete" on storage.objects;
create policy "addons public delete"
  on storage.objects
  for delete
  using (bucket_id = 'addons');
