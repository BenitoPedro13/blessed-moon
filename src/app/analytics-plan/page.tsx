import { PlanShell, PlanSection, PLAN_TEXT, PLAN_LINK, planMetadata } from "@/components/social/plan-shell";

export const metadata = planMetadata("Social measurement plan", "/analytics-plan", "A practical measurement plan for content, campaign visits, enquiry intent and actual sales records, using Blessed Moon's existing Umami setup.");

import { MeasurementChart } from "@/components/social/measurement-chart";

const EVENTS = [
  ["service-enquiry-click", "service: social-media-strategy; location: home | service-page", "Followed the service contact CTA."],
  ["project-enquiry-start", "project_type: fixed form option at first edit", "First form edit, once per page view."],
  ["project-enquiry-submit", "project_type: fixed form option at submission", "SMTP accepted the enquiry for the studio inbox; qualification and inbox delivery remain separate."],
  ["booking-open", "location: contact", "Followed the configured booking link; no meeting confirmation."],
] as const;

const SCREENS = [
  ["Overview / Realtime / Sessions", "Use Public production pages and current dates. Realtime verifies ingestion; anonymous sessions help diagnose navigation."],
  ["Events / Goals", "Enquiry accepted is the primary conversion. Form starts, contact visits, service CTAs and booking-link clicks explain intent separately."],
  ["Funnels", "Contact → started → accepted; started → accepted; work → contact → accepted; social service → contact → accepted. Each allows 60 minutes between steps."],
  ["Journeys", "Three page steps ending at /contact; also inspect what follows a promoted case. These are observed paths, not required sequences."],
  ["Performance / Heatmaps / Replays", "Mobile Web Vitals, homepage scroll and service CTA clicks. Replays sample 15%, heatmaps 100%, five-minute cap; form and internal plan content are blocked. Canvas visuals may not reproduce faithfully."],
  ["Compare / Breakdown", "Four complete weeks versus the preceding four. Compare campaign × source × post and page × device, retaining absolute counts."],
  ["Segments / Cohorts", "Pilot, Instagram, LinkedIn, language creative, Brazil location, Mobile and Public production pages. The pilot cohort covers the past 30 days; anonymous identity limits apply."],
  ["Retention", "Use a calendar month as a secondary diagnostic. Verify salt rotation; daily returning use is not the studio's primary goal."],
  ["UTM / Attribution", "Keep the existing pilot/post tags. Last-click attribution targets project-enquiry-submit. Cross-device visits, DMs and copied links remain incomplete."],
  ["Revenue", "Actual paid work stays in the sales register until verified payments can be integrated. Do not assign revenue to enquiries or thank-you emails."],
] as const;

