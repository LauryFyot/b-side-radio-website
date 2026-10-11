-- Add a purchase link to vinyl covers (moved from favorite_tracks).
-- Run this on existing Supabase projects before using the new admin input.

begin;

alter table if exists public.featured_covers
  add column if not exists buy_url text not null default '';

commit;
