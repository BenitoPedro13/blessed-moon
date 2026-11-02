"use client";

import { useI18n } from "@/components/locale-provider";

import { ChevronDown, ChevronUp } from "lucide-react";

import { useSound } from "@/components/sound-provider";

const STEP_BUTTON =
  "font-mono text-[10px] tracking-[0.08em] uppercase transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary";

/**
 * Quick navigation for a pinned `ScrollMorphStage`: every step is one press
 * away instead of a long scroll (TASK-homepage-conversion-and-navigation.md
 * §3). The stage owns the scrolling; this only renders the controls and
 * reports which step was asked for.
 *
 * Short sequences (the homepage's five) list every step on wide screens. Long
 * ones (`/work`'s fifteen) and phones get `NN / total` with previous/next, since
 * fifteen labels would be a second index competing with the window.
 *
 * Amber marks the current step on a small control, which is amber's
 * *interactive* meaning (morph-tokens.ts), never a travelling glyph.
 */
export function StageSteps({
  steps,
  active,
  onSelect,
}: {
  steps: { number: string; label: string }[];
  active: number;
  onSelect: (index: number) => void;
}) {
  const { t } = useI18n();
  const { playClick } = useSound();
  const select = (index: number) => {
    playClick();
    onSelect(index);
  };
  const listAll = steps.length <= 6;
  const current = steps[active];

  return (
    <nav
      aria-label={t("Sections")}
      className="pointer-events-auto absolute inset-x-0 bottom-3 z-10 flex justify-center px-4 sm:bottom-5"
    >
      {listAll && (
        <ol className="hidden items-center gap-1 border border-border/60 bg-background/70 px-1.5 py-1 backdrop-blur-sm md:flex">
          {steps.map((step, i) => (
            <li key={step.label}>
              <button
                type="button"
                onClick={() => select(i)}
                aria-current={i === active ? "step" : undefined}
                className={`${STEP_BUTTON} px-2.5 py-1.5 ${
                  i === active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-muted-foreground/60">{t(step.number)}</span> {t(step.label)}
              </button>
            </li>
          ))}
        </ol>
      )}

      <div
        className={`flex items-center gap-1 border border-border/60 bg-background/70 px-1 py-1 backdrop-blur-sm ${
          listAll ? "md:hidden" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => select(active - 1)}
          disabled={active === 0}
          aria-label={t("Previous section")}
          className={`${STEP_BUTTON} p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30`}
        >
          <ChevronUp className="size-3.5" aria-hidden="true" />
        </button>
        <span aria-live="polite" className={`${STEP_BUTTON} min-w-16 text-center text-foreground`}>
          <span className="sr-only">{t(current?.label)}{t(", section ")}</span>
          {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => select(active + 1)}
          disabled={active === steps.length - 1}
          aria-label={t("Next section")}
          className={`${STEP_BUTTON} p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30`}
        >
          <ChevronDown className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
