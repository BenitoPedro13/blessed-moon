# Visual planning and post production

Updated 5 October 2026 in Blessed Moon. This extends the existing researched
strategy; it does not change the proposed service scope or public custom pricing.

## Review the pages

- `/instagram-plan`: the English profile setup (name, bio, link, pins, highlights), grid study and 14 English
  briefs, then the same for the Portuguese
  grid study and 8 Portuguese briefs. Each brief previews every authored slide,
  downloads PNG/ZIP and opens directly in the builder.
- `/linkedin-plan`: a nine-cover visual-series board, explicitly not a LinkedIn
  profile layout. Each English story previews the same carousel as square pages
  and offers PNG/ZIP/PDF (post the PDF as a document) and the same edit link.
- `/social-plan`: proposed pillar mix and weekly publishing workload charts. These
  are planning assumptions, not observed account performance.
- `/analytics-plan`: eight blank weeks for tagged visits, qualified enquiries and
  production hours. Select a metric to plot it. Blank means unknown; zero means
  observed none. Lines join adjacent recorded weeks only. Export SVG and save or
  restore observations JSON. Week numbers are relative to your actual launch.
- `/post-builder`: edit the existing research draft or load a blank starting point.
  `/post-builder?story=markado-slot&channel=linkedin` opens that story as a square
  LinkedIn document; starting points are labelled EN or PT. Changing channel preserves your words; loading
  a starting point replaces the draft, so save its JSON first.
- `/system`: specimens for covers, post cards/previews, shared artwork, the builder,
  planning charts and the measurement worksheet.

## Story frames and video

Instagram Stories live in `STORY_FRAMES` (`src/lib/social-plan.ts`), apart from the feed
posts in `STORIES`. The builder lists them as `PT · Story · …` starting points, at 1080×1920.
The cover's body runs full width on a Story when it ends above the art. For an animated
version, run `SOCIAL_URL=http://localhost:3000 pnpm social:story-video teaser-lancamento`
against a running server. It takes the builder's own SVG, types the copy in with a block
cursor, raises the moon, and writes `out/social/<id>.mp4` (9s, 30fps, H.264) plus the
final frame as a PNG. Leave the empty lower left for the countdown sticker. `/instagram-plan` lists the launch's
Story sequence (`STORY_SCHEDULE`) apart from the grid. See
`docs/tasks/TASK-launch-teaser-story.md`.

## Build a post

1. Open a draft from its channel brief, or choose a starting point in the builder.
2. Choose portrait (1080×1350), square (1080×1080), landscape (1200×627) or Story
   (1080×1920). Story reserves space for platform controls and a link sticker.
