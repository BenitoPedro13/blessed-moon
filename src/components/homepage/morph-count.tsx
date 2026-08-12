import { TOKEN_DISPLAY, TOKEN_INLINE } from "@/components/morph-tokens";

/**
 * The homepage body's one running motif: an amber numeral is the object that
 * carries you from each section to the next (TASK-homepage-morph-redesign.md
 * §4). It appears small, inline, in the closing sentence of one section and
 * lands large as the display numeral heading the next — the *same* element,
 * interpolated by Motion. The count descends the whole way down the page:
 *
 *   8 kinds of systems → 4 steps → 3 in production → 1 number
 *
 * Breadth narrowing to a single commitment. Both ends of every handoff must
 * stay in sync: change a section's copy so its number no longer matches what
 * the next section shows and the sequence has nothing left to be about.
 *
 * The *type treatment* moved to `morph-tokens.ts` when `/work` and `/about`
 * got stages of their own (TASK-subpage-morph-expansion.md) — they share the
 * language (an amber glyph at display size means "in flight"), not this motif.
 * A descending count is the homepage's argument; `/work` travels a project
 * name and `/about` travels `A → B → 0`. The aliases below stay so the
 * homepage's sections keep naming what they actually carry: a count.
 *
 * See `morph-tokens.ts` for the rule separating amber-as-control from
 * amber-as-token, and for why 1.5em and 8rem are ceilings rather than taste.
 */

/** The inline end — small, in the closing sentence of a section. */
export const COUNT_INLINE = TOKEN_INLINE;

/** The display end — the numeral heading the section that receives it.
 *
 * How We Work's step numbers were amber until the control/token rule existed,
 * three lines under the amber display 4, which gave that section two competing
 * numeric systems and no way to tell which one mattered. They're foreground
 * now. */
export const COUNT_DISPLAY = TOKEN_DISPLAY;
