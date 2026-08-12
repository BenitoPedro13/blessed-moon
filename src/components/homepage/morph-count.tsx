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
 * a token mid-flight and would overwrite it.
 *
 * 1.5em is a ceiling, not a taste call: every sentence holding a token is set
 * at `leading-[2.1]`, and a glyph much past this overflows its own line box
 * and collides with the line above it. Raise one and you have to raise the
 * other. */
export const COUNT_INLINE =
  "font-mono text-[1.5em] font-semibold leading-[0.9] align-[-0.14em] text-primary";

/** The display end — the largest type on the page after the Hero headline,
 * deliberately: this is what the eye tracks across the boundary.
 *
 * Mono, and big, on purpose. Space Grotesk carries every headline on the
 * site; JetBrains Mono is otherwise confined to eyebrows and captions, so
 * blowing it up to display size is the one place the utility face becomes the
 * loudest thing on screen. That's what makes the token read as terminal
 * output — an emitted value — rather than as another headline.
 *
 * ## An amber numeral means "this is the thing that travels"
 *
 * Amber does two jobs on this page and they must not blur into each other.
 * Small and on a control — a CTA border, a link arrow, a card's hover edge —
 * it means *interactive*. On a numeral, at size, it means *this is a token
 * mid-journey*, and nothing else in the homepage body is allowed to look like
 * that. How We Work's step numbers were amber until this rule existed, three
 * lines under the amber display 4, and the section had two competing numeric
 * systems with no way to tell which one mattered; they're foreground now. */
export const COUNT_DISPLAY =
  "font-mono text-[5rem] font-semibold leading-[0.78] tracking-[-0.04em] text-primary sm:text-[6.5rem] lg:text-[8rem]";
