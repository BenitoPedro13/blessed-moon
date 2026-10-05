"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveArtifact } from "@/lib/social-export";

const METRICS = { visits: "Tagged website visits", enquiries: "Qualified enquiries", hours: "Production hours" } as const;
type Metric = keyof typeof METRICS;
type Week = Record<Metric, string>;
const emptyWeeks = (): Week[] => Array.from({ length: 8 }, () => ({ visits: "", enquiries: "", hours: "" }));
function valid(value: unknown, metric: Metric): value is string { return typeof value === "string" && (value === "" || (/^\d+(\.\d+)?$/.test(value) && Number(value) <= 1_000_000 && (metric === "hours" || Number.isInteger(Number(value))))); }

export function MeasurementChart() {
  const [weeks, setWeeks] = useState(emptyWeeks);
  const [metric, setMetric] = useState<Metric>("visits");
  const [status, setStatus] = useState("");
  const chart = useRef<SVGSVGElement>(null);
  const values = weeks.map((week) => week[metric] === "" ? null : Number(week[metric]));
  const known = values.flatMap((value) => value === null ? [] : [value]);
  const maximum = Math.max(5, Math.ceil(Math.max(...known, 0) / 5) * 5);
  const x = (i: number) => 62 + i * 72;
  const y = (value: number) => 240 - value / maximum * 180;
  async function restore(file?: File) {
    if (!file) return;
    try {
      if (file.size > 20_000) throw new Error("Choose a saved eight-week measurement file.");
      const data = JSON.parse(await file.text());
      if (data.version !== 1 || !Array.isArray(data.weeks) || data.weeks.length !== 8 || !data.weeks.every((week: Record<string, unknown>) => week && Object.keys(METRICS).every((key) => valid(week[key], key as Metric)))) throw new Error("This measurement file has invalid values.");
      setWeeks(data.weeks.map((week: Week) => ({ visits: week.visits, enquiries: week.enquiries, hours: week.hours }))); setStatus("Weekly observations restored.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "The file could not be opened."); }
  }
  return <div data-measurement-chart className="rr-block space-y-6"><p className="text-sm leading-7 text-muted-foreground">Enter eight weeks of real observations. Blank means unrecorded; zero means you measured none. Visits come from campaign reports, enquiries from your qualified-contact register, and hours from time records. The chart does not fetch account data.</p><div className="flex flex-wrap gap-3">{Object.entries(METRICS).map(([key, label]) => <Button key={key} className="rounded-none" variant={metric === key ? "default" : "outline"} aria-pressed={metric === key} onClick={() => setMetric(key as Metric)}>{label}</Button>)}</div>
    <figure className="border border-border bg-background/80 p-4"><figcaption className="text-sm font-medium">{METRICS[metric]} · manually entered</figcaption><svg ref={chart} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 300" role="img" aria-label={`${METRICS[metric]}, ${known.length} recorded weeks; blank weeks are gaps.`} className="mt-4 w-full"><rect width="620" height="300" fill="#090d12" />{[0, .5, 1].map((fraction) => <g key={fraction}><path d={`M62 ${y(maximum * fraction)}H566`} fill="none" stroke="#29333c" /><text x="48" y={y(maximum * fraction) + 5} textAnchor="end" fill="#98a7b6" fontSize="14">{maximum * fraction}</text></g>)}{weeks.map((_, i) => <text key={i} x={x(i)} y="275" textAnchor="middle" fill="#98a7b6" fontSize="14">W{i + 1}</text>)}{values.map((value, i) => value === null ? null : <g key={i}>{i > 0 && values[i - 1] !== null && <path d={`M${x(i - 1)} ${y(values[i - 1]!)}L${x(i)} ${y(value)}`} fill="none" stroke="#ff6a1f" strokeWidth="3" />}<circle data-measured-point cx={x(i)} cy={y(value)} r="5" fill="#ff6a1f"><title>Week {i + 1}: {value}</title></circle><text x={x(i)} y={y(value) - 13} fill="#eeeeee" textAnchor="middle" fontSize="14">{value}</text></g>)}{!known.length && <text x="310" y="140" fill="#b6c2ce" textAnchor="middle" fontSize="18">No observations entered yet</text>}</svg><p className="text-xs leading-6 text-muted-foreground">Lines connect adjacent recorded weeks only. Counts and hours use separate scales; neither chart establishes causation.</p></figure>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{weeks.map((week, i) => <fieldset key={i} className="min-w-0 border border-border p-3"><legend className="px-1 font-mono text-xs text-primary">Week {i + 1}</legend><div className="space-y-3">{Object.entries(METRICS).map(([key, label]) => <label key={key} className="block text-xs">{label}<Input aria-label={`Week ${i + 1} ${label}`} className="mt-1 rounded-none" type="number" min="0" max="1000000" step={key === "hours" ? ".1" : "1"} value={week[key as Metric]} placeholder="Not recorded" onChange={(event) => { if (!valid(event.target.value, key as Metric)) return; setWeeks(weeks.map((row, index) => index === i ? { ...row, [key]: event.target.value } : row)); setStatus(""); }} /></label>)}</div></fieldset>)}</div>
    <div className="flex flex-wrap gap-3"><Button className="rounded-none" variant="outline" onClick={() => saveArtifact(new Blob([JSON.stringify({ version: 1, weeks }, null, 2)], { type: "application/json" }), "blessed-moon-weekly-observations.json")}>Save observations JSON</Button><Button className="rounded-none" variant="outline" disabled={!known.length} onClick={() => { if (chart.current) saveArtifact(new Blob([new XMLSerializer().serializeToString(chart.current)], { type: "image/svg+xml" }), `blessed-moon-${metric}-chart.svg`); }}>Download chart SVG</Button></div><label className="block max-w-md text-xs">Restore observations JSON<Input className="mt-2 h-auto rounded-none py-2" type="file" accept="application/json,.json" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void restore(file); }} /></label><p role="status" className="text-xs text-primary">{status}</p><p className="text-xs leading-6 text-muted-foreground">This worksheet lives in the current tab. Save JSON before leaving to retain it. Week labels are relative to your publishing launch.</p>
  </div>;
}
