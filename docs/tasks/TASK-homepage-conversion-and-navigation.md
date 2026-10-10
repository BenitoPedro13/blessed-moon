# TASK: Homepage conversion, quick navigation and stepped scroll

Status: Benito approved the plan ("ok", 10 October 2026). Defaults taken:
hero line (a), and a live v1 UniMeet capture. **Sections 1, 2, 5, 6 and 7 are
built** (see Results); 3 and 4 follow.

## Current scenario

**What a first-time visitor goes through on `/`:**

1. The boot screen (sound prompt, then "scroll to begin"), on **every** full
   page load. There is no first-visit memory.
2. The hero, "CLARITY IS THE FEATURE.", and nothing else: no line saying
   what the studio does or for whom, and no action (`hero.tsx`). It is pinned
   for 2 viewports.
3. One `ScrollMorphStage` with five views (About, Services, Process, Selected
   Work, Pricing) at `heightPerLayer={1.6}`, so about 8 viewports of scroll.
   Selected Work is centred about 5.25 viewports into the stage, roughly
   **7 viewports after the boot screen on desktop** (about 4 on phones with
   `--stage-pace: 0.6`).
4. The `PageCta` band, then the footer.

**Ways to move quickly today:** the nav has Work, Services (`/#services`),
Pricing (`/#pricing`), About and Contact, plus "Start a project". Inside the
stage there is no way to see or jump between steps. The title bar shows only
the current one (`03 / PROCESS`).

**The moon** (`moon-transform.ts`) runs a scroll-driven camera move through
every keyframe: a big sweep from Hero to About, then from keyframe 2 it
shrinks into a corner that **changes on every section** (X flips each
keyframe, Y every other), at 0.4 opacity. On the homepage, and on `/work`,
which now pins again, it is a second moving thing alongside the
window's own morph.

