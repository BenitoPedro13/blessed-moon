# TASK: social copy v3 — English first, real hooks, proof on the cover

5 October 2026. Status: complete. Third of three; depends on
`TASK-social-art-foundations.md` and `TASK-social-art-signatures.md`.

## 1. Current scenario

`src/lib/social-plan.ts` holds 16 stories (8 weeks × 2). Each story's Instagram copy is
Portuguese, aimed at Brazilian small businesses; LinkedIn copy is English. The carousel
copy comes from `src/lib/social-creative.ts`, which forces every carousel through the
same six-slot order (statement → compare → steps → workflow → case → action). That is
the main reason every post looks the same. Problems found in the 5 October review:

- **Covers are abstract** ("Clareza antes da conversa"). UniMeet's covers are concrete
  and promise something useful ("Two business degrees. What should you compare?").
- **Disclaimers on the slides.** For example, "É uma decisão de interface; não uma
  medição de vendas." Being careful belongs in the evidence notes and the caption, not
  on the art.
- **About the studio rather than for the reader.** Several posts discuss Blessed Moon's
  own process (likes vs intent, pilot review, which service). UniMeet's posts give the
  reader something to use: a comparison sheet, a checklist, a script of questions.
- **Proof arrives late.** Screenshots appear on slide 5 of 6.
- **Audience.** Benito, 5 October: "the better opportunities are for foreigners that pay
  me in strong currency, but some Portuguese posts would be good, maybe I will have one
  Instagram for each language." The plan currently makes Portuguese the Instagram
  language.

## 2. Planned changes

### 2.1 Languages and accounts

- Primary: **English**, for international founders and product leaders. This covers
  Instagram EN and LinkedIn.
- Secondary: **Portuguese** Instagram for Brazilian businesses, as a possible second
  account. Benito decides whether it becomes a separate account. Both are handle
  `@blessedmoon.studio` until he says otherwise. `[VERIFY with Benito: the PT handle if a
  second account is opened]`
- `ArtPost` gains `lang: "en" | "pt"`. The UTM `utm_content` gains the language
  (`ig-en-w01-…`). The builder gets a language choice. The plan pages show EN first,
  with a PT tab per brief where a PT version exists.

### 2.2 One authored post per story and language

- New `src/lib/social-posts.ts` replaces `social-creative.ts`'s generic slot mapping. Each
  `{ storyId, lang }` gets a full, hand-written slide list (template, kicker, title,
  accent, body, image, marks, art), like UniMeet's `content/` posts. Order and length
  vary by post: a teardown is cover → annotate → rows → action; a checklist is cover →
  rows → point → point → action. No fixed six-slot order.
- Every cover follows one of three moves: a concrete question with a promise, the work
  itself (`window`/`ascii`), or a number/fact from a case. Proof appears by slide 2 at
  the latest.
- **Usable artefacts.** At least half the EN posts hand the reader something to keep: a
  brief template, a scope checklist, questions to ask an agency, a launch checklist.
  Each ends with a "save this" line as well as the link.
- **No hedges on the art.** Evidence limits stay in `Story.evidence` and the brief's
  "Before publishing" notes. A slide may say only what the case study records.

### 2.3 Story set

- Rebalance the 16 stories for the founder audience. Keep the stories that already
  speak to founders (one action, brief questions, smallest system, screenshot context,
  confirmed information, strategy contents). Replace the most Brazil-retail-specific ones
  in the EN set with founder topics backed by documented cases: Flora (satellite
  pipeline to task board), Markado (slot revalidated at payment), Bee Dash (one metric
  schema across platforms), Sua Mesa Fit (custom storefront on Shopify operations),
  Prumo (pre-qualify credit before browsing), Trísion (reseller showcases without a
  cart). Facts come only from `src/lib/studio-data.ts`.
- Oishi/F&A/restaurant/WhatsApp-catalogue stories stay as the PT set, rewritten to the
  same standard.
- `docs/social/02-agency-content-plan.md` and `07-platform-selection.md` are updated:
  English-first Instagram + LinkedIn, the PT account as an option, the new queue.

### 2.4 Plan pages

`/instagram-plan` leads with the EN grid study; the PT set follows as its own grid.
`PostCard` reads slide lists from `social-posts.ts`. `/linkedin-plan` uses the EN posts in
landscape with LinkedIn captions. Copy on the pages that says "Portuguese buyer
education" is corrected.

## 3. Why

