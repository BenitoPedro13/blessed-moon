# TASK: Register the HTML-in-Canvas Origin Trial for production visitors

## 1. Current scenario

`ParticleScroll` and `DecryptReveal` (`src/components/canvasui/`) both depend on the
experimental, non-standard `html-in-canvas` browser API (`ctx.drawElementImage`,
`canvas.requestPaint`) — confirmed live via `docs/tasks/TASK-sound-and-boot.md`. Both
components already probe for it (`supportsHtmlInCanvas()`) and degrade gracefully to plain
content when it's absent — this is intentional and stays as the baseline for every visitor
who isn't covered by the trial.

Real-world incident that surfaced the gap: after a full OS/browser reset, the capability
disappeared from the user's own dev browser (`drawElementImage` → `undefined`) while it kept
working on `canvasui.dev`. That ruled out a plain local Chrome-flag/version issue — the
capability was present in the browser generally, just not granted on our own origin.

Confirmed via Chrome's own developer blog
([Introducing the HTML-in-Canvas API origin trial](https://developer.chrome.com/blog/html-in-canvas-origin-trial)):
this API shipped as a Chrome **Origin Trial**, live in Chrome 148–150, gated per-origin by a
token. `canvasui.dev` evidently carries its own token; this repo doesn't. Outside a registered
origin, the only way to get the capability is the user manually flipping
`chrome://flags/#enable-experimental-web-platform-features` (or, per Chrome's testing
instructions, `chrome://flags/#canvas-draw-element` on Canary 149+) — not something a real
site visitor will ever do. The user explicitly wants the effect to work for ordinary visitors
without requiring that.

## 2. Planned changes

- **`next.config.ts`**: add a `headers()` entry that sends an `Origin-Trial: <token>` response
  header on every route, reading the token from a server-side env var
  (`ORIGIN_TRIAL_TOKEN_HTML_IN_CANVAS`) rather than hardcoding it — the token is tied to a
  specific origin and this project's final production domain is still open per `CLAUDE.md`
  §0, so it needs to stay swappable without a code change. When the env var is unset, `headers()`
  returns an empty header list for that entry (no blank `Origin-Trial:` header emitted) so local
  dev without the var configured is unaffected.
- **`.env.example`** (new): documents the expected var name and links to the registration
  dashboard, without a real token (secrets don't belong in git — `.env*` is already
  gitignored per `.gitignore`).
- **No changes to `ParticleScroll.tsx` / `DecryptReveal.tsx`** — their existing
  `supportsHtmlInCanvas()` probe already does the right thing once the header is present: real
  visitors on a participating Chrome build get the native effect, everyone else keeps the
  existing graceful fallback. No new code path needed on the component side.
- **Registration itself is a manual step outside this repo**: the user needs to sign in with a
  Google account at Chrome's Origin Trial dashboard
  (`https://developer.chrome.com/origintrials/#/view_trial/3478467762190286849`), register the
  exact production origin (currently `https://blessed-moon.vercel.app`, matching
  `src/lib/site-config.ts`'s `SITE_URL`), and paste the resulting token into
  `ORIGIN_TRIAL_TOKEN_HTML_IN_CANVAS` in Vercel's project env vars. This document doesn't (and
  can't) complete that step — it just makes the code ready to pick the token up the moment it
  exists.

### Alternatives considered

- **`<meta http-equiv="origin-trial">` in `layout.tsx`** instead of a response header — works
  too, but a header applies uniformly across every route/response (including the OG-image and
  icon route handlers) without touching JSX, and keeps the token out of the rendered HTML
  source where it'd be easy to accidentally hardcode. Header wins on that basis.
- **Registering a second token for `localhost`** for local dev — deferred. Origin Trial tokens
  are registered per origin including port, so it's a separate registration from production;
  not doing it now since local dev can still fall back to the `chrome://flags` workaround, and
  the priority here is unauthenticated production visitors.

## 3. Why

The user wants the particle-dissolve effect to work automatically for real visitors, without
anyone touching browser flags. An Origin Trial token is the only mechanism that achieves that
— it's what lets a participating Chrome build silently unlock the capability for anyone
hitting the registered origin. It does **not** make the effect universal: it's Chrome-only,
scoped to Chrome 148–150, time-boxed (trials expire; Google may ship the API to stable,
extend the trial, or let it lapse), and origin-bound (a domain change means a new token). The
existing fallback remains the real baseline for every visitor outside that window — this
change is a pure upgrade path layered on top of it, not a replacement for it.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `next.config.ts` | edit | adds `headers()` emitting `Origin-Trial` from an env var |
| `.env.example` | new | documents `ORIGIN_TRIAL_TOKEN_HTML_IN_CANVAS`, no real token committed |
| `docs/tasks/TASK-html-in-canvas-origin-trial.md` | new | this document |
