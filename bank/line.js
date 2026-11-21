import { define, h, s, rich, prog, ease, fadeUp, fadeIn, lerp, clamp, fmt, fmtOpts } from '../engine/core.js';

// Grafik garis yang "tergambar" dari kiri ke kanan, label nilai ikut bergerak di ujungnya.
// points: [{x:'2020', y:100}, ...]  atau  labels:[...] + values:[...]
define('line', {
  dur: p => 4.5,
  build(p) {
    const pts = p.points || (p.values || []).map((y, i) => ({ x: (p.labels || [])[i] ?? '', y }));
    if (pts.length < 2) throw new Error('line: butuh minimal 2 titik (points atau values)');
    const o = fmtOpts(p);
    const W = 888, H = p.height || 560, padT = 90, padB = 70;
    const ys = pts.map(d => d.y);
    let lo = p.min ?? Math.min(...ys), hi = p.max ?? Math.max(...ys);
    if (p.min == null) lo -= (hi - lo) * 0.15;
    if (hi === lo) hi = lo + 1;
    const X = i => 20 + (i / (pts.length - 1)) * (W - 40);
    const Y = v => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);
    const d = pts.map((pt, i) => `${i ? 'L' : 'M'}${X(i)},${Y(pt.y)}`).join(' ');
    const id = 'clip' + Math.random().toString(36).slice(2, 8);
    const clipRect = s('rect', { x: 0, y: 0, width: 0, height: H });
    const col = p.tone ? `var(--${p.tone})` : 'var(--accent)';
    const head = s('circle', { r: 14, fill: col, stroke: 'var(--bg)', 'stroke-width': 6 });
    const headLbl = h('div', { style: { position: 'absolute', transform: 'translate(-50%,-100%)', fontWeight: 800, fontSize: '46px', color: col, whiteSpace: 'nowrap', padding: '0 0 22px' } });
    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, style: 'overflow:visible;display:block' },
      s('defs', {}, s('clipPath', { id }, clipRect),
        s('linearGradient', { id: id + 'g', x1: 0, y1: 0, x2: 0, y2: 1 },
          s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.35 }), s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }))),
      [0.25, 0.5, 0.75].map(f => s('line', { x1: 0, x2: W, y1: padT + f * (H - padT - padB), y2: padT + f * (H - padT - padB), stroke: 'var(--line)', 'stroke-width': 2, 'stroke-dasharray': '6 10' })),
      s('g', { 'clip-path': `url(#${id})` },
        s('path', { d: `${d} L${X(pts.length - 1)},${H - padB} L${X(0)},${H - padB} Z`, fill: `url(#${id}g)` }),
        s('path', { d, fill: 'none', stroke: col, 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })),
      s('line', { x1: 0, x2: W, y1: H - padB, y2: H - padB, stroke: 'var(--line)', 'stroke-width': 3 }),
      pts.map((pt, i) => s('text', { x: X(i), y: H - padB + 48, 'text-anchor': i === 0 ? 'start' : i === pts.length - 1 ? 'end' : 'middle', fill: 'var(--muted)', 'font-size': 28, 'font-weight': 600 }, pt.x)
      ).filter((_, i) => pts.length <= 8 || i % Math.ceil(pts.length / 6) === 0 || i === pts.length - 1),
      head);
    const startLbl = h('div', { style: { position: 'absolute', left: X(0) + 'px', top: Y(pts[0].y) + 'px', transform: 'translate(0,-100%)', padding: '0 0 22px', fontWeight: 600, fontSize: '32px', color: 'var(--muted)' } }, fmt(pts[0].y, o));
    const chart = h('div', { style: { position: 'relative', width: W + 'px', alignSelf: 'center' } }, svg, startLbl, headLbl);
    const title = p.title && h('div', { class: 'sec-title', html: rich(p.title) });
    const sub = p.sub && h('p', { class: 'body muted', html: rich(p.sub) });
    const el = h('div', { class: 'stack', style: { gap: '48px' } }, title, chart, sub);
    return {
      el,
      update(t, dur) {
        fadeUp(title, prog(t, 0, 0.6));
        fadeIn(chart, prog(t, 0.2, 0.4));
        const q = prog(t, 0.5, Math.max(1.5, dur - 2.2), ease.inOutCubic);
        const f = q * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), r = f - i;
        const x = lerp(X(i), X(i + 1), r), v = lerp(pts[i].y, pts[i + 1].y, r);
        clipRect.setAttribute('width', x + 12);
        head.setAttribute('cx', x); head.setAttribute('cy', Y(v));
        headLbl.style.left = clamp(x, 120, W - 120) + 'px'; headLbl.style.top = Y(v) + 'px';
        headLbl.textContent = fmt(v, o);
        fadeIn(headLbl, prog(t, 0.6, 0.3));
        fadeIn(startLbl, clamp((q - 0.1) * 8) * 0.9);
        fadeUp(sub, prog(t, dur - 1.6, 0.6));
      },
    };
  },
});
