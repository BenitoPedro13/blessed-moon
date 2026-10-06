import { CountBar } from "@/components/insights/insight-panel";
import {
  LADDER_STEPS, MIN_SPEED_SAMPLES, SPEED_THRESHOLDS, formatSpeed, rateSpeed, share,
  type CaseCounts, type LadderCounts, type PostCounts, type SpeedCounts,
} from "@/lib/insight-readings";

const TABLE = "w-full border-collapse text-left text-sm";
const TH = "border-b border-border pb-2 pr-4 font-mono text-xs font-normal text-muted-foreground";
const TD = "border-b border-border/60 py-3 pr-4 align-middle";

/** Visitors → contact → form → accepted, as counts, with what each step kept. */
export function FunnelLadder({ counts }: { counts: LadderCounts }) {
  return (
    <ol className="space-y-4">
      {LADDER_STEPS.map((step, i) => {
        const value = counts[step.key];
        const before = i > 0 ? counts[LADDER_STEPS[i - 1].key] : null;
        return (
          <li key={step.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5">
            <span className="text-sm">{step.label}</span>
            <span className="font-mono text-lg tabular-nums">{value}</span>
            <span className="col-span-2"><CountBar value={value} max={counts.visitors} emphasis={step.key === "accepted"} /></span>
            {before !== null && (
              <span className="col-span-2 font-mono text-xs text-muted-foreground">kept {share(value, before)} of the step before</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Which tagged posts sent visits, and whether those sessions went on to act. */
export function PostScorecard({ rows }: { rows: PostCounts[] }) {
  if (!rows.length) return <p className="font-mono text-xs text-muted-foreground">No tagged visits in this period (measured zero).</p>;
  const max = Math.max(...rows.map((row) => row.visits), 1);
  return (
    <div className="overflow-x-auto">
      <table className={TABLE}>
        <caption className="sr-only">Visits, contact-page sessions and accepted enquiries per tagged post</caption>
        <thead><tr><th scope="col" className={TH}>Post (utm_content)</th><th scope="col" className={TH}>Visits</th><th scope="col" className={TH}>Reached contact</th><th scope="col" className={TH}>Accepted</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.post}>
              <th scope="row" className={`${TD} break-all font-mono text-xs font-normal`}>{row.post}</th>
              <td className={`${TD} min-w-28`}><span className="font-mono tabular-nums">{row.visits}</span><CountBar value={row.visits} max={max} /></td>
              <td className={`${TD} font-mono tabular-nums`}>{row.contact}</td>
              <td className={`${TD} font-mono tabular-nums ${row.accepted ? "text-primary" : ""}`}>{row.accepted}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs leading-6 text-muted-foreground">Sessions are credited to the post they arrived from. DMs, copied links and later direct visits aren&apos;t visible here.</p>
    </div>
  );
}

/** Which case studies send sessions on to /contact within an hour. */
export function CaseContact({ rows: all }: { rows: CaseCounts[] }) {
  const rows = all.filter((row) => row.sessions > 0);
  const unseen = all.length - rows.length;
  const max = Math.max(...rows.map((row) => row.sessions), 1);
  if (!rows.length) return <p className="font-mono text-xs text-muted-foreground">No case-study sessions in this period (measured zero).</p>;
  return (
    <div className="overflow-x-auto">
      <table className={TABLE}>
        <caption className="sr-only">Sessions per case study and how many went on to the contact page</caption>
        <thead><tr><th scope="col" className={TH}>Case study</th><th scope="col" className={TH}>Sessions</th><th scope="col" className={TH}>Then contact</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.title}>
              <th scope="row" className={`${TD} font-normal`}>{row.title}</th>
              <td className={`${TD} min-w-28`}><span className="font-mono tabular-nums">{row.sessions}</span><CountBar value={row.sessions} max={max} /></td>
              <td className={`${TD} font-mono text-xs`}>{row.contact === null ? "unavailable" : share(row.contact, row.sessions)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {unseen > 0 && <p className="mt-3 text-xs leading-6 text-muted-foreground">{unseen} other case {unseen === 1 ? "study" : "studies"} had no sessions in this period (measured zero).</p>}
    </div>
  );
}

const RATING_CLASS = { good: "text-foreground/75", "needs work": "text-foreground", poor: "text-primary" } as const;

/** Mobile Web Vitals at the 75th percentile, rated against Google's thresholds. */
export function MobileSpeed({ rows }: { rows: SpeedCounts[] }) {
  if (!rows.length) return <p className="font-mono text-xs text-muted-foreground">No mobile samples in this period.</p>;
  const pages = [...new Set(rows.map((row) => row.page))].slice(0, 12);
  const metrics = Object.keys(SPEED_THRESHOLDS) as (keyof typeof SPEED_THRESHOLDS)[];
  return (
    <div className="overflow-x-auto">
      <table className={TABLE}>
        <caption className="sr-only">Mobile Web Vitals per page, 75th percentile, with rating</caption>
        <thead><tr><th scope="col" className={TH}>Page</th>{metrics.map((metric) => <th key={metric} scope="col" className={TH}>{SPEED_THRESHOLDS[metric].label}</th>)}</tr></thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page}>
              <th scope="row" className={`${TD} break-all font-mono text-xs font-normal`}>{page}</th>
              {metrics.map((metric) => {
                const row = rows.find((item) => item.page === page && item.metric === metric);
                if (!row) return <td key={metric} className={`${TD} font-mono text-xs text-muted-foreground`}>no data</td>;
                const rating = rateSpeed(metric, row.p75);
                return (
                  <td key={metric} className={`${TD} font-mono text-xs`}>
                    <span className="tabular-nums">{formatSpeed(metric, row.p75)}</span>{" "}
                    <span className={RATING_CLASS[rating]}>{rating}</span>
                    {row.samples < MIN_SPEED_SAMPLES && <span className="block text-muted-foreground">{row.samples} samples, tentative</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs leading-6 text-muted-foreground">Good: largest paint ≤ 2.5 s, response ≤ 200 ms, layout shift ≤ 0.1. Poor: above 4 s, 500 ms and 0.25.</p>
    </div>
  );
}

/** This period against the one before it, as absolute counts on both sides. */
export function PeriodCompare({ current, previous }: { current: LadderCounts; previous: LadderCounts }) {
  return (
    <div className="overflow-x-auto">
      <table className={TABLE}>
        <caption className="sr-only">Each funnel step in this period and the previous period of the same length</caption>
        <thead><tr><th scope="col" className={TH}>Step</th><th scope="col" className={TH}>Previous</th><th scope="col" className={TH}>This period</th><th scope="col" className={TH}>Change</th></tr></thead>
        <tbody>
          {LADDER_STEPS.map((step) => {
            const delta = current[step.key] - previous[step.key];
            return (
              <tr key={step.key}>
                <th scope="row" className={`${TD} font-normal`}>{step.label}</th>
                <td className={`${TD} font-mono tabular-nums`}>{previous[step.key]}</td>
                <td className={`${TD} font-mono tabular-nums`}>{current[step.key]}</td>
                <td className={`${TD} font-mono tabular-nums`}>{delta > 0 ? `+${delta}` : delta}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
