import { AUTHORED_SLIDES } from "@/lib/social-posts";
import { LOGO_BOUNDS, LOGO_PATH } from "@/lib/logo-mark";
import { SOCIAL_HANDLE } from "@/lib/site-config";
import { SOCIAL_FONT_METRICS } from "@/lib/social-font-metrics";
import PROJECT_IMAGES from "@/lib/social-art-images.json";
import type { Channel, Story, StoryFrame } from "@/lib/social-plan";

// One art source for the on-page SVG and every locally rasterised export
// (TASK-social-art-foundations.md, TASK-social-art-signatures.md). Type sits
// directly on the surface; the only frame is one that is content (the terminal
// window around a screenshot). Faces are the site's own, embedded in the SVG.

export const ART_FORMATS = {
  portrait: { label: "Portrait · 1080 × 1350", width: 1080, height: 1350 },
  square: { label: "Square · 1080 × 1080", width: 1080, height: 1080 },
  landscape: { label: "Landscape · 1200 × 627", width: 1200, height: 627 },
  story: { label: "Story · 1080 × 1920", width: 1080, height: 1920 },
} as const;
export const ART_TEMPLATES = {
  cover: "Cover",
  point: "Point",
  rows: "Rows / checklist",
  compare: "Comparison",
  window: "Screenshot in window",
  annotate: "Annotated screenshot",
  action: "Closing action",
} as const;
export const ART_SURFACES = { dark: "Midnight", paper: "Warm paper", amber: "Amber" } as const;
export const ART_MARKS = { none: "None", crescent: "Crescent", moon: "Moon (from the site)" } as const;
export type ArtFormat = keyof typeof ART_FORMATS;
export type ArtTemplate = keyof typeof ART_TEMPLATES;
export type ArtSurface = keyof typeof ART_SURFACES;
export type ArtMark = keyof typeof ART_MARKS;
export type ArtSlide = {
  template: ArtTemplate; surface?: ArtSurface;
  kicker: string; title: string; accent?: string; body: string; footer: string; action?: string;
  /** Rows: number them, so later slides can refer back to "question 3". */
  numbered?: boolean;
  /** A numeral that leads a `point` slide. Only for slides that really are a sequence. */
  step?: string;
  /** Cover/closing art. */
  art?: ArtMark;
  /** The terminal window's title-bar label, e.g. `~/work/oishi`. */
  label?: string;
  image: string; imageAlt: string;
  /** Regions on an annotated screenshot as `[x, y, w, h]`, percent of the visible window. A legacy `[x, y]` point becomes a small square. */
  marks?: ArtRegion[];
};
export type ArtRegion = [number, number] | [number, number, number, number];
export type ArtLanguage = "en" | "pt";
export type ArtPost = { version: 1; id: string; channel: Channel; lang?: ArtLanguage; format: ArtFormat; caption: string; slides: ArtSlide[] };
export const MAX_ART_SLIDES = 10;
export const MAX_MARKS = 6;
export const PROJECT_ART_IMAGES: Record<string, string> = PROJECT_IMAGES;

export const emptySlide = (): ArtSlide => ({ template: "cover", surface: "dark", kicker: "Blessed Moon Studio", title: "Clarity is the feature.", accent: "", body: "", footer: SOCIAL_HANDLE, action: "", step: "", art: "crescent", label: "", image: "", imageAlt: "", marks: [] });

/** A story's authored carousel. Instagram is portrait; LinkedIn gets the same
 * slides square, posted as a PDF document. */
export function storyPost(story: Story, channel: Channel): ArtPost {
  const slides = AUTHORED_SLIDES[story.id] ?? [{ template: "cover", title: story.title }];
  return { version: 1, id: story.id, channel, lang: story.lang, format: channel === "instagram" ? "portrait" : "square",
    caption: channel === "instagram" ? story.caption : story.linkedin,
    slides: slides.map((slide) => ({ ...emptySlide(), kicker: "", art: "none", ...slide })) };
}

/** An Instagram Story frame: one or more full-screen slides, no caption. */
export function framePost(frame: StoryFrame): ArtPost {
  const slides = AUTHORED_SLIDES[frame.id] ?? [{ template: "cover", title: frame.title }];
  return { version: 1, id: frame.id, channel: "instagram", lang: frame.lang, format: "story", caption: "",
    slides: slides.map((slide) => ({ ...emptySlide(), kicker: "", art: "none", ...slide })) };
}

export function blankPost(): ArtPost { return { version: 1, id: "studio-draft", channel: "instagram", format: "portrait", caption: "", slides: [emptySlide()] }; }

export const approvedArtImage = (image: string) => Object.hasOwn(PROJECT_ART_IMAGES, image);
const rasterData = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;
// Drafts exported before TASK-social-art-foundations.md still open.
// The ASCII-screenshot template was retired on 5 October (TASK-social-art-reveal-and-callouts.md).
const LEGACY_TEMPLATES: Record<string, ArtTemplate> = { statement: "point", steps: "rows", workflow: "rows", case: "window", ascii: "window" };

