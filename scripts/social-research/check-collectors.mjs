// Controlled DOM fixtures; does not sign in to Instagram or collect real posts.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  page.on('console', message => { if (message.type() !== 'error') console.log(message.type(), message.text()); });
  page.on('pageerror', error => console.error(error));
  await page.route('https://www.instagram.com/refokusagency/', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><main><header>Refokus agency</header><a href="/refokusagency/p/FIXTURE1/"><img src="https://scontent.cdninstagram.com/grid1.jpg" width="300" height="200" alt="Grid one"></a><a href="/refokusagency/reel/FIXTURE2/"><img src="https://scontent.cdninstagram.com/grid2.jpg" width="300" height="200" alt="Grid two"></a></main>' }));
  await page.route('https://scontent.cdninstagram.com/**', route => route.fulfill({ contentType: 'image/png', body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aG1cAAAAASUVORK5CYII=', 'base64') }));
  await page.goto('https://www.instagram.com/refokusagency/');
  await page.evaluate(() => {
    document.querySelectorAll('main a').forEach((anchor, index) => anchor.onclick = event => {
      event.preventDefault();
      const number = index + 1;
      history.pushState({}, '', number === 1 ? '/refokusagency/p/FIXTURE1/' : '/refokusagency/reel/FIXTURE2/');
      const modal = document.createElement('div');
      modal.setAttribute('role', 'dialog');
      modal.style.cssText = 'position:fixed;inset:0;background:white';
      modal.innerHTML = `<article><h1>Uma pergunta do comprador. Confira o link na bio.</h1><time datetime="2026-10-01T12:00:00Z"></time><div class="media"><img id="slide" src="https://scontent.cdninstagram.com/slide-${number}-1.jpg" width="500" height="500" alt="Slide ${number}-1"><button id="next" aria-label="Next">Next slide</button></div>${number === 2 ? '<video></video>' : ''}</article><button data-global-next aria-label="Next">Next POST</button><button data-close aria-label="Close">Close</button>`;
      document.body.append(modal);
      let slide = 1;
      modal.querySelector('#next').onclick = () => {
        slide++;
        const image = modal.querySelector('#slide');
        image.src = `https://scontent.cdninstagram.com/slide-1-${slide}.jpg`;
        image.alt = `Slide 1-${slide}`;
        if (slide === 3) modal.querySelector('#next').remove();
      };
      if (number === 2) modal.querySelector('#next').remove();
      modal.querySelector('[data-global-next]').onclick = () => { window.wrongPost = true; };
      modal.querySelector('[data-close]').onclick = () => { modal.remove(); history.pushState({}, '', '/refokusagency/'); };
    });
  });
  // Accelerate deliberate pauses in this synchronous fixture only.
  await page.evaluate(() => { const timeout = window.setTimeout; window.setTimeout = (fn, delay, ...args) => timeout(fn, Math.min(delay, 50), ...args); });
  const downloadWait = page.waitForEvent('download');
  await page.evaluate(await readFile(new URL('./console-deep.js', import.meta.url), 'utf8'));
  const download = await downloadWait;
  const result = JSON.parse(await readFile(await download.path(), 'utf8'));
  assert.equal(result.posts.length, 2);
  assert.equal(result.posts[0].slides.length, 3);
  assert.equal(result.posts[0].media_type, 'carousel');
  assert.equal(result.posts[0].caption_status, 'observed-caption-heading');
  assert.equal(result.posts[0].cta_candidates.length, 1);
  assert.equal(result.posts[1].media_type, 'video');
  assert.equal(await page.evaluate(() => !!window.wrongPost), false, 'Does not click global next-post navigation');
  assert.equal(await page.evaluate(() => location.pathname), '/refokusagency/');
  assert.match(download.suggestedFilename(), /ig-agency-refokusagency-deep\.json/);
  console.log('Deep collector fixtures passed: caption, three-slide traversal, video label, CTA candidates, safe post closing and JSON download. The actual browser exports are documented in the corpus ledger.');
} finally { await browser.close(); }
