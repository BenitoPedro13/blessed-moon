import "server-only";
import { STUDIO_PROJECTS } from "@/lib/studio-data";

// Server-side reader for the self-hosted Umami 3.4 API, used only by the gated
// /analytics-plan/live page. It logs in as a dedicated view-only user; the token
// lives for one render and never reaches the browser. Every result says whether
// Umami answered, so an outage can never be drawn as a row of zeroes.

export type Result<T> = { status: "ok"; data: T } | { status: "unavailable"; reason: string };

export const RANGES = { "7d": 7, "28d": 28, "90d": 90 } as const;
export type RangeKey = keyof typeof RANGES;

export function parseRange(value: string | string[] | undefined): RangeKey {
  return typeof value === "string" && value in RANGES ? (value as RangeKey) : "28d";
}

type Config = { url: string; websiteId: string; username: string; password: string };

export function insightsConfig(): Config | null {
  const url = process.env.UMAMI_API_URL?.replace(/\/+$/, "");
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const username = process.env.UMAMI_API_USER;
  const password = process.env.UMAMI_API_PASSWORD;
  if (!url || !websiteId || !username || !password) return null;
  return { url, websiteId, username, password };
}

type Period = { startAt: number; endAt: number };
type Query = Record<string, string | number>;

async function login(config: Config): Promise<string> {
  const response = await fetch(`${config.url}/api/auth/login`, {
    method: "POST", cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10000),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: config.username, password: config.password }),
  });
  if (!response.ok) throw new Error(`login ${response.status}`);
  const body = (await response.json()) as { token?: string; requiresTwoFactor?: boolean };
  if (body.requiresTwoFactor) throw new Error("the insights user has two-factor sign-in enabled");
  if (!body.token) throw new Error("login returned no token");
  return body.token;
}