The new art (docs 1–2) only converts if the words are hooks and the proof leads. The
audience change is Benito's commercial call: international buyers who pay in strong
currency. It means the primary set has to be written for them, not translated from the
Brazilian SMB set.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/social-posts.ts` | new | Authored slide lists per story × language |
| `src/lib/social-creative.ts` | removal | Replaced; `PROJECT_ART_IMAGES` moves to `social-posts.ts` |
| `src/lib/social-plan.ts` | edit | Story set rebalanced; `languages`; captions EN/PT; UTM language |
| `src/lib/social-art.ts` | edit | `lang` on `ArtPost`; `storyPost(story, channel, lang)` |
| `src/components/social/post-card.tsx`, `post-preview.tsx`, `post-builder.tsx` | edit | Language choice/tabs |
| `src/app/instagram-plan/page.tsx`, `linkedin-plan/page.tsx`, `social-plan/page.tsx`, `post-builder/page.tsx` | edit | EN-first presentation and wording |
| `src/lib/instagram-research.ts`, `social-research.ts` | edit | Re-key references to the new story ids |
| `docs/social/02-agency-content-plan.md`, `07-platform-selection.md`, `README.md`, `05-review-guide.md` | edit | Strategy change recorded |
| `scripts/check-post-builder.mjs`, `check-social-strategy.mjs` | edit | New ids, language, slide counts |
| `CLAUDE.md` | edit | Social strategy extension paragraph |

## 5. Verification

- Build, lint and both social check scripts pass against a production preview.
- Every post: the cover headline is ≤ 12 words; proof by slide 2; no slide text contains
  the hedge phrases found in the review (a list asserted in the check script).
- Every case fact on a slide can be found in `studio-data.ts` (manual pass, listed in
  this doc when done).
- Contact sheets of the EN grid, the PT grid and LinkedIn are reviewed side by side with
  UniMeet's.

## 6. Out of scope

Publishing, opening the second account, paid promotion, video/Reels production.

## Implemented result

- **20 authored carousels** in `src/lib/social-posts.ts`: 12 English (weeks 1–6, two a
  week) and 8 Portuguese (weeks 1–8). Each has its own order and length (4–6 slides).
  `social-creative.ts` is removed. `Story` gained `lang`. Captions are in the post's
  language, and `linkedin` is filled for English stories only. `postId()` gives
  `ig-en-w01-one-action` and is also the `utm_content`.
- **LinkedIn** uses the same English carousel, as square pages exported as a PDF
  document. That replaces the single landscape image, because a document carries the
  whole argument; landscape stays available in the builder.
- **New English stories** backed by case facts: `markado-slot`, `flora-satellite`,
  `studio-questions`, `fa-honest-price`, `prumo-credit`, `bee-dash-metrics`,
  `headless-shopify`. **Retired:** `sample-calendar`, `tagged-link`, `pilot-review`
  (about the studio rather than for the reader) and the two screen-recording briefs
  (`oishi-condition` and `furniture-dimensions` are now carousels). Research references
  in `instagram-research.ts`/`social-research.ts` are re-keyed to the new ids.
- **Criterion amended:** "proof by slide 2" holds for the case posts (the screenshot
  is the cover). Education posts (checklists, question sets) instead end on a worked
  example from a real case, as UniMeet's checklist posts do; forcing a screenshot
  onto slide 2 there would cut the usable artefact the post exists for.
- **Fact pass**, each against `studio-data.ts`:
  - Markado: revalidated in the final transaction; working rules, Calendar, buffers,
    notice periods, UTC; checkout before confirmation.
  - Flora: no request calls the provider; ten indices in one Process API call at
    4.667 vs 4.0 PU; Accept-header and masking bugs.
  - F&A: 13 products, 10 priced, 3 'Consulte o preço'; Lighthouse 93/100; CLS 0;
    images < 32 KB against a 180 KB budget; the 27-item demo catalogue removed; the
    localhost defect; centimetres stored as numbers.
  - Oishi: R$ 74,90 / R$ 54,90 and 'sem desperdício'; R$ 20 off; menu once only in
    JPEGs; '[a confirmar]'.
  - Prumo: five outcomes; no CPF, bureau or uploads; policy numbers flagged; brackets
    moved by decree.
  - Bee Dash: canonical metrics first; adapters; rate limits, schema drift, history.
  - Sua Mesa Fit: Shopify keeps inventory, orders, payments and checkout; per-route
    queries; optimistic cart with Shopify authoritative.
- **Account details** (Benito, 5 October): Instagram `@blessedmoon.studio`, opened
  as a personal account, so switch it to professional before publishing. LinkedIn
  page `linkedin.com/company/blessedmoonstudio`.
- Verification: `pnpm lint` (0 errors), `pnpm build`, `check-post-builder.mjs` and
  `check-social-strategy.mjs` against `pnpm start -p 3194`. The strategy check now also
  asserts every cover headline is ≤ 12 words and that no slide carries the hedge
  phrases. Contact sheets of all 20 posts were reviewed against UniMeet's. That review
  caused headlines to be bounded above the crescent/moon, the rows to be enlarged and
  the annotation markers to be repositioned.
