import { Reveal } from "@/components/reveal";
import { ScrollStage } from "@/components/scroll-stage";
import { SectionHeading } from "@/components/section-heading";

const STEPS = [
  { number: "01", text: "Understand before building" },
  { number: "02", text: "Design the system, then the screen" },
  { number: "03", text: "Build in reviewable slices" },
  { number: "04", text: "Ship it and keep it alive" },
] as const;

export function HowWeWork() {
  return (
    <section
      data-ascii-keyframe="2"
      data-frame-label="PROCESS"
      className="relative"
    >
      <ScrollStage heightMultiplier={1.4} particles>
        {/* A horizontal manifesto band, not another column split — the
            numbers are the dominant visual element here (a real sequence,
            so the numbering is earning its place, not decorating), text
            underneath is a caption, not a paragraph. Distinct shape from
            About's diagonal split and Services' side-column-plus-grid;
            every section reading as "heading, then content below" would
            be its own kind of monotony even at a bigger scale. */}
        <div
          style={{
            opacity: "calc(1 - var(--stage-progress, 0))",
            transform: "scale(calc(1 - var(--stage-progress, 0) * 0.1))",
          }}
          className="w-full px-7 py-14 sm:py-16"
        >
          <Reveal>
            <SectionHeading number="03" label="HOW WE WORK" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-xl font-sans text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
              No surprises after kickoff.
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:mt-16 lg:grid-cols-4 lg:gap-x-8">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className={`${i > 0 ? "lg:border-l lg:border-border/60 lg:pl-8" : ""}`}
              >
                <Reveal delay={0.14 + i * 0.08}>
                  <span className="block font-mono text-6xl font-semibold leading-none text-primary sm:text-7xl lg:text-8xl">
                    {step.number}
                  </span>
                  <p className="mt-4 max-w-[16ch] font-sans text-[15px] leading-[1.4] text-foreground/85">
                    {step.text}
                  </p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </ScrollStage>
    </section>
  );
}
