# Umami operations for Blessed Moon

6 October 2026. Website: `blessed-moon.vercel.app`, Umami ID
`2c0d4ed9-e3a7-4848-84f2-5740d14b3ede` at
[Benito's Umami](https://benitos-analytics.vercel.app).

The business is a solo design and engineering studio. The buying audience is
founders/product leaders commissioning a website or product, plus buyers of the
social strategy offer. The pilot uses English Instagram and LinkedIn; Portuguese
Instagram is optional. Measure whether documented project decisions bring the
right people to a conversation, then whether those conversations become paid work.

## One-time setup

1. Deploy the updated site with the six server-only Gmail SMTP values from
   [email setup](../email-setup.md). Check the notification and thank-you using an
   inbox you control. Gmail authentication was verified locally; that does not
   configure Vercel or verify eventual inbox delivery.
2. Sign into your Umami dashboard. Open Blessed Moon, open DevTools → Console,
   and paste the **entire contents** of
   [umami-setup.js](../../public/umami-setup.js). It uses the
   existing login, without asking for or exposing your password/token.
3. Refresh Umami. The script creates **five goals, four funnels, nine segments,
   one cohort and three boards**, all named `BM · …`. Existing matching names are skipped.
   It targets Umami **3.4**, where saved goals/funnels moved from `/api/reports` to
   `/api/websites/{id}/goals|funnels`. The boards are *Is the pilot working?*,
   *Where do people stall?* and *Weekly check*. Each opens with a "How to read this" note
   and references the saved goals/funnels by ID.
   It sets replays to 15%, heatmaps to 100%, maximum recording duration to five
   minutes, blocks forms/internal plan content, and preserves stricter existing
   masking. The public recorder endpoint previously reported 50% replay / 100%
   heatmaps, moderate masking and no additional block selector.
4. Read-only report screens query their own data. The script keeps presets for
   them in this website's localStorage backup rather than creating unused report
   rows. Use the settings in the table below. Select **current dates** and the
   **Pilot campaign** segment when judging the pilot. Saved goal/funnel defaults
   start with the most recent 30 days; update the reporting period as time passes.
5. On each of your own browsers, open the **public Blessed Moon site**, then run
   `localStorage.setItem('umami.disabled', '1')` and reload. This flag is specific
   to that site/browser. To restore measurement remove it and reload. Do this
   after the controlled production check so your later editing visits do not
   inflate low-volume reports.

The script checks the dashboard origin, website ID/domain and list APIs before
writing. It never resets analytics, deletes definitions, sends test events or
touches another website. Backups and created IDs are stored under
`blessed-moon.umami.backup.<timestamp>` in your dashboard browser. It stops on API
errors; rerunning skips definitions already created. Do not run it concurrently
in multiple tabs. Generic report CRUD remains compatible with the current
[Umami report API migration](https://github.com/umami-software/umami/blob/master/docs/report-api-migration.md).
Live account writes have not been executed from this workspace because there is
no authenticated Umami session here.

## Live insights (`/analytics-plan/live`)

The site reads Umami server-side and shows five panels, each ending with what to check
next. It needs a dedicated **view-only** Umami login, never your admin account. In
Umami 3.4 a non-admin user can only read a website that belongs to a **team**, so:

1. **Settings → Teams → Create team**, e.g. `Blessed Moon`. You are its owner.
2. **Settings → Websites → Blessed Moon → Transfer** to that team. You keep full
   control as team owner. Goals, funnels, segments, boards and data are unaffected.
3. **Settings → Users → Create user**, e.g. `bm-insights`, role **View only**, with a
   long generated password. Don't enable two-factor sign-in for it; the server can't
   answer a 2FA prompt.
4. **Settings → Teams → Blessed Moon → Members → Add** `bm-insights` as **View only**.
5. In Vercel (Production) and `.env.local`, set:
   `UMAMI_API_URL=https://benitos-analytics.vercel.app`, `UMAMI_API_USER=bm-insights`,
   `UMAMI_API_PASSWORD=…`, and `INSIGHTS_PASSWORD=…` (your choice; any username works
   at the browser prompt). Redeploy. Without `INSIGHTS_PASSWORD` the route returns 404.
6. Open `/analytics-plan/live`. "Not connected yet" means a variable is missing.
   "Umami sign-in failed" means the user, password or team access is wrong.

How to read it:

| Panel | Counts | Reading |
|---|---|---|
| Where do people stop? | distinct sessions: visited → reached `/contact` → started form → accepted | Names the step that keeps the smallest share of the one before. Under 20 visitors: "too few to read" |
| Which posts send people who act? | per `utm_content`: visits, then sessions (credited to the post they arrived from) that reached contact / were accepted | First-click within the session, because the landing pageview carries the tag. DMs, copied links and later visits are invisible |
| Which projects persuade? | sessions per case study; how many reached `/contact` within 60 minutes | Ranked only above 20 case sessions |
| Is the site fast enough on a phone? | mobile LCP / INP / CLS, 75th percentile, per page | Google's thresholds. Under 10 samples, ratings are tentative |
| Is it moving? | each step, this period vs the previous period of equal length | Absolute counts. One or two enquiries is "a story, not yet a trend" |

Counts under 30 are shown as "2 of 3", not as percentages. If Umami fails, the panel
says the data is missing; it is never drawn as zero. The page is `no-store`, `noindex`,
excluded from tracking by the analytics policy, and `rr-block`ed from replays.

## Every sidebar screen

| Screen | Configuration / what to inspect | Decision it supports |
|---|---|---|
| Overview | Public production pages segment; current 30 days; visitors, landings, sources and devices. Filter Pilot campaign for the social experiment. | Is the intended destination receiving traffic? Pageviews alone do not establish buyer quality. |
| Events | `service-enquiry-click`, `project-enquiry-start`, `project-enquiry-submit`, `booking-open`; inspect fixed `project_type` properties. | Which service attracts submissions, and where does intent stop? Historical draft/copy events remain intent only. |
| Sessions | Inspect a small sample of anonymous sessions landing on cases, the strategy offer or contact. | Diagnose odd traffic and navigation patterns. Do not infer a named person/company from country or device. |
| Realtime | Use only for a controlled production visit and campaign/submission check. | Verify ingestion after deployment; avoid treating today's tiny sample as a strategy result. |
| Performance | Tracker now enables Web Vitals. Select Mobile and inspect LCP, INP, CLS by page, plus FCP/TTFB when investigating. | Fix slow arrival or interaction before blaming creative. Compare with enquiry completion. [Performance setup](https://docs.umami.is/docs/tracker-configuration). |
| Compare | Four complete weeks against the preceding four, same segment/date lengths; retain absolute counts. | Detect a useful trend without reacting to one enquiry moving a percentage. Annotate site/cadence changes in your review notes. |
| Breakdown | Campaign × source × content, then path × device; inspect countries separately. | Find content/destination mismatches. Country is approximate location, not qualification or language preference. |
| Goals | Primary: **Enquiry accepted**. Supporting: Enquiry started, Contact reached, Strategy CTA, Booking link opened. | Judge real website submissions separately from micro-actions and confirmed bookings. [Goals](https://docs.umami.is/docs/goals). |
| Funnels | Contact → started → accepted; Started → accepted; Work → contact → accepted; Social service → contact → accepted. 60 minutes between consecutive steps. | Identify form friction versus portfolio/service persuasion. The contact funnel includes direct campaign landings; no mandatory homepage step. Apply channel filters instead of duplicating funnels. [Funnels](https://docs.umami.is/docs/funnel). |
| Journeys | Three page steps, ending at `/contact`, event type Page views; also inspect journeys starting at a promoted case. | Discover actual on-site paths. External discovery belongs to UTM/referrers. Do not force those paths into one required funnel. |
| Retention | Current calendar month, public pages; secondary diagnostic only. Check the Umami deployment's `SALT_ROTATION` before interpreting. | A studio is not a daily-use product. Changing network/device or rotating identity prevents reliable return matching. A low return rate is not automatically poor content. [Retention](https://docs.umami.is/docs/retention). |
| Replays | 15% sessions, moderate input masking or existing strict masking, five-minute cap; `.rr-block`, contact form and plan-shell selectors excluded. Review a few stuck sessions weekly. | Diagnose confusing CTAs/navigation. WebGL/canvas visuals are not faithfully captured by this recorder; inspect the actual site alongside replays. [Replays](https://docs.umami.is/docs/replays). |
| Heatmaps | 100% sample initially; homepage Scroll and `/services/social-media` Click. Inspect a promoted case only once it has enough visits. | Check CTA visibility and dead clicks. Pinned/moving layouts complicate scroll percentages; corroborate with funnels and real-device checks. No historic backfill. |
| Segments | Pilot campaign; Instagram; LinkedIn; English IG creative; Portuguese IG creative; English LI creative; Brazil location; Mobile; Public production pages. | Compare channel and language creatives without equating geography/browser language with the target buyer. |
| Cohorts | Pilot visitors in the last 30 days; revisit after a month of data. | Group the pilot's visitors for analysis, subject to anonymous identity limits. The same person can appear as multiple sessions; do not treat this as a CRM cohort. [Cohorts](https://docs.umami.is/docs/cohorts). |
| UTM | Source instagram/linkedin; medium organic_social; campaign studio-social-pilot; content stable post IDs already generated in the channel plans. | Find which posts actually send website visits. Use Instagram bio/Story links or DM links; captions are not a dependable clickable destination. |
| Revenue | Leave unpopulated until a real payment integration exists. Keep BRL as an optional future view; use the appropriate currency for actual payments and never sum currencies. | Actual paid work comes from the sales register. A quote, mail send or thank-you is not revenue. Future payment events need verified payments and deduplication, not browser console guesses. [Revenue](https://docs.umami.is/docs/revenue). |
| Attribution | Last-click; Triggered event; `project-enquiry-submit`. Compare source/campaign/content. First-click can be a secondary comparison within measurable identity history. | Credit the website conversion within Umami's visibility. DMs, copied links, blocked tracking, later direct visits and other devices remain incomplete. [Attribution](https://docs.umami.is/docs/attribution). |

## Link discipline

Keep the naming already used by the post library. Do not change old links from
`organic_social` to another spelling or invent a separate campaign per post.
The campaign identifies the eight-week experiment; content identifies the creative:

```text
utm_source=instagram
utm_medium=organic_social
utm_campaign=studio-social-pilot
utm_content=ig-en-w01-one-action
```

LinkedIn uses `li-en-…`; optional Portuguese Instagram uses `ig-pt-…`. Each brief
already has its actual destination and complete URL. A general bio link measures
the profile placement, not a specific carousel unless its content-specific
destination was used. Do not assign every bio click to the newest post. Tag only
incoming external links; internal navigation stays untagged. No identity or email
belongs in campaign parameters.

Production is restricted to the configured site hostname. Internal planning,
builder and system pageviews are filtered; arbitrary query parameters and hashes
are removed, while safe campaign values remain. This applies to future events;
it does not erase older preview or internal traffic. Replays are separate from
pageview filtering; rr-block excludes form/plan contents but recorder navigation
and heatmap coordinates may still include an internal route after public navigation.

## Weekly operating routine

Spend about 15 minutes per week, plus a monthly 30-minute review:

1. Record native Instagram/LinkedIn reach, saves, shares and relevant replies.
   Umami does not ingest those platform insights.
2. Record tagged visits and accepted submissions by channel/content in the existing
   `/analytics-plan` worksheet. Use distinct-session/visitor counts from matching
   reports, not raw repeated clicks divided by an unrelated traffic count.
3. Record qualified enquiries, decided proposals, won projects, **paid** revenue
   and content hours in a sales/time register. Ask how the buyer found you during
   discovery; self-reported source helps with untagged DMs and delayed decisions.
4. If traffic arrives but the form is not started, inspect destination clarity,
   evidence and CTA visibility. If forms start but do not complete, inspect SMTP
   failures, mobile usability and form friction. If submissions are poor fits,
   revise audience/story selection and qualification copy. State counts and sample
   limits; these are hypotheses, not diagnoses from one or two visitors.
5. At days 30, 60 and 90 review client fit and enquiries per production hour. Repeat
   useful buyer questions/project evidence; revise weak destinations. Keep the
   4–6-hour weekly content budget visible before increasing cadence.

A qualified enquiry means a real business, an in-scope problem and a decision-maker,
with compatible budget/timing established in conversation. Proposal win rate uses
accepted / decided proposals from the same cohort. Actual sales records determine
revenue. The inbox is the submission record; Umami explains measurable paths to it.

## Verification boundaries

Local verification covers Gmail TLS/authentication, two SMTP messages, rejection
paths, form errors/success, honeypot/IP/email limits and privacy of custom events.
The console script is checked against the published API contracts with a mock
server and tested for reruns/scope failures. Real production SMTP delivery,
Umami ingestion and authenticated script application still require the deployed
site and your logged-in dashboard. No baseline or performance outcome is invented.
