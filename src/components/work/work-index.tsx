"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { TOKEN_INLINE_WORD } from "@/components/morph-tokens";
import { MorphToken, morphDrift } from "@/components/scroll-morph-stage";
import { useSound } from "@/components/sound-provider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  PROJECT_CATEGORIES,
  STUDIO_PROJECTS,
  type ProjectCategory,
} from "@/lib/studio-data";

type Filter = ProjectCategory | "all";

const FILTERS: readonly { value: Filter; label: string; count: number }[] = [
  { value: "all", label: "All", count: STUDIO_PROJECTS.length },
  ...PROJECT_CATEGORIES.map((category) => ({
    ...category,
    count: STUDIO_PROJECTS.filter((p) => p.category === category.value).length,
  })),
];

/**
 * Layer 0 of `/work`'s `ScrollMorphStage`: every project as a cover card that
 * opens its case study, with category filters above.
 *
 * This is where the page's motif starts. The first project's name is a
 * `MorphToken` — crossing into the next layer it leaves the grid and lands as
 * that view's display heading: the card you pick becomes the page. When a
 * filter hides that card the token simply has no source and the heading fades
 * in with its view.
 *
 * The cards are links (TASK-work-index-grid.md). Amber still means "in
 * flight" on the travelling name; on the cards it appears only as a control
 * affordance — the focus/hover border and the pressed filter — never on
 * another name.
 *
 * Filtering narrows this grid only. The case layers below, their keyframes
 * and `next →` chain are untouched, so the stage's layer count never changes.
 * The full grid is sized to fit one pinned window at desktop sizes; a filter
 * can only make it shorter.
 *
 * No `Reveal`, no wrapper transform around the grid — both forbidden inside a
 * morph layer (see scroll-morph-stage.tsx).
 */
export function WorkIndex() {
  const [filter, setFilter] = useState<Filter>("all");
  const { playHover, playClick } = useSound();

  const shown =
    filter === "all"
      ? STUDIO_PROJECTS
      : STUDIO_PROJECTS.filter((project) => project.category === filter);

  return (
    <div>
      <h2
        className="max-w-2xl font-sans text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-4xl"
        style={morphDrift({ y: 44, order: 1 })}
      >
        {STUDIO_PROJECTS.length} systems, still running.
      </h2>

      <ToggleGroup
        aria-label="Filter projects by category"
        value={[filter]}
        // Pressing the active filter again would empty the group; keep it.
        onValueChange={(value) => value[0] && setFilter(value[0] as Filter)}
        spacing={0}
        className="mt-6 w-full flex-wrap gap-2"
      >
        {FILTERS.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            size="sm"
            variant="outline"
            onClick={playClick}
            className="h-7 border-border/60 px-2.5 font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground uppercase hover:bg-transparent hover:text-foreground aria-pressed:border-primary aria-pressed:bg-transparent aria-pressed:text-primary"
          >
            {option.label}
            <span className="text-muted-foreground/60">{option.count}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* Untransformed: holds the departing token. */}
      <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
        {shown.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/work/${project.slug}`}
              onMouseEnter={playHover}
              onClick={playClick}
              className="group block focus-visible:outline-none"
            >
              <div className="relative aspect-[16/10] overflow-hidden border border-border/60 bg-muted/20 transition-colors group-hover:border-primary/60 group-focus-visible:border-primary">
                <Image
                  src={project.cover.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 180px, (min-width: 640px) 33vw, 50vw"
                  // Held back at rest for the same reason as the homepage's
                  // Selected Work: light-UI screenshots at full strength
                  // outshine the amber token.
                  className="object-cover object-top opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
              {/* Number and name share a line: a second meta line per card
                  was the 20px that pushed the full grid out of one pinned
                  window at 1440×900. */}
              <span className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground">
                  {project.index}
                </span>
                {project === STUDIO_PROJECTS[0] ? (
                  <MorphToken
                    id={`work-${project.slug}`}
                    side="from"
                    className={TOKEN_INLINE_WORD}
                  >
                    {project.title}
                  </MorphToken>
                ) : (
                  <span className="font-mono text-[15px] leading-[1.1] font-semibold tracking-[-0.01em] text-foreground">
                    {project.title}
                  </span>
                )}
              </span>
              <span className="sr-only">: {project.tagline}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p
        aria-live="polite"
        className="mt-5 font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground"
        style={morphDrift({ y: 30, order: 2 })}
      >
        {filter === "all"
          ? "Each one below, in full."
          : `${shown.length} of ${STUDIO_PROJECTS.length} shown. All ${STUDIO_PROJECTS.length} below, in full.`}
      </p>
    </div>
  );
}
