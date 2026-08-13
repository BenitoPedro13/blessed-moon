# TASK: Move the ASCII moon off the main thread (OffscreenCanvas + worker)

> Tier 2 of three. Tier 1 is `TASK-frame-budget-cleanup.md` (waste removal, zero visual
> change); Tier 3 is `TASK-adaptive-quality.md`. This is the structural tier: the moon keeps
> **full** quality and stops competing with Lenis, the morph stage and the particle field for
> the same thread. It is the change that buys the most headroom for immersion rather than
> spending immersion to buy performance.
>
> Depends on Tier 1 only loosely — the `setCadence` API added there is reused here — but
> should land after it, so its effect can be measured against a clean baseline.

## Current scenario

### The load-time stall the scroll numbers hide

Measured separately from the scroll profile (same harness, 6× CPU throttle, cold load,
9s observation window):

| variant | long tasks | main thread blocked | worst single task |
|---|---|---|---|
| baseline | 7 | **955ms** | **330ms** |
| WebGL disabled | 4 | 307ms | 110ms |

**~650ms of blocked main thread at load is the ASCII moon**, and it lands while the boot
sequence is asking the visitor to scroll to begin — so the first interaction the site invites
is the one most likely to feel dead. This is a plausible second reading of the original
report (*"agr tá travando um pouco"*), distinct from the steady-state scroll jank Tier 1
addresses.

### Where that 650ms goes

1. **Parsing and compiling three.js on the main thread.** The three.js chunk is 664KB
   (`.next/static/chunks/376za3wespygd.js`), parsed and compiled on the main thread before
   anything can render.
2. **Fetching the DRACO decoder from a third-party CDN.** `AsciiObject.tsx:139` defaults
   `dracoDecoderPath` to `https://www.gstatic.com/draco/versioned/decoders/1.5.7/`. That is a
   cross-origin DNS + TLS + fetch on the critical path to the moon appearing at all.
   Directly relevant to the original report: the visitor described their connection as
   *"internet de rua… é meio fraca"*. Their instinct about the network may have been right,
   just about a different mechanism than they meant.
3. **Decoding a 527KB `moon.glb`** (`public/models/moon.glb`).
4. **Generating the glyph atlas at runtime.** `AsciiObject.tsx:1240-1278` rasterizes every
   glyph into a canvas, then runs `glyphShapes()` over the resulting `ImageData` to derive
   the edge vectors used for glyph matching. This is deterministic — same font, same
   `cellSize`, same glyph set produce the same atlas on every load, on every device — and it
   is recomputed from scratch every time.

### Why the main thread is the scarce resource here

From the Tier 1 profile at 6×: Lenis's `scrollTo` is 30% of main-thread self-time because it
performs a real scroll every frame. The morph stage, the particle field, the nav trackers and
the moon's transform loop all then have to fit in what remains, on every frame. The moon's
three `renderer.render()` passes are the largest single consumer of that budget, and none of
that work needs the DOM.

## Planned changes

### Verifications resolved before writing code

The three `[VERIFY:]` markers this document carried are settled, and two of them
changed the plan:

1. **`moon.glb` is not Draco-compressed.** Its glTF JSON chunk has no
   `extensionsUsed` at all, so `KHR_draco_mesh_compression` is absent and
   `GLTFLoader` never instantiates the Draco extension handler. The decoder is
   therefore **never fetched** — the "cross-origin round-trip on the critical
   path" this document asserted does not happen. `public/draco/` is dropped from
   the plan. `dracoDecoderPath` stays as a public option for other callers, and
   `DRACOLoader` stays imported (~5KB, and it now lives in the worker bundle
   anyway), but self-hosting a decoder nothing requests would have been pure
   ceremony. The visitor's weak-connection theory has to be explained by
   something else — the 660KB three.js chunk, most likely.
2. **Turbopack bundles `new Worker(new URL("./x.worker.ts", import.meta.url))`
   correctly with no configuration.** Verified by spiking it in this repo rather
   than from docs, which are ambiguous on the point: the production build emits
   a separate worker chunk and the worker executes and round-trips a message.
   **`next.config.ts` needs no change** and is dropped from the plan.
3. **`requestAnimationFrame` exists in a dedicated worker**, and three.js's
   `WebGLRenderer` both renders to a transferred `OffscreenCanvas` and drives
   `setAnimationLoop` there (~56fps measured in the spike). This was the load-
   bearing assumption of the whole tier and was worth confirming before
   building on it: `createImageBitmap` and `OffscreenCanvas` are available too,
   which the glyph atlas and image-decode paths need.

### One engine, not two paths

This document originally proposed a worker path and a main-thread path inside
`AsciiObject.tsx`, and named the cost honestly: "two code paths ... that must
stay behaviourally identical, in a 1500-line file that is already the most
complex thing in the repo."

