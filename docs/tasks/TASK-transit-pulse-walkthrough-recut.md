# TASK — Recut the Transit Pulse walkthrough video

## 1. Current scenario

The Transit Pulse case study (`/work/transit-pulse`) ships a silent walkthrough
(`public/projects/transit-pulse/walkthrough.mp4`, referenced from the `video` field of
its `StudioProject` in `src/lib/studio-data.ts`). It was captured on 2026-11-03 with
headless Playwright against the deployed recorded demo
(`https://transit-pulse-tau.vercel.app/replay`) — see
`TASK-add-transit-pulse-case-study.md` and the `media-capture-playwright` memory.

Two problems, raised by Benito after watching it:

1. **Too small / too few vehicles.** It was recorded at 1280×800 and, worse, the playhead
   sat at the very start of the recording (≈11:30 Rio), where the compact replay export
   only has ~13 vehicles on screen. The map reads as empty and the window is small.
2. **Light mode only.** The replay app has no in-page theme toggle — it follows the
   viewer's `prefers-color-scheme`. Headless Chromium defaulted to light, so the whole
   tour is in "white mode." The app has a genuinely different, well-finished dark state
   (dark-teal Protomaps basemap, amber letreiro, cyan/amber marks) that the video never
   shows.

### What the recon established (so the recut is grounded, not guessed)

- The recorded window runs **11:27 → 13:24 Rio local** (`?t=` is UTC; Rio = UTC−3), ramping
  from 13 vehicles at the start to **~2,080 at 12:00, ~2,380 by 12:15, holding ~2,300–2,380
  through ~13:20**. `t` values before 14:27Z or after 16:24Z clamp to the ends.
- Dark mode is reachable purely via Playwright `colorScheme: "dark"` on the context — no
  toggle, no app change. Both themes render MapLibre + deck.gl correctly headless at
  1920×1200.
- Line **324 "Ribeira – Candelária"** has a GTFS reference trajectory (57 stops, destino/
  variante selector) — a reliable pick for the "static GTFS route" feature. The first chips
  in "Mais ônibus" (`GARAGEM`, `ESPECIAL`) are depot/pseudo-lines with no GTFS geometry, so
  they must not be used for the route shot.

## 2. Planned changes

- **Recapture `public/projects/transit-pulse/walkthrough.mp4`** with a headless-Playwright
  script (unimeet's Playwright, per the `media-capture-playwright` memory), at **1920×1200**
  (16:10 — matches the `aspect-[16/10]` container in `work/[slug]/page.tsx`, so no
  letterbox/distortion; 1.5× the old size), from a **busy midday minute (~12:00 Rio,
  ~2,080+ vehicles)**. One continuous silent tour with **two halves — light then dark** —
  each showing the real app: the honest "não é ao vivo" letreiro, the full metro fleet,
  60× playback with the timeline sweeping and the "Agora" stats ticking, colour-by-speed
  with its legend, and the Linhas tab drawing line 324's GTFS route + stops. Concatenate
  the two theme segments into a single h264 MP4 (`-crf`, `-an`, `+faststart`), trimming each
  segment's page-load lead-in.
- **Keep the poster** as `map.png` — but re-capture `map.png` too so the cover/poster shows
  the busy fleet (2,080+) rather than the old near-empty 13-vehicle frame, matching the new
  video's first frame. (The other three stills — `linha.png`, `velocidade.png`,
  `tabela.png` — already read well; leave them unless the busy minute clearly improves them.)
- **Update the `video.caption`** in `src/lib/studio-data.ts` to describe the fuller tour and
  the two themes, and **its PT translation** in `src/lib/i18n/pt.json`. If `map.png`'s
  alt/caption no longer matches (vehicle count), update those strings + PT too.

No component, routing, or data-shape changes — counts/filters/sitemap already derive from
`STUDIO_PROJECTS`. This is a media + copy refresh of one existing case study.

## 3. Why

The walkthrough is the case study's hero motion. Showing 13 vehicles in light-only
undersells both the product (a live map of Rio's *entire* bus + BRT fleet) and the craft
(the dark state is half the design work). A bigger frame at a busy minute, in both themes,
makes the page honestly represent what was built. Cost: a few minutes of headless capture
and a caption edit; no code risk.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `public/projects/transit-pulse/walkthrough.mp4` | replace | 1920×1200, busy minute, light+dark tour, silent h264 |
| `public/projects/transit-pulse/map.png` | replace | busy-fleet cover/poster (~2,080 vehicles) to match the video's first frame |
| `src/lib/studio-data.ts` | edit | `video.caption` (and cover/screenshot alt if vehicle count referenced) |
| `src/lib/i18n/pt.json` | edit | PT translations for the changed strings |

Verify: `pnpm exec tsc --noEmit`, `pnpm exec eslint`, `pnpm build` (route still statically
generated), then commit (no `Co-Authored-By`).

## Outcome (2026-11-03)

Shipped. `walkthrough.mp4` recaptured at **1920×1200** (16:10, up from 1280×800) as one
continuous silent tour with two halves — **light then dark** (`colorScheme` on the Playwright
context; the app has no toggle, it follows `prefers-color-scheme`). Starts at **12:00 Rio
(~2,080 vehicles on screen, ~2,577 in the snapshot)** instead of the old 13. Each half shows:
the honest "não é ao vivo" letreiro, the full metro fleet, 60× playback with the timeline
sweeping and the "Agora" stats ticking, colour-by-speed with its legend, and line **324
(Ribeira–Candelária)**'s GTFS reference route + 57 stops; the light half also has a zoom beat.
~60s, 12.7 MB (well under Lunares's 39.8 MB; `preload="none"` so it never touches first paint).
`map.png` cover/poster re-shot at the same busy 12:00 minute. Caption + cover/screenshot alts
updated EN + PT. `tsc`/`eslint`/`pnpm build` all green; `/en|pt/work/transit-pulse` still
statically generated.
