-- Run this migration on an existing Supabase project
-- Adds an optional visitor email on comments, so the crew can reply if requested.

begin;

alter table if exists public.comments
  add column if not exists author_email text;

commit;
