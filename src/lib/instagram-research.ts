import coverage from "../../docs/social/corpus/coverage.json";

// Original qualitative notes from Benito's browser exports, reviewed 5 October
// 2026. Only aggregate counts and source links ship; raw captions/media stay local.
export const INSTAGRAM_COVERAGE = coverage;
export const INSTAGRAM_AUDIT_DATE = "5 October 2026";
export const INSTAGRAM_ACCOUNTS = [
  {
    handle: "refokusagency", role: "Website / brand agency reference",
    observation: "The cover grid mixes website cases, attributed client quotes, article questions, recognition and team material. The captured GoodRoots caption connects a customer's business proposition to a website case; the Umault post uses an attributed testimonial and reported results.",
    lesson: "Give a real screen a business context, then open the case. Blessed Moon can show Oishi's offer condition; another agency's testimonial and claimed gains cannot support our results.",
    samples: [{ code: "DHVn7uOsWJk", label: "GoodRoots website case", depth: "Caption + cover; one inner image, partial carousel" }, { code: "DH5Ye4asLfR", label: "Umault testimonial", depth: "Caption + cover + single visible image" }],
    stories: ["one-action", "studio-questions", "fa-honest-price", "website-details", "brief-questions", "confirmed-information"],
  },
  {
    handle: "clayglobal", role: "Product / website agency reference",
    observation: "Project visuals and product screens carry the cover grid. Captions explain choices: Q2's product range informs the icon system, and Reyes Beverage's marketing site and distributor sites share a component structure and CMS.",
    lesson: "Explain the decision beside the screenshot. F&A's existing sales workflow, Oishi's condition and Flora's task flow are stronger evidence than a generic design slogan.",
    samples: [{ code: "Dd6d0xGDWNL", label: "Q2 design-system choices", depth: "Caption + grid cover; inner media unavailable" }, { code: "DcyfphODVo4", label: "Reyes shared website system", depth: "Caption + cover; one inner image, partial carousel" }],
    stories: ["markado-slot", "headless-shopify", "smallest-system", "screenshot-context", "oishi-condition", "catalogue-whatsapp", "furniture-dimensions"],
  },
  {
    handle: "wearetonik", role: "Startup product-design agency reference",
    observation: "The grid mixes product/identity presentations with designer meetups and rejected design explorations. The Generation Lab caption explains a reversed header through the client's mission; Syncle's caption connects visual choices to the product experience.",
    lesson: "Use constraint → choice → visible result. Meeting announcements and unused-logo series are peer content, so they do not become the core buyer-facing plan.",
    samples: [{ code: "DcTKeu4CODA", label: "Generation Lab mission and header", depth: "Caption + cover; traversal stopped on a repeated slide" }, { code: "DctD7EwiKgY", label: "Syncle product presentation", depth: "Caption + grid cover; inner media unavailable" }],
    stories: ["flora-satellite", "screenshot-context", "smallest-system"],
  },
  {
    handle: "ramotion", role: "Brand / product / website agency reference",
    observation: "Named client identities, mockups and product screens give the grid concrete subjects. Source's caption explains a complex infrastructure proposition; Firefox's caption introduces a family of product icons and a full-project invitation. Quantexa appears more than once with repeated case copy.",
    lesson: "Reuse one case through distinct decisions, with useful explanation each time. Enterprise growth claims and repeated captions do not establish separate successful content angles.",
    samples: [{ code: "Dak9nkTFpYI", label: "Source infrastructure case", depth: "Caption + cover; two inner images, partial carousel" }, { code: "DYFPTrIMe90", label: "Firefox brand family", depth: "Caption + cover/frame; video not captured" }],
    stories: ["prumo-credit", "bee-dash-metrics", "screenshot-context", "fa-honest-price", "confirmed-information"],
  },
  {
    handle: "baunfire", role: "Business-website agency reference",
    observation: "The 32 available covers mix showreels, cases, cultural events, playlists and studio material. The captured Replicant caption starts with the client's automated-contact-centre proposition, then introduces the website redesign. The trends post points to an article.",
    lesson: "Show the client's problem before the studio's style. Playlist and team content can add personality later; they do not replace proof and a relevant service action.",
    samples: [{ code: "CnxhrHZP9JF", label: "Replicant website brief", depth: "Caption + cover + single visible image" }, { code: "Cx89PxUPWNv", label: "Design-trends article invitation", depth: "Caption + cover; video not captured" }],
    stories: ["studio-questions", "one-action", "prumo-credit", "brief-questions"],
  },
  {
    handle: "cadastra", role: "Adjacent enterprise marketing agency",
    observation: "The grid combines industry events, recognition, reports and attributed case claims. A six-slide generative-discovery report uses a claim-led cover, explanation, an attributed quote and a download invitation. The five-slide Meta Awards sequence connects a category to a named client case.",
    lesson: "Build a sequence with different jobs: question, explanation, example, evidence, action. Use an existing case or service page as the destination; we have no new report to promise.",
    samples: [{ code: "DSCvTo9jEpT", label: "Generative-discovery report", depth: "Caption + six visible slides; no next control observed" }, { code: "Dcy9gL8lKMc", label: "Meta Awards case sequence", depth: "Caption + five visible slides; no next control observed" }],
    stories: ["likes-intent", "bee-dash-metrics"],
  },
  {
    handle: "supersidehq", role: "Adjacent creative-production service",
    observation: "The grid uses bold questions, people, creative-team tensions, events and resources. One eight-slide SHIFT sequence develops familiar workday frustrations into imagined outcomes; a seven-slide version gives five specific reasons to attend, then registration.",
    lesson: "Replace empty title cards with a developed argument and a concrete closing action. Keep the calm Blessed Moon voice and actual service scope; do not promise enterprise volume or imitate an event that does not exist.",
    samples: [{ code: "DclhIlejiB0", label: "SHIFT workday sequence", depth: "Caption + eight visible slides; no next control observed" }, { code: "Dcye02_gdrI", label: "Five reasons to attend", depth: "Caption + seven visible slides; no next control observed" }],
    stories: ["strategy-contents", "which-service"],
  },
  {
    handle: "rdstation", role: "Brazilian buyer educator / software vendor",
    observation: "Covers foreground sales and marketing work, podcast speakers and concrete operational problems. The four-slide Sales Day post links administration fatigue to an event and asks for a comment keyword. A nine-slide podcast sequence develops leadership lessons and offers the episode through another keyword.",
    lesson: "Start with a recognisable business question, deliver a useful answer, then one available action. Our contact and case pages exist; automated keyword DMs and downloadable resources would require separate implementation.",
    samples: [{ code: "Dd9vqVmj0K4", label: "Sales Day problem and action", depth: "Caption + four visible slides; no next control observed" }, { code: "Dd7O4mYDy44", label: "Podcast leadership sequence", depth: "Caption + nine visible slides; no next control observed" }],
    stories: ["catalogue-whatsapp", "restaurant-answers", "website-details"],
  },
  {
    handle: "hubspot", role: "Marketing / sales buyer educator and vendor",
    observation: "The grid mixes product announcements, conference material, people and marketer memes. The Breeze Assistant caption starts with administrative work before introducing the product and its next step. Q4 humour addresses marketers, which is a narrower audience than all business owners.",
    lesson: "Name the task a system supports before listing features. Make the smallest-system story useful to a buyer; memes and vendor performance numbers are not a default studio strategy.",
    samples: [{ code: "DdXyodxGW_C", label: "Breeze operational problem", depth: "Caption + cover + five observed media frames; video not captured" }, { code: "Dd1k_T0F1D9", label: "LOOP framework resource", depth: "Caption + grid cover; inner media unavailable" }],
    stories: ["smallest-system", "likes-intent", "flora-satellite", "markado-slot"],
  },
  {
    handle: "thefuturishere", role: "Design-business peer educator · lower buyer weight",
    observation: "Talking-head and talk-excerpt covers dominate this collected grid, alongside podcast lineups. The captured budget caption lays out a qualification framework; the logo caption teaches creatives and offers a full talk through a keyword. Neither establishes demand from website buyers.",
    lesson: "Borrow the clarity of a worked framework, then address the buyer's brief. Keep designer education and creator pricing out of the main acquisition plan.",
    samples: [{ code: "Ddjkaq2gzXF", label: "Client qualification framework", depth: "Caption + cover; video not captured" }, { code: "C6q4dFlM6oB", label: "Logo teaching and full-talk CTA", depth: "Caption + cover; video not captured" }],
    stories: ["studio-questions", "brief-questions"],
  },
] as const;

export function instagramReferences(story: string) {
  return INSTAGRAM_ACCOUNTS.filter(account => (account.stories as readonly string[]).includes(story)).slice(0, 2);
}
export function instagramPostUrl(code: string) { return `https://www.instagram.com/p/${code}/`; }
