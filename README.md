# B-Side Monorepo - Site + Admin

Ce repository est organise autour de 2 apps React distinctes:

- site public principal: `apps/site`
- admin: `apps/admin` (accessible via `/admin` en ligne)

## Stack

- React 18 + Vite
- Supabase (Auth, Postgres, Storage)
- GitHub Actions + SFTP OVH

## Structure

- `apps/site/` : application publique React (import depuis Lovable)
- `apps/admin/` : application admin React (connectee a Supabase)
- `.github/workflows/deploy.yml` : build + deploy OVH
- `supabase/` : schema SQL, migrations et seeds
- `assets/` : assets historiques du site public
- `config/` : configs PHP historiques (conservees temporairement)

## Commandes racine

Par defaut (site principal):

```bash
npm run dev
npm run build
npm run preview
```

Admin:

```bash
npm run admin:install
npm run admin:dev
npm run admin:build
npm run admin:preview
```

Site (apres import):

```bash
npm run site:install
npm run site:dev
npm run site:build
npm run site:preview
```

Build statique OVH (site public):

```bash
npm run site:build:static
```

Cela genere `apps/site/dist-ftp/` (contenu FTP pret a uploader).

## Import de la refonte site (Lovable)

```bash
git checkout -b feat/site-refonte-import
# copier le contenu du repo bside-groove-hub dans apps/site
# ne pas copier .git, node_modules, dist
npm run site:install
npm run site:dev
```

Puis commit d import initial:

```bash
git add apps/site
git commit -m "chore: import lovable site into apps/site"
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

Le deploy du site React sera ajoute apres import et validation de `apps/site`.

### Deploy simple OVH mutualise (sans Node)

1. Build du site public:

```bash
npm run site:build:static
```

2. Build de l admin:

```bash
npm run admin:build
```

3. Uploader sur OVH:
- contenu de `apps/site/dist-ftp/` vers `www/`
- contenu de `apps/admin/dist/` vers `www/admin/`

Le fichier `.htaccess` du site est deja genere dans `dist-ftp/` pour gerer les routes SPA.

## Supabase

Appliquer le schema et migrations du dossier `supabase/`.

En particulier:
- `supabase/schema.sql`
- `supabase/admin-content-migration.sql`

`node --env-file=.env notebooks/test_shared_supabase.mjs`

## Statut PHP legacy

Les fichiers PHP historiques sont encore presents dans le repo a titre de reference technique, mais l architecture cible de l admin est React + Supabase.
