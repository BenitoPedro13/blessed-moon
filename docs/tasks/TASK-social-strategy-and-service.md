# TASK: social strategy, service offer, and solo studio identity

4 October 2026. Status: completed and verified. User authorized the research and service listing, then clarified that no other agent is active and Blessed Moon is now Benito alone, without MDR.

## 1. Current scenario

The website has portfolio, services and a custom-quote pricing area, but no social strategy offer or agency planning pages. Umami tracking and an optional recorder are already installed. Contact either prepares an email or copies a local brief; neither is a submitted lead. Homepage and About copy still describe a duo and identify MDR as a lead. The clean repository was inspected before staging changes outside the current writable workspace.

## 2. Planned changes

- Preserve the research as `docs/social/`, with source links and assumptions. Initial market test uses Brazilian portfolio examples while retaining the existing international founder positioning; this is a proposal, not a new brand claim.
- Add public `/services/social-media` with research, content planning and measurement deliverables, a clear fixed scope and custom-quote enquiry. List it alongside existing homepage build services, in pricing and footer. Preserve eight build cards and the 8→4→3→1 handoffs.
- Add unlinked, noindex `/social-plan`, `/instagram-plan`, `/linkedin-plan`, `/analytics-plan`. Shared ordinary-flow document layout; actionable eight-week queue with original briefs, captions, campaign links and source context. No fabricated live metrics or private data. Noindex is not authentication.
- Add typed optional Umami enquiry events. Preserve email and clipboard outcomes and track them accurately with enum-only properties. Preselect the strategy project type through a validated contact query parameter. Do not add a tracker, database or social API.
- Update the current studio identity to Benito alone. Keep About's A→B→0 motif as strategy and engineering disciplines handled by the same founder; remove co-founder and duo claims, add Benito to boot facts, and leave historical project-team facts unchanged.
- Update README, design handoff and working conventions for the solo identity and current routes. Add shared component specimens to `/system`.
- Validate lint, types, production build, metadata/sitemap, phone/short-screen layout, enquiry behaviour and non-personal event payloads. Complete the task's commit per repository convention. No deployment or push.

Alternatives: full account management is not offered without defined production/community scope; published fixed prices are deferred because user is choosing how to charge and the site currently uses custom quotes. A second tracker and invented analytics dashboard are unnecessary.

Browser checks identified a reduced-motion hydration mismatch in the existing morph panels. Use a server-compatible preference snapshot, then switch to the browser layout after hydration; verify homepage and About without React recovery errors. Short-screen screenshots also exposed clipping in the expanded service panel. Compact the short-screen heading/spacing and secondary description so all eight cards remain visible; preserve ordinary-height copy.

## 3. Why

User's follow-up explicitly requires actual competitor / same-audience content and
platform selection. Extend the offer audit with 12 public LinkedIn post samples
across six account families; record hook, subject, visible format indicators, CTA,
buyer-fit inference and original application. Add a capacity-based platform decision
section and link research patterns in every brief. Clearly state incomplete Instagram
feed access. Recommend two primary stories and one secondary adaptation weekly.

Turn the Unimeet research workflow into a clear sellable service, market the agency with original project evidence, and connect content to meaningful enquiry actions. Solo delivery needs explicit scope and accurate public identity. Internal suggested prices remain reviewable without becoming promises on the public service page.

## 4. Affected files

| File | Change | Purpose |
|---|---|---|
| `docs/social/*.md` | new | Research, pricing, content and measurement evidence |
| `src/lib/social-plan.ts` | new | Typed original story records, sources and campaign URLs |
| `src/lib/social-research.ts` | new | Actual content samples and platform decisions |
| `src/components/social/*` | new | Plan shell, reusable post records and enquiry CTA |
| `src/app/{social-plan,instagram-plan,linkedin-plan,analytics-plan}/page.tsx` | new | Agency planning pages |
| `src/app/services/social-media/page.tsx` | new | Public service offer |
| `src/lib/analytics.ts`, `src/lib/project-types.ts` | new | Enum-only events and validated project types |
| `src/components/homepage/{services-focus,pricing-table,about-teaser}.tsx` | edit | Offer visibility and solo copy |
| `src/components/contact-form.tsx`, `src/app/contact/page.tsx` | edit | Strategy enquiry and outcome tracking |
| `src/components/site-footer.tsx`, `src/app/sitemap.ts` | edit | Public service discovery |
| `src/lib/studio-data.ts`, `src/lib/boot-info.ts`, `src/components/about/*.tsx`, `src/app/about/page.tsx` | edit | Benito's solo studio identity |
| `src/components/scroll-morph-stage.tsx` | fix | Server-compatible reduced-motion layout selection |
| `src/components/morph-tokens.ts`, `src/app/system/page.tsx` | edit | Accurate motif documentation and shared specimens |
| `README.md`, `CLAUDE.md`, `docs/design-handoff.md` | edit | Current architecture, identity and setup |
| `scripts/check-social-strategy.mjs` | new | Targeted browser verification of behaviour and metadata |

## Verification

- Actual repository: `pnpm build` (Next.js 16.3 Turbopack) passed, including
  TypeScript and all new routes. Review build/process disabled optional Umami and
  recorder variables without editing environment files.
- `pnpm lint` passed with zero errors and two existing `boot-sequence.tsx`
  exhaustive-deps warnings (lines 249 and 294). Direct staged TypeScript check passed.
- `git diff --check` and browser-script syntax check passed.
- Final browser run against the actual repository on localhost:3194 passed:
  routes, one primary heading, service canonical, noindex working pages, sitemap
  inclusion/exclusion, research references, expandable briefs, UTM links, calculator,
  CTA preselection, valid/invalid project types, clipboard success/failure, fixed
  non-personal event payloads and a blocked tracker.
- Desktop, 390px and 320px layouts passed overflow checks. All eight cards fit the
  normal-motion pinned panel on 1440/390/320 widths with 568px height. Homepage and
  About reduced-motion renders produced no uncaught React/hydration errors.
- Earlier final browser attempts exposed a network-idle timeout and a test race
  while reduced-motion hydration replaced the initial server layout. The harness
  now waits for document load and the actual stacked section before interaction,
  instead of relying on background network inactivity. The complete rerun passed.
- Reviewed desktop/mobile service screenshots and 320px pinned services screenshot;
  artifacts: `/private/tmp/blessed-moon-review-2026-10-04/`.
- README, current studio conventions, design handoff, /system specimens, research,
  scope/pricing, measurement, review guide and future-agent prompt are updated.
- No social account insights, authenticated feed access or real Umami ingestion were
  supplied. Actual post samples are LinkedIn; Instagram feed coverage is incomplete.
  Official email/booking are unset locally: browser checks exercised brief copying;
  email dispatch, confirmed bookings and sales are not claimed as verified.
- The four plan pages are noindex/unlinked, not authenticated. Numerical fees remain
  internal proposals; no full account-management commitment was introduced.
- No deployment, push, dependency change, secret mutation or Unimeet change performed.
