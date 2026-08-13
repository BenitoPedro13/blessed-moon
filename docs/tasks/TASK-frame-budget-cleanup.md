# TASK: Frame-budget cleanup — remove per-frame waste from the scroll loops

> Tier 1 of three, from a profiling session prompted by real user feedback (a visitor on a
> mid-range phone: *"agr tá travando um pouco"*). Tier 2 is
> `TASK-ascii-offscreen-worker.md`, Tier 3 is `TASK-adaptive-quality.md`. This one is the
> zero-visual-change tier: nothing is removed, downgraded, or hidden behind a breakpoint.
> Every effect looks exactly the same afterwards.

## Current scenario

### What was measured

Production build (`next build` + `next start`), headed Chromium on a real GPU, iPhone-class
viewport (390×844 @ DPR 3), scroll driven by dispatched wheel events so Lenis's `smoothWheel`
path runs exactly as it does for a visitor. ~12s scroll down the homepage. Main thread
throttled via CDP `Emulation.setCPUThrottlingRate`: **4×** ≈ a decent phone, **6×** ≈ a
mid-range Android.

At 4× the site holds ~59fps and is fine. At **6× it degrades to 48.7fps with 9.7% of frames
over 33ms**, concentrated in the middle of the page — the `ScrollMorphStage` region, where
the moon, the particles and the morph layers all overlap.

Layers were ablated at runtime by nulling out `HTMLCanvasElement.prototype.getContext` for
`"webgl2"` / `"2d"` (both `createAsciiObject` and `ScrollParticles`/`ParticleText` bail
cleanly on a null context), so no source was modified to get these numbers:

| variant @ 6× CPU | fps | p90 | frames >33ms |
|---|---|---|---|
| baseline | 48.7 | 33.4ms | **9.7%** |
| ASCII/WebGL moon off | 51.6 | 33.1ms | 7.3% |
| **Canvas2D particles off** | **56.6** | **17.6ms** | **2.4%** |
| both off | 58.8 | 17.5ms | 0.7% |

**The Canvas2D particle layers are the dominant scroll cost, not the WebGL moon.** This
contradicts the initial assumption going in, which was that the ASCII canvas, Lenis and
`ScrollMorphStage` were the three suspects.

Main-thread self-time at 6×: `ScrollParticles`' frame loop 12.2%, `fill`/`arc` from
`ParticleText` ~4.9%, `getBoundingClientRect` 7.7%, `scrollTo` (Lenis) 30%.

### The specific waste

1. **The moon renders every frame regardless of whether anything changed.**
   `AsciiObject.tsx:1401-1405` runs `renderer.setAnimationLoop(tick)`, and `tick`
   unconditionally performs three `renderer.render()` passes (scene → cellTarget →
   postScene, `AsciiObject.tsx:1393-1399`). There is already an `IntersectionObserver`
   gate (`inView` → `startLoop`/`stopLoop`), but the canvas is `fixed inset-0` and therefore
   permanently intersecting, so it never stops. Note the moon is *not* static when scroll is
   idle — `floatIntensity: 0.6` / `rotationIntensity: 0.3` give it a genuine ambient bob and
   rotation, so this cannot become a freeze-when-idle check (see Planned changes).

2. **`scroll-progress.ts` reads live layout for every boundary on every frame, for a reason
   that no longer applies.** `read()` calls `getBoundingClientRect()` per boundary per frame.
   Its own docblock justifies this: the cached `rect.top + window.scrollY` form is only
   correct when tracked elements sit in normal document flow, and at the time most homepage
   sections lived inside `ParticleScroll`'s independently-scrolling panel. **That panel was
   removed** by `TASK-homepage-unify-scroll.md`. Everything is back in normal document flow —
   `ScrollMorphStage` emits its keyframe markers as absolutely positioned children of a
   normal-flow wrapper — so the cached-offset form is correct again and the justification is
   stale.

3. **`ScrollParticles` round-trips a number through the CSS engine every frame.**
   `scroll-particles.tsx:51` calls `getComputedStyle(progressHost).getPropertyValue(
   "--stage-progress")` inside the rAF loop. That value was computed in JS by `ScrollStage`
   (`scroll-stage.tsx:73`) or `ScrollMorphStage`, written to a custom property, and is now
   read back through a forced style recalc — 60 times a second, to recover a number that
   already existed in JS.

4. **Seven independent rAF loops interleave reads and writes.** On the homepage:
   `ascii-canvas.tsx`, `scroll-morph-stage.tsx`, `scroll-stage.tsx` (Hero + closing CTA),
   `scroll-particles.tsx`, `react-bits/particle-text.tsx`, `site-nav.tsx`. Each does its own
   layout read and its own style writes, in an arbitrary order determined by mount sequence.
   A write after another loop's read invalidates layout, so the next loop's read forces a
   recalc — classic layout thrashing, and the reason `getBoundingClientRect` self-time
   (7.7%) understates the true cost.

