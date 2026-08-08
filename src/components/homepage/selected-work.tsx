import { SectionHeading } from "@/components/section-heading";

const PROJECTS = [
  {
    name: "markado",
    description:
      "Booking website — one link, a slot, a payment, handled automatically.",
  },
  {
    name: "Bee Dash",
    description: "Marketing dashboard, numbers pulled in automatically.",
  },
  {
    name: "suamesafit",
    description: "Custom storefront, Shopify underneath.",
  },
] as const;

export function SelectedWork() {
  return (
    <section className="px-7 py-13 sm:py-16">
      <SectionHeading number="04" label="SELECTED WORK" />
      <div className="flex flex-col gap-px border border-border/60 bg-border/60">
        {PROJECTS.map((project) => (
          <div
            key={project.name}
            className="flex items-start gap-5 bg-background px-6 py-6"
          >
            <div className="hidden h-[84px] w-[130px] flex-none items-center justify-center border border-border/60 text-center font-mono text-[7px] text-muted-foreground/60 sm:flex">
              [ visual ]
            </div>
            <div>
              <h3 className="mb-1.5 font-sans text-[15px] text-foreground">
                {project.name}
              </h3>
              <p className="max-w-lg text-[11.5px] leading-[1.5] text-muted-foreground">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
