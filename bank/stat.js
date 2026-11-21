import { define, h, rich, prog, ease, fadeUp, popIn, lerp, fmt, fmtOpts } from '../engine/core.js';
import { icon } from '../engine/icons.js';

// Angka besar yang menghitung naik (count-up).
define('stat', {
  required: ['value'],
  dur: p => 3.2 + (p.sub ? 1 : 0),
  build(p) {
    const o = fmtOpts(p);
    const finalStr = fmt(p.value, o);
    const size = Math.min(250, Math.floor(888 / (finalStr.length * 0.6)));
    const trendIc = p.trend === 'up' ? 'arrow-up' : p.trend === 'down' ? 'arrow-down' : null;
    const tone = p.tone ? 'tone-' + p.tone : '';
    const ic = (p.icon || trendIc) && h('div', { class: `badge ${tone}` }, icon(p.icon || trendIc));
    const k = p.kicker && h('div', { class: 'kicker' }, p.kicker);
    const n = h('div', { class: 'mega', style: { fontSize: size + 'px', color: p.tone ? 'var(--tone)' : 'var(--accent)' } }, finalStr);
    if (p.tone) n.classList.add(tone);
    const lab = p.label && h('div', { class: 'h3', html: rich(p.label) });
    const sub = p.sub && h('p', { class: 'body muted', html: rich(p.sub) });
    const el = h('div', { class: 'stack center' }, ic, k, n, lab, sub);
    const from = p.from ?? 0;
    return {
      el,
      update(t) {
        popIn(ic, prog(t, 0, 0.6, ease.outBack));
        fadeUp(k, prog(t, 0.05, 0.5));
        fadeUp(n, prog(t, 0.15, 0.5));
        n.textContent = fmt(lerp(from, p.value, prog(t, 0.2, 1.6, ease.outExpo)), o);
        fadeUp(lab, prog(t, 0.6, 0.6));
        fadeUp(sub, prog(t, 1.4, 0.6));
      },
    };
  },
});
