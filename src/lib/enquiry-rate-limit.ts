import { createHmac, randomBytes } from "node:crypto";

type LimitKind = "ip" | "email";
const LIMITS = { ip: { count: 5, seconds: 600 }, email: { count: 3, seconds: 3600 } };
const localSecret = randomBytes(32).toString("hex");
const local = new Map<string, { count: number; expires: number }>();

export function normalizeEnquiryEmail(email: string) {
  const [user, domain] = email.trim().toLowerCase().split("@");
  // Gmail dots/plus aliases are the same mailbox; rotating them must not reset
  // the quota. Other domains retain their actual mailbox semantics.
  return domain === "gmail.com" || domain === "googlemail.com"
    ? `${user.split("+")[0].replaceAll(".", "")}@gmail.com`
    : `${user}@${domain}`;
}

// This bounded map is appropriate for the early launch, but it is scoped to
// one server instance. Add shared backing if traffic/abuse makes that necessary.
// HMAC keys keep raw IPs and visitor addresses out of the stored counters.
export function consumeEnquiryLimit(kind: LimitKind, identifier: string) {
  const hash = createHmac("sha256", localSecret).update(identifier).digest("hex");
  const key = `blessed-moon:enquiry:${kind}:${hash}`;
  const limit = LIMITS[kind];
  const now = Date.now();
  for (const [storedKey, entry] of local) if (entry.expires <= now) local.delete(storedKey);
  const previous = local.get(key);
  if (previous && previous.count >= limit.count) return Math.max(1, Math.ceil((previous.expires - now) / 1000));
  if (!previous && local.size >= 5000) return 60;
  local.set(key, { count: (previous?.count || 0) + 1, expires: previous?.expires || now + limit.seconds * 1000 });
  return 0;
}
