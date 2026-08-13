# TASK: Adaptive quality — a frame budget, not a breakpoint

> Tier 3 of three. Tier 1 is `TASK-frame-budget-cleanup.md`, Tier 2 is
> `TASK-ascii-offscreen-worker.md`. This is the tier where something a visitor could
> *notice* is allowed to change — and the whole point of its design is that it happens only
> on a device that has already proven it cannot hold the frame rate, and reverses the moment
> that stops being true.
>
> Depends on Tier 1 (`frame-loop` provides the frame timing; `setCadence` provides the
> largest lever) and reads much better after Tier 2 (a worker-rendered moon needs to degrade
> far less often). Should land last.

## Current scenario

The site has exactly one quality decision today, and it is a viewport-width breakpoint:
`ascii-canvas.tsx:36-43`'s `viewportTransform()` scales the moon to 0.42 below 768px. That is
a *composition* decision (the moon should sit differently in a narrow frame), not a
performance one, and it is the only thing resembling adaptation in the codebase.

Everything else is fixed at build time: 160 particles (`scroll-particles.tsx:31`), `cellSize:
6` (`ascii-canvas.tsx:105`), a 60fps render loop, a full-viewport star field. A flagship phone
and a four-year-old mid-range Android run byte-identical work.

The measured consequence, from the Tier 1 profile: at 4× CPU throttle the site holds ~59fps;
at 6× it drops to 48.7fps with 9.7% of frames over 33ms. There is a real device class that
falls off a cliff, and nothing currently detects it — which is how the original report
happened (*"agr tá travando um pouco"*, on an unspecified phone, on a weak connection).

The obvious fix — disable some animations below a width breakpoint — was considered first and
rejected. Screen width does not predict GPU or CPU capability: a recent flagship and a budget
phone report the same 390px viewport, and the flagship would be handed a gutted version of a
site whose entire brief is atmosphere. It also cannot help a *desktop* visitor on a loaded
machine or an integrated GPU, which the profile shows is the same failure mode.

## Planned changes

### `src/lib/quality.ts` (new)

A frame-budget governor. Subscribes to Tier 1's `frame-loop`, keeps a rolling window of frame
times (median of the last ~90 frames, so a single GC pause cannot trigger it), and publishes a
quality level: `full` → `reduced` → `minimal`.

**Hysteresis, asymmetric on purpose.** Degrade quickly — two consecutive sampling windows over
budget is enough, because a visitor experiencing jank should not have to endure several
seconds of it. Recover slowly — several consecutive comfortable windows, with a minimum dwell
time at each level. Quality that oscillates is more distracting than quality that is simply
lower, and a scroll-driven site produces naturally uneven load as sections come and go.

**Seeded, not guessed cold.** Use `navigator.hardwareConcurrency` and `navigator.deviceMemory`
(where available) only to pick the *starting* level, so a weak device is not required to
stutter for two seconds before adapting. Measurement overrides the seed within the first few
windows in both directions. `[VERIFY: deviceMemory availability across current Safari/Firefox
— it is Chromium-leaning; treat absence as "no signal", not as "weak"]`

**An explicit override** via `?quality=full|reduced|minimal` for testing and for the `/system`
page, and so a regression can be reproduced without a throttled browser.

### What each level changes, and in what order

The ordering principle: **the last thing to degrade is the thing that carries the most
meaning.** Cost is spent from the most ambient and least identity-bearing element inward.

| Level | Particles | Moon cadence | Moon resolution | Star field |
|---|---|---|---|---|
| `full` | 160 | 60fps | `cellSize: 6`, DPR ≤2 | full density |
| `reduced` | 96 | 30fps | `cellSize: 8`, DPR 1 | ~60% density |
| `minimal` | 48 | 20fps | `cellSize: 10`, DPR 1 | ~35% density |

A note on the moon's `cellSize`: raising it makes the ASCII grid coarser, which is a genuine
visual change — but on a small screen, larger glyphs are arguably *more* legible as ASCII, not
less. This is the one degradation worth reviewing against a screenshot before accepting, and
possibly worth adopting at `full` on small viewports as a composition decision independent of
performance.

### What must never degrade

These are hard exclusions, written into the module's docblock so a future session does not
quietly add them as levers:

- **The `MorphToken` handoffs and the 8 → 4 → 3 → 1 count.** Per CLAUDE.md §0 this is the
  morph *mechanism*, not decoration. A degraded version that skips the token flight is a
  different page, not a lighter one.
