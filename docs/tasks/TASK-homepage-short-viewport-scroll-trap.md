# TASK: Fix wheel scroll getting trapped inside the terminal window on short viewports

> Scope grew by one item mid-implementation: the boot sequence overlay (§3) was
> found cropped on the same class of short viewports while verifying the fix
> below, and was fixed in the same pass rather than filed separately, since
> it's the same "short viewport" root category and touches none of the same
> files.

## Current scenario

Reported by the user (screen recording + a 357×595 responsive viewport
screenshot): on short-height screens, scrolling with the mouse wheel/trackpad
while the pointer is over the pinned terminal window doesn't advance the page
— it scrolls something inside the card instead, so the only way to move to
the next section is to aim the wheel at the sliver of background around the
card, which barely exists on a short viewport.

Traced the mechanism:

- `ScrollMorphStage`'s window body (`bodyRef` in `src/components/scroll-morph-stage.tsx`)
  is `overflow-x-hidden overflow-y-auto`, added as a fallback so content taller
  than the window's `max-h-[86dvh]` clamp stays reachable instead of being
  clipped (see the comment above it).
- The site's global smooth scroll (`src/components/lenis-provider.tsx`, Lenis
  with `root: true`) automatically detects nested elements that still have
  scrollable room under the wheel target and defers to the browser's native
  scroll for them instead of driving the page — standard Lenis behavior, no
  `data-lenis-prevent` involved.
- On a short/narrow viewport the About layer's text wraps into enough lines
  that its natural content height already exceeds the clamped window, so this
  fallback is live from the moment the page loads. Every wheel tick over the
  card gets captured by the inner `overflow-y-auto` instead of reaching Lenis.
