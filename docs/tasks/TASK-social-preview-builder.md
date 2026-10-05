# TASK: social previews, planning graphs and post builder

4 October 2026. Status: completed and verified. User requested previews and
graphs like Unimeet, plus a post generator if the work is reasonable.

## 1. Current scenario

Blessed Moon has researched working pages and 16 original stories with Instagram
and LinkedIn drafts. Briefs contain words and production instructions but no visual
post previews. Analytics is a measurement specification without connected data.
Unimeet has carousel previews, a profile grid, an editable template builder and
PNG/ZIP/PDF exports; its editor relies on Payload authentication and media records.
Blessed Moon has neither Payload nor a staff authentication system.

## 2. Planned changes

- Use shared browser-safe, branded slide artwork for previews and downloads: amber,
  dark terminal framing, pixel crescent, legible type and sharp corners. Create
  buyer-facing slide copy from each existing story; recording instructions remain
  briefs rather than being printed as finished slides.
- Add cover/profile grids and slide navigation to both channel pages, with caption,
  alt text, download actions and a direct link to edit that draft.
- Add `/post-builder`, unlinked globally and noindex. Start from the existing stories
  or a blank post; edit template, format, slides, text, caption and a local screenshot.
  Reorder/add/remove slides. Download the current PNG, a numbered ZIP with caption
  and alt text, or a LinkedIn PDF. Save/import an editable JSON draft.
- Keep generation in the browser, without server rendering endpoints, API keys,
  uploads stored remotely, paid AI calls or publication. Reuse Unimeet's small
  browser-safe JPEG-to-PDF helper. Add fflate through pnpm, loaded only for ZIP export.
- Add labelled planning graphs for proposed pillar shares and publishing rhythm.
  Add an empty weekly measurement chart with manual input and local JSON import /
  export. It remains a manual worksheet and never invents live results.
- Use existing shadcn controls and terminal panels. Repo references the unavailable
  frontend-design skill; searched installed skill roots and plugin cache, not found.
  Existing design components and tokens supply the design workflow; no new aesthetic
  is introduced. Read installed Next server/client and route docs before coding.
- Update `/system` specimens, docs, README and task status. Verify export content,
  dimensions, edit parity, slide operations, empty/filled graphs, imports, mobile
  layouts, lint/types/build and the existing service checks. Commit locally per
  repository convention. No deployment or push.

Alternatives: porting the entire Payload/video builder would add infrastructure
and scope. The browser-only template editor covers the requested practical workflow.
Planning pages and editor are not authenticated; personal draft content stays local
to the tab/downloaded files and is not added to custom analytics events.

## 3. Why

Make the researched plan reviewable visually and usable for production by Benito
alone. The same art must drive preview and export. Graphs should clarify planned
work and actual manually supplied observations without making up account metrics.

## 4. Affected files

| File | Change | Purpose |
|---|---|---|
| `src/lib/social-art.ts`, `social-export.ts`, `social-pdf.ts` | new | Presets, validation, shared art and local export |
| `src/components/social/{slide-art,post-preview,post-builder,plan-charts,measurement-chart}.tsx` | new | Previews, editor and visual planning/measurement |
| `src/app/post-builder/page.tsx` | new | Local post-production workspace |
| `src/components/social/post-card.tsx` | edit | Visible previews and edit links |
| `src/app/{instagram-plan,linkedin-plan,social-plan,analytics-plan}/page.tsx` | edit | Profile grids and graphs |
| `src/lib/social-plan.ts` | edit | Planning navigation to generator |
| `src/app/system/page.tsx` | edit | New shared component specimens |
| `package.json`, `pnpm-lock.yaml` | edit | ZIP export dependency |
| `docs/social/09-production-workspace.md`, current documentation | new/edit | Operation, limitations and review guide |
| `scripts/check-post-builder.mjs` | new | Behavioural/export verification |
| `scripts/check-social-strategy.mjs` | edit | Settle resized briefs and sample the actual pinned-layer centre |

## Verification

The production build and TypeScript pass. Lint has zero errors and the two existing
boot-sequence dependency warnings. Browser checks passed for previews, editing,
PNG/ZIP/PDF/JSON exports, screenshots, long-copy bounds, all four formats and the
empty/filled measurement worksheet; the existing strategy/contact/solo-identity
browser checks also pass. Final checks include long-footer wrapping and rejection
of array-shaped imported enums.

An intermittent existing regression check sampled the service handoff instead of
the fully active panel: native scrollIntoView applies global navigation scroll
padding. The script now scrolls to the exact marker position, waits for the service
layer to settle and retains its clipping assertion at 1440/390/320 pixels. It also
explicitly scrolls resized briefs into view and allows slower actionability checks.
The final complete strategy browser run passes. No homepage layout changed in this
follow-up. Both scripts pass ESLint. macOS sips successfully rendered the exported
PDF's first page, which was also visually inspected.

Final implementation adds Statement, Checklist and Project screenshot templates;
four art formats; up to ten slides; local picture resizing; captions/alt descriptions;
slide operations; full-size local downloads; editable JSON round trips; planning
graphs and a manual eight-week observations graph with SVG/JSON export. Shared
components have `/system` specimens, and the future-agent prompt/review guide now
include the implemented tools.

The site already has an optional Umami recorder, so the editor and worksheet roots
were marked `rr-block` to exclude rendered draft text and images from replay. The
rrweb guide documents this default class and official Umami recorder code does not
override it (links in the workspace guide). Browser checks verify the markup;
actual production recorder version/settings/ingestion remain untested. Optional
trackers are disabled through empty process values for the final review build and
start, without edits to env files. No generator content is added to custom events.

Representative exported artwork was visually inspected, including portrait,
landscape and embedded-screenshot output. Review artifacts and actual downloads:
`/private/tmp/blessed-moon-post-review-2026-10-04/`. Preview: port 3194. No Unimeet
files changed. No cloud persistence, account integration, paid AI calls, video
export, publishing, push or deployment. PDF helper reused from Unimeet; fflate 0.8.3
is the only new dependency. Local commit follows verification per CLAUDE.md.
