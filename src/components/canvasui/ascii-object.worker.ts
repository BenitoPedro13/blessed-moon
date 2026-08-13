/**
 * Owns the ASCII moon's three.js scene on a thread of its own.
 *
 * The main thread keeps only what needs a DOM: it measures scroll, and posts a
 * single morph number per frame. Everything else — the eased convergence toward
 * that morph value, the render cadence, the ambient float, and all three render
 * passes — happens here. That split is the point of the change: the moon keeps
 * animating at a steady rate while the main thread is busy with Lenis, the morph
 * stage and the particle field, which is the stutter a visitor actually reported.
 *
 * The scene code is not duplicated here. This file imports the same
 * `createAsciiObject` the main-thread path uses (`ascii-engine.ts`), handing it
 * an `OffscreenCanvas` plus the few environment facts a worker cannot look up
 * for itself.
 *
 * See `docs/tasks/TASK-ascii-offscreen-worker.md`.
 */

import {
  createAsciiObject,
  type AsciiObjectInstance,
  type AsciiObjectOptions,
  type CanvasMetrics,
} from "@/components/canvasui/ascii-engine";
import {
  createMoonEasing,
  viewportScaleFor,
} from "@/lib/ascii-canvas/moon-transform";

export type AsciiWorkerRequest =
  | {
      type: "init";
      canvas: OffscreenCanvas;
      options: AsciiObjectOptions;
      metrics: CanvasMetrics;
      reducedMotion: boolean;
      innerWidth: number;
    }
  | { type: "morph"; value: number }
  | { type: "resize"; metrics: CanvasMetrics; innerWidth: number }
  | { type: "visible"; value: boolean }
  | { type: "reducedMotion"; value: boolean }
  | { type: "destroy" };

export type AsciiWorkerResponse =
  | { type: "ready" }
  | { type: "failed"; reason: string }
  | { type: "loaded" }
  | { type: "loadError"; reason: string };

const scope = self as unknown as Worker;

let instance: AsciiObjectInstance | null = null;
let easing: ReturnType<typeof createMoonEasing> | null = null;
let morph = 0;
let cadence = -1;
let running = false;
let frame = 0;

/**
 * Advances the easing one step per displayed frame and pushes the result into
 * the scene. Deliberately separate from the engine's own render loop: the
 * engine may be capped to 30fps by `setCadence`, but the easing should still
 * integrate at display rate so a cadence change never alters the speed or shape
 * of the camera move — only how often it is drawn. That is the same relationship
 * the main-thread `frame-loop` had with cadence before this moved here.
 */
function loop() {
  if (!running || !instance || !easing) return;
  frame = requestAnimationFrame(loop);
  const { transform, cadence: nextCadence } = easing.step(morph);
  if (nextCadence !== cadence) {
    cadence = nextCadence;
    instance.setCadence(nextCadence);
  }
  instance.setTransform(transform);
}

function start() {
  if (running) return;
  running = true;
  frame = requestAnimationFrame(loop);
}

function stop() {
  running = false;
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
}

function destroy() {
  stop();
  instance?.destroy();
  instance = null;
  easing = null;
}

scope.onmessage = (event: MessageEvent<AsciiWorkerRequest>) => {
  const message = event.data;

  switch (message.type) {
    case "init": {
      try {
        instance = createAsciiObject(
          {
            canvas: message.canvas,
            metrics: message.metrics,
            reducedMotion: message.reducedMotion,
          },
          {
            ...message.options,
            onLoad: () => scope.postMessage({ type: "loaded" }),
            onError: (error: unknown) =>
              scope.postMessage({ type: "loadError", reason: String(error) }),
          },
        );
      } catch (error) {
        instance = null;
        scope.postMessage({ type: "failed", reason: String((error as Error)?.stack ?? error) });
        return;
      }
      if (!instance) {
        // No WebGL2 in the worker. The host re-creates a plain canvas and
        // retries on the main thread rather than leaving the page moonless.
        scope.postMessage({ type: "failed", reason: "no-webgl" });
        return;
      }
      easing = createMoonEasing(viewportScaleFor(message.innerWidth));
      scope.postMessage({ type: "ready" });
      start();
      break;
    }
    case "morph":
      morph = message.value;
      break;
    case "resize":
      easing?.setViewport(viewportScaleFor(message.innerWidth));
      instance?.resize(message.metrics);
      break;
    case "visible":
      instance?.setVisible(message.value);
      if (message.value) {
        start();
      } else {
        stop();
      }
      break;
    case "reducedMotion":
      instance?.setReducedMotion(message.value);
      break;
    case "destroy":
      destroy();
      break;
  }
};
