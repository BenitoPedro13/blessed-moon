// Animates a Story frame from the post builder into an MP4 (TASK-launch-teaser-story.md).
// The art is the builder's own SVG (renderSlideSvg), not a redraw: this script only
// decides when each part appears. Every frame is set from its time and screenshotted,
// so the result doesn't depend on how fast the machine is. Needs a running server:
//   SOCIAL_URL=http://localhost:3000 pnpm social:story-video [story-id]
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { chromium } from "playwright";

const origin = process.env.SOCIAL_URL || "http://localhost:3000";
const id = process.argv[2] || "teaser-lancamento";
const FPS = 30, SECONDS = 9;
const root = new URL("..", import.meta.url).pathname;
const outDir = join(root, "out/social"), frames = join(outDir, `${id}-frames`);
await rm(frames, { recursive: true, force: true });
await mkdir(frames, { recursive: true });

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
  await page.evaluate(() => {
    const svg = document.querySelector("svg");
    const amber = "#ff6a1f";
    const texts = [...svg.querySelectorAll(":scope > text")];
    const chrome = texts.filter((t) => { const y = +t.getAttribute("y"); return y < 330 || y > 1580; });
    const copy = texts.filter((t) => !chrome.includes(t));
    const lines = copy.flatMap((t) => [...t.querySelectorAll("tspan")].map((span) => ({ span, text: span.textContent, mono: t.getAttribute("font-family").includes("Mono") })));
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
  });

  // The timeline, in seconds. Typing is ~22 characters a second for headlines,
  // faster for the mono eyebrow and the body, like a terminal printing.
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
    let start = 1.0, cursorAt = null;
    for (const [i, line] of P.lines.entries()) {
      const rate = line.mono ? 34 : i >= P.lines.length - 2 && line.text.length > 30 ? 60 : 20;
      const n = Math.floor(Math.max(0, t - start) * rate);
      line.span.textContent = line.text.slice(0, n);
      if (n > 0 && n < line.text.length) cursorAt = line;
      if (n >= line.text.length && i === P.lines.length - 1 && !cursorAt) cursorAt = line;
      start += line.text.length / rate + (line.mono ? 0.35 : 0.18);
    }
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
    return start;
  }, t);

  const total = FPS * SECONDS;
  for (let f = 0; f < total; f++) {
    await render(f / FPS);
    await page.screenshot({ path: join(frames, `${String(f).padStart(4, "0")}.png`) });
  }
  await page.screenshot({ path: join(outDir, `${id}.png`) });
} finally { await browser.close(); }

const mp4 = join(outDir, `${id}.mp4`);
const ff = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", join(frames, "%04d.png"), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", "-preset", "slow", "-movflags", "+faststart", mp4], { stdio: "inherit" });
if (ff.status !== 0) throw new Error("ffmpeg failed. Is it installed (brew install ffmpeg)?");
await rm(frames, { recursive: true, force: true });
console.log(`Saved ${mp4}\nSaved ${join(outDir, `${id}.png`)}`);
