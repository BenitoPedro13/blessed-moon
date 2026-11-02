import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [route, wait] of [['/', 1000], ['/', 500], ['/work', 1000], ['/work', 500]]) {
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { try { localStorage.setItem('bm-boot-seen', '1'); } catch {} });
const p = await ctx.newPage();
await p.goto('http://localhost:3194' + route, { waitUntil: 'load' });
await p.waitForTimeout(2500);
const idx = () => p.evaluate(() => { const n = document.querySelector('[aria-label="Sections"]'); const cur = n?.querySelector('[aria-current="step"]'); if (cur) return cur.textContent.trim().split(' ')[0]; const t = n?.querySelector('[aria-live]')?.textContent ?? ''; return t.split('section ')[1]?.split(' /')[0]; });
await p.mouse.move(720, 450);
for (let i = 0; i < 20; i++) { await p.mouse.wheel(0, 120); await p.waitForTimeout(30); }
await p.waitForTimeout(1500);
const seq = [await idx()];
for (let k = 0; k < 4; k++) { await p.mouse.wheel(0, 100); await p.waitForTimeout(wait); }
await p.waitForTimeout(1500); seq.push('↓4→' + await idx());
for (let k = 0; k < 2; k++) { await p.mouse.wheel(0, -100); await p.waitForTimeout(wait); }
await p.waitForTimeout(1500); seq.push('↑2→' + await idx());
console.log(route, 'tick every', wait + 'ms:', seq.join(' '));
await ctx.close();
}
await b.close();
