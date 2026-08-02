// Post-traitement du build statique pour produire ./dist-ftp pret pour OVH.
import { access, cp, rename, rm, writeFile } from "node:fs/promises";

const SRC = "dist-static";
const OUT = "dist-ftp";

await access(SRC).catch(() => {
  throw new Error("Lance d'abord `npm run build:static`.");
});

await rm(OUT, { recursive: true, force: true });
await cp(SRC, OUT, { recursive: true });

await rm(`${OUT}/.DS_Store`, { force: true });

await writeFile(
  `${OUT}/.htaccess`,
  `Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^ index.html [L]

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
`,
);

await rm("dist-static", { recursive: true, force: true });
console.log(`Build statique pret: ./${OUT}`);
