"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlideArt } from "@/components/social/slide-art";
import { ART_FORMATS, ART_MARKS, ART_TEMPLATES, ART_SURFACES, MAX_ART_SLIDES, MAX_MARKS, PROJECT_ART_IMAGES, blankPost, emptySlide, readArtPost, slideAlt, storyPost, type ArtMark, type ArtPost, type ArtSlide, type ArtFormat, type ArtSurface, type ArtTemplate } from "@/lib/social-art";
import { asciiFromScreenshot, exportPost, localScreenshot } from "@/lib/social-export";
import { campaignUrl, type Channel, type Story } from "@/lib/social-plan";

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return <div className="min-w-0 space-y-2"><label htmlFor={id} className="block text-sm text-foreground/85">{label}</label>{children}</div>;
}
function Choice({ label, id, value, items, onChange }: { label: string; id: string; value: string; items: [string, string][]; onChange: (value: string) => void }) {
  return <Field label={label} id={id}><Select value={value} onValueChange={(next) => { if (next) onChange(next); }}><SelectTrigger id={id} className="w-full min-w-0 rounded-none"><SelectValue className="min-w-0 truncate">{items.find(([key]) => key === value)?.[1] || value}</SelectValue></SelectTrigger><SelectContent>{items.map(([key, title]) => <SelectItem key={key} value={key}>{title}</SelectItem>)}</SelectContent></Select></Field>;
}

const SCREENSHOT_TEMPLATES: readonly ArtTemplate[] = ["window", "ascii", "annotate"];

/** Marker positions as typed text. Keeps a half-typed line instead of dropping it;
 * remounted per slide through its `key`, so switching slides resets it. */
function MarksField({ marks, onChange }: { marks: [number, number][]; onChange: (marks: [number, number][]) => void }) {
  const [draft, setDraft] = useState(marks.map(([x, y]) => `${x}, ${y}`).join("\n"));
  return <Field label={`Marker positions · one "x, y" per line, percent of the window (up to ${MAX_MARKS})`} id="slide-marks"><Textarea id="slide-marks" className="rounded-none font-mono" value={draft} onChange={(event) => {
    setDraft(event.target.value);
    onChange(event.target.value.split("\n").map((row) => row.match(/^\s*(\d{1,3}(?:\.\d+)?)\s*,\s*(\d{1,3}(?:\.\d+)?)\s*$/)).filter((match): match is RegExpMatchArray => Boolean(match)).map((match): [number, number] => [Math.min(100, Number(match[1])), Math.min(100, Number(match[2]))]).slice(0, MAX_MARKS));
  }} /></Field>;
}

