"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import "./line-sidebar.css";

/**
 * Adapted from React Bits' LineSidebar (reactbits.dev, pasted component
 * source — the registry JSON endpoint and shadcn CLI both can't reach
 * reactbits.dev from this environment, same issue as particle-text.tsx and
 * border-glow.tsx). Proximity/rAF-lerp logic is unchanged from upstream;
 * changed: TypeScript types, brand-token color defaults (`var(--primary)`
 * etc. instead of hardcoded purple, so it follows theme changes rather than
 * copying a snapshot of it), and an added `activeIndex` controlled-mode
 * prop — upstream only ever sets its active item from a click
 * (`defaultActive` + internal state), with no way for a parent to drive it
 * from something else. `SectionSidebar` (section-sidebar.tsx) drives it
 * from scroll position, which is the reason for this fork.
 */

const FALLOFF_CURVES: Record<string, (p: number) => number> = {
  linear: (p) => p,
  smooth: (p) => p * p * (3 - 2 * p),
  sharp: (p) => p * p * p,
};

export interface LineSidebarProps {
  items: string[];
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: "linear" | "smooth" | "sharp";
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  /** Uncontrolled: index selected on mount, then only changes on click. */
  defaultActive?: number | null;
  /** Controlled: when set, this always wins over click/defaultActive — the
   * parent owns which item is active (e.g. driven by scroll position). */
  activeIndex?: number | null;
  onItemClick?: (index: number, label: string) => void;
  className?: string;
  "aria-label"?: string;
}

export function LineSidebar({
  items,
  accentColor = "var(--primary)",
  textColor = "var(--muted-foreground)",
  markerColor = "var(--border)",
  showIndex = true,
  showMarker = true,
  proximityRadius = 100,
  maxShift = 30,
  falloff = "smooth",
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.1,
  smoothing = 100,
  defaultActive = null,
  activeIndex,
  onItemClick,
  className = "",
  "aria-label": ariaLabel,
}: LineSidebarProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const [internalActive, setInternalActive] = useState<number | null>(defaultActive);
  const active = activeIndex ?? internalActive;
  const activeRef = useRef(active);
  const smoothingRef = useRef(smoothing);
  // Holds the latest runFrame so it can call requestAnimationFrame(itself)
  // without referencing the `runFrame` const inside its own initializer
  // (which isn't assigned yet at that point) — the ref is always valid to
  // read regardless of declaration order.
  const runFrameRef = useRef<(now: number) => void>(() => {});

  useEffect(() => {
    activeRef.current = active;
    smoothingRef.current = smoothing;
  }, [active, smoothing]);

  // Single rAF loop that eases every item's --effect toward its target using
  // frame-rate independent exponential smoothing, so color, shift and scale
  // all move together without staggering CSS transitions.
  const runFrame = useCallback((now: number) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = Math.max(smoothingRef.current, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    let moving = false;
    const els = itemRefs.current;
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      if (!el) continue;
      const target = Math.max(targetsRef.current[i] || 0, activeRef.current === i ? 1 : 0);
      const cur = currentRef.current[i] || 0;
      const next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      currentRef.current[i] = value;
      el.style.setProperty("--effect", value.toFixed(4));
      if (!settled) moving = true;
    }

    rafRef.current = moving ? requestAnimationFrame((t) => runFrameRef.current(t)) : null;
  }, []);

  useEffect(() => {
    runFrameRef.current = runFrame;
  }, [runFrame]);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame((t) => runFrameRef.current(t));
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLUListElement>) => {
      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const pointerY = e.clientY - rect.top;
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear;
      const els = itemRefs.current;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        const center = el.offsetTop + el.offsetHeight / 2;
        const distance = Math.abs(pointerY - center);
        targetsRef.current[i] = ease(Math.max(0, 1 - distance / proximityRadius));
      }
      startLoop();
    },
    [falloff, proximityRadius, startLoop],
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  }, [startLoop]);

  const handleClick = useCallback(
    (index: number, label: string) => {
      setInternalActive(index);
      onItemClick?.(index, label);
    },
    [onItemClick],
  );

  useEffect(() => {
    startLoop();
  }, [active, startLoop]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    },
    [],
  );

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "line-sidebar",
        showMarker && "line-sidebar--markers",
        scaleTick && "line-sidebar--scale-tick",
        className,
      )}
      style={
        {
          "--accent-color": accentColor,
          "--text-color": textColor,
          "--marker-color": markerColor,
          "--marker-length": `${markerLength}px`,
          "--marker-gap": `${markerGap}px`,
          "--tick-scale": tickScale,
          "--max-shift": `${maxShift}px`,
          "--item-gap": `${itemGap}px`,
          "--font-size": `${fontSize}rem`,
          "--smoothing": `${smoothing}ms`,
        } as React.CSSProperties
      }
    >
      <ul
        ref={listRef}
        className="line-sidebar__list"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {items.map((label, index) => (
          <li
            key={`${label}-${index}`}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="line-sidebar__item"
          >
            {showMarker && <span className="line-sidebar__marker" aria-hidden="true" />}
            {/* A real <button>, not a <li onClick> — the upstream version
                wasn't keyboard-operable (no focus, no Enter/Space
                activation). Using a native button gets both for free
                instead of hand-rolling role/tabIndex/onKeyDown. */}
            <button
              type="button"
              className="line-sidebar__label"
              aria-current={active === index ? "true" : undefined}
              onClick={() => handleClick(index, label)}
            >
              {showIndex && (
                <span className="line-sidebar__index">{String(index + 1).padStart(2, "0")}</span>
              )}
              <span className="line-sidebar__text">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default LineSidebar;
