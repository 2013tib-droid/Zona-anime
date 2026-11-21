import { define, h, s, rich, prog, ease, fadeUp, fadeIn, fmt, fmtOpts } from '../engine/core.js';

// Diagram donat (porsi/alokasi). items: [{label, value, color?}]
// Nilai otomatis diubah jadi persen dari total, kecuali showValue:true.
define('donut', {
  required: ['items'],
  dur: p => 2.6 + p.items.length * 0.7,
  build(p) {
    const total = p.items.reduce((a, i) => a + i.value, 0);
    const pal = ['var(--accent)', 'var(--accent2)', 'var(--accent3)', 'var(--bad)', 'var(--muted)', 'var(--fg)'];
    const R = 150, SW = 70, C = 2 * Math.PI * R;
    let acc = 0;
    const segs = p.items.map((it, i) => {
      const frac = it.value / total;
      const seg = { frac, off: acc, color: it.color || pal[i % pal.length], it };
      acc += frac;
      seg.el = s('circle', { cx: 0, cy: 0, r: R, fill: 'none', stroke: seg.color, 'stroke-width': SW, transform: 'rotate(-90)', 'stroke-dasharray': `0 ${C}` });
      return seg;
    });
    const center = h('div', { style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', fontWeight: 800, fontSize: '54px', lineHeight: 1.1 }, html: rich(p.center || '') });
    const svg = s('svg', { viewBox: '-200 -200 400 400', width: 440, height: 440 },
      s('circle', { r: R, fill: 'none', stroke: 'var(--line)', 'stroke-width': SW }), segs.map(sg => sg.el));
    const chart = h('div', { style: { position: 'relative', width: '440px', height: '440px', alignSelf: 'center' } }, svg, center);
    const o = fmtOpts(p);
    const legend = segs.map(sg => h('div', { style: { display: 'flex', alignItems: 'center', gap: '22px' } },
      h('div', { style: { width: '34px', height: '34px', borderRadius: '10px', background: sg.color, flex: 'none' } }),
      h('div', { class: 'body', style: { flex: 1, fontWeight: 600 }, html: rich(sg.it.label) }),
      h('div', { class: 'body', style: { fontWeight: 800 } }, p.showValue ? fmt(sg.it.value, o) : fmt(Math.round(sg.frac * 1000) / 10, { format: 'percent', decimals: Number.isInteger(Math.round(sg.frac * 1000) / 10) ? 0 : 1 }))));
    const title = p.title && h('div', { class: 'sec-title', html: rich(p.title) });
    const el = h('div', { class: 'stack', style: { gap: '52px' } }, title, chart, h('div', { class: 'stack', style: { gap: '22px' } }, legend));
    return {
      el,
      update(t) {
        fadeUp(title, prog(t, 0, 0.6));
        segs.forEach((sg, i) => {
          const q = prog(t, 0.4 + i * 0.55, 0.8, ease.inOutCubic);
          const len = Math.max(0, sg.frac * C * q - (sg.frac < 1 ? 4 : 0));
          sg.el.setAttribute('stroke-dasharray', `${len} ${C}`);
          sg.el.setAttribute('stroke-dashoffset', -sg.off * C);
          fadeUp(legend[i], prog(t, 0.5 + i * 0.55, 0.5), 30);
        });
        fadeIn(center, prog(t, 0.6 + segs.length * 0.55, 0.5));
      },
    };
  },
});
