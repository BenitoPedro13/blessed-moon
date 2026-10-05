import { ART_FORMATS, approvedArtImage, readArtPost, renderSlideSvg, slideAlt, type ArtFormat, type ArtPost, type ArtSlide } from "@/lib/social-art";
import { jpegsToPdf } from "@/lib/social-pdf";

export function saveArtifact(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = filename; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
const bytes = async (blob: Blob) => new Uint8Array(await blob.arrayBuffer());
const filename = (post: ArtPost) => `blessed-moon-${post.channel}-${post.id.replace(/[^a-z0-9-]/gi, "-").slice(0, 80) || "draft"}`;

const imageCache = new Map<string, Promise<string>>();
async function portableSlide(slide: ArtSlide): Promise<ArtSlide> {
  if (!approvedArtImage(slide.image)) return slide;
  let pending = imageCache.get(slide.image);
  if (!pending) {
    pending = (async () => {
      const response = await fetch(slide.image, { redirect: "error" });
      if (!response.ok) throw new Error("The project screenshot could not be loaded.");
      const blob = await response.blob();
      if (blob.size > 8_000_000 || !["image/png", "image/jpeg", "image/webp"].includes(blob.type)) throw new Error("The project screenshot has an unsupported size or format.");
      return localScreenshot(new File([blob], "project-screenshot", { type: blob.type }));
    })();
    imageCache.set(slide.image, pending);
    void pending.catch(() => imageCache.delete(slide.image));
  }
  return { ...slide, image: await pending };
}

export async function rasterizeSlide(slide: ArtSlide, format: ArtFormat, index: number, total: number, type = "image/png"): Promise<Blob> {
  slide = await portableSlide(slide);
  const size = ART_FORMATS[format];
  const url = URL.createObjectURL(new Blob([renderSlideSvg(slide, format, index, total)], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("The slide could not be rendered. Try removing the screenshot.")); image.src = url; });
    const canvas = document.createElement("canvas"); canvas.width = size.width; canvas.height = size.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Image export is unavailable in this browser.");
    ctx.drawImage(image, 0, 0, size.width, size.height);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Image export failed.")), type, .94));
  } finally { URL.revokeObjectURL(url); }
}

export async function exportPost(post: ArtPost, kind: "png" | "zip" | "pdf" | "json", selected = 0) {
  const base = filename(post);
  // Embed the exact allowlisted project assets so every download, including
  // editable JSON, remains portable without fetching remote images on import.
  post = readArtPost({ ...post, slides: await Promise.all(post.slides.map(portableSlide)) });
  if (kind === "json") { saveArtifact(new Blob([JSON.stringify(post, null, 2)], { type: "application/json" }), `${base}.json`); return; }
  if (kind === "png") { saveArtifact(await rasterizeSlide(post.slides[selected], post.format, selected, post.slides.length), `${base}-${String(selected + 1).padStart(2, "0")}.png`); return; }
  if (kind === "pdf") {
    const pages = [];
    for (const [index, slide] of post.slides.entries()) pages.push({ jpeg: await bytes(await rasterizeSlide(slide, post.format, index, post.slides.length, "image/jpeg")), ...ART_FORMATS[post.format] });
    saveArtifact(new Blob([jpegsToPdf(pages)], { type: "application/pdf" }), `${base}.pdf`); return;
  }
  const { zipSync, strToU8 } = await import("fflate");
  const files: Record<string, Uint8Array> = {};
  for (const [index, slide] of post.slides.entries()) files[`${String(index + 1).padStart(2, "0")}.png`] = await bytes(await rasterizeSlide(slide, post.format, index, post.slides.length));
  files["caption.txt"] = strToU8(post.caption);
  files["alt-text.txt"] = strToU8(post.slides.map((slide, i) => slideAlt(slide, i, post.slides.length)).join("\n\n"));
  files["editable-draft.json"] = strToU8(JSON.stringify(post, null, 2));
  const archive = zipSync(files, { level: 0 });
  saveArtifact(new Blob([archive as Uint8Array<ArrayBuffer>], { type: "application/zip" }), `${base}.zip`);
}

export async function localScreenshot(file: File): Promise<string> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 8_000_000) throw new Error("Choose a PNG, JPEG or WebP up to 8 MB.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("This image could not be opened.")); image.src = url; });
    const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas"); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
    const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Image loading is unavailable.");
    ctx.fillStyle = "#101820"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", .9);
  } finally { URL.revokeObjectURL(url); }
}
