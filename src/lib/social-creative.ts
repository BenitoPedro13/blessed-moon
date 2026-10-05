import type { ArtSlide } from "@/lib/social-art";
import type { Channel, Story } from "@/lib/social-plan";

// Original editorial copy grounded in project records. The observed content
// patterns are linked separately in instagram-research; no result is inferred.
const DETAILS: Record<string, readonly string[]> = {
  "website-details": [
    "O cliente viu o post. Agora quer saber preço, condições e como falar com você. Veja como organizar esse caminho.",
    "No feed · A publicação apresenta uma oferta.\nNo site · A página mantém os detalhes dessa oferta juntos.",
    "O que está incluído?\nQual condição muda o preço?\nQual é o próximo passo?",
    "Oishi: oferta e condições\nPágina com a informação completa\nCaminho para a reserva",
    "No Oishi, preço, condição e caminho para reserva aparecem juntos. A pessoa consegue conferir a oferta antes de escolher o próximo passo.",
    "Abra o caso Oishi pelo link do perfil. Veja como oferta, condição e próximo passo ficam juntos e use essa decisão para pensar no seu próprio site.",
  ],
  "oishi-condition": ["No Oishi, o desconto tem uma condição. O projeto coloca essa informação junto da oferta para a pessoa decidir com os detalhes à vista."],
  "catalogue-whatsapp": [
    "Seu cliente escolhe online e negocia por mensagem? O site pode preparar essa conversa sem criar uma operação de checkout.",
    "Compra direta · Pagamento e entrega precisam estar resolvidos.\nConversa assistida · Produto e informação levam ao atendimento existente.",
    "Foto do produto certo\nMedidas e preço confirmado\nAção ligada ao produto consultado",
    "Escolher um produto\nConferir os detalhes\nConversar pelo WhatsApp",
    "A F&A Móveis tem uma página de produto com medidas, preço quando confirmado e caminho para o atendimento. A escolha acompanha a operação da loja.",
    "Abra o caso F&A Móveis pelo link do perfil. Compare o caminho do catálogo com a forma como sua loja atende hoje, antes de decidir se precisa de checkout.",
  ],
  "furniture-dimensions": ["Antes da mensagem, há uma pergunta: cabe no espaço? A página da F&A Móveis apresenta largura, altura e profundidade junto do produto."],
  "one-action": [
    "Uma página pode ter várias informações. Escolha o próximo passo principal antes de decidir sua estrutura.",
    "Brief vago · Quero um site moderno.\nBrief concreto · Quero que a pessoa entenda o serviço e peça uma proposta.",
    "Quem toma a decisão?\nO que precisa entender primeiro?\nO que deve fazer depois?",
    "Pergunta do comprador\nInformação necessária\nPróximo passo visível",
    "Exemplo: o lojista mostra o produto e suas medidas antes de abrir a conversa. Na F&A Móveis, o fluxo acompanha essa ordem.",
    "Leve uma ação concreta para a conversa de projeto. No contato do perfil, conte quem visita seu site e o que essa pessoa precisa fazer.",
  ],
  "brief-questions": [
    "Não precisa chegar com todas as telas prontas. Estas três respostas ajudam Benito a discutir o escopo com você.",
    "Público amplo · Pessoas interessadas no meu negócio.\nPúblico concreto · Quem quer conferir um produto antes de pedir atendimento.",
    "Público: comprador de móveis\nDúvida: tamanho e preço\nAção: consultar o produto pelo WhatsApp",
    "Escolha uma pessoa real\nListe a dúvida que ela traz\nDefina a próxima ação",
    "Um exemplo preenchido é mais útil que uma lista de funcionalidades. Descreva como uma conversa comercial começa hoje e o que o site deve esclarecer.",
    "Abra o contato pelo link do perfil. Envie suas três respostas, mesmo que ainda sejam hipóteses; o escopo começa nessa conversa.",
  ],
  "strategy-contents": [
    "Você precisa sair da estratégia sabendo o que produzir, para quem e por quê. Veja o que o novo serviço organiza.",
    "Antes · Ideias soltas e dúvidas sobre onde publicar.\nDepois · Decisões documentadas, calendário e briefs para orientar a produção.",
    "Público e dúvidas de compra\nReferências e concorrentes\nCanais, temas e próximo passo",
    "Pesquisa relevante\nCalendário com briefs\nPlano para revisar os sinais",
    "Exemplo de entrega: um brief liga a pergunta do comprador a uma evidência, um formato e uma página. Produção e publicação têm escopo separado.",
    "Conheça Estratégia e Planejamento de Conteúdo no perfil. Conte seu negócio, seus canais e o que você quer que o conteúdo ajude a decidir.",
  ],
  "sample-calendar": [
    "Se a linha do calendário só diz o tema, quem produz ainda precisa resolver quase tudo. Veja uma linha que já orienta o trabalho.",
    "Linha vaga · Segunda: postar sobre a marca.\nLinha útil · Explicar a condição de uma oferta com a página real do projeto.",
    "Pergunta: o que muda o preço?\nEvidência: página do Oishi\nFormato: gravação com um destaque",
    "Pergunta do comprador\nEvidência que podemos mostrar\nDestino com o próximo passo",
    "O brief já define o que destacar, qual captura usar e o que revisar antes de publicar. A pessoa que produz recebe uma decisão concreta, além de um tema.",
    "Seu calendário deixa essas decisões para depois? Conheça o serviço no perfil e descreva uma publicação que hoje é difícil de produzir.",
  ],
  "likes-intent": [
    "Uma publicação pode chamar atenção sem iniciar uma conversa comercial. Acompanhe o caminho inteiro, com sinais separados.",
    "Atenção · Alcance, curtidas, salvamentos e respostas relevantes.\nIntenção · Visita à página e uma conversa sobre um projeto real.",
    "O assunto chegou à pessoa certa?\nA pessoa visitou a página ligada ao post?\nA conversa corresponde ao serviço oferecido?",
    "Publicação e resposta\nVisita identificada no site\nConversa qualificada",
    "Exemplo: registre o link usado no post e as conversas relacionadas. Uma visita ou abertura de email não equivale a um projeto fechado.",
    "Salve as três perguntas para revisar sua próxima publicação. Se quiser estruturar essa leitura, conheça o serviço de estratégia no perfil.",
  ],
  "tagged-link": ["Um link identificado ajuda a distinguir visitas de uma campanha. Ele não revela, sozinho, se a pessoa virou cliente. Veja o caminho no plano de medição."],
  "restaurant-answers": [
    "Antes de ligar, a pessoa quer saber se o restaurante atende à ocasião. A página precisa responder às perguntas que antecedem a reserva.",
    "Informação espalhada · Procurar oferta, horário e endereço em posts diferentes.\nPágina da oferta · Ver condições e encontrar o caminho para reservar.",
    "O que a oferta inclui?\nQuais condições precisam estar claras?\nOnde encontro informação e reserva?",
    "Entender a oferta\nConferir as condições\nSeguir para a reserva",
    "No Oishi, o cardápio apresenta a escolha, a oferta reúne as condições e a reserva oferece o próximo passo. Cada parte da página responde a uma pergunta da pessoa que está decidindo.",
    "Abra o caso Oishi pelo link do perfil. Veja os papéis do cardápio, da oferta e da reserva; depois, identifique qual pergunta seu restaurante precisa responder primeiro.",
  ],
  "smallest-system": [
    "Catálogo, agenda e painel resolvem trabalhos diferentes. Antes de escolher um sistema, descreva o processo que precisa funcionar.",
    "Lista de recursos · Quero pagamento, cadastro, agenda e painel.\nProcesso concreto · O cliente escolhe um serviço e precisa marcar um horário.",
    "F&A Móveis: consultar um produto\nMarkado: escolher e agendar um serviço\nFlora: acompanhar informação no painel",
    "Quem executa o trabalho?\nQual informação precisa consultar?\nQual ação conclui a tarefa?",
    "No Markado, a página de agendamento conecta serviço e disponibilidade. O cliente escolhe o que precisa e encontra os horários no mesmo fluxo. O escopo acompanha a tarefa.",
    "No contato do perfil, descreva um processo que hoje depende de mensagens ou planilhas. Benito pode ajudar a definir o primeiro escopo útil.",
  ],
  "screenshot-context": [
    "Uma tela bonita mostra a interface. A decisão por trás dela explica por que alguém deveria prestar atenção.",
    "Legenda vaga · Novo dashboard no ar.\nContexto útil · Que informação a pessoa precisa consultar e qual decisão vem depois?",
    "Nomeie a tarefa da pessoa\nMostre a parte relevante da tela\nExplique a escolha e seu limite",
    "Tarefa do usuário\nDecisão de interface\nEvidência que aparece na tela",
    "No Flora, uma observação do campo pode virar tarefa. O painel dá um lugar para acompanhar essa ação. O contexto conecta a tela ao trabalho que a pessoa veio realizar.",
    "Abra o portfólio pelo link do perfil para ler a decisão completa. Ao discutir seu projeto, traga uma tarefa que o usuário precisa realizar.",
  ],
  "confirmed-information": [
    "Um preço não confirmado não deve ganhar aparência de certeza só para preencher um card. Mostre o que está verificado.",
    "Suposição · Publicar um valor ainda não confirmado.\nInformação honesta · Pedir uma consulta quando o preço precisa ser verificado.",
    "Confirme a origem do valor\nMostre o preço quando estiver verificado\nDefina o caminho para consultar o restante",
    "Informação recebida\nVerificação antes de publicar\nPreço ou ação de consulta",
    "A F&A Móveis diferencia produtos com preços confirmados daqueles que precisam de consulta. A decisão aparece na interface e no conteúdo do catálogo.",
    "Abra o caso F&A Móveis pelo link do perfil. Veja como o catálogo diferencia preço confirmado de consulta e compare com seu processo de atualização.",
  ],
  "which-service": [
    "Antes de contratar apoio para redes sociais, descubra qual parte do trabalho você precisa delegar. Os escopos não são iguais.",
    "Estratégia · Pesquisa, decisões, calendário e briefs.\nExecução · Criar os assets, publicar e acompanhar as conversas, conforme contrato.",
    "Precisa decidir o que publicar? Estratégia.\nPrecisa produzir fotos e peças? Produção.\nPrecisa delegar a operação? Gestão.",
    "Nomeie o trabalho necessário\nDefina quem executa cada etapa\nCombine entregas e limites",
    "Blessed Moon oferece estratégia e planejamento. Produção, publicação, moderação e anúncios precisam de proposta própria; não estão implícitos no calendário.",
    "Veja o serviço no perfil. Na conversa, conte o que sua equipe consegue executar e quais decisões ainda precisam de apoio.",
  ],
  "pilot-review": [
    "O primeiro ciclo deve ajudar a escolher o que manter, mudar ou pausar. Não precisa terminar com uma história de sucesso inventada.",
    "Relatório vazio · Houve curtidas, então funcionou.\nRevisão útil · Quem respondeu, qual conversa surgiu e quanto trabalho a produção exigiu?",
    "Quais perguntas tiveram respostas relevantes?\nQuais visitas levaram a conversas adequadas?\nA produção cabe na rotina de uma pessoa?",
    "Observar os sinais reais\nEscolher uma mudança\nTestar e revisar de novo",
    "A planilha separa semanas sem informação de semanas com zero observado. Compare temas e formatos sem atribuir resultado a uma única mudança.",
    "Registre uma decisão para o próximo ciclo: manter, mudar ou pausar. Se precisar de apoio nessa revisão, veja o serviço de estratégia no perfil.",
  ],
};

