// Run against a production preview: LOCALE_CHECK_URL=http://localhost:3199 pnpm check:locales
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import { chromium } from "playwright";

const origin = process.env.LOCALE_CHECK_URL || "http://localhost:3199";
const source = await readFile(new URL("../src/lib/studio-data.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { STUDIO_PROJECTS: projects } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const pt = JSON.parse(await readFile(new URL("../src/lib/i18n/pt.json", import.meta.url), "utf8"));
const browser = await chromium.launch({ headless: true, args: ["--use-angle=metal"] });
const errors = [];
try {
  const parser = await browser.newPage();
  const paths = ["/", "/about", "/work", "/contact", "/services/social-media", ...projects.map(p => `/work/${p.slug}`)];
  for (const path of paths) {
    for (const locale of ["en", "pt"]) {
      const localized = locale === "pt" ? `/pt${path === "/" ? "" : path}` : path;
      const response = await parser.request.get(origin + localized);
      assert.equal(response.status(), 200, localized);
      const doc = await parser.evaluate(html => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        doc.querySelectorAll("script,style,noscript").forEach(node => node.remove());
        return {
          lang: doc.documentElement.lang,
          text: doc.body.textContent,
          canonical: doc.querySelector('link[rel="canonical"]')?.href,
          alternates: [...doc.querySelectorAll('link[rel="alternate"][hreflang]')].map(node => [node.hreflang, node.href]),
          description: doc.querySelector('meta[name="description"]')?.content,
        };
      }, await response.text());
      assert.equal(doc.lang, locale === "pt" ? "pt-BR" : "en", localized);
      assert.equal(doc.canonical, `https://blessed-moon.vercel.app${localized}`, localized);
      assert.ok(doc.alternates.some(([language, url]) => language === "pt-BR" && url === `https://blessed-moon.vercel.app/pt${path === "/" ? "" : path}`));
      if (path.startsWith("/work/")) {
        const project = projects.find(p => path.endsWith(`/${p.slug}`));
        const fields = [project.description, project.problem, project.approach, project.outcome,
          ...project.process.flatMap(p => [p.title, p.body]), ...project.architecture.flatMap(p => [p.label, p.detail]),
          ...project.features.flatMap(p => [p.title, p.body]), ...project.challenges.flatMap(p => [p.title, p.body])];
        for (const field of fields) {
          const expected = locale === "pt" ? pt[field] || field : field;
          assert.ok(doc.text.includes(expected), `${localized}: missing translated content: ${expected.slice(0, 70)}`);
        }
        assert.ok(doc.description.startsWith(locale === "pt" ? pt[project.description] : project.description));
      }
    }
  }
  await parser.close();

  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: width === 320 ? 568 : 900 }, reducedMotion: "reduce" });
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(() => localStorage.setItem("bm-boot-seen", "1"));
    await page.goto(origin + "/pt", { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Clareza é o diferencial.", exact: true }).waitFor();
    await page.waitForFunction(() => {
      let node = document.querySelector("h1");
      while (node) {
        if (getComputedStyle(node).opacity === "0") return false;
        node = node.parentElement;
      }
      return true;
    });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Portuguese home fits ${width}px`);
    await page.screenshot({ path: `/private/tmp/blessed-moon-pt-${width}.png` });
    if (width < 768) {
      await page.getByRole("button", { name: "Abrir menu" }).click();
      await page.getByRole("navigation", { name: "Menu de navegação" }).getByRole("link", { name: "Projetos", exact: true }).click();
    } else {
      await page.locator('header a[href="/pt/work"]').click();
    }
    await page.waitForURL("**/pt/work");
    await page.getByRole("button", { name: /Sites e lojas/ }).click();
    await page.locator('ul a[href="/pt/work/lunares"]').click();
    await page.waitForURL("**/pt/work/lunares");
    await page.getByRole("heading", { name: "O site em movimento" }).waitFor();
    await page.keyboard.press("End");
    await page.waitForFunction(() => Math.abs(scrollY - (document.documentElement.scrollHeight - innerHeight)) < 4);
    await page.getByRole("link", { name: "English", exact: true }).click();
    await page.waitForURL("**/work/lunares");
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    await page.getByRole("link", { name: "Português", exact: true }).click();
    await page.waitForURL("**/pt/work/lunares");
    assert.equal(await page.locator("html").getAttribute("lang"), "pt-BR");
    await page.goto(origin + "/contact?project=Social%20Media%20Strategy#project-enquiry", { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.querySelector('a[hreflang="pt-BR"]').getAttribute("href").includes("?project=Social%20Media%20Strategy#project-enquiry"));
    await page.getByRole("link", { name: "Português", exact: true }).click();
    await page.waitForURL("**/pt/contact?project=Social%20Media%20Strategy#project-enquiry");
    assert.match(await page.getByRole("combobox", { name: "Tipo de projeto" }).innerText(), /Estratégia de redes sociais/);
    assert.equal(await page.getByPlaceholder("Seu nome").count(), 1);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    console.log(`Portuguese navigation and language switching passed at ${width}px`);
    await page.close();
  }
  const animated = await browser.newContext({ reducedMotion: "no-preference", viewport: { width: 390, height: 844 } });
  const fresh = await animated.newPage();
  fresh.on("pageerror", error => errors.push(error.message));
  await fresh.goto(origin + "/pt", { waitUntil: "load" });
  await fresh.getByRole("button", { name: "começar", exact: true }).click();
  await fresh.locator('[data-boot-phase]').waitFor({ state: "detached" });
  await fresh.waitForFunction(() => {
    let node = document.querySelector("h1");
    while (node) { if (Number(getComputedStyle(node).opacity) < 0.9) return false; node = node.parentElement; }
    return true;
  });
  await fresh.close();
  await animated.close();
  const request = await browser.newContext();
  for (const asset of ["banner.png", "cover.png", "logo.png"]) {
    const response = await request.request.get(`${origin}/linkedin-plan/${asset}`);
    assert.equal(response.status(), 200);
    assert.match(response.headers()["content-type"], /image\/png/);
  }
  for (const prefix of ["", "/pt"]) {
    for (const image of ["/opengraph-image", "/twitter-image", "/services/social-media/opengraph-image"]) {
      const response = await request.request.get(origin + prefix + image);
      assert.equal(response.status(), 200, `${prefix}${image}`);
      assert.match(response.headers()["content-type"], /image\/png/);
      assert.equal((await response.body()).subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    }
  }
  const sitemap = await (await request.request.get(origin + "/sitemap.xml")).text();
  assert.ok(sitemap.includes("/pt/work/lunares"));
  const gate = await request.request.get(origin + "/analytics-plan/live");
  assert.ok([401, 404].includes(gate.status()), "Live analytics remains protected or unavailable");
  assert.deepEqual(errors, []);
  console.log(`Locale checks passed: ${paths.length * 2} rendered pages, translated cases, metadata, sitemap, legacy assets and three viewport sizes.`);
} finally { await browser.close(); }
