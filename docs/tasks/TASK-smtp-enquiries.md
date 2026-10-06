# TASK: Deliver project enquiries through SMTP

## 1. Current scenario

The contact form opens a mailto draft when AGENCY_CONTACT_EMAIL exists, otherwise
copies a local brief. Neither delivers an enquiry. Umami measures these actions
as intent. The user has an SMTP mailbox and asks to replace this flow with real
delivery before finishing the marketing analytics configuration.

## 2. Planned changes

Add a Node route handler and Nodemailer SMTP transport with server-only settings,
TLS, fixed sender/recipient and visitor Reply-To. Validate and bound payloads,
check same-origin requests, include a honeypot and a bounded, best-effort per-instance
rate limit. On the user's request, add per-email quotas with Gmail dot/plus alias
normalization. Limits are per-process; no Redis service is added at this early
stage. Do not log message contents or expose credentials. At the user's explicit
request, send a plain-text thank-you to the visitor only after accepting the studio
notification. It promises a personal follow-up without inventing a response deadline.
Receipt failure must not discard an accepted enquiry or encourage duplicate submission.
Return success only when SMTP accepts the configured recipient; this is submission
acceptance, not proof of inbox delivery or a qualified lead.

Replace mailto/copy submission with an async request, persistent success and honest
retry errors. Keep input after failure, prevent concurrent submissions, block the
form from replays. Unconfigured SMTP visibly disables delivery. Read settings at
request time. Add enquiry-start and accepted-submit events with fixed project type
only. Update the measurement pages/dictionary and old browser checks.

Test validation, origin, anti-abuse handling, real local SMTP acceptance/rejection,
and browser success/failure without sending messages to a real inbox. Provider
authentication and deployment verification require the user's SMTP settings.

## 3. Why

A website submission removes the visitor's email-client dependency and gives the
marketing funnel a meaningful completion event. SMTP allows reuse of the existing
mailbox. No extra CRM or social API is needed. In-memory throttling is a local
backstop, not a global serverless rate limiter; use the host firewall for shared
limits if spam becomes material.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| src/app/api/enquiry/route.ts | new | Validated same-origin SMTP submission |
| src/lib/enquiry.ts | new | Shared fixed field limits/validation |
| src/lib/enquiry-mail.ts | new | Server-only SMTP configuration and delivery |
| src/lib/enquiry-rate-limit.ts | new | Bounded IP/email quotas with HMAC keys |
| src/components/contact-form.tsx | edit | Submit, error and success flow |
| src/app/contact/page.tsx | edit | Delivery availability and public copy |
| src/lib/analytics.ts | edit | Start and accepted-submit events |
| scripts/check-enquiry.mjs | new | Local SMTP/API/browser verification |
| scripts/check-social-strategy.mjs | edit | Remove obsolete copy assertions |
| package.json / pnpm-lock.yaml | edit | SMTP dependencies and check command |
| .env.example | edit | Server-only SMTP settings |
| README.md / docs/social/04-measurement.md / src/app/analytics-plan/page.tsx | edit | Setup and actual conversion definitions |

## 5. Validation and delivery status

Implemented. Gmail SMTP TLS/authentication passed through `node
scripts/verify-smtp.mjs` using the user's saved App Password, without sending a
message or printing credentials. Production build passed with `next build
--webpack`; Turbopack's worker port was blocked by this local execution environment.
TypeScript/build checks and targeted ESLint passed.

`node scripts/check-enquiry.mjs` passed against a local STARTTLS SMTP server:
studio notification, thank-you, independent receipt rejection, studio rejection,
validation/header injection/body size/origin checks, honeypot, IP quota, normalized
Gmail alias/email quota, browser error/retry/success, absent SMTP configuration and
blocked measurement. It also ran the existing social strategy browser checks,
which passed. No external test email was sent. The Gmail fields are configured
locally; Vercel variables, deployment and a real delivery check remain activation
steps. IP/email quotas are deliberately per instance; no Redis service was added.
