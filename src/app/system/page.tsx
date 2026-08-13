import type { Metadata } from "next";

import { BootLockup } from "@/components/boot-sequence";
import { AsciiObject } from "@/components/canvasui/AsciiObject";
import { ParticleObject } from "@/components/canvasui/ParticleObject";
import { CellGrid } from "@/components/cell-grid";
import { ContactForm } from "@/components/contact-form";
import { COUNT_DISPLAY, COUNT_INLINE } from "@/components/homepage/morph-count";
import {
  TOKEN_DISPLAY,
  TOKEN_DISPLAY_WORD,
  TOKEN_INLINE,
} from "@/components/morph-tokens";
import { BorderGlow } from "@/components/react-bits/border-glow";
import { Counter } from "@/components/react-bits/counter";
import { LineSidebar } from "@/components/react-bits/line-sidebar";
import { ParticleText } from "@/components/react-bits/particle-text";
import { Reveal } from "@/components/reveal";
import { MorphToken, ScrollMorphStage } from "@/components/scroll-morph-stage";
import { ScrollStage } from "@/components/scroll-stage";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SoundToggle } from "@/components/sound-toggle";
import { TerminalPanel } from "@/components/terminal-panel";
import { FrameLoopReadout } from "./frame-loop-readout";
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
          Boot lockup + gate
        </h2>
        <p className="max-w-prose text-[13px] leading-[1.6] text-muted-foreground">
          The real <code className="font-mono text-[12px] text-foreground/80">BootLockup</code>,
          with a static copy of the gate beside it — the live{" "}
          <code className="font-mono text-[12px] text-foreground/80">BootSequence</code> runs
          full-viewport and locks body scroll, which would take over this page. A fastfetch
          lockup: our own pixel crescent at display size, drawn from the mark&apos;s outline path
          (<code className="font-mono text-[12px] text-foreground/80">LOGO_PATH</code>) rather than
          from block characters — JetBrains Mono&apos;s latin subset has none, and the fallbacks
          that do carry them disagree on width by up to 35%; facts that are true instead of a fake
          progress log; and the site&apos;s palette as the closing swatch row — five cool tokens,
          then the one warm accent. Every movement is CSS with{" "}
          <code className="font-mono text-[12px] text-foreground/80">animation-fill-mode: backwards</code>,
          so the base style is the finished state and a browser that never runs the animation
          still shows a complete screen. Leaving is choreographed too: the rows lift off, the
          swatches collapse warm-end first, the crescent expands into the moon behind, and only
          then does the plate dissolve. See{" "}
          <code className="font-mono text-[12px] text-foreground/80">TASK-boot-fastfetch-lockup.md</code>{" "}
          / <code className="font-mono text-[12px] text-foreground/80">TASK-boot-sequence-gate.md</code>;
          to see it live, reload any real page (it runs once per load, respects{" "}
          <code className="font-mono text-[12px] text-foreground/80">prefers-reduced-motion</code> by
          skipping straight through).
        </p>
        <div className="flex flex-col items-center gap-8 border border-border/60 bg-background px-7 py-10">
          <BootLockup muted />
          <div className="flex w-full max-w-[660px] flex-col gap-5 border-t border-border/60 pt-6 font-mono text-[11px]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-muted-foreground">enable sound for the full experience?</span>
              <span className="border border-primary/60 px-3 py-1.5 text-primary uppercase tracking-[0.06em]">
                enable sound
              </span>
              <span className="border border-border/60 px-3 py-1.5 text-muted-foreground uppercase tracking-[0.06em]">
                continue muted
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">scroll to begin</span>
              <span className="inline-flex items-center gap-2 border border-primary/60 px-4 py-2 text-primary uppercase tracking-[0.06em]">
                begin <span aria-hidden="true">↓</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold tracking-[-0.01em] text-foreground">
          Scroll stage
        </h2>
        <p className="max-w-prose text-[13px] leading-[1.6] text-muted-foreground">
          Pins content for a scroll range via <code className="font-mono text-[12px] text-foreground/80">position: sticky</code>{" "}
          (no scroll-jacking), exposing progress as <code className="font-mono text-[12px] text-foreground/80">--stage-progress</code>{" "}
          for children to read. Scroll through this panel — the number fades/scales as the
          pin plays out. Used site-wide now (Hero, PageHero, every homepage section below
          Hero) — see <code className="font-mono text-[12px] text-foreground/80">TASK-apple-scroll-journey.md</code> /{" "}
          <code className="font-mono text-[12px] text-foreground/80">TASK-homepage-unify-scroll.md</code>. The{" "}
          <code className="font-mono text-[12px] text-foreground/80">particles</code> prop below is the
          ParticleScroll replacement — an ambient dissolve texture, not DOM capture (see
          scroll-particles.tsx); density peaks as the section arrives/leaves, thins out once
          it&apos;s fully legible.
        </p>
        <div className="border border-border/60">
          <ScrollStage heightMultiplier={1.4} particles>
            <div
              style={{
                opacity: "calc(1 - var(--stage-progress, 0))",
                transform: "scale(calc(1 - var(--stage-progress, 0) * 0.2))",
              }}
              className="text-center font-mono text-4xl text-primary"
            >
              --stage-progress
            </div>
          </ScrollStage>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold tracking-[-0.01em] text-foreground">
          Terminal panel + cell grid
        </h2>
        <p className="max-w-prose text-[13px] leading-[1.6] text-muted-foreground">
          The homepage body&apos;s &ldquo;clothes.&rdquo; Sections used to be unbounded text
          on a drifting particle field — no surface, no edge, and a{" "}
          <code className="font-mono text-[12px] text-foreground/80">01 / ABOUT</code> eyebrow
          floating above the headline doing no structural work. The panel is a translucent
          blurred window whose title bar carries that eyebrow, which is what finally gives
          the number a job. <code className="font-mono text-[12px] text-foreground/80">CellGrid</code>{" "}
          is the ground behind it: one monospace character cell, 1:2 not square, because a
          square grid is graph paper and a 1:2 cell is what a terminal is made of. The blur
          is load-bearing — body copy sits over a live WebGL moon and would otherwise land on
          moving glyph texture. Never give the panel{" "}
          <code className="font-mono text-[12px] text-foreground/80">overflow: hidden</code>: a
          morph token spends most of its flight mounted in the destination panel while still
          positioned over the origin, far outside that panel&apos;s bounds.
        </p>
        <div className="relative space-y-6 overflow-hidden border border-border/60 bg-background p-8">
          <CellGrid />
          <TerminalPanel
            number="00"
            label="EXAMPLE"
            status="local draft"
            className="relative max-w-lg"
          >
            <p className="text-[15.5px] leading-[1.65] text-foreground/75">
              Lead tier — brighter and a step larger than the supporting line.
            </p>
            <p className="mt-3 text-[13.5px] leading-[1.6] text-muted-foreground">
              Supporting tier. Body copy used to be binary between near-white and 55% grey,
              which reads flat however good the words are.
            </p>
          </TerminalPanel>
          <TerminalPanel
            number="01"
            label="ROWS"
            status="live"
            padded={false}
            className="relative max-w-lg"
          >
            <div className="border-b border-border/60 px-5 py-4 text-[13px] text-muted-foreground">
              <code className="font-mono text-[12px] text-foreground/80">padded={"{false}"}</code>{" "}
              for a body of full-bleed rows that own their padding.
            </div>
            <div className="px-5 py-4 text-[13px] text-muted-foreground">
              Not a <code className="font-mono text-[12px] text-foreground/80">bodyClassName</code>{" "}
              override — Tailwind resolves conflicts by stylesheet order, not attribute order,
              so <code className="font-mono text-[12px] text-foreground/80">p-0</code> would not
              reliably beat the body padding.
            </div>
          </TerminalPanel>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold tracking-[-0.01em] text-foreground">
          Morph token type scale
        </h2>
        <p className="max-w-prose text-[13px] leading-[1.6] text-muted-foreground">
          Three pages run a{" "}
          <code className="font-mono text-[12px] text-foreground/80">ScrollMorphStage</code>, and
          they share this type language but not a motif. An amber glyph at display size means
          one thing everywhere: <em>this is the object in flight</em>. What travels is chosen
          per page — <code className="font-mono text-[12px] text-foreground/80">/</code> counts{" "}
          8 → 4 → 3 → 1 (breadth narrowing to one commitment),{" "}
          <code className="font-mono text-[12px] text-foreground/80">/work</code> travels the
          project name (the row you pick becomes the page), and{" "}
          <code className="font-mono text-[12px] text-foreground/80">/about</code> travels{" "}
          A → B → 0 (two pillars, zero layers between). Copying the count onto all three would
          have been the same trick with meaning only the first time. Amber&apos;s other job —
          small, on a control, meaning <em>interactive</em> — must never land on the same glyph.
        </p>
        <div className="flex flex-wrap items-baseline gap-x-10 gap-y-6 border border-border/60 bg-background px-8 py-8">
          <div>
            <p className="mb-3 font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground">
              TOKEN_INLINE
            </p>
            <p className="text-[13.5px] leading-[2.1] text-muted-foreground">
              in a sentence, <span className={TOKEN_INLINE}>4</span> steps
            </p>
          </div>
          <div>
            <p className="mb-3 font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground">
              TOKEN_DISPLAY
            </p>
            <span className={TOKEN_DISPLAY}>4</span>
          </div>
          <div>
            <p className="mb-3 font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground">
              TOKEN_DISPLAY_WORD
            </p>
            <span className={TOKEN_DISPLAY_WORD}>Markado</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold tracking-[-0.01em] text-foreground">
          Scroll morph stage
        </h2>
        <p className="max-w-prose text-[13px] leading-[1.6] text-muted-foreground">
          What <code className="font-mono text-[12px] text-foreground/80">ScrollStage</code> can&apos;t
          do: two of its pins are never simultaneously on screen, so nothing can travel
          between them. This mounts every layer at once in ONE sticky frame and crossfades
          between them, which makes a real shared-element handoff possible —{" "}
          <code className="font-mono text-[12px] text-foreground/80">MorphToken</code> declares the
          same <code className="font-mono text-[12px] text-foreground/80">layoutId</code> on both
          sides of a boundary, and Motion interpolates its position and size across. Scroll
          through: the numeral flies from inside the sentence up to display size, and back
          on the way up. Drives the whole homepage body (
          <code className="font-mono text-[12px] text-foreground/80">TASK-homepage-morph-redesign.md</code>).
          Two rules for layer content — a layer animates opacity only (a transformed
          ancestor makes Motion&apos;s measurement drift mid-flight), and{" "}
          <code className="font-mono text-[12px] text-foreground/80">Reveal</code> doesn&apos;t work
          in here (every layer is permanently in the viewport, so{" "}
          <code className="font-mono text-[12px] text-foreground/80">whileInView</code> can&apos;t fire
          per layer); use <code className="font-mono text-[12px] text-foreground/80">morphDrift()</code>{" "}
          instead.
        </p>
        <div className="border border-border/60">
          <ScrollMorphStage
            heightPerLayer={1.4}
            layers={[
              {
                number: "00",
                keyframe: 0,
                width: 420,
                label: "SYSTEM DEMO A",
                content: (
                  <div className="px-8 text-center">
                    <p className="text-[14px] leading-[1.75] text-muted-foreground">
                      A sentence that happens to contain{" "}
                      <MorphToken id="system-demo-token" side="from" className={COUNT_INLINE}>
                        8
                      </MorphToken>{" "}
                      of something.
                    </p>
                  </div>
                ),
              },
              {
                number: "00",
                keyframe: 0,
                width: 560,
                label: "SYSTEM DEMO B",
                content: (
                  <div className="flex items-end justify-center gap-3 px-8">
                    <MorphToken id="system-demo-token" side="to" className={COUNT_DISPLAY}>
                      8
                    </MorphToken>
                    <span className="pb-1.5 font-sans text-xl font-semibold tracking-[-0.02em] text-foreground">
                      of something.
                    </span>
                  </div>
                ),
              },
            ]}
          />
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
          React Bits candidates
        </h2>
        <p className="max-w-prose text-[13px] leading-[1.6] text-muted-foreground">
          Under review, not yet on a live page — restyled to brand tokens (sharp corners,
          single-hue amber) from{" "}
          <a
            href="https://github.com/DavidHDev/react-bits"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-2"
          >
            React Bits
          </a>
          . See <code className="font-mono text-[12px] text-foreground/80">TASK-react-bits-mcp-registry.md</code>.
        </p>
        <div className="space-y-2">
          <span className="block font-mono text-[10px] text-muted-foreground uppercase">
            ParticleText — hero headline candidate (hover to re-gather)
          </span>
          <div className="h-56 border border-border/60 bg-background">
            <ParticleText
              text="Clarity is the feature."
              trigger="hover"
              fontSize="clamp(1.5rem, 5vw, 3rem)"
              fontWeight={600}
              density={1}
              densityDivisor={28}
              particleSize={2.6}
            />
          </div>
        </div>
        <div className="space-y-2">
          <span className="block font-mono text-[10px] text-muted-foreground uppercase">
            BorderGlow — unified card-hover candidate (move cursor across each)
          </span>
          <div className="grid gap-4 sm:grid-cols-2">
            <BorderGlow>
              <div className="p-6">
                <span className="mb-2.5 block font-mono text-[9.5px] text-muted-foreground/70">01</span>
                <span className="mb-1.5 block font-sans text-sm text-foreground">Web Apps</span>
                <span className="block text-[11px] leading-[1.5] text-muted-foreground">
                  Full-stack products, built to handle real traffic and real edge cases.
                </span>
              </div>
            </BorderGlow>
            <BorderGlow animated>
              <div className="p-6">
                <span className="mb-2.5 block font-mono text-[9.5px] text-muted-foreground/70">02</span>
                <span className="mb-1.5 block font-sans text-sm text-foreground">Mobile Apps</span>
                <span className="block text-[11px] leading-[1.5] text-muted-foreground">
                  animated — plays the sweep once on mount, then behaves like the first card.
                </span>
              </div>
            </BorderGlow>
          </div>
        </div>
        <div className="space-y-2">
          <span className="block font-mono text-[10px] text-muted-foreground uppercase">
            LineSidebar — candidate, not on a live page (tried as a site-wide section indicator, removed — felt strange in place)
          </span>
          <div className="border border-border/60 bg-background px-10 py-8">
            <LineSidebar
              items={["Hero", "About", "Services", "Selected Work", "Pricing"]}
              defaultActive={0}
              showIndex
              showMarker
              fontSize={0.85}
              itemGap={16}
              markerLength={36}
              className="font-mono uppercase tracking-[0.06em]"
              aria-label="Section navigation demo"
            />
          </div>
        </div>
        <div className="space-y-2">
          <span className="block font-mono text-[10px] text-muted-foreground uppercase">
            Counter — used by How We Work (odometer digit-roll, refresh to re-see it)
          </span>
          <div className="flex gap-8 border border-border/60 bg-background px-10 py-8">
            <Counter
              value={7}
              places={[10, 1]}
              fontSize={72}
              textColor="var(--primary)"
              fontWeight={600}
              gap={0}
              horizontalPadding={0}
              gradientHeight={0}
              containerStyle={{ fontFamily: "var(--font-mono)" }}
            />
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

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold tracking-[-0.01em] text-foreground">
          Frame loop
        </h2>
        <p className="max-w-prose text-[13px] leading-[1.6] text-muted-foreground">
          Every scroll-driven component on the site shares one{" "}
          <code className="font-mono text-[12px] text-foreground/80">requestAnimationFrame</code>{" "}
          via <code className="font-mono text-[12px] text-foreground/80">frame-loop.ts</code>, which
          runs all <em>read</em> callbacks before any <em>write</em> callback. Seven components
          previously owned a loop each and interleaved their layout reads with each other&apos;s
          style writes, forcing the browser to recalculate layout several times per frame. The
          numbers below are live — this panel is itself a subscriber.
        </p>
        <FrameLoopReadout />
        <p className="max-w-prose text-[13px] leading-[1.6] text-muted-foreground">
          Adding a scroll-driven component means subscribing here rather than calling{" "}
          <code className="font-mono text-[12px] text-foreground/80">requestAnimationFrame</code>{" "}
          directly, and splitting its work at the read/write boundary. See{" "}
          <code className="font-mono text-[12px] text-foreground/80">
            docs/tasks/TASK-frame-budget-cleanup.md
          </code>{" "}
          — including how to profile this site without fooling yourself, which took two false
          results to learn.
        </p>
      </section>
    </div>
  );
}
