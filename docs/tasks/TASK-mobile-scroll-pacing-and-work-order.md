# TASK: Faster scroll pacing on phones, and an attention-first `/work` order

## Current scenario

Two complaints from Benito (6 October 2026): on a phone the scroll-driven pages
feel slow ("you need to swipe a lot to see progress"), and `/work` should lead
with the projects that draw the most attention.

Measured with Playwright against the dev server, page height in screens
(`scrollHeight / innerHeight`), after the stages settled:

| Route | 390×844 phone | 1440×900 desktop | Morph stage mode |
|---|---|---|---|
| `/` | 10.7 | 10.6 | pinned on both |
| `/work` | 20.0 | 13.5 | flow (content overflow) on both |
| `/about` | 5.7 | 8.6 | phone flow, desktop pinned |

Two different causes:

1. **Pinned stages cost the same number of screens on a phone as on a desktop.**
   `ScrollStage` reserves `heightMultiplier × 100dvh` (Hero 2, `PageHero` 1.6)
   and `ScrollMorphStage` reserves `heightPerLayer × 100dvh` per layer (1.6)
   plus end holds. A mouse wheel or trackpad flick covers a screen or more per
   gesture; a thumb swipe covers far less, so the homepage's ~8 screens of
   pinned crossfade take many swipes in which only an opacity changes.
2. **`/work` on a phone is long because every case is printed in full.** The
   stage already falls back to document flow there (each case is taller than the
   86dvh window), so pacing is not the problem — twelve `WorkCase` views, each
   with cover, tagline, full description, tags, outcome and CTA, stacked, are.

`STUDIO_PROJECTS` order today: Oishi, F&A Móveis, Trísion, Flora, ART'hur,
Prumo, Markado, Bee Dash, Sua Mesa Fit, UniMeet, Outubro, Renewable Pulse —
roughly "most recently added first", with the three newest appended at the end.

## Planned changes

### 1. Shorter pinned ranges on touch/narrow screens — `globals.css`, `scroll-stage.tsx`, `scroll-morph-stage.tsx`

Add a `--stage-pace` custom property on `:root` (default `1`), set to `0.6`
under `@media (max-width: 767px), (pointer: coarse)`. Both stages multiply their
inline wrapper height by it: `calc(N * var(--stage-pace) * 100dvh)`.

- Pure CSS, so no hydration mismatch and no extra JS/resize listener.
- Keyframe markers and `id` anchors are positioned as fractions of the wrapper
  (`calc(t * (100% - 100dvh))`), and progress is computed from the measured
  rect, so they scale with it — the crossfades, token handoffs and moon
  keyframes keep their order and relative timing, they just happen in fewer
  swipes.
- Expected homepage on a phone: ~10.7 → ~7 screens. Will be re-measured, not
  assumed.

Rejected: enabling Lenis `syncTouch` to "speed up" touch — it replaces native
momentum with synthetic inertia, which feels worse on iOS, not faster.
Rejected: dropping the pins on mobile altogether — the morph is the site's
premise and works fine on a phone; it's only over-allocated.

### 2. Compact case views on phones — `src/components/work/work-case.tsx`

Below `md`, hide the long `description` paragraph and the tag list (both stay
in full on `/work/[slug]`, which the case's CTA already links to). Cover,
tagline, outcome and the CTA remain, so each entry still says what it is and
what it achieved. Expected `/work` on a phone: ~20 → ~12 screens; re-measured.

### 3. Attention-first order — `src/lib/studio-data.ts`

Reorder `STUDIO_PROJECTS` only (no field changes; each project keeps its
catalog `index`, per `TASK-work-reorder-recent-first.md`). Proposed criteria,
in priority: a live link a visitor can open now, a distinctive visual first
impression, technical depth a CTO-level buyer recognises, and real-client work.

Order (confirmed by Benito, 6 October 2026):

1. Renewable Pulse — live, real grid data, the most "instrument" of them all
2. Flora — satellite pipeline, deepest engineering story
3. ART'hur — live, the most visually striking
4. Oishi — live, real client, clear business thesis
5. Trísion — live, multi-tenant brand platform
6. Bee Dash — live product (thatsbee.co)
7. F&A Móveis — live, real client
8. Prumo — live preview
9. Outubro Idiomas — preview
10. UniMeet — live v1
11. Sua Mesa Fit — live, 2024
12. Markado — 2025, no live link

This is a judgement about first impressions, not measured interest. If Umami
has click data per case, that should override it.

All consumers (`WorkIndex`, the morph layers, each case's `next` handoff,
`/work/[slug]`'s next-project chain) follow array order, so nothing else changes.

## Why

Mobile visitors are the majority for a link shared on Instagram/LinkedIn, which
is where the social plan sends people. If the first thirty seconds on a phone
is swiping through a crossfade, they leave before the work. On `/work`, the
first two or three entries are the only ones most visitors will see.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/app/globals.css` | edit | `--stage-pace` token, 0.6 on narrow/coarse |
| `src/components/scroll-stage.tsx` | edit | wrapper height × `--stage-pace` |
| `src/components/scroll-morph-stage.tsx` | edit | wrapper height × `--stage-pace` |
| `src/components/work/work-case.tsx` | edit | description + tags `hidden md:block` |
| `src/lib/studio-data.ts` | edit | reorder `STUDIO_PROJECTS` |
| `CLAUDE.md` | edit | note the pace token under the scroll-journey row |

Verification: re-run the screen-count measurement at 390×844 and 1440×900,
`scripts/check-page-scroll.mjs`, `pnpm lint`, `pnpm build`.

## Result (measured after the change)

| Route | Phone before → after | Desktop |
|---|---|---|
| `/` | 10.7 → 6.7 | 10.6 (unchanged) |
| `/work` | 20.0 → 16.8 | 13.5 (unchanged) |
| `/about` | 5.7 → 5.1 | 8.6 (unchanged) |

`/work` landed above the ~12 estimate: each compact case is still about one
phone screen (cover 227px, tagline, outcome, CTA, `next →` row), and the
twelve-row index is two. One project per screen was judged the right floor;
cutting the outcome too would leave entries that say what but not why.
`check-page-scroll.mjs` passed (30 checks on `/`, `/work`, `/about` and two
case pages, all viewports and motion modes); lint, typecheck and build clean.
