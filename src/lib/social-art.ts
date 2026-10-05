import { creativeSlides, PROJECT_ART_IMAGES } from "@/lib/social-creative";
import { LOGO_PATH } from "@/lib/logo-mark";
import { SITE_URL } from "@/lib/site-config";
import type { Channel, Story } from "@/lib/social-plan";

export const ART_FORMATS = {
  portrait: { label: "Portrait · 1080 × 1350", width: 1080, height: 1350 },
  square: { label: "Square · 1080 × 1080", width: 1080, height: 1080 },
  landscape: { label: "Landscape · 1200 × 627", width: 1200, height: 627 },
  story: { label: "Story · 1080 × 1920", width: 1080, height: 1920 },
} as const;
export const ART_TEMPLATES = { statement: "Statement", steps: "Checklist", case: "Project screenshot", compare: "Comparison", workflow: "Workflow", action: "Closing action" } as const;
export type ArtFormat = keyof typeof ART_FORMATS;
export type ArtTemplate = keyof typeof ART_TEMPLATES;
export const ART_SURFACES = { dark: "Midnight", paper: "Warm paper", amber: "Amber" } as const;
export type ArtSurface = keyof typeof ART_SURFACES;
export type ArtSlide = { surface?: ArtSurface; action?: string; title: string; body: string; kicker: string; footer: string; template: ArtTemplate; image: string; imageAlt: string };
export type ArtPost = { version: 1; id: string; channel: Channel; format: ArtFormat; caption: string; slides: ArtSlide[] };
export const MAX_ART_SLIDES = 10;
export const emptySlide = (): ArtSlide => ({ title: "Clarity is the feature.", body: "One useful question. One considered decision.", kicker: "Blessed Moon Studio", footer: new URL(SITE_URL).host, template: "statement", image: "", imageAlt: "" });
export const firstSentence = (text: string) => text.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || text;

export function storyPost(story: Story, channel: Channel): ArtPost {
  const caption = channel === "instagram" ? story.caption : story.linkedin;
  return { version: 1, id: story.id, channel, format: channel === "instagram" ? "portrait" : "landscape", caption,
    slides: creativeSlides(story, channel).map((slide) => ({ ...emptySlide(), ...slide })) };

}

export function blankPost(): ArtPost { return { version: 1, id: "studio-draft", channel: "instagram", format: "portrait", caption: "", slides: [emptySlide()] }; }

export const approvedArtImage = (image: string) => Object.hasOwn(PROJECT_ART_IMAGES, image);
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
    if (image && !rasterData.test(image) && !approvedArtImage(image)) throw new Error("Screenshots must be local PNG, JPEG or WebP images.");
    const surface = slide.surface ?? "dark";
    if (typeof surface !== "string" || !Object.hasOwn(ART_SURFACES, surface)) throw new Error("Unknown slide surface.");
    return { surface: surface as ArtSurface, action: text(slide.action ?? "", 90), title: text(slide.title, 180), body: text(slide.body, 500), kicker: text(slide.kicker, 64), footer: text(slide.footer, 90), template: slide.template as ArtTemplate, image, imageAlt: text(slide.imageAlt, 240) };
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
  while (size > 12 && wrap(text, size, width, mono).length * size * 1.2 > height) size -= 2;
  return { size, lines: wrap(text, size, width, mono) };
}
const textLines = (lines: string[], x: number, y: number, size: number, fill: string, weight = 400, font = "Arial, Helvetica, sans-serif") => `<text x="${x}" y="${y}" fill="${fill}" font-family="${font}" font-size="${size}" font-weight="${weight}">${lines.map((line, index) => `<tspan x="${x}" dy="${index ? size * 1.2 : 0}">${escape(line)}</tspan>`).join("")}</text>`;

export function slideAlt(slide: ArtSlide, index: number, total: number) { return `Slide ${index + 1} of ${total}: ${slide.title}${slide.body ? `. ${slide.body}` : ""}${slide.imageAlt ? `. Image: ${slide.imageAlt}` : ""}${slide.action ? `. Next step: ${slide.action}` : ""}`; }

