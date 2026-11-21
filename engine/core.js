// Inti mesin animasi Zona Anime.
// Semua animasi DETERMINISTIK: tampilan dihitung murni dari waktu t (detik),
// jadi bisa di-render frame-per-frame menjadi video tanpa patah-patah.

export const registry = {};

/**
 * Daftarkan komponen ke bank.
 * def = { doc, required:[props wajib], dur(props)->detik, build(props, ctx)->{ el, update(t, dur), pose? } }
 */
export function define(type, def) { registry[type] = def; }

// ---------- matematika & easing ----------
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, p) => a + (b - a) * p;
export const ease = {
  linear: x => x,
  outCubic: x => 1 - Math.pow(1 - x, 3),
  outQuart: x => 1 - Math.pow(1 - x, 4),
  inOutCubic: x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  outExpo: x => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  outBack: x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
};
/** progres 0..1 dari detik `start` selama `len` detik, dengan easing */
export const prog = (t, start, len = 0.6, e = ease.outCubic) => e(clamp((t - start) / len));

// ---------- DOM ----------
export function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  setAttrs(el, attrs);
  append(el, kids);
  return el;
}
const SVGNS = 'http://www.w3.org/2000/svg';
export function s(tag, attrs = {}, ...kids) {
  const el = document.createElementNS(SVGNS, tag);
  setAttrs(el, attrs);
  append(el, kids);
  return el;
}
function setAttrs(el, attrs) {
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.setAttribute('class', v);
    else if (k === 'style') typeof v === 'string' ? (el.style.cssText = v) : Object.assign(el.style, v);
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v);
  }
}
function append(el, kids) {
  for (const c of kids.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
}

// ---------- teks ----------
export const esc = str => String(str).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
/** *kata* -> sorotan warna aksen, \n -> baris baru */
export const rich = (str = '') => esc(str).replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
/** Pecah teks jadi span per kata (untuk animasi kata-per-kata). Mendukung *sorotan* dan \n */
export function words(str = '') {
  const el = h('span', { class: 'words' });
  const items = [];
  let hl = false;
  for (const tok of String(str).split(/(\*|\n|\s+)/)) {
    if (!tok) continue;
    if (tok === '*') { hl = !hl; continue; }
    if (tok === '\n') { el.append(h('br')); continue; }
    if (/^\s+$/.test(tok)) { el.append(' '); continue; }
    const w = h('span', { class: 'w' + (hl ? ' hl' : '') }, tok);
    el.append(w); items.push(w);
  }
  return { el, items };
}
export const wordCount = (str = '') => String(str).split(/\s+/).filter(Boolean).length;

// ---------- angka (format Indonesia) ----------
const num = (v, d) => Number(v).toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });
function compact(v, d) {
  const a = Math.abs(v);
  const [div, unit] = a >= 1e12 ? [1e12, ' T'] : a >= 1e9 ? [1e9, ' M'] : a >= 1e6 ? [1e6, ' jt'] : a >= 1e3 ? [1e3, ' rb'] : [1, ''];
  return Number(v / div).toLocaleString('id-ID', { maximumFractionDigits: d ?? 1 }) + unit;
}
/**
 * format: 'number' (default) | 'rupiah' | 'rupiah-compact' | 'compact' | 'percent'
 * opsi: decimals, prefix, suffix
 */
export function fmt(v, o = {}) {
  const d = o.decimals ?? 0;
  let str;
  switch (o.format) {
    case 'rupiah': str = (v < 0 ? '−' : '') + 'Rp' + num(Math.abs(v), d); break;
    case 'rupiah-compact': str = (v < 0 ? '−' : '') + 'Rp' + compact(Math.abs(v), o.decimals); break;
    case 'compact': str = compact(v, o.decimals); break;
    case 'percent': str = num(v, d) + '%'; break;
    default: str = num(v, d);
  }
  return (o.prefix || '') + str + (o.suffix || '');
}
/** Ambil opsi format dari props (agar komponen bisa meneruskan format global/per-item) */
export const fmtOpts = (...objs) => Object.assign({}, ...objs.map(o => o && {
  ...(o.format != null && { format: o.format }), ...(o.decimals != null && { decimals: o.decimals }),
  ...(o.prefix != null && { prefix: o.prefix }), ...(o.suffix != null && { suffix: o.suffix }),
}));

// ---------- helper gerak (dipanggil di update) ----------
export function fadeUp(el, p, dist = 50) {
  if (!el) return;
  el.style.opacity = clamp(p);
  el.style.transform = `translateY(${(1 - p) * dist}px)`;
}
export function fadeIn(el, p) { if (el) el.style.opacity = clamp(p); }
export function popIn(el, p) {
  if (!el) return;
  el.style.opacity = clamp(p * 2);
  el.style.transform = `scale(${lerp(0.3, 1, p)})`;
}
export function slideIn(el, p, dist = 140) {
  if (!el) return;
  el.style.opacity = clamp(p);
  el.style.transform = `translateX(${(1 - p) * dist}px)`;
}
/** Sapuan stabilo di bawah kata sorotan (pakai var --m pada <em>/.hl) */
export function marker(el, p) { if (el) el.style.setProperty('--m', clamp(p)); }
/** Animasi kata-per-kata untuk hasil words() */
export function revealWords(items, t, start = 0, gap = 0.07) {
  items.forEach((w, i) => {
    const st = start + i * gap;
    fadeUp(w, prog(t, st, 0.5), 36);
    if (w.classList.contains('hl')) marker(w, prog(t, st + 0.3, 0.5));
  });
  return start + items.length * gap;
}
