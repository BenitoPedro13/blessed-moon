# TASK: Add Transit Pulse as a /work case study

## 1. Current scenario

`/work` presents the studio's selected projects via `STUDIO_PROJECTS` in
`src/lib/studio-data.ts` (currently 16 entries, Markado `01` … Lunares `16`). Each entry backs
both the `/work` index cover card and its own `/work/[slug]` case page, which additionally renders
a hand-built terminal/mono schematic (`ProjectVisual`, `src/components/project-visual.tsx`) keyed
off a per-project `visual` field — one variant per project's domain. All work counts, filter
counts, the `next →` chain, the morph layer set, pagination and the sitemap are already derived
from `STUDIO_PROJECTS.length`/order (CLAUDE.md "Scroll reachability": *Work counts come from
`STUDIO_PROJECTS`*), so an added entry propagates to those automatically.

Transit Pulse is a newer personal engineering project, not yet on the site. It's a live
public-transport map for Greater Rio de Janeiro and, explicitly, a portfolio case study in
distributed, data-heavy real-time systems: one adapter per provider emitting a single canonical
event; an immutable raw log on S3; rebuildable database projections; and a static replay that
keeps working after the live backend is switched off. Verified facts (from the repo's `README.md`,
`docs/architecture.md` and task docs, checked 2026-11-03):

- **Stack:** one Go module with four binaries (`adapter-its`, `consumer`, `rebuild`, `api`),
  Redpanda (Kafka) as the event bus, TimescaleDB + PostGIS for storage, and a Next.js app
  (`apps/web`) drawing vehicles with MapLibre + deck.gl, plus a `/tabela` table alternative.
