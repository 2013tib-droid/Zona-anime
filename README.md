# Zona Anime — Bank Ilustrasi Chibi/Anime untuk Konten Edukasi

Bank gambar bergaya komik/anime untuk konten edukasi finansial, ekonomi, dan sosial di **Instagram & Threads**:
**6 karakter chibi** (15 ekspresi, 10 pose, efek manga), **komik panel**, **meme/reaksi**, **infografis + maskot**,
plus 15 komponen data (angka, grafik, daftar, dll). Satu konten = satu file JSON pendek.

```
content/gajian.json  ──►  npm run gambar  ──►  out/gajian/carousel-feed/01.png, 02.png ...  (carousel 4:5)
                     ──►  npm run render  ──►  out/gajian/gajian-reel.mp4                     (opsional, video)
```

Karakter digambar lewat kode (SVG, gaya chibi flat). Mau gaya anime yang lebih detail? Siapkan PNG karaktermu
sendiri (dari ilustrator / AI image) lalu daftarkan di `"cast"` — semua tata letak komik tetap bisa dipakai.

## Persiapan (sekali saja)
1. Install [Node.js 18+](https://nodejs.org) dan [ffmpeg](https://ffmpeg.org/download.html).
2. Di folder ini:
   ```bash
   npm install
   npx playwright install chromium
   ```

## Pemakaian
```bash
npm run baru -- tabungan-darurat "Kenapa perlu dana darurat?" sosial      # buat file konten (templat komik)
npm run preview                                                            # lihat live: http://localhost:5173
npm run check -- content/tabungan-darurat.json                             # validasi cepat
npm run render -- content/tabungan-darurat.json                            # video MP4 + cover + caption
npm run render -- content/tabungan-darurat.json --format reel,square       # beberapa format sekaligus
npm run gambar -- content/tabungan-darurat.json                            # GAMBAR carousel PNG (utama)
```

## Isi bank
- **Pemeran**: `rina`, `bima`, `sari` (berhijab), `ayu`, `dodi` (bapak-bapak), `koko` (maskot koin) — bisa tambah sendiri via JSON
- **Bergambar**: `comic` (1–4 panel, balon kata, SFX, narasi), `meme`, `mascot`, `lineup`, plus maskot pojok di slide mana pun
- **Komponen data**: `title`, `stat`, `bars`, `line`, `compare`, `list`, `quote`, `donut`, `timeline`, `mythfact`, `people`, `receipt`, `chat`, `image`, `cta`
- **Tema**: `finansial`, `ekonomi`, `sosial`, `netral`, `terang`
- **Format**: `reel` 9:16, `feed` 4:5, `square` 1:1 — area aman UI Instagram sudah diperhitungkan.
- **Ikon**: 45+ ikon garis buatan sendiri. **Font**: Plus Jakarta Sans (OFL).

Daftar lengkap prop tiap komponen ada di [`CLAUDE.md`](CLAUDE.md). Lihat semuanya: `npm run katalog`.

## Kerja bareng Claude (hemat token)
Cukup minta: *"Buat komik carousel tentang bunga majemuk."*
Claude hanya akan menulis satu file `content/*.json` berdasarkan katalog di `CLAUDE.md`, tanpa membaca ulang kode mesin.

## Musik
Taruh file di `assets/audio/` lalu tambahkan `"audio": "assets/audio/lagu.mp3"` di JSON. Gunakan musik bebas royalti.
Untuk Reels, kamu juga bisa menambah musik langsung dari aplikasi Instagram.

## Struktur
```
engine/   mesin: pemutar, timeline, gaya, tema, ikon
bank/     komponen animasi (1 file = 1 komponen)
content/  file konten JSON (yang kamu tulis)
tools/    render video/carousel, server pratinjau, pembuat templat
assets/   font, audio, gambar milikmu
out/      hasil render (tidak masuk git)
```
