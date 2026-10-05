# TASK: ASCII reveal cover and quieter callouts

5 October 2026. Status: complete (the reveal was built, reviewed and retired, see the result). Follows `TASK-social-art-signatures.md` and
`TASK-social-copy-v3.md`.

## 1. Current scenario

Benito's review of the live plan page (5 October):

- **The Flora ASCII cover** ("what is this"). The `ascii` template turns the whole
  crop-stress screenshot into glyphs. A satellite map and a list of rows don't
  survive that, so the cover reads as texture. You can't tell it's a product, which
  defeats a cover whose job is to show the work.
- **The annotation markers** ("seems not professional"). `annotate` draws filled amber
  squares with a dark number on top of the screenshot, plus the same filled squares in
  the legend. They point well but look like stickers: heavy, and they cover the very
  detail they mark.

## 2. Planned changes

### 2.1 The reveal: ASCII becoming the real screen

- `ascii` gains `reveal` (0–100, default 100 = the current all-ASCII field). Below
  100, the real screenshot fills the field and the ASCII rendering covers only the
  left `reveal`% of it, cut by a 2px amber vertical line, the "scan line". The
  glyphs on the left and the pixels on the right are the same image at the same
  crop, so it reads as one screen being decoded: for Flora, "satellite pixels in |
  field tasks out".
- Alignment: the glyph grid and the image are both scaled to cover the field and
  anchored top-centre. The grid's aspect is the image's own aspect (cell ratio
  accounted for), so the two halves line up.
- The builder gets an "ASCII coverage" number input (0–100) on ASCII slides.
- `reveal: 100` stays available, for sources with strong shapes only (a logo, a
  product photo, a large headline). The Flora cover uses about 46.

### 2.2 Callouts instead of stickers

`annotate` changes from point markers to **regions with a spotlight**:

- `marks` entries may be `[x, y, w, h]` (percent of the visible window); old
  `[x, y]` points still validate and become a small square region around the point.
- The screenshot is dimmed by a 55% overlay of the surface colour, except inside each
  region (an SVG mask), so the eye goes where the post says.
- Each region gets a 1.5px amber outline, sharp corners as on the site, and a small
  tag on its top-left corner: amber mono numeral `01` on the dark panel colour, like
  the window's own title-bar label. No filled squares.
- The legend uses the same `01`/`02` amber mono numerals as plain text, not badges.

Rejected: leader lines from regions to labels outside the window. In a portrait slide
the window is full-width, so every line would cross the screenshot.

## 3. Why

Both fixes keep the devices (ASCII as the studio's signature; pointing at the
decision) but stop them from hiding the work. The reveal shows the real product on
the cover. The spotlight is the convention product teams use in their own launch
material, so the posts read like they come from a product studio.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/social-art.ts` | edit | `reveal` field and validation; split field; region marks, mask, outline, tags; legend numerals |
| `src/lib/social-posts.ts` | edit | Flora cover `reveal`; marks converted to regions for the four annotated posts |
| `src/components/social/post-builder.tsx` | edit | ASCII coverage input; marker field accepts `x, y, w, h` |
| `scripts/check-post-builder.mjs` | edit | Out-of-range `reveal` and region values rejected |
| `docs/social/09-production-workspace.md` | edit | Builder instructions |

## 5. Verification

- Build, lint and both social checks pass against a production server.
- Rendered review of the Flora cover and all four annotated slides: each region
  frames the element its legend names, nothing important is under a tag, and the
  dimmed remainder still reads as the product.

## 6. Out of scope

Animated reveal (the posts are stills), other cover changes.

## Implemented result

- **The reveal was built and rejected.** Benito on the result: "excellent idea but they are
  very very ugly", and of the glyph renders in general: "horrible, I don't like them at
  all". The cause: hand-rolled glyphs at 14–20px with an amber hot-spot ramp read as crude
  ASCII art, nothing like the site's AsciiObject (6px cells, edge-aware glyph choice, one
  soft grey). So the ASCII-screenshot template, `reveal`, the procedural moon,
  `social-ascii.ts`, its generated data and `pnpm social:ascii` are **removed**. Legacy
  drafts with `template: "ascii"` open as a window. The Flora cover is a plain window.
- **The moon is now the real one.** `scripts/social-moon.mjs` (`pnpm social:moon`) captures
  the AsciiObject specimen on `/system` with Playwright at 2× on a transparent background,
  then trims and saves `public/social/moon.png` with sharp (1000px, ≈310 KB). Previews load it
  by URL; exports embed it as a data URI beside the fonts.
- **Callouts** as planned in §2.2: a dim of everything outside the regions (one even-odd path,
  no ids), amber 2px outlines and numbered tabs. Legend numerals are amber mono text.
  Regions were measured against a 5% grid rendered over each screenshot.
- **Coherence audit of all 20 posts** (Benito: "then out of nowhere there's a number four
  slide"):
  - `studio-questions`: the list is now numbered (new `numbered` rows option), its deep
    dives run 03 → 04 in list order, and each carries a "Question n" eyebrow.
  - `fa-honest-price` / `confirmed-information`: the catalogue screenshot showed only
    priced products while the copy said three say 'ask'. A new capture of the live public
    F&A catalogue (`/projects/fa-moveis/consulte-preco.png`) shows a 'Consulte o preço'
    product beside priced ones, and both posts use it (one as an annotated slide).
  - `screenshot-context`: the formula now comes before its applied example.
  - `restaurant-answers`: the "menu was only JPEG" slide shows the menu, not the home page.
  - `oishi-condition`: an unverified outcome claim was replaced by what the page does.
  - `one-action`, `brief-questions`, `likes-intent`: their lists are numbered, matching the
    "five answers" / "3 perguntas" / "in this order" copy.
  - `flora-satellite`: the cost row now says what 4.667 and 4.0 measure.
- Windows are capped at a desktop screenshot's proportions; a taller window cropped the
  Oishi menu to "ardápio".
- Verification: lint (0 errors), build, both social checks on `pnpm start -p 3194`, a real
  builder PNG export of a moon cover, and contact sheets of all 20 posts reviewed again.
