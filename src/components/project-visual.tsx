"use client";

import { useI18n } from "@/components/locale-provider";

interface ProjectVisualProps {
  title: string;
  variant:
    | "calendar"
    | "analytics"
    | "commerce"
    | "realestate"
    | "portfolio"
    | "photography"
    | "geospatial"
    | "eyewear"
    | "furniture"
    | "rodizio"
    | "fairs"
    | "language"
    | "grid"
    | "election"
    | "lesson";
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

const FAIR_ENGINE = [
  ["tour record", true],
  ["fixed sections", true],
  ["live quote", true],
  ["quote frozen", true],
  ["cookie banner", false],
] as const;

const LOCALES = [
  ["pt · /metodo", true],
  ["en · /en/method", true],
  ["es · /es/metodo", true],
  ["gsap + lenis", true],
  ["webgl", false],
] as const;

const GRID_SOURCES = [
  ["ons · brazil", true],
  ["entso-e · europe", true],
  ["eia · usa", true],
  ["dead-letter queue", true],
  ["synthetic data", false],
] as const;

const TRES_SAIDAS = [
  ["delivery", true],
  ["reserva", true],
  ["whatsapp", true],
  ["cardápio registrado", true],
  ["hora confirmada", false],
] as const;

const TSE_RECORD = [
  ["signed .jws kept", true],
  ["sha256-addressed", true],
  ["views rebuilt from log", true],
  ["cdn-only readers", true],
  ["projections", false],
] as const;

const LESSON_OUTPUTS = [
  ["16:9 slides pdf", true],
  ["a4 handout pdf", true],
  [".dove.json file", true],
  ["indexeddb drafts", true],
  ["accounts", false],
] as const;

export function ProjectVisual({ title, variant }: ProjectVisualProps) {
  const { t } = useI18n();
  return (
    <div className="relative min-h-72 overflow-hidden border border-panel-edge bg-panel p-3 font-mono backdrop-blur-sm sm:min-h-80">
      <div className="flex items-center justify-between border-b border-border/60 pb-2 text-[8px] tracking-[0.12em] text-muted-foreground uppercase">
        <span>{title.toLowerCase().replaceAll(" ", "_")}{t(".sys")}</span>
        <span className="text-primary">{t("● online")}</span>
      </div>

      {variant === "calendar" && (
        <div className="grid h-[250px] grid-cols-[0.72fr_1.28fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">{t("availability")}</p>
            <p className="mt-3 font-sans text-2xl font-semibold tracking-[-0.04em] text-foreground">{t("30 min")}</p>
            <div className="mt-5 space-y-2">
              {["Calendar linked", "Payment ready", "Meet enabled"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[8px] text-muted-foreground">
                  <span className="text-primary">{t("[x]")}</span>
                  {t(item)}
                </div>
              ))}
            </div>
          </div>
          <div className="border border-border/60 p-3">
            <div className="grid grid-cols-5 gap-1 text-center text-[7px] text-muted-foreground">
              {CALENDAR_DAYS.map((day, index) => (
                <span key={`${day}-${index}`}>{t(day)}</span>
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
                <p className="text-[7px] text-muted-foreground uppercase">{t(label)}</p>
                <p className="mt-2 font-sans text-lg font-semibold text-foreground">{t(value)}</p>
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
                <p className="mt-2 text-[7px] text-primary">{t("R$ ")}{t(index)}9,90</p>
              </div>
            ))}
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">{t("cart / 03")}</p>
            <div className="mt-4 space-y-3">
              {["Meal plan", "Protein box", "Juice set"].map((item, index) => (
                <div key={item} className="border-b border-border/60 pb-2 text-[7px] text-muted-foreground">
                  <span className="block text-foreground">{t(item)}</span>
                  <span>{t("qty 0")}{index + 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-[7px] text-foreground">
              <span>{t("shipping")}</span>
              <span className="text-primary">{t("calculated")}</span>
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">{t("checkout")}</div>
          </div>
        </div>
      )}

      {variant === "realestate" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">{t("unidade")}</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">{t("Studio 32m²")}</p>
            <p className="mt-1 text-[7px] text-muted-foreground">{t("Porto Maravilha, RJ")}</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">{t("faixa indicativa")}</p>
              <p className="mt-1 text-[9px] text-primary">{t("R$ 210.000")}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>{t("consultar disponibilidade")}</div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">{t("pré-qualificação")}</p>
            <div className="mt-3 space-y-1.5">
              {QUALIFICATION_STEPS.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{t(step)}</span>
                  <span className={index < 5 ? "text-primary" : "text-muted-foreground"}>
                    {t(index < 5 ? "[x]" : "[ ]")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">{t("dentro da faixa 2")}</div>
          </div>
        </div>
      )}

      {variant === "photography" && (
        <div className="grid min-h-[250px] content-center gap-4 pt-3 sm:min-h-[282px]">
          {[
            ["01 · opening", "ribbons → butterfly → lily"],
            ["02 · gallery", "photographs → palette → painted ground"],
            ["03 · publishing", "Payload → cached pages → CDN"],
          ].map(([label, detail]) => (
            <div key={label} className="border border-border/60 p-4">
              <p className="text-[8px] text-primary uppercase">{t(label)}</p>
              <p className="mt-2 text-[9px] text-muted-foreground">{t(detail)}</p>
            </div>
          ))}
        </div>
      )}

      {variant === "portfolio" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">{t("active_project")}</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">{t("Casa 264")}</p>
            <p className="mt-1 text-[7px] text-muted-foreground">{t("01 / 05 · 10 frames")}</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">{t("surface")}</p>
              <p className="mt-1 text-[9px] text-primary">{t("room · vinyl black")}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>{t("walker holding anchor")}</div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">{t("transition")}</p>
            <div className="mt-3 space-y-1.5">
              {TRANSITION_STATUS.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{t(label)}</span>
                  <span className="text-primary">{t(value)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">{t("project 02 / 05 queued")}</div>
          </div>
        </div>
      )}
      {variant === "geospatial" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">{t("field_01")}</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">{t("25.4 ac")}</p>
            <p className="mt-1 text-[7px] text-muted-foreground">{t("15.9469°S / 48.6035°W")}</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">{t("stress detected")}</p>
              <p className="mt-1 text-[9px] text-primary">{t("20 zones")}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>{t("worker polling · request path idle")}</div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">{t("layers / 4.667 pu")}</p>
            <div className="mt-3 space-y-1.5">
              {SPECTRAL_LAYERS.map(([label, available]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{t(label)}</span>
                  <span className={available ? "text-primary" : "text-muted-foreground"}>
                    {t(available ? "[x]" : "[ ]")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">{t("10 indices / 1 process call")}</div>
          </div>
        </div>
      )}
      {variant === "eyewear" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">{t("armação / tri-ex-14")}</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">
              52 □ 18-145
            </p>
            <p className="mt-1 text-[7px] text-muted-foreground">{t("aviador · titânio · bronze")}</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">{t("foto")}</p>
              <p className="mt-1 text-[9px] text-primary">{t("sem foto — honesto")}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>{t("nenhum valor inventado")}</div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">{t("revendedores / 8")}</p>
            <div className="mt-3 space-y-1.5">
              {TENANCY_SEAM.map(([label, available]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{t(label)}</span>
                  <span className={available ? "text-primary" : "text-muted-foreground"}>
                    {t(available ? "[x]" : "[ ]")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">{t("one catalogue, many storefronts")}</div>
          </div>
        </div>
      )}
      {variant === "furniture" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">{t("roupeiro mônaco plus")}</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">
              240 × 230 × 55
            </p>
            <p className="mt-1 text-[7px] text-muted-foreground">{t("l × a × p, em cm reais")}</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">{t("preço")}</p>
              <p className="mt-1 text-[9px] text-primary">{t("R$ 3.073 à vista")}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>{t("10 de 13 com preço confirmado")}</div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">{t("catálogo / 13")}</p>
            <div className="mt-3 space-y-1.5">
              {CATALOGO_RULES.map(([label, available]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{t(label)}</span>
                  <span className={available ? "text-primary" : "text-muted-foreground"}>
                    {t(available ? "[x]" : "[ ]")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">{t("da fábrica para a sua casa")}</div>
          </div>
        </div>
      )}
      {variant === "rodizio" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">{t("rodízio chisai")}</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">
              <span className="text-muted-foreground line-through">{t("R$ 74,90")}</span>{t(" ")}
              <span className="text-primary">{t("R$ 54,90")}</span>
            </p>
            <p className="mt-1 text-[7px] text-muted-foreground">{t("sem desperdício — mesa toda")}</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">{t("fotos usáveis")}</p>
              <p className="mt-1 text-[9px] text-primary">{t("15 de 44, medidas")}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>{t("nenhum preço sem a condição")}</div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">{t("saídas / 3")}</p>
            <div className="mt-3 space-y-1.5">
              {TRES_SAIDAS.map(([label, available]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{t(label)}</span>
                  <span className={available ? "text-primary" : "text-muted-foreground"}>
                    {t(available ? "[x]" : "[ ]")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">{t("coma tudo, pague menos")}</div>
          </div>
        </div>
      )}
      {variant === "fairs" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">{t("ebeuf 2027 / tour")}</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">{t("4 cities · 16–20 mar")}</p>
            <p className="mt-1 text-[7px] text-muted-foreground">{t("skopje · pristina · podgorica · sarajevo")}</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">{t("registration")}</p>
              <p className="mt-1 text-[9px] text-primary">{t("persisted + emailed")}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>{t("quote in integer cents")}</div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">{t("event engine")}</p>
            <div className="mt-3 space-y-1.5">
              {FAIR_ENGINE.map(([label, available]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{t(label)}</span>
                  <span className={available ? "text-primary" : "text-muted-foreground"}>
                    {t(available ? "[x]" : "[ ]")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">{t("one record, one standard page")}</div>
          </div>
        </div>
      )}
      {variant === "language" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">{t("outubro / hero")}</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">{t("destravar")}</p>
            <p className="mt-1 text-[7px] text-muted-foreground">{t("the cord untangles, língua lands")}</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">{t("locales")}</p>
              <p className="mt-1 text-[9px] text-primary">{t("pt · en · es")}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>{t("one route map, no i18n library")}</div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">{t("pages / 3 locales")}</p>
            <div className="mt-3 space-y-1.5">
              {LOCALES.map(([label, available]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{t(label)}</span>
                  <span className={available ? "text-primary" : "text-muted-foreground"}>
                    {t(available ? "[x]" : "[ ]")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">{t("bora destravar")}</div>
          </div>
        </div>
      )}
      {variant === "grid" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">{t("ons / plant-hour")}</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">{t("366,336 readings")}</p>
            <p className="mt-1 text-[7px] text-muted-foreground">{t("zero duplicates on replay")}</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">{t("idempotency key")}</p>
              <p className="mt-1 text-[9px] text-primary">{t("source · zone · asset · metric · time")}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>{t("polled, said plainly")}</div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">{t("sources / 3")}</p>
            <div className="mt-3 space-y-1.5">
              {GRID_SOURCES.map(([label, available]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{t(label)}</span>
                  <span className={available ? "text-primary" : "text-muted-foreground"}>
                    {t(available ? "[x]" : "[ ]")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">{t("go → redpanda → timescale")}</div>
          </div>
        </div>
      )}
      {variant === "election" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">{t("tse / 1º turno")}</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">{t("5,757 municipalities")}</p>
            <p className="mt-1 text-[7px] text-muted-foreground">{t("every version, byte for byte")}</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">{t("rate ceiling")}</p>
              <p className="mt-1 text-[9px] text-primary">{t("100 req/s · 16 in flight")}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>{t("a gap shows as a gap")}</div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">{t("raw log / s3")}</p>
            <div className="mt-3 space-y-1.5">
              {TSE_RECORD.map(([label, available]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{t(label)}</span>
                  <span className={available ? "text-primary" : "text-muted-foreground"}>
                    {t(available ? "[x]" : "[ ]")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">{t("recorder → s3 → projector → cdn")}</div>
          </div>
        </div>
      )}
      {variant === "lesson" && (
        <div className="grid h-[250px] grid-cols-[0.85fr_1.15fr] gap-3 pt-3 sm:h-[282px]">
          <div className="border border-border/60 p-3">
            <p className="text-[8px] text-primary uppercase">{t("lesson / a1–a2")}</p>
            <p className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-foreground">{t("58 slides → blocks")}</p>
            <p className="mt-1 text-[7px] text-muted-foreground">{t("the layout follows the system")}</p>
            <div className="mt-5 border-t border-border/60 pt-3">
              <p className="text-[7px] text-muted-foreground uppercase">{t("airmail devices")}</p>
              <p className="mt-1 text-[9px] text-primary">{t("flight path · stamp · postmark · paper")}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[7px] text-muted-foreground">
              <span className="text-primary">●</span>{t("faster than canva or unused")}</div>
          </div>
          <div className="border border-primary/40 p-3">
            <p className="text-[8px] text-primary uppercase">{t("outputs / one renderer")}</p>
            <div className="mt-3 space-y-1.5">
              {LESSON_OUTPUTS.map(([label, available]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border/50 pb-1 text-[7px] text-muted-foreground"
                >
                  <span>{t(label)}</span>
                  <span className={available ? "text-primary" : "text-muted-foreground"}>
                    {t(available ? "[x]" : "[ ]")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary py-2 text-center text-[7px] text-primary-foreground uppercase">{t("type a lesson, get a deck")}</div>
          </div>
        </div>
      )}
    </div>
  );
}
