# TASK: posts from the new projects, profile setup, LinkedIn coherence

5 October 2026. Status: complete. Follows `TASK-add-unimeet-outubro-pulse.md`.

## 1. Current scenario

Benito's review on 5 October, after the coherence audit:

- "Most posts showcase Fátima's, which is one of my simplest projects." In the English set,
  F&A Móveis carries `fa-honest-price` in full, the annotated example in `one-action`, the
  window in `smallest-system` and the localhost story in `studio-questions`.
- "See if we could also create posts with the newly added projects."
- "Also check the LinkedIn strategy so it is coherent, and UniMeet's has much more things like
  suggested profile, suggested pins, suggested highlights; we do not." UniMeet's
  `/instagram-plan` shows a proposed profile card (name, bio, link), pinned posts and
  highlights; Blessed Moon's plans have only grids and briefs.

## 2. Planned changes

### 2.1 English set: lead with the strongest work (`social-posts.ts`, `social-plan.ts`)

- **New `renewable-pulse` post:** "No synthetic data. Anywhere." Dashboard cover; sources;
  "polled, not pushed" said plainly; replays that don't duplicate (366,336 readings, zero
  duplicates); the pipeline-health panel; close.
- **New `unimeet-quote` post:** "The price on the page is the price on the invoice." Fair-tour
  cover (v2, labelled a proposal in the window label and alt text); one pricing function for
  preview and server; frozen at submission; a forged price stripped; close. It replaces
  `fa-honest-price` in English. That story stays in Portuguese as `confirmed-information`.
- **New `outubro-destravar` post:** "A brand's own verb became the hero." Home cover; generic
  unlock icon vs the untangling cord; three locales with their own URLs; WebGL left out for
  phones; close. Labelled "in progress" in its kicker.
- **`one-action`:** the worked example becomes UniMeet's fair page (every fair page ends in
  one registration form), annotated, instead of the F&A product page.
- **`strategy-contents`:** gains a proof slide: UniMeet's delivered Instagram plan in a
  window, "A plan we delivered", so the service post shows real work.
- `smallest-system` keeps F&A as one of its three systems; `studio-questions` keeps the
  localhost story. F&A stays the lead only in the Portuguese set, where a small-business
  story fits the audience.
- English becomes 14 posts over seven weeks, ordered so the strongest proof comes first:
  W1 one-action + renewable-pulse · W2 markado-slot + smallest-system · W3 unimeet-quote +
  studio-questions · W4 flora-satellite + screenshot-context · W5 prumo-credit +
  strategy-contents · W6 outubro-destravar + bee-dash-metrics · W7 headless-shopify +
  likes-intent.
- Captions and LinkedIn texts are written for each new or changed post; facts only from
  `studio-data.ts` and the projects' own docs.

### 2.2 Profile setup, as UniMeet has it (`social-plan.ts` `PROFILES`, new `ProfileSetup`)

For each account, rendered on its plan page before the grid:

- **Instagram, English (`@blessedmoon.studio`):** display name, a bio within Instagram's
  150-character limit, the link (a tagged `/work` URL), a professional-account category,
  three pinned posts and four highlights (Work, Process, Services, Start).
- **Instagram, Portuguese (optional account):** the same in Portuguese; the handle is marked
  "to confirm".
- **LinkedIn:** Benito's headline (≤ 220 characters), an About section, three Featured items
  (a case, the strategy service, the contact page) and the company page's tagline (from the
  page Benito created, `linkedin.com/company/blessedmoonstudio`, website
  `blessed-moon.vercel.app`).
- Every pin and highlight links to a real post in this library or a real page; nothing
  promises a resource that doesn't exist.

### 2.3 LinkedIn coherence

- Re-read `/linkedin-plan` against the new set: section copy (it still describes "decision
  stories" and an older rhythm), the week numbers, the document-post format, and each
  `linkedin` text against its carousel (the `one-action` text still describes F&A).
- The strategy check gains assertions: every English story has LinkedIn text, and every
  pinned or featured id exists.

## 3. Why

The posts should carry the studio's best evidence to the buyers it now targets, and a plan
that stops at the grid leaves the profile, the first thing a visitor reads, undesigned.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/social-posts.ts` | edit | Three new posts; `one-action`, `strategy-contents` changed |
| `src/lib/social-plan.ts` | edit | Stories, weeks, captions, LinkedIn texts; `PROFILES` |
| `src/lib/social-art-images.json` | edit | Allowlist the new screenshots |
| `src/components/social/profile-setup.tsx` | new | Profile card, pins, highlights / featured |
| `src/app/instagram-plan/page.tsx`, `linkedin-plan/page.tsx` | edit | Profile sections; copy |
| `src/lib/instagram-research.ts`, `social-research.ts` | edit | References for the new ids; `fa-honest-price` removed |
| `scripts/check-social-strategy.mjs`, `check-post-builder.mjs` | edit | Counts (22 IG, 14 LinkedIn) and the new assertions |
| `docs/social/02-agency-content-plan.md`, `CLAUDE.md`, `/system` | edit | Queue and conventions |

## 5. Verification

- Build, lint and both social checks pass.
- Contact sheets of every changed or new post reviewed slide by slide for coherence (copy
  against image, numbering, order), as in the 5 October audit.
- `/instagram-plan` and `/linkedin-plan` reviewed in the browser at 390 and 1440.

## 6. Out of scope

Publishing, opening the Portuguese account, paid promotion.

## Implemented result

- **English: 14 posts over seven weeks**, in the order in §2.1. New: `renewable-pulse`,
  `unimeet-quote`, `outubro-destravar`. `one-action`'s worked example and its comparison
  now both use UniMeet; that keeps one example through the post, which the first render
  didn't. `strategy-contents` gained "A plan we delivered: UniMeet". `fa-honest-price` left
  the English set. Research references were re-keyed. UniMeet screens carry
  "v2 proposal" in the window label, alt text and caption.
- One overclaim caught in review: Outubro hasn't launched, so "most visitors arrive from
  WhatsApp" became "are expected to", in the post and in the case study.
- **Profiles:** `PROFILES` in `social-plan.ts` and `ProfileSetup` on both plan pages and
  `/system`: Instagram EN (name 29/30, bio 113/150, tagged `/work` link, three pins,
  four highlights), Instagram PT (handle `@blessedmoon.br` marked as a suggestion to
  confirm), LinkedIn (headline 117/220, About, three Featured links, company tagline
  109/120 with the hyphenated website).
- **LinkedIn coherence:** the plan page was rewritten for the current strategy (both
  channels English-first, seven weeks, document posts, the work leads); the `one-action`
  LinkedIn text now describes UniMeet. The strategy check asserts 22 Instagram and 14
  LinkedIn briefs, a profile setup per account with every field within its limit, every
  pin resolving to a brief, and every LinkedIn story having its post text.
- Verification: lint (0 errors), build, both social checks against `pnpm start -p 3194`,
  contact sheets of every new or changed post reviewed slide by slide, and the profile
  sections viewed at 1440 and 390.
