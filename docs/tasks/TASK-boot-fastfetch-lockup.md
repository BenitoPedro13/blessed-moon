# TASK: Rebuild the boot screen as a fastfetch-style brand lockup

## 1. Current scenario

`src/components/boot-sequence.tsx` renders the loading overlay. Its phase machinery is
sound and stays: `booting → gating → exiting → hidden`, a real scroll-to-begin gate with
keyboard and button equivalents, `MAX_WAIT_MS` / `GATE_TIMEOUT_MS` so it can never trap a
visitor, and reduced-motion skipping the gate outright (`TASK-sound-and-boot.md`,
`TASK-boot-sequence-gate.md`).

What's wrong is entirely what it *looks* like:

- **It sits at the bottom.** The overlay is `flex flex-col justify-end`, so the whole thing
  is pinned to the lower edge of an otherwise empty black screen.
- **It's tiny.** `text-[11px]` mono for five log lines. On a 15" display that is a fleck in
  the corner of a full-bleed overlay.
- **No colour.** Every line is `text-muted-foreground`. The brand's one accent doesn't
  appear until the gate buttons show up.
- **No motion.** All five lines render at once. The file's own comment explains why: two
  earlier attempts at staggering (a recursive `setTimeout` chain, then a mount-time reset
  to blank before re-revealing) could show *nothing*, and a loading screen that renders
  nothing is worse than one that doesn't animate. So the animation was removed rather than
  made safe.
- **The content is filler.** `loading brand tokens ......... ok` is a fake progress log —
  the site is not measuring any of those things, so the lines say nothing true.

The requested direction is `fastfetch`: art on the left, aligned `key: value` rows on the
right, colour, and the palette swatch row at the bottom. That form fits this brand
unusually well — it is a real terminal program, and it reports what a machine *is* rather
than pretending to load.

## 2. Planned changes

### 2.1 The layout — art left, facts right, centered

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│           ██          blessed_moon@studio                    │
│       ████████        ────────────────────────────────       │
│     ██████            studio ......: Blessed Moon Studio     │
│     ████              discipline ..: Strategy · Design · …   │
│   ██████              stack .......: Next.js · Tailwind · …  │
│     ████              scene .......: ASCII moon · 5 keyframes│
│     ████              type ........: Space Grotesk / JetBrains│
│     ██████            accent ......: #ff6a1f                 │
│       ████████        sound .......: muted                   │
│           ██          status ......: ready ▌                 │
│                       ███ ███ ███ ███ ███ ███                │
│                                                              │
│  ── enable sound? [enable] [continue muted] ── scroll to begin│
└──────────────────────────────────────────────────────────────┘
```

Centered, not bottom-pinned. Mono at `13px` rather than `11px`. Stacked on phones: art
above, rows below, the leader dots dropped where the column is too narrow for them.

### 2.2 The art is *our* crescent, not a moon

`src/lib/logo-mark.ts` documents the mark as "rasterized onto a 12×12 grid, then traced
into a single outline path." That raster is the thing an ASCII version needs, so it becomes
real exported data (`LOGO_ROWS`) rather than a fact only recorded in a comment — with a note
that it and `LOGO_PATH` describe the same mark and must stay in sync.

Each filled cell renders as **two** block characters, empty as two spaces. That's not
decoration: the monospace cell is 1:2 (`--cell-w: 9px`, `--cell-h: 18px`), so one character
per cell would render the crescent at half width — visibly squashed. Two per cell makes the
12×12 grid land square, and it is the same reasoning already written down in
`cell-grid.tsx`.

### 2.3 The rows say true things

Filler replaced with facts about the studio and this build. Keys in amber, dotted leaders in
the faintest surface colour, values in foreground:

| key | value |
|---|---|
| `studio` | Blessed Moon Studio |
| `discipline` | Strategy · Design · Engineering |
| `stack` | Next.js · Tailwind · WebGL |
| `scene` | ASCII moon · 5 keyframes |
| `type` | Space Grotesk / JetBrains Mono |
| `accent` | `#ff6a1f` |
| `sound` | live — `muted` or `on`, reflecting the actual `useSound()` state |
| `status` | `ready`, with a blinking caret after it |

`sound` is deliberately the one live field: it's the state the gate is about to ask the
visitor to change, so it should already be on screen as a fact rather than appear only as a
question.