**Umami, last 90 days** (small sample of 91 visitors, including Benito's own):

| Signal | Value |
|---|---|
| Visits starting on `/` | 71 of 112 |
| Of those, ended on `/` without opening another page | 50 |
| `/` → `/work` | 18 of 74 visitors (24%) |
| `/` → `/contact` | 11 of 74 (15%) |
| Enquiries submitted | 1 |
| Most viewed case studies | Flora 10, Oishi 6, ART'hur 5 (the three homepage picks) |
| Top referrer | Instagram (11) |

The data shows people leave from the homepage. It cannot show **where** on
the homepage, because no event records scroll depth. People who reach
Selected Work do click it.

Benito: "projects show only after lots of scroll", "I can't see a way to
navigate quickly", "on small scroll movements [it should] transition to the
next state of the stage", and "we don't need the full moon animation on
scroll after the hero."

## Planned changes

### 1. Measure first: `home-section-reached`

- `src/lib/analytics.ts`: a new enum-only event, `{ name:
  "home-section-reached"; data: { section: "about" | "services" | "process"
  | "work" | "pricing" | "cta" } }`. It follows the file's existing rule:
  enums only, a blocked tracker is a supported state.
- `ScrollMorphStage` gains an optional `onActiveChange(index)` prop, called
  from the existing `setActive` path (no new rAF and no layout read). The
  homepage passes a handler that fires each section once per page view.
- `/analytics-plan/live` gets a panel reading the drop-off between sections,
  with the usual "too few to read" below the minimum sample.
- This ships **first and on its own**, so the changes below have a
  before-and-after.
- **As built:** layers carry an optional `analytics` key instead of the
  stage taking an `onActiveChange` callback. The homepage is a Server
  Component and can't pass a function to a client component. A section
  counts only after it has been the one on screen for 600ms with the window
  engaged (`DWELL_MS`). A browser run showed a fling to the bottom otherwise
  reported every section, pricing included. Flow mode (reduced motion,
  overflow) reports a section when it crosses the middle 10% of the
  viewport. Verified in production: idle on the hero records nothing, a fast
  fling records nothing, and reading to Process records about → services →
  process. `scripts/check-page-scroll.mjs` passes for `/` (6/6), and
  `scripts/check-insights.mjs` covers `readSections`.

### 2. Give the hero a job

`src/components/homepage/hero.tsx`: keep the headline. Add one line saying
what the studio does and for whom, and two actions: **Start a project**
(`/contact`, primary) and **See the work** (`/work`, outline). Both are
shadcn `Button`s rendered as links. They fade out with the rest of the hero
on `--stage-progress`.

**[decide] Hero line** (drafts, in the brand voice, Benito picks or rewrites):

- a. "Strategy, design and engineering for founders who need software that
  holds up."
- b. "A studio for growing companies: products considered from the first
  question to the last line of code."
- c. "Digital products for founders and product leaders, designed and built
  by one person, end to end."

### 3. Quick navigation inside the stage: a clickable step list

The window's title bar already carries `NN / LABEL`. Make that a compact
step list: `01 About · 02 Services · 03 Process · 04 Work · 05 Pricing`,
with the current step highlighted and each step a button that scrolls (via
Lenis `scrollTo`, native under reduced motion) to that layer's centre
marker, which already exists for keyframes. The buttons are real
`<button>`s in a `<nav aria-label="Sections">`, with `aria-current="step"`
on the active one. On phones the list collapses to `03 / 05` plus
previous/next buttons.

The same component serves `/work` (15 steps). There, the step list shows
`NN / 15` plus previous/next and the index link, not 15 labels.

### 4. Stepped scroll: a small scroll moves one whole step

Inside a pinned stage, when scrolling settles (Lenis `Snap`, debounced), it
goes to the **next or previous step in the direction of travel** once the
scroll has moved more than a small threshold (about 8% of a step), and
otherwise settles back. It uses `lenis/snap`, already in the installed
`lenis` package, with direction logic in our own small wrapper (Lenis's
`proximity` and `mandatory` modes snap to the *nearest* point, so a small
movement would snap back).

This is still native scrolling. The scrollbar, keyboard (Space, Page Down,
arrows), find-in-page and anchors all keep working, and it never blocks
input. Snapping applies only between the stage's step markers. Above the
hero, below the last step, and on every flow-mode page, scrolling is free.
Under `prefers-reduced-motion` there is no Lenis and therefore no snapping,
matching the site's existing rule.

With stepping, `heightPerLayer` can drop from 1.6 to about 1.0, because the
distance no longer needs to be scrolled through by hand. That cuts the
homepage's stage from 8 to 5 viewports.

`CLAUDE.md` says "no scroll-jacking" for `ScrollStage`. This change keeps
that rule (input is never intercepted, only settled), and the rule's text
will be clarified rather than broken.

### 5. The moon after the hero: one corner, no camera move per section

`moon-transform.ts`: keep the Hero → About sweep (it is the moon's moment).
From keyframe 2 onward, park the moon in **one** corner at the ambient scale
and opacity instead of flipping corners every section. The slow ambient
float stays, so it reads as alive rather than frozen. The window's morph
becomes the only thing that moves on each step. This applies on every staged
page, since they share the table.

Performance is measured with `pnpm run profile` (medians, warm-up
discarded) before and after, per CLAUDE.md. No smoothness claim is made
without those numbers.

### 6. Boot screen once per visitor

`boot-sequence.tsx`: remember (in `localStorage`, wrapped in try/catch, and
absent storage counts as a first visit) that the boot screen has been seen,
and skip it on later loads. Nothing changes about how it renders the first
time. The "base style is the final state" animation rule is untouched.

### 7. Homepage project picks

`selected-work.tsx`: Apuração 2026, UniMeet, ART'hur (agreed). The count
stays 3, and the 3 and 1 morph tokens are untouched.

**[decide] UniMeet image:** every UniMeet screenshot is the proposed v2
design, and the section says "still in production." Default: capture the
live v1 site into `public/projects/unimeet/live.png` for the homepage card.

### 8. Section order: unchanged for now

Moving Selected Work above About/Services/Process would break the 8 → 4 →
3 → 1 count, whose meaning depends on the order. With the hero actions (2),
the step list (3) and stepping (4), Work is one click or four short scrolls
away. **Reordering is deferred** until `home-section-reached` shows whether
people actually drop before step 04.

## Why

Founders and CTOs decide in seconds whether a studio is credible and how to
reach it. The homepage currently answers both late, and 50 of 71 homepage
entries left without a second page. These changes put the offer and the
actions on the first screen, make every section one gesture away, and
remove a competing motion, while keeping the motifs that make the site what
it is.

Rejected:

- **Full scroll-jacking** (intercepting wheel events to animate between
  steps): it breaks trackpads, keyboard and find-in-page, and it is what the
  existing rule exists to prevent.
- **Removing the stage:** the window morph is the site's signature, and the
  problem is distance, not the idea.
- **Reordering now:** see section 8.

## Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/analytics.ts` | edit | `home-section-reached` event |
| `src/components/scroll-morph-stage.tsx` | edit | `onActiveChange`, step list in the title bar, step markers exposed for snapping |
| `src/components/stage-steps.tsx` | new | step-list nav (desktop list, mobile `NN / total` with previous/next) |
| `src/components/stage-snap.tsx` (or a hook in `lenis-provider.tsx`) | new | directional snapping between step markers |
| `src/components/homepage/hero.tsx` | edit | hero line, two actions |
| `src/components/homepage/selected-work.tsx` | edit | new picks |
| `src/app/page.tsx` | edit | `heightPerLayer`, section-reached handler |
| `src/app/work/page.tsx` | edit | `heightPerLayer` |
| `src/lib/ascii-canvas/moon-transform.ts` | edit | single parked corner from keyframe 2 |
| `src/components/boot-sequence.tsx` | edit | once per visitor |
| `src/lib/umami-insights.ts`, `src/components/insights/*` | edit | section drop-off panel |
| `public/projects/unimeet/live.png` | new | if the default is chosen |
| `src/app/system/page.tsx` | edit | step-list panel |
| `CLAUDE.md`, `README.md` | edit | stepping vs. "no scroll-jacking", moon behaviour, boot memory |

## Verification

- `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`.
- `scripts/check-page-scroll.mjs` (all routes): footer reachable by wheel,
  keyboard and touch with stepping on.
- `pnpm run profile` before and after (5), medians recorded here.
- Keyboard: the step list is reachable, and Space or Page Down advances
  exactly one step inside a stage.
- Reduced motion: no snapping, no boot memory needed, and the page still
  reads in order.

## Results

- **§2 Hero:** line (a) with *Start a project* (amber fill, `/contact`) and
  *See the work* (outline, `/work`). Checked at 1440×900 and 390×844.
- **§5 Moon:** `SCALE_BY_MORPH` ends at keyframe 2 (the clamp holds it),
  `ambientOffsetAt` returns one corner, and rotation stops at
  `AMBIENT_START`. `pnpm run profile --cpu 4 --runs 5`, production build,
  medians:

  | Route | Before | After |
  |---|---|---|
  | `/` | 58.8 fps, >33ms 0.5% | 59.9 fps, >33ms 0.1% (within noise) |
  | `/work` | 54.5 fps, >33ms 3.2% | 60.0 fps, >33ms 0.0% |

- **§6 Boot once:** `localStorage['bm-boot-seen']` is set on exit. A
  `beforeInteractive` script sets `<html data-boot-seen>`, CSS hides the
  overlay before paint, and `useSyncExternalStore` unmounts it after
  hydration (server snapshot "not seen", so no mismatch). The first attempt
  left the overlay mounted but hidden, and the scroll check's second route
  in one browser waited forever for it to detach. Unmounting is the honest
  fix, not loosening the check.
- **§7 Picks:** Apuração 2026, UniMeet (live capture
  `public/projects/unimeet/live.png`, 10 October 2026), ART'hur.
- **Scroll check, all 25 routes × 6 configurations:** 146 of 150 pass. The
  failures were `/instagram-plan` at 320px (both motion settings, a known
  failure before this task) and `/work` at 390×844, which failed once in the
  long run and passed 3 of 3 runs on its own (intermittent, not this change).
