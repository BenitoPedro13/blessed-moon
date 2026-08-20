interface ProjectVisualProps {
  title: string;
  variant:
    | "calendar"
    | "analytics"
    | "commerce"
    | "realestate"
    | "portfolio"
    | "geospatial"
    | "eyewear"
    | "furniture"
    | "rodizio";
}

const QUALIFICATION_STEPS = ["Renda", "Entrada", "Restrições", "Faixa MCMV", "Localidade", "Score"];

const TRANSITION_STATUS = [
  ["input", "1 wheel notch"],
  ["sync", "anchor matched"],
  ["morph", "webgl running"],
  ["walker", "15f gait"],
  ["route", "leaned + held"],
];

const SPECTRAL_LAYERS = [
  ["ndvi", true],
  ["ndmi", true],
  ["reci", true],
  ["mcari", true],
  ["pri (proxy)", true],
  ["plain ndvi", false],
] as const;

const CALENDAR_DAYS = ["M", "T", "W", "T", "F"];
const BAR_HEIGHTS = [32, 48, 40, 70, 58, 82, 64, 90];

const TENANCY_SEAM = [
  ["catálogo", true],
  ["numeração", true],
  ["wa.me link", true],
  ["tenancy seam", true],
  ["payload cms", false],
] as const;

const CATALOGO_RULES = [
  ["medida em cm", true],
  ["preço confirmado", true],
  ["wa.me único", true],
  ["shopify fora do seam", true],
  ["cms", false],
] as const;

const TRES_SAIDAS = [
  ["delivery", true],
  ["reserva", true],
  ["whatsapp", true],
  ["cardápio registrado", true],
  ["hora confirmada", false],
] as const;

export function ProjectVisual({ title, variant }: ProjectVisualProps) {
  return (
    <div className="relative min-h-72 overflow-hidden border border-panel-edge bg-panel p-3 font-mono backdrop-blur-sm sm:min-h-80">
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

      {variant === "realestate" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">unidade</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">
              Studio 32m²
            </p>
            <p className="mt-1 text-[7px] text-muted-foreground">Porto Maravilha, RJ</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">faixa indicativa</p>
              <p className="mt-1 text-[9px] text-primary">R$ 210.000</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>
              consultar disponibilidade
            </div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">pré-qualificação</p>
            <div className="mt-3 space-y-1.5">
              {QUALIFICATION_STEPS.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{step}</span>
                  <span className={index < 5 ? "text-primary" : "text-muted-foreground"}>
                    {index < 5 ? "[x]" : "[ ]"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">
              dentro da faixa 2
            </div>
          </div>
        </div>
      )}

      {variant === "portfolio" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">active_project</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">
              Casa 264
            </p>
            <p className="mt-1 text-[7px] text-muted-foreground">01 / 05 · 10 frames</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">surface</p>
              <p className="mt-1 text-[9px] text-primary">room · vinyl black</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>
              walker holding anchor
            </div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">transition</p>
            <div className="mt-3 space-y-1.5">
              {TRANSITION_STATUS.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{label}</span>
                  <span className="text-primary">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">
              project 02 / 05 queued
            </div>
          </div>
        </div>
      )}
      {variant === "geospatial" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">field_01</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">
              25.4 ac
            </p>
            <p className="mt-1 text-[7px] text-muted-foreground">15.9469°S / 48.6035°W</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">stress detected</p>
              <p className="mt-1 text-[9px] text-primary">20 zones</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>
              worker polling · request path idle
            </div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">layers / 4.667 pu</p>
            <div className="mt-3 space-y-1.5">
              {SPECTRAL_LAYERS.map(([label, available]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{label}</span>
                  <span className={available ? "text-primary" : "text-muted-foreground"}>
                    {available ? "[x]" : "[ ]"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">
              10 indices / 1 process call
            </div>
          </div>
        </div>
      )}
      {variant === "eyewear" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">armação / tri-ex-14</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">
              52 □ 18-145
            </p>
            <p className="mt-1 text-[7px] text-muted-foreground">aviador · titânio · bronze</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">foto</p>
              <p className="mt-1 text-[9px] text-primary">sem foto — honesto</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>
              nenhum valor inventado
            </div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">revendedores / 8</p>
            <div className="mt-3 space-y-1.5">
              {TENANCY_SEAM.map(([label, available]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{label}</span>
                  <span className={available ? "text-primary" : "text-muted-foreground"}>
                    {available ? "[x]" : "[ ]"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">
              one catalogue, many storefronts
            </div>
          </div>
        </div>
      )}
      {variant === "furniture" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">roupeiro mônaco plus</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">
              240 × 230 × 55
            </p>
            <p className="mt-1 text-[7px] text-muted-foreground">l × a × p, em cm reais</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">preço</p>
              <p className="mt-1 text-[9px] text-primary">R$ 3.073 à vista</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>
              10 de 13 com preço confirmado
            </div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">catálogo / 13</p>
            <div className="mt-3 space-y-1.5">
              {CATALOGO_RULES.map(([label, available]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{label}</span>
                  <span className={available ? "text-primary" : "text-muted-foreground"}>
                    {available ? "[x]" : "[ ]"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">
              da fábrica para a sua casa
            </div>
          </div>
        </div>
      )}
      {variant === "rodizio" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">rodízio chisai</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">
              <span className="text-muted-foreground line-through">R$ 74,90</span>{" "}
              <span className="text-primary">R$ 54,90</span>
            </p>
            <p className="mt-1 text-[7px] text-muted-foreground">sem desperdício — mesa toda</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">fotos usáveis</p>
              <p className="mt-1 text-[9px] text-primary">15 de 44, medidas</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>
              nenhum preço sem a condição
            </div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">saídas / 3</p>
            <div className="mt-3 space-y-1.5">
              {TRES_SAIDAS.map(([label, available]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{label}</span>
                  <span className={available ? "text-primary" : "text-muted-foreground"}>
                    {available ? "[x]" : "[ ]"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">
              coma tudo, pague menos
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
