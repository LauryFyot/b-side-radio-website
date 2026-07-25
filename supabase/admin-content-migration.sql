-- Run this migration on an existing Supabase project
-- Adds admin-editable content tables and a direct show cover URL

begin;

alter table if exists public.shows
  add column if not exists cover_url text;

create table if not exists public.featured_covers (
  id bigserial primary key,
  image_url text not null,
  title text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorite_tracks (
  id bigserial primary key,
  title text not null,
  cover_url text,
  mp3_url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.featured_videos (
  id bigserial primary key,
  slot smallint not null check (slot between 1 and 3),
  title text,
  youtube_url text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_featured_covers_sort on public.featured_covers(sort_order, id);
create index if not exists idx_favorite_tracks_sort on public.favorite_tracks(sort_order, id);
create index if not exists idx_featured_videos_slot on public.featured_videos(slot, id);

alter table public.featured_covers enable row level security;
alter table public.favorite_tracks enable row level security;
alter table public.featured_videos enable row level security;

drop policy if exists "public_read_featured_covers" on public.featured_covers;
drop policy if exists "public_read_favorite_tracks" on public.favorite_tracks;
drop policy if exists "public_read_featured_videos" on public.featured_videos;
drop policy if exists "manage_featured_covers" on public.featured_covers;
drop policy if exists "manage_favorite_tracks" on public.favorite_tracks;
drop policy if exists "manage_featured_videos" on public.featured_videos;

create policy "public_read_featured_covers"
on public.featured_covers
for select
using (is_active = true);

create policy "public_read_favorite_tracks"
on public.favorite_tracks
for select
using (is_active = true);

create policy "public_read_featured_videos"
on public.featured_videos
for select
using (is_active = true);

create policy "manage_featured_covers"
on public.featured_covers
for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "manage_favorite_tracks"
on public.favorite_tracks
for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "manage_featured_videos"
on public.featured_videos
for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

commit;