export default function AnalyticsPlanPage() {
  return <PlanShell title="Measure the next real step." active="/analytics-plan" description="Connect content to website visits, enquiry intent and actual business records. A clear event definition makes a report more useful than a large number without context.">
    <PlanSection number="01" title="The numbers live behind a password."><p className={PLAN_TEXT}>This page is the measurement specification. It fetches no account data. Live website behaviour from Umami, with a reading of what to check next, is on the password-protected <a href="/analytics-plan/live" className={PLAN_LINK}>live insights</a> page. It is read server-side by a view-only Umami user and shows anonymous sessions, not people.</p><p className={`mt-4 ${PLAN_TEXT}`}>Use Umami for website behaviour, native Instagram/LinkedIn insights for content, and a simple sales register for actual enquiries, proposals and paid work. No extra analytics vendor or social API is needed for the first review.</p></PlanSection>
    <PlanSection number="02" title="Give incoming visits context."><p className={PLAN_TEXT}>External links use source instagram or linkedin, medium organic_social, campaign studio-social-pilot and a stable post ID. The channel briefs include complete campaign URLs generated against the site&apos;s configured origin.</p><dl className="mt-6 space-y-3 font-mono text-xs leading-6"><div><dt className="text-primary">utm_source</dt><dd>instagram | linkedin</dd></div><div><dt className="text-primary">utm_medium</dt><dd>organic_social</dd></div><div><dt className="text-primary">utm_campaign</dt><dd>studio-social-pilot</dd></div><div><dt className="text-primary">utm_content</dt><dd className="break-all">ig-w01-oishi-condition</dd></div></dl><p className={`mt-6 ${PLAN_TEXT}`}>Tag external campaign links only. Internal links keep the original acquisition context. Copied links, DMs and cross-device visits make attribution incomplete. <a href="https://docs.umami.is/docs/guides/measure-campaigns" className={PLAN_LINK}>Umami campaign guide</a>.</p></PlanSection>
    <PlanSection number="03" title="Event dictionary."><div className="space-y-6">{EVENTS.map(([name, properties, meaning]) => <article key={name} className="border-t border-border pt-5"><h3 className="break-all font-mono text-sm text-primary">{name}</h3><p className="mt-2 break-words font-mono text-xs leading-6 text-muted-foreground">{properties}</p><p className={`mt-3 ${PLAN_TEXT}`}>{meaning}</p></article>)}</div><p className={`mt-6 ${PLAN_TEXT}`}>The event helper sends fixed enum values only. Names, emails, company names, messages and email addresses do not enter custom events. Actions continue to work if the tracker is missing or blocked. <a href="https://docs.umami.is/docs/track-events" className={PLAN_LINK}>Event documentation</a>.</p></PlanSection>
    <PlanSection number="04" title="A report with distinct layers."><dl className="space-y-5">{[
      ["Content", "Reach, saves, shares and relevant replies from native account insights. Which questions interest the intended buyer?"],
      ["Acquisition", "Visits or sessions from tagged links in Umami. Which stories bring people to the appropriate page?"],
      ["Website conversion", "CTA clicks, form starts and accepted enquiry submissions, reported separately. Are visitors completing the next step?"],
      ["Sales", "Confirmed and qualified enquiries, decided proposals, accepted contracts and collected revenue from actual business records."],
      ["Capacity", "Time spent creating content and delivering client work. Can Benito sustain the scope profitably?"],
    ].map(([label, detail]) => <div key={label} className="border-t border-border pt-4"><dt className="text-lg font-medium">{label}</dt><dd className={`mt-2 ${PLAN_TEXT}`}>{detail}</dd></div>)}</dl><p className={`mt-6 ${PLAN_TEXT}`}>A qualified enquiry needs a real business, an in-scope problem and an identifiable decision-maker, with budget and timing compatibility established in conversation. Record that rule consistently. Use matching session cohorts for intent rates and decided-proposal cohorts for win rates; repeated clicks are not unique leads.</p></PlanSection>
    <PlanSection number="05" title="Plot your actual weekly observations."><MeasurementChart /></PlanSection>
    <PlanSection number="06" title="Baseline checklist."><ul className={`list-disc space-y-3 pl-5 ${PLAN_TEXT}`}><li>Confirm an official studio inbox or booking channel works before scaling campaigns.</li><li>Verify a real production visit reaches the existing Umami website; check preview and staff exclusions.</li><li>Test a campaign link and confirm its source, campaign and content appear in the report.</li><li>Verify form-start, accepted-submit and booking clicks reflect the actual action. Confirm both SMTP emails reach their intended inboxes.</li><li>Export native insights and keep a separate register of confirmed enquiry outcomes.</li><li>Record production hours. Review at days 30, 60 and 90 before changing cadence or prices.</li></ul><p className={`mt-6 ${PLAN_TEXT}`}>No baseline is filled in yet. Zero traffic or too few observations should be stated plainly. The setup script below applies recording settings only when you run it.</p></PlanSection>
    <PlanSection number="07" title="Configure your Umami workspace.">
      <p className={PLAN_TEXT}>Download the setup script, sign into your Umami dashboard, open the browser console, and paste the whole file. It creates five goals, four funnels, nine segments and one cohort for Blessed Moon, skips existing names, and saves a backup of definitions in that dashboard browser. It also applies the recording settings below. It never creates test traffic or revenue.</p>
      <div className="mt-6 flex flex-wrap gap-5"><a href="/umami-setup.js" download="blessed-moon-umami-setup.js" className={PLAN_LINK}>Download setup script →</a><a href="https://benitos-analytics.vercel.app/websites/2c0d4ed9-e3a7-4848-84f2-5740d14b3ede" target="_blank" rel="noreferrer" className={PLAN_LINK}>Open Umami →</a></div>
      <p className={`mt-6 ${PLAN_TEXT}`}>The other screens query live data without needing saved definitions. Use current dates and the Pilot campaign segment for the social review. On your own browser, open the public studio site, set localStorage key umami.disabled to 1 in its console, then reload to exclude your visits.</p>
      <dl className="mt-6 space-y-5">{SCREENS.map(([name, meaning]) => <div key={name} className="border-t border-border pt-4"><dt className="text-lg font-medium">{name}</dt><dd className={`mt-2 ${PLAN_TEXT}`}>{meaning}</dd></div>)}</dl>
    </PlanSection>
  </PlanShell>;
}
