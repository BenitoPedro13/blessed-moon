# TASK: Homepage from scratch — one morphing scroll container, fresh content

> Supersedes the reactive, patch-by-patch state left by `TASK-homepage-unify-scroll.md`.
> That task fixed the two-scroll-contexts bug and gave each section its own composition;
> this task is a clean-slate replan on top of what was learned building it. Section
> **order** (the beats) carries forward. Section **content** (copy, exact composition,
> per-section ScrollStage instances) does not — treated as open, per direction.

## Current scenario

Five independent `ScrollStage` pins (About, Services, How We Work, Selected Work,
Pricing), each `position: sticky` and full-viewport. Building the last few passes
surfaced a real architectural limit: **two independently-pinned full-viewport panels are
never simultaneously on screen.** Section A's sticky panel releases the exact instant
Section B's begins — there's no shared coordinate space between them, so true "element
from A morphs into element in B" transitions (Motion's `layoutId` magic-move, or any
cross-fade where both are visible at once) aren't reachable from this structure. The
timing-overlap workaround (hold About's content, then dissolve fast right at the
handoff) improves the *feel* of the cut but doesn't make it an actual morph — confirmed
as the ceiling of that approach before this task started.

Content-wise: About/Services/How We Work/Selected Work/Pricing all carry the original
wireframe copy plus incremental additions made while chasing composition/overflow bugs.
None of it was written against a real "these five things morph into each other" plan —
it was written for five independent sections, then convincing but structurally
after answers to distinct, retrofitted rather than composed as one sequence.

## Planned changes

### 1. One shared pinned container for the "body" beats

Hero and Closing CTA stay as their own separate, already-proven pins (Hero's
`ParticleText` + scroll-linked gather is validated and is the site's one true
"thesis" moment per the frontend-design skill's own guidance — it shouldn't be
diluted into a shared sequence; Closing CTA is the landing beat with its own
signature `ParticleObject` moment).

About, Services, How We Work, Selected Work, and Pricing become **one** tall wrapper
(`ScrollStage`-like, but new — the existing component assumes exactly one content layer,
this needs N layered ones sharing a single progress value). Structure:

- A wrapper several viewport-heights tall (the "increase the scroll journey" lever, same
  idea as before, now spanning all five beats instead of one each).
- A single `position: sticky` full-viewport frame.
- All five sections' content mounted **simultaneously** inside that frame, absolutely
  positioned/layered, each reading its own sub-range of one shared 0–5 progress value
  (section *N* is "active" roughly between progress *N* and *N+1*, with a defined overlap
  band at each boundary where the outgoing and incoming section are *both* partially
  visible and interpolating).
- Because both sections genuinely coexist in the DOM during that overlap band, real
  shared-element handoffs become possible where the content supports it: a `layoutId`
  match on an element that's conceptually "the same thing" across two sections (a number,
  a short phrase, a card) lets Motion interpolate its position/size across the boundary,
  instead of two separate elements crossfading past each other.

This is the actual technical difference from the timing-overlap version: **the DOM has
to hold multiple sections' content at once** near a boundary, not just adjust one
section's opacity curve.

### 2. Content: fresh, against the sequence as a whole

Section **order** stays: 01 About → 02 Services → 03 How We Work → 04 Selected Work →
05 Pricing. Everything else — headline copy, what's said, what (if anything) is the
shared element handing off from one beat to the next — gets rewritten as one considered
sequence rather than five independently-patched sections. Concretely, for review before
any of it gets built:

- **01 → 02 (About → Services):** already has one — About's closing line names "eight
  kinds of systems" right before Services shows the eight-card grid. Candidate shared
  element: the *word* "eight" morphing into the *grid* materializing, or a numeral.
- **02 → 03 (Services → How We Work):** no natural link yet. Candidate: Services ends on
  "how" they're built once scoped → How We Work opens answering that directly.
- **03 → 04 (How We Work → Selected Work):** How We Work's step 4 is literally "Ship it
  and keep it alive" — Selected Work is the proof of that claim. Candidate shared
  element: the word "shipped"/"alive" handing off to the first project appearing.
- **04 → 05 (Selected Work → Pricing):** weakest natural link currently. Needs a real
  bridge line, not just adjacency (matching how About → Services got one earlier).

This section intentionally stops short of final copy — that's the next step once the
technical approach below is confirmed, not something to lock before knowing what the
mechanism can actually support.

### 3. Scope: all five at once, not a two-section phase 1

