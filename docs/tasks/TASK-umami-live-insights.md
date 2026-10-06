# TASK: Umami boards + live insights on /analytics-plan

## 1. Current scenario

- The site sends Umami pageviews, four enum-only enquiry events (`src/lib/analytics.ts`) and
  an optional recorder to the self-hosted instance `https://benitos-analytics.vercel.app`
  (website `2c0d4ed9-e3a7-4848-84f2-5740d14b3ede`) — `TASK-umami-analytics.md`.
- `public/umami-setup.js` is a console script, pasted into the logged-in dashboard. It
  creates `BM · …` goals, funnels, segments and a cohort, and sets replay/heatmap settings
  (`docs/social/12-umami-operations.md`). It **does not create Boards**. It has not been
  run against the live account.
- `/analytics-plan` is an unlinked, noindex page that anyone with the URL can open. It is a
  specification: §01 says plainly "No account data connected." Its only chart
  (`MeasurementChart`) plots observations you type in by hand.
- Benito finds Umami's own screens hard to act on. They show raw numbers but don't say
  which number matters or what to do when it moves.

**Version risk found while planning.** The current Umami source (3.4.0, checked
16 Sep 2026) has **moved** the report API: `/api/reports/funnel` → `/api/websites/{id}/funnels`,
`/goal` → `/goals`, `/performance` → `/performance/{stats,chart,metrics}` (upstream
`docs/report-api-migration.md`). `umami-setup.js` writes to `/api/reports`. Its deployed
version can't be read anonymously (`/api/config` doesn't expose it). **Step 0 of this task is
reading the version off the dashboard.** If it's ≥ the migration, the existing script needs
the same endpoint update before it can be run at all.

## 2. Planned changes

### Part A — Boards in the existing setup script

`public/umami-setup.js` gains a fourth phase after segments/cohort. It still runs from the
console, so the user's own session is reused and no password is entered. It checks Umami 3.4's
`POST /api/boards` contract (`type`, `name`, `description`,
`parameters.rows[].columns[].component`). It skips any board whose name already exists, and
it never edits or deletes one. Three boards, each answering one question; every board opens
with a `TextBlock` explaining how to read it:

