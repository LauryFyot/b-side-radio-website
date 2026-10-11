begin;

create table if not exists public.team_members (
  id bigserial primary key,
  name text not null unique,
  role text not null default '',
  role_en text not null default '',
  bio text not null default '',
  bio_en text not null default '',
  image_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.team_members enable row level security;
grant select on public.team_members to anon, authenticated;
grant insert, update, delete on public.team_members to authenticated;
grant usage, select on sequence public.team_members_id_seq to authenticated;

create index if not exists idx_team_members_sort on public.team_members(sort_order, id);

drop policy if exists public_read_team_members on public.team_members;
create policy public_read_team_members on public.team_members
for select using (true);

drop policy if exists manage_team_members on public.team_members;
create policy manage_team_members on public.team_members
for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create or replace function public.enforce_team_members_limit()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  perform pg_advisory_xact_lock(hashtext('public.team_members_max_8'));
  if tg_op = 'INSERT'
    and (select count(*) from public.team_members) >= 8
    and not exists (select 1 from public.team_members where id = new.id or name = new.name) then
    raise exception 'The team is limited to 8 members.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_team_members_limit on public.team_members;
create trigger trg_team_members_limit
before insert on public.team_members
for each row execute function public.enforce_team_members_limit();

drop trigger if exists trg_team_members_updated_at on public.team_members;
create trigger trg_team_members_updated_at
before update on public.team_members
for each row execute function public.handle_profile_updated_at();

insert into public.team_members (name, role, role_en, bio, bio_en, image_url, sort_order)
values
  ('Eddy', 'Fondateur b.side.radio.com', 'Founder of b.side.radio.com', 'Le beatmatching pour religion / digger de sons', 'Beatmatching is my religion / Sound digger', 'https://b-side-radio-website.vercel.app/assets/team-eddy-D3eOomND.jpeg', 0),
  ('DJ Bart', 'DJ / Producteur', 'DJ / Producer', 'La FunkyHouse en Vibe !', 'FunkyHouse Vibe!', 'https://b-side-radio-website.vercel.app/assets/team-bart-CVjtr8uU.jpg', 1),
  ('DJ SCRYLL', 'DJ / Producteur', 'DJ / Producer', 'Be HAPPY !!', 'Be HAPPY !!', 'https://b-side-radio-website.vercel.app/assets/team-scryll-BcpIQW8r.png', 2),
  ('The KNOCXX', 'Electrisez vos soirées..', 'Spice up your evenings...', 'Pure TechHouse Connection !!', 'Pure TechHouse Connection !!', 'https://b-side-radio-website.vercel.app/assets/team-theknocxx-BSSQxQ2d.png', 3)
on conflict (name) do nothing;

update public.team_members set image_url = 'https://b-side-radio-website.vercel.app/assets/team-eddy-D3eOomND.jpeg' where name = 'Eddy' and image_url = '/assets/team-eddy-D3eOomND.jpeg';
update public.team_members set image_url = 'https://b-side-radio-website.vercel.app/assets/team-bart-CVjtr8uU.jpg' where name = 'DJ Bart' and image_url = '/assets/team-bart-CVjtr8uU.jpg';
update public.team_members set image_url = 'https://b-side-radio-website.vercel.app/assets/team-scryll-BcpIQW8r.png' where name = 'DJ SCRYLL' and image_url = '/assets/team-scryll-BcpIQW8r.png';
update public.team_members set image_url = 'https://b-side-radio-website.vercel.app/assets/team-theknocxx-BSSQxQ2d.png' where name = 'The KNOCXX' and image_url = '/assets/team-theknocxx-BSSQxQ2d.png';

commit;