export function readArtPost(value: unknown): ArtPost {
  if (!value || typeof value !== "object") throw new Error("Choose an exported post draft.");
  const post = value as Record<string, unknown>;
  if (post.version !== 1 || typeof post.channel !== "string" || !["instagram", "linkedin"].includes(post.channel) || typeof post.format !== "string" || !Object.hasOwn(ART_FORMATS, post.format) || !Array.isArray(post.slides) || post.slides.length < 1 || post.slides.length > MAX_ART_SLIDES) throw new Error("This draft has an unsupported format or slide count.");
  if (post.lang !== undefined && post.lang !== "en" && post.lang !== "pt") throw new Error("This draft has an unsupported language.");
  if (post.slides.reduce((sum, slide) => sum + (typeof slide?.image === "string" ? slide.image.length : 0), 0) > 10_000_000) throw new Error("Use fewer or smaller screenshots to keep the editable draft within 10 MB.");
  const text = (input: unknown, max: number) => { if (typeof input !== "string" || input.length > max) throw new Error("A draft field is missing or too long."); return input; };
  const choice = <T extends string>(input: unknown, options: Record<T, string>, fallback: T, message: string): T => {
    const option = input ?? fallback;
    if (typeof option !== "string" || !Object.hasOwn(options, option)) throw new Error(message);
    return option as T;
  };
  return { version: 1, id: text(post.id, 100), channel: post.channel as Channel, ...(post.lang ? { lang: post.lang as ArtLanguage } : {}), format: post.format as ArtFormat, caption: text(post.caption, 5000), slides: post.slides.map((input) => {
    if (!input || typeof input !== "object") throw new Error("A slide is missing.");
    const slide = input as Record<string, unknown>;
    const template = typeof slide.template === "string" ? LEGACY_TEMPLATES[slide.template] ?? slide.template : slide.template;
    if (typeof template !== "string" || !Object.hasOwn(ART_TEMPLATES, template)) throw new Error("Unknown slide template.");
    const image = text(slide.image, 4_000_000);
    if (image && !rasterData.test(image) && !approvedArtImage(image)) throw new Error("Screenshots must be local PNG, JPEG or WebP images.");
    const marks = slide.marks ?? [];
    if (!Array.isArray(marks) || marks.length > MAX_MARKS || !marks.every((mark) => Array.isArray(mark) && (mark.length === 2 || mark.length === 4) && mark.every((n) => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 100))) throw new Error(`Marker positions must be up to ${MAX_MARKS} regions of 2 or 4 numbers between 0 and 100.`);
    return {
      template: template as ArtTemplate,
      surface: choice(slide.surface, ART_SURFACES, "dark", "Unknown slide surface."),
      art: choice(slide.art, ART_MARKS, "none", "Unknown slide art."),
      kicker: text(slide.kicker, 64), title: text(slide.title, 180), accent: text(slide.accent ?? "", 120), body: text(slide.body, 500),
      footer: text(slide.footer, 90), action: text(slide.action ?? "", 90), step: text(slide.step ?? "", 4), label: text(slide.label ?? "", 48),
      image, imageAlt: text(slide.imageAlt, 240), marks: marks as ArtRegion[], numbered: slide.numbered === true,
    };
  }) };
}

export function slideAlt(slide: ArtSlide, index: number, total: number) {
  return `Slide ${index + 1} of ${total}: ${slide.title}${slide.accent ? ` ${slide.accent}` : ""}${slide.body ? `. ${slide.body.replace(/\s*\|\s*/g, ", ").replace(/\n/g, "; ")}` : ""}${slide.imageAlt ? `. Image: ${slide.imageAlt}` : ""}${slide.action ? `. Next step: ${slide.action}` : ""}`;
}

// ── Type ─────────────────────────────────────────────────────────────────────

type Face = keyof typeof SOCIAL_FONT_METRICS;
/** Fonts and the moon, as same-origin URLs on the page or data URIs inside an export. */
export type ArtSources = Partial<Record<Face | "moon", string>>;
export const MOON_FILE = "/social/moon.png";
const FACE_RULES: Record<Face, { family: "BM Sans" | "BM Mono"; weight: number }> = {
  sans400: { family: "BM Sans", weight: 400 }, sans500: { family: "BM Sans", weight: 500 }, sans700: { family: "BM Sans", weight: 700 },
  mono500: { family: "BM Mono", weight: 500 }, mono700: { family: "BM Mono", weight: 700 },
};
const STACK = { "BM Sans": "'BM Sans', 'Space Grotesk', Arial, sans-serif", "BM Mono": "'BM Mono', 'JetBrains Mono', 'Courier New', monospace" } as const;
export const SOCIAL_FONT_FILES = Object.fromEntries(Object.entries(SOCIAL_FONT_METRICS).map(([face, value]) => [face, `/fonts/social/${value.file}`])) as Record<Face, string>;

