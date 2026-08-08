interface Boundary {
  index: number;
  top: number;
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
        top: el.getBoundingClientRect().top + window.scrollY,
      }))
      .sort((a, b) => a.top - b.top);
  }

  function read(): number {
    if (boundaries.length === 0) return 0;

    const anchor = window.scrollY + window.innerHeight * anchorRatio;
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
