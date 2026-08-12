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

### 3. What ships in phase 1 (scoped, not everything at once)

Given the size of this relative to everything else attempted this session (and its real
technical risk — confirmed as the "bigger undertaking" option going in), phase 1 is:

1. Build the shared-container primitive with **two** layered sections (About → Services)
   and one real shared-element morph at that boundary, as the proof of concept.
2. Verify it — actually works, doesn't reintroduce the overflow/overlap bugs found while
   building the previous version, degrades sanely under `prefers-reduced-motion`.
3. Only then extend to the remaining three sections (How We Work, Selected Work,
   Pricing) and write their fresh copy.

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
| `src/components/scroll-morph-stage.tsx` | new | the N-layer shared-container primitive (phase 1: 2 layers) |
| `src/components/homepage/about-teaser.tsx` | rewrite | becomes a layer inside the shared container, fresh copy |
| `src/components/homepage/services-focus.tsx` | rewrite | becomes a layer inside the shared container, fresh copy |
| `src/components/homepage/how-we-work.tsx` | edit (phase 2) | folded into the shared container once proven |
| `src/components/homepage/selected-work.tsx` | edit (phase 2) | folded into the shared container once proven |
| `src/components/homepage/pricing-table.tsx` | edit (phase 2) | folded into the shared container once proven |
| `src/app/page.tsx` | edit | swap the five independent sections for the shared container |
| `docs/tasks/TASK-homepage-unify-scroll.md` | note | mark superseded by this task, not deleted (real history of what was tried/why) |
