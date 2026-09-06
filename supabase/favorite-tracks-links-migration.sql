-- Add recommendation and purchase-link metadata to favorite tracks.
-- Run this on existing Supabase projects before using the new admin inputs.

begin;

alter table if exists public.favorite_tracks
  add column if not exists recommended_by text not null default '',
  add column if not exists buy_url text not null default '';

update public.favorite_tracks
set recommended_by = dj_name
where recommended_by = '' and dj_name <> '';

update public.favorite_tracks
set buy_url = cover_url
where buy_url = '' and coalesce(cover_url, '') <> '';

commit;