# TASK: Clothe the sections — terminal chrome, surfaces, and tonal range

> Direct feedback on the rebuilt homepage: *"something seems hollow in the sections yet,
> the colors and fonts and only numbers on this starts and particles background makes the
> content seem without clothes."* Three separate observations, one root cause.

## Current scenario

The homepage body is five morph layers of text sitting directly on `#050505` with a
drifting particle field behind. Reviewing `videos/afterhomerework.mov` against the theme
tokens, the "without clothes" reading is literally correct — there is no material anywhere:

- **No surfaces.** Nothing in About, How We Work, or Selected Work sits *on* anything. Only
  Services (its 8-card grid) and Pricing (tier hairlines) have any structure at all; the
  other three are unbounded text floating in a particle field. Content has no edge, so it
  has no relationship to the frame it's in.
- **No hue, anywhere.** Every surface token in `globals.css` is neutral white-alpha on
  near-black: `--border` is `rgba(255,255,255,0.12)`, `--muted-foreground` is
  `rgba(255,255,255,0.55)`, `--accent` is `rgba(255,255,255,0.06)`. The entire site is
  greyscale plus one amber. There is no tonal *temperature* for the amber to play against,
  which is why the palette reads thin rather than rich.
- **The eyebrow is naked.** Every section opens with `01 / ABOUT` floating alone above a
  headline — "only numbers on this starts." It's a label with nothing to label, doing no
  structural work.

The underlying miss: the site has the TUI *palette* and the TUI *typeface*, but none of the
TUI *structure*. A terminal interface is mostly chrome — panel borders, window titles set
into the top rule, corner marks, status lines, labeled fields. The homepage previously had
some of this (the ParticleScroll "terminal-framed panel"), and it was removed with
ParticleScroll in `TASK-homepage-unify-scroll.md` for its broken scroll behaviour. The
framing was never replaced. That's the hole.

## Planned changes

### 1. `TerminalPanel` — the clothing

A new shared component wrapping each morph layer's content:

- Hairline border and a barely-there surface fill, so content sits on a defined plane
  instead of floating over the particle field.
- **The section eyebrow moves into the top border**, interrupting it the way a fieldset
  legend or a TUI window title does: `┌─ 01 / ABOUT ──────────────┐`. This is what gives
  the number a job — it stops being a floating label and becomes part of the frame. Fixes
  "only numbers on this starts" without deleting the numbering (which is a pinned contract,
  per CLAUDE.md, because it drives the moon's keyframes).
- Small corner marks, and a status line in the bottom rule carrying something true for that
  section rather than decoration.

Consistent chrome around deliberately varied content is how a real TUI works, so this does
*not* undo the "each section its own composition" work — the frame is the window, the
composition is what's in it.

### 2. Give the dark a temperature

Introduce a slight cool cast to *surfaces and borders only* — panel fill, hairlines, muted
text — while the page ground stays the near-black the brief specifies. Warm accent against
a cool ground is what makes `#ff6a1f` read as rich rather than as orange-on-grey. No second
accent hue is introduced; the brief pins amber, and adding a second colour is the wrong fix
for this complaint.

### 3. Type roles

Sharpen the three roles rather than adding a face: mono/uppercase/tracked for chrome and
meta (now literally the panel chrome), Space Grotesk at weight for headlines, and a real
intermediate body tier so text isn't binary between near-white and 55% grey.

## Why

Requested directly. The morph mechanism itself is confirmed working on video, so the next
gap is material, not motion — and "hollow" is a structural complaint that more animation
would make worse, not better. Cost: one new shared component, a token addition, and a pass
over five layers. Risk: five identical frames could read as monotony, which is the failure
mode to watch in review.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/terminal-panel.tsx` | new | frame, surface, legend-style eyebrow, corner marks, status line |
| `src/app/globals.css` | edit | cool-cast surface/border tokens; body-tier text token |
| `src/components/homepage/*.tsx` (5 layers) | edit | wrap in `TerminalPanel`, hand the eyebrow to it |
| `src/components/section-heading.tsx` | edit | gains the in-border variant used as a panel legend |
| `src/app/system/page.tsx` | edit | `TerminalPanel` panel (§3.1 — a shared component without one is unfinished) |
| `src/components/ascii-canvas.tsx` | done | moon eased down across Hero → About so copy is legible over it |
| `CLAUDE.md` | edit | note the chrome layer + the cool-surface/warm-accent rule |
