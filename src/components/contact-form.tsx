"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";

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

import { PROJECT_TYPES, isProjectType, type ProjectType } from "@/lib/project-types";
import { trackEnquiry } from "@/lib/analytics";
import { ENQUIRY_LIMITS } from "@/lib/enquiry";

/** Panel tokens, and no `backdrop-blur`: these sit inside a `TerminalPanel`
 * that already blurs what's behind it, so a per-field backdrop pass would be a
 * second full-surface filter buying nothing. */
const FIELD_CLASS =
  "h-11 rounded-none border-border/80 bg-panel px-3 font-sans text-[13px] placeholder:text-muted-foreground/55 focus-visible:ring-1";

type FormStatus = "idle" | "working" | "sent" | "failed";

export function ContactForm({ deliveryReady, agencyEmail, initialProjectType = PROJECT_TYPES[0] }: { deliveryReady: boolean; agencyEmail: string | null; initialProjectType?: ProjectType }) {
  const [projectType, setProjectType] = useState<ProjectType>(initialProjectType);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);
  const started = useRef(false);
  const sending = useRef(false);
  const { playHover, playClick } = useSound();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!deliveryReady || sending.current || status === "sent") return;
    sending.current = true;
    const form = new FormData(event.currentTarget);
    setStatus("working");
    setError("");
    playClick();
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          company: String(form.get("company") ?? ""),
          message: String(form.get("message") ?? ""),
          website: String(form.get("website") ?? ""),
          projectType,
        }),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        const waitMinutes = Math.max(1, Math.ceil(Number(response.headers.get("Retry-After") || 600) / 60));
        setError(response.status === 429
          ? `Too many attempts. Please wait about ${waitMinutes} ${waitMinutes === 1 ? "minute" : "minutes"}, then try again.`
          : response.status === 400 || response.status === 413
            ? "Please check your name, email and message, then try again."
            : "We couldn't send your enquiry. Your message is still here. Try again or email the studio directly.");
        setStatus("failed");
        return;
      }
      setConfirmationSent(result.confirmationSent === true);
      setStatus("sent");
      trackEnquiry({ name: "project-enquiry-submit", data: { project_type: projectType } });
    } catch {
      setError("We couldn't confirm sending. Your message is still here. Please check your connection or email the studio directly.");
      setStatus("failed");
    } finally {
      sending.current = false;
    }
  }

  if (status === "sent") {
    return <div className="rr-block space-y-4" role="status" aria-live="polite">
      <Check className="size-6 text-primary" aria-hidden="true" />
      <h2 className="font-sans text-2xl font-semibold">Thanks for reaching out.</h2>
      <p className="text-sm leading-7 text-muted-foreground">Your enquiry has been sent to Blessed Moon Studio. I&apos;ll review your project and follow up with you personally.</p>
      {confirmationSent && <p className="text-sm leading-7 text-muted-foreground">A confirmation email is on its way. Check your spam folder if you don&apos;t see it.</p>}
      {agencyEmail && <a href={`mailto:${agencyEmail}`} className="inline-block text-sm text-primary underline underline-offset-4">Have something to add? Email the studio.</a>}
    </div>;
  }

  return (
    <form onSubmit={handleSubmit} className="rr-block space-y-5" onChange={() => {
      if (deliveryReady && !started.current) {
        started.current = true;
        trackEnquiry({ name: "project-enquiry-start", data: { project_type: projectType } });
      }
    }}>
      <fieldset disabled={!deliveryReady || status === "working"} className="space-y-5">
        <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
          <label htmlFor="website">Leave this field empty</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" htmlFor="name">
            <Input
              id="name"
              name="name"
              autoComplete="name"
              required
              maxLength={ENQUIRY_LIMITS.name}
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
              maxLength={ENQUIRY_LIMITS.email}
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
            maxLength={ENQUIRY_LIMITS.company}
            placeholder="Company or project name"
            className={FIELD_CLASS}
          />
        </Field>

        <Field label="Project type" htmlFor="project-type">
          <Select
            value={projectType}
            onValueChange={(value) => isProjectType(value) && setProjectType(value)}
          >
            <SelectTrigger
              id="project-type"
              className="h-11 w-full rounded-none border-border/80 bg-panel px-3 font-sans text-[13px] focus-visible:ring-1"
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
            maxLength={ENQUIRY_LIMITS.message}
            rows={7}
            placeholder="What are you building, who is it for, and what needs to be true when it ships?"
            className="min-h-40 resize-y rounded-none border-border/80 bg-panel px-3 py-3 font-sans text-[13px] leading-[1.6] placeholder:text-muted-foreground/55 focus-visible:ring-1"
          />
        </Field>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="submit"
            size="lg"
            disabled={!deliveryReady || status === "working"}
            onMouseEnter={playHover}
            className="rounded-none bg-primary px-5 font-mono text-[10.5px] tracking-[0.08em] text-primary-foreground uppercase hover:bg-primary/85"
          >
            {status === "working" ? <>Sending enquiry<LoaderCircle className="animate-spin" aria-hidden="true" /></> : <>Send enquiry<ArrowUpRight aria-hidden="true" /></>}
          </Button>
          <p className="max-w-sm font-mono text-[9px] leading-[1.55] text-muted-foreground" aria-live="polite">
            {deliveryReady ? "Your details go directly to the studio. We'll email a confirmation and follow up personally." : "The enquiry form is temporarily unavailable. Please email the studio directly."}
          </p>
        </div>
      </fieldset>
      {error && <p role="alert" className="text-sm leading-6 text-destructive">{error}</p>}
      {(!deliveryReady || status === "failed") && agencyEmail && <a href={`mailto:${agencyEmail}`} className="inline-block text-sm text-primary underline underline-offset-4">Email {agencyEmail}</a>}
    </form>
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
