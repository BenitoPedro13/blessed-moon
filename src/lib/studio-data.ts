export type ProjectVisualVariant = "calendar" | "analytics" | "commerce";

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
      {
        label: "View source",
        href: "https://github.com/BenitoPedro13/bee-dash-monorepo",
      },
    ],
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
export const STUDIO_PILLARS: readonly StudioPillar[] = [
  {
    id: "A",
    title: "Client Consultation, Strategy & Brand Identity",
    lead: "Myelle de Raat",
    titleLine: "Co-Founder (CEO) · Chief Creative Officer (CCO)",
    roles: [
      "Marketing Strategist",
      "Brand Identity & Visual Designer",
      "Backend Web Developer",
      "Web Designer",
    ],
    paragraphs: [
      "Serving as your primary partner for high-level consultations, ideation, and project-scoping sessions.",
      "This pillar directs the commercial growth strategy, market positioning, and corporate visual architecture.",
      "Every interface is engineered around conversion-focused UI/UX layouts, ensuring your product resonates deeply with international audiences while maintaining a hardened, secure infrastructure from the front-end up.",
    ],
  },
  {
    id: "B",
    title: "Enterprise Architecture & Full-Stack Development",
    lead: "Benito Pedro Xavier",
    titleLine: "Founder (CEO) · Chief Technology Officer (CTO)",
    roles: [
      "Lead Software Developer / Engineer",
      "API Architect",
      "Full-Stack Web Developer",
      "Web Designer",
    ],
    paragraphs: [
      "Directing the heavy programmatic mechanics, server-side infrastructure, and database ecosystems.",
      "This pillar constructs enterprise-grade software frameworks capable of cross-border scaling.",
      "By developing custom API architectures and deep multi-language software logic, this engine ensures that the invisible foundations of your web application are lightning-fast, ultra-secure, and endlessly adaptable to future business requirements.",
    ],
  },
] as const;
