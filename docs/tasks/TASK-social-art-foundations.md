# TASK: social art foundations — brand type, no boxes, real hierarchy

5 October 2026. Status: complete. First of three: this doc, then
`TASK-social-art-signatures.md`, then `TASK-social-copy-v3.md`.

## 1. Current scenario

`src/lib/social-art.ts` is the single SVG source for the plan-page previews, the
`/post-builder` live preview and every PNG/ZIP/PDF export (rasterised in the browser by
`src/lib/social-export.ts` through `<img>` + canvas). Benito's review on 5 October,
comparing it with Unimeet's `/instagram-plan` slides: the posts "follow my brand but
don't seem like they would convert or draw attention". Concrete causes found in the code
and the exports in `/tmp/blessed-moon-review/final-creative/`:

- **Wrong typefaces.** Every glyph is `Arial, Helvetica` or `Courier New`; the site is
  Space Grotesk + JetBrains Mono (`src/app/layout.tsx`). The SVG is rasterised as an
  image, so it can't see the page's `next/font` faces, and the wrapper's width estimates
  (`units()`) are Arial's.
- **A box around everything.** Every template draws a filled, stroked rectangle and puts
  the copy inside it. The boxes are mostly empty: about 60% of the cover panel is blank,
  the two compare panels are mostly air. It reads as a wireframe.
- **Flat hierarchy.** An 86px headline over a 36–40px body in a panel of similar weight;
  the `01 ENTENDER / 02 DECIDIR / 03 AGIR` tiles are printed on every statement slide
  regardless of content.
- **Chrome noise.** Header rule, `BLESSED_MOON / STUDIO`, footer rule,
  `blessed-moon.vercel.app` — a staging-looking URL — on every slide.
- **A weak close.** The CTA is a thin amber bar under a paragraph.

## 2. Planned changes

### 2.1 Brand fonts inside the SVG

- Add `@fontsource/space-grotesk` and `@fontsource/jetbrains-mono` as devDependencies
  (OFL; the official packaged files, not hand-downloaded ones), plus `fontkit` as a
  devDependency for reading metrics.
- `scripts/social-fonts.mjs` (new, `pnpm social:fonts`): copies the Latin woff2 files used
  by the art (Space Grotesk 400/500/700, JetBrains Mono 500/700) into
  `public/fonts/social/`, and writes `src/lib/social-font-metrics.ts` — advance widths
  (per 1 em) for every codepoint in those files' Latin subset, per face, plus the
  fallback width. Generated, committed, header comment says so.
- The SVG declares its own `@font-face` families (`BM Sans`, `BM Mono`) in a `<style>`:
  - **On-page preview:** `src: url(/fonts/social/…)` — same-origin, cached.
  - **Raster export:** `social-export.ts` fetches the same files once, base64s them and
    passes data URIs, because an SVG loaded as an `<img>` may not fetch external
    resources. Export waits for a decoded image before drawing.
  - `[VERIFY: embedded data-URI @font-face renders in an SVG-as-image in Chromium and
    WebKit — check with Playwright's chromium and webkit before relying on it]`
- `wrap()`/`fitted()` measure with the generated metrics (including letter-spacing),
  replacing the Arial estimate table.

Rejected: switching to Satori/`next/og` server rendering like Unimeet. It would get fonts
for free, but the builder is deliberately browser-only (uploads never leave the tab) and
the preview/export parity contract is built around one synchronous SVG function. Also
rejected: converting text to paths in the browser (needs a font parser in the client
bundle).

### 2.2 Layout language: type on the surface, no panels

New shared pieces inside `social-art.ts`:

- **Header:** crescent mark (integer cell size) + `BLESSED_MOON` in mono on the left,
  `03 / 06` on the right. No rule.
- **Kicker:** a 48×5 amber dash + uppercase mono label, as a lead-in, not a header.
- **Headline:** Space Grotesk 700, tight tracking (−0.03em), 1.02 line height, sized
  large first (≈128px portrait cover, ≈96px inner) and shrunk only to fit.
- **Accent line:** an optional second headline line in amber (field `accent`), so a cover
  can carry the question plus the hook in two colours.
- **Footer:** `@blessedmoon.studio` (Benito, 5 Oct) left, `SWIPE →` on the first slide of
  a carousel, nothing else. `SOCIAL_HANDLE` lives in `src/lib/site-config.ts`.
