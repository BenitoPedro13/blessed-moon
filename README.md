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
  cursor-reactive particle moon, `ParticleScroll` for the dissolve-panel effect wrapping the
  homepage's content sections
- [animate-ui](https://animate-ui.com) `StarsBackground` (also via shadcn CLI) for the star
  field
- [Motion](https://motion.dev) (`motion/react`) for scroll-reveal and hover animations
- A small sound system (`src/components/sound-provider.tsx`) — opt-in UI/ambient sound, CC0
  assets in `public/sounds/`
- A terminal boot sequence (`src/components/boot-sequence.tsx`) on initial load
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

## Status

Complete for the design-handoff scope: `/`, `/work`, `/about`, and `/contact` are implemented,
responsive, statically generated, and included in the sitemap. The homepage includes the nav,
hero, about teaser, services, process, selected work, pricing, closing CTA, and footer inside the
scroll-reactive ASCII/particle system. Work presents Markado, Bee Dash, and Sua Mesa Fit using
verified portfolio data and project-specific terminal schematics. About includes the final
mission, values, two-pillar structure, and direct-partnership statement. Contact includes a real
project form, booking link, email, LinkedIn, and GitHub; until an email provider is configured,
the form transparently opens a prefilled email draft instead of pretending to submit to a
backend.

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