export const PROJECT_ART_IMAGES = {
  "/projects/oishi/rodizio-com-sashimi.png": "Oishi · offer and conditions",
  "/projects/oishi/cardapio.png": "Oishi · menu",
  "/projects/fa-moveis/produto.png": "F&A Móveis · product details",
  "/projects/fa-moveis/produtos.png": "F&A Móveis · catalogue",
  "/projects/markado/booking-page.png": "Markado · booking page",
  "/projects/flora/tasks.png": "Flora · task dashboard",
} as const;

const PROOF: Record<string, { image: keyof typeof PROJECT_ART_IMAGES; alt: string; label: string }> = {
  "website-details": { image: "/projects/oishi/rodizio-com-sashimi.png", alt: "Captura do Oishi: página do rodízio com valores e condições da oferta.", label: "OISHI" },
  "oishi-condition": { image: "/projects/oishi/rodizio-com-sashimi.png", alt: "Captura do Oishi com a condição apresentada junto dos valores da oferta.", label: "OISHI" },
  "catalogue-whatsapp": { image: "/projects/fa-moveis/produto.png", alt: "Página de produto da F&A Móveis com foto, medidas, preço e ação de atendimento.", label: "F&A MÓVEIS" },
  "furniture-dimensions": { image: "/projects/fa-moveis/produto.png", alt: "Captura do produto da F&A Móveis com largura, altura e profundidade.", label: "F&A MÓVEIS" },
  "one-action": { image: "/projects/fa-moveis/produto.png", alt: "Página de produto da F&A Móveis: informação antes da ação de consulta.", label: "F&A MÓVEIS" },
  "sample-calendar": { image: "/projects/oishi/rodizio-com-sashimi.png", alt: "Página real do Oishi usada como evidência num brief de exemplo.", label: "OISHI" },
  "restaurant-answers": { image: "/projects/oishi/cardapio.png", alt: "Página de cardápio entregue no projeto Oishi.", label: "OISHI" },
  "smallest-system": { image: "/projects/markado/booking-page.png", alt: "Página de agendamento do Markado com escolha de serviço e horário.", label: "MARKADO" },
  "screenshot-context": { image: "/projects/flora/tasks.png", alt: "Captura do painel de tarefas do projeto Flora.", label: "FLORA" },
  "confirmed-information": { image: "/projects/fa-moveis/produtos.png", alt: "Catálogo da F&A Móveis com produtos e ações de consulta.", label: "F&A MÓVEIS" },
};

