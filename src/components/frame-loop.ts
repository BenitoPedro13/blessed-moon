"use client";

/**
 * One `requestAnimationFrame` for the whole app, running **every** read
 * callback before **any** write callback.
 *
 * Before this, six components each owned a rAF loop: `ascii-canvas`,
 * `scroll-morph-stage`, `scroll-stage` (Hero and the closing CTA),
 * `scroll-particles`, `react-bits/particle-text`, and `site-nav`. Each read
 * layout (`getBoundingClientRect`, `getComputedStyle`) and then wrote styles,
 * in whatever order they happened to mount. A write from one loop invalidates
 * layout for the next loop's read, so the browser recalculates layout several
 * times per frame instead of once — layout thrashing, and it does not show up
 * as any single expensive call, which is why it survived this long.
 *
 * Profiling a mid-range phone (6x CPU throttle, production build) put
 * `getBoundingClientRect` at 7.7% of main-thread self-time, understating the
 * true cost since the forced recalcs it triggers are billed to layout rather
 * than to the call. See `docs/tasks/TASK-frame-budget-cleanup.md` for the full
 * measurement.
 *
 * Splitting each subscriber at its read/write boundary means one layout flush
 * per frame, no matter how many components are subscribed.
 *
 * ## Why not an existing scheduler
 *
 * Lenis exposes `on("scroll")`, which fires on scroll rather than every frame.
 * The ambient animations here (the moon's float, the particle drift) must keep
 * running while scroll is idle, so a scroll-driven callback would stall them.
 */

export interface FrameContext {
  /** The `requestAnimationFrame` timestamp for this frame. */
  time: number;
  /** Milliseconds since the previous frame, clamped to 100ms so a background
   * tab or a long stall doesn't hand animations an enormous step. */
  delta: number;
  scrollY: number;
  innerWidth: number;
  innerHeight: number;
}

export interface FrameSubscriber {
  /** Layout reads only. Never write styles here — that's what this whole
   * module exists to prevent. */
  read?: (ctx: FrameContext) => void;
  /** Style/DOM writes and canvas drawing. May use values computed in `read`. */
  write?: (ctx: FrameContext) => void;
}

const subscribers = new Set<FrameSubscriber>();

/** Iterated instead of the Set itself: a subscriber that unsubscribes from
 * inside its own callback would otherwise mutate the Set mid-iteration. */
let ordered: FrameSubscriber[] = [];
let dirty = true;

let raf = 0;
let running = false;
let lastTime = 0;

const ctx: FrameContext = {
  time: 0,
  delta: 0,
  scrollY: 0,
  innerWidth: 0,
  innerHeight: 0,
};

/** Rolling window of recent frame deltas. Published for TASK-adaptive-quality's
 * governor, which needs a stable measure of whether this device is holding the
 * frame rate — kept here because this is the one place that already sees every
 * frame exactly once. */
const SAMPLE_SIZE = 90;
const samples: number[] = [];
let sampleAt = 0;

function tick(time: number) {
  ctx.time = time;
  ctx.delta = lastTime ? Math.min(time - lastTime, 100) : 16.7;
  lastTime = time;
  ctx.scrollY = window.scrollY;
  ctx.innerWidth = window.innerWidth;
  ctx.innerHeight = window.innerHeight;

  if (samples.length < SAMPLE_SIZE) samples.push(ctx.delta);
  else samples[sampleAt] = ctx.delta;
  sampleAt = (sampleAt + 1) % SAMPLE_SIZE;

  if (dirty) {
    ordered = Array.from(subscribers);
    dirty = false;
  }

  for (const sub of ordered) sub.read?.(ctx);
  for (const sub of ordered) sub.write?.(ctx);

  raf = requestAnimationFrame(tick);
}

function start() {
  if (running || subscribers.size === 0 || document.hidden) return;
  running = true;
  // Reset rather than carry a stale timestamp across a pause: the first frame
  // after resuming would otherwise report the whole hidden period as its delta.
  lastTime = 0;
  raf = requestAnimationFrame(tick);
}

function stop() {
  if (!running) return;
  running = false;
  cancelAnimationFrame(raf);
}

function handleVisibility() {
  if (document.hidden) stop();
  else start();
}

/**
 * Subscribe to the shared frame loop. Returns an unsubscribe function; call it
 * from the owning effect's cleanup.
 *
 * The loop starts on the first subscriber and stops on the last, so nothing
 * runs on a page with no scroll-driven components.
 */
export function subscribeFrame(sub: FrameSubscriber): () => void {
  if (subscribers.size === 0 && typeof document !== "undefined") {
    document.addEventListener("visibilitychange", handleVisibility);
  }
  subscribers.add(sub);
  dirty = true;
  start();

  return () => {
    subscribers.delete(sub);
    dirty = true;
    if (subscribers.size === 0) {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
      samples.length = 0;
      sampleAt = 0;
    }
  };
}

/**
 * Median frame time over the recent window, in ms, or 0 before enough frames
 * have been seen. Median rather than mean so one garbage-collection pause
 * can't masquerade as a slow device.
 */
export function medianFrameTime(): number {
  if (samples.length < 20) return 0;
  const sorted = [...samples].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}