5. **`ScrollParticles` changes canvas state per particle.** `scroll-particles.tsx:113-115`
   sets `globalAlpha` and `fillStyle` inside the loop, so 160 particles cost 320 state
   changes per frame. It also renders at `min(devicePixelRatio, 2)` (line 66) — for 1.5–4px
   dots on a near-black ground, DPR 2 quadruples the fill area for no perceptible gain.

6. **Lenis is not itself the problem, but it is an amplifier.** It stayed fully enabled in
   every ablation above, including the 58.8fps one, so it is not a bottleneck. But `scrollTo`
   at 30% self-time reflects that it performs a real scroll every frame, which re-composites
   every fixed full-screen layer on every frame. It makes every other layer's per-frame cost
   unavoidable rather than occasional. Keeping it is correct; it just raises the value of
   everything below.

## Planned changes

### `src/lib/ascii-canvas/scroll-progress.ts`

Restore cached document-relative offsets. `measure()` already computes
`rect.top + window.scrollY` per boundary and then discards it — keep it on the `Boundary`
record. `read()` becomes `window.scrollY + window.innerHeight * anchorRatio` compared against
cached tops: arithmetic, no layout read. Replace the stale docblock paragraph with why the
cached form is valid again (the `ParticleScroll` panel is gone; everything tracked is in
normal flow). `measure()` continues to run on resize, on route change, and on the existing
500ms settle timeout, which is what keeps the cache honest.

Rejected: keeping the live reads but memoizing per frame. It would help, but the reason for
live reads is gone, so the cache is simply the correct structure now rather than an
optimization layered on a workaround.

### `src/components/frame-loop.ts` (new)

A single rAF conductor. Exposes `subscribeRead(fn)` / `subscribeWrite(fn)` (or one
`subscribe({ read, write })`), runs one `requestAnimationFrame` for the whole app, and
executes **all** read callbacks before **any** write callback. One layout flush per frame
instead of an interleaved chain. Also owns the shared per-frame facts every consumer
currently derives independently — `scrollY`, `innerHeight`, a frame timestamp, and the delta
since the last frame — so they are computed once.

Starts and stops itself with subscriber count, and pauses on `document.hidden`.

Rejected: a third-party scheduler (`@react-three/fiber`'s loop, Lenis's own `on("scroll")`).
Lenis's callback fires on scroll, not every frame, so the ambient animations (float, particle
drift) that must run while scroll is idle would stall. A tiny in-repo module matches how
every other shared primitive here is built.

### `src/components/scroll-stage.tsx`, `src/components/scroll-morph-stage.tsx`, `src/components/site-nav.tsx`, `src/components/ascii-canvas.tsx`

Convert each `useEffect` rAF loop to a `frame-loop` subscription, splitting its body at the
read/write boundary:

- `ScrollStage`: read `wrapper.getBoundingClientRect()`, write `--stage-progress` and call
  `onProgress`. Additionally, keep the last written progress on a ref so `ScrollParticles`
  can read the number rather than the CSS property (below).
- `ScrollMorphStage`: read the wrapper rect; write the per-layer `--morph-local`/
  `--morph-away`/`opacity`/`visibility`, the title opacities, and the window width/height.
  The `heightsRef` `ResizeObserver` already keeps content heights out of the frame path and
  stays as-is. `setActive` continues to fire only on a discrete boundary change.
- `site-nav`: its `morphTracker.read()` becomes a read-phase call.
- `ascii-canvas`: `tracker.read()` in the read phase; `instance.setTransform()` and the
  wrapper opacity write in the write phase.

No behavioural change to any of these — same values, same order within each component, just
grouped across components.

### `src/components/scroll-particles.tsx`

- Take progress as a prop/context value from the owning stage instead of
  `getComputedStyle`. Both call sites (`ScrollStage`, `ScrollMorphStage`) already have the
  number. Removes a forced style recalc per frame.
- Batch the draw: bucket particles by colour (2) and by quantized alpha (~4 levels), then
  emit one `fillStyle`/`globalAlpha` change per bucket — ~8 state changes per frame instead
  of 320. Particle positions and sizes are unchanged, so the field looks identical.
- Cap this canvas at DPR 1 (`dpr = 1` rather than `min(devicePixelRatio, 2)` at line 66),
  cutting fill area 4× on a DPR≥2 phone. Verify against a screenshot before/after — if the
  dots visibly soften, fall back to DPR 1 on coarse pointers only.
- Subscribe to `frame-loop` rather than owning a rAF.

### `src/components/react-bits/particle-text.tsx`