function fontStyle(sources: ArtSources) {
  return `<style>${(Object.keys(FACE_RULES) as Face[]).map((face) => `@font-face{font-family:'${FACE_RULES[face].family}';font-weight:${FACE_RULES[face].weight};font-style:normal;src:url(${sources[face] ?? SOCIAL_FONT_FILES[face]}) format('woff2')}`).join("")}</style>`;
}

function measure(text: string, face: Face, size: number, tracking = 0) {
  const metrics = SOCIAL_FONT_METRICS[face];
  const widths = metrics.widths as Record<string, number>;
  let em = 0, count = 0;
  for (const char of text) { em += widths[char] ?? metrics.fallback; count++; }
  return em * size + tracking * size * Math.max(0, count - 1);
}

function wrap(text: string, face: Face, size: number, width: number, tracking = 0): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    let current = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const next = current ? `${current} ${word}` : word;
      if (measure(next, face, size, tracking) <= width) { current = next; continue; }
      if (current) lines.push(current);
      current = "";
      for (const char of word) {
        if (current && measure(current + char, face, size, tracking) > width) { lines.push(current); current = ""; }
        current += char;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

type Fitted = { lines: string[]; size: number; height: number; lh: number };
/** Largest size between max and min whose wrapped lines fit; past min, lines are cut with an ellipsis. */
function fit(text: string, face: Face, max: number, min: number, width: number, height: number, lh: number, tracking = 0, maxLines = 99): Fitted {
  let size = max;
  let lines = wrap(text, face, size, width, tracking);
  while (size > min && (lines.length > maxLines || lines.length * size * lh > height)) { size -= 2; lines = wrap(text, face, size, width, tracking); }
  const keep = Math.max(1, Math.min(maxLines, Math.floor(height / (size * lh))));
  if (lines.length > keep) lines = [...lines.slice(0, keep - 1), `${lines[keep - 1].replace(/\s*\S*$/, "")}…`];
  return { lines, size, lh, height: lines.length * size * lh };
}

const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!);

/** Draws fitted lines with the first line's cap height starting at `top`. */
function textAt(block: Fitted, x: number, top: number, face: Face, fill: string, { tracking = 0, anchor = "start" }: { tracking?: number; anchor?: "start" | "end" | "middle" } = {}) {
  const { family, weight } = FACE_RULES[face];
  const baseline = top + block.size * 0.76;
  return `<text x="${x.toFixed(1)}" y="${baseline.toFixed(1)}" fill="${fill}" font-family="${STACK[family]}" font-weight="${weight}" font-size="${block.size}"${tracking ? ` letter-spacing="${(tracking * block.size).toFixed(2)}"` : ""}${anchor !== "start" ? ` text-anchor="${anchor}"` : ""}>${block.lines.map((text, i) => `<tspan x="${x.toFixed(1)}" dy="${i ? (block.size * block.lh).toFixed(1) : 0}">${escape(text)}</tspan>`).join("")}</text>`;
}
const single = (text: string, size: number): Fitted => ({ lines: [text], size, lh: 1, height: size });

// Neither face's packaged Latin subset has U+2192, so arrows are drawn.
function arrow(x: number, mid: number, size: number, stroke: string) {
  const length = size * 0.78, head = size * 0.26, weight = Math.max(2, size * 0.085);
  return `<path d="M${x} ${mid}H${x + length}M${x + length - head} ${mid - head}L${x + length} ${mid}L${x + length - head} ${mid + head}" fill="none" stroke="${stroke}" stroke-width="${weight}" stroke-linecap="square"/>`;
}
const stripArrow = (text: string) => text.replace(/\s*→\s*$/, "");

// ── Surfaces and layout ──────────────────────────────────────────────────────

// Surfaces stay cool and the accent stays the only warm hue (CLAUDE.md). On
// paper the amber is darkened for text (≈4.9:1); the mark keeps the brand
// amber because it's a shape, not text.
const PALETTES = {
  dark: { bg: "#05080d", ink: "#f1ece6", muted: "#aebcca", accentText: "#ff6a1f", mark: "#ff6a1f", onMark: "#05080d", edge: "#293848", panel: "#0b121b", panelText: "#aebcca" },
  paper: { bg: "#f1ece6", ink: "#101820", muted: "#455462", accentText: "#c44205", mark: "#ff6a1f", onMark: "#101820", edge: "#c6cdd2", panel: "#ffffff", panelText: "#455462" },
  amber: { bg: "#ff6a1f", ink: "#101820", muted: "#2b2a2c", accentText: "#101820", mark: "#101820", onMark: "#ff6a1f", edge: "#c44b12", panel: "#101820", panelText: "#aebcca" },
} as const;
type Palette = (typeof PALETTES)[ArtSurface];
// Markers sit on a screenshot, whatever the surface, so they keep one look.
const CALLOUT = { line: "#ff6a1f", tag: "#05080d", dim: "#05080d" };

type Box = { x: number; y: number; w: number; h: number };
type Layout = { w: number; h: number; pad: number; wide: boolean; tall: boolean; square: boolean; top: number; bottom: number; content: Box };

