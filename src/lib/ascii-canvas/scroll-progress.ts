interface Boundary {
  index: number;
  el: HTMLElement;
}

interface LabeledBoundary {
  label: string;
  el: HTMLElement;
}

/**
 * Both trackers below read each boundary element's live
 * `getBoundingClientRect().top` on every `read()` call instead of caching a
 * document-relative position once at `measure()` time. That used to be
 * `rect.top + window.scrollY`, cached — correct only as long as every
 * tracked element sits in normal document flow, where a fixed relationship
 * holds between an element's position and `window.scrollY`. Most of the
 * homepage's sections live inside ParticleScroll's own independently
 * scrolling panel (`app/page.tsx`) — scrolling *inside* that panel doesn't
 * change `window.scrollY` at all, so the cached position went stale the
 * moment that inner scroll moved, silently mis-tracking which section was
 * actually on screen (confirmed via SectionSidebar highlighting the wrong
 * item while scrolled well into Pricing). `getBoundingClientRect()` always
 * reflects true on-screen position regardless of what caused an element to
 * move — outer scroll, inner scroll, or both — so reading it live is what
 * actually works for both. The cost is a `getBoundingClientRect()` call per
 * tracked element per frame instead of per `measure()` — for the ~10-20
 * elements a page has, that's not a meaningful cost.
 */

/**
 * Tracks which `[data-frame-label]` element the same anchor line currently
 * sits over — a discrete "current section" pick, not an interpolated value
 * (no fractional blend between two labels makes sense). Separate from
 * createScrollTracker rather than folded into it: the moon's morph index and
 * a section's nav label are different concerns that happen to share the same
 * boundary-element convention, and keeping them independent means a label
 * typo can't touch the moon's "must not break" keyframe math.
 */
export function createFrameTracker(anchorRatio = 0.35) {
  let boundaries: LabeledBoundary[] = [];

  function measure() {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-frame-label]"),
    );
    boundaries = elements
      .map((el) => ({
        label: el.dataset.frameLabel ?? "",
        el,
        top: el.getBoundingClientRect().top + window.scrollY,
      }))
      .sort((a, b) => a.top - b.top)
      .map(({ label, el }) => ({ label, el }));
  }

  function read(): { index: number; label: string } | null {
    if (boundaries.length === 0) return null;

    const tops = boundaries.map((b) => b.el.getBoundingClientRect().top);
    const anchor = window.innerHeight * anchorRatio;
    let i = 0;
    while (i < boundaries.length - 1 && tops[i + 1] <= anchor) i++;

    return { index: i, label: boundaries[i].label };
  }

  /** The full ordered label list — populated by the same `measure()` call,
   * a sidebar's static `items` list and this tracker's moving "current
   * index" pick this way always agree on what section N actually is. */
  function labels(): string[] {
    return boundaries.map((b) => b.label);
  }

  return { measure, read, labels };
}

/**
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
        el,
        top: el.getBoundingClientRect().top + window.scrollY,
      }))
      .sort((a, b) => a.top - b.top)
      .map(({ index, el }) => ({ index, el }));
  }

  function read(): number {
    if (boundaries.length === 0) return 0;

    const tops = boundaries.map((b) => b.el.getBoundingClientRect().top);
    const anchor = window.innerHeight * anchorRatio;
    let i = 0;
    while (i < boundaries.length - 1 && tops[i + 1] <= anchor) i++;

    const current = boundaries[i];
    const next = boundaries[i + 1];
    if (!next) return current.index;

    const span = tops[i + 1] - tops[i];
    const progress = span > 0 ? Math.min(1, Math.max(0, (anchor - tops[i]) / span)) : 0;
    return current.index + progress * (next.index - current.index);
  }

  return { measure, read };
}