This originally proposed a two-section proof of concept (About → Services) before
extending. Superseded by direct user direction — *"u can rebuild all home from scratch
dont mind it"* — so all five body sections land in one pass, with fresh copy, and the
existing section content is explicitly not something to preserve.

### 4. The shared element: one descending count, 8 → 4 → 3 → 1

Rather than four unrelated ad-hoc handoffs, the four boundaries share **one motif**: an
amber numeral is the token that carries you between sections. It appears small, inline, in
the closing line of section *N*, and lands as the display numeral heading section *N+1* —
the same DOM element, interpolated by Motion's `layoutId`.

| Boundary | Token | Reads as |
|---|---|---|
| 01 → 02 | **8** | "…8 kinds of systems" → **8** *kinds of systems.* over the 8-card grid |
| 02 → 03 | **4** | "…the build follows the same 4 steps" → **4** *steps, every time.* |
| 03 → 04 | **3** | "…3 of them still in production" → **3** *still in production.* |
| 04 → 05 | **1** | "…priced the same way: 1 number" → **1** *number, agreed up front.* |

The count descends the whole way down the page — breadth (what we build) narrowing to a
single commitment (what it costs). That's the "written as one considered sequence" the
task called for, and it makes the mechanism legible rather than decorative: the number you
just read is physically the thing that carries you into the next beat.

In How We Work the arriving **4** then splits into the four step numbers, which keep the
odometer `Counter` roll committed in `001e562` — re-gated on the layer becoming active
rather than `useInView` (every layer is permanently inside the viewport once it's a
sticky-frame child, so `useInView` can no longer fire per section).

### 5. Constraints the mechanism imposes

- **A layer may animate `opacity` only, never `transform`.** Motion's layout projection
  measures real bounding boxes; an ancestor with a per-frame `transform` makes the
  measurement drift mid-flight. Per-element motion therefore lives on individual children
  (which are not ancestors of a token), driven by the `--morph-local` signed-distance
  variable each layer exposes.
- **`Reveal` doesn't work inside a layer.** It's `whileInView`-based, and every layer is
  permanently in the viewport, so all five would fire once at mount and never replay.
  Replaced inside the stage by scroll-linked drift off `--morph-local` — continuous and
  reversible, which is what the rest of this scroll system already does.
- **`data-ascii-keyframe` can't live on the sections any more.** Absolutely positioned
  inside one sticky frame, all five report the same `getBoundingClientRect().top`, so the
  moon tracker (`src/lib/ascii-canvas/scroll-progress.ts`) can't order or interpolate
  between them. The stage instead emits zero-size marker elements inside the *tall
  wrapper*, at the scroll offset where each layer is centered — real, distinct positions
  that move with scroll normally. Keyframe values are carried over unchanged (1, 2, 2, 3,
  4 — Services and How We Work genuinely share 2 today), so the moon's behaviour is
  untouched. A second marker per layer, without the tracker's 35dvh anchor offset, carries
  the `id` so `#services` / `#pricing` anchor links still land in the right place.

## Why

Direct request: attempt true Apple-style morphing rather than the timing-overlap
approximation, and use the reset as a chance to write the five body sections as one
considered sequence instead of patched independently. Doing this without a plan first —
after a session that already needed several rounds of bug fixes on much simpler scroll
mechanics (className merges, width-resolution chains, a missing Provider, an
`overflow-y-auto` side effect) — would very likely cost more rework than it saves.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/scroll-morph-stage.tsx` | new | the N-layer shared-container primitive + `MorphToken` (`layoutId` handoff) + `morphDrift` |
| `src/components/homepage/about-teaser.tsx` | rewrite | layer 0, fresh copy, hands off the **8** |
| `src/components/homepage/services-focus.tsx` | rewrite | layer 1, receives **8**, hands off the **4** |
| `src/components/homepage/how-we-work.tsx` | rewrite | layer 2, receives **4** (splits into the 4 Counter steps), hands off the **3** |
| `src/components/homepage/selected-work.tsx` | rewrite | layer 3, receives **3**, hands off the **1** |
| `src/components/homepage/pricing-table.tsx` | rewrite | layer 4, receives **1** |
| `src/app/page.tsx` | edit | swap the five independent `ScrollStage` sections for one `ScrollMorphStage` |
| `src/app/system/page.tsx` | edit | `ScrollMorphStage` / `MorphToken` panel (§3 of CLAUDE.md — a shared component without a panel is unfinished) |
| `CLAUDE.md` / `README.md` | edit | stack table + status: the homepage body is one morph container now, not five pins |
| `docs/tasks/TASK-homepage-unify-scroll.md` | note | already marked superseded (`001e562`) |
