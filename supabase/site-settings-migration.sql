-- Run this only if public.site_settings does not already exist

begin;

create table if not exists public.site_settings (
  id bigserial primary key,
  setting_key text not null unique,
  setting_value text,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "public_read_site_settings" on public.site_settings;
drop policy if exists "manage_site_settings" on public.site_settings;

create policy "public_read_site_settings"
on public.site_settings
for select
using (true);

create policy "manage_site_settings"
on public.site_settings
for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

commit;
