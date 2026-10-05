# Measurement and analytics implementation plan

4 October 2026. Specification, not an implemented integration or populated dashboard.

## Existing installation

The inspected `src/app/layout.tsx` already renders a production-gated Umami tracker using `NEXT_PUBLIC_UMAMI_SRC` and `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, and an optional recorder using `NEXT_PUBLIC_UMAMI_RECORDER_SRC`. `docs/tasks/TASK-umami-analytics.md` describes an existing self-hosted instance. Do not create another analytics platform or duplicate tracker.

Production data ingestion, installed Umami version, staff-traffic exclusion and dashboard access have not been verified. Production mode alone also includes preview production builds, so check whether the current configuration excludes unwanted hostnames. Do not expose private environment variables, log secrets or embed a public dashboard token without a deliberate access decision.

The contact form currently opens a mail draft when `AGENCY_CONTACT_EMAIL` exists; otherwise it copies a local brief. Booking is conditional on `AGENCY_BOOKING_URL`. None of these outcomes is a confirmed lead submission. Confirm that a working agency enquiry channel exists before scaling a campaign.

## Campaign convention

Use `utm_source=instagram|linkedin`, `utm_medium=organic_social`, `utm_campaign=studio-social-pilot`, and stable `utm_content` IDs such as `ig-w01-oishi-carousel` or `li-w01-oishi-decision` on inbound external links. Build URLs with `URL` / `URLSearchParams` against the configured site origin.

For example: `https://blessed-moon.vercel.app/work/oishi?utm_source=instagram&utm_medium=organic_social&utm_campaign=studio-social-pilot&utm_content=ig-w01-oishi-carousel`.

Use clickable profile/Story destinations for Instagram. Do not assume a caption link produces clicks. Do not append UTMs to internal site navigation: those can overwrite the original acquisition context. Umami documents campaign parameters and event-based analysis. [UTM documentation](https://docs.umami.is/docs/utm), [campaign guide](https://docs.umami.is/docs/guides/measure-campaigns).

## Minimal event dictionary

Implement with a typed helper around the existing `window.umami.track`. Never send name, email, company, message, phone number or the composed mailto URL.

| Event | Fixed/allowed properties | Meaning |
|---|---|---|
| `service-enquiry-click` | `service: social-media-strategy`, `location: home|service-page` | Person followed the service contact CTA; not a lead |
| `project-enquiry-email-open` | `project_type` from fixed form options | Validated form prepared a mail draft; email may never be sent |
| `project-enquiry-brief-copy` | `project_type` from fixed form options | Clipboard write succeeded; brief was not delivered |
| `booking-open` | `location: contact` | Person followed the configured booking link; not a booked meeting |

Use real client-side handler success for copy events. Do not count copy before the clipboard promise resolves. Keep internal links as Next `Link` navigation; do not accidentally turn them into full reloads through an analytics attribute handler. The helper should fail harmlessly if the tracker is absent or blocked and should not delay contact/navigation. Follow the installed tracker version's API. [Umami event documentation](https://docs.umami.is/docs/track-events).

## What the report should show

| Layer | Metric / definition | Source and decision |
|---|---|---|
| Content | Reach, saves, shares and replies by format and audience | Native platform insights; which topics attract relevant people? |
| Acquisition | Visits/sessions attributed to tagged external links | Umami; which content brings visitors to the appropriate page? |
| Website intent | Relevant CTA, email-open or successful brief-copy events, separately | Umami; do visitors take the offered next step? |
| Sales | Confirmed enquiries, qualified enquiries, sent proposals, accepted contracts, collected revenue | Manual sales register initially; which work leads to actual business? |
| Efficiency | Creation and client-work hours | Time log; can the system be sustained profitably? |

Define a qualified enquiry as a real business with an in-scope problem and an identifiable decision-maker, plus budget/timing compatibility after a conversation. Record the qualification rule consistently. Use an optional "How did you find us?" question during discovery to help with untagged social/DM traffic. Do not claim complete attribution across apps, devices or copied links.

Compute website intent rates with distinct sessions and the matching session denominator if available. Avoid dividing raw repeated clicks by visitors and calling it a conversion rate. Compute proposal win rate as accepted proposals / proposals decided in the same cohort. Revenue comes from actual records, not the value entered in an enquiry.

Native LinkedIn post insights and Search Console complement website analytics; neither requires creating an API integration for this first phase. [LinkedIn post analytics](https://www.linkedin.com/help/linkedin/answer/a525196/view-analytics-for-your-posts-shared-posts-and-articles?lang=en), [Search Console guide](https://developers.google.com/search/docs/monitor-debug/search-console-start).

## Dashboard and review boundary

The planning page can show metric definitions, a review template, and a labelled empty state: **No account data connected.** Use manual records/imports first if needed. Do not show fabricated reach, follower counts, enquiries or charts. A live social dashboard needs separately scoped platform access and ingestion; Umami does not collect Instagram or LinkedIn native insights by installing a website script.

At 30 days establish a baseline. At 60 days repeat useful topics and revise weak destinations. At 90 days assess confirmed enquiries, client fit and production time. Handle zero traffic or small samples plainly rather than promising percentage growth. Existing recorder settings are outside this task; do not broaden recording while implementing a strategy page.
