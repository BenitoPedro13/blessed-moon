import nodemailer from "nodemailer";
import { isEmail, type Enquiry } from "@/lib/enquiry";
import { notificationHtml, notificationSubject, notificationText, RECEIPT_SUBJECT, receiptHtml, receiptText } from "@/lib/enquiry-emails";

// Imported exclusively by the server page and Node route handler. These values
// must never use NEXT_PUBLIC_ prefixes or become client component props.
export function getEnquiryMailConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM_EMAIL?.trim();
  const to = process.env.AGENCY_CONTACT_EMAIL?.trim();
  if (!host || /[\s/:]/.test(host) || ![465, 587, 2525].includes(port) || !user || !pass || !from || !to || !isEmail(from) || !isEmail(to)) return null;
  return { host, port, user, pass, from, to };
}

export async function sendEnquiry(enquiry: Enquiry, config: NonNullable<ReturnType<typeof getEnquiryMailConfig>>) {
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port !== 465,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
    dnsTimeout: 5000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  try {
    const result = await transport.sendMail({
      from: { name: "Blessed Moon Studio", address: config.from },
      to: config.to,
      replyTo: { name: enquiry.name, address: enquiry.email },
      subject: notificationSubject(enquiry),
      text: notificationText(enquiry),
      html: notificationHtml(enquiry),
    });
    if (!result.accepted.some((address) => String(address).toLowerCase() === config.to.toLowerCase())) {
      throw new Error("SMTP did not accept the studio recipient");
    }
    // An acknowledgement is independent of accepting the actual enquiry. Never
    // turn a receipt failure into a retry that sends the studio another copy.
    try {
      const receipt = await transport.sendMail({
        from: { name: "Blessed Moon Studio", address: config.from },
        to: enquiry.email,
        replyTo: config.to,
        subject: RECEIPT_SUBJECT,
        text: receiptText(),
        html: receiptHtml(),
      });
      const confirmationSent = receipt.accepted.some((address) => String(address).toLowerCase() === enquiry.email.toLowerCase());
      if (!confirmationSent) console.error("Project enquiry confirmation SMTP delivery failed.");
      return { confirmationSent };
    } catch {
      console.error("Project enquiry confirmation SMTP delivery failed.");
      return { confirmationSent: false };
    }
  } finally {
    transport.close();
  }
}
