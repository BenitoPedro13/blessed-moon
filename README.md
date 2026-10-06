# Blessed Moon Studio

Marketing site for Blessed Moon Studio — a web design/dev agency. Dark, terminal/TUI-inspired
aesthetic: a full-bleed ASCII moon background that reacts to scroll, amber (`#ff6a1f`) accent
on near-black, sharp corners throughout, sound, and a terminal boot sequence on load.

Design source of truth: [`docs/design-handoff.md`](docs/design-handoff.md) (screens, copy,
interactions, design tokens, reference links). Process/working rules: [`CLAUDE.md`](CLAUDE.md).

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config, no `tailwind.config.*`)
- [shadcn/ui](https://ui.shadcn.com) — restyled to the brand tokens in `src/app/globals.css`
- [canvasui.dev](https://canvasui.dev) components (via the shadcn CLI, `src/components/canvasui/`):
  `AsciiObject` for the scroll-driven moon background, `ParticleObject` for the closing CTA's
  cursor-reactive particle moon (`ParticleScroll` and `DecryptReveal` are installed but not
  wired into a live page — their native effect needs the experimental `html-in-canvas` API)
- Scroll journey: Lenis for eased native scroll, `ScrollStage` to pin one section for a
  taller scroll range, and `ScrollMorphStage` to pin *several* in one shared frame so a
  single element can physically travel between them (the homepage body's 8 → 4 → 3 → 1
  count) — see `docs/tasks/TASK-homepage-morph-redesign.md`
- [animate-ui](https://animate-ui.com) `StarsBackground` (also via shadcn CLI) for the star
  field
- [Motion](https://motion.dev) (`motion/react`) for scroll-reveal and hover animations
- A small sound system (`src/components/sound-provider.tsx`) — opt-in UI/ambient sound, CC0
  assets in `public/sounds/`
- A terminal boot sequence (`src/components/boot-sequence.tsx`) on initial load — a
  fastfetch-style brand lockup (the pixel crescent at display size, true `key: value` facts
  from `src/lib/boot-info.ts`, the site palette as a swatch row), a scroll-to-begin gate, and
  a choreographed exit that dissolves onto the hero rather than cutting to it
- SEO: expanded `Metadata` in `src/app/layout.tsx` (title template, Open Graph, Twitter card,
  robots), plus `src/app/robots.ts` and `src/app/sitemap.ts`
- Favicon, apple touch icon, and the Open Graph/Twitter share image (`src/app/icon.tsx`,
  `apple-icon.tsx`, `opengraph-image.tsx`, `twitter-image.tsx`) are generated via `next/og`
  `ImageResponse` from one shared logo mark (`src/lib/logo-mark.ts`) — a pixel-art crescent
  moon, also used as the nav's logo (`src/components/logo-mark.tsx`)

See `docs/tasks/TASK-ascii-canvas-layer.md`, `TASK-services-scroll-focus.md`,
`TASK-sound-and-boot.md`, and `TASK-seo-favicon-and-logo.md` for how and why this stack evolved.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional: environment variables

`ORIGIN_TRIAL_TOKEN_HTML_IN_CANVAS` — unlocks the experimental `html-in-canvas` browser API
(what `ParticleScroll`/`DecryptReveal` need for their native effect) for real visitors, no
`chrome://flags` required on their end. Optional — without it the site works fine, those
components just always render their graceful fallback. See
`docs/tasks/TASK-html-in-canvas-origin-trial.md` and `.env.example`.

## Scripts

| Command | Does |
|---|---|
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm run profile` | Performance harness — needs `pnpm build && pnpm start` running first. `--mode scroll` (default) measures frame pacing while scrolling; `--mode load` measures long tasks and blocked main thread on a cold load. `--cpu 6 --runs 5 --url …`. Note `pnpm run profile`, not `pnpm profile` — pnpm has a built-in `profile` command that shadows the script. |

## Status

A hidden, unlinked, `noindex` design-system page lives at `/system` (`src/app/system/page.tsx`)
— renders the real palette, type scale, primitives, shared composites, and the AsciiObject/
ParticleObject signature effects live from the actual tokens and components, and doubles as the
sandbox for design work in progress before it reaches a live page. See
`docs/tasks/TASK-system-design-page.md`.

Complete for the design-handoff scope: `/`, `/work`, `/about`, and `/contact` are implemented,
responsive, statically generated, and included in the sitemap. The homepage includes the nav,
hero, about teaser, services, process, selected work, pricing, the shared closing CTA band, and
footer inside the scroll-reactive ASCII/particle system. Work presents Markado, Bee Dash, Sua Mesa Fit, Prumo, ART'hur,
Flora, Trísion, Oishi, F&A Móveis, UniMeet (its proposed v2 design, labelled as a proposal; the client kept v1 live), Outubro Idiomas (in progress) and Renewable Pulse using verified portfolio data and project-specific terminal schematics — Prumo's
is a real-estate credit-qualification schematic (`docs/tasks/TASK-add-prumo-case-study.md`) and
Trísion's is a numeração/tenancy schematic (`docs/tasks/TASK-add-trision-case-study.md`). About includes the final
mission, values, two disciplines handled by Benito alone, and direct delivery statement. Contact includes a real
project form, booking link, email, LinkedIn, and GitHub; the project form sends enquiries through a server-side SMTP endpoint. After the studio
notification is accepted, it sends a thank-you email promising a personal follow-up.
Missing SMTP settings visibly disable sending and leave a direct studio email link.

`/work` and `/about` run the same one-morphing-terminal-window structure as the homepage body
(`ScrollMorphStage`), each with its own traveling motif rather than a copy of the homepage's
count: `/work` hands the project name from the index listing into each entry, `/about` hands
`A → B → 0`. `/contact` and the case-study pages take the window chrome and the cell-grid ground
but no pin — a form should open rather than unfold, and a long case study inside a scroll-driven
window would nest two scroll contexts. See `docs/tasks/TASK-subpage-morph-expansion.md`.

Scroll stages now observe their content and switch to normal document flow when
it exceeds the available height, including Work's growing project index. Reduced
motion also uses flow. Compact content keeps the animated handoffs. The root uses
a minimum height rather than a fixed viewport height so Lenis can observe document
growth. Case galleries display complete screenshots in the same document scroll
path. Run `SCROLL_CHECK_URL=http://localhost:3194 node scripts/check-page-scroll.mjs`
against a production preview for every route, all case studies, three viewport sizes,
both motion preferences, expanded briefs and content-growth checks. See
`docs/tasks/TASK-page-scroll-reachability.md`.

All scroll-driven components share one `requestAnimationFrame` through
`src/components/frame-loop.ts`, which runs every layout *read* before any style *write* —
previously seven components each owned a loop and invalidated each other's measurements. Profile
with `pnpm run profile`; it compares medians of repeated runs and refuses to report numbers for a
page that didn't load cleanly, both of which are lessons rather than preferences
(`docs/tasks/TASK-frame-budget-cleanup.md`).

Mobile performance is **improved but not solved**. The background moon's three.js scene now
runs in an OffscreenCanvas worker (`src/components/canvasui/ascii-object.worker.ts`) sharing
one engine with the main-thread fallback, and the closing CTA's second three.js scene is gone.
Measured at 6x CPU throttle with baseline and candidate runs *alternated* (the machine drifts
enough over a session that sequential blocks are not comparable): blocked main thread on cold
load 903ms → 694ms, scroll 44.9 → 47.5fps with frames over 33ms down from 10.9% to 8.7%. The
remaining blocking is hydration, the boot sequence, Lenis and the Canvas2D particle layers, not
the moon — `docs/tasks/TASK-adaptive-quality.md` is where those get decided
(`docs/tasks/TASK-ascii-offscreen-worker.md`).

Sound remains opt-in and muted by default. The terminal boot sequence, pixel-crescent logo,
generated favicon/apple/OG/Twitter assets, metadata, `robots.ts`, and responsive scroll-driven
ASCII moon are all wired in, targeting `https://blessed-moon.vercel.app` through
`src/lib/site-config.ts`.

## Credits

Third-party assets used on the homepage, all confirmed free-to-use:

- **Moon 3D model** — rebuilt from a real NASA lunar surface texture combined with a model
  sourced via [poly.pizza](https://poly.pizza) ("Poly by Google", CC-BY). See
  `docs/tasks/TASK-ascii-canvas-layer.md` for the asset pipeline.
- **UI sounds** (`public/sounds/hover.ogg`, `click.ogg`, `toggle.ogg`) — [Kenney.nl](https://kenney.nl)
  "UI Audio" / "Interface Sounds" packs, CC0.
- **Ambient loop** (`public/sounds/ambient.mp3`) — "Scifi City - Ambient Loop" by TinyWorlds,
  [opengameart.org](https://opengameart.org/content/scifi-city-ambient-loop), CC0.
- **Keypresses** (`scripts/assets/keyboard/`, Story videos only, not served) — "Keyboard
  Soundpack #1" by unicaegames, [opengameart.org](https://opengameart.org/content/keyboard-soundpack-1-typing-and-single-keystrokes), CC0.

## Social strategy and solo studio

Blessed Moon is Benito Pedro Xavier's solo studio. About's A/B views represent
strategy and engineering disciplines handled by the same founder; historical
case-study team fields remain project-specific.

The public `/services/social-media` page offers **Social Media Strategy & Content
Planning**, linked from the homepage services/pricing and footer. It uses custom
quotes and a defined research/calendar/handover scope. Monthly strategy review is
optional; ongoing production and full account management require separate scope.

Unlinked, `noindex` planning pages: `/social-plan`, `/instagram-plan`,
`/linkedin-plan`, `/analytics-plan`. They contain five public offer references,
356 collected Instagram covers, 59 captured captions and ten supporting LinkedIn samples, platform selection,
22 authored carousels (14 English, 8 Portuguese) with captions, LinkedIn drafts,
campaign links, an internal pricing model and a measurement checklist. English leads
on Instagram and LinkedIn; a Portuguese Instagram account is optional. Instagram-feed
coverage and selected deep observations are documented; no competitor performance is inferred. They are URL-accessible, not authenticated. No live
social/Umami metrics or private client information are embedded in them; live Umami
readings are only on the password-protected `/analytics-plan/live` (below). Research lives in
`docs/social/`; implementation decisions in
`docs/tasks/TASK-social-strategy-and-service.md`.

Strategy CTAs preselect the contact project type. Umami custom events distinguish
CTA clicks, the first form edit, accepted SMTP submissions and booking-link clicks.
Those events contain fixed enums only. An accepted submission is a website conversion;
qualification, inbox delivery, meetings and revenue still require actual records.
The existing optional tracker/recorder configuration is retained.

`AGENCY_CONTACT_EMAIL` and `AGENCY_BOOKING_URL` provision the existing official
studio contact channels. SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD and SMTP_FROM_EMAIL enable form
delivery; without complete configuration sending is disabled. Scheduling remains
optional. These server-only variables are documented in `.env.example`.

See [Gmail and SMTP setup](docs/email-setup.md). `pnpm check:enquiry` tests the API,
browser and both emails against a local TLS SMTP server without sending real mail.
`pnpm smtp:verify` checks your configured credentials without sending a message.

The [Umami operations guide](docs/social/12-umami-operations.md) connects every
sidebar screen to the pilot. Paste [the setup script](public/umami-setup.js)
into your logged-in Umami (3.4) console to create five goals, four funnels, nine
segments, one cohort and three boards (*Is the pilot working?*, *Where do people
stall?*, *Weekly check*), and configure recording. It checks this website's ID/domain,
backs up definitions and skips existing names. No account-side writes have been
made from this workspace. `node scripts/check-umami-setup.mjs` verifies the setup
workflow and tracking policy against mocked Umami 3.4 API contracts.

`/analytics-plan/live` reads Umami server-side as a view-only user and turns it into
five panels, each ending with a reading of what to check next: where people stop
(visit → contact → form → accepted), which tagged posts send people who act, which
case studies lead to contact, mobile Web Vitals, and this period vs the previous one.
Small samples say "too few to read" instead of drawing a verdict, and an Umami outage
shows as missing data, never zero. HTTP Basic auth (`src/proxy.ts`) with
`INSIGHTS_PASSWORD`; without it the route 404s. Server-only `UMAMI_API_URL`,
`UMAMI_API_USER`, `UMAMI_API_PASSWORD`. `node scripts/check-insights.mjs` tests the
reading rules and auth; with `BASE_URL` and `INSIGHTS_PASSWORD` it also checks a
running server's gate. See `docs/tasks/TASK-umami-live-insights.md`.

The tracker now collects Web Vitals, respects Do Not Track, limits collection to
the production hostname, excludes internal workspace pageviews and strips arbitrary
query parameters/hashes while retaining safe campaign tags. Recording requires
the base tracker too. Form and planning contents are blocked from replays.

Targeted browser verification: `node scripts/check-social-strategy.mjs` against a
running local server (`SOCIAL_CHECK_URL` optionally overrides `http://localhost:3000`).

## Social previews, charts and post builder

The channel plans now include nine-cover studies and navigable slide previews.
`/post-builder` starts from those researched stories or a blank draft. Edit copy,
caption, slide order and screenshots using Cover, Point, Rows, Comparison, Screenshot in window, Annotated screenshot or Closing action templates, set in the
site's own faces with the crescent, the site's captured moon and the terminal window. Choose dark, paper or amber artwork. Portrait, square, landscape and Story formats share the same
SVG artwork between preview and export. Download PNG, a numbered ZIP with caption,
alt text and editable draft, or an image-based PDF. Save/restore JSON before leaving;
drafts are held in the tab, with no server storage or automated publishing.

`/social-plan` plots proposed pillar shares and workload. `/analytics-plan` has an
empty eight-week worksheet for real tagged visits, qualified enquiries and production
hours. Blank weeks remain gaps; recorded zeroes appear. Save observations as JSON or
download a chart SVG. It does not connect to social accounts or Umami reports; the
gated `/analytics-plan/live` does the Umami part.

The builder remains URL-accessible and noindex, outside the global menu/sitemap.
Its editable DOM and the worksheet carry rrweb's `rr-block` class to exclude their
contents from the existing session replay integration. Actual production replay
configuration/ingestion still needs verification. `/system` includes the new specimens.
Only fflate was added, loaded dynamically for ZIP creation; the small PDF helper was
reused from Unimeet. No Unimeet files were changed.

See [production workspace guide](docs/social/09-production-workspace.md) and
`docs/tasks/TASK-social-preview-builder.md`. Run
`node scripts/check-post-builder.mjs` against the preview (default port 3194).
For a review build without the optional trackers, pass empty values for
`NEXT_PUBLIC_UMAMI_SRC`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and
`NEXT_PUBLIC_UMAMI_RECORDER_SRC` to both build and start; leave env files intact.

## Agency research corpus

Benito completed both browser exports. Ten selected profiles supplied **356 distinct
posts and 356 covers** (Baunfire 32; nine accounts 36 each). There are **59 captured
full captions, 85 observed inner-media positions and 84 saved slide images**; videos
were not captured. The cover contact sheets and captured material were reviewed
on 5 October 2026. See [audit and limitations](docs/social/11-instagram-corpus-audit.md),
[aggregate coverage](docs/social/corpus/coverage.json) and
[source index](docs/social/corpus/post-index.csv). Raw media, captions and signed CDN
URLs stay gitignored and are not published. Collectors/import instructions are in
[the collection guide](docs/social/10-agency-profile-collection.md).

The posts (`src/lib/social-posts.ts`, `TASK-social-copy-v3.md`) lead with a project
screenshot or a concrete buyer question and use Oishi, F&A Móveis, Markado, Flora,
Prumo, Bee Dash and Sua Mesa Fit screenshots. Preset screenshots are
embedded when exporting, including editable JSON. Review permissions/current facts
before publishing. The builder is local and template based; no automatic AI or
social publishing service was introduced.
