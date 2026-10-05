import type { ArtSlide } from "@/lib/social-art";

// Authored carousels, one per story (TASK-social-copy-v3.md). Each post has its
// own order and length: a teardown, a checklist and a case don't share a
// template sequence. Every project fact is from src/lib/studio-data.ts; limits
// on that evidence live in the story's `evidence` note, never on the art.
// Rows and comparisons: one line each, `label | detail | value`.

type Authored = Partial<ArtSlide>;
const shot = (image: string, label: string, rest: Authored): Authored => ({ template: "window", image, label, imageAlt: "", ...rest });

const ALT = {
  faProduct: "F&A Móveis product page: a wardrobe with its dimensions in centimetres, its price and a WhatsApp button.",
  faConsulte: "F&A Móveis catalogue row: three products with a price, and a headboard showing 'Consulte o preço' instead.",
  faCatalogue: "F&A Móveis catalogue grid of real products with their prices.",
  markadoHours: "Markado availability settings: working hours set once for each weekday.",
  floraStress: "Flora crop-stress screen: a satellite map with a stressed zone clipped to the field boundary, beside a list of detections.",
  floraTasks: "Flora task board with columns for to-do, in-progress and done field tasks.",
  prumo: "Prumo pre-qualification screen asking a family's situation before showing any apartment.",
  beeDash: "Bee Dash campaigns screen with campaign cards and comparable metrics.",
  suaMesaFit: "Sua Mesa Fit product page: a custom meal with its price and ingredient options.",
  oishiRodizio: "Oishi rodízio page: two tiers, each with the full price struck through, the discounted price and the 'sem desperdício' condition.",
  oishiMenu: "Oishi menu page showing a rodízio tier with both prices and its condition.",
};

