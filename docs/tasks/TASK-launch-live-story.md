# TASK: "No ar" launch Story (video)

7 October 2026. Status: complete. Follows `TASK-launch-teaser-story.md`.

## 1. Current scenario

The Portuguese launch trio is exported and going up tonight on `@blessedmoon.studio` (Benito
confirmed the handle: the Portuguese posts run on the main account, not a separate
`@blessedmoon.br`). Yesterday's teaser said "Amanhã, três posts." Nothing says they're out.
Benito asked for a Story video announcing the posts are live.

## 2. Planned changes

- `src/lib/social-plan.ts`: a second `STORY_FRAMES` entry, `no-ar`, and a `STORY_SCHEDULE`
  step for it between the third post and the native shares. The shares stay: a feed post
  shared to Stories is tappable, a video isn't, so the video opens the sequence and the
  shares carry people to the carousels.
- `src/lib/social-posts.ts`: the frame's one slide, the teaser's cover with the moon,
  answering it ("Amanhã, três posts." / "Blessed Moon no ar." → "No ar." / "Três posts no perfil."), so the two read as a pair.
- No script change: `pnpm social:story-video no-ar` renders it with the cached moon frames.

Rejected for tonight: a video that shows the three covers in sequence. It needs a new
template and animation path in the script; the native shares already show the covers.

## 3. Why

Friends who saw the teaser get the follow-up; those who tapped "lembrar" already got a
notification, and this reaches everyone else. Cost is data only.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/social-plan.ts` | edit | `no-ar` frame, schedule step |
| `src/lib/social-posts.ts` | edit | The frame's slide |
| `scripts/check-social-strategy.mjs` | edit | Six Story steps, two frame previews |
| `docs/tasks/TASK-launch-live-story.md` | new | This document |
