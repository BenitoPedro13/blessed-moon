"use client";

import { useI18n } from "@/components/locale-provider";

import { TOKEN_INLINE } from "@/components/morph-tokens";
import { MorphToken, morphDrift } from "@/components/scroll-morph-stage";
import { STUDIO_VALUES } from "@/lib/studio-data";

/**
 * Layer 0 of `/about`'s `ScrollMorphStage`. Opens the page's motif by handing
 * off the **A** (see about-pillar.tsx for where the chain goes).
 *
 * The values are verbatim — they're named words, not a paraphrasable list
 * (CLAUDE.md §0).
 */
export function AboutPrinciple() {
  const { t } = useI18n();
  return (
    <div>
      <h2
        className="max-w-2xl font-sans text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-4xl"
        style={morphDrift({ y: 44, order: 1 })}
      >{t("Technology that works with quiet excellence.")}</h2>

      <div style={morphDrift({ y: 40, order: 2 })}>
        <p className="mt-8 font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground">{t("The six we check the work against.")}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {STUDIO_VALUES.map((value) => (
            <li
              key={value}
              className="border border-border/80 px-3 py-2 font-mono text-[10px] tracking-[0.06em] text-foreground/80"
            >
              {t(value)}
            </li>
          ))}
        </ul>
      </div>

      {/* Untransformed: holds the departing token. `leading-[2.1]` wherever a
          token sits in a sentence — the inline glyph is 1.5em and at normal
          body leading it overflows its line box into the line above. */}
      <p className="mt-10 max-w-lg text-[13.5px] leading-[2.1] text-muted-foreground">{t("Two disciplines, handled by one founder: Benito. Start with")}{t(" ")}
        <MorphToken id="about-a" side="from" className={TOKEN_INLINE}>{t("A")}</MorphToken>
        .
      </p>
    </div>
  );
}
