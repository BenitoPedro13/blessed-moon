export type ProjectVisualVariant =
  | "calendar"
  | "analytics"
  | "commerce"
  | "realestate"
  | "portfolio"
  | "geospatial"
  | "eyewear"
  | "furniture"
  | "rodizio"
  | "fairs"
  | "language"
  | "grid"
  | "election"
  | "lesson";

type ProjectStep = {
  phase: string;
  title: string;
  body: string;
};

type ProjectDetail = {
  title: string;
  body: string;
};

type ArchitectureLayer = {
  layer: string;
  label: string;
  detail: string;
};

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Curated filter facet for `/work`'s index. `tags` are descriptive and
 * uneven ("Motion" / "Motion Design"), so they aren't filtered on. */
export type ProjectCategory = "product" | "data" | "sites";

export const PROJECT_CATEGORIES: readonly { value: ProjectCategory; label: string }[] = [
  { value: "product", label: "Product & SaaS" },
  { value: "data", label: "Data & dashboards" },
  { value: "sites", label: "Sites & commerce" },
];

export type StudioProject = {
  slug: string;
  title: string;
  tagline: string;
  index: string;
  year: string;
  role: string;
  timeline: string;
  team: string;
  description: string;
  problem: string;
  approach: string;
  outcome: string;
  tags: readonly string[];
  category: ProjectCategory;
  stack: readonly string[];
  visual: ProjectVisualVariant;
  cover: ProjectImage;
  screenshots: readonly ProjectImage[];
  process: readonly ProjectStep[];
  architecture: readonly ArchitectureLayer[];
  features: readonly ProjectDetail[];
  challenges: readonly ProjectDetail[];
  links: readonly { label: string; href: string }[];
};

