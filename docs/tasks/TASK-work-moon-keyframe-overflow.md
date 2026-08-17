# TASK: Fix the moon freezing on `/work` once keyframes run past 5

## Current scenario

`src/lib/ascii-canvas/moon-transform.ts` drives the background moon's
scale/rotation/drift from a single `morph` number (base keyframe index +
fractional progress to the next one), read from `[data-ascii-keyframe]`
markers via `createScrollTracker` (`scroll-progress.ts`). Scale and drift come
from fixed lookup tables:

```ts
export const SCALE_BY_MORPH = [6.0, 3.6, 1.3, 1.1, 1.0, 0.9];
export const OFFSET_X_BY_MORPH = [1.3, 0.6, 1.7, -1.7, 1.7, -1.7];
export const OFFSET_Y_BY_MORPH = [0.3, 0.1, 0.9, 0.9, -0.9, -0.9];
```

Six entries — keyframes 0 through 5 — and `interpolate()` clamps anything
outside that range to the nearest end:

```ts
const idx = Math.max(0, Math.min(Math.floor(morph), table.length - 1));
```

Every page's own keyframe numbering was, until now, within that range: the
homepage and `/about` top out at keyframe 5 (their closing `PageCta`), and
`/work/[slug]` tops out at 5 too. `/work`'s index page
(`src/app/work/page.tsx`) is the exception:

```ts
{ number: "00", keyframe: 1, label: "INDEX", ... },
...STUDIO_PROJECTS.map((project, i) => ({ ..., keyframe: i + 2, ... })),
```

`keyframe: i + 2` was written when `STUDIO_PROJECTS` had four entries (i =
0–3 → keyframes 2–5, fitting the table exactly). The project list has since
grown to six (Prumo and ART'hur were added after the original four — see
`git log` — most recently Flora), so `i` now runs 0–5, producing keyframes
2–7. Keyframes 6 and 7 (ART'hur, the 5th project, and Flora, the 6th) fall
outside `SCALE_BY_MORPH`/`OFFSET_X_BY_MORPH`/`OFFSET_Y_BY_MORPH`'s five
defined indices past keyframe 1, and `interpolate()` silently clamps both to
whatever keyframe 5 (Prumo) produced.

**Effect:** rotation keeps advancing (`targetRotation = morph * 24` isn't
table-driven), but scale and — critically — the corner the moon parks in stop
changing at Prumo (keyframe 5) and stay frozen there through ART'hur and
Flora. The corner hop is the visual cue that tells a visitor the page is
still responding to their scroll; losing it from the 5th project onward reads
as the page having stopped, which is what was reported ("when i get to the
5th project in /work i cant scroll anymore") even though the underlying
scroll and `ScrollMorphStage` content morph (a fully separate mechanism, not
keyframe-driven) keep working correctly the whole way to the end — confirmed
by scripted scroll/wheel tests against the dev server: `--morph-progress` and
the active `WorkCase` layer advance correctly through all six projects; only
the moon's position stalls.

## Planned changes

### `src/lib/ascii-canvas/moon-transform.ts`

- Keep `SCALE_BY_MORPH` and its `interpolate()` table as-is. Freezing at the
  small ambient scale (0.9) past keyframe 5 is the intended resting state,
  not the bug — and rotation staying unclamped already satisfies "never stop
  animating" for it.
- Replace the fixed-length `OFFSET_X_BY_MORPH`/`OFFSET_Y_BY_MORPH` arrays
  with a formula for keyframe ≥ 2 (where the moon starts "parking in a
  corner, alternating per section" — existing behavior, see the comments
  already in this file): X flips sign every keyframe, Y flips sign every
  *other* keyframe, cycling through all four corners in turn rather than
  bouncing between two. Verified to reproduce the exact existing values for
  keyframes 2–5 (so keyframes already in use across the site render
  identically), and it has no length to run out of — the next case study
  added to `STUDIO_PROJECTS` (or any future page with more morph layers than
  today's) keeps getting a genuinely new corner instead of silently clamping.
  Keyframes 0 and 1 (Hero/About's bespoke hand-picked sweep) stay two
  hardcoded constants, blended into the formula's keyframe-2 value exactly
  the way `interpolate()` already blended index 1 into index 2 — no seam.

### Not changed

- `src/app/work/page.tsx`'s `keyframe: i + 2` — the actual bug is the table
  running out under it, not the numbering scheme. Leaving the numbering
  linear-in-project-count is fine now that nothing downstream has a fixed
  length to overflow.

## Why

Direct consequence of `docs/tasks/...` project growth (Prumo, then ART'hur,
then Flora) outpacing a table sized for the original four case studies —
confirmed by user report and reproduced via scripted scroll against the dev
server (moon position genuinely stops changing at keyframe 5 while page
content keeps morphing correctly). A formula instead of a longer fixed array
is the fix that doesn't need revisiting the next time a case study is added,
which is exactly the failure mode that caused this bug in the first place.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/lib/ascii-canvas/moon-transform.ts` | edit | offset tables → keyframe≥2 formula; scale table unchanged |
