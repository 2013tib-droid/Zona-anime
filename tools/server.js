// Server statis kecil untuk pratinjau. Jalankan: npm run preview  -> buka http://localhost:5173
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg' };

function indexPage() {
  const files = fs.readdirSync(path.join(ROOT, 'content')).filter(f => f.endsWith('.json')).sort();
  const link = (f, fm, mode = 'video') => `<a href="/engine/player.html?c=/content/${f}&f=${fm}&mode=${mode}">${fm}${mode === 'carousel' ? ' (carousel)' : ''}</a>`;
  const rows = files.map(f => `<li><b>${f.replace('.json', '')}</b> — ${link(f, 'reel')} · ${link(f, 'feed')} · ${link(f, 'square')} · ${link(f, 'feed', 'carousel')}</li>`).join('');
  return `<!doctype html><meta charset="utf-8"><title>Zona Anime</title>
<style>body{font:16px/1.7 system-ui;background:#111;color:#eee;max-width:900px;margin:40px auto;padding:0 16px}a{color:#7CF29C}li{margin:6px 0}</style>
<h1>Zona Anime — daftar konten</h1><ul>${rows}</ul>`;
}

export function serve(port = 0) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (url === '/') { res.writeHead(200, { 'content-type': MIME['.html'] }); return res.end(indexPage()); }
    const file = path.join(ROOT, path.normalize(url));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(r => server.listen(port, '127.0.0.1', () => r({ server, port: server.address().port })));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { port } = await serve(Number(process.env.PORT) || 5173);
  console.log(`Pratinjau: http://localhost:${port}`);
}