Subscribe to `frame-loop`; apply the same colour/alpha bucketing if its draw loop sets state
per particle. Upstream logic is otherwise left alone — this file is a vendored React Bits
component (see `TASK-react-bits-mcp-registry.md`) and should stay diffable against upstream,
so changes are confined to the loop plumbing and batching, with a comment marking them.

### `src/components/canvasui/AsciiObject.tsx`

Add a render-cadence control to `AsciiObjectInstance`: `setCadence(fps: number)`, defaulting
to 60. `tick` early-returns without rendering when less than `1000/fps` has elapsed, while
still advancing `elapsed` so the float animation stays time-correct rather than slowing down.

This is deliberately **not** a freeze-when-static dirty check. The moon has a genuine ambient
float and rotation, so it is never actually static, and freezing it would visibly kill the
one motion that makes the background feel alive. Cadence is the honest version of the same
saving.

Also gate the loop on `document.hidden` alongside the existing `inView` check.

### `src/components/ascii-canvas.tsx`

Drive that cadence: 60fps while the scroll-driven transform is still converging toward its
target (the existing `EASE` loop already knows this — compare the four displayed values
against their targets), 30fps once it has settled and only the ambient float is moving. The
float's periods are `elapsed / 4` and `elapsed / 1.5`, far too slow for 30fps to be
distinguishable.

### `scripts/profile-scroll.mjs` (new) + `playwright` devDependency

Commit the harness that produced the numbers above so Tier 2 and Tier 3 can be verified
against the same baseline rather than re-derived. Takes a URL, a CPU throttle rate, and an
optional init script for ablation; reports fps, percentiles, frames over 33/50ms, long tasks,
and JS self-time grouped by script and function.

**Decision needed:** this adds `playwright` (~large) as a devDependency purely for
performance work. The alternative is leaving the harness out of the repo and re-writing it
per session. Flagging rather than assuming.

## Why

A real visitor reported the site stuttering, and the measurement confirms it on a mid-range
device: ~10% of frames missing at 6× throttle, in the middle of the page.

The important result is that this is recoverable **without giving up any of the atmosphere**.
The brief for this site is immersion — the ASCII moon, the particle field, the morphing
window are the product, not decoration on top of it. Every item above is waste: a value
computed in JS, written to CSS and read back; a layout read that a removed component's
constraint used to require; seven loops invalidating each other's layout; 320 canvas state
changes to draw 160 dots; a full three-pass WebGL render at 60fps to show motion whose
fastest component has a 1.5-second period. Removing waste is strictly better than removing
effects, and it is what makes Tier 3's adaptive degradation a rare fallback rather than the
normal experience on any phone.

Cost: a new shared primitive (`frame-loop`) that every scroll-driven component now depends
on, which is a real coupling — a bug in it affects everything at once. Mitigated by keeping
it small, and by the fact that it centralizes an ordering invariant (reads before writes)
that is currently implicit and unenforceable.

This tier explicitly does **not** touch `ScrollMorphStage`'s morph mechanism, the token
handoffs, Lenis, or any visual parameter. `TASK-adaptive-quality.md` is where anything a
visitor could notice gets decided, and only on devices that cannot hold the frame rate.

## Results (measured after implementation)

**Tier 1 is close to a null result.** It is worth keeping, but it did not fix the problem, and
an earlier version of this section claimed it did. That claim was noise.

Both builds profiled on the same machine, production build, n=3 runs each with the first run
after server start discarded (it is consistently an outlier — see Methodology below):

| @6x CPU | baseline | after Tier 1 |
|---|---|---|
| median fps | 49.8 | **51.2** |
| fps range (n=3) | 49.6 – 50.1 | 50.8 – 51.6 |
| median frames >33ms | 7.7% | **7.2%** |
| jank range (n=3) | 6.6% – 8.3% | 6.3% – 7.2% |

- **The fps gain is real but small: ~3%.** The two ranges don't overlap, so it is consistently
  reproducible, but it is 1.4fps.
- **The dropped-frame improvement is not significant.** The ranges overlap almost entirely
  (baseline 6.6–8.3%, after 6.3–7.2%). On this evidence Tier 1 does not measurably reduce
  jank.

Cold load at 6x: 955ms blocked → 803ms, single runs, so treat that as indicative only.

### What the earlier claim got wrong

This document previously reported "9.7% → 5.4% of frames missed", a ~44% reduction. Both
figures were single runs, and both were outliers in opposite directions — the true medians are
7.7% and 7.2%. The improvement was almost entirely an artifact of running each configuration
once.

The measurement that prompted this whole task (9.7% jank at baseline) was itself one of those
unlucky runs. The real baseline is ~7.7%.

