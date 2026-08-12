import type { Metadata } from "next";

import { AsciiObject } from "@/components/canvasui/AsciiObject";
import { ParticleObject } from "@/components/canvasui/ParticleObject";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SoundToggle } from "@/components/sound-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/**
 * The design system, rendered with the real tokens and the real components —
 * not a description of them. Hidden rather than protected: unlinked and
 * noindex, nothing confidential lives here. See TASK-system-design-page.md.
 *
 * A shared component added without a panel here is an unfinished task
 * (CLAUDE.md §3.1).
 */

export const metadata: Metadata = {
  title: "System",
  robots: { index: false, follow: false },
};

const PALETTE = [
  { token: "--background", role: "Page background", className: "bg-background" },
  { token: "--foreground", role: "Primary text", className: "bg-foreground" },
  { token: "--primary", role: "Amber accent — action, emphasis", className: "bg-primary" },
  { token: "--muted-foreground", role: "Secondary text", className: "bg-muted-foreground" },
  { token: "--border", role: "Hairline rules", className: "bg-border" },
  { token: "--card", role: "Panel background", className: "bg-card" },
] as const;

const TYPE = [
  {
    sample: "Clarity is the feature.",
    className: "font-sans text-5xl font-semibold tracking-[-0.01em] text-primary uppercase",
    note: "Hero H1 · ~56–72px · font-sans uppercase",
  },
  {
    sample: "Built to last longer than the brief.",
    className: "font-sans text-2xl font-semibold tracking-[-0.01em] text-foreground",
    note: "Section H2 · ~26–32px · font-sans",
  },
  {
    sample: "We develop, design and execute advanced software programs.",
    className: "font-sans text-[13px] leading-[1.55] text-muted-foreground",
    note: "Body · ~12–14px · font-sans",
  },
  {
    sample: "05 / PRICING",
    className: "font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground uppercase",
    note: "Label · ~9.5–10.5px uppercase · font-mono, letter-spacing ~0.5–1.6px",
  },
] as const;

