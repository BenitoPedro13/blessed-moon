# TASK: Launch teaser Story (still + animated)

6 October 2026. Status: complete (with addendum 6.1). Follows `TASK-pt-launch-posts.md`.

## 1. Current scenario

The Portuguese launch trio (`apresentacao`, `unimeet-feiras`, `o-que-eu-faco`) is ready for
tomorrow. Friends already follow the account. Benito wants an Instagram Story today saying
that the three posts go up tomorrow, and wants to compare a still Story with an animated one.

The post builder can already render a Story (1080×1920), but its starting points are only
the feed carousels in `STORIES`. There is no way to make video.

## 2. Planned changes

- `src/lib/social-plan.ts`: a separate `STORY_FRAMES` list (Instagram Stories, not feed
  posts) with one entry, `teaser-lancamento`. Kept out of `STORIES` on purpose: the grid
  previews, plan week list, profile pins and the check script's post counts all read
  `STORIES`, and a Story is not a grid post.
- `src/lib/social-posts.ts`: the teaser's one authored slide: a cover on the dark surface
  with the site's moon. "Amanhã, três posts." / "Blessed Moon no ar." and the three subjects.
  No time in the art: the countdown sticker carries it, and Benito hasn't chosen one.
- `src/lib/social-art.ts`: `framePost()` builds an Instagram post in the `story` format from
  a frame.
- `src/components/social/post-builder.tsx`, `src/app/post-builder/page.tsx`: frames appear
  in the starting-point list (`PT · Story · …`) and open by `?story=teaser-lancamento`.
- `scripts/social-story-video.mjs` (new): opens the builder on a running server, takes the
  Story's SVG, which `renderSlideSvg` already draws, and animates it frame by frame: the
  logo, the eyebrow typed in mono with a block cursor, the headline lines typed in, the moon
  rising. Each frame is set deterministically from time `t` and screenshotted, then encoded
  with ffmpeg to H.264 MP4 (1080×1920, 30fps, yuv420p, about 9s). It writes the last frame as
  a PNG too. Output goes to `out/social/` (gitignored). The video animates the
  same art rather than redrawing it, so `social-art.ts` stays the single source.

Rejected: animating the real 3D moon (capturing the WebGL engine in real time under
swiftshader gives uneven frames). Could come later if the video works.

## 3. Why

A Story with a countdown sticker gives friends a reminder they chose, for tomorrow's launch.
Benito wants to compare a still with motion before choosing.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/social-plan.ts` | edit | `StoryFrame` type, `STORY_FRAMES` |
| `src/lib/social-posts.ts` | edit | Teaser slide |
| `src/lib/social-art.ts` | edit | `framePost()` |
| `src/components/social/post-builder.tsx` | edit | Frames as starting points |
| `src/app/post-builder/page.tsx` | edit | `?story=` resolves frames |
| `scripts/social-story-video.mjs` | new | Animated MP4 + still PNG |
| `src/lib/social-art.ts` (cover) | edit | On a Story, the body runs full width when it ends above the art (it wrapped into a 212px column beside the moon). Feed covers unchanged |
| `CLAUDE.md` | edit | Story frames rule |
| `package.json` | edit | `social:story-video` script |
| `docs/social/09-production-workspace.md` | edit | Story frames and video export |
| `scripts/assets/keyboard/` | new | CC0 keypresses (6.3) |
| `README.md` | edit | Keypress credit |

## 5. Verification

- `pnpm lint`, `pnpm build`, `scripts/check-post-builder.mjs`, `check-social-strategy.mjs`.
- Look at the still and sample frames from the video. Leave room for the countdown sticker.

## 6.1 Addendum: Stories on `/instagram-plan`

Benito expected the teaser on the Instagram plan. It stays out of the grid, but the plan gains
a **Stories** section after the Portuguese briefs (the closing section renumbers 06 → 07):

- `src/lib/social-plan.ts`: `STORY_SCHEDULE`, the launch's Story sequence in order. The teaser
  on the day before (countdown sticker), then on launch day the three carousels published in
  reverse grid order (`o-que-eu-faco`, `unimeet-feiras`, `apresentacao` last, so it lands
  top-left), each shared to Stories once it's live. Steps point at a `STORY_FRAMES` id (has
  art) or a `STORIES` id (shared from the feed, so no art is authored for it).
- `src/app/instagram-plan/page.tsx`: the section renders the steps, with the teaser's
  preview, an "Open in builder" link and the video command.
- `scripts/check-social-strategy.mjs`: asserts the section renders the teaser preview.

## 6.2 Addendum: typing sound

A friend's suggestion, which Benito took: keystroke sound under the typing. The script records how many
characters each frame adds and mixes the site's own `public/sounds/click.ogg` (Kenney, CC0,
already credited in the README) once per character, with seeded ±pitch/level variation, into
a mono 48kHz track muxed as AAC. Clicks run 1.0–5.6s; the hold after typing is silent, so
Instagram music can be laid over it. `scripts/social-story-video.mjs` only.

## 6.3 Addendum: human typing, real keys, a moving moon

Benito's feedback on 6.2: the clicks sounded like a machine gun; then: use a real keyboard sound,
and make the moon move like the site's, at a slow rhythm that doesn't pull focus from the copy.

- Typing follows a seeded human schedule: ~9 keys/s with uneven gaps, a beat after spaces, a
  pause after punctuation and between lines. Only the headline is typed; the body fades in.
  The video is 11s so the finished frame still holds.
- Sound: 32 single keypresses from "Keyboard Soundpack #1" (unicaegames, CC0), mono WAVs in
  `scripts/assets/keyboard/` (772KB, used only by the script). Each is levelled to one peak;
  the six fullest are the space bar; no letter key repeats twice in a row.
- Moon: /system's AsciiObject specimen captured frame by frame on the GPU (ANGLE/Metal; the
  software renderer `social:moon` uses was far slower). Timing is held by a requestAnimationFrame
  scheduler injected before load: once switched on, frames advance only on `__step`, one
  fixed step per video frame (turntable ~3°/s, float and wobble at 0.3×). Playwright's fake
  clock was tried first and did not hold the engine: the moon ran in real time during slow
  screenshots and turned whole faces in 11s (Benito: "even faster"). Verified: held still
  through 1.5s of real time, moves only when stepped; 330 unique frames, even change per
  frame. Frames are page clips taken after scrolling the grown box fully into view (an
  earlier clip cut the moon's top). Cached per fps/speed in `out/social/`.
- Rejected: an ambient music bed, because Instagram's own music would clash with it.
