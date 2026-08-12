import Image from "next/image";

import type { ProjectImage } from "@/lib/studio-data";

export function ProjectCover({
  image,
  title,
}: {
  image: ProjectImage;
  title: string;
}) {
  // Panel tokens, and no amber frame. An amber border around a static image
  // put the "interactive" reading on something that isn't, and inside a
  // `/work` layer it competed directly with the traveling token, which is the
  // one thing on screen allowed to be amber at size (morph-tokens.ts). No
  // `backdrop-blur` either: this sits inside a window that already blurs, and
  // a nested backdrop pass costs a second full-surface filter for no gain.
  return (
    <figure className="overflow-hidden border border-panel-edge bg-panel font-mono">
      <figcaption className="flex items-center justify-between gap-4 border-b border-border/60 px-3 py-2 text-[8px] tracking-[0.12em] text-muted-foreground uppercase">
        <span>{title.toLowerCase().replaceAll(" ", "_")}.capture</span>
        <span className="text-primary">● verified</span>
      </figcaption>
      <div className="relative aspect-[16/10] overflow-hidden bg-muted/20">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover object-top transition-transform duration-700 hover:scale-[1.015]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]"
        />
      </div>
    </figure>
  );
}

export function ProjectGallery({
  images,
  title,
}: {
  images: readonly ProjectImage[];
  title: string;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {images.map((image, index) => (
        <figure
          key={image.src}
          className="overflow-hidden border border-panel-edge bg-panel font-mono backdrop-blur-md"
        >
          <figcaption className="flex items-center justify-between gap-4 border-b border-border/60 px-3 py-2 text-[8px] tracking-[0.1em] uppercase">
            <span className="truncate text-muted-foreground">{image.alt}</span>
            <span className="shrink-0 text-primary">
              {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
          </figcaption>
          <div
            role="region"
            tabIndex={0}
            aria-label={`${title} screenshot: ${image.alt}. Scroll inside the frame to inspect the full page.`}
            className="max-h-[42rem] overflow-y-auto bg-[#f3f2ef] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-auto w-full"
            />
          </div>
        </figure>
      ))}
    </div>
  );
}
