// Runs before Umami; acquisition tags are retained, private workspaces and
// arbitrary URL queries are excluded. Form values never enter a URL or event.
window.blessedMoonBeforeSend = function (_type, payload) {
  try {
    const url = new URL(payload.url || window.location.href, window.location.origin);
    const internal = /^\/(?:system|social-plan|instagram-plan|linkedin-plan|analytics-plan|post-builder|api)(?:\/|$)/;
    if (internal.test(url.pathname) || internal.test(window.location.pathname)) return false;
    const clean = new URLSearchParams();
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const value = url.searchParams.get(key);
      if (value && /^[a-zA-Z0-9_-]{1,100}$/.test(value)) clean.set(key, value);
    }
    const query = clean.toString();
    const next = { ...payload, url: url.pathname + (query ? `?${query}` : "") };
    if (next.referrer) {
      const referrer = new URL(next.referrer, window.location.origin);
      next.referrer = referrer.origin + referrer.pathname;
    }
    return next;
  } catch {
    return false;
  }
};
