import { LOGO_PATH } from "@/lib/logo-mark";
import { SITE_URL } from "@/lib/site-config";
import type { Channel, Story } from "@/lib/social-plan";

export const ART_FORMATS = {
  portrait: { label: "Portrait · 1080 × 1350", width: 1080, height: 1350 },
  square: { label: "Square · 1080 × 1080", width: 1080, height: 1080 },
  landscape: { label: "Landscape · 1200 × 627", width: 1200, height: 627 },
  story: { label: "Story · 1080 × 1920", width: 1080, height: 1920 },
} as const;
export const ART_TEMPLATES = { statement: "Statement", steps: "Checklist", case: "Project screenshot" } as const;
export type ArtFormat = keyof typeof ART_FORMATS;
export type ArtTemplate = keyof typeof ART_TEMPLATES;
export type ArtSlide = { title: string; body: string; kicker: string; footer: string; template: ArtTemplate; image: string; imageAlt: string };
export type ArtPost = { version: 1; id: string; channel: Channel; format: ArtFormat; caption: string; slides: ArtSlide[] };
export const MAX_ART_SLIDES = 10;
export const emptySlide = (): ArtSlide => ({ title: "Clarity is the feature.", body: "One useful question. One considered decision.", kicker: "Blessed Moon Studio", footer: new URL(SITE_URL).host, template: "statement", image: "", imageAlt: "" });
export const firstSentence = (text: string) => text.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || text;

export function storyPost(story: Story, channel: Channel): ArtPost {
  const caption = channel === "instagram" ? story.caption : story.linkedin;
  const copy = channel === "instagram" && story.format === "Carousel" ? [...story.slides] : [channel === "instagram" ? story.slides[0].replace(/^\d+\s*[–-]\s*\d+s:\s*/, "") : story.title];
  return { version: 1, id: story.id, channel, format: channel === "instagram" ? "portrait" : "landscape", caption,
    slides: copy.map((title, i) => ({ ...emptySlide(), title, body: i === 0 ? firstSentence(caption) : "", kicker: channel === "instagram" ? "Uma decisão do projeto" : "A decision behind the build" })) };
}

export function blankPost(): ArtPost { return { version: 1, id: "studio-draft", channel: "instagram", format: "portrait", caption: "", slides: [emptySlide()] }; }

const rasterData = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;
export function readArtPost(value: unknown): ArtPost {
  if (!value || typeof value !== "object") throw new Error("Choose an exported post draft.");
  const post = value as Record<string, unknown>;
  if (post.version !== 1 || typeof post.channel !== "string" || !["instagram", "linkedin"].includes(post.channel) || typeof post.format !== "string" || !Object.hasOwn(ART_FORMATS, post.format) || !Array.isArray(post.slides) || post.slides.length < 1 || post.slides.length > MAX_ART_SLIDES) throw new Error("This draft has an unsupported format or slide count.");
  if (post.slides.reduce((sum, slide) => sum + (typeof slide?.image === "string" ? slide.image.length : 0), 0) > 10_000_000) throw new Error("Use fewer or smaller screenshots to keep the editable draft within 10 MB.");
  const text = (input: unknown, max: number) => { if (typeof input !== "string" || input.length > max) throw new Error("A draft field is missing or too long."); return input; };
  return { version: 1, id: text(post.id, 100), channel: post.channel as Channel, format: post.format as ArtFormat, caption: text(post.caption, 5000), slides: post.slides.map((input) => {
    if (!input || typeof input !== "object") throw new Error("A slide is missing.");
    const slide = input as Record<string, unknown>;
    if (typeof slide.template !== "string" || !Object.hasOwn(ART_TEMPLATES, slide.template)) throw new Error("Unknown slide template.");
    const image = text(slide.image, 4_000_000);
    if (image && !rasterData.test(image)) throw new Error("Screenshots must be local PNG, JPEG or WebP images.");
    return { title: text(slide.title, 180), body: text(slide.body, 500), kicker: text(slide.kicker, 64), footer: text(slide.footer, 90), template: slide.template as ArtTemplate, image, imageAlt: text(slide.imageAlt, 240) };
  }) };
}

