# TASK: Fallback-mode notice for the homepage's html-in-canvas panel

## 1. Current scenario

The homepage (`src/app/page.tsx`) wraps everything below `Hero` in one terminal-framed
panel (header row reading `blessed_moon --explore` / `scroll_`) driven by `ParticleScroll`
(`src/components/canvasui/ParticleScroll.tsx`), which dissolves that panel's content into
sand as the user scrolls, built on the experimental `html-in-canvas` browser API. Per
`TASK-html-in-canvas-origin-trial.md`, that API is Chrome-only (148–150) and, outside a
registered Origin Trial origin, unavailable to ordinary visitors. `ParticleScroll` already
detects support via `supportsHtmlInCanvas()` and falls back to the same content rendered
as a plain scrollable panel — correctly graceful, per `CLAUDE.md` §0 ("must degrade
gracefully... never a blank or broken hero"), but **silent**: a visitor on the fallback path
has no way to know a richer effect exists or why they're not seeing it.

The user shared a screenshot from canvasui.dev's own component docs — an info panel that
tells a visitor "this component needs HTML-in-Canvas, which Safari doesn't support," with a
collapsed/expandable "See how" section giving the `chrome://flags` steps to turn it on — and
asked for the equivalent, restyled to match this site's own design. Confirmed placement with
the user: **inline on the homepage panel**, visible only to visitors currently on the
fallback path (not a sitewide or footer element).

## 2. Planned changes

- **New component** `src/components/html-in-canvas-notice.tsx` (`HtmlInCanvasNotice`,
  client component):
  - Uses the same `supportsHtmlInCanvas()` probe already exported from `ParticleScroll.tsx`,
    read via `useSyncExternalStore` (same pattern `ParticleScroll` itself uses) so the check
    is consistent and SSR-safe (`false` on the server snapshot — fallback copy never flashes
    incorrectly on a supported browser after hydration).
  - Renders `null` outright when the browser supports the effect — this is a disclosure for
    the fallback path only, not a permanent badge.
  - Collapsed by default (local `useState`, no persistence needed): a single terminal-style
    line inside the existing panel header area, e.g.
    `› static_view — this browser doesn't render the scroll effect below   [ details ]`.
  - Expanded state adds a short explanation in brand voice (measured, technical when needed)
    plus the three numbered steps to flip the Chrome flag, mirroring the reference image's
    structure but rewritten instead of copied verbatim, and pointing at the actual flag this
    repo's own task doc verified (`chrome://flags/#canvas-draw-element`, Canary 149+ per
    `TASK-html-in-canvas-origin-trial.md`).
  - Visual language matches the panel it lives in, not shadcn's default `Alert`: monospace
    labels, sharp corners (`--radius: 0`), `border-primary/30`/`text-muted-foreground`
    tokens already used by the panel header in `page.tsx`, amber (`#ff6a1f`) only on the
    interactive toggle/label — not a full colored banner, to stay quiet rather than
    alarm-styled.
- **`src/app/page.tsx`**: render `<HtmlInCanvasNotice />` as an added row directly under the
  existing `blessed_moon --explore` header bar, inside the same bordered panel, above
  `ParticleScroll`.
- **No changes to `ParticleScroll.tsx`** — reuses its existing exported probe rather than
  duplicating detection logic.
- **`docs/design-handoff.md`**: add one line under "Interactions & Behavior" noting the
  fallback disclosure, since it's a real interactive element on the homepage a future reader
  would otherwise have to find by reading code.

### Alternatives considered

- **Footer/credits placement** — considered, rejected by the user in favor of inline-on-panel
  (keeps the disclosure next to the effect it's explaining, only shown to the visitors it's
  actually relevant to).
- **Copying the reference component's rounded-card, blue-info-icon styling as-is** — rejected;
  it's a generic docs-site alert pattern, not this brand's visual language. Restyled to the
  panel's own terminal aesthetic instead (§0 "Brand identity": *"technical when needed,
  always human"* — the content stays technical, the container doesn't look borrowed).
- **Always-expanded** — rejected in favor of collapsed-by-default; matches "quiet confidence"
  in the brand personality and avoids a wall of dev-flag instructions greeting every fallback
  visitor by default.

## 3. Why

Fixes a real gap: fallback visitors currently have no signal that they're seeing a
deliberately simplified version of the page, or that anything more exists. The target
audience (`CLAUDE.md` §0: "founders, CTOs, and product leaders... who value craftsmanship and
clear thinking") is technical enough to find an honest, precise explanation of an
experimental-API fallback more credible than hiding it — consistent with "Illuminated
precision" and the brand's stated comfort being technical when needed. Restyling instead of
reusing the reference's own look keeps the disclosure from reading as a foreign, bolted-on
docs widget.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/components/html-in-canvas-notice.tsx` | new | collapsible fallback-mode notice, terminal/TUI styled |
| `src/app/page.tsx` | edit | renders `<HtmlInCanvasNotice />` inside the existing panel header |
| `docs/design-handoff.md` | edit | one line under "Interactions & Behavior" documenting the disclosure |
| `docs/tasks/TASK-html-in-canvas-fallback-notice.md` | new | this document |
