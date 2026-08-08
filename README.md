# Blessed Moon Studio

Marketing site for Blessed Moon Studio — a web design/dev agency. Dark, terminal/TUI-inspired
aesthetic: full-bleed WebGL ASCII canvas background that morphs on scroll, amber (`#ff6a1f`)
accent on near-black, sharp corners throughout.

Design source of truth: [`docs/design-handoff.md`](docs/design-handoff.md) (screens, copy,
interactions, design tokens, reference links). Process/working rules: [`CLAUDE.md`](CLAUDE.md).

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config, no `tailwind.config.*`)
- [shadcn/ui](https://ui.shadcn.com) — restyled to the brand tokens in `src/app/globals.css`
- A hand-written WebGL/canvas ASCII-shader background (not yet built — see `docs/design-handoff.md` References)

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Does |
|---|---|
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |

## Status

Scaffolded: Next.js + Tailwind + shadcn/ui, brand tokens wired into the dark theme, base
primitives installed (`button`, `input`, `textarea`, `card`, `select`). Homepage is built
(static sections, no ASCII canvas layer yet) — nav, hero, about teaser, services grid, how
we work, selected work, pricing, footer. Work/About/Contact routes and the ASCII canvas layer
are not built yet — see `docs/tasks/` for in-progress work and `CLAUDE.md` §0 for current
status.
