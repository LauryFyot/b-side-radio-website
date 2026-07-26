# Admin React

Ce dossier contient la version React-only de la page admin, connectee directement a Supabase (sans serveur PHP local).

## Lancer en local

Depuis la racine du repo, tu peux lancer sans te placer dans ce dossier:

```bash
npm run admin:install
npm run dev
```

Sinon en mode direct:

```bash
cd apps/admin
npm install
cp .env.example .env
# remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm run dev
```

Connexion:
- utilise un compte Supabase Auth (email/password)
- ce compte doit avoir les permissions RLS pour modifier les tables admin
- le bucket Storage `admin-media` doit exister et autoriser les uploads pour les users `authenticated`

## Build production

```bash
npm run build
npm run preview
```

## Note

Le bouton `Publish` envoie toutes les modifications directement a Supabase.
Ne jamais exposer une `service_role_key` dans ce frontend.

Les uploads de covers, covers vinyl et MP3 passent par Supabase Storage dans le bucket `admin-media`, puis l'URL publique est sauvegardee dans la table concernnee.

```mermaid
flowchart TD
  U[User / Browser] --> R[React Admin\nlocalhost:5173]

  R --> H1[useAdminAuth\nsession + login/logout]
  R --> H2[useAdminEditor\nload draft + publish]
  R --> C[UI Components\nSidebar / Header / Tabs / Sections]

  H1 --> S[(Supabase Auth)]
  H2 --> R1[adminRepository\nfetchBootstrapData / publishAdminData]
  R1 --> DB[(Supabase Tables)]

  DB --> T1[shows]
  DB --> T2[show_slots]
  DB --> T3[featured_covers]
  DB --> T4[favorite_tracks]
  DB --> T5[featured_videos]
  DB --> T6[comments]

  R --> L[Local .env\nSUPABASE_URL + ANON_KEY]
```