3. Edit each slide's eyebrow, title, amber accent line, body and footer (default
   `@blessedmoon.studio`). Choose Cover, Point, Rows, Comparison, Screenshot in window, Annotated screenshot or Closing action. Rows and comparisons take one line each as `label | detail | value`.
   Covers and closing actions take a crescent or the moon (a capture of the site's own ASCII moon); screenshot templates
   take a window label (`~/work/oishi`); a Point can lead with a step numeral (only
   for a real sequence, with its eyebrow above it, e.g. "Question 3"); Rows can be
   numbered so later slides can refer back to them; an annotated screenshot takes
   callout regions, one `x, y, width, height` per line in percent of the window. The
   screen dims outside the regions, and each region gets an amber outline and a
   numbered tab. Select dark, warm paper or amber
   artwork. Add, duplicate, remove or reorder up to ten slides. The right-hand
   artwork is the export's artwork.
4. Add an approved local PNG, JPEG or WebP screenshot if useful. Files are limited
   to 8 MB, reduced to a maximum 1600-pixel edge and cropped from the top into the
   terminal window.
   You can also select an existing portfolio screenshot preset; exports embed it.
   Describe any screenshot in alt text; titles and screenshot descriptions are
   required for image exports. Review the crop and legibility.
5. Edit/copy the caption. The researched campaign destination remains beside it
   when the draft identifies an existing story. Paste the proper URL in the actual
   social post or link sticker; a footer written inside an image is not clickable.
6. Download the selected PNG, full numbered ZIP or PDF. ZIP includes `01.png` etc.,
   `caption.txt`, `alt-text.txt` and `editable-draft.json`. PDF has one JPEG artwork
   per page; it is an image document, not an accessible text PDF. Use the supplied
   caption/alt descriptions when posting.
7. Save editable JSON before leaving or reloading. Restore it to continue editing.
   The worksheet has a separate observations JSON file.

Edits and screenshots are held in the current tab/downloaded files. There is no
cloud draft library, scheduling, account connection or publishing action. The
generator is template based; it does not call paid AI text/image APIs or produce
MP4 footage. Those are possible separate additions if the workflow later needs them.
Research facts, project permissions and final wording still need Benito's review.

## Implementation and privacy

`social-posts.ts` holds each story's authored slides; `social-art.ts` defines presets, validation and one SVG renderer
(`TASK-social-art-foundations.md`, `TASK-social-art-signatures.md`). `SlideArt` uses it
on the page; `social-export.ts` rasterizes that same SVG with a local canvas. SVG
strings escape text, imported pictures must be local raster data URIs or an exact portfolio asset path from
`src/lib/social-art-images.json`, callout regions are
up to six `x, y, w, h` sets (or legacy `x, y` points) between 0 and 100, and draft
fields, slide count and embedded image sizes are capped. JSON import has a 12 MB
file limit; combined screenshot strings are limited to 10 million characters.
The art is set in the site's Space Grotesk and JetBrains Mono. `pnpm social:fonts`
vendors their OFL woff2 files (from `@fontsource/*`) into `public/fonts/social/` and
generates the advance widths the text wrapper measures with
(`src/lib/social-font-metrics.ts`). The preview loads them by same-origin URL; an
export fetches them once and embeds them as data URIs, because an SVG drawn
through an image cannot fetch fonts (checked in Chromium and WebKit). Neither
packaged subset has `→`, so arrows are drawn. `pnpm social:moon` re-captures `public/social/moon.png` from the real AsciiObject on `/system` (needs a running server); exports embed it like the fonts.

The only new dependency is fflate 0.8.3, dynamically imported for ZIP downloads.
The browser-safe JPEG-to-PDF helper was reused from Unimeet. No files in Unimeet
were modified; Payload authentication/media infrastructure was not introduced.

Planning routes and builder are URL-accessible, noindex and absent from the global
menu/sitemap. This is not an authenticated client portal. The generator itself has
no upload/save endpoint or custom analytics event containing draft data. Editable
builder and measurement roots include `rr-block`, the [rrweb default blocking
class](https://rrweb.com/docs/guide). The [official Umami recorder source](https://github.com/umami-software/umami/blob/master/src/recorder/index.js)
uses rrweb without overriding that class. This excludes the editable DOM from
replay under that integration; real production recorder version/settings and
ingestion have not been tested. Existing site tracking can still record visits.

## Verification

`scripts/check-post-builder.mjs` exercises navigation, editing and preview parity,
PNG dimensions/artwork, ZIP filenames and caption/alt/JSON content, PDF page count,
JSON round trips, slide operations, local pictures and alt requirements, all four
formats, escaped text, invalid remote-image imports, long-copy bounds and mobile
overflow at 320/390/1440 pixels. It also checks empty observations, measured zeroes,
missing-week gaps, independent hour scales, JSON restore, SVG export, replay-block
markup, noindex and sitemap exclusion. The existing strategy browser script checks
the public offer/contact/morph flows for regressions.

Both browser scripts and the production build/TypeScript pass. Lint has zero
errors and the two existing boot-sequence dependency warnings. The pinned-panel
regression now waits at the actual morph centre rather than the navigation-offset
handoff; its clipping assertion is retained. macOS sips also rendered the exported
PDF successfully, and representative artwork was visually inspected.

Artifacts are in `/private/tmp/blessed-moon-post-review-2026-10-04/`: representative
artwork, editor/measurement screenshots and actual PNG/ZIP/PDF/JSON/SVG downloads.
The review server is `http://localhost:3194`. Optional analytics is disabled through
empty process values at build and start, without changing environment files. This
work includes a local commit only, with no push, deployment or social publication.

The [Instagram audit](11-instagram-corpus-audit.md) now grounds the suggestions in
356 covers and 59 full captions, with selected carousel observations. Raw competitor
media is local research; previews show original Blessed Moon artwork and its own
portfolio screenshots. Research coverage bars count records, not performance.
