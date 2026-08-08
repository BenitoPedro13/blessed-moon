# TASK: SEO metadata, Open Graph image, favicon, and a real logo mark

## 1. Current scenario

`src/app/layout.tsx` exports a bare `Metadata` object: just `title` and `description`. No
`metadataBase`, no Open Graph or Twitter tags, no `robots.ts`/`sitemap.ts`. `src/app/favicon.ico`
is still the stock Next.js default icon (verified byte-identical to the one served on the live
deployment, `https://blessed-moon.vercel.app` — confirmed by the user as the production URL to
target). There is no logo graphic anywhere in the app; the only brand mark is the plain-text
`>|<` string in `SiteNav` (referenced from a comment in `boot-sequence.tsx` as an established
identity element). `public/` still has the five unused default Next.js scaffold SVGs
(`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) — confirmed unreferenced
anywhere in `src/`.

Two logo directions were surfaced and rejected/accepted by the user mid-task:
- A polished glowing circuit-ring crescent + tech-sans wordmark ("BLESSED MOON STUDIO /
  SOFTWARE · WEB · SOLUTIONS") — the user's original brand concept image. Rejected as the literal
  asset: its neon/glow, circuit-detail, tagline-laden style doesn't match the calm, flat,
  monospace TUI language already built across the site (no glow effects anywhere, `--radius: 0`,
  the ASCII moon canvas, section numbering). Fine detail like this also can't survive being
  rasterized to a 16–32px favicon.
- The user's own portfolio wordmark (`VIDEOS/benitologo.mov`): a blocky monospace/pixel-font
  "B3N!TO" lockup inside a pill nav chip, idle in off-white, shifting to full amber on hover.
  **This is the accepted reference** — not to copy literally (it's Benito's personal-portfolio
  mark, and its pill shape uses rounded corners, which this brand's tokens explicitly forbid),
  but for its underlying technique: monospace/pixel type, a flat two-tone hover shift, no
  gradients or glow.

## 2. Planned changes

### Logo mark — a literal pixel-art crescent, not a generic moon icon

`src/lib/logo-mark.ts` — plain data module (no JSX, importable from both client components and
`next/og` route handlers): a 12×12 grid, one boolean cell per pixel, rasterized from two
overlapping circles (outer disc minus an offset inner disc) so the shape is a genuine crescent
silhouette, exported as `LOGO_GRID_SIZE` and `LOGO_CRESCENT_CELLS: [number, number][]`. This
ties the mark directly to the site's actual ASCII/pixel-moon visual system (the `AsciiObject`
canvas) instead of importing an unrelated icon style — literal square pixels, zero corner
radius, consistent with `--radius: 0`.

`src/components/logo-mark.tsx` — renders `LOGO_CRESCENT_CELLS` as `<rect>` elements in an
`<svg viewBox="0 0 12 12">`, `fill="currentColor"` so color is controlled by the parent
(Tailwind text-color classes, or a hover variant). No "use client" needed — pure presentational
SVG.

**`SiteNav`**: replace the bare `>|<` text with a lockup — `LogoMark` (amber) +
`BLESSED_MOON` wordmark (existing `font-mono` token, uppercase, letter-spaced) — that inverts
color on hover (icon amber → cream, text cream → amber), the same flat two-tone hover-shift
technique as the portfolio reference, reimplemented with this brand's own palette and square
pixels instead of rounded pill/leetspeak styling. `boot-sequence.tsx`'s comment referencing the
old `>|<` mark is updated to describe the new logo instead (doc-in-code accuracy, CLAUDE.md §3).

### Favicon — `icon.tsx` / `apple-icon.tsx`, not a hand-rolled `.ico`

Per current Next.js docs (verified live, v16.3.0 docs as of this task — see
`app-icons` and `opengraph-image` API reference pages), `icon.tsx`/`apple-icon.tsx` are the
canonical, tool-generated way to produce app icons via `ImageResponse` from `next/og`; Next.js
auto-injects the correct `<link>` tags. `src/app/icon.tsx` (32×32) and `src/app/apple-icon.tsx`
(180×180) render the same `LOGO_CRESCENT_CELLS` grid at those sizes against the brand's
`#050505` background. The stock `src/app/favicon.ico` is deleted — Next.js explicitly documents
"you cannot generate a `favicon`, use `icon` instead," and hand-crafting a binary `.ico` would
violate CLAUDE.md §2's "don't hand-author what a generator produces" for no real benefit; the
accepted trade-off is that very old crawlers requesting `/favicon.ico` directly (bypassing
`<link>` tags) get a 404 — acceptable for a modern-browser-targeted marketing site.

### Open Graph / Twitter image — `opengraph-image.tsx`, shared by `twitter-image.tsx`

`src/app/opengraph-image.tsx` (1200×630, `next/og` `ImageResponse`): `#050505` background, the
pixel crescent rendered large, "BLESSED MOON STUDIO" wordmark, and the tagline "Clarity is the
feature." — flat, no glow, matching the rest of the site. Loads Space Grotesk (display) and
JetBrains Mono (label) at request time via the standard Google Fonts CSS2-API fetch recipe
(fonts aren't bundled as binary assets in the repo; fetched at build/request time, same pattern
Vercel's own OG examples use), restricted to the exact characters used to keep the payload
small. `src/app/twitter-image.tsx` re-exports the same `size`/`contentType`/default image
function — Next.js supports sharing the generator between the two conventions.

### SEO metadata — `src/app/layout.tsx`

- `src/lib/site-config.ts` — single exported `SITE_URL = "https://blessed-moon.vercel.app"`
  constant, so every file that needs the production origin (layout metadata, `robots.ts`,
  `sitemap.ts`) points at one place. Confirmed directly by the user as the current production
  URL; CLAUDE.md's "deployment target: open question" still stands for anything beyond that
  (a future custom domain is a one-line change here, not a hunt across files).
- `metadata` gains: `metadataBase: new URL(SITE_URL)`, a `title` template
  (`{ default: "Blessed Moon Studio", template: "%s · Blessed Moon Studio" }` — subpages built
  later, `/work` `/about` `/contact`, get this for free via their own `metadata.title`), a short
  non-spammy `keywords` list, `openGraph` (`type: "website"`, `siteName`, `locale: "en_US"`;
  image tags come from `opengraph-image.tsx` automatically), `twitter`
  (`card: "summary_large_image"`; image from `twitter-image.tsx` automatically), and
  `robots: { index: true, follow: true }`.

### `robots.ts` / `sitemap.ts`

Both new, both using `SITE_URL`. `robots.ts`: allow all, point `sitemap` at `SITE_URL/sitemap.xml`.
`sitemap.ts`: only `/` for now — `/work`, `/about`, `/contact` aren't built yet (§0 "Next step"
in `CLAUDE.md`); add them to the sitemap array when those routes ship, not before (a sitemap
entry for a route that 404s is worse than no entry).

### Cleanup

Delete the five unreferenced default Next.js scaffold SVGs from `public/`.

## 3. Why

Direct user request ("we also need a favicon and a real logo"), plus the SEO/OG-image ask from
earlier in this session. The logo direction specifically required a mid-task check-in: the
user's first reference image (circuit-ring crescent) visually contradicted the TUI/flat/no-glow
identity CLAUDE.md already locks in, so I flagged the mismatch and asked before building on top
of it rather than silently importing a different aesthetic; the user then pointed at their own
portfolio's monospace pixel-hover technique as the real direction, which is what's implemented
here, adapted to this brand's own palette and square-only geometry.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/lib/logo-mark.ts` | new | shared pixel-crescent grid data |
| `src/components/logo-mark.tsx` | new | SVG component, `currentColor` fill |
| `src/lib/site-config.ts` | new | single `SITE_URL` constant |
| `src/app/icon.tsx` | new | 32×32 generated favicon |
| `src/app/apple-icon.tsx` | new | 180×180 generated apple touch icon |
| `src/app/favicon.ico` | deleted | stock Next.js default, superseded by `icon.tsx` |
| `src/app/opengraph-image.tsx` | new | 1200×630 OG image |
| `src/app/twitter-image.tsx` | new | re-exports the OG image generator |
| `src/app/robots.ts` | new | allow all, points at sitemap |
| `src/app/sitemap.ts` | new | `/` only for now |
| `src/app/layout.tsx` | edit | expanded `Metadata`: metadataBase, title template, OG/Twitter, robots |
| `src/components/site-nav.tsx` | edit | `>|<` replaced with `LogoMark` + wordmark lockup |
| `src/components/boot-sequence.tsx` | edit | comment reference updated to new logo |
| `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | deleted | unused Next.js scaffold defaults |
