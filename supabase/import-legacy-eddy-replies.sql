begin;
set local lock_timeout = '10s';

lock table public.comments, public.comment_replies in share row exclusive mode;

create temporary table eddy_reply_import (
  source_id bigint primary key,
  parent_id bigint not null unique,
  check (source_id <> parent_id)
) on commit drop;

insert into eddy_reply_import (source_id, parent_id) values
  (23, 22),
  (25, 24),
  (27, 26),
  (29, 28),
  (31, 30),
  (36, 35),
  (43, 42),
  (46, 45),
  (69, 63),
  (70, 68),
  (71, 65),
  (72, 66),
  (78, 77),
  (80, 79),
  (88, 87),
  (98, 97),
  (101, 100),
  (110, 109),
  (111, 108),
  (117, 116),
  (126, 124),
  (127, 123),
  (128, 120),
  (132, 130),
  (133, 129);

do $$
declare
  eddy_id constant uuid := 'c16e2d8e-28f1-467f-9adf-b293650ef59c';
  eddy_name constant text := 'EDDY BSIDE RADIO';
  conflicting_ids text;
begin
  if not exists (
    select 1 from public.profiles
    where id = eddy_id and display_name = eddy_name and is_active
  ) then
    raise exception 'Expected active profile EDDY BSIDE RADIO was not found. Nothing imported.';
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
  from eddy_reply_import mapping
  left join public.comments source on source.id = mapping.source_id
  left join public.comments parent on parent.id = mapping.parent_id
  where source.id is null or parent.id is null
    or source.author_name not ilike '%eddy%'
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
  from eddy_reply_import mapping
  join public.comment_replies existing on existing.comment_id = mapping.source_id;
  if conflicting_ids is not null then
    raise exception 'These source comments already have replies: %. Resolve them before hiding their parent. Nothing imported.', conflicting_ids;
  end if;

  select string_agg(mapping.source_id::text, ', ' order by mapping.source_id)
  into conflicting_ids
  from eddy_reply_import mapping
  join public.comments source on source.id = mapping.source_id
  left join public.comment_replies existing
    on existing.comment_id = mapping.parent_id and existing.author_id = eddy_id
  where (existing.id is not null and (
      existing.body is distinct from source.body
      or existing.created_at is distinct from source.created_at
      or existing.author_name is distinct from eddy_name
    ))
    or (existing.id is null and source.status = 'removed');
  if conflicting_ids is not null then
    raise exception 'An Eddy reply already exists, or a source was removed without an imported reply. Source comments: %. Nothing imported or overwritten.', conflicting_ids;
  end if;
end;
$$;

alter table public.comment_replies disable trigger comment_reply_guard;

insert into public.comment_replies (
  comment_id, author_id, author_name, body, created_at, updated_at
)
select
  mapping.parent_id,
  'c16e2d8e-28f1-467f-9adf-b293650ef59c'::uuid,
  'EDDY BSIDE RADIO',
  source.body,
  source.created_at,
  source.created_at
from eddy_reply_import mapping
join public.comments source on source.id = mapping.source_id
where not exists (
  select 1 from public.comment_replies existing
  where existing.comment_id = mapping.parent_id
    and existing.author_id = 'c16e2d8e-28f1-467f-9adf-b293650ef59c'::uuid
);

alter table public.comment_replies enable trigger comment_reply_guard;

update public.comments source
set status = 'removed'
from eddy_reply_import mapping
where source.id = mapping.source_id and source.status = 'approved';

select
  mapping.source_id as ancien_commentaire_id,
  mapping.parent_id as commentaire_parent_id,
  reply.id as nouvelle_reponse_id,
  reply.author_name,
  reply.created_at,
  source.status as statut_ancien_commentaire
from eddy_reply_import mapping
join public.comments source on source.id = mapping.source_id
join public.comment_replies reply
  on reply.comment_id = mapping.parent_id
  and reply.author_id = 'c16e2d8e-28f1-467f-9adf-b293650ef59c'::uuid
order by source.created_at;

commit;