// End-to-end checks with a local STARTTLS mail server; never uses real credentials.
import assert from "node:assert/strict";
import net from "node:net";
import tls from "node:tls";
import { spawn, execFileSync } from "node:child_process";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";

const fixture = await mkdtemp(join(tmpdir(), "blessed-moon-smtp-"));
const certPath = join(fixture, "cert.pem");
const keyPath = join(fixture, "key.pem");
await writeFile(join(fixture, "openssl.cnf"), `[req]\ndistinguished_name=dn\nx509_extensions=ext\nprompt=no\n[dn]\nCN=localhost\n[ext]\nsubjectAltName=DNS:localhost,IP:127.0.0.1,IP:::1\nbasicConstraints=critical,CA:TRUE\n`);
execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1", "-keyout", keyPath, "-out", certPath, "-config", join(fixture, "openssl.cnf")], { stdio: "ignore" });
const secureContext = tls.createSecureContext({ key: await readFile(keyPath), cert: await readFile(certPath) });
const messages = [];
const sockets = new Set();
let mode = "accept";
const smtp = net.createServer((socket) => {
  sockets.add(socket);
  socket.on("close", () => sockets.delete(socket));
  socket.on("error", () => {});
  let current = socket;
  let buffer = "";
  let encrypted = false;
  let inData = false;
  let lines = [];
  let recipient = "";
  let authenticated = false;
  const receive = (chunk) => {
    buffer += chunk.toString();
    let index;
    while ((index = buffer.indexOf("\r\n")) !== -1) {
      const line = buffer.slice(0, index);
      buffer = buffer.slice(index + 2);
      if (inData) {
        if (line === ".") {
          messages.push({ recipient, content: lines.join("\r\n") });
          inData = false;
          lines = [];
          current.write("250 Queued\r\n");
        } else lines.push(line.replace(/^\.\./, "."));
      } else if (/^EHLO|^HELO/.test(line)) {
        current.write(encrypted ? "250-localhost\r\n250 AUTH PLAIN\r\n" : "250-localhost\r\n250 STARTTLS\r\n");
      } else if (line === "STARTTLS") {
        current.write("220 Ready for TLS\r\n");
        current.removeListener("data", receive);
        current = new tls.TLSSocket(socket, { isServer: true, secureContext });
        encrypted = true;
        current.on("error", () => {});
        current.on("data", receive);
      } else if (line.startsWith("AUTH PLAIN ")) {
        assert.equal(encrypted, true, "Credentials only travel over TLS");
        assert.match(Buffer.from(line.slice(11), "base64").toString(), /fixture-user\x00fixture-password$/);
        authenticated = true;
        current.write("235 Authenticated\r\n");
      } else if (line.startsWith("MAIL FROM:")) {
        assert.equal(authenticated, true);
        assert.match(line, /<studio@example\.invalid>/);
        current.write("250 Sender OK\r\n");
      } else if (line.startsWith("RCPT TO:")) {
        recipient = line.match(/<([^>]+)>/)[1];
        const reject = (mode === "reject-studio" && recipient === "studio@example.invalid") || (mode === "reject-receipt" && recipient !== "studio@example.invalid");
        current.write(reject ? "550 Recipient refused\r\n" : "250 Recipient OK\r\n");
      } else if (line === "DATA") {
        inData = true;
        current.write("354 End with dot\r\n");
      } else if (line === "QUIT") {
        current.end("221 Bye\r\n");
      } else current.write("250 OK\r\n");
    }
  };
  current.on("data", receive);
  current.write("220 Local SMTP fixture\r\n");
});
await new Promise((resolve, reject) => { smtp.once("error", reject); smtp.listen(2525, "::", resolve); });

