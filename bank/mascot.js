import { define, h, rich, prog, ease, fadeUp, fadeIn, fmt, fmtOpts } from '../engine/core.js';
import { placeChara, bubble, layoutBubbles } from '../engine/comic.js';

// Infografis + maskot: konten di atas (judul/angka/poin), karakter menjelaskan di bawah dengan balon kata.
define('mascot', {
  full: true,
  dur: p => 3 + (p.items || []).length * 0.8 + (p.say ? 1 : 0),
  build(p, ctx) {
    const { w, h: H } = ctx.box;
    const right = p.side !== 'left';
    const chH = Math.round(H * (p.charSize || 0.5));
    const kicker = p.kicker && h('div', { class: 'kicker' }, p.kicker);
    const title = p.title && h('div', { class: 'h2', style: { fontSize: '64px' }, html: rich(p.title) });
    const value = p.value != null && h('div', { class: 'mega', style: { fontSize: '150px', color: 'var(--accent)' } }, fmt(p.value, fmtOpts(p)));
    const label = p.label && h('div', { class: 'h3', html: rich(p.label) });
    const text = p.text && h('div', { class: 'body', html: rich(p.text) });
    const items = (p.items || []).map(it => h('div', { class: 'body', style: { display: 'flex', gap: '20px', fontWeight: 600 } },
      h('span', { style: { color: 'var(--accent)', fontWeight: 800 } }, '✦'), h('span', { html: rich(it) })));
    const content = h('div', { class: 'stack', style: { gap: '26px', flex: 1, justifyContent: 'center' } }, kicker, title, value, label, text, items.length && h('div', { class: 'stack', style: { gap: '16px' } }, items));
    const stage = h('div', { style: { position: 'relative', height: chH + 'px', flex: 'none' } });
    const pc = placeChara({ shot: 'full', ...p }, w, chH, ctx.data.cast, right ? 0.8 : 0.2);
    stage.append(pc.el);
    const bub = p.say && { el: bubble({ text: p.say, type: p.sayType }), b: { text: p.say, type: p.sayType, x: right ? 42 : 58, y: p.sayY ?? 8 } };
    if (bub) stage.append(bub.el);
    let laid = false;
    return {
      el: h('div', { style: { display: 'flex', flexDirection: 'column', width: w + 'px', height: H + 'px' } }, content, stage),
      update(t) {
        if (!laid && bub) { layoutBubbles(stage, [bub], w, chH, [pc.head], { maxW: w * 0.6 }); laid = true; }
        fadeUp(kicker, prog(t, 0, 0.5)); fadeUp(title, prog(t, 0.1, 0.6)); fadeUp(value, prog(t, 0.3, 0.6));
        fadeUp(label, prog(t, 0.5, 0.6)); fadeUp(text, prog(t, 0.6, 0.6));
        items.forEach((it, i) => fadeUp(it, prog(t, 0.8 + i * 0.6, 0.5), 30));
        fadeUp(pc.el, prog(t, 0.2, 0.6, ease.outBack), 80);
        if (bub) fadeIn(bub.el, prog(t, 1, 0.4));
      },
    };
  },
});