function layout(format: ArtFormat): Layout {
  const { width: w, height: h } = ART_FORMATS[format];
  const wide = format === "landscape", tall = format === "story", square = format === "square";
  const pad = wide ? 56 : 80;
  // Story keeps the platform's own controls and link sticker clear.
  const top = tall ? 230 : wide ? 44 : 72, bottom = tall ? h - 300 : wide ? h - 44 : h - 72;
  const contentTop = top + (wide ? 70 : 120), contentBottom = bottom - (wide ? 46 : 78);
  return { w, h, pad, wide, tall, square, top, bottom, content: { x: pad, y: contentTop, w: w - 2 * pad, h: contentBottom - contentTop } };
}
const columns = (box: Box, split = 0.5, gap = 40): [Box, Box] => [{ ...box, w: box.w * split - gap / 2 }, { ...box, x: box.x + box.w * split + gap / 2, w: box.w * (1 - split) - gap / 2 }];

function chrome(slide: ArtSlide, L: Layout, p: Palette, index: number, total: number) {
  const cell = L.wide ? 3 : 4, size = L.wide ? 15 : 21;
  const markH = LOGO_BOUNDS.height * cell, markW = LOGO_BOUNDS.width * cell;
  const labelTop = L.top + (markH - size * 0.76) / 2;
  let svg = `<g transform="translate(${L.pad} ${L.top}) scale(${cell})"><path d="${LOGO_PATH}" fill="${p.mark}"/></g>`;
  svg += textAt(single("BLESSED_MOON", size), L.pad + markW + 16, labelTop, "mono500", p.muted, { tracking: 0.08 });
  if (total > 1) svg += textAt(single(`${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`, size), L.w - L.pad, labelTop, "mono500", p.muted, { tracking: 0.08, anchor: "end" });
  const footTop = L.bottom - size * 0.76;
  if (slide.footer) svg += textAt(fit(slide.footer, "mono500", size, size * 0.6, (L.w - 2 * L.pad) * 0.7, size * 1.2, 1.2, 0.04, 1), L.pad, footTop, "mono500", p.muted, { tracking: 0.04 });
  if (index === 0 && total > 1) {
    const color = p.accentText, arrowW = size * 0.78;
    svg += textAt(single("SWIPE", size), L.w - L.pad - arrowW - 12, footTop, "mono700", color, { tracking: 0.12, anchor: "end" });
    svg += arrow(L.w - L.pad - arrowW, footTop + size * 0.38, size, color);
  }
  return svg;
}

/** The eyebrow: an amber dash and an uppercase mono label, at `box.y`. */
function kickerAt(text: string, box: Box, p: Palette, size: number) {
  const dash = Math.round(size * 2);
  return `<rect x="${box.x}" y="${(box.y + size * 0.27).toFixed(1)}" width="${dash}" height="${Math.max(3, Math.round(size * 0.22))}" fill="${p.mark}"/>`
    + textAt(fit(text.toUpperCase(), "mono500", size, size, box.w - dash - 16, size * 1.3, 1.2, 0.12, 1), box.x + dash + 16, box.y, "mono500", p.ink, { tracking: 0.12 });
}

/** Kicker, title and accent stacked from `box.y`; returns the y below them. */
function heading(slide: ArtSlide, box: Box, p: Palette, o: { max: number; min: number; maxLines: number; share: number; kicker?: boolean }) {
  let svg = "", y = box.y;
  if (o.kicker !== false && slide.kicker) {
    const size = Math.max(14, Math.min(24, Math.round(o.max * 0.24)));
    svg += kickerAt(slide.kicker, box, p, size);
    y += size + Math.round(o.max * 0.42);
  }
  const room = box.h * o.share - (y - box.y);
  const title = fit(slide.title, "sans700", o.max, o.min, box.w, room, 1.02, -0.03, o.maxLines);
  svg += textAt(title, box.x, y, "sans700", p.ink, { tracking: -0.03 });
  y += title.height;
  if (slide.accent) {
    const accent = fit(slide.accent, "sans700", title.size, Math.min(title.size, o.min), box.w, Math.max(title.size, box.y + box.h * Math.min(1, o.share + 0.2) - y), 1.02, -0.03, 3);
    svg += textAt(accent, box.x, y, "sans700", p.accentText, { tracking: -0.03 });
    y += accent.height;
  }
  return { svg, y };
}

function paragraph(text: string, box: Box, fill: string, max: number, min: number, face: Face = "sans400", lh = 1.32) {
  if (!text.trim() || box.h < min * lh) return { svg: "", height: 0 };
  const block = fit(text, face, max, min, box.w, box.h, lh);
  return { svg: textAt(block, box.x, box.y, face, fill), height: block.height };
}

// ── Signature devices ────────────────────────────────────────────────────────

/** The logo's crescent at display size, rising out of the bottom edge. Only the
 * bottom is cropped: cropping the side cuts off the horns and it stops being a crescent. */