export const STUDIO_PROJECTS: readonly StudioProject[] = [
  {
    slug: "apuracao-2026",
    title: "Apuração 2026",
    tagline: "Brazil's election night, recorded file by file so the count can be replayed",
    index: "15",
    year: "2026",
    role: "Architecture, data engineering and front-end",
    timeline: "Ongoing — 1st round live, 2nd round 25 October",
    team: "Solo delivery",
    description:
      "A live vote-count dashboard for Brazil's 2026 elections, built on the TSE's official signed results feed, with a recorder that keeps every version of every file and a static site that never touches the backend.",
    problem:
      "The TSE publishes the count as signed files on a CDN that overwrites them every minute; once the night is over, the history is gone. A dashboard on election night also has to survive a viral spike unattended, and every number on it has to be checkable against the official source rather than trusted.",
    approach:
      "A recorder on Fargate polls the feed under a self-imposed ceiling of 100 requests a second, keeps each signed file byte for byte in an Object-Lock bucket addressed by its hash, and holds a lease in S3 so two recorders can't both write. A projector folds that log into immutable views with a pure function, so the published data can be rebuilt from scratch at any time. Readers only ever hit static files behind a CDN. A fake TSE replays the captured 1st round at twenty times speed for end-to-end rehearsals.",
    outcome:
      "The recorder has been live on AWS since 8 October and captured the 1st round. The site shows president and governor results with a municipality map, a legislative archive with hemicycles, and an archive of every presidential election since 1994, municipality by municipality, organised as questions. The 2nd round is recorded live on 25 October.",
    category: "data",
    tags: ["Data Engineering", "Dashboard", "AWS"],
    stack: ["TypeScript", "Next.js", "AWS CDK", "ECS Fargate", "S3", "CloudFront", "TanStack Query", "Turborepo"],
    visual: "election",
    cover: {
      src: "/projects/apuracao-2026/presidente.png",
      alt: "Apuração 2026 president view: headline result, a municipality map of Brazil and results by region",
      width: 1440,
      height: 900,
    },
    screenshots: [
      { src: "/projects/apuracao-2026/presidente.png", alt: "President, 1st round final: headline, municipality choropleth with state labels, results by region", width: 1440, height: 900 },
      { src: "/projects/apuracao-2026/governadores.png", alt: "Governors: a tile per state, the closest races, a map by state and the selected race's detail", width: 1440, height: 900 },
      { src: "/projects/apuracao-2026/historico.png", alt: "Presidential elections 1994–2022 as questions: how your town voted, who won each election", width: 1440, height: 900 },
    ],
    process: [
      { phase: "01", title: "Read the feed before designing", body: "How the TSE's files are signed, cached and replaced was measured and written up first; capacity numbers came from those measurements, not guesses." },
      { phase: "02", title: "Record first", body: "The recorder went live on AWS days before the 1st round, so the night was captured even before the site was finished." },
      { phase: "03", title: "Rehearse on the real night", body: "The captured round replays through a fake TSE with the CDN's caching semantics, recorder and projector included, at twenty times speed." },
      { phase: "04", title: "Answer questions, not tables", body: "The 1994–2022 archive is organised as questions a reader actually asks, with every calculated number marked as ours and explained on hover." },
    ],
    architecture: [
      { layer: "Ingest", label: "Recorder on Fargate", detail: "Conditional requests under a rate ceiling; an unchanged cycle costs about one request a second." },
      { layer: "Log", label: "S3 with Object Lock", detail: "Every signed version stored by hash, retained; the source of truth for everything downstream." },
      { layer: "Views", label: "Projector, a pure fold", detail: "Immutable published views, rebuildable from the raw log with one command." },
      { layer: "Web", label: "Next.js static export", detail: "Served from S3 behind a CDN; a spike can't reach ingestion and a stall can't take the site down." },
    ],
    features: [
      { title: "Provably faithful", body: "Every number traces to a TSE-signed file that was stored, and anyone can check the signature." },
      { title: "No projections", body: "No forecasts, no calls and no interpolation between observed versions; a gap in the record is shown as a gap." },
      { title: "Ours versus theirs", body: "Percentages are the TSE's own; anything calculated here is underlined and explains itself." },
    ],
    challenges: [
      { title: "History the source deletes", body: "The TSE keeps only the latest state of each file, so the minute-by-minute count exists only if it was recorded while it happened." },
      { title: "A rehearsal signed with a fake key", body: "Replayed files need valid signatures; they're signed with a throwaway key that the recorder and projector refuse to accept against a production bucket." },
      { title: "Archive files that change underneath you", body: "The TSE regenerated a 2022 archive with its rows reordered, so content identity was redefined to ignore row order and rebuilt from the archived copy." },
    ],
    links: [
      { label: "Open dashboard", href: "https://apuracao26-pub-860897618882.s3.sa-east-1.amazonaws.com/index.html" },
      { label: "View source", href: "https://github.com/BenitoPedro13/apuracao-2026" },
    ],
  },
  {
    slug: "dove-language",
    title: "Dove Lesson Studio",
    tagline: "Volunteer teachers type a lesson and get branded slides and a handout",
    index: "13",
    year: "2026",
    role: "Brand system, product design and engineering",
    timeline: "September 2026 — v1 live",
    team: "Solo delivery",
    description:
      "A free tool for The Dove Language, a Discord community of about 4,600 people learning languages together: type a lesson, get 16:9 slides for the voice classroom and an A4 study handout as PDFs. Plus Airmail, the community's design system.",
    problem:
      "Lessons were hand-built in Canva, 58 slides for a single beginner session. The teaching was already solid and very regular, about a dozen repeating patterns, but every deck was laid out by hand. The teachers are volunteers, so a tool that is merely prettier than Canva and not faster won't be used.",
    approach:
      "The patterns became blocks and the lesson became data: one schema defines it, types are inferred from it, and it validates imported files. A pure pagination function splits blocks into slides, numbers sections and derives the cover and answer keys; the preview measures every slide and warns rather than clipping. Slide and handout components are pure, so the editor preview, the print routes and the design-system page render the same code. The browser's print engine makes the PDFs, and slides are sized in container units so one slide is exact at 1920 pixels and correct at 320.",
    outcome:
      "Studio v1 works end to end: landing, editor with live preview, autosave to the device, a lesson file to share, slide and handout PDFs, and the design system rendered live from the real templates. Airmail 0.1 is proposed and awaiting review by Dove's staff.",
    category: "product",
    tags: ["Product", "Design System", "Education"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS v4", "shadcn/ui", "zod", "IndexedDB"],
    visual: "lesson",
    cover: {
      src: "/projects/dove-language/home.png",
      alt: "Dove Lesson Studio landing: 'Make your lesson. We'll make it look like Dove.' beside a cover slide and a vocabulary slide",
      width: 1440,
      height: 900,
    },
    screenshots: [
      { src: "/projects/dove-language/home.png", alt: "Landing page with the three steps and a live cover and vocabulary slide from the example lesson", width: 1440, height: 900 },
      { src: "/projects/dove-language/studio.png", alt: "The studio: block list, lesson settings and the live slide preview", width: 1440, height: 900 },
      { src: "/projects/dove-language/brand.png", alt: "The design system page: four kinds of slide by colour and word, and the type chosen for readers still learning", width: 1440, height: 900 },
    ],
    process: [
      { phase: "01", title: "Audit the real deck", body: "A 58-slide session was read slide by slide; the pedagogy was kept, only the layout work was taken away." },
      { phase: "02", title: "A system with one idea", body: "Every lesson is a letter between two languages: a flight path, a stamp, a postmark and paper, and nothing else is decoration." },
      { phase: "03", title: "The lesson is data", body: "A schema, a pure pagination function and pure renderers, so preview, print and documentation can't disagree." },
      { phase: "04", title: "No backend on purpose", body: "Drafts autosave on the device and travel as files, because accounts would mean a login before anyone saw the value." },
    ],
    architecture: [
      { layer: "Schema", label: "zod lesson model", detail: "Types inferred, imports validated; a target language plus up to two translations." },
      { layer: "Layout", label: "paginate()", detail: "Blocks to slides by estimated height, with a measured overflow warning in the preview." },
      { layer: "Render", label: "Pure slide and handout components", detail: "One renderer for the studio, the print routes and the design-system page." },
      { layer: "Output", label: "The browser's print engine", detail: "Per-route page size, real selectable text, no server and no uploaded images." },
    ],
    features: [
      { title: "Faster than the old way", body: "Teachers write content in their language and the translations; the deck lays itself out." },
      { title: "Any script", body: "Fallback faces for Japanese, Korean, Chinese, Arabic, Hebrew, Devanagari and Thai, and right-to-left lessons." },
      { title: "Colour is never the only signal", body: "Each kind of slide carries a word as well as a colour, and every text pair was measured against AA." },
    ],
    challenges: [
      { title: "Never clip a lesson", body: "Height estimates can be wrong for unusual scripts, so the preview measures every rendered slide and warns instead of silently cutting teaching material." },
      { title: "A slide with no width in print", body: "The first PDF export rendered every slide at zero pixels; the print deck needed an explicit width, which also removed a trailing blank page." },
    ],
    links: [
      { label: "Open the studio", href: "https://dove-language.vercel.app" },
      { label: "View source", href: "https://github.com/BenitoPedro13/dove-language" },
    ],
  },
  {
    slug: "renewable-pulse",
    title: "Renewable Pulse",
    tagline: "A live instrument panel for renewable electricity, built only on real grid data",
    index: "12",
    year: "2026",
    role: "Data platform and product engineering",
    timeline: "Ongoing — live",
    team: "Solo",
    description:
      "A live dashboard of how much electricity already comes from renewables, starting with Brazil's hydro-heavy grid and comparing it with Europe and the USA, fed by a failure-resistant streaming pipeline over real public data.",
    problem:
      "Grid operators publish generation data, but in different formats, cadences and units: Brazil's ONS by plant and hour, ENTSO-E in 15 to 60-minute series for European zones, the EIA hourly for the USA. Turning that into one comparable, trustworthy picture means a pipeline that survives bursty batches, malformed rows and replays, without ever filling a gap with invented numbers.",
    approach:
      "A Go ingestion edge polls each source and normalizes it to one canonical event schema; Redpanda carries the events to idempotent TypeScript consumers that write to TimescaleDB, keyed on source, zone, asset, metric and timestamp, with a dead-letter queue and bounded backpressure. A separate live consumer fans readings out over WebSocket to the Next.js dashboard. The README states plainly that the sources are polled, not pushed: the real-time character comes from the pipeline, not the data.",
    outcome:
      "Live, with Brazil, Europe and USA deep-dives, a plant registry map, country comparison and a pipeline-health panel showing the dead-letter queue and the last successful poll per source. The ONS spine ingested 366,336 real plant/hour readings with zero duplicates on replay.",
    category: "data",
    tags: ["Data Pipeline", "Dashboard", "Real-time"],
    stack: ["Go", "Redpanda", "TimescaleDB", "TypeScript", "Fastify", "Next.js", "Zod"],
    visual: "grid",
    cover: {
      src: "/projects/renewable-pulse/dashboard.png",
      alt: "Renewable Pulse dashboard: Brazil's renewable share at 87%, generation mix over time and by region",
      width: 1440,
      height: 900,
    },
    screenshots: [
      { src: "/projects/renewable-pulse/dashboard.png", alt: "Brazil deep-dive: renewable share, generation mix by time and by region, average by hour of day", width: 1440, height: 900 },
      { src: "/projects/renewable-pulse/usa.png", alt: "Top real plants and the USA deep-dive across seven regional grid operators", width: 1440, height: 900 },
      { src: "/projects/renewable-pulse/pipeline-health.png", alt: "Country comparison and the pipeline-health panel: dead-letter queue depth and last successful poll per source", width: 1440, height: 900 },
    ],
    process: [
      { phase: "01", title: "The ONS spine", body: "Go poller, Redpanda, a persist consumer and TimescaleDB, live-verified end to end on real Brazilian plant data." },
      { phase: "02", title: "Reliability as a feature", body: "Idempotent upserts, a dead-letter queue for malformed events and bounded backpressure, each verified, not assumed." },
      { phase: "03", title: "Europe and the USA", body: "ENTSO-E pollers across six zones and the EIA for the US48 and seven regional grid operators, normalized to the same schema." },
      { phase: "04", title: "The live dashboard", body: "Deep-dives per region, a plant map, volatility charts and a pipeline-transparency panel, with data prefetched on the server for real edge caching." },
    ],
    architecture: [
      { layer: "Ingest", label: "Go pollers", detail: "One canonical event schema, hand-mirrored from the Zod contracts the TypeScript side uses." },
      { layer: "Broker", label: "Redpanda", detail: "Partitioned topics with independent consumer groups for persistence and live fan-out." },
      { layer: "Storage", label: "TimescaleDB", detail: "Idempotent writes and an hourly continuous aggregate for the charts." },
      { layer: "Serve", label: "Fastify REST + WebSocket", detail: "The dashboard reads REST through TanStack Query and live readings over a socket." },
    ],
    features: [
      { title: "Only real data", body: "Every reading traces back to an ONS, ENTSO-E or EIA response; a missing source shows as missing, never as a plausible number." },
      { title: "Replays don't duplicate", body: "Writes are keyed on source, zone, asset, metric and timestamp, so re-ingesting a batch changes nothing." },
      { title: "The pipeline shows its own health", body: "Dead-letter depth, consumer lag and the last successful poll per source are on the dashboard, not hidden in logs." },
    ],
    challenges: [
      { title: "Being honest about 'real-time'", body: "None of the sources stream; ONS republishes its plant file twice a day. The product says so, and the streaming standard is in the pipeline's engineering instead." },
      { title: "A backfill that filled the disk", body: "The full-depth ONS backfill outgrew the database volume during live operation; the volume was resized and the incident recorded with recommendations for the next backfill." },
      { title: "Years in a different file layout", body: "ONS switched to per-month files in 2022, so the backfill broke on earlier years until the year-file case was handled and the pilot chunk ran clean." },
    ],
    links: [
      { label: "Visit live dashboard", href: "https://renewable-pulse.vercel.app" },
      { label: "View source", href: "https://github.com/BenitoPedro13/renewable-pulse" },
    ],
  },
  {
    slug: "flora",
    title: "Flora",
    tagline: "An operations console for regenerative farming, built on a real satellite pipeline",
    index: "06",
    year: "2026",
    role: "Full-stack product engineering",
    timeline: "Ongoing",
    team: "Solo delivery",
    description:
      "A farm operations console where a scheduled worker — never the app itself — asks satellites for ten different plant-health readings per field, so a farmer opens a map and sees exactly which corner of which field is stressed, backed by real Sentinel-2 imagery.",
    problem:
      "A first version of this idea existed already, built on Google Earth Engine — but Earth Engine only ships Python and JavaScript bindings, and it's a research compute platform, not an imagery API, which made it slow and awkward to build a real product on. Beyond that starting point: a smaller regenerative farm has no in-house GIS or remote-sensing expertise, but still needs to know which part of which field is stressed, this week, without walking every hectare.",
    approach:
      "The whole system is rebuilt around one invariant: no request ever calls the satellite provider. A NestJS worker polls Copernicus's Data Space Ecosystem on a schedule, decodes the returned imagery, computes ten spectral indices from a single Process API call, and writes pre-rendered PNGs to object storage plus rows to Postgres. The API — a separate NestJS service — only ever reads Postgres and Redis, a split enforced by an actual test. Every tenant table sits behind PostGIS row-level security and a repository-level filter, checked by a cross-tenant suite that asserts a 404, never a 403, on another org's data.",
    outcome:
      "A working spine — register a field, watch a real stress zone appear from real Sentinel-2 data, act on it as a task — plus a home dashboard scored by a sourced formula, a ten-index spectral switcher, and a weather screen. Several of the sharpest bugs never showed up in a code review: they only appeared once a manual refresh ran against a real Copernicus account and a real field boundary, and got fixed the same way — by looking at what actually rendered.",
    category: "product",
    tags: ["Geospatial", "Multi-tenant SaaS", "Satellite Data"],
    stack: [
      "Next.js",
      "NestJS",
      "TypeScript",
      "PostgreSQL + PostGIS",
      "Drizzle ORM",
      "BullMQ + Redis",
      "Mapbox GL JS",
      "Sentinel Hub (CDSE)",
    ],
    visual: "geospatial",
    cover: {
      src: "/projects/flora/stress-ndmi.png",
      alt: "Flora Crop Stress screen reading NDMI over a real field boundary on a Mapbox satellite basemap",
      width: 1440,
      height: 900,
    },
    screenshots: [
      {
        src: "/projects/flora/home.png",
        alt: "Flora home dashboard with Regeneration Score, planting productivity, and crops stocked",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/flora/fields.png",
        alt: "Flora Fields screen with field cards and a Mapbox satellite basemap",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/flora/stress-ndvi.png",
        alt: "Flora Crop Stress screen reading Contrasted NDVI over a real field boundary",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/flora/stress-reci.png",
        alt: "The same field switched to RECI, a red-edge chlorophyll index",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/flora/tasks.png",
        alt: "Flora Tasks board with a real drag-and-drop Kanban",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/flora/weather.png",
        alt: "Flora Weather screen with six instrument cards over Open-Meteo data",
        width: 1440,
        height: 900,
      },
    ],
    process: [
      {
        phase: "01",
        title: "Foundations, schema, tenancy",
        body: "A pnpm/Turborepo monorepo, a Drizzle + PostGIS schema for ten domain tables with composite foreign keys, and identity with RLS enforced twice before any product screen existed.",
      },
      {
        phase: "02",
        title: "The spine: Fields → Crop Stress → Tasks",
        body: "Field CRUD and boundary drawing on a Mapbox map, then the satellite write path (a CDSE HTTP client, a decode-to-PNG raster pipeline, a BullMQ per-field scheduler), then the screen that reads it, and finally a Kanban task board with a real @dnd-kit drag.",
      },
      {
        phase: "03",
        title: "Ten spectral indices",
        body: "Widened the pipeline from one scheduled index to ten in a single Process API call — verified live to cost 4.667 Processing Units against a 4.0 baseline, since output count turns out to be free and only the input bands matter.",
      },
      {
        phase: "04",
        title: "Home dashboard and weather",
        body: "Daily rollups, a Regeneration Score built from AAFC's published agri-environmental performance index instead of an invented composite, and an Open-Meteo weather screen with six instrument cards.",
      },
    ],
    architecture: [
      {
        layer: "Web",
        label: "Next.js App Router",
        detail: "AlignUI shell, Mapbox map, Recharts — reads only Postgres-backed API endpoints, never a satellite provider directly.",
      },
      {
        layer: "API",
        label: "NestJS",
        detail: "A separate service from the web app, reading only Postgres and Redis — enforced by a test, not a convention.",
      },
      {
        layer: "Worker",
        label: "NestJS standalone + BullMQ",
        detail: "The only service allowed to call Sentinel Hub — a scheduled per-field job, not a request handler.",
      },
      {
        layer: "Data",
        label: "PostgreSQL 16 + PostGIS 3.4",
        detail: "Drizzle ORM with a custom geography type; every tenant table behind RLS and a repository filter, both.",
      },
    ],
    features: [
      {
        title: "Ten-index spectral switcher",
        body: "NDVI, NDRE, EVI, MSAVI, RECI, MCARI, a labelled PRI proxy, NDMI, NDWI, and VSDI, each with its own colour ramp — and an honest disabled state for the ones this pipeline can't produce yet.",
      },
      {
        title: "Real stress-zone detection",
        body: "A raster overlay clipped to the field's true polygon boundary via its imagery's own 'no data' class, with grouped detections and a popover wired to real task mutations.",
      },
      {
        title: "Tenancy enforced twice",
        body: "Row-level security and a repository filter on every tenant table, checked by a cross-tenant suite asserting a 404, never a 403, against real RLS.",
      },
    ],
    challenges: [
      {
        title: "A missing header that looked like an auth failure",
        body: "No `Accept: application/tar` on the Process API request meant Copernicus silently returned a bare TIFF instead of the requested archive, and the parser's own error read exactly like a token problem — only testing against the real, live account surfaced the actual cause.",
      },
      {
        title: "A masking bug two indices had and eight didn't",
        body: "Eight of ten spectral indices are NDVI-shaped ratios, where a masked pixel naturally produces `NaN` outside the field boundary. Two indices with no division in their formula evaluated to a real, in-range number instead, painting a rectangle where a field polygon should have been — fixed by masking on the imagery's own 'no data' class instead of a formula side-effect.",
      },
      {
        title: "A synthetic seed that never clipped to a real boundary",
        body: "The satellite seed script filled its field's entire bounding-box rectangle with valid pixels, since a synthetic raster has no reason to know the field's real, non-rectangular boundary. Found by looking at a rendered field, not by inspecting the script.",
      },
    ],
    links: [
      {
        label: "View source",
        href: "https://github.com/BenitoPedro13/flora",
      },
    ],
  },
  {
    slug: "art-hur",
    title: "ART'hur",
    tagline: "A portfolio built as one authored scene, not a scrolling page",
    index: "05",
    year: "2026",
    role: "Full-stack product engineering",
    timeline: "Ongoing",
    team: "Solo delivery",
    description:
      "A motion-led portfolio and living archive for a visual director, where one centered stage morphs between projects instead of presenting them as a scrollable grid.",
    problem:
      "The starting point was a Next.js and Payload CMS foundation wearing a literal macOS desktop skin — wallpaper, dock, icons, window chrome. It behaved like software demoing itself, not like an archive of a director's actual work, and a generic template grid could never carry the specific rhythm of motion-forward, culturally fluent work.",
    approach:
      "The CMS, data model, and Next.js foundation stayed. Everything public-facing was rebuilt around a studied 'Marked Frequencies' direction: one fixed, centered project stage where image, atmosphere, title, and metadata morph in place, advanced by a single wheel notch or short touch gesture instead of an open carousel. A dashed white route and a hand-authored 15-frame walking glyph carry the sense of motion instead of a generic loader, and the app cuts between two surfaces — a dark 'room' for media routes and a light 'sheet' for reading — with no cross-fade.",
    outcome:
      "A live archive with five real projects, each carrying production metadata instead of filler copy, where the desktop-simulation shell is gone from every public route, the CMS layer is untouched, and the opening sequence, walker, and morph transition all degrade to a complete, legible page under reduced motion or a failed WebGL context.",
    category: "sites",
    tags: ["Portfolio", "Motion Design", "WebGL"],
    stack: [
      "Next.js",
      "TypeScript",
      "Payload CMS",
      "PostgreSQL",
      "Tailwind CSS",
      "GSAP",
      "OGL (WebGL)",
      "Vercel Blob",
    ],
    visual: "portfolio",
    cover: {
      src: "/projects/art-hur/home.png",
      alt: "ART'hur's centered archive stage with the dashed route and walker glyph",
      width: 1440,
      height: 900,
    },
    screenshots: [
      {
        src: "/projects/art-hur/home.png",
        alt: "ART'hur's centered archive stage with the dashed route and walker glyph",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/art-hur/casa-264.png",
        alt: "ART'hur project case study header for Casa 264",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/art-hur/index.png",
        alt: "ART'hur contact-sheet index of every project",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/art-hur/about.png",
        alt: "ART'hur about page running the Living Tag at display scale",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/art-hur/contact.png",
        alt: "ART'hur contact page with direct paths first",
        width: 1440,
        height: 900,
      },
    ],
    process: [
      {
        phase: "01",
        title: "Strip the shell, keep the foundation",
        body: "Next.js App Router, Payload CMS, PostgreSQL, and Vercel Blob stayed exactly as inherited. Every literal macOS desktop simulation — wallpaper, lock screen, dock, icons, window chrome — was removed from the public experience before any new visual direction was authored on top.",
      },
      {
        phase: "02",
        title: "Build the one-stage navigation",
        body: "A centered project stage, a wheel/touch-to-anchor gesture sync, and a controlled WebGL morph transition that completes on its own easing instead of being tied directly to scroll position.",
      },
      {
        phase: "03",
        title: "Author the motion signature",
        body: "A continuously breathing dashed route, a hand-drawn 15-frame walking glyph, and a restrained WebGL ripple hover layer over the stable active image — suppressed during transitions, reduced motion, and touch-only use.",
      },
      {
        phase: "04",
        title: "Interior routes, opening, and SEO",
        body: "The work case study, contact-sheet index, about, and contact routes; the two-surface room/sheet system; a resilient CSS-only opening sequence; and per-route Open Graph images and structured data.",
      },
    ],
    architecture: [
      {
        layer: "Client",
        label: "Next.js App Router",
        detail: "Public archive routes sharing one app with the Payload admin route group, plus localized routing.",
      },
      {
        layer: "CMS",
        label: "Payload CMS 3",
        detail: "Projects, media, and site settings, publication-gated the way the inherited foundation intended.",
      },
      {
        layer: "Data",
        label: "PostgreSQL + Vercel Blob",
        detail: "Relational content plus S3-compatible object storage for project imagery.",
      },
      {
        layer: "Motion",
        label: "OGL (WebGL) + GSAP / motion",
        detail: "The centered morph transition and ripple hover run on a controlled OGL renderer; DOM-level choreography runs on GSAP and motion.",
      },
    ],
    features: [
      {
        title: "One-stage project navigation",
        body: "A single wheel notch or short touch gesture selects the adjacent project and syncs the document anchor; the transition then completes on its own authored easing instead of being scrubbed by scroll distance.",
      },
      {
        title: "Dashed route and walker glyph",
        body: "A continuously breathing dashed line and a hand-authored 15-frame glyph carry direction and motion instead of a generic spinner or carousel arrow.",
      },
      {
        title: "Two-surface cut system",
        body: "Media routes render on a dark 'room' and reading routes on a light 'sheet', with the surface stamped on the route root so overscroll never reveals the wrong canvas color.",
      },
    ],
    challenges: [
      {
        title: "Decoupling gesture from animation",
        body: "The wheel/touch input had to commit to the adjacent project on one modest gesture rather than scrubbing shader progress directly off scroll distance, so the transition reads as an edit rather than a scroll-linked effect.",
      },
      {
        title: "Keeping data and shell separable",
        body: "The Payload CMS foundation and its data model had to survive completely intact while every public-facing macOS-simulation layer built on top of it was removed.",
      },
      {
        title: "An overlay that can't fail blank",
        body: "The full-screen opening sequence is CSS-only and fills backward from a complete final state, so a bug in the animation still renders the finished site instead of hiding it entirely.",
      },
    ],
    links: [
      { label: "Visit live site", href: "https://art-hur.vercel.app" },
      {
        label: "View source",
        href: "https://github.com/BenitoPedro13/ART-hur",
      },
    ],
  },
  {
    slug: "oishi",
    title: "Oishi Cozinha Japonesa",
    tagline: "A rodízio's anti-waste pricing, built as the whole site's thesis",
    index: "08",
    year: "2026",
    role: "Full-stack product engineering",
    timeline: "Ongoing",
    team: "Solo",
    description:
      "A marketing site for a São Gonçalo rodízio restaurant with 17K Instagram followers and no website — every price, hour, and menu item is real, and the one thing the site exists to say is a real discount: R$ 20 off per person if the whole table finishes what it orders.",
    problem:
      "Oishi's entire web presence was a Linktree-style page and a one-screen Canva site. Its menu and four price tiers lived only inside JPEGs, reservations arrived by phone, and delivery ran through a third-party app. Its real differentiator — a genuine, checkable anti-waste discount — had nowhere on the internet to be said out loud.",
    approach:
      "The whole site is built around one sentence already true of the business: 'Coma tudo o que pedir. Pague menos por isso.' Every rodízio tier always shows both prices together with the condition spelled out, never the discounted number alone — R$ 74,90 struck through, R$ 54,90 live, 'sem desperdício' underneath. Reference photography couldn't carry the site — 44 real photographs were graded by mean luminance with ffmpeg, and two-thirds measured too dark for a full-bleed hero — so the design is type-led and colour-led instead, with the brand's own sampled hinomaru gradient (#9A1114 → #E71B23) doing the work a professional photo shoot usually would. Every fact that wasn't confirmed — an exact phone digit, reservation party limits, a neighbourhood detail — renders as an honest '[a confirmar]' inline rather than a plausible guess.",
    outcome:
      "Live at oishicozinha.vercel.app across five routes — home, cardápio, two rodízio chapters, reserva, and contato — where every price tier renders both numbers and the real condition, the reservation form ends in a pre-filled WhatsApp message, and the still-open questions about hours and party limits stay visibly marked rather than silently answered.",
    category: "sites",
    tags: ["Restaurant", "Local Business", "Motion"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Lenis", "Motion"],
    visual: "rodizio",
    cover: {
      src: "/projects/oishi/home.png",
      alt: "Oishi Cozinha Japonesa hero with the 味 kanji set inside the hinomaru disc",
      width: 1456,
      height: 840,
    },
    screenshots: [
      {
        src: "/projects/oishi/home.png",
        alt: "Oishi Cozinha Japonesa hero with the 味 kanji set inside the hinomaru disc",
        width: 1456,
        height: 840,
      },
      {
        src: "/projects/oishi/cardapio.png",
        alt: "Rodízio Chisai showing both prices, R$ 74,90 and R$ 54,90, with the sem-desperdício condition",
        width: 1456,
        height: 840,
      },
      {
        src: "/projects/oishi/rodizio-com-sashimi.png",
        alt: "Rodízio com sashimi's two tiers, each with both prices and all three conversion exits",
        width: 1456,
        height: 840,
      },
      {
        src: "/projects/oishi/reserva.png",
        alt: "Oishi's reservation form, ending in a pre-filled WhatsApp message, with unconfirmed policy fields marked honestly",
        width: 1456,
        height: 840,
      },
      {
        src: "/projects/oishi/contato.png",
        alt: "Oishi's contact page with the real address and phone, and an honestly flagged unconfirmed city detail",
        width: 1456,
        height: 840,
      },
    ],
    process: [
      {
        phase: "01",
        title: "Measure before designing",
        body: "44 reference photographs were graded by mean luminance with ffmpeg before any layout decision — 15 survive full-bleed, 20 work only in a framed panel, 9 are thumbnail-only, and none show the room or the team.",
      },
      {
        phase: "02",
        title: "Sample the brand instead of choosing it",
        body: "The hinomaru's red is a real vertical gradient sampled from the logo itself, not a stock 'Japanese red' — measured at 3.17:1 contrast on the ground colour, which is why it's reserved for fills and display type rather than body copy.",
      },
      {
        phase: "03",
        title: "Build the two-price component once",
        body: "Every rodízio tier renders through one component that always shows both prices and the verbatim condition — never the discounted number alone, never the full price without the offer beside it.",
      },
      {
        phase: "04",
        title: "Register every allowed fact",
        body: "A data-inventory document tracks every price, hour, and detail the site is allowed to state, each with its source — anything not in that register doesn't reach the page; it renders as '[a confirmar]' instead.",
      },
    ],
    architecture: [
      {
        layer: "Client",
        label: "Next.js App Router",
        detail: "Five static routes — home, cardápio, rodízio/[slug], reserva, contato — no server data, no database.",
      },
      {
        layer: "Motion",
        label: "GSAP + Lenis + Motion",
        detail: "Scroll-scrubbed cinema on the home route, smooth native scroll everywhere, component-level hover and reveal motion.",
      },
      {
        layer: "Content",
        label: "Typed TS, no CMS",
        detail: "Menu, prices, and facts live in src/content/, gated by the same 'never invent a fact' rule enforced across the codebase.",
      },
      {
        layer: "Conversion",
        label: "lib/contato/whatsapp.ts",
        detail: "The one wa.me builder every CTA on the site resolves through — delivery and reservations both terminate here.",
      },
    ],
    features: [
      {
        title: "The two-price component",
        body: "Every tier always shows the full price, the anti-waste price, and the real condition together — never one number alone.",
      },
      {
        title: "Luminance-graded photography",
        body: "Every photo on the site is shown at the size its own measured brightness actually supports, never stretched past its tier.",
      },
      {
        title: "Honest unresolved facts",
        body: "An unconfirmed hour, phone digit, or reservation rule renders as a visible '[a confirmar]' instead of a plausible placeholder.",
      },
    ],
    challenges: [
      {
        title: "A phone number that disagreed with itself",
        body: "WhatsApp deep links and two social posts gave one number; two printed flyers gave another. The conflict is contained to one builder function so the site can ship around it without resolving it everywhere it's used.",
      },
      {
        title: "Designing without a photo shoot",
        body: "Two-thirds of the 44 reference photographs measured too dark or too inconsistent for a photography-led design, so the entire visual system had to carry the brand through type and colour instead of imagery.",
      },
      {
        title: "Keeping the discount honest, not just prominent",
        body: "The anti-waste price only applies if the whole table finishes its food — showing R$ 54,90 without that condition would be a false price, so the condition is structurally part of the same component, never separable copy.",
      },
    ],
    links: [
      { label: "Visit live site", href: "https://oishicozinha.vercel.app" },
      { label: "View source", href: "https://github.com/BenitoPedro13/oishi" },
    ],
  },
  {
    slug: "trision",
    title: "Trísion",
    tagline: "One catalogue, a showcase for every reseller — no cart, ever",
    index: "07",
    year: "2026",
    role: "Full-stack product engineering",
    timeline: "Ongoing — Fase 0 of a phased build",
    team: "Solo delivery",
    description:
      "A brand site and multi-tenant reseller platform for a Brazilian eyewear label, where every independent optical shop that resells the brand gets its own storefront sharing one catalogue — never a themed copy of the brand's own site.",
    problem:
      "The client's entire web presence was a Linklist page and a one-screen Canva site, and her resellers — independent optical shops across Brazil — had nothing of their own to show a customer. The brand already existed: a name, a mark, a specific gold sampled from her own material, '24 years' as the one asset nobody else in the category has. The job was building the platform to carry that identity without letting every reseller flatten into an identical sub-brand.",
    approach:
      "A reseller is an endorsement, not a sub-brand, enforced in the data model itself — no colour field, no logo field, no font field, ever. Every path, brand site or reseller storefront, resolves through one WhatsApp deep-link builder. The catalogue and tenancy layers are built as typed seams over local mock data now, so the CMS arriving in the next phase is a new implementation behind an existing interface, not a rewrite. And where a rule says a number must be a real measurement or a photo must be real, the honest failure state ships instead of a placeholder that would quietly lie to an optician.",
    outcome:
      "A working Fase 0: the homepage, collections, catalogue, product pages, and a path-routed storefront stand-in all render end-to-end against typed mock data, dark-only, with the brand's own gold as the single accent — and every product photo gallery without a real shot renders an honest 'no photo' state rather than an invented one.",
    category: "product",
    tags: ["Multi-tenant SaaS", "Brand Identity", "Design System"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS v4", "Zustand"],
    visual: "eyewear",
    cover: {
      src: "/projects/trision/catalogo.png",
      alt: "Trísion catalogue with format/material/colour filters and real numeração on every card",
      width: 1440,
      height: 757,
    },
    screenshots: [
      {
        src: "/projects/trision/home.png",
        alt: "Trísion homepage: the thesis line and the starfield ground",
        width: 1440,
        height: 757,
      },
      {
        src: "/projects/trision/catalogo.png",
        alt: "Trísion catalogue with format/material/colour filters and real numeração on every card",
        width: 1440,
        height: 757,
      },
      {
        src: "/projects/trision/colecoes.png",
        alt: "Trísion collections index",
        width: 1440,
        height: 757,
      },
      {
        src: "/projects/trision/produto.png",
        alt: "Trísion product page showing the honest 'sem foto' empty state instead of a stock photo",
        width: 1440,
        height: 757,
      },
      {
        src: "/projects/trision/revendedores.png",
        alt: "Trísion reseller directory, filterable by state and city",
        width: 1440,
        height: 757,
      },
      {
        src: "/projects/trision/loja.png",
        alt: "A reseller's own storefront at /loja/[rev] — the Fase 0 stand-in for a subdomain",
        width: 1440,
        height: 757,
      },
    ],
    process: [
      {
        phase: "01",
        title: "Scaffold and the pitch deck",
        body: "Design tokens sampled from the client's own material, including the specific gold rather than a generic stock tone. The first deliverable was a slide presentation built to extract the open questions — domain ownership, pricing model, WhatsApp routing — that block later phases, shown to the client on her phone.",
      },
      {
        phase: "02",
        title: "The brand components",
        body: "Hand-written corner brackets that frame something real, the millimetre numeração component with an inline-SVG square glyph, a wordmark drawn from one shared path source across header/favicon/share image, and a starfield canvas that degrades to a complete static page under reduced motion or no WebGL.",
      },
      {
        phase: "03",
        title: "Catalogue and tenancy, against typed mock data",
        body: "The full frontend — home, collections, a filterable catalogue, product pages, and a storefront stand-in — built behind one catalogue seam and one tenancy seam, so Payload can implement both later without the pages above them changing.",
      },
      {
        phase: "04",
        title: "Fase 1 — not started",
        body: "Payload CMS and Postgres, mounted once the client's apex domain is confirmed — the wildcard-subdomain storefront routing the whole multi-tenant model depends on can't ship without it.",
      },
    ],
    architecture: [
      {
        layer: "Client",
        label: "Next.js App Router",
        detail: "Brand routes and the Fase 0 storefront stand-in sharing one app, dark theme hardcoded, no light-mode toggle.",
      },
      {
        layer: "Catalogue seam",
        label: "One typed source function",
        detail: "Local mock data today; a CMS implementation later sits behind the same interface, not a rewrite.",
      },
      {
        layer: "Tenancy seam",
        label: "One scope function",
        detail: "Every tenant-scoped read — reseller, showcase — goes through this one place.",
      },
      {
        layer: "Conversion",
        label: "One wa.me builder",
        detail: "Every CTA on every route resolves through the same WhatsApp deep-link function.",
      },
    ],
    features: [
      {
        title: "Endorsement-only reseller storefronts",
        body: "A reseller gets a name, city, contact, and one photo — never a colour, logo, or font — enforced by the data model, not editorial discipline.",
      },
      {
        title: "Honest 'no photo' empty states",
        body: "Every product gallery without a real photograph says so plainly instead of substituting a stock image that isn't actually this brand's product.",
      },
      {
        title: "Real numeração or none at all",
        body: "The millimetre frame measurement renders only from real data, with its square glyph as inline SVG — never a placeholder value.",
      },
    ],
    challenges: [
      {
        title: "Building the CMS seam before the CMS",
        body: "Fase 0 has no database by design, but every future collection already has a typed consumer waiting for it — getting that boundary right without the real implementation to test against is the highest-risk part of the phasing.",
      },
      {
        title: "Never inventing a fact about the client's business",
        body: "No price, measurement, city, or reseller name gets invented — an unresolved fact is written down explicitly as a question to verify instead of a plausible-looking placeholder.",
      },
      {
        title: "A brand asset that's still an approximation",
        body: "The wordmark is currently an approximate redraw pending the original vector — every surface that renders it reads from one shared source so the real file, once it arrives, updates everywhere at once.",
      },
    ],
    links: [
      { label: "Visit live site", href: "https://trision.vercel.app" },
      {
        label: "View source",
        href: "https://github.com/BenitoPedro13/trision",
      },
    ],
  },
  {
    slug: "bee-dash",
    title: "Bee Dash",
    tagline: "Influencer marketing analytics without manual reporting",
    index: "02",
    year: "2024",
    role: "Full-stack product engineering",
    timeline: "Ongoing",
    team: "Small delivery team",
    description:
      "A dashboard for marketing teams that pulls numbers from social media accounts automatically and shows whether a campaign is actually working.",
    problem:
      "Influencer campaign reporting is usually a spreadsheet assembled by hand. Someone opens each creator's analytics, copies reach and engagement into cells, and by the time the report is ready the campaign has already moved on.",
    approach:
      "Bee Dash ingests metrics through social platform APIs, maps incompatible fields into one canonical schema, and renders comparable decision-focused views. The API, client dashboard, and internal admin live in one monorepo with shared types so metric definitions cannot drift silently between applications.",
    outcome:
      "Campaign performance becomes visible in near real time, with creators compared on equivalent metrics instead of platform-specific vanity numbers.",
    category: "data",
    tags: ["Dashboard", "Marketing", "Integrations"],
    stack: [
      "Next.js",
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "shadcn/ui",
      "pnpm workspaces",
      "Social APIs",
    ],
    visual: "analytics",
    cover: {
      src: "/projects/bee-dash/home.png",
      alt: "Bee Dash home dashboard with campaign and creator stats",
      width: 1440,
      height: 2072,
    },
    screenshots: [
      {
        src: "/projects/bee-dash/home.png",
        alt: "Bee Dash home dashboard with campaign and creator stats",
        width: 1440,
        height: 2072,
      },
      {
        src: "/projects/bee-dash/campanhas.png",
        alt: "Bee Dash campaigns list view",
        width: 1440,
        height: 1127,
      },
      {
        src: "/projects/bee-dash/creators.png",
        alt: "Bee Dash creators grid and performance table",
        width: 1334,
        height: 1664,
      },
      {
        src: "/projects/bee-dash/login.png",
        alt: "Bee Dash login screen",
        width: 1440,
        height: 1313,
      },
      {
        src: "/projects/bee-dash/loading.png",
        alt: "Bee Dash loading screen",
        width: 1440,
        height: 1313,
      },
    ],
    process: [
      {
        phase: "01",
        title: "Define canonical metrics",
        body: "The team agreed what reach, engagement, and campaign performance mean across platforms before writing platform-specific adapters.",
      },
      {
        phase: "02",
        title: "Build ingestion adapters",
        body: "Each social source handles its own authentication, pagination, and rate limits while producing the same normalized output.",
      },
      {
        phase: "03",
        title: "Design around decisions",
        body: "Every chart answers a practical question: campaign pacing, creator comparison, renewal value, or best-performing content format.",
      },
      {
        phase: "04",
        title: "Share contracts, not copies",
        body: "API, dashboard, and admin consume shared domain types and UI foundations from one workspace.",
      },
    ],
    architecture: [
      {
        layer: "Client",
        label: "Next.js dashboard",
        detail: "Campaign views, creator comparison, filters, and interactive data visualization.",
      },
      {
        layer: "Internal",
        label: "Operations admin",
        detail: "Account, campaign, access, and source management kept separate from the client product.",
      },
      {
        layer: "API",
        label: "NestJS service",
        detail: "Modular ingestion, aggregation, scheduling, and access control.",
      },
      {
        layer: "Data",
        label: "PostgreSQL + Prisma",
        detail: "Normalized time-series metrics with typed queries and versioned migrations.",
      },
    ],
    features: [
      {
        title: "Multi-platform ingestion",
        body: "Scheduled adapters pull social data and map it into one stable reporting model.",
      },
      {
        title: "Equivalent creator comparison",
        body: "Creators can be compared on normalized metrics instead of unrelated platform-specific fields.",
      },
      {
        title: "Interactive campaign views",
        body: "Teams filter and drill into live reporting rather than receiving another static export.",
      },
    ],
    challenges: [
      {
        title: "Aggressive rate limits",
        body: "Ingestion is batched, scheduled, and backed off deliberately rather than retrying blindly.",
      },
      {
        title: "Platform schema drift",
        body: "Adapters isolate API churn so a platform change does not spread into every chart and query.",
      },
      {
        title: "Growing historical volume",
        body: "The schema supports trend queries without turning every dashboard request into a full-history scan.",
      },
    ],
    links: [
      { label: "Visit live site", href: "https://www.thatsbee.co" },
      {
        label: "View source",
        href: "https://github.com/BenitoPedro13/bee-dash-monorepo",
      },
    ],
  },
  {
    slug: "fa-moveis",
    title: "F&A Móveis",
    tagline: "A furniture catalogue where every measurement on the page is the real one",
    index: "09",
    year: "2026",
    role: "Full-stack product engineering",
    timeline: "Ongoing",
    team: "Solo",
    description:
      "A catalogue site for a Rio de Janeiro furniture shop that sold entirely over WhatsApp from a dormant Facebook page. No cart, no checkout — every product page ends in a pre-filled WhatsApp message to the owner, and every centimetre shown on it is a real, sourced measurement.",
    problem:
      "Fátima has run a neighbourhood furniture business for years with no website — just a Facebook page gone dormant since February 2022. She resells factory furniture, delivers it, and assembles it, and every sale already happened over WhatsApp. This was a paid client project on a tight budget where the demo had to come before the money: a working site built on her real brand and real stock, shown to her on her phone, was what won the job.",
    approach:
      "The build is deliberately backend-less: a typed TypeScript catalogue in content/, no CMS, no database, no monthly bill. Every measurement is stored as a number in centimetres and formatted at the edge, never hand-typed as a string, and every wa.me link is built by one function reading her real phone number from a single content module. Nothing outside lib/catalog/source.*.ts is allowed to import a Shopify type, which is what makes a later Shopify upsell a one-module swap instead of a rewrite. Where a price wasn't confirmed, the page says so — 'Consulte o preço' — instead of shipping a plausible number.",
    outcome:
      "Live at fa-moveis.vercel.app with 13 real products — no illustrative filler left on the site — 3 from her own D'Doro line and 10 from a second Novo Horizonte supplier, priced against real supplier sheets and her own WhatsApp confirmations. 10 of the 13 carry a confirmed price; the remaining 3 show an honest 'Consulte o preço' rather than a guess. A production build measured Lighthouse 93 performance and 100 accessibility on /produtos, CLS 0, every product image under 32 KB against a 180 KB budget.",
    category: "sites",
    tags: ["Local Business", "Catalogue", "No-CMS"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Radix UI", "Vercel"],
    visual: "furniture",
    cover: {
      src: "/projects/fa-moveis/home.png",
      alt: "F&A Móveis homepage hero with the Roupeiro Mônaco Plus and its real 2,30 × 2,40 m dimension lines",
      width: 1456,
      height: 840,
    },
    screenshots: [
      {
        src: "/projects/fa-moveis/home.png",
        alt: "F&A Móveis homepage hero with the Roupeiro Mônaco Plus and its real 2,30 × 2,40 m dimension lines",
        width: 1456,
        height: 840,
      },
      {
        src: "/projects/fa-moveis/produtos.png",
        alt: "F&A Móveis /produtos catalogue with category filters and real measurements on every card",
        width: 1456,
        height: 840,
      },
      {
        src: "/projects/fa-moveis/produto.png",
        alt: "F&A Móveis product page for the Roupeiro Mônaco Plus, showing L × A × P measurements and the WhatsApp CTA",
        width: 1456,
        height: 840,
      },
    ],
    process: [
      {
        phase: "01",
        title: "Scaffold on her real brand",
        body: "Name, mark, the rose accent (#A87C7C), and a Didone serif were already hers, evidenced in her own Facebook video — the job was bringing an existing identity onto the web with better craft, never redesigning it from zero.",
      },
      {
        phase: "02",
        title: "A typed catalogue, no CMS",
        body: "content/produtos.ts, categorias.ts, ambientes.ts, and loja.ts became the single source of truth; components read only the domain Produto type, never a raw content import.",
      },
      {
        phase: "03",
        title: "Real stock, real prices",
        body: "The 27-product illustrative catalogue used to demo the concept was removed once real supplier stock replaced it — 3 D'Doro pieces from Fátima's own catalogue QR codes, 10 Novo Horizonte pieces priced from a supplier sheet with the same freight-and-tax markup used on an earlier sibling project.",
      },
      {
        phase: "04",
        title: "The real-device checklist",
        body: "A pass against the live deployment, not localhost, caught two defects invisible from a dev server: every WhatsApp message was shipping a literal localhost URL, and /produtos had no Open Graph card.",
      },
    ],
    architecture: [
      {
        layer: "Client",
        label: "Next.js App Router",
        detail: "Server-rendered catalogue, product, and home routes — zero client components in the shipped build.",
      },
      {
        layer: "Catalogue",
        label: "content/*.ts",
        detail: "Typed product, category, and store data — the only source any page or component is allowed to read.",
      },
      {
        layer: "Conversion",
        label: "lib/whatsapp.ts",
        detail: "The one wa.me builder used by every product CTA, reading the phone number from content/loja.ts.",
      },
      {
        layer: "Hosting",
        label: "Vercel",
        detail: "Fully static, no database, no auth — a production build fails on purpose if SITE_URL would resolve to localhost.",
      },
    ],
    features: [
      {
        title: "Real measurements, formatted at the edge",
        body: "Every dimension is stored as a number in centimetres and rendered as 'L × A × P' — never typed as a display string, never rounded by hand.",
      },
      {
        title: "Honest pricing",
        body: "10 of 13 products show a confirmed price; the other 3 say 'Consulte o preço' instead of a plausible guess.",
      },
      {
        title: "One WhatsApp builder",
        body: "Every product page, from any category, resolves through the same pre-filled wa.me link — no second place composes that URL.",
      },
    ],
    challenges: [
      {
        title: "A localhost URL that shipped to production",
        body: "An unset SITE_URL fell back silently to localhost, so the deployed site's own WhatsApp messages carried a dead link — caught by a real-device pass against the live URL, not the dev server, and fixed by failing the build outright on that exact misconfiguration.",
      },
      {
        title: "Sourcing prices for stock that wasn't hers to guess",
        body: "Novo Horizonte's 10 pieces needed real supplier-sheet numbers and the same freight-plus-tax markup logic already used on a sibling project — 3 items still show 'Consulte o preço' because that number wasn't confirmed yet, not because it was estimated.",
      },
      {
        title: "Retiring the demo catalogue without losing the pitch",
        body: "The original 27-item illustrative catalogue existed to win the job before real stock was ready; removing it once 13 real products existed meant the site never quietly kept selling furniture that wasn't actually in stock.",
      },
    ],
    links: [
      { label: "Visit live site", href: "https://fa-moveis.vercel.app" },
      { label: "View source", href: "https://github.com/BenitoPedro13/fa-moveis" },
    ],
  },
  {
    slug: "prumo",
    title: "Prumo",
    tagline: "Credit pre-qualification before apartment browsing, for MCMV buyers",
    index: "04",
    year: "2026",
    role: "Full-stack product engineering",
    timeline: "Ongoing",
    team: "Solo delivery",
    description:
      "A marketing and pre-qualification site for a Rio real-estate broker, where a family gets an honest MCMV credit verdict in about a minute, before they ever compare apartments.",
    problem:
      "The broker doesn't own inventory or set prices — she resells the same Cury Construtora launches, from the same PDFs, as every other broker in the city. In Minha Casa Minha Vida specifically, the real anxiety is credit approval, not finishes, yet nearly every listing site in the segment answers 'which apartment' first and leaves qualification for a phone call.",
    approach:
      "The product puts the credit question first: a six-step pre-qualification flow returns one of five honest outcomes — never a binary yes/no — with zero bureau lookups and zero document uploads. Every policy-sensitive number behind it lives in a CMS global instead of in code, flagged as an illustrative suggestion until confirmed against Caixa's current tables. A proposal sent to a qualified lead freezes its own commercial numbers at creation and refuses outright to generate if its price table has expired.",
    outcome:
      "A live product where a visitor gets a real MCMV verdict without typing a CPF, and where a shared proposal always shows both the installment paid today and the INCC-projected one at handover, because the data model makes it structurally impossible to show only one.",
    category: "product",
    tags: ["Real Estate", "MCMV Credit", "Lead Qualification"],
    stack: [
      "Next.js",
      "TypeScript",
      "Payload CMS",
      "PostgreSQL",
      "Tailwind CSS",
      "shadcn/ui",
      "Vercel Blob",
    ],
    visual: "realestate",
    cover: {
      src: "/projects/prumo/home.png",
      alt: "Prumo homepage stating the credit-before-apartment order",
      width: 1440,
      height: 900,
    },
    screenshots: [
      {
        src: "/projects/prumo/home.png",
        alt: "Prumo homepage stating the credit-before-apartment order",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/prumo/empreendimentos.png",
        alt: "Prumo catálogo listing Cury launches by neighbourhood",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/prumo/simulador.png",
        alt: "Prumo pre-qualification flow with the plumb-rail progress indicator",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/prumo/proposta.png",
        alt: "Prumo shared proposal page, a personal letter with frozen commercial numbers",
        width: 1440,
        height: 900,
      },
    ],
    process: [
      {
        phase: "01",
        title: "Scaffold and legal identity",
        body: "Next.js and Payload CMS 3 scaffolded together, with the broker's CRECI signature — name, license number, photo, strict proportion rules — built before any page that would need it, since it's a legal requirement on every surface rather than a design nicety.",
      },
      {
        phase: "02",
        title: "Catálogo and the publication gate",
        body: "Property and commercial-condition records that Payload itself refuses to publish until registro and cartório fields are filled — an incomplete legal record can't reach a real visitor by construction.",
      },
      {
        phase: "03",
        title: "The pre-qualification engine",
        body: "MCMV bracket arithmetic, a plumb-rail progress indicator built as a physically simulated rope rather than a keyframed clip, and a result screen that returns every qualification blocker at once instead of one at a time.",
      },
      {
        phase: "04",
        title: "The shared proposal and first deployment",
        body: "A single-use proposal link that freezes its own numbers at creation and hard-blocks generation on an expired price table, shipped to Neon Postgres and Vercel Blob via the Vercel Marketplace integration.",
      },
    ],
    architecture: [
      {
        layer: "Client",
        label: "Next.js App Router",
        detail: "Public marketing, catálogo, pre-qualification, and proposal routes sharing one app with the CMS admin.",
      },
      {
        layer: "CMS",
        label: "Payload CMS 3",
        detail: "Publication-gated property records plus a policy-numbers global flagged as suggestions until confirmed.",
      },
      {
        layer: "Data",
        label: "Neon Postgres + Vercel Blob",
        detail: "One managed database across environments, object storage for renders and floor plans.",
      },
    ],
    features: [
      {
        title: "Five-outcome pre-qualification",
        body: "Approved in-band, approved in a different faixa, above the faixas, outside the program, or an honest 'not yet' — the last returning every blocker at once.",
      },
      {
        title: "Frozen, hard-gated proposals",
        body: "Commercial numbers copied into the document at creation; generation blocked outright by an expired price table.",
      },
      {
        title: "Flagged, not hardcoded, policy numbers",
        body: "MCMV faixas, rates, and subsidy bands live in the admin behind a visible confirmation flag, never shipped as literals in code.",
      },
    ],
    challenges: [
      {
        title: "Housing policy that moves faster than a codebase",
        body: "MCMV brackets shifted by federal portaria mid-project, which pushed unconfirmed numbers into a flagged, admin-editable global instead of code.",
      },
      {
        title: "An honest 'not yet'",
        body: "The fifth outcome had to read as useful rather than a rejection — a returned list of every blocker, not just the first one found.",
      },
    ],
    links: [
      { label: "Visit live preview", href: "https://prumo-drab-three.vercel.app" },
      {
        label: "View source",
        href: "https://github.com/BenitoPedro13/prumo",
      },
    ],
  },
  {
    slug: "outubro",
    title: "Outubro Idiomas",
    tagline: "A language school's site rebuilt around its own verb: destravar",
    index: "11",
    year: "2026",
    role: "Design and full-stack engineering",
    timeline: "Ongoing — pages built, CMS and content next",
    team: "Solo delivery",
    description:
      "A rebuild of a Brazilian online language school's website in Portuguese, English and Spanish, elevating an identity the brand had already redesigned but its website never caught up with.",
    problem:
      "Outubro Idiomas teaches English, French, Spanish and German to Brazilian working adults in live online classes. It had already redrawn its name, colours and mark; the old site still had the right content but none of the brand. Most visitors are expected to arrive on a phone from WhatsApp, so the site has to convert there first, and every page has to stand on its own in search.",
    approach:
      "The brand's own verb, destravar (to unstick), became the signature interaction: a doodled cord untangles as the hero headline resolves, and 'língua' lands as the cord straightens. The brandbook governs palette, Source Sans as the only typeface and the official lockups. Motion uses GSAP and Lenis with WebGL deliberately rejected, to protect mobile performance. Every page exists in three locales with localized URLs, and pricing, FAQ and testimonials read from Payload-shaped stand-ins so the CMS can replace them without touching a page.",
    outcome:
      "All pages built in PT, EN and ES on a preview deployment: a 13-section home, method, pricing, testimonials, FAQ, contact, careers and privacy. The CMS and the final content pass with the client come next; testimonials stay openly placeholder until real ones arrive.",
    category: "sites",
    tags: ["Landing Page", "Motion", "i18n"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS v4", "shadcn/ui", "GSAP", "Lenis"],
    visual: "language",
    cover: {
      src: "/projects/outubro/home.png",
      alt: "Outubro Idiomas home: 'Bora destravar sua língua e seu futuro?' beside a WhatsApp-style conversation card",
      width: 1440,
      height: 900,
    },
    screenshots: [
      { src: "/projects/outubro/home.png", alt: "Outubro Idiomas home hero with the destravar headline and a WhatsApp-style card", width: 1440, height: 900 },
      { src: "/projects/outubro/precos.png", alt: "Pricing page: individual and paired classes, monthly price per student", width: 1440, height: 900 },
      { src: "/projects/outubro/metodo.png", alt: "Method page: a communicative approach for Brazilian working adults", width: 1440, height: 900 },
    ],
    process: [
      { phase: "01", title: "Research the brand that already exists", body: "The old site's content was extracted and the references analysed; the job was to elevate a redesigned identity, not invent a new one." },
      { phase: "02", title: "Find the signature in the brand's verb", body: "Destravar became the hero interaction: the untangling cord, drawn like a doodle, timed to the headline." },
      { phase: "03", title: "Three locales, one route map", body: "Portuguese unprefixed, English and Spanish with localized slugs, generated from one explicit route map that keeps /admin safe." },
      { phase: "04", title: "Pages first, CMS behind seams", body: "Every page rendered from Payload-shaped stand-ins, so plugging in the CMS swaps function bodies, not pages." },
    ],
    architecture: [
      { layer: "App", label: "Next.js App Router, [lang]", detail: "Built-in i18n pattern with dictionaries per locale; no i18n library." },
      { layer: "Routing", label: "One localized route map", detail: "Exact rewrites and redirects per page, so /metodo, /en/method and /es/metodo are the same page." },
      { layer: "Motion", label: "GSAP + Lenis, tier 2", detail: "Small client leaves own the animation; WebGL rejected for mobile performance." },
      { layer: "Content", label: "Payload-shaped stand-ins", detail: "Pricing, FAQ and testimonials behind get* functions the CMS will implement." },
    ],
    features: [
      { title: "A signature interaction from the brand's own word", body: "The cord untangling as the headline resolves is destravar drawn literally, not a generic unlock icon." },
      { title: "Brandbook first", body: "Palette, Source Sans as the only typeface and the official lockups come from the client's brandbook, overriding design-taste defaults where they conflict." },
      { title: "Localized URLs", body: "Each page has its own slug in each language, so every locale is a real page for search, not a query string." },
    ],
    challenges: [
      { title: "Pretty and fast on a phone", body: "Most visitors are expected to arrive from WhatsApp on a phone, so the motion tier was chosen for mobile performance first and WebGL was left out." },
      { title: "Content not yet chosen", body: "Final copy, testimonials and this year's prices are a pass with the client still open, so the build ships honest placeholders rather than invented ones." },
    ],
    links: [
      { label: "Visit preview", href: "https://outubroidiomas.vercel.app" },
      { label: "View source", href: "https://github.com/BenitoPedro13/outubro" },
    ],
  },
  {
    slug: "unimeet",
    title: "UniMeet",
    tagline: "University fairs sold through one standardised event page, plus the social plan that fills them",
    index: "10",
    year: "2026",
    role: "Full-stack product engineering · social strategy",
    timeline: "Delivered October 2026",
    team: "Solo delivery, with the client's brand designer",
    description:
      "A recruitment website for European universities: an admin-driven event engine where one tour record becomes a standardised fair page ending in a priced registration form, plus Instagram and LinkedIn plans and a post builder rendering the brand's own slides.",
    problem:
      "UniMeet sells stands at university fairs across the Western Balkans and campus visits in Europe. The commercial path is short and unforgiving: event page, registration form, sales conversation, invoice offline. Every fair needed the same page without the content model giving up, the price shown live had to match the price confirmed later, and the buyers were university staff, many at public bodies with their own accessibility expectations.",
    approach:
      "One Payload collection with a kind discriminator drives every fair and campus page in a fixed section order, so a new tour is data entry, not design. Pricing is one pure function in integer cents, run identically in the browser's live preview and in the server hook that freezes a quote snapshot at submission, so a confirmation keeps what was actually quoted. Spam protection uses a honeypot and a hashed-IP rate limit, analytics are self-hosted and cookieless, and the site makes no third-party request from a page, which is why it needs no cookie banner. The social work followed the same rule: research first, then a plan and a builder that renders posts from the CMS.",
    outcome:
      "Delivered on the client's v1 identity at unimeet.eu, with registrations persisted and emailed, axe-clean at 390, 768 and 1440 wide, and a sitemap-driven SEO pass with a generated share card per page. The screenshots here are the proposed v2 design system built alongside it; the client chose to keep v1 live.",
    category: "product",
    tags: ["Event Platform", "CMS", "Social Strategy"],
    stack: ["Next.js", "Payload CMS", "PostgreSQL", "TypeScript", "Tailwind CSS v4", "TanStack Query", "Playwright"],
    visual: "fairs",
    cover: {
      src: "/projects/unimeet/home.png",
      alt: "UniMeet home in the proposed v2 design: a recruitment hero beside the next fair tour card (proposal; v1 is live)",
      width: 1440,
      height: 900,
    },
    screenshots: [
      { src: "/projects/unimeet/home.png", alt: "UniMeet home in the proposed v2 design, next fair tour beside the hero (proposal; v1 is live)", width: 1440, height: 900 },
      { src: "/projects/unimeet/fair-tour.png", alt: "The EBEUF 2027 fair tour page in the proposed v2 design: four cities, dates and per-city stand prices (proposal)", width: 1440, height: 900 },
      { src: "/projects/unimeet/university-fairs.png", alt: "University fairs index in the proposed v2 design, filterable by country and season (proposal)", width: 1440, height: 900 },
      { src: "/projects/unimeet/for-universities.png", alt: "For Universities page in the proposed v2 design (proposal)", width: 1440, height: 900 },
      { src: "/projects/unimeet/instagram-plan.png", alt: "UniMeet's Instagram plan page: research, strategy and the first posts, rendered from the CMS", width: 1440, height: 900 },
      { src: "/projects/unimeet/linkedin-plan.png", alt: "UniMeet's LinkedIn plan page: the buyer-side companion to the Instagram plan", width: 1440, height: 900 },
    ],
    process: [
      { phase: "01", title: "The pitch, in three identities", body: "The proposal that won the contract was itself a page, rendered in three candidate identities from one content source, then retired once the client's designer delivered the real brand." },
      { phase: "02", title: "One content model for every fair", body: "Tours, universities, schools and registrations in Payload; one kind discriminator and a fixed section order keep every event page standardised instead of a free-form page builder." },
      { phase: "03", title: "Pricing that can't drift", body: "A single pricing function in integer cents, tested under a non-UTC timezone, powers the live preview and freezes a quote at submission; a forged price in a raw request is stripped before the hook runs." },
      { phase: "04", title: "Social plans and a post builder", body: "Ten competitor accounts read, then Instagram and LinkedIn plans as pages, with a staff-only builder that renders posts from tours and fair cities in the brand's own templates." },
    ],
    architecture: [
      { layer: "App", label: "Next.js + Payload in one app", detail: "The admin ships with the site; pages are static and revalidated from Payload hooks." },
      { layer: "Data", label: "PostgreSQL on Neon, EU region", detail: "Every schema change goes through a reviewed migration." },
      { layer: "Money path", label: "lib/pricing.ts", detail: "One pure function for the live preview and the frozen server quote, in integer cents." },
      { layer: "Social", label: "lib/social on lib/og", detail: "Slides rendered server-side as the file to post, so the preview and the download can't differ." },
    ],
    features: [
      { title: "A standardised event engine", body: "A new fair tour is a record, not a design job: the same sections, in the same order, ending in the same registration form." },
      { title: "A quote frozen at submission", body: "Tour prices can change later; a confirmation always shows the price the university was actually quoted." },
      { title: "No cookie banner needed", body: "Self-hosted fonts, cookieless analytics through a same-origin path, and no third-party request from any page." },
    ],
    challenges: [
      { title: "The client kept v1", body: "A richer v2 design system was built page by page as isolated routes, so nothing on the live site changed while it was reviewed; the client chose to stay on v1, and v2 remains a proposal." },
      { title: "Dates a day early", body: "Payload stores dates as UTC midnight; formatting them in local time printed every fair a day early on any host west of UTC, so every stored date is now formatted in UTC and the tests run in São Paulo time." },
      { title: "An email that could hang a registration", body: "Nodemailer's default timeouts would have let an unreachable mail server hold a registration open for minutes; explicit timeouts keep the submission fast and record the email as failed instead." },
    ],
    links: [{ label: "Visit live site (v1)", href: "https://www.unimeet.eu" }],
  },
  {
    slug: "sua-mesa-fit",
    title: "Sua Mesa Fit",
    tagline: "A custom Shopify storefront without a theme-shaped ceiling",
    index: "03",
    year: "2024",
    role: "Frontend product engineering",
    timeline: "2 months",
    team: "Small delivery team",
    description:
      "An online food store where shop management stays in Shopify while the entire customer-facing site is custom-built, distinctive, and fast.",
    problem:
      "Shopify themes are quick to launch and hard to differentiate. The client needed Shopify's operational reliability for inventory, orders, payments, and fulfillment, but a storefront with full control over identity, layout, search, and performance.",
    approach:
      "The storefront is headless. Shopify remains the source of truth for commerce operations while a separate Hydrogen application renders the customer experience from Storefront API data. Checkout stays on battle-tested Shopify infrastructure instead of being rebuilt unnecessarily.",
    outcome:
      "A custom, server-rendered storefront with fast search and cart shipping calculation, backed by the Shopify operations the client already trusted.",
    category: "sites",
    tags: ["E-commerce", "Shopify", "Custom storefront"],
    stack: ["Hydrogen", "Remix", "Shopify", "TypeScript", "GraphQL"],
    visual: "commerce",
    cover: {
      src: "/projects/sua-mesa-fit/product-hero.png",
      alt: "Sua Mesa Fit product presentation page",
      width: 1086,
      height: 1313,
    },
    screenshots: [
      {
        src: "/projects/sua-mesa-fit/product.png",
        alt: "Sua Mesa Fit product customization page",
        width: 1086,
        height: 3410,
      },
      {
        src: "/projects/sua-mesa-fit/about.png",
        alt: "Sua Mesa Fit about page with team and brand story",
        width: 1086,
        height: 4260,
      },
      {
        src: "/projects/sua-mesa-fit/blog.png",
        alt: "Sua Mesa Fit blog listing page",
        width: 1086,
        height: 2450,
      },
      {
        src: "/projects/sua-mesa-fit/parcerias.png",
        alt: "Sua Mesa Fit partner signup page",
        width: 1086,
        height: 2996,
      },
    ],
    process: [
      {
        phase: "01",
        title: "Audit the catalogue",
        body: "Products, variants, collections, and availability rules were mapped first because the data model determines what the interface can express.",
      },
      {
        phase: "02",
        title: "Build the commerce system",
        body: "Product cards, variant selectors, search results, cart lines, and price states became reusable components before pages were assembled.",
      },
      {
        phase: "03",
        title: "Optimize product discovery",
        body: "GraphQL query shape and result rendering were tuned around the search path where conversion friction is most visible.",
      },
      {
        phase: "04",
        title: "Connect cart and shipping",
        body: "Optimistic cart updates stay responsive while Shopify remains authoritative for lines, totals, and shipping calculations.",
      },
    ],
    architecture: [
      {
        layer: "Storefront",
        label: "Hydrogen / Remix",
        detail: "Server-rendered routes with nested data loading and commerce-aware caching.",
      },
      {
        layer: "Customer data",
        label: "Shopify Storefront API",
        detail: "Products, collections, search, variants, and cart mutations over GraphQL.",
      },
      {
        layer: "Privileged operations",
        label: "Shopify Admin API",
        detail: "Server-only access for operations that must never expose elevated credentials.",
      },
      {
        layer: "Commerce",
        label: "Shopify checkout",
        detail: "Payments, tax, orders, and fulfillment remain on mature platform infrastructure.",
      },
    ],
    features: [
      {
        title: "Purpose-built storefront UI",
        body: "The customer experience is composed from custom components rather than constrained by a purchased theme.",
      },
      {
        title: "Fast product search",
        body: "Route-specific GraphQL queries keep discovery payloads focused and responsive.",
      },
      {
        title: "Shipping-aware cart",
        body: "Customers see cart state and shipping feedback before committing to checkout.",
      },
    ],
    challenges: [
      {
        title: "GraphQL over-fetching",
        body: "Each route requests only the fields it renders so catalogue growth does not inflate every payload.",
      },
      {
        title: "Cart consistency",
        body: "Optimistic updates keep interactions immediate while server reconciliation preserves Shopify as the source of truth.",
      },
      {
        title: "Variant complexity",
        body: "The selector prevents impossible option combinations and keeps availability legible as dimensions multiply.",
      },
    ],
    links: [
      { label: "Visit live site", href: "https://suamesafit.com" },
      {
        label: "View source",
        href: "https://github.com/BenitoPedro13/sua-mesa-fit",
      },
    ],
  },
  {
    slug: "markado",
    title: "Markado",
    tagline: "Service scheduling with a real calendar and payments",
    index: "01",
    year: "2025",
    role: "Full-stack product engineering",
    timeline: "Ongoing",
    team: "Focused product team",
    description:
      "A booking website where a professional shares one link, clients pick a free time slot, and the meeting plus the payment are handled automatically.",
    problem:
      "Booking a service still runs on message threads. Someone asks for a time, the provider checks a calendar, both sides go back and forth, and payment happens somewhere else. Every manual handoff creates room for double bookings, forgotten meetings, and unpaid sessions.",
    approach:
      "The product uses one scheduling surface as the source of truth for availability, the calendar event, and the payment. A provider defines working rules once. Every free slot, Google Calendar entry, Meet link, and Stripe checkout derives from those rules instead of being coordinated by hand.",
    outcome:
      "A conversation becomes a confirmed, paid, calendar-synced appointment in about thirty seconds, with no manual step for the provider.",
    category: "product",
    tags: ["Booking", "Payments", "Automation"],
    stack: [
      "Next.js",
      "TypeScript",
      "tRPC",
      "Prisma",
      "PostgreSQL",
      "Stripe",
      "Google Calendar",
      "Docker",
    ],
    visual: "calendar",
    cover: {
      src: "/projects/markado/agendamentos.png",
      alt: "Markado appointments dashboard",
      width: 1440,
      height: 900,
    },
    screenshots: [
      {
        src: "/projects/markado/agendamentos.png",
        alt: "Markado appointments dashboard",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/markado/disponibilidade.png",
        alt: "Markado weekly availability editor",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/markado/booking-page.png",
        alt: "Markado public booking page as seen by a client",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/markado/servicos.png",
        alt: "Markado booking form question editor",
        width: 1440,
        height: 900,
      },
    ],
    process: [
      {
        phase: "01",
        title: "Map every booking state",
        body: "Requested, confirmed, paid, rescheduled, cancelled, and no-show states were defined before the database schema so the product could recover cleanly from every transition.",
      },
      {
        phase: "02",
        title: "Model availability first",
        body: "Availability became a pure server-side function of working rules, calendar events, buffers, notice periods, and timezone instead of UI state.",
      },
      {
        phase: "03",
        title: "Layer integrations safely",
        body: "Google OAuth, Calendar read/write, Meet conferencing, and Stripe were added behind separate boundaries so one provider failure cannot corrupt the full booking flow.",
      },
      {
        phase: "04",
        title: "Automate delivery",
        body: "Type checking, linting, tests, container builds, and deployment run through the delivery pipeline so shipping is repeatable rather than ceremonial.",
      },
    ],
    architecture: [
      {
        layer: "Client",
        label: "Next.js App Router",
        detail: "Server-rendered booking pages with an interactive slot selection surface.",
      },
      {
        layer: "API",
        label: "tRPC",
        detail: "One end-to-end typed contract between product UI and backend procedures.",
      },
      {
        layer: "Data",
        label: "PostgreSQL + Prisma",
        detail: "Versioned relational models for users, working rules, event types, and bookings.",
      },
      {
        layer: "Integrations",
        label: "Google Calendar / Meet · Stripe",
        detail: "Calendar truth, automatic conferencing, checkout, and webhook confirmation.",
      },
    ],
    features: [
      {
        title: "Live availability engine",
        body: "Slots are computed against real calendar data, timezones, buffers, and notice periods rather than exposed as a static list.",
      },
      {
        title: "Automatic meeting setup",
        body: "A confirmed booking creates the calendar event and conferencing details for both sides.",
      },
      {
        title: "Payment inside the flow",
        body: "Checkout happens before confirmation, so a reserved slot and a paid slot cannot drift apart.",
      },
    ],
    challenges: [
      {
        title: "Timezone correctness",
        body: "Every moment is stored in UTC and converted only at the display edge with the intended timezone captured explicitly.",
      },
      {
        title: "Simultaneous booking attempts",
        body: "Availability is revalidated during the final transaction so two clients cannot silently claim the same slot.",
      },
      {
        title: "External API failure",
        body: "Calendar and payment failures remain isolated and visible instead of leaving a booking in an unknown state.",
      },
    ],
    links: [
      {
        label: "View source",
        href: "https://github.com/BenitoPedro13/markado",
      },
    ],
  },
] as const;

export function getStudioProject(slug: string) {
  return STUDIO_PROJECTS.find((project) => project.slug === slug);
}

/** The About page's values chips. Verbatim from the brand identity — these are
 * named words, not a paraphrasable list (CLAUDE.md §0). */
export const STUDIO_VALUES = [
  "Clarity",
  "Craft",
  "Integrity",
  "Quiet confidence",
  "Long-term thinking",
  "Respect for attention and time",
] as const;

export type StudioPillar = {
  /** Also the traveling token on `/about`: A hands off to B, and B to the 0
   * that closes the page. Change one and the handoff has nothing to carry. */
  id: string;
  title: string;
  lead: string;
  titleLine: string;
  roles: readonly string[];
  paragraphs: readonly string[];
};

/** Moved out of `src/app/about/page.tsx` when the page became a morph stage —
 * two components read it now, so a route file is no longer its right home. */
// Two disciplines of Benito's solo studio; these are not separate people.
export const STUDIO_PILLARS: readonly StudioPillar[] = [
  {
    id: "A",
    title: "Strategy, Content & Brand Identity",
    lead: "Benito Pedro Xavier",
    titleLine: "Founder · Strategy & Design",
    roles: ["Client Consultation", "Content Strategy", "Brand Identity", "Web Design"],
    paragraphs: [
      "Work directly with Benito to define the audience, offer and scope before production begins.",
      "Research and clear positioning guide the brand, website and content plan. Each deliverable has a purpose and an agreed place in the project.",
      "Social media strategy connects buyer questions to a practical calendar and a measurement plan. Ongoing production and publishing are scoped separately.",
    ],
  },
  {
    id: "B",
    title: "Architecture & Full-Stack Development",
    lead: "Benito Pedro Xavier",
    titleLine: "Founder · Engineering & Delivery",
    roles: ["Software Engineering", "API Architecture", "Full-Stack Development", "Web Design"],
    paragraphs: [
      "The same person who helps define the project designs and builds the system.",
      "Benito handles interfaces, APIs and data architecture with the project's actual workflow and constraints in view.",
      "A clear scope, considered implementation and honest handover keep the work understandable from the first conversation through delivery.",
    ],
  },
] as const;
