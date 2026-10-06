# TASK: Portuguese launch trio

5 October 2026. Status: complete. Follows `TASK-social-profiles-and-rebalance.md`.

## 1. Current scenario

Benito is opening the Portuguese Instagram first ("I can grow quicker with my friends") and
wants to launch with three posts at once: what Blessed Moon is, the UniMeet case and a service
post. The library (`src/lib/social-posts.ts`) has 8 Portuguese posts, none of them an intro, no
Portuguese UniMeet case, and `which-service` covers only the social media service.

## 2. Planned changes

Additive only. Benito: "dont delete any current post i have". No existing post, week or id changes.

- `src/lib/social-posts.ts`: three new Portuguese carousels.
  - `apresentacao`: who builds (Benito, alone), what gets built, the one-question start,
    three real projects, a follow close.
  - `unimeet-feiras`: the UniMeet case in Portuguese (standardised fair page, frozen quote,
    the UTC-date bug), screens labelled as the v2 proposal like the English post.
  - `o-que-eu-faco`: the four things a client can hire (site, catálogo, sistema, estratégia
    de redes) and the four steps from the homepage's "How we work".
- `src/lib/social-plan.ts`: three `Story` rows at **week 0** (launch), so they sort before
  week 1 without renumbering anything.
- `src/app/social-plan/page.tsx`: the week list gains a "Launch" row for week 0; the library
  count reads 11 Portuguese drafts.
- `scripts/check-social-strategy.mjs`: the Instagram plan now renders 25 posts.

Out of scope: the Portuguese profile's pins (unchanged), English posts, LinkedIn.

## 3. Why

A new account's first visitors see the grid, not one post. The trio answers who, proof and
what to hire. Every fact comes from `src/lib/studio-data.ts` and the homepage copy.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/social-posts.ts` | edit | Three new carousels appended |
| `src/lib/social-plan.ts` | edit | Three new stories, week 0 |
| `src/app/social-plan/page.tsx` | edit | Launch row, count |
| `scripts/check-social-strategy.mjs` | edit | 22 → 25 Instagram posts |

## 5. Verification

- `pnpm lint` and `pnpm build` clean.
- `/instagram-plan` shows the three posts first in the Portuguese set; each cover headline is
  ≤ 12 words; `/post-builder` lists them as starting points and renders every slide.
