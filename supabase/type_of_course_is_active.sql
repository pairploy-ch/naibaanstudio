-- Lets old/unused course types (e.g. superseded by a per-day variant) be
-- hidden instead of deleted, so historical bookings that reference them
-- via weekly_template stay intact.
alter table public.type_of_course
  add column if not exists is_active boolean not null default true;
