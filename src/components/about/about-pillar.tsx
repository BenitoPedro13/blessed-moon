"use client";

import { TOKEN_DISPLAY, TOKEN_INLINE } from "@/components/morph-tokens";
import { MorphToken, morphDrift } from "@/components/scroll-morph-stage";
import type { StudioPillar } from "@/lib/studio-data";

/**
 * Layers 1–2 of `/about`: one pillar per view.
 *
 * The page's motif is `A → B → 0`. The pillar letters already exist in the
 * data, so the token is the studio's own structure rather than a count
 * borrowed from the homepage: **A** arrives here from the principle layer and
 * hands off **B**; **B** arrives in the next layer and hands off the **0**
 * that closes the page — *zero layers between you and the people building it*,
 * which is the claim this page has been making all along, made into the object
 * the reader has been following.
 *
 * Two letters resolving into a number, rather than a number counting down:
 * same grammar as the homepage, saying something only this page can say.
 */

/** The closing sentence per pillar — what each one hands forward, and the
 * words that carry it. Both ends of a handoff have to stay in sync: the glyph
 * here must match what the receiving layer displays. */
const HANDOFF: Record<string, { id: string; glyph: string; before: string; after: string }> = {
  A: {
    id: "about-b",
    glyph: "B",
    before: "Everything it commits to has to be buildable, which is the job of",
    after: ".",
  },
  B: {
    id: "about-0",
    glyph: "0",
    before: "That is the whole studio, which leaves",
    after: " layers between you and the people building your system.",
  },
};

export function AboutPillar({ pillar }: { pillar: StudioPillar }) {
  const handoff = HANDOFF[pillar.id];

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        {/* Untransformed: holds the arriving token. */}
        <div>
          <p>
            <MorphToken
              id={`about-${pillar.id.toLowerCase()}`}
              side="to"
              className={TOKEN_DISPLAY}
            >
              {pillar.id}
            </MorphToken>
          </p>
          <h2 className="mt-6 font-sans text-2xl font-semibold tracking-[-0.025em] text-foreground">
            {pillar.title}
          </h2>
          <div className="mt-6 border-t border-border/60 pt-5">
            <p className="font-sans text-[15px] font-medium text-foreground">
              {pillar.lead}
            </p>
            <p className="mt-1.5 font-mono text-[10.5px] leading-[1.6] text-muted-foreground">
              {pillar.titleLine}
            </p>
          </div>
        </div>

        <div style={morphDrift({ y: 46, order: 1 })}>
          <ul className="flex flex-wrap gap-2">
            {pillar.roles.map((role) => (
              <li
                key={role}
                className="border border-border/80 px-3 py-2 font-mono text-[10px] tracking-[0.06em] text-muted-foreground"
              >
                {role}
              </li>
            ))}
          </ul>
          <div className="mt-7 space-y-4">
            {pillar.paragraphs.map((paragraph, i) => (
              <p
                key={paragraph}
                className={
                  i === 0
                    ? "text-[14px] leading-[1.7] text-foreground/75"
                    : "text-[13px] leading-[1.75] text-muted-foreground"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Untransformed: holds the departing token. */}
      {handoff && (
        <p className="mt-10 max-w-xl border-t border-border/60 pt-6 text-[13.5px] leading-[2.1] text-muted-foreground">
          {handoff.before}{" "}
          <MorphToken id={handoff.id} side="from" className={TOKEN_INLINE}>
            {handoff.glyph}
          </MorphToken>
          {handoff.after}
        </p>
      )}
    </div>
  );
}
