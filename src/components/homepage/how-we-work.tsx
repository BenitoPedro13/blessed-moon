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
      <ScrollStage heightMultiplier={1.3} particles>
        <div
          style={{
            opacity: "calc(1 - var(--stage-progress, 0))",
            transform: "scale(calc(1 - var(--stage-progress, 0) * 0.12))",
          }}
          className="w-full px-7 py-16 sm:py-20"
        >
          <Reveal>
            <SectionHeading number="03" label="HOW WE WORK" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-2xl font-sans text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
              No surprises after kickoff.
            </h2>
          </Reveal>
          <div className="mt-10 flex flex-col sm:mt-14 sm:flex-row">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className={`flex-1 py-6 sm:px-6 sm:py-0 ${
                  i > 0 ? "border-t border-border/60 sm:border-t-0 sm:border-l" : ""
                }`}
              >
                <Reveal delay={0.14 + i * 0.07}>
                  <span className="mb-3 block font-mono text-3xl font-semibold text-primary sm:text-4xl">
                    {step.number}
                  </span>
                  <p className="max-w-[18ch] font-sans text-[15px] leading-[1.4] text-foreground/85">
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
