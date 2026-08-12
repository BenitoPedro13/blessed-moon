"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";

import { CellGrid } from "@/components/cell-grid";
import { ScrollParticles } from "@/components/scroll-particles";
import { SectionHeading } from "@/components/section-heading";
import {
  TerminalPanel,
  TitleRule,
  WINDOW_BODY,
  WINDOW_FRAME,
  WINDOW_TITLEBAR,
} from "@/components/terminal-panel";

/**
 * ONE terminal window, pinned, that resizes from section to section while its
 * views crossfade inside it.
 *
 * Two earlier structures were wrong, each for a reason worth keeping:
 *
 * 1. Five independent `ScrollStage` pins. Two full-viewport `position: sticky`
 *    panels are never simultaneously on screen — A releases the instant B
 *    begins — so nothing could ever travel between them. Tuning A's fade curve
 *    improves the cut but cannot make it a morph.
 * 2. Five windows crossfading in one frame. This fixed the handoff (a token
 *    can fly, because neighbours genuinely overlap) but it still meant five
 *    separate frames dissolving past each other, which is not what the rest of
 *    the page promises. If the page's whole premise is one thing morphing,
 *    then the window is a thing, and it should morph too.
 *
 * So the window is now persistent and singular. Its width and height
 * interpolate continuously with scroll between each section's natural size, so
 * it physically expands and contracts as the views change — one terminal,
 * many views, rather than a stack of terminals. That also happens to cost one
 * backdrop-blur instead of five over a live WebGL canvas.
 *
 * ## Two rules for content inside a layer
 *
 * 1. **A layer animates `opacity` only — never `transform`.** Motion's layout
 *    projection measures real bounding boxes before and after a handoff; an
 *    ancestor whose transform is rewritten every frame makes that measurement
 *    drift and the token lands in the wrong place. Per-element motion goes on
 *    individual children via `morphDrift()` — never on an ancestor of a
 *    `MorphToken`.
 * 2. **`Reveal` does not work in here.** It's `whileInView`-driven and every
 *    layer is permanently inside the viewport, so all N fire once at mount and
 *    never replay. `morphDrift()` is the replacement: scroll-linked, so it
 *    plays in both directions like the rest of this scroll system.
 */

/** Fraction of one layer's scroll allocation spent crossfading into the next —
 * the band where both are partially visible and a token is in flight. */
const OVERLAP = 0.3;

/** Shapes the crossfade so the boundary dips toward the background instead of
 * holding two half-opaque layers on top of each other. A linear ramp puts both
 * neighbours at exactly 0.5 at the crossover, summing to a constant 1.0 —
 * tidy math, and wrong to look at: these are dense text layers, and two 50%
 * text blocks stacked render as interference rather than a transition. At 1.7
 * each side sits at ~0.31 there. Not higher: the token is mid-flight at that
 * exact moment and still has to be legible. */
const CROSSFADE_GAMMA = 1.7;

/** Extra scroll room, in layer-units, held at each end. Without it the first
 * and last layers get half the screen time of the middle ones, so the stage
 * opens by immediately dissolving the section you just arrived at. */
const END_HOLD = 0.5;

/** Where `createScrollTracker` samples the page (its `anchorRatio`). Keyframe
 * markers are offset by this so each crosses the tracker's anchor line exactly
 * when its layer is centered. */
const ANCHOR_DVH = 35;

/** Eases the window's resize between two sections so it settles rather than
 * tracking the scrollbar 1:1 — the same reasoning as the moon's easing. */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

interface MorphState {
  index: number;
  /** Which layer the stage considers "the one on screen". Changes discretely
   * at each boundary — the only value here that costs a React render, which is
   * exactly what a `layoutId` handoff needs, since continuous CSS cannot
   * unmount and remount an element. */
  active: number;
  isActive: boolean;
  /** False in the stacked `prefers-reduced-motion` fallback, where nothing
   * morphs and tokens render as plain text. */
  morphing: boolean;
}

const MorphLayerContext = createContext<MorphState | null>(null);

/** Defaults matter: a section built for this stage should still render
 * correctly on its own (staged on `/system`, say), just without morphing. */
export function useMorphLayer(): MorphState {
  return (
    useContext(MorphLayerContext) ?? {
      index: 0,
      active: 0,
      isActive: true,
      morphing: false,
    }
  );
}

