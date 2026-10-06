import type { ReactNode } from "react";
import { TerminalPanel } from "@/components/terminal-panel";
import type { Reading } from "@/lib/insight-readings";

const TONE_LABEL = { act: "Look at this", wait: "Not enough yet", fine: "Holding up" } as const;

/** Every live-insight panel has the same shape: question → evidence → one
 * reading. The reading's tone is spelled out in words, so colour is never the
 * only signal; amber is reserved for the one reading that asks for action. */
export function InsightPanel({ number, question, reading, unavailable, children }: {
  number: string;
  question: string;
  reading?: Reading;
  unavailable?: string;
  children?: ReactNode;
}) {
  return (
    <section>
      <TerminalPanel number={number} label="LIVE · UMAMI">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">{question}</h2>
        {unavailable ? (
          <p className="border border-border p-4 font-mono text-xs leading-6 text-muted-foreground">
            No reading: Umami didn&apos;t answer ({unavailable}). This is missing data, not a zero.
          </p>
        ) : (
          <>
            {children}
            {reading && (
              <p className={`mt-6 border-l-2 pl-4 text-sm leading-7 ${reading.tone === "act" ? "border-primary text-foreground" : "border-border text-foreground/75"}`}>
                <span className={`mr-2 font-mono text-xs uppercase ${reading.tone === "act" ? "text-primary" : "text-muted-foreground"}`}>{TONE_LABEL[reading.tone]} ·</span>
                {reading.text}
              </p>
            )}
          </>
        )}
      </TerminalPanel>
    </section>
  );
}

/** A horizontal count bar. The number is always printed beside it. */
export function CountBar({ value, max, emphasis = false }: { value: number; max: number; emphasis?: boolean }) {
  const width = max > 0 ? Math.max(value > 0 ? 2 : 0, (value / max) * 100) : 0;
  return (
    <span aria-hidden="true" className="block h-3 w-full bg-muted/40">
      <span className={`block h-full ${emphasis ? "bg-primary" : "bg-muted-foreground/60"}`} style={{ width: `${width}%` }} />
    </span>
  );
}
