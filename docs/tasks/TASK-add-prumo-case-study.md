# TASK: Add Prumo as a fourth /work case study

## 1. Current scenario

`/work` presents three selected client projects — Markado, Bee Dash, and Sua Mesa Fit — via
`STUDIO_PROJECTS` in `src/lib/studio-data.ts`. Each entry backs both the `/work` index row and its
own `/work/[slug]` case-study page, which additionally renders a hand-built ASCII schematic
(`ProjectVisual`, `src/components/project-visual.tsx`) keyed off a `visual` field currently typed
as `"calendar" | "analytics" | "commerce"` — one variant per existing project's domain.

Prumo is a fourth freelance/agency project, completed since the last `/work` update: a marketing
and MCMV (Minha Casa Minha Vida) pre-qualification site built for a Rio de Janeiro real-estate
broker, reselling Cury Construtora launches. It doesn't fit any existing `visual` variant — it has
no calendar, no analytics dashboard, no commerce cart. Real screenshots exist (captured from the
running dev app: home, catálogo, the pre-qualification flow, a shared proposal, sobre, contato)
and live in this session's scratch output, not yet copied into `public/projects/`.

## 2. Planned changes

- Copy the six captured Prumo screenshots into `public/projects/prumo/`.
- Add a fourth `ProjectVisualVariant`, `"realestate"`, to `src/lib/studio-data.ts`, and a matching
  hand-built schematic block to `src/components/project-visual.tsx` in the same terminal/mono
  style as the existing three: a property/unit reference on one side, an income-to-verdict
  qualification readout on the other (faixa, income line, pass/fail state) — visually distinct
  from `calendar`'s day grid, `analytics`'s bar chart, and `commerce`'s cart, and honest to what
  Prumo actually does (credit qualification before a unit is chosen), not a literal copy of its
  own plumb-rail UI.
- Add a `prumo` entry to `STUDIO_PROJECTS`, index `"04"`, using the `StudioProject` schema
  (tagline, description, problem/approach/outcome, stack, cover + screenshots, process,
  architecture, features, challenges, links). Content is adapted from the equivalent entry just
  added to the personal portfolio (`src/content/projects.ts` in the portfolio repo), narrowed to
  the agency's own concise voice, per the precedent in `TASK-finish-studio-subpages.md` ("Reusing
  verified portfolio facts avoids invented client claims while allowing the studio site to present
  the same work in its own concise voice").
- Link both the public GitHub source (`github.com/BenitoPedro13/prumo`, confirmed public) and the
  live Vercel preview (`prumo-drab-three.vercel.app`) in `links`, matching the pattern used for
  Sua Mesa Fit (`links: [{ live }, { source }]`).
- Fix the now-inaccurate hardcoded counts this addition breaks: `/work`'s `metadata.description`
  and `PageHero` description ("Three systems…"), `WorkIndex`'s `<h2>` ("Three systems, still
  running."), and the `00 / INDEX` code comment ("not one of the three" → "not one of the four",
  "renumbered 02–04" → "02–05"). `WorkCase`'s `position`/`total` pagination and
  `STUDIO_PROJECTS.map` are already index-driven and need no change.
- No new route, no navigation change, no new component beyond the one schematic variant — `/work`
  and `/work/[slug]` already iterate `STUDIO_PROJECTS` generically.
- **Explicitly not touching** `src/components/homepage/selected-work.tsx`. Its own `PROJECTS`
  list is a separate, hand-curated set of exactly three, driving the homepage's `count-3` →
  `count-1` morph token handoff — CLAUDE.md §0 calls the 8 → 4 → 3 → 1 descending count "the morph
  mechanism, not decoration." Adding a fourth row there would desync that literal "3" from the
  list it's counting.

Alternatives considered and rejected:

- Reusing the `"calendar"` variant (closest existing shape, since the pre-qualification flow is
  also a step-by-step form) was rejected: it would render Prumo's card with UI chrome — a day
  grid and time slots — that has nothing to do with what Prumo is, which the reader would notice
  immediately against real screenshots of the actual product sitting right next to it.

## 3. Why

Prumo is real, shipped agency work (a private Vercel preview, not yet a public launch, but a
working deployed product with its own database) and belongs in the same "selected work" set as
the other three client projects for the same reason they're there: it's verifiable, screenshot-
backed proof of delivery, not a claim. Adding a fourth schematic variant keeps every case study's
visual signature specific to what it does, which is the whole point of hand-building these instead
of using one generic placeholder.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `docs/tasks/TASK-add-prumo-case-study.md` | new | this document |
| `public/projects/prumo/*.png` | new | 6 screenshots captured from the running Prumo dev app |
| `src/lib/studio-data.ts` | edit | new `"realestate"` variant type + `prumo` entry in `STUDIO_PROJECTS` |
| `src/components/project-visual.tsx` | edit | new `realestate` schematic block |
| `src/app/work/page.tsx` | edit | metadata description, `PageHero` description, and index-comment count fixed from three to four |
| `src/components/work/work-index.tsx` | edit | `<h2>` count fixed from three to four |
| `README.md` | edit | Work section mentions all four projects, not three |
