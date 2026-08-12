# TASK: Interactive scroll-gated boot sequence

## Current scenario

`src/components/boot-sequence.tsx` shows a terminal boot log (`LINES`) on load, fixed
full-viewport, `z-[100]`. It self-dismisses once `document.fonts.ready` resolves (capped at
`MAX_WAIT_MS = 2200`), or immediately on any click/keypress ("skip"). It does not prompt
about sound, and does not gate on scroll — it's a brief loading transition, not an
intentional entry moment. `SoundProvider` (`src/components/sound-provider.tsx`) is
opt-in/muted-by-default; the only way to enable sound today is `SoundToggle` in the nav,
easy to miss on first visit.

The component's own comment documents that a more elaborate, staged-reveal version of this
was tried twice before and rejected both times because it risked "showing nothing" — the
current version deliberately trades that polish for something that can't hang.

## Planned changes

1. **Sound prompt**: once boot lines finish rendering, show "Enable sound for the full
   experience" with two explicit choices — `ENABLE SOUND` (calls `toggleMuted()` from
   `useSound()` if currently muted) and `CONTINUE MUTED` (no-op, just acknowledges the
   choice). Neither choice is required to proceed — sound stays opt-in per
   `sound-provider.tsx`'s existing philosophy.
2. **Scroll-gated reveal**: replace the current auto-timer dismiss with a real gate.
   `document.body.style.overflow` is locked while the gate is up (the real page sits behind
   the fixed overlay and must not scroll independently of it). The gate listens for:
   - `wheel` (deltaY past a small threshold) and `touchmove` (past a small delta) —
     the real scroll gestures on desktop/mobile.
   - `ArrowDown` / `PageDown` / `Space` / `End` keydown — keyboard equivalents of scroll.
   - A visible, focusable **"Begin ↓"** button — the explicit accessible equivalent for
     anyone who can't perform a wheel/touch gesture (switch devices, some AT). A
     scroll-input-only gate with no alternative would be a real operability gap, not a
     style choice — this stays in scope, not cut for "purity" of the scroll-only ask.
   Any of the above triggers the existing fade-out dismiss sequence, then unlocks body
   scroll.
3. **Fallback timeout**: if no interaction happens within `GATE_TIMEOUT_MS` (generous —
   proposing 15000ms), auto-dismiss anyway. Mirrors `MAX_WAIT_MS`'s "can never get stuck
   open" principle, scoped to this being a safety net for a genuinely stuck visitor, not an
   expected path.
4. **`prefers-reduced-motion`**: unchanged behavior — still dismisses immediately, no gate,
   consistent with the existing early-return in the component.
5. No changes to `Reveal`, `ascii-canvas.tsx`, or any per-section scroll-morph logic — the
   "reveal components one by one, framed by scroll" request is already how the rest of the
   site behaves (`Reveal`'s `whileInView` replay-both-directions on every section, the ASCII
   moon's keyframe morph, and the hero's new scroll-linked `ParticleText` gather from
   `TASK-react-bits-mcp-registry.md`). This task is scoped to the gate itself, not a new
   staged-reveal engine.

**Alternatives considered and rejected:**
- *Scroll-only, no keyboard/button alternative.* Rejected — real accessibility regression,
  not just a style tradeoff.
- *A full progressive multi-stage reveal sequence inside the gate itself* (boot lines →
  sound → scroll hint, each individually staggered/animated in). Rejected per the
  component's own documented history — staged/staggered reveal sequences in this exact spot
  were tried twice and both risked rendering blank. Keep the internal boot-line rendering
  as-is (all at once, no stagger); only the sound prompt and scroll-hint appear as static
  blocks once boot lines are showing, no new stagger machinery.

## Why

Requested by the user: an entry moment that prompts for sound and requires a deliberate
scroll to reveal the site, rather than a brief auto-dismissing loading transition. Scoped
tightly against this component's own documented failure history (two prior staged-reveal
attempts risked a blank screen) and against a real accessibility gap (scroll-only gating)
the user didn't ask for but that a literal implementation would introduce.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/boot-sequence.tsx` | edit | sound prompt, scroll/keyboard/button gate, fallback timeout, body-scroll lock |
| `src/app/system/page.tsx` | edit | add a panel (per CLAUDE.md §3.1) — likely a static preview, not a live re-triggerable gate, since it runs once per real page load |