That cost is avoidable, so it was avoided. The split is at the **React**
boundary instead:

- **`src/components/canvasui/ascii-engine.ts` (new)** — everything that was in
  `AsciiObject.tsx` except the React component: the three.js scene, the glyph
  atlas, the render loop. No React import, and no unconditional DOM access.
- **`src/components/canvasui/AsciiObject.tsx`** — now just the React component,
  re-exporting the engine so its public API is unchanged. `/system` and any
  other caller are untouched.
- **`ascii-object.worker.ts`** imports *the same* `createAsciiObject`.

There is one implementation of the scene. What replaced the second path is a
handful of injection points, each guarded so that a real `HTMLCanvasElement`
behaves exactly as before:

| Global | Main thread | Worker |
|---|---|---|
| `canvas.clientWidth/Height` | measured from the element | `metrics` passed in, refreshed on `resize` |
| `window.devicePixelRatio` | read directly | `metrics.pixelRatio` |
| `window.matchMedia` | live query + `change` listener | `reducedMotion` pushed in via `setReducedMotion` |
| `ResizeObserver` | observes the canvas | host observes, posts `resize` |
| `IntersectionObserver` | observes the canvas | host posts `visible` |
| `OrbitControls` | constructed as before | never constructed |

`OrbitControls` binds DOM events and cannot exist in a worker. Rather than
emulate it, the host refuses the worker path outright if `orbit`, `zoom` or
`autoRotate` is ever enabled — the background moon has all three off, and
`/system`'s `AsciiObject` panel (which sets `autoRotate`) correctly stays on the
main thread.

### `src/lib/ascii-canvas/moon-transform.ts` (new)

The morph→camera mapping (`SCALE_BY_MORPH`, the offset tables, `EASE`, the
cadence thresholds) moves out of `ascii-canvas.tsx` so both threads can import
it. The easing itself becomes `createMoonEasing()` and **runs in the worker**:
the main thread posts one raw morph number per frame, and convergence, cadence
and the ambient float all advance on a thread that a main-thread stall cannot
touch. `opacityForMorph` stays on the main thread — it drives a DOM element's
opacity, not the scene.

Deliberately **not** using `SharedArrayBuffer` for the per-frame value: it
requires COOP/COEP headers site-wide, which is a large constraint to take on for
one float a frame.

### `src/components/ascii-canvas.tsx`

Becomes the host. It keeps only what needs a DOM — scroll measurement, canvas
sizing, the wrapper's opacity — and:

- **Creates the canvas imperatively** instead of rendering it through React. A
  canvas that has been through `transferControlToOffscreen` can never return a
  context, so falling back means discarding that element and starting a fresh
  one; React must not be reconciling it underneath us.
- **Loads the engine with a dynamic `import()`** on the fallback path only, so
  three.js is not on the main thread's critical path for visitors whose scene is
  in the worker. This turned out to matter more than expected — see Results.
- **Defers setup to `requestIdleCallback`** (1200ms timeout, `setTimeout`
  fallback) so it never competes with hydration or the boot sequence.
- **Uses page visibility, not intersection, as the pause signal.** The canvas is
  `fixed inset-0` and so intersects the viewport forever, which is why the
  existing `IntersectionObserver` gate never once fired. `document.hidden` is
  the condition that actually means nobody is looking.
- **Falls back on three distinct failures**: no `transferControlToOffscreen`,
  a `Worker` constructor that throws, and a worker that reports it could not get
  a WebGL2 context. All three are tested.

It writes the active path to `data-moon-path` on its wrapper (`worker` /
`main-thread` / `unavailable`), which `/system` reads back — the fallback is
deliberately pixel-identical, so there is otherwise no way to tell which one a
given device got.

### `scripts/profile-scroll.mjs` — a `load` mode

This tier's headline claim (~650ms of blocked main thread at load) was not
measurable with the committed harness, which only profiles scrolling. Adds
`--mode load`: throttle first, navigate, and count `longtask` entries over a
fixed window without touching the page, with the same clean-load guard and
median-of-repeated-runs discipline as the scroll mode.

### The guard that the bundler deleted

Worth its own section because it invalidated a full round of measurement and
would have shipped as a silent no-op.

The engine guards its DOM access the obvious way:

```ts
typeof window !== "undefined" && typeof window.matchMedia === "function"
```

**Next's client build folds that test away.** `typeof window === "undefined"` is
precisely the idiom Next uses to strip server-only code, so its compiler treats
the condition as known and eliminates it. What survives into the worker bundle
is a bare `window.matchMedia(...)`, which throws `ReferenceError: window is not
defined` the instant the module is imported off the main thread.

