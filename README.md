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
| `pnpm profile` | Scroll-performance harness — needs `pnpm build && pnpm start` running first. `--cpu 6 --runs 3 --url …` |

## Status

A hidden, unlinked, `noindex` design-system page lives at `/system` (`src/app/system/page.tsx`)
— renders the real palette, type scale, primitives, shared composites, and the AsciiObject/
ParticleObject signature effects live from the actual tokens and components, and doubles as the
sandbox for design work in progress before it reaches a live page. See
`docs/tasks/TASK-system-design-page.md`.

Complete for the design-handoff scope: `/`, `/work`, `/about`, and `/contact` are implemented,
responsive, statically generated, and included in the sitemap. The homepage includes the nav,
hero, about teaser, services, process, selected work, pricing, closing CTA, and footer inside the
scroll-reactive ASCII/particle system. Work presents Markado, Bee Dash, Sua Mesa Fit, and Prumo
using verified portfolio data and project-specific terminal schematics — Prumo's is a real-estate
credit-qualification schematic, `docs/tasks/TASK-add-prumo-case-study.md`. About includes the final
mission, values, two-pillar structure, and direct-partnership statement. Contact includes a real
project form, booking link, email, LinkedIn, and GitHub; until an email provider is configured,
the form transparently opens a prefilled email draft instead of pretending to submit to a
backend.

`/work` and `/about` run the same one-morphing-terminal-window structure as the homepage body
(`ScrollMorphStage`), each with its own traveling motif rather than a copy of the homepage's
count: `/work` hands the project name from the index listing into each entry, `/about` hands
`A → B → 0`. `/contact` and the case-study pages take the window chrome and the cell-grid ground
but no pin — a form should open rather than unfold, and a long case study inside a scroll-driven
window would nest two scroll contexts. See `docs/tasks/TASK-subpage-morph-expansion.md`.

All scroll-driven components share one `requestAnimationFrame` through
`src/components/frame-loop.ts`, which runs every layout *read* before any style *write* —
previously seven components each owned a loop and invalidated each other's measurements. Profile
with `pnpm profile`; it compares medians of repeated runs and refuses to report numbers for a
page that didn't load cleanly, both of which are lessons rather than preferences
(`docs/tasks/TASK-frame-budget-cleanup.md`).

Mobile performance is **not yet solved**. On a mid-range phone (6x CPU throttle) the homepage
sits around 51fps with ~7% of frames over 33ms. The frame-loop work above is a structural
prerequisite that bought ~3%; the measured headroom is in the canvas layers — disabling them
reaches ~59fps. That is what `docs/tasks/TASK-ascii-offscreen-worker.md` (moon to a worker) and
`docs/tasks/TASK-adaptive-quality.md` (measured frame budget, not a breakpoint) are for.

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
