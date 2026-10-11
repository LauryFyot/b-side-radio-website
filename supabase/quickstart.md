# Supabase Quickstart (B-Side Radio)

## 1) Create project
- Go to Supabase Dashboard
- Create a new project (region EU if possible)
- Save these values:
  - Project URL
  - anon key
  - service_role key (keep private)

## 2) Run SQL schema
- Open SQL Editor in Supabase
- Paste and run `supabase/schema.sql`

## 3) Create first admin user
- In Authentication > Users: create your user account
- Get your user UUID
- Run this SQL:

```sql
select public.grant_role_to_user('<YOUR-USER-UUID>', 'super_admin');
```

## 4) Create your father account (co-admin/editor)
- Create his account in Authentication > Users
- Get his UUID
- Assign role (recommended `editor`):

```sql
select public.grant_role_to_user('<FATHER-USER-UUID>', 'editor');
```

## 5) Minimal env vars for PHP app
Use these in your runtime env or local config (do not commit secrets):

- SUPABASE_URL
- SUPABASE_ANON_KEY (public usage only)
- SUPABASE_SERVICE_ROLE_KEY (server only)

## 6) First tables you will use in app
- `comments`
- `shows`
- `show_slots`
- `assets`
- `now_playing_cache`

## 7) Notes
- Public can insert comments and they are immediately set to `approved`.
- Comment moderation can still be done later by changing `status` to `rejected` or `spam`.
- `editor` can manage shows/slots/assets/now_playing.
- `moderator` can moderate comments.
