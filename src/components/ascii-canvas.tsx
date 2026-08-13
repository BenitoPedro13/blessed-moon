"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import type { AsciiObjectOptions } from "@/components/canvasui/ascii-engine";
import type { AsciiWorkerRequest, AsciiWorkerResponse } from "@/components/canvasui/ascii-object.worker";
import { subscribeFrame } from "@/components/frame-loop";
import {
  createMoonEasing,
  opacityForMorph,
  viewportScaleFor,
} from "@/lib/ascii-canvas/moon-transform";
import { createScrollTracker } from "@/lib/ascii-canvas/scroll-progress";

/**
 * Options for the moon, shared verbatim by both the worker and the
 * main-thread fallback so the two can never drift.
 *
 * `orbit`/`zoom`/`autoRotate` being off is load-bearing, not incidental:
 * OrbitControls binds DOM events and cannot exist in a worker, so
 * `canUseWorker` refuses the offscreen path if any of them is ever turned on.
 */
const MOON_OPTIONS: AsciiObjectOptions = {
  src: "/models/moon.glb",
  cellSize: 6,
  colored: false,
  color: "#c9c7c0",
  // Lower edgeContrast (was 2.4) so the crater/regolith shading
  // itself drives glyph choice instead of the algorithm snapping
  // almost everything to edge-tracing glyphs and flattening the
  // photographic tonal detail into a near-blank disc. Higher
  // contrast + exposure pull that subtle tonal range out further.
  contrast: 2.2,
  edgeContrast: 1.3,
  exposure: 1.4,
  orbit: false,
  zoom: false,
  autoRotate: false,
  floatIntensity: 0.6,
  rotationIntensity: 0.3,
  environmentIntensity: 0.8,
};

const CANVAS_CLASS = "h-full w-full";

function canUseWorker() {
  return (
    typeof Worker !== "undefined" &&
    typeof HTMLCanvasElement !== "undefined" &&
    typeof HTMLCanvasElement.prototype.transferControlToOffscreen ===
      "function" &&
    !MOON_OPTIONS.orbit &&
    !MOON_OPTIONS.zoom &&
    !MOON_OPTIONS.autoRotate
  );
}

function metricsFor(canvas: HTMLCanvasElement) {
  return {
    width: Math.max(canvas.clientWidth, 1),
    height: Math.max(canvas.clientHeight, 1),
    pixelRatio: window.devicePixelRatio || 1,
  };
}

function prefersReducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Waits for an idle slot so the moon's setup — worker spawn, three.js compile,
 * model fetch — never competes with hydration or the boot sequence, which is
 * where the ~650ms of blocked main thread showed up in the load profile. */
function whenIdle(run: () => void) {
  const idle = (
    window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }
  ).requestIdleCallback;
  if (idle) {
    const handle = idle(run, { timeout: 1200 });
    return () =>
      (
        window as unknown as { cancelIdleCallback?: (h: number) => void }
      ).cancelIdleCallback?.(handle);
  }
  const handle = window.setTimeout(run, 200);
  return () => window.clearTimeout(handle);
}

/**
 * Full-bleed ASCII background: a single moon model, present for the whole
 * page, all the way through the footer — it should never stop animating or
 * fully disappear. Scroll drives its zoom, rotation, and drift continuously;
 * no swapping between unrelated objects. See TASK-ascii-canvas-layer.md: an
 * earlier version cross-faded between moon, microchip, and monitor models
 * per section, which read as a slideshow of random stock objects rather
 * than one coherent form,
 * so it was dropped in favor of this. The moon also happens to be the one
 * asset that's actually on-brand (the "circuit-moon" logo mark).
 *
 * The scene itself runs in a worker where the browser allows it
 * (`ascii-object.worker.ts`); this component keeps the parts that need a DOM —
 * scroll measurement, canvas sizing, and the wrapper's opacity — and degrades
 * to running the same engine on the main thread otherwise. The canvas is
 * created imperatively rather than rendered by React because the worker path
 * transfers it away with `transferControlToOffscreen`, and a transferred canvas
 * can never get a context back; falling back therefore means discarding that
 * element and starting a fresh one, which React must not be reconciling
 * underneath us.
 */
export function AsciiCanvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackerRef = useRef<ReturnType<typeof createScrollTracker> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let stopped = false;
    let teardown: (() => void) | null = null;

    const cancelIdle = whenIdle(() => {
      if (stopped) return;
      teardown = mountMoon(wrapper, trackerRef);
    });

    return () => {
      stopped = true;
      cancelIdle();
      teardown?.();
      trackerRef.current = null;
    };
  }, []);

  useEffect(() => {
    // The root layout persists during App Router navigation. Re-measure after
    // the new route commits instead of keeping the previous page's section
    // boundaries until a resize happens.
    const frame = requestAnimationFrame(() => trackerRef.current?.measure());
    const settled = window.setTimeout(() => trackerRef.current?.measure(), 300);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settled);
    };
  }, [pathname]);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}

/**
 * Creates the canvas, starts the scene on whichever thread will take it, and
 * wires scroll to it. Returns a teardown.
 */
