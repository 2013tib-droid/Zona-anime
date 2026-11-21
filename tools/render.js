// Render konten JSON -> video MP4 / slide carousel PNG / cover / caption.
//   node tools/render.js content/x.json [lainnya.json ...] [opsi]
// Opsi:
//   --format reel|feed|square   (boleh koma: reel,feed)  default: "format" di JSON, atau reel
//   --carousel                  ekspor juga slide PNG per scene (default format feed)
//   --no-video                  lewati video
//   --check                     hanya validasi + tampilkan durasi (cepat, tanpa render)
//   --fps 30                    frame per detik
//   --out out                   folder hasil
//   --workers 4                 jumlah tab paralel (default = jumlah CPU, maks 6)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { serve, ROOT } from './server.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const flag = n => args.includes('--' + n);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const files = args.filter((a, i) => !a.startsWith('--') && !['--format', '--fps', '--out', '--workers'].includes(args[i - 1]));
if (!files.length) { console.log('Pakai: node tools/render.js content/nama.json [--format reel] [--carousel] [--check]'); process.exit(1); }
const FPS = Number(opt('fps', 30));
const OUT = path.resolve(ROOT, opt('out', 'out'));
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const HEIGHTS = { reel: 1920, feed: 1350, square: 1080 };

const { server, port } = await serve(0);
const browser = await chromium.launch();
let failed = 0;

try {
  for (const f of files) {
    const abs = path.resolve(f);
    if (!abs.startsWith(ROOT)) { console.error(`✗ ${f}: file harus di dalam folder proyek`); failed++; continue; }
    const rel = '/' + path.relative(ROOT, abs).split(path.sep).join('/');
    const slug = path.basename(f, '.json');
    let data;
    try { data = JSON.parse(fs.readFileSync(abs, 'utf8')); } catch (e) { console.error(`✗ ${f}: ${e.message}`); failed++; continue; }
    const dir = path.join(OUT, slug);
    const vidFormats = (opt('format') || data.format || 'reel').split(',');
    console.log(`\n▶ ${slug} — "${data.title || ''}"`);

    const open = async (format, mode) => {
      const page = await browser.newPage({ viewport: { width: 1080, height: HEIGHTS[format] || 1920 } });
      page.on('pageerror', e => console.error('  [browser]', e.message));
      await page.goto(`http://127.0.0.1:${port}/engine/player.html?c=${encodeURIComponent(rel)}&f=${format}&mode=${mode}&headless`);
      await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 30000 });
      const err = await page.evaluate(() => window.__error);
      if (err) { await page.close(); throw new Error(err); }
      return page;
    };

    try {
      if (flag('check')) {
        const page = await open(vidFormats[0], 'video');
        const info = await page.evaluate(() => window.__info);
        info.scenes.forEach((s, i) => console.log(`  ${String(i + 1).padStart(2)}. ${s.type.padEnd(9)} ${s.dur.toFixed(1)}s`));
        console.log(`  ✓ valid — total ${info.total.toFixed(1)} detik`);
        await page.close();
        continue;
      }
      fs.mkdirSync(dir, { recursive: true });
      if (data.caption) fs.writeFileSync(path.join(dir, 'caption.txt'), data.caption + '\n');

      if (!flag('no-video')) for (const format of vidFormats) {
        const page = await open(format, 'video');
        const info = await page.evaluate(() => window.__info);
        await page.evaluate(() => window.__seekScene(0));
        await page.screenshot({ path: path.join(dir, `cover-${format}.png`) });
        const outFile = path.join(dir, `${slug}-${format}.mp4`);
        const n = Math.ceil(info.total * FPS);
        // Render paralel: beberapa tab merekam potongan frame berbeda (animasi deterministik).
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'zona-'));
        const workers = Math.max(1, Math.min(Number(opt('workers', os.cpus().length)), 6));
        const chunk = Math.ceil(n / workers);
        let doneFrames = 0;
        await Promise.all(Array.from({ length: workers }, async (_, w) => {
          const p = w === 0 ? page : await open(format, 'video');
          const cdp = await p.context().newCDPSession(p);
          for (let i = w * chunk; i < Math.min(n, (w + 1) * chunk); i++) {
            await p.evaluate(t => window.__seek(t), i / FPS);
            const { data: b64 } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 93, optimizeForSpeed: true });
            fs.writeFileSync(path.join(tmp, String(i).padStart(6, '0') + '.jpg'), Buffer.from(b64, 'base64'));
            if (++doneFrames % 15 === 0) process.stdout.write(`\r  ${format}: ${Math.round((doneFrames / n) * 100)}%   `);
          }
          if (w !== 0) await p.close();
        }));
        const audio = info.audio && path.resolve(ROOT, info.audio);
        await new Promise((res, rej) => {
          const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, '%06d.jpg'),
            ...(audio ? ['-stream_loop', '-1', '-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k',
              '-af', `volume=${info.audioVolume ?? 0.6},afade=t=out:st=${Math.max(0, info.total - 1.2)}:d=1.2`, '-shortest'] : []),
            '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outFile], { stdio: 'inherit' });
          ff.on('close', c => (c ? rej(new Error('ffmpeg gagal (kode ' + c + ')')) : res()));
          ff.on('error', e => rej(new Error('ffmpeg tidak ditemukan. Install ffmpeg atau set env FFMPEG. ' + e.message)));
        }).finally(() => fs.rmSync(tmp, { recursive: true, force: true }));
        console.log(`\r  ✓ ${path.relative(ROOT, outFile)} (${info.total.toFixed(1)} detik, ${n} frame)`);
        await page.close();
      }

      if (flag('carousel')) {
        const format = opt('format') || data.carouselFormat || 'feed';
        const page = await open(format, 'carousel');
        const info = await page.evaluate(() => window.__info);
        const cdir = path.join(dir, `carousel-${format}`);
        fs.mkdirSync(cdir, { recursive: true });
        for (let i = 0; i < info.scenes.length; i++) {
          await page.evaluate(i => window.__seekScene(i), i);
          await page.screenshot({ path: path.join(cdir, `${String(i + 1).padStart(2, '0')}.png`) });
        }
        console.log(`  ✓ ${path.relative(ROOT, cdir)}/ (${info.scenes.length} slide)`);
        await page.close();
      }
    } catch (e) {
      console.error(`  ✗ ${e.message}`);
      failed++;
    }
  }
} finally {
  await browser.close();
  server.close();
}
process.exit(failed ? 1 : 0);
