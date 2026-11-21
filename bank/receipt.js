import { define, h, rich, prog, ease, fadeUp, fmt, fmtOpts } from '../engine/core.js';

// Nota / rincian hitungan. Total dihitung otomatis dari op (+/-) kalau tidak diisi.
// rows: [{label, value, op?: '+'|'-'}], total?: {label, value?}
define('receipt', {
  required: ['rows'],
  dur: p => 2.2 + p.rows.length * 0.7,
  build(p) {
    const o = fmtOpts({ format: 'rupiah' }, p);
    const title = p.title && h('div', { class: 'sec-title', html: rich(p.title) });
    const rows = p.rows.map(r => {
      const val = h('div', { style: { fontWeight: 800, whiteSpace: 'nowrap', color: r.op === '-' ? 'var(--bad)' : r.op === '+' ? 'var(--good)' : 'var(--fg)' } });
      const el = h('div', { class: 'body', style: { display: 'flex', justifyContent: 'space-between', gap: '24px' } },
        h('div', { style: { color: 'var(--muted)' }, html: rich(r.label) }), val);
      return { el, val, r };
    });
    const sum = p.rows.reduce((a, r) => (r.op === '-' ? a - r.value : a + r.value), 0);
    const tot = p.total || {};
    const totVal = tot.value ?? sum;
    const totNum = h('div', { style: { fontWeight: 800, fontSize: '64px', color: totVal < 0 ? 'var(--bad)' : 'var(--accent)', whiteSpace: 'nowrap' } });
    const totEl = h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '24px' } },
      h('div', { class: 'h3', style: { fontWeight: 800 }, html: rich(tot.label || 'Total') }), totNum);
    const dash = h('div', { style: { borderTop: '4px dashed var(--line)', transformOrigin: 'left' } });
    const card = h('div', { class: 'card stack', style: { gap: '34px', padding: '56px 52px' } }, rows.map(r => r.el), dash, totEl);
    const el = h('div', { class: 'stack', style: { gap: '48px' } }, title, card);
    const sign = r => (r.op === '-' ? '− ' : r.op === '+' ? '+ ' : '');
    return {
      el,
      update(t) {
        fadeUp(title, prog(t, 0, 0.6));
        fadeUp(card, prog(t, 0.15, 0.6), 60);
        rows.forEach((r, i) => {
          const st = 0.5 + i * 0.6;
          fadeUp(r.el, prog(t, st, 0.5), 24);
          r.val.textContent = sign(r.r) + fmt(r.r.value * prog(t, st, 0.8, ease.outExpo), o);
        });
        const st = 0.6 + rows.length * 0.6;
        dash.style.transform = `scaleX(${prog(t, st - 0.2, 0.5)})`;
        fadeUp(totEl, prog(t, st, 0.5), 24);
        totNum.textContent = fmt(totVal * prog(t, st, 1, ease.outExpo), o);
      },
    };
  },
});