- Worse: `bodyRef`'s height is continuously interpolated toward the *next*
  layer's (taller) natural height for the entire time the current layer is on
  screen (`h = h0 + (h1 - h0) * f`, `write()` in `scroll-morph-stage.tsx`) —
  intentional for the normal forward-scroll morph, where the growing height is
  masked by the next layer's rising crossfade opacity in lockstep. But
  scrolling the *inner* overflow instead of the page freezes `progress` (it
  only reads `window.scrollY` via the wrapper's `getBoundingClientRect()`), so
  the layer opacities and body height stay frozen at whatever they were when
  the inner scroll started. Dragging the inner scrollbar then just pans across
  that frozen, partially-blended frame — which is why the recording shows
  scrolling inside the card revealing a stretch of near-empty space rather
  than the next section: it's the next layer's real content, frozen at
  whatever low opacity it had when the page scroll stopped updating.

So the `overflow-y-auto` fallback is doubly wrong for this component: it steals
the primary scroll gesture from Lenis, and even when it fires it doesn't
correctly reveal more content, because this design's layer positions are only
meaningful as a function of page-scroll progress, not of the body's own
`scrollTop`.

Also relevant — `services-focus.tsx` already documents having tuned mobile
card padding specifically to avoid triggering this same fallback ("the exact
bug this whole redesign exists to keep out"), i.e. the project's existing
position is that content should fit the pinned window rather than rely on
`overflow-y-auto` as a real interaction.

## Planned changes

### 1. Remove the inner scroll trap — `src/components/scroll-morph-stage.tsx`

Change `bodyRef`'s className from `overflow-x-hidden overflow-y-auto` to
`overflow-hidden` (both axes clipped, no independent scroll). This makes it
structurally impossible for Lenis to ever defer wheel input to this element —
there is no longer a nested scrollable ancestor for it to detect — so wheel
input over the terminal window always drives the page, everywhere, matching
what happens when scrolling over the background. This also removes the
frozen-pan artifact described above as a side effect, since inner scrolling no
longer exists.

Trade-off accepted: content taller than the clamped window is now clipped
rather than reachable via scroll. This is addressed by (2) — the goal is for
that clamp to rarely bind on realistic viewports rather than to keep a broken
escape hatch around it.

### 2. Make layer content fit short viewports — new `short` variant + spacing/type tweaks

Add a custom Tailwind variant in `src/app/globals.css`, next to the existing
`@custom-variant dark`:

```css
@custom-variant short (@media (max-height: 700px));
```

700px chosen to cover devtools-style short responsive viewports (the reported
357×595 case) and short laptop/browser windows, without kicking in on normal
phone-in-portrait or desktop heights.

Apply it to trim vertical rhythm — padding, margins, gaps, and (only where
necessary) type size — in the components most likely to overflow a clamped
`86dvh` window at short heights:

- `src/components/terminal-panel.tsx` — `WINDOW_BODY` padding
  (`py-8 sm:py-10` → add `short:py-5 short:sm:py-6`).
- `src/components/homepage/about-teaser.tsx` — headline size
  (`text-4xl sm:text-5xl md:text-[3.5rem]` → add `short:text-3xl
  short:sm:text-4xl`) and the wrapping `gap-8` → `short:gap-5`.
- `src/components/homepage/services-focus.tsx` — grid `mt-9` → `short:mt-5`;
  card padding `px-3.5 py-4 sm:px-6 sm:py-7` → add `short:py-3 short:sm:py-5`.
- `src/components/homepage/how-we-work.tsx` — `mt-10 sm:mt-12` (both the step
  grid and the closing paragraph) → add `short:mt-6 short:sm:mt-7`; grid
  `gap-y-10` → `short:gap-y-5`.
- `src/components/homepage/selected-work.tsx` — row list `mt-8` →
  `short:mt-5`; `gap-5 sm:gap-6` → `short:gap-3`; image `h-24 w-36 sm:h-32
  sm:w-48` → add `short:h-16 short:w-24 short:sm:h-20 short:sm:w-32` (this is
  the tallest layer — three stacked rows — so it gets the most aggressive
  trim).
- `src/components/homepage/pricing-table.tsx` — `mt-10 sm:mt-12` → add
  `short:mt-6 short:sm:mt-8` (already the most compact layer; minor trim for
  consistency).

Not a full redesign: copy, section order, and layout structure are unchanged
per `docs/design-handoff.md`'s "Fidelity" note — only spacing/type scale at an
explicit short-viewport breakpoint, the same category of change
`services-focus.tsx` already made for narrow (not short) viewports.

### Verification

Re-run the 357×595 responsive-viewport check (the one in the report) after
both changes: confirm (a) wheel scroll over the terminal card advances the
page/morph progress instead of scrolling internally, for all five layers, and
(b) each layer's content visibly fits the clamped window without needing the
removed fallback. Also spot-check a couple of nearby short heights (e.g.
~600px, ~660px) since 700px is a hard cutoff.

### 3. Boot overlay cropped on short viewports — `src/components/boot-sequence.tsx`

Found while re-testing the reported scenario: `BootSequence`'s full-screen
overlay (`fixed inset-0 flex flex-col items-center justify-center gap-10 …
px-6 py-10`, no scroll) center-crops on a short viewport instead of scaling
down or scrolling — the crescent's top edge and the "continue muted"/"begin"
buttons get clipped off both ends symmetrically, with no way to reach them.
Unlike the terminal window, this overlay has no competing pinned-scroll
mechanic to protect (it already locks `document.body` scroll itself during
the gate phase), so a plain internal scroll is the right fallback here, not a
`short:` layout rework: added `overflow-y-auto` plus `short:justify-start`
(so overflowing content scrolls from the top instead of being centered with
its top half unreachable above the scroll origin) and trimmed `gap-10`/`py-10`
to `short:gap-6`/`short:py-8` so it fits without scrolling on most short
viewports and only truly tiny ones need to.

## Why

Directly fixes the reported bug: scrolling over the card should always move
through the page, the same as scrolling over the background. Root-causing it
turned up that the existing `overflow-y-auto` fallback doesn't just create a
UX annoyance — it's actively broken for this component (frozen-pan, not a
real reveal of more content), so removing it is correct on its own merits, not
just a workaround. Making content fit short viewports is what keeps that
removal safe rather than trading a scroll trap for silently clipped content.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/scroll-morph-stage.tsx` | edit | `bodyRef`: `overflow-y-auto` → `overflow-hidden` |
| `src/app/globals.css` | edit | new `short` custom variant, `(max-height: 700px)` |
| `src/components/terminal-panel.tsx` | edit | `WINDOW_BODY` padding trimmed under `short:` |
| `src/components/homepage/about-teaser.tsx` | edit | headline size + gap trimmed under `short:` |
| `src/components/homepage/services-focus.tsx` | edit | grid margin + card padding trimmed under `short:` |
| `src/components/homepage/how-we-work.tsx` | edit | margins + grid gap trimmed under `short:` |
| `src/components/homepage/selected-work.tsx` | edit | margin, gap, and image size trimmed under `short:` |
| `src/components/homepage/pricing-table.tsx` | edit | margins trimmed under `short:` |
| `src/components/boot-sequence.tsx` | edit | overlay: `overflow-y-auto`, `short:justify-start`, trimmed `short:` gap/padding |