export default function SystemPage() {
  const agencyEmail = process.env.AGENCY_CONTACT_EMAIL?.trim() || null;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-16 px-7 py-20">
      <section className="space-y-3">
        <p className="font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground uppercase">
          Internal / hidden
        </p>
        <h1 className="font-sans text-3xl font-semibold tracking-[-0.01em] text-foreground">
          The system, rendered with its own parts.
        </h1>
        <p className="max-w-prose text-[13px] leading-[1.6] text-muted-foreground">
          Color, type, and components as they actually render, not as described in{" "}
          <code className="font-mono text-[12px] text-foreground/80">docs/design-handoff.md</code>.
          Used to confirm a new piece inherited the system instead of reinventing it, and as
          the sandbox for work in progress before it reaches a live page.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold tracking-[-0.01em] text-foreground">
          Palette
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PALETTE.map(({ token, role, className }) => (
            <li key={token} className="space-y-2">
              <span
                aria-hidden="true"
                className={`block h-14 border border-border/60 ${className}`}
              />
              <span className="block font-mono text-[10px] text-foreground">{token}</span>
              <span className="block text-[11px] text-muted-foreground">{role}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold tracking-[-0.01em] text-foreground">
          Typography
        </h2>
        <ul className="divide-y divide-border/60 border-y border-border/60">
          {TYPE.map(({ sample, className, note }) => (
            <li
              key={note}
              className="flex flex-col gap-1.5 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className={className}>{sample}</span>
              <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                {note}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold tracking-[-0.01em] text-foreground">
          Spacing &amp; radius
        </h2>
        <p className="max-w-prose text-[13px] leading-[1.6] text-muted-foreground">
          <code className="font-mono text-[12px] text-foreground/80">--radius: 0</code> site-wide
          — no rounded corners, anywhere, ever. Sections run ~52px vertical / 28px horizontal
          padding with 1px hairline rules between them.
        </p>
        <div className="h-14 w-full border border-primary/60" aria-hidden="true" />
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold tracking-[-0.01em] text-foreground">
          Primitives
        </h2>
        <div className="space-y-6 border border-border/60 bg-background/55 p-6 backdrop-blur-sm">
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-none bg-primary font-mono text-[10.5px] tracking-[0.6px] text-primary-foreground uppercase hover:bg-primary/85">
              Default
            </Button>
            <Button
              variant="outline"
              className="rounded-none border-primary font-mono text-[10.5px] tracking-[0.6px] text-primary uppercase hover:bg-primary hover:text-primary-foreground"
            >
              Outline
            </Button>
            <Button
              variant="ghost"
              className="rounded-none font-mono text-[10.5px] tracking-[0.6px] text-muted-foreground uppercase hover:text-primary"
            >
              Ghost
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              placeholder="Input field"
              className="h-11 rounded-none border-border/80 bg-background/55 px-3 font-sans text-[13px] placeholder:text-muted-foreground/55 focus-visible:ring-1"
            />
            <Select defaultValue="option-a">
              <SelectTrigger className="h-11 w-full rounded-none border-border/80 bg-background/55 px-3 font-sans text-[13px] focus-visible:ring-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" className="rounded-none border border-border bg-popover shadow-none">
                <SelectItem value="option-a" className="rounded-none font-sans text-[13px]">
                  Option A
                </SelectItem>
                <SelectItem value="option-b" className="rounded-none font-sans text-[13px]">
                  Option B
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            rows={3}
            placeholder="Textarea field"
            className="min-h-24 resize-y rounded-none border-border/80 bg-background/55 px-3 py-3 font-sans text-[13px] leading-[1.6] placeholder:text-muted-foreground/55 focus-visible:ring-1"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold tracking-[-0.01em] text-foreground">
          Composites
        </h2>
        <div className="space-y-6 border border-border/60 bg-background/55 p-6 backdrop-blur-sm">
          <SectionHeading number="00" label="SYSTEM" />
          <Reveal>
            <p className="max-w-sm text-[13px] leading-[1.55] text-muted-foreground">
              This paragraph is wrapped in <code className="font-mono text-[12px] text-foreground/80">Reveal</code> —
              scroll it in and out of view to see the blur/slide/spring entrance replay in
              both directions.
            </p>
          </Reveal>
          <div className="flex items-center gap-3">
            <SoundToggle />
            <span className="font-mono text-[10px] text-muted-foreground uppercase">
              Sound toggle
            </span>
          </div>
        </div>
        <div className="overflow-hidden border border-border/60">
          <SiteNav />
        </div>
        <div className="overflow-hidden border border-border/60">
          <SiteFooter />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold tracking-[-0.01em] text-foreground">
          Signature effects
        </h2>
        <p className="max-w-prose text-[13px] leading-[1.6] text-muted-foreground">
          The two canvas layers the whole site is built around: the ASCII-rendered moon
          (site-wide background) and the particle-reconstructed moon (closing CTA moment).
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <span className="block font-mono text-[10px] text-muted-foreground uppercase">
              AsciiObject
            </span>
            <div className="h-64 border border-border/60 bg-background">
              <AsciiObject
                src="/models/moon.glb"
                scale={3.2}
                cellSize={6}
                colored={false}
                color="#c9c7c0"
                contrast={2.2}
                edgeContrast={1.3}
                exposure={1.4}
                orbit={false}
                zoom={false}
                autoRotate
                autoRotateSpeed={1}
                floatIntensity={0.6}
                rotationIntensity={0.3}
                environmentIntensity={0.8}
                className="h-full w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <span className="block font-mono text-[10px] text-muted-foreground uppercase">
              ParticleObject
            </span>
            <div className="h-64 border border-border/60 bg-background">
              <ParticleObject
                src="/models/moon.glb"
                count={9000}
                size={1.8}
                scale={3.2}
                radius={140}
                strength={1.2}
                orbit={false}
                zoom={false}
                autoRotate
                autoRotateSpeed={1}
                floatIntensity={1.4}
                rotationIntensity={0.8}
                color="#ff6a1f"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold tracking-[-0.01em] text-foreground">
          Contact form
        </h2>
        <p className="max-w-prose text-[13px] leading-[1.6] text-muted-foreground">
          The real <code className="font-mono text-[12px] text-foreground/80">/contact</code> form
          component, not a mockup — it reflects whichever submit path is currently live
          (mailto vs. clipboard-copy fallback).
        </p>
        <div className="max-w-md border border-border/60 bg-background/55 p-6 backdrop-blur-sm">
          <ContactForm agencyEmail={agencyEmail} />
        </div>
      </section>
    </div>
  );
}
