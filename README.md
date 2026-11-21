# Zona Anime — Bank Animasi Konten Edukasi

Mesin animasi + **15 komponen siap pakai** untuk konten edukasi finansial, ekonomi, dan sosial di **Instagram & Threads**.
Satu konten = satu file JSON pendek. Tanpa After Effects, tanpa desain ulang tiap post.

```
content/inflasi.json  ──►  npm run render   ──►  out/inflasi/inflasi-reel.mp4   (Reels / Threads)
                      ──►  npm run carousel ──►  out/inflasi/carousel-feed/*.png (Carousel 4:5)
```

## Persiapan (sekali saja)
1. Install [Node.js 18+](https://nodejs.org) dan [ffmpeg](https://ffmpeg.org/download.html).
2. Di folder ini:
   ```bash
   npm install
   npx playwright install chromium
   ```

## Pemakaian
```bash
npm run baru -- tabungan-darurat "Kenapa perlu dana darurat?" finansial   # buat file konten
npm run preview                                                            # lihat live: http://localhost:5173
npm run check -- content/tabungan-darurat.json                             # validasi cepat
npm run render -- content/tabungan-darurat.json                            # video MP4 + cover + caption
npm run render -- content/tabungan-darurat.json --format reel,square       # beberapa format sekaligus
npm run carousel -- content/tabungan-darurat.json                          # slide carousel PNG
```

## Isi bank
- **Komponen**: `title`, `stat`, `bars`, `line`, `compare`, `list`, `quote`, `donut`, `timeline`, `mythfact`, `people`, `receipt`, `chat`, `image`, `cta`
- **Tema**: `finansial`, `ekonomi`, `sosial`, `netral`, `terang`
- **Format**: `reel` 9:16, `feed` 4:5, `square` 1:1 — area aman UI Instagram sudah diperhitungkan.
- **Ikon**: 45+ ikon garis buatan sendiri. **Font**: Plus Jakarta Sans (OFL).

Daftar lengkap prop tiap komponen ada di [`CLAUDE.md`](CLAUDE.md). Lihat semuanya: `npm run katalog`.

## Kerja bareng Claude (hemat token)
Cukup minta: *"Buat reel tentang bunga majemuk, tema finansial."*
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
