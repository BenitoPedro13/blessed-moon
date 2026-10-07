# TASK: LinkedIn setup checklist, intro post and profile images

## 1. Current scenario

`/linkedin-plan` holds the profile texts (headline, About, link, Featured, company
tagline/website) and the 14 post drafts. It has no ordered setup steps, no
introduction post before week 1, and no profile images. A chat answer on
7 October 2026 listed what was missing; Benito asked for it on the page, so it
doesn't live only in a conversation. The Instagram launch trio and teaser Story
don't carry over: LinkedIn has no profile grid and no Stories.

## 2. Planned changes

- `src/lib/social-plan.ts`: `LINKEDIN_INTRO` (one text post, posted before week 1,
  no link, attach a real photo) and `LINKEDIN_SETUP`, the ordered checklist in
  four phases: images → personal profile → company page → launch day, then the
  rules for every post. Steps that reuse a text from `PROFILES` point at it
  rather than repeating it.
- `src/components/social/setup-checklist.tsx` (new): renders the phases as a
  numbered list, the intro post with its character count, and download links
  for the images. Server component, no interactive state (a ticked box would
  need storage and isn't worth it for a one-time setup).
- `src/app/linkedin-plan/[asset]/route.tsx` (new): `next/og` PNGs, statically
  generated: `banner.png` (1584×396, personal profile; left side kept clear
  for the photo), `cover.png` (4200×700, company page; centred, away from the
  logo overlap), `logo.png` (400×400). Same fonts and mark as
  `opengraph-image.tsx`. Any other asset name 404s.
- `src/app/linkedin-plan/page.tsx`: new section 02 "Set it up, in this order"
  ahead of the profile texts; later sections renumber.
- `src/app/system/page.tsx`: a panel for the new component.
- `scripts/check-social-strategy.mjs`: the checklist renders and the three
  images return PNGs at their sizes.

Research (7 October 2026): document posts are LinkedIn's strongest format;
external links in the post text cut reach (≈60% per third-party analyses), and
moving the link to the first comment is no longer a reliable workaround; the
Service Page's profile-vs-company placement can't be changed later; the profile
website button needs Premium Business. Third-party figures are directional, not
measured on this account.

## 3. Why

The setup is done once, in order, and some steps can't be undone. A checklist
on the page survives the conversation; generated images stay in sync with the
logo and palette instead of being exported by hand.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/social-plan.ts` | edit | `LINKEDIN_INTRO`, `LINKEDIN_SETUP` |
| `src/components/social/setup-checklist.tsx` | new | Ordered setup, intro post, image links |
| `src/app/linkedin-plan/[asset]/route.tsx` | new | Banner, cover, logo PNGs |
| `src/app/linkedin-plan/page.tsx` | edit | New section 02 |
| `src/app/system/page.tsx` | edit | Component panel |
| `scripts/check-social-strategy.mjs` | edit | Checklist and image checks |

## 5. Validation

Implemented. Adjusted to Benito's current profile (screenshot, 7 October):
headline/role "CEO & CTO" → Founder, skills curated rather than added (59
exist), company logo already set. ESLint, `tsc` and `pnpm build` pass; the three
images prerender as 1584×396, 4200×700 and 400×400 PNGs. `pnpm check:enquiry`
(which runs the social strategy checks, now including the checklist, intro post
and image sizes) passes. Checklist viewed at 1280px and 390px with no overflow.
