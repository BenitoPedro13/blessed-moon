import { SITE_URL } from "@/lib/site-config";

export const PLAN_DATE = "5 October 2026";
export const PLAN_LINKS = [
  { href: "/social-plan", label: "Strategy" },
  { href: "/instagram-plan", label: "Instagram" },
  { href: "/linkedin-plan", label: "LinkedIn" },
  { href: "/analytics-plan", label: "Measurement" },
  { href: "/post-builder", label: "Post builder" },
] as const;

export const SOURCES = {
  portfolio: { label: "Blessed Moon's project records", href: "/work" },
  sebrae: { label: "Sebrae · Brazilian business channels · June 2025", href: "https://agenciasebrae.com.br/cultura-empreendedora/celular-e-fonte-de-renda-para-pequenos-negocios-sebrae-tem-guia-e-cursos-para-orientar-sobre-uso-das-redes/" },
  edelman: { label: "Edelman–LinkedIn · B2B thought leadership · 2025", href: "https://www.edelman.com/expertise/Business-Marketing/2025-b2b-thought-leadership-report" },
  meta: { label: "Meta · Instagram professional dashboard guidance", href: "https://about.fb.com/news/2024/10/best-practices-education-hub-creators-instagram/" },
  umami: { label: "Umami · Campaign measurement", href: "https://docs.umami.is/docs/guides/measure-campaigns" },
} as const;

export const COMPETITORS = [
  { name: "Duna Design", market: "Brazil", offer: "Advertises planning, creative and management in monthly bundles.", price: "R$590 / R$990 / R$1,290 monthly", lesson: "Make research depth and scope clear; a high post count is a different offer.", href: "https://dunadesign.com.br/consultoria-de-redes-sociais-preco-planos-pacotes/" },
  { name: "CenoDigital", market: "UK", offer: "Website, branding and social services; advertising budget separate.", price: "£750 / £1,200 / £2,200 monthly", lesson: "Connect the website and content, and separate media spend from fees.", href: "https://cenodigital.com/blog/social-media-agency-pricing-uk-2026/" },
  { name: "Siesta Media", market: "Sarasota, US", offer: "Social execution with on-site filming in its service area.", price: "$799 / $1,599 / $3,199 monthly", lesson: "Footage and travel change the workload. Planning does not imply filming.", href: "https://siestasocialmedia.com/pricing/" },
  { name: "Designjoy", market: "Design subscription", offer: "One active design request at a time; adjacent packaging reference.", price: "$5,995 subscription price", lesson: "Explain capacity limits. This is not a comparable social strategy rate.", href: "https://www.designjoy.co/" },
  { name: "Superside", market: "Scale-ups and enterprises", offer: "Audience, brand and social creative production.", price: "Custom scope", lesson: "Creative production and account management are separate responsibilities.", href: "https://www.superside.com/social-media-creative" },
] as const;

export const PILLARS = [
  { name: "Buyer education", share: "35%", detail: "Answer the question a buyer needs to settle before commissioning the work." },
  { name: "Project evidence", share: "35%", detail: "Show an actual screen and explain the business decision behind it." },
  { name: "Process and decisions", share: "20%", detail: "A constraint, the options considered, the choice and its limits." },
  { name: "Service explanation", share: "10%", detail: "Show what a strategy delivers and how to begin a project." },
] as const;

export type Channel = "instagram" | "linkedin";
export type Language = "en" | "pt";
export const LANGUAGES: Record<Language, { label: string; audience: string; htmlLang: string }> = {
  en: { label: "English", audience: "International founders and product leaders", htmlLang: "en" },
  pt: { label: "Português", audience: "Brazilian business owners", htmlLang: "pt-BR" },
};
export type Story = {
  id: string;
  week: number;
  /** English is the primary account; Portuguese is the secondary one (Benito, 5 Oct 2026). */
  lang: Language;
  title: string;
  audience: string;
  format: "Carousel";
  /** The Instagram caption, in the post's language. */
  caption: string;
  /** The LinkedIn post. English stories only; empty for Portuguese ones. */
  linkedin: string;
  visual: string;
  destination: string;
  source: keyof typeof SOURCES;
  evidence: string;
};

