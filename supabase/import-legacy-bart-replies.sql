begin;
set local lock_timeout = '10s';

lock table public.comments, public.comment_replies in share row exclusive mode;

create temporary table bart_reply_import (
  source_id bigint primary key,
  parent_id bigint not null unique,
  check (source_id <> parent_id)
) on commit drop;

insert into bart_reply_import (source_id, parent_id) values
  (34, 33),
  (55, 54),
  (59, 58),
  (62, 61),
  (76, 75),
  (82, 81),
  (92, 91);

do $$
declare
  bart_id constant uuid := 'd67c7d3d-d3c4-4bad-a8ae-c88d2ed53eb5';
  bart_name constant text := 'DJ BART BSIDE RADIO';
  conflicting_ids text;
begin
  if not exists (
    select 1 from public.profiles
    where id = bart_id and display_name = bart_name and is_active
  ) then
    raise exception 'Expected active profile DJ BART BSIDE RADIO was not found. Nothing imported.';
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgrelid = 'public.comment_replies'::regclass
      and tgname = 'comment_reply_guard' and tgenabled = 'O'
  ) then
    raise exception 'The normal reply guard must be installed and enabled. Nothing imported.';
  end if;

  select string_agg(mapping.source_id::text, ', ' order by mapping.source_id)
  into conflicting_ids
  from bart_reply_import mapping
  left join public.comments source on source.id = mapping.source_id
  left join public.comments parent on parent.id = mapping.parent_id
  where source.id is null or parent.id is null
    or source.author_name not ilike '%bart%'
    or source.body is null or char_length(btrim(source.body)) not between 1 and 1000
    or source.status not in ('approved', 'removed')
    or parent.status <> 'approved'
    or source.created_at is null or parent.created_at is null
    or source.created_at < parent.created_at;
  if conflicting_ids is not null then
    raise exception 'Missing or unexpected source/parent data for source comments: %. Nothing imported.', conflicting_ids;
  end if;

  select string_agg(distinct mapping.source_id::text, ', ')
  into conflicting_ids
  from bart_reply_import mapping
  join public.comment_replies existing on existing.comment_id = mapping.source_id;
  if conflicting_ids is not null then
    raise exception 'These source comments already have replies: %. Resolve them before hiding their parent. Nothing imported.', conflicting_ids;
  end if;

  select string_agg(mapping.source_id::text, ', ' order by mapping.source_id)
  into conflicting_ids
  from bart_reply_import mapping
  join public.comments source on source.id = mapping.source_id
  left join public.comment_replies existing
    on existing.comment_id = mapping.parent_id and existing.author_id = bart_id
  where (existing.id is not null and (
      existing.body is distinct from source.body
      or existing.created_at is distinct from source.created_at
      or existing.author_name is distinct from bart_name
    ))
    or (existing.id is null and source.status = 'removed');
  if conflicting_ids is not null then
    raise exception 'A Bart reply already exists, or a source was removed without an imported reply. Source comments: %. Nothing imported or overwritten.', conflicting_ids;
  end if;
end;
$$;

alter table public.comment_replies disable trigger comment_reply_guard;

insert into public.comment_replies (
  comment_id, author_id, author_name, body, created_at, updated_at
)
select
  mapping.parent_id,
  'd67c7d3d-d3c4-4bad-a8ae-c88d2ed53eb5'::uuid,
  'DJ BART BSIDE RADIO',
  source.body,
  source.created_at,
  source.created_at
from bart_reply_import mapping
join public.comments source on source.id = mapping.source_id
where not exists (
  select 1 from public.comment_replies existing
  where existing.comment_id = mapping.parent_id
    and existing.author_id = 'd67c7d3d-d3c4-4bad-a8ae-c88d2ed53eb5'::uuid
);

alter table public.comment_replies enable trigger comment_reply_guard;

update public.comments source
set status = 'removed'
from bart_reply_import mapping
where source.id = mapping.source_id and source.status = 'approved';

select
  mapping.source_id as ancien_commentaire_id,
  mapping.parent_id as commentaire_parent_id,
  reply.id as nouvelle_reponse_id,
  reply.author_name,
  reply.created_at,
  source.status as statut_ancien_commentaire
from bart_reply_import mapping
join public.comments source on source.id = mapping.source_id
join public.comment_replies reply
  on reply.comment_id = mapping.parent_id
  and reply.author_id = 'd67c7d3d-d3c4-4bad-a8ae-c88d2ed53eb5'::uuid
order by source.created_at;

commit;