# TASK: Add six portfolio/GitHub projects to /work as case studies

## 1. Current scenario

`STUDIO_PROJECTS` in `src/lib/studio-data.ts` holds the `/work` catalogue (array
most-recent-first; `index` is a stable catalogue id, not a recency rank — latest entries
are Lunares `16` and Transit Pulse `17`). Six projects of Benito's that live on his personal
portfolio (`benitopedro.vercel.app`) and/or GitHub are **not** on `/work`:

| Slug | What it is | Lives on | Real screenshots today |
|---|---|---|---|
| `plexus` | Extensible media-processing engine + non-destructive WebGPU photo editor (Go workers + NestJS orchestrator + NATS JetStream) | portfolio + GitHub, **live on Railway** | ✅ 8 (portfolio, 2000×~1100) |
| `reelcast` | YouTube-shaped VOD platform: upload → adaptive HLS ladder (Go/ffmpeg + BullMQ) → `hls.js` player that switches quality under throttling | GitHub only | ❌ real web player, not deployed / not cloned here |
| `video-converter` | Microservices video→audio pipeline (RabbitMQ, GridFS, Docker, Kubernetes) | portfolio + GitHub | ❌ Next.js upload UI runs only locally |
| `network-monitor` | Home-network DNS + flow telemetry: AdGuard Home + passive Zeek sensor → Postgres (MaxMind GeoLite2) → Grafana world-map dashboards | GitHub only | ❌ UI is Grafana on localhost, fed by live network data |
| `insta2figma` | Figma plugin / NestJS service turning Instagram layouts into editable Figma layers | portfolio + GitHub | ⚠️ 1 (the plugin panel) |
| `benibot` | Self-hosted Discord bot (Red-DiscordBot 3.5 + Postgres + a custom Anthropic Claude cog) — a case study in Discord automations/bots | GitHub only | ❌ Discord bot, no standalone product screen |

Content note, already found: the portfolio's `network-monitor` entry describes a *stale*
2023 "real-time WebSocket health dashboard". The **real** repo (verified via its README and
languages — TypeScript + Shell + Zeek, pushed 2026-06) is the AdGuard/Zeek/Grafana/MaxMind
home-telemetry system. **We use the real system, not the stale portfolio text.**

The `/work` case-study page (`src/app/[locale]/work/[slug]/page.tsx`) renders, per project:
a cover image (hero + OG + `/work` grid card — **structurally required**), an optional
`video`, problem/approach/result, an **"Interface evidence — the product, not a
placeholder"** screenshot gallery (`project.screenshots`), a 4-step process, a system-
architecture list **plus the bespoke `ProjectVisual` schematic**, features/challenges, and
optional external links (already guarded by `links.length > 0`).

## 2. Planned changes

### 2.0 Authorisations captured from the user (2026-11-03)

- **Clone all six repos and capture real screenshots**, standing up each stack locally; AWS
  may be provisioned temporarily to deploy a project for capture and then **torn down**.
  (Default to local capture — it avoids cloud cost and teardown risk; reserve AWS for a
  project that genuinely can't be shown otherwise. `plexus` is already live on Railway.)
- **benibot: do not re-enable the Discord bot.** Represent it as a real case study in
  "Discord automations, bots and apps" by another honest means (see §2.4).
- No-UI visual treatment (network-monitor, benibot, video-converter) is **decided
  per-project** — proposals are in §2.4 for alignment, not yet final.

### 2.1 `/work` data — six `STUDIO_PROJECTS` entries

Six new entries, catalogue `index` `18`–`23` assigned in the order added; each placed in the
array by the project's own recency (these are older than the current top entries, so most
slot **below** Lunares/Transit Pulse, interleaved by date — exact positions confirmed
against the live array at implementation time, not guessed here). Content is adapted from
each project's real portfolio case study and/or README — never invented — and rewritten into
Blessed Moon's measured voice and the `StudioProject` shape (`tagline`, `problem`,
`approach`, `outcome`, `process`, `architecture`, `features`, `challenges`, `stack`, `tags`,
`category`). Categories: `plexus`/`reelcast`/`video-converter` → `data` or `product`;
`network-monitor` → `data`; `insta2figma`/`benibot` → `product`.

