# TASK: Expand the homepage's morph restructuring to the subpages

## 1. Current scenario

The homepage body was rebuilt as **one persistent terminal window** that resizes between
sections while its views crossfade inside it, with a single amber token physically traveling
between neighbours (`8 → 4 → 3 → 1`). Three commits landed it:
`TASK-homepage-morph-redesign.md` (the stage), `TASK-section-chrome.md` (the window + cool
surfaces + cell-grid ground), and the reflow fix.

The four other routes never received any of it. They are still the pre-restructure site:

| Route | Structure today | Chrome today |
|---|---|---|
| `/work` | `PageHero` pin, then three `<article>`s stacked in normal document flow, `Reveal`-driven, then `PageCta` | `border-border/60` + `bg-background/85` + `backdrop-blur-sm` per card |
| `/about` | `PageHero` pin, then three static `<section>`s (principle / pillars / dynamic), then `PageCta` | same old chrome, 7 occurrences |
| `/contact` | `PageHero` pin, then one two-column section (form + calendar + channel) | same old chrome, 5 occurrences |
| `/work/[slug]` | Long-form case study, ~390 lines of stacked sections | same old chrome, 15 occurrences |

Three concrete consequences:

1. **The window doesn't exist off the homepage.** `WINDOW_FRAME` / `TerminalPanel` /
   `CellGrid` are imported by exactly two places: `scroll-morph-stage.tsx` and `/system`.
   Every subpage surface still paints `bg-background/85` with a neutral `--border`, so the
   cool-surface decision from `TASK-section-chrome.md` stops at the homepage's last section.
2. **The pages read as a different site.** Home is one object morphing through five views;
   `/work` is a scroll-down list of cards. A visitor moving from `/` to `/work` loses the
   whole premise at the click.
3. **`Reveal` everywhere.** Subpages are `whileInView` mount animations — one-shot, forward
   only — while the homepage body is scroll-linked and plays in both directions.

## 2. Planned changes

### 2.0 Scope split — which pages get the stage, and which get only the chrome

Not every page should be pinned. The stage is a *narrative* device: it works when the page
is an argument delivered in beats. Two of the four routes are that; two are not.

| Route | Stage? | Why |
|---|---|---|
| `/work` | **yes** | An index of three systems is a sequence with a natural "select a row, it becomes the page" motion. |
| `/about` | **yes** | Already three argued beats (principle → structure → why it works). |
| `/contact` | **chrome only** | It is the site's single conversion action. Pinning a form behind a scroll journey adds friction to the one thing this page exists to make easy. A form should open, not unfold. |
| `/work/[slug]` | **chrome only** | Long-form reading. A 390-line case study inside an 86dvh window means the reader scrolls inside a box that is itself scroll-driven — two nested scroll contexts, which is precisely the confusion `TASK-homepage-unify-scroll.md` removed. |

Both "chrome only" pages still get §2.4, so they are visibly the same system — same window
frame, same cool surfaces, same cell-grid ground — just without the pin.

### 2.1 A token language, shared; a motif, per page

The homepage's descending count is *the homepage's* argument (breadth narrowing to one
commitment). Copying `8 → 4 → 3 → 1` onto `/work` and `/about` would be the templated
answer — same trick, no meaning. What gets shared is the **language** (an amber glyph at
display size means "this is the object in flight"); what is chosen per page is **what
travels and why**.

- `src/components/morph-tokens.ts` — **new**. Holds `TOKEN_INLINE` (the small, in-sentence
  end) and `TOKEN_DISPLAY` (the large, landed end, numeral-sized) lifted verbatim out of
  `morph-count.tsx`, plus `TOKEN_DISPLAY_WORD` — the same treatment at 2.25/3rem for tokens
  that are words rather than single glyphs, since a project name at 8rem does not fit a
  window and a numeral at 3rem is not the loudest thing on screen.
- `src/components/homepage/morph-count.tsx` — re-exports `COUNT_INLINE` / `COUNT_DISPLAY`
  from the shared file, keeping its homepage-specific documentation (the meaning of the
  descending count, the amber-means-in-flight rule) exactly where `CLAUDE.md` points at it.
  No homepage import changes.

### 2.2 `/work` — the row you pick becomes the page

Four layers in one `ScrollMorphStage`, between the existing `PageHero` and `PageCta` pins —
the same outer shape as the homepage (own pin, stage, own pin).

```
┌ 01 / INDEX ─────────────────┐    ┌ 02 / MARKADO ─────────────────────────┐
│ Three systems, still        │    │ MARKADO        [cover]                │
│ running.                    │ →  │ 2025 · full-stack · ongoing           │
│  01  Markado      2025  →   │    │ description, tags, shipped outcome     │
│  02  Bee Dash     2024      │    │ [View case study]      next → Bee Dash │
│  03  Sua Mesa Fit 2024      │    └───────────────────────────────────────┘
└─────────────────────────────┘
```

