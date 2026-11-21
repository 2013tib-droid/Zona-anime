import { define, h, rich, prog, ease, fadeUp, popIn } from '../engine/core.js';
import { icon } from '../engine/icons.js';

// Penutup ajakan: simpan / bagikan / ikuti / komentar / suka.
const ACT = { save: ['bookmark', 'Simpan'], share: ['send', 'Bagikan'], follow: ['user-plus', 'Ikuti'], comment: ['chat', 'Komentar'], like: ['heart', 'Suka'] };
define('cta', {
  dur: p => 3.6,
  build(p, ctx) {
    const acts = (p.actions || ['save', 'share', 'follow']).map(a => {
      const [ic, label] = ACT[a] || ['star', a];
      const badge = h('div', { class: 'badge' }, icon(ic));
      return { badge, el: h('div', { class: 'stack center', style: { gap: '18px' } }, badge, h('div', { class: 'small', style: { fontWeight: 800 } }, label)) };
    });
    const text = h('div', { class: 'h1', style: { fontSize: '84px' }, html: rich(p.text || 'Simpan biar *nggak lupa*!') });
    const sub = p.sub && h('div', { class: 'body muted', html: rich(p.sub) });
    const handle = h('div', { class: 'kicker', style: { fontSize: '34px', letterSpacing: '.04em', textTransform: 'none' } }, p.handle || ctx.data.handle || '@zona.anime');
    const el = h('div', { class: 'stack center', style: { gap: '56px' } }, text, sub,
      h('div', { style: { display: 'flex', gap: '64px', justifyContent: 'center' } }, acts.map(a => a.el)), handle);
    return {
      el,
      update(t) {
        fadeUp(text, prog(t, 0, 0.6));
        fadeUp(sub, prog(t, 0.3, 0.6));
        acts.forEach((a, i) => {
          popIn(a.el, prog(t, 0.5 + i * 0.2, 0.6, ease.outBack));
          const pulse = t > 1.5 ? 1 + Math.max(0, Math.sin((t - 1.5 - i * 0.25) * 4)) * 0.06 : 1;
          a.badge.style.transform = `scale(${pulse})`;
        });
        fadeUp(handle, prog(t, 1.1, 0.6));
      },
    };
  },
});