const crescentCell = (L: Layout) => L.wide ? 34 : L.tall ? 70 : L.square ? 46 : 56;
function crescent(L: Layout, p: Palette) {
  const cell = crescentCell(L);
  const x = L.w - L.pad - LOGO_BOUNDS.width * cell, y = L.h - LOGO_BOUNDS.height * cell * 0.8;
  return `<g transform="translate(${x} ${y}) scale(${cell})"><path d="${LOGO_PATH}" fill="${p.mark}"/></g>`;
}
/** Where the art begins, so a headline can stop above it. */
const artTop = (slide: ArtSlide, L: Layout) => slide.art === "crescent" ? L.h - LOGO_BOUNDS.height * crescentCell(L) * 0.8 : slide.art === "moon" ? L.h - moonDiameter(L) * 0.9 : L.h;
/** Width the art takes from the right of the content box. */
const artWidth = (slide: ArtSlide, L: Layout) => slide.art === "crescent" ? LOGO_BOUNDS.width * crescentCell(L) + 48 : slide.art === "moon" ? moonDiameter(L) * 0.9 + 24 : 0;

const moonDiameter = (L: Layout) => L.wide ? 400 : L.tall ? 760 : L.square ? 500 : 620;
/** The site's own moon: a capture of the AsciiObject engine (`pnpm social:moon`), not an imitation of it. */
function moon(L: Layout, sources: ArtSources) {
  const d = moonDiameter(L);
  return `<image href="${escape(sources.moon ?? MOON_FILE)}" x="${(L.w - d * 0.9).toFixed(1)}" y="${(L.h - d * 0.9).toFixed(1)}" width="${d}" height="${d}"/>`;
}
const art = (slide: ArtSlide, L: Layout, p: Palette, sources: ArtSources) => slide.art === "crescent" ? crescent(L, p) : slide.art === "moon" ? moon(L, sources) : "";

/** Regions in screen pixels. A legacy point becomes a small square around it. */
function regions(marks: ArtRegion[], view: Box) {
  return marks.slice(0, MAX_MARKS).map((mark) => {
    const [x, y, w, h] = mark.length === 4 ? mark : [mark[0] - 4.5, mark[1] - (4.5 * view.w) / view.h, 9, (9 * view.w) / view.h];
    const left = view.x + (Math.max(0, x) / 100) * view.w, top = view.y + (Math.max(0, y) / 100) * view.h;
    return { x: left, y: top, w: Math.min(view.x + view.w - left, (w / 100) * view.w), h: Math.min(view.y + view.h - top, (h / 100) * view.h) };
  });
}

/** A spotlight: the screen dims except inside each region, which gets a hairline
 * amber outline and a numbered tab, like the window's own title-bar label. */
function callouts(marks: ArtRegion[], view: Box, L: Layout) {
  const boxes = regions(marks, view);
  if (!boxes.length) return "";
  const holes = boxes.map((b) => `M${b.x.toFixed(1)} ${b.y.toFixed(1)}h${b.w.toFixed(1)}v${b.h.toFixed(1)}h${(-b.w).toFixed(1)}Z`).join("");
  let svg = `<path d="M${view.x} ${view.y}h${view.w}v${view.h}h${-view.w}Z${holes}" fill="${CALLOUT.dim}" fill-opacity="0.58" fill-rule="evenodd"/>`;
  const size = L.wide ? 12 : 17, tabH = size * 1.7, stroke = L.wide ? 1.5 : 2;
  boxes.forEach((b, i) => {
    const label = String(i + 1).padStart(2, "0");
    const tabW = measure(label, "mono700", size, 0.06) + size * 1.1;
    const tabY = b.y - tabH >= view.y ? b.y - tabH : b.y;
    svg += `<rect x="${b.x.toFixed(1)}" y="${b.y.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" fill="none" stroke="${CALLOUT.line}" stroke-width="${stroke}"/>`;
    svg += `<rect x="${(b.x - stroke / 2).toFixed(1)}" y="${tabY.toFixed(1)}" width="${tabW.toFixed(1)}" height="${tabH.toFixed(1)}" fill="${CALLOUT.tag}" stroke="${CALLOUT.line}" stroke-width="${stroke}"/>`;
    svg += textAt(single(label, size), b.x + size * 0.55, tabY + (tabH - size * 0.76) / 2, "mono700", CALLOUT.line, { tracking: 0.06 });
  });
  return svg;
}

/** The window height that shows a 1456×840 desktop screenshot whole at this width. */
const windowHeightFor = (width: number, L: Layout) => (L.wide ? 34 : 50) + (width - 2) * (840 / 1456) + 2;