// Slides live in social-posts.ts; facts come only from studio-data.ts. Each
// story's evidence note holds the limits that used to be printed on the art.
export const STORIES: readonly Story[] = [
  {
    id: "one-action", week: 1, lang: "en", title: "Your brief lists features. It should name one action.", audience: "Founders preparing a website or product brief", format: "Carousel",
    caption: "Most website briefs are a list of features. The ones that can be scoped name one action: who arrives, what they need to know first, and the single thing they should do next.\n\nOn UniMeet, every fair page answers where, when and what a stand costs, then ends in one registration form. That single decision shaped the whole event engine.\n\nSave the five questions for your next brief. When you have the answers, send them over. Link in bio.",
    linkedin: "Most website briefs I receive are a list of features: a blog, a chatbot, animations. The briefs that can actually be scoped name one action instead.\n\nWho lands on the page? What do they need to know first? What could stop them? What's the one thing they should do? What happens after?\n\nFor UniMeet, which sells stands at university fairs, the action was registering for a fair. So every fair page answers where, when and what a stand costs, and ends in one registration form with a live, server-checked quote. One decision, and the whole event engine followed from it.\n\nWhat's the one action on your next page?",
    visual: "Five slides: hook, the numbered five-question brief, wishlist vs one action, UniMeet's fair page annotated (v2, labelled a proposal), closing action.", destination: "/contact", source: "portfolio", evidence: "UniMeet facts from its repository; the screen is the proposed v2 design (the client kept v1 live). No sales uplift is claimed.",
  },
  {
    id: "markado-slot", week: 2, lang: "en", title: "Two clients. One slot. Only one can book it.", audience: "Founders and product leaders scoping booking or payment flows", format: "Carousel",
    caption: "Two clients open the same free slot at the same moment. In a demo, both bookings succeed.\n\nIn Markado, availability is checked again inside the final transaction, so one booking wins and the other is told. Slots aren't a stored list: they're computed from the provider's working rules, real Google Calendar events, buffers, notice periods and timezone. And checkout happens before confirmation, so a reserved slot and a paid slot can't drift apart.\n\nThe full case is linked in the bio.",
    linkedin: "A booking demo always works, because only one person is clicking.\n\nIn Markado, two clients can open the same free slot at the same moment. Availability is revalidated inside the final transaction, so one booking wins and the other is told, instead of both being confirmed.\n\nThe rest of the design follows from treating a slot as computed, not listed: working rules set once by the provider, real Google Calendar events, buffers, notice periods, and every moment stored in UTC and converted only on screen. Checkout happens before confirmation, so 'reserved' and 'paid' can't drift apart.\n\nWhich failure does your booking flow assume won't happen?",
    visual: "Markado availability screen in the terminal window on the cover; the race condition, the inputs to a slot, payment-before-confirmation, close.", destination: "/work/markado", source: "portfolio", evidence: "Behaviour from the Markado case study (2025, focused product team). No booking volumes are claimed.",
  },
  {
    id: "smallest-system", week: 2, lang: "en", title: "Catalogue, booking or dashboard? Name the job first.", audience: "Founders choosing a software scope", format: "Carousel",
    caption: "Before choosing software, name the job the person needs to finish.\n\nAsk about a product, then message: F&A Móveis is a catalogue with no cart. Pick a time and pay: Markado computes availability and takes payment before confirming. Act on a field reading: Flora is a map, stress zones and a task board.\n\nThree jobs, three different smallest systems. Save this for your next scoping call, and send us the job, not the feature list. Link in bio.",
    linkedin: "'We need payments, accounts, scheduling and a dashboard' is a feature list. 'A client picks a service, sees the free times and pays before the slot is confirmed' is a job, and it can be built.\n\nThree projects, three jobs, three different smallest systems:\n· F&A Móveis: ask about a product, then message the owner. A catalogue with no cart.\n· Markado: pick a time and pay. Availability, calendar and checkout.\n· Flora: act on a field reading. A map, stress zones and a task board.\n\nStart from the job and the system gets smaller.",
    visual: "Paper cover; three jobs mapped to three builds; feature list vs job; F&A catalogue window; close.", destination: "/contact", source: "portfolio", evidence: "Each mapping restates the documented scope of F&A Móveis, Markado and Flora.",
  },
  {
    id: "flora-satellite", week: 4, lang: "en", title: "Satellite pixels in. Field tasks out.", audience: "Product leaders building on external data", format: "Carousel",
    caption: "Flora tells a farmer which corner of which field is stressed, from real Sentinel-2 imagery.\n\nOne rule shaped it: no request ever calls the satellite. A scheduled worker asks Copernicus for imagery, computes ten spectral readings in one call and stores them. The app only reads.\n\nThe worst bugs only appeared against a real account: a missing header that looked like an auth failure, and two indices that painted a rectangle where the field should be. Full case in the bio.",
    linkedin: "Flora shows a farmer which corner of which field is stressed this week, from real Sentinel-2 imagery.\n\nThe rule that shaped the architecture: no request ever calls the satellite provider. A scheduled worker asks Copernicus for imagery, computes ten spectral indices in a single Process API call (measured live at 4.667 Processing Units against a 4.0 baseline: output count is free, input bands set the cost) and writes the results. The API only reads.\n\nThe sharpest bugs never showed up in review. A missing Accept header made Copernicus return a bare TIFF, and the parser's error read exactly like an auth failure. Two of ten indices painted a rectangle where the field polygon should be. Both were found by looking at what actually rendered.",
    visual: "ASCII render of the crop-stress screen as the cover; the no-direct-calls rule; ten readings in one call; the task board; the live-only bugs; close.", destination: "/work/flora", source: "portfolio", evidence: "Figures and bugs from the Flora case study. The product is ongoing; no farm outcomes are claimed.",
  },
  {
    id: "studio-questions", week: 3, lang: "en", title: "7 questions to ask before you hire a studio.", audience: "Founders shortlisting a studio", format: "Carousel",
    caption: "Seven questions to ask any studio before you sign, including us:\n\nWho builds it? What ships first? What happens when a fact is unknown? How is it checked? What does it cost to run? What will need a developer later? Who owns the accounts?\n\nQuestion four matters: on F&A Móveis, every WhatsApp message carried a localhost link until a pass on a real phone caught it. Save this for your shortlist.",
    linkedin: "Seven questions worth asking any studio before you sign, including mine:\n\n1. Who builds it? Names, not a team page.\n2. What ships first?\n3. What happens when a fact is unknown: a placeholder, or a visible gap?\n4. How is it checked? On a real phone, on the live URL.\n5. What does it cost to run each month?\n6. What will need a developer later?\n7. Who owns the domain, hosting and code?\n\nWhy 4: on F&A Móveis an unset site URL fell back to localhost, so every WhatsApp message the live site sent carried a dead link. It looked fine on a laptop. A real-device pass caught it, and the build now fails on that misconfiguration.",
    visual: "Hook cover; the seven questions as rows; two worked answers from F&A and Oishi; close.", destination: "/contact", source: "portfolio", evidence: "The localhost defect and '[a confirmar]' convention are documented in the F&A and Oishi case studies.",
  },
  {
    id: "prumo-credit", week: 5, lang: "en", title: "Listings ask 'which apartment?' Buyers ask 'will I get credit?'", audience: "Founders in regulated or high-anxiety purchases", format: "Carousel",
    caption: "In Minha Casa Minha Vida, the real worry is credit approval, not finishes. Most listing sites still answer 'which apartment?' first.\n\nPrumo asks the credit question first: about a minute, five honest outcomes instead of yes or no, no ID number, no bureau lookup, no uploads. 'Not yet' returns every blocker at once.\n\nWhat does your buyer worry about first? The full case is in the bio.",
    linkedin: "Every listing site in the Minha Casa Minha Vida segment answers 'which apartment?' first. Families are asking something else: 'will I get credit?'\n\nPrumo puts that question first. A six-step pre-qualification returns one of five outcomes, never a binary yes or no: approved in band, approved in a different band, above the bands, outside the programme, or 'not yet', which returns every blocker at once. No ID number, no bureau lookup, no document upload.\n\nPolicy numbers live in the admin, flagged until confirmed against Caixa's tables, because the brackets moved by federal decree mid-project.\n\nWhat question does your buyer need answered before they'll browse?",
    visual: "Pre-qualification window cover; listing vs Prumo order; the five outcomes; what it doesn't ask for; close.", destination: "/work/prumo", source: "portfolio", evidence: "Outcomes and constraints from the Prumo case study. Policy numbers remain flagged as illustrative until confirmed; no approval rates are claimed.",
  },
  {
    id: "screenshot-context", week: 4, lang: "en", title: "A screenshot shows the UI. The decision sells the work.", audience: "Product leaders sharing launches", format: "Carousel",
    caption: "'Our new dashboard is live' tells nobody why to look.\n\nTry four lines instead: who uses it, the task they came to do, the decision that makes it possible, and what it doesn't do yet. Then point at the decision on the screen.\n\nFlora's crop-stress map, annotated, is the example. Save the formula for your next launch post.",
    linkedin: "'Our new dashboard is live' is the most common launch caption, and it gives nobody a reason to look.\n\nA four-line formula that works better:\nWho: the person using it.\nTask: what they came to do.\nDecision: the choice that makes it possible.\nLimit: what it doesn't do yet.\n\nFor Flora's crop-stress screen: a farmer, finding which corner of which field is stressed this week, because the stressed zone is clipped to the field's real boundary and each detection can become a task. Some spectral indices show as disabled because the pipeline can't produce them yet.",
    visual: "Hook cover; vague vs useful caption; the annotated Flora stress map; the four-line formula; close.", destination: "/work", source: "portfolio", evidence: "Flora details from the case study. The formula is an editorial recommendation, not a measured result.",
  },
  {
    id: "strategy-contents", week: 5, lang: "en", title: "What a content plan should hand you: briefs, not topics.", audience: "Founders considering content planning", format: "Carousel",
    caption: "A calendar that says 'Monday: post about the brand' leaves all the real decisions to whoever has to produce it.\n\nA usable plan hands you four things: research (buyer questions, competitors, channels), direction (positioning and pillars), briefs (question, evidence, format, destination) and measurement (tagged visits and qualified enquiries).\n\nWe delivered exactly this for UniMeet: research, a strategy and a first month of posts, rendered from their CMS. Strategy isn't production; those are separate scopes. The service is linked in the bio.",
    linkedin: "A content calendar row that says 'Monday: post about the brand' isn't a plan. Whoever produces it still has to decide everything.\n\nA row someone can actually produce: 'Explain one price condition with the real Oishi page, then link the case.' A question, the evidence, a format, a destination.\n\nThat's what a strategy should hand over: research, direction, briefs written to that standard, and a measurement plan based on tagged visits and qualified enquiries rather than likes. Production, publishing and community management are separate scopes, quoted separately.",
    visual: "Moon cover; topic vs brief; the four deliverables; UniMeet's delivered plan; scope note; close.", destination: "/services/social-media", source: "edelman", evidence: "Describes the proposed service scope. Pricing stays off public posts until approved.",
  },
  {
    id: "bee-dash-metrics", week: 6, lang: "en", title: "Reach on one platform isn't reach on another.", audience: "Marketing and product leads comparing channels", format: "Carousel",
    caption: "Influencer reporting usually means someone copying each creator's numbers into a spreadsheet, and by the time it's done the campaign has moved on.\n\nBee Dash started by agreeing what reach, engagement and performance mean across platforms. Each platform's adapter maps into that one schema, so creators are compared on equivalent numbers.\n\nRate limits, platform changes and growing history each got a deliberate answer. Case in the bio.",
    linkedin: "'Reach' on one platform isn't 'reach' on another, and a spreadsheet hides that.\n\nBee Dash started before any adapter code: the team defined reach, engagement and campaign performance across platforms first. Each platform's adapter then handles its own authentication, pagination and rate limits and maps into that one schema, so creators are compared on equivalent metrics instead of platform-specific vanity numbers.\n\nWhat broke in production, and the answers: rate limits (batched, scheduled, backed off on purpose), platform schema changes (contained in each adapter), growing history (trend queries without full-history scans).",
    visual: "Campaigns window cover; define the metric first; spreadsheet vs live view; production problems; close.", destination: "/work/bee-dash", source: "portfolio", evidence: "From the Bee Dash case study (2024, small delivery team). No campaign results are claimed.",
  },
  {
    id: "headless-shopify", week: 7, lang: "en", title: "Keep Shopify. Lose the theme.", audience: "E-commerce founders outgrowing a theme", format: "Carousel",
    caption: "Shopify themes are quick to launch and hard to make your own.\n\nSua Mesa Fit kept Shopify for what it's good at (inventory, orders, payments, checkout) and built a custom storefront on top: its own design, search queries shaped per route, and a cart that answers instantly while Shopify still decides the totals.\n\nOutgrown your theme? The case is linked in the bio.",
    linkedin: "The choice isn't 'Shopify or custom'. Sua Mesa Fit kept Shopify running the business (inventory, orders, payments, checkout) and replaced only the storefront.\n\nThe customer-facing site is a custom, server-rendered app reading the Storefront API: its own components instead of a theme, search queries shaped per route so the catalogue can grow without inflating every payload, and an optimistic cart that responds immediately while Shopify stays the source of truth for lines, totals and shipping.",
    visual: "Product-page window cover on paper; who does what; theme vs headless; the cart detail; close.", destination: "/work/sua-mesa-fit", source: "portfolio", evidence: "From the Sua Mesa Fit case study (2024). No performance or revenue figures are claimed.",
  },
  {
    id: "likes-intent", week: 7, lang: "en", title: "Likes measure attention. Enquiries measure fit.", audience: "Founders evaluating content results", format: "Carousel",
    caption: "Likes tell you a post got attention. They don't tell you whether the right buyer arrived.\n\nAsk four questions in order: did the right person see it, did they visit the page, did they get in touch, and was it the right work?\n\nAnd read medians, not one viral post. Save the four questions.",
    linkedin: "Likes measure attention. Enquiries measure fit. Most content reports stop at the first.\n\nFour questions, in order, for every post:\n1. Did the right person see it? Saves, shares, relevant replies.\n2. Did they visit the page? A tagged visit to the linked case.\n3. Did they get in touch? An enquiry carrying the campaign tag.\n4. Was it the right work? Qualified, then a proposal.\n\nCompare similar formats over weeks. One popular post isn't a reason to change positioning; a modest post that brings the right enquiry is a reason to repeat it.",
    visual: "Hook cover; the four questions; medians rule; close.", destination: "/services/social-media", source: "umami", evidence: "A measurement method, not results. No account metrics are connected.",
  },

  {
    id: "renewable-pulse", week: 1, lang: "en", title: "No synthetic data. Anywhere.", audience: "Founders and product leaders building on data", format: "Carousel",
    caption: "Renewable Pulse is a live panel of how much electricity already comes from renewables, in Brazil, Europe and the USA. Every reading traces back to a real ONS, ENTSO-E or EIA response; a missing source shows as missing.\n\nThe sources are polled, not pushed, and the product says so. The real-time part is the pipeline: 366,336 plant/hour readings ingested with zero duplicates on replay, a dead-letter queue and the health of the pipeline on the dashboard itself.\n\nCase and source in the bio.",
    linkedin: "Renewable Pulse shows how much electricity already comes from renewables, starting with Brazil's hydro-heavy grid and comparing Europe and the USA. One rule shaped it: every reading traces back to a real ONS, ENTSO-E or EIA response. No synthetic data, anywhere; a missing source is shown as missing.\n\nNone of the sources stream, and the README says so. The streaming standard is in the pipeline instead: a Go ingestion edge, Redpanda, idempotent consumers into TimescaleDB keyed on source, zone, asset, metric and timestamp (366,336 ONS readings, zero duplicates on replay), a dead-letter queue and bounded backpressure. The dashboard shows the pipeline's own health, not just the charts.",
    visual: "Live dashboard cover; the three sources; polled-not-pushed; replays; the annotated pipeline-health panel; close with the moon.", destination: "/work/renewable-pulse", source: "portfolio", evidence: "Figures from the Renewable Pulse README and case study. The product is Benito's own; no usage numbers are claimed.",
  },
  {
    id: "unimeet-quote", week: 3, lang: "en", title: "The price on the page is the price on the invoice.", audience: "Founders with pricing or checkout logic", format: "Carousel",
    caption: "UniMeet sells stands at university fairs. The price a university sees while filling in the form is computed by the same function the server uses to record the registration, in integer cents, and frozen at submission. Tour prices can change later; the quote can't. A price sent in a forged request is dropped before pricing runs.\n\nThe screens are our proposed v2 design; the client kept v1 live. Case in the bio.",
    linkedin: "For a business that invoices after a form, the most expensive bug is a quote that disagrees with the invoice.\n\nOn UniMeet, one pure pricing function in integer cents runs in two places: the live preview inside the registration form, and the server hook that records the registration and freezes a quote snapshot. Tour prices can change later; what the university was quoted can't. A price sent in a raw request is stripped before the hook runs.\n\nOne bug testing caught: dates stored as UTC midnight printed a day early anywhere west of UTC. They're formatted in UTC now, and the tests run in São Paulo time.",
    visual: "Fair-page cover (v2, labelled a proposal); one function; three rules; the date bug; close.", destination: "/work/unimeet", source: "portfolio", evidence: "From the UniMeet repository's task docs. v2 screens are a proposal; the client kept v1 live. No sales figures are claimed.",
  },
  {
    id: "outubro-destravar", week: 6, lang: "en", title: "A brand's own verb became the hero.", audience: "Founders whose brand outgrew their website", format: "Carousel",
    caption: "Outubro Idiomas had already redrawn its brand; its website hadn't caught up. The brand's verb, destravar (to unstick), became the hero: a doodled cord untangles as the headline resolves, and 'língua' lands as it straightens.\n\nThree languages with their own URLs, and WebGL left out on purpose so phones stay fast. In progress; the preview is in the bio.",
    linkedin: "Outubro Idiomas, a Brazilian online language school, had already redesigned its brand. The website hadn't caught up.\n\nInstead of a generic unlock icon, the signature interaction comes from the brand's own verb, destravar (to unstick): a doodled cord untangles as the headline resolves, and 'língua' lands exactly as it straightens.\n\nThe rest is restraint: the brandbook's palette and single typeface, three locales with their own URLs, and GSAP plus Lenis rather than WebGL, because most visitors are expected on a phone from WhatsApp. The build is in progress.",
    visual: "Home cover (preview); generic vs destravar; three locales; mobile-first motion; close.", destination: "/work/outubro", source: "portfolio", evidence: "From the Outubro repository's specs. In progress: content and CMS pending; no launch or results claimed.",
  },

  // Portuguese: secondary account, Brazilian small businesses.
  {
    id: "website-details", week: 1, lang: "pt", title: "Seu Instagram vende. O site tira a dúvida.", audience: "Donos de pequenos negócios no Brasil", format: "Carousel",
    caption: "Seu perfil desperta interesse. Mas antes de chamar, o cliente quer saber o que está incluído, quanto custa, em que condição e como reservar.\n\nNo Oishi, os dois preços, a condição 'sem desperdício' e o caminho para o WhatsApp ficam na mesma tela.\n\nSalve a lista para revisar o seu site. O caso está no link da bio.",
    linkedin: "",
    visual: "Capa com a pergunta; a lista de dúvidas; página de rodízio do Oishi anotada; a regra do desconto; fechamento.", destination: "/work/oishi", source: "portfolio", evidence: "Fatos do estudo de caso do Oishi. Nenhum aumento de reservas é afirmado.",
  },
  {
    id: "oishi-condition", week: 2, lang: "pt", title: "R$ 54,90. Se a mesa comer tudo.", audience: "Restaurantes e negócios com ofertas condicionais", format: "Carousel",
    caption: "No Oishi, o rodízio sai R$ 20 mais barato por pessoa se a mesa comer tudo o que pediu.\n\nPor isso o preço com desconto nunca aparece sozinho: R$ 74,90 riscado, R$ 54,90 e 'sem desperdício' logo abaixo, no mesmo componente.\n\nSua oferta tem uma condição? Veja o caso no link da bio.",
    linkedin: "",
    visual: "Janela com o cardápio do Oishi; só desconto vs preço honesto; por que importa; fechamento.", destination: "/work/oishi", source: "portfolio", evidence: "Preços do Rodízio Chisai e regra do desconto conforme o estudo de caso do Oishi.",
  },
  {
    id: "catalogue-whatsapp", week: 3, lang: "pt", title: "Você vende pelo WhatsApp? O site não precisa de carrinho.", audience: "Lojas que já vendem por conversa", format: "Carousel",
    caption: "Se a venda já acontece no WhatsApp, o site pode preparar essa conversa em vez de duplicá-la com um checkout.\n\nNa F&A Móveis, cada produto termina numa mensagem pronta para a dona, com o produto já identificado. Sem banco de dados, sem mensalidade, e 'Consulte o preço' quando o valor não foi confirmado.\n\nCaso completo no link da bio.",
    linkedin: "",
    visual: "Capa com a pergunta; checkout vs conversa; produto da F&A na janela; o que o catálogo não tem; fechamento.", destination: "/work/fa-moveis", source: "portfolio", evidence: "Arquitetura e regras de preço do estudo de caso da F&A Móveis.",
  },
  {
    id: "furniture-dimensions", week: 4, lang: "pt", title: "Cabe na minha sala? Responda antes da mensagem.", audience: "Lojas de móveis e varejo local", format: "Carousel",
    caption: "A primeira pergunta de quem compra móvel é se cabe.\n\nNa F&A Móveis, cada página mostra largura, altura e profundidade reais, guardadas como número em centímetros, o preço confirmado ou 'Consulte o preço', e o WhatsApp já com o produto.\n\nSeu cliente pergunta a medida toda vez? Link na bio.",
    linkedin: "",
    visual: "Capa com a pergunta; página de produto anotada; o detalhe das medidas; fechamento.", destination: "/work/fa-moveis", source: "portfolio", evidence: "Medidas e regras do estudo de caso da F&A Móveis.",
  },
  {
    id: "brief-questions", week: 5, lang: "pt", title: "3 perguntas que valem mais que um orçamento.", audience: "Donos de negócios escolhendo o escopo de um site", format: "Carousel",
    caption: "Antes de pedir um orçamento de site, responda três perguntas: quem visita, o que essa pessoa precisa saber e o que ela deve fazer.\n\n'Quero um site moderno com blog' não dá para orçar. 'O cliente vê a medida e o preço do móvel e chama no WhatsApp sobre ele' dá.\n\nTem as três respostas, mesmo que sejam hipóteses? Fale com o Benito pelo link da bio.",
    linkedin: "",
    visual: "Capa em papel; as três perguntas; vago vs concreto; fechamento.", destination: "/contact", source: "portfolio", evidence: "Exemplo baseado no escopo documentado da F&A Móveis.",
  },
  {
    id: "restaurant-answers", week: 6, lang: "pt", title: "O que o site precisa responder antes de o cliente ligar.", audience: "Donos de restaurantes", format: "Carousel",
    caption: "Checklist para o site do seu restaurante: cardápio em texto, preços e condições juntos, horários confirmados, um caminho só para a reserva, endereço e como chegar.\n\nNo Oishi, o cardápio e as faixas de preço viviam só em imagens JPEG. Hoje são texto real, e a reserva termina numa mensagem pronta no WhatsApp.\n\nSalve e confira o seu. Link na bio.",
    linkedin: "",
    visual: "Capa; checklist; página inicial do Oishi na janela; fechamento.", destination: "/work/oishi", source: "portfolio", evidence: "Situação anterior e entrega conforme o estudo de caso do Oishi.",
  },
  {
    id: "confirmed-information", week: 7, lang: "pt", title: "Preço não confirmado? Escreva 'consulte'.", audience: "Negócios que publicam catálogo e preços", format: "Carousel",
    caption: "Um número plausível é um preço falso.\n\nNa F&A Móveis, 10 dos 13 produtos têm preço confirmado por tabela do fornecedor ou pela própria dona. Os outros 3 dizem 'Consulte o preço', em vez de um chute.\n\nSeu site mostra algo que você ainda não confirmou? Link na bio.",
    linkedin: "",
    visual: "Capa em papel; a regra; catálogo na janela; fechamento.", destination: "/work/fa-moveis", source: "portfolio", evidence: "Números do estudo de caso da F&A Móveis.",
  },
  {
    id: "which-service", week: 8, lang: "pt", title: "Estratégia, produção ou gestão?", audience: "Donos de negócios escolhendo apoio em redes sociais", format: "Carousel",
    caption: "Antes de contratar ajuda com redes sociais, saiba qual parte você precisa delegar.\n\nEstratégia decide público, mensagem, canais e briefs. Produção transforma os briefs em textos, fotos e peças. Gestão publica, responde e acompanha. São escopos diferentes.\n\nPrecisa do plano antes dos posts? Conheça o serviço pelo link da bio.",
    linkedin: "",
    visual: "Capa com a lua ASCII; os três escopos; ideias soltas vs plano; fechamento.", destination: "/services/social-media", source: "portfolio", evidence: "Descreve o escopo proposto do serviço. Preços não aparecem nos posts.",
  },
  // Launch trio, posted together on the first day (TASK-pt-launch-posts.md). Week 0 sorts
  // them before week 1 without renumbering the existing posts.
  {
    id: "apresentacao", week: 0, lang: "pt", title: "Sites e sistemas feitos por uma pessoa só.", audience: "Amigos, conhecidos e donos de negócios no Brasil", format: "Carousel",
    caption: "Prazer, Blessed Moon.\n\nEu sou o Benito. Faço sites, catálogos e sistemas, da estratégia ao código. Quem conversa com você é quem constrói.\n\nTodo projeto começa com uma pergunta: qual é a única coisa que o visitante deve fazer? Por aqui vou mostrar projetos reais, como o Oishi, a F&A Móveis e a UniMeet, com as decisões por trás.\n\nSiga para acompanhar. Os casos estão no link da bio.",
    linkedin: "",
    visual: "Capa com a lua; quem faz; o que eu construo; a pergunta inicial; três projetos; fechamento.", destination: "/work", source: "portfolio", evidence: "Identidade do estúdio (Benito sozinho) e projetos conforme studio-data.ts.",
  },
  {
    id: "unimeet-feiras", week: 0, lang: "pt", title: "Cada feira, a mesma página.", audience: "Donos de negócios com evento, inscrição ou orçamento online", format: "Carousel",
    caption: "A UniMeet vende estandes em feiras universitárias para universidades europeias. O caminho é curto: página do evento, inscrição, conversa de venda e fatura.\n\nCada feira nova é um cadastro no painel, não um projeto de design. E o preço que a universidade vê no formulário é calculado pela mesma função que registra a inscrição, congelado no momento do envio.\n\nAs telas são a proposta de design v2. O caso completo está no link da bio.",
    linkedin: "",
    visual: "Página da feira na janela; o cliente; feira nova é cadastro; as três regras do preço; o bug das datas; fechamento.", destination: "/work/unimeet", source: "portfolio", evidence: "Fatos do estudo de caso da UniMeet. As telas são o design v2 proposto; o cliente manteve o v1 no ar.",
  },
  {
    id: "o-que-eu-faco", week: 0, lang: "pt", title: "O que você pode contratar.", audience: "Donos de negócios avaliando um site ou sistema", format: "Carousel",
    caption: "O que dá para contratar comigo: um site, um catálogo que leva ao WhatsApp, um sistema (reserva, pagamento, painel de dados) ou a estratégia das suas redes.\n\nO processo tem quatro etapas: entender antes de construir, desenhar o sistema e depois a tela, construir em partes que você revisa, publicar e manter.\n\nMe conte o trabalho que falta, não a lista de recursos. Link na bio.",
    linkedin: "",
    visual: "Capa em papel; os quatro escopos; as quatro etapas; lista de recursos vs o trabalho; fechamento.", destination: "/contact", source: "portfolio", evidence: "Serviços e etapas conforme a página inicial do site. Preços não aparecem nos posts.",
  },
];

