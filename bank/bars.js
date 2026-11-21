import { define, h, rich, prog, ease, fadeUp, fadeIn, fmt, fmtOpts } from '../engine/core.js';

// Diagram batang. Default horizontal (label di atas batang) — paling enak dibaca di HP.
// vertical:true untuk deret waktu pendek (<= 8 batang).
define('bars', {
  required: ['items'],
  dur: p => 2 + p.items.length * 0.45,
  build(p) {
    const max = p.max ?? Math.max(...p.items.map(i => Math.abs(i.value)));
    const anyHl = p.items.some(i => i.hl);
    const title = p.title && h('div', { class: 'sec-title', html: rich(p.title) });
    const color = it => it.color || (it.tone ? `var(--${it.tone})` : anyHl && !it.hl ? 'color-mix(in srgb, var(--fg) 28%, transparent)' : 'var(--accent)');
    const rows = p.items.map(it => {
      const fill = h('div', { style: { height: '100%', width: '0%', borderRadius: '16px', background: color(it) } });
      const val = h('div', { style: { fontWeight: 800, fontSize: p.vertical ? '34px' : '44px', color: it.hl ? 'var(--accent)' : 'var(--fg)', whiteSpace: 'nowrap' } });
      const o = fmtOpts(p, it);
      const lab = h('div', { class: 'small', style: { color: it.hl ? 'var(--fg)' : 'var(--muted)', fontWeight: it.hl ? 800 : 600 } }, it.label);
      let row;
      if (p.vertical) {
        const col = h('div', { style: { flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '14px' } }, val,
          h('div', { style: { width: '100%', height: '0%', borderRadius: '16px 16px 6px 6px', background: color(it) } }));
        row = { col, val, bar: col.lastChild, lab, it, o };
      } else {
        row = h('div', { class: 'stack', style: { gap: '14px' } },
          h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '24px' } }, lab, val),
          h('div', { style: { height: '44px', borderRadius: '16px', background: 'color-mix(in srgb, var(--fg) 8%, transparent)' } }, fill));
        row = { el: row, val, bar: fill, it, o };
      }
      return row;
    });
    let chart;
    if (p.vertical) {
      chart = h('div', { class: 'stack', style: { gap: '18px' } },
        h('div', { style: { height: '620px', display: 'flex', gap: '22px', alignItems: 'flex-end', borderBottom: '3px solid var(--line)' } }, rows.map(r => r.col)),
        h('div', { style: { display: 'flex', gap: '22px' } }, rows.map(r => { r.lab.style.flex = 1; r.lab.style.textAlign = 'center'; return r.lab; })));
    } else {
      chart = h('div', { class: 'stack', style: { gap: '34px' } }, rows.map(r => r.el));
    }
    const el = h('div', { class: 'stack', style: { gap: '56px' } }, title, chart);
    return {
      el,
      update(t) {
        fadeUp(title, prog(t, 0, 0.6));
        fadeIn(chart, prog(t, 0.2, 0.4));
        rows.forEach((r, i) => {
          const q = prog(t, 0.4 + i * 0.3, 1.1, ease.outQuart);
          const pct = (Math.abs(r.it.value) / max) * 100 * q;
          if (p.vertical) r.bar.style.height = pct + '%'; else r.bar.style.width = pct + '%';
          r.val.textContent = fmt(r.it.value * q, r.o);
          fadeIn(r.val, prog(t, 0.4 + i * 0.3, 0.3));
          if (r.el) fadeUp(r.el, prog(t, 0.3 + i * 0.3, 0.5), 30);
          else fadeIn(r.lab, prog(t, 0.4 + i * 0.3, 0.4));
        });
      },
    };
  },
});
