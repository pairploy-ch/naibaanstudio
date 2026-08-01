-- Frequently asked questions managed by admin and shown on the home page
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- This project's pages use the anon key for both read and admin writes
-- (same pattern as the `reviews` / `discount_codes` tables), so keep RLS off.
alter table public.faqs disable row level security;
