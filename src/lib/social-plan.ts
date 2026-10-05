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
    caption: "Most website briefs are a list of features. The ones that can be scoped name one action: who arrives, what they need to know first, and the single thing they should do next.\n\nFor F&A Móveis that action was a WhatsApp message about one specific product, so every product page carries real measurements, a confirmed price or an honest 'ask', and one pre-filled message.\n\nSave the five questions for your next brief. When you have the answers, send them over. Link in bio.",
    linkedin: "Most website briefs I receive are a list of features: a blog, a chatbot, animations. The briefs that can actually be scoped name one action instead.\n\nWho lands on the page? What do they need to know first? What could stop them? What's the one thing they should do? What happens after?\n\nFor F&A Móveis, a furniture shop that already sold over WhatsApp, the action was a message about one specific product. That single decision set the scope: real measurements stored in centimetres, a confirmed price or an honest 'ask', and one pre-filled message per product page. No cart, because the sale already happened in conversation.\n\nWhat's the one action on your next page?",
    visual: "Five slides: hook, the five-question brief, wishlist vs one action, the annotated F&A product page, closing action. Real F&A screenshot.", destination: "/contact", source: "portfolio", evidence: "F&A Móveis facts from the case study: 13 products, 10 confirmed prices, WhatsApp-only sales. No sales uplift is claimed.",
  },
  {
    id: "markado-slot", week: 1, lang: "en", title: "Two clients. One slot. Only one can book it.", audience: "Founders and product leaders scoping booking or payment flows", format: "Carousel",
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
    id: "flora-satellite", week: 2, lang: "en", title: "Satellite pixels in. Field tasks out.", audience: "Product leaders building on external data", format: "Carousel",
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
    id: "fa-honest-price", week: 3, lang: "en", title: "13 products. 10 prices. Three say 'ask', on purpose.", audience: "Founders managing product information", format: "Carousel",
    caption: "F&A Móveis lists 13 real products. Ten have a confirmed price, from supplier sheets and the owner's own confirmations. The other three say 'Consulte o preço', because a plausible number would be a false price.\n\nMeasured on the live build: Lighthouse 93 performance and 100 accessibility on /produtos, CLS 0, every product image under 32 KB.\n\nThe full case is linked in the bio.",
    linkedin: "F&A Móveis lists 13 real products. Ten show a confirmed price. Three say 'Consulte o preço'.\n\nThat isn't unfinished work. The ten come from supplier sheets and the owner's own WhatsApp confirmations; the other three weren't confirmed, and a plausible number would have been a false price.\n\nThe harder call came earlier: the 27-product demo catalogue that won the job was removed once real stock existed, so the site never kept selling furniture that wasn't in stock.\n\nMeasured on the production build: Lighthouse 93 performance and 100 accessibility on /produtos, CLS 0, every product image under 32 KB against a 180 KB budget.",
    visual: "Catalogue window cover; the rule; measured results as rows; the demo-catalogue decision; close.", destination: "/work/fa-moveis", source: "portfolio", evidence: "All figures are from the F&A Móveis case study's production measurements. No sales figures are claimed.",
  },
  {
    id: "prumo-credit", week: 4, lang: "en", title: "Listings ask 'which apartment?' Buyers ask 'will I get credit?'", audience: "Founders in regulated or high-anxiety purchases", format: "Carousel",
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
    caption: "A calendar that says 'Monday: post about the brand' leaves all the real decisions to whoever has to produce it.\n\nA usable plan hands you four things: research (buyer questions, competitors, channels), direction (positioning and pillars), briefs (question, evidence, format, destination) and measurement (tagged visits and qualified enquiries).\n\nStrategy isn't production; those are separate scopes. The service is linked in the bio.",
    linkedin: "A content calendar row that says 'Monday: post about the brand' isn't a plan. Whoever produces it still has to decide everything.\n\nA row someone can actually produce: 'Explain one price condition with the real Oishi page, then link the case.' A question, the evidence, a format, a destination.\n\nThat's what a strategy should hand over: research, direction, briefs written to that standard, and a measurement plan based on tagged visits and qualified enquiries rather than likes. Production, publishing and community management are separate scopes, quoted separately.",
    visual: "ASCII-moon cover; topic vs brief; the four deliverables; scope note; close.", destination: "/services/social-media", source: "edelman", evidence: "Describes the proposed service scope. Pricing stays off public posts until approved.",
  },
  {
    id: "bee-dash-metrics", week: 5, lang: "en", title: "Reach on one platform isn't reach on another.", audience: "Marketing and product leads comparing channels", format: "Carousel",
    caption: "Influencer reporting usually means someone copying each creator's numbers into a spreadsheet, and by the time it's done the campaign has moved on.\n\nBee Dash started by agreeing what reach, engagement and performance mean across platforms. Each platform's adapter maps into that one schema, so creators are compared on equivalent numbers.\n\nRate limits, platform changes and growing history each got a deliberate answer. Case in the bio.",
    linkedin: "'Reach' on one platform isn't 'reach' on another, and a spreadsheet hides that.\n\nBee Dash started before any adapter code: the team defined reach, engagement and campaign performance across platforms first. Each platform's adapter then handles its own authentication, pagination and rate limits and maps into that one schema, so creators are compared on equivalent metrics instead of platform-specific vanity numbers.\n\nWhat broke in production, and the answers: rate limits (batched, scheduled, backed off on purpose), platform schema changes (contained in each adapter), growing history (trend queries without full-history scans).",
    visual: "Campaigns window cover; define the metric first; spreadsheet vs live view; production problems; close.", destination: "/work/bee-dash", source: "portfolio", evidence: "From the Bee Dash case study (2024, small delivery team). No campaign results are claimed.",
  },
  {
    id: "headless-shopify", week: 6, lang: "en", title: "Keep Shopify. Lose the theme.", audience: "E-commerce founders outgrowing a theme", format: "Carousel",
    caption: "Shopify themes are quick to launch and hard to make your own.\n\nSua Mesa Fit kept Shopify for what it's good at (inventory, orders, payments, checkout) and built a custom storefront on top: its own design, search queries shaped per route, and a cart that answers instantly while Shopify still decides the totals.\n\nOutgrown your theme? The case is linked in the bio.",
    linkedin: "The choice isn't 'Shopify or custom'. Sua Mesa Fit kept Shopify running the business (inventory, orders, payments, checkout) and replaced only the storefront.\n\nThe customer-facing site is a custom, server-rendered app reading the Storefront API: its own components instead of a theme, search queries shaped per route so the catalogue can grow without inflating every payload, and an optimistic cart that responds immediately while Shopify stays the source of truth for lines, totals and shipping.",
    visual: "Product-page window cover on paper; who does what; theme vs headless; the cart detail; close.", destination: "/work/sua-mesa-fit", source: "portfolio", evidence: "From the Sua Mesa Fit case study (2024). No performance or revenue figures are claimed.",
  },
  {
    id: "likes-intent", week: 6, lang: "en", title: "Likes measure attention. Enquiries measure fit.", audience: "Founders evaluating content results", format: "Carousel",
    caption: "Likes tell you a post got attention. They don't tell you whether the right buyer arrived.\n\nAsk four questions in order: did the right person see it, did they visit the page, did they get in touch, and was it the right work?\n\nAnd read medians, not one viral post. Save the four questions.",
    linkedin: "Likes measure attention. Enquiries measure fit. Most content reports stop at the first.\n\nFour questions, in order, for every post:\n1. Did the right person see it? Saves, shares, relevant replies.\n2. Did they visit the page? A tagged visit to the linked case.\n3. Did they get in touch? An enquiry carrying the campaign tag.\n4. Was it the right work? Qualified, then a proposal.\n\nCompare similar formats over weeks. One popular post isn't a reason to change positioning; a modest post that brings the right enquiry is a reason to repeat it.",
    visual: "Hook cover; the four questions; medians rule; close.", destination: "/services/social-media", source: "umami", evidence: "A measurement method, not results. No account metrics are connected.",
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
];

export const storiesIn = (lang: Language) => STORIES.filter((story) => story.lang === lang);
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
