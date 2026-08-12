"use client";

import { useState, useSyncExternalStore } from "react";
import { ChevronDown, Copy } from "lucide-react";

import { supportsHtmlInCanvas } from "@/components/canvasui/ParticleScroll";

const FLAG = "chrome://flags/#canvas-draw-element";

const emptySubscribe = () => () => {};

function useHtmlInCanvasSupport() {
  return useSyncExternalStore(emptySubscribe, supportsHtmlInCanvas, () => false);
}

export function HtmlInCanvasNotice() {
  const supported = useHtmlInCanvasSupport();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (supported) return null;

  function copyFlag() {
    navigator.clipboard.writeText(FLAG).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  }

  return (
    <div className="border-b border-primary/30 bg-background/80 font-mono text-[10px] tracking-[0.5px] text-muted-foreground">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-2 uppercase transition-colors hover:text-primary"
      >
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="text-primary">
            ›
          </span>
          static_view — this browser doesn&rsquo;t render the scroll effect below
        </span>
        <span className="flex items-center gap-1 text-primary">
          details
          <ChevronDown
            aria-hidden="true"
            className={`size-3 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {open ? (
        <div className="space-y-3 border-t border-primary/30 px-4 py-3 normal-case">
          <p className="leading-relaxed text-muted-foreground">
            The panel below normally dissolves into sand as you scroll — built on
            HTML-in-Canvas, an experimental browser capability a subset of Chrome
            builds support. You&rsquo;re seeing the plain, fully-readable version
            instead — the intended fallback for everyone outside that set, this
            browser included.
          </p>
          <div className="space-y-1.5 text-muted-foreground">
            <p className="text-foreground">To see the real thing:</p>
            <ol className="space-y-1.5">
              <li className="flex flex-wrap items-center gap-2">
                <span className="text-primary">1</span>
                <span>Copy</span>
                <button
                  type="button"
                  onClick={copyFlag}
                  className="flex items-center gap-1.5 border border-border/60 px-2 py-1 text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {FLAG}
                  <Copy aria-hidden="true" className="size-3" />
                </button>
                <span aria-live="polite">{copied ? "copied" : ""}</span>
                <span>and paste it into the address bar.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">2</span>
                <span>Set HTML-in-Canvas to Enabled.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">3</span>
                <span>Relaunch the browser, then reload this page.</span>
              </li>
            </ol>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default HtmlInCanvasNotice;
