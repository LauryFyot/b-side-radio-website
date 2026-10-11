begin;

create table if not exists public.scrolling_banner (
  id integer primary key default 1 check (id = 1),
  messages jsonb not null default '[]'::jsonb check (jsonb_typeof(messages) = 'array'),
  updated_at timestamptz not null default now()
);

alter table public.scrolling_banner enable row level security;
grant select on public.scrolling_banner to anon, authenticated;
grant insert, update on public.scrolling_banner to authenticated;

drop policy if exists public_read_scrolling_banner on public.scrolling_banner;
create policy public_read_scrolling_banner on public.scrolling_banner
for select using (true);

drop policy if exists manage_scrolling_banner on public.scrolling_banner;
create policy manage_scrolling_banner on public.scrolling_banner
for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

insert into public.scrolling_banner (id, messages) values (1, '[
  {"fr":"Only mashups & remixes","en":"Only mashups & remixes"},
  {"fr":"B Side Radio is LIVE","en":"B Side Radio is LIVE"},
  {"fr":"Mixes lives vendredi & samedi","en":"Live mixes Friday & Saturday"},
  {"fr":"Sans publicite","en":"No ads, ever"}
]'::jsonb) on conflict (id) do nothing;

commit;