The failure mode is what makes this dangerous. The host catches it, reports
`failed`, and falls back to the main thread — and the fallback is *designed* to
be visually identical. The page was perfect. No console errors. A worker was
spawned and visible in devtools. Every route reported `main-thread` via
`data-moon-path`, which is the only reason it was caught at all, and only after
the A/B numbers had already been collected — **those first numbers measured the
fallback, not the worker.**

The fix is to read the globals off `globalThis`, which the compiler cannot prove
anything about:

```ts
const ENV = globalThis as typeof globalThis & { window?: Window; document?: Document };
// ENV.window?.matchMedia, ENV.document, new ENV.window!.ResizeObserver(...)
```

Two general lessons, both now in CLAUDE.md: `typeof window`/`typeof document`
checks are not load-bearing inside a Next client bundle, and a fallback that is
indistinguishable by eye **must** publish which path it took, or it will hide
its own failure indefinitely.

### Removing the second moon (user-directed, mid-task)

The closing CTA was a bespoke section built around `ParticleObject` — a
cursor-reactive particle reconstruction of the same moon model. It is gone. The
user's call, and the reason is a design one: at the size it rendered, 9000
particles read as a plain filled circle rather than as the moon, so the effect
was carrying no meaning while costing a second three.js scene on the page.

The homepage now closes on `PageCta`, the same band `/work`, `/about` and
`/work/[slug]` already use, keeping the homepage's own copy ("Let's build
something that lasts.") since it is more specific than the shared default. The
`data-ascii-keyframe="5"` contract is preserved — `PageCta` already carries it.

Two consequences worth recording:

- **`opacityForMorph` changed.** The background moon used to fade almost to
  nothing across keyframe 4→5 *specifically* so it would not collide with the
  CTA's own moon. With nothing left to get out of the way of, that fade only
  made the last screen of the page go dead, against the "present all the way
  through the footer" rule this background exists to satisfy. It now holds its
  0.4 ambient level to the end.
- **`ParticleObject` is no longer on a live page.** It stays in the codebase and
  is still staged on `/system` — the same status as `ParticleScroll` and
  `DecryptReveal`.

### Not done: the precomputed glyph atlas

Dropped from this tier, deliberately, on two findings:

1. **Its stated justification is gone.** The atlas was called out as work "on the
   main thread ... at load". It now runs in the worker, off the critical path.
2. **Baking it would change what visitors see.** The atlas is rasterized from
   `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`, which resolves to
   a *different font on every platform*. Today each visitor's moon is drawn with
   their own system's monospace glyphs. An atlas baked on a macOS build machine
   would ship Menlo to everyone. That may well be an improvement — it makes the
   effect consistent and reviewable — but it is a **design decision about what
   the moon is made of**, not a performance cleanup, and CLAUDE.md is explicit
   that those get flagged rather than made silently. Flagged here for a decision.

## Why

The moon is the site's single most identity-carrying element, and the profile says it costs
~650ms of blocked main thread at load and is the second-largest scroll cost after the
particles. The two obvious ways to make it cheaper — render it smaller, or render it less
often — both spend the thing the site is actually for. Moving it to a worker spends nothing:
same model, same glyph density, same cadence, on a thread where it is the only tenant.

The secondary win turned out to be somewhere else entirely. Self-hosting DRACO was pointless
(nothing fetches it) and precomputing the atlas is a design question, not a performance one —
but the *other* three.js consumer on the homepage, the closing CTA's `ParticleObject`, was
statically imported and pulled the whole 660KB chunk onto the main thread on every visit,
which quietly cancelled most of what moving the background moon was supposed to buy. That is
the finding this tier is actually worth having.

What it costs: the engine is no longer a single self-contained file — it is a headless module,
a React wrapper, a worker, and a shared transform module. That is more moving parts than
before. It is not, however, two implementations of the same scene, which is what this
document originally signed up for and what would have been the real burden.

Not addressed here: Lenis's 30% self-time. It is structural to how Lenis works (a real scroll
per frame) and the ablations showed the site holds 58.8fps with Lenis fully enabled once the
canvas layers are cheap. It stays.

## Results (measured after implementation)

**Real, moderate, and smaller than this document predicted.** Load blocking is down
~23% and scroll is up ~6%; the tier did not deliver the ~650ms main-thread recovery
it was scoped around, and the reason it did not is the most useful thing here.

### Methodology — why these numbers are paired, not sequential

Mid-task, the *same build* measured 49.2fps in one session and 35.2fps an hour later.
That is far outside the ±1.5fps spread `TASK-frame-budget-cleanup.md` documents, and it
means the machine drifts (thermal, most likely) over the timescale of a profiling
session. Comparing a "before" block against an "after" block measured later is
therefore unsound here, however many runs are in each block — a lesson beyond the
"never compare single runs" rule already in CLAUDE.md.

