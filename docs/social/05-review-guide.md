# Review guide: Blessed Moon strategy service

Updated 5 October 2026. Implementation applied and verified in
the repository. See the task document for the check details.

## Pages to review

- `/services/social-media`: public strategy service, fixed deliverables, direct
  work with Benito, custom quote, enquiry CTA and portfolio examples.
- `/social-plan`: audience hypotheses, five public offer references, 356 Instagram covers, 59 captured captions, ten selected account audits and ten
  supporting LinkedIn samples across five families, seven platform decisions, four
  content pillars, eight-week queue and proposed internal pricing.
- `/instagram-plan`: English grid and 12 briefs first, then the optional Portuguese
  account's grid and 8 briefs: authored slide sequences, captions, visual directions,
  evidence notes and campaign URLs (`ig-en-…` / `ig-pt-…`), with downloads/edit links.
- `/linkedin-plan`: the 14 English stories as text posts with the same carousel as a
  square PDF document, campaign URLs (`li-en-…`) and a series board.
- `/analytics-plan`: existing tooling, metric definitions, event dictionary,
  UTM convention, baseline checklist and 30/60/90-day reviews. An empty eight-week
  worksheet now plots real manual observations, with JSON save/restore and SVG export.
- `/post-builder`: editable researched presets or blank drafts; eight templates, three artwork surfaces,
  four formats, local screenshots, slide operations and PNG/ZIP/PDF/JSON downloads.
  See the [workspace guide](09-production-workspace.md) for the full workflow.
- `/about`: Benito's solo studio; A/B are strategy and engineering disciplines.
- `/`: service and pricing links, solo delivery copy and original eight build cards.
- `/contact?project=Social%20Media%20Strategy#project-enquiry`: preselected project
  type. Form opens a draft email when configured or copies a local brief otherwise.
- `/system`: specimens for the shared planning components and pricing model.

## What changed behind the pages

- Typed story content, campaign URL generation, reusable ordinary-flow plan shell,
  native expandable post briefs and a workload-based internal pricing calculator.
- Planning routes have noindex metadata, local navigation, and no public-menu or
  sitemap entries. They remain accessible by URL; no authentication was introduced.
- The service page is in the sitemap, homepage services/pricing and footer. Public
  copy uses custom quotes. Suggested R$3,900 strategy / R$1,800 monthly review prices
  stay in the working plan and research documents.
- Optional typed Umami events distinguish a service CTA, opening a mail draft,
  successful brief copying and following a booking link. Payloads use fixed enums
  and exclude the form's personal data. Tracker failure does not block the action.
- Homepage, About data/copy, boot facts and current documentation describe Benito
  alone. Former partner and co-founder claims were removed from current site copy.
  Historical case-study team facts and historical wireframe assets were retained.
- Reduced-motion layout now uses a server-compatible snapshot to avoid hydration
  recovery. Short-screen service spacing keeps all eight build cards visible.
- Existing tracker/recorder integration and settings were retained. Official email
  and booking variables were added to the example environment template.
- Research, task decisions and reproducible browser checks live in the repository.
- Each post brief links sampled content patterns separately from Blessed Moon's
  project evidence. English leads on Instagram and LinkedIn; a Portuguese Instagram
  account is optional (Benito, 5 October 2026). Instagram covers/captured material were reviewed; no Instagram competitor
  performance, account cadence or sales benchmarks are claimed.

## Decisions still to review

- Brazilian businesses first or a stronger international founder focus? The current
  audience split and language choice are explicitly proposed pilot assumptions.
- Approve or revise the proposed fees and workload; fixed public rates are not published.
- Confirm any ongoing content production/publishing before offering it. Full social
  management, community replies, filming and paid ads need separate scope.
- Provision `AGENCY_CONTACT_EMAIL` and/or `AGENCY_BOOKING_URL` to receive enquiries.
  Neither is configured in the local environment files inspected for this task.
- Verify real Umami ingestion, staff/preview exclusions and native social insights.
  Browser tests stub measurement and verify payloads, not a real analytics account.
- Approve screenshots and current project facts before publishing social drafts.

No deployment or push is included in this work.

The follow-up also added proposed pillar/workload graphs to `/social-plan`, shared
SVG artwork, browser-only exports and `/system` specimens. Preview and downloads use
the same art. Editable builder/worksheet content is marked `rr-block` for the existing
session recorder. Drafts/measurements are retained through downloaded JSON, not a
server database. No live account metrics, AI generation API or video generator was added.

## Validation and local preview

The production build and TypeScript passed. Lint has zero errors and two existing
boot-animation dependency warnings. Final browser checks passed against the actual
repository, including enquiry payloads, brief copying failure/success, blocked tracker,
metadata, content references and all eight pinned service cards at short phone sizes.
The review preview is `http://localhost:3194`, with optional analytics disabled for
the review build/process; environment files are unchanged. Screenshots are stored in
`/private/tmp/blessed-moon-review-2026-10-04/`. No mail was sent, booking made or live
account dashboard verified by these tests.

The future-agent prompt is [available here](08-agent-review-prompt.md). Implementation
was completed directly in this repository; another agent is not required to add it.

The preview/builder follow-up also passes production build/TypeScript, lint (the
same two existing warnings), its new export/editor/worksheet browser checks and
the complete strategy regression script. The pinned-panel check now samples the
actual layer centre rather than the navigation-offset handoff. Actual downloaded
files and artwork captures are in `/private/tmp/blessed-moon-post-review-2026-10-04/`;
the exported PDF also rendered successfully with macOS sips. The final local review
build disables the optional trackers at build and start without modifying env files.

## Latest research, creative and scrolling update

Read [the corpus audit](11-instagram-corpus-audit.md) for the real 356-post
archive, deep-review limits and how the findings changed the drafts. LayerUp and
Sebrae profiles are excluded. There are 20 linked Instagram examples, per-account
coverage, a coverage graph and source references in the briefs. Supporting LinkedIn
material remains separately labelled. There are no fabricated engagement figures.

Every carousel now has developed explanations, comparison/checklist/workflow
layouts, a worked example or real screenshot, and a closing action matching its
destination. The examples now also use Markado and Flora. The six art templates
and three surfaces are editable in the builder and share preview/export rendering.
Approved portfolio presets export as embedded images, including portable JSON.

The root document can grow so Lenis receives fresh dimensions. Shared stages
observe content, use ordinary flow when it exceeds the available viewport and
restore pinning when it fits. Long case galleries use document scrolling. Work
counts come from actual project data. System has a real page footer and contains
the full creative sequence/coverage specimens; its decorative glow cannot widen
the mobile page. Builder selections truncate within the available width.

The [scroll task](../tasks/TASK-page-scroll-reachability.md) and
[research/creative task](../tasks/TASK-social-research-and-creative-v2.md) record
verification. Local changes have not been pushed or deployed.

Final verification on 5 October passed against the production preview at port
3194: strategy regression, builder PNG/ZIP/PDF/JSON and all six templates × four
formats, collector fixtures, importer validation and all 120 scrolling
configurations (20 routes × three screen sizes × normal/reduced motion). The
scroll runs used WebGL and recorded zero uncaught page errors; dynamic Work growth,
expanded briefs and compact→flow→compact restoration passed. Build/TypeScript
passed; lint has zero errors and the same two existing boot-hook warnings.

Current browser artifacts are in `/tmp/blessed-moon-review/final-strategy`,
`final-builder`, and `verified-scroll/all-page-scroll.json`. A clean original
six-slide example is `/tmp/blessed-moon-review/clean-creative/six-slides.png`.