export function PostBuilder({ stories, initialPost }: { stories: readonly Story[]; initialPost: ArtPost }) {
  const [post, setPost] = useState(initialPost);
  const [preset, setPreset] = useState(initialPost.id);
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const slide = post.slides[selected];
  const sourceStory = stories.find((story) => story.id === post.id);
  const ready = post.slides.every((item) => item.title.trim() && (!item.image || item.imageAlt.trim()));
  function updateSlide(patch: Partial<ArtSlide>) { setPost((current) => ({ ...current, slides: current.slides.map((item, i) => i === selected ? { ...item, ...patch } : item) })); setStatus(""); }
  function loadPreset() { const story = stories.find((item) => item.id === preset); setPost(story ? storyPost(story, post.channel) : { ...blankPost(), channel: post.channel, format: post.channel === "linkedin" ? "landscape" : "portrait" }); setSelected(0); setStatus("Starting point loaded."); }
  function move(direction: number) { const next = selected + direction; const slides = [...post.slides]; [slides[selected], slides[next]] = [slides[next], slides[selected]]; setPost({ ...post, slides }); setSelected(next); }
  async function download(kind: "png" | "zip" | "pdf" | "json") {
    setBusy(true); setStatus("");
    try { await exportPost(readArtPost(post), kind, selected); setStatus("Download prepared."); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Download failed."); }
    finally { setBusy(false); }
  }
  async function importDraft(file?: File) {
    if (!file) return;
    setBusy(true);
    try { if (file.size > 12_000_000) throw new Error("Choose a JSON draft up to 12 MB."); const draft = readArtPost(JSON.parse(await file.text())); setPost(draft); setPreset(draft.id); setSelected(0); setStatus("Editable draft restored."); }
    catch (error) { setStatus(error instanceof Error ? error.message : "The draft could not be opened."); }
    finally { setBusy(false); }
  }
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true);
    try { const image = await localScreenshot(file); if (post.slides.reduce((sum, item, i) => sum + (i === selected ? image.length : item.image.length), 0) > 10_000_000) throw new Error("Use fewer or smaller screenshots to keep the draft within 10 MB."); updateSlide({ image, ascii: await asciiFromScreenshot(image), template: SCREENSHOT_TEMPLATES.includes(slide.template) ? slide.template : "window" }); setStatus("Screenshot added. Describe the image before exporting."); }
    catch (error) { setStatus(error instanceof Error ? error.message : "The image could not be opened."); }
    finally { setBusy(false); }
  }
  return <div data-post-builder className="rr-block space-y-8">
    <fieldset disabled={busy} className="grid gap-4 border border-border bg-background/75 p-5 md:grid-cols-2"><Choice label="Starting point" id="post-preset" value={stories.some((item) => item.id === preset) ? preset : "blank"} items={[["blank", "Start from scratch"], ...stories.map((story): [string, string] => [story.id, `${story.lang.toUpperCase()} · W${story.week} · ${story.title}`])]} onChange={setPreset} /><Choice label="Channel" id="post-channel" value={post.channel} items={[["instagram", "Instagram · portrait carousel"], ["linkedin", "LinkedIn · square PDF document"]]} onChange={(channel) => setPost({ ...post, channel: channel as Channel })} /><div className="md:col-span-2"><Button className="rounded-none" onClick={loadPreset}>Load starting point</Button><p className="mt-3 text-xs leading-6 text-muted-foreground">Loading replaces this working draft. Save its JSON first if you want to return to your edits. Channel changes preserve your words; load a starting point to use its channel&apos;s format and caption. Portuguese starting points have no LinkedIn caption.</p></div></fieldset>

    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <fieldset disabled={busy} className="min-w-0 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2"><Choice label="Post format" id="post-format" value={post.format} items={Object.entries(ART_FORMATS).map(([key, item]) => [key, item.label])} onChange={(format) => setPost({ ...post, format: format as ArtFormat })} /><Choice label="Slide template" id="slide-template" value={slide.template} items={Object.entries(ART_TEMPLATES)} onChange={(template) => updateSlide({ template: template as ArtTemplate })} /></div>
        <div className="grid gap-5 sm:grid-cols-2"><Choice label="Slide surface" id="slide-surface" value={slide.surface || "dark"} items={Object.entries(ART_SURFACES)} onChange={(surface) => updateSlide({ surface: surface as ArtSurface })} /><Choice label="Portfolio screenshot" id="slide-project-image" value={Object.hasOwn(PROJECT_ART_IMAGES, slide.image) ? slide.image : "none"} items={[["none", "No portfolio preset"], ...Object.entries(PROJECT_ART_IMAGES)]} onChange={(image) => { if (image === "none") { updateSlide({ image: "", imageAlt: "", ascii: "" }); return; } updateSlide({ image, ascii: "", imageAlt: "Project screenshot: " + PROJECT_ART_IMAGES[image], template: SCREENSHOT_TEMPLATES.includes(slide.template) ? slide.template : "window" }); }} /></div>
        {(slide.template === "cover" || slide.template === "action") && <Choice label="Art" id="slide-art" value={slide.art || "none"} items={Object.entries(ART_MARKS)} onChange={(art) => updateSlide({ art: art as ArtMark })} />}
        {SCREENSHOT_TEMPLATES.includes(slide.template) && <Field label="Window label" id="slide-label"><Input id="slide-label" className="rounded-none font-mono" maxLength={48} placeholder="~/work/project" value={slide.label || ""} onChange={(event) => updateSlide({ label: event.target.value })} /></Field>}
        {slide.template === "point" && <Field label="Step numeral · only for a real sequence" id="slide-step"><Input id="slide-step" className="rounded-none" maxLength={4} placeholder="01" value={slide.step || ""} onChange={(event) => updateSlide({ step: event.target.value })} /></Field>}
        {slide.template === "annotate" && <MarksField key={`${post.id}-${selected}`} marks={slide.marks ?? []} onChange={(marks) => updateSlide({ marks })} />}
        <Field label="Closing action" id="slide-action"><Input id="slide-action" className="rounded-none" maxLength={90} value={slide.action || ""} onChange={(event) => updateSlide({ action: event.target.value })} /></Field>
        <Field label="Eyebrow" id="slide-kicker"><Input id="slide-kicker" className="rounded-none" maxLength={64} value={slide.kicker} onChange={(event) => updateSlide({ kicker: event.target.value })} /></Field>
        <Field label="Slide title" id="slide-title"><Textarea id="slide-title" className="rounded-none" maxLength={180} value={slide.title} onChange={(event) => updateSlide({ title: event.target.value })} /></Field>
        <Field label="Accent line · set in amber after the title" id="slide-accent"><Input id="slide-accent" className="rounded-none" maxLength={120} value={slide.accent || ""} onChange={(event) => updateSlide({ accent: event.target.value })} /></Field>
        <Field label="Slide body · rows and comparisons: one per line, as label | detail | value" id="slide-body"><Textarea id="slide-body" className="min-h-28 rounded-none" maxLength={500} value={slide.body} onChange={(event) => updateSlide({ body: event.target.value })} /></Field>
        <Field label="Footer / destination" id="slide-footer"><Input id="slide-footer" className="rounded-none" maxLength={90} value={slide.footer} onChange={(event) => updateSlide({ footer: event.target.value })} /></Field>
        <Field label="Approved screenshot · PNG, JPEG or WebP, up to 8 MB" id="slide-image"><Input id="slide-image" className="h-auto rounded-none py-2" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void upload(file); }} /></Field>
        {slide.image && <><Field label="Screenshot description / alt text" id="slide-image-alt"><Textarea id="slide-image-alt" className="rounded-none" maxLength={240} value={slide.imageAlt} onChange={(event) => updateSlide({ imageAlt: event.target.value })} /></Field><Button className="rounded-none" variant="outline" onClick={() => updateSlide({ image: "", imageAlt: "", ascii: "" })}>Remove screenshot</Button></>}
        <div className="flex flex-wrap gap-3"><Button className="rounded-none" variant="outline" disabled={post.slides.length >= MAX_ART_SLIDES} onClick={() => { setPost({ ...post, slides: [...post.slides, emptySlide()] }); setSelected(post.slides.length); }}>Add slide</Button><Button className="rounded-none" variant="outline" disabled={post.slides.length >= MAX_ART_SLIDES} onClick={() => { const slides = [...post.slides]; slides.splice(selected + 1, 0, { ...slide }); setPost({ ...post, slides }); setSelected(selected + 1); }}>Duplicate slide</Button><Button className="rounded-none" variant="outline" disabled={post.slides.length === 1} onClick={() => { setPost({ ...post, slides: post.slides.filter((_, i) => i !== selected) }); setSelected(Math.min(selected, post.slides.length - 2)); }}>Remove slide</Button><Button className="rounded-none" variant="outline" disabled={selected === 0} onClick={() => move(-1)}>Move earlier</Button><Button className="rounded-none" variant="outline" disabled={selected === post.slides.length - 1} onClick={() => move(1)}>Move later</Button></div>
      </fieldset>

      <section aria-label="Live slide preview" className="min-w-0 lg:sticky lg:top-24"><p className="mb-3 font-mono text-xs text-primary">Slide {selected + 1} / {post.slides.length} · {ART_FORMATS[post.format].width} × {ART_FORMATS[post.format].height}</p><SlideArt slide={slide} format={post.format} index={selected} total={post.slides.length} /><div className="mt-4 flex gap-2 overflow-x-auto pb-2" aria-label="Select slide">{post.slides.map((item, i) => <Button key={i} aria-label={`Select slide ${i + 1}`} aria-pressed={i === selected} disabled={busy} className="h-auto w-20 shrink-0 flex-col gap-1 rounded-none p-1" variant={i === selected ? "default" : "outline"} onClick={() => setSelected(i)}><SlideArt slide={item} format={post.format} index={i} total={post.slides.length} /><span className="text-xs">{i + 1}</span></Button>)}</div><p className="mt-3 text-xs leading-6 text-muted-foreground">Alt text: {slideAlt(slide, selected, post.slides.length)}</p></section>
    </div>

    <section className="space-y-4 border-t border-border pt-7"><Field label="Post caption" id="post-caption"><Textarea id="post-caption" className="min-h-36 rounded-none" maxLength={5000} value={post.caption} disabled={busy} onChange={(event) => setPost({ ...post, caption: event.target.value })} /></Field><Button className="rounded-none" variant="outline" disabled={busy || !post.caption} onClick={async () => { try { await navigator.clipboard.writeText(post.caption); setStatus("Caption copied."); } catch { setStatus("Copy is unavailable. Select the caption and copy it manually."); } }}>Copy caption</Button>{sourceStory && <p className="break-all font-mono text-xs leading-6 text-muted-foreground">Campaign destination: <a className="text-primary underline" href={campaignUrl(sourceStory, post.channel)}>{campaignUrl(sourceStory, post.channel)}</a></p>}</section>

    <section className="border border-border bg-background/75 p-5"><h2 className="text-xl font-medium">Save the files. Review before publishing.</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">PNG uses the preview&apos;s artwork at full size. ZIP includes numbered PNGs, caption, alt text and editable JSON. PDF uses one image per page. Check screenshot permission, facts, legibility and crop before publishing. Story format reserves space for platform controls and a link sticker.</p><div className="mt-5 flex flex-wrap gap-3">{([['png', 'Download selected PNG'], ['zip', 'Download post ZIP'], ['pdf', 'Download PDF'], ['json', 'Save editable JSON']] as const).map(([kind, label]) => <Button key={kind} className="rounded-none" variant={kind === "png" ? "default" : "outline"} disabled={busy || (kind !== "json" && !ready)} onClick={() => download(kind)}>{label}</Button>)}</div>{!ready && <p className="mt-3 text-xs text-primary">Give each slide a title and describe any screenshot to enable image exports.</p>}<div className="mt-5"><Field label="Restore editable JSON" id="post-import"><Input id="post-import" className="h-auto rounded-none py-2" type="file" accept="application/json,.json" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void importDraft(file); }} /></Field></div><p role="status" className="mt-4 text-sm text-primary">{busy ? "Preparing…" : status}</p><p className="mt-3 text-xs leading-6 text-muted-foreground">Edits and screenshots stay in this tab and your downloaded files. Save JSON before leaving or reloading. This tool creates assets; posting is a separate action.</p></section>
  </div>;
}
