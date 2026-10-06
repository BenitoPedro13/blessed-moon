# TASK: Configure Umami for the studio's social acquisition plan

## 1. Current scenario

Blessed Moon is a solo design/engineering studio serving founders and product
leaders. Instagram and LinkedIn lead in English; Portuguese Instagram is an
optional second audience. The eight-week pilot already uses organic_social,
studio-social-pilot and stable post IDs. The production tracker and recorder
exist, but previews/internal workspaces are not excluded and Web Vitals are not
enabled. SMTP now gives the contact funnel an accepted-submission event.

## 2. Planned changes

Add tracker domain/DNT/hash exclusions, a before-send policy excluding internal
workspaces and limiting URL queries to campaign fields, and performance collection.
Keep internal navigation untagged. Gate recorder loading on the base tracker too.

Create a self-contained console script for the authenticated Umami origin and
fixed Blessed Moon website ID. Validate the website domain and APIs before any
write. Create five goals, four funnels, nine channel/audience segments and one
pilot cohort; skip existing names, never delete/reset data or manufacture events.
Other report screens query data directly; save their useful criteria as local
presets rather than unused database definitions.
Use the published generic report API, retained by current Umami's compatibility
routes. Save a local backup and readable action summary without credentials.
Configure replay/heatmap sampling with forms/workspaces blocked; preserve stricter
existing masking and selectors. Cover every sidebar screen with a practical
operating guide, including retention/revenue interpretation limits.

Verify the console workflow with mocked API contracts, idempotence, failures and
website mismatch; verify production tracker attributes and policy with browser
checks. Account-side application requires the user to run the script in their
logged-in Umami tab; no authenticated analytics connector exists in this workspace.

## 3. Why

The useful outcome is qualified enquiries and collected revenue per content
effort. Umami explains website acquisition and drop-off; native insights explain
reach/saves, and a sales register records qualification and money. Short sessions,
small samples and anonymous identity prevent complete cross-device attribution.
Site visits and email confirmations must not become fabricated revenue events.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| public/analytics-policy.js | new | Public route/query filtering before send |
| src/app/layout.tsx | edit | Domain, DNT, Web Vitals and recorder gates |
| src/components/social/plan-shell.tsx | edit | Block full internal planning content from replays |
| public/umami-setup.js | new | Authenticated, scoped, repeatable dashboard setup |
| scripts/check-umami-setup.mjs | new | Contract and policy verification |
| docs/social/12-umami-operations.md | new | All sidebar screens, metrics and review routine |
| src/app/analytics-plan/page.tsx | edit | Link to setup and operational plan |
| README.md / docs/social/README.md | edit | Reproducible setup and verification |

## 5. Validation and activation status

Implemented. The public tracker/recorder and recorder settings were inspected from
the deployed self-hosted instance. The setup contracts were checked against
Umami's published v3.3 routes/schema and current compatibility migration.

`node scripts/check-umami-setup.mjs` passed scoped API requests, 19 created
definitions, rerun idempotence, preserved masking/selectors, fail-before-write
preflights, credentials omitted from logs/backups, and private route/query policy.
Production Webpack build, TypeScript and targeted ESLint passed. SMTP/browser
verification and the existing social strategy checks passed against the final
production build, with external tracking requests blocked during tests.

The console script is available at `/umami-setup.js`, with a download in
`/analytics-plan`. It has not been applied to the authenticated dashboard from this
workspace. The user's console run, site deployment and production ingestion check
are the remaining activation steps; no live counts or revenue are claimed.
