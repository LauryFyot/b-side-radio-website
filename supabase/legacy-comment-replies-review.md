# Rattachement des anciennes reponses : propositions a valider

Analyse des exports `comments_rows.csv` et `profiles_rows.csv` fournis le 25 octobre 2026.
Aucune modification de base effectuee. Ce document ne constitue pas une migration SQL.
Les emails, IP, user-agents et autres donnees techniques ne sont pas repris ici.

## Associations validees et execution

Les 25 reponses identifiees ont ete retenues. Quand plusieurs parents etaient
proposes, le parent le plus recent a ete choisi : **70 -> 68**, **88 -> 87**,
**98 -> 97**, **126 -> 124**, **128 -> 120**. Le message 84 reste exclu.
L'auteur confirme est `c16e2d8e-28f1-467f-9adf-b293650ef59c`, nom public
`EDDY BSIDE RADIO`.

Le script `supabase/import-legacy-eddy-replies.sql` est pret pour le SQL Editor
Supabase, avec les droits administrateur de base de donnees. Il ne faut pas
l'executer depuis le frontend ni avec le role `anon`/`authenticated`.
Exporter `comments` et `comment_replies` avant execution pour conserver une sauvegarde.

Executer le script entier. Il cree les reponses avec les textes et dates des
commentaires sources, puis passe seulement ces anciens commentaires en `removed`.
Les lignes sources ne sont pas effacees. `updated_at` de chaque reponse est initialise
a sa date de creation historique pour ne pas afficher une fausse mention de modification.
Le resultat liste les 25 correspondances et les nouveaux identifiants.

Le trigger normal est temporairement desactive dans une transaction verrouillee,
puis reactive avant validation. Toute erreur annule les insertions et les changements
de statut ; si le SQL Editor laisse la transaction en erreur, executer `ROLLBACK;`.
Une nouvelle execution sans changements ne cree pas de doublons.

Si le script signale un ancien commentaire qui possede deja des reponses (par exemple
un essai sur le commentaire 133), ne pas contourner le controle : exporter les lignes
concernees de `comment_replies` pour decider de leur destination. Aucun nouvel export
n'est indispensable pour preparer le script, car ces conflits sont verifies en base
au moment de l'execution.

Les propositions ci-dessous sont conservees comme historique de la revue initiale.

## Auteur propose

- Nom public : **EDDY BSIDE RADIO**.
- Profil : `c16e2d8e-28f1-467f-9adf-b293650ef59c`.
- Variantes presentes dans les commentaires : `Byeddy`, `ByEddy@B.side radio`,
  `Eddy b side radio`, `eddy B side radio`, `Eddy B side radio`, `EDDY BSIDE RADIO`.
- Attribution de ces anciens pseudos a ce profil a confirmer avant execution.
- Le profil MIZANY ne sera pas utilise pour signer les reponses d'Eddy.

## Bilan

- 121 commentaires dans l'export.
- 28 messages sous les variantes du nom d'Eddy.
- 20 rapprochements proposes avec confiance elevee, a valider malgre tout.
- 6 cas demandant une decision explicite.
- 2 annonces a laisser comme commentaires autonomes.

## 20 rapprochements proposes

La fleche signifie : **ancien commentaire de reponse -> commentaire auquel il repond**.
Les textes complets et leurs dates restent dans le CSV d'origine.

| Ancienne reponse | Parent propose | Auteur du parent | Indices |
| --- | --- | --- | --- |
| 23 | 22 | Sach | « Oui et donna summer qui arrive », une minute apres le souvenir de l'Echappatoire. |
| 25 | 24 | Lan 92 | Explication pour obtenir les titres, apres la demande des titres diffuses. |
| 27 | 26 | Lan 92 | Identification de Beverlei Brown pour la demande du titre de 19h15. |
| 29 | 28 | Lan 92 | « la tracklist de ce soir, je te l'envoie sur fb », apres la demande de tracklist. |
| 31 | 30 | Lan 92 | Confirmation des mix du samedi, apres la question sur l'absence d'annonce. |
| 36 | 35 | Lan 92 | « les mysteres de l'informatique... c'est reparti », trois minutes apres le signalement des jingles en boucle. |
| 43 | 42 | Lan 92 | Preparation de playlists funkyhouse, apres la demande de davantage de mix funkhouse. |
| 46 | 45 | Chouchou | « Hello chouchou », meme sujet : hommage a Paul Johnson. |
| 69 | 63 | Bertrand paris 8 | Mention du magasin et des ventes, en reponse au message du commercant. |
| 71 | 65 | Louisa | « @louisa », remerciement et ecoute jusqu'au bout de la nuit. |
| 72 | 66 | Lan 92 | « @Lan du 92 », reponse explicite a l'absence de jingles. |
| 78 | 77 | Arnaud | Remerciement pour le funky mix de l'apres-midi, meme jour. |
| 80 | 79 | MAXENCE | Identification de « AN:RO - street life » pour la question sur ce remix. |
| 101 | 100 | Arnaud | Explication sur les titres introuvables par Shazam et proposition des playlists. |
| 110 | 109 | Florence | Remerciement pour le retour sur la soiree a danser et invitation a raconter ses soirees. |
| 111 | 108 | Did | « @ Did », identification de DJ Le Cyr sur le creneau remercie. |
| 117 | 116 | Did | « Salut Did, merci pour ton suivi », lendemain du message sur les annees d'ecoute. |
| 127 | 123 | fabrice p | « @fabrice p », explication sur l'affichage du nom des DJs. Le message 134 est posterieur a cette reponse. |
| 132 | 130 | anna | Reponse precise sur Fedde Le Grand et « What I want ». Le message 131 parle d'achats Traxsource, pas de ce titre. |
| 133 | 129 | Alfonso | « @ Alfonso », proposition de playlist pour le premier mix demande. |