const port = Number(process.env.ENQUIRY_CHECK_PORT || 3197);
const origin = `http://localhost:${port}`;
let output = "";
const app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", String(port)], {
  env: {
    ...process.env, NODE_EXTRA_CA_CERTS: certPath,
    SMTP_HOST: "localhost", SMTP_PORT: "2525", SMTP_USER: "fixture-user",
    SMTP_PASSWORD: "fixture-password", SMTP_FROM_EMAIL: "studio@example.invalid",
    AGENCY_CONTACT_EMAIL: "studio@example.invalid", VERCEL: "1",
    NEXT_PUBLIC_UMAMI_SRC: "", NEXT_PUBLIC_UMAMI_WEBSITE_ID: "", NEXT_PUBLIC_UMAMI_RECORDER_SRC: "",
  }, stdio: ["ignore", "pipe", "pipe"],
});
app.stdout.on("data", (data) => { output = (output + data).slice(-4000); });
app.stderr.on("data", (data) => { output = (output + data).slice(-4000); });
let browser;
let unavailable;
let ip = 1;
const valid = { name: "Private Test Person", email: "visitor@example.invalid", company: "Private Test Company", projectType: "Social Media Strategy", message: "Private project message", website: "" };
async function post(body, extras = {}) {
  return fetch(`${origin}/api/enquiry`, {
    method: "POST", headers: { Origin: origin, "Content-Type": "application/json", "x-vercel-forwarded-for": `192.0.2.${ip++}`, ...extras }, body: JSON.stringify(body),
  });
}
try {
  for (let i = 0; i < 120; i++) {
    if (app.exitCode !== null) throw new Error(`Preview exited. ${output}`);
    try { if ((await fetch(`${origin}/contact`)).ok) break; } catch {}
    if (i === 119) throw new Error(`Preview did not start. ${output}`);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  let response = await post(valid);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, confirmationSent: true });
  assert.equal(messages.length, 2, "Studio notification and thank-you accepted");
  assert.equal(messages[0].recipient, "studio@example.invalid");
  assert.match(messages[0].content, /Reply-To:.*visitor@example\.invalid/);
  assert.match(messages[0].content, /Private project message/);
  assert.equal(messages[1].recipient, "visitor@example.invalid");
  const receipt = messages[1].content.replace(/=\r?\n/g, "");
  assert.match(receipt, /follow up with you personally/);
  assert.match(receipt, /Content-Type: text\/plain/);
  assert.match(receipt, /Content-Type: text\/html/);
  assert.doesNotMatch(messages[1].content, /Private project message|Private Test Company/);

  mode = "reject-receipt";
  response = await post(valid);
  assert.deepEqual(await response.json(), { ok: true, confirmationSent: false });
  assert.equal(messages.length, 3, "Receipt rejection retains one studio notification");
  mode = "reject-studio";
  response = await post(valid);
  assert.equal(response.status, 502);
  assert.equal(messages.length, 3, "Studio failure never attempts a receipt");
  mode = "accept";

  for (const body of [
    { ...valid, email: "visitor@example.invalid\r\nBcc: bad@example.invalid" },
    { ...valid, email: "visitor@another@example.invalid" },
    { ...valid, projectType: "Injected subject" }, { ...valid, message: " " },
    { ...valid, name: "x".repeat(121) }, { ...valid, website: "spam" },
  ]) assert.equal((await post(body)).status, 400);
  assert.equal((await post({ ...valid, message: "x".repeat(40_000) })).status, 413);
  assert.equal((await post(valid, { Origin: "https://unrelated.example" })).status, 403);
  assert.equal((await post(valid, { "Content-Type": "text/plain" })).status, 415);
  assert.equal(messages.length, 3, "Rejected inputs send no email");
  for (let i = 0; i < 5; i++) assert.equal((await post({ ...valid, message: "" }, { "x-vercel-forwarded-for": "192.0.2.200" })).status, 400);
  const limited = await post(valid, { "x-vercel-forwarded-for": "192.0.2.200" });
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get("retry-after")) > 0);

  for (const email of ["quota.user@gmail.com", "QUOTAUSER@gmail.com", "quota.user+website@googlemail.com"]) {
    assert.equal((await post({ ...valid, email })).status, 200);
  }
  const emailLimited = await post({ ...valid, email: "quot.auser+again@gmail.com" });
  assert.equal(emailLimited.status, 429, "Gmail dot/plus aliases share a per-user quota across IPs");
  assert.ok(Number(emailLimited.headers.get("retry-after")) > 0);

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 }, extraHTTPHeaders: { "x-vercel-forwarded-for": "192.0.2.220" } });
  // Do not fetch optional third-party trackers in a local verification run.
  await context.route("https://benitos-analytics.vercel.app/**", (route) => route.abort());
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(String(error)));
  await page.goto(`${origin}/contact?project=Social%20Media%20Strategy`, { waitUntil: "load" });
  const tracker = page.locator('script[data-before-send="blessedMoonBeforeSend"]');
  if (await tracker.count()) {
    assert.equal(await tracker.getAttribute("data-domains"), "blessed-moon.vercel.app");
    assert.equal(await tracker.getAttribute("data-performance"), "true");
    assert.equal(await tracker.getAttribute("data-do-not-track"), "true");
    assert.equal(await page.evaluate(() => typeof window.blessedMoonBeforeSend), "function");
  }
  await page.evaluate(() => { window.__events = []; window.umami = { track: (name, data) => window.__events.push({ name, data }) }; });
  await page.locator("#name").fill(valid.name);
  await page.locator("#email").fill("browser@example.invalid");
  await page.locator("#company").fill(valid.company);
  await page.locator("#message").fill(valid.message);
  mode = "reject-studio";
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await page.locator("p[role=alert]").waitFor();
  assert.equal(await page.locator("#message").inputValue(), valid.message);
  assert.deepEqual(await page.evaluate(() => window.__events), [{ name: "project-enquiry-start", data: { project_type: "Social Media Strategy" } }]);
  mode = "accept";
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await page.getByRole("heading", { name: "Thanks for reaching out." }).waitFor();
  assert.deepEqual(await page.evaluate(() => window.__events), [
    { name: "project-enquiry-start", data: { project_type: "Social Media Strategy" } },
    { name: "project-enquiry-submit", data: { project_type: "Social Media Strategy" } },
  ]);
  assert.equal(await page.locator("form").count(), 0, "Persistent success prevents duplicate clicks");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);

  await page.goto(`${origin}/contact`, { waitUntil: "load" });
  await page.evaluate(() => { window.umami = { track: () => { throw new Error("blocked tracker"); } }; });
  await page.locator("#name").fill(valid.name);
  await page.locator("#email").fill("browser@example.invalid");
  await page.locator("#message").fill(valid.message);
  mode = "reject-receipt";
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await page.getByRole("heading", { name: "Thanks for reaching out." }).waitFor();
  assert.equal(await page.getByText("A confirmation email is on its way.", { exact: false }).count(), 0);
  assert.deepEqual(pageErrors, []);
  const unavailableOrigin = `http://localhost:${port + 1}`;
  unavailable = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", String(port + 1)], {
    env: { ...process.env, SMTP_PASSWORD: "", AGENCY_CONTACT_EMAIL: "studio@example.invalid" },
    stdio: "ignore",
  });
  for (let i = 0; i < 120; i++) {
    if (unavailable.exitCode !== null) throw new Error("Unconfigured preview exited.");
    try { if ((await fetch(`${unavailableOrigin}/contact`)).ok) break; } catch {}
    if (i === 119) throw new Error("Unconfigured preview did not start.");
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  await page.goto(`${unavailableOrigin}/contact`, { waitUntil: "load" });
  assert.equal(await page.getByRole("button", { name: "Send enquiry", exact: true }).isDisabled(), true);
  const unavailableResult = await fetch(`${unavailableOrigin}/api/enquiry`, { method: "POST", headers: { Origin: unavailableOrigin, "Content-Type": "application/json" }, body: JSON.stringify(valid) });
  assert.equal(unavailableResult.status, 503, "Missing SMTP settings fail closed without sending mail");
  process.env.SOCIAL_CHECK_URL = origin;
  await import("./check-social-strategy.mjs");
  console.log("Enquiry checks passed: TLS SMTP, both emails, independent receipt failure, validation, throttling, browser retry, personal-data exclusion and blocked analytics.");
} finally {
  if (browser) await browser.close();
  app.kill("SIGTERM");
  if (unavailable) unavailable.kill("SIGTERM");
  for (const socket of sockets) socket.destroy();
  await new Promise((resolve) => smtp.close(resolve));
  await rm(fixture, { recursive: true, force: true });
}
