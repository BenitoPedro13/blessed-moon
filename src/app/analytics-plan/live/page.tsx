import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PlanShell, PlanSection, PLAN_TEXT, PLAN_LINK } from "@/components/social/plan-shell";
import { InsightPanel } from "@/components/insights/insight-panel";
import { CaseContact, FunnelLadder, MobileSpeed, PeriodCompare, PostScorecard, SectionReach } from "@/components/insights/insight-views";
import { isInsightsAuthorized } from "@/lib/insights-auth";
import { readCases, readCompare, readLadder, readPosts, readSections, readSpeed } from "@/lib/insight-readings";
import { RANGES, loadInsights, parseRange } from "@/lib/umami-insights";

export const metadata: Metadata = {
  title: "Live insights",
  robots: { index: false, follow: false },
};

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "America/Sao_Paulo" });
const span = ({ startAt, endAt }: { startAt: number; endAt: number }) => `${dateFormat.format(startAt)} – ${dateFormat.format(endAt)}`;

export default async function LiveInsightsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // The proxy gates this route; this second check means a matcher mistake can't expose it.
  if (!(await isInsightsAuthorized((await headers()).get("authorization")))) notFound();
  const range = parseRange((await searchParams).range);
  const insights = await loadInsights(range);

  return (
    <PlanShell title="What the site is telling you." active="/analytics-plan"
      description="Live website behaviour from Umami, each panel ending with the one thing worth checking next. Content reach stays in native Instagram/LinkedIn insights, and real enquiries, proposals and paid work stay in your sales register."
      notice="Password-protected and noindex. Read server-side by a view-only Umami user; numbers are anonymous sessions, not people or companies.">
      <nav aria-label="Period" className="flex flex-wrap items-center gap-2">
        {(Object.keys(RANGES) as (keyof typeof RANGES)[]).map((key) => (
          <a key={key} href={`?range=${key}`} aria-current={key === range ? "page" : undefined}
            className={`border px-4 py-3 font-mono text-xs focus-visible:outline-2 focus-visible:outline-primary ${key === range ? "border-foreground text-foreground" : "border-border text-foreground/75 hover:border-foreground"}`}>
            Last {RANGES[key]} days
          </a>
        ))}
        {"period" in insights && <span className="bg-background/90 px-3 py-3 font-mono text-xs text-muted-foreground">{span(insights.period)} vs {span(insights.previous)}</span>}
      </nav>

      {"status" in insights ? (
        <PlanSection number="00" title={insights.reason === "not-configured" ? "Not connected yet." : "Umami didn't answer."}>
          <p className={PLAN_TEXT}>
            {insights.reason === "not-configured"
              ? "Set UMAMI_API_URL, UMAMI_API_USER and UMAMI_API_PASSWORD (a view-only Umami user) on the server. The steps are in docs/social/12-umami-operations.md."
              : `${insights.reason}. Nothing below would be a real reading, so nothing is shown.`}
          </p>
        </PlanSection>
      ) : (
        <>
          <InsightPanel number="01" question="Where do people stop?"
            unavailable={insights.ladder.status === "unavailable" ? insights.ladder.reason : undefined}
            reading={insights.ladder.status === "ok" ? readLadder(insights.ladder.data) : undefined}>
            {insights.ladder.status === "ok" && <FunnelLadder counts={insights.ladder.data} />}
          </InsightPanel>

          <InsightPanel number="02" question="Which posts send people who act?"
            unavailable={insights.posts.status === "unavailable" ? insights.posts.reason : undefined}
            reading={insights.posts.status === "ok" ? readPosts(insights.posts.data) : undefined}>
            {insights.posts.status === "ok" && <PostScorecard rows={insights.posts.data} />}
          </InsightPanel>

          <InsightPanel number="03" question="Which projects persuade?"
            unavailable={insights.cases.status === "unavailable" ? insights.cases.reason : undefined}
            reading={insights.cases.status === "ok" ? readCases(insights.cases.data) : undefined}>
            {insights.cases.status === "ok" && <CaseContact rows={insights.cases.data} />}
          </InsightPanel>

          <InsightPanel number="04" question="Is the site fast enough on a phone?"
            unavailable={insights.speed.status === "unavailable" ? insights.speed.reason : undefined}
            reading={insights.speed.status === "ok" ? readSpeed(insights.speed.data) : undefined}>
            {insights.speed.status === "ok" && <MobileSpeed rows={insights.speed.data} />}
          </InsightPanel>

          <InsightPanel number="05" question="Is it moving?"
            unavailable={insights.ladder.status === "unavailable" ? insights.ladder.reason : insights.previousLadder.status === "unavailable" ? insights.previousLadder.reason : undefined}
            reading={insights.ladder.status === "ok" && insights.previousLadder.status === "ok" ? readCompare(insights.ladder.data, insights.previousLadder.data) : undefined}>
            {insights.ladder.status === "ok" && insights.previousLadder.status === "ok" && <PeriodCompare current={insights.ladder.data} previous={insights.previousLadder.data} />}
          </InsightPanel>

          <InsightPanel number="06" question="How far down the homepage do people get?"
            unavailable={insights.sections.status === "unavailable" ? insights.sections.reason : undefined}
            reading={insights.sections.status === "ok" ? readSections(insights.sections.data) : undefined}>
            {insights.sections.status === "ok" && <SectionReach counts={insights.sections.data} />}
          </InsightPanel>
        </>
      )}

      <PlanSection number="07" title="What this page can't see.">
        <p className={PLAN_TEXT}>
          Reach, saves and replies live in the native apps. Whether an enquiry was a good fit, became a proposal or paid is in your inbox and sales register.
          A session isn&apos;t a person: one buyer on a phone and a laptop counts twice, and blocked trackers count zero. The definitions behind each number are on the{" "}
          <a href="/analytics-plan" className={PLAN_LINK}>measurement plan</a>.
        </p>
      </PlanSection>
    </PlanShell>
  );
}