export interface MorphLayerSpec {
  /** Anchor-link target (`#services`), placed on a marker at this layer's own
   * scroll offset rather than on the content — the content lives in a sticky
   * frame, so scrolling it into view would land on the frame, not on the point
   * where the section is actually legible. */
  id?: string;
  /** The window title's identifier, e.g. "02". */
  number: string;
  label: string;
  /** Feeds the ASCII moon's morph. Carried on markers in the tall wrapper for
   * the same reason as `id`: absolutely positioned, every layer reports the
   * same `getBoundingClientRect().top`, which the tracker can neither order
   * nor interpolate between. */
  keyframe: number;
  /** The window's width, in px, while this section is the one on screen. The
   * window interpolates between neighbours, so this is what makes it expand
   * and contract rather than sit at one size for the whole journey. */
  width: number;
  content: React.ReactNode;
}

export function ScrollMorphStage({
  layers,
  heightPerLayer = 1.6,
  particles = true,
  className = "",
}: {
  layers: MorphLayerSpec[];
  heightPerLayer?: number;
  particles?: boolean;
  className?: string;
}) {
  const count = layers.length;
  const span = count - 1 + END_HOLD * 2;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** Each layer's natural content height, kept fresh by a ResizeObserver
   * rather than measured in the rAF loop — reading offsetHeight every frame
   * for every layer would force a layout flush 60 times a second. */
  const heightsRef = useRef<number[]>([]);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  /**
   * Horizontal room for the window, remeasured only on viewport resize — never
   * during the scroll animation. That distinction is the whole point.
   *
   * The frame's width animates between sections. If the content inside were
   * laid out against that animating width, every frame would re-wrap it: line
   * breaks shifting continuously, "still in production." snapping between one
   * line and two, paragraphs growing and shrinking by a line as the window
   * moved. That's exactly what happened on desktop.
   *
   * So content is laid out at a FIXED width per layer and the frame animates
   * around it. The frame is the thing that morphs; the text inside it is
   * already set and simply gets revealed or cropped. It also makes each
   * layer's height independent of the animation, which is what lets the height
   * interpolation below be smooth instead of chasing a moving measurement.
   *
   * Starts wide so the server render and first client render agree; the effect
   * corrects it on mount.
   */
  const [avail, setAvail] = useState(4096);
  const resolvedWidths = layers.map((l) => Math.min(l.width, avail));
  // The rAF loop can't read `resolvedWidths` (it's a new array each render and
  // the loop is set up once), so it reads this mirror instead — written after
  // render rather than during it, which is the rule a ref has to follow.
  const widthsRef = useRef<number[]>(resolvedWidths);
  useEffect(() => {
    widthsRef.current = resolvedWidths;
  });

  useEffect(() => {
    if (reduceMotion) return;
    function measure() {
      // Matches the sticky container's px-4 gutter on both sides.
      setAvail(window.innerWidth - 32);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const observer = new ResizeObserver(() => {
      contentRefs.current.forEach((el, i) => {
        if (el) heightsRef.current[i] = el.offsetHeight;
      });
    });
    contentRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [count, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner || count === 0) return;

    let raf = 0;
    let lastActive = -1;

    function frame() {
      const rect = wrapper!.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const t = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      const progress = Math.min(count - 1, Math.max(0, t * span - END_HOLD));
      inner!.style.setProperty("--morph-progress", progress.toFixed(4));

      // Per-layer values are computed here rather than as CSS calc() off
      // --morph-progress. The CSS version needed a nested
      // max(calc(…), calc(-1 * calc(…))) for an absolute value — correct per
      // spec, and exactly the kind of expression that silently resolves to
      // nothing on one engine. Five style writes a frame is not worth that.
      for (let i = 0; i < count; i++) {
        const layer = layerRefs.current[i];
        const local = progress - i;
        const away = Math.abs(local);
        const ramp = Math.min(1, Math.max(0, (0.5 + OVERLAP / 2 - away) / OVERLAP));
        const opacity = Math.pow(ramp, CROSSFADE_GAMMA);

        if (layer) {
          layer.style.setProperty("--morph-local", local.toFixed(4));
          layer.style.setProperty("--morph-away", away.toFixed(4));
          layer.style.opacity = String(opacity);
          // A fully transparent layer still costs a composite every frame over
          // the live WebGL moon. visibility:hidden takes it out of rendering
          // entirely. Safe for the handoff: both sides of a boundary sit well
          // above this threshold for the whole flight.
          layer.style.visibility = opacity < 0.01 ? "hidden" : "visible";
        }
        const title = titleRefs.current[i];
        if (title) {
          title.style.opacity = String(opacity);
          title.style.visibility = opacity < 0.01 ? "hidden" : "visible";
        }
      }

      // The window itself morphs: width and height ease between the two
      // sections it currently sits between.
      const i0 = Math.min(count - 1, Math.floor(progress));
      const i1 = Math.min(count - 1, i0 + 1);
      const f = smoothstep(progress - i0);
      const win = windowRef.current;
      const body = bodyRef.current;
      if (win && body) {
        const widths = widthsRef.current;
        const w = widths[i0] + (widths[i1] - widths[i0]) * f;
        win.style.width = `${Math.round(w)}px`;
        const h0 = heightsRef.current[i0] ?? 0;
        const h1 = heightsRef.current[i1] ?? h0;
        const h = h0 + (h1 - h0) * f;
        if (h > 0) body.style.height = `${Math.round(h)}px`;
      }

      const next = Math.round(progress);
      if (next !== lastActive) {
        lastActive = next;
        setActive(next);
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(raf);
    // Deliberately not depending on `layers`: it's a fresh array literal on
    // every render from page.tsx, so including it tore down and restarted the
    // rAF loop constantly. Everything the loop needs from it comes through
    // widthsRef/heightsRef instead.
  }, [count, span, reduceMotion]);

  // Stacked, unpinned, every section legible and reachable in its own static
  // window, nothing crossfading or flying. Deliberately not "the same thing,
  // faster" — the mechanism here is motion, so under reduce-motion it should
  // be absent rather than compressed.
  if (reduceMotion) {
    return (
      <div className={`space-y-16 px-5 py-16 ${className}`}>
        {layers.map((layer, i) => (
          <MorphLayerContext.Provider
            key={layer.label}
            value={{ index: i, active: i, isActive: true, morphing: false }}
          >
            <section id={layer.id} data-ascii-keyframe={layer.keyframe} data-frame-label={layer.label}>
              <TerminalPanel
                number={layer.number}
                label={layer.label}
                style={{ maxWidth: layer.width }}
              >
                {layer.content}
              </TerminalPanel>
            </section>
          </MorphLayerContext.Provider>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${count * heightPerLayer * 100}dvh` }}
      className={`relative ${className}`}
    >
      {layers.map((layer, i) => {
        const t = (i + END_HOLD) / span;
        return (
          <div key={`markers-${layer.label}`} aria-hidden="true">
            {/* Anchor-link target: the exact scroll offset that centers this
                layer, with no anchor correction — scrolling an element into
                view puts it at the viewport top, which is the position we
                want. */}
            <div
              id={layer.id}
              style={{ top: `calc(${t} * (100% - 100dvh))` }}
              className="pointer-events-none absolute left-0 h-0 w-0"
            />
            {/* Moon-morph marker, offset down by the tracker's anchor ratio so
                it crosses that line at the same moment. */}
            <div
              data-ascii-keyframe={layer.keyframe}
              data-frame-label={layer.label}
              style={{ top: `calc(${t} * (100% - 100dvh) + ${ANCHOR_DVH}dvh)` }}
              className="pointer-events-none absolute left-0 h-0 w-0"
            />
          </div>
        );
      })}

      <div
        ref={innerRef}
        style={{ "--morph-progress": 0 } as React.CSSProperties}
        className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden px-4"
      >
        <CellGrid />
        {particles && <ScrollParticles />}

        <LayoutGroup>
          <div
            ref={windowRef}
            style={{ width: resolvedWidths[0], maxWidth: "100%" }}
            className={`${WINDOW_FRAME} max-h-[86dvh] overflow-hidden`}
          >
            {/* One title bar, with each section's identifier crossfading in
                place. The eyebrow lives here rather than floating above a
                headline: in a window it's the title, which is the one honest
                job for a number that isn't a sequence. */}
            <div className={WINDOW_TITLEBAR}>
              {/* div, not span: SectionHeading renders a <p>, and phrasing
                  content can't hold flow content — the span version was
                  invalid nesting and a hydration hazard. */}
              <div className="relative h-[13px] min-w-0 flex-1">
                {layers.map((layer, i) => (
                  <div
                    key={layer.label}
                    ref={(el) => {
                      titleRefs.current[i] = el;
                    }}
                    style={{ opacity: i === 0 ? 1 : 0 }}
                    className="absolute inset-0 flex items-center gap-3"
                  >
                    <SectionHeading
                      number={layer.number}
                      label={layer.label}
                      className="whitespace-nowrap"
                    />
                    <TitleRule />
                  </div>
                ))}
              </div>
            </div>

            {/* Height is driven in the rAF loop, so the window grows and
                shrinks with the content it's showing. overflow-x-hidden +
                overflow-y-auto rather than hidden: content taller than the
                clamped window stays reachable instead of being cut off, and
                overflow-x must be explicit — per spec, overflow-y:auto with
                overflow-x left `visible` promotes overflow-x to auto too. */}
            {/* The explicit initial height is the server-rendered state: every
                layer inside is absolutely positioned, so without it the window
                is 0px tall until the first measured frame. The rAF loop only
                overwrites it once a real content height exists. */}
            <div
              ref={bodyRef}
              style={{ height: 460 }}
              className="relative overflow-x-hidden overflow-y-auto"
            >
              {layers.map((layer, i) => (
                <div
                  key={layer.label}
                  ref={(el) => {
                    layerRefs.current[i] = el;
                  }}
                  // Only the active layer is in the tab order and the
                  // accessibility tree — the others are visually absent, and
                  // letting a keyboard user tab into a section that isn't on
                  // screen is worse than matching what's visible.
                  inert={i !== active}
                  style={
                    {
                      opacity: i === 0 ? 1 : 0,
                      "--morph-local": i === 0 ? 0 : -i,
                      "--morph-away": i,
                    } as React.CSSProperties
                  }
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  {/* Fixed width, not the frame's animating one — see the
                      `avail` note above. This is what stops the text
                      re-wrapping while the window resizes. */}
                  <div
                    ref={(el) => {
                      contentRefs.current[i] = el;
                    }}
                    style={{ width: resolvedWidths[i] }}
                    className={`shrink-0 ${WINDOW_BODY}`}
                  >
                    <MorphLayerContext.Provider
                      value={{ index: i, active, isActive: i === active, morphing: true }}
                    >
                      {layer.content}
                    </MorphLayerContext.Provider>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
}

/**
 * One element that physically travels from the section handing it off to the
 * section receiving it — the actual morph, not a crossfade of two lookalikes.
 *
 * Declare the same `id` twice: `side="from"` in the earlier layer (small, in a
 * sentence) and `side="to"` in the later one (large, as that section's display
 * numeral). Exactly one is ever mounted, so crossing the boundary makes Motion
 * see a `layoutId` disappear in one place and appear in another within the
 * same commit, and interpolate position and size between them.
 *
 * The unmounted side leaves a `visibility: hidden` placeholder with identical
 * box metrics, so the sentence it came from doesn't reflow while it's still
 * half-visible mid-crossfade.
 *
 * Mounting is `active <= index` / `active >= index` rather than `isActive`, so
 * the token stays put once it has landed — gating on `isActive` alone would
 * pop it out of existence at the *next* boundary, while that section is still
 * half on screen.
 */
export function MorphToken({
  id,
  side,
  className = "",
  children,
}: {
  id: string;
  side: "from" | "to";
  className?: string;
  children: React.ReactNode;
}) {
  const { index, active, morphing } = useMorphLayer();

  // inline-block, always: transforms don't apply to inline boxes, so an inline
  // token would simply refuse to move.
  const base = `inline-block ${className}`;

  if (!morphing) {
    return <span className={base}>{children}</span>;
  }

  const mounted = side === "from" ? active <= index : active >= index;
  if (!mounted) {
    return (
      <span aria-hidden="true" className={`${base} invisible`}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      layoutId={id}
      className={base}
      // Weighty rather than snappy: a deliberate camera move between two
      // beats, and it has to stay legible for the whole crossfade band.
      transition={{ type: "spring", stiffness: 180, damping: 26, mass: 1.1 }}
    >
      {children}
    </motion.span>
  );
}

/**
 * Scroll-linked drift for one element inside a layer — the `Reveal`
 * replacement in here (see the rules at the top of this file).
 *
 * Reads `--morph-local`, the layer's signed distance from center: negative
 * while the layer is approaching, zero when it's the one on screen, positive
 * as it leaves. So an element rises from below on the way in and continues up
 * on the way out rather than reversing — the continuous travel the eye already
 * expects from scrolling.
 *
 * Never call this on an ancestor of a `MorphToken`.
 */
export function morphDrift({
  y = 40,
  x = 0,
  scale = 0,
  /** Stagger: 0 leads, higher values travel further for the same scroll, so a
   * group of siblings arrives and leaves in sequence rather than as a slab. */
  order = 0,
}: {
  y?: number;
  x?: number;
  scale?: number;
  order?: number;
} = {}): React.CSSProperties {
  const factor = 1 + order * 0.35;
  const parts = [
    y ? `translateY(calc(var(--morph-local, 0) * ${-y * factor}px))` : "",
    x ? `translateX(calc(var(--morph-local, 0) * ${x * factor}px))` : "",
    scale ? `scale(calc(1 - var(--morph-away, 0) * ${scale}))` : "",
  ].filter(Boolean);

  return { transform: parts.join(" ") };
}
