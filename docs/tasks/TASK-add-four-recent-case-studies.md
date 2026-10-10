# TASK: Add four recent projects to /work, and tidy their repositories

## 1. Current scenario

`STUDIO_PROJECTS` in `src/lib/studio-data.ts` holds twelve case studies (catalog numbers
01–12, array order most-recent-first, see `TASK-work-reorder-recent-first.md`). Four
projects built since the last addition are not on `/work`:

| Repo | What it is | Public state |
|---|---|---|
| `apuracao-2026` | Live vote-count dashboard for Brazil's 2026 elections on the TSE's signed results feed: AWS recorder, projector, static Next.js site, map, 1994–2022 archive | public repo, live on S3 |
| `dove-language` | Dove Lesson Studio: lesson editor that outputs branded slides and A4 handouts as PDFs, plus the Airmail design system, for a free Discord language community | public repo, live on Vercel |
| `mariana` (anairam) | Photo site for a photographer friend, made as a gift ("a diary kept with the flash on") | repo made private 2026-10-10; she has not agreed to the site being public |
| `model-portfolio` | Portfolio for a fashion model, built on a studied talent-agency profile anatomy | private repo; she has not said yes yet |

Separately, six repos pushed in the last two months had no GitHub description or topics:
the four above plus `outubro` and `unimeet` (both already on `/work`). `mariana` had no
README at all; the others had working, dev-facing READMEs.

## 2. Planned changes

### Repositories (outside this repo)

- `gh repo edit` description, topics and homepage for all six.
- Rewrite each README into the same public-facing shape: what it is and for whom, live
  link/status, highlights, stack, architecture in brief, getting started, docs map.
  Existing dev content (commands, deployment notes, client feedback log) is kept,
  reorganised under headings, not dropped.
- `mariana` README stays in the (now private) repo and names the project as it does
  internally.

### `/work`

- Four `STUDIO_PROJECTS` entries at the top of the array, catalog numbers 13–16 by date
  started: `dove-language` 13, `mariana` 14, `apuracao-2026` 15, `model-portfolio` 16.
- **Anonymised** (user's decision, 2026-10-10) for the two people who have not consented:
  no names, handles, initials or photographs of them anywhere in copy, alt text or
  screenshots; titles are the design direction, not the person ("Direct Flash",
  "Comp Card"). Screenshots are captured from the local dev servers with every photograph
  replaced by a flat tone and the name replaced, and the alt text says so. No live or
  source links.
- Four new `ProjectVisualVariant`s with schematics in `project-visual.tsx`, in the same
  two-panel checklist pattern as the others: `election`, `lesson`, `flash`, `compcard`.
- Screenshots in `public/projects/<slug>/` at 1440 × 900, captured with Playwright.

Rejected: reusing `portfolio` (ART'hur's variant) for the two photo sites — every case
study's schematic is specific to what that project does.

Not touched: `homepage/selected-work.tsx` (its own hand-curated three, driving the
3 → 1 morph handoff). Work counts are derived from `STUDIO_PROJECTS`.

## 3. Why

The four are real work with documented process and, for two of them, live public
products. Repos without a description or README read as abandoned to anyone arriving
from the portfolio. Consent overrides presentation: the two personal sites show the
craft without exposing people who haven't agreed to be shown.

Found during the audit and reported, not changed: `anairam.vercel.app` and
`biapimentel.vercel.app` both answer 200 without Vercel Authentication (noindex), while
both projects' docs say they are not publicly deployed.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `docs/tasks/TASK-add-four-recent-case-studies.md` | new | this document |
| `public/projects/{apuracao-2026,dove-language,direct-flash,comp-card}/*.png` | new | screenshots |
| `src/lib/studio-data.ts` | edit | four variants in the type, four entries |
| `src/components/project-visual.tsx` | edit | four schematic blocks |
| `src/app/work/[slug]/page.tsx` | edit | the destinations list renders only when a project has links |
| `README.md` | edit | Work section lists sixteen projects |

## 5. Outcome (2026-10-10)

- Repos: all six got a description, topics and a rewritten README. `mariana` was made
  private (user's decision); its 33 reference photos stay in its git history.
- Added during the task at the user's request: a "Powered by Blessed Moon Studio" footer
  credit on `apuracao-2026` (needs a manual `deploy-web.ts` run), `dove-language` and
  `outubro` (both deploy from `main`), each with its own task doc in that repo.
- Anonymised screenshots were captured with every raster request aborted, the name and
  handle replaced in text nodes and the wordmark/monogram hidden; a leak check over the
  rendered text ran on each capture.
