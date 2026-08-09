"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Clipboard, LoaderCircle, TriangleAlert } from "lucide-react";

import { useSound } from "@/components/sound-provider";
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

const PROJECT_TYPES = ["Web App", "Mobile App", "Website", "Other"] as const;

const FIELD_CLASS =
  "h-11 rounded-none border-border/80 bg-background/55 px-3 font-sans text-[13px] backdrop-blur-sm placeholder:text-muted-foreground/55 focus-visible:ring-1";

type FormStatus = "idle" | "working" | "copied" | "failed";

export function ContactForm({ agencyEmail }: { agencyEmail: string | null }) {
  const [projectType, setProjectType] = useState<string>(PROJECT_TYPES[0]);
  const [status, setStatus] = useState<FormStatus>("idle");
  const { playHover, playClick } = useSound();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const company = String(form.get("company") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    const subject = `[${projectType}] Project enquiry from ${name}`;
    const body = [
      `Name: ${name}`,
      `Reply email: ${email}`,
      `Company: ${company || "Not provided"}`,
      `Project type: ${projectType}`,
      "",
      message,
    ].join("\n");

    setStatus("working");
    playClick();

    if (agencyEmail) {
      window.location.href = `mailto:${agencyEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.setTimeout(() => setStatus("idle"), 900);
      return;
    }

    try {
      await copyToClipboard(`${subject}\n\n${body}`);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 3200);
    } catch {
      setStatus("failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            placeholder="Your name"
            className={FIELD_CLASS}
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            className={FIELD_CLASS}
          />
        </Field>
      </div>

      <Field label="Company" htmlFor="company">
        <Input
          id="company"
          name="company"
          autoComplete="organization"
          placeholder="Company or project name"
          className={FIELD_CLASS}
        />
      </Field>

      <Field label="Project type" htmlFor="project-type">
        <Select
          value={projectType}
          onValueChange={(value) => value && setProjectType(value)}
        >
          <SelectTrigger
            id="project-type"
            className="h-11 w-full rounded-none border-border/80 bg-background/55 px-3 font-sans text-[13px] backdrop-blur-sm focus-visible:ring-1"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start" className="rounded-none border border-border bg-popover shadow-none">
            {PROJECT_TYPES.map((type) => (
              <SelectItem key={type} value={type} className="rounded-none font-sans text-[13px]">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Message" htmlFor="message">
        <Textarea
          id="message"
          name="message"
          required
          rows={7}
          placeholder="What are you building, who is it for, and what needs to be true when it ships?"
          className="min-h-40 resize-y rounded-none border-border/80 bg-background/55 px-3 py-3 font-sans text-[13px] leading-[1.6] backdrop-blur-sm placeholder:text-muted-foreground/55 focus-visible:ring-1"
        />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          size="lg"
          disabled={status === "working"}
          onMouseEnter={playHover}
          className="rounded-none bg-primary px-5 font-mono text-[10.5px] tracking-[0.08em] text-primary-foreground uppercase hover:bg-primary/85"
        >
          <SubmitLabel status={status} hasEmail={Boolean(agencyEmail)} />
        </Button>
        <p className="max-w-sm font-mono text-[9px] leading-[1.55] text-muted-foreground" aria-live="polite">
          {status === "copied"
            ? "Project brief copied. Keep it ready for the agency channel when it comes online."
            : status === "failed"
              ? "Clipboard access was blocked. Select the message and copy it manually."
              : agencyEmail
                ? "Opens your email client with the project details prefilled. Nothing is stored on this site."
                : "The agency inbox is not provisioned yet. Your brief is copied locally and never sent to a personal address."}
        </p>
      </div>
    </form>
  );
}

function SubmitLabel({ status, hasEmail }: { status: FormStatus; hasEmail: boolean }) {
  if (status === "working") {
    return (
      <>
        Preparing brief
        <LoaderCircle className="animate-spin" aria-hidden="true" />
      </>
    );
  }

  if (status === "copied") {
    return (
      <>
        Brief copied
        <Check aria-hidden="true" />
      </>
    );
  }

  if (status === "failed") {
    return (
      <>
        Copy blocked
        <TriangleAlert aria-hidden="true" />
      </>
    );
  }

  return hasEmail ? (
    <>
      Send enquiry
      <ArrowUpRight aria-hidden="true" />
    </>
  ) : (
    <>
      Copy project brief
      <Clipboard aria-hidden="true" />
    </>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block font-mono text-[9.5px] tracking-[0.1em] text-muted-foreground uppercase"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) throw new Error("Clipboard unavailable");
}