**Why it still lands.** The change is structurally correct regardless of the number: one
layout flush per frame instead of an interleaved chain, a cache that is now valid again, a
value no longer round-tripped through the style engine, and a `setCadence` API that
`TASK-adaptive-quality.md` needs as its primary lever. It is a prerequisite, not a fix.

**Why it fell short.** The profile after the change still shows the same hot canvas function
at 12.0% of self-time and native `fill` at 4.1%. The assumption behind the batching work was
that the particle layers' cost was *state changes* — 320 `fillStyle`/`globalAlpha`
assignments per frame. Removing nearly all of them changed little because the dominant cost is
**rasterization, not state**:

- `ParticleText` renders with `glow`, which sets `shadowBlur` (`particle-text.tsx:256`).
  Canvas shadow blur forces a separate blur pass per draw call, and Hero mounts *two*
  instances, each drawing every particle via `arc()` + `fill()` (`particleSize: 2.6` is above
  the 2.1 threshold that would take the cheap `fillRect` path).
- Fill rate on full-viewport canvases dominates the remaining `ScrollParticles` cost, which
  the DPR 1 change addresses but does not eliminate.

`scrollTo` (Lenis) rose from 30% to 34.6% of self-time — not a regression, just a larger
share of a smaller total.

The obvious follow-up — replacing `shadowBlur` with pre-rendered glow sprites — was built and
**measured worse**, then reverted. See `TASK-particle-glow-sprite.md` for the numbers and why.

### Methodology — how to profile this repo without fooling yourself

Two separate false results were produced and nearly reported during this task. Both are cheap
to avoid:

1. **Confirm the page actually hydrates before trusting a profile.** A `next start` from a
   previous build survives `pkill -f "next start"` (it runs as `next-server`), keeps the port,
   and serves stale HTML whose chunk URLs 500 against the rebuilt output. That page scored
   "1 long task, 66ms blocked" — because none of its JavaScript ran. It surfaced as a bug
   report that the boot overlay never advanced, since `BootSequence`'s `setPhase` never ran.
   Kill with `pkill -f next-server` and verify no 4xx/5xx responses and no console errors.

2. **Never compare single runs.** Run-to-run spread on this page is roughly ±1.5fps and
   ±1.5pp of dropped frames, which is the same size as the effects being measured. Use n>=3
   and compare medians. **Discard the first run after a server start** — it is reliably worse
   than the rest.

A committed harness (`scripts/profile-scroll.mjs`) should enforce both: fail loudly on any
failed request or console error, and default to repeated runs reporting a median.

The first "after" numbers collected were meaningless and nearly got reported as a large win:
a `next start` from the *previous* build was still running (it survives `pkill -f "next
start"` because it runs as `next-server`), serving stale HTML whose chunk URLs 500'd against
the rebuilt output. The page never hydrated, so it "scored" 1 long task and 66ms blocked.

It surfaced as a bug report — the boot overlay never advancing past its first phase, because
`BootSequence`'s `setPhase` never ran. **Always confirm the page actually hydrates before
trusting a profile**: `scripts/profile-scroll.mjs` should fail loudly on any 4xx/5xx response
or console error rather than reporting numbers for a dead page.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/frame-loop.ts` | new | single rAF conductor; all reads before all writes; shared per-frame scroll/time facts |
| `src/lib/ascii-canvas/scroll-progress.ts` | edit | cache boundary offsets at `measure()`; `read()` becomes arithmetic on `scrollY`; replace stale docblock |
| `src/components/scroll-particles.tsx` | edit | progress via prop not `getComputedStyle`; bucket colour/alpha; DPR 1; use `frame-loop` |
| `src/components/scroll-stage.tsx` | edit | use `frame-loop`; expose progress as a number to `ScrollParticles` |
| `src/components/scroll-morph-stage.tsx` | edit | use `frame-loop`, split read/write; pass progress down; no mechanism change |
| `src/components/ascii-canvas.tsx` | edit | use `frame-loop`; drive `setCadence` 60→30 once the eased transform settles |
| `src/components/canvasui/AsciiObject.tsx` | edit | add `setCadence` to the instance API; time-correct skip in `tick`; gate on `document.hidden` |
| `src/components/site-nav.tsx` | edit | use `frame-loop` for its tracker read |
| `src/components/react-bits/particle-text.tsx` | edit | use `frame-loop`; batch canvas state changes; keep diffable against upstream |
| `scripts/profile-scroll.mjs` | new | committed profiling harness (decision: adds `playwright` devDep) |
| `package.json` | edit | `playwright` devDependency + a `profile` script — pending the decision above |
| `src/app/system/page.tsx` | edit | §3.1: `frame-loop` is a new shared primitive and needs a panel |
| `CLAUDE.md` | edit | note the single-conductor rule under §0 "things that must not break" |
| `README.md` | edit | Status + the new `profile` script |