/** Instagram Stories (1080×1920, 24 hours), kept apart from `STORIES`: those are grid
 * posts, and the grid previews, week list and pins all read them (TASK-launch-teaser-story.md). */
export type StoryFrame = { id: string; lang: Language; title: string; note: string };
export const STORY_FRAMES: StoryFrame[] = [
  { id: "teaser-lancamento", lang: "pt", title: "Amanhã, três posts.", note: "Posted the day before the launch trio, with a countdown sticker set to the publishing time." },
];

/** The launch's Stories, in order. A step points at a `STORY_FRAMES` id (authored art) or a
 * `STORIES` id (a feed post shared to Stories once it's live, so it needs no art of its own).
 * The trio goes up in reverse grid order: the newest sits top-left, and that is the intro. */
export type StoryStep = { when: string; what: string; frame?: string; share?: string };
export const STORY_SCHEDULE: StoryStep[] = [
  { when: "Day before", frame: "teaser-lancamento", what: "Post the teaser, still or video, with a countdown sticker set to the publishing time, placed in the empty lower left. Followers who tap \"remind me\" are notified when it ends." },
  { when: "Launch · 1st", share: "o-que-eu-faco", what: "Publish the services carousel first. It ends up on the right of the top row." },
  { when: "Launch · 2nd", share: "unimeet-feiras", what: "Publish the UniMeet case. It ends up in the middle." },
  { when: "Launch · 3rd", share: "apresentacao", what: "Publish the intro last, so it sits top-left, where a new visitor starts." },
  { when: "Launch · after", what: "Share each post to Stories with a short \"no ar\" line, one Story per post. A new account's feed posts reach few people; the Story is what brings friends to the carousels." },
];

