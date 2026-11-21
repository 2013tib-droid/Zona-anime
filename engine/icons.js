// Ikon garis 24x24 buatan sendiri (bebas dipakai). Pakai: "icon": "coin"
// Nama yang tidak dikenal akan ditampilkan sebagai teks/emoji apa adanya.
import { h } from './core.js';

export const ICONS = {
  coin: '<circle cx="12" cy="12" r="9"/><path d="M14.6 9.4c-.5-.9-1.4-1.4-2.6-1.4-1.5 0-2.6.8-2.6 2s1.1 1.7 2.6 2 2.6.8 2.6 2-1.1 2-2.6 2c-1.2 0-2.1-.5-2.6-1.4M12 6.3V8M12 16v1.7"/>',
  money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v.01M18 14.5v.01"/>',
  wallet: '<path d="M5 6.5 15.5 3l1 3.5"/><rect x="3" y="6.5" width="18" height="13.5" rx="2.4"/><path d="M21 11h-4a2 2 0 0 0 0 4h4"/>',
  bank: '<path d="M3 9.5 12 4l9 5.5z"/><path d="M5.5 10v8M10 10v8M14 10v8M18.5 10v8M3 20.5h18"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="2.4"/><path d="M2.5 10h19M6 15h4"/>',
  cart: '<path d="M3 4h2.2l2.3 10.4a1.6 1.6 0 0 0 1.6 1.3h8.1a1.6 1.6 0 0 0 1.6-1.2L20.6 8H6.1"/><circle cx="9.5" cy="19.6" r="1.3"/><circle cx="17" cy="19.6" r="1.3"/>',
  house: '<path d="M3 11 12 4l9 7"/><path d="M5.5 9.5V20h13V9.5M10 20v-5h4v5"/>',
  'chart-up': '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5.5-6"/><path d="M15.5 8h4v4"/>',
  'chart-down': '<path d="M3 3v18h18"/><path d="m7 8 4 4 3-3 5.5 6"/><path d="M15.5 15h4v-4"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7.5 17v-5M12 17V8M16.5 17v-7"/>',
  piggy: '<path d="M4.5 12a7 6 0 0 1 12.6-3.6H20v3.8l-2 .9V17h-2.6v-2H9.6v2H7v-2.6A5.7 5.7 0 0 1 4.5 12z"/><path d="M10 6.5h3.5M15 11v.01"/>',
  percent: '<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
  receipt: '<path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  tag: '<path d="M3 12.5V4h8.5L21 13.5 13.5 21z"/><circle cx="7.6" cy="8.4" r="1.4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2.4"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.6 1 2.5h6c0-.9.2-1.7 1-2.5A6 6 0 0 0 12 3z"/>',
  warning: '<path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4.2M12 17.2v.01"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  question: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .8-1 1.5v.6M12 17v.01"/>',
  person: '<circle cx="12" cy="7.5" r="3.6"/><path d="M5 21v-.5a7 7 0 0 1 14 0v.5"/>',
  users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.7a3.4 3.4 0 0 1 0 6.6M18 14a6 6 0 0 1 3.5 6"/>',
  'user-plus': '<circle cx="9" cy="8" r="3.4"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M19 8v6M16 11h6"/>',
  family: '<circle cx="7" cy="6" r="2.6"/><circle cx="17" cy="6" r="2.6"/><circle cx="12" cy="12.5" r="2"/><path d="M2.5 19v-2.5a4.5 4.5 0 0 1 8 -2.8M21.5 19v-2.5a4.5 4.5 0 0 0-8-2.8M9 20.5a3 3 0 0 1 6 0"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.4"/><path d="M8.5 7V5.2A2 2 0 0 1 10.5 3h3a2 2 0 0 1 2 2.2V7M3 13h18"/>',
  shield: '<path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  heart: '<path d="M12 20s-7-4.4-9-9a4.6 4.6 0 0 1 9-2.6A4.6 4.6 0 0 1 21 11c-2 4.6-9 9-9 9z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.2 3.5 3.2 14.5 0 18M12 3c-3.2 3.5-3.2 14.5 0 18"/>',
  factory: '<path d="M3 20V11l5 3v-3l5 3v-3l5 3V4h3v16zM2 20.5h20"/>',
  fuel: '<path d="M4.5 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16M3 21h12M4.5 10h9"/><path d="M13.5 8h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8.5L18 6"/>',
  food: '<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8.5 7.5c0-1.5 1-1.5 1-3M12 7.5c0-1.5 1-1.5 1-3M15.5 7.5c0-1.5 1-1.5 1-3"/>',
  school: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2.6 9 2.6 12 0v-5M22 9v6"/>',
  book: '<path d="M4 4.5h5.5A2.5 2.5 0 0 1 12 7a2.5 2.5 0 0 1 2.5-2.5H20V19h-5.5a2.5 2.5 0 0 0-2.5 2 2.5 2.5 0 0 0-2.5-2H4z"/><path d="M12 7v14"/>',
  phone: '<rect x="6" y="2.5" width="12" height="19" rx="2.6"/><path d="M11 18h2"/>',
  scale: '<path d="M12 3v17M7.5 20.5h9M4 7h16"/><path d="M6 7 3 13.5a3 3 0 0 0 6 0zM18 7l-3 6.5a3 3 0 0 0 6 0z"/>',
  fire: '<path d="M12 3c1 3.5 5.5 5.5 5.5 10.5a5.5 5.5 0 0 1-11 0c0-2.2 1-3.8 2-4.8 0 1.6.8 2.7 2 3.2 0-3-1-5.4 1.5-8.9z"/>',
  star: '<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4l-5.5 2.9 1-6.2L3 9.7l6.2-.9z"/>',
  rocket: '<path d="M12 15.5 8.5 12C10 7 13.5 3.5 20.5 3.5 20.5 10.5 17 14 12 15.5z"/><path d="M8.5 12 5 11.5l2.5-3.5h4M12 15.5l.5 3.5 3.5-2.5v-4M5.5 18.5c.5-2 1.5-3 3-3"/>',
  bookmark: '<path d="M6 3h12v18l-6-4.5L6 21z"/>',
  send: '<path d="M21 3 10 14"/><path d="M21 3 14 21l-4-7-7-4z"/>',
  chat: '<path d="M4 5h16v11H9.5L4 20z"/>',
  'arrow-up': '<path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/>',
  'arrow-down': '<path d="M12 5v14M5.5 12.5 12 19l6.5-6.5"/>',
  'arrow-right': '<path d="M5 12h14M12.5 5.5 19 12l-6.5 6.5"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10.5" rx="2.4"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
};

export function icon(name, cls = '') {
  if (!name) return null;
  const svg = ICONS[name];
  if (!svg) return h('span', { class: 'ic txt ' + cls }, name);
  return h('span', { class: 'ic ' + cls, html: `<svg viewBox="0 0 24 24">${svg}</svg>` });
}
