import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { TerminalPanel } from "@/components/terminal-panel";
import { PLAN_DATE, PLAN_LINKS } from "@/lib/social-plan";
import { SITE_URL } from "@/lib/site-config";

export const PLAN_TEXT = "text-sm leading-7 text-foreground/75";
export const PLAN_LINK = "text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-primary";

export function planMetadata(title: string, path: string, description: string): Metadata {
  return {
    title, description, robots: { index: false, follow: false },
    alternates: { canonical: path },
    openGraph: { title, description, url: `${SITE_URL}${path}`, siteName: "Blessed Moon Studio", type: "website" },
  };
}

export function PlanNav({ active }: { active: string }) {
  return (
    <nav aria-label="Social planning pages" className="flex flex-wrap gap-2">
      {PLAN_LINKS.map((link) => (
        <Link key={link.href} href={link.href} aria-current={active === link.href ? "page" : undefined}
          className={`border px-4 py-3 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-primary ${active === link.href ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background/80 text-foreground/75 hover:border-primary hover:text-primary"}`}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function PlanShell({ title, description, active, children }: { title: string; description: string; active: string; children: ReactNode }) {
  return (
    <>
      <SiteNav />
      <main data-plan-shell className="rr-block mx-auto w-full max-w-6xl px-4 py-12 sm:px-7 sm:py-20">
        <header className="border border-panel-edge bg-background/90 p-6 sm:p-10">
          <p className="font-mono text-xs text-primary">Studio working plan · {PLAN_DATE}</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">{title}</h1>
          <p className={`mt-5 max-w-3xl ${PLAN_TEXT}`}>{description}</p>
          <p className="mt-5 max-w-3xl text-xs leading-6 text-muted-foreground">Proposal for Benito&apos;s solo studio. Unlinked and noindex; accessible by URL. No private client information or connected account metrics.</p>
          <div className="mt-7"><PlanNav active={active} /></div>
        </header>
        <div className="mt-8 space-y-8">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}

export function PlanSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section>
      <TerminalPanel number={number} label="WORKING PLAN">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {children}
      </TerminalPanel>
    </section>
  );
}