- **Honesty tiers:** every operator and line is shown as `live`, `scheduled` or `none` (no public
  data), and within `live`, "no vehicles", "fetch failed" and "stale > 5 min" are kept as distinct
  states, never collapsed to zero. The amber `letreiro` (a Rio bus's LED sign) states live/stale/
  failed plainly.
- **Verified source inventory (2026-10-12):** Rio's city buses (SPPO + "Sistema RIO") and BRT are
  live via three public SMTR paths; rail, metro, tram, ferries, intercity and Niterói buses have
  **no** public machine-readable data — drawn honestly as such, never invented.
- **Reliability facts worth citing:** the ITS adapter stores every response byte-for-byte before
  publishing (raw log is the record, the broker a 24 h buffer); the consumer is idempotent on
  `Identity()` and `apps/rebuild` reproduces the same tables from the raw log; the API serves a
  snapshot **from memory**, querying the DB at most once per new minute, never per request; two AVL
  suppliers reused the same vehicle id, resolved by making the supplier (`feed`) part of identity.
- **Features:** a live map, line/bus exploration with the view in the URL, colour-by-speed, a
  "time machine" (scrub the last hours; play at 1×/10×/60× with fading trails), and static GTFS
  route geometry + ordered stop lists for selected lines.
- **Deployment:** `apps/web` on Vercel; the **recorded demo** at `/replay` works without the live
  backend; production raw recordings are checksum-verified in S3. Source is public
  (`github.com/BenitoPedro13/transit-pulse`); demo at `transit-pulse-tau.vercel.app/replay`.

It fits no existing `visual` variant: `geospatial` is hard-coded to Flora's crop-stress domain
(field acreage, spectral-index checklist, "worker polling · request path idle"), not a transit map.

## 2. Planned changes

- Add a `transit-pulse` entry to `STUDIO_PROJECTS` as the **second** entry — directly after
  `lunares`, which stays the newest (Lunares is November 2026; Transit Pulse is late October 2026),
  and before `apuracao-2026`. Index `"17"` (the next stable catalogue id; index is an id, not a
  recency rank — the array order already encodes recency). `category: "data"`, using the full
  `StudioProject` schema
  (tagline, description, problem/approach/outcome, stack, cover + screenshots, 4 process steps,
  4 architecture layers, 3 features, 3 challenges, links). Voice matches the sibling data project
  Renewable Pulse: concise, first-person-free, and honest about "real-time" meaning a resilient
  pipeline over polled public sources. Every claim traces to the verified facts in §1 — no invented
  metrics, no claimed coverage the source inventory doesn't support.
- Add a new `ProjectVisualVariant`, `"transit"`, to `src/lib/studio-data.ts`, and a matching
  hand-built schematic block to `src/components/project-visual.tsx` in the existing terminal/mono
  style: an amber `letreiro`-style status readout (LIVE / STALE / line + vehicle id) on one side,
  and a coverage-tier panel (`live` / `scheduled` / `none` with the Rio operators) on the other —
  honest to what Transit Pulse actually does (truthful coverage, not a pretty map), and visually
  distinct from `geospatial`'s field/spectral panel sitting elsewhere in the same list.
- Capture real screenshots from the deployed **recorded demo** (`/replay`, and `/replay/tabela`)
  at 1440×900 and copy them into `public/projects/transit-pulse/` — cover (the live-trail map),
  the line/bus panel, the time machine, and the table view — matching every other entry's
  screenshot-backed evidence. (The `/` live map is not used for stills: with the live backend off
  it shows the honest "not live" state rather than moving vehicles.)
- Add a silent **video walkthrough** of the `/replay` demo (the `video` field, as Lunares has),
  encoded h264 at 1280×800 (16:10, the frame the case page renders), with a poster drawn from one
  of the stills and a factual caption. It tours the map, the line/bus panel, colour-by-speed, and
  the time machine playing with fading trails. Source recording is captured from the deployed demo
  (user asked for a video like Lunares, 2026-11-03).
- Extend `/work`'s `metadata.description` prose (`src/app/[locale]/work/page.tsx`) to include the
  transit domain (e.g. "… and a live public-transport map for Rio"). This is the one count/enum
  that is hand-written; the `{STUDIO_PROJECTS.length} systems` hero/index strings update themselves.
- `links`: the recorded demo (`transit-pulse-tau.vercel.app/replay`) and the public source
  (`github.com/BenitoPedro13/transit-pulse`), matching the `{ live/demo }, { source }` pattern.

Deliberately **not** changing:

- `src/components/homepage/selected-work.tsx` — its `PROJECTS` is a hand-curated set of exactly
  three (Apuração 2026, UniMeet, Lunares) driving the homepage `count-3 → count-1` morph handoff.
  CLAUDE.md §0 calls the descending count "the morph mechanism, not decoration"; a fourth row would
  desync the literal "3". (If Transit Pulse should be *featured* there, it replaces one row 1-for-1
  — a separate curation call, flagged as an open question below, not done silently.)
- No new route, navigation item or component beyond the one `transit` schematic variant — `/work`
  and `/work/[slug]` already iterate `STUDIO_PROJECTS` generically, and the sitemap follows.

Alternatives considered and rejected:

- **Reusing `visual: "geospatial"`** (both are maps): rejected — that block renders Flora's exact
  crop-stress chrome (acreage, spectral indices, "10 indices / 1 process call"), which would read
  as obviously wrong next to real Transit Pulse screenshots of a bus map.
- **Fronting the live map (`/`) as the cover:** rejected — the live backend is off, so `/` shows
  the truthful "not live" state. The `/replay` recorded demo is the representative, reliably
  renderable view and is what the repo itself links first.

## 3. Why

Transit Pulse is real, shipped engineering with a public repo and a working deployed demo, and it's
the strongest distributed-systems / real-time-data piece in the set — a natural companion to
Renewable Pulse under the `data` category. It belongs in "selected work" for the same reason the
others do: verifiable, screenshot-backed proof of delivery, not a claim. A dedicated `transit`
schematic keeps each case study's visual signature specific to what it does, which is the point of
hand-building these rather than using one generic placeholder. Its honesty-first design (truthful
coverage tiers; "real-time" meaning a resilient pipeline, not pushed data) is exactly the studio's
stated voice — *Clarity, Craft, Integrity* — so it reads as on-brand evidence, not filler.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `docs/tasks/TASK-add-transit-pulse-case-study.md` | new | this document |
| `public/projects/transit-pulse/*.png` | new | 1440×900 screenshots captured from the deployed `/replay` demo (map cover, line/bus panel, time machine, `/tabela`) |
| `public/projects/transit-pulse/walkthrough.mp4` | new | silent h264 1280×800 walkthrough of the `/replay` demo (matches the Lunares video pattern) |
| `src/lib/studio-data.ts` | edit | new `"transit"` variant in `ProjectVisualVariant`; `transit-pulse` entry (index `"17"`) at the top of `STUDIO_PROJECTS` |
| `src/components/project-visual.tsx` | edit | new `transit` schematic block (letreiro status + coverage tiers) |
| `src/app/[locale]/work/page.tsx` | edit | extend the hand-written `metadata.description` enumeration to include the transit map |
| `README.md` | edit (if needed) | only if its Work prose enumerates domains; the status/scope prose already references `/work` generically |
