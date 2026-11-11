// Minimal static server with clean URLs + the same 301s as production (for local QA).
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const port = Number(process.env.PORT || 8080);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };
const redirects = { '/home': '/', '/landscape-design': '/landscaping', '/turf-installation': '/landscaping' };

// Local stand-in for the Vercel Function: runs api/quote.js with a Web Request built from the Node request.
async function api(req, res, url) {
  const mod = await import('../api' + url.replace(/^\/api/, '') + '.js');
  const handler = mod[req.method];
  if (!handler) { res.writeHead(405); return res.end(); }
  const request = new Request('http://localhost' + req.url, { method: req.method, headers: req.headers, body: req.method === 'GET' ? undefined : req, duplex: 'half' });
  const out = await handler(request);
  res.writeHead(out.status, Object.fromEntries(out.headers));
  res.end(Buffer.from(await out.arrayBuffer()));
}

http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/api/quote') return api(req, res, url).catch(err => { console.error(err); res.writeHead(500); res.end(); });
  if (redirects[url]) { res.writeHead(301, { Location: redirects[url] }); return res.end(); }
  if (url.length > 1 && url.endsWith('/')) url = url.slice(0, -1);
  let file = path.join(root, url);
  if (url === '/' ) file = path.join(root, 'index.html');
  else if (!path.extname(url)) {
    if (existsSync(file + '.html')) file = file + '.html';
    else if (existsSync(path.join(file, 'index.html'))) file = path.join(file, 'index.html');
  }
  if (!existsSync(file) || statSync(file).isDirectory()) { file = path.join(root, '404.html'); res.statusCode = 404; }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`serving ${root} on http://localhost:${port}`));
