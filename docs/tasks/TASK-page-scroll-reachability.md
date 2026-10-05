# TASK: every page must scroll to its end

4 October 2026. Status: investigation in progress. Benito reports Work stops
mid-page as projects are added and asks to verify every page.

## 1. Current scenario

Work uses one `ScrollMorphStage` for an expanding project index and every case
preview. Its frame is capped at 86dvh with overflow hidden. The natural content
height can exceed that cap, particularly on phones or with more project rows.
The separate `ScrollStage` currently allows nested overflow scrolling, which can
consume gestures intended for the main document. Lenis/root dimension freshness
and boot locks also need actual wheel/keyboard checks, not only scrollTo assertions.

## 2. Planned changes

- Reproduce with real scroll input and inspect document position, frame clipping,
  footer reachability, and growing content at desktop/mobile sizes in both motion modes.
- Make oversized morph content use normal document flow, while preserving existing
  motifs/pinning when all layers fit. Observe actual content and viewport sizes;
  do not add another independent scroll container or squeeze/hide project content.
- Check the standalone pinned stages and root scroll state for the same issue.
  Keep scroll measurements in the shared frame loop and avoid read/write interleaving.
- Audit all page routes, every case study, expanded planning briefs and the builder.
  Include newly appended content and reflow/resize in regression coverage.
- Update page counts/copy from actual project data where appropriate, `/system`,
  documentation and targeted checks. Build/lint and commit verified work locally.

## 3. Why

Adding a project must never make existing content or the footer unreachable.
Every page should have one usable document scroll path, regardless of content length,
viewport size, zoom or motion preference.

## 4. Affected files

| File | Change | Purpose |
|---|---|---|
| `src/app/layout.tsx` | edit | Let the root document grow so Lenis observes content growth |
| `src/components/scroll-morph-stage.tsx` | edit | Observe layers and use full document flow for oversized content |
| `src/components/scroll-stage.tsx` | edit | Remove nested stage scrolling; reflow/reset progress/restore pinning |
| `src/lib/use-page-reduced-motion.ts` | new | Shared hydration-compatible media-query subscription |
| Work page/index | edit | Derive counts from project data |
| `src/components/project-media.tsx` | edit | Show long screenshots through document scrolling |
| `src/app/system/page.tsx` | edit | Actual end footer, reflow specimens and bounded decorative glow |
| `src/components/boot-sequence.tsx` | edit | Expose an inert phase marker for reliable overlay-readiness checks |
| `scripts/check-page-scroll.mjs` | new | Real wheel/End input across every page and dynamic content |
| README/CLAUDE/review guide | edit | Record the scroll contract and review workflow |

No push or deployment.

## Implemented findings

Two independent causes were reproduced: Work's growing natural content exceeded
its 86dvh frame, and fixed `html.h-full` prevented Lenis's default root
ResizeObserver from seeing page growth. With the old root, a wheel could stop at
an older maximum even when native document height was larger. Minimum root/body
heights allow the existing autoResize mechanism to receive new dimensions.

Oversized morph layers switch the entire stage to ordinary stacked panels.
Standalone stages reflow rather than create a nested scroller. Compact sections
retain pinning; resize/content observations can restore it. Progress resets
explicitly because React does not automatically restore a CSS variable mutated
by the frame loop. IDs/keyframes and the page-specific motif language remain.

The audit also found two decorative BorderGlow edge spans extending System's
mobile page width; its specimen now bounds that decorative paint. It has an end
footer separate from the existing mid-page footer specimen. Case galleries no
longer intercept page scrolling. Work count derives from the project array.

## Verification

Production build and lint passed (zero lint errors; two existing BootSequence
hook warnings). Full route audit is in progress against the production preview
on port 3194. Earlier diagnostic runs included an incorrectly selected port 3000;
those results are not the final production audit. The script records its origin.

The final audit checks 20 content routes at 1440×900, 390×844 and 320×568 with
normal/reduced motion (120 configurations), wheel and End footer reachability,
horizontal width, no competing main-content scrollers, dynamic 1400px Work growth,
expanded real post briefs and compact→oversized→compact stage behavior.


The intermittent input checks were traced to an incorrect readiness selector:
`.boot-gate` is only the controls shown during gating, not the full overlay. It
is absent while booting and exiting, so waiting for that child to disappear could
start input before boot completed. An inert `data-boot-phase` on the existing
overlay makes its complete removal observable. No boot behavior was changed.
The scrolling check uses the existing keyboard entry and waits for the whole
overlay to close, including reduced motion. Optional `SCROLL_WEBGL=0` exercises
the graphics fallback; normal runs keep WebGL enabled.
