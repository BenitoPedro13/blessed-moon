import { SectionHeading } from "@/components/section-heading";

const TIERS = [
  { name: "Landing Page / Website" },
  { name: "Web App / Dashboard" },
  { name: "Full product build" },
] as const;

export function PricingTable() {
  return (
    <section id="pricing" className="px-7 py-13 sm:py-16">
      <SectionHeading number="05" label="PRICING" />
      <div className="flex flex-col">
        {TIERS.map((tier, i) => (
          <div
            key={tier.name}
            className={`flex items-baseline justify-between gap-4 py-3.5 text-[12.5px] ${
              i < TIERS.length - 1 ? "border-b border-border/60" : ""
            }`}
          >
            <span className="font-sans text-[13.5px] text-foreground">
              {tier.name}
            </span>
            <span className="text-right text-muted-foreground">
              range confirmed on call
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
