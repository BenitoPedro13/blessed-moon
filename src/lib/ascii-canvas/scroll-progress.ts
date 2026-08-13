interface Boundary {
  index: number;
  /** Document-relative position, cached at `measure()` time — see the note on
   * `read()` below for why caching is correct again. */
  top: number;
}

/**
 * Caches each boundary's document-relative position at `measure()` time and
 * resolves `read()` from `window.scrollY` — arithmetic, with no layout read on
 * the animation path.
 *
 * This previously called `getBoundingClientRect()` per boundary per frame. That
 * was necessary while most of the homepage's sections lived inside
 * `ParticleScroll`'s own independently scrolling panel: scrolling *inside* that
 * panel doesn't move `window.scrollY` at all, so a cached document-relative
 * position went stale the moment the inner scroll moved, silently mis-tracking
 * which section was on screen. A live rect always reflects true on-screen
 * position regardless of what moved an element, so it was the only thing that
 * worked for both scroll contexts.
 *
 * `TASK-homepage-unify-scroll.md` removed that panel, and every tracked element
 * is back in normal document flow — `ScrollMorphStage` emits its keyframe
 * markers as absolutely positioned children of a normal-flow wrapper, which
 * still moves with the document. So the fixed relationship between an element's
 * position and `window.scrollY` holds again, and the cache is simply the correct
 * structure rather than an optimization layered over a workaround.
 *
 * The judgement that a rect per element per frame "isn't a meaningful cost" also
 * turned out to be wrong on a mid-range phone: it measured at 7.7% of
 * main-thread self-time, plus the forced layout recalcs it triggered. See
 * `docs/tasks/TASK-frame-budget-cleanup.md`.
 *
 * **If a genuinely independent nested scroller is ever reintroduced, this has to
 * go back to live rects** — the cache cannot see scroll that isn't the
 * document's.
 *
 * `measure()` must therefore run on anything that moves the tracked elements:
 * viewport resize, route change, and the post-mount settle timeout. Callers
 * already do this (`ascii-canvas.tsx`, `site-nav.tsx`).
 *
 * Tracks a continuous "morph" value (base keyframe index + fractional progress
 * to the next one) from `[data-ascii-keyframe]` elements in the document, using
 * an anchor line partway down the viewport rather than IntersectionObserver
 * thresholds — so the value changes smoothly on every scroll frame instead of
 * jumping at fixed steps.
 */
export function createScrollTracker(anchorRatio = 0.35) {
  let boundaries: Boundary[] = [];

  function measure() {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-ascii-keyframe]"),
    );
    boundaries = elements
      .map((el) => ({
        index: Number(el.dataset.asciiKeyframe),
        top: el.getBoundingClientRect().top + window.scrollY,
      }))
      .sort((a, b) => a.top - b.top);
  }

  /**
   * `scrollY`/`innerHeight` are parameters so a caller already holding this
   * frame's values (`frame-loop`'s `FrameContext`) can pass them straight
   * through instead of re-reading the window per tracker — there are two
   * tracker instances on a page, in `ascii-canvas` and `site-nav`.
   *
   * The anchor is expressed in document space here, where it used to be in
   * viewport space. Same line on screen either way: the previous form compared
   * viewport-relative rects against `innerHeight * anchorRatio`, and adding
   * `scrollY` to both sides is what turns that into this.
   */
  function read(scrollY = window.scrollY, innerHeight = window.innerHeight): number {
    if (boundaries.length === 0) return 0;

    const anchor = scrollY + innerHeight * anchorRatio;
    let i = 0;
    while (i < boundaries.length - 1 && boundaries[i + 1].top <= anchor) i++;

    const current = boundaries[i];
    const next = boundaries[i + 1];
    if (!next) return current.index;

    const span = next.top - current.top;
    const progress = span > 0 ? Math.min(1, Math.max(0, (anchor - current.top) / span)) : 0;
    return current.index + progress * (next.index - current.index);
  }

  return { measure, read };
}
