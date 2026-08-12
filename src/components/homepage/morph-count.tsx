/**
 * The homepage body's one running motif: an amber numeral is the object that
 * carries you from each section to the next (TASK-homepage-morph-redesign.md
 * §4). It appears small, inline, in the closing sentence of one section and
 * lands large as the display numeral heading the next — the *same* element,
 * interpolated by Motion. The count descends the whole way down the page:
 *
 *   8 kinds of systems → 4 steps → 3 in production → 1 number
 *
 * Breadth narrowing to a single commitment. These two class strings are what
 * keep the two ends of every handoff reading as one object rather than four
 * unrelated flourishes, so they live here rather than being retyped per
 * section.
 */

/** The inline end. `em`-sized so it scales with whatever sentence it sits in;
 * `vertical-align` rather than a translate because Motion owns `transform` on
 * a token mid-flight and would overwrite it. */
export const COUNT_INLINE =
  "font-mono text-[1.75em] font-semibold leading-[0.9] align-[-0.18em] text-primary";

/** The display end — the largest type on the page after the Hero headline,
 * deliberately: this is what the eye tracks across the boundary. */
export const COUNT_DISPLAY =
  "font-mono text-[5rem] font-semibold leading-[0.78] tracking-[-0.04em] text-primary sm:text-[6.5rem] lg:text-[8rem]";
