// Bank karakter chibi/anime berbasis SVG (digambar lewat kode, bebas dipakai).
// Satu karakter = gabungan bagian: rambut, mata, mulut, baju, pose tangan, efek manga.
// Bisa diganti gambar sendiri: di file konten, "cast": { "rina": { "img": "assets/chara/rina/{expr}.png" } }
import { s } from './core.js';
import { ICONS } from './icons.js';
import { drawMaskot, SPECIES } from './maskot.js';
import { drawAnthro, ASPECIES } from './anthro.js';

const OUT = '#2B2233'; // warna garis luar (lineart)

// ---------- pemeran bawaan ----------
export const CAST = {
  rina: { name: 'Rina', hair: 'panjang', hairColor: '#4A3050', eyes: '#7A5CFF', skin: '#FFE3D3', outfit: 'kaos', outfitColor: '#FF8A5B', bottom: '#34405E' },
  bima: { name: 'Bima', hair: 'pendek', hairColor: '#2A2C3D', eyes: '#3B82F6', skin: '#F3CDB1', outfit: 'hoodie', outfitColor: '#3FB68B', bottom: '#2E3448' },
  sari: { name: 'Sari', hair: 'hijab', hairColor: '#D9657C', eyes: '#8B5A2B', skin: '#FBE0CF', outfit: 'kemeja', outfitColor: '#FFF4E8', bottom: '#4B3B5C', rok: true },
  ayu: { name: 'Ayu', hair: 'bob', hairColor: '#1F1B2E', eyes: '#E2475B', skin: '#FFE6D8', outfit: 'seragam', outfitColor: '#2E3F7F', bottom: '#2E3F7F', rok: true },
  dodi: { name: 'Pak Dodi', hair: 'tipis', hairColor: '#9A98A8', eyes: '#5B4636', skin: '#E8BE9C', outfit: 'jas', outfitColor: '#2F3E66', tie: '#D9483B', bottom: '#2F3E66', acc: ['kacamata', 'kumis'] },
  koko: { name: 'Koko', base: 'koin', eyes: '#3A2A10' },
  // --- konsep maskot brand (super-chibi gemes) ---
  zuzu: { name: 'Zuzu', base: 'kucing' },
  cimo: { name: 'Cimo', base: 'ayam' },
  zona: { name: 'Zona-chan', base: 'anak' },
  // --- maskot proporsi dewasa tapi gemes ---
  oren: { name: 'Oren', base: 'oren' },
  raja: { name: 'Raja', base: 'harimau' },
};
const DEFAULT = { hair: 'pendek', hairColor: '#2A2C3D', eyes: '#6B4CD6', skin: '#FFE0CC', outfit: 'kaos', outfitColor: '#5B8CFF', bottom: '#34405E', tie: '#D9483B', acc: [] };

// ---------- ekspresi ----------
// eyes: jenis mata · brows: [alis dalam, alis luar] (negatif = naik) · mouth · fx otomatis
export const EXPR = {
  netral: { eyes: 'normal', brows: [0, 4], mouth: 'senyum' },
  senang: { eyes: 'tutup', brows: [-4, 2], mouth: 'buka', blush: 1 },
  tertawa: { eyes: 'peras', brows: [-6, 0], mouth: 'lebar', blush: 1 },
  kaget: { eyes: 'kaget', brows: [-18, -12], mouth: 'o', fx: ['seru'] },
  sedih: { eyes: 'normal', look: [0, 6], brows: [-16, 8], mouth: 'cemberut', tears: 'tetes' },
  nangis: { eyes: 'peras', brows: [-16, 8], mouth: 'lebar', tears: 'deras' },
  marah: { eyes: 'marah', brows: [16, -10], mouth: 'gigi', fx: ['marah'] },
  bingung: { eyes: 'normal', look: [6, -2], brows: { L: [2, 4], R: [-16, -16] }, mouth: 'gelombang', fx: ['tanya'] },
  mikir: { eyes: 'normal', look: [8, -9], brows: [-6, 2], mouth: 'datar' },
  malu: { eyes: 'normal', look: [-8, 5], brows: [-10, 4], mouth: 'gelombang', blush: 2 },
  bangga: { eyes: 'sayu', brows: [-8, -12], mouth: 'seringai' },
  panik: { eyes: 'spiral', brows: [-16, 8], mouth: 'gelombang', fx: ['keringat'] },
  berbinar: { eyes: 'bintang', brows: [-6, 0], mouth: 'buka', blush: 1, fx: ['kilau'] },
  lelah: { eyes: 'sayu', look: [0, 6], brows: [-12, 6], mouth: 'datar', fx: ['suram'] },
  datar: { eyes: 'garis', brows: [0, 0], mouth: 'datar' },
};

