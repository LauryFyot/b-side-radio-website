-- Run this migration on an existing Supabase project
-- Adds a likes counter on comments plus a safe increment RPC for anonymous visitors.

begin;

alter table if exists public.comments
  add column if not exists likes_count integer not null default 0;

create or replace function public.increment_comment_likes(target_comment_id bigint)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  update public.comments
  set likes_count = likes_count + 1
  where id = target_comment_id
  returning likes_count into new_count;

  if not found then
    raise exception 'Comment % not found', target_comment_id;
  end if;

  return new_count;
end;
$$;

grant execute on function public.increment_comment_likes(bigint) to anon, authenticated;

create or replace function public.decrement_comment_likes(target_comment_id bigint)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  update public.comments
  set likes_count = greatest(likes_count - 1, 0)
  where id = target_comment_id
  returning likes_count into new_count;

  if not found then
    raise exception 'Comment % not found', target_comment_id;
  end if;

  return new_count;
end;
$$;

grant execute on function public.decrement_comment_likes(bigint) to anon, authenticated;

commit;
