# B-Side Admin - Architecture definitive

Ce repository est maintenant organise autour d un admin React connecte directement a Supabase.

## Stack

- React 18 + Vite
- Supabase (Auth, Postgres, Storage)
- GitHub Actions + SFTP OVH

## Structure

- `apps/admin/` : application admin React (source principal)
- `.github/workflows/deploy.yml` : build + deploy OVH
- `supabase/` : schema SQL, migrations et seeds
- `assets/` : assets historiques du site public
- `config/` : configs PHP historiques (conservees temporairement)

## Lancer l admin en local

```bash
npm run admin:install
cp apps/admin/.env.example apps/admin/.env
# Renseigner:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
npm run dev
```

## Build production

```bash
npm run admin:ci
npm run build
npm run preview
```

## Variables d environnement

Dans `apps/admin/.env` (local) et dans GitHub Secrets (CI):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_MEDIA_BUCKET` (optionnel, defaut: `admin-media`)

Important:
- ne jamais exposer une `service_role_key` dans le frontend
- `.env` et `node_modules` restent ignores par git

## CI/CD OVH

Le workflow deploye seulement le build admin:

- branche `dev` -> `www/dev/frontend/admin/`
- branche `main` -> `www/frontend/admin/`

Pipeline:

1. build de `apps/admin`
2. test de connexion SFTP
3. preflight ecriture/suppression sur le dossier distant
4. mirror du dossier `apps/admin/dist/`
5. smoke test URL

## Supabase

Appliquer le schema et migrations du dossier `supabase/`.

En particulier:
- `supabase/schema.sql`
- `supabase/admin-content-migration.sql`

## Statut PHP legacy

Les fichiers PHP historiques sont encore presents dans le repo a titre de reference technique, mais l architecture cible de l admin est React + Supabase.
