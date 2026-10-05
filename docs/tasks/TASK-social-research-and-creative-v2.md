# TASK: deeper content research and stronger social creative

4 October 2026; updated 5 October. Status: implementation complete, final browser verification in progress.

## 1. Current scenario

Benito finds the new posts too empty, basic and commercially weak, and the content
suggestions less useful than Unimeet's. The existing audit contains only 12 LinkedIn
samples; no inspected Instagram feed corpus. `storyPost` turns outlines into mostly
empty title cards. The actual Unimeet snapshot contains 347 records and 347 saved
cover images from ten accounts, with recovered grid alt text in 342 records—not
400 complete captions or complete carousel sequences. It was collected through
Benito's logged-in browser and imported from downloaded JSON.

## 2. Planned changes

- Build an agency-specific collection shortlist with competitors, adjacent offers,
  same-buyer educators and peer references labelled separately. Aim for roughly
  360 distinct records across ten accounts (Benito excluded LayerUp/Sebrae on 5 October), preserving actual counts and provenance.
- Adapt Unimeet's browser collection/import workflow for this repository; keep raw
  competitor media/text gitignored and out of the public site. Do not access browser
  cookies, read authentication stores, fabricate samples, bypass access refusals or
  treat recovered alt text as verified full captions. Authenticated collection needs
  Benito's browser session/export input; progress on public sources meanwhile.
- Audit hooks, topics, visible formats, proof, visual hierarchy, CTAs and buyer fit.
  Preserve dates/source limits. Do not infer conversion or engagement from appearance.
  Map original ideas to observed patterns and actual Blessed Moon project evidence.
- Replace title cards with developed sequences: concrete hook, useful explanation,
  comparison/workflow, project proof or worked example, and one appropriate action.
  Broaden the suggestions beyond repeated Oishi/F&A examples once the audit supports it.
- Extend shared preview/export artwork with varied branded surfaces, comparison,
  workflow, checklist, screenshot evidence and closing-action compositions. Keep
  builder editing/JSON compatible and preview/export parity. Approved existing
  portfolio screenshots may illustrate documented work; still label publishing review.
- Preserve solo Benito identity, public service scope, unlinked/noindex working pages,
  local drafts, import validation and recorder exclusion. No push/deployment/outreach.
- Document audit/corpus coverage, original content decisions and concrete limitations;
  add specimens and verify mobile layouts, actual exports and relevant browser checks.

The repository asks for frontend-design; its skill is not installed in the searched
skill roots/plugin cache. Continue with the existing shadcn controls, terminal tokens
and brand handoff. Installed Next client-boundary docs read before implementation.

## 3. Why

Functional previews are not finished campaign creative. Stronger suggestions need
a much broader, auditable observation base, relevant buyer questions and original
application—not copied captions, more decorative filler or invented results.

## 4. Affected files

| File | Change | Purpose |
|---|---|---|
| `scripts/social-research/*`, `.gitignore` | new/edit | Collection/import and private research corpus |
| `docs/social/*`, `src/lib/social-research.ts` | new/edit | Auditable observations and coverage |
| `src/lib/social-art.ts`, creative presets | edit/new | Developed copy and richer shared artwork |
| `src/lib/social-export.ts`, builder/preview components | edit | Compatible local editing and exports |
| Planning pages, `/system`, docs and checks | edit | Reviewable strategy and specimens |

## Implemented result

Benito completed both exports for the ten selected accounts. Actual corpus:
356 distinct records and covers, 59 observed full captions, 85 inner-media
positions and 84 saved images. Baunfire returned 32 rather than the 36 target;
other accounts returned 36. Deep/grid records merge by shortcode. Grid refreshes
preserve deep captions even for zero-frame videos, observed dates and known formats.
Raw exports/CDN links/media stay gitignored; coverage, audit manifest and the
356-row source index can be committed. Importer hashes invalidate stale audits.

All ten cover contact sheets, all captured captions and all saved inner images
were reviewed. Nine visible carousel sequences reached a no-next-control stop;
this is not a guarantee of completeness. Videos and performance remain unavailable.
The current account audit is `docs/social/11-instagram-corpus-audit.md` and
`src/lib/instagram-research.ts`. Twenty examples, role-specific lessons and actual
coverage are on `/social-plan`; briefs link patterns separately from project facts.
LayerUp and Sebrae profiles are excluded; ten supporting LinkedIn posts remain.

Developed original copy now fills every carousel slide. Six compositions cover
question, comparison, checklist, workflow, real screenshot/worked example and
closing action. Three artwork surfaces vary the series without changing the dark
website theme. Evidence now includes Markado and Flora, besides Oishi/F&A. Closing
actions match real case/service/contact destinations. Preview/export share one
SVG renderer. Builder surface/template/portfolio controls fit narrow screens;
known portfolio screenshots embed into PNG/ZIP/PDF and portable JSON exports.
Imported drafts retain schema/field/image limits and reject external image URLs.

Solo identity, public custom quote, proposed scope/fees, noindex/unlinked working
routes, blank real-data worksheet and `rr-block` exclusion remain. No publishing,
AI API, cloud persistence, deployment or Unimeet edits were introduced. Collection,
review, workspace and future-agent documentation reflect the completed sample.

## Verification

Production build/TypeScript and lint passed (zero errors; two existing boot-hook
warnings). Collector DOM fixtures and temporary-directory importer checks passed.
Corpus ledger/source index reconcile to 356 posts, 59 captions and 84 saved images.
Builder PNG/ZIP/PDF/JSON, editing/import/export, real screenshot embedding, security,
320/390 mobile width and manual-data worksheet checks passed against the production
preview; the final extended run also exercises all six templates × four formats.
Final browser runs and scrolling audit are in progress; results will be recorded
before the local commit.

