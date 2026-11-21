import { define, h, rich, prog, ease, fadeUp, fadeIn, clamp } from '../engine/core.js';

// Percakapan gaya chat. messages: [{from:'a'|'b', text}], names?: {a:'Andi', b:'Kamu'}
// 'a' = kiri (lawan bicara), 'b' = kanan (kita).
const timing = msgs => {
  let t = 0.4;
  return msgs.map(m => { const typing = t; const show = t + 0.6; t = show + clamp(m.text.length * 0.035, 0.9, 2.4); return { typing, show }; });
};
define('chat', {
  required: ['messages'],
  dur: p => { const tm = timing(p.messages); return tm.at(-1).show + 2; },
  build(p) {
    const tm = timing(p.messages);
    const names = p.names || {};
    const title = p.title && h('div', { class: 'sec-title', html: rich(p.title) });
    const items = p.messages.map(m => {
      const me = m.from === 'b';
      const bubble = h('div', { class: 'body' + (me ? ' me' : ''), style: {
        maxWidth: '78%', padding: '26px 34px', borderRadius: me ? '36px 36px 10px 36px' : '36px 36px 36px 10px',
        background: me ? 'var(--accent)' : 'var(--card)', color: me ? 'var(--onAccent)' : 'var(--fg)',
        border: me ? 'none' : '2px solid var(--line)', fontWeight: me ? 600 : 400 }, html: rich(m.text) });
      const name = names[m.from] && h('div', { class: 'small muted', style: { fontSize: '24px', fontWeight: 600, margin: '0 12px 8px' } }, names[m.from]);
      const dots = h('div', { style: { position: 'absolute', [me ? 'right' : 'left']: 0, bottom: 0, padding: '22px 30px', borderRadius: '30px', background: 'var(--card)', border: '2px solid var(--line)', display: 'flex', gap: '10px' } },
        [0, 1, 2].map(() => h('i', { style: { width: '14px', height: '14px', borderRadius: '50%', background: 'var(--muted)', display: 'block' } })));
      const row = h('div', { style: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: me ? 'flex-end' : 'flex-start' } }, name, bubble, dots);
      return { row, bubble, dots, name };
    });
    const el = h('div', { class: 'stack', style: { gap: '30px' } }, title, items.map(i => i.row));
    return {
      el,
      update(t) {
        fadeUp(title, prog(t, 0, 0.5));
        items.forEach((it, i) => {
          const { typing, show } = tm[i];
          const typingOn = t >= typing && t < show;
          it.dots.style.display = typingOn ? 'flex' : 'none';
          [...it.dots.children].forEach((d, k) => { d.style.transform = `translateY(${Math.sin((t * 9) - k) * 5}px)`; });
          const q = prog(t, show, 0.45, ease.outBack);
          it.bubble.style.opacity = clamp(q * 2);
          it.bubble.style.transform = `scale(${0.6 + 0.4 * q})`;
          it.bubble.style.transformOrigin = it.row.style.alignItems === 'flex-end' ? 'right bottom' : 'left bottom';
          fadeIn(it.name, prog(t, typing, 0.3));
          it.row.style.visibility = t >= typing ? '' : 'hidden';
        });
      },
    };
  },
});
