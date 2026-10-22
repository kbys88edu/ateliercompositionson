// node render.mjs [out.mp4] [first] [last]   — frames are rendered strictly in order (the sand has memory)
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || path.join(here, 'out', 'reel.mp4');
const first = +(process.argv[3] || 0), last = +(process.argv[4] || 1e9);
const stills = process.env.STILLS ? process.env.STILLS.split(',').map(Number) : [];
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('console', m => console.log('[page]', m.text())); page.on('pageerror', e => console.log('[pageerror]', e.message));
await page.goto('file://' + path.join(here, 'reel.html') + (process.env.BG ? '?bg=' + process.env.BG : ''));
await page.waitForFunction('window.READY === true');
const total = await page.evaluate('window.TOTAL');
let ff = null;
if (!stills.length) {
  ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
    '-i', path.join(here, 'out', 'audio.wav'),
    '-map', '0:v', '-map', '1:a', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=9,afade=t=out:st=14.55:d=0.45',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-maxrate', '9M', '-bufsize', '18M', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', '30', '-g', '30', '-movflags', '+faststart',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', '15', out], { stdio: ['pipe', 'inherit', 'inherit'] });
}
const t0 = Date.now();
for (let i = 0; i < total; i++) {
  await page.evaluate(`window.renderFrame(${i})`);
  if (stills.includes(i)) { await page.screenshot({ path: path.join(here, 'out', `still_${String(i).padStart(3, '0')}.png`), timeout: 120000 }); }
  if (ff && i >= first && i <= last) {
    const buf = await page.screenshot({ type: 'jpeg', quality: 97, timeout: 120000 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  if (i % 30 === 0) console.log(`frame ${i}/${total}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  if (stills.length && i >= Math.max(...stills)) break;
}
if (ff) { ff.stdin.end(); await new Promise(r => ff.on('close', r)); }
await browser.close();
console.log('done', out);
