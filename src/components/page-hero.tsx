import { CellGrid } from "@/components/cell-grid";
import { Reveal } from "@/components/reveal";
import { ScrollStage } from "@/components/scroll-stage";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  code: string;
}

/**
 * Phase 2 of TASK-apple-scroll-journey.md: extends the pin-and-dissolve
 * treatment proven on the homepage's Hero to the shared subpage hero,
 * covering About/Work/Contact/each case study. Same pattern: ScrollStage
 * pins the content for a taller scroll range, everything fades/scales out
 * via `--stage-progress` on a plain wrapper div (not Reveal's own
 * motion.div, so the pin transform and Reveal's independent mount
 * animation don't fight over the same style properties — see hero.tsx's
 * comment for the fuller reasoning). `mt-auto` replaces the original
 * `items-end` flex alignment: ScrollStage's inner panel centers its
 * content as a group, so the content block pushes itself to the bottom of
 * that space instead, keeping the same bottom-anchored look.
 */
export function PageHero({ eyebrow, title, description, code }: PageHeroProps) {
  return (
    <section
      data-ascii-keyframe="0"
      data-frame-label={code}
      className="relative isolate overflow-hidden border-b border-panel-edge"
    >
      <ScrollStage heightMultiplier={1.6}>
        {/* The character-cell ground the homepage stands on, so a subpage hero
            reads as the same surface rather than as a different site. This
            replaced a 48px amber square grid: two grounds, and the square one
            was the graph-paper wallpaper `cell-grid.tsx` was written to get
            rid of (see its note on why the cell is 1:2, not square). */}
        <div
          aria-hidden="true"
          style={{ opacity: "calc(1 - var(--stage-progress, 0) * 0.7)" }}
          className="pointer-events-none absolute inset-0"
        >
          <CellGrid />
        </div>
        <span
          style={{ opacity: "calc(1 - var(--stage-progress, 0) * 0.85)" }}
          className="absolute left-7 top-24 font-mono text-[9px] tracking-[0.25em] text-primary/70 uppercase"
        >
          B / S / M
        </span>
        <span
          style={{ opacity: "calc(1 - var(--stage-progress, 0) * 0.85)" }}
          className="absolute right-7 top-24 font-mono text-[9px] tracking-[0.25em] text-muted-foreground uppercase"
        >
          {code} / 26
        </span>

        <div
          style={{
            opacity: "calc(1 - var(--stage-progress, 0))",
            transform: "scale(calc(1 - var(--stage-progress, 0) * 0.12))",
          }}
          className="relative mt-auto w-full px-7 pb-14 sm:pb-20"
        >
          {/* The pane is a phone-only measure: at that width the headline sits
              directly on the moon's glyph texture and stops being readable.
              Panel tokens rather than `bg-background/70`, so it's the same
              translucent surface as every window on the site. */}
          <div className="relative mx-auto w-full max-w-6xl bg-panel p-4 backdrop-blur-md sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
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
        </div>
      </ScrollStage>
    </section>
  );
}
