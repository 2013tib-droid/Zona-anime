import { define, h, rich, prog, ease, fadeIn, popIn, clamp } from '../engine/core.js';
import { panelBg, placeChara, sfx } from '../engine/comic.js';

// Meme/reaksi: satu karakter ekspresif + teks atas/bawah ala meme.
define('meme', {
  full: true,
  dur: p => 3.2,
  build(p, ctx) {
    const { w, h: H } = ctx.box;
    const box = h('div', { class: 'panel', style: { left: 0, top: 0, width: w + 'px', height: H + 'px', borderRadius: '28px' } });
    const iw = w - 12, ih = H - 12;
    box.append(panelBg(p.bg || 'fokus', iw, ih, p.bgColor));
    const pc = placeChara({ shot: 'bust', ...p, scale: p.scale || 1.05 }, iw, ih, ctx.data.cast);
    box.append(pc.el);
    const top = p.top && h('div', { class: 'meme-text', style: { top: '4%' }, html: rich(p.top) });
    const bottom = p.bottom && h('div', { class: 'meme-text', style: { bottom: '4%' }, html: rich(p.bottom) });
    box.append(...[top, bottom].filter(Boolean));
    [].concat(p.sfx || []).forEach(f => box.append(sfx(typeof f === 'string' ? { text: f } : f, iw, ih)));
    return {
      el: h('div', { style: { position: 'relative', width: w + 'px', height: H + 'px' } }, box),
      update(t) {
        fadeIn(box, prog(t, 0, 0.3));
        pc.el.style.transform = `scale(${0.9 + 0.1 * prog(t, 0, 0.6, ease.outBack)})`;
        pc.el.style.transformOrigin = '50% 100%';
        popIn(top, prog(t, 0.3, 0.5, ease.outBack));
        popIn(bottom, prog(t, 0.8, 0.5, ease.outBack));
      },
    };
  },
});