function client(config: Config, token: string) {
  return async function get<T>(path: string, query: Query): Promise<Result<T>> {
    const params = new URLSearchParams(Object.entries(query).map(([key, value]) => [key, String(value)]));
    try {
      const response = await fetch(`${config.url}/api/websites/${config.websiteId}${path}?${params}`, {
        cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15000),
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return { status: "unavailable", reason: `Umami ${response.status} at ${path}` };
      return { status: "ok", data: (await response.json()) as T };
    } catch (error) {
      return { status: "unavailable", reason: error instanceof Error ? error.message : "request failed" };
    }
  };
}

// Umami returns Postgres bigint/numeric columns as strings on some drivers.
const n = (value: unknown) => (Number.isFinite(Number(value)) ? Number(value) : 0);
const map = <T, U>(result: Result<T>, fn: (data: T) => U): Result<U> =>
  result.status === "ok" ? { status: "ok", data: fn(result.data) } : result;

type Attribution = { utm_content: { name: string; value: unknown }[]; total: { visitors: unknown } };

export type Ladder = { visitors: number; contact: number; started: number; accepted: number };
export type PostRow = { post: string; visits: number; contact: number; accepted: number };
export type CaseRow = { slug: string; title: string; sessions: number; contact: number | null };
export type SpeedRow = { page: string; metric: "lcp" | "inp" | "cls"; p75: number; samples: number };

export type Insights = {
  range: RangeKey;
  period: Period;
  previous: Period;
  ladder: Result<Ladder>;
  previousLadder: Result<Ladder>;
  posts: Result<PostRow[]>;
  cases: Result<CaseRow[]>;
  speed: Result<SpeedRow[]>;
};

export async function loadInsights(range: RangeKey): Promise<Insights | { status: "unavailable"; reason: string }> {
  const config = insightsConfig();
  if (!config) return { status: "unavailable", reason: "not-configured" };
  let token: string;
  try {
    token = await login(config);
  } catch (error) {
    return { status: "unavailable", reason: `Umami sign-in failed (${error instanceof Error ? error.message : "unknown"})` };
  }
  const get = client(config, token);
  const endAt = Date.now();
  const span = RANGES[range] * 86400000;
  const period = { startAt: endAt - span, endAt };
  const previous = { startAt: endAt - 2 * span, endAt: endAt - span };

  // Each step counts distinct sessions that did it in the period. Umami's
  // first-click attribution of a step also reports which tagged post each of
  // those sessions *arrived* from, since the landing pageview carries the UTM.
  const step = (when: Period, type: "path" | "event", value: string) =>
    get<Attribution>("/attribution", { ...when, model: "first-click", type, step: value });

  const ladderFor = async (when: Period) => {
    const [stats, contact, started, accepted] = await Promise.all([
      get<{ visitors: unknown }>("/stats", when),
      step(when, "path", "/contact"),
      step(when, "event", "project-enquiry-start"),
      step(when, "event", "project-enquiry-submit"),
    ]);
    const failed = [stats, contact, started, accepted].find((item) => item.status !== "ok");
    if (failed && failed.status === "unavailable") return { ladder: failed, contact, accepted };
    const ok = <T,>(item: Result<T>) => (item as { data: T }).data;
    const ladder: Result<Ladder> = {
      status: "ok",
      data: {
        visitors: n(ok(stats).visitors),
        contact: n(ok(contact).total?.visitors),
        started: n(ok(started).total?.visitors),
        accepted: n(ok(accepted).total?.visitors),
      },
    };
    return { ladder, contact, accepted };
  };

  const [current, before, postVisits, casePages, ...speed] = await Promise.all([
    ladderFor(period),
    ladderFor(previous),
    get<{ x: string; y: unknown }[]>("/metrics", { ...period, type: "utmContent", limit: 50 }),
    get<{ x: string; y: unknown }[]>("/metrics", { ...period, type: "path", search: "/work/", limit: 50 }),
    ...(["lcp", "inp", "cls"] as const).map((metric) =>
      get<{ name: string; p75: unknown; count: unknown }[]>("/performance/metrics", { ...period, type: "path", metric, device: "mobile", limit: 20 })),
  ]);

  const posts = map(postVisits, (rows) => {
    const byName = (result: Result<Attribution>) =>
      new Map(result.status === "ok" ? result.data.utm_content.map((row) => [row.name, n(row.value)]) : []);
    const contact = byName(current.contact);
    const accepted = byName(current.accepted);
    const names = new Set([...rows.map((row) => row.x), ...contact.keys(), ...accepted.keys()]);
    const visits = new Map(rows.map((row) => [row.x, n(row.y)]));
    return [...names].filter(Boolean).map((post) => ({
      post, visits: visits.get(post) ?? 0, contact: contact.get(post) ?? 0, accepted: accepted.get(post) ?? 0,
    })).sort((a, b) => b.accepted - a.accepted || b.contact - a.contact || b.visits - a.visits);
  });

  // A case page persuades if the session goes on to /contact. Funnel stats are
  // queried only for pages with sessions: Umami's funnel errors on an empty first step.
  let cases: Result<CaseRow[]> = map(casePages, (rows) => {
    const sessions = new Map(rows.map((row) => [row.x.replace(/\/+$/, ""), n(row.y)]));
    return STUDIO_PROJECTS.map((project) => ({
      slug: project.slug, title: project.title, sessions: sessions.get(`/work/${project.slug}`) ?? 0, contact: null,
    }));
  });
  if (cases.status === "ok") {
    const rows = await Promise.all(cases.data.map(async (row) => {
      if (!row.sessions) return { ...row, contact: 0 };
      const funnel = await get<{ visitors: unknown }[]>("/funnels/stats", {
        ...period, window: 60, steps: JSON.stringify([{ type: "path", value: `/work/${row.slug}` }, { type: "path", value: "/contact" }]),
      });
      return { ...row, contact: funnel.status === "ok" ? n(funnel.data[1]?.visitors) : null };
    }));
    cases = { status: "ok", data: rows.sort((a, b) => b.sessions - a.sessions) };
  }

  const speedRows = speed.find((item) => item.status !== "ok") ?? {
    status: "ok" as const,
    data: speed.flatMap((item, index) => item.status === "ok"
      ? item.data.map((row) => ({ page: row.name, metric: (["lcp", "inp", "cls"] as const)[index], p75: n(row.p75), samples: n(row.count) }))
      : []),
  };

  return {
    range, period, previous,
    ladder: current.ladder, previousLadder: before.ladder,
    posts, cases, speed: speedRows as Result<SpeedRow[]>,
  };
}
