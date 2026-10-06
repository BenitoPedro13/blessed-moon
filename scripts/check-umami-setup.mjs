import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../public/umami-setup.js", import.meta.url), "utf8");
const policy = await readFile(new URL("../public/analytics-policy.js", import.meta.url), "utf8");
const websiteId = "2c0d4ed9-e3a7-4848-84f2-5740d14b3ede";
const origin = "https://benitos-analytics.vercel.app";
const store = new Map([["umami.auth", JSON.stringify("fixture-token")]]);
const website = { id: websiteId, domain: "blessed-moon.vercel.app", replayConfig: { maskLevel: "strict", blockSelector: '.existing-block, [data-sensitive="a,b"]' } };
const reports = [{ id: "unrelated-report", websiteId, name: "Owner's report", type: "goal" }];
const boards = [{ id: "portfolio-board", name: "Portfolio overview", type: "website" }];
const segments = [];
const cohorts = [];
const writes = [];
const logs = [];
let failurePath;
let count = 0;
const context = vm.createContext({
  window: { location: { origin } },
  localStorage: { getItem: (key) => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) },
  AbortSignal, Date, crypto, console: { log: (...args) => logs.push(args), table: (...args) => logs.push(args) },
  fetch: async (path, options) => {
    assert.match(path, /^\/api\//, "Authenticated requests stay on the dashboard origin");
    assert.equal(options.headers.Authorization, "Bearer fixture-token");
    assert.equal(options.redirect, "error", "Credentials cannot follow a cross-origin redirect");
    if (path === failurePath) return { ok: false, status: 403 };
    const body = options.body ? JSON.parse(options.body) : undefined;
    if (body) writes.push({ path, body });
    const response = (data) => ({ ok: true, status: 200, json: async () => structuredClone(data) });
    if (path === `/api/websites/${websiteId}`) {
      if (body) Object.assign(website, body);
      return response(website);
    }
    const paged = (list) => response({ data: list, count: list.length, page: 1, pageSize: 100 });
    for (const type of ["goal", "funnel"]) {
      const listPath = `/api/websites/${websiteId}/${type}s`;
      if (path.startsWith(`${listPath}?`)) return paged(reports.filter((item) => item.type === type));
      if (path === listPath) {
        assert.equal(body.type, undefined, "3.4 definitions take the type from the endpoint");
        assert.equal(body.parameters.startDate, undefined, "3.4 definitions carry no dates");
        if (type === "goal") assert.ok(["path", "event"].includes(body.parameters.type));
        if (type === "funnel") {
          assert.equal(body.parameters.window, 60);
          assert.ok(body.parameters.steps.length >= 2);
        }
        const item = { ...body, type, websiteId, id: `report-${++count}` };
        reports.push(item);
        return response(item);
      }
    }
    assert.ok(!path.startsWith("/api/reports"), "Pre-3.4 report CRUD is never called");
    if (path.startsWith("/api/boards?")) return paged(boards);
    if (path === "/api/boards") {
      assert.equal(body.type, "website");
      assert.equal(body.parameters.websiteId, websiteId);
      for (const row of body.parameters.rows) for (const column of row.columns) {
        assert.ok(column.id && column.component?.type, "Every column has an ID and a component");
        const reportId = column.component.props?.reportId;
        if (reportId) {
          const report = reports.find((item) => item.id === reportId);
          assert.ok(report, "Board report references point at saved definitions");
          assert.equal(report.type, column.component.type.toLowerCase());
        }
      }
      const item = { ...body, id: `board-${++count}` };
      boards.push(item);
      return response(item);
    }
    if (path.startsWith(`/api/websites/${websiteId}/segments?`)) {
      return response(path.endsWith("type=cohort") ? cohorts : segments);
    }
    if (path === `/api/websites/${websiteId}/segments`) {
      const item = { ...body, id: `segment-${++count}` };
      assert.ok(["segment", "cohort"].includes(body.type));
      if (body.type === "cohort") assert.equal(body.parameters.dateRange, "30day");
      for (const filter of body.parameters.filters) assert.ok(["eq", "c", "nre"].includes(filter.operator));
      (body.type === "cohort" ? cohorts : segments).push(item);
      return response(item);
    }
    throw new Error(`Unexpected endpoint: ${path}`);
  },
});

const first = await vm.runInContext(source, context);
assert.equal(first.created.length, 22);
assert.equal(reports.length, 10, "Five goals, four funnels and the owner's existing definition");
assert.equal(segments.length, 9);
assert.equal(cohorts.length, 1);
assert.equal(boards.length, 4, "Three BM boards beside the owner's existing board");
assert.equal(website.replayConfig.maskLevel, "strict", "Existing stricter masking is preserved");
assert.match(website.replayConfig.blockSelector, /\.existing-block/);
assert.ok(website.replayConfig.blockSelector.includes('[data-sensitive="a,b"]'), "Existing selector contents stay intact");
assert.match(website.replayConfig.blockSelector, /\.rr-block/);
assert.equal(website.replayConfig.sampleRate, 0.15);
assert.equal(website.replayConfig.heatmapSampleRate, 1);
const selector = website.replayConfig.blockSelector;
const repeat = await vm.runInContext(source, context);
assert.equal(repeat.created.length, 0, "Rerun creates no duplicates");
assert.equal(website.replayConfig.blockSelector, selector, "Rerun does not multiply block selectors");
assert.equal(reports[0].name, "Owner's report");
assert.doesNotMatch(JSON.stringify(logs), /fixture-token/);
assert.doesNotMatch(JSON.stringify([...store.entries()].filter(([key]) => key !== "umami.auth")), /fixture-token/);
const written = writes.length;
context.window.location.origin = "https://unrelated.example";
await assert.rejects(vm.runInContext(source, context), /Run this in/);
context.window.location.origin = origin;
website.domain = "another-website.example";
await assert.rejects(vm.runInContext(source, context), /mismatch/);
website.domain = "blessed-moon.vercel.app";
failurePath = `/api/websites/${websiteId}/segments?type=segment`;
await assert.rejects(vm.runInContext(source, context), /403/);
assert.equal(writes.length, written, "Preflight failure causes no writes");
assert.equal(context.window.__blessedMoonSetupRunning, false);

const policyContext = vm.createContext({ window: { location: { origin: "https://blessed-moon.vercel.app", href: "https://blessed-moon.vercel.app/", pathname: "/" } }, URL, URLSearchParams });
vm.runInContext(policy, policyContext);
const beforeSend = policyContext.window.blessedMoonBeforeSend;
const cleaned = beforeSend("event", { url: "/contact?email=private@example.invalid&project=Web%20App&utm_source=instagram&utm_content=ig-en-w01-one-action#project-enquiry", referrer: "https://www.linkedin.com/feed/?tracking=private" });
assert.equal(cleaned.url, "/contact?utm_source=instagram&utm_content=ig-en-w01-one-action");
assert.equal(cleaned.referrer, "https://www.linkedin.com/feed/");
for (const path of ["/system", "/social-plan", "/instagram-plan", "/linkedin-plan", "/analytics-plan", "/post-builder", "/api/enquiry"]) assert.equal(beforeSend("event", { url: path }), false);
assert.notEqual(beforeSend("event", { url: "/work/markado" }), false);
policyContext.window.location.pathname = "/post-builder";
assert.equal(beforeSend("performance", { url: "/" }), false, "Private route blocks all payload kinds");
console.log("Umami setup checks passed: scoped 3.4 APIs, definitions, boards, idempotence, stricter masking, preflight failures, token exclusion and route/query filtering.");