// ---------- pose tangan: [siku, tangan, jenis tangan] ----------
const SH = { L: [130, 372], R: [270, 372] };
const DIRI_L = [[112, 432], [118, 492]], DIRI_R = [[288, 432], [282, 492]];
export const POSE = {
  diri: { L: DIRI_L, R: DIRI_R },
  tunjuk: { L: DIRI_L, R: [[318, 322], [345, 250], 'tunjuk'] },
  sorak: { L: [[92, 300], [110, 214]], R: [[308, 300], [290, 214]] },
  pikir: { L: DIRI_L, R: [[305, 440], [232, 332]] },
  panik: { L: [[52, 320], [88, 200]], R: [[348, 320], [312, 200]] },
  lambai: { L: DIRI_L, R: [[326, 330], [336, 240], 'buka'] },
  jelasin: { L: DIRI_L, R: [[322, 425], [372, 378], 'buka'] },
  pegang: { L: [[108, 450], [166, 432]], R: [[292, 450], [234, 432]], item: true },
  silang: { L: [[108, 442], [240, 430]], R: [[292, 442], [160, 420]] },
  tepokjidat: { L: DIRI_L, R: [[305, 420], [252, 228], 'buka'] },
};
POSE.saku = POSE.diri; POSE.jempol = POSE.lambai; // pose khusus maskot dewasa; karakter lain pakai padanan terdekat
// versi maskot koin (tangan tipis bersarung putih)
const KSH = { L: [42, 320], R: [358, 320] };
const KPOSE = {
  diri: { L: [[10, 390], [8, 450]], R: [[390, 390], [392, 450]] },
  tunjuk: { L: [[10, 390], [8, 450]], R: [[405, 250], [430, 175], 'tunjuk'] },
  sorak: { L: [[-10, 230], [22, 140]], R: [[410, 230], [378, 140]] },
  pikir: { L: [[10, 390], [8, 450]], R: [[400, 400], [262, 330]] },
  panik: { L: [[-20, 220], [70, 110]], R: [[420, 220], [330, 110]] },
  lambai: { L: [[10, 390], [8, 450]], R: [[415, 270], [425, 185], 'buka'] },
  jelasin: { L: [[10, 390], [8, 450]], R: [[410, 340], [450, 290], 'buka'] },
  pegang: { L: [[20, 420], [150, 450]], R: [[380, 420], [250, 450]], item: true },
  silang: { L: [[30, 400], [262, 400]], R: [[370, 400], [138, 392]] },
  tepokjidat: { L: [[10, 390], [8, 450]], R: [[400, 330], [255, 228], 'buka'] },
};
KPOSE.saku = KPOSE.diri; KPOSE.jempol = KPOSE.lambai;

