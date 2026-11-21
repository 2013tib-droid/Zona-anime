import { define, h, rich, prog, ease, fadeUp } from '../engine/core.js';
import { placeChara } from '../engine/comic.js';

// Barisan karakter (kenalan pemeran, perbandingan tipe orang, "tipe-tipe orang saat gajian", dll).
// chars: [{char, expr, pose, label, desc}]
define('lineup', {
  full: true,
  required: ['chars'],
  dur: p => 2 + p.chars.length * 0.6,
  build(p, ctx) {
    const { w, h: H } = ctx.box;
    const title = p.title && h('div', { class: 'h2', style: { fontSize: '64px', textAlign: 'center', marginBottom: '20px' }, html: rich(p.title) });
    const n = p.chars.length;
    const cols = p.chars.map(c => {
      const cw = w / n, ch = H * (p.title ? 0.62 : 0.72);
      const stage = h('div', { style: { position: 'relative', width: cw + 'px', height: ch + 'px', overflow: c.shot && c.shot !== 'full' ? 'hidden' : 'visible' } });
      const pc = placeChara({ shot: 'full', maxW: cw * 1.05, ...c }, cw, ch, ctx.data.cast);
      stage.append(pc.el);
      const lab = h('div', { class: 'stack center', style: { gap: '6px', padding: '0 8px' } },
        c.label && h('div', { style: { fontWeight: 800, fontSize: n > 3 ? '34px' : '42px', color: 'var(--accent)' }, html: rich(c.label) }),
        c.desc && h('div', { class: 'small', style: { fontSize: n > 3 ? '24px' : '30px' }, html: rich(c.desc) }));
      return { col: h('div', { class: 'stack center', style: { width: cw + 'px', gap: '16px' } }, stage, lab), pc };
    });
    return {
      el: h('div', { class: 'stack', style: { width: w + 'px', height: H + 'px', justifyContent: 'center', gap: '10px' } }, title, h('div', { style: { display: 'flex' } }, cols.map(c => c.col))),
      update(t) {
        fadeUp(title, prog(t, 0, 0.6));
        cols.forEach((c, i) => fadeUp(c.col, prog(t, 0.3 + i * 0.4, 0.6, ease.outBack), 80));
      },
    };
  },
});
