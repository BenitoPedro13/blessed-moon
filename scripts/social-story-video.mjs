// Animates a Story frame from the post builder into an MP4 (TASK-launch-teaser-story.md).
// The art is the builder's own SVG (renderSlideSvg), not a redraw: this script only
// decides when each part appears. Every frame is set from its time and screenshotted,
// so the result doesn't depend on how fast the machine is. Each typed character gets a
// keystroke: a real keyboard (scripts/assets/keyboard, CC0), a different recorded key
// each time. Typing runs at a person's pace, with uneven gaps and pauses at
// spaces and punctuation; at terminal speed the clicks fused into a buzz (Benito: "machine
// gun"). The body paragraph fades in silently instead. Needs a running server:
//   SOCIAL_URL=http://localhost:3000 pnpm social:story-video [story-id]
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { chromium } from "playwright";
import sharp from "sharp";

const origin = process.env.SOCIAL_URL || "http://localhost:3000";
const id = process.argv[2] || "teaser-lancamento";
const FPS = 30, SECONDS = 11;
// The moon's float and wobble run at this fraction of real time; its turntable advances one
// fixed step per video frame (~3°/s). /system's specimen is a showcase; at full speed it
// bounced and pulled the eye off the copy (Benito: "a nice slow rhythm").
const MOON_TIME = 0.3;
const root = new URL("..", import.meta.url).pathname;
const outDir = join(root, "out/social"), frames = join(outDir, `${id}-frames`);
await rm(frames, { recursive: true, force: true });
await mkdir(frames, { recursive: true });

const keys = [];
const total = FPS * SECONDS;

