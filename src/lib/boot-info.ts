/**
 * What the boot lockup reports. `fastfetch` prints what a machine *is* rather
 * than pretending to load — these rows replaced five lines of fake progress
 * (`loading brand tokens ......... ok`) that measured nothing. They are copy:
 * they can go stale, and they live in one array so they stay as maintainable
 * as any other copy on the site (`TASK-boot-fastfetch-lockup.md`).
 *
 * `sound` and `status` are not here — `sound` is live state read from
 * `useSound()` at render, and `status` carries the blinking caret, so both are
 * assembled in the component.
 */
export interface BootFact {
  key: string;
  value: string;
}

export const BOOT_FACTS: readonly BootFact[] = [
  { key: "studio", value: "Blessed Moon Studio" },
  { key: "discipline", value: "Strategy · Design · Engineering" },
  { key: "stack", value: "Next.js · Tailwind · WebGL" },
  { key: "scene", value: "ASCII moon · 5 keyframes" },
  { key: "type", value: "Space Grotesk / JetBrains Mono" },
  { key: "accent", value: "#ff6a1f" },
];

/**
 * fastfetch closes on the terminal's ANSI palette. The honest translation is
 * this site's own tokens — the colours the page is actually built from — with
 * the one warm hue last after five cool ones, which is the whole palette
 * argument in a single row (`CLAUDE.md` §0, "surfaces are cool, the accent is
 * warm"). No second accent is introduced by this row.
 */
export const BOOT_SWATCHES: readonly { name: string; color: string }[] = [
  { name: "background", color: "var(--background)" },
  { name: "panel", color: "var(--panel)" },
  { name: "border", color: "var(--border)" },
  { name: "muted", color: "var(--muted-foreground)" },
  { name: "foreground", color: "var(--foreground)" },
  { name: "accent", color: "var(--primary)" },
];

/**
 * Column the `:` lands in, so every value starts at the same x. Mono, so this
 * is exact: `key` + a space + dot leader + `:` always totals this many chars.
 */
export const BOOT_KEY_COLUMN = 13;

export function bootLeader(key: string) {
  return ` ${".".repeat(Math.max(1, BOOT_KEY_COLUMN - key.length - 1))}`;
}
