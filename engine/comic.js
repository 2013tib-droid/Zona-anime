// Alat komik: latar panel, balon kata, SFX, dan penempatan karakter di panel.
import { h, s, rich } from './core.js';
import { drawChara } from './chara.js';

const OUT = '#2B2233';
let uid = 0;
const rnd = seed => () => ((seed = (seed * 16807) % 2147483647) / 2147483647); // acak tapi tetap (deterministik)
const star4 = (x, y, r) => `M${x},${y - r} Q${x + r * .18},${y - r * .18} ${x + r},${y} Q${x + r * .18},${y + r * .18} ${x},${y + r} Q${x - r * .18},${y + r * .18} ${x - r},${y} Q${x - r * .18},${y - r * .18} ${x},${y - r}Z`;

export const BG_NAMES = ['polos', 'fokus', 'kilau', 'suram', 'halftone', 'ruang', 'luar', 'kota', 'uang', 'kantor'];

/** Latar panel sebagai <svg> ukuran w×h. kind: salah satu BG_NAMES atau warna hex. */
export function panelBg(kind = 'polos', w, h, color) {
  const id = 'p' + (++uid);
  const r = rnd(uid * 7919 + 13);
  const svg = s('svg', { width: w, height: h, viewBox: `0 0 ${w} ${h}`, style: 'position:absolute;inset:0' });
  const rect = (fill, o = {}) => s('rect', { x: 0, y: 0, width: w, height: h, fill, ...o });
  if (/^#|^rgb/.test(kind)) { color = kind; kind = 'polos'; }
  switch (kind) {
    case 'fokus': { // garis konsentrasi manga
      svg.append(rect(color || '#fff'));
      const cx = w / 2, cy = h * 0.45, R = Math.hypot(w, h);
      for (let i = 0; i < 90; i++) {
        const a = (i / 90) * Math.PI * 2 + r() * 0.05, a2 = a + 0.012 + r() * 0.02, r0 = Math.min(w, h) * (0.3 + r() * 0.22);
        svg.append(s('path', { d: `M${cx + Math.cos(a) * r0},${cy + Math.sin(a) * r0} L${cx + Math.cos(a) * R},${cy + Math.sin(a) * R} L${cx + Math.cos(a2) * R},${cy + Math.sin(a2) * R}Z`, fill: OUT, opacity: 0.85 }));
      }
      break;
    }
    case 'kilau':
      svg.append(s('defs', {}, s('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 1 }, s('stop', { offset: 0, 'stop-color': '#FFE3F1' }), s('stop', { offset: 1, 'stop-color': '#FFF5CF' }))));
      svg.append(rect(`url(#${id})`));
      for (let i = 0; i < 14; i++) svg.append(s('circle', { cx: r() * w, cy: r() * h, r: 20 + r() * 50, fill: '#fff', opacity: 0.55 }));
      for (let i = 0; i < 12; i++) svg.append(s('path', { d: star4(r() * w, r() * h, 10 + r() * 22), fill: i % 2 ? '#FFD34D' : '#fff' }));
      break;
    case 'suram':
      svg.append(s('defs', {}, s('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, s('stop', { offset: 0, 'stop-color': '#3B3756' }), s('stop', { offset: 1, 'stop-color': '#8A85A8' }))));
      svg.append(rect(`url(#${id})`));
      for (let x = 10; x < w; x += 22 + r() * 18) svg.append(s('path', { d: `M${x},0 L${x + (r() - 0.5) * 10},${h * (0.35 + r() * 0.4)}`, stroke: '#1D1B2E', 'stroke-width': 2 + r() * 3, opacity: 0.6 }));
      break;
    case 'halftone':
      svg.append(s('defs', {}, s('pattern', { id, width: 22, height: 22, patternUnits: 'userSpaceOnUse' }, s('circle', { cx: 11, cy: 11, r: 5, fill: OUT, opacity: 0.14 }))));
      svg.append(rect(color || '#FFE9A8'), rect(`url(#${id})`));
      break;
    case 'uang':
      svg.append(rect(color || '#DFF5E1'));
      for (let i = 0; i < 18; i++) {
        const x = r() * w, y = r() * h, k = 0.6 + r() * 0.8;
        svg.append(i % 3 ? s('circle', { cx: x, cy: y, r: 26 * k, fill: '#F6C343', stroke: '#E0A526', 'stroke-width': 5, opacity: 0.7 })
          : s('rect', { x, y, width: 80 * k, height: 42 * k, rx: 6, fill: '#9BE09F', opacity: 0.7, transform: `rotate(${(r() - 0.5) * 40} ${x} ${y})` }));
      }
      break;
    case 'ruang': {
      const floor = h * 0.8;
      svg.append(rect(color || '#F6EBDD'), s('rect', { x: 0, y: floor, width: w, height: h - floor, fill: '#D8BE9E' }),
        s('path', { d: `M0,${floor} L${w},${floor}`, stroke: OUT, 'stroke-width': 4 }));
      const ww = Math.min(240, w * 0.3), wx = w - ww - w * 0.08, wy = h * 0.12;
      svg.append(s('rect', { x: wx, y: wy, width: ww, height: ww * 0.85, fill: '#BFE6FF', stroke: OUT, 'stroke-width': 5 }),
        s('path', { d: `M${wx + ww / 2},${wy} v${ww * 0.85} M${wx},${wy + ww * 0.42} h${ww}`, stroke: OUT, 'stroke-width': 5 }),
        s('rect', { x: w * 0.08, y: h * 0.18, width: Math.min(140, w * 0.18), height: Math.min(100, h * 0.16), fill: '#FFD8A8', stroke: OUT, 'stroke-width': 5 }));
      break;
    }
    case 'kantor': {
      svg.append(rect(color || '#E9EEF6'));
      for (let x = 0; x < w; x += 120) svg.append(s('rect', { x: x + 10, y: h * 0.1, width: 100, height: h * 0.45, fill: '#C9D9F0', stroke: '#9FB3D1', 'stroke-width': 4 }));
      svg.append(s('rect', { x: 0, y: h * 0.72, width: w, height: h * 0.28, fill: '#B9C3D3' }), s('path', { d: `M0,${h * 0.72} H${w}`, stroke: OUT, 'stroke-width': 4 }));
      break;
    }
    case 'luar':
    case 'kota': {
      svg.append(s('defs', {}, s('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, s('stop', { offset: 0, 'stop-color': kind === 'kota' ? '#FFB58A' : '#8FD3FF' }), s('stop', { offset: 1, 'stop-color': kind === 'kota' ? '#FFE3C2' : '#E3F5FF' }))));
      svg.append(rect(`url(#${id})`));
      for (let i = 0; i < 4; i++) {
        const x = r() * w, y = h * (0.1 + r() * 0.3), k = 0.6 + r() * 0.6;
        svg.append(s('path', { d: `M${x},${y} a${30 * k},${30 * k} 0 0 1 ${55 * k},-${10 * k} a${36 * k},${36 * k} 0 0 1 ${60 * k},${14 * k} a${24 * k},${24 * k} 0 0 1 0,${34 * k} h-${115 * k} a${20 * k},${20 * k} 0 0 1 0,-${38 * k}Z`, fill: '#fff', opacity: 0.9 }));
      }
      let x = 0;
      while (x < w) {
        const bw = 60 + r() * 90, bh = h * (0.18 + r() * (kind === 'kota' ? 0.4 : 0.2));
        svg.append(s('rect', { x, y: h * 0.82 - bh, width: bw - 6, height: bh, fill: kind === 'kota' ? '#7A6A9A' : '#A9C7E8', opacity: kind === 'kota' ? 0.75 : 0.6 }));
        x += bw;
      }
      svg.append(s('rect', { x: 0, y: h * 0.82, width: w, height: h * 0.18, fill: kind === 'kota' ? '#6B5B86' : '#9ED88A' }), s('path', { d: `M0,${h * 0.82} H${w}`, stroke: OUT, 'stroke-width': 4 }));
      break;
    }
    default: svg.append(rect(color || '#fff'));
  }
  return svg;
}

// Framing karakter: rentang y viewBox yang terlihat [atas, bawah] dan porsi tinggi panel
const SHOT = { full: [-40, 600, 0.9], bust: [-40, 480, 0.82], close: [-40, 360, 0.8] };

/** Tempatkan karakter di kotak w×h. Mengembalikan {el, head:[x,y]} (koordinat kotak). */
export function placeChara(spec, w, h, cast, defX = 0.5) {
  const [y0, y1, frac] = SHOT[spec.shot || 'bust'] || SHOT.bust;
  let k = (frac * h) / (y1 - y0);
  if (spec.maxW) k = Math.min(k, spec.maxW / 400);
  k *= spec.scale || 1;
  const x = (spec.x ?? defX * 100) / 100 * w;
  const top = h - (y1 + 60) * k + (spec.dy || 0);
  const { maxW, ...rest } = spec;
  const el = drawChara(rest, cast);
  Object.assign(el.style, { position: 'absolute', left: x - 240 * k + 'px', top: top + 'px', width: 480 * k + 'px', height: 680 * k + 'px', overflow: 'visible' });
  return { el, head: [x, top + 100 * k], k };
}

/** Balon kata. type: speech | think | shout | narr | bisik */
export function bubble(b) {
  const type = b.type || 'speech';
  const el = h('div', { class: `bubble b-${type}`, html: rich(b.text || '') });
  if (b.size) el.style.fontSize = b.size + 'px';
  return el;
}

/**
 * Susun balon di kotak w×h: ditumpuk dari atas sesuai urutan, di atas pembicara (who),
 * lalu gambar ekor menuju kepala pembicara. Dipanggil setelah elemen masuk DOM.
 */
export function layoutBubbles(box, items, w, h, heads, opt = {}) {
  const placed = []; // kotak balon yang sudah ditaruh: balon baru turun hanya jika bertabrakan
  const tails = s('svg', { width: w, height: h, style: 'position:absolute;inset:0;overflow:visible;pointer-events:none;z-index:4' });
  for (const it of items) {
    const { el, b } = it;
    const head = heads[b.who ?? 0] || [w / 2, h];
    const maxW = b.w ? (b.w / 100) * w : Math.min(opt.maxW || 560, w * (heads.length > 1 ? 0.56 : 0.72));
    el.style.maxWidth = maxW + 'px';
    const bw = el.offsetWidth, bh = el.offsetHeight;
    let left = b.x != null ? (b.x / 100) * w - bw / 2 : head[0] - bw / 2;
    left = Math.max(12, Math.min(w - bw - 12, left));
    if (b.type === 'narr' && b.x == null) left = 12;
    let top = opt.top ?? 14;
    if (b.y != null) top = (b.y / 100) * h;
    else for (const r of placed) if (left < r.x + r.w + 8 && left + bw > r.x - 8) top = Math.max(top, r.y + r.h + 12);
    placed.push({ x: left, y: top, w: bw, h: bh });
    el.style.left = left + 'px'; el.style.top = top + 'px';
    const bx = Math.max(left + 30, Math.min(left + bw - 30, head[0])), by = top + bh;
    if (b.type === 'think') {
      const dx = head[0] - bx, dy = head[1] - by;
      [[0.25, 13], [0.5, 9], [0.72, 6]].forEach(([f, r]) => tails.append(s('circle', { cx: bx + dx * f * 0.8, cy: by + 10 + dy * f * 0.6, r, fill: '#fff', stroke: OUT, 'stroke-width': 4 })));
    } else if (b.type === 'shout') {
      const sv = s('svg', { width: bw + 60, height: bh + 60, style: `position:absolute;left:${left - 30}px;top:${top - 30}px;overflow:visible;z-index:4` });
      const cx = (bw + 60) / 2, cy = (bh + 60) / 2, n = 22;
      const pts = Array.from({ length: n * 2 }, (_, i) => { const a = (i / (n * 2)) * Math.PI * 2, rr = i % 2 ? 0.78 : 1.06; return `${cx + Math.cos(a) * cx * rr},${cy + Math.sin(a) * cy * rr}`; });
      sv.append(s('polygon', { points: pts.join(' '), fill: '#fff', stroke: OUT, 'stroke-width': 5, 'stroke-linejoin': 'round' }));
      box.insertBefore(sv, el);
    } else if (b.type !== 'narr' && b.tail !== false && head[1] > by + 10) {
      const dx = head[0] - bx, dy = head[1] - by, L = Math.hypot(dx, dy), len = Math.min(L - 16, 80);
      const tx = bx + (dx / L) * len, ty = by + (dy / L) * len;
      tails.append(s('path', { d: `M${bx - 16},${by - 6} L${tx},${ty} L${bx + 16},${by - 6}`, fill: '#fff', stroke: OUT, 'stroke-width': 5, 'stroke-linejoin': 'round' }));
    }
  }
  box.append(tails);
}

/** Teks efek suara manga (DEG!, JREEENG, dll) */
export function sfx(f, w, h) {
  return h_sfx(f, w, h);
}
function h_sfx(f, w, hh) {
  return h('div', { class: 'sfx', style: { left: (f.x ?? 75) / 100 * w + 'px', top: (f.y ?? 20) / 100 * hh + 'px', fontSize: (f.size || 90) + 'px', transform: `translate(-50%,-50%) rotate(${f.rot ?? -10}deg)`, color: f.color || '#FF4D6D' } }, f.text);
}
