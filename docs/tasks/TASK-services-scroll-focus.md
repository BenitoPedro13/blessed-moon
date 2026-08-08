# TASK: Scroll-pinned focus sequence for Services

## 1. Current scenario

`ServicesGrid` (`src/components/homepage/services-grid.tsx`) shows all 8 services at once in
a static 2x4/4x2 bordered grid, each cell just an index number + name — "like a normal
website," per user feedback, with no room to give any one service real attention. Compared
against the user's own portfolio (`benitopedro.vercel.app`, studied via a screen recording,
`VIDEOS/benitopedro.mov`) and further clarified in conversation: the wanted pattern is a true
scroll-pinned focus sequence — each service takes over the full viewport as the user scrolls
past it, then releases to the next, closer to an Apple product page than a content grid.

Note: the portfolio reference itself doesn't actually do this (it uses rich cards + a
click-to-expand accordion + tabs — progressive disclosure, not scroll-pinning). The
scroll-pinned direction was confirmed explicitly by the user as the one they want, distinct
from what's on the reference site.

## 2. Planned changes

**Technique**: `position: sticky` pinned stage inside a tall wrapper (`items.length * 60vh`),
not JS scroll-hijacking (no `preventDefault` on wheel/touch — that breaks trackpad/touch
scroll and is an accessibility problem). A local scroll listener reads the wrapper's own
`getBoundingClientRect()` each `requestAnimationFrame` tick (same pattern as
`src/lib/ascii-canvas/scroll-progress.ts`) to compute a continuous progress value and derive
`activeIndex`. This is the standard, native-scroll-preserving way to do this kind of
storytelling section — confirmed against how the ASCII canvas's own existing scroll tracker
already works in this codebase, not a new unproven technique.

- **`src/components/homepage/services-grid.tsx`** → rewritten and renamed to
  **`services-focus.tsx`** (export renamed `ServicesGrid` → `ServicesFocus`, since it's no
  longer a grid):
  - New `usePinnedProgress(itemCount, ref)` hook (inline in the file, small enough not to
    warrant its own module): rAF loop reading the wrapper's bounding rect, returns
    `activeIndex`.
  - Each service gets a genuine one-line description (new copy — the wireframe only ever had
    bare names here; per user's earlier "the handoff was just a start," this section's copy
    isn't treated as locked).
  - Active service renders large (number, name, description) inside the sticky stage, with a
    Framer Motion crossfade between items as `activeIndex` changes.
  - A side list of all 8 service names, active one highlighted amber, others dimmed — gives
    orientation (matches the section-numbering-as-navigation idiom already used elsewhere on
    this site) without needing to scroll back up.
  - **Reduced motion**: falls back to the original flat static grid layout entirely (via
    `useReducedMotion`) rather than trying to make a pinned/animated sequence
    motion-reduced — simplest, most robust for vestibular-sensitive users and matches how
    `AsciiObject`/`Reveal` already degrade in this codebase.
- **`src/app/page.tsx`**: update the import/usage for the renamed component.
- **Not changed**: `SelectedWork` stays a flat list for now — only 3 items, already has
  per-item description; converting it to the same pattern is a reasonable follow-up but out
  of scope here (avoid scope creep across two sections at once).

## 3. Why

Direct user request, twice clarified: first by pointing at their own portfolio as a reference
(which turned out to demonstrate a different pattern than what they actually wanted), then by
explicitly choosing "true scroll-pinned focus sequence" over the more conservative
"richer cards" alternative when asked directly. The existing 8-cell grid gives every service
equal, minimal weight — no service gets enough room to say anything real about what it is.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/homepage/services-focus.tsx` | new (replaces `services-grid.tsx`) | pinned scroll-focus sequence, new per-service copy |
| `src/components/homepage/services-grid.tsx` | deleted | superseded by `services-focus.tsx` |
| `src/app/page.tsx` | edit | `ServicesGrid` → `ServicesFocus` |

## 5. Revision — superseded by a single terminal-framed dissolve panel

The `position: sticky` pinned-focus mechanism above shipped and worked, but the user then
asked for canvasui's `ParticleScroll` (content dissolves into sand below a scroll line,
reassembles above it) wrapped around everything below Hero. That component drives its dissolve
off its **own internal scroll container**, not the page's — it needs to be genuinely shorter
than its content to have anything to react to. A bounded `ParticleScroll` box and a `sticky`
child that pins against the page's viewport fight each other: constrain the box and `sticky`
loses its containing scroll context; size the box to its content and `ParticleScroll` never
has real overflow to dissolve.

Given the choice (see `TASK-sound-and-boot.md` §0 for the rest of that conversation), the user
picked replacing pinned-focus everywhere rather than keeping it and dropping `ParticleScroll`.
`ServicesFocus`, `HowWeWork`, `SelectedWork`, and `PricingTable` all reverted to their flat
(grid/list) layouts — the same components each already had as a `prefers-reduced-motion`
fallback, promoted back to being the only layout. `PinnedFocus` (`src/components/pinned-focus.tsx`)
was deleted as unused. See `src/app/page.tsx`: Hero stays in normal page flow; everything from
`AboutTeaser` through `ClosingCta` now lives inside one `ParticleScroll` panel framed as a
terminal window (chrome bar reading `blessed_moon --explore`), sized `h-[80vh]` so it has
genuine internal overflow for the dissolve effect to react to.

The "one service takes over the full viewport" effect this task originally built is gone —
a real trade-off the user chose explicitly, not an oversight.
