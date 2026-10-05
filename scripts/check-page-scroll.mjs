// Real wheel/keyboard checks for every page, plus content growth and reflow.
// Run against a production preview: SCROLL_CHECK_URL=http://localhost:3194 node scripts/check-page-scroll.mjs
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const origin = process.env.SCROLL_CHECK_URL || 'http://localhost:3194';
const slugSource = await readFile(new URL('../src/lib/studio-data.ts', import.meta.url), 'utf8');
const slugs = [...slugSource.matchAll(/slug: "([a-z0-9-]+)"/g)].map(match => match[1]);
const allRoutes = ['/', '/about', '/work', '/contact', '/services/social-media', '/social-plan', '/instagram-plan', '/linkedin-plan', '/analytics-plan', '/post-builder', '/system', ...slugs.map(slug => `/work/${slug}`)];
const routes = process.env.SCROLL_ROUTES ? allRoutes.filter(route => process.env.SCROLL_ROUTES.split(',').includes(route)) : allRoutes;
const configurations = [
  { viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' },
  { viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' },
  { viewport: { width: 320, height: 568 }, reducedMotion: 'no-preference' },
  { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' },
  { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' },
  { viewport: { width: 320, height: 568 }, reducedMotion: 'reduce' },
];
const webgl = process.env.SCROLL_WEBGL !== '0';
const browser = await chromium.launch({ headless: true, args: webgl ? [] : ['--disable-webgl'] });
const results = [];
const errors = [];
async function ready(page, motion) {
  if (motion === 'no-preference') {
    // Use the real keyboard entry, without waiting for a short-screen button's
    // animated position to settle in Chromium's software renderer. The gate
    // also has an intentional automatic-dismissal path.
    await page.waitForFunction(() => document.body.style.overflow === 'hidden' || !document.querySelector('.boot-gate'));
    if (await page.locator('.boot-gate').count()) await page.keyboard.press('End');
  }
  // Reduced motion also fades the boot overlay after hydration.
  await page.locator('.boot-gate').waitFor({ state: 'detached' });
  await page.waitForFunction(() => document.body.style.overflow !== 'hidden');
  await page.waitForTimeout(350);
}
async function bottom(page, label) {
  const viewport = page.viewportSize();
  // Lenis intentionally debounces content ResizeObserver updates by 250ms.
  await page.waitForTimeout(600);
  await page.mouse.move(viewport.width / 2, viewport.height / 2);
  await page.mouse.wheel(0, 100000);
  await page.waitForFunction(() => {
    const footer = Array.from(document.querySelectorAll('footer')).at(-1)?.getBoundingClientRect();
    return Math.abs(scrollY - (document.documentElement.scrollHeight - innerHeight)) <= 1 && footer && footer.bottom <= innerHeight + 2;
  }, null, { timeout: 10000 });
  const footer = await page.locator('footer').last().evaluate(element => ({ top: element.getBoundingClientRect().top, bottom: element.getBoundingClientRect().bottom }));
  assert.ok(footer.bottom <= viewport.height + 3 && footer.bottom > 0, `${label}: footer reached with wheel`);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(500);
  await page.keyboard.press('End');
  await page.waitForFunction(() => Math.abs(scrollY - (document.documentElement.scrollHeight - innerHeight)) <= 3, null, { timeout: 10000 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${label}: no horizontal overflow`);
  const nested = await page.locator('main').evaluate(main => [...main.querySelectorAll('*')].filter(element => {
    const overflow = getComputedStyle(element).overflowY;
    return ['scroll', 'auto'].includes(overflow) && element.scrollHeight > element.clientHeight + 3 && element.clientHeight > 100;
  }).map(element => element.tagName + '.' + element.className));
  assert.deepEqual(nested, [], `${label}: no competing main-content scroll container`);
}
function unclipped(element) {
  const rect = element.getBoundingClientRect();
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    if (['hidden', 'clip'].includes(getComputedStyle(parent).overflowY)) {
      const bounds = parent.getBoundingClientRect();
      if (rect.top < bounds.top - 2 || rect.bottom > bounds.bottom + 2) return false;
    }
  }
  return true;
}
try {
  for (const config of configurations) {
    const context = await browser.newContext(config);
    context.setDefaultTimeout(30000);
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`${page.url()}: ${error.message}`));
    for (const route of routes) {
      const label = `${route} ${config.viewport.width}x${config.viewport.height} ${config.reducedMotion}`;
      try {
        const response = await page.goto(origin + route, { waitUntil: 'load' });
        assert.equal(response.status(), 200, label);
        await ready(page, config.reducedMotion);
        if (route === '/work') {
          assert.equal(await page.locator('[data-morph-mode]').getAttribute('data-morph-mode'), 'flow', `${label}: growing index uses flow`);
          const content = page.locator('[data-morph-content]').first();
          assert.equal(await content.evaluate(unclipped), true, `${label}: complete index is unclipped`);
          // Growth after load must extend the document and remain reachable.
          const previous = await page.evaluate(() => document.documentElement.scrollHeight);
          await content.evaluate(element => {
            const addition = document.createElement('div');
            addition.setAttribute('data-scroll-growth-test', '');
            addition.style.height = '1400px';
            addition.textContent = 'Additional project content';
            element.append(addition);
          });
          await page.waitForFunction(height => document.documentElement.scrollHeight > height + 1300, previous);
        }
        // Expand real briefs to check the page's new document length.
        if (route === '/instagram-plan' || route === '/linkedin-plan') {
          await page.locator('details').evaluateAll(elements => elements.forEach(element => { element.open = true; }));
        }
        await bottom(page, label);
        results.push({ route, ...config, status: 'passed' });
        console.log(`PASS ${label}`);
      } catch (error) {
        results.push({ route, ...config, status: 'failed', error: error.message });
        console.error(`FAIL ${label}: ${error.message}`);
      }
    }
    await context.close();
  }
  // Check a compact specimen still pins, switches for growing content, then
  // restores pinning and resets progress when content fits again.
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'no-preference' });
  await page.goto(origin + '/system');
  await ready(page, 'no-preference');
  const specimen = page.locator('[data-scroll-stage]').first();
  assert.equal(await specimen.getAttribute('data-scroll-stage'), 'pinned');
  await specimen.evaluate(element => element.setAttribute('data-growth-specimen', ''));
  const growthStyle = await page.addStyleTag({ content: '[data-growth-specimen] > div > :last-child { min-height: 1600px !important; }' });
  await page.waitForFunction(() => document.querySelector('[data-growth-specimen]')?.dataset.scrollStage === 'flow');
  assert.equal(await specimen.locator(':scope > div').evaluate(element => element.style.getPropertyValue('--stage-progress')), '0');
  await growthStyle.evaluate(element => element.remove());
  await page.waitForFunction(() => document.querySelector('[data-growth-specimen]')?.dataset.scrollStage === 'pinned');
  await page.close();
  assert.deepEqual(errors, [], 'No uncaught browser errors');
  assert.equal(results.filter(result => result.status === 'failed').length, 0, 'Every route/configuration passes');
  console.log(`All ${results.length} page/viewport/motion checks passed, including dynamic Work growth, expanded briefs and stage reflow.`);
} finally {
  if (process.env.SCROLL_REPORT_DIR) {
    await mkdir(process.env.SCROLL_REPORT_DIR, { recursive: true });
    await writeFile(`${process.env.SCROLL_REPORT_DIR}/page-scroll.json`, JSON.stringify({ origin, webgl, results, errors }, null, 2));
  }
  await browser.close();
}
