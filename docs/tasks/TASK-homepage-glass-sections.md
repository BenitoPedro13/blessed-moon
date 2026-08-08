# TASK: Let the ASCII moon show through content sections (glass, not panels)

## 1. Current scenario

The homepage sections were built (`TASK-homepage-sections.md`) before the ASCII canvas layer
existed (`TASK-ascii-canvas-layer.md`), and it shows: `ServicesGrid` and `SelectedWork` fill
every card/row with a fully opaque `bg-background`, so the moon is completely hidden behind
them — only visible in the 1px gaps between cells. Compared against the Dragonfly reference
(`docs/design-handoff.md` References), whose content cards float directly over its ASCII
illustration with no opaque fill at all, ours reads as a background effect bolted onto a UI
that wasn't designed around it, rather than one continuous surface.

Brand tokens (color, type, sharp corners, TUI aesthetic) are working well and are not in
scope here — this is a layout/surface-treatment fix, not a redesign of the identity.

## 2. Planned changes

Per user direction, `docs/design-handoff.md`'s wireframe is a starting point, not a locked
spec — copy and section order stay as-is (still no reason to change them), but surface
treatment can change.

- **`src/components/homepage/services-grid.tsx`**: replace the "1px gap + opaque `bg-background`
  per cell" grid technique with a bordered grid that has no cell fill — `divide-x divide-y
  divide-border/60` (or explicit `border-r border-b`) on transparent cells. Add a light
  `bg-background/55 backdrop-blur-sm` (not fully transparent) so label/body text stays legible
  against a potentially bright patch of moon, while the moon's shape still reads through as a
  soft glow instead of being boxed out.
- **`src/components/homepage/selected-work.tsx`**: same treatment on the project rows —
  drop the opaque per-row `bg-background`, use a row divider (`divide-y divide-border/60`)
  instead, same translucent+blur backing.
- **Section padding** (all homepage sections): bump `py-13 sm:py-16` → `py-16 sm:py-20` for
  a bit more breathing room between sections, closer to Dragonfly's spacing — small change,
  not a layout rework.
- **Not changed**: `AboutTeaser`, `HowWeWork`, `PricingTable` already have no opaque card
  fills (just text over the section background), so the moon already shows through them
  correctly — no edits needed there. `ascii-canvas.tsx`'s per-keyframe opacity curve is
  unchanged; this task only removes UI elements that were occluding it.

## 3. Why

The user's read after seeing the working moon background: "seems like our UI wasn't designed
for a 3D rendering background." Correct — `ServicesGrid`/`SelectedWork`'s solid card fills
predate the ASCII layer and now hide the site's signature element behind opaque boxes for two
of five homepage sections. Translucent-with-blur (rather than fully transparent) keeps text
legible — the moon can be bright in places — while still reading as one continuous surface
top to bottom, matching the Dragonfly precedent this whole effect is built from.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/homepage/services-grid.tsx` | edit | transparent-with-blur cells, divider borders instead of gap-fill grid |
| `src/components/homepage/selected-work.tsx` | edit | transparent-with-blur rows, divider borders instead of gap-fill rows |
| `src/components/homepage/hero.tsx`, `about-teaser.tsx`, `how-we-work.tsx`, `pricing-table.tsx` | edit | `py-13 sm:py-16` → `py-16 sm:py-20` only |

## 5. Revision — scroll-reveal on content (cohesion with the ASCII layer)

After the glass-section pass, user feedback: the ASCII moon animates continuously with
scroll, but page content just appears statically — nothing about the foreground responds to
scroll the way the background does, so the two don't read as one directed scene the way
Dragonfly's does. Fix: a small reusable `Reveal` wrapper (`src/components/reveal.tsx`, new)
using `IntersectionObserver` to fade/slide-up content the first time it enters the viewport,
one-shot (doesn't re-trigger scrolling back up), respects `prefers-reduced-motion`. Applied to
each homepage section's headings/paragraphs/grid-cells/rows with a small stagger where a
section has multiple repeated items (services grid, selected work rows, how-we-work columns,
pricing rows).

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/reveal.tsx` | new | IntersectionObserver fade/slide-up wrapper, one-shot, reduced-motion aware, optional `delay` for stagger |
| `src/components/homepage/hero.tsx` | edit | wrap headline in `Reveal` |
| `src/components/homepage/about-teaser.tsx` | edit | wrap heading/paragraph in `Reveal` |
| `src/components/homepage/services-grid.tsx` | edit | wrap each card in `Reveal` with staggered delay |
| `src/components/homepage/how-we-work.tsx` | edit | wrap each column in `Reveal` with staggered delay |
| `src/components/homepage/selected-work.tsx` | edit | wrap each row in `Reveal` with staggered delay |
| `src/components/homepage/pricing-table.tsx` | edit | wrap each row in `Reveal` with staggered delay |
