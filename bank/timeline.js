import { define, h, rich, prog, ease, fadeUp, popIn } from '../engine/core.js';

// Linimasa / langkah berurutan. items: [{label:'2020', text:'...'}]
define('timeline', {
  required: ['items'],
  dur: p => 1.8 + p.items.length * 1.1,
  build(p) {
    const title = p.title && h('div', { class: 'sec-title', html: rich(p.title) });
    const rail = h('div', { style: { position: 'absolute', left: '21px', top: '20px', width: '6px', borderRadius: '6px', background: 'var(--accent)', height: '0%' } });
    const rows = p.items.map(it => {
      const dot = h('div', { style: { width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg)', border: '8px solid var(--accent)', flex: 'none', position: 'relative', zIndex: 1 } });
      const row = h('div', { style: { display: 'flex', gap: '36px', alignItems: 'flex-start' } }, dot,
        h('div', { class: 'stack', style: { gap: '6px', marginTop: '-4px' } },
          h('div', { style: { fontSize: '38px', fontWeight: 800, color: 'var(--accent)' } }, it.label),
          h('div', { class: 'body', html: rich(it.text || '') })));
      return { row, dot };
    });
    const body = h('div', { class: 'stack', style: { position: 'relative', gap: '46px' } },
      h('div', { style: { position: 'absolute', left: '21px', top: '20px', bottom: '20px', width: '6px', borderRadius: '6px', background: 'var(--line)' } }),
      rail, rows.map(r => r.row));
    const el = h('div', { class: 'stack', style: { gap: '56px' } }, title, body);
    return {
      el,
      update(t, dur) {
        fadeUp(title, prog(t, 0, 0.6));
        const gap = Math.min(1.1, (dur - 1.8) / rows.length);
        const lastTop = rows.at(-1).row.offsetTop;
        rail.style.height = Math.max(0, lastTop * prog(t, 0.5, gap * (rows.length - 1) + 0.01, ease.linear)) + 'px';
        rows.forEach((r, i) => {
          fadeUp(r.row, prog(t, 0.4 + i * gap, 0.5), 30);
          popIn(r.dot, prog(t, 0.4 + i * gap, 0.5, ease.outBack));
        });
      },
    };
  },
});
