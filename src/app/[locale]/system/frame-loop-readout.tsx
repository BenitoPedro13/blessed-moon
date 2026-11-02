"use client";

import { useEffect, useState } from "react";

import { medianFrameTime, subscribeFrame } from "@/components/frame-loop";

/**
 * Live readout of the shared frame loop, for the `/system` panel.
 *
 * Subscribes like any other consumer — which also makes it a working example of
 * the read/write split — and samples the published median into React state at
 * 4Hz rather than every frame, because a per-frame `setState` here would itself
 * be the kind of cost this module exists to remove.
 */
export function FrameLoopReadout() {
  const [median, setMedian] = useState(0);
  const [frames, setFrames] = useState(0);

  useEffect(() => {
    let count = 0;
    const unsubscribe = subscribeFrame({
      write() {
        count += 1;
      },
    });
    const timer = window.setInterval(() => {
      setMedian(medianFrameTime());
      setFrames(count);
    }, 250);

    return () => {
      unsubscribe();
      window.clearInterval(timer);
    };
  }, []);

  const fps = median > 0 ? 1000 / median : 0;

  return (
    <dl className="grid grid-cols-2 gap-px border border-border/60 bg-border/60 font-mono text-[11px] sm:grid-cols-3">
      {[
        { label: "median frame", value: median > 0 ? `${median.toFixed(1)}ms` : "sampling…" },
        { label: "effective fps", value: fps > 0 ? fps.toFixed(0) : "—" },
        { label: "frames on this page", value: String(frames) },
      ].map((stat) => (
        <div key={stat.label} className="bg-background px-4 py-3">
          <dt className="text-[9.5px] tracking-[0.08em] text-muted-foreground uppercase">
            {stat.label}
          </dt>
          <dd className="mt-1 text-foreground tabular-nums">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
