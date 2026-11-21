# Zona Anime — bank ilustrasi chibi/anime untuk konten edukasi (IG & Threads)

Fokus utama: **GAMBAR** (carousel PNG 4:5) bergaya komik/anime dengan karakter chibi. Video hanya opsional.

## ATURAN HEMAT TOKEN (wajib)
- Konten baru = **tulis 1 file `content/<slug>.json` saja**. JANGAN baca `engine/` atau `bank/` — semua yang perlu diketahui ada di katalog di bawah.
- Validasi: `npm run check -- content/<slug>.json` (±2 detik). Hasil akhir: `npm run gambar -- content/<slug>.json` (PNG, ±5 detik).
- Jangan render video kecuali diminta. Cek visual cukup 1–2 slide.
- Default: `"format": "feed"`, scene bergambar (`comic`/`meme`/`mascot`/`lineup`) + prop `chara` di scene data.
- Baca kode bank hanya jika user minta komponen BARU atau ada bug di komponen.
- Bahasa konten: Indonesia santai (gaya IG/Threads). Teks per scene singkat (≤ 20 kata).
- Akurasi: angka nyata wajib punya `"source"`. Angka contoh/asumsi wajib `"note": "Ilustrasi: ..."`. Jangan mengarang statistik.

## Perintah
| Perintah | Hasil |
|---|---|
| `npm run baru -- <slug> "Judul" [tema]` | buat `content/<slug>.json` dari templat (komik) |
| `npm run gambar -- content/x.json [--format square]` | **utama**: `out/x/carousel-feed/01.png ...` (1 gambar per scene) |
| `npm run check -- content/x.json` | validasi + durasi per scene |
| `npm run render -- content/x.json [--format reel]` | (opsional) video MP4 + cover + `caption.txt` |
| `npm run preview` | http://localhost:5173 — pratinjau live di browser |
| `npm run katalog` | render semua komponen + karakter (`content/_katalog.json`, `_karakter.json`) |

## Struktur file konten
```json
{
  "title": "Judul internal", "theme": "sosial", "format": "feed",
  "series": "Edukasi Finansial", "handle": "@zona.anime",
  "accent": "#hex (opsional)", "audio": "assets/audio/x.mp3 (opsional)", "audioVolume": 0.6,
  "brand": true, "progress": true,
  "caption": "teks caption + hashtag → out/x/caption.txt",
  "cast": { "andi": { "hair": "pendek", "hairColor": "#5A3A2A", "outfit": "kemeja", "outfitColor": "#9AD0F5" } },
  "scenes": [ { "type": "title", "text": "..." } ]
}
```
- **format**: `reel` 1080×1920 (Reels/Threads video) · `feed` 1080×1350 (4:5 carousel) · `square` 1080×1080
- **theme**: `finansial` (hijau+mint) · `ekonomi` (navy+amber) · `sosial` (krem+terakota, terang) · `netral` (gelap+ungu) · `terang` (putih+biru)
- **Teks kaya** (semua field teks): `*kata*` = sorotan warna aksen + stabilo; `\n` = baris baru. Emoji boleh.
- **Prop umum semua scene**: `source` (tampil "Sumber: ..."), `note` (catatan kecil), `dur` (detik, hanya untuk video), `chara` (maskot di pojok, lihat bawah).
- **Format angka** (`stat`, `bars`, `line`, `receipt`, `donut` showValue): `format`: `number`|`rupiah`|`rupiah-compact` (Rp1,2 jt)|`compact` (1,2 jt)|`percent`; plus `decimals`, `prefix`, `suffix`.
- **tone**: `good` (hijau) | `bad` (merah) | `accent`.

