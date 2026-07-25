# B-Side Radio Website

Site vitrine B-Side Radio (PHP + HTML/CSS/JS), avec une approche simple:

- `main` = production
- `dev` = preproduction (deploy dans `www/dev`)

## Stack

- PHP (page principale + gestion commentaires)
- CSS
- JavaScript
- PHPMailer (notification email)

## Structure du projet

- `index.php` : page principale + logique commentaire/email
- `comments.txt` : stockage des commentaires affiches
- `comments-handler.php` : script annexe de gestion commentaires
- `style.css` : styles principaux
- `JAVASCRIPT/app.js` : scripts front
- `IMAGES/` : assets
- `PHPMailer/` : librairie mail

## Run local (dev)

Le site est servi en local a la racine du projet:

1. Installer PHP (macOS):
   ```bash
   brew install php
   ```
2. Lancer le serveur local depuis la racine:
   ```bash
   php -S localhost:8000
   ```
3. Ouvrir:
   - `http://localhost:8000`

Note: en local, tu n utilises pas `/dev`. Le chemin `/dev` est reserve a l hebergement OVH.

## Environnements

- Prod OVH: `www`
- Dev OVH: `www/dev`

URLs attendues:

- Prod: `https://ton-domaine.tld/`
- Dev: `https://ton-domaine.tld/dev/`

## Workflow Git recommande

1. Travailler sur `dev`
2. Tester sur la version dev OVH
3. Merge `dev` -> `main` quand c est valide
4. Deployer en prod

Exemple:

```bash
git checkout dev
git pull
git add .
git commit -m "feat: ..."
git push origin dev
```

Puis:

```bash
git checkout main
git pull
git merge dev
git push origin main
```

Checklist rapide avant merge `dev` -> `main`:

1. Le workflow GitHub Actions sur `dev` est vert
2. `https://b-side-radio.com/dev/index.php` repond correctement
3. Les commentaires s affichent et l envoi email fonctionne
4. Aucune credentielle n est committee

## CI/CD (GitHub Actions)

Objectif:

- push sur `dev` => sync SFTP vers `www/dev`
- push sur `main` => sync SFTP vers `www`

Secrets GitHub a definir dans le repo:

- `OVH_HOST`
- `OVH_USERNAME`
- `OVH_PASSWORD`

Le workflow est disponible dans `.github/workflows/deploy.yml`.

Le workflow actuel inclut aussi un smoke test HTTP post-deploiement:

- `dev` teste `https://b-side-radio.com/dev/index.php`
- `main` teste `https://b-side-radio.com/index.php`

## Important securite

Les secrets SMTP ne doivent jamais etre stockes dans le repo.

Le projet charge des secrets SMTP via:

1. Variables d environnement (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`, `SMTP_TO_EMAIL`)
2. Ou un fichier local `smtp-config.php` non versionne

Mise en place locale/OVH:

1. Copier `smtp-config.example.php` en `smtp-config.php`
2. Remplir avec tes vraies valeurs SMTP
3. Verifier que `smtp-config.php` est bien ignore par git

Important:

1. Si un ancien mot de passe SMTP a deja ete committe, il faut le regenerer immediatement
2. Ne jamais partager les captures avec des secrets visibles

## Supabase contenu admin

Le site peut maintenant piloter ces blocs depuis Supabase:

1. Horaires des emissions
2. Vignettes des emissions
3. Pochettes "titres majeurs" (This week)
4. MP3 des titres preferes
5. 3 videos YouTube mises en avant

Si ton projet Supabase existe deja, execute aussi:

```bash
supabase/admin-content-migration.sql
```

Ce script ajoute les tables de contenu manquantes pour l admin.

## Admin local (toi + ton pere)

Une page admin est disponible sur:

- `/admin.php`

Configuration:

1. Copier `admin-config.example.php` vers `admin-config.php`
2. Generer un hash de mot de passe PHP:
   ```bash
   php -r "echo password_hash('TON_MDP', PASSWORD_DEFAULT), PHP_EOL;"
   ```
3. Remplacer les `password_hash` dans `admin-config.php`
4. Ajouter `service_role_key` dans `supabase-config.php`

Exemple minimal `supabase-config.php`:

```php
<?php
return array(
   'url' => 'https://xxxx.supabase.co',
   'anon_key' => 'ey...public',
   'service_role_key' => 'ey...service_role'
);
```

Important:

1. `service_role_key` ne doit jamais etre committe
2. Restreindre l acces HTTP a `admin.php` (mot de passe fort + HTTPS)

## Roadmap courte

- [x] Ajouter workflow GitHub Actions deploy dev/prod
- [x] Externaliser les secrets mail
- [ ] Ajouter un anti-spam plus robuste
- [ ] Nettoyer les chemins d assets restants si besoin