### 2.4 Colour, and the swatch row

fastfetch closes with the terminal's ANSI palette. The honest translation here is **this
site's own palette** — `--background`, `--panel`, `--border`, `--muted-foreground`,
`--foreground`, `--primary` — as six blocks. It shows the tokens the page is built from
instead of colours this site never uses, and it puts the one warm hue at the end of a row of
cool ones, which is the palette's entire argument in a single line (`CLAUDE.md` §0
"Surfaces are cool, the accent is warm"). No second accent is introduced.

### 2.5 Motion, done in a way that cannot show nothing

This is the constraint the current file was written around, so it is the design problem, not
an afterthought. **All animation is CSS `@keyframes` with `animation-fill-mode: backwards`,
driven by an inline `animation-delay` per element.** No JS timers, no state machine, no
mount-time blanking.

The direction matters: the element's *base* style is its final, visible state, and the
animation only supplies an earlier hidden state to fill backwards from. So if animations
never run — reduced motion, a stalled main thread, a browser that ignores them — every
element is already at `opacity: 1` and correct. The failure mode that killed the previous
two attempts is structurally impossible here.

Four movements, in one orchestrated sequence rather than four scattered effects:

1. **Art** — rows wipe in top to bottom, ~40ms apart, each fading up from `translateY(4px)`.
2. **Rows** — after the art, each row's value wipes left-to-right via `clip-path: inset(0
   100% 0 0) → inset(0)` on a `steps()` timing function, which reads as typing without
   per-character state.
3. **Swatches** — the six blocks scale in from `scaleY(0)`, left to right, last.
4. **Caret** — a steady blink after `ready`, the only thing still moving once the sequence
   settles.

Under `prefers-reduced-motion` the whole sequence is suppressed in one `@media` block and
the screen renders complete and static — matching how `ScrollMorphStage` treats reduced
motion (absent, not compressed).

### 2.6 What is *not* changing

The phase machinery, the gate, both timeouts, the sound prompt, the `Begin` button and its
keyboard equivalents. This is a visual rebuild of what the overlay renders, not a change to
how it behaves or when it releases.

## 3. Why

**What it unblocks.** The boot screen is the first thing every visitor sees, and right now
it undersells the site behind it: a fleck of grey text in the bottom corner, then a
full-bleed WebGL moon. It's also the one place a brand can state what it is without it
reading as marketing copy — a fastfetch lockup is a machine describing itself, which is
exactly the "calm, precise, technical soul" register in `CLAUDE.md` §0.

**What it costs.**

- More markup on the critical first paint. Mitigated by it being static text and CSS —
  no images, no fonts beyond the two already loading, no JS beyond what exists.
- The art is a second copy of the logo's geometry. Mitigated by making the raster exported
  data with an explicit sync note, rather than a hand-drawn moon that would drift from the
  mark immediately.
- Eight rows of facts can go stale (the stack line especially). They are copy, and they sit
  in one exported array, so they are as maintainable as any other copy on the site.

**Why not** just center the existing log and enlarge it: it would still be five lines of
fake progress. The complaint was about presence and life, and a bigger version of filler is
still filler.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/lib/logo-mark.ts` | edit | Exports `LOGO_ROWS`, the 12×12 raster `LOGO_PATH` was traced from |
| `src/lib/boot-info.ts` | new | The `key: value` rows and the palette swatch tokens, as data |
| `src/components/boot-sequence.tsx` | edit | New render: centered art + rows + swatches + gate. Phase machinery untouched |
| `src/app/globals.css` | edit | `@keyframes` for the four movements + one reduced-motion block |
| `src/app/system/page.tsx` | edit | Panel for the boot lockup (`CLAUDE.md` §3.1) |
| `CLAUDE.md` | edit | Stack table "Sound / loading" row |
| `README.md` | edit | Status section |

## 5. Verification

- `pnpm build` and `pnpm lint` clean.
- The art column renders square, not squashed, at 390px / 768px / 1440px; the lockup stacks
  on phones without the rows wrapping mid-value.
- With animations force-disabled in devtools, every element is present and legible — the
  specific regression this design is built to prevent.
- `prefers-reduced-motion`: static, complete, gate skipped as today.
- The gate still requires a real scroll-equivalent action; `Begin` and the keyboard paths
  still work; neither timeout regressed.
