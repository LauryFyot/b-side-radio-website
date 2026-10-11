# R2 Mix Lifecycle

The admin uploads draft MP3s immediately, but changes become public only on Publish.
After a successful publication, it asks the Worker to reconcile `tracks/` with
the media URLs stored in Supabase. Deleted/replaced MP3s and superseded uploads
from the current editor session are removed if they are no longer referenced.
Files referenced by another mix, a show, or a featured cover are retained.

A daily job also removes unreferenced uploads older than 24 hours. With the daily
schedule, an abandoned upload is removed within approximately 24-48 hours.
Unpublished drafts older than that must be uploaded again. Fresh drafts remain
temporarily alongside published files; deleting them immediately would break editing.
Cleanup is limited to `tracks/`, not the other media folders or Supabase Storage.
Existing Supabase MP3s are not migrated by this change.

## Cloudflare Setup

Keep the existing variables/secrets:

- `R2_ACCOUNT_ID`
- `R2_BUCKET_NAME` (`bside-media`)
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `PUBLIC_BASE_URL` (the same public base URL already used by the site)

Add these to the Worker, not the Vite admin environment:

- `SUPABASE_URL`: the project's URL (same value as `VITE_SUPABASE_URL`).
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase's server-only legacy `service_role` key,
  stored as a Cloudflare secret. Never use the anon key here or expose it as `VITE_*`.

The binding `BSIDE_MEDIA` must point to the `bside-media` R2 bucket. Signing uses
the S3 credentials; listing and deletion use this native R2 binding.

The Supabase schema must expose `can_manage_content`, and admin accounts must
have a `super_admin`, `admin`, or `editor` role. The Worker verifies both the
Supabase session and this permission; an authenticated non-editor cannot delete media.

## Deploy

From the repository root:

```sh
npm --prefix workers ci
npm --prefix workers test
npm --prefix workers run deploy
```

Wrangler requires Cloudflare authentication. The configuration preserves existing
dashboard variables and schedules cleanup every day at 03:00 UTC.

Alternatively, to use the dashboard editor:

1. Run `npm --prefix workers run build`.
2. Replace the Worker code with the bundled `workers/dist/r2-upload-worker.js`,
   not the source file importing `aws4fetch`, and deploy.
3. Add a Cron Trigger `0 3 * * *` in the Worker's settings.

Deploy the updated admin as well. Its Worker requests now carry the Supabase
session. Worker CORS allows `Authorization`; bucket CORS still only needs
`Content-Type` for the signed PUT.

## Verification

Replace or remove a test mix in the admin and Publish. The old object should
disappear from `tracks/`; the new published MP3 must remain playable. Do not
expect deletion while the editor changes are still unpublished.

Database errors stop cleanup before deletion. A cleanup failure is displayed
separately from a successful content publication; the daily job retries stale
unreferenced objects. Tests use a local in-memory bucket and Supabase responses;
they do not prove the production credentials or deployment configuration.

Cleanup prevents obsolete mixes accumulating, but it is not a hard 10 GB quota:
eight very large MP3s, other media folders, or temporary uploads can still use
more than 10 GB. R2's free allowance is not a blocking storage limit.