/** A language's stories in publishing order. */
export const storiesIn = (lang: Language) => STORIES.filter((story) => story.lang === lang).sort((a, b) => a.week - b.week);
/** LinkedIn is English-only. */
export const LINKEDIN_STORIES = storiesIn("en");

/** The post's stable id, also its `utm_content`: ig-en-w01-one-action. */
export const postId = (story: Story, channel: Channel) => `${channel === "instagram" ? "ig" : "li"}-${story.lang}-w${String(story.week).padStart(2, "0")}-${story.id}`;

export function campaignUrl(story: Story, channel: Channel) {
  const url = new URL(story.destination, SITE_URL);
  url.searchParams.set("utm_source", channel);
  url.searchParams.set("utm_medium", "organic_social");
  url.searchParams.set("utm_campaign", "studio-social-pilot");
  url.searchParams.set("utm_content", postId(story, channel));
  return url.toString();
}

// ── Profile setup (TASK-social-profiles-and-rebalance.md §2.2) ─────────────────
// What each account should say before the first post: the profile is the first
// thing a visitor reads. Pins and featured items point at real posts and pages only.

export type ProfileHighlight = { title: string; detail: string };
export type ProfileLink = { title: string; href: string; detail: string };
export type Profile = {
  id: "instagram-en" | "instagram-pt" | "linkedin";
  channel: Channel;
  lang: Language;
  label: string;
  handle: string;
  /** Set when the handle isn't confirmed yet. */
  handleNote?: string;
  /** Instagram's name field (30 characters) or LinkedIn's headline (220). */
  name: string;
  nameLimit: number;
  /** Instagram bio (150) or LinkedIn About. */
  bio: string;
  bioLimit: number;
  link: ProfileLink;
  category?: string;
  pins: string[];
  highlights: ProfileHighlight[];
  featured: ProfileLink[];
  company?: { url: string; tagline: string; taglineLimit: number; website: string };
  notes: string[];
};

