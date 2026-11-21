// Maskot gemes "super-chibi": kepala besar, badan mungil, tangan bulat.
// Dipanggil dari drawChara bila base = 'kucing' | 'ayam' | 'anak'.
import { s } from './core.js';

const OUT = '#2B2233';
const P = (d, fill = 'none', o = {}) => s('path', { d, fill, stroke: OUT, 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', ...o });
const L = (d, color = OUT, w = 8, o = {}) => s('path', { d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...o });
const C = (cx, cy, r, fill, o = {}) => s('circle', { cx, cy, r, fill, stroke: OUT, 'stroke-width': 6, ...o });
const E = (cx, cy, rx, ry, fill, o = {}) => s('ellipse', { cx, cy, rx, ry, fill, stroke: OUT, 'stroke-width': 6, ...o });
const T = (x, y) => `translate(${x},${y})`;

// Posisi tangan (koordinat akhir) untuk semua maskot; [x, y, jenis]
export const MPOSE = {
  diri: { L: [128, 476], R: [272, 476] },
  tunjuk: { L: [128, 476], R: [338, 318, 'tunjuk'] },
  sorak: { L: [62, 292], R: [338, 292] },
  pikir: { L: [128, 476], R: [236, 352] },
  panik: { L: [52, 168], R: [348, 168] },
  lambai: { L: [128, 476], R: [342, 318, 'buka'] },
  jelasin: { L: [128, 476], R: [352, 412, 'buka'] },
  pegang: { L: [160, 440], R: [240, 440], item: true },
  silang: { L: [250, 452], R: [150, 452] },
  tepokjidat: { L: [128, 476], R: [262, 200, 'buka'] },
};

// Spesies: warna & ciri. Semua bisa di-override lewat "cast".
export const SPECIES = {
  kucing: { skin: '#FFF6EC', body: '#FFF6EC', paw: '#FFF6EC', patch: '#F7A447', patch2: '#4A3B3B', eyes: '#2FB98A', accent: '#E5394A', gold: '#F6C343' },
  ayam: { skin: '#FFD95C', body: '#FFD95C', paw: '#FFB833', comb: '#F0504A', eyes: '#5A3A1E', accent: '#2FB9A8', gold: '#F6C343' },
  anak: { skin: '#FFE6D6', body: '#9B8CFF', paw: '#FFE6D6', hairColor: '#3B2A55', eyes: '#7A5CFF', accent: '#FFD34D', gold: '#F6C343' },
};
// letak mata, mulut, pipi di wajah maskot
const FACE = {
  kucing: { eyes: [[136, 262], [264, 262]], k: 1.05, mouth: [200, 318], blush: 300, browDy: 4 },
  ayam: { eyes: [[138, 250], [262, 250]], k: 1.05, mouth: [200, 300], blush: 292, browDy: 4 },
  anak: { eyes: [[140, 270], [260, 270]], k: 1.0, mouth: [200, 326], blush: 312, browDy: 8 },
};

function zCoin(x, y, r, c) {
  return s('g', { transform: T(x, y) }, C(0, 0, r, c.gold, { 'stroke-width': 5 }),
    s('circle', { r: r * 0.7, fill: 'none', stroke: '#E0A526', 'stroke-width': 4 }),
    s('text', { y: r * 0.36, 'text-anchor': 'middle', 'font-size': r * 1.05, 'font-weight': 800, fill: '#B07D0E', 'font-family': 'Jakarta, sans-serif' }, 'Z'));
}

// ---------- badan per spesies (di belakang wajah) ----------
function bodyKucing(c, g) {
  g.append(P('M282,470 C350,470 380,420 360,372 C352,352 330,356 336,378 C346,410 320,438 282,440Z', c.patch)); // ekor
  g.append(E(200, 452, 104, 86, c.body));
  g.append(s('ellipse', { cx: 200, cy: 470, rx: 60, ry: 46, fill: '#FFFFFF', opacity: 0.8 }));
  g.append(E(158, 530, 36, 22, c.paw), E(242, 530, 36, 22, c.paw));
  // telinga
  g.append(P('M58,190 C36,110 46,52 82,40 C118,54 150,86 170,112Z', c.patch), P('M342,190 C364,110 354,52 318,40 C282,54 250,86 230,112Z', c.patch2));
  g.append(s('path', { d: 'M78,150 C70,110 76,80 90,70 C110,82 128,100 140,118Z', fill: '#FFB3C1' }));
  g.append(s('path', { d: 'M322,150 C330,110 324,80 310,70 C290,82 272,100 260,118Z', fill: '#FFB3C1' }));
  // kepala
  g.append(E(200, 240, 174, 148, c.skin));
  g.append(s('path', { d: 'M40,214 C48,150 92,108 150,98 C150,140 120,176 52,236Z', fill: c.patch }));
  g.append(s('path', { d: 'M300,100 C330,110 352,140 360,170 C336,160 314,140 300,100Z', fill: c.patch2 }));
  g.append(E(200, 240, 174, 148, 'none'));
  // kumis
  [[-1, 300], [1, 300]].forEach(([sd]) => {
    const x0 = 200 + sd * 120;
    g.append(L(`M${x0},${300} l${sd * 62},-8 M${x0},${314} l${sd * 64},8`, OUT, 4));
  });
}
function bodyAyam(c, g) {
  // bulu ekor (khas celengan ayam)
  g.append(P('M330,300 C390,250 420,300 396,340 C430,330 440,380 400,400 C420,420 400,460 360,440Z', c.accent));
  g.append(E(158, 532, 30, 14, c.paw), E(242, 532, 30, 14, c.paw));
  g.append(L('M150,520 l-12,18 M150,520 l0,22 M150,520 l12,18 M250,520 l-12,18 M250,520 l0,22 M250,520 l12,18', OUT, 5));
  g.append(C(168, 82, 22, c.comb), C(200, 66, 26, c.comb), C(232, 82, 22, c.comb)); // jengger
  g.append(P('M200,92 C322,92 380,214 378,318 C376,440 300,520 200,520 C100,520 24,440 22,318 C20,214 78,92 200,92Z', c.body));
  g.append(s('rect', { x: 162, y: 112, width: 76, height: 14, rx: 7, fill: OUT })); // lubang celengan
  g.append(s('ellipse', { cx: 200, cy: 430, rx: 110, ry: 72, fill: '#FFF0B8' }));
  // motif bunga ala celengan
  [[150, 420, '#FF7FA8'], [252, 412, '#4FC3E8'], [204, 470, '#FF7FA8']].forEach(([x, y, col]) =>
    g.append(s('g', { transform: T(x, y) }, [0, 72, 144, 216, 288].map(a => s('ellipse', { rx: 9, ry: 14, cy: -13, fill: col, transform: `rotate(${a})` })), s('circle', { r: 7, fill: c.gold }))));
  g.append(zCoin(200, 364, 26, c));
}
function bodyAnak(c, g) {
  g.append(E(158, 530, 36, 20, '#3A3045'), E(242, 530, 36, 20, '#3A3045'));
  g.append(P('M110,480 C110,410 140,372 200,372 C260,372 290,410 290,480 C290,510 260,520 200,520 C140,520 110,510 110,480Z', c.body));
  g.append(P('M150,470 L250,470 L258,510 L142,510Z', shade(c.body, -0.08)));
  g.append(zCoin(200, 430, 24, c));
  // tudung hoodie + telinga kucing
  g.append(P('M44,150 C30,90 50,44 88,34 C120,52 140,76 150,100Z', c.body), P('M356,150 C370,90 350,44 312,34 C280,52 260,76 250,100Z', c.body));
  g.append(s('path', { d: 'M66,124 C60,92 70,70 88,62 C104,74 116,88 124,104Z', fill: '#FFB3C1' }), s('path', { d: 'M334,124 C340,92 330,70 312,62 C296,74 284,88 276,104Z', fill: '#FFB3C1' }));
  g.append(E(200, 250, 182, 166, c.body));
  // ahoge berbentuk Z
  g.append(L('M176,52 L226,40 L182,96 L232,84', c.hairColor, 13));
  g.append(E(200, 266, 148, 134, c.skin)); // wajah
  // poni
  g.append(P('M62,240 C56,170 110,128 200,128 C290,128 344,170 338,240 L322,206 L304,226 L292,184 L262,212 L246,170 L220,206 L200,166 L180,206 L154,170 L138,212 L108,184 L96,226 L78,206Z', c.hairColor));
  g.append(L('M120,160 Q200,136 280,160', shade(c.hairColor, 0.45), 9, { opacity: 0.55 }));
  // tepi tudung di depan wajah
  g.append(P('M200,84 C300,84 382,150 382,250 C382,350 300,416 200,416 C100,416 18,350 18,250 C18,150 100,84 200,84Z M200,132 C282,132 348,184 348,266 C348,346 282,400 200,400 C118,400 52,346 52,266 C52,184 118,132 200,132Z', c.body, { 'fill-rule': 'evenodd' }));
  g.append(L('M184,404 L180,456 M216,404 L220,456', '#fff', 5));
}
function shade(hex, f) {
  let x = String(hex).replace('#', '');
  if (x.length === 3) x = [...x].map(v => v + v).join('');
  const n = parseInt(x, 16), t = f < 0 ? 0 : 255, p = Math.abs(f);
  return `rgb(${[n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round((t - v) * p + v)).join(',')})`;
}

// ---------- tangan bulat ----------
function arms(c, g, pose, species) {
  const p = MPOSE[pose] || MPOSE.diri;
  const SH = species === 'ayam' ? { L: [70, 360], R: [330, 360] } : { L: [148, 420], R: [252, 420] };
  const col = species === 'anak' ? c.body : species === 'ayam' ? c.paw : c.body;
  const paws = [];
  for (const k of pose === 'silang' ? ['L', 'R'] : ['R', 'L']) {
    const [x, y, type] = p[k];
    const [sx, sy] = SH[k];
    if (species === 'ayam') { // sayap
      const a = Math.atan2(y - sy, x - sx) * 180 / Math.PI;
      g.append(s('g', { transform: `translate(${sx},${sy}) rotate(${a})` }, P(`M0,-26 C${Math.hypot(x - sx, y - sy) * 0.6},-46 ${Math.hypot(x - sx, y - sy) + 26},-18 ${Math.hypot(x - sx, y - sy) + 30},0 C${Math.hypot(x - sx, y - sy) + 24},20 ${Math.hypot(x - sx, y - sy) * 0.6},40 0,26Z`, col),
        L(`M${Math.hypot(x - sx, y - sy) * 0.55},-8 l26,4 M${Math.hypot(x - sx, y - sy) * 0.55},10 l22,-2`, shade(col, -0.25), 4)));
      continue;
    }
    const cx = k === 'L' ? Math.min(sx, x) - (y < 300 ? 70 : 20) : Math.max(sx, x) + (y < 300 ? 70 : 20);
    const d = `M${sx},${sy} Q${cx},${(sy + y) / 2} ${x},${y}`;
    g.append(L(d, OUT, 46), L(d, col, 34));
    paws.push([x, y, type]);
  }
  return () => paws.forEach(([x, y, type]) => {
    const fill = species === 'kucing' ? c.paw : c.paw;
    g.append(C(x, y, type === 'buka' ? 27 : 24, fill));
    if (species === 'kucing') g.append(L(`M${x - 9},${y - 4} l0,8 M${x + 9},${y - 4} l0,8`, '#FF9EB1', 5));
    if (type === 'tunjuk') g.append(C(x + 14, y - 26, 10, fill, { 'stroke-width': 5 }));
  });
}

/** Gambar maskot. feature(g, faceOpts) dipakai untuk menggambar mata/mulut/alis dari chara.js */
export function drawMaskot(c, g, pose, drawFeatures, drawItem) {
  const sp = c.base;
  if (sp === 'kucing') bodyKucing(c, g);
  else if (sp === 'ayam') bodyAyam(c, g);
  else bodyAnak(c, g);
  const finish = arms(c, g, pose, sp);
  drawFeatures(g, FACE[sp], sp);
  if (sp === 'kucing') { // kalung + lonceng koin Z
    g.append(L('M110,372 Q200,410 290,372', OUT, 26), L('M110,372 Q200,410 290,372', c.accent, 16));
    g.append(zCoin(200, 410, 26, c));
  }
  if (MPOSE[pose].item && c.item) drawItem(g, c.item, 'maskot');
  finish();
}
