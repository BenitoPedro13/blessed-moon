interface Boundary {
  index: number;
  top: number;
}

interface LabeledBoundary {
  label: string;
  top: number;
}

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
        top: el.getBoundingClientRect().top + window.scrollY,
      }))
      .sort((a, b) => a.top - b.top);
  }

  function read(): string | null {
    if (boundaries.length === 0) return null;

    const anchor = window.scrollY + window.innerHeight * anchorRatio;
    let i = 0;
    while (i < boundaries.length - 1 && boundaries[i + 1].top <= anchor) i++;

    return boundaries[i].label;
  }

  return { measure, read };
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
