// Pemutar: membaca file konten JSON, menyusun scene dari bank, dan mengekspos
// window.__seek(t) supaya tools/render.js bisa merekam frame-per-frame.
//   ?c=/content/x.json  &f=reel|feed|square  &mode=video|carousel  &theme=...  &headless (dipakai render.js)
import { registry, h, clamp, prog, ease } from './core.js';
import { THEMES } from './themes.js';
import { icon } from './icons.js';
import '../bank/index.js';

const q = new URLSearchParams(location.search);
const MODE = q.get('mode') || 'video';
const HEADLESS = q.has('headless');
const EXIT = 0.4; // detik transisi keluar antar-scene
const HEIGHTS = { reel: 1920, feed: 1350, square: 1080 };
const stage = document.getElementById('stage');

main().catch(err => {
  const msg = String(err && err.message || err);
  stage.dataset.format = stage.dataset.format || 'reel';
  stage.append(h('div', { class: 'err' }, '⚠ ' + msg));
  window.__error = msg;
});

async function main() {
  const src = q.get('c');
  if (!src) throw new Error('Tambahkan ?c=/content/nama.json di URL');
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Tidak bisa membuka ${src} (${res.status})`);
  let data;
  try { data = JSON.parse(await res.text()); } catch (e) { throw new Error(`JSON tidak valid di ${src}:\n${e.message}`); }

  const format = q.get('f') || data.format || 'reel';
  if (!HEIGHTS[format]) throw new Error(`format "${format}" tidak dikenal. Pilihan: ${Object.keys(HEIGHTS).join(', ')}`);
  const themeName = q.get('theme') || data.theme || 'finansial';
  const theme = THEMES[themeName];
  if (!theme) throw new Error(`theme "${themeName}" tidak dikenal. Pilihan: ${Object.keys(THEMES).join(', ')}`);
  const vars = { ...theme, ...(data.accent && { accent: data.accent }) };
  for (const [k, v] of Object.entries(vars)) stage.style.setProperty('--' + k, v);
  stage.dataset.format = format;
  stage.dataset.mode = MODE;
  document.body.classList.toggle('render', HEADLESS);
  document.title = data.title || 'Zona Anime';
  const H = HEIGHTS[format];

  // --- validasi ---
  const list = Array.isArray(data.scenes) ? data.scenes : [];
  const errs = [];
  if (!list.length) errs.push('"scenes" kosong.');
  list.forEach((sc, i) => {
    const def = registry[sc.type];
    if (!def) return errs.push(`Scene ${i + 1}: type "${sc.type}" tidak dikenal.\nPilihan: ${Object.keys(registry).join(', ')}`);
    for (const r of def.required || []) if (sc[r] == null) errs.push(`Scene ${i + 1} (${sc.type}): prop "${r}" wajib diisi.`);
  });
  if (errs.length) throw new Error(errs.join('\n'));

  // --- latar ---
  const b1 = h('div', { class: 'blob b1' }), b2 = h('div', { class: 'blob b2' });
  stage.append(h('div', { class: 'bg' }, b1, b2));

  // --- scene ---
  const ctx = { format, H, theme: vars, data, MODE };
  const scenes = [];
  let t0 = 0;
  list.forEach((sc, i) => {
    const def = registry[sc.type];
    const built = def.build(sc, { ...ctx, index: i });
    const dur = sc.dur ?? Math.round(((def.dur ? def.dur(sc) : 3) + EXIT) * 10) / 10;
    const inner = h('div', { class: 'inner' }, built.el);
    const note = sc.source ? 'Sumber: ' + sc.source : sc.note;
    const srcEl = note && h('div', { class: 'source' }, note);
    const el = h('div', { class: 'scene' }, inner, srcEl);
    stage.append(el);
    scenes.push({ el, inner, srcEl, dur, start: t0, update: built.update, pose: built.pose ?? dur - EXIT - 0.05, type: sc.type });
    t0 += dur;
  });
  const total = t0;

  // --- chrome ---
  const handle = data.handle || '@zona.anime';
  const segs = scenes.map(() => h('i'));
  const page = h('div', { class: 'page' });
  const swipe = h('div', { class: 'swipe' }, 'Geser', icon('arrow-right'));
  stage.append(h('div', { class: 'chrome' },
    data.progress !== false && h('div', { class: 'segs' }, segs.map(i => h('div', { class: 'seg' }, i))),
    data.brand !== false && h('div', { class: 'brand' },
      h('div', { class: 'logo' }, (data.logo || handle.replace('@', '')[0] || 'Z').toUpperCase()),
      h('span', {}, handle), data.series && h('span', { class: 'series' }, data.series)),
    MODE === 'carousel' && [page, swipe]));

  await document.fonts.ready;

  // --- auto-fit: kecilkan scene yang kepanjangan ---
  for (const sc of scenes) {
    const cs = getComputedStyle(sc.el);
    const availH = sc.el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const availW = sc.el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const k = Math.min(1, availH / sc.inner.offsetHeight, availW / sc.inner.scrollWidth);
    if (k < 1) sc.inner.style.transform = `scale(${k * 0.98})`;
  }

  let current = -1;
  function seek(T) {
    T = clamp(T, 0, total);
    scenes.forEach((sc, i) => {
      const last = i === scenes.length - 1;
      const on = T >= sc.start && (T < sc.start + sc.dur || (last && T <= total));
      sc.el.classList.toggle('on', on);
      segs[i].style.width = clamp((T - sc.start) / sc.dur) * 100 + '%';
      if (!on) return;
      current = i;
      const t = T - sc.start;
      sc.update(t, sc.dur);
      const e = last || MODE === 'carousel' ? 0 : prog(t, sc.dur - EXIT, EXIT, ease.inOutCubic);
      sc.el.style.opacity = 1 - e;
      sc.el.style.transform = e ? `translateY(${-50 * e}px) scale(${1 - 0.04 * e})` : '';
      if (sc.srcEl) sc.srcEl.style.opacity = MODE === 'carousel' ? 1 : prog(t, 0.6, 0.5) * 0.85;
    });
    b1.style.transform = `translate(${-300 + Math.sin(T * 0.35) * 160}px, ${-260 + Math.cos(T * 0.27) * 140}px)`;
    b2.style.transform = `translate(${380 + Math.cos(T * 0.3) * 160}px, ${H - 700 + Math.sin(T * 0.22) * 160}px)`;
    page.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(scenes.length).padStart(2, '0');
    swipe.style.display = current === 0 ? '' : 'none';
    return current;
  }

  window.__seek = seek;
  window.__seekScene = i => seek(scenes[i].start + scenes[i].pose);
  window.__info = {
    total, format, W: 1080, H, title: data.title, caption: data.caption, audio: data.audio, audioVolume: data.audioVolume,
    scenes: scenes.map(({ start, dur, pose, type }) => ({ start, dur, pose, type })),
  };
  seek(HEADLESS ? scenes[0].pose : 0);
  window.__ready = true;
  if (!HEADLESS) preview(seek, total, scenes, format, themeName, H);
}

// ---------- UI pratinjau di browser ----------
function preview(seek, total, scenes, format, themeName, H) {
  const wrap = document.getElementById('wrap');
  let t = 0, playing = true, last = performance.now();
  const btn = h('button', {}, '❚❚');
  const range = h('input', { type: 'range', min: 0, max: total, step: 0.01, value: 0 });
  const time = h('span', { class: 'time' });
  const sel = (opts, val, on) => { const e = h('select', {}, opts.map(([v, l]) => h('option', { value: v, ...(v === val && { selected: '' }) }, l))); e.onchange = () => on(e.value); return e; };
  const reload = (k, v) => { q.set(k, v); location.search = q.toString(); };
  const sceneSel = sel(scenes.map((s, i) => [String(i), `${i + 1}. ${s.type}`]), '0', v => { t = scenes[+v].start + scenes[+v].pose; playing = false; });
  document.body.append(h('div', { id: 'ctrl' }, btn, time, range, sceneSel,
    sel(Object.keys(HEIGHTS).map(f => [f, f]), format, v => reload('f', v)),
    sel(Object.keys(THEMES).map(f => [f, f]), themeName, v => reload('theme', v)),
    sel([['video', 'video'], ['carousel', 'carousel']], MODE, v => reload('mode', v))));
  btn.onclick = () => { playing = !playing; if (t >= total) t = 0; };
  range.oninput = () => { t = +range.value; playing = false; };
  addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); btn.onclick(); }
    if (e.code === 'ArrowRight') t = Math.min(total, t + 1);
    if (e.code === 'ArrowLeft') t = Math.max(0, t - 1);
  });
  const fit = () => {
    const k = Math.min((innerWidth - 32) / 1080, (innerHeight - 74 - 32) / H);
    stage.style.transform = `scale(${k})`;
    wrap.style.width = 1080 * k + 'px'; wrap.style.height = H * k + 'px';
  };
  addEventListener('resize', fit); fit();
  (function loop(now) {
    if (playing) { t += (now - last) / 1000; if (t > total) t = 0; }
    last = now;
    const cur = seek(t);
    range.value = t; btn.textContent = playing ? '❚❚' : '▶';
    time.textContent = `${t.toFixed(1)} / ${total.toFixed(1)}s`;
    if (document.activeElement !== sceneSel) sceneSel.value = String(cur);
    requestAnimationFrame(loop);
  })(last);
}
