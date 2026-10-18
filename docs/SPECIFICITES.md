# Specificites fonctionnelles

## Radio Legacy et AzuraCast

Le site choisit `legacy` par defaut dans [content.js](../shared/webradio/content.js).
`VITE_RADIO_PROVIDER=azuracast` selectionne l'autre fournisseur au build du site.
Flux et now-playing doivent venir du meme fournisseur pour correspondre.

| Fournisseur | Serveur upstream | Route navigateur |
| --- | --- | --- |
| Legacy | `http://91.134.242.174:8000` | `/api/radio/legacy/stream` et `/status-json.xsl?mount=/stream` sous ce prefixe |
| AzuraCast | `http://51.91.124.240` | `/api/radio/azuracast/listen/bside_radio/radio.mp3` et `/api/nowplaying` sous ce prefixe |

Vite et Vercel proxient les requetes : le navigateur n'appelle pas directement
l'upstream HTTP depuis une page HTTPS. Les rewrites ne s'installent pas sur OVH statique.
L'admin utilise actuellement les routes Legacy ; `VITE_RADIO_API_BASE_URL` change
leur base, pas le fournisseur. Basculer le site seul sur AzuraCast ne bascule pas l'admin.

Le JSON Legacy peut etre mal forme. Le parseur partage repare certains cas connus
(virgule finale/accolades manquantes), retire les prefixes techniques de metadonnees
et nettoie le suffixe `no_cover_image` pris en charge.
Site et admin interrogent les metadonnees toutes les 20 secondes, pas a la milliseconde.
L'indicateur admin `Live now` repose actuellement sur `hasLiveTrack` : il ne prouve
pas la presence d'un DJ en direct plutot que l'AutoDJ.

## Player

Le site tente l'autoplay puis attend un geste utilisateur si le navigateur le refuse.
Le demarrage sonore automatique n'est pas garanti sur Safari/iOS ou Chrome.
La lecture d'un mix doit arreter le live ; tester aussi le retour vers le direct.
Le player fixe occupe une reserve dans le hero, pas une deuxieme section dans le flux.

## Hero et defilement

Le hero et la navigation remplissent le premier ecran. La hauteur du player fixe
est mesuree et reservee en padding bas : le bandeau ne passe pas dessous au chargement.
Les raccords arrondis sont des pseudo-elements CSS, pas les masques SVG experimentaux.
Le motif pointille couvre l'image et le bandeau. `--hero-image-opacity` regle le voile.

Le fond fixe est reserve a desktop avec hover, pour eviter les problemes WebKit.
L'accroche `scroll-snap` est desktop uniquement et desactivee en mouvement reduit.
Le bandeau mesure un cycle et le repete suffisamment, puis duplique deux groupes
identiques ; une liste vide le masque.

## Equipe et contenus

- Equipe : maximum 8 en admin et DB ; nom et portrait requis pour publier.
- Desktop/tablette : une ligne, ratio photo 4/5, cartes plafonnees a 320 px et centrees.
- Mobile : accordeon de portraits ; les textes FR/EN viennent de Supabase.
- About et la section equipe utilisent le meme nombre de membres.
- Les portraits initiaux en DB pointent vers les assets hashes Vercel. Si ces images
  locales changent ou disparaissent d'un prochain build, ces URL peuvent casser ;
  remplacer les portraits par des uploads R2 pour les rendre independants du bundle.
- Le site recharge les contenus editoriaux a l'ouverture : apres Publish, recharger
  la page publique. Le rafraichissement radio ne recharge pas toute la DB.

## Langues

Les textes d'interface sont dans [i18n.tsx](../apps/site/src/lib/i18n.tsx).
Bandeau et equipe ont des champs FR/EN en DB. Emissions et plusieurs contenus
historiques n'ont pas tous une traduction distincte : leur texte peut etre identique.
La langue choisie est conservee dans le stockage local du navigateur.

## Analytics et consentement

[index.html](../apps/site/index.html) charge GA4 `G-3SNWYSPZ5Z` seulement en HTTPS
sur `b-side-radio.com` ou `www.b-side-radio.com`, hors `/admin` et `/dev`.
Les URLs Vercel et localhost sont exclues. L'admin a un autre HTML sans cette balise.

**Le consentement n'est pas branche dans le code inspecte.** La condition de domaine
ne remplace pas l'acceptation : Analytics demarre actuellement automatiquement sur
ces domaines. Brancher le chargement apres acceptation ou le desactiver avant lancement.
Examiner aussi les embeds YouTube et les autres services tiers dans la politique
de confidentialite et la gestion du consentement ; la balise GA n'est pas le seul tiers.