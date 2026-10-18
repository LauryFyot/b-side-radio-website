# Documentation B-Side Radio

Etat du code inspecte le 11 octobre 2026. Les parametres des dashboards et les
deploiements distants ne sont pas automatiquement verifies par cette documentation.

| Guide | Contenu |
| --- | --- |
| [DB_AND_STORAGE.md](DB_AND_STORAGE.md) | Supabase, permissions, fichiers R2 et cycle de suppression |
| [REACT_ARCHI.md](REACT_ARCHI.md) | Applications React, modules partages et flux de donnees |
| [SPECIFICITES.md](SPECIFICITES.md) | Radio, player, hero, langues, equipe, bandeau et Analytics |
| [HOW_TO_DEPLOY.md](HOW_TO_DEPLOY.md) | Publier du contenu, livrer du code, migrer la DB et deployer le Worker |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Diagnostic des erreurs courantes et controles non destructifs |
| [ARCHITECTURE_ET_DEPLOIEMENT.md](ARCHITECTURE_ET_DEPLOIEMENT.md) | Guide existant des domaines, DNS et infrastructure |

## Architecture cible

- Site public : projet Vercel avec racine `apps/site`, domaine `b-side-radio.com`.
- Admin : projet Vercel avec racine `apps/admin`, domaine cible `admin.b-side-radio.com`.
- Contenu et comptes : Supabase PostgreSQL et Auth.
- Medias nouvellement importes : Cloudflare R2 via un Worker authentifie.
- Radio : serveur Icecast Legacy, accessible aux navigateurs via proxy HTTPS.
- OVH : gestion du domaine/DNS ; ancien hebergement et workflow SFTP conserves.

## Trois publications differentes

1. **Contenu** : le bouton admin `Publish changes` ecrit dans Supabase, sans commit.
2. **Code** : push/merge Git puis build Vercel, sans migration SQL automatique.
3. **Worker** : deploiement Cloudflare distinct des deux projets Vercel.

Les previews peuvent lire et modifier la meme base et le meme bucket que la
production si leurs variables sont identiques. Une URL preview n'isole pas les donnees.

## Avant une livraison

Verifier les variables des deux projets Vercel, les migrations necessaires, les
origines CORS, la lecture radio HTTPS et le consentement Analytics. Conserver une
sauvegarde de la base avant une migration destructive. Ne jamais publier un secret
dans Git ou dans une variable `VITE_*`.