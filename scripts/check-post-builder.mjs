// Export/interaction checks against a running local preview. No social publishing.
import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { unzipSync, strFromU8 } from "fflate";

const origin = process.env.SOCIAL_CHECK_URL || "http://localhost:3194";
const directory = process.env.SOCIAL_SCREENSHOT_DIR || "/private/tmp/blessed-moon-post-review-2026-10-04";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 }, acceptDownloads: true });
const page = await context.newPage();
page.setDefaultNavigationTimeout(60000);
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
const pngSize = (bytes) => { assert.equal(bytes.subarray(1, 4).toString(), "PNG"); return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)]; };
async function download(label, filename) {
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: label, exact: true }).click();
  const file = await pending;
  assert.equal(await file.failure(), null);
  const path = join(directory, filename || file.suggestedFilename());
  await file.saveAs(path);
  return { path, bytes: await readFile(path) };
}
async function choose(id, name) { await page.locator(id).click(); await page.getByRole("option", { name, exact: true }).click(); }

try {
  for (const route of ["/instagram-plan", "/linkedin-plan", "/social-plan", "/analytics-plan", "/post-builder"]) {
    assert.equal((await page.goto(origin + route, { waitUntil: "load" })).status(), 200);
    assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
    for (const width of [1440, 390, 320]) { await page.setViewportSize({ width, height: 844 }); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${route} at ${width}`); }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${origin}/instagram-plan`, { waitUntil: "load" });
  await page.locator("[data-profile-preview] a").last().click();
  const brief = page.locator("details[data-post-id]").first();
  assert.equal(await brief.getAttribute("open"), "");
  assert.match(await brief.locator("[data-post-preview] svg").getAttribute("aria-label"), /Slide 1 of 6/);
  await brief.getByRole("button", { name: "Next preview slide" }).click();
  assert.match(await brief.locator("[data-post-preview] svg").getAttribute("aria-label"), /Slide 2 of 6/);
  await brief.getByRole("link", { name: "Edit this post →" }).click();
  await page.waitForURL(/post-builder\?story=website-details&channel=instagram/);
  await page.locator("#slide-title").waitFor();
  await page.getByLabel("Slide title", { exact: true }).fill("Clareza antes da conversa");
  await page.getByLabel("Slide body · one point per line for a checklist").fill("Preço, condição e próximo passo.\nInformação que merece estar junto.");
  await page.getByLabel("Post caption", { exact: true }).fill("Caption used for the export round-trip test.");
  assert.match(await page.locator("[data-post-builder]").getAttribute("class"), /rr-block/);
  const preview = page.getByRole("region", { name: "Live slide preview" });
  assert.match(await preview.locator("svg").first().getAttribute("aria-label"), /Clareza antes/);
  await preview.screenshot({ path: join(directory, "builder-portrait.png") });

  const png = await download("Download selected PNG", "selected.png");
  assert.deepEqual(pngSize(png.bytes), [1080, 1350]);
  const pixelCheck = await page.evaluate(async (data) => {
    const image = new Image(); image.src = data; await image.decode();
    const canvas = document.createElement("canvas"); canvas.width = image.width; canvas.height = image.height;
    const ctx = canvas.getContext("2d"); ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let orange = 0, bright = 0;
    for (let i = 0; i < pixels.length; i += 4) { if (pixels[i] > 220 && pixels[i + 1] > 50 && pixels[i + 1] < 150 && pixels[i + 2] < 80) orange++; if (pixels[i] > 200 && pixels[i + 1] > 200 && pixels[i + 2] > 200) bright++; }
    return { orange, bright };
  }, `data:image/png;base64,${png.bytes.toString("base64")}`);
  assert.ok(pixelCheck.orange > 500 && pixelCheck.bright > 500, "PNG contains the logo/accent and readable artwork, not an empty canvas");

  const zip = await download("Download post ZIP", "post.zip");
  const files = unzipSync(zip.bytes);
  assert.deepEqual(Object.keys(files).filter((name) => name.endsWith(".png")), ["01.png", "02.png", "03.png", "04.png", "05.png", "06.png"]);
  assert.equal(strFromU8(files["caption.txt"]), "Caption used for the export round-trip test.");
  assert.match(strFromU8(files["alt-text.txt"]), /Clareza antes da conversa/);
  const draft = JSON.parse(strFromU8(files["editable-draft.json"]));
  assert.equal(draft.slides[0].title, "Clareza antes da conversa");
  const pdf = await download("Download PDF", "post.pdf");
  assert.match(pdf.bytes.toString("latin1", 0, 15), /%PDF-1.4/);
  assert.match(pdf.bytes.toString("latin1"), /\/Count 6 /);
  const json = await download("Save editable JSON", "editable.json");
  await page.getByLabel("Slide title", { exact: true }).fill("Changed temporarily");
  await page.getByLabel("Restore editable JSON").setInputFiles(json.path);
  await page.getByRole("status").filter({ hasText: "Editable draft restored." }).waitFor();
  assert.equal(await page.getByLabel("Slide title", { exact: true }).inputValue(), "Clareza antes da conversa");

  await page.getByRole("button", { name: "Duplicate slide", exact: true }).click();
  await page.getByLabel("Slide title", { exact: true }).fill("Second slide changed");
  await page.getByRole("button", { name: "Move earlier", exact: true }).click();
  await page.getByRole("button", { name: "Select slide 1", exact: true }).click();
  assert.equal(await page.getByLabel("Slide title", { exact: true }).inputValue(), "Second slide changed");
  await page.getByRole("button", { name: "Remove slide", exact: true }).click();
  assert.equal(await page.getByLabel("Slide title", { exact: true }).inputValue(), "Clareza antes da conversa");

  await page.getByLabel(/Approved screenshot/).setInputFiles(png.path);
  await page.getByRole("status").filter({ hasText: "Screenshot added." }).waitFor();
  assert.equal(await page.getByRole("button", { name: "Download selected PNG", exact: true }).isDisabled(), true);
  await page.getByLabel("Screenshot description / alt text").fill("A generated test graphic with an amber crescent.");
  const pictured = await download("Download selected PNG", "with-screenshot.png");
  assert.deepEqual(pngSize(pictured.bytes), [1080, 1350]);
  await page.getByRole("button", { name: "Remove screenshot", exact: true }).click();
  await choose("#slide-template", "Statement");
  for (const [format, size, filename] of [["Square · 1080 × 1080", [1080, 1080], "square.png"], ["Landscape · 1200 × 627", [1200, 627], "landscape.png"], ["Story · 1080 × 1920", [1080, 1920], "story.png"]]) {
    await choose("#post-format", format);
    assert.deepEqual(pngSize((await download("Download selected PNG", filename)).bytes), size);
  }
  await page.getByLabel("Slide title", { exact: true }).fill('<script>alert("unsafe")</script> & <image href="https://example.invalid"/>');
  assert.equal(await preview.locator("script").count(), 0);
  assert.equal(await preview.locator("svg image").count(), 0);
  await page.getByLabel("Restore editable JSON").setInputFiles({ name: "invalid.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ ...draft, slides: [{ ...draft.slides[0], image: "https://example.invalid/pic.png" }] })) });
  await page.getByRole("status").filter({ hasText: "Screenshots must be local" }).waitFor();
  await page.getByLabel("Restore editable JSON").setInputFiles({ name: "invalid-channel.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ ...draft, channel: ["linkedin"] })) });
  await page.getByRole("status").filter({ hasText: "unsupported format" }).waitFor();

  await page.goto(`${origin}/post-builder?story=oishi-condition&channel=linkedin`, { waitUntil: "load" });
  assert.equal(await page.getByLabel("Slide title", { exact: true }).inputValue(), "The condition belongs beside the price.");
  await page.getByLabel("Post caption", { exact: true }).fill("Local draft"); // Wait for the editor's actual hydration.
  await page.getByLabel("Slide title", { exact: true }).fill("A very long title with Portuguese accents: informação, decisão and a business question that needs space across the entire frame without leaving it.");
  await page.getByLabel("Slide body · one point per line for a checklist").fill("One confirmed fact. ".repeat(25));
  await page.getByLabel("Footer / destination", { exact: true }).fill("i".repeat(90));
  for (const format of ["Landscape · 1200 × 627", "Portrait · 1080 × 1350", "Square · 1080 × 1080", "Story · 1080 × 1920"]) {
    await choose("#post-format", format);
    const clipped = await preview.locator("svg").first().evaluate((svg) => [...svg.querySelectorAll("text")].filter((text) => { const box = text.getBBox(); const frame = svg.viewBox.baseVal; return box.x < 28 || box.x + box.width > frame.width - 27 || box.y < 0 || box.y + box.height > frame.height - 27; }).map((text) => text.textContent));
    assert.deepEqual(clipped, [], `Text fits ${format}`);
  }
  await choose("#post-format", "Landscape · 1200 × 627");
  await preview.screenshot({ path: join(directory, "builder-landscape.png") });
  for (const width of [390, 320]) { await page.setViewportSize({ width, height: 844 }); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true); }

  await page.goto(`${origin}/analytics-plan`, { waitUntil: "load" });
  const worksheet = page.locator("[data-measurement-chart]");
  assert.match(await worksheet.getAttribute("class"), /rr-block/);
  assert.equal(await worksheet.locator("[data-measured-point]").count(), 0);
  await worksheet.getByLabel("Week 1 Tagged website visits", { exact: true }).fill("20");
  await worksheet.getByLabel("Week 3 Tagged website visits", { exact: true }).fill("0");
  assert.equal(await worksheet.locator("[data-measured-point]").count(), 2, "Measured zero appears; unknown week two remains a gap");
  assert.equal(await worksheet.locator('path[stroke="#ff6a1f"]').count(), 0, "Missing week is not interpolated");
  await worksheet.getByLabel("Week 2 Tagged website visits", { exact: true }).fill("10");
  assert.equal(await worksheet.locator('path[stroke="#ff6a1f"]').count(), 2);
  await worksheet.getByLabel("Week 1 Production hours", { exact: true }).fill("4.5");
  await worksheet.getByRole("button", { name: "Production hours", exact: true }).click();
  assert.equal(await worksheet.locator("[data-measured-point]").count(), 1);
  const observations = await download("Save observations JSON", "observations.json");
  assert.equal(JSON.parse(observations.bytes).weeks[0].hours, "4.5");
  const svg = await download("Download chart SVG", "hours-chart.svg");
  assert.match(svg.bytes.toString(), /fill="#090d12"/);
  await worksheet.getByLabel("Week 1 Production hours", { exact: true }).fill("");
  await worksheet.getByText("Restore observations JSON").locator("input").setInputFiles(observations.path);
  await worksheet.getByRole("status").filter({ hasText: "Weekly observations restored." }).waitFor();
  assert.equal(await worksheet.getByLabel("Week 1 Production hours", { exact: true }).inputValue(), "4.5");
  await page.setViewportSize({ width: 1440, height: 900 });
  await worksheet.screenshot({ path: join(directory, "measurement-chart.png") });
  const sitemap = await (await context.request.get(`${origin}/sitemap.xml`)).text();
  assert.doesNotMatch(sitemap, /post-builder/);
  assert.deepEqual(errors, []);
  console.log("Post previews, editing, PNG/ZIP/PDF/JSON exports, screenshot handling, text fitting and real-data worksheet checks passed.");
} finally { await browser.close(); }
