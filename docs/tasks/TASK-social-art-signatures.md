# TASK: social art signatures — the work as the hook

5 October 2026. Status: complete. Second of three; depends on
`TASK-social-art-foundations.md`.

## 1. Current scenario

After the foundations task the slides are set in the brand's type, but nothing in them is
uniquely Blessed Moon: the site's identity (the ASCII moon, the pixel crescent, the
terminal window) appears only as a 30px logo. UniMeet carries its half-mark on every cover;
Blessed Moon has no equivalent. The best proof, real project screenshots
(`public/projects/*`), appears once, small and flat, on slide 5. The agency corpus
Benito collected (`/tmp/blessed-moon-review/agency-covers.png`, audit
`docs/social/11-instagram-corpus-audit.md`) is led by work in context: Clay's billboard,
Ramotion's phone, Refokus's framed site. The current templates never use that pattern.

## 2. Planned changes

### 2.1 Three signature devices (in `social-art.ts`)

1. **Terminal window frame.** The site's own window language (`terminal-panel.tsx`):
   1px panel-edge border, a title bar with a mono label (`~/work/oishi`), the trailing
   `TitleRule`, an optional status on the right. No traffic-light dots; the site rejected
   that "templated terminal move". Screenshots render inside it, cropped
   (`xMidYMin slice`) so the important top of the page fills the window instead of being
   letterboxed.
2. **The crescent at display scale.** `LOGO_PATH` drawn at an integer cell size (≈60px
   cells), bleeding off the bottom-right edge as a cropped shape. It plays the role of
   UniMeet's half-mark: you recognise the post before you read it.
3. **ASCII rendering.**
   - *Moon:* a deterministic procedural ASCII sphere (lit hemisphere, terminator, hashed
     craters) using the site's glyph ramp, in `src/lib/social-ascii.ts`. Synchronous and
     pure, so preview and export stay one function.
   - *Screenshot:* the same glyph mapping over a luminance grid. For the allowlisted
     portfolio images the grids are generated at build time by
     `scripts/social-ascii.mjs` (sharp, already in the tree via Next) into
     `src/lib/social-ascii-data.ts`. For an uploaded screenshot, `localScreenshot` computes
     the grid from the canvas it already draws. Stored on the slide as `ascii`
     (validated: ramp characters + newlines only, ≤ 24k chars).
   - Brightest glyph levels render in amber, the rest in muted ink, grouped into runs so
     a slide stays at a few hundred `<tspan>`s.

### 2.2 Cover families and inner templates

| Template | Use | Composition |
|---|---|---|
| `cover` + `art: "crescent"` | Question/hook covers | Huge headline + amber accent; crescent crop bottom-right |
| `cover` + `art: "moon"` | Studio/service covers | ASCII moon at large scale behind/beside the headline |
| `window` | Work reveal (cover or inner) | Terminal window with the screenshot occupying ~55% of the frame; headline + accent below (portrait) or beside (landscape) |
| `ascii` | Stop-the-scroll cover | The screenshot as an ASCII field, full bleed, with the headline set over a solid band |
| `annotate` | Teardown | Window + numbered amber markers at given positions on the screenshot, legend rows below (`rows` styling) |

- `annotate` positions live on the slide as `marks: [x, y][]` (percent of the image,
  0–100, ≤ 6), editable in the builder as one `x, y` per line; body lines are the
  legend. Presets set positions for the approved screenshots.
- Builder: an "Art" choice for covers (none / crescent / moon), an "ASCII render" option
  when the slide has a screenshot, and a marker-positions field for `annotate`.
- Before/after was considered and rejected: no "before" screenshots exist for any
  project, and inventing one would break the "no invented evidence" rule. `annotate`
  delivers the teardown honestly.

## 3. Why

A post has to be recognisable before it's read and has to show proof, not describe it.
The window and the ASCII field turn existing project screenshots into the hook; the
crescent gives the series a consistent mark. All three come from the website, so they
extend the brand rather than decorating it.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/social-ascii.ts` | new | Glyph ramp, procedural moon, luminance → glyph grid |
| `scripts/social-ascii.mjs` | new | Build-time grids for approved screenshots (`pnpm social:ascii`) |
| `src/lib/social-ascii-data.ts` | new | Generated grids |
| `src/lib/social-art.ts` | edit | Window frame, crescent crop, ASCII layers, `window`/`ascii`/`annotate`, `art`/`ascii`/`marks` fields + validation |
| `src/lib/social-export.ts` | edit | Compute ASCII on upload; keep portable embedding |
| `src/components/social/post-builder.tsx` | edit | Art, ASCII and marker controls |
| `scripts/check-post-builder.mjs` | edit | New templates × formats; marker and ASCII validation |
| `src/app/system/page.tsx` | edit | Specimen covers the new templates |

## 5. Verification

- Build, lint and `check-post-builder.mjs` pass; every template × format exports at the
  right pixel size; malformed `ascii`/`marks` in imported JSON are rejected.
- A contact sheet of all covers is reviewed against the UniMeet sheet and the agency
  corpus: each cover has one dominant element (window, ASCII field, crescent or moon) and
  a headline readable at feed thumbnail size (≈360px wide).
- Rasterising a slide with an ASCII field stays under 1s in Chromium (timed in the check).

## 6. Out of scope

Copy, languages, which post uses which cover (copy doc). Animated/video covers.

## Implemented result

- **Crescent:** the first render cropped it by the right and bottom edges, and it read
  as a bracket, because cropping a side removes the horns. It now sits inside the
  right margin and is cropped by the bottom edge only (20%). Text beside it is
  narrowed by the mark's width.
- **Moon:** a 56-column procedural sphere (≈620px on portrait), 90% visible in the
  bottom-right. JetBrains Mono's ligatures are switched off in every ASCII block,
  because `===`/`--` otherwise merge into bars. The moon reads best on Midnight; on
  paper its dense glyphs are heavy, so presets use it on dark.
- **ASCII screenshots:** grids are 112 columns, ≤ 72 rows, made by
  `pnpm social:ascii` (sharp, now a devDependency) from the allowlist in
  `src/lib/social-art-images.json`, which also replaced the hard-coded preset map.
  Light pages are inverted, so the background is empty space. Dark, photographic
  pages (Oishi's home) come out sparse. Dense, structured screens (Flora's stress
  map, the F&A product page) make the strongest covers, and the copy task picks
  accordingly.
- Annotated screenshots use fixed amber markers with a dark halo, so they read on
  any screenshot. The legend rows reuse the same numbered badges.

**Superseded in part (5 October, `TASK-social-art-reveal-and-callouts.md`):** Benito found the
hand-made ASCII renders "horrible". The procedural moon and the ASCII-screenshot template are
removed; the moon on posts is now a capture of the site's own AsciiObject.
