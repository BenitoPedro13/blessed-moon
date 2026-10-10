# TASK: Take Direct Flash and Comp Card off the site

## Current scenario

`TASK-add-four-recent-case-studies.md` added two anonymised case studies of
personal sites whose subjects have not agreed to publication:

- **Direct Flash**, the `mariana` repo (anairam.vercel.app), index 14.
- **Comp Card**, the `model-portfolio` repo (biapimentel.vercel.app), index 16.

Both are in `STUDIO_PROJECTS`, so they appear on `/work` (index and case
layers), as `/work/[slug]` pages, in the sitemap, and in the project count.
Their screenshots are served from `public/projects/{direct-flash,comp-card}/`,
and `project-visual.tsx` has a diagram variant for each (`flash`, `compcard`).

Benito: "remove anairam project from blessed-moon and hide the model too."

## Planned changes

- `src/lib/studio-data.ts`: delete both project objects and the `flash` and
  `compcard` variants from `ProjectVisualVariant`. Every consumer (`/work`
  layers and index, `/work/[slug]` static params and next-project chain,
  sitemap, the "N systems" counts, `/analytics-plan/live` per-project rows)
  derives from the array, so 16 becomes 14 everywhere without further edits.
  The remaining projects keep their catalogue `index` numbers. The listing
  will skip 14 and 16, which is the existing "keep the number they carry"
  rule.
- `src/components/project-visual.tsx`: delete the two diagram branches, their
  data constants (`FLASH_GATES`, `BOOKER_PATH`) and the union members.
- `public/projects/direct-flash/`, `public/projects/comp-card/`: delete, so
  the screenshots stop being served at all. They were already anonymised and
  remain in git history. Restoring Comp Card later means reverting this
  change against `3850d6d`.
- `README.md`: drop the sentence about the two anonymised projects.
- `docs/tasks/TASK-work-index-grid.md`: the Brand & portfolio category is now
  ART'hur alone (1 project); counts updated.

**"Hide" vs. "remove":** both are taken off the site. A `published: false`
flag was considered for Comp Card and rejected. Its screenshots would still
be served from `public/`, and every consumer would need to filter on the
flag. Git history already keeps the work.

Not touched: the `mariana` and `model-portfolio` repos and their Vercel
deployments. Their Deployment Protection is still Benito's call.

## Why

The subjects have not agreed to publication, and Benito prefers the work not
to be public, even anonymised.

## Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/studio-data.ts` | edit | two projects and two variants removed |
| `src/components/project-visual.tsx` | edit | `flash` and `compcard` diagrams removed |
| `public/projects/direct-flash/*`, `public/projects/comp-card/*` | delete | screenshots |
| `README.md` | edit | status line |
| `docs/tasks/TASK-work-index-grid.md` | edit | category counts |
