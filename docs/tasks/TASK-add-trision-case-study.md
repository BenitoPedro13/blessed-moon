# TASK: Add Trísion as a seventh /work case study

## 1. Current scenario

`/work` presents six client projects — Flora (06), ART'hur (05), Prumo (04), Sua Mesa Fit (03),
Bee Dash (02), and Markado (01) — via `STUDIO_PROJECTS` in `src/lib/studio-data.ts`. Each entry
backs both the `/work` index row and its own `/work/[slug]` case-study page, which additionally
renders a hand-built ASCII schematic (`ProjectVisual`, `src/components/project-visual.tsx`) keyed
off a `visual` field currently typed as
`"calendar" | "analytics" | "commerce" | "realestate" | "portfolio" | "geospatial"` — one variant
per existing project's domain.

Trísion is a seventh freelance/agency project, currently in active development (not yet a
finished client engagement): a brand site and multi-tenant reseller-storefront platform for a
Brazilian eyewear label (Trísion Eyewear, founded 2002). Its Fase 0 scope — brand site, mock
catalogue, a Fase-0 storefront path stand-in at `/loja/[rev]` — is live at
`trision.vercel.app`, with a public GitHub repo. It doesn't fit any existing `visual` variant: no
calendar, no analytics dashboard, no commerce cart, no real-estate qualification flow, no motion
archive, no satellite imagery — it's a numeração-and-tenancy problem (a real mm measurement per
frame, a reseller endorsement model with no theming fields). Real screenshots were captured live
from `https://trision.vercel.app` in this session (home, catálogo, coleções, revendedores, a
product detail page showing the honest "sem foto" empty state, and the `/loja/[rev]` storefront
stand-in) and copied into `public/projects/trision/`.

Two counts in this repo are already stale from before this task — `/work`'s `PageHero`
description ("Four systems…"), its `metadata.description` (lists four project domains), the
`00 / INDEX` code comment ("not one of the four… renumbered 02–05"), `WorkIndex`'s `<h2>` ("Four
systems, still running."), and `README.md`'s work-section sentence (lists five projects, omitting
Flora, which was added after that sentence was last touched) — none of them were updated when
Flora and ART'hur were added. This task fixes all of them to the real count (seven) while adding
Trísion, rather than compounding the drift with an eighth stale reference.

## 2. Planned changes

- Add a fifth `ProjectVisualVariant`, `"eyewear"`, to `src/lib/studio-data.ts`, and a matching
  hand-built schematic block to `src/components/project-visual.tsx` in the same terminal/mono
  style as the existing five: a left panel reading a single frame's real numeração
  (`52 □ 18-145`) and its honest "no photo" status, a right panel reading the tenancy/reseller
  side (catalogue seam status, reseller count, one `wa.me` builder) — visually distinct from the
  other five, and honest to what Trísion actually is (a shared catalogue with per-reseller
  storefronts), not a literal screenshot recreation.
- Add a `trision` entry to `STUDIO_PROJECTS`, index `"07"`, using the `StudioProject` schema
  (tagline, description, problem/approach/outcome, stack, cover + screenshots, process,
  architecture, features, challenges, links). Content is adapted from the equivalent entry just
  added to the personal portfolio (`src/content/projects.ts` in the portfolio repo), narrowed to
  the agency's own concise voice, per the same precedent `TASK-add-prumo-case-study.md` used.
  Stack lists only what's actually built in Fase 0 (Next.js, TypeScript, Tailwind CSS v4,
  Zustand) — Payload CMS and PostgreSQL are explicitly Fase 1, not yet started, and are not
  listed as current stack (this repo's own CLAUDE.md §0 rule: never invent a fact, including by
  overstating what's shipped).
- Link the public GitHub source (`github.com/BenitoPedro13/trision`, confirmed via `git remote
  -v` in that repo) and the live Vercel deployment (`trision.vercel.app`) in `links`, matching
  the Sua Mesa Fit / Prumo pattern (`links: [{ live }, { source }]`).
- Fix the stale hardcoded counts described above: `/work`'s `metadata.description` and
  `PageHero` description ("Four systems…" → seven, project domains list refreshed), `WorkIndex`'s
  `<h2>` ("Four systems, still running." → "Seven systems, still running."), the `00 / INDEX`
  code comment ("not one of the four" → "not one of the seven", "renumbered 02–05" →
  "02–07"), and `README.md`'s work-section sentence (add Flora, which was missing, and Trísion).
  `WorkCase`'s `position`/`total` pagination and `STUDIO_PROJECTS.map` are already index-driven
  and need no change.
- No new route, no navigation change, no new component beyond the one schematic variant — `/work`
  and `/work/[slug]` already iterate `STUDIO_PROJECTS` generically.
- **Explicitly not touching** `src/components/homepage/selected-work.tsx`. Its own `PROJECTS`
  list is a separate, hand-curated set of exactly three, driving the homepage's `count-3` →
  `count-1` morph token handoff — CLAUDE.md §0 calls the 8 → 4 → 3 → 1 descending count "the morph
  mechanism, not decoration." Adding a fourth row there would desync that literal "3" from the
  list it's counting — the same reasoning `TASK-add-prumo-case-study.md` already applied.

Alternatives considered and rejected:

- Reusing the `"realestate"` variant (closest existing shape, since both read a two-column
  unit/qualification-style layout) was rejected: it would render Trísion's card with copy about
  faixas and pré-qualificação that has nothing to do with what Trísion is, next to real
  screenshots of a very different product.
- Listing Payload CMS / PostgreSQL in `stack` because the source portfolio project's `spec-
  architecture.md` describes them as the Fase 1 target was rejected: they are not built yet in
  the actual repo (`trision`'s own CLAUDE.md: "No Payload, no database — deliberate"), and
  listing them here would misstate what's shipped.

## 3. Why

Trísion is real, active agency work (a paid client engagement, Fase 0 of a multi-phase build,
publicly deployed) and belongs in the same "selected work" set as the other six client projects
for the same reason they're there: it's verifiable, screenshot-backed proof of delivery, not a
claim. Adding a fifth schematic variant keeps every case study's visual signature specific to
what it does. Fixing the stale counts now, rather than leaving them for an eighth addition to
compound, keeps the page internally consistent the way CLAUDE.md §3 requires.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `docs/tasks/TASK-add-trision-case-study.md` | new | this document |
| `public/projects/trision/*.png` | new | 6 screenshots captured live from `trision.vercel.app` |
| `src/lib/studio-data.ts` | edit | new `"eyewear"` variant type + `trision` entry in `STUDIO_PROJECTS` |
| `src/components/project-visual.tsx` | edit | new `eyewear` schematic block |
| `src/app/work/page.tsx` | edit | metadata description, `PageHero` description, and index-comment count fixed from four to seven |
| `src/components/work/work-index.tsx` | edit | `<h2>` count fixed from four to seven |
| `README.md` | edit | Work section mentions all seven projects (Flora was already missing, now fixed too) |
