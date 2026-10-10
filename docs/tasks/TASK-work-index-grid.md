# TASK: `/work` index as a filterable cover grid

## Current scenario

**`/work` index.** `src/components/work/work-index.tsx` is layer `00 / INDEX` of
`/work`'s `ScrollMorphStage`. With 16 projects (14 after `TASK-remove-unpublished-portraits.md`), it renders 16 text rows
(number, name, tagline, year), each about 140px tall, so the listing is
several screens high. The rows are deliberately not links. The component's
comment and CLAUDE.md ("`/work`'s index rows are a listing rather than three
links") say this keeps amber unambiguous: amber means "in flight", and a
control styled with amber would give the same glyph a second meaning. The
only way to reach a project is to scroll. No covers are shown, although every
project has a `cover` in `studio-data.ts` and a `/work/[slug]` page.

Benito: "it only wastes space, I can't click or see nothing."

**Homepage Selected Work.** `src/components/homepage/selected-work.tsx` has a
hand-curated `PROJECTS` array of Flora, ART'hur and Oishi. The layer receives
the morph count **3** from How We Work ("3 still in production.") and hands
**1** on to Pricing. Both numbers are part of the 8 → 4 → 3 → 1 contract and
stay as they are.

## Planned changes

### 1. `/work` index becomes a grid of covers, each card a link

`src/components/work/work-index.tsx`:

- Replace the `<ul>` of text rows with a grid of cards. Each card shows the
  cover (`next/image`, `object-top`, held at `opacity-80` at rest and full on
  hover, matching `selected-work.tsx`'s reasoning that light-UI screenshots
  must not outshine the amber), the project number in mono, the name
  (clamped to 2 lines), and the year.
- **Each card is a `next/link` to `/work/[slug]`** (decided by Benito). It
  plays the same `playHover`/`playClick` sounds as the homepage cards and has
  a visible focus ring (border to `--primary`). The tagline moves into the
  link's accessible name and the image `alt`, not onto the card, to save
  height.
- **The morph handoff stays.** The first project's name on its card remains
  the `MorphToken` (`work-${slug}`, `side="from"`) that becomes the first case
  view's heading. If a filter hides that card, the token has no source and
  the heading simply fades in with the view. That is Motion's normal
  `layoutId` behaviour with one side missing, so no special case is needed.
- **Layer width** in `src/app/work/page.tsx` goes from 860 to 1140, the same
  as the case views. A grid needs the width, and the morph between the
  narrow index and the wide cases was less important than legibility. The
  page comment describing the width morph is updated to match.
- **Columns:** 2 on mobile, 3 from `sm`, 6 from `lg`. Six columns put all 16
  covers in 3 rows (about 650px including the heading and filters), which
  fits a pinned desktop viewport. The old listing almost certainly did not
  fit (16 × ~140px) [VERIFY with `scripts/check-page-scroll.mjs`: record
  before and after whether `/work` pins or uses the flow fallback at
  1440×900 and 1280×720]. On mobile the grid will not fit a viewport, and
  the stage's existing normal-flow fallback handles that exactly as it does
  today. Rows are never clipped, and no nested scroller is added.

### 2. Category filters above the grid

- A new curated field `category` on `StudioProject` in `src/lib/studio-data.ts`,
  typed as a union. The existing `tags` are too inconsistent to filter on
  ("Motion" and "Motion Design", "Unpublished" used as a tag):

  | Category | Projects |
  |---|---|
  | Product & SaaS | Dove Lesson Studio, Flora, Trísion, UniMeet, Prumo, Markado |
  | Data & dashboards | Apuração 2026, Renewable Pulse, Bee Dash |
  | Sites & commerce | ART'hur, Oishi, F&A Móveis, Sua Mesa Fit, Outubro Idiomas |

  The first draft had four categories. "Brand & portfolio" fell to ART'hur
  alone once Direct Flash and Comp Card were removed
  (`TASK-remove-unpublished-portraits.md`), and a one-project filter isn't
  worth a control, so it merged with local business.

- Filter control: shadcn **Toggle Group** (Radix `ToggleGroup`,
  `type="single"`), added with `pnpm dlx shadcn@latest add toggle-group`
  rather than hand-rolled buttons, and restyled square to match. Options are
  `All · Product & SaaS · Data & dashboards · Sites & commerce`, each with its count. The selected item uses amber,
  small and on a control, which is amber's *interactive* meaning and never
  lands on a project name.
- State is a local `useState` in `WorkIndex`, with no URL parameter (YAGNI).
- **Filtering only narrows the grid.** The 16 case views below, their
  keyframes, `#slug` markers and `next →` chain are untouched. Filtering
  those would change the stage's layer count and the moon's keyframes.
- Filtering can only make the grid shorter, so it can never push the stage
  out of the pinned mode that "All" fits in.

### 3. Homepage picks: moved out

The homepage's three projects were first planned here (Apuração 2026,
UniMeet, ART'hur). They move into a separate homepage-restructure task,
because whether Selected Work stays fourth in the sequence is now in
question, and the three projects should change only once. That task also
carries the open UniMeet image question: every screenshot is the proposed
v2 design, so it would sit wrongly under "still in production".

### Rejected

- **Side nav.** The window's title bar already shows the current project
  (`15 / APURAÇÃO 2026`), a side nav needs a mobile collapse, and in-page
  jumping was rejected in favour of opening full pages.
- **Filtering the case views too.** It breaks the keyframe and layer contract
  described above.
- **Shorter text list.** It saves space, but the reader still sees nothing of
  the work.

## Why

The index is the first thing on `/work`, and it currently costs several
screens while offering neither a way in nor a picture. A cover grid shows 16
projects in about one screen, and each card leads to the full case study
that already exists. Filters let a buyer with one question ("have you done
data work?") answer it without reading 16 entries.

This reverses a recorded design decision (non-link index rows), and Benito
made that call. The amber rule is kept: links use amber only on small
control affordances (focus or hover border, the filter selection), never on
the project name that travels.

## Affected files

| File | Change type | Notes |
|---|---|---|
| `src/components/work/work-index.tsx` | edit | cover grid of links, filters, `MorphToken` kept on the first card |
| `src/components/ui/toggle-group.tsx`, `toggle.tsx` | new (shadcn CLI) | square-cornered |
| `src/lib/studio-data.ts` | edit | `category` type and a value on all 16 projects |
| `src/app/work/page.tsx` | edit | index layer width 860 → 1140, comment updated |
| `src/app/system/page.tsx` | edit | panel for the toggle group if it becomes a shared primitive |
| `CLAUDE.md` | edit | "listing rather than three links" rule rewritten: cards are links, amber stays off the travelling name |
| `docs/tasks/TASK-work-index-grid.md` | new | this document |

## Verification

- `pnpm typecheck`, `pnpm lint`, `pnpm build`.
- `scripts/check-page-scroll.mjs` for `/work`, with before and after
  pin or flow mode at desktop sizes recorded here.
- Keyboard: Tab reaches every filter and card, arrow keys move within the
  toggle group, and Enter opens the case study. Reduced motion is checked.

## Results (10 October 2026)

- **Before:** `/work`'s stage was in `content-overflow` flow at every
  viewport, so the morph never ran on `/work`. The 16-row index measured
  1441px against 738px available at 1440×900. Every case view fitted.
- **After:** the grid measures 672px at 1440×900 (14 projects), and `/work`
  pins and morphs. Smaller or shorter viewports still fall back to flow where
  the case views don't fit, which is unchanged.
- The CLI's toggle-group install imported `cn` from an npm package named
  `cn` (and added it as a dependency) despite `components.json` aliasing
  `utils` to `@/lib/utils`. The package was removed and the imports fixed.
- `scripts/check-page-scroll.mjs`: the `/work` block asserted flow at load,
  which only described the old listing. It now accepts either mode, checks
  that the index is whole while it is the active layer, and for a pinned
  start, checks that injected growth forces flow. Both modes render the same
  root element, so the attribute's old values are recorded rather than read
  afterwards. All six `/work` configurations pass in two consecutive runs
  against a production build. The reduced-motion configurations were
  intermittently failing on `keyboard End` before that fix and passed in both
  final runs.
