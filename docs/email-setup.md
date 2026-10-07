# Blessed Moon enquiry email

The project form sends a notification to `blessedmoon.studio@gmail.com`. The
visitor's address is Reply-To, so replying reaches them. After that notification
is accepted by SMTP, the visitor receives this confirmation, sent as a branded
HTML message with the same words as its plain-text alternative
(`src/lib/enquiry-receipt.ts`):

> Thanks for telling me about your project.
>
> Your enquiry has reached Blessed Moon Studio. I'll review it and follow up with you personally.
>
> If you'd like to add anything, just reply to this email.
>
> Benito
> Blessed Moon Studio

The sender is Blessed Moon Studio. Receipt replies reach the studio inbox.
Visitor-provided text is not copied into the acknowledgement. The HTML uses
tables, inline styles and system fonts with no remote images, so the pixel
crescent (table cells from `LOGO_PATH`) shows even when images are blocked.
Styling does not affect spam filtering; a `gmail.com` sender landing in junk is
a reputation/domain matter. No automatic
response deadline, sales qualification or revenue is claimed.

## Gmail configuration

1. Sign into the studio Gmail account.
2. Enable [2-Step Verification](https://myaccount.google.com/signinoptions/two-step-verification).
3. Open [App Passwords](https://myaccount.google.com/apppasswords) and create one
   named `Blessed Moon website`. If the option is unavailable, check the selected
   account and that 2-Step Verification is complete. Security-key-only setups,
   organization restrictions and Advanced Protection can also prevent access.
   [Google's App Password guidance](https://support.google.com/accounts/answer/185833?hl=en).
4. Configure these **server-only** values in `.env.local`:

```dotenv
AGENCY_CONTACT_EMAIL=blessedmoon.studio@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=blessedmoon.studio@gmail.com
SMTP_FROM_EMAIL=blessedmoon.studio@gmail.com
SMTP_PASSWORD=YOUR_GOOGLE_APP_PASSWORD_WITHOUT_SPACES
```

Use the generated App Password, not the normal account password. Never commit
it, put it in a `NEXT_PUBLIC_` variable, or paste it in chat. Google revokes App
Passwords after an account-password change, so update the environment then.

`pnpm smtp:verify` checks TLS and authentication without sending email or printing
credentials. Restart the local server after editing `.env.local`.

In Vercel → project Settings → Environment Variables, add these same six values
for **Production**, then redeploy for the changes to take effect. Local files are
not uploaded as production secrets. Leave Preview SMTP credentials unset unless
you intentionally want preview submissions to send emails.

After deployment, submit one real enquiry using an inbox you control. Check the
studio notification, that Reply-To reaches the visitor, and the visitor thank-you
(including spam folders). SMTP acceptance does not prove eventual inbox delivery.

## Failure handling and measurement

The form preserves all inputs on failure and prevents concurrent submissions.
If the studio notification fails, no thank-you is attempted and no Umami submit
event is fired. If only the thank-you fails, the enquiry stays accepted; the page
confirms submission without claiming a receipt was sent. Successful state is
persistent so double-clicking cannot submit again.

The new events are `project-enquiry-start` (first edit, once per page view) and
`project-enquiry-submit` (API accepted the enquiry). Both contain only a fixed
`project_type`. No contact data or message enters custom events. Trackers can be
blocked, so the receiving inbox remains the submission record. Historical
`project-enquiry-email-open` and `project-enquiry-brief-copy` mean intent only.

The entire form carries `rr-block` to exclude it from session replays. Messages
are sent to Gmail rather than saved in an application database; Gmail/provider
mail handling and retention still apply.

## Abuse backstops and verification

The API validates bounded strings, rejects header injection and unsupported
project types, limits request bodies, checks same-origin requests and uses a
honeypot. Sender and studio recipient are server-controlled. TLS is required
(465 implicit TLS; 587/2525 STARTTLS). There is no SMTP debug/body logging.

The limits are five requests per ten minutes per IP and three valid submissions
per hour per normalized email address, **per server instance**. Gmail dot/plus
aliases and googlemail.com share the same mailbox quota. Failed SMTP attempts
also consume it. Keys use an ephemeral HMAC rather than raw email/IP values;
entries expire and memory is bounded. On Vercel only its trusted
forwarded-IP header is used; local servers share a `local` bucket. This does not
provide a shared quota across serverless instances. Use Vercel Firewall limits on
`/api/enquiry` if abuse grows. Same-origin headers and a honeypot do not stop a
determined direct HTTP client.

`pnpm build` then `pnpm check:enquiry` starts an isolated production process on
port 3197 and a local TLS SMTP fixture on port 2525. It checks both real SMTP
messages, recipient rejection, receipt-only failure, validation and browser
analytics without sending external email or using real SMTP credentials.