const tagged = (path: string, source: Channel, content: string) => {
  const url = new URL(path, SITE_URL);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", "organic_social");
  url.searchParams.set("utm_campaign", "studio-social-pilot");
  url.searchParams.set("utm_content", content);
  return url.toString();
};

export const PROFILES: readonly Profile[] = [
  {
    id: "instagram-en", channel: "instagram", lang: "en", label: "Instagram · English (primary)",
    handle: "@blessedmoon.studio",
    name: "Blessed Moon | Web & Software", nameLimit: 30,
    bio: "Websites and software for founders, designed and built end to end by one person.\nReal case studies, not mockups ↓", bioLimit: 150,
    link: { title: "blessed-moon.vercel.app/work", href: tagged("/work", "instagram", "ig-en-bio"), detail: "Bio link: the case index, tagged so profile visits are counted apart from post links." },
    category: "Software Company",
    pins: ["one-action", "renewable-pulse", "unimeet-quote"],
    highlights: [
      { title: "Work", detail: "One case cover per project, newest first: UniMeet, Renewable Pulse, Flora, Markado, Prumo." },
      { title: "Process", detail: "The question set, the one-action brief and the caption formula, for buyers who want to see how decisions get made." },
      { title: "Services", detail: "Websites and products, and the social strategy service, each with its page link." },
      { title: "Start", detail: "The five questions to answer before a first call, ending on the contact link." },
    ],
    featured: [],
    notes: [
      "Switch to a professional account first (Settings → Account type and tools); insights and contact buttons depend on it.",
      "Pins: one useful post and two proofs, so a first visit sees both what Benito thinks and what he has shipped.",
    ],
  },
  {
    id: "instagram-pt", channel: "instagram", lang: "pt", label: "Instagram · Português (optional)",
    handle: "@blessedmoon.br", handleNote: "Suggested handle; confirm it's free when the account is opened.",
    name: "Blessed Moon | Sites e apps", nameLimit: 30,
    bio: "Sites e sistemas para pequenos negócios: cardápio, catálogo, reserva.\nProjetos reais, não modelos ↓", bioLimit: 150,
    link: { title: "blessed-moon.vercel.app/work", href: tagged("/work", "instagram", "ig-pt-bio"), detail: "The site is in English; the cases it opens on (Oishi, F&A Móveis) are Brazilian businesses." },
    category: "Web Designer",
    pins: ["website-details", "catalogue-whatsapp", "brief-questions"],
    highlights: [
      { title: "Projetos", detail: "Oishi e F&A Móveis: o que mudou na página e por quê." },
      { title: "Perguntas", detail: "As 3 perguntas antes de pedir um site e o checklist para restaurantes." },
      { title: "Serviços", detail: "Site, catálogo e estratégia de conteúdo, cada um com o link da página." },
      { title: "Contato", detail: "Como começar: as três respostas e o link de contato." },
    ],
    featured: [],
    notes: ["Open only if capacity allows one Portuguese post a week; the English account comes first."],
  },
  {
    id: "linkedin", channel: "linkedin", lang: "en", label: "LinkedIn · Benito's profile and the company page",
    handle: "Benito Pedro Xavier",
    name: "I design and build websites and software for founders · Blessed Moon Studio · Product design, Next.js, data pipelines", nameLimit: 220,
    bio: "I run Blessed Moon Studio on my own: strategy, design and engineering, with no layer between you and the person building.\n\nRecent work: UniMeet, a university-fair platform whose pricing can't disagree with its invoices; Renewable Pulse, a live energy dashboard built only on real grid data; Flora, a farm console on a satellite pipeline.\n\nIf you're scoping a website or product, start with one question: what's the one thing a visitor should do? I'm glad to help you answer it.", bioLimit: 2600,
    link: { title: "blessed-moon.vercel.app", href: tagged("/", "linkedin", "li-en-profile"), detail: "Profile website link, tagged." },
    pins: [],
    highlights: [],
    featured: [
      { title: "UniMeet case study", href: tagged("/work/unimeet", "linkedin", "li-en-featured-unimeet"), detail: "The strongest delivered product: event engine, frozen quotes, and the social plan." },
      { title: "Renewable Pulse case study", href: tagged("/work/renewable-pulse", "linkedin", "li-en-featured-pulse"), detail: "Proof of data engineering: real sources, idempotent pipeline, live dashboard." },
      { title: "Social Media Strategy service", href: tagged("/services/social-media", "linkedin", "li-en-featured-service"), detail: "The service page, for buyers who need the plan before the posts." },
    ],
    company: {
      url: "https://www.linkedin.com/company/blessedmoonstudio",
      tagline: "Websites and software for founders, designed and engineered end to end by one person. Clarity is the feature.", taglineLimit: 120,
      website: "https://blessed-moon.vercel.app",
    },
    notes: [
      "Post from Benito's profile; reshare to the company page. The page is supporting proof, the profile carries the voice.",
      "Company page website: blessed-moon.vercel.app, with the hyphen.",
    ],
  },
];

export const profileFor = (id: Profile["id"]) => PROFILES.find((profile) => profile.id === id)!;