- **The window's width/height interpolation in `ScrollMorphStage`.** Same reason: one terminal
  that morphs is the premise.
- **Section structure, copy, and numbering.**
- **Lenis.** It survived every ablation at 58.8fps and is core to the feel.
- **The `full` level itself.** The site must remain capable of running at full fidelity; this
  module may only ever reduce, never redefine, what `full` means.

### `src/components/scroll-particles.tsx`

Read the particle count from the quality level. Reseeding on a level change would visibly
reshuffle the field, so instead seed at the `full` count once and draw only the first N —
lowering the level thins the field rather than replacing it, and raising it back restores the
same particles in the same places.

### `src/components/ascii-canvas.tsx`

Map quality onto `setCadence` (from Tier 1) and onto `cellSize` / pixel ratio. Cadence is free
to change per frame; `cellSize` reallocates GPU render targets (`AsciiObject.tsx:1299-1300`),
so it must be applied on level *transitions* only, debounced, and never per frame.

### `src/components/animate-ui/components/backgrounds/stars.tsx`

Take star density from the quality level.

### `src/app/system/page.tsx`

A quality panel: the current level, the rolling median frame time, the seed signals, and
buttons to pin a level. This is the debugging surface for the whole system and is what makes
the module's behaviour observable rather than mysterious.

### `src/components/frame-loop.ts`

Expose the rolling frame-time statistic the governor consumes (Tier 1 already computes the
per-frame delta; this only publishes it).

### Verification

Re-run `scripts/profile-scroll.mjs` at 4×, 6× and 8× throttle. Success criteria:

- **4×**: stays at `full`, ≥58fps, no visible change from today.
- **6×**: settles at `reduced` and holds ≥55fps with <2% of frames over 33ms.
- **8×**: settles at `minimal` and stays smooth rather than janky.
- No level oscillation during a continuous scroll of the homepage at any throttle rate.

## Why

Tiers 1 and 2 remove waste and relocate work; neither can guarantee a frame rate on hardware
nobody tested. This tier is what makes the guarantee, and it makes it in the direction that
preserves the brief: a fast device is never pre-emptively downgraded, and a slow device gets a
slightly lighter version of the real thing rather than a stuttering version of the full one.
Stutter destroys immersion far more thoroughly than a coarser glyph grid or a thinner particle
field — jank is the one degradation a visitor is guaranteed to notice.

It also generalizes past the case that prompted it. The report came from one phone on one
connection, but the same failure exists on an old laptop, on an integrated GPU, in a browser
with thirty other tabs open, or on battery saver. A breakpoint addresses none of those. A
measured frame budget addresses all of them, including devices that do not exist yet.

Cost: the site no longer looks identical on every device, which is a real loss of determinism
— a bug report becomes harder to reproduce without knowing the reporter's level. The
`?quality=` override and the `/system` panel exist specifically to buy that back.

This is separate from `prefers-reduced-motion`, which stays exactly as it is. That setting is
a stated preference for *less motion* and is honoured by removing the mechanism entirely (the
`ScrollMorphStage` stacked fallback, `LenisProvider` returning children, `Reveal`). Quality
level is an inference about *capability* and only ever thins what is already there. The two
must not be conflated, and the governor must never run as a substitute for the reduced-motion
path.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/lib/quality.ts` | new | rolling frame-time governor; `full`/`reduced`/`minimal`; asymmetric hysteresis; device-signal seed; `?quality=` override |
| `src/components/frame-loop.ts` | edit | publish the rolling frame-time statistic (Tier 1 already computes the delta) |
| `src/components/scroll-particles.tsx` | edit | draw first N of a fixed seed — thin the field, never reshuffle it |
| `src/components/ascii-canvas.tsx` | edit | quality → `setCadence`; `cellSize`/DPR on level transitions only, debounced |
| `src/components/animate-ui/components/backgrounds/stars.tsx` | edit | density from quality level |
| `src/app/system/page.tsx` | edit | §3.1: quality panel — level, median frame time, seed signals, level pinning |
| `CLAUDE.md` | edit | §0: adaptive quality is a measured budget, never a breakpoint; the never-degrade list |
| `README.md` | edit | Status; the `?quality=` override |
| `docs/design-handoff.md` | edit | record `reduced`/`minimal` as sanctioned appearances, so a future session does not "fix" them back |