export function creativeSlides(story: Story, channel: Channel): Partial<ArtSlide>[] {
  const proof = PROOF[story.id];
  if (channel === "linkedin") return [{
    title: story.title, body: story.linkedin.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ").slice(0, 500),
    kicker: proof ? "PROJECT / " + proof.label : "BUYER QUESTION / STUDIO NOTES",
    template: proof ? "window" : "cover", surface: story.week % 2 ? "dark" : "paper", label: proof ? "~/work/" + proof.label.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "",
    image: proof?.image || "", imageAlt: proof ? "Project screenshot: " + proof.alt : "",
    action: "Read the decision behind the build →",
  }];
  const details = DETAILS[story.id];
  if (story.format === "Screen recording") return [{
    title: story.slides[0].replace(/^\d+\s*[–-]\s*\d+s:\s*/, ""), body: details?.[0] || story.caption,
    kicker: proof ? "PROJETO / " + proof.label : "GRAVAÇÃO / CAPA", template: proof ? "window" : "cover",
    surface: "paper", image: proof?.image || "", imageAlt: proof?.alt || "", action: "Veja o projeto no perfil →",
  }];
  const templates = ["cover", "compare", "rows", "rows", proof ? "window" : "point", "action"] as const;
  const kickers = ["PERGUNTA DO COMPRADOR", "DUAS FORMAS DE PENSAR", "EXEMPLO APLICADO", "O CAMINHO DA DECISÃO", proof ? "PROJETO / " + proof.label : "NA PRÁTICA", "PRÓXIMO PASSO"];
  return story.slides.map((title, index) => ({
    title, body: details?.[index] || story.caption, kicker: kickers[index], template: templates[index],
    surface: index === 0 ? (story.week % 2 ? "amber" : "paper") : index === 3 ? "paper" : "dark",
    image: index === 4 ? proof?.image || "" : "", imageAlt: index === 4 ? proof?.alt || "" : "",
    action: index === 5 ? (story.destination === "/contact" ? "Converse com Benito →" : story.destination === "/services/social-media" ? "Conheça o serviço →" : "Veja o projeto no perfil →") : "",
  }));
}
