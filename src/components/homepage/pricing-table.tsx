"use client";

import { useI18n } from "@/components/locale-provider";

import { motion } from "motion/react";
import Link from "@/components/localized-link";

import { COUNT_DISPLAY } from "@/components/homepage/morph-count";
import { MorphToken, morphDrift } from "@/components/scroll-morph-stage";
import { useSound } from "@/components/sound-provider";

const TIERS = [
  { name: "Landing Page / Website", href: null },
  { name: "Web App / Dashboard", href: null },
  { name: "Full product build", href: null },
  { name: "Social Media Strategy", href: "/services/social-media" },
] as const;

/**
 * Layer 4, and where the count lands: 8 → 4 → 3 → **1**. The token arrives as
 * the section's whole argument — one number, agreed up front — so the copy
 * doesn't have to assert restraint, the sequence has already demonstrated it.
 *
 * Deliberately the calm counterpoint: every other layer is louder, this one
 * is centered in generous space with no fixed figures (per
 * docs/design-handoff.md, pricing is confirmed on a call, never a rate card).
 * Negative space is the distinguishing move here, not more visual weight.
 */
export function PricingTable() {
  const { t } = useI18n();
  const { playHover } = useSound();

  return (
    <div className="text-center">
      {/* Untransformed: holds the arriving token. */}
      <p className="flex items-baseline justify-center gap-3">
        <MorphToken id="count-1" side="to" className={COUNT_DISPLAY}>
          1
        </MorphToken>
        <span className="font-sans text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">{t("number, agreed up front.")}</span>
      </p>

      <p
        className="mx-auto mt-6 max-w-md text-[14px] leading-[1.6] text-muted-foreground"
        style={morphDrift({ y: 44, order: 1 })}
      >{t("Priced like the work it actually is — project-based, confirmed on a call, and it does not move afterwards.")}</p>

      <div
        className="mt-10 short:mt-6 flex flex-col text-left sm:mt-12 short:sm:mt-8"
        style={morphDrift({ y: 52, order: 2 })}
      >
        {TIERS.map((tier, i) => (
          <motion.div
            key={tier.name}
            className={`-mx-4 flex items-baseline justify-between gap-4 px-4 py-4 short:py-2.5 text-[13px] ${
              i < TIERS.length - 1 ? "border-b border-border/60" : ""
            }`}
            initial={false}
            whileHover={{ backgroundColor: "var(--accent)", x: 4 }}
            onHoverStart={playHover}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="font-sans text-base text-foreground">{t(tier.href ? <Link href={tier.href} className="text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-primary">{t(tier.name)} →</Link> : tier.name)}</span>
            <span className="text-right text-muted-foreground">{t("range confirmed on call")}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
