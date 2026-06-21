-- Discount codes managed by admin
create table if not exists public.discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  percent numeric not null check (percent > 0 and percent <= 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Store discount info on each booking for reporting
alter table public.bookings
  add column if not exists discount_code text,
  add column if not exists discount_amount numeric default 0;

-- Optional seed data (remove if not needed)
insert into public.discount_codes (code, percent) values
  ('WELCOME10', 10),
  ('THAI20', 20),
  ('SUMMER15', 15)
on conflict (code) do nothing;

-- ============================================================================
-- ROW LEVEL SECURITY
-- If RLS is ON (the default when a table is created via the Supabase Table
-- Editor UI), the checkout page (anon key) cannot read the rows and every
-- code shows "Invalid discount code."
--
-- This project's admin pages use the anon key to insert/update/delete
-- (same as the `menus` table), so we DISABLE RLS to match that pattern and
-- keep both checkout (read) and admin (write) working.
-- ============================================================================
alter table public.discount_codes disable row level security;
