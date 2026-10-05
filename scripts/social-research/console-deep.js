// Blessed Moon: selected full-post review through the visible Instagram UI.
// Run on a profile's Posts tab in your own signed-in desktop browser.
// Edit POST_LIMIT to choose how many posts; start with 6 to check the output.
// Does not call APIs, read cookies, publish, like, follow or download videos.
(async () => {
  const POST_LIMIT = 6;
  const SLIDE_LIMIT = 30; // Safety bound, not a claim about Instagram's limit.
  const handle = location.pathname.split('/').filter(Boolean)[0];
  if (!['instagram.com', 'www.instagram.com'].includes(location.hostname) ||
      !/^[a-zA-Z0-9_.]{1,30}$/.test(handle || '') ||
      ['accounts', 'explore', 'p', 'reel', 'reels', 'direct', 'stories'].includes(handle)) {
    console.error('Open the PROFILE Posts tab first, with no post open.'); return;
  }
  if (window.__blessedMoonCollecting) { console.warn('Wait for the other export to finish.'); return; }
  window.__blessedMoonCollecting = true;
  window.__blessedMoonStopExport = false;
  const profilePath = location.pathname;
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const stopped = () => window.__blessedMoonStopExport || /\/accounts\/|\/challenge\//.test(location.pathname);
  const visible = element => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
  };
  const profile = { username: handle.toLowerCase(), url: location.href,
    header_text: document.querySelector('main header')?.innerText || '', read_at: new Date().toISOString() };
  const gridRoot = document.querySelector('main') || document.body;
  const postPath = /^\/(?:[A-Za-z0-9_.]+\/)?(p|reel)\/([A-Za-z0-9_-]+)\/?$/;
  const targets = Array.from(gridRoot.querySelectorAll('a[href]')).map(link => {
    const match = new URL(link.href, location.origin).pathname.match(postPath);
    return match && link.querySelector('img') ? { shortcode: match[2], path: new URL(link.href, location.origin).pathname, canonicalPath: `/${match[1]}/${match[2]}/`, grid_cover: { url: link.querySelector('img').currentSrc || link.querySelector('img').src, alt: link.querySelector('img').alt || '' }, reel: match[1] === 'reel' } : null;
  }).filter(Boolean).filter((post, index, all) => all.findIndex(other => other.shortcode === post.shortcode) === index).slice(0, POST_LIMIT);
  if (!targets.length) { window.__blessedMoonCollecting = false; console.error('No post links containing images were found. Open the Posts tab, wait for pictures, then run again.');
    console.log('Grid diagnostics:', JSON.stringify({ profile: handle, mainFound: !!document.querySelector('main'), imageCount: gridRoot.querySelectorAll('img').length, linkCount: gridRoot.querySelectorAll('a[href]').length, postPaths: Array.from(gridRoot.querySelectorAll('a[href]')).map(a => new URL(a.href, location.origin).pathname).filter(path => /\/(p|reel)\//.test(path)).slice(0, 6) })); return; }
  const results = [];
  function postRoot() {
    const dialog = document.querySelector('[role="dialog"]');
    return dialog?.querySelector('article') || (postPath.test(location.pathname) ? document.querySelector('main article, article') : null);
  }
  // Only images currently visible inside their carousel clipping containers.
  function media(root) {
    return Array.from(root.querySelectorAll('img')).filter(img => {
      if (!visible(img) || !img.complete || !img.naturalWidth) return false;
      const rect = img.getBoundingClientRect();
      if (rect.width < 250 || rect.height < 130) return false;
      let left = Math.max(0, rect.left), right = Math.min(innerWidth, rect.right);
      let top = Math.max(0, rect.top), bottom = Math.min(innerHeight, rect.bottom);
      for (let parent = img.parentElement; parent && parent !== root; parent = parent.parentElement) {
        const style = getComputedStyle(parent), bounds = parent.getBoundingClientRect();
        if (['hidden', 'clip', 'scroll', 'auto'].includes(style.overflowX)) { left = Math.max(left, bounds.left); right = Math.min(right, bounds.right); }
        if (['hidden', 'clip', 'scroll', 'auto'].includes(style.overflowY)) { top = Math.max(top, bounds.top); bottom = Math.min(bottom, bounds.bottom); }
      }
      return Math.max(0, right-left) * Math.max(0, bottom-top) / (rect.width * rect.height) > 0.75;
    }).map(img => ({ url: img.currentSrc || img.src, alt: img.alt || '', width: img.naturalWidth || null, height: img.naturalHeight || null }))
      .filter(image => /^https:\/\//.test(image.url));
  }
  function nextSlide(root) {
    const labels = /^(next|next slide|próximo|próxima|avançar|seguinte)$/i;
    // Global "next post" arrows sit outside article; never use those.
    return Array.from(root.querySelectorAll('button, [role="button"]')).find(button => {
      if (!visible(button) || button.disabled || button.getAttribute('aria-disabled') === 'true') return false;
      const labelsHere = [button.getAttribute('aria-label'), ...Array.from(button.querySelectorAll('[aria-label]')).map(child => child.getAttribute('aria-label'))];
      return labelsHere.some(label => labels.test(label || '')) && !button.closest('ul');
    });
  }
  async function closePost() {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
    await pause(1000);
    if (postRoot() || location.pathname !== profilePath) {
      const controls = Array.from(document.querySelectorAll('button, [role="button"]'));
      const close = controls.find(button => visible(button) && [button.getAttribute('aria-label'), ...Array.from(button.querySelectorAll('[aria-label]')).map(child => child.getAttribute('aria-label'))].some(label => /^(close|fechar)$/i.test(label || '')));
      if (close) { close.click(); await pause(1000); }
    }
    return location.pathname === profilePath && !document.querySelector('[role="dialog"]');
  }
  try {
    for (const target of targets) {
      if (stopped()) break;
      const link = Array.from(gridRoot.querySelectorAll('a[href]')).find(anchor => new URL(anchor.href, location.origin).pathname === target.path);
      if (!link) { console.warn(`Grid link unavailable: ${target.shortcode}; ending without guessing.`); break; }
      link.scrollIntoView({ block: 'center' }); await pause(500); link.click();
      let root = null;
      for (let attempt = 0; attempt < 12 && !stopped(); attempt++) {
        await pause(700); root = postRoot(); if (root && media(root).length) break;
      }
      if (!root || stopped()) { console.warn('Post did not open, or login/verification requested. Stopping.'); break; }
      const locationCode = location.pathname.match(postPath)?.[2];
      if (locationCode && locationCode !== target.shortcode) { console.warn('Unexpected post opened; stopping.'); break; }
      // Expand a visibly truncated caption only. Do not interact with likes,
      // comments, follow buttons, menus or "view all comments" controls.
      const h1 = root.querySelector('h1');
      const captionArea = h1?.parentElement?.parentElement;
      if (captionArea) {
        const more = Array.from(captionArea.querySelectorAll('button, [role="button"], span')).find(element => visible(element) && /^(more|mais|ver mais)$/i.test(element.textContent.trim()));
        if (more) { more.click(); await pause(500); }
      }
      const caption = root.querySelector('h1')?.innerText || '';
      const renderedText = root.innerText;
      const date = root.querySelector('time[datetime]')?.getAttribute('datetime') || null;
      const slides = [], seen = new Set();
      let slideStop = 'no-next-control';
      for (let index = 0; index < SLIDE_LIMIT; index++) {
        if (stopped()) { slideStop = 'user-or-access-stop'; break; }
        const current = media(root);
        if (!current.length) { slideStop = 'media-not-visible'; break; }
        const signature = current.map(image => new URL(image.url).pathname).join('|');
        if (seen.has(signature)) { slideStop = 'repeated-slide'; break; }
        seen.add(signature);
        slides.push({ index: slides.length + 1, images: current, text_source: 'visible-slide-image-alt' });
        const next = nextSlide(root);
        if (!next) { slideStop = 'no-next-control'; break; }
        next.click(); await pause(1500 + Math.random() * 700);
        const afterCode = location.pathname.match(postPath)?.[2];
        if (afterCode && afterCode !== target.shortcode) { slideStop = 'unexpected-post-navigation'; break; }
        if (index === SLIDE_LIMIT - 1) slideStop = 'safety-slide-limit';
      }
      const links = Array.from(root.querySelectorAll('a[href]')).map(anchor => ({ text: anchor.innerText, url: anchor.href }))
        .filter(link => link.text && /^https:\/\//.test(link.url)).slice(0, 80);
      results.push({ shortcode: target.shortcode, url: `https://www.instagram.com${target.canonicalPath}`, date,
        media_type: target.reel || root.querySelector('video') ? 'video' : slides.length > 1 ? 'carousel' : 'unknown',
        caption, caption_status: caption ? 'observed-caption-heading' : 'caption-selector-not-found',
        rendered_post_text: renderedText, text_source: caption ? 'rendered-post-caption-heading' : 'rendered-post-text-only',
        alt: target.grid_cover.alt || slides[0]?.images[0]?.alt || '',
        grid_cover: target.grid_cover,
        image_urls: [target.grid_cover.url, ...slides.flatMap(slide => slide.images.map(image => image.url))].filter(url => /^https:\/\//.test(url)),
        slides, slide_stop_reason: slideStop,
        // Candidates for human review, not a claimed CTA classification.
        cta_candidates: caption.split(/\n|(?<=[.!?])\s+/).filter(sentence => /link|bio|coment|comment|mensag|message|direct|dm|salv|save|visit|conhe[cç]|agend|download|saiba|confira/i.test(sentence)).slice(-8),
        visible_links: links, likes: null, comments: null, collected_at: new Date().toISOString(),
      });
      console.log(`@${handle}: ${results.length}/${targets.length} posts; ${slides.length} visible slides; caption ${caption ? 'captured' : 'unconfirmed'}.`);
      if (!(await closePost())) { console.warn('Could not return to the profile safely. Exporting captured posts and stopping.'); break; }
      await pause(1800 + Math.random() * 1200);
    }
  } catch (error) { console.error('Stopped; exporting partial results:', error); }
  finally {
    window.__blessedMoonCollecting = false;
    if (results.length) {
      const exportBody = { schema_version: 1, source: 'blessed-moon-visible-full-post', profile,
        collected_at: new Date().toISOString(), posts: results,
        limitations: ['Captions captured only when the visible caption heading was found; inspect caption_status.', 'Slide text is image alt text, not guaranteed OCR. Cover images retained; actual video not downloaded.', 'Carousel traversal completeness needs review; see slide_stop_reason.', 'CTA candidates require human interpretation. Visible links may include mentions or other UI links.', 'No engagement-to-conversion claims.'] };
      const blobUrl = URL.createObjectURL(new Blob([JSON.stringify(exportBody, null, 2)], { type: 'application/json' }));
      const download = document.createElement('a'); download.href = blobUrl; download.download = `ig-agency-${handle.toLowerCase()}-deep.json`;
      document.body.append(download); download.click(); download.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      console.log(`Saved ${download.download}. Inspect a first export before collecting more accounts.`);
    } else console.warn('No post records exported. Instagram may have changed its markup; do not keep retrying blindly.');
  }
})();
