/**
 * Scroll-performance harness for this site.
 *
 * Usage (needs a production build already served — `pnpm build && pnpm start`):
 *
 *   node scripts/profile-scroll.mjs
 *   node scripts/profile-scroll.mjs --cpu 6 --runs 3 --url http://localhost:3000/work
 *   node scripts/profile-scroll.mjs --mode load --cpu 6 --runs 5
 *
 * Two modes:
 *
 * - `scroll` (default) — frame pacing while the page is scrolled, i.e. the
 *   steady-state jank a visitor feels moving down the page.
 * - `load` — long tasks and total blocked main thread during a cold load, with
 *   no scrolling. This is a different failure and needs its own number: the
 *   moon used to block the main thread for ~650ms while the boot sequence was
 *   asking the visitor to scroll, so the first interaction the site invites was
 *   the one most likely to feel dead. See
 *   `docs/tasks/TASK-ascii-offscreen-worker.md`.
 *
 * Two guards are built in, because both of these produced confidently wrong
 * numbers while this was being written (see
 * docs/tasks/TASK-frame-budget-cleanup.md):
 *
 * 1. **It fails if the page didn't really run.** A `next start` from a previous
 *    build survives `pkill -f "next start"` (it runs as `next-server`), keeps
 *    the port, and serves stale HTML whose chunk URLs 500. That page profiles
 *    beautifully because none of its JavaScript executes. Any failed request or
 *    console error aborts the run.
 * 2. **It repeats and reports a median.** Run-to-run spread here is about
 *    ±1.5fps and ±1.5pp of dropped frames — the same size as the effects worth
 *    measuring. The first run after a server start is reliably worse than the
 *    rest, so it is discarded as warmup.
 *
 * Chromium runs headed on purpose: headless falls back to software GL, which
 * misrepresents anything touching the WebGL layer.
 */

import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const URL = flag("url", "http://localhost:3000/");
const CPU = Number(flag("cpu", 6));
const RUNS = Number(flag("runs", 3));
/** Wheel steps per run, and the pause between them. ~12s of scrolling. */
const MODE = flag("mode", "scroll");
const STEPS = Number(flag("steps", 110));
const STEP_DELAY = 110;

async function profileOnce(browser, { warmup }) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  const failures = [];
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
  });
  page.on("pageerror", (e) => failures.push(`pageerror: ${String(e).slice(0, 200)}`));
  page.on("console", (m) => {
    if (m.type() === "error") failures.push(`console: ${m.text().slice(0, 200)}`);
  });

  await page.goto(URL, { waitUntil: "load" });

  // Clear the boot sequence's scroll-to-begin gate, then settle.
  await page.waitForTimeout(1500);
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);

  if (failures.length > 0) {
    await context.close();
    throw new Error(
      `Page did not load cleanly — these numbers would be meaningless:\n  ${failures
        .slice(0, 8)
        .join("\n  ")}\n\nIf these are 500s on /_next/static chunks, a server from a previous ` +
        `build is still running: pkill -f next-server`,
    );
  }

  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
  await page.waitForTimeout(500);

  await page.evaluate(() => {
    window.__frames = [];
    window.__rec = true;
    let last = performance.now();
    const tick = (t) => {
      window.__frames.push(t - last);
      last = t;
      if (window.__rec) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  for (let i = 0; i < STEPS; i++) {
    await page.mouse.wheel(0, 110);
    await page.waitForTimeout(STEP_DELAY);
  }

  await page.evaluate(() => {
    window.__rec = false;
  });
  const frames = (await page.evaluate(() => window.__frames)).slice(2);
  await context.close();

  if (warmup) return null;

  const sorted = [...frames].sort((a, b) => a - b);
  const mean = frames.reduce((a, b) => a + b, 0) / frames.length;
  return {
    fps: 1000 / mean,
    p90: sorted[Math.floor(sorted.length * 0.9)],
    worst: sorted[sorted.length - 1],
    jank: (frames.filter((f) => f > 33.4).length / frames.length) * 100,
  };
}

/**
 * Cold-load profile: throttle first, then navigate, and count long tasks over
 * a fixed observation window without touching the page. The CPU throttle is
 * applied before `goto` here (unlike the scroll mode, which throttles after
 * load) because the whole point is what loading costs on a slow device.
 */
async function profileLoadOnce(browser, { warmup }) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  const failures = [];
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
  });
  page.on("pageerror", (e) => failures.push(`pageerror: ${String(e).slice(0, 200)}`));
  page.on("console", (m) => {
    if (m.type() === "error") failures.push(`console: ${m.text().slice(0, 200)}`);
  });

  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });

  await page.addInitScript(() => {
    window.__long = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__long.push(entry.duration);
    }).observe({ entryTypes: ["longtask"] });
  });

  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(9000);

  if (failures.length > 0) {
    await context.close();
    throw new Error(
      `Page did not load cleanly — these numbers would be meaningless:\n  ${failures
        .slice(0, 8)
        .join("\n  ")}\n\nIf these are 500s on /_next/static chunks, a server from a previous ` +
        `build is still running: pkill -f next-server`,
    );
  }

  const long = await page.evaluate(() => window.__long);
  await context.close();
  if (warmup) return null;

  return {
    tasks: long.length,
    blocked: long.reduce((a, b) => a + b, 0),
    worst: long.length ? Math.max(...long) : 0,
  };
}

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

const browser = await chromium.launch({ headless: false });
try {
  console.log(
    `${URL} — ${MODE} mode, ${CPU}x CPU throttle, ${RUNS} runs (plus one discarded warmup)\n`,
  );

  if (MODE === "load") {
    await profileLoadOnce(browser, { warmup: true });
    const runs = [];
    for (let i = 0; i < RUNS; i++) {
      const r = await profileLoadOnce(browser, { warmup: false });
      runs.push(r);
      console.log(
        `  run ${i + 1}: ${r.tasks} long tasks   blocked ${r.blocked.toFixed(0)}ms   ` +
          `worst ${r.worst.toFixed(0)}ms`,
      );
    }
    console.log(
      `\n  MEDIAN: ${median(runs.map((r) => r.tasks))} long tasks   ` +
        `blocked ${median(runs.map((r) => r.blocked)).toFixed(0)}ms   ` +
        `worst ${median(runs.map((r) => r.worst)).toFixed(0)}ms`,
    );
    console.log(
      "\n  Compare medians, never single runs — the spread here is about the size of\n" +
        "  any effect worth measuring.",
    );
  } else {

  await profileOnce(browser, { warmup: true });

  const results = [];
  for (let i = 0; i < RUNS; i++) {
    const r = await profileOnce(browser, { warmup: false });
    results.push(r);
    console.log(
      `  run ${i + 1}: ${r.fps.toFixed(1)} fps   p90 ${r.p90.toFixed(1)}ms   ` +
        `worst ${r.worst.toFixed(0)}ms   >33ms ${r.jank.toFixed(1)}%`,
    );
  }

  console.log(
    `\n  MEDIAN: ${median(results.map((r) => r.fps)).toFixed(1)} fps   ` +
      `>33ms ${median(results.map((r) => r.jank)).toFixed(1)}%`,
  );
  console.log(
    "\n  Compare medians, never single runs — the spread here is about the size of\n" +
      "  any effect worth measuring.",
  );
  }
} finally {
  await browser.close();
}
