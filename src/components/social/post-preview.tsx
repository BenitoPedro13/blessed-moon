"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlideArt } from "@/components/social/slide-art";
import { storyPost, type ArtPost } from "@/lib/social-art";
import { exportPost } from "@/lib/social-export";
import type { Channel, Story } from "@/lib/social-plan";
import { PLAN_LINK } from "@/components/social/plan-shell";

export function PostPreview({ story, channel }: { story: Story; channel: Channel }) {
  const post = storyPost(story, channel);
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  async function download(kind: "png" | "zip" | "pdf") {
    setBusy(true); setStatus("");
    try { await exportPost(post, kind, selected); setStatus("Download prepared."); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Download failed."); }
    finally { setBusy(false); }
  }
  return <div data-post-preview className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
    <div><SlideArt slide={post.slides[selected]} format={post.format} index={selected} total={post.slides.length} /><div className="mt-3 flex flex-wrap items-center justify-between gap-2"><Button className="rounded-none" variant="outline" aria-label="Previous preview slide" disabled={selected === 0} onClick={() => setSelected(selected - 1)}>←</Button><p aria-live="polite" className="font-mono text-xs">{selected + 1} / {post.slides.length}</p><Button className="rounded-none" variant="outline" aria-label="Next preview slide" disabled={selected === post.slides.length - 1} onClick={() => setSelected(selected + 1)}>→</Button></div></div>
    <div><h4 className="font-mono text-xs text-primary">Graphic draft</h4><p className="mt-3 text-sm leading-7 text-muted-foreground">{story.format === "Screen recording" ? "This is a cover concept. The recording outline below still needs real footage." : "Review every slide, then replace or develop the words and assets in the builder."} Selected drafts include existing portfolio captures. Review image permission and current facts before publishing.</p><div className="mt-5 flex flex-wrap gap-3"><Button className="rounded-none" disabled={busy} onClick={() => download("png")}>Download slide PNG</Button><Button className="rounded-none" variant="outline" disabled={busy} onClick={() => download("zip")}>Download post ZIP</Button>{channel === "linkedin" && <Button className="rounded-none" variant="outline" disabled={busy} onClick={() => download("pdf")}>Download PDF</Button>}</div><p role="status" className="mt-3 text-xs text-muted-foreground">{busy ? "Preparing download…" : status}</p><Link href={`/post-builder?story=${story.id}&channel=${channel}`} prefetch={false} className={`mt-5 inline-block ${PLAN_LINK}`}>Edit this post →</Link></div>
  </div>;
}

export function ProfilePreview({ stories, channel }: { stories: readonly Story[]; channel: Channel }) {
  return <figure data-profile-preview><div className="grid gap-6 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)]"><ol className="grid grid-cols-3 gap-1 border border-border bg-background p-1" aria-label="Proposed nine-post grid">{stories.slice(0, 9).reverse().map((story) => {
    const post: ArtPost = storyPost(story, channel);
    const id = `${channel === "instagram" ? "ig" : "li"}-w${String(story.week).padStart(2, "0")}-${story.id}`;
    return <li key={story.id}><a className="block focus-visible:outline-2 focus-visible:outline-primary" href={`#${id}`} aria-label={`Open draft: ${story.title}`} onClick={() => { const details = document.getElementById(id); if (details instanceof HTMLDetailsElement) details.open = true; }}><SlideArt slide={post.slides[0]} format="portrait" total={post.slides.length} /></a></li>;
  })}</ol><figcaption className="text-sm leading-7 text-muted-foreground"><h3 className="text-xl font-medium text-foreground">See the collection together.</h3><p className="mt-3">Nine proposed covers, newest first. Select a cover to open the full draft. {channel === "instagram" ? "This is a grid study, not a screenshot of an existing account." : "LinkedIn has no matching profile grid: this is a board for reviewing the visual series. Landscape posts retain their original format inside the briefs."}</p><p className="mt-3">The series alternates midnight, warm paper and amber artwork, with comparisons, workflows and existing project captures. These are original drafts informed by the separate Instagram cover/caption audit; account performance still needs testing.</p></figcaption></div></figure>;
}
