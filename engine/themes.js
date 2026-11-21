// Palet tema. Pilih lewat "theme": "<nama>" di file konten.
// Bisa override warna aksen saja dengan "accent": "#hex" di file konten.
export const THEMES = {
  finansial: { // hijau tua + mint, cocok untuk uang/investasi/tabungan
    bg: '#0B1F17', bg2: '#145A3C', fg: '#F2F7F4', muted: '#9DB8AC',
    accent: '#7CF29C', accent2: '#F7D154', accent3: '#5CC8FF', good: '#7CF29C', bad: '#FF7272',
    card: 'rgba(255,255,255,.06)', line: 'rgba(255,255,255,.12)', onAccent: '#0B1F17',
  },
  ekonomi: { // navy + amber, cocok untuk makro/kebijakan/berita ekonomi
    bg: '#0C1530', bg2: '#22378A', fg: '#F3F5FB', muted: '#A3AECB',
    accent: '#FFB547', accent2: '#6F9BFF', accent3: '#39D3B5', good: '#39D3B5', bad: '#FF6B7A',
    card: 'rgba(255,255,255,.06)', line: 'rgba(255,255,255,.12)', onAccent: '#0C1530',
  },
  sosial: { // krem hangat + terakota, cocok untuk isu sosial/keluarga/karier
    bg: '#FBF4EA', bg2: '#F2C9A8', fg: '#2A1E17', muted: '#7D6A5C',
    accent: '#D9481F', accent2: '#2E86AB', accent3: '#E9A23B', good: '#2A9D6F', bad: '#D64545',
    card: 'rgba(255,255,255,.75)', line: 'rgba(42,30,23,.12)', onAccent: '#FFFFFF',
  },
  netral: { // gelap + ungu, serbaguna
    bg: '#111114', bg2: '#3B2A6B', fg: '#F5F5F7', muted: '#A1A1AA',
    accent: '#B49BFF', accent2: '#F472B6', accent3: '#34D399', good: '#34D399', bad: '#F87171',
    card: 'rgba(255,255,255,.06)', line: 'rgba(255,255,255,.12)', onAccent: '#111114',
  },
  terang: { // putih bersih + biru, gaya infografis
    bg: '#F6F8FB', bg2: '#C9DAFF', fg: '#0F172A', muted: '#64748B',
    accent: '#2563EB', accent2: '#F59E0B', accent3: '#10B981', good: '#10B981', bad: '#EF4444',
    card: 'rgba(255,255,255,.85)', line: 'rgba(15,23,42,.1)', onAccent: '#FFFFFF',
  },
};
