import { SectionHeading } from "@/components/section-heading";

const STEPS = [
  { number: "01", text: "Understand before building" },
  { number: "02", text: "Design the system, then the screen" },
  { number: "03", text: "Build in reviewable slices" },
  { number: "04", text: "Ship it and keep it alive" },
] as const;

export function HowWeWork() {
  return (
    <section className="px-7 py-13 sm:py-16">
      <SectionHeading number="03" label="HOW WE WORK" />
      <div className="flex flex-col sm:flex-row">
        {STEPS.map((step, i) => (
          <div
            key={step.number}
            className={`flex-1 py-5 sm:px-5 sm:py-0 ${
              i > 0 ? "border-t border-border/60 sm:border-t-0 sm:border-l" : ""
            }`}
          >
            <span className="mb-2 block font-mono text-xl font-semibold text-primary">
              {step.number}
            </span>
            <p className="max-w-[16ch] font-sans text-[13px] leading-[1.3] text-foreground/85">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
