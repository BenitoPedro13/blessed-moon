"use client";

import { TOKEN_DISPLAY } from "@/components/morph-tokens";
import { MorphToken, morphDrift } from "@/components/scroll-morph-stage";

/**
 * Layer 3 of `/about`, and where the motif lands: the **0** arrives from
 * Pillar B and becomes the page's closing claim. Two named pillars, nothing
 * in between — which is what every preceding layer has been building toward,
 * now stated as a quantity rather than as an adjective.
 *
 * The narrowest layer on the page on purpose. The window contracts hard here,
 * the same way it does for Pricing on the homepage: the restraint is the
 * content.
 */
export function AboutDynamic() {
  return (
    <div>
      {/* Untransformed: holds the arriving token. */}
      <p className="flex items-baseline gap-4">
        <MorphToken id="about-0" side="to" className={TOKEN_DISPLAY}>
          0
        </MorphToken>
        <span className="font-sans text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
          layers in between.
        </span>
      </p>

      <p
        className="mt-8 max-w-xl text-[14px] leading-[1.75] text-muted-foreground"
        style={morphDrift({ y: 44, order: 1 })}
      >
        By structuring our agency as a specialized duo, we eliminate layers of
        corporate bureaucracy. You consult directly with the executives
        executing your vision, ensuring rapid deployment, seamless
        communication, and a digital product that is both commercially dominant
        and technically unshakeable.
      </p>
    </div>
  );
}
