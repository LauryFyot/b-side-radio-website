-- Add vinyl metadata fields to featured covers.
-- Run this on existing Supabase projects before using the new admin inputs.

begin;

alter table if exists public.featured_covers
  add column if not exists artist text not null default '',
  add column if not exists release_year text not null default '',
  add column if not exists remixed_by text not null default '';

commit;