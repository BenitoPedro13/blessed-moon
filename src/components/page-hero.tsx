import { Reveal } from "@/components/reveal";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  code: string;
}

export function PageHero({ eyebrow, title, description, code }: PageHeroProps) {
  return (
    <section
      data-ascii-keyframe="0"
      className="relative isolate flex min-h-[52vh] items-end overflow-hidden border-b border-border/60 px-7 pb-14 pt-32 sm:min-h-[58vh] sm:pb-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,106,31,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,106,31,0.08)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]"
      />
      <span className="absolute left-7 top-24 font-mono text-[9px] tracking-[0.25em] text-primary/70 uppercase">
        B / S / M
      </span>
      <span className="absolute right-7 top-24 font-mono text-[9px] tracking-[0.25em] text-muted-foreground uppercase">
        {code} / 26
      </span>

      <div className="relative mx-auto w-full max-w-6xl bg-background/70 p-4 backdrop-blur-[1px] sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <Reveal>
          <p className="font-mono text-[10.5px] tracking-[0.08em] text-primary uppercase">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-4 max-w-4xl font-sans text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-xl text-[13px] leading-[1.7] text-muted-foreground sm:text-sm">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
