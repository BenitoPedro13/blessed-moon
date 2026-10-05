# TASK: add UniMeet, Outubro Idiomas and Renewable Pulse to /work

5 October 2026. Status: complete.

## 1. Current scenario

`/work` presents nine projects from `STUDIO_PROJECTS` (`src/lib/studio-data.ts`): Oishi (08),
F&A Móveis (09), Trísion (07), Flora (06), ART'hur (05), Prumo (04), Sua Mesa Fit (03), Bee Dash
(02) and Markado (01). Each entry drives an index row, a case page with real screenshots, and a
hand-built schematic (`ProjectVisual`, one `visual` variant per project).

Benito, 5 October: "I have 2 new projects, UniMeet and Outubro … and Renewable Pulse to
showcase." On UniMeet: "if possible let's also say we did some social media work; I wanted to
showcase the v2 version but the client insists on maintaining the v1, but on my portfolio I
want v2 screenshots." His choices on framing (same day): UniMeet's v2 is labelled a **proposed
redesign** (the client kept v1 live); Outubro is shown **in progress, like Trísion**.

Also from the same review: the social posts lean on F&A Móveis, "one of my simplest projects".
These three give the posts stronger evidence; the posts themselves change in
`TASK-social-profiles-and-rebalance.md`.

## 2. Planned changes

### 2.1 UniMeet (index 10, `visual: "fairs"`)

- Facts only from the UniMeet repo (`../unimeet/CLAUDE.md`, task docs): a recruitment site for
  European universities with an admin-driven event engine (one tour record → a standardised
  fair page ending in a registration form), Payload 3 + Next.js 16 in one app, fair pricing
  computed in integer cents and frozen into a quote at submission, the registration emailed
  and persisted, spam protection without third-party requests, WCAG 2.2 AA asserted with axe
  at 390/768/1440, cookieless self-hosted analytics, SEO and generated share cards, and the
  social work: Instagram and LinkedIn plans with a post builder rendering the brand's slides.
- **Screenshots: v2, captioned honestly.** Captured from the public `/v2` routes (noindex,
  unlinked): the home, university fairs, for universities and a fair tour page, plus the
  social plan pages. Every v2 screenshot's alt text and the case's outcome say "proposed v2
  design; the client kept v1 live". No claim that v2 is the live site.
- Links: the live site (`unimeet.eu`). No source link (client repository).

### 2.2 Outubro Idiomas (index 11, `visual: "language"`)

- A rebuild of a Brazilian online language school's site (PT/EN/ES with localized URLs),
  elevating the brand's existing identity: the "destravar" signature interaction (a doodled
  cord untangling as the headline resolves), Source Sans only per the brandbook, a doodle and
  sticker layer, GSAP + Lenis motion with WebGL deliberately rejected for mobile performance,
  and Payload-shaped stand-ins for pricing, FAQ and testimonials.
- `timeline: "Ongoing"`; the stack lists only what's installed (no Payload or Postgres yet).
  Testimonials are placeholders on the build, so no testimonial or result is quoted.
- Screenshots from the preview deployment (`outubroidiomas.vercel.app`): home, pricing, method.

### 2.3 Renewable Pulse (index 12, `visual: "grid"`)

- Benito's own product, a companion to Flora: real public generation data from ONS (Brazil),
  ENTSO-E (Norway/Europe) and EIA (USA) through a Go ingestion edge → Redpanda → idempotent
  TypeScript consumers → TimescaleDB → a live Next.js dashboard. "No synthetic data,
  anywhere"; the README's honest note that the sources are polled, not pushed, is kept.
  Figures from the README (366,336 ONS plant/hour readings, zero duplicates on replay, six
  ENTSO-E zones, 7 US RTOs).
- Screenshots from the live dashboard (`renewable-pulse.vercel.app`). Links: live + source
  (the GitHub repo is public; checked 5 October). Outubro's repo is public too and is linked;
  UniMeet's is private and is not.

### 2.4 Shared

- Three new `ProjectVisual` variants, in the same terminal/mono style as the others:
  `fairs` (tour → fair cities → registration with a frozen quote), `language` (the
  untangling cord, the three locales), `grid` (three sources → broker → consumers, with the
  idempotency key and DLQ).
- Stale counts: the `/work` hero and metadata, the `WorkIndex` heading, the README work
  sentence — updated from nine to twelve.
- The home page's Selected Work (exactly three, the morph count) is not touched, the same
  rule as the Trísion and Prumo tasks.

## 3. Why

They're the strongest evidence Benito has for the buyer the strategy now targets:
international founders and product leaders. UniMeet is a delivered, multi-surface product
with commerce rules and a social plan; Renewable Pulse is real-data infrastructure; Outubro
shows brand-led motion with i18n.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/studio-data.ts` | edit | Three entries; three `ProjectVisualVariant` values |
| `src/components/project-visual.tsx` | edit | Three schematic variants |
| `public/projects/unimeet/*`, `outubro/*`, `renewable-pulse/*` | new | Screenshots captured with Playwright from the public deployments |
| `src/app/work/page.tsx`, `src/components/work/work-index.tsx` | edit | Counts |
| `README.md`, `CLAUDE.md` | edit | Work list and counts |
| `src/lib/social-art-images.json` | edit | Allowlist the screenshots the posts will use |

## 5. Verification

- `pnpm build` and lint pass; all twelve `/work/[slug]` pages are generated.
- `scripts/check-page-scroll.mjs` passes (it covers dynamic Work growth).
- Each new case page reviewed in the browser at 390 and 1440 wide; every v2 screenshot is
  labelled as a proposal.

## 6. Out of scope

The personal portfolio repo, the home page's Selected Work, any claim of UniMeet results.

## Implemented result

- Entries 10–12 in `STUDIO_PROJECTS`, with three schematic variants (`fairs`, `language`,
  `grid`). Screenshots were captured at 1440×900 with Playwright from the public
  deployments: UniMeet `/v2` home, fair tour (EBEUF 2027), fairs index and For
  Universities, plus its Instagram and LinkedIn plan pages; the Renewable Pulse dashboard,
  USA section and pipeline health; Outubro's home, pricing and method. Every UniMeet v2
  image's alt text and the outcome say it's a proposal and v1 is live; the live link is
  labelled "(v1)".
- The `/work` hero and heading counts are already derived from `STUDIO_PROJECTS.length`; the
  metadata description and the README work sentence were updated.
- A first production build served 404s for the three new pages although they were listed;
  it had been built while the data file was mid-edit. A clean rebuild fixed it. Noted
  because a stale `.next` looks exactly like a routing bug.
- Verification: lint (0 errors), build (12 case pages), `check-page-scroll.mjs` (138
  checks, all passing, including the three new pages at every size), and the new pages viewed at
  1440 and 390 with no horizontal overflow.
