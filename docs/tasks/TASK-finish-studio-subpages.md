# TASK: Finish studio subpages and cross-route experience

**Status: in progress after user review.** The route shell, Work index, About, and Contact layouts
are implemented. User review correctly rejected reusing personal portfolio contact channels,
required a dedicated presentation page for each project, and identified real project screenshots
already present in the portfolio worktree. This task now includes removing every personal contact
detail, adding environment-configurable agency channels with an honest no-channel fallback,
shipping `/work/[slug]` case-study pages, and presenting the verified screenshots for all three
selected projects.

## 1. Current scenario

The homepage, brand system, ASCII moon, sound, boot sequence, SEO assets, and shared navigation/footer are built. The design handoff still requires `/work`, `/about`, and `/contact`. The sitemap intentionally lists only `/` until those routes ship.

The current navigation hides all route links on small screens, and its Services/Pricing fragment links are relative to the current pathname, so they do not return to homepage sections from a subpage. The fixed ASCII canvas measures homepage section markers only on its first mount; because the root layout persists during App Router navigation, it can retain stale keyframe boundaries after moving between routes.

The portfolio repository contains the authoritative project details and screenshot galleries for Markado, Bee Dash, and Sua Mesa Fit. Personal email, social, and booking data must not appear on this agency site. Real screenshots are the primary project presentation; generated-in-code terminal visuals remain supporting diagrams only.

## 2. Planned changes

- Add a shared studio data module for the three selected projects, adapted from the portfolio repository while preserving the wireframe's project order and plain-English summaries.
- Add a shared subpage hero and CTA treatment that extends the terminal/TUI system without duplicating page scaffolding.
- Build `/work` with three substantial case-study rows, project metadata, technical tags, outcome summaries, real portfolio cover screenshots, and links to dedicated internal case-study pages.
- Build `/work/[slug]` for Markado, Bee Dash, and Sua Mesa Fit with the problem, approach, shipped outcome, process, architecture, features, challenges, stack, a full screenshot gallery, and verified external source/live links.
- Build `/about` with the final mission copy, the six required value chips, the exact two-pillar structure and executive leads, the exact "Why Choose Our Dynamic" copy, and the closing call-to-action.
- Build `/contact` with the required Name, Email, Company, Project type, and Message fields. Use the existing shadcn Input, Select, Textarea, and Button primitives. Agency email and booking channels come only from environment variables. While they are not provisioned, the form copies a structured project brief to the clipboard and the page clearly labels agency channels as pending instead of exposing personal details or pretending delivery succeeded.
- Add per-route static metadata and include all shipped routes in the sitemap.
- Make Services/Pricing links route-safe (`/#services`, `/#pricing`) and add an accessible small-screen menu.
- Make the ASCII canvas remeasure section keyframes on pathname changes, then assign sensible `data-ascii-keyframe` markers across each new route.
- Add baseline global behavior for smooth anchor navigation, selection color, and reduced-motion handling while preserving the dark-only, zero-radius design contract.
- Update README and CLAUDE.md implementation status after validation.

Alternatives considered and rejected:

- A backend contact endpoint is not introduced because no agency address, email provider, or delivery credential exists yet. The fallback preserves the visitor's brief on their clipboard without leaking personal channels or losing their writing.
- Project screenshots are copied from the portfolio's `worktree-figma-bee-dash-assets` branch where the content records explicitly map each image to a project and provide descriptive alt text.

## 3. Why

This completes every route named in the source-of-truth handoff and closes the navigation, responsive, SEO, and canvas lifecycle gaps that would otherwise make the site feel unfinished once those routes exist. Reusing verified portfolio facts avoids invented client claims while allowing the studio site to present the same work in its own concise voice.

The implementation keeps the site's memorable element concentrated in the existing ASCII moon. Subpages remain quiet, precise, and content-led, using terminal schematics and hairline structure rather than adding competing visual effects.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `docs/tasks/TASK-finish-studio-subpages.md` | new | Work plan and completion record |
| `src/lib/studio-data.ts` | new | Selected project and contact data sourced from portfolio |
| `src/components/page-hero.tsx` | new | Shared subpage heading treatment |
| `src/components/page-cta.tsx` | new | Shared closing CTA band |
| `src/components/project-visual.tsx` | new | Project-specific schematic visuals |
| `src/components/project-media.tsx` | new | Optimized project cover and screenshot gallery presentation |
| `src/components/contact-form.tsx` | new | Agency-configurable email flow with honest clipboard fallback |
| `src/app/work/page.tsx` | new | Selected work / case-study route |
| `src/app/work/[slug]/page.tsx` | new | Dedicated static case-study pages for all selected projects |
| `src/app/about/page.tsx` | new | Mission, values, and studio structure route |
| `src/app/contact/page.tsx` | new | Project form and scheduling/contact route |
| `.env.example` | new | Agency contact and booking configuration contract |
| `public/projects/{markado,bee-dash,sua-mesa-fit}/*` | new | Verified project screenshots copied from the portfolio |
| `src/components/site-nav.tsx` | modify | Route-safe links and mobile navigation |
| `src/components/site-footer.tsx` | modify | Route-safe homepage section links |
| `src/components/ascii-canvas.tsx` | modify | Remeasure on pathname changes |
| `src/app/layout.tsx` | modify | Declare intentional smooth-scroll behavior for Next.js navigation |
| `src/app/sitemap.ts` | modify | Add `/work`, `/about`, `/contact` |
| `src/app/globals.css` | modify | Anchor, selection, and reduced-motion baseline |
| `package.json` | modify | Replace the temporary scaffold package name |
| `README.md` | modify | Mark routes complete and document contact behavior |
| `CLAUDE.md` | modify | Update implementation status and next-step guidance |
