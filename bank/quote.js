import { define, h, words, prog, fadeUp, popIn, ease, revealWords, wordCount } from '../engine/core.js';

// Kutipan dengan tanda petik besar.
define('quote', {
  required: ['text'],
  dur: p => 2.4 + wordCount(p.text) * 0.2,
  build(p) {
    const mark = h('div', { style: { fontSize: '260px', lineHeight: 0.7, height: '130px', fontWeight: 800, color: 'var(--accent)' } }, '“');
    const w = words(p.text);
    const txt = h('div', { class: 'h2', style: { fontWeight: 600, fontSize: wordCount(p.text) > 22 ? '54px' : '64px' } }, w.el);
    const by = p.by && h('div', { style: { display: 'flex', gap: '20px', alignItems: 'center' } },
      h('div', { style: { width: '60px', height: '6px', borderRadius: '6px', background: 'var(--accent)' } }),
      h('div', {}, h('div', { class: 'h3', style: { fontWeight: 800, fontSize: '40px' } }, p.by), p.role && h('div', { class: 'small muted' }, p.role)));
    const el = h('div', { class: 'stack', style: { gap: '44px' } }, mark, txt, by);
    return {
      el,
      update(t) {
        popIn(mark, prog(t, 0, 0.6, ease.outBack));
        const end = revealWords(w.items, t, 0.3, 0.06);
        fadeUp(by, prog(t, end + 0.2, 0.6));
      },
    };
  },
});