/** The site's terminal window: a hairline frame, a title bar with a label and its trailing rule. */
function windowFrame(slide: ArtSlide, box: Box, p: Palette, L: Layout, marks = false) {
  const bar = L.wide ? 34 : 50, size = L.wide ? 14 : 19;
  const label = slide.label || "~/work";
  const labelW = measure(label, "mono500", size, 0.04);
  let svg = `<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="${p.panel}" stroke="${p.edge}" stroke-width="1.5"/>`;
  svg += textAt(single(label, size), box.x + 18, box.y + (bar - size * 0.76) / 2, "mono500", p.panelText, { tracking: 0.04 });
  svg += `<path d="M${box.x + 18 + labelW + 14} ${box.y + bar / 2}H${box.x + box.w - 18}" stroke="${p.edge}"/><path d="M${box.x} ${box.y + bar}H${box.x + box.w}" stroke="${p.edge}"/>`;
  const view: Box = { x: box.x + 1, y: box.y + bar + 1, w: box.w - 2, h: box.h - bar - 2 };
  if (slide.image && (rasterData.test(slide.image) || approvedArtImage(slide.image))) {
    svg += `<svg x="${view.x}" y="${view.y}" width="${view.w}" height="${view.h}" overflow="hidden"><image href="${escape(slide.image)}" width="100%" height="100%" preserveAspectRatio="xMidYMin slice"/></svg>`;
  } else {
    svg += paragraph("Add an approved project screenshot", { x: view.x + 24, y: view.y + 24, w: view.w - 48, h: view.h - 48 }, p.panelText, L.wide ? 20 : 28, 14).svg;
  }
  if (marks) svg += callouts(slide.marks ?? [], view, L);
  return svg;
}

// ── Templates ────────────────────────────────────────────────────────────────

type Drawn = { svg: string };

function cover(slide: ArtSlide, L: Layout, p: Palette, sources: ArtSources): Drawn {
  const hasArt = (slide.art ?? "none") !== "none";
  if (L.wide) {
    const [text] = columns(L.content, hasArt ? 0.62 : 1);
    const head = heading(slide, text, p, { max: 76, min: 40, maxLines: 4, share: 0.8 });
    const meta = paragraph(slide.body, { ...text, y: head.y + 22, h: text.y + text.h - head.y - 22 }, p.muted, 24, 16);
    return { svg: art(slide, L, p, sources) + head.svg + meta.svg };
  }
  const top = L.content.y + (L.square ? 10 : 40);
  const box = { ...L.content, y: top, h: Math.min(L.content.y + L.content.h, artTop(slide, L) - 48) - top };
  const head = heading(slide, box, p, { max: L.tall ? 140 : L.square ? 108 : 128, min: 56, maxLines: 6, share: hasArt ? 1 : 0.9 });
  // Beside the art by default. A Story has room above it: full width when the whole paragraph ends there.
  const clear = L.tall && slide.body.trim() && head.y + 36 + fit(slide.body, "sans400", 34, 34, box.w, 1e4, 1.32).height <= artTop(slide, L) - 24;
  const meta = paragraph(slide.body, { x: box.x, y: head.y + 36, w: box.w - (clear ? 0 : artWidth(slide, L)), h: L.content.y + L.content.h - head.y - 36 }, p.muted, 34, 24);
  return { svg: art(slide, L, p, sources) + head.svg + meta.svg };
}

function point(slide: ArtSlide, L: Layout, p: Palette): Drawn {
  const [left, right] = L.wide ? columns(L.content, 0.5, 56) : [L.content, L.content];
  let svg = "", y = left.y;
  if (slide.step) {
    if (slide.kicker) { const size = L.wide ? 15 : 22; svg += kickerAt(slide.kicker, { ...left, y }, p, size); y += size + (L.wide ? 20 : 34); }
    const numeral = single(slide.step, L.wide ? 132 : L.square ? 190 : 240);
    svg += textAt(numeral, left.x - numeral.size * 0.04, y, "sans700", p.accentText, { tracking: -0.04 });
    y += numeral.size * 0.8 + (L.wide ? 24 : 44);
  }
  const head = heading(slide, { ...left, y, h: left.y + left.h - y }, p, { max: L.wide ? 50 : 84, min: 36, maxLines: 4, share: L.wide ? 1 : 0.62, kicker: !slide.step });
  svg += head.svg;
  if (L.wide) return { svg: svg + paragraph(slide.body, right, p.muted, 28, 18).svg };
  y = head.y + 34;
  svg += `<rect x="${left.x}" y="${y}" width="72" height="6" fill="${p.mark}"/>`;
  y += 48;
  return { svg: svg + paragraph(slide.body, { ...left, y, h: left.y + left.h - y }, p.muted, 38, 24).svg };
}

const parseRow = (row: string) => {
  const parts = row.includes("|") ? row.split("|") : row.includes(" · ") ? [row.slice(0, row.indexOf(" · ")), row.slice(row.indexOf(" · ") + 3)] : [row];
  const [label = "", detail = "", value = ""] = parts.map((part) => part.trim());
  return { label, detail, value };
};
const bodyRows = (body: string) => body.split("\n").map((row) => row.trim()).filter(Boolean).slice(0, 7).map(parseRow);