// The moon turns as it does on the site. /system's AsciiObject specimen (the one
// `pnpm social:moon` captures as a still) runs on the main thread with autoRotate, so
// a frame scheduler injected before the page loads can advance it exactly one video frame
// at a time: once switched on, requestAnimationFrame callbacks wait for `__step`, so slow
// screenshots can't let the moon run on in real time (Playwright's fake clock didn't hold
// it: the moon turned whole faces between frames). Same
// capture settings as social:moon (2x, trimmed, 1000px), but one crop box for every
// frame so the moon doesn't jitter. On the Mac's GPU through ANGLE/Metal: the software
// renderer took minutes for 330 frames. Frames are switched to manual only after setup, and
// are page clips: locator actions wait on animation frames, which a held page never
// delivers. Cached: re-rendering the copy doesn't recapture.
async function captureMoon() {
  const dir = join(outDir, `moon-frames-${FPS}fps-${MOON_TIME}x`);
  if ((await readdir(dir).catch(() => [])).filter((f) => f.endsWith(".png")).length >= total) return dir;
  await mkdir(dir, { recursive: true });
  console.log(`Capturing ${total} moon frames from ${origin}/system (a few minutes)…`);
  const browser = await chromium.launch({ channel: "chromium", args: ["--use-angle=metal", "--ignore-gpu-blocklist", "--enable-gpu"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1400, height: 1200 }, deviceScaleFactor: 2, reducedMotion: "no-preference" });
    await page.addInitScript(() => {
      const real = window.requestAnimationFrame.bind(window), cancelReal = window.cancelAnimationFrame.bind(window);
      let queue = new Map(), id = 1e9, now = 0, manual = false;
      window.requestAnimationFrame = (cb) => { if (!manual) return real(cb); queue.set(++id, cb); return id; };
      window.cancelAnimationFrame = (n) => { if (!queue.delete(n)) cancelReal(n); };
      window.__startManual = () => { now = performance.now(); manual = true; };
      window.__step = (ms) => { now += ms; const run = [...queue.values()]; queue = new Map(); run.forEach((cb) => cb(now)); };
    });
    await page.goto(`${origin}/system`, { waitUntil: "load", timeout: 120000 });
    const box = page.locator("span", { hasText: /^AsciiObject$/ }).locator("xpath=following-sibling::div[1]");
    await box.scrollIntoViewIfNeeded();
    await box.evaluate((el) => { el.setAttribute("data-capture", ""); Object.assign(el.style, { height: "1000px", width: "1000px", background: "transparent", border: "0", position: "relative", zIndex: "9999" }); });
    await page.addStyleTag({ content: "html,body{background:transparent!important} body *{visibility:hidden!important;background:transparent!important} [data-capture],[data-capture] *{visibility:visible!important}" });
    // Let the model load and the canvas settle on the resized box, in real time.
    await page.waitForTimeout(8000);
    // The box grew after scrolling; a clip past the viewport's edge comes back cut off.
    await box.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(500);
    const clip = await box.boundingBox();
    if (clip.y < 0 || clip.y + clip.height > 1200) throw new Error("The moon's capture box doesn't fit the viewport.");
    await page.evaluate(() => window.__startManual());
    await page.waitForTimeout(300);
    const shots = [];
    for (let f = 0; f < total; f++) {
      await page.evaluate((ms) => window.__step(ms), (1000 / FPS) * MOON_TIME);
      shots.push(await page.screenshot({ clip, omitBackground: true }));
      if (f % 30 === 29) console.log(`  moon ${f + 1}/${total}`);
    }
    if (Buffer.compare(shots[0], shots[total - 1]) === 0) throw new Error("The moon didn't move: the frame scheduler isn't driving the engine.");
    // One crop for all frames: the union of each frame's trimmed bounds.
    let crop = null;
    for (const shot of [shots[0], shots[Math.floor(total / 2)], shots[total - 1]]) {
      const { info } = await sharp(shot).trim().toBuffer({ resolveWithObject: true });
      const b = { left: -info.trimOffsetLeft, top: -info.trimOffsetTop, right: -info.trimOffsetLeft + info.width, bottom: -info.trimOffsetTop + info.height };
      crop = crop ? { left: Math.min(crop.left, b.left), top: Math.min(crop.top, b.top), right: Math.max(crop.right, b.right), bottom: Math.max(crop.bottom, b.bottom) } : b;
    }
    const side = Math.max(crop.right - crop.left, crop.bottom - crop.top);
    const meta = await sharp(shots[0]).metadata();
    const left = Math.max(0, Math.round((crop.left + crop.right - side) / 2)), top = Math.max(0, Math.round((crop.top + crop.bottom - side) / 2));
    const region = { left, top, width: Math.min(side, meta.width - left), height: Math.min(side, meta.height - top) };
    await Promise.all(shots.map((shot, f) => sharp(shot).extract(region).resize(1000, 1000, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(join(dir, `${String(f).padStart(4, "0")}.png`))));
  } finally { await browser.close(); }
  return dir;
}
const moonDir = await captureMoon();
// Seeded, so a re-render is identical.
let seed = 1;
const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const response = await page.goto(`${origin}/post-builder?story=${id}`, { waitUntil: "load", timeout: 120000 });
  if (!response?.ok()) throw new Error(`${origin}/post-builder answered ${response?.status()}`);
  const svg = await page.locator('section[aria-label="Live slide preview"] [data-slide-art] > svg').first().evaluate((el) => el.outerHTML);
  if (!svg.includes('height="1920"')) throw new Error(`${id} is not a Story frame (1080×1920).`);

  // Same origin, so the fonts and the moon still resolve.
  await page.evaluate((markup) => {
    document.head.querySelectorAll("style,link[rel=stylesheet]").forEach((el) => el.remove());
    document.body.outerHTML = `<body style="margin:0;background:#05080d;overflow:hidden">${markup}</body>`;
  }, svg);
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images, ...document.querySelectorAll("image")].map((img) => img.decode?.().catch(() => {}))); });
  await page.waitForTimeout(500);

  // Find the parts by what they are, in document order. Text that sits in the bottom
  // or top band is chrome (logo label, footer); the rest is the slide's own copy.
  const meta = await page.evaluate(() => {
    const svg = document.querySelector("svg");
    const amber = "#ff6a1f";
    const texts = [...svg.querySelectorAll(":scope > text")];
    const chrome = texts.filter((t) => { const y = +t.getAttribute("y"); return y < 330 || y > 1580; });
    const copy = texts.filter((t) => !chrome.includes(t));
    const lines = copy.flatMap((t, block) => [...t.querySelectorAll("tspan")].map((span) => ({ span, block, text: span.textContent, mono: t.getAttribute("font-family").includes("Mono"), body: t.getAttribute("font-weight") === "400" })));
    lines.forEach((line) => { line.span.textContent = ""; });
    const NS = "http://www.w3.org/2000/svg";
    const cursor = document.createElementNS(NS, "rect");
    cursor.setAttribute("fill", amber);
    svg.appendChild(cursor);
    window.__parts = {
      logo: [...svg.querySelectorAll(":scope > g")].find((g) => +(/scale\(([\d.]+)\)/.exec(g.getAttribute("transform") || "")?.[1] ?? 99) < 10) ?? null,
      moon: svg.querySelector(":scope > image") ?? null,
      crescent: [...svg.querySelectorAll(":scope > g")].find((g) => +(/scale\(([\d.]+)\)/.exec(g.getAttribute("transform") || "")?.[1] ?? 0) >= 30) ?? null,
      dash: [...svg.querySelectorAll(":scope > rect")].find((r) => r.getAttribute("fill") === amber && +r.getAttribute("width") < 80) ?? null,
      chrome, lines, cursor,
    };
    return lines.map(({ block, text, mono, body }) => ({ block, text, mono, body }));
  });

  // The typing schedule: when each character appears, decided here, once, with a seeded
  // random. ~9 keys a second for the headline, quicker for the mono
  // eyebrow; a beat after a space, a real pause after punctuation, a breath between lines.
  seed = 11;
  let clock = 1.0, fadeAt = null;
  const schedule = meta.map((line, i) => {
    if (line.body) { fadeAt ??= clock + 0.3; return { times: [], fadeAt }; }
    if (i > 0 && meta[i - 1].block !== line.block) clock += meta[i - 1].mono ? 0.35 : 0.4;
    else if (i > 0) clock += 0.14;
    const times = [];
    for (const [k, char] of [...line.text].entries()) {
      times.push(clock);
      if (k === line.text.length - 1) break;
      clock += (line.mono ? 0.05 + random() * 0.03 : 0.075 + random() * 0.07) + (char === " " ? 0.04 : /[,.]/.test(char) ? 0.28 : 0);
    }
    return { times, fadeAt: null };
  });
  schedule.forEach((plan, i) => { const chars = [...meta[i].text]; plan.times.forEach((time, k) => keys.push({ time, space: chars[k] === " " })); });
  if (clock > SECONDS - 2.5) throw new Error(`Typing ends at ${clock.toFixed(1)}s; raise SECONDS so the Story holds on the finished frame.`);
  await page.evaluate((schedule) => { window.__schedule = schedule; }, schedule);

  // The timeline, in seconds.
  const render = (t) => page.evaluate((t) => {
    const P = window.__parts;
    const clamp = (v) => Math.max(0, Math.min(1, v));
    const ease = (v) => 1 - Math.pow(1 - clamp(v), 3);
    const fade = (el, v) => { if (el) el.style.opacity = String(clamp(v)); };
    // Chrome: the logo and labels come up first.
    fade(P.logo, (t - 0.2) / 0.5);
    P.chrome.forEach((el) => fade(el, (t - 0.4) / 0.5));
    fade(P.dash, (t - 0.9) / 0.2);
    // Copy: each line typed after the previous one finishes.
    let cursorAt = null, lastTyped = null;
    for (const [i, line] of P.lines.entries()) {
      const plan = window.__schedule[i];
      if (plan.fadeAt !== null) { line.span.textContent = line.text; fade(line.span, (t - plan.fadeAt) / 0.6); continue; }
      const n = plan.times.filter((time) => time <= t).length;
      line.span.textContent = line.text.slice(0, n);
      if (n > 0 && n < line.text.length) cursorAt = line;
      if (n === line.text.length) lastTyped = line;
    }
    cursorAt ??= lastTyped;
    // A block cursor follows the line being typed, then blinks at the end.
    if (cursorAt) {
      const box = cursorAt.span.getBBox();
      const size = +cursorAt.span.parentNode.getAttribute("font-size");
      const typedEnd = cursorAt.span.textContent ? box.x + box.width : +cursorAt.span.getAttribute("x");
      const done = cursorAt.span.textContent.length === cursorAt.text.length;
      Object.entries({ x: typedEnd + size * 0.08, y: box.y + box.height * 0.18, width: size * 0.5, height: box.height * 0.7 }).forEach(([k, v]) => P.cursor.setAttribute(k, v));
      P.cursor.style.opacity = done ? (Math.floor(t * 2) % 2 ? "0" : "1") : "1";
    } else P.cursor.style.opacity = "0";
    // The moon rises into place, then drifts up very slowly while the Story holds.
    for (const art of [P.moon, P.crescent]) {
      if (!art) continue;
      const v = ease((t - 0.6) / 2.2);
      art.style.opacity = String(v);
      art.style.transform = `translateY(${(1 - v) * 220 - Math.max(0, t - 2.8) * 6}px)`;
    }
  }, t);

  const hasMoon = await page.evaluate(() => Boolean(window.__parts.moon));
  for (let f = 0; f < total; f++) {
    await render(f / FPS);
    if (hasMoon) {
      const frame = `data:image/png;base64,${(await readFile(join(moonDir, `${String(f).padStart(4, "0")}.png`))).toString("base64")}`;
      await page.evaluate(async (href) => { const img = window.__parts.moon; img.setAttribute("href", href); await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))); }, frame);
    }
    await page.screenshot({ path: join(frames, `${String(f).padStart(4, "0")}.png`) });
  }
  await page.screenshot({ path: join(outDir, `${id}.png`) });
} finally { await browser.close(); }