### 2.2 Six bespoke `ProjectVisualVariant` schematics

One domain-specific variant each in `src/components/project-visual.tsx` (same two-column
terminal/mono panel pattern as `grid`/`election`/`transit`; **not** reused from another
project): proposed `pipeline` (plexus), `streaming` (reelcast), `microservices`
(video-converter), `network` (network-monitor), `design-automation` (insta2figma), `bot`
(benibot). Added to the `ProjectVisualVariant` union in `studio-data.ts`.

### 2.3 Screenshots (`public/projects/<slug>/`, 1440×900, headless Playwright)

Captured with headless Playwright via unimeet (`[[media-capture-playwright]]`:
`viewport 1440×900`, isolated Chromium — never Claude-in-Chrome / the user's real browser).

- **plexus** — DONE. `plexus.up.railway.app` is no longer Benito's (another project now
  uses that Railway subdomain), so plexus is **not currently live**: the entry carries no
  live link and makes no live-deployment claim (`timeline: "2026 — feature-complete case
  study"`). Its 8 portfolio screenshots are **genuine captures of his real product**;
  reused and downscaled to 1440px width into `public/projects/plexus/`. Catalogue id `18`,
  placed after Transit Pulse. `pipeline` schematic variant added.
- **reelcast** — clone, run the full stack locally (`pnpm dev:all`: Postgres/Redis/MinIO +
  Go worker; **Go toolchain isn't installed here** — install via Homebrew or build the
  worker in Docker). Upload a ≥60 s clip, capture browse/upload/watch and the live rendition
  indicator mid-quality-switch (the whole point of the project).
- **video-converter** — clone, `docker compose up` the services + Next.js UI, capture the
  non-blocking upload and job-status flow.
- **insta2figma** — §2.4 (per-project).
- **network-monitor** / **benibot** — §2.4 (per-project).

Screenshots use real UI only. Where a screen shows data (Grafana, a Discord session),
privacy/honesty rules apply: **no real home-network device IPs/hostnames/locations and no
real Discord members or tokens** — seeded/synthetic data, honestly labelled the way
Transit Pulse labels its replay "não é ao vivo".

### 2.4 Per-project decisions still open (proposals for alignment)

- **network-monitor** — *Proposal:* seed the DB (`pnpm db:seed`) with synthetic/registered
  devices, run Grafana locally, capture the dashboards + world-map **labelled as seeded
  demo data**; pair with the `network` schematic + architecture. *Alternative:* schematic-
  forward, hiding the interface-evidence gallery. **Avoid showing Benito's real home
  traffic.**
- **benibot** — *Proposal:* run the bot locally against a throwaway private Discord server
  (owned test server, no real members) to capture the `$help` menu and the custom Claude
  cog answering, **then delete the server**; do not keep the bot enabled. *Alternative:* a
  terminal capture of it booting/loading cogs + the `bot` schematic, no Discord screen at
  all. Either way it ships as a "Discord automation" case study.
- **insta2figma** — *Proposal:* run the plugin in Figma desktop (dev mode) to capture 2–3
  real states; *Alternative:* keep the single real plugin-panel shot + `design-automation`
  schematic-forward.
- **Template tweak (if any schematic-forward path is chosen):** make the "Interface
  evidence" section render only when `project.screenshots.length > 0`, so a genuinely
  screen-less project leans on its schematic + architecture instead of an empty gallery
  claiming "verified interface captures". Small, honest change to
  `work/[slug]/page.tsx`; its own note in this doc when done.

### 2.5 Portuguese translations

