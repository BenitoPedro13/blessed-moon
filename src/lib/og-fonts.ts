/**
 * Standard recipe for loading a real Google Font into next/og's
 * ImageResponse (satori): the CSS2 API serves TTF (not WOFF2) to fetch
 * requests that don't send a browser-like Accept header, which is exactly
 * what satori can embed. `text` subsets the response to only the glyphs
 * actually used, keeping the fetch small.
 */
export async function loadGoogleFont(
  family: string,
  weight: number,
  text: string
): Promise<ArrayBuffer> {
  const params = new URLSearchParams({ family: `${family}:wght@${weight}`, text });
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?${params.toString()}`)
  ).text();

  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (!match) {
    throw new Error(`loadGoogleFont: could not find a font source for "${family}"`);
  }

  const response = await fetch(match[1]);
  if (!response.ok) {
    throw new Error(`loadGoogleFont: failed to download "${family}" (${response.status})`);
  }
  return response.arrayBuffer();
}
