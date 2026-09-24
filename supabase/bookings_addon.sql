-- Records the checkout add-on (e.g. NaiBaan Sweets & Tea) a customer bought
-- alongside a class, if any.
alter table public.bookings
  add column if not exists addon_name text,
  add column if not exists addon_quantity int,
  add column if not exists addon_total numeric not null default 0;
