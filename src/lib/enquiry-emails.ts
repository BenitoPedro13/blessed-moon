import type { Enquiry } from "@/lib/enquiry";
import { LOGO_BOUNDS, LOGO_PATH } from "@/lib/logo-mark";
import { SITE_URL } from "@/lib/site-config";

// Both enquiry emails, each as a plain-text part and an HTML part. The HTML is
// written for mail clients, not browsers: tables, inline styles, bgcolor
// attributes, system fonts, and no remote images (Outlook blocks them by
// default), so it reads complete as sent. Anything the visitor typed reaches
// the HTML only through escapeHtml.

// Opaque equivalents of the .dark tokens in globals.css: mail clients can't be
// trusted with rgba over an unknown ground.
const C = {
  ground: "#050505",
  panel: "#0a0d12",
  edge: "#252c36",
  text: "#eeeeee",
  muted: "#97a1ae",
  accent: "#ff6a1f",
};
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const SITE = SITE_URL.replace(/^https:\/\//, "");

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// The crescent, rasterized from LOGO_PATH's outline by testing each cell's
// centre, so the mail mark can't drift from the site's.
function crescentCells() {
  const nums = LOGO_PATH.match(/-?\d+(\.\d+)?/g)!.map(Number);
  const poly: [number, number][] = [];
  for (let i = 0; i < nums.length; i += 2) poly.push([nums[i], nums[i + 1]]);
  const inside = (x: number, y: number) => {
    let hit = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i];
      const [xj, yj] = poly[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
    }
    return hit;
  };
  return Array.from({ length: LOGO_BOUNDS.height }, (_, y) =>
    Array.from({ length: LOGO_BOUNDS.width }, (_, x) => inside(x + 0.5, y + 0.5)),
  );
}

function crescentTable(cell: number) {
  const rows = crescentCells()
    .map((row) => `<tr>${row.map((on) => `<td width="${cell}" height="${cell}" style="width:${cell}px;height:${cell}px;font-size:0;line-height:0;${on ? `background:${C.accent};` : ""}"${on ? ` bgcolor="${C.accent}"` : ""}>&nbsp;</td>`).join("")}</tr>`)
    .join("");
  return `<table role="presentation" aria-hidden="true" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${rows}</table>`;
}

const paragraph = (html: string) => `<p style="margin:0 0 16px;font-family:${SANS};font-size:15px;line-height:24px;color:${C.text};">${html}</p>`;

// The studio frame: wordmark, one terminal window with a title bar, a footer
// line. Every argument is already-safe HTML.
function shell({ title, preheader, eyebrow, content, footer }: { title: string; preheader: string; eyebrow: string; content: string; footer: string }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${C.ground};" bgcolor="${C.ground}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.ground}" style="background:${C.ground};">
<tr><td align="center" style="padding:40px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
    <tr><td style="padding:0 0 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="middle" style="padding-right:12px;">${crescentTable(3)}</td>
        <td valign="middle" style="font-family:${MONO};font-size:15px;letter-spacing:0.02em;color:${C.text};">Blessed_Moon</td>
      </tr></table>
    </td></tr>
    <tr><td bgcolor="${C.panel}" style="background:${C.panel};border:1px solid ${C.edge};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="padding:10px 20px;border-bottom:1px solid ${C.edge};font-family:${MONO};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${C.muted};">${eyebrow}</td></tr>
        <tr><td style="padding:28px 20px 32px;">${content}</td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:16px 0 0;font-family:${MONO};font-size:11px;letter-spacing:0.08em;color:${C.muted};">${footer}</td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

const siteLink = (path = "") => `<a href="${SITE_URL}${path}" style="color:${C.muted};text-decoration:none;">${SITE}${path}</a>`;

// ── Visitor thank-you ──────────────────────────────────────────────────────
// Never includes anything the visitor typed.

const RECEIPT = {
  subject: "Thank you for contacting Blessed Moon Studio",
  preheader: "Your enquiry has reached the studio. I'll follow up personally.",
  heading: "Thanks for telling me about your project.",
  body: [
    "Your enquiry has reached Blessed Moon Studio. I'll review it and follow up with you personally.",
    "If you'd like to add anything, just reply to this email.",
  ],
  signature: ["Benito", "Blessed Moon Studio"],
};

export const RECEIPT_SUBJECT = RECEIPT.subject;

export function receiptText() {
  return [RECEIPT.heading, "", ...RECEIPT.body.flatMap((p) => [p, ""]), ...RECEIPT.signature, "", SITE].join("\n");
}

export function receiptHtml() {
  return shell({
    title: RECEIPT.subject,
    preheader: RECEIPT.preheader,
    eyebrow: "Enquiry / received",
    content: `<h1 style="margin:0 0 20px;font-family:${SANS};font-size:22px;line-height:30px;font-weight:600;color:${C.text};">${RECEIPT.heading}</h1>
          ${RECEIPT.body.map(paragraph).join("")}
          <p style="margin:8px 0 0;font-family:${MONO};font-size:13px;line-height:22px;color:${C.text};">${RECEIPT.signature[0]}<br><span style="color:${C.muted};">${RECEIPT.signature[1]}</span></p>`,
    footer: siteLink(),
  });
}

// ── Studio notification ────────────────────────────────────────────────────
// Reply-To is the visitor, so replying from the inbox answers them directly.

export function notificationSubject(enquiry: Enquiry) {
  return `[Blessed Moon · ${enquiry.projectType}] Project enquiry`;
}

export function notificationText(enquiry: Enquiry) {
  return [
    `Name: ${enquiry.name}`,
    `Reply email: ${enquiry.email}`,
    `Company: ${enquiry.company || "Not provided"}`,
    `Project type: ${enquiry.projectType}`,
    "", enquiry.message,
  ].join("\n");
}

export function notificationHtml(enquiry: Enquiry) {
  const name = escapeHtml(enquiry.name);
  const email = escapeHtml(enquiry.email);
  const facts: [string, string][] = [
    ["email", `<a href="mailto:${email}" style="color:${C.accent};text-decoration:none;">${email}</a>`],
    ["company", enquiry.company ? escapeHtml(enquiry.company) : `<span style="color:${C.muted};">not provided</span>`],
    ["type", escapeHtml(enquiry.projectType)],
  ];
  const rows = facts
    .map(([key, value]) => `<tr><td valign="top" style="padding:0 16px 6px 0;width:72px;font-family:${MONO};font-size:13px;line-height:20px;color:${C.muted};">${key}</td><td valign="top" style="padding:0 0 6px;font-family:${MONO};font-size:13px;line-height:20px;color:${C.text};word-break:break-word;">${value}</td></tr>`)
    .join("");
  const message = escapeHtml(enquiry.message).replace(/\r?\n/g, "<br>");
  return shell({
    title: escapeHtml(notificationSubject(enquiry)),
    preheader: `${name} · ${escapeHtml(enquiry.projectType)}`,
    eyebrow: `Enquiry / ${escapeHtml(enquiry.projectType)}`,
    content: `<h1 style="margin:0 0 20px;font-family:${SANS};font-size:22px;line-height:30px;font-weight:600;color:${C.text};">${name}</h1>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">${rows}</table>
          <div style="border-top:1px solid ${C.edge};padding-top:20px;">${paragraph(message)}</div>
          <p style="margin:4px 0 0;font-family:${MONO};font-size:12px;line-height:20px;color:${C.muted};">Reply to this email to answer ${name}.</p>`,
    footer: `Sent from ${siteLink("/contact")}`,
  });
}
