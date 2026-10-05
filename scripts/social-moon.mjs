// Captures the site's own ASCII moon for social art (TASK-social-art-reveal-and-callouts.md):
// the real AsciiObject engine, as rendered on /system, on a transparent background,
// rather than an imitation of it. Run against a running dev or preview server:
//   SOCIAL_MOON_URL=http://localhost:3000 pnpm social:moon
import { join } from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const origin = process.env.SOCIAL_MOON_URL || "http://localhost:3000";
const out = join(new URL("..", import.meta.url).pathname, "public/social/moon.png");
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
try {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1200 }, deviceScaleFactor: 2 });
  await page.goto(`${origin}/system`, { waitUntil: "load", timeout: 120000 });
  const box = page.locator("span", { hasText: /^AsciiObject$/ }).locator("xpath=following-sibling::div[1]");
  await box.scrollIntoViewIfNeeded();
  await box.evaluate((el) => { el.setAttribute("data-capture", ""); Object.assign(el.style, { height: "1000px", width: "1000px", background: "transparent", border: "0", position: "relative", zIndex: "9999" }); });
  // Hide the star field and everything else; keep only the moon's canvas.
  await page.addStyleTag({ content: "html,body{background:transparent!important} body *{visibility:hidden!important;background:transparent!important} [data-capture],[data-capture] *{visibility:visible!important}" });
  await page.waitForTimeout(8000);
  const shot = await box.screenshot({ omitBackground: true });
  await sharp(shot).trim().resize(1000, 1000, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(out);
  console.log(`Saved ${out}`);
} finally { await browser.close(); }
