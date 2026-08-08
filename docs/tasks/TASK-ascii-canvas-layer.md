# TASK: WebGL ASCII canvas background + scroll-driven morph

## 1. Current scenario

The homepage (`TASK-homepage-sections.md`) is built as static sections with no
atmosphere layer — `body` just paints the flat `bg-background` (`#050505`) token. There is
no canvas, no WebGL code, and no scroll-tracking anywhere in the repo yet. `/work`,
`/about`, `/contact` don't exist. This is the "next step" flagged in `CLAUDE.md` §0.

## 2. Planned changes

### Rendering approach

Raw **WebGL2**, hand-written (no Three.js / no new dependency). The two references in
`docs/design-handoff.md` describe two separable techniques:

- **ASCII look** (offscreencanvas.com/webgl-ascii): downsample the viewport into a
  character grid, sample a luminance value per cell, and index into a pre-rendered glyph
  atlas texture (8 glyphs, light → dense) to pick which character to draw in that cell.
  This is a post-process step over *some* rendered scene.
- **Scroll morph** (offscreencanvas.com/webgl-scrolling-animations): their example
  morphs real 3D geometry via Three.js morph targets, driven by scroll percentage.

Our "scene" is an abstract full-bleed field, not 3D geometry, so vertex morph targets are
more machinery than the effect needs. **Alternative considered and rejected:** pull in
Three.js for real mesh morphing — rejected because it's a new dependency for a 2D-feeling
background effect, and conflicts with §2.2's "no off-the-shelf package" framing for this
layer. Instead: each keyframe state (mesh/noise field, crescent-moon glyph, circuit-board
lines, screenshot-silhouette blocks, dissolve) is a procedural 2D SDF function in the
fragment shader; scroll progress drives a blend uniform (`uMorph`, keyframe index + 0–1
progress) that interpolates the luminance field *before* the ASCII glyph post-process runs
on it. Everything happens in one fragment shader pass over a fullscreen triangle — no
scene graph, no geometry buffers beyond the two triangles.

### Keyframe → section mapping (needs your confirmation — see below)

