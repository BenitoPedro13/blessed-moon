import { SectionHeading } from "@/components/section-heading";

export function AboutTeaser() {
  return (
    <section data-ascii-keyframe="1" className="px-7 py-13 sm:py-16">
      <SectionHeading number="01" label="ABOUT" />
      <h2 className="max-w-2xl font-sans text-2xl font-semibold tracking-[-0.01em] text-foreground sm:text-[26px]">
        Built to last longer than the brief.
      </h2>
      <p className="mt-3.5 max-w-md text-[13px] leading-[1.55] text-muted-foreground">
        We develop, design and execute advanced software programs. With our
        innovative technology we resolve cases and help clients world-wide.
      </p>
    </section>
  );
}
