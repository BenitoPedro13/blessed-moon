"use client";

import { COUNT_DISPLAY, COUNT_INLINE } from "@/components/homepage/morph-count";
import { Counter } from "@/components/react-bits/counter";
import { MorphToken, morphDrift, useMorphLayer } from "@/components/scroll-morph-stage";
import { SectionHeading } from "@/components/section-heading";

const STEPS = [
  "Understand before building",
  "Design the system, then the screen",
  "Build in reviewable slices",
  "Ship it and keep it alive",
] as const;

/** Rolls 0 → its target odometer-style once this layer is the one on screen,
 * instead of appearing already formed — "the numbers changing in place, to
 * give emphasis" was the direct ask.
 *
 * Gated on the layer being active rather than `useInView` (how this worked
 * before the morph stage): every layer is permanently inside the viewport
 * once it's a child of one shared sticky frame, so an in-view check can
 * never fire per section again. Re-rolling on each return is the better
 * behaviour anyway — it matches the rest of this scroll system, which plays
 * in both directions rather than one-shotting.
 *
 * Foreground, not amber: these were `var(--primary)` and sat three lines
 * under the amber display 4, which made two competing numeric systems in one
 * section and left the reader no way to tell which number mattered. Amber is
 * reserved for the traveling token now (see morph-count.tsx) — once the 4 has
 * landed and dispersed into these, it isn't the token any more. */
function StepNumber({ target }: { target: number }) {
  const { isActive } = useMorphLayer();

  return (
    <Counter
      value={isActive ? target : 0}
      places={[1]}
      fontSize={38}
      textColor="var(--foreground)"
      fontWeight={500}
      gap={0}
      horizontalPadding={0}
      gradientHeight={0}
      containerStyle={{ fontFamily: "var(--font-mono)" }}
    />
  );
}

/**
 * Layer 2. Receives the **4** from Services and then — the point of putting
 * it here — splits it into the four step numbers underneath, each rolling up
 * from zero as the section takes the screen. The token arrives as a quantity
 * and immediately becomes the thing it was counting.
 *
 * A horizontal manifesto band, not another column split: the numbers are the
 * dominant element and the text under each is a caption, not a paragraph.
 */
export function HowWeWork() {
  return (
    <div className="w-full px-7 py-14 sm:py-16">
      <SectionHeading number="03" label="HOW WE WORK" />

      {/* Untransformed: holds the arriving token. */}
      <p className="flex items-end gap-3">
        <MorphToken id="count-4" side="to" className={COUNT_DISPLAY}>
          4
        </MorphToken>
        <span className="pb-1.5 font-sans text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
          steps, every time.
        </span>
      </p>

      <div
        className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-12 lg:grid-cols-4 lg:gap-x-8"
        style={morphDrift({ y: 52, order: 1 })}
      >
        {STEPS.map((step, i) => (
          <div
            key={step}
            className={i > 0 ? "lg:border-l lg:border-border/60 lg:pl-8" : ""}
          >
            <StepNumber target={i + 1} />
            <p className="mt-3 max-w-[16ch] font-sans text-[15px] leading-[1.4] text-foreground/85">
              {step}
            </p>
          </div>
        ))}
      </div>

      {/* Untransformed: holds the outgoing token. */}
      <p className="mt-10 max-w-md text-[14px] leading-[2.1] text-muted-foreground sm:mt-12">
        We&apos;ve run it enough times that{" "}
        <MorphToken id="count-3" side="from" className={COUNT_INLINE}>
          3
        </MorphToken>{" "}
        of the systems built this way are still in production today.
      </p>
    </div>
  );
}
