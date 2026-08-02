# B-Side Site

Site public React/Vite, construit pour sortir un build statique simple a deployer sur OVH.

L'objectif de ce dossier est volontairement simple:

1. afficher le site public
2. lire le contenu depuis Supabase quand il est disponible
3. garder un fallback local si Supabase ou l'API radio ne repondent pas
4. sortir un dossier `dist-ftp/` pret a uploader

## Vue d'ensemble

Le site a aujourd'hui une architecture courte:

1. `index.html`
	 point d'entree Vite
2. `src/main.tsx`
	 monte l'application React
3. `src/App.tsx`
	 affiche soit la home, soit l'ecran de redirection `/admin`
4. `src/components/bside/`
	 composants visibles du site
5. `src/lib/`
	 logique transversale simple: contenu, radio, langue, URL admin

## Arborescence utile

### Racine du dossier

- `index.html`
	shell HTML du site
- `vite.config.ts`
	config Vite unique pour le dev et le build
- `public/`
	fichiers copies tels quels dans le build final
- `scripts/build-static.mjs`
	transforme le build Vite en dossier `dist-ftp/` compatible OVH

### Application React

- `src/main.tsx`
	point d'entree React
- `src/App.tsx`
	routeur minimal maison: home ou redirection admin

### Composants visibles

Le site public est surtout pilote par ces fichiers:

- `src/components/bside/top.tsx`
	header, hero, bloc on-air, bloc about
- `src/components/bside/vinyls.tsx`
	section vinyls
- `src/components/bside/programme.tsx`, `src/components/bside/tracks.tsx`, `src/components/bside/sessions.tsx`, `src/components/bside/team.tsx`, `src/components/bside/videos.tsx`, `src/components/bside/comments.tsx`, `src/components/bside/socials-footer.tsx`
	sections du bas (programme, tracks, sessions, equipe, videos, commentaires, footer social)
- `src/components/player/player-context.tsx`
	logique audio du player
- `src/components/player/player-bar.tsx`
	barre player en bas de l'ecran
- `src/components/controls/lang-toggle.tsx` et `src/components/controls/theme-toggle.tsx`
	controles de langue et de theme

### Logique metier

- `src/lib/siteContent.ts`
	coeur du data-flow du site
	charge Supabase + now playing live + fallback
	expose ensuite tout ca aux composants via React context
- `src/lib/bside-data.ts`
	contenu local de secours si la base ou l'API radio ne repondent pas
- `src/lib/radio.ts`
	petit pont type-safe vers les helpers radio partages
- `src/lib/admin-url.ts`
	URL de redirection du bouton `/admin`
- `src/lib/i18n.tsx`
	textes d'interface FR/EN

### Code partage avec l'admin

- `../../shared/supabase/`
	lecture des tables Supabase partagees entre site et admin
- `../../shared/webradio/`
	flux radio + parsing du now playing live

## Data flow du site

Le site lit les donnees dans cet ordre:

1. `shared/supabase/content.js`
	 pour le contenu administre: shows, vinyls, tracks, videos, comments
2. `shared/webradio/content.js`
	 pour le flux live et le titre en cours
3. `src/lib/bside-data.ts`
	 en secours si le live ne repond pas ou si Supabase est vide/non configure

En pratique, `src/lib/siteContent.ts` centralise cette logique pour eviter de dupliquer les fetchs dans chaque composant.

## Ou modifier quoi

### Modifier le contenu visuel de secours

Edite `src/lib/bside-data.ts`.

Exemples:

- fallback du programme
- fallback des vinyls
- fallback des tracks
- equipe
- textes now playing de secours

### Modifier les textes de l'interface FR/EN

Edite `src/lib/i18n.tsx`.

Exemples:

- libelles des boutons
- titres de sections
- textes d'interface commentaires/player/navigation

### Modifier le flux audio ou le now playing live

Edite les helpers partages:

- `../../shared/webradio/content.js`

Le site utilise ensuite ces helpers via:

- `src/lib/radio.ts`

### Modifier la redirection admin

Edite `src/lib/admin-url.ts`.

### Modifier le rendu des sections

Edite directement les composants dans `src/components/bside/`.

## Variables d'environnement

Le site peut fonctionner sans `.env`, mais il passera alors plus souvent sur le fallback local.

Variables utiles:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_URL`

En local, elles peuvent vivre dans `apps/site/.env`.

## Commandes utiles

Depuis la racine du repo:

```bash
npm run site:dev
npm run site:build
npm run site:build:static
npm run site:test:supabase
```

### A quoi elles servent

- `npm run site:dev`
	lance le site en local
- `npm run site:build`
	build Vite standard
- `npm run site:build:static`
	build final pour OVH
- `npm run site:test:supabase`
	teste les requetes Supabase du site en dehors de l'UI

## Build OVH

La commande importante est:

```bash
npm run site:build:static
```

Elle produit:

- `dist-ftp/`

Ce dossier contient ce qu'il faut uploader sur OVH:

- `index.html`
- `assets/`
- `favicon.ico`
- `robots.txt`
- `.htaccess`

Tu dois uploader le contenu de `dist-ftp/` dans `www/`.

## Ce qui peut etre supprime/regenere

- `dist-ftp/`
	supprimable, regenere au build
- `node_modules/`
	reinstallable avec `npm install`

## Ce qu'il faut garder

- `src/`
- `public/`
- `index.html`
- `vite.config.ts`
- `scripts/build-static.mjs`
- `package.json`
- `tsconfig.json`

## Philosophie actuelle

Le site a ete simplifie pour rester proche de l'admin:

1. Vite simple
2. React simple
3. pas de framework de routing complexe
4. un data-flow central pour le contenu
5. build statique simple pour OVH

Si tu cherches ou modifier quelque chose, commence presque toujours par un de ces 4 fichiers:

1. `src/App.tsx`
2. `src/components/bside/top.tsx`
3. `src/components/bside/programme.tsx` (et les autres sections bside du meme dossier)
4. `src/lib/siteContent.ts`
