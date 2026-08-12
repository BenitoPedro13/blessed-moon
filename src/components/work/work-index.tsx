"use client";

import { TOKEN_INLINE_WORD } from "@/components/morph-tokens";
import { MorphToken, morphDrift } from "@/components/scroll-morph-stage";
import { STUDIO_PROJECTS } from "@/lib/studio-data";

/**
 * Layer 0 of `/work`'s `ScrollMorphStage`: the contents of the index, as a
 * listing.
 *
 * This is where the page's motif starts. The first project's name is a
 * `MorphToken` — crossing into the next layer it leaves the list and lands as
 * that view's display heading, which is the motion a terminal file browser
 * already implies: the row you pick becomes the page. The remaining names are
 * plain, and become tokens one boundary later, from inside the layer before
 * them.
 *
 * The rows are deliberately **not** links. Amber means "in flight" here (see
 * morph-tokens.ts); styling the rows as controls would put amber's other
 * meaning on the same glyph and leave the reader no way to tell which one is
 * being used. Navigation is the scroll, plus the `#slug` markers the stage
 * emits for deep links.
 *
 * No `Reveal`, no wrapper transform on the listing — both forbidden inside a
 * morph layer, for different reasons (see scroll-morph-stage.tsx).
 */
export function WorkIndex() {
  return (
    <div>
      <h2
        className="max-w-2xl font-sans text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-4xl"
        style={morphDrift({ y: 44, order: 1 })}
      >
        Three systems, still running.
      </h2>

      {/* Untransformed: holds the departing token. */}
      <ul className="mt-10 border-t border-border/60">
        {STUDIO_PROJECTS.map((project, i) => (
          <li
            key={project.slug}
            className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 border-b border-border/60 py-5 sm:grid-cols-[auto_1fr_auto]"
          >
            <span className="font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground">
              {project.index}
            </span>
            <div className="min-w-0">
              {i === 0 ? (
                <MorphToken
                  id={`work-${project.slug}`}
                  side="from"
                  className={TOKEN_INLINE_WORD}
                >
                  {project.title}
                </MorphToken>
              ) : (
                <span className="font-mono text-[15px] leading-[1.1] font-semibold tracking-[-0.01em] text-foreground">
                  {project.title}
                </span>
              )}
              <p className="mt-1.5 text-[13px] leading-[1.5] text-muted-foreground">
                {project.tagline}
              </p>
            </div>
            <span className="col-start-2 mt-2 font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground sm:col-start-3 sm:mt-0">
              {project.year}
            </span>
          </li>
        ))}
      </ul>

      <p
        className="mt-6 font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground"
        style={morphDrift({ y: 30, order: 2 })}
      >
        Each one below, in full.
      </p>
    </div>
  );
}