function mountMoon(
  wrapper: HTMLDivElement,
  trackerRef: { current: ReturnType<typeof createScrollTracker> | null },
) {
  const canvas = document.createElement("canvas");
  canvas.className = CANVAS_CLASS;
  wrapper.appendChild(canvas);

  const tracker = createScrollTracker();
  trackerRef.current = tracker;
  tracker.measure();

  let morph = 0;
  let disposed = false;
  /** Set by whichever path wins; called every frame with the current morph. */
  let pushMorph: (value: number) => void = () => {};
  let disposeScene: () => void = () => {};
  let onResize: () => void = () => {};

  function read({ scrollY, innerHeight }: { scrollY: number; innerHeight: number }) {
    morph = tracker.read(scrollY, innerHeight);
  }

  function write() {
    pushMorph(morph);
    wrapper.style.opacity = String(opacityForMorph(morph));
  }

  /**
   * The fallback path, and the reason it is a dynamic import: a static one puts
   * the 664KB three.js chunk on the main thread's critical path for *every*
   * visitor, including the ones whose scene is running in the worker and who
   * will never execute a line of it. Measured — with the static import the load
   * profile barely moved (797ms blocked vs a 955ms baseline), because the
   * parse/compile the worker was supposed to take away was still happening
   * here. See `docs/tasks/TASK-ascii-offscreen-worker.md` § Results.
   */
  async function startMainThread(target: HTMLCanvasElement) {
    const { createAsciiObject } = await import(
      "@/components/canvasui/ascii-engine"
    );
    if (disposed) return false;
    const instance = createAsciiObject({ canvas: target }, MOON_OPTIONS);
    if (!instance) {
      // No WebGL at all. Per CLAUDE.md the page must still be correct and
      // readable without it, so this is a legitimate resting state, not an
      // error — the ground just stays plain dark.
      wrapper.dataset.moonPath = "unavailable";
      return false;
    }
    wrapper.dataset.moonPath = "main-thread";
    const easing = createMoonEasing(viewportScaleFor(window.innerWidth));
    let cadence = -1;
    pushMorph = (value) => {
      const { transform, cadence: next } = easing.step(value);
      if (next !== cadence) {
        cadence = next;
        instance.setCadence(next);
      }
      instance.setTransform(transform);
    };
    onResize = () => {
      easing.setViewport(viewportScaleFor(window.innerWidth));
      instance.resize();
    };
    disposeScene = () => instance.destroy();
    return true;
  }

  let fellBack = false;

  function startWorker(target: HTMLCanvasElement) {
    let worker: Worker;
    try {
      worker = new Worker(
        new URL("./canvasui/ascii-object.worker.ts", import.meta.url),
      );
    } catch {
      return false;
    }

    const post = (message: AsciiWorkerRequest, transfer?: Transferable[]) => {
      if (transfer) worker.postMessage(message, transfer);
      else worker.postMessage(message);
    };

    // If the worker cannot render, this canvas is already spent — a transferred
    // canvas never yields a context again — so the fallback runs on a new one.
    const fallBackToMainThread = () => {
      if (disposed || fellBack) return;
      fellBack = true;
      worker.terminate();
      target.remove();
      const replacement = document.createElement("canvas");
      replacement.className = CANVAS_CLASS;
      wrapper.appendChild(replacement);
      pushMorph = () => {};
      disposeScene = () => {};
      onResize = () => {};
      void startMainThread(replacement).then(() => {
        if (!disposed) observeResize(replacement);
      });
    };

    worker.onmessage = (event: MessageEvent<AsciiWorkerResponse>) => {
      if (event.data.type === "failed") {
        // Warn, not error: this is a supported outcome, and the profiling
        // harness treats a console error as a failed load.
        console.warn("[ascii-canvas] worker path unavailable:", event.data.reason);
        fallBackToMainThread();
      }
    };
    worker.onerror = fallBackToMainThread;

    const offscreen = target.transferControlToOffscreen();
    post(
      {
        type: "init",
        canvas: offscreen,
        options: MOON_OPTIONS,
        metrics: metricsFor(target),
        reducedMotion: prefersReducedMotion(),
        innerWidth: window.innerWidth,
      },
      [offscreen],
    );

    wrapper.dataset.moonPath = "worker";
    pushMorph = (value) => post({ type: "morph", value });
    onResize = () =>
      post({
        type: "resize",
        metrics: metricsFor(target),
        innerWidth: window.innerWidth,
      });
    disposeScene = () => {
      post({ type: "destroy" });
      worker.terminate();
    };

    // The canvas is `fixed inset-0`, so it intersects the viewport forever and
    // the engine's own IntersectionObserver gate can never fire. Page
    // visibility is the signal that actually means "nobody is looking".
    const onVisibility = () =>
      post({ type: "visible", value: !document.hidden });
    document.addEventListener("visibilitychange", onVisibility);

    const motion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const onMotion = () =>
      post({ type: "reducedMotion", value: !!motion?.matches });
    motion?.addEventListener("change", onMotion);

    const previousDispose = disposeScene;
    disposeScene = () => {
      document.removeEventListener("visibilitychange", onVisibility);
      motion?.removeEventListener("change", onMotion);
      previousDispose();
    };
    return true;
  }

  let resizeObserver: ResizeObserver | null = null;
  function observeResize(target: HTMLCanvasElement) {
    resizeObserver?.disconnect();
    resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(target);
  }

  if (!canUseWorker() || !startWorker(canvas)) {
    // `startWorker` returns false only if the Worker constructor itself threw,
    // which happens before the canvas is transferred — so this one is still
    // usable and no replacement is needed.
    void startMainThread(canvas);
  }
  observeResize(canvas);

  function handleWindowResize() {
    tracker.measure();
    onResize();
  }
  window.addEventListener("resize", handleWindowResize);
  // Re-measure once more shortly after mount: fonts/images can still be
  // settling layout at effect-mount time, which would otherwise bake in
  // stale section boundaries for the rest of the page's life.
  const remeasure = window.setTimeout(() => tracker.measure(), 500);
  const unsubscribe = subscribeFrame({ read, write });

  return () => {
    disposed = true;
    unsubscribe();
    window.clearTimeout(remeasure);
    window.removeEventListener("resize", handleWindowResize);
    resizeObserver?.disconnect();
    disposeScene();
    wrapper.replaceChildren();
  };
}
