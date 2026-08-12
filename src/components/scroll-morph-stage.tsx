"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";

import { ScrollParticles } from "@/components/scroll-particles";

/**
 * Pins N sections in ONE shared frame and crossfades between them as the
 * visitor scrolls — the thing five independent `ScrollStage` pins could not
 * do (TASK-homepage-morph-redesign.md).
 *
 * `ScrollStage` gives each section its own full-viewport `position: sticky`
 * panel, which means section A's panel releases the exact instant section
 * B's begins: two pinned panels are never simultaneously on screen, so
 * there is no moment where an element could travel from one to the other.
 * Adjusting A's opacity curve makes the *cut* feel better but never makes
 * it a morph. Here all N sections are mounted at once, absolutely
 * positioned in a single sticky frame, each reading its own sub-range of
 * one shared progress value — so near a boundary both are genuinely in the
 * DOM, laid out, and measurable. That is what makes a real shared-element
 * handoff possible (see `MorphToken`).
 *
 * Still pure `position: sticky`, not scroll-jacking — same as `ScrollStage`,
 * and still compatible with Lenis and every native scroll gesture.
 *
 * ## Two rules for content inside a layer
 *
 * 1. **A layer animates `opacity` only — never `transform`.** Motion's
 *    layout projection measures real bounding boxes before and after the
 *    handoff; an ancestor whose transform is being rewritten every frame
 *    makes that measurement drift mid-flight and the token lands in the
 *    wrong place. Per-element motion goes on individual children instead,
 *    via `morphDrift()` — just never on an ancestor of a `MorphToken`.
 * 2. **`Reveal` does not work in here.** It's `whileInView`-driven, and
 *    every layer is permanently inside the viewport once it's a child of
 *    the sticky frame — all N would fire once at mount and never replay.
 *    `morphDrift()` is the replacement: scroll-linked, so it plays in both
 *    directions like the rest of this scroll system.
 */

/** Fraction of one layer's scroll allocation spent crossfading into the
 * next. This is the band where both layers are partially visible and a
 * token is in flight — wide enough to read as a dissolve, narrow enough
 * that each layer still gets a real plateau where it's the only thing on
 * screen. */
const OVERLAP = 0.3;

/** Shapes the crossfade so the boundary dips toward the background instead of
 * holding two half-opaque layers on top of each other.
 *
 * A linear ramp (gamma 1) puts both neighbours at exactly 0.5 at the
 * crossover, which sums to a constant 1.0 — mathematically tidy, and wrong to
 * look at: these layers are dense text, and two 50% text blocks stacked
 * render as unreadable interference rather than a transition. At 1.7 each
 * side sits at ~0.31 there, so the page briefly settles toward near-black and
 * the crossover reads as a deliberate dissolve. Not higher: the token is in
 * flight at exactly that moment and still has to be legible. */
const CROSSFADE_GAMMA = 1.7;

/** Extra scroll room, in layer-units, held at each end of the range. Without
 * it the first and last layers get half the screen-time of the middle ones
 * (they only have a boundary on one side), so the page opens by immediately
 * dissolving the section you just arrived at. */
const END_HOLD = 0.5;

/** Where `createScrollTracker` samples the page (its `anchorRatio`, 0.35 of
 * the viewport). Keyframe markers are offset by this so each one crosses the
 * tracker's anchor line at exactly the moment its layer is centered. */
const ANCHOR_DVH = 35;

interface MorphState {
  /** This layer's position in the stage. */
  index: number;
  /** Which layer the stage currently considers "the one on screen". Changes
   * discretely at each boundary — the only value here that costs a React
   * render, which is what a `layoutId` handoff needs (continuous CSS can't
   * unmount and remount an element). */
  active: number;
  isActive: boolean;
  /** False when the stage is rendering its stacked `prefers-reduced-motion`
   * fallback — nothing morphs there, so tokens render as plain text. */
  morphing: boolean;
}

const MorphLayerContext = createContext<MorphState | null>(null);

