# TASK: Remove ParticleText from the Hero headline

## Current scenario

`src/components/homepage/hero.tsx` renders its two headline lines ("CLARITY IS" /
"THE FEATURE.") through two `ParticleText` canvas instances (`src/components/
react-bits/particle-text.tsx`), scroll-gathered via a `subscribeFrame` effect that reads the
section's scroll progress and calls `setGatherProgress` on both instances every frame.

`ParticleText`'s per-particle `shadowBlur` glow is already a documented main-thread cost —
`TASK-particle-glow-sprite.md` measured it at 12.0% of main-thread self-time at 6x CPU
throttle and tried (and reverted) a sprite-atlas optimization that made it worse. The Hero
mounts **two** instances of it, on every load, on the page every visitor lands on first. The
user has asked for it to be removed from the Hero specifically because it's hurting
performance.

## Planned changes

### `src/components/homepage/hero.tsx`

- Replace both `ParticleText` instances with plain static text inside the existing `h1`
  (same copy, same `aria-label`, same Tailwind classes for size/weight/tracking).
- Remove the `subscribeFrame` effect that drove `setGatherProgress` — it exists only to feed
  `ParticleText`'s gather animation from scroll position. The block's own fade/scale-out via
  `--stage-progress` (the plain wrapper `div` around `Reveal`) is unrelated and stays.
- Remove the now-unused `line1Ref`/`line2Ref`, the `ParticleTextHandle` type import, and the
  `ParticleText` import.
- `Reveal`'s mount-in animation stays — that's a one-shot CSS/Motion transition, not a
  per-frame canvas particle system, and isn't part of what's being removed.

### `src/components/scroll-stage.tsx`

- The `particles` prop's doc comment justifies Hero's opt-out by saying Hero "already has its
  own particle moment via ParticleText" — no longer true once the above lands. Reword to not
  reference `ParticleText`. This does not change behavior: Hero still doesn't pass
  `particles`, so `ScrollParticles` (a separate, already-opt-in ambient texture) stays off.

### `src/app/page.tsx`

- The comment above `<Hero />` calls out "Hero's scroll-linked ParticleText gather" as "the
  page's one thesis moment" that justifies not diluting it into the shared morph sequence.
  Update the wording so it no longer describes a particle gather that no longer exists, while
  keeping the actual point (Hero and the closing CTA keep independent pins, separate from the
  five-layer `ScrollMorphStage` sequence).

### Not changed

- `src/components/react-bits/particle-text.tsx` stays in the codebase — `/system`'s "React
  Bits candidates" section still renders it as a hover-triggered demo (`src/app/system/
  page.tsx:556`), same "installed, not on a live page" status already used for
  `ParticleObject`/`ParticleScroll`/`DecryptReveal`. That section's framing ("Under review,
  not yet on a live page") becomes accurate for `ParticleText` once this lands, rather than
  slightly wrong the way it was while `ParticleText` was actually live on Hero.

## Why

Direct user request: "remove the particles from the hero pls is hurting performance."
`TASK-particle-glow-sprite.md` already established this exact code path (two `ParticleText`
instances, `shadowBlur` glow, `particleSize: 2.6` forcing the expensive `arc()`+`fill()`
draw path over the cheap `fillRect` branch) as the largest measured main-thread cost on the
homepage, and that a cheaper rendering path for it doesn't exist yet. Removing it from the
one page every visitor sees first is a straightforward, low-risk win; the component itself
isn't deleted, so nothing forecloses reviving it later behind a fix.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/homepage/hero.tsx` | edit | static text instead of `ParticleText`; drop the scroll→gather wiring |
| `src/components/scroll-stage.tsx` | edit | doc-comment only, `particles` prop reasoning |
| `src/app/page.tsx` | edit | doc-comment only, above `<Hero />` |
