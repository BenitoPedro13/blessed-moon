// Public content samples inspected 4 October 2026. Qualitative observations,
// not account analytics or a representative sample of publishing frequency.
export const CONTENT_ACCOUNTS = [
  {
    name: "Refokus", kind: "Web / brand agency comparator", audience: "Startup founders and marketing buyers; buyer overlap is inferred from its offers and cases.",
    lesson: "Pair project evidence with a buyer question. Benito can explain a specific Oishi decision without borrowing someone else's testimonial or results.",
    samples: [
      { label: "Brightwave testimonial", href: "https://www.linkedin.com/posts/refokusagency_testimonial-webdesign-digitalexperience-activity-7284539739670536192-Pbw3", observation: "Client endorsement introduces a landing-page project; text and an image attachment lead to a contact invitation." },
      { label: "Creative briefing misalignment", href: "https://www.linkedin.com/posts/refokusagency_marketingagency-webdesign-creative-activity-7282372909912743936-QsSA", observation: "A familiar briefing problem introduces an educational article; an article link and reader question provide the next steps." },
    ],
    stories: ["one-action", "studio-questions", "brief-questions"],
  },
  {
    name: "Clay", kind: "Product / brand agency comparator", audience: "Product leaders and established digital businesses; a larger-budget comparator, not a matched solo studio.",
    lesson: "Put the design choice beside the screen. Keep explanations specific and substantiate any psychological or commercial claims.",
    samples: [
      { label: "Marqeta interface case", href: "https://www.linkedin.com/posts/clayglobal_webdesign-webdesigner-website-activity-7242185850082541568-RUSo", observation: "A named client project is introduced through interface, design-system and user needs; the CTA opens a full case study." },
      { label: "Website simplicity education", href: "https://www.linkedin.com/posts/clayglobal_webdesign-webdesigner-website-activity-7290760789416681472-hRk7", observation: "An educational explanation of simplicity and cognitive load links to a longer article. Treat factual assertions as claims needing separate verification." },
    ],
    stories: ["markado-slot", "flora-satellite", "fa-honest-price", "prumo-credit", "bee-dash-metrics", "headless-shopify", "screenshot-context", "oishi-condition", "furniture-dimensions", "confirmed-information"],
  },
  {
    name: "Netguru", kind: "Product engineering comparator", audience: "Founders and product teams commissioning software; scale and staffing differ substantially from Blessed Moon.",
    lesson: "Make technical decisions legible to buyers. Use the actual catalogue workflow and constraints; do not transfer another agency's case numbers.",
    samples: [
      { label: "AI-ready design systems", href: "https://www.linkedin.com/posts/netguru_ai-design-systems-how-to-build-for-automation-activity-7417113246618353664-A8_N", observation: "An operational design-system problem introduces naming, tokens and documentation as concrete choices in an educational post." },
      { label: "Founder shares Candis mobile case", href: "https://www.linkedin.com/posts/wiktorschmidt_digitalacceleration-mobileappdevelopment-activity-7059920092762902528-B8IU", observation: "Co-founder Wiktor Schmidt summarises a named MVP case with reported results and a full-case link. This is a founder-channel sample, not a company-feed post." },
    ],
    stories: ["smallest-system"],
  },
  {
    name: "Superside", kind: "Creative service comparator", audience: "In-house marketing and creative leaders; useful packaging reference, not a local-business price benchmark.",
    lesson: "Explain the service through an actual operational problem. A solo studio should show Benito and a clear scope rather than imitate enterprise production volume.",
    samples: [
      { label: "Shift summit host invitation", href: "https://www.linkedin.com/posts/superside_between-the-pressure-and-the-hype-its-getting-activity-7439359451049996288-0lhC", observation: "A named practitioner introduces creative-team AI questions in a video invitation; the CTA is event registration." },
      { label: "Creative-team campaign", href: "https://www.linkedin.com/posts/superside_q4-chaos-ai-slop-creative-teams-riding-activity-7384626689353486336-vEdB", observation: "An operational-pressure hook introduces its creative-support proposition and a San Francisco campaign. The visible text does not establish campaign effectiveness." },
    ],
    stories: ["strategy-contents", "likes-intent", "which-service"],
  },
  {
    name: "RD Station", kind: "Same-audience educator / software vendor", audience: "Brazilian business owners and marketing/sales teams; competes for attention, not directly for a bespoke studio website.",
    lesson: "Teach through a familiar business workflow. Use F&A's catalogue to explain a next step, rather than copying software-vendor promises.",
    samples: [
      { label: "Integrated WhatsApp selling", href: "https://pt.linkedin.com/posts/rd-station_vender-pelo-whatsapp-rd-station-activity-7095837565122965504-9nWc", observation: "A question about an integrated sales workflow introduces CRM software with a linked product destination." },
      { label: "AI, strategy and sales podcast", href: "https://pt.linkedin.com/posts/rd-station_marketing-vendas-ia-activity-7442676050637041664-RZVC", observation: "Named guests discuss a business topic in a podcast/video excerpt, with a listen-to-the-episode invitation." },
    ],
    stories: ["website-details", "catalogue-whatsapp", "restaurant-answers"],
  },
] as const;

