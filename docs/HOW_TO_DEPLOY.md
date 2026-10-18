# Livrer une mise a jour

## Choisir le type de changement

| Changement | Action |
| --- | --- |
| Mix, commentaire, photo, texte equipe ou bandeau | Admin, puis Publish changes |
| Composant React, CSS, traduction statique | Build et deploiement Vercel du projet concerne |
| Nouvelle table/fonction/politique | Migration Supabase explicite, puis code compatible |
| Signature ou nettoyage R2 | Deploiement Worker Cloudflare distinct |
| Variable `VITE_*` | Changement dans Vercel, puis nouveau build/deploiement |

## Vercel : deux projets

Verifier dans chaque dashboard le depot Git, Production Branch (`main`), Root
Directory et acces aux fichiers partages hors racine. Les reglages dashboard ne
sont pas tous dans Git. Les deux projets doivent pouvoir compiler `shared/` et les assets partages.

| Projet | Racine | Build | Output |
| --- | --- | --- | --- |
| Site | `apps/site` | `npm run build` | `dist` |
| Admin | `apps/admin` | `npm run build` | `dist` |

Le domaine production du site est `b-side-radio.com`. L'admin cible
`admin.b-side-radio.com`. Verifier certificat, association au bon projet et DNS
indiques par Vercel ; ne pas recopier une ancienne IP DNS sans verifier le dashboard.
Conserver les entrees de messagerie OVH.

### Variables site

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` : URL et cle publique.
- `VITE_ADMIN_URL=https://admin.b-side-radio.com` : redirection `/admin`.
- `VITE_RADIO_PROVIDER=legacy` ou absent : radio actuelle ; `azuracast` seulement pour un basculement explicite.

### Variables admin

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` : URL et cle publique.
- `VITE_R2_UPLOAD_URL=https://bsidemediaworker.sefidpoubelle1.workers.dev`.
- `VITE_SUPABASE_MEDIA_BUCKET` : optionnel, `admin-media` par defaut pour le fallback.
- `VITE_RADIO_API_BASE_URL` : normalement absent sur Vercel, pour utiliser son proxy
  `/api/radio/legacy`. Une ancienne valeur AzuraCast ne correspond plus aux chemins actuels.

Configurer Preview ET Production selon les besoins. Les `.env` locaux ne sont pas
transferes automatiquement. Toutes les valeurs `VITE_*` sont publiques dans le build.

## Validation locale

Depuis la racine du depot :

```sh
npm ci
npm run site:ci
npm run admin:ci
npm run site:build
npm run admin:build
git diff --check
```

Serveurs locaux, dans deux terminaux :

```sh
npm --prefix apps/site run dev -- --port 5174 --strictPort
npm --prefix apps/admin run dev -- --port 5173 --strictPort
```

Les ports ne definissent pas l'application : verifier la commande qui les a lances.
Le fallback de redirection admin en developpement utilise `localhost:5173`.

## Parcours Git

1. Verifier `git status` et travailler sur `preview`.
2. Ajouter uniquement les fichiers souhaites, puis commit et push `origin preview`.
3. Attendre les deploiements Ready des deux projets concernes.
4. Tester leurs URLs preview, sans ecrire des donnees factices dans la DB production.
5. Ouvrir une PR `preview` vers `main`, relire le diff et merger.
6. Verifier les deploiements production et les domaines publics.

Un push preview ne met pas a jour les domaines production si Production Branch est main.
Un merge ne garantit pas la publication : verifier les logs et l'etat Ready.
Ne pas confondre `dist` suivi dans Git avec le bundle effectivement reconstruit par Vercel.

## Supabase

Sauvegarder avant toute operation destructive. Appliquer seulement les migrations
necessaires, controlees et compatibles avec le code deja en ligne. Une migration
SQL n'est pas automatiquement executee par Vercel ou par le workflow SFTP.
Verifier droits anonymes, roles admin, compte equipe et preservation des contenus.
Rollback du code ne restaure pas les donnees Supabase.

## Worker Cloudflare

Verifier ses variables/secrets selon [DB_AND_STORAGE.md](DB_AND_STORAGE.md), le
binding `BSIDE_MEDIA -> bside-media`, les origines admin et le CORS du bucket.

```sh
npm --prefix workers ci
npm --prefix workers test
npm --prefix workers run build
npm --prefix workers run deploy
```

La derniere commande deploye reellement et exige une authentification Cloudflare.
Pour l'editeur dashboard, utiliser le **bundle** `workers/dist/r2-upload-worker.js`,
pas le source qui importe `aws4fetch`. Le dry-run build ne deploie rien.
Verifier le cron `0 3 * * *` si le deploiement se fait depuis le dashboard.

## Controles production

- Home HTTPS valide, redirection www et `/admin` correcte.
- Lecture live Legacy et titre actuel dans le site et l'admin.
- Commentaires approuves visibles, removed invisibles, ecriture/likes fonctionnels.
- Equipe/bandeau : modification, publication, recharge publique FR/EN.
- Upload R2 de test autorise : lecture puis suppression/remplacement apres Publish.
- Mobile Safari : image hero visible, audio apres geste, navigation et defilement.
- Analytics : absent des previews et bloque avant consentement en production.

Garder un precedent deploiement Vercel pour rollback. Le rollback ne restaure pas
les fichiers supprimes R2 ni les edits admin : ils necessitent leurs propres sauvegardes.

## Ancienne CI OVH

Dans [deploy.yml](../.github/workflows/deploy.yml), `main` est commente, **dev reste actif**.
Un push sur dev peut encore envoyer des fichiers sur OVH. Le workflow utilise
`mirror --delete`, et les smoke tests historiques contournent TLS avec `--insecure`.
Ce pipeline n'est pas le chemin de production Vercel. Ne pas le reactiver sans
revoir les sauvegardes, dossiers exclus et proxies radio de l'hebergement statique.