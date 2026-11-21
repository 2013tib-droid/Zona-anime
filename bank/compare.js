import { define, h, rich, prog, ease, fadeUp, slideIn, popIn } from '../engine/core.js';
import { icon } from '../engine/icons.js';

// Dua kartu berdampingan: A vs B. Default kiri = bad (merah), kanan = good (hijau).
// left/right: { title, icon?, value?, items?: [..], tone?: 'good'|'bad'|'accent' }
define('compare', {
  required: ['left', 'right'],
  dur: p => 3 + Math.max((p.left.items || []).length, (p.right.items || []).length) * 0.6,
  build(p) {
    const title = p.title && h('div', { class: 'sec-title center', style: { textAlign: 'center' }, html: rich(p.title) });
    const card = (c, def) => {
      const tone = 'tone-' + (c.tone || def);
      const items = (c.items || []).map(t => h('div', { class: 'small', style: { display: 'flex', gap: '14px' } },
        h('span', { style: { color: 'var(--tone)', fontWeight: 800 } }, '•'), h('span', { html: rich(t) })));
      const value = c.value && h('div', { class: 'mega', style: { fontSize: c.value.length > 7 ? '60px' : '80px', color: 'var(--tone)' } }, c.value);
      const el = h('div', { class: `card stack ${tone}`, style: { flex: 1, gap: '26px', padding: '40px 34px', borderTop: '10px solid var(--tone)' } },
        c.icon && h('div', { class: `badge sm ${tone}`, style: { background: 'var(--tone)' } }, icon(c.icon)),
        h('div', { class: 'h3', style: { fontWeight: 800 }, html: rich(c.title || '') }),
        value, items.length && h('div', { class: 'stack', style: { gap: '18px' } }, items));
      return { el, items };
    };
    const L = card(p.left, 'bad'), R = card(p.right, 'good');
    const vs = h('div', { style: { position: 'absolute', left: '50%', top: '50%', translate: '-50% -50%', width: '96px', height: '96px', borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'var(--fg)', color: 'var(--bg)', fontWeight: 800, fontSize: '32px', zIndex: 2 } }, p.vs || 'VS');
    const row = h('div', { style: { position: 'relative', display: 'flex', gap: '28px', alignItems: 'stretch' } }, L.el, vs, R.el);
    const el = h('div', { class: 'stack', style: { gap: '56px' } }, title, row);
    return {
      el,
      update(t) {
        fadeUp(title, prog(t, 0, 0.6));
        slideIn(L.el, prog(t, 0.2, 0.7), -160);
        slideIn(R.el, prog(t, 0.45, 0.7), 160);
        popIn(vs, prog(t, 0.8, 0.5, ease.outBack));
        const n = Math.max(L.items.length, R.items.length);
        for (let i = 0; i < n; i++) {
          fadeUp(L.items[i], prog(t, 1.1 + i * 0.6, 0.5), 24);
          fadeUp(R.items[i], prog(t, 1.4 + i * 0.6, 0.5), 24);
        }
      },
    };
  },
});
