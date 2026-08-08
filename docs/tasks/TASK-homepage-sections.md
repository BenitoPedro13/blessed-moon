# TASK: Build the homepage — static sections

**Status: done.** Built as planned below — `SiteNav`/`SiteFooter`/`SectionHeading` plus six
homepage section components, assembled in `src/app/page.tsx`. `pnpm lint` and `pnpm build`
both pass; verified via `curl` against the dev server that all section copy renders
(nav, hero headline, about teaser, all 8 services, all 4 steps, all 3 projects, all 3
pricing rows, footer). Could not do a visual browser check — the Chrome extension wasn't
connected.

## Current scenario

`src/app/page.tsx` is still the scaffold placeholder from `TASK-scaffold-nextjs.md`: a
centered headline + one paragraph, no nav, no real sections. No components exist yet
outside `src/components/ui/*` (shadcn primitives). The homepage design is fully specified
in `docs/design-handoff.md` § Screens → Homepage and wireframed in
`docs/design/wireframes.dc.html` (option `1c`) / `docs/design/screenshots/homepage-1c.png`,
but none of it is built. No WebGL/ASCII canvas layer exists yet — that's explicitly a
separate follow-up task (`CLAUDE.md` §0 "Next step").

## Planned changes

Build the homepage as static (no canvas/WebGL yet) sections, matching wireframe `1c`
section order and copy exactly (`CLAUDE.md` §0: wireframe copy/order is final). Plain
`#050505` background stands in for the ASCII canvas per the graceful-degradation
requirement — this is also what an actual no-WebGL fallback should look like, so it's not
throwaway work.

Component breakdown (new files under `src/components/`, composed into `src/app/page.tsx`):

- **`site-nav.tsx`** — fixed/sticky top bar. Brand mark `>|<` (text placeholder per handoff
  — real circuit-moon mark not built), nav links (Work, Services, Pricing, About, Contact),
  "Book a call" `Button`. Per the handoff's explicit instruction to swap the wireframe's
  dots+"MENU" indicator for a real nav once past wireframe stage. `Services`/`Pricing` are
  in-page anchors (`#services`, `#pricing`); `Work`/`About`/`Contact` are routes that don't
  exist yet — they 404 until their own tasks land (acceptable per incremental build, not a
  regression to fix here).
- **`site-footer.tsx`** — repeats nav links + `© 2026 Blessed Moon Studio`. Shared with
  future subpages.
- **`section-heading.tsx`** — small shared eyebrow component for the `NN / LABEL` pattern
  (`01 / ABOUT`, `02 / SERVICES`, …) used by 5 of the homepage sections — real reuse, not a
  premature abstraction, since the markup (mono, uppercase, tracked, muted) is identical
  every time and the label list drives future scroll-morph keyframes (`CLAUDE.md` §0).
- **`homepage/hero.tsx`** — full-bleed centered section, oversized amber headline "Clarity
  is the feature." (two lines per wireframe), four corner labels (B / S / M / 26, decorative
  per wireframe). No canvas background yet — plain background.
- **`homepage/about-teaser.tsx`** — `01 / ABOUT`, heading "Built to last longer than the
  brief.", one paragraph body copy (verbatim from handoff).
- **`homepage/services-grid.tsx`** — `02 / SERVICES`, 4×2 hairline grid, 8 service cards
  (index + name), verbatim list from handoff.
- **`homepage/how-we-work.tsx`** — `03 / HOW WE WORK`, 4-column row, number + one-liner per
  column, verbatim copy.
- **`homepage/selected-work.tsx`** — `04 / SELECTED WORK`, stacked rows (visual placeholder
  + title + description) for markado / Bee Dash / suamesafit, verbatim copy.
- **`homepage/pricing-table.tsx`** — `05 / PRICING`, 3 rows (Landing Page/Website, Web
  App/Dashboard, Full product build), each "range confirmed on call".
- **`src/app/page.tsx`** — assembles `SiteNav` + all homepage sections separated by
  hairline `<hr>` rules + `SiteFooter`, matching wireframe structure/order.

**shadcn usage**: `Button` (`src/components/ui/button.tsx`, already installed) for "Book a
call" CTAs. The services grid / work rows / pricing rows are a bespoke hairline-grid TUI
layout with no shadcn equivalent worth forcing (`shadcn/ui`'s `Card` bakes in padding/shadow
conventions that don't match and would need full override) — hand-written per `CLAUDE.md`
§2.2, consistent with the frontend-design skill guidance to use shadcn primitives where they
actually fit rather than everywhere indiscriminately.

**Not in scope** (follow-up tasks): the WebGL ASCII canvas layer and its scroll-driven
morph keyframes (`TASK-ascii-canvas-layer.md`, not yet written); `/work`, `/about`,
`/contact` routes.

## Why

`CLAUDE.md` §0 "Next step" calls this out directly: build the homepage per the wireframe,
static sections first, canvas layer once layout is right. Splitting sections into
`src/components/homepage/*` (vs. one large `page.tsx`) keeps each section independently
editable when the canvas layer and real copy/assets land later, and matches the composite
structure `CLAUDE.md` §4 already anticipates. `SiteNav`/`SiteFooter` are pulled out now
(not homepage-scoped) because `/work`, `/about`, `/contact` will reuse them verbatim per
the wireframe's subpage nav.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/site-nav.tsx` | new | fixed nav, real links + Book a call button |
| `src/components/site-footer.tsx` | new | footer nav + copyright |
| `src/components/section-heading.tsx` | new | shared `NN / LABEL` eyebrow |
| `src/components/homepage/hero.tsx` | new | hero section, no canvas yet |
| `src/components/homepage/about-teaser.tsx` | new | `01 / ABOUT` |
| `src/components/homepage/services-grid.tsx` | new | `02 / SERVICES`, 4×2 grid |
| `src/components/homepage/how-we-work.tsx` | new | `03 / HOW WE WORK`, 4 steps |
| `src/components/homepage/selected-work.tsx` | new | `04 / SELECTED WORK`, 3 rows |
| `src/components/homepage/pricing-table.tsx` | new | `05 / PRICING`, 3 rows |
| `src/app/page.tsx` | edit | replace placeholder with full section assembly |
| `docs/tasks/TASK-homepage-sections.md` | new | this file |
