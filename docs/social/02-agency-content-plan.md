# Blessed Moon's own content plan

Draft pilot, 4 October 2026; revised 5 October 2026. This is the agency's marketing plan, not a client's package scope.

## Objective and rhythm

Help a relevant buyer understand what Blessed Moon builds, how it makes decisions, and how to start a project. Use completed delivery evidence and accurately labelled work in progress. Measure qualified enquiries and accepted proposals alongside attention metrics.

**Revised 5 October 2026** (Benito: the better opportunities are international clients paying in strong currencies). English leads: two stories a week for six weeks, each an Instagram carousel on `@blessedmoon.studio` and the same slides as a square PDF document on Benito's LinkedIn profile. An optional Portuguese Instagram account takes one story a week for eight weeks. Budget 4–6 hours weekly initially and record actual time; reduce volume if it exceeds available capacity.

The [Instagram audit](11-instagram-corpus-audit.md) reviews 356 covers, 59 captured captions and saved inner images across ten selected accounts; its strongest pattern, the work in context on the cover, now leads the series. Ten supporting LinkedIn posts remain separately labelled. Patterns guide structure; competitors' wording, testimonials and results are not copied.

Pillars: buyer education (35%), project evidence (35%), process/decisions (20%), service explanation (10%), a mix guide, not a quota. Every carousel is authored in `src/lib/social-posts.ts` with its own order and length; the art system is in `TASK-social-art-foundations.md` and `TASK-social-art-signatures.md`.

## Queue

Titles are the covers. Destinations carry `utm_content` `ig-<lang>-wNN-<id>` or `li-en-wNN-<id>`.

| Week | English A | English B | Portuguese (optional account) |
|---|---|---|---|
| 1 | Your brief lists features. It should name one action. → `/contact` | Two clients. One slot. Only one can book it. → `/work/markado` | Seu Instagram vende. O site tira a dúvida. → `/work/oishi` |
| 2 | Catalogue, booking or dashboard? Name the job first. → `/contact` | Satellite pixels in. Field tasks out. → `/work/flora` | R$ 54,90. Se a mesa comer tudo. → `/work/oishi` |
| 3 | 7 questions to ask before you hire a studio. → `/contact` | 13 products. 10 prices. Three say 'ask', on purpose. → `/work/fa-moveis` | Você vende pelo WhatsApp? O site não precisa de carrinho. → `/work/fa-moveis` |
| 4 | Listings ask 'which apartment?' Buyers ask 'will I get credit?' → `/work/prumo` | A screenshot shows the UI. The decision sells the work. → `/work` | Cabe na minha sala? → `/work/fa-moveis` |
| 5 | What a content plan should hand you: briefs, not topics. → service | Reach on one platform isn't reach on another. → `/work/bee-dash` | 3 perguntas que valem mais que um orçamento. → `/contact` |
| 6 | Keep Shopify. Lose the theme. → `/work/sua-mesa-fit` | Likes measure attention. Enquiries measure fit. → service | O que o site precisa responder antes de o cliente ligar. → `/work/oishi` |
| 7 | | | Preço não confirmado? Escreva 'consulte'. → `/work/fa-moveis` |
| 8 | | | Estratégia, produção ou gestão? → service |

Retired from the earlier library, as studio-introspective rather than useful to the buyer: the sample calendar, tagged link and pilot review posts. Their ideas survive inside `strategy-contents` and `likes-intent`.

Choose dates after confirming launch readiness. Do not backdate posts or tie the calendar to research dates. Posting windows begin as a test and are refined from account insights; no unsupported 'best time' claims.

## How a post is built

- **Cover:** one dominant element (the work in the terminal window, or a concrete question beside the crescent or the moon) and a headline of twelve words or fewer, with the hook in the amber accent line.
- **Case posts** put the screenshot on the cover. **Education posts** give the reader something to keep (a checklist, a question set, a formula) and end on a worked example from a real case.
- **No hedges on the art.** What the evidence doesn't show lives in the story's `evidence` note and the brief's "Before publishing" section. A slide says only what `studio-data.ts` records.
- **One action** on the last slide, matching the destination, plus a reason to save the post.

## Operation and review

Keep each post record with stable ID, channel, audience, hook, format, script/slides, caption, asset checklist, destination, UTM, review status and source. Use draft / ready / published states. Cross-channel adaptations have separate IDs; they are not silently counted as new researched ideas.

Every two weeks compare median performance across similar formats and inspect the quality of conversations. One unusually popular post is not enough to change positioning. If education gets attention but no relevant enquiries, revise the buyer specificity or destination. If a case brings relevant enquiries with modest reach, repeat the underlying decision story.

At days 30, 60 and 90 review production hours, relevant enquiries, proposed work and accepted contracts. Keep the strongest two series and drop work that is expensive to create without helping the intended buyer. Set numeric commercial targets after the first baseline and capacity review.
