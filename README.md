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

## CI/CD (GitHub Actions)

Objectif:

- push sur `dev` => sync SFTP vers `www/dev`
- push sur `main` => sync SFTP vers `www`

Secrets GitHub a definir dans le repo:

- `OVH_HOST`
- `OVH_USERNAME`
- `OVH_PASSWORD`

Le workflow `.github/workflows/deploy.yml` peut etre ajoute ensuite.

## Important securite

Des identifiants SMTP sont actuellement presents en dur dans `index.php`.

A faire en priorite:

1. Regenerer/changer le mot de passe SMTP
2. Sortir les secrets du code
3. Utiliser des variables d environnement/secrets cote serveur

## Roadmap courte

- [ ] Ajouter workflow GitHub Actions deploy dev/prod
- [ ] Externaliser les secrets mail
- [ ] Ajouter un anti-spam plus robuste
- [ ] Nettoyer les chemins d assets restants si besoin
