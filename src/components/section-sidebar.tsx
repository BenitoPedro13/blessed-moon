"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

import { LineSidebar } from "@/components/react-bits/line-sidebar";
import { createFrameTracker } from "@/lib/ascii-canvas/scroll-progress";

/**
 * The actual answer to "show current section + let me navigate between
 * them" — the top nav's live label attempted this and made the header's
 * layout unstable instead (see the reasoning removed from site-nav.tsx).
 * A dedicated sidebar has room to be both without fighting anything else
 * for space. Fixed, left-anchored, hidden below `lg` (the nav's own links
 * already collapse below `md`, and this needs even more width to sit
 * beside real content without crowding it).
 *
 * `items`/current index both come from the same [data-frame-label]
 * convention `createFrameTracker` already reads for the (removed) nav
 * label — one source of truth, so the sidebar's list and its active-item
 * highlight can never disagree about what section N is.
 */
export function SectionSidebar() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [items, setItems] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const tracker = createFrameTracker();
    tracker.measure();
    // Reading the [data-frame-label] DOM on mount to seed state is exactly
    // the "synchronize with an external system" case an effect is for —
    // there's no prop/state this could be derived from instead.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(tracker.labels());

    let raf = 0;
    let lastIndex = -1;
    function frame() {
      const current = tracker.read();
      if (current && current.index !== lastIndex) {
        lastIndex = current.index;
        setActiveIndex(current.index);
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function handleResize() {
      tracker.measure();
      setItems(tracker.labels());
    }
    window.addEventListener("resize", handleResize);
    const remeasure = window.setTimeout(handleResize, 500);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(remeasure);
      window.removeEventListener("resize", handleResize);
    };
    // Re-run on route change: a new page has different [data-frame-label]
    // elements under the same persistent LenisProvider/nav tree.
  }, [pathname]);

  if (items.length < 2) return null;

  return (
    <div className="fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <LineSidebar
        items={items}
        activeIndex={activeIndex}
        showIndex
        showMarker
        fontSize={0.72}
        itemGap={14}
        markerLength={28}
        proximityRadius={90}
        maxShift={10}
        className="font-mono uppercase tracking-[0.06em]"
        aria-label="Section navigation"
        onItemClick={(index) => {
          const target = document.querySelectorAll<HTMLElement>("[data-frame-label]")[index];
          if (!target) return;
          if (lenis) lenis.scrollTo(target, { lerp: 0.1 });
          else target.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}
