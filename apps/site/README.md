# B-Side Site

Site public React/Vite, buildable en statique pour OVH.

## Fichiers importants

- `index.html`
	point d'entree Vite
- `src/main.tsx`
	monte l'application React
- `src/App.tsx`
	choisit entre la home et la redirection `/admin`
- `src/components/bside/`
	vrais composants du site public
- `src/lib/bside-data.ts`
	fallback local du contenu si Supabase ou l'API radio ne repondent pas
- `src/lib/siteContent.ts`
	charge le contenu du site et l'expose a tous les composants
- `src/lib/radio.ts`
	petit pont type-safe vers le module partage du flux radio
- `vite.config.ts`
	config Vite unique pour dev et build
- `src/lib/i18n.tsx`
	textes de l'interface FR/EN
- `public/`
	fichiers copies tels quels dans le build (`favicon.ico`, `robots.txt`)

## Dossiers a ignorer la plupart du temps

- `dist-ftp/`
	resultat du build statique, a uploader sur OVH
- `node_modules/`
	dependances locales

## Sources de donnees

Le site peut lire 3 sources:

1. `src/lib/bside-data.ts`
	 fallback local
2. `shared/supabase/`
	 contenu edite dans l'admin: shows, vinyls, tracks, videos, comments
3. `shared/webradio/`
	 flux audio + now playing live

## Commandes utiles

Depuis la racine du repo:

```bash
npm run site:dev
npm run site:build:static
npm run site:test:supabase
```

## Build OVH

`npm run site:build:static` produit `dist-ftp/`.

Le contenu de `dist-ftp/` est celui a uploader dans `www/` sur OVH.
