# TASK: Branded HTML for the enquiry confirmation email

## 1. Current scenario

`sendEnquiry` (`src/lib/enquiry-mail.ts`) sends the visitor a plain-text thank-you
after the studio notification is accepted. Mail clients render it as unstyled
body text (Outlook screenshot, 6 October 2026), so the first thing a prospective
client receives from the studio looks nothing like the studio.

## 2. Planned changes

- `src/lib/enquiry-receipt.ts` (new): builds the receipt's text and HTML from one
  copy source. The HTML is email-safe: table layout, inline styles, `bgcolor`
  attributes, no web fonts, no remote images, no CSS that clients strip. It uses
  the site's look: near-black ground, one cool-edged terminal window with a
  title bar, amber only on the mark, sharp corners. The pixel crescent is drawn
  as a table of cells derived from `LOGO_PATH`, so it shows even when the client
  blocks images. Hidden preheader text, `color-scheme: dark` meta. The copy is
  unchanged and still contains no visitor-provided text.
- `src/lib/enquiry-mail.ts`: sends `text` + `html` (multipart/alternative).
  The studio notification stays plain text: it's an internal working message.
- `scripts/check-enquiry.mjs`: asserts the receipt has a `text/html` part and a
  plain part, and still excludes visitor content.
- `docs/email-setup.md`: describe the HTML version.

Rejected: a remote logo image (blocked by default in Outlook, a spam signal on a
new sender); a React Email dependency (one static template doesn't warrant it).

## 3. Why

The receipt is the studio's first direct contact with a lead. Styling does not
change spam classification, which is about sender reputation and the
`gmail.com` From address; that remains a separate custom-domain decision.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/enquiry-receipt.ts` | new | Text + HTML receipt from one copy source |
| `src/lib/enquiry-mail.ts` | edit | Send multipart receipt |
| `scripts/check-enquiry.mjs` | edit | Assert both parts |
| `docs/email-setup.md` | edit | HTML version noted |

## 5. Validation

Implemented. Rendered previews at 1000px and 390px checked by eye. ESLint,
`tsc`, `pnpm build` and `pnpm check:enquiry` (now asserting both MIME parts)
pass. Not yet verified in real Outlook/Gmail clients.
