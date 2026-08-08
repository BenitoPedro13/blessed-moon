# Design Handoff: Blessed Moon Studio — Website (ASCII/TUI direction)

> This is the original design handoff from Claude Design, preserved as historical source of
> truth for *why* the site looks the way it does. See `CLAUDE.md` for the current
> implementation process, and the root `README.md` for setup/dev commands.

## Overview
Marketing site for Blessed Moon Studio, a web design/dev agency. Aesthetic: dark, terminal/TUI-inspired, ASCII-texture backgrounds, amber (#ff6a1f) accent on near-black. Direction chosen: **1c — Full-bleed ASCII canvas**, homepage + Work, About, Contact subpages.

## About the Design Files
The included `.dc.html` file and screenshots are **design references**, not production code. They were built as static HTML/CSS wireframes to communicate structure, hierarchy, and content — not meant to be copied verbatim. Recreate this design in the target repo: **Next.js + Tailwind + shadcn**, using shadcn's component primitives (Button, Input, Textarea, Card, Select) restyled to match the tokens below, plus a custom WebGL/canvas ASCII-shader layer for the atmosphere effect described under Interactions (see References).

## Fidelity
**Low-fidelity (wireframe).** Layout, structure, section order, and copy are final; exact colors/type below are a starting palette (from the brand brief), not a locked visual system. Apply shadcn's default styling conventions (radii, shadows, focus rings) on top of these tokens rather than trying to pixel-match the HTML.

## Screens / Views

### 1. Homepage (`screenshots/homepage-1c.png`)
- **Nav**: fixed top bar, logo mark left (`>|<` placeholder — real mark is the circuit-moon logo), 5-dot menu indicator, "MENU" label right. Swap for a real nav (Work, Services, Pricing, About, Contact + "Book a call" button) once past wireframe stage.
- **Hero**: full-bleed ASCII/particle canvas background, centered oversized headline "CLARITY IS THE FEATURE." in amber, small corner labels (B / S / M / 26) at the four corners.
- **About teaser**: section number label ("01 / ABOUT"), heading "Built to last longer than the brief.", one paragraph of body copy, ASCII texture continues faintly behind.
- **Services**: "02 / SERVICES", 4-column x 2-row grid of 8 cards — Web Apps, Mobile Apps, Landing Pages, Websites, Design Systems, Branding, E-Commerces, Dashboards. Each card: small index label + service name.
- **How We Work**: "03 / HOW WE WORK", 4-column row, each column: large number (01–04) + one line: "Understand before building" / "Design the system, then the screen" / "Build in reviewable slices" / "Ship it and keep it alive".
- **Selected Work**: "04 / SELECTED WORK", stacked rows, each: visual placeholder (left) + project name + one-line description. Projects: markado, Bee Dash, suamesafit (copy in Files section below).
- **Pricing**: "05 / PRICING", simple rows: Landing Page/Website, Web App/Dashboard, Full product build — each with "range confirmed on call" (no fixed numbers, project-based pricing).
- **Footer**: nav links repeated + copyright line.

### 2. Work — case studies (`screenshots/work-1d.png`)
List of the 3 projects, each with larger visual placeholder, full description, tag chips, and "View case study →" link. Ends in a "Book a call" CTA band.

### 3. About (`screenshots/about-1e.png`)
Mission statement + values chips (Clarity, Craft, Integrity, Quiet confidence, Long-term thinking, Respect for attention and time). Below: two-pillar structure —
- **Pillar A** — Client Consultation, Strategy & Brand Identity, Executive Lead M D R, mandate paragraph.
- **Pillar B** — Enterprise Architecture & Full-Stack Development, Executive Lead Benito Pedro Xavier, mandate paragraph.
- **Why Choose Our Dynamic** section below both pillars (see exact copy in the HTML file).
Ends in "Book a call" CTA band.

### 4. Contact (`screenshots/contact-1f.png`)
Two columns: left = form (Name, Email, Company, Project type select, Message textarea, Send button); right = scheduling embed placeholder + email address + social tag chips.

## Interactions & Behavior
- **ASCII/canvas background**: a full-bleed WebGL ASCII-shader layer over the page (see the offscreencanvas.com references below), which morphs as the user scrolls: hero mesh → crescent-moon glyph entering About → circuit-board lines entering Services → screenshot silhouette entering Work → dissolves to plain dark at Contact. Treat each numbered section label (01/, 02/, …) as a scroll-triggered keyframe index driving the effect.
- Nav is fixed/sticky; "Book a call" button always visible.
- No other custom interactions specified at this stage — standard hover states on buttons/links/cards (subtle brightness or border-color shift, no drop shadows).

## State Management
None required beyond the contact form (controlled inputs, submit state) and scroll position driving the canvas effect keyframe.

## Design Tokens
- **Background**: `#050505` (near-black)
- **Text primary**: `#e9e7e1` / `#eeeeee`
- **Text secondary**: `rgba(255,255,255,.4–.55)`
- **Accent (amber)**: `#ff6a1f` (hover/lighter: `#ff9760`)
- **Borders/rules**: `rgba(255,255,255,.08–.2)`, 1px
- **Fonts**: `JetBrains Mono` (labels, nav, numbers, mono UI) + `Space Grotesk` (headings, body emphasis); body copy can fall back to system sans
- **Type scale**: hero H1 ~56px / section H2 ~26–32px / body ~12–14px / labels ~9.5–10.5px uppercase, letter-spacing ~0.5–1.6px
- **Spacing**: section padding ~52px vertical / 28px horizontal; 1px hairline rules between sections
- **Radius**: none in the wireframe (sharp corners throughout) — intentional, keep corners sharp per the TUI aesthetic

These tokens are already wired into `src/app/globals.css` (shadcn's `.dark` theme block) — see `CLAUDE.md` §0 for the implementation status.

## Assets
No final assets yet. Visual placeholders (`[ visual ]`, `[ portrait ]`, `[ case study visual ]`) mark where real screenshots/photography go. The real brand mark is a circuit-moon logo (not built here — wireframes use a text placeholder).

## Files
- `design/wireframes.dc.html` — full wireframe file (all explored options; homepage direction **1c**, subpages **1d/1e/1f** are the ones selected for this handoff — other lettered options in the file are earlier alternatives, ignore them)
- `design/screenshots/homepage-1c.png`, `work-1d.png`, `about-1e.png`, `contact-1f.png` — static captures of the selected screens

## References
These are the sources the direction was built from — go back to them when implementing, don't just copy the wireframe pixels:
- **ASCII shader look** — [offscreencanvas.com/issues/webgl-ascii#site-wide-ascii](https://offscreencanvas.com/issues/webgl-ascii#site-wide-ascii): the site-wide WebGL ASCII rendering treatment the hero/section backgrounds are meant to achieve.
- **Scroll-driven morph** — [offscreencanvas.com/issues/webgl-scrolling-animations#particle-morph-on-scroll](https://offscreencanvas.com/issues/webgl-scrolling-animations#particle-morph-on-scroll): the technique for morphing the ASCII/particle field as the user scrolls between sections (see Interactions above).
- **Component system & layout density** — [canvasui.dev](https://canvasui.dev) and the Agno marketing site: reference for building the content-heavy sections (Services grid, How We Work, Pricing) out of restyled shadcn primitives rather than bespoke markup.
- **Numbered-section / ASCII-hero structural precedent** — the Dragonfly site: the `01 / ABOUT`, `04 / PORTFOLIO`-style section numbering with a large ASCII hero glyph is the direct precedent for this site's section labels and hero treatment.
