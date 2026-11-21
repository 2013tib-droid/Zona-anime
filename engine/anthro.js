// Maskot hewan antropomorfik proporsi "dewasa tapi gemes": kepala ±40% tinggi badan,
// badan & kaki lebih panjang, baju stylish, mata tetap besar.
// Dipanggil dari drawChara bila base = 'oren' | 'harimau'.
import { s } from './core.js';

const OUT = '#2B2233';
const P = (d, fill = 'none', o = {}) => s('path', { d, fill, stroke: OUT, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', ...o });
const L = (d, color = OUT, w = 8, o = {}) => s('path', { d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...o });
const C = (cx, cy, r, fill, o = {}) => s('circle', { cx, cy, r, fill, stroke: OUT, 'stroke-width': 5, ...o });
function shade(hex, f) {
  let x = String(hex).replace('#', '');
  if (x.length === 3) x = [...x].map(v => v + v).join('');
  const n = parseInt(x, 16), t = f < 0 ? 0 : 255, p = Math.abs(f);
  return `rgb(${[n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round((t - v) * p + v)).join(',')})`;
}

export const ASPECIES = {
  // kucing oren: ikon internet Indonesia, santai tapi cerdas
  oren: { fur: '#F5A04A', stripe: '#D47128', muzzle: '#FFF4E6', ear: '#FFC9C2', skin: '#F5A04A', eyes: '#3FA66B', hairColor: '#B85F1E',
    jacket: '#2F3E66', tee: '#FFF4E6', logo: '#F07A2A', pants: '#C8B593', shoe: '#FFFFFF', sole: '#F07A2A' },
  // harimau sumatra: kuat, berani, khas Indonesia
  harimau: { fur: '#F08A24', stripe: '#2B2233', muzzle: '#FFF8EE', ear: '#FFE3C4', skin: '#F08A24', eyes: '#C98A12', hairColor: '#2B2233',
    jacket: '#2F6B4F', tee: '#FFFFFF', logo: '#2F6B4F', pants: '#3B4F7A', shoe: '#FFFFFF', sole: '#2F6B4F' },
};
export const AFACE = { eyes: [[158, 150], [242, 150]], k: 0.94, mouth: [200, 232], mk: 0.62, blush: 200, bk: 0.75, bo: 0.4, browDy: 2, nose: [200, 206] };

// [siku, tangan, jenis]; koordinat akhir
const SH = { L: [140, 292], R: [260, 292] };
const DL = [[116, 360], [120, 422]], DR = [[284, 360], [280, 422]];
export const APOSE = {
  diri: { L: DL, R: DR },
  tunjuk: { L: DL, R: [[322, 250], [342, 184], 'tunjuk'] },
  sorak: { L: [[90, 222], [108, 140]], R: [[310, 222], [292, 140]] },
  pikir: { L: [[120, 380], [176, 372]], R: [[292, 350], [226, 252]] },
  panik: { L: [[66, 222], [90, 108]], R: [[334, 222], [310, 108]] },
  lambai: { L: DL, R: [[324, 252], [336, 172], 'buka'] },
  jelasin: { L: DL, R: [[316, 356], [366, 318], 'buka'] },
  pegang: { L: [[126, 384], [176, 352]], R: [[274, 384], [224, 352]], item: true },
  silang: { L: [[118, 372], [252, 348]], R: [[282, 372], [148, 338]] },
  tepokjidat: { L: DL, R: [[304, 300], [228, 104], 'buka'] },
  saku: { L: [[112, 352], [150, 404], 'saku'], R: [[288, 352], [250, 404], 'saku'] },
  jempol: { L: DL, R: [[322, 336], [332, 262], 'jempol'] },
};

function body(c, g) {
  // ekor
  g.append(P('M262,410 C336,420 366,370 346,318 C340,302 322,308 326,326 C338,362 316,390 262,392Z', c.fur));
  if (c.base === 'harimau') g.append(L('M330,336 l18,-6 M340,366 l18,4 M318,392 l10,16', c.stripe, 7));
  // celana & sepatu
  g.append(P('M134,432 L198,432 L194,556 L146,556Z', c.pants), P('M202,432 L266,432 L254,556 L206,556Z', c.pants));
  g.append(L('M148,544 L192,544 M208,544 L252,544', shade(c.pants, -0.25), 4));
  g.append(P('M140,552 L196,552 L200,582 Q160,592 118,586 Q114,564 140,552Z', c.shoe), P('M260,552 L204,552 L200,582 Q240,592 282,586 Q286,564 260,552Z', c.shoe));
  g.append(L('M120,580 Q160,588 199,578 M280,580 Q240,588 201,578', c.sole, 7));
  // leher, kaos, jaket
  g.append(P('M140,272 Q200,238 260,272 Q232,290 200,290 Q168,290 140,272Z', shade(c.jacket, -0.2))); // tudung di punggung
  g.append(P('M184,246 L216,246 L218,282 L182,282Z', c.fur));
  g.append(P('M158,272 L242,272 L248,436 L152,436Z', c.tee));
  g.append(s('text', { x: 200, y: 372, 'text-anchor': 'middle', 'font-size': 62, 'font-weight': 800, fill: c.logo, 'font-family': 'Jakarta, sans-serif' }, 'Z'));
  g.append(P('M142,270 Q118,276 110,304 L116,444 L174,444 L170,300 Q168,282 160,272Z', c.jacket));
  g.append(P('M258,270 Q282,276 290,304 L284,444 L226,444 L230,300 Q232,282 240,272Z', c.jacket));
  g.append(s('path', { d: 'M117,428 L174,428 L174,444 L116,444Z M283,428 L226,428 L226,444 L284,444Z', fill: shade(c.jacket, -0.25) }));
  g.append(L('M170,300 L172,428 M230,300 L228,428', shade(c.jacket, 0.3), 3));
  if (c.lanyard) g.append(L('M182,282 L194,330 M218,282 L206,330', c.logo, 5));
}

function head(c, g) {
  const st = c.stripe;
  // telinga
  g.append(P('M96,100 C84,52 90,10 108,-6 C136,10 158,38 168,62Z', c.fur), P('M304,100 C316,52 310,10 292,-6 C264,10 242,38 232,62Z', c.fur));
  g.append(s('path', { d: 'M108,78 C102,48 106,24 114,14 C132,26 146,44 152,58Z', fill: c.ear }), s('path', { d: 'M292,78 C298,48 294,24 286,14 C268,26 254,44 248,58Z', fill: c.ear }));
  if (c.base === 'harimau') g.append(s('path', { d: 'M108,-6 C114,10 112,24 104,34 C98,14 100,4 108,-6Z M292,-6 C286,10 288,24 296,34 C302,14 300,4 292,-6Z', fill: st }));
  // kepala dengan jambang pipi
  g.append(P('M82,156 C80,86 130,38 200,38 C270,38 320,86 318,156 C318,178 328,190 324,204 C310,204 304,220 292,230 C270,252 236,264 200,264 C164,264 130,252 108,230 C96,220 90,204 76,204 C72,190 82,178 82,156Z', c.fur));
  // corak
  if (c.base === 'harimau') {
    g.append(s('path', { d: 'M200,46 L188,64 L200,90 L212,64Z', fill: st }));
    g.append(L('M160,56 Q170,72 166,90 M240,56 Q230,72 234,90', st, 9));
    g.append(L('M88,150 l30,8 M86,172 l34,0 M312,150 l-30,8 M314,172 l-34,0', st, 9));
    g.append(s('ellipse', { cx: 160, cy: 112, rx: 26, ry: 10, fill: c.muzzle }), s('ellipse', { cx: 240, cy: 112, rx: 26, ry: 10, fill: c.muzzle }));
  } else {
    g.append(L('M178,54 L184,86 M200,48 L200,88 M222,54 L216,86', st, 8));
    g.append(L('M90,160 l28,6 M92,180 l26,0 M310,160 l-28,6 M308,180 l-26,0', st, 7));
  }
  // moncong putih
  g.append(s('path', { d: 'M140,220 C140,194 168,184 200,192 C232,184 260,194 260,220 C260,248 232,260 200,260 C168,260 140,248 140,220Z', fill: c.muzzle }));
  // kumis
  g.append(L('M132,210 l-52,-8 M132,224 l-50,6 M268,210 l52,-8 M268,224 l50,6', OUT, 3));
}

function arms(c, g, pose) {
  const p = APOSE[pose] || APOSE.diri;
  const hands = [];
  for (const k of pose === 'silang' ? ['L', 'R'] : ['R', 'L']) {
    const [el, hd, type] = p[k];
    const S = SH[k];
    const d = `M${S[0]},${S[1]} L${el[0]},${el[1]} L${hd[0]},${hd[1]}`;
    g.append(L(d, OUT, 40), L(d, c.jacket, 30));
    if (type === 'saku') { g.append(L(`M${hd[0] - 18},${hd[1] + 4} l36,0`, shade(c.jacket, -0.35), 5)); continue; }
    // manset
    const dx = hd[0] - el[0], dy = hd[1] - el[1], len = Math.hypot(dx, dy);
    const cx = hd[0] - (dx / len) * 20, cy = hd[1] - (dy / len) * 20;
    g.append(L(`M${cx - (dx / len) * 4},${cy - (dy / len) * 4} L${cx},${cy}`, shade(c.jacket, -0.25), 30));
    hands.push([hd, el, type]);
  }
  return () => hands.forEach(([hd, el, type]) => {
    if (type === 'tunjuk') {
      const dx = hd[0] - el[0], dy = hd[1] - el[1], l = Math.hypot(dx, dy);
      const tip = `M${hd[0]},${hd[1]} l${(dx / l) * 32},${(dy / l) * 32}`;
      g.append(L(tip, OUT, 17), L(tip, c.fur, 8));
    }
    if (type === 'jempol') g.append(s('ellipse', { cx: hd[0] - 4, cy: hd[1] - 26, rx: 9, ry: 17, fill: c.fur, stroke: OUT, 'stroke-width': 5 }));
    g.append(C(hd[0], hd[1], type === 'buka' ? 24 : 21, c.fur));
    if (type === 'buka') g.append(L(`M${hd[0] - 10},${hd[1] - 21} l-4,-11 M${hd[0]},${hd[1] - 23} l0,-12 M${hd[0] + 10},${hd[1] - 21} l4,-11`, OUT, 5));
    else g.append(L(`M${hd[0] - 8},${hd[1] - 6} l0,9 M${hd[0] + 4},${hd[1] - 6} l0,9`, shade(c.fur, -0.3), 4));
  });
}

export function drawAnthro(c, g, pose, drawFeatures, drawItem) {
  body(c, g);
  const finish = arms(c, g, pose);
  head(c, g);
  drawFeatures(g, AFACE, 'anthro');
  if ([].concat(c.acc || []).includes('kacamata')) {
    AFACE.eyes.forEach(([x, y]) => g.append(s('circle', { cx: x, cy: y + 4, r: 31, fill: 'rgba(255,255,255,.15)', stroke: OUT, 'stroke-width': 5 })));
    g.append(L('M190,150 Q200,144 210,150', OUT, 5));
  }
  if (APOSE[pose].item && c.item) g.append(s('g', { transform: 'translate(0,-60) scale(1)' }, (() => { const tmp = s('g'); drawItem(tmp, c.item); return tmp; })()));
  finish();
}
