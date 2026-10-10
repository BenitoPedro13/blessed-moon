// Pure reading rules for /analytics-plan/live. Each panel shows its evidence
// and then one sentence about what to look at next. The sentences are
// hypotheses from docs/social/12-umami-operations.md §4, not diagnoses, and
// small samples say so instead of producing a confident verdict.

/** Below this many visitors in a period, the page reads nothing into ratios. */
export const MIN_VISITORS = 20;
/** Below this denominator, show "2 of 3" rather than a percentage. */
export const MIN_FOR_PERCENT = 30;
/** Below this many Web Vitals samples, a page's speed rating is marked tentative. */
export const MIN_SPEED_SAMPLES = 10;

export type Tone = "act" | "wait" | "fine";
export type Reading = { tone: Tone; text: string };

export function share(part: number, whole: number): string {
  if (whole <= 0) return `${part} of 0`;
  if (whole < MIN_FOR_PERCENT) return `${part} of ${whole}`;
  return `${Math.round((part / whole) * 100)}% (${part} of ${whole})`;
}

export type LadderCounts = { visitors: number; contact: number; started: number; accepted: number };

export const LADDER_STEPS = [
  { key: "visitors", label: "Visited the site" },
  { key: "contact", label: "Reached /contact" },
  { key: "started", label: "Started the form" },
  { key: "accepted", label: "Enquiry accepted" },
] as const;

const LADDER_ADVICE = {
  contact: "Most visitors never reach the contact page. Check that landing pages make the next step obvious and show evidence relevant to the post that sent them.",
  started: "People reach contact but don't start the form. Check that the ask is clear and the form is visible without hunting, especially on a phone.",
  accepted: "Forms are started but not sent. Check for email (SMTP) failures, validation errors and how the form behaves on a phone.",
} as const;

export function readLadder(counts: LadderCounts): Reading {
  if (counts.visitors < MIN_VISITORS) {
    return { tone: "wait", text: `Too few visits to read (${counts.visitors}; the page starts reading at ${MIN_VISITORS}). Keep publishing and check again next week.` };
  }
  // The weakest step is the one that keeps the smallest share of the step before it.
  let weakest: keyof typeof LADDER_ADVICE | null = null;
  let lowest = Infinity;
  for (let i = 1; i < LADDER_STEPS.length; i++) {
    const before = counts[LADDER_STEPS[i - 1].key];
    const key = LADDER_STEPS[i].key as keyof typeof LADDER_ADVICE;
    if (before <= 0) break;
    const kept = counts[key] / before;
    if (kept < lowest) { lowest = kept; weakest = key; }
  }
  if (!weakest) return { tone: "wait", text: "No step after the visit has happened yet in this period." };
  if (counts.accepted > 0 && lowest >= 0.5) {
    return { tone: "fine", text: `No step loses more than half its people. ${counts.accepted} accepted ${counts.accepted === 1 ? "enquiry" : "enquiries"}: check the inbox and the sales register for fit.` };
  }
  return { tone: "act", text: LADDER_ADVICE[weakest] };
}

export type PostCounts = { post: string; visits: number; contact: number; accepted: number };

export function readPosts(rows: PostCounts[]): Reading {
  const visits = rows.reduce((sum, row) => sum + row.visits, 0);
  if (!rows.length) return { tone: "wait", text: "No tagged post has sent a visit in this period. Check that bio, Story and DM links carry the campaign URL from the channel plan." };
  if (visits < MIN_VISITORS) return { tone: "wait", text: `Tagged posts sent ${visits} ${visits === 1 ? "visit" : "visits"} in total, too few to compare posts. Note which topics sent anyone at all.` };
  const leader = rows.find((row) => row.accepted > 0) ?? rows.find((row) => row.contact > 0);
  if (!leader) return { tone: "act", text: "Posts are sending visits, but none of those visits reached contact. Check that each post's destination matches its promise." };
  return { tone: "fine", text: `${leader.post} sent the most people who went on to act. Consider another story on the same buyer question.` };
}

export type CaseCounts = { title: string; sessions: number; contact: number | null };

export function readCases(rows: CaseCounts[]): Reading {
  const seen = rows.filter((row) => row.sessions > 0);
  const total = seen.reduce((sum, row) => sum + row.sessions, 0);
  if (total < MIN_VISITORS) return { tone: "wait", text: `Case studies had ${total} ${total === 1 ? "session" : "sessions"} in this period. Too few to rank, so these are observations only.` };
  const persuading = seen.filter((row) => (row.contact ?? 0) > 0).sort((a, b) => (b.contact ?? 0) / b.sessions - (a.contact ?? 0) / a.sessions);
  if (!persuading.length) return { tone: "act", text: "People read case studies but none went on to contact. Check that each case ends with a clear next step." };
  return { tone: "fine", text: `${persuading[0].title} leads to contact most often. It's a good candidate to promote or pin.` };
}

/** The homepage stage in order. Mirrors `HomeSection` in analytics.ts, which
 * is client code this pure module doesn't import. */
