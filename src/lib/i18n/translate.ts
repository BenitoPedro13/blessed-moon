import portuguese from "./pt.json";
import type { Locale } from "./shared";

const dictionary: Readonly<Record<string, string>> = portuguese;

export function translator(locale: Locale) {
  return function t<T>(value: T): T {
    if (locale !== "pt" || typeof value !== "string") return value;
    const key = value.replace(/\s+/g, " ").trim();
    const translated = dictionary[key]
      ?? (/^(\d+) systems, still running\.$/.test(key) ? key.replace(/^(\d+) systems, still running\.$/, "$1 sistemas em funcionamento.") : undefined)
      ?? (/^(\d+) of (\d+) shown\. All (\d+) below, in full\.$/.test(key) ? key.replace(/^(\d+) of (\d+) shown\. All (\d+) below, in full\.$/, "$1 de $2 exibidos. Os $3 estão detalhados abaixo.") : undefined)
      ?? (/^— Case study (\d+)$/.test(key) ? key.replace(/^— Case study (\d+)$/, "— Projeto $1") : undefined)
      ?? (/^View (.+) case study$/.test(key) ? key.replace(/^View (.+) case study$/, "Ver o projeto $1") : undefined)
      ?? (/^(.+) website walkthrough$/.test(key) ? key.replace(/^(.+) website walkthrough$/, "Vídeo do site $1") : undefined)
      ?? (/^(.+) screenshot$/.test(key) ? key.replace(/^(.+) screenshot$/, "Captura de $1") : undefined)
      ?? (/^PILLAR ([AB])$/.test(key) ? key.replace(/^PILLAR ([AB])$/, "PILAR $1") : undefined)
      ?? (/^Too many attempts\. Please wait about (\d+) minutes?, then try again\.$/.test(key) ? key.replace(/^Too many attempts\. Please wait about (\d+) minutes?, then try again\.$/, "Muitas tentativas. Aguarde cerca de $1 min e tente novamente.") : undefined)
      ?? (key.includes(" · ") ? key.split(" · ").map(part => dictionary[part] ?? part).join(" · ") : undefined);
    if (translated === undefined) return value;
    return `${value.match(/^\s*/)?.[0] ?? ""}${translated}${value.match(/\s*$/)?.[0] ?? ""}` as T;
  };
}
