"use client";

import { useState } from "react";

const currency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);

export function QuoteEstimate() {
  const [hours, setHours] = useState(22);
  const [rate, setRate] = useState(110);
  const floor = ((hours * rate + 100) * 1.15) / 0.9;
  return (
    <div className="border border-border bg-background/75 p-5">
      <h3 className="text-lg font-medium">Check the workload before quoting.</h3>
      <p className="mt-3 text-sm leading-7 text-foreground/75">Illustrative internal model: R$100 direct costs, 15% contingency, 10% reserve for taxes and payment fees. Replace assumptions with actual costs. This is a planning floor, not a public offer.</p>
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <label className="text-sm">Delivery hours <span className="font-mono text-primary">{hours}h</span><input className="mt-3 block w-full accent-primary" type="range" min="10" max="50" value={hours} onChange={(event) => setHours(Number(event.target.value))} /></label>
        <label className="text-sm">Internal hourly cost <span className="font-mono text-primary">{currency(rate)}</span><input className="mt-3 block w-full accent-primary" type="range" min="60" max="250" step="5" value={rate} onChange={(event) => setRate(Number(event.target.value))} /></label>
      </div>
      <p className="mt-6 text-sm">Estimated floor <output aria-live="polite" className="ml-3 font-mono text-xl text-primary">{currency(floor)}</output></p>
      <p className="mt-3 break-words font-mono text-xs leading-6 text-muted-foreground">(({hours} × {rate} + 100) × 1.15) ÷ 0.90</p>
    </div>
  );
}