So both builds were compiled up front into separate output directories, and runs were
**alternated** — baseline, candidate, baseline, candidate — restarting the server each
time, so drift hits both arms equally. Reported below as paired deltas and medians of
n=5 pairs, at 6x CPU throttle on a 390×844 / DPR 3 viewport.

### Cold load (`--mode load`, new in this tier)

| n=5 pairs | baseline | after | delta |
|---|---|---|---|
| median blocked main thread | 903ms | **694ms** | **−209ms (−23%)** |
| median long tasks | 8 | **6** | −2 |
| paired deltas (ms) | | | −124, −314, −157, −264, **+176** |

Lower in 4 of 5 pairs. The one reversal is a genuine outlier, not a trend.

### Scroll (`--mode scroll`)

| n=5 pairs | baseline | after | delta |
|---|---|---|---|
| median fps | 44.9 | **47.5** | **+2.6 (+5.8%)** |
| median frames >33ms | 10.9% | **8.7%** | **−2.2pp** |
| paired fps deltas | | | +2.1, +2.7, **−9.4**, +2.9, +0.5 |

Faster in 4 of 5 pairs, and the three clean wins cluster tightly around +2.5fps. Pair 3
is an outlier in both metrics (worst frame 216ms against 67ms in every other candidate
run) and is reported rather than discarded.

### Why it fell short of ~650ms: the second moon

The first implementation moved the entire scene into a worker and load blocking barely
moved — 797ms against a ~955ms baseline. The moon's work was genuinely off the main
thread, and the main thread was still blocked.

**`ParticleObject`, the closing CTA's particle moon, was statically imported by
`closing-cta.tsx`.** It is the other three.js consumer in the repo, so the 660KB chunk
was parsed and compiled on the main thread on every homepage visit no matter what the
background moon did. Moving one of two tenants off a thread does not free the thread.

This also corrects the ablation this document opened with. "WebGL disabled → 307ms
blocked" was read as "~650ms of blocked main thread is the ASCII moon". Nulling
`getContext` disabled **both** moons *and* it does not prevent a chunk from being parsed
— only from being useful. The measurement never isolated what it was said to isolate.

Two changes followed, and both are in the final numbers above: the fallback engine is a
dynamic `import()` (so three.js is not on the critical path for a visitor whose scene is
in the worker), and `ParticleObject` left the homepage — for design reasons the user
raised independently, which happened to remove the last static three.js import from the
page. See "Removing the second moon".

### What is left

The remaining ~694ms of blocked main thread is not the moon. It is React hydration, the
boot sequence, Lenis and the Canvas2D particle layers — the layers `TASK-frame-budget-
cleanup.md` already identified as the dominant *scroll* cost and did not fully solve.
`TASK-adaptive-quality.md` (Tier 3) is where those get decided, and this tier's result
does not change that plan.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/canvasui/ascii-engine.ts` | new | the whole engine, minus React and minus unconditional DOM access; imported by both threads |
| `src/components/canvasui/AsciiObject.tsx` | edit | reduced to the React component; re-exports the engine so its public API is unchanged |
| `src/components/canvasui/ascii-object.worker.ts` | new | owns the scene, the easing loop, and all rendering off the main thread |
| `src/lib/ascii-canvas/moon-transform.ts` | new | morph→camera tables, `createMoonEasing`, `opacityForMorph`; shared by both threads, imports nothing |
| `src/components/ascii-canvas.tsx` | edit | host: imperative canvas, worker + dynamic-import fallback, idle-deferred init, visibility gating, `data-moon-path` |
| `src/components/homepage/closing-cta.tsx` | deleted | replaced by the shared `PageCta`; see "Removing the second moon" |
| `src/app/page.tsx` | edit | homepage closes on `PageCta` with its own copy |
| `scripts/profile-scroll.mjs` | edit | `--mode load` for cold-load long tasks / blocked main thread |
| `src/app/system/moon-path-readout.tsx` | new | §3.1: reports which thread the background moon actually got |
| `src/app/system/page.tsx` | edit | mounts the readout above the canvas-layer panels |
| `CLAUDE.md` | edit | stack table, layout, and the `pnpm run profile` correction |
| `README.md` | edit | Status + the `profile` script's real invocation |
| `public/draco/` | **dropped** | `moon.glb` is not Draco-compressed; the decoder is never fetched |
| `next.config.ts` | **dropped** | Turbopack needs no configuration for worker bundling (verified) |
| `scripts/build-glyph-atlas.mjs`, `public/ascii/*` | **deferred** | justification removed by the worker; baking it is a design decision — see above |
| `docs/design-handoff.md` | none | checked: the closing CTA was added after the handoff and is not described there |
