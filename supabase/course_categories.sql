create table if not exists public.course_categories (
  slug text primary key,
  label text not null,
  cover text,
  sort_order integer not null default 0
);

alter table public.course_categories disable row level security;

insert into public.course_categories (slug, label, sort_order) values
  ('short-but-long-lasting', 'Short but Long Lasting', 1),
  ('full-course-happiness', 'Full Course Happiness', 2),
  ('happiness-on-street', 'Happiness on Street', 3),
  ('sweet-your-day', 'Sweet Your Day', 4)
on conflict (slug) do nothing;