/** One art source for the on-page SVG and every locally rasterised export. */
export function renderSlideSvg(slide: ArtSlide, format: ArtFormat, index = 0, total = 1): string {
  const { width: w, height: h } = ART_FORMATS[format];
  const wide = format === "landscape", tall = format === "story";
  const palette = slide.surface === "amber"
    ? { bg: "#ff6a1f", ink: "#101820", muted: "#253440", accent: "#101820", panel: "#ff884b", edge: "#c44b12" }
    : slide.surface === "paper"
      ? { bg: "#f1ece6", ink: "#101820", muted: "#455462", accent: "#c44205", panel: "#ffffff", edge: "#c6cdd2" }
      : { bg: "#05080d", ink: "#f1ece6", muted: "#aebcca", accent: "#ff6a1f", panel: "#111923", edge: "#293848" };
  const pad = 64, top = tall ? 220 : wide ? 38 : 64;
  const bottom = tall ? h - 310 : h - 65;
  const headingTop = top + (wide ? 100 : 140);
  const heading = fitted(slide.title, wide ? 58 : 86, w - 2 * pad, wide ? 100 : 310);
  const contentTop = headingTop + heading.lines.length * heading.size * 1.2 + (wide ? 24 : 42);
  const contentBottom = bottom - (slide.action ? 135 : 85);
  const contentHeight = Math.max(64, contentBottom - contentTop);
  const mono = "Courier New, monospace";
  let art = "";
  const rawPoints = slide.body.split("\n").map(line => line.trim()).filter(Boolean);
  const points = rawPoints.length > 6 ? [...rawPoints.slice(0, 5), rawPoints.slice(5).join(" ")] : rawPoints;
  function paragraph(text: string, x: number, y: number, width: number, height: number, size = wide ? 27 : 36, fill = palette.muted) {
    const copy = fitted(text, size, width, Math.max(24, height));
    return textLines(copy.lines, x, y + copy.size, copy.size, fill);
  }
  if (slide.template === "case") {
    const photoX = pad, photoY = contentTop;
    const photoW = wide ? (w - 2 * pad) * .6 : w - 2 * pad;
    const photoH = wide ? contentHeight : contentHeight * .65;
    const photo = slide.image && (rasterData.test(slide.image) || approvedArtImage(slide.image))
      ? `<svg x="${photoX}" y="${photoY}" width="${photoW}" height="${photoH}" overflow="hidden"><image href="${escape(slide.image)}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"/></svg>`
      : paragraph("Add an approved project screenshot", photoX + 24, photoY + 24, photoW - 48, photoH - 48, 28);
    art = `<rect x="${photoX}" y="${photoY}" width="${photoW}" height="${photoH}" fill="${palette.panel}" stroke="${palette.edge}"/>${photo}`;
    art += wide
      ? paragraph(slide.body, pad + photoW + 28, contentTop, w - 2 * pad - photoW - 28, contentHeight, 27)
      : paragraph(slide.body, pad, contentTop + photoH + 24, w - 2 * pad, contentHeight - photoH - 24, 32);
  } else if (slide.template === "compare") {
    const divided = points.length > 1 ? [points[0], points.slice(1).join(" ")] : [slide.body, "Add the alternative and its trade-off."];
    divided.forEach((point, i) => {
      const x = wide ? pad + i * ((w - 2 * pad + 24) / 2) : pad;
      const y = wide ? contentTop : contentTop + i * ((contentHeight + 24) / 2);
      const width = wide ? (w - 2 * pad - 24) / 2 : w - 2 * pad;
      const height = wide ? contentHeight : (contentHeight - 24) / 2;
      art += `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${palette.panel}" stroke="${palette.edge}"/><rect x="${x}" y="${y}" width="5" height="${height}" fill="${palette.accent}"/>`;
      art += paragraph(point, x + 28, y + 24, width - 56, height - 48, wide ? 28 : 38, palette.ink);
    });
  } else if (slide.template === "steps" || slide.template === "workflow") {
    const rows = points.length ? points : ["Add the steps that explain this decision."];
    const gap = slide.template === "workflow" ? 22 : 14;
    const columns = wide ? (rows.length === 4 ? 2 : Math.min(3, rows.length)) : 1;
    const rowCount = Math.ceil(rows.length / columns);
    const rowHeight = (contentHeight - gap * (rowCount - 1)) / rowCount;
    const rowWidth = (w - 2 * pad - gap * (columns - 1)) / columns;
    rows.forEach((point, i) => {
      const y = contentTop + Math.floor(i / columns) * (rowHeight + gap);
      const x = pad + (i % columns) * (rowWidth + gap);
      art += `<rect x="${x}" y="${y}" width="${rowWidth}" height="${rowHeight}" fill="${palette.panel}" stroke="${palette.edge}"/>`;
      art += textLines([String(i + 1).padStart(2, "0")], x + 18, y + Math.min(rowHeight - 12, wide ? 35 : 54), wide ? 26 : 34, palette.accent, 700, mono);
      art += paragraph(point, x + (wide ? 64 : 100), y + 12, rowWidth - (wide ? 80 : 124), rowHeight - 24, wide ? 25 : 40, palette.ink);
      if (!wide && slide.template === "workflow" && i < rows.length - 1) art += `<path d="M${w / 2} ${y + rowHeight + 3}v${gap - 8}m-5 -5 5 5 5 -5" fill="none" stroke="${palette.accent}" stroke-width="2"/>`;
    });
  } else {
    art = `<rect x="${pad}" y="${contentTop}" width="${w - 2 * pad}" height="${contentHeight}" fill="${palette.panel}" stroke="${palette.edge}"/><rect x="${pad}" y="${contentTop}" width="6" height="${contentHeight}" fill="${palette.accent}"/>`;
    const boxPad = wide ? 24 : 38;
    const bodyHeight = Math.min(contentHeight - boxPad * 2, wide ? contentHeight : contentHeight * .55);
    art += paragraph(slide.body, pad + boxPad, contentTop + boxPad, w - 2 * pad - boxPad * 2, bodyHeight, wide ? 30 : 40, palette.ink);
    if (!wide && contentHeight > 360 && slide.template !== "action") {
      const labels = ["ENTENDER", "DECIDIR", "AGIR"];
      const tileW = (w - 2 * pad - boxPad * 2 - 24) / 3;
      const tileY = contentTop + contentHeight - 145;
      labels.forEach((label, i) => {
        const x = pad + boxPad + i * (tileW + 12);
        art += `<path d="M${x} ${tileY}H${x + tileW}" stroke="${palette.edge}"/>${textLines([String(i + 1).padStart(2, "0")], x, tileY + 42, 30, palette.accent, 700, mono)}${textLines([label], x, tileY + 80, 21, palette.muted, 400, mono)}`;
      });
    }
  }
  const kicker = fitted(slide.kicker.toUpperCase(), wide ? 19 : 22, w - 2 * pad, 30, true);
  const footer = fitted(slide.footer, 19, w - 2 * pad - 175, 48, true);
  let action = "";
  if (slide.action) {
    const copy = fitted(slide.action, wide ? 23 : 28, w - 2 * pad - 40, 55);
    action = `<rect x="${pad}" y="${bottom - 110}" width="${w - 2 * pad}" height="70" fill="${palette.accent}"/>${textLines(copy.lines, pad + 20, bottom - 78, copy.size, palette.bg === "#05080d" ? "#101820" : palette.bg, 700)}`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escape(slideAlt(slide, index, total))}"><rect width="${w}" height="${h}" fill="${palette.bg}"/><g transform="translate(${pad} ${top}) scale(5)"><path d="${LOGO_PATH}" fill="${palette.accent}"/></g>${textLines(["BLESSED_MOON / STUDIO"], pad + 58, top + 30, 22, palette.muted, 400, mono)}<path d="M${pad} ${top + 70}H${w - pad}" stroke="${palette.edge}"/>${textLines(kicker.lines, pad, headingTop - 24, kicker.size, palette.accent, 400, mono)}${textLines(heading.lines, pad, headingTop + heading.size, heading.size, palette.ink, 700)}${art}${action}<path d="M${pad} ${bottom - 22}H${w - pad}" stroke="${palette.edge}"/>${textLines(footer.lines, pad, bottom + 4, footer.size, palette.muted, 400, mono)}<text x="${w - pad}" y="${bottom + 4}" text-anchor="end" fill="${palette.accent}" font-size="22" font-family="${mono}">${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</text></svg>`;
}
