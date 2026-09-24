-- Adds a food allergy field, captured at checkout and shown on the booking confirmation email.
-- Safe to re-run on an existing table.
alter table public.customers
  add column if not exists food_allergy text;
