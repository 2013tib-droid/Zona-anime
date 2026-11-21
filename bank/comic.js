import { define, h, rich, prog, ease, fadeIn, fadeUp, clamp } from '../engine/core.js';
import { panelBg, placeChara, bubble, layoutBubbles, sfx } from '../engine/comic.js';

// Halaman komik/manga: 1–4 panel, karakter, balon kata, SFX, narasi.
const LAYOUT = {
  1: [[0, 0, 1, 1]],
  2: [[0, 0, 1, .5], [0, .5, 1, .5]],
  '2c': [[0, 0, .5, 1], [.5, 0, .5, 1]],
  3: [[0, 0, 1, .5], [0, .5, .5, .5], [.5, .5, .5, .5]],
  '3b': [[0, 0, .5, .5], [.5, 0, .5, .5], [0, .5, 1, .5]],
  '3r': [[0, 0, 1, 1 / 3], [0, 1 / 3, 1, 1 / 3], [0, 2 / 3, 1, 1 / 3]],
  4: [[0, 0, .5, .5], [.5, 0, .5, .5], [0, .5, .5, .5], [.5, .5, .5, .5]],
  '4r': [[0, 0, 1, .25], [0, .25, 1, .25], [0, .5, 1, .25], [0, .75, 1, .25]],
};
const DEFX = [[0.5], [0.27, 0.73], [0.2, 0.5, 0.8]];

define('comic', {
  full: true,
  required: ['panels'],
  dur: p => 1.2 + p.panels.length * 1.8,
  build(p, ctx) {
    const { w: W } = ctx.box;
    const title = p.title && h('div', { class: 'comic-title', html: rich(p.title) });
    const titleH = p.title ? 110 : 0;
    const H = ctx.box.h - titleH;
    const lay = LAYOUT[p.layout || p.panels.length];
    if (!lay) throw new Error(`comic: layout "${p.layout}" tidak dikenal. Pilihan: ${Object.keys(LAYOUT).join(', ')}`);
    if (lay.length !== p.panels.length) throw new Error(`comic: layout "${p.layout || p.panels.length}" butuh ${lay.length} panel, ada ${p.panels.length}`);
    const G = p.gap ?? 22;
    const panels = p.panels.map((pn, i) => {
      const [fx, fy, fw, fh] = lay[i];
      const x = fx * W + (fx > 0 ? G / 2 : 0), y = titleH + fy * H + (fy > 0 ? G / 2 : 0);
      const w = fw * W - (fx > 0 ? G / 2 : 0) - (fx + fw < 0.999 ? G / 2 : 0);
      const hh = fh * H - (fy > 0 ? G / 2 : 0) - (fy + fh < 0.999 ? G / 2 : 0);
      const iw = w - 12, ih = hh - 12; // dikurangi border
      const box = h('div', { class: 'panel', style: { left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px' } });
      box.append(panelBg(pn.bg || 'polos', iw, ih, pn.bgColor));
      const chars = [].concat(pn.chars || pn.char || []).map(c => (typeof c === 'string' ? { char: c } : c));
      const heads = chars.map((c, k) => {
        const pc = placeChara(c, iw, ih, ctx.data.cast, (DEFX[chars.length - 1] || DEFX[2])[k] ?? 0.5);
        box.append(pc.el);
        return pc.head;
      });
      const items = [].concat(pn.bubbles || []).map(b => { const el = bubble(b); box.append(el); return { el, b }; });
      if (pn.narr) { const el = bubble({ type: 'narr', text: pn.narr }); box.append(el); items.unshift({ el, b: { type: 'narr', text: pn.narr } }); }
      [].concat(pn.sfx || []).forEach(f => box.append(sfx(typeof f === 'string' ? { text: f } : f, iw, ih)));
      return { box, items, heads, iw, ih };
    });
    const el = h('div', { style: { position: 'relative', width: W + 'px', height: ctx.box.h + 'px' } }, title, panels.map(x => x.box));
    let laid = false;
    return {
      el,
      update(t) {
        if (!laid) { panels.forEach(pn => layoutBubbles(pn.box, pn.items, pn.iw, pn.ih, pn.heads)); laid = true; }
        fadeUp(title, prog(t, 0, 0.5), 30);
        panels.forEach((pn, i) => {
          const q = prog(t, 0.3 + i * 1.6, 0.6, ease.outBack);
          pn.box.style.opacity = clamp(q * 1.5);
          pn.box.style.transform = `scale(${0.92 + 0.08 * q})`;
        });
      },
    };
  },
});
