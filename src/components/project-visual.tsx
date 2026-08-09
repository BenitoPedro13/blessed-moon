interface ProjectVisualProps {
  title: string;
  variant: "calendar" | "analytics" | "commerce";
}

const CALENDAR_DAYS = ["M", "T", "W", "T", "F"];
const BAR_HEIGHTS = [32, 48, 40, 70, 58, 82, 64, 90];

export function ProjectVisual({ title, variant }: ProjectVisualProps) {
  return (
    <div className="relative min-h-72 overflow-hidden border border-primary/30 bg-background/80 p-3 font-mono backdrop-blur-sm sm:min-h-80">
      <div className="flex items-center justify-between border-b border-border/60 pb-2 text-[8px] tracking-[0.12em] text-muted-foreground uppercase">
        <span>{title.toLowerCase().replaceAll(" ", "_")}.sys</span>
        <span className="text-primary">● online</span>
      </div>

      {variant === "calendar" && (
        <div className="grid h-[250px] grid-cols-[0.72fr_1.28fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">availability</p>
            <p className="mt-3 font-sans text-2xl font-semibold tracking-[-0.04em] text-foreground">
              30 min
            </p>
            <div className="mt-5 space-y-2">
              {["Calendar linked", "Payment ready", "Meet enabled"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[8px] text-muted-foreground">
                  <span className="text-primary">[x]</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="border border-border/60 p-3">
            <div className="grid grid-cols-5 gap-1 text-center text-[7px] text-muted-foreground">
              {CALENDAR_DAYS.map((day, index) => (
                <span key={`${day}-${index}`}>{day}</span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-5 gap-1">
              {Array.from({ length: 20 }, (_, index) => (
                <span
                  key={index}
                  className={`flex aspect-square items-center justify-center border text-[7px] ${
                    [7, 13, 17].includes(index)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/50 text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1 text-center text-[7px]">
              <span className="border border-primary/60 py-2 text-primary">14:00</span>
              <span className="border border-border/60 py-2 text-muted-foreground">14:30</span>
            </div>
          </div>
        </div>
      )}

      {variant === "analytics" && (
        <div className="h-[250px] pt-3 sm:h-[282px]">
          <div className="grid grid-cols-3 gap-2">
            {[
              ["reach", "2.8m"],
              ["engagement", "8.4%"],
              ["active", "24"],
            ].map(([label, value]) => (
              <div key={label} className="border border-border/60 p-3">
                <p className="text-[7px] text-muted-foreground uppercase">{label}</p>
                <p className="mt-2 font-sans text-lg font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 flex h-[166px] items-end gap-2 border border-border/60 p-4">
            {BAR_HEIGHTS.map((height, index) => (
              <div key={index} className="flex h-full flex-1 items-end">
                <span
                  className="block w-full border-t border-primary bg-primary/20"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === "commerce" && (
        <div className="grid h-[250px] grid-cols-[1.35fr_0.65fr] gap-3 pt-3 sm:h-[282px]">
          <div className="grid grid-cols-2 gap-2">
            {["01", "02", "03", "04"].map((index) => (
              <div key={index} className="border border-border/60 p-2">
                <div className="flex h-16 items-center justify-center bg-primary/8 text-2xl text-primary/70">
                  ◇
                </div>
                <div className="mt-2 h-px w-4/5 bg-foreground/40" />
                <div className="mt-1.5 h-px w-2/5 bg-muted-foreground/40" />
                <p className="mt-2 text-[7px] text-primary">R$ {index}9,90</p>
              </div>
            ))}
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">cart / 03</p>
            <div className="mt-4 space-y-3">
              {["Meal plan", "Protein box", "Juice set"].map((item, index) => (
                <div key={item} className="border-b border-border/60 pb-2 text-[7px] text-muted-foreground">
                  <span className="block text-foreground">{item}</span>
                  <span>qty 0{index + 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-[7px] text-foreground">
              <span>shipping</span>
              <span className="text-primary">calculated</span>
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">
              checkout
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