**Every** human-readable English string in all six entries gets a PT key in
`src/lib/i18n/pt.json` (flat English→PT map; missing keys silently fall back to English).
Covers taglines, prose, process/architecture/feature/challenge text, screenshot alts,
schematic strings, and any new link labels. The `/work` page `metadata.description`
enumerating domains is extended and translated.

### 2.6 Not touched

`homepage/selected-work.tsx` (its own hand-curated three, driving the 3→1 morph). `/work`
counts, filters, `next →` chain, pagination and sitemap all derive from `STUDIO_PROJECTS` —
no manual count edits.

## 3. Why

These six are real, shipped (or feature-complete) engineering work — a media-processing
engine, two real-time media pipelines, a network-telemetry system, a design-automation
tool, and a Discord-automation bot — that broadens `/work` beyond client sites into
infrastructure, real-time systems and tooling. They currently live only on a separate
portfolio and GitHub; bringing them onto Blessed Moon with the studio's own case-study
depth (real screenshots, bespoke schematics, honest failure states) is what makes them read
as studio work rather than loose repos. The stale `network-monitor` description is corrected
to the real system in the process.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `docs/tasks/TASK-add-six-portfolio-case-studies.md` | new | this document |
| `src/lib/studio-data.ts` | edit | six `StudioProject` entries; six variants added to the `ProjectVisualVariant` union |
| `src/components/project-visual.tsx` | edit | six new schematic blocks |
| `src/app/[locale]/work/[slug]/page.tsx` | edit (conditional) | only if a schematic-forward path is chosen (§2.4): gate the interface-evidence section on `screenshots.length > 0` |
| `public/projects/{plexus,reelcast,video-converter,network-monitor,insta2figma,benibot}/*.png` | new | real 1440×900 captures |
| `src/lib/i18n/pt.json` | edit | PT for every new string; extend `/work` metadata description |
| `README.md` | edit | Work section project count/list |

## 5. Sequencing (proposed)

1. **plexus** first — live on Railway, lowest-friction real capture; proves the end-to-end
   flow (entry + variant + screenshots + PT) on one project before scaling to six.
2. **video-converter**, then **reelcast** — local Docker stacks (reelcast also needs the Go
   toolchain).
3. **insta2figma**, **network-monitor**, **benibot** — once §2.4 decisions are settled.

Each project (or small batch) is verified with `pnpm exec tsc --noEmit`, `pnpm exec eslint`,
`pnpm build` before committing (auto-commit per CLAUDE.md §4.1; **no `Co-Authored-By`**).

## 6. Continuation — 2026-11-03

- Plexus (`18`) and Video Converter (`19`) are committed. Reelcast (`20`) has five genuine
  local screenshots and its entry/schematic in the working tree; finish its PT copy and verification.
- Review the remaining repositories directly before adapting the older portfolio's descriptions.
- Network Monitor: use an isolated local Grafana/Postgres demo with clearly labelled synthetic data.
  Never connect a sensor to this machine's network or read the production/home configuration.
- Insta2Figma: reuse its real plugin-panel screenshot if the original runtime cannot be restored
  without accessing an Instagram account. Describe only source-supported functionality.
- Benibot stays disabled. Use a source-based architecture illustration, explicitly labelled as such,
  and no interface-evidence gallery. Do not create a Discord server, log in to Discord or invoke Claude.
  The earlier proposal to temporarily start the bot in §2.4 is superseded by the user's prohibition.
- Retain the existing terminal palette, Space Grotesk display and JetBrains Mono utility type.
  Each schematic explains a different actual boundary: HLS rendition ladder, passive telemetry,
  plugin-to-editable-layers, or isolated bot cogs. Do not add a new UI library or motion system.
- The three homepage selected projects remain unchanged. Publishing is outside this continuation;
  verified changes are committed locally for review.
- Source correction: current Insta2Figma creates image-filled rectangles and lays out posts/carousels.
  It does not reconstruct text inside the post. Describe editable image layers, not inferred typography.
