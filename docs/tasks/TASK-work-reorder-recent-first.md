# TASK: Show `/work` case studies most-recent-first

## Current scenario

`src/lib/studio-data.ts`'s `STUDIO_PROJECTS` array is in chronological order:
Markado, Bee Dash, Sua Mesa Fit, Prumo, ART'hur, Flora. Every consumer of the
array (`src/app/work/page.tsx`'s `ScrollMorphStage` layers, `WorkIndex`'s
listing, each `WorkCase`'s `next` handoff, and `/work/[slug]`'s
`nextProject` cyclic chain) derives its display order and sequencing
entirely from array order, not from each project's own `index` field
("01"–"06", a catalog number tied to the project — see CLAUDE.md: "the
projects keep the numbers they carry in the listing rather than being
renumbered ... by their position").

## Planned changes

### `src/lib/studio-data.ts`

Reorder the `STUDIO_PROJECTS` array to: Flora, ART'hur, Prumo, Markado, Bee
Dash, Sua Mesa Fit — most recently added first. Each project object moves
as-is; no field inside any project changes, in particular **not** `index`
("01"–"06" stays tied to the project it was assigned to, not to its new
position). This is a data reorder only — every consumer already derives its
order/sequencing from array position, so nothing else needs to change:

- `/work`'s listing and case-study layers, and each case's "next" handoff,
  follow the new order automatically.
- `/work/[slug]`'s next-project chain (`(projectIndex + 1) % length`) follows
  the new order and still wraps correctly (Sua Mesa Fit → Flora).
- The listing's number column will no longer read 01→06 top to bottom
  (it'll read 06, 05, 04, 01, 02, 03) — expected once catalog numbers are
  decoupled from position, and exactly the case CLAUDE.md's "keep the number
  they carry" rule anticipates.

### Not changed

- `src/components/homepage/selected-work.tsx`'s `PROJECTS` — a separate,
  hand-curated "still in production" set (Prumo/ART'hur/Flora only), not
  derived from `STUDIO_PROJECTS`. Not in scope of this request.

## Why

User request: show the most recent work first on `/work`.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/lib/studio-data.ts` | edit | reorder `STUDIO_PROJECTS`, no field changes |
