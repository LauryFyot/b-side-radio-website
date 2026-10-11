-- Run this on an existing Supabase project to publish comments immediately

begin;

create or replace function public.comment_insert_guard()
returns trigger
language plpgsql
as $$
begin
  new.status := 'approved';
  new.reviewed_by := null;
  new.reviewed_at := null;
  return new;
end;
$$;

-- Optional: migrate already pending comments to approved now
update public.comments
set status = 'approved', reviewed_by = null, reviewed_at = null
where status = 'pending';

commit;
