-- Seed legacy B-Side content into Supabase admin tables
-- Safe to re-run: updates seeded shows and replaces seeded slots/covers/tracks/videos
-- Prerequisite: run supabase/admin-content-migration.sql first

begin;

alter table if exists public.shows
  add column if not exists cover_url text;

-- 1) Program shows (upsert by slug)
insert into public.shows (slug, name, description, cover_url, is_active)
values
  ('wake-up', 'Wake-Up', 'Les douceurs B side radio.com pour commencer une belle journee', 'https://picsum.photos/300?random=1', true),
  ('tonik-time', 'Tonik Time', 'Les meilleurs titres et l actu de B side radio.com', 'https://picsum.photos/300?random=2', true),
  ('hello-time', 'Hello Time', 'Tout B Side pour passer une bonne journee', 'https://picsum.photos/300?random=3', true),
  ('funky-zone', 'Funky Zone', 'Les grands standards de Funk en mode remix et mashups', 'https://picsum.photos/300?random=4', true),
  ('klub-singles-eddy', 'Klub singles by Eddy', 'Les meilleurs remixes et mashups de la semaine', 'https://picsum.photos/300?random=5', true),
  ('klub-singles-djbart', 'Klub singles by DjBart', 'L actu club de la semaine', 'https://picsum.photos/300?random=6', true),
  ('b-side-klub', 'B Side Klub', 'Le son klub by B Side Radio', 'https://picsum.photos/300?random=7', true),
  ('24-7', '24/7', 'Du son toute la journee !', 'https://picsum.photos/300?random=8', true)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  cover_url = excluded.cover_url,
  is_active = excluded.is_active,
  updated_at = now();

-- 2) Program schedule slots
-- Replace slots for seeded shows only
with seeded_show_ids as (
  select id
  from public.shows
  where slug in (
    'wake-up','tonik-time','hello-time','funky-zone',
    'klub-singles-eddy','klub-singles-djbart','b-side-klub','24-7'
  )
)
delete from public.show_slots
where show_id in (select id from seeded_show_ids);

insert into public.show_slots (show_id, day_of_week, start_time, end_time, priority, is_active)
select s.id, 1, t.start_time::time, t.end_time::time, t.priority, true
from public.shows s
join (
  values
    ('wake-up', '07:00', '09:00', 1),
    ('tonik-time', '09:00', '10:00', 2),
    ('hello-time', '10:00', '16:00', 3),
    ('funky-zone', '16:00', '18:00', 4),
    ('klub-singles-eddy', '18:00', '19:00', 5),
    ('klub-singles-djbart', '19:00', '20:00', 6),
    ('b-side-klub', '20:00', '23:00', 7),
    ('24-7', '00:00', '23:59', 8)
) as t(slug, start_time, end_time, priority)
  on s.slug = t.slug;

-- 3) This week covers carousel
truncate table public.featured_covers restart identity;

insert into public.featured_covers (image_url, title, sort_order, is_active)
values
  ('http://byeddy.free.fr/POCHETTES/7.jpg', 'Cover 7', 1, true),
  ('http://byeddy.free.fr/POCHETTES/8.jpg', 'Cover 8', 2, true),
  ('http://byeddy.free.fr/POCHETTES/9.jpg', 'Cover 9', 3, true),
  ('http://byeddy.free.fr/POCHETTES/10.jpg', 'Cover 10', 4, true),
  ('http://byeddy.free.fr/POCHETTES/11.jpg', 'Cover 11', 5, true),
  ('http://byeddy.free.fr/POCHETTES/12.jpg', 'Cover 12', 6, true),
  ('http://byeddy.free.fr/POCHETTES/13.jpg', 'Cover 13', 7, true),
  ('http://byeddy.free.fr/POCHETTES/14.jpg', 'Cover 14', 8, true),
  ('http://byeddy.free.fr/POCHETTES/15.jpg', 'Cover 15', 9, true),
  ('http://byeddy.free.fr/POCHETTES/16.jpg', 'Cover 16', 10, true),
  ('http://byeddy.free.fr/POCHETTES/17.jpg', 'Cover 17', 11, true),
  ('http://byeddy.free.fr/POCHETTES/18.jpg', 'Cover 18', 12, true),
  ('http://byeddy.free.fr/POCHETTES/19.jpg', 'Cover 19', 13, true),
  ('http://byeddy.free.fr/POCHETTES/20.jpg', 'Cover 20', 14, true),
  ('http://byeddy.free.fr/POCHETTES/1.jpg', 'Cover 1', 15, true),
  ('http://byeddy.free.fr/POCHETTES/2.jpg', 'Cover 2', 16, true),
  ('http://byeddy.free.fr/POCHETTES/3.jpg', 'Cover 3', 17, true),
  ('http://byeddy.free.fr/POCHETTES/4.jpg', 'Cover 4', 18, true),
  ('http://byeddy.free.fr/POCHETTES/5.jpg', 'Cover 5', 19, true),
  ('http://byeddy.free.fr/POCHETTES/6.jpg', 'Cover 6', 20, true);

-- 4) Replay session favorite tracks (top 6 shown on frontend)
truncate table public.favorite_tracks restart identity;

insert into public.favorite_tracks (title, dj_name, recommended_by, cover_url, buy_url, mp3_url, sort_order, is_active)
values
  ('Mix ByEddy', 'DJ Eddy', 'DJ Eddy', '', 'http://byeddy.free.fr/POCHETTES/7.jpg', 'http://byeddy.free.fr/MIXES/BSR_byeddy_1.mp3', 1, true),
  ('Mix ByEddy', 'DJ Eddy', 'DJ Eddy', '', 'http://byeddy.free.fr/POCHETTES/8.jpg', 'http://byeddy.free.fr/MIXES/BSR_byeddy_2.mp3', 2, true),
  ('Mix DJ Bart', 'DJ Bart', 'DJ Bart', '', 'http://byeddy.free.fr/POCHETTES/9.jpg', 'http://byeddy.free.fr/MIXES/BSR_djbart_1.mp3', 3, true),
  ('Mix DJ Bart', 'DJ Bart', 'DJ Bart', '', 'http://byeddy.free.fr/POCHETTES/10.jpg', 'http://byeddy.free.fr/MIXES/BSR_djbart_2.mp3', 4, true),
  ('Mix DJ LeCyr', 'DJ LeCyr', 'DJ LeCyr', '', 'http://byeddy.free.fr/POCHETTES/11.jpg', 'http://byeddy.free.fr/MIXES/BSR_djlecyr_1.mp3', 5, true),
  ('Mix DJ LeCyr', 'DJ LeCyr', 'DJ LeCyr', '', 'http://byeddy.free.fr/POCHETTES/12.jpg', 'http://byeddy.free.fr/MIXES/BSR_djlecyr_2.mp3', 6, true);

-- 5) Featured videos
truncate table public.featured_videos restart identity;

insert into public.featured_videos (slot, title, youtube_url, is_active)
values
  (1, 'Featured video 1', 'https://www.youtube.com/watch?v=FcQvsQstZEA', true),
  (2, 'Featured video 2', 'https://www.youtube.com/watch?v=UuzImt46v2Y', true),
  (3, 'Featured video 3', 'https://www.youtube.com/watch?v=1-eYunUhSpo', true);

commit;
