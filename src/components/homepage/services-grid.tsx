import { SectionHeading } from "@/components/section-heading";

const SERVICES = [
  { index: "01", name: "Web Apps" },
  { index: "02", name: "Mobile Apps" },
  { index: "03", name: "Landing Pages" },
  { index: "04", name: "Websites" },
  { index: "05", name: "Design Systems" },
  { index: "06", name: "Branding" },
  { index: "07", name: "E-Commerces" },
  { index: "08", name: "Dashboards" },
] as const;

export function ServicesGrid() {
  return (
    <section id="services" data-ascii-keyframe="2" className="px-7 py-13 sm:py-16">
      <SectionHeading number="02" label="SERVICES" />
      <div className="grid grid-cols-2 gap-px border border-border/60 bg-border/60 sm:grid-cols-4">
        {SERVICES.map((service) => (
          <div key={service.index} className="bg-background px-4 py-5">
            <span className="mb-2.5 block font-mono text-[9.5px] text-muted-foreground/70">
              {service.index}
            </span>
            <span className="font-sans text-sm text-foreground">
              {service.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
