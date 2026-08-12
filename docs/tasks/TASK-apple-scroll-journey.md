# TASK: Lenis smooth scroll + pinned scroll-stage sections

## Current scenario

Scroll is native/unmodified. The ASCII moon's morph (`scroll-progress.ts`'s
`createScrollTracker`), every section's `Reveal` entrance, the nav's new reactive chrome/
label (`site-nav.tsx`), and the hero's `ParticleText` gather (`hero.tsx`) all read
`window.scrollY` / `getBoundingClientRect()` directly against normal document flow — each
section is its own normal-height block, scrolled past at native speed with no pin/hold.

The user wants the site to "behave more like an Apple website" — specifically the scroll
*mechanics* (sections pin in place while their content transforms across a scroll range,
then release to the next section), not Apple's visual language — confirmed explicitly:
sharp corners, dark-only theme, and the amber accent are unchanged, per `CLAUDE.md` §0's
"must not break" list. Also requested: smooth/inertia scroll (Lenis), and longer per-section
scroll distance so pinned content has room to tell more of each section's story before
releasing.

## Planned changes

### 1. Lenis (foundational, do first)

- `pnpm dlx shadcn@latest add lenis` or `pnpm add lenis` — check current install docs per
  `CLAUDE.md` §2.0 rather than assuming API shape from memory.
- A single `LenisProvider` client component near the root (`layout.tsx`, likely wrapping
  everything inside `<SoundProvider>` or alongside it), running Lenis's rAF loop.
- **Must stay compatible with every existing scroll-position reader** — confirmed earlier
  this session that Lenis eases the *native* `scrollTop`/`scrollY` rather than faking scroll
  via CSS transform (unlike older transform-based virtual-scroll libraries), so
  `scroll-progress.ts`'s `window.scrollY` reads keep working unmodified. This is why Lenis
  specifically was picked over alternatives — verify this holds once actually installed,
  don't just trust the earlier research.
- Respect `prefers-reduced-motion`: disable Lenis smoothing entirely (native scroll) when
  set, same principle every other motion piece on this site already follows.

### 2. `ScrollStage` — reusable pinned-section primitive

A new shared component, `src/components/scroll-stage.tsx`:
- Tall wrapper (`height: <multiplier> * 100vh`, multiplier configurable per instance —
  this is the "increase the scroll journey" lever, more height = more scroll room for the
  pinned content's transform) containing a `position: sticky; top: 0; height: 100vh` inner
  panel.
- Tracks local progress (0–1) across the wrapper's own scrollable range via
  `getBoundingClientRect()`, same imperative-ref-driven pattern as `ParticleTextHandle` and
  `ascii-canvas.tsx` — exposes progress via a render-prop or context, not React state, so a
  scroll frame doesn't force a full subtree re-render.
- Once local progress reaches 1, native scroll continues normally into whatever follows
  (another `ScrollStage` or a normal-flow section) — no manual scroll-jacking/`preventDefault`,
  the pin is pure CSS `position: sticky`.

### 3. Phase 1 rollout — homepage Hero → About only

Given how many real bugs this session's own visual testing caught in far simpler changes
(a className-merge collision, a percentage-width chain break, a missing Provider ancestor —
all invisible without an actual screen recording), and given pinned-scroll math is
meaningfully harder to get right blind than any of those: **do not mass-apply `ScrollStage`
across every section in one pass.** Build it once, wire up the Hero → About-teaser
transition on the homepage as a proof of concept, verify it visually together, then extend
to the rest of the homepage and the subpages in a follow-up pass once the primitive is
proven.

### 3b. ParticleScroll panel — attempted and reverted

Tried wrapping the homepage's `ParticleScroll` panel in `ScrollStage` and driving its
internal `scrollTop` programmatically from the pin's own progress, to fix the panel's scroll
feeling disconnected from the rest of the page (had to find it with the cursor). This
**visibly corrupted the html-in-canvas capture** (overlapping/ghosted content from more than
one scroll position rendered simultaneously) and **froze page scroll entirely** partway
through the Services section. Reverted to the original `data-lenis-prevent` + independent
native internal scroll. `ParticleScroll`'s capture pipeline apparently assumes natural,
wheel-paced `scrollTop` changes, not instant per-frame jumps to an arbitrary value — not
safe to fight further without understanding its internals much better than treating it as a
black-box `scrollTop` poll allows. The "have to find the box with your cursor" friction is
real but stays as a known limitation, not a broken capture and frozen scroll.

### 4. Every framed element gets a label (done, this session)

`data-frame-label` now sits alongside every `data-ascii-keyframe` element site-wide,
consumed by `SiteNav`'s new live label (`createFrameTracker` in `scroll-progress.ts`). This
is already the "every element linked to its frame" foundation `ScrollStage` will build on —
no further work needed here before Phase 1.

**Alternatives considered and rejected:**
- *Scroll-jacking via `wheel`/`preventDefault` instead of `position: sticky`.* Rejected —
  much more fragile (breaks trackpad/touch scroll physics, fights Lenis, historically the
  source of the worst "janky Apple clone" implementations), and CSS sticky achieves the same
  pin-and-release effect without hijacking the scroll event.
- *Rolling out to every section immediately, since the user asked for "every element."*
  Rejected for this pass specifically due to the session's demonstrated bug rate on
  unverified visual work — the primitive gets built once, proven on one transition, then
  extended, rather than risking a broad, hard-to-debug regression across the whole site at
  once.

## Why

Requested by the user, aimed specifically at the scroll *feel* (pinned, transforming,
deliberate) rather than Apple's visual identity — confirmed this doesn't touch any of
`CLAUDE.md`'s locked tokens. Phased rollout is a deliberate risk-management choice given this
session's own track record: several real bugs (CSS class collisions, width-resolution
chains, a missing context provider) were only caught because the user recorded and looked at
the actual result — pinned-scroll math has more moving parts than any of those and deserves
the same verify-before-extending discipline, not a one-shot site-wide change.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/lenis-provider.tsx` | new | wraps Lenis's rAF loop, reduced-motion aware |
| `src/app/layout.tsx` | edit | mount `LenisProvider` |
| `src/components/scroll-stage.tsx` | new | reusable pinned-section primitive |
| `src/components/homepage/hero.tsx` | edit | Phase 1: wrap Hero→About transition in `ScrollStage` |
| `src/components/homepage/about-teaser.tsx` | edit | Phase 1: receiving end of the pin/release |
| `src/app/system/page.tsx` | edit | panel for `ScrollStage` once built (CLAUDE.md §3.1) |
| `package.json` / `pnpm-lock.yaml` | edit | add `lenis` |
