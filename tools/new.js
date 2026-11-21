// Buat file konten baru dari templat:  npm run baru -- nama-slug "Judul konten" [tema]
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './server.js';

const [slug, title = 'Judul konten', theme = 'finansial'] = process.argv.slice(2);
if (!slug) { console.log('Pakai: npm run baru -- nama-slug "Judul" [finansial|ekonomi|sosial|netral|terang]'); process.exit(1); }
const file = path.join(ROOT, 'content', slug + '.json');
if (fs.existsSync(file)) { console.error('Sudah ada: ' + file); process.exit(1); }
const tpl = {
  title, theme, format: 'feed', series: 'Komik Finansial', handle: '@zona.anime',
  caption: `${title}\n\nSimpan & bagikan ke temanmu yang perlu tahu!\n\n#edukasifinansial #literasikeuangan`,
  scenes: [
    { type: 'meme', char: 'bima', expr: 'kaget', pose: 'panik', top: title, bottom: 'Geser →' },
    { type: 'comic', panels: [
      { bg: 'ruang', chars: [{ char: 'bima', expr: 'bingung' }], bubbles: [{ text: 'Pertanyaan tokoh...' }] },
      { bg: 'halftone', chars: [{ char: 'sari', expr: 'senang', pose: 'jelasin' }], bubbles: [{ text: 'Jawaban *singkat*!' }] },
    ] },
    { type: 'mascot', char: 'koko', pose: 'jelasin', expr: 'senang', kicker: 'Tips', title: 'Judul tips', items: ['Poin satu', 'Poin dua'], say: 'Kalimat maskot' },
    { type: 'cta', chara: { char: 'rina', expr: 'senang', pose: 'lambai', side: 'left' } },
  ],
};
fs.writeFileSync(file, JSON.stringify(tpl, null, 2) + '\n');
console.log('✓ Dibuat: content/' + slug + '.json');
