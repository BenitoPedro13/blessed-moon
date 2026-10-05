# TASK: a share card for /services/social-media

5 October 2026. Status: complete (built and verified locally; goes live on the next deploy).

## 1. Current scenario

Benito is adding `/services/social-media` to his LinkedIn Featured section, and the link has
no thumbnail. The page's `metadata.openGraph` (title, description, url) sets no `images`, and
setting `openGraph` replaces the parent's, so the root `opengraph-image.tsx` card isn't
inherited either. Production confirms it: the page serves no `og:image`. The case pages
don't have this problem; they use their cover screenshot.

## 2. Planned changes

- New `src/app/services/social-media/opengraph-image.tsx` (1200×630, `next/og`), in the root
  card's language: the pixel crescent at the left, "Social Media Strategy & Content Planning"
  in Space Grotesk, "The plan before the posts." in amber JetBrains Mono, and the studio name
  in small mono. Fonts load the way the root card does (`lib/og-fonts.ts`).
- The file convention adds `og:image` to the page automatically, so the metadata object
  doesn't change.

## 3. Why

Featured links, shared posts and messages all show this card; without it the service link
looks broken next to the case-study links.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/app/services/social-media/opengraph-image.tsx` | new | The card |

## 5. Verification

- Build passes; `/services/social-media` serves an `og:image` and the image renders at
  1200×630 (checked by eye).
- After deploy, LinkedIn's Post Inspector refreshes its cached preview.
