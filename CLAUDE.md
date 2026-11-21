# Zona Anime — bank animasi konten edukasi (IG & Threads)

## ATURAN HEMAT TOKEN (wajib)
- Konten baru = **tulis 1 file `content/<slug>.json` saja**. JANGAN baca `engine/` atau `bank/` — semua yang perlu diketahui ada di katalog di bawah.
- Jangan render video untuk mengecek; pakai `npm run check -- content/<slug>.json` (validasi + durasi, ±2 detik).
- Kalau perlu cek visual, pakai `npm run carousel -- content/<slug>.json` (PNG, cepat) lalu lihat 1–2 slide saja.
- Baca kode bank hanya jika user minta komponen BARU atau ada bug di komponen.
- Bahasa konten: Indonesia santai (gaya IG/Threads). Teks per scene singkat (≤ 20 kata).
- Akurasi: angka nyata wajib punya `"source"`. Angka contoh/asumsi wajib `"note": "Ilustrasi: ..."`. Jangan mengarang statistik.

## Perintah
| Perintah | Hasil |
|---|---|
| `npm run baru -- <slug> "Judul" [tema]` | buat `content/<slug>.json` dari templat |
| `npm run check -- content/x.json` | validasi + durasi per scene |
| `npm run render -- content/x.json [--format reel,feed]` | `out/x/x-reel.mp4` + `cover-reel.png` + `caption.txt` |
| `npm run carousel -- content/x.json [--format feed]` | `out/x/carousel-feed/01.png ...` (1 slide per scene) |
| `npm run preview` | http://localhost:5173 — pratinjau live di browser |
| `npm run katalog` | render semua komponen (`content/_katalog.json`) |

## Struktur file konten
```json
{
  "title": "Judul internal", "theme": "finansial", "format": "reel",
  "series": "Edukasi Finansial", "handle": "@zona.anime",
  "accent": "#hex (opsional)", "audio": "assets/audio/x.mp3 (opsional)", "audioVolume": 0.6,
  "brand": true, "progress": true,
  "caption": "teks caption + hashtag → out/x/caption.txt",
  "scenes": [ { "type": "title", "text": "..." } ]
}
```
- **format**: `reel` 1080×1920 (Reels/Threads video) · `feed` 1080×1350 (4:5 carousel) · `square` 1080×1080
- **theme**: `finansial` (hijau+mint) · `ekonomi` (navy+amber) · `sosial` (krem+terakota, terang) · `netral` (gelap+ungu) · `terang` (putih+biru)
- **Teks kaya** (semua field teks): `*kata*` = sorotan warna aksen + stabilo; `\n` = baris baru. Emoji boleh.
- **Prop umum semua scene**: `dur` (detik, override otomatis), `source` (tampil "Sumber: ..."), `note` (catatan kecil apa adanya).
- **Format angka** (`stat`, `bars`, `line`, `receipt`, `donut` showValue): `format`: `number`|`rupiah`|`rupiah-compact` (Rp1,2 jt)|`compact` (1,2 jt)|`percent`; plus `decimals`, `prefix`, `suffix`.
- **tone**: `good` (hijau) | `bad` (merah) | `accent`.

## Katalog komponen (`type`)
| type | wajib | opsional | kegunaan |
|---|---|---|---|
| `title` | text | kicker, icon, sub, size:`m`, align:`left` | hook/judul/pernyataan besar, kata muncul satu-satu |
| `stat` | value | from, label, sub, kicker, icon, trend:`up`/`down`, tone, +format | angka besar menghitung (from→value) |
| `bars` | items[{label,value,hl?,tone?,color?}] | title, vertical, max, +format | diagram batang; `hl:true` sorot satu batang |
| `line` | points[{x,y}] *atau* labels[]+values[] | title, sub, tone, min, max, height, +format | grafik garis tergambar + label nilai berjalan |
| `compare` | left{}, right{} | title, vs | 2 kartu A vs B. kartu: {title, icon, value, items[], tone} (default kiri bad, kanan good) |
| `list` | items[str \| {text,sub,icon}] | title, style:`number`/`check`/`x`/`dot`/`icon` | poin muncul berurutan |
| `quote` | text | by, role | kutipan |
| `donut` | items[{label,value,color?}] | title, center, showValue, +format | porsi/alokasi; otomatis persen |
| `timeline` | items[{label,text}] | title | langkah/linimasa |
| `mythfact` | myth, fact | mythLabel, factLabel | MITOS dicoret → FAKTA |
| `people` | highlight | total (10), icon, label, text, cols | isotype "3 dari 10" |
| `receipt` | rows[{label,value,op?:`+`/`-`}] | title, total{label,value?}, +format (default rupiah) | nota/hitungan; total otomatis |
| `chat` | messages[{from:`a`/`b`,text}] | title, names{a,b} | percakapan; `b` = kanan (kita) |
| `image` | src (`assets/img/..`) | title, caption, height, fit | foto milik sendiri + zoom pelan |
| `cta` | – | text, sub, actions[`save`,`share`,`follow`,`comment`,`like`], handle | penutup ajakan |

**Ikon** (`icon`): coin money wallet bank card cart house chart chart-up chart-down piggy percent receipt tag clock calendar target bulb warning check x question person users user-plus family briefcase shield heart globe factory fuel food school book phone scale fire star rocket bookmark send chat arrow-up arrow-down arrow-right lock — nama lain/emoji tampil sebagai teks.

## Pola konten yang terbukti (pakai ulang)
- **Reel edukasi 25–40 detik**: `title`(hook) → `title size:m`(definisi) → data (`stat`/`line`/`bars`) → `mythfact` atau `compare` → `list`(tips) → `cta`.
- **Carousel 5–8 slide**: format `feed`, slide 1 = `title` hook kuat, terakhir `cta`.
- **Threads**: pakai video `reel` atau `square`; caption lebih panjang, ajak diskusi (`cta` actions `comment`).
- Contoh lengkap: `content/contoh-inflasi.json`, `contoh-50-30-20.json`, `contoh-sandwich.json`.

## Menambah komponen baru (jarang)
Salin pola `bank/stat.js` → `define(type, {required, dur(p), build(p, ctx) → {el, update(t, dur)}})`. Animasi HARUS dihitung dari `t` saja (helper di `engine/core.js`: `prog`, `ease`, `fadeUp`, `popIn`, `revealWords`, `fmt`). Daftarkan di `bank/index.js`, tambah baris di tabel katalog ini dan contoh di `content/_katalog.json`.
