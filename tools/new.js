// Buat file konten baru dari templat:  npm run baru -- nama-slug "Judul konten" [tema]
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './server.js';

const [slug, title = 'Judul konten', theme = 'finansial'] = process.argv.slice(2);
if (!slug) { console.log('Pakai: npm run baru -- nama-slug "Judul" [finansial|ekonomi|sosial|netral|terang]'); process.exit(1); }
const file = path.join(ROOT, 'content', slug + '.json');
if (fs.existsSync(file)) { console.error('Sudah ada: ' + file); process.exit(1); }
const tpl = {
  title, theme, format: 'reel', series: 'Edukasi Finansial', handle: '@zona.anime',
  caption: `${title}\n\nSimpan & bagikan ke temanmu yang perlu tahu!\n\n#edukasifinansial #literasikeuangan`,
  scenes: [
    { type: 'title', kicker: 'Tahukah kamu?', text: title },
    { type: 'stat', value: 100, suffix: '%', label: 'Label angka' },
    { type: 'list', title: 'Poin penting', items: ['Poin satu', 'Poin dua', 'Poin tiga'] },
    { type: 'cta' },
  ],
};
fs.writeFileSync(file, JSON.stringify(tpl, null, 2) + '\n');
console.log('✓ Dibuat: content/' + slug + '.json');