## Karakter (inti bank bergambar)
Objek karakter dipakai di `comic.panels[].chars[]`, `meme`, `mascot`, `lineup.chars[]`, dan prop `chara`:
`{ "char": "bima", "expr": "kaget", "pose": "panik", "item": "hp", "fx": ["keringat"], "flip": false, "shot": "bust", "x": 50, "scale": 1 }`
- **char** (pemeran): `rina` (cewek rambut panjang, kaos oranye) · `bima` (cowok, hoodie hijau) · `sari` (cewek berhijab, kemeja, rok) · `ayu` (cewek bob, seragam pelaut) · `dodi` (bapak-bapak, jas, kacamata, kumis) · `koko` (maskot koin emas)
- **Calon maskot brand (super-chibi gemes)**: `zuzu` (kucing pembawa rezeki, kalung koin Z) · `cimo` (celengan ayam, motif bunga) · `zona` (Zona-chan, anak hoodie telinga kucing, ahoge Z). Bisa recolor via `cast` (mis. `{"base":"kucing","patch":"#888","eyes":"#39f"}`; kunci warna: skin body paw patch patch2 comb eyes accent gold hairColor).
- **expr**: netral senang tertawa kaget sedih nangis marah bingung mikir malu bangga panik berbinar lelah datar (efek otomatis: kaget→!, marah→urat, bingung→?, panik→keringat, berbinar→kilau, lelah→suram)
- **pose**: diri tunjuk sorak pikir panik lambai jelasin pegang silang tepokjidat
- **item** (hanya pose `pegang`): koin hp uang dompet buku · atau nama ikon/emoji
- **fx** tambahan: keringat marah tanya seru kilau love suram zzz ide uang
- **shot** (framing): `full` (seluruh badan) · `bust` (default komik, dada ke atas) · `close` (wajah) · **x** = posisi horizontal % · **flip** = cermin
- **Karakter baru via JSON** (`cast` di root file): `hair`: pendek rapi panjang kuncir bob sanggul hijab tipis · `hairColor` · `eyes` (warna iris) · `skin` · `outfit`: kaos kemeja hoodie seragam jas · `outfitColor` · `bottom` (celana/rok) · `rok`: true · `tie` · `acc`: ["kacamata","kumis"] · `base`: "koin"
- **Pakai gambar sendiri** (anime detail dari ilustrator/AI): `"cast": { "dita": { "img": "assets/chara/dita/{expr}.png" } }` → PNG transparan per ekspresi (rasio 480×680, kaki di bawah). `{pose}` juga bisa dipakai di path.
- Teks balon pendek: ≤ 12 kata per balon, ≤ 2 balon per panel kecil.

## Katalog komponen (`type`)
| type | wajib | opsional | kegunaan |
|---|---|---|---|
| `comic` | panels[] | title, layout, gap | halaman komik 1–4 panel. panel: {bg, chars[], bubbles[{who, text, type, x, y, w, size}], narr, sfx[{text,x,y,rot,size,color}\|"TEKS"]}. layout: `1` `2` `2c` `3` `3b` `3r` `4` `4r` (default = jumlah panel). bubble type: `speech` `think` `shout` `bisik` `narr`; `who` = indeks karakter di panel |
| `meme` | – | char/expr/pose…, top, bottom, bg (`fokus`), sfx | reaksi/meme: karakter besar + teks atas/bawah |
| `mascot` | – | char/expr/pose…, kicker, title, text, items[], value(+format), label, say, sayType, side (`right`), charSize | infografis + maskot yang menjelaskan dengan balon |
| `lineup` | chars[] | title; per char: label, desc, shot | barisan karakter ("tipe-tipe orang saat gajian") |
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

**Latar panel** (`bg`): polos fokus kilau suram halftone ruang luar kota uang kantor · atau warna hex.

**Maskot pojok** (prop `chara` di scene non-bergambar, mis. `stat`/`list`/`donut`/`cta`): `{ char, expr, pose (default jelasin), say, side: right|left, size }`.

**Ikon** (`icon`): coin money wallet bank card cart house chart chart-up chart-down piggy percent receipt tag clock calendar target bulb warning check x question person users user-plus family briefcase shield heart globe factory fuel food school book phone scale fire star rocket bookmark send chat arrow-up arrow-down arrow-right lock — nama lain/emoji tampil sebagai teks.

## Pola konten yang terbukti (pakai ulang)
- **Komik carousel 5–7 gambar (utama)**: `meme` hook → `comic` 4 panel (masalah) → `comic` 2 panel (solusi/dialog) → data (`donut`/`stat` + `chara`) → `mascot` tips → `cta` + `chara`. Contoh: `content/contoh-komik-gajian.json`.
- **Komik strip 1 gambar** (Threads/feed): 1 scene `comic` layout `4` atau `3r`, format `feed`/`square`.
- **Meme/reaksi**: 1 scene `meme`.
- **Reel edukasi 25–40 detik**: `title`(hook) → `title size:m`(definisi) → data (`stat`/`line`/`bars`) → `mythfact` atau `compare` → `list`(tips) → `cta`.
- **Carousel 5–8 slide**: format `feed`, slide 1 = `title` hook kuat, terakhir `cta`.
- **Threads**: pakai video `reel` atau `square`; caption lebih panjang, ajak diskusi (`cta` actions `comment`).
- Contoh lengkap: `contoh-komik-gajian.json` (bergambar), `contoh-inflasi.json`, `contoh-50-30-20.json`, `contoh-sandwich.json` (teks/data).

## Menambah komponen/ekspresi/pose baru (jarang)
Ekspresi, pose, rambut, baju, efek: tabel di `engine/chara.js` (`EXPR`, `POSE`, `HAIR_*`, `FX`, `CAST`). Latar panel & balon: `engine/comic.js`.
Salin pola `bank/stat.js` → `define(type, {required, dur(p), build(p, ctx) → {el, update(t, dur)}})`. Animasi HARUS dihitung dari `t` saja (helper di `engine/core.js`: `prog`, `ease`, `fadeUp`, `popIn`, `revealWords`, `fmt`). Daftarkan di `bank/index.js`, tambah baris di tabel katalog ini dan contoh di `content/_katalog.json`.