## 6 decisions necessaires

### Reponse 70 : plusieurs messages d'Arnaud

> « @ Arnaud... les Rolling Stones en rmx... ce mix passe 2 fois... »

- **68** : « On dirait que ce mix est deja passe » : parent recommande pour la partie bug/repetition.
- **64** : demande du remix des Stones et ou le trouver.
- **67** : autre message sur un remix des Stones.
- Proposition : rattacher uniquement a **68**, en gardant le texte complet. A confirmer.

### Message 84 : reponse ou commentaire autonome ?

> « C'est unique et c'est sur b side radio ... »

- **83**, de Did, deux minutes avant : remercie la radio pour les bons moments.
- Le rapprochement chronologique est plausible, mais le texte peut aussi etre une annonce.
- Choisir : rattacher a **83** ou conserver comme commentaire autonome.

### Reponse 88 : deux destinataires

> « Merci Kevin & Alain pour votre soutien... »

- **86**, Alain : remercie pour la musique.
- **87**, kevin : felicite pour les remix, cinq minutes apres Alain.
- Aucune raison de choisir arbitrairement un seul parent.
- Choisir : une reponse identique sous chacun, un seul parent a designer,
  ou conservation du message collectif autonome. Aucun dedoublement automatique.

### Reponse 98 : deux demandes d'Alain

> « Salut Alain... Pour les playlists, passe en mp sur le mail de la radio... »

- **96** : demande de liste des titres du mix de 19h.
- **97** : ajoute les demandes pour 20h et 21h.
- Proposition : rattacher a **96**, la demande initiale ; **97** reste un commentaire autonome.
- Autre choix possible : rattacher a **97**, son dernier message. A confirmer.

### Reponse 126 : deux messages de Flo

> « @FLO : Merci pour ton message. toujours aussi presente... »

- **124** : felicite le nouveau site, les titres affiches et l'ecoute en teletravail : parent recommande.
- **122** : felicite l'affichage des noms de remix et cite Celeda.
- Le texte de la reponse est trop general pour trancher avec certitude.
- Proposition : rattacher a **124**. A confirmer.

### Reponse 128 : deux messages successifs de Lan 92

> « @ Lan 92 : Fidele au poste !! ... depuis tant d'annees... »

- **119** : annonce son retour sur la radio et demande s'il y aura des mix samedi : parent recommande pour le retour/fidelite.
- **120** : ajoute une appreciation sur les versions maxi, dix minutes plus tard.
- Proposition : rattacher a **119**. A confirmer.

## Messages d'Eddy a conserver autonomes

- **105** : annonce de reprise de la radio, nouvelles rotations et horaires des mix.
- **106** : invitation generale a l'auditeur de Lille, sans commentaire parent identifiable dans l'export.

## Autres membres de l'equipe

L'export contient aussi des reponses de DJ Bart, notamment **55 -> 54**, **59 -> 58**,
**62 -> 61**, **76 -> 75** et **82 -> 81**. Aucun profil Bart ne figure dans l'export
des profils fourni. Ne pas attribuer ces messages a Eddy ou MIZANY.
Ils ne font pas partie de la migration proposee pour Eddy.

## Regles pour le futur script, apres validation

1. Verifier le profil, chaque identifiant, le texte et les dates attendus avant d'ecrire.
2. Conserver le texte et la date de creation de chaque ancienne reponse.
3. Creer une ligne dans `comment_replies` sans modifier les commentaires parents.
4. Masquer ensuite l'ancien commentaire de reponse avec `status = 'removed'`, sans le supprimer.
5. Conserver ses likes et ses autres donnees sur l'ancien commentaire ; les reponses n'ont pas de likes.
6. Refuser tout conflit si Eddy possede deja une reponse sur le parent vise ; ne pas l'ecraser.
    Refuser aussi le masquage d'un ancien commentaire qui possede deja des reponses,
    pour ne pas rendre ces reponses invisibles sans decision explicite.
7. Utiliser une transaction et un mecanisme qui ne duplique pas les reponses si le script est relance.
8. Fournir une possibilite de retour arriere pour les seules lignes migrees.

Le trigger `guard_comment_reply` impose l'identite connectee et la date courante.
Le script d'import devra donc traiter explicitement ce cas administratif pour
preserver les dates historiques, sans ouvrir les droits d'ecriture au public.

L'export actuel ne contient pas `comment_replies`. Un export de cette table
permettra de verifier les conflits avant de preparer la migration definitive.
Colonnes suffisantes : `id`, `comment_id`, `author_id`, `author_name`, `body`,
`created_at`, `updated_at`.

Les deux CSV d'origine contiennent des donnees personnelles : ne pas les committer
ni les inclure dans une MR publique.