/** Hairline-separated rows: a bold label, an optional detail, an optional amber value. */
function rowList(rows: ReturnType<typeof bodyRows>, box: Box, p: Palette, start: number, badges = false) {
  if (!rows.length) return "";
  let scale = start;
  const measureRows = (s: number) => rows.map((row) => {
    const valueW = row.value ? measure(row.value, "sans700", 32 * s) + 24 : 0;
    const indent = badges ? 66 * s : 0;
    const label = fit(row.label, "sans700", 38 * s, 38 * s, box.w - valueW - indent, 1e4, 1.12, -0.01, 3);
    const detail = row.detail ? fit(row.detail, "sans400", 28 * s, 28 * s, box.w - valueW - indent, 1e4, 1.3, 0, 3) : null;
    return { row, indent, label, detail, height: 2 * 24 * s + label.height + (detail ? 8 * s + detail.height : 0) };
  });
  let measured = measureRows(scale);
  while (scale > 0.4 && measured.reduce((sum, r) => sum + r.height, 0) > box.h) { scale -= 0.04; measured = measureRows(scale); }
  let svg = "", y = box.y;
  measured.forEach((r, i) => {
    svg += `<path d="M${box.x} ${y.toFixed(1)}H${box.x + box.w}" stroke="${p.edge}" stroke-width="1.5"/>`;
    const top = y + 24 * scale;
    if (badges) svg += textAt(single(String(i + 1).padStart(2, "0"), 30 * scale), box.x, top + 4 * scale, "mono700", p.accentText, { tracking: 0.04 });
    svg += textAt(r.label, box.x + r.indent, top, "sans700", p.ink, { tracking: -0.01 });
    if (r.detail) svg += textAt(r.detail, box.x + r.indent, top + r.label.height + 8 * scale, "sans400", p.muted);
    if (r.row.value) svg += textAt(single(r.row.value, 32 * scale), box.x + box.w, top, "sans700", p.accentText, { anchor: "end" });
    y += r.height;
  });
  return svg + `<path d="M${box.x} ${y.toFixed(1)}H${box.x + box.w}" stroke="${p.edge}" stroke-width="1.5"/>`;
}

function rows(slide: ArtSlide, L: Layout, p: Palette): Drawn {
  if (L.wide) {
    const [left, right] = columns(L.content, 0.42, 48);
    return { svg: heading(slide, left, p, { max: 52, min: 30, maxLines: 5, share: 1 }).svg + rowList(bodyRows(slide.body), right, p, 0.62, slide.numbered) };
  }
  const head = heading(slide, L.content, p, { max: L.square ? 70 : 78, min: 44, maxLines: 3, share: 0.34 });
  const y = head.y + 48;
  return { svg: head.svg + rowList(bodyRows(slide.body), { ...L.content, y, h: L.content.y + L.content.h - y }, p, L.square ? 1 : 1.18, slide.numbered) };
}

function compare(slide: ArtSlide, L: Layout, p: Palette): Drawn {
  const parts = bodyRows(slide.body);
  const halves = parts.length > 1 ? parts.slice(0, 2) : [parts[0] ?? { label: "", detail: slide.body, value: "" }, { label: "", detail: "Add the alternative and its trade-off.", value: "" }];
  const [headBox, area] = L.wide ? columns(L.content, 0.38, 48) : [L.content, L.content];
  const head = heading(slide, headBox, p, { max: L.wide ? 48 : L.square ? 66 : 74, min: 30, maxLines: 4, share: L.wide ? 1 : 0.32 });
  const top = L.wide ? area.y : head.y + 64;
  const gap = L.wide ? 28 : 56, half = (area.y + area.h - top - gap) / 2;
  const size = L.wide ? 15 : 22;
  let svg = head.svg, y = top;
  halves.forEach((part, i) => {
    if (i) { svg += `<path d="M${area.x} ${(y + gap / 2).toFixed(1)}H${area.x + area.w}" stroke="${p.edge}" stroke-width="1.5"/>`; y += gap; }
    const label = part.detail ? part.label : "";
    svg += `<rect x="${area.x}" y="${(y + size * 0.27).toFixed(1)}" width="${size * 1.6}" height="${Math.max(3, size * 0.22)}" fill="${i ? p.mark : p.edge}"/>`;
    svg += textAt(single((label || (i ? "Instead" : "Usually")).toUpperCase(), size), area.x + size * 1.6 + 14, y, "mono500", i ? p.accentText : p.muted, { tracking: 0.12 });
    const copy = fit(part.detail || part.label, "sans500", L.wide ? 28 : 54, L.wide ? 16 : 28, area.w, half - size * 2.2, 1.16, -0.015);
    svg += textAt(copy, area.x, y + size * 2.3, "sans500", i ? p.ink : p.muted, { tracking: -0.015 });
    y += size * 2.3 + copy.height;
  });
  return { svg };
}

