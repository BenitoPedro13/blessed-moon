// HTTP Basic auth for /analytics-plan/live, shared by src/proxy.ts (the gate)
// and the page itself (a second check, so a matcher mistake can't expose the
// data). Any username is accepted; the password is INSIGHTS_PASSWORD. With no
// password configured, the route is closed, never open.

export const INSIGHTS_REALM = 'Basic realm="Blessed Moon insights", charset="UTF-8"';

async function digest(value: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

export async function isInsightsAuthorized(header: string | null, password = process.env.INSIGHTS_PASSWORD): Promise<boolean> {
  if (!password || !header?.startsWith("Basic ")) return false;
  let decoded: string;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return false;
  }
  const supplied = decoded.slice(decoded.indexOf(":") + 1);
  if (decoded.indexOf(":") < 0) return false;
  // Compare fixed-length digests so the check doesn't leak the password's length or prefix through timing.
  const [a, b] = await Promise.all([digest(supplied), digest(password)]);
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i];
  return difference === 0;
}