**Motif: the project name.** `Markado` is a row in the index list; crossing the boundary it
flies out of the list and lands as that layer's display heading. Each project layer then
carries the *next* project's name inline on a `next →` line, which hands it forward. Chain:
`Markado → Bee Dash → Sua Mesa Fit`, three tokens over three boundaries.

Why this and not the cover image (considered, rejected): an image token would have to hold
one aspect ratio at both ends or Motion's projection distorts it mid-flight, which
constrains the layouts on both sides for a morph that says less. The name is what a
directory listing actually emits, and "the row you selected becomes the page" is the
motion a terminal file browser already implies. Why not a numeral count: `/work` has no
count that descends or ascends meaningfully — the years are 2025, 2024, 2024, which is not
a chronology, and `01/02/03` is already the window title.

- `src/components/work/work-index.tsx` — **new**, layer 0. Headline + a monospace listing of
  all three systems, aligned as columns (index · name · year · one-line what-it-is). Row 1's
  name is `MorphToken side="from"`.
- `src/components/work/work-case.tsx` — **new**, layers 1–3, one component driven by
  `STUDIO_PROJECTS[i]`. Two columns at `lg`: cover left, meta right; stacked below. Carries
  the arriving token as its display heading and (except on the last) the departing token on
  its `next →` line.
- `src/app/work/page.tsx` — replaces the three stacked `<article>`s with the stage.

**Copy note (flagging per `CLAUDE.md` §0 "Fidelity"):** the per-project layer shows less
than today's card — the full `role / timeline / system` `<dl>` and the external links move
to `/work/[slug]`, which already carries them. The index page duplicates the case study
today; making it an index rather than a second copy is the point of having both. No copy is
rewritten, only relocated. The index layer's headline ("Three systems, still running.") is
new copy and is the one addition.

### 2.3 `/about` — two pillars, zero layers between

Four layers, same outer shape.

**Motif: `A → B → 0`.** The pillars are already `A` and `B` in the data. `A` is handed from
the principle layer into Pillar A's display letter; `B` from Pillar A into Pillar B; and
from Pillar B a `0` lands on the closing layer — *zero layers between you and the people
building it*, which is the existing "we eliminate layers of corporate bureaucracy" copy
made into the object the reader has been following. Letters resolving into a number, rather
than a number counting down: the same grammar as the homepage, saying something only this
page can say.

- `src/components/about/about-principle.tsx` — **new**, layer 0. "Technology that works with
  quiet excellence." + the six values chips (verbatim — `CLAUDE.md` §0 forbids rephrasing
  them) + the line handing off `A`.
- `src/components/about/about-pillar.tsx` — **new**, layers 1–2, driven by the existing
  `PILLARS` data (which moves to `src/lib/studio-data.ts` beside `STUDIO_PROJECTS`, since a
  page file is no longer the right home for it once two components read it).
- `src/components/about/about-dynamic.tsx` — **new**, layer 3. Display `0` + the
  bureaucracy paragraph.
- `src/app/about/page.tsx` — replaces its three `<section>`s with the stage.

### 2.4 The chrome pass — all four routes

Everything that is a surface becomes the window: `WINDOW_FRAME` instead of
`border-border/60 bg-background/85 backdrop-blur-sm`, and `TerminalPanel` wherever a surface
has a heading that can honestly be a title bar.

- `src/components/page-hero.tsx` — keeps its `ScrollStage` pin (it mirrors the homepage
  Hero, which also kept its own). Gains `CellGrid` as its ground and drops the amber
  48px square-grid overlay, which is the graph-paper pattern `cell-grid.tsx` was written to
  replace — two grounds, one of them wallpaper. Surfaces move to panel tokens.
- `src/components/page-cta.tsx` — panel tokens; keeps the amber edge rules (a control, so
  amber is correct there).
- `src/app/contact/page.tsx` — form panel and calendar/channel panels become
  `TerminalPanel`s (`project_enquiry.form`, `scheduling`, `agency channel` are already
  title-bar labels in everything but name). The amber 32px square grid inside the calendar
  card goes, same reason as the hero's. `CellGrid` behind the section.
- `src/components/contact-form.tsx` — panel tokens on its inputs' surfaces.
- `src/app/work/[slug]/page.tsx` — panel tokens across its 15 old-chrome surfaces; section
  headings become title bars where the section is already a panel.

### 2.5 Keyframes and anchors

