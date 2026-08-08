# TASK: Sound, boot sequence, and the rest of canvasui/animate-ui

## 1. Current scenario

Following `TASK-ascii-canvas-layer.md` and `TASK-services-scroll-focus.md`, the site had a
scroll-driven ASCII moon background and scroll-focus content sections but no sound, no
loading sequence, and only one of canvasui.dev's components in use (`AsciiObject`). The user
asked for a more "cinematic, immersive, framer-like" feel across several rounds, covering:
a real star field, `ParticleObject`/`ParticleScroll`/`DecryptReveal` (the other three
canvasui components, alongside `AsciiObject`), sound (ambient + UI), and an initial loading
sequence "so we have a smooth site experience for loading the assets before render."

## 2. Planned changes

### Star field

Installed `@animate-ui/components-backgrounds-stars` via the shadcn CLI (same registry
pattern as `AsciiObject`, and the same one the user's own portfolio uses — confirmed by
reading its `components.json`). Mounted behind `AsciiCanvas` in `layout.tsx`, `bg-transparent`
so the real `--background` token shows through instead of the component's own default
gradient.

### DecryptReveal — tried on Hero, reverted

Wrapped the Hero headline to get a cursor-reveal cipher effect. Went through two real bugs
before being dropped entirely:
1. In native (WebGL-capture) mode, DecryptReveal's real children move into an
   absolutely-positioned canvas, out of normal document flow — the wrapper has nothing left
   to size around and collapses to 0×0 unless given explicit dimensions (confirmed directly
   in the user's devtools: wrapper showed literally "0 × 0"). Fixed by giving it explicit
   height/width.
2. Even fixed, the headline was still invisible in testing. Root cause: DecryptReveal's idle
   state (cursor not over it) renders a **scrambled cipher** at low opacity
   (`passthrough: 0.15` default) — sitting directly on the ASCII moon's own dense texture,
   that scrambled cipher visually camouflages into the moon almost perfectly. Not blank,
   just indistinguishable from its background.

Decision: dropped from Hero. The headline is the site's actual tagline — it shouldn't depend
on an effect that can blend into its own backdrop. `src/components/canvasui/DecryptReveal.tsx`
stays installed (harmless, degrades to plain content) but unused for now.

### ParticleObject — moved to a dedicated closing CTA

First tried as a small icon next to the footer copyright — too easy to miss, not a real
"moment." Rewired into a new section, `ClosingCta` (`src/components/homepage/closing-cta.tsx`,
not in the original wireframe — added per "the handoff was just a start"), where it's the
large, cursor-reactive centerpiece behind a closing "Book a call" band.

### ParticleScroll — real dissolve panel, not the tiny side-lists it started as

First attempt: small side-lists inside the Services/How We Work pinned-focus stages, given
fixed heights shorter than their content so the dissolve effect had genuine overflow to react
to. Second round of feedback: the user wanted it wrapping everything below Hero instead. That
conflicts with `position: sticky` pinned-focus sections (see `TASK-services-scroll-focus.md`
§5) — resolved by dropping pinned-focus in favor of one `ParticleScroll` panel, styled as a
terminal window, wrapping About through ClosingCta. See `src/app/page.tsx`.

**Real, confirmed browser-support correction mid-task**: initially believed (from secondary
research — a WICG explainer page) that the underlying `html-in-canvas` API `ParticleScroll`
and `DecryptReveal` depend on was Chrome-Canary-only, so both would always render their
(harmless) fallback for any real visitor. The user pushed back and both of us ran
`document.createElement('canvas').getContext('2d').drawElementImage` in devtools on
`canvasui.dev` and on localhost — both returned `'function'`. The capability genuinely is
available in current stable Chrome; the secondary research was stale. Correcting this
explicitly because it reversed an earlier "this can't work" conclusion in this same
conversation, and getting it right mattered for whether the rest of the canvasui components
were viable at all.

### Sound

`src/components/sound-provider.tsx` — React context, `muted` defaults `true` (opt-in, not
opt-on-by-default), persisted to `localStorage`. `playHover`/`playClick` for UI blips
(fire on real gesture events, no autoplay-policy issue); a separate ambient `<audio loop>`
element that only attempts playback after the *first* user gesture on the page
(`pointerdown`/`keydown`), per browser autoplay policy — see `AMBIENT_SRC` in that file.

**Hydration bug and fix**: the natural way to read `localStorage` for the initial `muted`
value is a lazy `useState(() => ...)` initializer — but that makes the client's first render
depend on client-only data the server never had, which is exactly what causes a hydration
mismatch (confirmed via a real `aria-pressed`/`aria-label`/icon mismatch in the browser, once
sound had actually been toggled in a prior session). Correct pattern: `useState(true)` fixed
on both server and client, corrected from `localStorage` in a mount-only effect afterward.
This is a case where the `react-hooks/set-state-in-effect` lint rule's default heuristic is
wrong for the situation — suppressed with `eslint-disable-next-line` and a comment explaining
why (same treatment given to `animate-ui`'s `stars.tsx`, which has the identical
SSR-safe-randomization shape).

**Sound files** — all downloaded with explicit permission, sourced for genuine CC0/direct-URL
availability (Freesound and Pixabay were both unreachable/blocked for direct download from
this environment; documented so a future session doesn't re-attempt the same dead ends):
- `public/sounds/hover.ogg`, `click.ogg`, `toggle.ogg` — Kenney.nl "UI Audio" /
  "Interface Sounds" packs, CC0, no attribution required.
- `public/sounds/ambient.mp3` — "Scifi City - Ambient Loop" by TinyWorlds,
  [opengameart.org/content/scifi-city-ambient-loop](https://opengameart.org/content/scifi-city-ambient-loop),
  CC0.

Wired onto: nav links + logo, footer links, the "Book a call" buttons (nav + ClosingCta),
About's "See what we build" link, Services cards, Selected Work rows, Pricing rows (hover),
and a direct confirmation blip on the mute toggle itself when turning sound *on* (not on
muting — going quiet shouldn't make noise).

### Boot sequence

`src/components/boot-sequence.tsx` — a full-viewport terminal boot log, matching the TUI
identity already established by the nav's `>|<` mark and the section numbering, rather than a
generic spinner. Dismisses on `document.fonts.ready`, hard-capped at `MAX_WAIT_MS` (2.2s) so
it can never hang open regardless of what that promise does. Click or any key skips straight
to the exit. Respects `prefers-reduced-motion`.

Went through two broken versions before this one, both worth recording so they aren't
retried:
1. Character-by-character typing via a recursive `setTimeout` chain, gated by two effects
   with overlapping responsibilities. Broke into a solid, permanently blank overlay on reload
   in testing — root cause never conclusively pinned down (no console errors, page structure
   looked correct in devtools, text simply never appeared).
2. A "start fully revealed as a fail-safe, then reset to blank and re-reveal progressively"
   version — the reset-to-blank-on-mount step reintroduces exactly the same failure shape as
   version 1 if that effect doesn't run correctly, defeating the fail-safe.

Final version: **all lines render immediately**, unconditionally, every time — no
reveal/typing state machine to break. Only the *dismiss* timing is dynamic. Trades the typing
animation's polish for something structurally unable to fail blank.

## 3. Why

User-directed, across many rounds of real recordings and devtools screenshots — see
conversation history for the specific evidence at each turn (0×0 wrapper, hydration diff,
`drawElementImage` support check, etc.). The throughline: prefer a technique that's simple
enough to reason about and fails toward "still shows something reasonable" over one that's
more impressive when it works but has more ways to break silently.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/animate-ui/components/backgrounds/stars.tsx` | new (shadcn CLI) | star field, mounted in layout behind AsciiCanvas |
| `src/components/canvasui/ParticleObject.tsx` | new (shadcn CLI) | cursor-reactive particle moon, used in ClosingCta |
| `src/components/canvasui/ParticleScroll.tsx` | new (shadcn CLI) | dissolve-panel effect, wraps About–ClosingCta in page.tsx |
| `src/components/canvasui/DecryptReveal.tsx` | new (shadcn CLI) | installed, currently unused (see above) |
| `src/components/homepage/closing-cta.tsx` | new | ParticleObject's featured moment |
| `src/components/sound-provider.tsx` | new | mute state, hover/click/ambient playback |
| `src/components/sound-toggle.tsx` | new | mute/unmute button, in SiteNav |
| `src/components/boot-sequence.tsx` | new | terminal boot log, mounted in layout |
| `public/sounds/hover.ogg`, `click.ogg`, `toggle.ogg`, `ambient.mp3` | new | CC0 audio, see sourcing above |
| `src/app/layout.tsx` | edit | mounts StarsBackground, BootSequence, SoundProvider |
| `src/app/page.tsx` | edit | ParticleScroll terminal panel wrapping About–ClosingCta |
| `src/components/site-nav.tsx`, `site-footer.tsx`, `homepage/about-teaser.tsx`, `homepage/services-focus.tsx`, `homepage/selected-work.tsx`, `homepage/pricing-table.tsx` | edit | sound hooks wired onto interactive elements |
