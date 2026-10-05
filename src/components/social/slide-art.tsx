import { renderSlideSvg, type ArtFormat, type ArtSlide } from "@/lib/social-art";

export function SlideArt({ slide, format, index = 0, total = 1 }: { slide: ArtSlide; format: ArtFormat; index?: number; total?: number }) {
  return <div data-slide-art className="w-full [&>svg]:block [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: renderSlideSvg(slide, format, index, total) }} />;
}