- Source correction: the current Benibot tree contains help, social, leveling and autoslash cogs.
  Its README mentions a Claude cog absent from the tree; omit that feature from the case study.

### Reelcast verification

- Completed entry `20`, streaming schematic and full PT copy. Five genuine 1440×900 local captures
  show upload, processing, browse and a generated 75-second clip playing at Auto/720p and manual 360p.
  Manual 360p is described as manual, not evidence of automatic bandwidth switching.
- Verified against the cloned project's README and `TASK-hls-worker.md`; no live deployment link.
- `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`, `git diff --check`: passed.
- Production Chromium: English and Portuguese case pages return 200, render the Reelcast heading,
  and fit a 390px viewport without horizontal overflow.

### Remaining case-study implementation

- Insta2Figma `21`: original portfolio plugin capture reused at 1440×1071 (whole image, no crop).
  Current Figma/Framer adapters, shared UI and queue pipeline verified against the cloned source.
  The older portfolio's claims of typography/layout reconstruction are superseded by image-layer placement.
- Network Monitor `22`: the source's four provisioned Grafana dashboards run against an isolated
  throwaway Postgres instance. Seed: 3 demo devices, 2,800 generated DNS events, 1,600 generated
  flows, 6 illustrative destination locations and 2 example alerts. IPs use RFC 5737 documentation
  ranges. Every screenshot includes a visible synthetic-data banner. No AdGuard or Zeek was started.
  Grafana image: `grafana/grafana@sha256:488984b716c0862639f91a698adbe2862677a5a07bad42da5f03f3030883b205`.
- Benibot `23`: source-reviewed help/social/leveling/autoslash cogs, labelled architecture cover
  (SVG source + PNG export), empty screenshot list. No Discord session, server, token or AI call.
- The four newly completed cases have bespoke system schematics and complete English/PT prose.
  `ProjectVisual` now shares the existing `ProjectVisualVariant` type, avoiding a duplicate union.
- Schematic headers say "system schematic" instead of implying live availability with "online".
- Expanded `/work` metadata and README coverage. Existing project IDs/order and the homepage's
  selected-work list are preserved; the three June 2026 projects precede the older foundational work.
- Source revisions reviewed: Insta2Figma `d142b2e`, Network Monitor `b7ade90`, Benibot `5338e64`.
  The isolated Grafana/Postgres demo was removed after the four captures; no cloud resources were used.

### Final validation

- TypeScript, ESLint, production build (84 generated pages), and `git diff --check`: passed.
- All four cases' cover/gallery files exist and match their declared dimensions. Catalogue slugs
  and IDs are unique; all newly authored case prose, image alternatives and schematic labels have PT copy.
- `pnpm check:locales`: passed, including 54 English/PT rendered pages, case text, metadata,
  language switching, sitemap and image assets, with navigation at 1440, 390 and 320px.
- Scroll checks: all 30 combinations passed for `/work` and the four new cases at 1440×900,
  390×844 and 320×568, both normal and reduced motion, including wheel/End reachability,
  no competing main-content scroller, dynamic index growth and stage reflow.
  The first headless-shell attempt timed out and logged GPU shared-memory errors. An isolated
  Reelcast run reached the footer; the complete suite then passed using the same assertions
  in full Chromium with Metal selected and WebGL disabled to cover the site's fallback path.
- Additional Chromium/Metal visual checks with WebGL available: all four PT cases fit 1440px/320px,
  all index cards and category filters work, and Benibot omits the interface-evidence gallery.
  No uncaught browser errors. Review captures: `/private/tmp/bm-new-cases-review/`.
- All six requested additions are now represented: Plexus and Video Converter from earlier commits,
  followed by Reelcast and the three source-reviewed cases in this continuation. No push or deployment
  was performed; the production build is available locally on port 3199 for review.