- No filled/stroked panels anywhere except where a frame is the content (the screenshot
  window, next doc).

### 2.3 Templates rebuilt on that language

The current six are replaced (names in brackets map legacy drafts on import):

| Template | Replaces | What it draws |
|---|---|---|
| `cover` | `statement` (as slide 1) | Kicker, very large headline, amber accent line, one-line meta. |
| `point` | `statement` | Giant amber numeral (`01`), headline, short amber rule, one paragraph. |
| `rows` | `steps`, `workflow` | Headline, then hairline-separated rows: label, optional detail, optional right-aligned amber value (`Label · detail · value` per line). |
| `compare` | `compare` | Two labelled halves split by a hairline, the second marked with the amber dash: no boxes. |
| `case` | `case` | Screenshot slide (restyled in the next doc). |
| `action` | `action` | Headline, an amber pill with the action (`Link in bio → Oishi case`), a smaller "save" line from the body. |

Each template gets portrait/square/story/landscape variants; landscape puts copy left and
art right instead of stacking. Story keeps the existing top/bottom safe zones.

### 2.4 Compatibility

- `readArtPost` accepts legacy template names and maps them (table above), so JSON drafts
  exported before this change still open. `accent` is optional (default empty, ≤ 120
  chars). Existing escaping, size caps and the image allowlist are untouched.
- `creativeSlides` keeps producing posts, mapped onto the new templates, until the copy
  doc replaces it.

## 3. Why

Fonts and boxes are most of the "generic template" impression; they are fixed in one
file without changing what the builder does or where files are made. Doing it first
gives the signature work (next doc) a real typographic base to sit on.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `package.json`, `pnpm-lock.yaml` | edit | `@fontsource/*`, `fontkit` devDependencies; `social:fonts` script |
| `scripts/social-fonts.mjs` | new | Vendors woff2 + generates metrics |
| `public/fonts/social/*.woff2` | new | Generated by the script (OFL, licence file copied alongside) |
| `src/lib/social-font-metrics.ts` | new | Generated metrics |
| `src/lib/site-config.ts` | edit | `SOCIAL_HANDLE` |
| `src/lib/social-art.ts` | edit | Fonts, measurement, new layout primitives and templates, legacy mapping |
| `src/lib/social-export.ts` | edit | Embeds fonts as data URIs for rasterising |
| `src/lib/social-creative.ts` | edit | Emits new template names |
| `src/components/social/post-builder.tsx` | edit | Accent field; template list |
| `scripts/check-post-builder.mjs` | edit | New template names; font assertion |
| `src/app/system/page.tsx` | edit | Specimen shows every template |

## 5. Verification

- `pnpm build` and `pnpm lint` pass.
- `scripts/check-post-builder.mjs` passes against a production preview, including all
  templates × four formats, legacy JSON import, escaping and the image allowlist.
- An exported PNG is visibly set in Space Grotesk (inspected by eye in a saved export,
  and checked in both Chromium and WebKit via Playwright).
- No rendered text overflows its frame in any template × format with the longest preset
  copy (visual review of a contact sheet of every slide).

## 6. Out of scope

New cover families, terminal frame, ASCII art, crescent crop (signatures doc); any copy or
language change (copy doc); publishing, deployment.

## Implemented result

- Space Grotesk 400/500/700 and JetBrains Mono 500/700 are vendored by
  `pnpm social:fonts` and embedded per §2.1. **[VERIFY] resolved:** an SVG drawn
  through `<img>` with data-URI `@font-face` renders the brand faces in both
  Playwright Chromium (the builder's own PNG export) and WebKit (a canvas raster of
  the live preview SVG). Neither packaged Latin subset contains `→` (checked with
  fontkit across every subset file), so arrows are drawn as paths.
- Templates are `cover`, `point`, `rows`, `compare`, `action` (this doc) plus `window`,
  `ascii`, `annotate` (signatures doc). Legacy names map on import and are covered by
  the check script.
- The footer is fitted to its width, so a 90-character footer can no longer leave the frame.
- Verification: `pnpm lint` (0 errors, the two existing boot warnings), `pnpm build`,
  and `scripts/check-post-builder.mjs` against `pnpm start -p 3194`, including all eight
  templates × four formats with long copy, legacy-template, ASCII and marker rejection
  on import.
