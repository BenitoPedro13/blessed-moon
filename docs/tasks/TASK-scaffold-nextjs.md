# TASK: Scaffold the Next.js app

**Status: done.** Scaffolded via `create-next-app` (merged in from a sibling temp dir —
`create-next-app` refuses to scaffold into a non-empty directory, and hit an unrelated
upstream timing bug when run directly against the target path). shadcn/ui initialized with
`button`, `input`, `textarea`, `card`, `select`. Design tokens wired into the `.dark` theme
block in `src/app/globals.css`. Fonts (Space Grotesk + JetBrains Mono) and hardcoded dark
theme wired into `src/app/layout.tsx`. Build and lint both pass. Additionally moved the
wireframe handoff (`Blessed Moon — Website Wireframes.dc.html` → `docs/design/wireframes.dc.html`,
`screenshots/` → `docs/design/screenshots/`) and split `README.md` into an implementation
README plus `docs/design-handoff.md`, per `CLAUDE.md` §3.1 — not originally scoped in this
doc's plan below, but a direct consequence of the app now existing.

## Current scenario

Wireframe-only repo. No app code exists — only `README.md` (design handoff spec),
`Blessed Moon — Website Wireframes.dc.html`, and `screenshots/*.png`. Not yet a git
repository. No `package.json`, no framework installed.

## Planned changes

- `git init` + initial commit of the existing design-handoff files as-is, so the scaffold
  lands as a clean second commit and the handoff history isn't lost.
- Scaffold a Next.js app in place at the repo root via `pnpm create next-app@latest`:
  TypeScript, App Router, Tailwind CSS, ESLint, `src/` directory, `@/*` import alias, no
  `pnpm dlx create-next-app`'s Turbopack prompt left ambiguous — accept Turbopack (current
  default/recommended dev+build tool).
- Initialize shadcn/ui via `pnpm dlx shadcn@latest init` and add the primitives the
  wireframe needs first: `button`, `input`, `textarea`, `card`, `select`.
- Wire the design tokens from `README.md` § Design Tokens into `app/globals.css` /
  Tailwind theme (background `#050505`, text primary `#e9e7e1`/`#eeeeee`, accent
  `#ff6a1f`/hover `#ff9760`, hairline borders `rgba(255,255,255,.08–.2)`, fonts
  `JetBrains Mono` + `Space Grotesk`, sharp corners / `radius: 0` as the base radius token
  so shadcn's default rounded corners don't leak through per `CLAUDE.md` §0).
- Force dark-only: no light theme, no next-themes toggle — `<html class="dark">` (or
  equivalent) hardcoded.
- Replace the default Next.js starter `app/page.tsx` with a minimal placeholder (not the
  full homepage build — that's a separate task) confirming fonts, tokens, and dark
  background render correctly.
- Add `.gitignore` (from the Next.js scaffold), commit.

## Why

`CLAUDE.md` §0 "Next step" and §2 both require scaffolding via the framework's own current
CLI rather than hand-authoring `package.json`/config files, and §1 requires a task doc
before the first line of app code. Getting tokens and dark-mode/no-radius baked into the
Tailwind theme now (rather than per-component later) avoids every subsequent component PR
having to re-fight shadcn's default rounded/light-first styling.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `.git/` | new | `git init` |
| `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `.gitignore` | new | from `create-next-app` |
| `app/layout.tsx` | new → edit | dark-only, fonts (JetBrains Mono + Space Grotesk via `next/font/google`) |
| `app/globals.css` | new → edit | design tokens as CSS variables / Tailwind theme, radius 0 |
| `app/page.tsx` | new → edit | placeholder homepage confirming theme renders |
| `components.json`, `components/ui/*` | new | shadcn init + button/input/textarea/card/select |
| `docs/tasks/TASK-scaffold-nextjs.md` | new | this file |