// The soundtrack: one recorded keypress per character, mixed into a mono 48kHz buffer.
// Each recording is levelled to the same peak, then varied a little, so no key jumps out.
// The heaviest-sounding recordings are kept for the space bar.
const RATE = 48000;
const keyDir = join(root, "scripts/assets/keyboard");
const presses = [];
for (const file of (await readdir(keyDir)).filter((f) => f.endsWith(".wav")).sort()) {
  const decoded = spawnSync("ffmpeg", ["-loglevel", "error", "-i", join(keyDir, file), "-f", "f32le", "-ac", "1", "-ar", String(RATE), "-"], { maxBuffer: 1 << 24 });
  if (decoded.status !== 0) throw new Error(`ffmpeg could not decode ${file}. Is it installed (brew install ffmpeg)?`);
  const samples = new Float32Array(decoded.stdout.buffer.slice(decoded.stdout.byteOffset, decoded.stdout.byteOffset + decoded.stdout.length));
  const peak = samples.reduce((max, v) => Math.max(max, Math.abs(v)), 0);
  const energy = samples.reduce((sum, v) => sum + v * v, 0) / (peak * peak);
  presses.push({ samples: samples.map((v) => v / peak), energy });
}
presses.sort((a, b) => a.energy - b.energy);
const letters = presses.slice(0, -6), spaces = presses.slice(-6);
const track = new Float32Array(RATE * SECONDS);
seed = 7;
let previous = -1;
for (const { time, space } of keys) {
  const pool = space ? spaces : letters;
  let pick = Math.floor(random() * pool.length);
  if (!space && pick === previous) pick = (pick + 1) % pool.length;
  if (!space) previous = pick;
  const press = pool[pick].samples, gain = (space ? 0.42 : 0.34) * (0.85 + random() * 0.3), at = Math.round(time * RATE);
  for (let i = 0; i < press.length && at + i < track.length; i++) track[at + i] += gain * press[i];
}
for (let i = 0; i < track.length; i++) track[i] = Math.max(-1, Math.min(1, track[i]));
const audio = join(frames, "keys.f32");
await writeFile(audio, Buffer.from(track.buffer));

const mp4 = join(outDir, `${id}.mp4`);
const ff = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", join(frames, "%04d.png"), "-f", "f32le", "-ar", String(RATE), "-ac", "1", "-i", audio, "-c:a", "aac", "-b:a", "192k", "-shortest", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", "-preset", "slow", "-movflags", "+faststart", mp4], { stdio: "inherit" });
if (ff.status !== 0) throw new Error("ffmpeg failed. Is it installed (brew install ffmpeg)?");
await rm(frames, { recursive: true, force: true });
console.log(`Saved ${mp4}\nSaved ${join(outDir, `${id}.png`)}`);
