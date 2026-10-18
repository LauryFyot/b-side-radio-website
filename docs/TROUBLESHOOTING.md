# Depannage

Commencer par l'URL ouverte, le projet deploye, le statut HTTP et l'onglet Network.
Un build local reussi ne prouve ni le deploiement distant ni ses variables.
Ne pas coller de token ou mot de passe dans une capture/log partage.

| Symptome | Controle utile |
| --- | --- |
| `ERR_CONNECTION_REFUSED` localhost en boucle | Vite s'est arrete ; verifier le port et relancer le bon projet |
| Titre radio different | Comparer les fournisseurs : site Legacy par defaut, admin chemins Legacy |
| `Mixed Content` | Requete HTTP directe depuis HTTPS ; utiliser le proxy du projet concerne |
| Upload refuse pour taille maximale Supabase | Verifier `VITE_R2_UPLOAD_URL` dans le build admin distant puis redeployer |
| Worker CORS refuse Authorization | Deploy de l'ancien code ou origine/header absent ; tester OPTIONS |
| R2 PUT 403 affiche comme CORS | Lire aussi le XML via un test cible : signature, permissions ou vrai CORS |
| `No such module aws4fetch` | Source colle dans dashboard ; deployer le bundle compile |
| `createSignedUrl is not a function` | Mauvaise API : ce n'est pas une methode native du binding R2 |
| Team/Banner unavailable | Migration absente ou lecture DB refusee ; verifier table et RLS |
| Photos historiques cassees | Anciennes URL relatives/hashes de build ; utiliser une URL valide ou un upload R2 |
| Publish grise malgre edition Team | Verifier `teamMembers` dans les dependances du snapshot et le payload |
| Contenu publie mais cleanup failed | DB deja modifiee ; verifier Worker, CORS et acces Supabase avant toute suppression |
| Removed encore visible | Requete publique doit contenir `status=eq.approved` ; recharger/deployer le bon bundle |
| Direct ne demarre pas automatiquement | Restriction navigateur autoplay ; tester apres geste utilisateur |

## Ports locaux

```sh
lsof -nP -iTCP:5173 -sTCP:LISTEN
lsof -nP -iTCP:5174 -sTCP:LISTEN
```

Ne pas tuer un processus sans identifier son application. Un autre serveur Vite
peut occuper le port, ce qui explique pourquoi l'admin apparait a l'URL attendue du site.

## Radio via proxy HTTPS

```sh
curl -i --max-time 20 'https://b-side-radio.com/api/radio/legacy/status-json.xsl?mount=/stream'
```

Verifier `200`, type JSON et titre. Le JSON Icecast peut etre mal forme : le parseur
partage accepte certains formats legacy. Un titre identique dans plusieurs requetes
peut etre ce que la source diffuse ; ne pas conclure automatiquement a un cache client.

## Preflight Worker sans upload

```sh
curl -i -X OPTIONS 'https://bsidemediaworker.sefidpoubelle1.workers.dev' \
  -H 'Origin: https://admin.b-side-radio.com' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: authorization,content-type'
```

Attendre l'origine autorisee et `Content-Type, Authorization`. Une reponse OPTIONS
correcte ne prouve pas que le POST authentifie ou le PUT signe reussira.
La liste CORS du Worker et celle du bucket sont independantes.

Les signatures `aws4fetch` ne doivent pas utiliser `singleEncode: true` avec le
chemin actuel encode : cela produisait une signature incoherente pour les accents.
Les tests Worker comparent la signature complete, pas seulement la forme de l'URL.

## Validation sans deploiement

```sh
npm run site:build
npm run admin:build
npm --prefix workers test
npm --prefix workers run build
```

Les tests Worker sont locaux et ne verifient pas les secrets distants. Pour un
test bout en bout, utiliser un fichier explicitement choisi et publier uniquement
des donnees de test dont la suppression est autorisee. Ne pas appeler reconcile
sur un bucket de production pour simplement verifier qu'une route existe.