import { createRequire } from "node:module";
import nodemailer from "nodemailer";

const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
const { loadEnvConfig } = nextRequire("@next/env");
loadEnvConfig(process.cwd());
const host = process.env.SMTP_HOST?.trim();
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER?.trim();
const pass = process.env.SMTP_PASSWORD;
if (!host || !user || !pass || !process.env.SMTP_FROM_EMAIL || !process.env.AGENCY_CONTACT_EMAIL) {
  console.error("SMTP settings are incomplete. Fill the server-only fields in .env.local.");
  process.exit(1);
}
const transport = nodemailer.createTransport({
  host, port, secure: port === 465, requireTLS: port !== 465,
  auth: { user, pass }, connectionTimeout: 8000, greetingTimeout: 8000,
  socketTimeout: 15000, dnsTimeout: 5000,
});
try {
  await transport.verify();
  console.log("SMTP authentication and TLS verified. No email was sent.");
} catch (error) {
  // Only safe error codes; provider exceptions can contain sensitive details.
  console.error(`SMTP verification failed (${error?.code || "UNKNOWN"}). Check the host, port and App Password.`);
  process.exitCode = 1;
} finally {
  transport.close();
}
