"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { TOKEN_DISPLAY_WORD, TOKEN_INLINE_WORD } from "@/components/morph-tokens";
import { ProjectCover } from "@/components/project-media";
import { MorphToken, morphDrift } from "@/components/scroll-morph-stage";
import { useSound } from "@/components/sound-provider";
import type { StudioProject } from "@/lib/studio-data";

/**
 * Layers 1–3 of `/work`: one project per view, driven by `STUDIO_PROJECTS`.
 *
 * Each layer receives its own name as the arriving token and — except for the
 * last — carries the *next* project's name inline on the position line at the
 * bottom, which is what hands the motif forward. So the chain runs
 * `Markado → Bee Dash → Sua Mesa Fit`, one token per boundary, exactly as many
 * tokens as there are boundaries.
 *
 * Deliberately shorter than this page used to be. The `role / timeline /
 * system` table and the external links live on `/work/[slug]`, which already
 * carries them in full; an index that reprints the case study is not an index,
 * it's a second copy. What stays is what you need to decide whether to open
 * one: what it is, what it's made of, and what shipped.
 *
 * The two elements holding tokens carry no transform — an animated ancestor
 * makes Motion's layout measurement drift mid-flight and the token lands wrong.
 * Everything else moves via `morphDrift()`.
 */
export function WorkCase({
  project,
  next,
  position,
  total,
}: {
  project: StudioProject;
  /** The project this layer hands off to. Absent on the last one, which ends
   * the index rather than pointing past it. */
  next?: StudioProject;
  position: number;
  total: number;
}) {
  const { playHover, playClick } = useSound();

  return (
    <div>
      {/* Untransformed: holds the arriving token. */}
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <h2>
          <MorphToken
            id={`work-${project.slug}`}
            side="to"
            className={TOKEN_DISPLAY_WORD}
          >
            {project.title}
          </MorphToken>
        </h2>
        <p className="font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground">
          {project.year} · {project.role} · {project.timeline}
        </p>
      </div>

      <div
        className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12"
        style={morphDrift({ y: 46, order: 1 })}
      >
        <ProjectCover image={project.cover} title={project.title} />

        <div className="flex flex-col">
          <p className="text-[14px] leading-[1.7] text-foreground/75">
            {project.tagline}.
          </p>
          <p className="mt-4 text-[13px] leading-[1.75] text-muted-foreground">
            {project.description}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="border border-border/80 px-2.5 py-1.5 font-mono text-[8.5px] tracking-[0.06em] text-muted-foreground uppercase"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-7 border-l border-primary pl-4">
            <p className="font-mono text-[8.5px] tracking-[0.1em] text-primary uppercase">
              shipped outcome
            </p>
            <p className="mt-2 text-[12.5px] leading-[1.7] text-foreground/80">
              {project.outcome}
            </p>
          </div>

          <Link
            href={`/work/${project.slug}`}
            onMouseEnter={playHover}
            onClick={playClick}
            className="mt-7 inline-flex w-fit items-center gap-1.5 border border-primary/60 px-5 py-2.5 font-mono text-[10.5px] tracking-[0.5px] text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            View case study
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Untransformed: holds the departing token. The row's permanent job is
          position in the index; the handoff rides along on it rather than
          needing a line of its own. */}
      <div className="mt-10 flex items-baseline justify-between gap-6 border-t border-border/60 pt-5 font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground">
        <span>
          {String(position).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {next ? (
          <span className="flex items-baseline gap-2.5">
            next
            <MorphToken
              id={`work-${next.slug}`}
              side="from"
              className={TOKEN_INLINE_WORD}
            >
              {next.title}
            </MorphToken>
          </span>
        ) : (
          <span>end of index</span>
        )}
      </div>
    </div>
  );
}
