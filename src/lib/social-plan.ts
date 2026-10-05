import { SITE_URL } from "@/lib/site-config";

export const PLAN_DATE = "4 October 2026";
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
export type Story = {
  id: string;
  week: number;
  title: string;
  audience: string;
  format: "Carousel" | "Screen recording";
  slides: readonly string[];
  caption: string;
  linkedin: string;
  visual: string;
  destination: string;
  source: keyof typeof SOURCES;
  evidence: string;
};

export const STORIES: readonly Story[] = [
  {
    id: "website-details", week: 1, title: "Your Instagram starts the conversation. Where are the details?", audience: "Brazilian business owners", format: "Carousel",
    slides: ["Seu Instagram desperta interesse. Onde estão os detalhes?", "Horários, preços e condições precisam estar fáceis de achar.", "Posts antigos nem sempre são fáceis de encontrar.", "Uma página pode reunir as respostas antes da conversa.", "No Oishi, o preço aparece junto da condição do desconto.", "Veja como organizamos esse caminho no caso Oishi."],
    caption: "Seu perfil pode ser o começo da conversa. O site reúne o que o cliente precisa entender antes de chamar: oferta, condições e próximo passo. No projeto Oishi, a regra do desconto aparece junto do preço. Veja o caso no link do perfil.",
    linkedin: "A social profile can introduce a business. It is harder to use a feed as a permanent reference for prices, conditions and next steps. In the Oishi website project, the menu and offer have a place someone can revisit. The useful question was not which animation to add. It was which information a customer needed before making contact. Where does that information live in your business?",
    visual: "Six legible slides. Use an actual Oishi price component on slide five; avoid private business messages.", destination: "/work/oishi", source: "portfolio", evidence: "The Oishi case documents the offer presentation. No measured reservation uplift is claimed.",
  },
  {
    id: "oishi-condition", week: 1, title: "The condition belongs beside the price.", audience: "Owners and product decision-makers", format: "Screen recording",
    slides: ["0–4s: Um desconto precisa da sua condição.", "4–12s: Show Oishi's regular and discounted prices together.", "12–22s: Highlight the requirement to finish the table's order.", "22–30s: Veja o caso completo."],
    caption: "No Oishi, o desconto depende de a mesa consumir tudo o que pediu. Por isso, preço e condição fazem parte do mesmo componente. É uma decisão de clareza, não uma promessa de mais vendas. Veja o caso no link do perfil.",
    linkedin: "A lower price needs its condition beside it. In the Oishi project, the discount depends on the table finishing what it orders. That changed the component: regular price, discounted price and condition travel together. A useful interface helps someone understand what they are agreeing to. Which condition does your product need to make clearer?",
    visual: "20–30s crop of the actual price component, with subtitles. Verify displayed prices against the current case before export.", destination: "/work/oishi", source: "portfolio", evidence: "Describe the implemented two-price component, not sales results.",
  },
  {
    id: "catalogue-whatsapp", week: 2, title: "A catalogue does not always need a checkout.", audience: "Local retailers already selling through WhatsApp", format: "Carousel",
    slides: ["Catálogo ou loja completa? Comece pelo jeito que você vende.", "Se a venda já acontece por conversa, isso importa no projeto.", "O catálogo organiza produtos e informações.", "O cliente escolhe o produto antes de chamar.", "Na F&A Móveis, o próximo passo continua no WhatsApp.", "Veja o caso e o caminho escolhido."],
    caption: "Uma loja com checkout não é a única opção. Na F&A Móveis, o catálogo apoia uma venda que já acontece por WhatsApp. Produto, medidas e próximo passo ficam claros. Veja o caso no link do perfil.",
    linkedin: "A checkout would have added a second sales workflow to F&A Móveis. The existing workflow was a WhatsApp conversation. The website therefore organises the catalogue and leads into that conversation. Scope is a product decision: which system supports the business today, and which complexity can wait?",
    visual: "Compare two simple flows, then show the real catalogue. Do not imply every retailer should avoid checkout.", destination: "/work/fa-moveis", source: "portfolio", evidence: "The case documents a catalogue connected to the owner's existing sales workflow.",
  },
  {
    id: "furniture-dimensions", week: 2, title: "Will it fit? Answer the buyer's first question.", audience: "Furniture retailers and local service businesses", format: "Screen recording",
    slides: ["0–4s: Cabe na minha sala?", "4–12s: Show a real product and its dimensions.", "12–22s: Follow the product-specific enquiry action.", "22–30s: Uma pergunta melhor começa com informação clara."],
    caption: "Antes de perguntar pelo produto, o cliente pode precisar saber se ele cabe no espaço. O catálogo da F&A Móveis mostra medidas reais e abre o caminho para a conversa. Sem inventar informação ou preço. Caso completo no link do perfil.",
    linkedin: "The first useful piece of furniture content is often a measurement. In F&A Móveis, dimensions are stored as numbers and formatted consistently. That is a small implementation detail with a clear buyer purpose: understand the product before asking about it. What is the equivalent first question in your business?",
    visual: "Record a currently verified product. Crop any phone details; do not show private enquiry messages.", destination: "/work/fa-moveis", source: "portfolio", evidence: "Dimensions and catalogue behaviour are documented. Enquiry quality improvement remains a hypothesis.",
  },
  {
    id: "one-action", week: 3, title: "A website brief starts with one useful action.", audience: "Founders preparing a website", format: "Carousel",
    slides: ["O que a pessoa precisa fazer no seu site?", "Consultar um produto? Entender um serviço? Pedir uma proposta?", "A ação muda a informação necessária.", "A informação muda a estrutura da página.", "O visual deve ajudar esse caminho.", "Comece o briefing com o próximo passo."],
    caption: "Antes de escolher referências visuais, escolha a ação que o site precisa facilitar. Depois, liste as perguntas que a pessoa precisa responder para chegar até ela. Quer organizar esse briefing? Conheça o Blessed Moon Studio.",
    linkedin: "Before choosing a website reference, choose the action. A catalogue enquiry needs different information from a product signup. The brief becomes clearer when it names the intended visitor, the question they need answered and the next step. That does not settle every design choice. It gives the choices a purpose.",
    visual: "A three-step diagram: visitor question → required information → action. Label it as a planning method, not a conversion benchmark.", destination: "/contact", source: "portfolio", evidence: "Recommended briefing method illustrated by existing cases; no universal conversion claim.",
  },
  {
    id: "brief-questions", week: 3, title: "Three questions before commissioning a website.", audience: "Business owners choosing a website scope", format: "Carousel",
    slides: ["Três perguntas antes de pedir um site.", "Quem precisa usar essa página?", "O que essa pessoa precisa entender?", "Qual é o próximo passo?", "Anote uma resposta concreta para cada pergunta.", "Leve isso para a conversa de projeto."],
    caption: "Quem visita, o que precisa entender e o que faz depois. Essas três respostas ajudam a começar um briefing com mais clareza. O resto pode ser definido na conversa. Prepare seu projeto com o Blessed Moon Studio.",
    linkedin: "A useful early brief can fit in three questions: who is the page for, what do they need to understand, and what should they do next? Each answer exposes assumptions that would otherwise become design revisions later. Bring a concrete example of your buyer and offer. We can build the scope from there.",
    visual: "Three question cards with a blank answer example. No invented client testimony.", destination: "/contact", source: "portfolio", evidence: "Editorial advice from the studio's proposed discovery workflow.",
  },
  {
    id: "strategy-contents", week: 4, title: "What you receive in a social media strategy.", audience: "Owners considering content planning", format: "Carousel",
    slides: ["Uma estratégia de conteúdo precisa ser utilizável.", "Pesquisa: público, dúvidas e referências relevantes.", "Direção: posicionamento, canais e pilares.", "Plano: calendário e briefs para produzir.", "Medição: o que observar e o que mudar.", "Conheça o serviço de estratégia do Blessed Moon Studio."],
    caption: "Estratégia não termina numa lista de ideias. Ela conecta pesquisa, direção, conteúdo e um jeito de revisar os resultados. Agora o Blessed Moon Studio oferece estratégia e planejamento de conteúdo para redes sociais. Conheça o escopo no link do perfil.",
    linkedin: "A social strategy should leave the business with decisions it can use: who to address, what questions to answer, which channels to prioritise, and how to review the work. Our strategy service turns that into an editorial calendar, example briefs and a website measurement plan. The scope is agreed before work begins.",
    visual: "Research → decisions → calendar → review. Clearly present the service as strategy and planning.", destination: "/services/social-media", source: "umami", evidence: "The website measurement method is documented; the service itself is a newly offered scope.",
  },
  {
    id: "sample-calendar", week: 4, title: "A content calendar needs more than a date.", audience: "Businesses creating content themselves", format: "Carousel",
    slides: ["Um calendário precisa de mais do que datas.", "Qual pergunta este post responde?", "Qual evidência vamos mostrar?", "Que formato explica melhor a ideia?", "Para onde a pessoa pode ir depois?", "Uma ideia vira um brief quando essas respostas existem."],
    caption: "Tema, evidência, formato e próximo passo. Um calendário fica mais fácil de executar quando explica por que cada publicação existe. No nosso serviço, o plano vem com briefs de exemplo para orientar a produção.",
    linkedin: "A calendar row labelled 'Monday: brand post' leaves the hard decisions unresolved. A useful row identifies the buyer question, evidence, format and destination. That is the difference between occupying a date and preparing something someone can produce. The example is a planning method, not a promise about reach.",
    visual: "Show a sanitised sample row based on the Oishi case. Do not publish another client's private calendar.", destination: "/services/social-media", source: "portfolio", evidence: "Use an agency-owned sample built from public case information.",
  },
  {
    id: "likes-intent", week: 5, title: "Attention and enquiry are different signals.", audience: "Owners evaluating social performance", format: "Carousel",
    slides: ["Curtidas ajudam a entender atenção. E depois?", "O post alcançou pessoas relevantes?", "Alguém visitou a página certa?", "Alguém iniciou uma conversa real?", "A conversa virou uma oportunidade adequada?", "Observe cada etapa sem confundir uma com a outra."],
    caption: "Alcance, visitas e conversas respondem perguntas diferentes. O relatório precisa distinguir atenção de uma oportunidade real. É assim que planejamos a medição junto com o conteúdo.",
    linkedin: "Reach tells us something about distribution. A website visit tells us someone took another step. Opening a mail draft is an intention, not a submitted lead. We keep those signals separate and use actual enquiries and proposals to understand business results. A smaller post can still bring a more relevant conversation.",
    visual: "A labelled funnel with metric definitions and no sample numbers. Use arrows rather than a fabricated chart.", destination: "/services/social-media", source: "umami", evidence: "Measurement design; no current social or website figures are connected.",
  },
  {
    id: "tagged-link", week: 5, title: "One tagged link. One clearer next decision.", audience: "Founders reviewing content traffic", format: "Screen recording",
    slides: ["0–5s: Qual publicação trouxe a visita?", "5–15s: Show a labelled campaign link builder, not private analytics.", "15–24s: Explain source, campaign and content ID.", "24–30s: Revise o conteúdo com informação, não com adivinhação."],
    caption: "Um link de campanha identifica a origem da visita quando a pessoa usa aquele link. Isso ajuda a comparar caminhos, mas não captura toda conversa por mensagem ou visita em outro dispositivo. Medição útil também mostra seus limites.",
    linkedin: "A campaign link gives the visit context: channel, campaign and content. That can help us decide which story to repeat. It does not explain every copied link, private message or cross-device visit. A useful report states the limits of attribution rather than hiding them.",
    visual: "Demonstrate the public UTM format using the agency origin. No dashboard tokens, session replay or customer records.", destination: "/services/social-media", source: "umami", evidence: "Umami's campaign documentation supports the URL convention; attribution is incomplete.",
  },
  {
    id: "restaurant-answers", week: 6, title: "What should a restaurant page answer before a call?", audience: "Restaurant owners", format: "Carousel",
    slides: ["Antes de ligar, o cliente quer entender a oferta.", "O que está incluído?", "Qual é o preço e sua condição?", "Como consultar ou reservar?", "No Oishi, a regra do desconto fica junto da oferta.", "Veja um exemplo de informação organizada."],
    caption: "Uma página de restaurante precisa explicar a oferta com informações confirmadas. No Oishi, mostrar a condição do desconto faz parte dessa clareza. Não usamos um valor isolado para contar outra história. Veja o caso no link do perfil.",
    linkedin: "Restaurant website content starts with the real offer. What is included, what conditions apply, and where does a customer go next? Oishi's discount gave the design a concrete fact to organise around. We used that fact instead of manufacturing a new selling point.",
    visual: "Use approved case screenshots and current offer text. Do not supply unconfirmed hours or reservation policies.", destination: "/work/oishi", source: "portfolio", evidence: "Only the documented offer presentation is treated as a delivered outcome.",
  },
  {
    id: "smallest-system", week: 6, title: "Catalogue, shop or dashboard? Start with the workflow.", audience: "Owners choosing software scope", format: "Carousel",
    slides: ["Que sistema o seu negócio precisa agora?", "Catálogo: organizar a oferta e abrir a conversa.", "Loja: fechar uma compra com pagamento e operação definidos.", "Dashboard: apoiar decisões com dados disponíveis.", "Escolha pelo fluxo real, não pelo nome mais completo.", "Veja por que a F&A Móveis começou com catálogo."],
    caption: "O sistema certo depende do trabalho que precisa acontecer. Na F&A Móveis, um catálogo conectado ao WhatsApp fazia sentido para a operação existente. Um projeto maior precisa de outra justificativa, não só de mais funções.",
    linkedin: "A catalogue, shop and dashboard solve different workflows. Choosing the biggest feature list does not resolve which one a business needs. F&A Móveis is a useful example of a small scope that supports an existing operation. The future system can be planned without paying for every part at launch.",
    visual: "Three simple workflow diagrams and a real catalogue screenshot. Avoid suggesting all categories have the same delivery cost.", destination: "/work/fa-moveis", source: "portfolio", evidence: "The catalogue case supports the scope example, not a universal architecture rule.",
  },
  {
    id: "screenshot-context", week: 7, title: "A product screenshot needs a decision story.", audience: "Founders and product leaders", format: "Carousel",
    slides: ["Uma tela precisa de contexto.", "Que problema a pessoa tinha?", "Quais opções existiam?", "Por que escolhemos este caminho?", "O que ainda não está resolvido?", "No catálogo F&A Móveis, a conversa continuou no WhatsApp."],
    caption: "Mostrar uma tela é só o começo. Explicar o problema, a escolha e os limites ajuda alguém a entender o trabalho. No caso F&A Móveis, o catálogo apoia a venda por conversa. Veja a decisão completa no link do perfil.",
    linkedin: "A screenshot can show the interface without explaining the work. The useful story is the problem, options, decision and limitation. In F&A Móveis, we chose a catalogue because the sale already happened through a conversation. That context tells a prospective client more than the screenshot alone.",
    visual: "Annotate a real catalogue screenshot with problem / choice / limit. Do not invent product usage or client growth figures.", destination: "/work/fa-moveis", source: "portfolio", evidence: "Public case facts only; this is a content method for product buyers.",
  },
  {
    id: "confirmed-information", week: 7, title: "If the price is unconfirmed, the page should say so.", audience: "Founders managing product information", format: "Carousel",
    slides: ["Uma informação desconhecida não vira um número plausível.", "Confirme a fonte antes de publicar.", "Se o preço não foi confirmado, diga isso.", "Na F&A Móveis, isso aparece como consulta de preço.", "Um estado honesto também faz parte do produto.", "Veja como o catálogo organiza os dados reais."],
    caption: "A interface também precisa saber lidar com o que ainda não foi confirmado. No catálogo F&A Móveis, não usamos preços inventados para completar a página. Essa decisão vale para dados, conteúdo e relatórios.",
    linkedin: "An unknown price is a data state. Replacing it with a plausible number would make the screen look complete while making the product less trustworthy. The F&A Móveis catalogue uses an explicit price enquiry where a price was not confirmed. Good product work includes those unresolved states.",
    visual: "Show the documented price-enquiry state, after verifying the current product data. No unsupported before/after metrics.", destination: "/work/fa-moveis", source: "portfolio", evidence: "The case records explicitly unconfirmed price states; current stock can change.",
  },
  {
    id: "which-service", week: 8, title: "Strategy, production or management?", audience: "Owners choosing social support", format: "Carousel",
    slides: ["Que apoio você precisa para o conteúdo?", "Estratégia: decidir público, mensagem, canais e plano.", "Produção: transformar briefs em textos e peças.", "Gestão: publicar e acompanhar tarefas combinadas.", "Cada etapa precisa de escopo e responsabilidade claros.", "Conheça nosso serviço de estratégia e planejamento."],
    caption: "Planejar, produzir e gerir são trabalhos diferentes. O Blessed Moon Studio oferece pesquisa, estratégia, calendário e um plano de medição. Outros serviços precisam de um escopo próprio. Veja a proposta no link do perfil.",
    linkedin: "Strategy decides what the work should achieve. Production turns the brief into assets. Management handles agreed ongoing operations. Buying one does not automatically include the others. Our new offer starts with research, editorial decisions, a usable calendar and measurement. Additional work is scoped explicitly.",
    visual: "Three columns with a highlight on the strategy scope. Do not advertise ongoing community management as included.", destination: "/services/social-media", source: "meta", evidence: "Service boundaries are the studio's proposed scope; platform guidance informs later testing.",
  },
  {
    id: "pilot-review", week: 8, title: "The pilot ends with a decision, not a victory claim.", audience: "Business owners assessing content investment", format: "Carousel",
    slides: ["O que revisar depois de um piloto de conteúdo?", "Quais perguntas geraram conversas relevantes?", "Que caminhos trouxeram visitas para o site?", "Quais conversas viraram oportunidades reais?", "Quanto tempo o conteúdo exigiu?", "Com os dados disponíveis, decida o que repetir e ajustar."],
    caption: "Um piloto serve para aprender o que vale continuar. Relevância das conversas, caminhos de visita e tempo de produção fazem parte da revisão. Quando houver dados, publicaremos apenas observações verificadas. Até lá, este é o método.",
    linkedin: "An eight-week pilot should leave us with a decision: which buyer questions to keep answering, which destinations to improve, and what the work costs in time. Without connected results, a growth claim would be invented. We can explain the review method now and publish observations once there is evidence.",
    visual: "A blank review template labelled 'method'. Replace with measured findings only after an actual pilot and approval.", destination: "/services/social-media", source: "umami", evidence: "No pilot results are connected. This draft describes the review process only.",
  },
];

export function campaignUrl(story: Story, channel: Channel) {
  const url = new URL(story.destination, SITE_URL);
  url.searchParams.set("utm_source", channel);
  url.searchParams.set("utm_medium", "organic_social");
  url.searchParams.set("utm_campaign", "studio-social-pilot");
  url.searchParams.set("utm_content", `${channel === "instagram" ? "ig" : "li"}-w${String(story.week).padStart(2, "0")}-${story.id}`);
  return url.toString();
}