// ---------- util ----------
function shade(hex, f) {
  let c = String(hex).replace('#', '');
  if (c.length === 3) c = [...c].map(x => x + x).join('');
  const n = parseInt(c, 16);
  let [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255];
  const t = f < 0 ? 0 : 255, p = Math.abs(f);
  [r, g, b] = [r, g, b].map(v => Math.round((t - v) * p + v));
  return `rgb(${r},${g},${b})`;
}
const P = (d, fill = 'none', o = {}) => s('path', { d, fill, stroke: OUT, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', ...o });
const line = (d, color = OUT, w = 8, o = {}) => s('path', { d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...o });
const circ = (cx, cy, r, fill, o = {}) => s('circle', { cx, cy, r, fill, stroke: OUT, 'stroke-width': 5, ...o });
const ell = (cx, cy, rx, ry, fill, o = {}) => s('ellipse', { cx, cy, rx, ry, fill, stroke: OUT, 'stroke-width': 5, ...o });

// ---------- rambut ----------
const HAIR_BACK = {
  pendek: 'M58,215 C40,95 118,32 200,32 C282,32 360,95 342,215 C338,250 322,268 312,278 L88,278 C78,268 62,250 58,215Z',
  rapi: 'M60,210 C44,95 120,36 200,36 C280,36 356,95 340,210 C336,245 322,262 312,272 L88,272 C78,262 64,245 60,210Z',
  panjang: 'M62,190 C48,80 126,30 200,30 C274,30 352,80 338,190 C346,300 352,400 360,470 Q320,500 280,478 L120,478 Q80,500 40,470 C48,400 54,300 62,190Z',
  kuncir: 'M60,212 C42,95 120,32 200,32 C282,32 358,95 340,212 C336,248 322,266 312,276 L88,276 C78,266 64,248 60,212Z',
  bob: 'M58,200 C44,85 122,32 200,32 C278,32 356,85 342,200 C350,260 356,310 352,340 Q300,352 260,330 L140,330 Q100,352 48,340 C44,310 50,260 58,200Z',
  sanggul: 'M64,205 C50,95 124,40 200,40 C276,40 350,95 336,205 C332,240 320,258 310,268 L90,268 C80,258 68,240 64,205Z',
};
const HAIR_FRONT = {
  pendek: 'M58,205 C46,92 120,38 200,38 C284,38 354,92 342,205 L326,160 L304,192 L288,140 L254,178 L236,128 L202,170 L180,124 L150,174 L128,132 L102,188 L84,150Z',
  rapi: 'M60,195 C48,90 124,40 200,40 C280,40 352,90 340,195 L326,150 C292,112 232,102 176,128 C140,144 102,150 80,176Z',
  panjang: 'M60,250 C40,98 120,38 200,38 C280,38 360,98 340,250 L334,310 L314,186 L292,150 L266,184 L240,138 L214,178 L190,136 L160,180 L134,146 L108,186 L86,310Z',
  kuncir: 'M58,210 C44,94 120,38 200,38 C284,38 356,94 342,210 L326,168 C302,122 244,110 186,146 L158,176 L146,140 L114,186 L94,168Z',
  bob: 'M60,262 C44,98 120,40 200,40 C280,40 356,98 340,262 L322,264 L318,172 Q200,198 82,172 L78,264Z',
  sanggul: 'M70,192 C60,90 130,44 200,44 C278,44 346,94 332,192 C314,130 270,102 210,112 C160,120 110,142 70,192Z',
};

function drawHairBack(c, g) {
  const hc = c.hairColor;
  if (c.hair === 'kuncir') g.append(P('M318,110 C392,140 404,250 380,360 C372,300 350,250 322,214 C340,180 336,140 318,110Z', hc));
  if (c.hair === 'sanggul') g.append(circ(200, 38, 48, hc));
  if (HAIR_BACK[c.hair]) g.append(P(HAIR_BACK[c.hair], shade(hc, -0.12)));
  if (c.hair === 'tipis') {
    g.append(P('M74,150 Q58,215 86,262 L104,250 Q90,205 100,160Z', hc));
    g.append(P('M326,150 Q342,215 314,262 L296,250 Q310,205 300,160Z', hc));
  }
}
function drawHairFront(c, g) {
  const hc = c.hairColor;
  if (HAIR_FRONT[c.hair]) {
    g.append(P(HAIR_FRONT[c.hair], hc));
    g.append(line('M118,92 Q200,58 282,92', shade(hc, 0.45), 11, { opacity: 0.55 })); // kilau rambut
  }
  if (c.hair === 'kuncir') g.append(ell(322, 116, 14, 18, c.tie || '#E2475B'));
  if (c.hair === 'tipis') g.append(line('M168,80 Q200,62 232,80', hc, 7));
}
// hijab: tudung di belakang + bingkai wajah (even-odd) di depan
const HIJAB_OUTER = 'M200,32 C304,32 360,110 356,210 C354,288 334,338 304,368 L338,446 Q200,478 62,446 L96,368 C66,338 46,288 44,210 C40,110 96,32 200,32Z';
const FACE_HOLE = 'M200,104 C272,104 310,150 310,212 C310,276 264,322 200,328 C136,322 90,276 90,212 C90,150 128,104 200,104Z';

// ---------- wajah ----------
const FACE = 'M76,196 C76,110 126,70 200,70 C274,70 324,110 324,196 C324,266 274,322 200,333 C126,322 76,266 76,196Z';
const EYE = { L: [146, 226], R: [254, 226] };

function eye(g, cx, cy, side, kind, c, look = [0, 0]) {
  const iris = c.eyes, skin = c.skin;
  const lash = () => line(`M${cx - side * 28},${cy - 20} Q${cx},${cy - 50} ${cx + side * 34},${cy - 24} L${cx + side * 43},${cy - 33}`, OUT, 9);
  const normal = (star) => {
    const [dx, dy] = look;
    g.append(s('ellipse', { cx, cy: cy + 4, rx: 28, ry: 34, fill: '#fff' }));
    g.append(s('ellipse', { cx: cx + dx, cy: cy + 5 + dy, rx: 24, ry: 31, fill: iris }));
    g.append(s('ellipse', { cx: cx + dx, cy: cy - 6 + dy, rx: 24, ry: 18, fill: shade(iris, -0.35), opacity: 0.55 }));
    g.append(s('ellipse', { cx: cx + dx, cy: cy + 8 + dy, rx: 11, ry: 16, fill: shade(iris, -0.6) }));
    g.append(s('ellipse', { cx: cx + dx, cy: cy + 24 + dy, rx: 14, ry: 7, fill: shade(iris, 0.45), opacity: 0.8 }));
    if (star) g.append(s('path', { d: star4(cx + dx + 2, cy + 2 + dy, 17), fill: '#fff' }));
    else {
      g.append(s('circle', { cx: cx + dx + 9, cy: cy - 8 + dy, r: 9, fill: '#fff' }));
      g.append(s('circle', { cx: cx + dx - 9, cy: cy + 16 + dy, r: 4, fill: '#fff' }));
    }
    g.append(lash());
    g.append(line(`M${cx - 12},${cy + 39} Q${cx},${cy + 42} ${cx + 12},${cy + 39}`, OUT, 4));
  };
  switch (kind) {
    case 'tutup': g.append(line(`M${cx - 28},${cy + 10} Q${cx},${cy - 26} ${cx + 28},${cy + 10}`, OUT, 9)); break;
    case 'peras': g.append(line(`M${cx - side * 24},${cy - 20} L${cx + side * 20},${cy} L${cx - side * 24},${cy + 20}`, OUT, 9)); break;
    case 'garis': g.append(line(`M${cx - 24},${cy + 4} L${cx + 24},${cy + 4}`, OUT, 9)); break;
    case 'kaget':
      g.append(ell(cx, cy + 4, 30, 36, '#fff'));
      g.append(s('circle', { cx, cy: cy + 6, r: 7, fill: OUT }));
      g.append(lash()); break;
    case 'spiral':
      g.append(ell(cx, cy + 4, 30, 36, '#fff'));
      g.append(line(`M${cx},${cy + 4} m-4,0 a4,4 0 1,1 8,0 a8,8 0 1,1 -16,0 a12,12 0 1,1 24,0 a16,16 0 1,1 -32,0`, OUT, 4)); break;
    case 'bintang': normal(true); break;
    case 'marah':
      normal();
      g.append(s('path', { d: `M${cx + side * 44},${cy - 48} L${cx - side * 38},${cy - 48} L${cx - side * 38},${cy + 4} L${cx + side * 42},${cy - 20}Z`, fill: skin }));
      g.append(line(`M${cx + side * 40},${cy - 20} L${cx - side * 36},${cy + 3}`, OUT, 9)); break;
    case 'sayu':
      normal();
      g.append(s('path', { d: `M${cx - 40},${cy - 46} L${cx + 40},${cy - 46} L${cx + 40},${cy} L${cx - 40},${cy}Z`, fill: skin }));
      g.append(line(`M${cx - side * 30},${cy} Q${cx},${cy - 6} ${cx + side * 36},${cy - 2}`, OUT, 9)); break;
    default: normal();
  }
}
const star4 = (x, y, r) => `M${x},${y - r} Q${x + r * 0.18},${y - r * 0.18} ${x + r},${y} Q${x + r * 0.18},${y + r * 0.18} ${x},${y + r} Q${x - r * 0.18},${y + r * 0.18} ${x - r},${y} Q${x - r * 0.18},${y - r * 0.18} ${x},${y - r}Z`;

const MOUTH = {
  senyum: () => line('M180,286 Q200,302 220,286', OUT, 6),
  buka: () => [P('M174,282 Q200,286 226,282 Q222,316 200,318 Q178,316 174,282Z', '#7A2230'), s('ellipse', { cx: 200, cy: 309, rx: 12, ry: 6, fill: '#FF7B8A' })],
  lebar: () => [P('M164,278 Q200,284 236,278 Q232,330 200,332 Q168,330 164,278Z', '#7A2230'), s('ellipse', { cx: 200, cy: 320, rx: 18, ry: 8, fill: '#FF7B8A' })],
  o: () => ell(200, 296, 12, 16, '#7A2230'),
  cemberut: () => line('M182,300 Q200,284 218,300', OUT, 6),
  gelombang: () => line('M172,294 q7,-8 14,0 t14,0 t14,0 t14,0', OUT, 6),
  gigi: () => [P('M168,282 L232,282 Q232,306 200,306 Q168,306 168,282Z', '#fff'), line('M168,294 L232,294', OUT, 4)],
  datar: () => line('M184,294 L216,294', OUT, 6),
  seringai: () => line('M180,290 Q206,300 224,280', OUT, 6),
  kucing: () => line('M174,286 Q187,302 200,288 Q213,302 226,286', OUT, 6),
};

function drawFace(c, g, ex) {
  const skin = c.skin, skinSh = shade(skin, -0.13);
  if (c.base !== 'koin') {
    if (c.hair !== 'hijab') { g.append(ell(80, 222, 16, 24, skin)); g.append(ell(320, 222, 16, 24, skin)); }
    g.append(P(FACE, skin));
    if (c.hair !== 'hijab' && c.hair !== 'tipis') g.append(s('path', { d: 'M82,168 Q200,240 318,168 L318,110 L82,110Z', fill: skinSh })); // bayangan poni
  }
  g.append(line('M203,256 L198,266', shade(c.base === 'koin' ? '#F6C343' : skin, -0.3), 4));
  if (!ex.blush) [128, 272].forEach(x => g.append(s('ellipse', { cx: x, cy: 272, rx: 24, ry: 11, fill: '#FF8FA8', opacity: 0.28 }))); // pipi merona tipis = lebih gemes
  if (ex.blush) {
    const o = ex.blush > 1 ? 0.75 : 0.5;
    [128, 272].forEach(x => {
      g.append(s('ellipse', { cx: x, cy: 272, rx: 26, ry: 13, fill: '#FF7F9A', opacity: o }));
      g.append(line(`M${x - 12},${276} l6,-9 M${x - 2},${276} l6,-9 M${x + 8},${276} l6,-9`, '#E2557A', 3, { opacity: o + 0.1 }));
    });
  }
  g.append(...[].concat(MOUTH[ex.mouth || 'senyum']()));
  eye(g, ...EYE.L, -1, ex.eyes, c, ex.look);
  eye(g, ...EYE.R, 1, ex.eyes, c, ex.look);
  if (ex.tears === 'deras') [EYE.L[0] - 8, EYE.R[0] + 8].forEach(x =>
    g.append(P(`M${x - 12},${250} L${x + 12},${250} L${x + 18},${350} Q${x},${362} ${x - 18},${350}Z`, '#9ADCFF', { 'stroke-width': 3, opacity: 0.9 })));
  if (ex.tears === 'tetes') g.append(P('M290,250 Q300,268 296,278 Q290,288 282,280 Q278,270 290,250Z', '#9ADCFF', { 'stroke-width': 3 }));
}
function drawBrows(c, g, ex) {
  const col = c.browColor || (c.base === 'koin' ? OUT : c.hair === 'hijab' ? '#4A3428' : shade(c.hairColor || '#333', -0.35));
  const by = 162;
  [['L', -1], ['R', 1]].forEach(([k, side]) => {
    const [inn, out] = Array.isArray(ex.brows) ? ex.brows : ex.brows[k];
    const cx = EYE[k][0];
    g.append(line(`M${cx - side * 24},${by + inn} Q${cx},${by - 10 + (inn + out) / 2} ${cx + side * 30},${by + out}`, col, 8));
  });
}

// ---------- wajah maskot (mata & alis manusia, diposisikan ulang) ----------
function drawFeatures(g, F, sp, c, ex) {
  const { eyes, k, mouth, blush, browDy } = F;
  const mk = F.mk ?? 0.9, bk = F.bk ?? 1;
  // pipi (selalu merona = gemes)
  const bo = ex.blush > 1 ? 0.8 : ex.blush ? 0.65 : (F.bo ?? 0.5);
  [eyes[0][0] - 22, eyes[1][0] + 22].forEach(x => {
    g.append(s('ellipse', { cx: x, cy: blush, rx: 30 * bk, ry: 16 * bk, fill: '#FF8FA8', opacity: bo }));
    if (ex.blush) g.append(line(`M${x - 13},${blush + 5} l6,-10 M${x - 2},${blush + 5} l6,-10 M${x + 9},${blush + 5} l6,-10`, '#E2557A', 3, { opacity: bo }));
  });
  // mulut / paruh
  const m = ex.mouth || 'senyum';
  const mg = s('g', { transform: `translate(${mouth[0] - 200 * mk},${mouth[1] - 292 * mk}) scale(${mk})` });
  if (sp === 'ayam') {
    const open = ['buka', 'lebar', 'o', 'gigi'].includes(m);
    g.append(open
      ? s('g', {}, P(`M176,${mouth[1] - 8} L200,${mouth[1] - 24} L224,${mouth[1] - 8}Z`, '#FF9A2E'), P(`M180,${mouth[1] - 2} L200,${mouth[1] + 22} L220,${mouth[1] - 2}Z`, '#FF9A2E'), s('path', { d: `M182,${mouth[1] - 7} L218,${mouth[1] - 7} L200,${mouth[1] + 6}Z`, fill: '#7A2230' }))
      : P(`M178,${mouth[1] - 4} L200,${mouth[1] - 18} L222,${mouth[1] - 4} L200,${mouth[1] + 12}Z`, '#FF9A2E'));
  } else {
    if (sp === 'kucing') g.append(P(`M190,${mouth[1] - 24} L210,${mouth[1] - 24} L200,${mouth[1] - 14}Z`, '#FF8FA8', { 'stroke-width': 4 }));
    if (F.nose) g.append(P(`M${F.nose[0] - 13},${F.nose[1] - 6} Q${F.nose[0]},${F.nose[1] - 12} ${F.nose[0] + 13},${F.nose[1] - 6} Q${F.nose[0] + 4},${F.nose[1] + 10} ${F.nose[0]},${F.nose[1] + 10} Q${F.nose[0] - 4},${F.nose[1] + 10} ${F.nose[0] - 13},${F.nose[1] - 6}Z`, '#FF8A9A', { 'stroke-width': 4 }));
    mg.append(...[].concat(MOUTH[m === 'senyum' ? 'kucing' : m]()));
    g.append(mg);
  }
  // mata + alis per sisi
  [['L', -1], ['R', 1]].forEach(([key, side], i) => {
    const [x, y] = eyes[i];
    const eg = s('g', { transform: `translate(${x},${y}) scale(${k}) translate(${-EYE[key][0]},${-EYE[key][1]})` });
    eye(eg, ...EYE[key], side, ex.eyes, c, ex.look);
    const [inn, out] = Array.isArray(ex.brows) ? ex.brows : ex.brows[key];
    const cx = EYE[key][0], by = 162 + browDy;
    eg.append(line(`M${cx - side * 22},${by + inn} Q${cx},${by - 8 + (inn + out) / 2} ${cx + side * 26},${by + out}`, shade(c.hairColor || '#5A4A3A', -0.3), 8));
    if (ex.tears === 'deras') eg.append(P(`M${cx - 12},${250} L${cx + 12},${250} L${cx + 18},${340} Q${cx},${352} ${cx - 18},${340}Z`, '#9ADCFF', { 'stroke-width': 3, opacity: 0.9 }));
    g.append(eg);
  });
  if (ex.tears === 'tetes') g.append(P(`M${eyes[1][0] + 40},${eyes[1][1] + 20} q10,18 6,28 q-6,10 -14,2 q-4,-10 8,-30Z`, '#9ADCFF', { 'stroke-width': 3 }));
}

// ---------- badan & baju ----------
const TORSO = 'M134,350 Q200,338 266,350 Q296,358 298,392 L284,494 L116,494 L102,392 Q104,358 134,350Z';
function drawBody(c, g) {
  const oc = c.outfitColor, skin = c.skin;
  // kaki
  if (c.rok) {
    g.append(P('M146,530 L182,530 L180,568 L148,568Z', skin), P('M218,530 L254,530 L252,568 L220,568Z', skin));
  } else {
    g.append(P('M128,488 L196,488 L192,568 L140,568Z', c.bottom), P('M204,488 L272,488 L260,568 L208,568Z', c.bottom));
  }
  g.append(ell(164, 574, 34, 15, '#3A3045'), ell(236, 574, 34, 15, '#3A3045'));
  // leher
  g.append(P('M182,318 L218,318 L220,356 L180,356Z', skin));
  g.append(s('path', { d: 'M184,322 L216,322 L216,336 Q200,344 184,336Z', fill: shade(skin, -0.15) }));
  if (c.outfit === 'hoodie') g.append(P('M116,362 Q200,296 284,362 Q244,384 200,384 Q156,384 116,362Z', shade(oc, -0.18)));
  const torsoFill = c.outfit === 'seragam' ? '#F7F7FC' : oc;
  g.append(P(TORSO, torsoFill));
  g.append(s('path', { d: 'M118,470 L282,470 L284,494 L116,494Z', fill: shade(torsoFill, -0.12) }));
  switch (c.outfit) {
    case 'kaos': g.append(P('M170,346 Q200,382 230,346Z', skin)); break;
    case 'kemeja':
      g.append(line('M200,378 L200,490', shade(oc, -0.25), 4));
      [400, 430, 460].forEach(y => g.append(s('circle', { cx: 200, cy: y, r: 5, fill: shade(oc, -0.3) })));
      g.append(P('M168,344 L200,380 L182,394 L156,356Z', '#fff'), P('M232,344 L200,380 L218,394 L244,356Z', '#fff'));
      break;
    case 'hoodie':
      g.append(line('M186,370 L182,432', '#fff', 5), line('M214,370 L218,432', '#fff', 5));
      g.append(P('M150,440 L250,440 L262,494 L138,494Z', shade(oc, -0.08)));
      break;
    case 'seragam':
      g.append(P('M130,352 L200,420 L270,352 Q286,356 292,372 L200,452 L108,372 Q114,356 130,352Z', oc));
      g.append(line('M122,374 L200,440 L278,374', '#fff', 4));
      g.append(P('M200,430 L170,414 L172,448Z', '#E2475B'), P('M200,430 L230,414 L228,448Z', '#E2475B'), circ(200, 430, 9, '#E2475B'));
      break;
    case 'jas':
      g.append(P('M170,346 L200,432 L230,346Z', '#fff'));
      g.append(P('M193,362 L207,362 L213,424 L200,442 L187,424Z', c.tie));
      g.append(line('M170,346 L190,444', shade(oc, -0.35), 5), line('M230,346 L210,444', shade(oc, -0.35), 5));
      break;
  }
  if (c.rok) g.append(P('M112,484 L288,484 L306,540 L94,540Z', c.bottom), line('M160,490 L150,538 M200,490 L200,538 M240,490 L250,538', shade(c.bottom, -0.3), 3));
}

function drawCoin(g) {
  g.append(line('M165,450 L160,560', OUT, 12), line('M235,450 L240,560', OUT, 12));
  g.append(ell(152, 566, 30, 14, '#E2475B'), ell(248, 566, 30, 14, '#E2475B'));
  g.append(circ(200, 262, 184, '#F6C343', { 'stroke-width': 6 }));
  g.append(s('circle', { cx: 200, cy: 262, r: 156, fill: 'none', stroke: '#E0A526', 'stroke-width': 9 }));
  g.append(line('M76,190 Q100,120 160,96', '#FFF1B8', 12, { opacity: 0.8 }));
  g.append(s('text', { x: 200, y: 412, 'text-anchor': 'middle', 'font-size': 44, 'font-weight': 800, fill: '#D99A1C', 'font-family': 'Jakarta, sans-serif' }, 'Rp'));
}

// ---------- tangan ----------
function drawArms(c, g, pose, koin) {
  const table = koin ? KPOSE : POSE;
  const p = table[pose] || table.diri;
  const sh = koin ? KSH : SH;
  const sleeve = c.outfit === 'seragam' ? '#F7F7FC' : c.outfitColor;
  const hands = [];
  for (const k of pose === 'silang' ? ['L', 'R'] : ['R', 'L']) {
    const [el, hd, type] = p[k];
    const S = sh[k];
    const d = `M${S[0]},${S[1]} L${el[0]},${el[1]} L${hd[0]},${hd[1]}`;
    if (koin) g.append(line(d, OUT, 13));
    else {
      g.append(line(d, OUT, 42));
      if (c.outfit === 'kaos') {
        g.append(line(d, c.skin, 31));
        const m = [S[0] + (el[0] - S[0]) * 0.6, S[1] + (el[1] - S[1]) * 0.6];
        g.append(line(`M${S[0]},${S[1]} L${m[0]},${m[1]}`, OUT, 44), line(`M${S[0]},${S[1]} L${m[0]},${m[1]}`, sleeve, 33));
      } else g.append(line(d, sleeve, 31));
    }
    hands.push([hd, el, type]);
  }
  return () => hands.forEach(([hd, el, type]) => {
    const fill = koin ? '#fff' : c.skin;
    if (type === 'tunjuk') {
      const dx = hd[0] - el[0], dy = hd[1] - el[1], L = Math.hypot(dx, dy);
      const tip = `M${hd[0]},${hd[1]} l${(dx / L) * 34},${(dy / L) * 34}`;
      g.append(line(tip, OUT, 18), line(tip, fill, 9));
    }
    g.append(circ(hd[0], hd[1], type === 'buka' ? 24 : 20, fill));
    if (type === 'buka') g.append(line(`M${hd[0] - 10},${hd[1] - 22} l-4,-12 M${hd[0]},${hd[1] - 24} l0,-13 M${hd[0] + 10},${hd[1] - 22} l4,-12`, OUT, 5));
  });
}

function drawItem(g, item, koin) {
  const y = koin ? 440 : 405;
  const at = (els) => s('g', { transform: `translate(200,${y})` }, els);
  let el;
  switch (item) {
    case 'koin': el = at([circ(0, 0, 44, '#F6C343'), s('circle', { r: 31, fill: 'none', stroke: '#E0A526', 'stroke-width': 6 }), s('text', { y: 11, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 800, fill: '#B07D0E', 'font-family': 'Jakarta' }, 'Rp')]); break;
    case 'hp': el = at([P('M-36,-62 h72 a12,12 0 0 1 12,12 v100 a12,12 0 0 1 -12,12 h-72 a12,12 0 0 1 -12,-12 v-100 a12,12 0 0 1 12,-12Z', OUT), s('rect', { x: -38, y: -52, width: 76, height: 94, rx: 6, fill: '#7CC6FF' })]); break;
    case 'uang': el = at([P('M-70,-34 h140 v68 h-140Z', '#86D08A', { transform: 'rotate(-10)' }), P('M-70,-30 h140 v68 h-140Z', '#9BE09F', { transform: 'rotate(6)' }), circ(0, 4, 18, '#C9F2CB', { 'stroke-width': 4 })]); break;
    case 'dompet': el = at([P('M-60,-40 h120 v80 h-120Z', '#8B5E3C'), P('M-60,-40 h120 v30 h-120Z', '#A47148'), circ(40, -10, 8, '#F6C343', { 'stroke-width': 4 })]); break;
    case 'buku': el = at([P('M-62,-46 h124 v92 h-124Z', '#5B8CFF'), P('M-48,-46 v92', 'none'), s('rect', { x: -30, y: -28, width: 70, height: 16, rx: 4, fill: '#fff' })]); break;
    default: {
      const ic = ICONS[item];
      el = at([P('M-50,-50 h100 v100 h-100Z', '#fff', { rx: 16 }),
        ic ? s('g', { transform: 'translate(-34,-34) scale(2.8)', fill: 'none', stroke: OUT, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', html: ic })
          : s('text', { y: 18, 'text-anchor': 'middle', 'font-size': 54 }, item)]);
    }
  }
  g.append(el);
}

// ---------- efek manga ----------
const FX = {
  keringat: () => P('M338,120 Q354,150 350,168 Q344,186 326,180 Q314,170 322,150 Q328,136 338,120Z', '#9ADCFF', { 'stroke-width': 4 }),
  marah: () => s('g', { transform: 'translate(318,112)' }, ['M-26,-8 Q-8,-8 -8,-26', 'M8,-26 Q8,-8 26,-8', 'M26,8 Q8,8 8,26', 'M-8,26 Q-8,8 -26,8'].map(d => line(d, '#E5394A', 9))),
  tanya: () => [txt('?', 352, 96, 110, -12), txt('?', 300, 40, 64, 10)],
  seru: () => [txt('!', 350, 100, 120, 10), txt('!', 380, 70, 80, 18)],
  kilau: () => [[44, 120, 26], [352, 70, 34], [372, 230, 20], [30, 300, 18]].map(([x, y, r]) => s('path', { d: star4(x, y, r), fill: '#FFE066', stroke: OUT, 'stroke-width': 3 })),
  love: () => [[350, 90, 1], [30, 140, 0.7]].map(([x, y, k]) => P(`M${x},${y + 22 * k} C${x - 40 * k},${y - 6 * k} ${x - 18 * k},${y - 34 * k} ${x},${y - 14 * k} C${x + 18 * k},${y - 34 * k} ${x + 40 * k},${y - 6 * k} ${x},${y + 22 * k}Z`, '#FF5C8A', { 'stroke-width': 4 })),
  suram: () => s('g', { opacity: 0.55 }, [130, 160, 190, 220, 250, 280].map((x, i) => line(`M${x},${92 + (i % 2) * 14} L${x},${168 - (i % 3) * 8}`, '#3E3A6B', 6))),
  zzz: () => [txt('Z', 330, 100, 70, -10), txt('z', 372, 52, 50, -10), txt('z', 400, 18, 36, -10)],
  ide: () => s('g', { transform: 'translate(352,40)' }, [circ(0, 0, 30, '#FFE066'), P('M-12,26 h24 v14 h-24Z', '#C9C9D6'),
    ...[[0, -44, 0, -60], [36, -28, 50, -40], [-36, -28, -50, -40], [44, 4, 62, 4], [-44, 4, -62, 4]].map(([a, b, c2, d]) => line(`M${a},${b} L${c2},${d}`, '#F2A93B', 6))]),
  uang: () => [[40, 110, -14], [350, 60, 12], [380, 210, -8]].map(([x, y, r]) => s('g', { transform: `translate(${x},${y}) rotate(${r})` }, P('M-34,-18 h68 v36 h-68Z', '#9BE09F', { 'stroke-width': 4 }), circ(0, 0, 9, '#C9F2CB', { 'stroke-width': 3 }))),
};
const txt = (t, x, y, size, rot) => s('text', { x, y, 'font-size': size, 'font-family': 'Bangers, Jakarta, sans-serif', fill: OUT, transform: `rotate(${rot} ${x} ${y})`, 'text-anchor': 'middle' }, t);

/**
 * Gambar karakter. spec: { char, expr, pose, item, fx:[], flip, ...override warna/bagian }
 * cast: definisi tambahan dari file konten (karakter baru / gambar PNG sendiri).
 * Hasil: <svg viewBox="-40 -60 480 680"> — titik kepala ±(200,60), kaki ±(200,590).
 */
export function drawChara(spec = {}, cast = {}) {
  const key = spec.char || 'rina';
  const preset = cast[key] || CAST[key];
  if (!preset) throw new Error(`karakter "${key}" tidak dikenal. Pilihan: ${[...Object.keys(CAST), ...Object.keys(cast)].join(', ')} (atau definisikan di "cast")`);
  const base = spec.base || preset.base || (CAST[key] || {}).base;
  const c = { ...DEFAULT, ...(SPECIES[base] || ASPECIES[base] || {}), ...(CAST[key] || {}), ...preset, ...spec };
  const exprName = c.expr || 'netral';
  const ex = EXPR[exprName];
  if (!ex) throw new Error(`ekspresi "${exprName}" tidak dikenal. Pilihan: ${Object.keys(EXPR).join(', ')}`);
  const pose = c.pose || 'diri';
  if (!POSE[pose]) throw new Error(`pose "${pose}" tidak dikenal. Pilihan: ${Object.keys(POSE).join(', ')}`);
  const svg = s('svg', { viewBox: '-40 -60 480 680', class: 'chara', overflow: 'visible' });

  if (c.img) { // gambar milik sendiri (PNG transparan, rasio 480:680 disarankan)
    const href = '/' + c.img.replace(/^\/+/, '').replace('{expr}', exprName).replace('{pose}', pose);
    svg.append(s('image', { href, x: -40, y: -60, width: 480, height: 680, preserveAspectRatio: 'xMidYMax meet', transform: c.flip ? 'translate(400,0) scale(-1,1)' : null }));
    return svg;
  }
  const g = s('g', { transform: c.flip ? 'translate(400,0) scale(-1,1)' : null });
  if (SPECIES[c.base] || ASPECIES[c.base]) {
    const feat = (gg, F, sp) => drawFeatures(gg, F, sp, c, ex);
    if (ASPECIES[c.base]) drawAnthro(c, g, pose, feat, drawItem); else drawMaskot(c, g, pose, feat, drawItem);
    svg.append(g);
    const fx = [...(ex.fx || []), ...[].concat(c.fx || [])].filter((v, i, a) => a.indexOf(v) === i);
    for (const f of fx) if (FX[f]) svg.append(...[].concat(FX[f]()));
    return svg;
  }
  const koin = c.base === 'koin';
  if (koin) {
    drawCoin(g);
  } else {
    if (c.hair !== 'hijab') drawHairBack(c, g);
    drawBody(c, g);
    if (c.hair === 'hijab') g.append(P(HIJAB_OUTER, c.hairColor));
  }
  const finishHands = drawArms(c, g, pose, koin);
  drawFace(c, g, ex);
  if (!koin) {
    if (c.hair === 'hijab') {
      g.append(P(HIJAB_OUTER + ' ' + FACE_HOLE, c.hairColor, { 'fill-rule': 'evenodd' }));
      g.append(line('M110,150 Q200,96 290,150', shade(c.hairColor, -0.2), 5, { opacity: 0.6 }));
    } else drawHairFront(c, g);
  }
  drawBrows(c, g, ex);
  const acc = [].concat(c.acc || []);
  if (acc.includes('kumis')) g.append(P('M200,272 C186,262 160,268 150,286 C170,280 186,283 200,279 C214,283 230,280 250,286 C240,268 214,262 200,272Z', shade(c.hairColor, -0.25), { 'stroke-width': 3 }));
  if (acc.includes('kacamata')) {
    [EYE.L, EYE.R].forEach(([x, y]) => g.append(s('rect', { x: x - 42, y: y - 34, width: 84, height: 72, rx: 22, fill: 'rgba(255,255,255,.18)', stroke: OUT, 'stroke-width': 6 })));
    g.append(line('M188,214 Q200,206 212,214', OUT, 6));
  }
  if (POSE[pose].item && c.item) drawItem(g, c.item, koin);
  finishHands();
  svg.append(g);
  const fx = [...(ex.fx || []), ...[].concat(c.fx || [])].filter((v, i, a) => a.indexOf(v) === i);
  for (const f of fx) if (FX[f]) svg.append(...[].concat(FX[f]()));
  return svg;
}
export const FX_NAMES = Object.keys(FX);
