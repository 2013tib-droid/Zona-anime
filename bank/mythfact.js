import { define, h, rich, prog, ease, fadeUp, popIn, lerp } from '../engine/core.js';
import { icon } from '../engine/icons.js';

// Mitos vs Fakta: kartu MITOS dicoret, lalu kartu FAKTA muncul.
define('mythfact', {
  required: ['myth', 'fact'],
  dur: p => 5.2,
  build(p) {
    const card = (tone, label, ic, text) => {
      // coretan per baris: background inline + box-decoration-break:clone
      const strike = h('span', { html: rich(text), style: tone === 'tone-bad' ? {
        background: 'linear-gradient(var(--bad), var(--bad)) no-repeat 0 58% / calc(var(--s, 0) * 100%) 7px',
        boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' } : {} });
      const txt = h('div', { class: 'h3' }, strike);
      const el = h('div', { class: `card stack ${tone}`, style: { gap: '26px', borderLeft: '12px solid var(--tone)' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '20px' } },
          h('div', { class: `badge sm ${tone}` }, icon(ic)),
          h('div', { style: { fontWeight: 800, fontSize: '34px', letterSpacing: '.14em', color: 'var(--tone)' } }, label)),
        txt);
      return { el, strike };
    };
    const M = card('tone-bad', p.mythLabel || 'MITOS', 'x', p.myth);
    const F = card('tone-good', p.factLabel || 'FAKTA', 'check', p.fact);
    const el = h('div', { class: 'stack', style: { gap: '40px' } }, M.el, F.el);
    return {
      el,
      update(t) {
        fadeUp(M.el, prog(t, 0, 0.6));
        M.strike.style.setProperty('--s', prog(t, 1.4, 0.5, ease.inOutCubic));
        M.el.style.opacity = lerp(1, 0.55, prog(t, 1.9, 0.4)) * prog(t, 0, 0.6);
        fadeUp(F.el, prog(t, 2.1, 0.7, ease.outBack), 80);
      },
    };
  },
});
