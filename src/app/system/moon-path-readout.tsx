"use client";

import { useEffect, useState } from "react";

type MoonPath = "worker" | "main-thread" | "unavailable" | "starting";

const LABELS: Record<MoonPath, string> = {
  worker: "OffscreenCanvas worker",
  "main-thread": "main thread (fallback)",
  unavailable: "no WebGL — plain background",
  starting: "deferred, waiting for idle",
};

const NOTES: Record<MoonPath, string> = {
  worker:
    "The scene, its easing and all three render passes run off the main thread. This thread only measures scroll and posts one number per frame.",
  "main-thread":
    "This browser has no transferControlToOffscreen, refused a Worker, or the worker could not get a WebGL2 context. Same engine, same visuals, sharing a thread with Lenis and the morph stage.",
  unavailable:
    "WebGL is unavailable in both places. The page is expected to stay correctly laid out and readable — the moon is atmosphere, never content.",
  starting:
    "Setup is deferred to an idle slot so it never competes with hydration or the boot sequence.",
};

/**
 * Reports which thread the site-wide background moon actually ended up on.
 *
 * There are three possible answers on a real visitor's device and no way to
 * tell them apart by looking at the page — the fallback is deliberately
 * pixel-identical. `AsciiCanvas` writes the answer to a data attribute on its
 * wrapper; this reads it back. See `docs/tasks/TASK-ascii-offscreen-worker.md`.
 */
export function MoonPathReadout() {
  const [path, setPath] = useState<MoonPath>("starting");

  useEffect(() => {
    const check = () => {
      const wrapper = document.querySelector<HTMLElement>("[data-moon-path]");
      const value = wrapper?.dataset.moonPath as MoonPath | undefined;
      if (value) setPath(value);
    };
    check();
    const timer = window.setInterval(check, 500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="space-y-2 border border-border/60 bg-background p-3">
      <span className="block font-mono text-[10px] text-muted-foreground uppercase">
        Background moon — active path
      </span>
      <p className="font-mono text-[13px] text-accent">{LABELS[path]}</p>
      <p className="max-w-prose text-[12px] leading-[1.6] text-muted-foreground">
        {NOTES[path]}
      </p>
    </div>
  );
}
