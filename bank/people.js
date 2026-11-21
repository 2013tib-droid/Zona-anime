import { define, h, rich, prog, ease, fadeUp, popIn, fadeIn } from '../engine/core.js';
import { icon } from '../engine/icons.js';

// Isotype: deretan ikon orang, sebagian disorot. Cocok untuk "3 dari 10 orang ...".
define('people', {
  required: ['highlight'],
  dur: p => 4.4,
  build(p) {
    const total = p.total || 10;
    const cols = p.cols || (total <= 5 ? total : total <= 12 ? Math.ceil(total / 2) : total <= 30 ? 6 : 10);
    const size = Math.min(150, Math.floor(860 / cols) - 10);
    const icons = Array.from({ length: total }, () => h('div', { style: { fontSize: size + 'px', color: 'color-mix(in srgb, var(--fg) 22%, transparent)', display: 'grid' } }, icon(p.icon || 'person')));
    const grid = h('div', { style: { display: 'grid', gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: '10px', justifyContent: 'center' } }, icons);
    const big = h('div', { class: 'h1', style: { color: 'var(--accent)' }, html: rich(p.label ?? `${p.highlight} dari ${total}`) });
    const txt = p.text && h('div', { class: 'h3', html: rich(p.text) });
    const el = h('div', { class: 'stack center', style: { gap: '48px' } }, big, grid, txt);
    return {
      el,
      update(t) {
        fadeUp(big, prog(t, 0, 0.6));
        icons.forEach((ic, i) => {
          popIn(ic, prog(t, 0.3 + i * (1 / total), 0.5, ease.outBack));
          const on = i < p.highlight && t > 1.5 + i * 0.12;
          ic.style.color = on ? 'var(--accent)' : 'color-mix(in srgb, var(--fg) 22%, transparent)';
        });
        fadeUp(txt, prog(t, 1.8 + Math.min(p.highlight, 10) * 0.12, 0.6));
      },
    };
  },
});
