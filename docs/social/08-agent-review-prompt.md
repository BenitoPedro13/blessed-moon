# Prompt for a future website agent

The requested implementation already exists. Use this prompt for review and further
iteration, not to duplicate the routes or discard the research.

```text
Work in /Users/benito/Documents/personal/blessed-moon. Read AGENTS.md, CLAUDE.md,
the installed Next.js documentation required by AGENTS.md, the task document
docs/tasks/TASK-social-strategy-and-service.md, and docs/social/README.md first.
Also read docs/tasks/TASK-page-scroll-reachability.md,
docs/tasks/TASK-social-research-and-creative-v2.md,
docs/social/11-instagram-corpus-audit.md,
docs/tasks/TASK-social-preview-builder.md and
docs/social/09-production-workspace.md for the implemented production tools.
Inspect git status and preserve existing work.

Blessed Moon Studio is now Benito's solo practice. Current public copy must say
Benito handles strategy, design and engineering directly; there is no MDR or
co-founder. Keep historical case-study team facts accurate. Preserve the existing
terminal aesthetic, amber accent, ASCII moon, motion and 8→4→3→1 / A→B→0 motifs.
The About A/B motif represents Benito's two disciplines.

Review the existing /services/social-media offer: Social Media Strategy & Content
Planning. It includes audience research, public content from competitors and
same-audience accounts, platform selection, positioning, four pillars, a 30-day
calendar with 12 ideas, four detailed sample briefs, measurement specification,
handover and one consolidated revision. One business/market/language, up to two
channels and five competitor references. Public pricing stays custom quote.
Production, publishing, community management, paid ads and custom plan-page
development need separate scope. Do not promise social management by default.

Review /social-plan, /instagram-plan, /linkedin-plan and /analytics-plan. These
are unlinked, noindex working documents, not authenticated pages. Keep source
links, research limits and hypotheses visible. The audit now contains 356 distinct Instagram records/covers across ten accounts,
59 captured full captions, 85 observed inner-media positions and 84 saved images;
nine carousel sequences reached no next control but completeness is not guaranteed.
All cover contact sheets, captured captions and saved inner images were reviewed.
Ten LinkedIn samples across five families and five offer references remain separate.
LayerUp and Sebrae profiles were excluded by Benito. Keep agency, adjacent-service,
buyer-educator and peer references distinct. Raw competitor captions/media and signed
CDN URLs stay gitignored in docs/social/corpus/raw; do not publish those assets.
Use corpus/coverage.json, audit.json and post-index.csv for provenance. Never invent account performance or imply
competitor results belong to Blessed Moon. Every brief separates its sampled
research pattern from actual Blessed Moon project evidence.

Previews, nine-cover studies and /post-builder already exist. The browser editor
uses shared SVG artwork for live previews and PNG/ZIP/PDF exports, edits existing
research drafts or blank posts, uses eight templates and dark/paper/amber artwork, with comparisons, workflows,
checklists, project evidence and a closing action. It handles local screenshots and
six allowlisted portfolio presets; exports embed those presets as data URIs. It saves/imports
editable JSON. Keep drafts local and rr-block on editable roots for the existing
recorder. It has no AI text/image API, video export, publishing or cloud persistence.
Planning graphs show proposals; the analytics worksheet plots only manually entered
real observations. Blank weeks are unknown, distinct from measured zeroes. Do not
replace these with fabricated live dashboards or expose draft contents in events.

The pilot (revised 5 October 2026) leads in English for international founders and
product leaders: two stories weekly, each an Instagram carousel and the same slides
as a LinkedIn document. An optional Portuguese Instagram account takes one story
weekly. The library is 12 English and 8 Portuguese authored carousels in
`src/lib/social-posts.ts`; facts only from `studio-data.ts`. Record actual production time against a
4–6-hour weekly budget. Use native insights and qualified enquiries to revise it.

Internal recommended fees are R$3,900 once for strategy and R$1,800/month for
strategy review; the client produces/publishes. They are workload-based proposals,
not market averages or approved public rates. Review docs/social/03-service-and-
pricing.md and the calculator before changing scope or fees.

Preserve the existing contact flow: validated Social Media Strategy preselection;
opening an email draft or successfully copying a brief is intent, not a submitted
lead. Optional Umami payloads use fixed enums and exclude personal form data.
Tracker failure must not block contact actions. Confirm official contact/booking
configuration and real analytics ingestion separately; do not invent credentials
or a booking URL. Do not add another tracker or fabricated live dashboard.

Preserve the scrolling fix: html grows with document content so Lenis dimensions
update; shared stages observe content and switch to normal flow when it is too
large, then restore pinning when it fits. Case galleries use document scrolling;
Work counts derive from the project array. Do not restore fixed html height or
nested main-content scrollers. Preserve compact pinning and reset stage progress
on flow fallback. Test growing Work content, expanded briefs and footer reachability
with actual wheel/keyboard input at desktop/mobile widths in both motion modes.

For any approved iteration, update the task/research docs and /system specimens
when shared components change. Run pnpm lint, type checks, pnpm build and
scripts/check-social-strategy.mjs against a running preview.
Also run scripts/check-post-builder.mjs for exports, editing and worksheet behavior,
scripts/check-page-scroll.mjs for all 20 routes × six viewport/motion configurations,
and scripts/social-research/check-collectors.mjs for collector UI fixtures, and
python3 scripts/social-research/check-import.py for archive merging and validation.
Check reduced-motion
hydration and all eight service cards on short 320/390/1440px-wide viewports.
Give a reviewable change summary with route links and any remaining limitations.
Follow repository commit conventions. Do not push or deploy without authorization.
```
