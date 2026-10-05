// Blessed Moon: export up to 36 currently visible profile-grid posts.
// Open the profile in your own browser, then paste this entire file into DevTools.
// Reads rendered links and images only. No API requests, cookies or credentials.
(async () => {
  const target = 36;
  const handle = location.pathname.split('/').filter(Boolean)[0];
  if (!['instagram.com', 'www.instagram.com'].includes(location.hostname) ||
      !/^[a-zA-Z0-9_.]{1,30}$/.test(handle || '') ||
      ['accounts', 'explore', 'p', 'reel', 'reels', 'direct', 'stories'].includes(handle)) {
    console.error('Open an Instagram PROFILE first: https://www.instagram.com/<handle>/');
    return;
  }
  if (window.__blessedMoonCollecting) { console.warn('An export is already running.'); return; }
  window.__blessedMoonCollecting = true;
  window.__blessedMoonStopExport = false;
  const initialPath = location.pathname;
  const posts = new Map();
  const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const header = document.querySelector('main header')?.innerText || '';
  let stopReason = 'scroll-limit';
  try {
    for (let pass = 0, unchanged = 0; pass < 30; pass++) {
      if (location.pathname !== initialPath || window.__blessedMoonStopExport) {
        stopReason = 'stopped-or-navigated'; break;
      }
      // Do not continue through login/challenge screens or modal interruptions.
      if (/\/accounts\/(login|suspended)|\/challenge\//.test(location.pathname) || document.querySelector('[role="dialog"]')) {
        stopReason = 'login-or-dialog'; break;
      }
      const before = posts.size;
      for (const link of (document.querySelector('main') || document.body).querySelectorAll('a[href]')) {
        const match = new URL(link.href, location.origin).pathname.match(/^\/(?:[A-Za-z0-9_.]+\/)?(p|reel)\/([A-Za-z0-9_-]+)\/?$/);
        const img = link.querySelector('img');
        if (!match || !img || posts.has(match[2])) continue;
        const imageUrl = img.currentSrc || img.src;
        if (!/^https:\/\//.test(imageUrl)) continue;
        const iconText = Array.from(link.querySelectorAll('svg[aria-label]')).map(svg => svg.getAttribute('aria-label')).join(' ');
        const mediaType = match[1] === 'reel' ? 'video' : /carousel|carrossel/i.test(iconText) ? 'carousel' : /reel|video|vídeo/i.test(iconText) ? 'video' : 'unknown';
        posts.set(match[2], {
          shortcode: match[2], url: `https://www.instagram.com/${match[1]}/${match[2]}/`,
          date: null, media_type: mediaType, media_type_basis: match[1] === 'reel' ? 'url' : 'visible-icon-or-unknown',
          caption: '', alt: img.alt || '', text_source: 'grid-image-alt',
          likes: null, comments: null, image_urls: [imageUrl],
          collected_at: new Date().toISOString(), grid_order: posts.size + 1,
        });
        if (posts.size >= target) break;
      }
      console.log(`Blessed Moon: @${handle}, ${posts.size}/${target} grid records`);
      if (posts.size >= target) { stopReason = 'target'; break; }
      unchanged = posts.size === before ? unchanged + 1 : 0;
      if (unchanged >= 4) { stopReason = 'no-new-posts'; break; }
      window.scrollBy({ top: Math.max(600, innerHeight * 0.85), behavior: 'smooth' });
      await pause(1400 + Math.random() * 700);
    }
    if (!posts.size) { console.error('No grid posts found. Open the Posts tab and wait for its pictures to load.'); return; }
    const result = {
      schema_version: 1, source: 'blessed-moon-visible-grid', collected_at: new Date().toISOString(), stop_reason: stopReason,
      profile: { username: handle.toLowerCase(), url: `https://www.instagram.com/${handle}/`, header_text: header, read_at: new Date().toISOString() },
      limitations: ['Grid covers only; no inner carousel slides or video.', 'Alt text is not a verified caption.', 'Dates and engagement are unknown.', 'Grid order may include pinned posts; not a chronological or random sample.'],
      posts: Array.from(posts.values()),
    };
    const objectUrl = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }));
    const download = document.createElement('a');
    download.href = objectUrl; download.download = `ig-agency-${handle.toLowerCase()}.json`;
    document.body.append(download); download.click(); download.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    console.log(`Saved ${download.download}: ${posts.size} records (${stopReason}). Stop a running export with window.__blessedMoonStopExport = true.`);
  } finally { window.__blessedMoonCollecting = false; }
})();