The design handoff's Interactions section names keyframes as: **hero mesh → crescent-moon
entering About → circuit-board entering Services → screenshot silhouette entering Work →
dissolve at Contact.** Only the homepage exists today, so I'm mapping this onto homepage
sections as the closest fit, flagging the two inexact spots per `CLAUDE.md` §0 ("flag
before changing"):

| Keyframe | Shape | Homepage section it's wired to | Notes |
|---|---|---|---|
| 0 | mesh / noise field | Hero | matches spec |
| 1 | crescent-moon glyph | `01 / ABOUT` (About teaser) | matches spec exactly |
| 2 | circuit-board lines | `02 / SERVICES` (Services grid) | matches spec exactly |
| 2 (held) | circuit-board lines | `03 / HOW WE WORK` | spec defines no distinct shape here; holding previous state rather than inventing one |
| 3 | screenshot silhouette | `04 / SELECTED WORK` | spec says "entering **Work**" (the future `/work` page) — closest homepage equivalent is Selected Work |
| 4 | dissolve → plain dark | `05 / PRICING` → footer | spec says "at **Contact**", which isn't a homepage section — using the last section before the footer instead, since Contact doesn't exist on this page |

When `/work` and `/contact` are built as their own routes, keyframes 3 and 4 should
probably move there and the homepage's tail sections may just hold at keyframe 2 or fade
early — that's a follow-up task, not this one.

### Files

- **`src/lib/ascii-canvas/shaders.ts`** (new) — vertex shader (fullscreen triangle, no
  attributes needed — computed from `gl_VertexID`) and fragment shader source as template
  strings: SDF helpers for the 5 keyframe shapes, blend/interpolation logic driven by
  `uMorphIndex`/`uMorphProgress`, and the ASCII glyph-atlas sampling pass.
- **`src/lib/ascii-canvas/glyph-atlas.ts`** (new) — builds the 8-glyph light→dense atlas
  by drawing characters (JetBrains Mono, matching the brand mono font already loaded in
  `layout.tsx`) onto an offscreen 2D `<canvas>`, returns the `ImageData` for texture
  upload.
- **`src/lib/ascii-canvas/scroll-progress.ts`** (new) — reads `data-ascii-keyframe`
  elements from the DOM, and on each `requestAnimationFrame` computes a continuous
  `{ index, progress }` from `getBoundingClientRect()` (no `IntersectionObserver` — that's
  stepped/threshold-based and would make the morph feel like a jump-cut instead of a
  scroll-linked blend).
- **`src/components/ascii-canvas.tsx`** (new) — client component (`"use client"`).
  Feature-detects `WebGL2RenderingContext` support; if unavailable, renders nothing
  (falls back to the existing flat `bg-background`, satisfying the "never blank/broken"
  rule in `CLAUDE.md` §0). Owns the GL context, compiles/links the shader program, uploads
  the glyph atlas texture once, runs the `rAF` loop, updates `uResolution`/`uMorph*`/`uTime`
  uniforms, handles resize (`ResizeObserver`), pauses the loop on
  `document.visibilitychange` (hidden tab) and respects `prefers-reduced-motion` (renders
  one static frame at the current scroll keyframe instead of animating).
- **`src/app/layout.tsx`** (edit) — mount `<AsciiCanvas />` as the first child of `body`,
  `fixed inset-0 -z-0 pointer-events-none`; wrap `{children}` in a `relative z-10`
  container so page content stacks above it. `bg-background` stays on `body` as the
  pre-paint/fallback color.
- **`src/components/homepage/hero.tsx`**, **`about-teaser.tsx`**, **`services-grid.tsx`**,
  **`how-we-work.tsx`**, **`selected-work.tsx`**, **`pricing-table.tsx`** (edit) — add a
  `data-ascii-keyframe="<n>"` attribute (or a shared `id`) on each section's root element
  per the mapping table above, so `scroll-progress.ts` has something to read. No visual/
  markup changes otherwise.

## 3. Why

This is the last major piece of the homepage's design intent (`docs/design-handoff.md`
Interactions) and the explicit "next step" in `CLAUDE.md` §0. Doing it as one hand-written
shader pass (vs. a 3D scene + library) keeps the bundle light and matches the TUI/ASCII
aesthetic, which is inherently 2D/grid-based rather than geometric. The keyframe mapping
table makes an interpretation call explicit rather than silently guessing at section
boundaries that don't exist yet (`/work`, `/contact`).

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/lib/ascii-canvas/shaders.ts` | new | vertex + fragment shader source, SDF shape states, morph blend |
| `src/lib/ascii-canvas/glyph-atlas.ts` | new | offscreen-canvas glyph atlas texture builder |
| `src/lib/ascii-canvas/scroll-progress.ts` | new | rAF-driven continuous scroll → keyframe/progress reader |
| `src/components/ascii-canvas.tsx` | new | WebGL2 canvas component: context, program, RAF loop, resize, visibility/reduced-motion handling, fallback |
| `src/app/layout.tsx` | edit | mount canvas behind content, restack `{children}` to `relative z-10` |
| `src/components/homepage/hero.tsx` | edit | `data-ascii-keyframe="0"` |
| `src/components/homepage/about-teaser.tsx` | edit | `data-ascii-keyframe="1"` |
| `src/components/homepage/services-grid.tsx` | edit | `data-ascii-keyframe="2"` |
| `src/components/homepage/how-we-work.tsx` | edit | holds keyframe 2, no new shape |
| `src/components/homepage/selected-work.tsx` | edit | `data-ascii-keyframe="3"` |
| `src/components/homepage/pricing-table.tsx` | edit | `data-ascii-keyframe="4"` (dissolve) |
