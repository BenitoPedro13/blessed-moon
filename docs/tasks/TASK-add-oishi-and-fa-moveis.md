# TASK: Add Oishi and F&A Móveis as case studies

## Current scenario

`STUDIO_PROJECTS` in `src/lib/studio-data.ts` holds 7 case studies (Trísion,
Flora, ART'hur, Prumo, Markado, Bee Dash, Sua Mesa Fit), most-recently-added
first per `TASK-work-reorder-recent-first.md`. Two more real client projects
— **Oishi Cozinha Japonesa** (a rodízio restaurant site,
`github.com/BenitoPedro13/oishi`, live at `oishicozinha.vercel.app`) and
**F&A Móveis** (a furniture catalogue, `github.com/BenitoPedro13/fa-moveis`,
live at `fa-moveis.vercel.app`) — aren't represented anywhere on this site
yet. Facts below are drawn directly from each project's own `README.md` /
`CLAUDE.md` and from screenshots taken against both live URLs just now (not
invented — matches this repo's own standard).

Separately, `src/components/homepage/selected-work.tsx`'s hand-curated
`PROJECTS` (Prumo, ART'hur, Flora — feeding the homepage's "3 still in
production" copy and its `count-3`/`count-1` token handoff) is being changed
per explicit user direction: swap Prumo out for Oishi, reorder to Flora,
ART'hur, Oishi. Confirmed live before this swap — Oishi is genuinely
deployed, so "3 still in production" stays true.

## Planned changes

### 1. `src/lib/studio-data.ts` — two new case studies

- Extend `ProjectVisualVariant` with two new tags: `"furniture"` and
  `"rodizio"` (existing seven are 1:1 with existing projects — see §2).
- Prepend two new `StudioProject` entries at the top of `STUDIO_PROJECTS`
  (most-recent-first convention): F&A Móveis first (index `"09"`, its last
  commit is the more recent of the two), then Oishi (index `"08"`), both
  ahead of Trísion (`"07"`). Full prose fields (`description`, `problem`,
  `approach`, `outcome`, `process`, `architecture`, `features`,
  `challenges`) written to match the voice and specificity of the existing
  seven — real numbers only (13 products / 10 priced, Lighthouse 93/100,
  the R$ 74,90 → R$ 54,90 anti-waste price, the 44-photo luminance survey),
  never a plausible-sounding fabricated detail.
- `screenshots`/`cover` point at new files under `public/projects/fa-moveis/`
  and `public/projects/oishi/` (§3).

### 2. `src/components/project-visual.tsx` — two new bespoke panels

Per the project's own convention (`docs/tasks/...` precedent + CLAUDE.md:
each variant is a hand-built panel carrying that project's real facts, not a
generic template), add:

- `"furniture"` — F&A Móveis: the real cm measurement rule and the one
  `wa.me` builder, e.g. a measurement readout plus a `Consulte o preço` vs
  confirmed-price state.
- `"rodizio"` — Oishi: the two-price component (`R$ 74,90` struck, `R$ 54,90`
  live, `sem desperdício`) and the three-exit row (delivery / reserva /
  WhatsApp).

Both extend the existing `variant` union in `ProjectVisualProps` to match.

### 3. Screenshots

Captured live from each deployed site (no local dev server needed — both are
already on Vercel) at 1456×840 and saved to:

- `public/projects/fa-moveis/{home,produtos,produto}.png`
- `public/projects/oishi/{home,cardapio,reserva,rodizio-com-sashimi,contato}.png`

### 4. `src/components/homepage/selected-work.tsx`

Replace the `PROJECTS` array's Prumo entry with Oishi, and reorder to Flora,
ART'hur, Oishi (explicit user direction). Prumo is not removed from the
site — it stays in `STUDIO_PROJECTS`/`/work`, only its homepage teaser slot
changes. Oishi's entry uses a screenshot from `public/projects/oishi/`
(reusing one of the images added in §3, e.g. `home.png`) rather than a new
asset — `SelectedWork`'s image convention is a single square-ish product
shot per row, matching the other two entries' sizing.

## Why

Direct user request to add both projects to the studio site. The homepage
swap (Prumo → Oishi) and its ordering were explicit user direction, given
after flagging that Oishi's deployment status needed checking before it could
honestly sit in the "3 still in production" slot — resolved once both live
URLs were confirmed reachable.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/lib/studio-data.ts` | edit | 2 new `StudioProject` entries, 2 new `ProjectVisualVariant` tags |
| `src/components/project-visual.tsx` | edit | 2 new bespoke panels (`furniture`, `rodizio`) |
| `src/components/homepage/selected-work.tsx` | edit | `PROJECTS`: Prumo → Oishi, reorder to Flora/ART'hur/Oishi |
| `public/projects/fa-moveis/*.png` | new | 3 screenshots from the live site |
| `public/projects/oishi/*.png` | new | 5 screenshots from the live site |
