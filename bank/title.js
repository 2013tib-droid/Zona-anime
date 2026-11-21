import { define, h, words, rich, prog, ease, fadeUp, popIn, revealWords, wordCount } from '../engine/core.js';
import { icon } from '../engine/icons.js';

// Judul / hook / pernyataan besar.
define('title', {
  required: ['text'],
  dur: p => 2.2 + wordCount(p.text) * 0.16 + (p.sub ? 1.2 : 0),
  build(p) {
    const ic = p.icon && h('div', { class: 'badge big' }, icon(p.icon));
    const k = p.kicker && h('div', { class: 'kicker' }, p.kicker);
    const w = words(p.text);
    const t = h('h1', { class: p.size === 'm' ? 'h2' : 'h1' }, w.el);
    const sub = p.sub && h('p', { class: 'body muted', html: rich(p.sub) });
    const el = h('div', { class: 'stack ' + (p.align === 'left' ? 'left' : 'center') }, ic, k, t, sub);
    return {
      el,
      update(t) {
        popIn(ic, prog(t, 0, 0.6, ease.outBack));
        fadeUp(k, prog(t, 0.1, 0.5));
        const end = revealWords(w.items, t, 0.25);
        fadeUp(sub, prog(t, end + 0.25, 0.6));
      },
    };
  },
});
