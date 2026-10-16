// Petit serveur statique pour les tests E2E : sert l'application instrumentée (dist/e2e)
// et renvoie index.html pour toutes les routes Angular (/students, /login...).
// Les appels /api sont simulés par Cypress (cy.intercept), le back-end n'est donc pas nécessaire.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'dist', 'e2e');
const PORT = 4300;
const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.ico': 'image/x-icon', '.map': 'application/json' };

http.createServer((req, res) => {
  let file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(ROOT, 'index.html');
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`E2E app served on http://localhost:${PORT}`));