const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!);
// Conservative Arial width estimates keep long words and Portuguese copy in bounds.
const units = (text: string) => [...text].reduce((sum, char) => sum + (/\s/.test(char) ? .3 : /[MW@%]/.test(char) ? .95 : /[ilI.,:!|']/ .test(char) ? .28 : /[A-Z]/.test(char) ? .72 : .61), 0);
function wrap(text: string, size: number, width: number, mono = false): string[] {
  const measure = (value: string) => mono ? [...value].length * .62 : units(value);
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      if (measure(`${line} ${word}`.trim()) * size <= width) { line = `${line} ${word}`.trim(); continue; }
      if (line) lines.push(line);
      line = "";
      for (const char of word) { if (measure(line + char) * size > width && line) { lines.push(line); line = ""; } line += char; }
    }
    if (line) lines.push(line);
  }
  return lines;
}
function fitted(text: string, initial: number, width: number, height: number, mono = false) {
  let size = initial;
  while (size > 16 && wrap(text, size, width, mono).length * size * 1.2 > height) size -= 2;
  return { size, lines: wrap(text, size, width, mono) };
}
const textLines = (lines: string[], x: number, y: number, size: number, fill: string, weight = 400, font = "Arial, Helvetica, sans-serif") => `<text x="${x}" y="${y}" fill="${fill}" font-family="${font}" font-size="${size}" font-weight="${weight}">${lines.map((line, index) => `<tspan x="${x}" dy="${index ? size * 1.2 : 0}">${escape(line)}</tspan>`).join("")}</text>`;

export function slideAlt(slide: ArtSlide, index: number, total: number) { return `Slide ${index + 1} of ${total}: ${slide.title}${slide.body ? `. ${slide.body}` : ""}${slide.imageAlt ? `. Image: ${slide.imageAlt}` : ""}`; }

/** One art source for the on-page SVG and every locally rasterised export. */
export function renderSlideSvg(slide: ArtSlide, format: ArtFormat, index = 0, total = 1): string {
  const { width: w, height: h } = ART_FORMATS[format];
  const wide = format === "landscape";
  const tall = format === "story";
  const pad = 64;
  const top = tall ? 220 : wide ? 48 : 72;
  const bottom = tall ? h - 310 : h - 76;
  const photo = slide.template === "case";
  const textWidth = wide && photo ? 590 : w - pad * 2;
  const titleY = top + (wide ? 186 : 240);
  const titleHeight = wide ? 120 : photo ? 260 : h * .32;
  const heading = fitted(slide.title, wide ? 64 : 88, textWidth, titleHeight);
  const bodyY = titleY + Math.max(0, heading.lines.length - 1) * heading.size * 1.2 + (wide ? 50 : 64);
  const bodyHeight = wide ? Math.max(40, bottom - bodyY - 38) : photo ? 135 : Math.max(80, bottom - bodyY - 100);
  const bodyText = slide.template === "steps" ? slide.body.split("\n").filter((line) => line.trim()).map((line, i) => `${String(i + 1).padStart(2, "0")} · ${line}`).join("\n") : slide.body;
  const body = fitted(bodyText, wide ? 25 : 34, textWidth, bodyHeight);
  const photoX = wide ? 724 : pad;
  const photoY = wide ? top + 108 : Math.max(bodyY + body.lines.length * body.size * 1.2 + 50, h * .61);
  const photoW = wide ? w - photoX - pad : w - pad * 2;
  const photoH = Math.max(40, bottom - photoY - 64);
  const footer = fitted(slide.footer, 21, w - 2 * pad - 170, 56, true);
  let grid = "";
  for (let x = 0; x < w; x += 72) grid += `<path d="M${x} 0V${h}" stroke="#18222b" stroke-width="1"/>`;
  for (let y = 0; y < h; y += 72) grid += `<path d="M0 ${y}H${w}" stroke="#18222b" stroke-width="1"/>`;
  const image = photo ? slide.image && rasterData.test(slide.image)
    ? `<svg x="${photoX}" y="${photoY}" width="${photoW}" height="${photoH}" overflow="hidden"><image href="${escape(slide.image)}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"/></svg>`
    : `<rect x="${photoX}" y="${photoY}" width="${photoW}" height="${photoH}" fill="#101820" stroke="#29333c"/>${textLines(["Add an approved", "project screenshot"], photoX + 28, photoY + photoH / 2, 24, "#98a7b6")}` : "";
  const bullet = slide.template === "steps" ? `<rect x="${pad}" y="${titleY - heading.size - 18}" width="54" height="8" fill="#ff6a1f"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escape(slideAlt(slide, index, total))}"><rect width="${w}" height="${h}" fill="#050505"/><g opacity=".55">${grid}</g><rect x="28" y="${tall ? 160 : 28}" width="${w - 56}" height="${tall ? h - 370 : h - 56}" fill="#090d12" stroke="#29333c"/><g transform="translate(${pad} ${top}) scale(5)"><path d="${LOGO_PATH}" fill="#ff6a1f"/></g>${textLines(["BLESSED_MOON / STUDIO"], pad + 58, top + 32, 22, "#a4b2c0", 400, "Courier New, monospace")}<path d="M${pad} ${top + 82}H${w - pad}" stroke="#29333c"/>${textLines([slide.kicker.toUpperCase()], pad, titleY - (wide ? 76 : 125), 22, "#ff6a1f", 400, "Courier New, monospace")}${bullet}${textLines(heading.lines, pad, titleY, heading.size, "#eeeeee", 700)}${textLines(body.lines, pad, bodyY, body.size, "#aebcca")}${image}<path d="M${pad} ${bottom - 42}H${w - pad}" stroke="#29333c"/>${textLines(footer.lines, pad, bottom, footer.size, "#a4b2c0", 400, "Courier New, monospace")}<text x="${w - pad}" y="${bottom}" text-anchor="end" fill="#ff6a1f" font-size="24" font-family="Courier New, monospace">${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</text></svg>`;
}