function windowSlide(slide: ArtSlide, L: Layout, p: Palette, first: boolean): Drawn {
  if (L.wide) {
    const [left, right] = columns(L.content, 0.4, 44);
    const head = heading(slide, left, p, { max: 50, min: 28, maxLines: 5, share: 0.72 });
    const body = paragraph(slide.body, { ...left, y: head.y + 22, h: left.y + left.h - head.y - 22 }, p.muted, 22, 15);
    return { svg: head.svg + body.svg + windowFrame(slide, { ...right, y: right.y - 10, h: right.h + 10 }, p, L) };
  }
  const head = heading(slide, L.content, p, { max: first ? (L.square ? 84 : 100) : L.square ? 64 : 74, min: 40, maxLines: 3, share: 0.34 });
  const bodyText = slide.body.trim() ? fit(slide.body, "sans400", 32, 22, L.content.w, L.square ? 90 : 140, 1.32) : null;
  const room = L.content.y + L.content.h - (bodyText ? bodyText.height + 34 : 0) - head.y - 40;
  // Never taller than a desktop screenshot: a taller window crops its sides off.
  const frame = { x: L.content.x, y: head.y + 40, w: L.content.w, h: Math.min(room, windowHeightFor(L.content.w, L)) };
  return { svg: head.svg + windowFrame(slide, frame, p, L) + (bodyText ? textAt(bodyText, L.content.x, frame.y + frame.h + 34, "sans400", p.muted) : "") };
}

function annotate(slide: ArtSlide, L: Layout, p: Palette): Drawn {
  const legend = bodyRows(slide.body);
  if (L.wide) {
    const [left, right] = columns(L.content, 0.56, 40);
    const head = heading(slide, right, p, { max: 40, min: 24, maxLines: 3, share: 0.4 });
    return { svg: windowFrame(slide, { ...left, y: left.y - 10, h: left.h + 10 }, p, L, true) + head.svg + rowList(legend, { ...right, y: head.y + 20, h: right.y + right.h - head.y - 20 }, p, 0.6, true) };
  }
  const head = heading(slide, L.content, p, { max: L.square ? 56 : 64, min: 36, maxLines: 2, share: 0.22 });
  const frame = { x: L.content.x, y: head.y + 36, w: L.content.w, h: Math.min(L.content.h * (L.square ? 0.5 : L.tall ? 0.46 : 0.58), windowHeightFor(L.content.w, L)) };
  const y = frame.y + frame.h + 28;
  return { svg: head.svg + windowFrame(slide, frame, p, L, true) + rowList(legend, { ...L.content, y, h: L.content.y + L.content.h - y }, p, 0.8, true) };
}

function action(slide: ArtSlide, L: Layout, p: Palette, sources: ArtSources): Drawn {
  const hasArt = (slide.art ?? "none") !== "none";
  const [box] = L.wide ? columns(L.content, hasArt ? 0.62 : 1) : [L.content];
  const headTop = box.y + (L.wide ? 0 : 40);
  const headH = L.wide ? box.h * 0.6 : Math.max(box.h * 0.3, Math.min(box.h * 0.56, artTop(slide, L) - 260 - headTop));
  const head = heading(slide, { ...box, y: headTop, h: headH }, p, { max: L.wide ? 60 : L.square ? 92 : 110, min: 40, maxLines: 4, share: 1 });
  let svg = art(slide, L, p, sources) + head.svg;
  let y = head.y + (L.wide ? 28 : 56);
  const room = L.wide ? box.w : box.w - artWidth(slide, L);
  if (slide.action) {
    const size = L.wide ? 24 : 34, padX = L.wide ? 20 : 30, height = L.wide ? 56 : 86;
    const label = fit(stripArrow(slide.action), "sans700", size, size * 0.7, room - padX * 2 - size - 16, size * 1.2, 1.1, -0.01, 1);
    const width = measure(label.lines[0], "sans700", label.size, -0.01) + padX * 2 + label.size * 0.78 + 16;
    svg += `<rect x="${box.x}" y="${y}" width="${width.toFixed(1)}" height="${height}" fill="${p.mark}"/>`;
    svg += textAt(label, box.x + padX, y + (height - label.size * 0.76) / 2, "sans700", p.onMark, { tracking: -0.01 });
    svg += arrow(box.x + width - padX - label.size * 0.78, y + height / 2, label.size, p.onMark);
    y += height + (L.wide ? 22 : 36);
  }
  svg += paragraph(slide.body, { x: box.x, y, w: room, h: box.y + box.h - y }, p.muted, L.wide ? 22 : 32, 16).svg;
  return { svg };
}

/** One art source for the on-page SVG and every locally rasterised export. */
export function renderSlideSvg(slide: ArtSlide, format: ArtFormat, index = 0, total = 1, sources: ArtSources = {}): string {
  const L = layout(format);
  const p = PALETTES[slide.surface ?? "dark"];
  const template = LEGACY_TEMPLATES[slide.template] ?? slide.template;
  const drawn = template === "cover" ? cover(slide, L, p, sources)
    : template === "rows" ? rows(slide, L, p)
    : template === "compare" ? compare(slide, L, p)
    : template === "window" ? windowSlide(slide, L, p, index === 0)
    : template === "annotate" ? annotate(slide, L, p)
    : template === "action" ? action(slide, L, p, sources)
    : point(slide, L, p);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${L.w}" height="${L.h}" viewBox="0 0 ${L.w} ${L.h}" role="img" aria-label="${escape(slideAlt(slide, index, total))}">${fontStyle(sources)}<rect width="${L.w}" height="${L.h}" fill="${p.bg}"/>${drawn.svg}${chrome(slide, L, p, index, total)}</svg>`;
}