export const HOME_SECTIONS = [
  { key: "about", label: "01 About" },
  { key: "services", label: "02 Services" },
  { key: "process", label: "03 Process" },
  { key: "work", label: "04 Selected work" },
  { key: "pricing", label: "05 Pricing" },
] as const;

export type SectionCounts = { views: number; reached: Record<(typeof HOME_SECTIONS)[number]["key"], number> };

/** Homepage views, then how many of them reached each section. Events started
 * on 10 October 2026, so earlier views have no section data. */
export function readSections(counts: SectionCounts): Reading {
  const first = counts.reached[HOME_SECTIONS[0].key];
  if (first === 0) return { tone: "wait", text: "No section has been reported yet in this period. Tracking started on 10 October 2026." };
  if (counts.views < MIN_VISITORS) return { tone: "wait", text: `Too few homepage views to read (${counts.views}; the page starts reading at ${MIN_VISITORS}).` };
  // The step that keeps the smallest share of the step before it, starting from the hero.
  let worst: { from: string; to: string; kept: number } = { from: "the hero", to: HOME_SECTIONS[0].label, kept: first / counts.views };
  for (let i = 1; i < HOME_SECTIONS.length; i++) {
    const before = counts.reached[HOME_SECTIONS[i - 1].key];
    if (before <= 0) break;
    const kept = counts.reached[HOME_SECTIONS[i].key] / before;
    if (kept < worst.kept) worst = { from: HOME_SECTIONS[i - 1].label, to: HOME_SECTIONS[i].label, kept };
  }
  if (worst.kept >= 0.7) return { tone: "fine", text: "No step loses more than 30% of the people who reached the one before. Distance isn't the main problem." };
  return { tone: "act", text: `The biggest drop is from ${worst.from} to ${worst.to}: ${Math.round(worst.kept * 100)}% continue. That is where to shorten, or where to bring the next step forward.` };
}

// Google's Core Web Vitals thresholds at the 75th percentile (web.dev/vitals).
export const SPEED_THRESHOLDS = {
  lcp: { good: 2500, poor: 4000, label: "Largest paint", unit: "ms" },
  inp: { good: 200, poor: 500, label: "Response to input", unit: "ms" },
  cls: { good: 0.1, poor: 0.25, label: "Layout shift", unit: "" },
} as const;

export type SpeedRating = "good" | "needs work" | "poor";

export function rateSpeed(metric: keyof typeof SPEED_THRESHOLDS, p75: number): SpeedRating {
  const { good, poor } = SPEED_THRESHOLDS[metric];
  return p75 <= good ? "good" : p75 <= poor ? "needs work" : "poor";
}

export function formatSpeed(metric: keyof typeof SPEED_THRESHOLDS, p75: number): string {
  return metric === "cls" ? p75.toFixed(2) : p75 >= 1000 ? `${(p75 / 1000).toFixed(1)} s` : `${Math.round(p75)} ms`;
}

export type SpeedCounts = { page: string; metric: keyof typeof SPEED_THRESHOLDS; p75: number; samples: number };

export function readSpeed(rows: SpeedCounts[]): Reading {
  if (!rows.length) return { tone: "wait", text: "No mobile Web Vitals recorded in this period yet." };
  const poor = rows.filter((row) => row.samples >= MIN_SPEED_SAMPLES && rateSpeed(row.metric, row.p75) === "poor");
  if (poor.length) {
    const worst = poor[0];
    return { tone: "act", text: `${worst.page} is slow on phones (${SPEED_THRESHOLDS[worst.metric].label.toLowerCase()} ${formatSpeed(worst.metric, worst.p75)}). Fix that before judging the content that sends people there.` };
  }
  if (rows.every((row) => row.samples < MIN_SPEED_SAMPLES)) return { tone: "wait", text: `Fewer than ${MIN_SPEED_SAMPLES} mobile samples per page so far, so ratings are tentative.` };
  return { tone: "fine", text: "No page with enough samples is rated poor on mobile. Speed isn't the bottleneck right now." };
}

export function readCompare(current: LadderCounts, previous: LadderCounts): Reading {
  if (current.visitors < MIN_VISITORS && previous.visitors < MIN_VISITORS) {
    return { tone: "wait", text: `Both periods are under ${MIN_VISITORS} visitors. Any change here is noise. Compare again after a month of publishing.` };
  }
  const delta = current.accepted - previous.accepted;
  const visitorDelta = current.visitors - previous.visitors;
  if (delta === 0) return { tone: visitorDelta > 0 ? "act" : "wait", text: visitorDelta > 0 ? `${visitorDelta} more visitors than the previous period, but the same number of accepted enquiries. Look at the funnel above.` : "Accepted enquiries held steady. Look for a shift in which steps people stop at." };
  return { tone: delta > 0 ? "fine" : "act", text: `${Math.abs(delta)} ${delta > 0 ? "more" : "fewer"} accepted ${Math.abs(delta) === 1 ? "enquiry" : "enquiries"} than the previous period (${previous.accepted} → ${current.accepted}). One or two enquiries is a story, not yet a trend.` };
}
