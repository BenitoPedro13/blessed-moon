import { parseEnquiry } from "@/lib/enquiry";
import { getEnquiryMailConfig, sendEnquiry } from "@/lib/enquiry-mail";
import { consumeEnquiryLimit, normalizeEnquiryEmail } from "@/lib/enquiry-rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BODY_BYTES = 32_768;

async function readBody(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) throw new Error("too-large");
  const reader = request.body?.getReader();
  if (!reader) return null;
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error("too-large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function respond(status: number, message: string, retryAfter?: number) {
  return Response.json({ ok: status === 200, message }, {
    status,
    headers: { "Cache-Control": "no-store", ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}) },
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") {
    return respond(403, "Please send your enquiry from the studio website.");
  }
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return respond(415, "Please use the enquiry form.");
  }
  // Vercel supplies this trusted header; do not trust arbitrary X-Forwarded-For.
  const ip = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown" : "local";
  const retryAfter = consumeEnquiryLimit("ip", ip);
  if (retryAfter) return respond(429, "Too many attempts. Please wait a few minutes before trying again.", retryAfter);
  let value: unknown;
  try {
    value = await readBody(request);
  } catch (error) {
    return respond(error instanceof Error && error.message === "too-large" ? 413 : 400, "Please check your enquiry and try again.");
  }
  if (!value || typeof value !== "object" || !("website" in value) || typeof value.website !== "string") {
    return respond(400, "Please use the enquiry form.");
  }
  // Do not return a false submission success (which would fire a conversion).
  if (value.website) return respond(400, "Please use the enquiry form.");
  const enquiry = parseEnquiry(value);
  if (!enquiry) return respond(400, "Please check your name, email, project type and message.");
  const config = getEnquiryMailConfig();
  if (!config) return respond(503, "The enquiry form is temporarily unavailable. Please use the studio email.");
  const emailRetryAfter = consumeEnquiryLimit("email", normalizeEnquiryEmail(enquiry.email));
  if (emailRetryAfter) return respond(429, "Too many attempts. Please wait before trying again.", emailRetryAfter);
  try {
    const { confirmationSent } = await sendEnquiry(enquiry, config);
    return Response.json({ ok: true, confirmationSent }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    // SMTP errors can contain credentials, recipient addresses and provider
    // details. Neither return them to the browser nor log the raw exception.
    console.error("Project enquiry SMTP delivery failed.");
    return respond(502, "We could not send your enquiry. Your message is still here; please try again or use the studio email.");
  }
}