| Board | Components (Umami's registry types) | Question |
|---|---|---|
| `BM · Is the pilot working?` | `WebsiteMetricsBar`, `Goal` (Enquiry accepted), `Funnel` (contact → started → accepted), `UTM` (utm_content), `EventsChart` | Are tagged posts bringing people who take the next step? |
| `BM · Where do people stall?` | `MetricsTable` (path / entry pages), `Funnel` (work → contact → accepted), `MetricsTable` (device), `WebsiteChart` | Is the drop before the form, in the form, or on mobile? |
| `BM · Weekly check` | `WeeklyTraffic`, `MetricsTable` (referrer), `EventsMetricsBar`, `TextBlock` with the 15-minute routine | The doc-12 weekly routine as one screen |

The `Goal`/`Funnel` components reference the saved goal/funnel IDs that the earlier phases
created or found. Upstream validates these (`hasValidBoardReports`), so a board that points
at a missing report is rejected rather than saved half-broken. Component prop shapes are
copied from `boardComponentRegistry.tsx` in the matching Umami version
**[VERIFY against the deployed version, step 0]**. `scripts/check-umami-setup.mjs` extends its
mock server to cover boards: the create contract, skip-on-rerun, and a stop on a 4xx.

### Part B — live insights, behind a password

**Where the data appears.** `/analytics-plan` stays public and keeps its spec text, with one
change: its §01 copy points to the new route. The live view is a new route,
`/analytics-plan/live`, so the readable numbers sit behind the gate and the spec does not.
One route; no second dashboard elsewhere.

**Gate.** `src/proxy.ts` (Next 16's renamed middleware) matches only
`/analytics-plan/live`. It applies HTTP Basic auth against the server-only
`INSIGHTS_PASSWORD`. Without the variable, the route fails closed with a 404, never open.
The page also sends `noindex` and `Cache-Control: private, no-store`.

**Umami credentials.** A dedicated **view-only** Umami user (role `view-only`). In 3.4,
`canViewWebsite` lets a non-admin read a website only if they own it or it belongs to a
team they are in. So Blessed Moon is transferred to a team that Benito owns, and the user
joins it as `team-view-only`. Server-only env: `UMAMI_API_URL`, `UMAMI_API_USER`,
`UMAMI_API_PASSWORD`. Nothing is `NEXT_PUBLIC_`, and no token reaches the browser. Your admin
login is never used.

**Data layer — `src/lib/umami-insights.ts`** (server-only, `import "server-only"`):
- `login()` → `POST /api/auth/login` → bearer token, reused only within one render.
- Typed fetchers for the few endpoints the views need: `stats`, `metrics` (path, referrer,
  device, `utm_content`, event), `funnels/stats`, `goals/stats`,
  `performance/metrics` **[VERIFY each response shape against step 0's version]**.
- Every result carries `{ status: "ok" | "no-data" | "unavailable" }`. "Measured zero" and
  "no data" stay distinct, the same rule the manual worksheet follows. An Umami outage
  renders as "unavailable", never as zeros.
- The period comes from `?range=7d|28d|90d` (plain links; default 28 days), always
  compared with the previous period of the same length.

**Views — `src/components/insights/*`.** Server components and hand-drawn SVG in the
existing `plan-charts.tsx` style. No chart library, no client JS except the period links,
which are plain `<a>`. Each panel is built as *question → evidence → reading*:

| Panel | Evidence | Reading rule (from doc 12 §4) |
|---|---|---|
| **Step-by-step funnel** | visitors → contact reached → form started → accepted, per week, as counts | The biggest step-to-step drop names the problem: before contact = destination/evidence; started-not-accepted = form/SMTP/mobile friction |
| **Post scorecard** | each `utm_content` → visits → contact → submitted | Which posts send people who act. Posts with no visits are listed too, so "no traffic" is visible |
| **Work → contact** | case pages ranked by sessions that reach `/contact` afterwards | Which projects persuade. Shown only above a minimum number of sessions |
| **Mobile speed** | LCP/INP/CLS per page, against Google's good/needs-work/poor thresholds | Fix a slow arrival before blaming the content |
| **4 weeks vs previous 4** | absolute counts both sides, plus the difference | A trend, with a stated sample size |

**Small-number honesty is built in, not left to the reader:**
- Show counts ("2 of 3"), not percentages, below 30 in the denominator.
- Below a stated minimum (e.g. fewer than 20 visitors in the step), the reading says *"Too
  few visits to read — keep publishing"* instead of a verdict.
- Readings are labelled as hypotheses, never diagnoses.

Color follows the site: amber marks the one reading to act on, cool surfaces carry
everything else, and the text always states the meaning (WCAG: color is never the only
signal).

**Rejected alternatives:**
- Fetching in the browser with TanStack Query. It would expose the token, and nothing
  here needs client refetching.
- Embedding Umami's share-URL iframe. Same raw screens, no readings.
- Putting live data on `/analytics-plan` itself. That page is intentionally an open spec.
- A chart library. Five small SVG figures don't justify the dependency, and the existing
  plan charts are SVG.

### Docs
`docs/social/12-umami-operations.md` gets new sections for the boards, the view-only user
and team setup, and the env vars. `README.md` gets the new env vars and the status line. The
`CLAUDE.md` social section notes that `/analytics-plan/live` is the one gated route and
reads Umami server-side only. `/system` gets a panel for the reusable insight-panel
component, using fixture data. `.env.example` gets the four new variables.

## 3. Why

The data already exists, but Umami presents it as numbers without meaning. The decisions
doc 12 asks for each week (is it traffic, the destination, or the form?) need a few
specific comparisons. That is easier to build here than to configure in Umami. Boards stay
useful inside Umami, and the script makes them reproducible. Cost: one gated route, one
server module, a view-only Umami account, and keeping the fetchers in step with Umami's API
(this task has already hit one breaking move). Low traffic is the main limit. The page will
mostly say "too few to read" for the first weeks, and that is the correct output.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `public/umami-setup.js` | edit | report endpoints updated if step 0 requires; new boards phase |
| `scripts/check-umami-setup.mjs` | edit | mock covers new endpoints + boards |
| `src/proxy.ts` | new | Basic auth for `/analytics-plan/live` only; fails closed |
| `src/lib/umami-insights.ts` | new | server-only login + typed fetchers + ok/no-data/unavailable |
| `src/lib/insight-readings.ts` | new | pure functions: thresholds, minimum-sample rules, reading text (unit-checkable) |
| `src/app/analytics-plan/live/page.tsx` | new | gated, dynamic, noindex, `no-store` |
| `src/components/insights/*.tsx` | new | funnel, post scorecard, work→contact, mobile speed, period compare |
| `src/app/analytics-plan/page.tsx` | edit | §01 copy points to the live view |
| `src/app/system/page.tsx` | edit | insight panel with fixture data |
| `src/components/social/plan-shell.tsx` | edit | optional `notice` prop (the default notice says "no connected metrics") |
| `docs/social/04-measurement.md` | edit | the empty state now points to the live route |
| `scripts/check-insights.mjs` | new | reading rules, fail-closed gate, no token in HTML |
| `.env.example` | edit | `INSIGHTS_PASSWORD`, `UMAMI_API_URL`, `UMAMI_API_USER`, `UMAMI_API_PASSWORD` |
| `docs/social/12-umami-operations.md`, `README.md`, `CLAUDE.md` | edit | per Docs above |

## 5. Needs from Benito before/while building

1. The Umami version, shown in the dashboard under Settings / the profile menu (step 0).
2. Create the view-only user and the team in Umami, then add the env vars in Vercel. I'll
   give exact steps. I can't log in to the account from here.
3. Choose `INSIGHTS_PASSWORD` yourself and set it in Vercel and `.env.local`.

## 6. Outcome (6 October 2026)

Built as planned, with these specifics settled during the work:

- **Step 0:** Benito confirmed **3.4.0**. `umami-setup.js` used the removed `/api/reports`
  CRUD and would have failed. It now lists and creates goals/funnels through
  `/api/websites/{id}/goals|funnels`, with dateless parameters, as the 3.4 schema requires.
  Boards are created last via `POST /api/boards` (`type: "website"`, rows → columns →
  `{ type, title, props }`, with `Goal`/`Funnel` `props.reportId` pointing at the saved
  definitions).
- **Data:** each step count is `/attribution` `total.visitors`, i.e. distinct sessions doing
  the step. The post scorecard uses that same call's first-click `utm_content` breakdown,
  because the landing pageview carries the tag and a last-click event usually doesn't.
  Case-to-contact uses ad hoc `/funnels/stats` per case page, queried only when the page
  had sessions, because upstream `getFunnel` indexes `results[0]` and errors on an empty
  first step.
- **Display:** case studies with no sessions collapse into one "N had no sessions
  (measured zero)" line.
- **Verified:** `tsc`, lint (no new warnings), `pnpm build` (`/analytics-plan/live` is
  dynamic, proxy registered), `check-umami-setup.mjs`, `check-insights.mjs`. These ran
  against a production server with a mock Umami: 401/404 without auth, 401 on a wrong
  password, 200 with `no-store`/noindex, and no credential or token in the HTML. Also
  covered: an outage on one endpoint (that panel only says missing), Umami down entirely,
  and desktop/390px screenshots with no horizontal overflow.
- **Not verified from here:** the real Umami account. That needs the team/user setup in
  `docs/social/12-umami-operations.md` § Live insights and the four Vercel variables.
  The console script has not been run against the live account.
