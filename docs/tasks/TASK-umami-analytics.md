# TASK: Umami analytics (tracking + session replay/heatmaps)

## 1. Current scenario

No analytics of any kind are wired into the site. `src/app/layout.tsx` already imports
`next/script` for one purpose (disabling scroll restoration, `beforeInteractive`), but no
`<Script>` calls out to a third-party analytics endpoint.

The same self-hosted Umami instance (`https://benitos-analytics.vercel.app`) already tracks
the `portfolio` project under a separate website ID; this task registers Blessed Moon as its
own website in that instance (already done by the user in the Umami dashboard, website ID
`2c0d4ed9-e3a7-4848-84f2-5740d14b3ede`) and wires both its tracking script and its session
replay/heatmap recorder script into this repo.

## 2. Planned changes

- **`src/app/layout.tsx`** — add two `next/script` tags, both `strategy="afterInteractive"`,
  both gated behind `NODE_ENV === "production"` plus their own env var being set (so local
  dev traffic is never tracked and a missing env var fails closed instead of throwing):
  - `NEXT_PUBLIC_UMAMI_SRC` / `NEXT_PUBLIC_UMAMI_WEBSITE_ID` → the base pageview/event
    tracker (`script.js`).
  - `NEXT_PUBLIC_UMAMI_RECORDER_SRC` → the session replay/heatmap recorder (`recorder.js`).
    Reuses the same `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (Umami scopes both scripts to the same
    website ID, confirmed from the dashboard's two code snippets — both carry
    `data-website-id="2c0d4ed9-e3a7-4848-84f2-5740d14b3ede"`).
- **`.env.example`** — document the three new vars as an empty template, matching the
  existing `ORIGIN_TRIAL_TOKEN_HTML_IN_CANVAS` pattern (comment explaining purpose, blank
  value).
- **`.env`** (gitignored, not committed) — the real values, for local `pnpm build && pnpm
  start` verification.

Sample rates, mask level, and max duration for the recorder are configured entirely in the
Umami dashboard (server-side, per-website), not in code — nothing here to set from this
repo. Discussed with the user: heatmap rate set to 1.0 and replay rate to 0.3–0.5 while
traffic is low, moderate mask level kept, revisit once traffic grows.

## 3. Why

The user wants to know how visitors actually move through the scroll-morph homepage and
subpages (drop-off points, whether the boot sequence gets skipped, whether `/work` entries
get clicked) — replays and heatmaps answer that directly, pageview counts alone don't.
Self-hosted, so no per-event billing concern in choosing sample rates.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/app/layout.tsx` | edit | add two production-gated `next/script` tags for tracking + recorder |
| `.env.example` | edit | document the three new env vars (blank) |
| `.env` | edit (not committed) | real values for local verification |
