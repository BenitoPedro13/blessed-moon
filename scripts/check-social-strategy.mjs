// Behaviour checks for the research/service extension against a running server.
// Uses the project's installed Playwright, without changing dependencies.
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const origin = process.env.SOCIAL_CHECK_URL || "http://localhost:3194";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
context.setDefaultTimeout(60000);
await context.route("https://benitos-analytics.vercel.app/**", (route) => route.abort());
// Assert the actual page behaviour; background prefetch must not block a check.
const page = await context.newPage();
page.setDefaultNavigationTimeout(60000);
const failures = [];
page.on("pageerror", (error) => failures.push(`${page.url()}: ${String(error)}`));

try {
  for (const route of ["/social-plan", "/instagram-plan", "/linkedin-plan", "/analytics-plan", "/services/social-media", "/about"]) {
    const response = await page.goto(`${origin}${route}`, { waitUntil: "load" });
    assert.equal(response.status(), 200, route);
    assert.equal(await page.locator("h1").count(), 1, `${route} has one heading`);
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    if (route.endsWith("-plan")) assert.match(robots, /noindex/, route);
    if (route === "/services/social-media") {
      assert.doesNotMatch(robots || "", /noindex/);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://blessed-moon.vercel.app/services/social-media");
      assert.equal(await page.getByText(/R\$3,900/).count(), 0, "Internal rates stay off the service page");
    }
    if (route === "/social-plan") {
      assert.equal(await page.locator("[data-account-audit]").count(), 5);
      assert.equal(await page.locator("[data-audit-sample]").count(), 10);
      assert.equal(await page.locator("[data-instagram-audit]").count(), 10);
      assert.equal(await page.locator("[data-instagram-sample]").count(), 20);
      assert.match(await page.locator("[data-research-coverage]").textContent(), /356 distinct posts/);
      assert.equal(await page.locator("[data-platform-decision]").count(), 7);
    }
    if (process.env.SOCIAL_SCREENSHOT_DIR && route === "/services/social-media") {
      await mkdir(process.env.SOCIAL_SCREENSHOT_DIR, { recursive: true });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: join(process.env.SOCIAL_SCREENSHOT_DIR, "service-desktop.png"), fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: join(process.env.SOCIAL_SCREENSHOT_DIR, "service-mobile.png"), fullPage: true });
    }
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true, `${route}: no overflow at ${width}`);
    }
    if (["/instagram-plan", "/linkedin-plan"].includes(route)) {
      assert.equal(await page.locator("details[data-post-id]").count(), route.includes("instagram") ? 25 : 14);
      // TASK-social-profiles-and-rebalance.md: every account gets a profile setup, within platform limits.
      assert.equal(await page.locator("[data-profile-setup]").count(), route.includes("instagram") ? 2 : 1);
      // TASK-launch-teaser-story.md §6.1: launch Stories are listed apart from the grid.
      if (route.includes("instagram")) { assert.equal(await page.locator("[data-story-step]").count(), 6); assert.equal(await page.locator("[data-story-frame] svg").count(), 2, "Teaser and no-ar previews render"); }
      assert.equal(await page.locator("[data-profile-setup] .text-destructive").count(), 0, "Profile fields fit their platform limits");
      // TASK-linkedin-setup-checklist.md: ordered setup, the intro post and the three images.
      if (route.includes("linkedin")) {
        assert.ok(await page.locator("[data-setup-checklist] [data-setup-step]").count() >= 15, "Setup steps render");
        assert.equal(await page.locator("[data-intro-post]").count(), 1, "Introduction post renders");
        assert.doesNotMatch(await page.locator("[data-intro-post]").textContent(), /https?:\/\//, "Introduction post carries no link");
        for (const [file, width, height] of [["banner.png", 1584, 396], ["cover.png", 4200, 700], ["logo.png", 400, 400]]) {
          const image = await fetch(`${origin}/linkedin-plan/${file}`);
          assert.equal(image.headers.get("content-type"), "image/png", `${file} is a PNG`);
          const bytes = Buffer.from(await image.arrayBuffer());
          assert.deepEqual([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], [width, height], `${file} is ${width}×${height}`);
        }
        assert.equal((await fetch(`${origin}/linkedin-plan/other.png`)).status, 404);
      }
      for (const pin of await page.locator("[data-profile-setup] a[aria-label^=\"Pinned post\"]").evaluateAll((links) => links.map((link) => link.getAttribute("href")))) assert.equal(await page.locator(`details${pin.replace("#", "#")}`).count(), 1, `Pinned ${pin} exists`);
      const details = page.locator("details[data-post-id]").first();
      await details.locator("summary").scrollIntoViewIfNeeded();
      await details.locator("summary").click();
      assert.equal(await details.getAttribute("open"), "");
      assert.equal(await details.locator("[data-content-reference] a").count(), 2, "Brief links its sampled content separately from evidence");
      const link = details.locator('a[href*="utm_campaign="]');
      const url = new URL(await link.getAttribute("href"));
      assert.equal(url.searchParams.get("utm_source"), route.includes("instagram") ? "instagram" : "linkedin");
      assert.equal(url.searchParams.get("utm_medium"), "organic_social");
      assert.equal(url.searchParams.get("utm_campaign"), "studio-social-pilot");
      assert.match(url.searchParams.get("utm_content"), /^(ig|li)-en-w01-/);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, "Expanded brief fits phone");
      // TASK-social-copy-v3.md §5: short covers, and no evidence hedges printed on the art.
      const sequences = await page.locator("details[data-post-id]").evaluateAll((items) => items.map((item) => ({ id: item.dataset.postId, cover: item.querySelector("ol li strong")?.textContent ?? "", text: item.querySelector("ol")?.textContent ?? "" })));
      for (const post of sequences) {
        assert.ok(post.cover.trim().split(/\s+/).length <= 12, `${post.id}: cover headline is 12 words or fewer`);
        assert.doesNotMatch(post.text, /não uma medição|not a measurement|uplift|is claimed|é afirmad|invented success/i, `${post.id}: no hedges on slides`);
      }
      if (route.includes("linkedin")) assert.equal(await page.locator("details[data-post-id] p[lang]").evaluateAll((items) => items.filter((item) => !item.textContent.trim()).length), 0, "Every LinkedIn story has its post text");
    }
    if (route === "/about") {
      assert.equal(await page.getByText(/Saskia|M D R|specialized duo|Two senior people/i).count(), 0);
      assert.match(await page.locator("main").textContent(), /Benito/);
    }
  }

  const sitemap = await (await context.request.get(`${origin}/sitemap.xml`)).text();
  assert.match(sitemap, /\/services\/social-media/);
  for (const route of ["social-plan", "instagram-plan", "linkedin-plan", "analytics-plan"]) assert.doesNotMatch(sitemap, new RegExp(route));

  await page.goto(`${origin}/social-plan`, { waitUntil: "load" });
  const output = page.locator("output");
  const initial = await output.textContent();
  await page.getByRole("slider", { name: /Delivery hours/ }).fill("35");
  assert.notEqual(await output.textContent(), initial, "Workload changes the estimated floor");

  await page.goto(`${origin}/services/social-media`, { waitUntil: "load" });
  await page.evaluate(() => {
    window.__socialEvents = [];
    window.umami = { track: (name, data) => window.__socialEvents.push({ name, data }) };
  });
  await page.getByRole("link", { name: "Discuss your content strategy →" }).first().click();
  await page.waitForURL(/\/contact\?project=/);
  await page.locator("#project-type").waitFor();
  assert.match(await page.locator("#project-type").textContent(), /Social Media Strategy/);
  assert.equal((await page.evaluate(() => window.__socialEvents))[0].name, "service-enquiry-click");

  // This broad strategy check never sends email. The SMTP/browser harness
  // exercises submissions against its own local mail server.
  assert.equal(await page.locator('form.rr-block').count(), 1, "Personal form is excluded from replays");
  assert.equal(await page.getByRole("button", { name: "Send enquiry", exact: true }).count(), 1);

  await page.goto(`${origin}/contact?project=invalid`, { waitUntil: "load" });
  assert.match(await page.locator("#project-type").textContent(), /Web App/);
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 568 });
    await page.goto(`${origin}/`, { waitUntil: "load" });
    await page.locator("section#services").waitFor(); // Browser preference has selected the stacked layout.
    const service = page.locator('main a[href="/services/social-media"]').first();
    await service.scrollIntoViewIfNeeded();
    assert.equal(await service.count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, "Homepage fits short viewport");
    const content = await page.locator("main").textContent();
    assert.doesNotMatch(content, /two senior people|same two people/i);
  }
  // Exercise the actual pinned layout as well as the reduced-motion fallback.
  const animated = await browser.newContext({ reducedMotion: "no-preference" });
  await animated.route("https://benitos-analytics.vercel.app/**", (route) => route.abort());
  animated.setDefaultTimeout(60000);
  const motionPage = await animated.newPage();
  motionPage.on("pageerror", (error) => failures.push(`${motionPage.url()}: ${String(error)}`));
  for (const width of [1440, 390, 320]) {
    await motionPage.setViewportSize({ width, height: 568 });
    await motionPage.goto(`${origin}/`, { waitUntil: "load" });
    await motionPage.getByRole("button", { name: "begin", exact: true }).click({ timeout: 20000 });
    await motionPage.locator('[data-boot-phase]').waitFor({ state: 'detached' });
    // The zero-height marker defines the centre of this morph layer. Native
    // scrollIntoView applies the site's navigation scroll-padding and samples
    // the preceding handoff instead, where content is intentionally cropped.
    await motionPage.evaluate(() => window.scrollTo({
      top: window.scrollY + document.querySelector("#services").getBoundingClientRect().top,
      behavior: "instant",
    }));
    const flow = await motionPage.locator('[data-morph-mode]').getAttribute('data-morph-mode') === 'flow';
    if (flow) {
      await motionPage.locator('[data-service-card="08"]').scrollIntoViewIfNeeded();
    } else {
      // Compact content still uses the animated handoff.
      await motionPage.waitForFunction(() => {
        let element = document.querySelector("[data-services-grid]");
        while (element) {
          const local = element.style?.getPropertyValue("--morph-local");
          if (local) return Math.abs(Number(local)) < 0.005 && Number(getComputedStyle(element).opacity) > 0.99;
          element = element.parentElement;
        }
        return false;
      }, null, { timeout: 20000 });
    }
    const serviceLink = motionPage.locator('main a[href="/services/social-media"]').first();
    if (process.env.SOCIAL_SCREENSHOT_DIR) await motionPage.screenshot({ path: join(process.env.SOCIAL_SCREENSHOT_DIR, `services-pinned-${width}.png`) });
    assert.equal(await motionPage.locator('[data-service-card="08"]').evaluate((element) => {
      const rect = element.getBoundingClientRect();
      let parent = element.parentElement;
      while (parent) {
        if (["hidden", "clip"].includes(getComputedStyle(parent).overflowY)) {
          const bounds = parent.getBoundingClientRect();
          if (rect.bottom > bounds.bottom + 1 || rect.top < bounds.top - 1) return false;
        }
        parent = parent.parentElement;
      }
      return rect.bottom <= innerHeight + 1;
    }), true, `All eight service cards remain reachable at ${width}`);
    await serviceLink.click({ timeout: 8000 });
    await motionPage.waitForURL(/\/services\/social-media/);
    assert.equal(await motionPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
  }
  await animated.close();
  assert.deepEqual(failures, [], "No uncaught page errors");
  console.log("Social strategy checks passed: routes, metadata, campaign links, briefs, pricing model, enquiry events and solo identity.");
} finally {
  await browser.close();
}