export const AUTHORED_SLIDES: Record<string, Authored[]> = {
  // ── English · founders and product leaders ──────────────────────────────────
  "one-action": [
    { template: "cover", art: "crescent", kicker: "Before you brief a studio", title: "Your brief lists features.", accent: "It should name one action.", body: "Five answers that turn a wishlist into a scope you can price." },
    { template: "rows", numbered: true, surface: "paper", kicker: "The one-action brief", title: "Answer these before the first call", body: "Who lands on the page | One real person, not a market\nWhat they need to know first | The question they arrive with\nWhat could stop them | Price, fit, trust or timing\nThe one action | Book, ask, buy or compare | One\nWhat happens after | Who replies, and how" },
    { template: "compare", kicker: "Same project, two briefs", title: "Which one can be scoped?", body: "Wishlist | Modern design, a blog, a chatbot, animations.\nOne action | A buyer checks a product's real size and price, then asks about it on WhatsApp." },
    { template: "annotate", image: "/projects/fa-moveis/produto.png", imageAlt: ALT.faProduct, label: "~/work/fa-moveis", kicker: "The brief, built", title: "F&A Móveis: one action per page.", marks: [[55.5, 54, 32, 6.5], [55.5, 42.5, 19, 7.5], [56.5, 92.5, 15, 6.5]], body: "Real measurements | Stored in centimetres, never typed by hand\nA confirmed price, or 'ask' | 10 of 13 products are priced\nOne action | A WhatsApp message about this product" },
    { template: "action", surface: "amber", art: "crescent", title: "Write the action first. Then hire.", body: "Save this for your next brief. The contact link is in the bio.", action: "Send your one-action brief" },
  ],
  "markado-slot": [
    shot("/projects/markado/disponibilidade.png", "~/work/markado", { imageAlt: ALT.markadoHours, kicker: "Case · Markado", title: "Two clients. One slot.", accent: "Only one can book it.", body: "What a booking page has to get right before it looks good." }),
    { template: "point", kicker: "The bug a demo never shows", title: "Availability is checked again inside the payment step.", body: "Two people can open the same free slot at the same moment. Markado revalidates availability in the final transaction, so one booking wins and the other is told, instead of both being confirmed." },
    { template: "rows", surface: "paper", kicker: "Where a free slot comes from", title: "A slot is computed, not listed", body: "Working rules | Set once by the provider\nCalendar events | Read from Google Calendar\nBuffers and notice | Time around and before each meeting\nTimezone | Stored in UTC, converted only on screen" },
    { template: "compare", kicker: "Payment", title: "Reserved and paid can't drift apart.", body: "Message threads | Ask for a time, check the calendar, send a payment link, wait.\nMarkado | Checkout happens before confirmation. A confirmed slot is a paid slot." },
    { template: "action", art: "crescent", title: "Bookings still arrive by message?", body: "The full case is linked in the bio. Save this if you're scoping a booking flow.", action: "Read the Markado case" },
  ],
  "smallest-system": [
    { template: "cover", surface: "paper", art: "crescent", kicker: "Before you buy software", title: "Catalogue, booking or dashboard?", accent: "Name the job first.", body: "Three real projects. Three different smallest systems." },
    { template: "rows", kicker: "The job decides the system", title: "Three jobs, three builds", body: "Ask about a product, then message | F&A Móveis: a catalogue with no cart | Catalogue\nPick a time and pay | Markado: availability, calendar, checkout | Booking\nAct on a field reading | Flora: a map, stress zones, a task board | Dashboard" },
    { template: "compare", kicker: "Two ways to start", title: "Which brief gets built sooner?", body: "Feature list | Payments, accounts, scheduling, a dashboard.\nThe job | A client picks a service, sees the free times and pays before the slot is confirmed." },
    shot("/projects/fa-moveis/produtos.png", "~/work/fa-moveis", { imageAlt: ALT.faCatalogue, kicker: "Smallest that works", title: "F&A sells over WhatsApp.", accent: "So it has no cart.", body: "Every product page ends in a pre-filled message to the owner, where the sale already happened." }),
    { template: "action", surface: "amber", art: "crescent", title: "Describe the job. We'll size the system.", body: "Contact link in the bio. Save this for your next scoping call.", action: "Send the job, not the features" },
  ],
  "flora-satellite": [
    shot("/projects/flora/stress-ndvi.png", "~/work/flora", { imageAlt: ALT.floraStress, kicker: "Case · Flora", title: "Satellite pixels in.", accent: "Field tasks out.", body: "" }),
    { template: "point", kicker: "One rule shaped the system", title: "No request ever calls the satellite.", body: "A scheduled worker asks Copernicus for imagery, computes the readings and stores them. The app only reads, so a farmer opening the map never waits on a satellite provider." },
    { template: "rows", surface: "paper", kicker: "Ten readings, one call", title: "One Process API request", body: "Spectral indices | NDVI, NDRE, EVI, NDMI and six more | 10\nCost of all ten, measured live | Processing Units; one reading cost 4.0 | 4.667\nWhat sets the cost | Input bands, not the number of outputs" },
    shot("/projects/flora/tasks.png", "~/work/flora", { imageAlt: ALT.floraTasks, kicker: "Reading to action", title: "A stressed zone becomes a task.", body: "Detections are grouped on the map and turned into cards on a task board." }),
    { template: "point", kicker: "Found live, not in review", title: "The worst bugs only showed up on a real account.", body: "A missing Accept header made Copernicus return a bare TIFF, and the error read like an auth failure. Two of ten indices painted a rectangle where the field should be. Both were found by looking at what rendered." },
    { template: "action", art: "crescent", title: "A data pipeline behind your product?", body: "The full case is linked in the bio.", action: "Read the Flora case" },
  ],
  "studio-questions": [
    { template: "cover", art: "crescent", kicker: "Hiring a studio?", title: "7 questions", accent: "to ask before you sign.", body: "The answers tell you more than the portfolio." },
    { template: "rows", numbered: true, surface: "paper", kicker: "Save this", title: "Ask all seven", body: "Who builds it? | Names, not a team page\nWhat ships first? | The smallest useful release\nWhat if a fact is unknown? | A placeholder, or a visible gap?\nHow is it checked? | On a real phone, on the live URL\nWhat does it cost to run? | Each monthly bill, by name\nWhat will need a developer? | And what you can edit\nWho owns the accounts? | Domain, hosting and code" },
    { template: "point", step: "03", kicker: "Question 3", title: "'[a confirmar]' beats a plausible guess.", body: "On Oishi, an unconfirmed hour or reservation rule shows as a visible '[a confirmar]'. A made-up value looks finished, and it's wrong." },
    { template: "point", step: "04", kicker: "Question 4", title: "Every WhatsApp message carried a localhost link.", body: "On F&A Móveis, an unset site URL fell back to localhost. It looked fine on a laptop. A pass on a real phone against the live site caught it, and the build now fails on that mistake." },
    { template: "action", surface: "amber", art: "crescent", title: "Ask us the seven.", body: "Contact link in the bio. Save this for your shortlist.", action: "Start a conversation" },
  ],
  "fa-honest-price": [
    shot("/projects/fa-moveis/consulte-preco.png", "~/work/fa-moveis", { imageAlt: ALT.faConsulte, kicker: "Case · F&A Móveis", title: "13 products. 10 prices.", accent: "Three say 'ask', on purpose.", body: "" }),
    { template: "point", kicker: "The rule", title: "A plausible number is a false price.", body: "Ten prices come from supplier sheets and the owner's own confirmations. The other three weren't confirmed, so the page says 'Consulte o preço' instead of a guess." },
    { template: "rows", surface: "paper", kicker: "Measured on the live build", title: "What shipped", body: "Real products | Two suppliers, no filler | 13\nConfirmed prices | The rest say 'ask' | 10\nLighthouse on /produtos | Performance and accessibility | 93 / 100\nLayout shift | CLS | 0\nProduct images | Budget 180 KB each | < 32 KB" },
    { template: "point", kicker: "The harder call", title: "The demo catalogue had to go.", body: "27 illustrative products won the job. Once 13 real ones existed, the demo items were removed, so the site never kept selling furniture that wasn't in stock." },
    { template: "action", art: "crescent", title: "Prices you can stand behind.", body: "The full case is linked in the bio.", action: "Read the F&A case" },
  ],
  "prumo-credit": [
    shot("/projects/prumo/simulador.png", "~/work/prumo", { imageAlt: ALT.prumo, kicker: "Case · Prumo", title: "Listings ask 'which apartment?'", accent: "Buyers ask 'will I get credit?'", body: "" }),
    { template: "compare", kicker: "Order of questions", title: "Answer the worry first.", body: "Usual listing | Browse apartments, then call to find out whether you qualify.\nPrumo | A credit check in about a minute, before any apartment." },
    { template: "rows", surface: "paper", kicker: "Never a yes or no", title: "Five honest outcomes", body: "Approved in your band\nApproved in a different band\nAbove the bands\nOutside the programme\nNot yet | Every blocker returned at once" },
    { template: "point", kicker: "What it doesn't ask for", title: "No ID number. No credit bureau. No uploads.", body: "A family gets a real Minha Casa Minha Vida verdict without handing over a document. Policy numbers live in the admin, flagged until they're confirmed against Caixa's current tables." },
    { template: "action", surface: "amber", art: "crescent", title: "What does your buyer worry about first?", body: "The full case is linked in the bio.", action: "Read the Prumo case" },
  ],
  "screenshot-context": [
    { template: "cover", art: "crescent", kicker: "For product teams", title: "A screenshot shows the UI.", accent: "The decision sells the work.", body: "A four-line caption formula for product screens." },
    { template: "compare", kicker: "Same screen, two captions", title: "Which one makes you look closer?", body: "Vague | Our new dashboard is live.\nUseful | Which corner of which field is stressed this week, without walking every hectare." },
    { template: "rows", surface: "paper", kicker: "The formula", title: "Caption a screen in four lines", body: "Who | The person using it\nTask | What they came to do\nDecision | The choice that makes it possible\nLimit | What it doesn't do yet" },
    { template: "annotate", image: "/projects/flora/stress-ndvi.png", imageAlt: ALT.floraStress, label: "~/work/flora", kicker: "The formula, applied", title: "Flora: point at the decision.", marks: [[58, 60.5, 16, 25], [19.5, 31, 31, 69]], body: "The stressed zone | Clipped to the field's real boundary\nDetections | Grouped, each one can become a task" },
    { template: "action", art: "crescent", title: "Ship the screen with its reason.", body: "Save the formula for your next launch post. Cases are linked in the bio.", action: "See the case studies" },
  ],
  "strategy-contents": [
    { template: "cover", art: "moon", kicker: "Social strategy", title: "What a content plan should hand you.", accent: "Briefs, not topics.", body: "" },
    { template: "compare", kicker: "One calendar row", title: "Which one can someone produce?", body: "Topic | Monday: post about the brand.\nBrief | Explain one price condition with the real Oishi page, then link the case." },
    { template: "rows", surface: "paper", kicker: "What you receive", title: "Four parts, all usable", body: "Research | Buyer questions, competitors, channels\nDirection | Positioning and content pillars\nBriefs | Question, evidence, format, destination\nMeasurement | Tagged visits and qualified enquiries" },
    { template: "point", kicker: "Scope", title: "Strategy isn't production.", body: "The plan decides what to publish and why. Making the assets, publishing and community management are separate scopes, quoted separately." },
    { template: "action", surface: "amber", art: "crescent", title: "Need the plan, not more posts?", body: "Link in the bio.", action: "See the strategy service" },
  ],
  "bee-dash-metrics": [
    shot("/projects/bee-dash/campanhas.png", "~/work/bee-dash", { imageAlt: ALT.beeDash, kicker: "Case · Bee Dash", title: "Reach on one platform isn't reach on another.", accent: "So define it once.", body: "" }),
    { template: "point", kicker: "Before any code", title: "Agree what 'reach' means.", body: "The team defined reach, engagement and campaign performance across platforms first. Each platform's adapter then maps its own fields into that one schema." },
    { template: "compare", kicker: "Reporting", title: "From spreadsheet to live view", body: "Before | Someone copies each creator's numbers into cells, and the campaign has moved on.\nBee Dash | Metrics arrive through the platforms' APIs into one comparable view." },
    { template: "rows", surface: "paper", kicker: "What breaks in production", title: "Three problems, three answers", body: "Rate limits | Batched, scheduled, backed off on purpose\nPlatform changes | Contained in each platform's adapter\nGrowing history | Trend queries without full-history scans" },
    { template: "action", art: "crescent", title: "Still building reports by hand?", body: "The full case is linked in the bio.", action: "Read the Bee Dash case" },
  ],
  "headless-shopify": [
    shot("/projects/sua-mesa-fit/product-hero.png", "~/work/sua-mesa-fit", { imageAlt: ALT.suaMesaFit, surface: "paper", kicker: "Case · Sua Mesa Fit", title: "Keep Shopify.", accent: "Lose the theme.", body: "" }),
    { template: "rows", kicker: "Who does what", title: "Split at the storefront", body: "Inventory and orders | | Shopify\nPayments and checkout | | Shopify\nStorefront design | | Custom\nSearch | Queries shaped per route | Custom\nCart and shipping | Custom UI, Shopify's totals | Both" },
    { template: "compare", kicker: "The trade-off", title: "Theme or headless?", body: "Theme | Quick to launch, hard to make your own.\nHeadless | Shopify keeps running the business. The customer-facing site is built for this brand." },
    { template: "point", kicker: "The detail", title: "The cart answers instantly. Shopify still decides.", body: "Cart changes show immediately, then the server reconciles them, so Shopify stays the source of truth for lines, totals and shipping." },
    { template: "action", surface: "amber", art: "crescent", title: "Outgrown your theme?", body: "The full case is linked in the bio.", action: "Read the Sua Mesa Fit case" },
  ],
  "likes-intent": [
    { template: "cover", art: "crescent", kicker: "Reading your numbers", title: "Likes measure attention.", accent: "Enquiries measure fit.", body: "Four questions to ask of every post." },
    { template: "rows", numbered: true, surface: "paper", kicker: "In this order", title: "Did the post reach the right buyer?", body: "Did the right person see it? | Saves, shares, relevant replies\nDid they visit the page? | A tagged visit to the linked case\nDid they get in touch? | An enquiry carrying the campaign tag\nWas it the right work? | Qualified, then a proposal" },
    { template: "point", kicker: "One rule", title: "Read medians, not one viral post.", body: "Compare similar formats over weeks. One popular post isn't a reason to change positioning. A modest post that brings the right enquiry is a reason to repeat it." },
    { template: "action", surface: "amber", art: "crescent", title: "Measure the conversation, not the applause.", body: "Save the four questions. Link in the bio.", action: "See the strategy service" },
  ],

  // ── Português · pequenos negócios no Brasil ─────────────────────────────────
  "website-details": [
    { template: "cover", art: "crescent", kicker: "Pergunta do cliente", title: "Seu Instagram vende.", accent: "O site tira a dúvida.", body: "Preço, condição e próximo passo num lugar só." },
    { template: "rows", surface: "paper", kicker: "Antes de chamar no WhatsApp", title: "O que o cliente quer saber", body: "O que está incluído?\nQuanto custa, e em que condição?\nQuando funciona?\nComo eu reservo ou peço?" },
    { template: "annotate", image: "/projects/oishi/rodizio-com-sashimi.png", imageAlt: ALT.oishiRodizio, label: "~/work/oishi", kicker: "Oishi · rodízio", title: "Tudo na mesma tela.", marks: [[0.5, 62.5, 74.5, 23], [0.5, 88, 32, 7]], body: "Preço e condição | Cheio, com desconto e 'sem desperdício', juntos\nO próximo passo | Reserva e pedido pelo WhatsApp" },
    { template: "point", kicker: "A regra", title: "Desconto sem condição é preço falso.", body: "No Oishi, o desconto vale se a mesa comer tudo o que pediu. Por isso o preço com desconto nunca aparece sozinho." },
    { template: "action", surface: "amber", art: "crescent", title: "Seu feed responde a isso?", body: "Salve a lista para revisar o seu site. Link na bio.", action: "Veja o caso Oishi" },
  ],
  "oishi-condition": [
    shot("/projects/oishi/cardapio.png", "~/work/oishi", { imageAlt: ALT.oishiMenu, kicker: "Projeto · Oishi", title: "R$ 54,90.", accent: "Se a mesa comer tudo.", body: "O preço e a condição são um componente só." }),
    { template: "compare", kicker: "Duas formas de mostrar", title: "Qual não engana o cliente?", body: "Só o desconto | R$ 54,90 em destaque, sem explicação.\nPreço honesto | R$ 74,90 riscado, R$ 54,90 e 'sem desperdício' logo abaixo." },
    { template: "point", kicker: "Por que importa", title: "A regra aparece antes da conversa.", body: "Quem chama no WhatsApp já viu a condição ao lado do preço." },
    { template: "action", surface: "amber", art: "crescent", title: "Sua oferta tem uma condição?", body: "Link na bio.", action: "Veja o caso Oishi" },
  ],
  "catalogue-whatsapp": [
    { template: "cover", art: "crescent", kicker: "Loja que vende na conversa", title: "Você vende pelo WhatsApp?", accent: "O site não precisa de carrinho.", body: "" },
    { template: "compare", kicker: "Dois caminhos", title: "Checkout ou conversa?", body: "Loja completa | Pagamento, frete e estoque online precisam estar resolvidos.\nCatálogo | O cliente escolhe o produto e chama já sabendo o que quer." },
    shot("/projects/fa-moveis/produto.png", "~/work/fa-moveis", { imageAlt: ALT.faProduct, kicker: "F&A Móveis", title: "Cada produto termina numa mensagem pronta.", body: "O WhatsApp abre com o produto. A dona responde já sabendo do que se trata." }),
    { template: "rows", surface: "paper", kicker: "Sem mensalidade", title: "O que o catálogo não tem", body: "Banco de dados | O catálogo fica no código, sem custo mensal\nCarrinho | A venda continua na conversa\nPreço inventado | 'Consulte o preço' quando não confirmado" },
    { template: "action", surface: "amber", art: "crescent", title: "Sua venda já acontece na conversa?", body: "Link na bio.", action: "Veja o caso F&A" },
  ],
  "furniture-dimensions": [
    { template: "cover", art: "crescent", kicker: "A primeira pergunta", title: "Cabe na minha sala?", accent: "Responda antes da mensagem.", body: "" },
    { template: "annotate", image: "/projects/fa-moveis/produto.png", imageAlt: ALT.faProduct, label: "~/work/fa-moveis", kicker: "F&A Móveis", title: "Medida real, preço real.", marks: [[55.5, 54, 32, 6.5], [55.5, 42.5, 19, 7.5], [56.5, 92.5, 15, 6.5]], body: "Medidas | Largura × altura × profundidade, em cm\nPreço | Confirmado, ou 'Consulte o preço'\nMensagem | WhatsApp já com o produto" },
    { template: "point", kicker: "O detalhe", title: "Nenhuma medida digitada à mão.", body: "Cada medida é guardada como número, em centímetros, e formatada na tela. Sem arredondamento e sem erro de digitação." },
    { template: "action", surface: "amber", art: "crescent", title: "Seu cliente pergunta a medida toda vez?", body: "Link na bio.", action: "Veja o caso F&A" },
  ],
  "brief-questions": [
    { template: "cover", surface: "paper", art: "crescent", kicker: "Antes de pedir um site", title: "3 perguntas", accent: "que valem mais que um orçamento.", body: "" },
    { template: "rows", numbered: true, kicker: "Salve", title: "Responda antes da primeira conversa", body: "Quem visita? | Uma pessoa real, não 'todo mundo'\nO que ela precisa saber? | A dúvida que trava a compra\nO que ela deve fazer? | Uma ação: reservar, pedir, chamar" },
    { template: "compare", kicker: "Exemplo", title: "Qual dá para orçar?", body: "Vago | Quero um site moderno com blog.\nConcreto | O cliente vê a medida e o preço do móvel e chama no WhatsApp sobre ele." },
    { template: "action", surface: "amber", art: "crescent", title: "Tem as três respostas?", body: "Mesmo que ainda sejam hipóteses. Link na bio.", action: "Fale com o Benito" },
  ],
  "restaurant-answers": [
    { template: "cover", art: "crescent", kicker: "Para restaurantes", title: "O que o site precisa responder", accent: "antes de o cliente ligar.", body: "" },
    { template: "rows", surface: "paper", kicker: "Checklist", title: "Salve e confira o seu", body: "Cardápio legível | Em texto, não só em imagem\nPreços e condições | Juntos, sem asterisco escondido\nHorários | Os confirmados; o resto, 'a confirmar'\nReserva | Um caminho só, até o WhatsApp\nEndereço | E como chegar" },
    shot("/projects/oishi/cardapio.png", "~/work/oishi", { imageAlt: ALT.oishiMenu, kicker: "Oishi", title: "O cardápio vivia só em JPEG.", body: "Hoje cada preço, horário e item é texto real, e a reserva termina numa mensagem pronta no WhatsApp." }),
    { template: "action", surface: "amber", art: "crescent", title: "Quantos itens o seu site cumpre?", body: "Link na bio.", action: "Veja o caso Oishi" },
  ],
  "confirmed-information": [
    { template: "cover", surface: "paper", art: "crescent", kicker: "Catálogo honesto", title: "Preço não confirmado?", accent: "Escreva 'consulte'.", body: "" },
    { template: "point", kicker: "A regra", title: "Um número plausível é um preço falso.", body: "Na F&A Móveis, 10 dos 13 produtos têm preço confirmado. Os outros 3 dizem 'Consulte o preço', em vez de um chute." },
    { template: "annotate", image: "/projects/fa-moveis/consulte-preco.png", imageAlt: ALT.faConsulte, label: "~/work/fa-moveis", kicker: "F&A Móveis", title: "O catálogo diz só o que sabe.", marks: [[29.5, 61, 20, 9.5], [51, 61, 20, 9.5]], body: "Preço confirmado | Da tabela do fornecedor ou da própria dona\nConsulte o preço | Quando o valor ainda não foi confirmado" },
    { template: "action", surface: "amber", art: "crescent", title: "Seu site mostra algo que você não confirmou?", body: "Link na bio.", action: "Veja o caso F&A" },
  ],
  "which-service": [
    { template: "cover", art: "moon", kicker: "Redes sociais", title: "Estratégia, produção ou gestão?", accent: "Saiba o que contratar.", body: "" },
    { template: "rows", surface: "paper", kicker: "Três escopos", title: "Quem faz o quê", body: "Estratégia | Público, mensagem, canais e briefs\nProdução | Textos, fotos e peças a partir dos briefs\nGestão | Publicar, responder e acompanhar" },
    { template: "compare", kicker: "A pergunta certa", title: "O que falta no seu conteúdo?", body: "Ideias soltas | Você posta, mas não sabe o que funciona nem por quê.\nUm plano | Cada post responde a uma dúvida do cliente e leva a uma página." },
    { template: "action", surface: "amber", art: "crescent", title: "Precisa do plano antes dos posts?", body: "Link na bio.", action: "Conheça o serviço" },
  ],
};
