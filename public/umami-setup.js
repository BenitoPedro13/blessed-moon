/* Download this file and paste it in your logged-in Umami dashboard console.
 * It creates missing definitions only. No resets, deletions or test events.
 * All authenticated requests stay on your Umami origin; tokens are never logged.
 */
(async function setupBlessedMoon() {
  const ORIGIN = "https://benitos-analytics.vercel.app";
  const WEBSITE = "2c0d4ed9-e3a7-4848-84f2-5740d14b3ede";
  const DOMAIN = "blessed-moon.vercel.app";
  const PREFIX = "BM · ";
  if (window.location.origin !== ORIGIN) throw new Error(`Run this in the logged-in dashboard at ${ORIGIN}.`);
  if (window.__blessedMoonSetupRunning) throw new Error("Setup is already running in this tab.");
  window.__blessedMoonSetupRunning = true;
  try {
    const stored = localStorage.getItem("umami.auth");
    let auth;
    try { auth = JSON.parse(stored); } catch { auth = stored; }
    const token = typeof auth === "string" ? auth : auth?.token;
    if (!token) throw new Error("Sign into Umami first, then run this script again.");

    const api = async (path, body) => {
      if (!path.startsWith("/api/")) throw new Error("Unexpected API path.");
      const response = await fetch(path, {
        method: body === undefined ? "GET" : "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "same-origin", redirect: "error", signal: AbortSignal.timeout(20000),
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      if (!response.ok) throw new Error(`Umami ${response.status} at ${path}. Setup stopped; created items remain and can be safely skipped on a rerun.`);
      return response.json();
    };
    const items = (value) => {
      const list = Array.isArray(value) ? value : value?.data;
      if (!Array.isArray(list)) throw new Error("Unexpected Umami list format; nothing further will be changed.");
      return list;
    };
    const website = await api(`/api/websites/${WEBSITE}`);
    if (website.id !== WEBSITE || website.domain !== DOMAIN) throw new Error("Website ID/domain mismatch. Setup stopped without changes.");

    // The generic CRUD API is retained by Umami's report migration compatibility
    // layer. Fail before writing if this deployment does not support it.
    const reports = [];
    for (let page = 1; page <= 100; page++) {
      const result = await api(`/api/reports?websiteId=${WEBSITE}&pageSize=100&page=${page}`);
      const batch = items(result);
      reports.push(...batch);
      const pageSize = result.pageSize || 100;
      if (batch.length < pageSize || (Number.isFinite(result.count) && reports.length >= result.count)) break;
      if (page === 100) throw new Error("Too many report pages; stopped before changes.");
    }
    const segmentPath = `/api/websites/${WEBSITE}/segments`;
    const segments = items(await api(`${segmentPath}?type=segment`));
    const cohorts = items(await api(`${segmentPath}?type=cohort`));
    if (reports.some((report) => report.websiteId && report.websiteId !== WEBSITE)) throw new Error("Report scope mismatch.");

    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - 30 * 86400000).toISOString();
    const dates = { startDate, endDate };
    const path = (value) => ({ type: "path", value });
    const event = (value) => ({ type: "event", value });
    const goal = (name, step, description) => ({ type: "goal", name: PREFIX + name, description, parameters: { ...dates, ...step } });
    const funnel = (name, steps, description) => ({ type: "funnel", name: PREFIX + name, description, parameters: { ...dates, window: 60, steps } });
    const reportPlan = [
      goal("Enquiry accepted", event("project-enquiry-submit"), "Primary website conversion: SMTP accepted the studio notification. Qualification and inbox delivery are separate."),
      goal("Enquiry started", event("project-enquiry-start"), "First form edit per page view. Compare with accepted enquiries."),
      goal("Contact reached", path("/contact"), "Intent only. Not a submitted or qualified lead."),
      goal("Strategy CTA", event("service-enquiry-click"), "Interest in the social strategy offer, not a lead."),
      goal("Booking link opened", event("booking-open"), "Scheduling intent only; confirm booked calls in the calendar."),
      funnel("Contact → started → accepted", [path("/contact"), event("project-enquiry-start"), event("project-enquiry-submit")], "Core contact funnel, including visitors landing directly on contact. 60 minutes between steps."),
      funnel("Started → accepted", [event("project-enquiry-start"), event("project-enquiry-submit")], "Form completion independent of the landing route. Read over four weeks."),
      funnel("Work → contact → accepted", [path("/work*"), path("/contact"), event("project-enquiry-submit")], "Portfolio-assisted enquiries. Includes work index and case-study landings, not only homepage visits."),
      funnel("Social service → contact → accepted", [path("/services/social-media"), path("/contact"), event("project-enquiry-submit")], "Social strategy service journey; use campaign/source filters for channel comparison."),
    ];
    // These screens query live data; only Goals/Funnels expose saved definitions
    // in the current UI. Keep useful criteria as presets rather than unused rows.
    const viewPresets = [
      { type: "utm", name: PREFIX + "Social pilot campaigns", description: "Filter campaign studio-social-pilot. Source = platform; content = stable ig-en, ig-pt or li-en post ID.", parameters: dates },
      { type: "breakdown", name: PREFIX + "Campaign × source × post", description: "Compare acquisition by campaign, channel and creative. Select pilot/channel segments in the dashboard.", parameters: { ...dates, fields: ["utmCampaign", "utmSource", "utmContent"] } },
      { type: "breakdown", name: PREFIX + "Landing page × device", description: "Locate mobile friction on case-study/service/contact destinations.", parameters: { ...dates, fields: ["path", "device"] } },
      { type: "journey", name: PREFIX + "Routes to contact", description: "Observed on-site paths ending at contact. Not off-site discovery or a required funnel.", parameters: { ...dates, steps: 3, endStep: "/contact", eventType: 1 } },
      { type: "attribution", name: PREFIX + "Accepted enquiries · last click", description: "Website session attribution only. No complete cross-device or offline-sales attribution.", parameters: { ...dates, model: "last-click", type: "event", step: "project-enquiry-submit" } },
      { type: "performance", name: PREFIX + "Mobile experience · LCP", description: "Choose Mobile segment; compare LCP with INP and CLS. Inspect slow pages before revising creative.", parameters: { ...dates, metric: "lcp", unit: "day", timezone: "America/Sao_Paulo" } },
      { type: "heatmap", name: PREFIX + "Homepage scroll", description: "Check reach through the long scroll journey. Recorder cannot reproduce the WebGL moon; interpret with real page testing.", parameters: { ...dates, urlPath: "/", mode: "scroll" } },
      { type: "heatmap", name: PREFIX + "Social service clicks", description: "Find CTA visibility and dead clicks. Personal form and internal workspace contents are blocked.", parameters: { ...dates, urlPath: "/services/social-media", mode: "click" } },
      { type: "retention", name: PREFIX + "Returning visits · monthly diagnostic", description: "Secondary for a studio. Check salt rotation first; anonymous visitors changing networks/devices cannot be joined reliably.", parameters: { startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(), endDate, timezone: "America/Sao_Paulo" } },
      { type: "revenue", name: PREFIX + "BRL payments · future integration", description: "No payment events exist yet. This is an empty future view; the sales register is the source of truth. Never send enquiry values as revenue.", parameters: { ...dates, currency: "BRL", unit: "day", timezone: "America/Sao_Paulo" } },
    ];
    const filter = (name, operator, value) => ({ name, operator, value });
    const segment = (name, filters, match = "all") => ({ type: "segment", name: PREFIX + name, parameters: { filters, match } });
    const segmentPlan = [
      segment("Pilot campaign", [filter("utmCampaign", "eq", "studio-social-pilot")]),
      segment("Instagram", [filter("utmSource", "eq", "instagram")]),
      segment("LinkedIn", [filter("utmSource", "eq", "linkedin")]),
      segment("English Instagram creative", [filter("utmContent", "c", "ig-en-")]),
      segment("Portuguese Instagram creative", [filter("utmContent", "c", "ig-pt-")]),
      segment("English LinkedIn creative", [filter("utmContent", "c", "li-en-")]),
      segment("Brazil location", [filter("country", "eq", "BR")]),
      segment("Mobile", [filter("device", "eq", "mobile")]),
      segment("Public production pages", [filter("hostname", "eq", DOMAIN), filter("path", "nre", "^/(system|social-plan|instagram-plan|linkedin-plan|analytics-plan|post-builder)(/|$)")]),
    ];
    const cohortPlan = [{ type: "cohort", name: PREFIX + "Pilot visitors · last 30 days", parameters: { dateRange: "30day", filters: [filter("utmCampaign", "eq", "studio-social-pilot")], match: "all" } }];
    const existingSelector = website.replayConfig?.blockSelector || "";
    const requiredSelectors = [".rr-block", "#project-enquiry form", "[data-plan-shell]"];
    const addedSelectors = requiredSelectors.filter((selector) => !existingSelector.split(",").map((item) => item.trim()).includes(selector));
    const replayConfig = {
      ...(website.replayConfig || {}), replayEnabled: true, heatmapEnabled: true,
      sampleRate: 0.15, heatmapSampleRate: 1,
      maskLevel: website.replayConfig?.maskLevel === "strict" ? "strict" : "moderate",
      maxDuration: 300000,
      // Preserve existing selectors verbatim, including commas inside quoted
      // attributes/functions, and append only missing defaults on each rerun.
      blockSelector: [existingSelector, ...addedSelectors].filter(Boolean).join(", "),
    };
    const backup = { viewPresets, capturedAt: endDate, websiteId: WEBSITE, replayConfig: website.replayConfig || null, existingReports: reports, existingSegments: segments, existingCohorts: cohorts };
    // Backup is scoped to this website's definitions, never login credentials.
    const key = `blessed-moon.umami.backup.${endDate}`;
    localStorage.setItem(key, JSON.stringify(backup));
    console.table([...reportPlan, ...segmentPlan, ...cohortPlan].map(({ type, name }) => ({ type, name })));

    const summary = [];
    const created = [];
    const createMissing = async (plan, existing, endpoint, isReport) => {
      for (const definition of plan) {
        const matches = existing.filter((item) => item.name === definition.name && item.type === definition.type);
        if (matches.length) {
          summary.push({ name: definition.name, result: "existing · skipped" });
          continue;
        }
        const result = await api(endpoint, isReport ? { websiteId: WEBSITE, ...definition } : definition);
        if (!result.id) throw new Error("Create returned no ID. Setup stopped; inspect the dashboard before rerunning.");
        created.push({ id: result.id, type: definition.type, name: definition.name });
        existing.push(result);
        summary.push({ name: definition.name, result: "created" });
        localStorage.setItem(`${key}.created`, JSON.stringify(created));
      }
    };
    await createMissing(reportPlan, reports, "/api/reports", true);
    await createMissing(segmentPlan, segments, segmentPath, false);
    await createMissing(cohortPlan, cohorts, segmentPath, false);
    localStorage.setItem(`blessed-moon.umami.view-presets.${WEBSITE}`, JSON.stringify(viewPresets));
    await api(`/api/websites/${WEBSITE}`, { replayConfig });
    console.table(summary);
    console.log("Blessed Moon setup complete. Refresh Umami. Select current dates and the Pilot campaign segment when reading reports. No historical events or revenue were created.");
    console.log(`Definition backup: localStorage key ${key}. Session replay 15%; heatmaps 100%; max 5 minutes. SMTP deployment and real ingestion still need production verification.`);
    return { created, skipped: summary.length - created.length, backupKey: key };
  } finally {
    window.__blessedMoonSetupRunning = false;
  }
})();
