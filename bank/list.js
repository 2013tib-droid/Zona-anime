import { define, h, rich, prog, ease, fadeUp, popIn } from '../engine/core.js';
import { icon } from '../engine/icons.js';

// Daftar poin yang muncul satu per satu.
// items: ["teks", ...] atau [{text, sub?, icon?}]
// style: 'number' (default) | 'check' | 'x' | 'dot' | 'icon'
define('list', {
  required: ['items'],
  dur: p => 1.6 + p.items.length * 1.1,
  build(p) {
    const style = p.style || 'number';
    const title = p.title && h('div', { class: 'sec-title', html: rich(p.title) });
    const rows = p.items.map((raw, i) => {
      const it = typeof raw === 'string' ? { text: raw } : raw;
      const tone = style === 'check' ? 'tone-good' : style === 'x' ? 'tone-bad' : '';
      const mk = style === 'dot'
        ? h('div', { style: { width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent)', margin: '18px 30px 0 22px', flex: 'none' } })
        : h('div', { class: `badge sm ${tone}`, style: { fontWeight: 800, fontSize: style === 'number' ? '40px' : '44px' } },
          style === 'number' ? String(i + 1) : icon(it.icon || (style === 'check' ? 'check' : style === 'x' ? 'x' : 'star')));
      const txt = h('div', { class: 'stack', style: { gap: '8px', paddingTop: style === 'dot' ? 0 : '12px' } },
        h('div', { class: 'body', style: { fontWeight: 600 }, html: rich(it.text) }),
        it.sub && h('div', { class: 'small muted', html: rich(it.sub) }));
      const row = h('div', { style: { display: 'flex', gap: '30px', alignItems: 'flex-start' } }, mk, txt);
      return { row, mk };
    });
    const el = h('div', { class: 'stack', style: { gap: '54px' } }, title, h('div', { class: 'stack', style: { gap: '40px' } }, rows.map(r => r.row)));
    return {
      el,
      update(t, dur) {
        fadeUp(title, prog(t, 0, 0.6));
        const gap = Math.min(1.1, (dur - 1.8) / rows.length);
        rows.forEach((r, i) => {
          const st = 0.5 + i * gap;
          fadeUp(r.row, prog(t, st, 0.55), 40);
          popIn(r.mk, prog(t, st, 0.6, ease.outBack));
        });
      },
    };
  },
});