export const PLATFORM_DECISIONS = [
  { name: "LinkedIn", priority: "Primary, with English Instagram", fit: "Founders, product leaders and premium project buyers, mostly international. Publish through Benito's profile; use the studio page as supporting proof.", test: "Two decision stories weekly in English: a text post with the same carousel as the English Instagram account, as a square PDF document.", signal: "Relevant profile/post viewers where available, case visits, qualified conversations and proposals. Review at day 30 and day 60." },
  { name: "Instagram", priority: "Primary in English; Portuguese optional", fit: "English account (@blessedmoon.studio) for international founders and product leaders. An optional second account in Portuguese for Brazilian small businesses, using the restaurant and retail cases.", test: "Two English carousels weekly, as a professional account so native insights are available. If the Portuguese account opens, one carousel weekly. Test a short screen recording later against actual insights.", signal: "Saves/shares, relevant DMs, tagged profile/Story visits and qualified enquiries. The Instagram audit informs creative structure, not performance. Record this account’s actual buyer conversations and insights." },
  { name: "WhatsApp Business", priority: "Conversion channel, conditional", fit: "Useful for Brazilian buyer conversations after discovery, if Benito chooses to provide an official business number.", test: "Agree response hours and an enquiry process before adding it. Use the current website contact path until configured.", signal: "Real conversations and fit recorded manually; link clicks alone do not establish leads." },
  { name: "YouTube", priority: "Later", fit: "Deeper case explanations and searchable buyer education, once a repeatable story series proves useful.", test: "Only start when a monthly case walkthrough fits the recorded production budget. No launch commitment in this pilot.", signal: "Watch quality and relevant website conversations, reviewed against production time." },
  { name: "TikTok", priority: "Defer", fit: "A possible discovery experiment, but the current research does not establish Blessed Moon's target-buyer demand there.", test: "Reconsider if buyer interviews or inbound conversations support it and short video is already sustainable.", signal: "Qualified buyer interest per production hour; do not choose it on broad popularity alone." },
  { name: "Facebook", priority: "Optional reuse", fit: "May support local relationships; no separate editorial workload is justified by the current evidence.", test: "Reuse approved Instagram material only if existing page/community conversations are relevant. Check each group's rules before participating.", signal: "Relevant local conversations and case visits; avoid measuring duplicated posts as new original ideas." },
  { name: "Behance / Dribbble / X", priority: "Supporting or deferred", fit: "Portfolio discovery and peer visibility may help, but designer attention does not automatically mean buyer demand.", test: "Reuse a case when useful; no weekly content commitment. Reconsider X only with evidence that intended buyers are active there.", signal: "Qualified referrals and project enquiries, rather than applause from peers." },
] as const;
