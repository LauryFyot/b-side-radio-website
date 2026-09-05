-- Supabase PostgreSQL schema for B-Side Radio
-- Re-runnable baseline schema (safe to execute multiple times)

begin;

-- ----------
-- Extensions
-- ----------
create extension if not exists pgcrypto;

-- ----------
-- Enums
-- ----------
do $$
begin
	if not exists (select 1 from pg_type where typname = 'comment_status') then
		create type public.comment_status as enum ('pending', 'approved', 'rejected', 'spam', 'removed');
	else
		alter type public.comment_status add value if not exists 'removed';
	end if;

	if not exists (select 1 from pg_type where typname = 'asset_kind') then
		create type public.asset_kind as enum ('image', 'audio', 'other');
	end if;
end
$$;

-- ----------
-- Common trigger helper
-- ----------
create or replace function public.handle_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

-- ----------
-- Auth profiles
-- ----------
create table if not exists public.profiles (
	id uuid primary key references auth.users(id) on delete cascade,
	display_name text not null default '',
	is_active boolean not null default true,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.handle_profile_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	insert into public.profiles (id, display_name)
	values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
	on conflict (id) do nothing;
	return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();

-- ----------
-- RBAC
-- ----------
create table if not exists public.roles (
	id bigserial primary key,
	slug text not null unique,
	name text not null
);

create table if not exists public.permissions (
	id bigserial primary key,
	slug text not null unique,
	name text not null
);

create table if not exists public.user_roles (
	user_id uuid not null references public.profiles(id) on delete cascade,
	role_id bigint not null references public.roles(id) on delete cascade,
	assigned_at timestamptz not null default now(),
	primary key (user_id, role_id)
);

create table if not exists public.role_permissions (
	role_id bigint not null references public.roles(id) on delete cascade,
	permission_id bigint not null references public.permissions(id) on delete cascade,
	primary key (role_id, permission_id)
);

create or replace function public.has_role(role_slug text, uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
	select exists (
		select 1
		from public.user_roles ur
		join public.roles r on r.id = ur.role_id
		where ur.user_id = uid
			and r.slug = role_slug
	);
$$;

create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
	select public.has_role('super_admin', uid)
			or public.has_role('admin', uid)
			or public.has_role('editor', uid)
			or public.has_role('moderator', uid);
$$;

create or replace function public.can_manage_content(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
	select public.has_role('super_admin', uid)
			or public.has_role('admin', uid)
			or public.has_role('editor', uid);
$$;

create or replace function public.can_moderate_comments(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
	select public.has_role('super_admin', uid)
			or public.has_role('admin', uid)
			or public.has_role('moderator', uid);
$$;

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

-- ----------
-- Assets / Programs
-- ----------
create table if not exists public.assets (
	id bigserial primary key,
	kind public.asset_kind not null default 'image',
	path text not null,
	alt_text text,
	title text,
	mime_type text,
	size_bytes bigint,
	uploaded_by uuid references public.profiles(id) on delete set null,
	created_at timestamptz not null default now()
);

create index if not exists idx_assets_kind on public.assets(kind);

create table if not exists public.shows (
	id bigserial primary key,
	slug text not null unique,
	name text not null,
	description text,
	cover_url text,
	cover_asset_id bigint references public.assets(id) on delete set null,
	is_active boolean not null default true,
	created_by uuid references public.profiles(id) on delete set null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

drop trigger if exists trg_shows_updated_at on public.shows;
create trigger trg_shows_updated_at
before update on public.shows
for each row
execute function public.handle_profile_updated_at();

create table if not exists public.show_slots (
	id bigserial primary key,
	show_id bigint not null references public.shows(id) on delete cascade,
	day_of_week smallint not null check (day_of_week between 1 and 7),
	start_time time not null,
	end_time time not null,
	priority smallint not null default 0,
	is_active boolean not null default true,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	check (start_time <> end_time)
);

create index if not exists idx_show_slots_day_time on public.show_slots(day_of_week, start_time, end_time);

drop trigger if exists trg_show_slots_updated_at on public.show_slots;
create trigger trg_show_slots_updated_at
before update on public.show_slots
for each row
execute function public.handle_profile_updated_at();

-- ----------
-- Featured content for homepage
-- ----------
create table if not exists public.featured_covers (
	id bigserial primary key,
	image_url text not null,
	title text,
	sort_order integer not null default 0,
	is_active boolean not null default true,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists idx_featured_covers_sort on public.featured_covers(sort_order, id);

drop trigger if exists trg_featured_covers_updated_at on public.featured_covers;
create trigger trg_featured_covers_updated_at
before update on public.featured_covers
for each row
execute function public.handle_profile_updated_at();

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

create index if not exists idx_favorite_tracks_sort on public.favorite_tracks(sort_order, id);

drop trigger if exists trg_favorite_tracks_updated_at on public.favorite_tracks;
create trigger trg_favorite_tracks_updated_at
before update on public.favorite_tracks
for each row
execute function public.handle_profile_updated_at();

create table if not exists public.featured_videos (
	id bigserial primary key,
	slot smallint not null check (slot between 1 and 3),
	title text,
	youtube_url text not null,
	is_active boolean not null default true,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists idx_featured_videos_slot on public.featured_videos(slot, id);

drop trigger if exists trg_featured_videos_updated_at on public.featured_videos;
create trigger trg_featured_videos_updated_at
before update on public.featured_videos
for each row
execute function public.handle_profile_updated_at();

-- ----------
-- Comments
-- ----------
create table if not exists public.comments (
	id bigserial primary key,
	author_name text not null,
	author_email text,
	body text not null,
	status public.comment_status not null default 'pending',
	likes_count integer not null default 0,
	ip_hash text,
	user_agent text,
	spam_score numeric(5,2),
	reviewed_by uuid references public.profiles(id) on delete set null,
	reviewed_at timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists idx_comments_status_created on public.comments(status, created_at desc);

drop trigger if exists trg_comments_updated_at on public.comments;
create trigger trg_comments_updated_at
before update on public.comments
for each row
execute function public.handle_profile_updated_at();

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

drop trigger if exists trg_comment_insert_guard on public.comments;
create trigger trg_comment_insert_guard
before insert on public.comments
for each row
execute function public.comment_insert_guard();

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

-- ----------
-- Site settings / now playing / audit
-- ----------
create table if not exists public.site_settings (
	id bigserial primary key,
	setting_key text not null unique,
	setting_value text,
	updated_by uuid references public.profiles(id) on delete set null,
	updated_at timestamptz not null default now()
);

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.handle_profile_updated_at();

create table if not exists public.now_playing_cache (
	id smallint primary key default 1,
	track_title text,
	artist_name text,
	raw_payload jsonb,
	source_name text,
	fetched_at timestamptz,
	updated_at timestamptz not null default now(),
	check (id = 1)
);

drop trigger if exists trg_now_playing_updated_at on public.now_playing_cache;
create trigger trg_now_playing_updated_at
before update on public.now_playing_cache
for each row
execute function public.handle_profile_updated_at();

create table if not exists public.audit_logs (
	id bigserial primary key,
	user_id uuid references public.profiles(id) on delete set null,
	action text not null,
	entity_type text,
	entity_id bigint,
	metadata jsonb,
	created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_created on public.audit_logs(created_at desc);

-- ----------
-- Seed RBAC
-- ----------
insert into public.roles (slug, name)
values
	('super_admin', 'Super Admin'),
	('admin', 'Admin'),
	('editor', 'Editeur'),
	('moderator', 'Moderateur')
on conflict (slug) do nothing;

insert into public.permissions (slug, name)
values
	('users.manage', 'Gerer les utilisateurs'),
	('roles.manage', 'Gerer roles et permissions'),
	('comments.read', 'Lire les commentaires'),
	('comments.moderate', 'Moderation commentaires'),
	('shows.read', 'Lire programmation'),
	('shows.manage', 'Gerer programmation'),
	('assets.read', 'Lire assets'),
	('assets.manage', 'Gerer assets'),
	('featured.manage', 'Gerer contenus mis en avant'),
	('settings.manage', 'Gerer parametres site'),
	('now_playing.manage', 'Gerer flux now playing')
on conflict (slug) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on true
where r.slug = 'super_admin'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.slug in (
	'comments.read','comments.moderate',
	'shows.read','shows.manage',
	'assets.read','assets.manage',
	'featured.manage','settings.manage','now_playing.manage'
)
where r.slug = 'admin'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.slug in (
	'shows.read','shows.manage',
	'assets.read','assets.manage',
	'featured.manage',
	'now_playing.manage'
)
where r.slug = 'editor'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.slug in ('comments.read','comments.moderate')
where r.slug = 'moderator'
on conflict do nothing;

-- ----------
-- RLS
-- ----------
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.assets enable row level security;
alter table public.shows enable row level security;
alter table public.show_slots enable row level security;
alter table public.featured_covers enable row level security;
alter table public.favorite_tracks enable row level security;
alter table public.featured_videos enable row level security;
alter table public.comments enable row level security;
alter table public.site_settings enable row level security;
alter table public.now_playing_cache enable row level security;
alter table public.audit_logs enable row level security;

insert into storage.buckets (id, name, public)
values ('admin-media', 'admin-media', true)
on conflict (id) do update
set name = excluded.name,
	public = excluded.public;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "public_read_active_shows" on public.shows;
create policy "public_read_active_shows"
on public.shows
for select
using (is_active = true);

drop policy if exists "public_read_active_show_slots" on public.show_slots;
create policy "public_read_active_show_slots"
on public.show_slots
for select
using (is_active = true);

drop policy if exists "public_read_assets" on public.assets;
create policy "public_read_assets"
on public.assets
for select
using (true);

drop policy if exists "public_read_featured_covers" on public.featured_covers;
create policy "public_read_featured_covers"
on public.featured_covers
for select
using (is_active = true);

drop policy if exists "public_read_favorite_tracks" on public.favorite_tracks;
create policy "public_read_favorite_tracks"
on public.favorite_tracks
for select
using (is_active = true);

drop policy if exists "public_read_featured_videos" on public.featured_videos;
create policy "public_read_featured_videos"
on public.featured_videos
for select
using (is_active = true);

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

drop policy if exists "public_read_now_playing" on public.now_playing_cache;
create policy "public_read_now_playing"
on public.now_playing_cache
for select
using (true);

drop policy if exists "public_read_site_settings" on public.site_settings;
create policy "public_read_site_settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "public_insert_comments" on public.comments;
create policy "public_insert_comments"
on public.comments
for insert
to anon, authenticated
with check (char_length(author_name) between 1 and 80 and char_length(body) between 1 and 1000);

drop policy if exists "manage_shows" on public.shows;
create policy "manage_shows"
on public.shows
for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "manage_show_slots" on public.show_slots;
create policy "manage_show_slots"
on public.show_slots
for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "manage_assets" on public.assets;
create policy "manage_assets"
on public.assets
for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "manage_featured_covers" on public.featured_covers;
create policy "manage_featured_covers"
on public.featured_covers
for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "manage_favorite_tracks" on public.favorite_tracks;
create policy "manage_favorite_tracks"
on public.favorite_tracks
for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "manage_featured_videos" on public.featured_videos;
create policy "manage_featured_videos"
on public.featured_videos
for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "manage_site_settings" on public.site_settings;
create policy "manage_site_settings"
on public.site_settings
for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "manage_now_playing" on public.now_playing_cache;
create policy "manage_now_playing"
on public.now_playing_cache
for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

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

drop policy if exists "admin_read_roles" on public.roles;
create policy "admin_read_roles"
on public.roles
for select
to authenticated
using (public.is_admin());

drop policy if exists "admin_read_permissions" on public.permissions;
create policy "admin_read_permissions"
on public.permissions
for select
to authenticated
using (public.is_admin());

drop policy if exists "admin_manage_user_roles" on public.user_roles;
create policy "admin_manage_user_roles"
on public.user_roles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_read_role_permissions" on public.role_permissions;
create policy "admin_read_role_permissions"
on public.role_permissions
for select
to authenticated
using (public.is_admin());

drop policy if exists "admin_read_audit_logs" on public.audit_logs;
create policy "admin_read_audit_logs"
on public.audit_logs
for select
to authenticated
using (public.is_admin());

drop policy if exists "admin_manage_media_objects" on storage.objects;
create policy "admin_manage_media_objects"
on storage.objects
for all
to authenticated
using (bucket_id = 'admin-media' and public.can_manage_content())
with check (bucket_id = 'admin-media' and public.can_manage_content());

-- ----------
-- Helper RPC: grant first admin role
-- ----------
create or replace function public.grant_role_to_user(target_user_id uuid, target_role_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
	target_role_id bigint;
begin
	if exists (
		select 1
		from public.user_roles ur
		join public.roles r on r.id = ur.role_id
		where r.slug = 'super_admin'
	) then
		if not public.has_role('super_admin') then
			raise exception 'Only super_admin can grant roles';
		end if;
	end if;

	select id into target_role_id
	from public.roles
	where slug = target_role_slug;

	if target_role_id is null then
		raise exception 'Unknown role slug: %', target_role_slug;
	end if;

	insert into public.user_roles (user_id, role_id)
	values (target_user_id, target_role_id)
	on conflict do nothing;
end;
$$;

commit;