The moon's morph table is 0–5 and both staged pages fit it exactly as the homepage does:
hero `0`, stage layers `1, 2, 3, 4`, CTA `5`. `ScrollMorphStage` emits these as zero-size
markers in its tall wrapper (`CLAUDE.md` §0) — the `data-ascii-keyframe` attributes come off
the sections. `/work`'s per-project anchors (`#markado`, `#bee-dash`, `#sua-mesa-fit`) move
to the stage's `id` markers so deep links still land on the right layer.

### 2.6 What is *not* changing

- `Reveal` stays in use on the two chrome-only pages and inside `PageHero`/`PageCta`. It is
  only forbidden *inside a morph layer* (`scroll-morph-stage.tsx` rule 2), not banned.
- No new colour. Amber stays the only warm hue and keeps its two jobs separated: on a
  control it means interactive, at display size on a token it means in flight.
- `heightPerLayer` stays at the homepage's `1.6`.

## 3. Why

**What it unblocks.** The homepage currently makes a promise the rest of the site doesn't
keep. The restructuring was not a homepage treatment — it was a decision about what this
site *is* (one terminal, one object, morphing), and a site where that holds for one route
out of four reads as an unfinished redesign rather than a point of view.

**What it costs.**

- Two staged pages mount all their layers at once inside a sticky frame. `/work` mounts
  three project covers simultaneously where today they mount as you scroll past. They are
  already all in the DOM today — the change is that all three are composited at once. Mitigated
  the same way the homepage is: `visibility: hidden` below 1% opacity takes an idle layer
  out of rendering entirely.
- Per-project detail on `/work` is trimmed in favour of `/work/[slug]` (§2.2). This is a
  real content decision, not a side effect, and is flagged rather than silent.
- `/work` and `/about` get taller: 4 layers × 1.6 = 640dvh of scroll each between hero and
  CTA. That is the deliberate cost of the pin — the homepage pays 800dvh.
- Two motifs to maintain. Both sides of every handoff must stay in sync (`CLAUDE.md` §0):
  editing a project's name in `studio-data.ts` now moves a token on two layers.

**Why not the alternative** of putting the stage on all four routes: §2.0. Pinning the
contact form behind a scroll journey would make the site's one conversion action the hardest
thing on it, and nesting a long case study inside a scroll-driven window re-creates the
two-scroll-context confusion that was already removed once.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/morph-tokens.ts` | new | Shared token type: `TOKEN_INLINE`, `TOKEN_DISPLAY`, `TOKEN_DISPLAY_WORD` |
| `src/components/homepage/morph-count.tsx` | edit | Re-exports from the shared file; keeps its homepage documentation |
| `src/components/work/work-index.tsx` | new | `/work` layer 0 — the listing; hands off the first project name |
| `src/components/work/work-case.tsx` | new | `/work` layers 1–3 — one project each, token in and (except last) out |
| `src/app/work/page.tsx` | edit | Three stacked articles → `ScrollMorphStage`; anchors move to markers |
| `src/components/about/about-principle.tsx` | new | `/about` layer 0 — principle + values chips; hands off `A` |
| `src/components/about/about-pillar.tsx` | new | `/about` layers 1–2 — driven by `PILLARS` |
| `src/components/about/about-dynamic.tsx` | new | `/about` layer 3 — display `0`, the closing argument |
| `src/app/about/page.tsx` | edit | Three sections → `ScrollMorphStage` |
| `src/lib/studio-data.ts` | edit | `PILLARS` and `VALUES` move here from the About page file |
| `src/components/page-hero.tsx` | edit | Panel tokens; `CellGrid` ground replaces the amber square grid |
| `src/components/page-cta.tsx` | edit | Panel tokens; keeps its amber edges |
| `src/app/contact/page.tsx` | edit | Chrome only — panels → `TerminalPanel`, `CellGrid` ground |
| `src/components/contact-form.tsx` | edit | Panel tokens on input surfaces |
| `src/app/work/[slug]/page.tsx` | edit | Chrome only — 15 surfaces to panel tokens |
| `src/app/system/page.tsx` | edit | Panels for the new shared pieces (`CLAUDE.md` §3.1) |
| `CLAUDE.md` | edit | §0 layout + the "must not break" entry: motifs are per-page, and why `/contact` has no stage |
| `README.md` | edit | Status section |

## 5. Verification

- `pnpm build` and `pnpm lint` clean.
- Every layer legible at 390px, 768px, and 1440px — the window's width morph is invisible
  below the point where all layer widths clamp to `avail`, which is correct, not broken.
- `prefers-reduced-motion`: both staged pages fall back to the stacked static-panel branch,
  every section reachable, tokens rendering as plain text.
- Deep links: `/work#bee-dash` lands on that layer.
- Keyboard: only the active layer in the tab order; visible focus on every control.
