/**
 * The type treatment for a traveling `MorphToken`, shared by every page that
 * runs a `ScrollMorphStage`.
 *
 * What's shared is the *language*, not the motif. An amber glyph at display
 * size means one thing everywhere on this site: **this is the object in
 * flight** — the thing your eye should follow across a section boundary. What
 * travels, and what it means, is chosen per page:
 *
 * - `/`        `8 → 4 → 3 → 1`  — breadth narrowing to one commitment
 * - `/work`    the project name — the row you pick becomes the page
 * - `/about`   `A → B → 0`      — two pillars, zero layers between
 *
 * Copying the homepage's descending count onto the other two would have been
 * the same trick three times with meaning only the first time.
 *
 * ## Amber has two jobs and they must not blur
 *
 * Small and on a control — a CTA border, a link arrow, a card's hover edge —
 * amber means *interactive*. At display size on a token it means *in flight*,
 * and nothing else is allowed to look like that. This is why `/work`'s index
 * listing is a listing rather than three links: rows styled as controls would
 * put both meanings on the same glyph.
 */

/** The inline end: small, sitting inside a sentence or a listing row.
 *
 * `em`-sized so it scales with whatever it sits in; `vertical-align` rather
 * than a translate because Motion owns `transform` on a token mid-flight and
 * would overwrite it.
 *
 * 1.5em is a ceiling, not a taste call: every sentence holding a token is set
 * at `leading-[2.1]`, and a glyph much past this overflows its own line box
 * and collides with the line above it. Raise one and you have to raise the
 * other. */
export const TOKEN_INLINE =
  "font-mono text-[1.5em] font-semibold leading-[0.9] align-[-0.14em] text-primary";

/** The display end for a single glyph — the largest type on the page after the
 * hero headline, deliberately: this is what the eye tracks across the boundary.
 *
 * Set these lockups with `flex items-baseline`, never `items-end`. Bottom
 * alignment lines up the *boxes*, and since the token's box is tight
 * (`leading-[0.78]`, no descender) while the phrase's carries descender space,
 * that leaves the glyph hanging about 10px below its own sentence.
 *
 * Mono, and big, on purpose. Space Grotesk carries every headline on the site;
 * JetBrains Mono is otherwise confined to eyebrows and captions, so blowing it
 * up to display size is the one place the utility face becomes the loudest
 * thing on screen. That's what makes the token read as terminal output — an
 * emitted value — rather than as another headline. */
export const TOKEN_DISPLAY =
  "font-mono text-[5rem] font-semibold leading-[0.78] tracking-[-0.04em] text-primary sm:text-[6.5rem] lg:text-[8rem]";

/** The display end for a token that is a *word* rather than one glyph.
 *
 * Same treatment, a third of the size, for the obvious reason: "Sua Mesa Fit"
 * at 8rem is wider than the window it has to land in. It stays the loudest
 * thing in its layer without being the loudest thing on the site — which is
 * correct, since a project name is a heading that happens to travel, where a
 * numeral is a value being emitted. */
export const TOKEN_DISPLAY_WORD =
  "font-mono text-[2rem] font-semibold leading-[0.95] tracking-[-0.035em] text-primary sm:text-[2.75rem] lg:text-[3.25rem]";

/** The inline end for a word token, sized to sit in a monospace listing row or
 * a `next →` line rather than mid-sentence. Fixed size, not `em`: both places
 * it appears are already mono at a known size, so inheriting would make the
 * two ends of the same handoff start from different scales. */
export const TOKEN_INLINE_WORD =
  "font-mono text-[15px] font-semibold leading-[1.1] tracking-[-0.01em] text-primary";
