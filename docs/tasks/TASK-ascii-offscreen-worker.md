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

### `src/components/canvasui/ascii-object.worker.ts` (new)

A dedicated worker that owns the entire three.js scene. Receives, on init: the transferred
`OffscreenCanvas`, the resolved `AsciiObjectOptions`, the device pixel ratio, and the
resolved `prefers-reduced-motion` value. Thereafter receives only:

- `resize` — new dimensions and DPR, on viewport change.
- `morph` — a single number (the scroll tracker's morph value) per frame.
- `cadence` / `visibility` — the Tier 1 controls.

**The easing loop moves into the worker.** Rather than posting four interpolated floats per
frame from the main thread, the main thread posts the raw morph value and the worker runs the
existing `EASE` convergence plus the `SCALE_BY_MORPH` / `OFFSET_X_BY_MORPH` /
`OFFSET_Y_BY_MORPH` interpolation itself. One small message per frame, and the moon keeps
animating its ambient float at a steady rate even if the main thread stalls — which is
precisely the failure the visitor reported.

Deliberately **not** using `SharedArrayBuffer` for the per-frame value: it requires COOP/COEP
headers site-wide, which is a large constraint to take on for four floats a frame.

### `src/components/canvasui/AsciiObject.tsx`

Split the file so the scene-construction logic is importable by both the worker and the
existing main-thread path, and keep `createAsciiObject` as the public entry point with an
unchanged signature. It gains a runtime branch:

- **Worker path** when `HTMLCanvasElement.prototype.transferControlToOffscreen` and `Worker`
  both exist: transfer the canvas, spawn the worker, and return an `AsciiObjectInstance`
  whose methods post messages.
- **Main-thread path** otherwise: exactly what runs today, unchanged.

Two things must be handled specifically for the worker path:

- **`OrbitControls` cannot run there** — it binds DOM events, and there is no DOM. This site
  configures `orbit: false, zoom: false` (`ascii-canvas.tsx:115-116`), so controls are
  constructed and `controls.update()` called (`AsciiObject.tsx:1376`) for no behavioural
  effect. Skip controls entirely when they are disabled; fall back to the main-thread path if
  a caller ever enables them.
- **`IntersectionObserver` stays on the main thread** and posts visibility across, since it
  observes a DOM element.

The existing WebGL feature-detect and its fallback behaviour are unchanged — per CLAUDE.md
§0, a visitor without WebGL still gets a correctly laid-out page. Worker-unavailable is now a
third case, and it degrades to the current experience rather than to no moon.

### `public/draco/` + `src/components/ascii-canvas.tsx`

Self-host the DRACO decoder and pass an explicit `dracoDecoderPath: "/draco/"`. Removes a
cross-origin round-trip from the critical path and makes the moon's load behaviour
independent of a third party. Also worth checking whether `moon.glb` is actually
Draco-compressed at all — if it is not, the decoder is being fetched for nothing and can be
dropped entirely. `[VERIFY: inspect moon.glb for the KHR_draco_mesh_compression extension
before deciding]`

### `scripts/build-glyph-atlas.mjs` (new) + `public/ascii/atlas.png` + `public/ascii/atlas.json`

Precompute the glyph atlas at build time. The script runs the same rasterization and
`glyphShapes()` derivation currently done at load, and emits the atlas image plus the derived
vectors and grid metadata. `AsciiObject` loads these instead of computing them, falling back
to runtime generation when the config differs from what was baked (a different `cellSize`,
glyph set or font than the committed atlas).

The fallback matters: this component is shared, `/system` stages it, and a future caller with
different options must still work.

### `src/components/ascii-canvas.tsx`

Defer worker init until after first paint (`requestIdleCallback`, with a `setTimeout`
fallback), so the moon's setup never competes with hydration or the boot sequence. With the
work in a worker this is much less critical than it would be today, but the transfer and
first compile still touch the main thread briefly.

### `next.config.ts`

Whatever is needed for `new Worker(new URL("./ascii-object.worker.ts", import.meta.url))` to
be bundled correctly under Turbopack. `[VERIFY: check Next.js 16's current guidance on
worker bundling before writing this — per CLAUDE.md §2.0, do not assume the API from
memory]`

## Why

The moon is the site's single most identity-carrying element, and the profile says it costs
~650ms of blocked main thread at load and is the second-largest scroll cost after the
particles. The two obvious ways to make it cheaper — render it smaller, or render it less
often — both spend the thing the site is actually for. Moving it to a worker spends nothing:
same model, same glyph density, same cadence, on a thread where it is the only tenant.

The secondary wins are real on their own terms. Self-hosting DRACO removes a third-party
dependency from the critical path for a visitor on a weak connection, which is the exact
population that reported the problem. Precomputing the atlas removes deterministic work that
is currently redone on every device on every load.

What it costs: two code paths through `AsciiObject` (worker and main-thread) that must stay
behaviourally identical, in a 1500-line file that is already the most complex thing in the
repo. That is a genuine maintenance burden and the main argument against doing this. It is
worth taking because the fallback path is not new code — it is the code that exists today,
kept — and because the alternative ways of recovering this budget all degrade the design.

Not addressed here: Lenis's 30% self-time. It is structural to how Lenis works (a real scroll
per frame) and the ablations showed the site holds 58.8fps with Lenis fully enabled once the
canvas layers are cheap. It stays.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/canvasui/ascii-object.worker.ts` | new | owns the three.js scene, the easing loop, and all rendering |
| `src/components/canvasui/AsciiObject.tsx` | edit | split scene construction for reuse; worker path + unchanged main-thread fallback; skip `OrbitControls` when disabled |
| `src/components/ascii-canvas.tsx` | edit | post the raw morph value per frame; self-hosted `dracoDecoderPath`; defer init past first paint |
| `public/draco/` | new | self-hosted decoder, replacing the gstatic CDN default |
| `scripts/build-glyph-atlas.mjs` | new | build-time atlas generation |
| `public/ascii/atlas.png`, `public/ascii/atlas.json` | new | precomputed atlas + derived vectors |
| `next.config.ts` | edit | worker bundling under Turbopack — verify current Next.js 16 guidance |
| `package.json` | edit | atlas build step wired into `build` |
| `src/app/system/page.tsx` | edit | §3.1: note which path (`worker` / `main-thread` / `no-webgl`) is active on the `AsciiObject` panel |
| `CLAUDE.md` | edit | stack table: the moon renders in a worker, with a main-thread fallback |
| `README.md` | edit | Status; the new build step; Credits if the decoder needs attribution |
| `docs/design-handoff.md` | none expected | no design decision changes — verify before closing |
