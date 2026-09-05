-- Run this migration on an existing Supabase project
-- Adds admin-editable content tables and a direct show cover URL

begin;

alter type public.comment_status add value if not exists 'removed';

create or replace function public.moderate_comment_status(target_comment_id bigint, target_status public.comment_status)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  update public.comments
  set status = target_status,
      reviewed_at = now()
  where id = target_comment_id;

  if not found then
    raise exception 'Comment % not found', target_comment_id;
  end if;
end;
$$;

grant execute on function public.moderate_comment_status(bigint, public.comment_status) to authenticated;

alter table if exists public.shows
  add column if not exists cover_url text;

create table if not exists public.featured_covers (
  id bigserial primary key,
  image_url text not null,
  title text,
  artist text not null default '',
  release_year text not null default '',
  remixed_by text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.featured_covers
  add column if not exists artist text not null default '',
  add column if not exists release_year text not null default '',
  add column if not exists remixed_by text not null default '';

create table if not exists public.favorite_tracks (
  id bigserial primary key,
  title text not null,
  dj_name text not null default '',
  cover_url text,
  mp3_url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.favorite_tracks
  add column if not exists dj_name text not null default '';

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

insert into storage.buckets (id, name, public)
values ('admin-media', 'admin-media', true)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public;

drop policy if exists "admin_manage_media_objects" on storage.objects;
create policy "admin_manage_media_objects"
on storage.objects
for all
to authenticated
using (bucket_id = 'admin-media' and public.can_manage_content())
with check (bucket_id = 'admin-media' and public.can_manage_content());

drop policy if exists "public_read_approved_comments" on public.comments;
create policy "public_read_approved_comments"
on public.comments
for select
using (status = 'approved');

drop policy if exists "staff_read_comments" on public.comments;
create policy "staff_read_comments"
on public.comments
for select
to authenticated
using (true);

drop policy if exists "public_insert_comments" on public.comments;
create policy "public_insert_comments"
on public.comments
for insert
to anon, authenticated
with check (char_length(author_name) between 1 and 80 and char_length(body) between 1 and 1000);

drop policy if exists "moderators_manage_comments" on public.comments;
create policy "moderators_manage_comments"
on public.comments
for update
to authenticated
using (true)
with check (true);

drop policy if exists "moderators_delete_comments" on public.comments;
create policy "moderators_delete_comments"
on public.comments
for delete
to authenticated
using (true);

commit;