/** Defaults matter: a section built for this stage should still render
 * correctly on its own (e.g. staged on `/system`), just without morphing. */
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
  /** Anchor-link target (`#services`), placed on a marker at this layer's
   * own scroll offset rather than on the content — the content is
   * absolutely positioned inside a sticky frame, so scrolling it into view
   * would land on the frame, not on the point where it's actually legible. */
  id?: string;
  /** Feeds the ASCII moon's morph. Kept on markers in the tall wrapper for
   * the same reason: five absolutely-positioned sections all report the
   * same `getBoundingClientRect().top`, which the tracker can neither order
   * nor interpolate between. */
  keyframe: number;
  label: string;
  content: React.ReactNode;
}

export function ScrollMorphStage({
  layers,
  heightPerLayer = 1.6,
  particles = true,
  className = "",
}: {
  layers: MorphLayerSpec[];
  /** Scroll room per layer, as a multiple of 100dvh. The "increase the
   * scroll journey" lever, same as `ScrollStage`'s `heightMultiplier` — but
   * spanning all the layers at once instead of one section each. */
  heightPerLayer?: number;
  particles?: boolean;
  className?: string;
}) {
  const count = layers.length;
  const span = count - 1 + END_HOLD * 2;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner || count === 0) return;

    let raf = 0;
    // Progress goes to the DOM every frame; only the discrete active index
    // goes through React — same reasoning as ScrollStage/ascii-canvas, a
    // continuous scroll value has no business re-rendering a tree.
    let lastActive = -1;
    function frame() {
      const rect = wrapper!.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const t = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      const progress = Math.min(count - 1, Math.max(0, t * span - END_HOLD));
      inner!.style.setProperty("--morph-progress", progress.toFixed(4));

      // Per-layer values are computed here rather than as CSS calc() off
      // --morph-progress. The CSS version needed a nested
      // `max(calc(…), calc(-1 * calc(…)))` to get an absolute value, which
      // is correct per spec but is exactly the kind of expression that
      // silently resolves to nothing on one engine and takes a browser to
      // catch. Five style writes a frame is not a cost worth that risk, and
      // children still read plain numbers from --morph-local/--morph-away.
      for (let i = 0; i < count; i++) {
        const layer = layerRefs.current[i];
        if (!layer) continue;
        const local = progress - i;
        const away = Math.abs(local);
        layer.style.setProperty("--morph-local", local.toFixed(4));
        layer.style.setProperty("--morph-away", away.toFixed(4));
        // Full opacity across a plateau, then a fast crossfade in the
        // OVERLAP band centered on the boundary, shaped by CROSSFADE_GAMMA
        // so the crossover dips rather than stacking two half-lit layers.
        const ramp = Math.min(1, Math.max(0, (0.5 + OVERLAP / 2 - away) / OVERLAP));
        layer.style.opacity = String(Math.pow(ramp, CROSSFADE_GAMMA));
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
  }, [count, span, reduceMotion]);

  // Stacked, unpinned, everything legible and reachable, nothing crossfading
  // or flying. Deliberately not "the same thing with a shorter duration" —
  // the whole mechanism here is motion, so under reduce-motion it should be
  // absent rather than compressed.
  if (reduceMotion) {
    return (
      <div className={className}>
        {layers.map((layer, i) => (
          <MorphLayerContext.Provider
            key={layer.label}
            value={{ index: i, active: i, isActive: true, morphing: false }}
          >
            <section
              id={layer.id}
              data-ascii-keyframe={layer.keyframe}
              data-frame-label={layer.label}
              className="flex min-h-dvh flex-col justify-center border-b border-border/60"
            >
              {layer.content}
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
        // Fraction of the scrollable range at which layer `i` is centered.
        const t = (i + END_HOLD) / span;
        return (
          <div key={`markers-${layer.label}`} aria-hidden="true">
            {/* Anchor-link target: the exact scroll offset that centers this
                layer, with no anchor-line correction — scrolling an element
                into view puts it at the viewport top, which is precisely
                the scroll position we want. */}
            <div
              id={layer.id}
              style={{ top: `calc(${t} * (100% - 100dvh))` }}
              className="pointer-events-none absolute left-0 h-0 w-0"
            />
            {/* Moon-morph marker: offset down by the tracker's anchor ratio
                so it crosses that line at the same moment. */}
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
        className="sticky top-0 h-dvh overflow-hidden"
      >
        {particles && <ScrollParticles />}
        <LayoutGroup>
          {layers.map((layer, i) => (
            <div
              key={layer.label}
              ref={(el) => {
                layerRefs.current[i] = el;
              }}
              // Only the active layer is in the tab order and the
              // accessibility tree — the other four are visually absent, and
              // letting a keyboard user tab into a section that isn't on
              // screen is worse than matching what's actually visible. The
              // reduced-motion branch above renders all of it in flow.
              inert={i !== active}
              // Server-rendered state: the first layer visible, the rest
              // hidden, matching progress 0. The rAF loop takes over on
              // mount. All the content is still in the HTML either way,
              // which is what matters for crawlers.
              style={
                {
                  opacity: i === 0 ? 1 : 0,
                  "--morph-local": i === 0 ? 0 : -i,
                  "--morph-away": i,
                } as React.CSSProperties
              }
              // overflow-y-auto for the same reason ScrollStage has it: a
              // dense layer on a short viewport should stay reachable rather
              // than be silently clipped. overflow-x-hidden must be explicit
              // alongside it — per spec, overflow-y:auto with overflow-x left
              // `visible` promotes overflow-x to `auto` too, which turned
              // pricing's negative-margin rows into a real horizontal
              // scrollbar last time.
              className="absolute inset-0 flex flex-col justify-center overflow-x-hidden overflow-y-auto"
            >
              <MorphLayerContext.Provider
                value={{ index: i, active, isActive: i === active, morphing: true }}
              >
                {layer.content}
              </MorphLayerContext.Provider>
            </div>
          ))}
        </LayoutGroup>
      </div>
    </div>
  );
}

/**
 * One element that physically travels from the section handing it off to the
 * section receiving it — the actual morph, not a crossfade of two lookalikes.
 *
 * Declare the same `id` twice: `side="from"` in the earlier layer (where it
 * reads small and inline, inside a sentence) and `side="to"` in the later one
 * (where it lands large, as that section's display numeral). Exactly one of
 * the two is ever mounted, so when the boundary is crossed Motion sees a
 * `layoutId` disappear in one place and appear in another within the same
 * commit, and interpolates its position and size between them.
 *
 * The unmounted side leaves a `visibility: hidden` placeholder with identical
 * box metrics, so the sentence it came out of doesn't reflow while it's still
 * half-visible mid-crossfade.
 *
 * Mounting is `active <= index` / `active >= index` rather than `isActive`
 * so the token stays put in the destination once it has landed — gating on
 * `isActive` alone would pop it out of existence at the *next* boundary,
 * while that section is still half on screen.
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

  // inline-block, always: transforms don't apply to inline boxes, so an
  // inline token would simply refuse to move.
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
      // Weighty rather than snappy: this is a deliberate camera move between
      // two beats, and it has to stay legible for the whole crossfade band.
      transition={{ type: "spring", stiffness: 180, damping: 26, mass: 1.1 }}
    >
      {children}
    </motion.span>
  );
}

/**
 * Scroll-linked drift for one element inside a layer — the `Reveal`
 * replacement in here (see the rule at the top of this file).
 *
 * Reads `--morph-local`, the layer's signed distance from center: negative
 * while the layer is still approaching, zero when it's the one on screen,
 * positive as it leaves. So an element rises from below on the way in and
 * continues up on the way out, rather than reversing direction — the same
 * continuous travel the eye already expects from scrolling.
 *
 * Never call this on an ancestor of a `MorphToken`.
 */
export function morphDrift({
  y = 40,
  x = 0,
  scale = 0,
  /** Stagger: 0 leads, higher values travel further for the same scroll, so
   * a group of siblings arrives and leaves in sequence instead of as a slab. */
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
