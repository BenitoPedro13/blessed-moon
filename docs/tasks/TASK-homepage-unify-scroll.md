# TASK: Unify homepage scroll under native scroll + ScrollStage

> **Superseded by `TASK-homepage-morph-redesign.md`** for About/Services/How We
> Work/Selected Work/Pricing — building this surfaced a real limit (independent
> `ScrollStage` pins can't be simultaneously visible, so true section-to-section
> morphing isn't reachable from this structure) that the next task addresses with a
> different architecture. Kept, not deleted: real history of what was tried, what broke
> (the ParticleScroll scrollTop bridge, the overflow-y-auto sidescroll, the oversized
> image rows), and why each fix was made the way it was.

## Current scenario

`app/page.tsx` wraps everything below Hero (About, Services, How We Work, Selected Work,
Pricing, Closing CTA) inside `ParticleScroll` — a fixed-height (`h-[80vh]`) box with its own
independent, native `overflow: auto` content div, separate from the page's own document
scroll. This creates two disconnected scroll contexts: the outer page (Lenis-smoothed) and
the panel's inner content (native, `data-lenis-prevent`-excluded). A visitor whose cursor
isn't precisely over the panel gets no scroll response once the outer page runs out of room
around it — confirmed as a real, repeated point of confusion this session. An attempt to
bridge the two by driving the panel's `scrollTop` from outer scroll position visibly
corrupted `ParticleScroll`'s html-in-canvas capture and froze scroll entirely; reverted.
Widening the panel (already shipped) reduces how often the cursor misses it but doesn't
remove the two-context problem.

`ParticleScroll` also requires its box to stay shorter than its content for the dissolve
effect to activate at all, which caps how much visual room any one section can have —
directly in tension with wanting more depth per section (Services in particular reads as a
bare list with no framing).

## Planned changes

1. **Remove the `ParticleScroll` wrapper from `app/page.tsx`.** About/Services/How We
   Work/Selected Work/Pricing/Closing CTA return to normal document flow, one scroll
   context for the whole page (same as `/about`, `/work`, `/contact` already are).
2. **Extend `ScrollStage` (proven on Hero and `PageHero`) to About, Services, How We Work,
   Selected Work, and Pricing** — each pins for a scroll range and fades/scales in via
   `--stage-progress`, the same pattern already shipped twice successfully. **Closing CTA
   stays un-pinned**, normal flow — it's the release/landing beat after a run of pinned
   sections, and it already has its own signature moment (`ParticleObject`); pinning it too
   would remove the one deliberately calm beat before the page ends.
3. **Content additions**, grounded in what was specifically flagged:
   - **About → Services transition**: About teaser currently ends on a CTA link with no
     bridge to what's next; add a closing line that actually points at Services rather than
     just linking to it.
   - **Services**: currently 8 cards with an index + name + one-line description and no
     section framing at all — add a one-line section intro (brand voice, not templated
     SaaS copy) so the grid reads as an answer to a stated question, not a bare list.
   - How We Work / Selected Work / Pricing: reviewed for the same "needs more depth" note;
     Pricing's minimalism (`range confirmed on call`, no fixed numbers) is an intentional
     brand decision per `docs/design-handoff.md`, not something to pad out.
   - New/changed copy only — the wireframe's locked structural elements (section order,
     the 8 service names, the 4 process steps, the 3 project entries, the 3 pricing tiers)
     stay as specified; this is additive framing, not a rewrite of what's already there.
4. **Investigate the "titles are off" report** as part of implementation/testing — no
   confirmed root cause yet; likely candidates are the `ScrollStage`-driven opacity/scale
   transform interacting oddly with something, or a leftover mistake from the rapid
   iteration this session. Verify visually once the rebuild is live rather than guessing
   further blind.
5. **Docs**: `CLAUDE.md`'s stack table currently documents `ParticleScroll` as wrapping
   "the homepage's content sections" — update to reflect it's no longer used there.
   `ParticleScroll`/`DecryptReveal` remain in the codebase as available components (the
   Origin Trial work in `TASK-html-in-canvas-origin-trial.md` still applies to
   `DecryptReveal`, which is unrelated to this change).

**Alternative considered and rejected:** consolidating everything (including Hero) into one
`ParticleScroll` container instead of removing it. Rejected — doesn't solve the "needs more
room for content" problem (the shorter-than-content constraint stays), and increases
exposure to the experimental html-in-canvas capture that already caused one corruption bug
this session, for the section that now carries the most custom motion (Hero's `ParticleText`
+ scroll-linked gather).

## Why

Requested directly, choosing between two ways to kill the two-scroll-contexts bug for good.
Root-causing it (removing the separate scroll container) rather than continuing to patch
around it also removes the constraint that's been capping section depth, and unifies the
homepage under the same scroll model every other page already uses.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/app/page.tsx` | edit | remove `ParticleScroll`/`data-lenis-prevent` wrapper, restore normal flow |
| `src/components/homepage/about-teaser.tsx` | edit | `ScrollStage`, closing line bridges to Services |
| `src/components/homepage/services-focus.tsx` | edit | `ScrollStage`, section intro line |
| `src/components/homepage/how-we-work.tsx` | edit | `ScrollStage` |
| `src/components/homepage/selected-work.tsx` | edit | `ScrollStage` |
| `src/components/homepage/pricing-table.tsx` | edit | `ScrollStage` |
| `src/components/homepage/closing-cta.tsx` | none | stays un-pinned by design |
| `CLAUDE.md` | edit | stack table: `ParticleScroll`'s current role |
