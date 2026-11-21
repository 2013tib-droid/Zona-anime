import { define, h, rich, prog, fadeUp, lerp } from '../engine/core.js';

// Gambar milikmu (taruh di assets/img/) dengan efek zoom pelan (Ken Burns).
// src: 'assets/img/foto.jpg' (relatif ke folder proyek)
define('image', {
  required: ['src'],
  dur: p => 3.5,
  build(p) {
    const img = h('img', { src: '/' + p.src.replace(/^\/+/, ''), style: { width: '100%', height: '100%', objectFit: p.fit || 'cover', display: 'block' } });
    const frame = h('div', { style: { width: '100%', height: (p.height || 760) + 'px', borderRadius: '40px', overflow: 'hidden', border: '2px solid var(--line)' } }, img);
    const title = p.title && h('div', { class: 'sec-title', html: rich(p.title) });
    const cap = p.caption && h('div', { class: 'body muted', html: rich(p.caption) });
    const el = h('div', { class: 'stack', style: { gap: '40px' } }, title, frame, cap);
    return {
      el,
      update(t, dur) {
        fadeUp(title, prog(t, 0, 0.6));
        fadeUp(frame, prog(t, 0.15, 0.7), 60);
        img.style.transform = `scale(${lerp(1.12, 1, Math.min(1, t / dur))})`;
        fadeUp(cap, prog(t, 0.8, 0.6));
      },
    };
  },
});
