# TASK: Hidden `/system` design-system page

## Current scenario

There is no single place that renders this site's design tokens and shared components
together. `docs/design-handoff.md` describes the palette, type scale, and interactions in
prose, but nothing shows them live, rendered from the actual CSS variables in
`src/app/globals.css` and the actual components in `src/components/`. Checking whether a
new component correctly inherited the tokens (sharp corners, amber accent, mono/sans
pairing) currently means visiting whichever page uses it.

A sibling project (`/Users/benito/Documents/personal/prumo`) has this exact pattern at
`/sistema`: a hidden, `noindex` route that renders the real palette swatches, real type
scale, and real components side by side, with a standing convention (its `CLAUDE.md` §3.1)
that any new shared component gets a panel there as part of finishing its task. That
pattern is being adopted here as `/system`, ahead of the larger upcoming design work (hero
treatment, particle cursor, unified card hover) so those pieces have a sandbox to be built
and reviewed in before they touch live pages.

## Planned changes

1. **New route** `src/app/system/page.tsx` — hidden design-system page:
   - `export const metadata = { title: "System", robots: { index: false, follow: false } }`.
   - Unlinked from `SiteNav`/`SiteFooter`/sitemap — reachable only by direct URL.
   - **Palette** panel: swatches for `background`, `foreground`, `primary` (amber accent),
     `muted-foreground`, `border`, `card`, each rendered from the real Tailwind token
     classes (`bg-background`, `bg-primary`, etc.), not hardcoded hex values, so a token
     edit in `globals.css` shows up here automatically.
   - **Typography** panel: the documented type scale from `design-handoff.md` (hero H1
     ~56–72px, section H2 ~26–32px, body ~12–14px, mono uppercase labels ~9.5–10.5px),
     each row set in the real `font-sans`/`font-mono` classes with its px size and tracking
     noted alongside, mirroring the live scale rather than restating it in prose.
   - **Spacing/Radius** note: a short callout that radius is `0` everywhere and section
     padding follows the ~52px/28px rhythm — not a swatch, just the rule stated once next
     to a bordered box that demonstrates it.
   - **Primitives** panel: `Button` (default/outline/ghost, a couple of sizes), `Input`,
     `Textarea`, `Select` from `src/components/ui/`, restyled as they already are
     site-wide (sharp corners, `border-border/80`, mono uppercase button labels).
   - **Composites** panel: `SectionHeading`, a `Reveal`-wrapped sample (so the
     blur/slide/spring entrance is visible without scrolling a full page), `SoundToggle`,
     and `SiteNav`/`SiteFooter` each rendered inside a bordered frame (matching prumo's
     approach of framing full-width components rather than trying to make them look native
     inline).
   - **Signature effects** panel: a live `AsciiObject` sample (moon, same `/models/moon.glb`
     asset and tonal settings as `AsciiCanvas`) and a live `ParticleObject` sample (same
     asset, matching the closing-CTA's amber tint) — these are the site's actual visual
     signature, so they get real live panels, not a screenshot or description.
   - **Contact form** panel: the real `ContactForm` component (same as prumo's page reusing
     its real form rather than a mockup), passed `agencyEmail={null}` to match current
     production state (agency inbox not yet provisioned) — submitting here exercises the
     same clipboard-fallback path the live `/contact` page does.
2. **`CLAUDE.md` convention addition** (§3.1 / §4, mirroring prumo's rule): a new shared
   component added to `src/components/` gets a panel on `/system` as part of finishing that
   task — otherwise the task isn't done, same as a stale `README.md`.
3. **`README.md`**: note the route under the existing Layout/routes description.

**Alternatives considered and rejected:**
- *Storybook.* Rejected for the same reason prumo rejected it: a second dev server and a
  parallel story format for a single-app, single-designer project. A route that renders the
  real tokens costs nothing extra.
- *Put it behind auth.* Rejected — nothing on the page is confidential (public brand
  decisions, no client data), so an auth gate costs more than it protects, same reasoning as
  prumo's task doc.

## Why

This closes the same gap prumo's version closes: `docs/design-handoff.md` describes the
system in prose, and the live pages use it, but nothing shows the system itself, rendered.
A palette swatch built from `bg-primary` catches a broken token immediately; a hex code in a
markdown table never does. It's also the sandbox the upcoming hero/particle-cursor/card-hover
work needs — those get built and shown here first, before going live on production pages.

## Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/app/system/page.tsx` | new | hidden design-system route, `noindex` |
| `CLAUDE.md` | edit | §3.1/§4: new shared component ⇒ new `/system` panel is part of the task |
| `README.md` | edit | note the `/system` route under existing routes/layout description |
