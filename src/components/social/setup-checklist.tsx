import { PLAN_LINK, PLAN_TEXT } from "@/components/social/plan-shell";
import type { SetupPhase } from "@/lib/social-plan";

// TASK-linkedin-setup-checklist.md: a one-time setup, in the order it has to
// happen. Plain lists, no stored ticks: it's read once, top to bottom.

export function SetupChecklist({ phases, intro, assets, assetBase }: {
  phases: SetupPhase[];
  intro?: { text: string; limit: number; attach: string };
  assets?: readonly { file: string; label: string; size: string; use: string }[];
  assetBase?: string;
}) {
  const offsets = phases.map((_, i) => phases.slice(0, i).reduce((sum, phase) => sum + phase.steps.length, 0));
  return (
    <div data-setup-checklist className="space-y-10">
      {assets && assetBase && <section>
        <h3 className="text-xl font-medium">Images</h3>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">{assets.map((asset) => <li key={asset.file} className="border border-border bg-background/70 p-4">
          <a href={`${assetBase}/${asset.file}`} download className={`text-sm ${PLAN_LINK}`}>{asset.label} ↓</a>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">{asset.file} · {asset.size}</p>
          <p className={`mt-2 ${PLAN_TEXT}`}>{asset.use}</p>
        </li>)}</ul>
      </section>}
      {phases.map((phase, p) => <section key={phase.title}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-2">
          <h3 className="text-xl font-medium">{phase.title}</h3>
          <p className="font-mono text-xs text-muted-foreground">{phase.when}</p>
        </div>
        <ol className="mt-4 space-y-4">{phase.steps.map((step, i) => <li key={step.title} data-setup-step className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-2">
          <span className="font-mono text-xs leading-7 text-primary" aria-hidden="true">{String(offsets[p] + i + 1).padStart(2, "0")}</span>
          <div>
            <p className="text-sm leading-7 font-medium text-foreground">{step.title}</p>
            <p className={PLAN_TEXT}>{step.detail}</p>
            {step.warning && <p className="mt-2 border-l-2 border-primary pl-4 text-sm leading-7 text-foreground"><span className="font-mono text-xs text-primary">Can&apos;t be undone · </span>{step.warning}</p>}
          </div>
        </li>)}</ol>
        {intro && phase.steps.some((step) => step.title === "Post the introduction") && <article data-intro-post lang="en" className="mt-6 border border-border bg-background/80 p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="font-mono text-xs text-primary">Introduction post</h4>
            <span className="font-mono text-[11px] text-muted-foreground">{[...intro.text].length} / {intro.limit}</span>
          </div>
          <p className={`mt-3 whitespace-pre-line ${PLAN_TEXT}`}>{intro.text}</p>
          <p className="mt-4 border-t border-border pt-3 text-xs leading-6 text-muted-foreground">Attach: {intro.attach}</p>
        </article>}
      </section>)}
    </div>
  );
}
