// Checks for /analytics-plan/live: the reading rules (small samples never
// produce a verdict), the Basic-auth comparison (fails closed), and — when a
// production server is running — that the route is gated and leaks nothing.
//   node scripts/check-insights.mjs                 rules + auth only
//   BASE_URL=http://localhost:3000 INSIGHTS_PASSWORD=… node scripts/check-insights.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";

async function load(path) {
  const source = stripTypeScriptTypes(await readFile(new URL(path, import.meta.url), "utf8"));
  return import(`data:text/javascript,${encodeURIComponent(source)}`);
}

const r = await load("../src/lib/insight-readings.ts");
assert.equal(r.share(2, 3), "2 of 3", "Small denominators stay as counts");
assert.equal(r.share(15, 60), "25% (15 of 60)");
assert.equal(r.readLadder({ visitors: 12, contact: 6, started: 1, accepted: 0 }).tone, "wait", "Under the minimum, no verdict");
assert.match(r.readLadder({ visitors: 100, contact: 4, started: 3, accepted: 2 }).text, /never reach the contact page/);
assert.match(r.readLadder({ visitors: 100, contact: 40, started: 2, accepted: 1 }).text, /don't start the form/);
assert.match(r.readLadder({ visitors: 100, contact: 40, started: 30, accepted: 1 }).text, /started but not sent/);
assert.equal(r.readLadder({ visitors: 40, contact: 30, started: 20, accepted: 12 }).tone, "fine");
assert.equal(r.readPosts([]).tone, "wait");
assert.equal(r.readPosts([{ post: "ig-en-w01", visits: 3, contact: 1, accepted: 0 }]).tone, "wait");
assert.match(r.readPosts([{ post: "ig-en-w01", visits: 30, contact: 0, accepted: 0 }, { post: "li-en-w02", visits: 10, contact: 2, accepted: 1 }]).text, /^li-en-w02/);
assert.equal(r.rateSpeed("lcp", 2400), "good");
assert.equal(r.rateSpeed("inp", 300), "needs work");
assert.equal(r.rateSpeed("cls", 0.3), "poor");
assert.equal(r.formatSpeed("lcp", 3120), "3.1 s");
assert.equal(r.readSpeed([{ page: "/", metric: "lcp", p75: 6000, samples: 3 }]).tone, "wait", "A poor rating on 3 samples isn't a verdict");
assert.match(r.readSpeed([{ page: "/work", metric: "lcp", p75: 6000, samples: 40 }]).text, /^\/work is slow/);
assert.equal(r.readCompare({ visitors: 5, contact: 1, started: 0, accepted: 0 }, { visitors: 3, contact: 0, started: 0, accepted: 0 }).tone, "wait");
assert.equal(r.readCases([{ title: "A", sessions: 4, contact: 1 }]).tone, "wait");

const { isInsightsAuthorized } = await load("../src/lib/insights-auth.ts");
const basic = (user, pass) => `Basic ${btoa(`${user}:${pass}`)}`;
assert.equal(await isInsightsAuthorized(basic("benito", "moon"), "moon"), true);
assert.equal(await isInsightsAuthorized(basic("anyone", "moon:with:colons"), "moon:with:colons"), true);
assert.equal(await isInsightsAuthorized(basic("benito", "Moon"), "moon"), false);
assert.equal(await isInsightsAuthorized(basic("benito", "moon"), undefined), false, "No configured password: closed");
assert.equal(await isInsightsAuthorized(basic("benito", ""), ""), false);
assert.equal(await isInsightsAuthorized(null, "moon"), false);
assert.equal(await isInsightsAuthorized("Basic !!!", "moon"), false);
console.log("Insight reading rules and auth comparison passed.");

const base = process.env.BASE_URL;
if (base) {
  const url = `${base}/analytics-plan/live`;
  const anonymous = await fetch(url, { redirect: "manual" });
  assert.ok([401, 404].includes(anonymous.status), `Unauthenticated request must be refused, got ${anonymous.status}`);
  const anonymousBody = await anonymous.text();
  assert.doesNotMatch(anonymousBody, /Where do people stop/, "No content without auth");
  const password = process.env.INSIGHTS_PASSWORD;
  if (password) {
    const wrong = await fetch(url, { headers: { Authorization: basic("x", `${password}-wrong`) } });
    assert.equal(wrong.status, 401);
    const ok = await fetch(url, { headers: { Authorization: basic("benito", password) } });
    assert.equal(ok.status, 200);
    assert.match(ok.headers.get("cache-control") ?? "", /no-store/);
    const html = await ok.text();
    for (const secret of [process.env.UMAMI_API_PASSWORD, password].filter(Boolean)) assert.ok(!html.includes(secret), "No secret in HTML");
    assert.doesNotMatch(html, /Bearer |"token"/, "No Umami token in HTML");
    assert.match(html, /noindex/);
  }
  console.log(`Live route gate passed against ${base}.`);
}
