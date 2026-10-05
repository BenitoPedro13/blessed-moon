# Agency profile collection

Updated 5 October 2026. Benito completed the selected grid and deep exports; the bounded sample is reviewed. Actual imported totals are recorded in `corpus/coverage.json`.

Use your own signed-in browser, as with Unimeet. The new collector reads the visible profile grid; it does not extract session credentials or call private APIs.

## Export each account

1. Open an account below on desktop Instagram, select its Posts tab, and scroll back to the top. Close any post/modal so the profile grid is visible.
2. Open DevTools Console (Mac: Option–Command–J), paste the entire contents of `scripts/social-research/console.js`, and press Enter. Inspect the script first. If your browser blocks pasted code, follow its own console instructions.
3. Leave the tab open while the script scrolls slowly. It saves `ig-agency-HANDLE.json` in Downloads, with up to 36 distinct visible grid posts. Fewer records is fine; do not manufacture missing ones.
4. Repeat for each profile. Leave the JSON files in Downloads; tell the agent when they are ready. No need to upload them elsewhere.

Start with Refokus, Clay, Ramotion and RD Station so the first batch covers websites, product work and Brazilian marketing buyers.

## Selected full posts: deeper export

Use `scripts/social-research/console-deep.js` on the profile's Posts tab, with no post open. Start with **Refokus only** and inspect the first `ig-agency-refokusagency-deep.json` before spending time on all accounts. The script passed controlled UI fixtures, and Benito supplied actual signed-in exports from all ten accounts. Their current captured fields are documented in the corpus audit.

It opens six loaded grid posts by default (`POST_LIMIT = 6` near the top), reads the visible caption heading, walks visible carousel slides, and returns to the profile between posts. It saves slide image URLs/alt text, dates when shown, rendered post text, visible links and CTA text candidates. It does not click likes, comments or follow controls. Running the grid export first can load more links; the deep script operates on currently loaded grid links. Raise the limit only after checking a pilot output.

Caption status is recorded per post. A missing caption selector stays unconfirmed. `slide_stop_reason` records why traversal ended; missing controls or repeated slides do not guarantee a complete carousel. CTA candidates require human review. Image alt text is not OCR. Videos are identified where visible but are not downloaded or transcribed. A login/challenge, missing post, unexpected navigation or your stop flag ends collection and exports any captured records.

The same importer accepts both grid and deep exports. It saves every captured slide image separately and keeps deep captions/slides when a newer grid export refreshes an account. Actual deep-post, observed-caption and slide counts appear in the coverage ledger. Keep both JSON files in Downloads. The per-account target remains 36 distinct posts: selected deeper reviews are **additional evidence on those posts**, not new posts to inflate the count.

## Accounts

| Profile | Role | Why it is in the sample | Verified through |
|---|---|---|---|
| [Refokus / @refokusagency](https://www.instagram.com/refokusagency/) | agency-reference | Websites and brand presentation; larger international studio. | [Publisher link](https://www.refokus.com) |
| [Clay / @clayglobal](https://www.instagram.com/clayglobal/) | agency-reference | Product design and websites for founders; larger international agency. | [Publisher link](https://clay.global) |
| [Tonik / @wearetonik](https://www.instagram.com/wearetonik/) | agency-reference | Product design for startups; startup-facing reference. | [Publisher link](https://www.tonik.com) |
| [Ramotion / @ramotion](https://www.instagram.com/ramotion/) | agency-reference | Brand, website and product-design evidence; larger international agency. | [Publisher link](https://www.ramotion.com) |
| [Baunfire / @baunfire](https://www.instagram.com/baunfire/) | agency-reference | Websites for business and marketing buyers; larger international agency. | [Publisher link](https://www.baunfire.com) |
| [Cadastra / @cadastra](https://www.instagram.com/cadastra/) | adjacent-agency | Brazilian marketing and digital services; enterprise-scale reference. | [Publisher link](https://cadastra.com) |
| [Superside / @supersidehq](https://www.instagram.com/supersidehq/) | adjacent-agency | Creative production and service packaging for marketing teams. | [Publisher link](https://www.superside.com) |
| [RD Station / @rdstation](https://www.instagram.com/rdstation/) | buyer-educator | Brazilian marketing and sales buyers; software vendor rather than studio competitor. | [Publisher link](https://www.rdstation.com) |
| [HubSpot / @hubspot](https://www.instagram.com/hubspot/) | buyer-educator | Marketing and sales buyers; international software vendor. | [Publisher link](https://www.hubspot.com) |
| [The Futur / @thefuturishere](https://www.instagram.com/thefuturishere/) | peer-education | Design-business education; peer reference, not evidence of buyer demand. | [Publisher link](https://thefutur.com) |

The selected 10 × 36 target is **360 records**, not a claim that we have collected or analysed 360 posts. Benito excluded LayerUp and Sebrae as unrelated to his work on 5 October. These remaining organisations publish official social links. Agency references have overlapping services, but several are much larger than Benito’s solo studio. They are not proven direct competitors for the same projects. The Futur is a peer reference and must not drive buyer-demand conclusions. Local solo-studio coverage remains a research gap to validate.

## Import locally

From the Blessed Moon project folder:

```sh
python3 scripts/social-research/import.py "$HOME"/Downloads/ig-agency-*.json
```

The importer uses Python’s standard library. It validates the account and identifiers, archives the original JSON with a SHA-256 fingerprint, merges duplicate shortcodes, and fetches covers only from HTTPS Instagram/Meta CDN addresses. Redirects are checked too. Covers larger than 8 MB are refused; failures retain the post record. `--skip-images` imports JSON without downloading pictures. Rerun with a fresh export if cover links have expired.

`docs/social/corpus/coverage.json` records the actual totals per account and separately reports distinct posts, covers, text coverage and analysis status. Original exports, signed CDN links and downloaded media stay in gitignored `docs/social/corpus/raw/`. The aggregate coverage ledger can be committed; no competitor imagery is published as our own.

## What we can learn—and what needs a deeper sample

Grid covers show visual hooks, topics, cover composition and visible format indicators. Saved image alt text can support topic coding but is not a verified caption. This export intentionally leaves dates and engagement unknown; it does not retrieve inner carousel slides or videos. Grid order may include pinned posts.

After import, analyse each account separately before pooling: intended buyer, problem, hook, format, proof, offer and next action. Review representative cover images and record their source URLs. For the most relevant 2–4 accounts, open selected posts manually and capture the full caption, slide sequence, CTA and destination. Only mark those fields as observed when actually supplied or inspected. Likes and follower counts alone cannot establish conversions.

Recommendations and original post suggestions must distinguish observed patterns, Benito’s project evidence and ideas to test. The supporting ten-post LinkedIn sample remains separate; the initial twelve-post audit is a historical record, with LayerUp now excluded. Do not reuse Unimeet’s education audience data as agency research.

## Stopping

Stop a running export with `window.__blessedMoonStopExport = true`. Changing pages or opening a modal also ends collection. If Instagram requests login or verification, stop and handle that yourself; the script does not bypass it.

## Completed sample

356 distinct records and 356 covers; Baunfire returned 32 and all other selected
accounts returned 36. Deep exports captured 59 full caption headings and 85
inner-media positions, with 84 images saved. One Tonik inner-media URL did not
return a supported raster image. Grid imports preserve deep captions even when
a video had zero captured frames, and preserve observed dates/known formats.
Read [the audit](11-instagram-corpus-audit.md). No additional export is required
to review the current plan. New exports may justify another specifically scoped
audit; the importer invalidates a previous audit when archive hashes change.
