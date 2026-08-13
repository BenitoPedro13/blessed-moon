# TASK: Centre the logo mark on its own bounds, not on the 12×12 grid

## 1. Current scenario

`src/lib/logo-mark.ts` holds one shared outline path for the pixel crescent, traced from a
12×12 raster. Every consumer draws it as if the mark filled that grid:

| File | What it does | What actually renders |
|---|---|---|
| `src/components/logo-mark.tsx` | `viewBox="0 0 12 12"` | crescent in the **left half** of a square box |
| `src/app/icon.tsx` (favicon) | same viewBox at 32px | same, off-centre |
| `src/app/apple-icon.tsx` | scales by `gridPx / 12`, then centres *the grid* | padding is symmetric around the grid, so the mark itself sits left and high |
| `src/app/opengraph-image.tsx` (+ `twitter-image.tsx`) | `scale(220 / 12)` in a 220×220 svg | mark sits left of the centred text column below it |

The mark occupies x 0–6 and y 0–11 of that grid — it is 6 wide by 11 tall in a 12×12 box.
So every one of those renders carries 6 units of dead space on the right and 1 at the
bottom, and nothing that claims to be centred is. In the nav, at `h-4 w-4`, that is a
crescent pushed ~4px left inside its own box, sitting closer to the wordmark than intended.

Found while building the boot lockup (`TASK-boot-fastfetch-lockup.md`), which needed the
mark at display size and had to crop it — that crop is already exported as `LOGO_BOUNDS`.

## 2. Planned changes

**One rule: every consumer measures the mark by `LOGO_BOUNDS` (6×11), never by the grid.**

- **`src/lib/logo-mark.ts`** — drop `LOGO_GRID_SIZE`. It described the raster the path was
  traced from, not the box the path fills, and every misuse above is a consumer reaching for
  it because it was the only number available. The 12×12 raster stays documented in the
  file's comment, where it is a fact about how the mark was made rather than a measurement
  anyone should scale by.
- **`src/components/logo-mark.tsx`** — `viewBox="0 0 6 11"`. Callers keep passing square
  classes (`h-4 w-4`); SVG's default `preserveAspectRatio` then centres the crescent in that
  box at full height. No caller changes.
- **`src/app/icon.tsx`** — 2px per raster cell → a 12×22 mark centred in 32×32 (offsets 10,
  5). Integer cells keep pixel art crisp at favicon size, which a "fit to height" scale
  (28 / 11 = 2.54) would not.
- **`src/app/apple-icon.tsx`** — 12px per cell → 72×132 in 180×180, genuinely centred. Keeps
  the existing intent (padding, because iOS masks the corners) with the mark's real size.
- **`src/app/opengraph-image.tsx`** — 20px per cell, and the `<svg>` sized to the mark
  (120×220) instead of a square. The surrounding flex column then centres it against the
  headline for free, and the `transform` goes away.

Not doing: recentring the path data itself (`translate(3, 0.5)`). The mark's coordinates are
integers on purpose — that is what keeps the pixel edges crisp and the boot art seam-free —
and a half-unit offset to centre 11 rows in a 12-row box would give that up to fix framing
that belongs to the viewBox.

## 3. Why

The favicon, the touch icon, the share image, and the nav are the four places the brand
appears at its smallest and least forgiving, and all four are currently off-centre for the
same reason. It also removes the constant that caused it, so the next consumer can't repeat
the mistake.

Cost: the nav mark shifts a few pixels right and the OG mark moves to the text column's
centre line — both intentional. Generated images change, so caches (and any pinned OG
scrape) will show the old framing until refreshed.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/lib/logo-mark.ts` | edit | Drop `LOGO_GRID_SIZE`; `LOGO_BOUNDS` becomes the only measurement |
| `src/components/logo-mark.tsx` | edit | viewBox from bounds |
| `src/app/icon.tsx` | edit | 2px cells, centred |
| `src/app/apple-icon.tsx` | edit | 12px cells, centred |
| `src/app/opengraph-image.tsx` | edit | 20px cells, svg sized to the mark |
| `src/components/boot-sequence.tsx` | — | already on `LOGO_BOUNDS`, unchanged |

## 5. Verification

- `pnpm build` / `pnpm lint` clean.
- `/icon`, `/apple-icon`, `/opengraph-image` fetched as PNGs and looked at: crescent centred,
  edges crisp, no clipping.
- Nav mark centred in its box at 1440px and on a phone width.
