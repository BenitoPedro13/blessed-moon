import Link from "next/link";
import { campaignUrl, LANGUAGES, postId, SOURCES, type Story, type Channel } from "@/lib/social-plan";
import { CONTENT_ACCOUNTS } from "@/lib/social-research";
import { instagramReferences, instagramPostUrl } from "@/lib/instagram-research";
import { storyPost } from "@/lib/social-art";
import { PostPreview } from "@/components/social/post-preview";
import { PLAN_LINK, PLAN_TEXT } from "@/components/social/plan-shell";

export function PostCard({ story, channel }: { story: Story; channel: Channel }) {
  const instagram = channel === "instagram";
  const id = postId(story, channel);
  const language = LANGUAGES[story.lang];
  const slides = storyPost(story, channel).slides;
  const source = SOURCES[story.source];
  const reference = CONTENT_ACCOUNTS.find((account) => (account.stories as readonly string[]).includes(story.id));
  const instagramResearch = instagramReferences(story.id);
  return (
    <details id={id} className="group border border-border bg-background/75" data-post-id={id}>
      <summary className="cursor-pointer px-5 py-5 marker:text-primary focus-visible:outline-2 focus-visible:outline-primary sm:px-7">
        <span className="ml-2 font-mono text-xs text-primary">W{String(story.week).padStart(2, "0")} · Draft · {language.label} · {instagram ? `${slides.length}-slide carousel` : `${slides.length}-page document`}</span>
        <h3 className="mt-2 inline-block w-full text-lg font-medium tracking-tight">{story.title}</h3>
        <span className="mt-2 block text-xs text-muted-foreground">{story.audience} · Open brief</span>
      </summary>
      <div className="space-y-6 border-t border-border px-5 py-6 sm:px-7">
        <PostPreview story={story} channel={channel} />
        <p className="break-all font-mono text-xs text-muted-foreground">{id} · {language.label} draft</p>
        <div><h4 className="mb-3 font-mono text-xs text-primary">Slide sequence</h4><ol lang={language.htmlLang} className="list-decimal space-y-3 pl-5">{slides.map((slide, index) => <li key={index} className={PLAN_TEXT}><strong className="text-foreground">{slide.title}{slide.accent ? ` ${slide.accent}` : ""}</strong>{slide.body && <p className="mt-1 whitespace-pre-line">{slide.body.replace(/\s*\|\s*/g, " · ")}</p>}{slide.action && <p className="mt-1 text-primary">{slide.action} →</p>}</li>)}</ol></div>
        <div><h4 className="mb-3 font-mono text-xs text-primary">{instagram ? "Caption draft" : "Post draft"}</h4><p lang={language.htmlLang} className={`whitespace-pre-line ${PLAN_TEXT}`}>{instagram ? story.caption : story.linkedin}</p></div>
        <div><h4 className="mb-3 font-mono text-xs text-primary">Visual brief</h4><p className={PLAN_TEXT}>{instagram ? story.visual : `${story.visual} Posted as a square PDF document with the text post above.`}</p></div>
        <div><h4 className="mb-3 font-mono text-xs text-primary">Before publishing</h4><p className={PLAN_TEXT}>Confirm screenshot permission and current facts. Check legibility, caption language and the destination. {instagram ? "Put the campaign link in the profile or a Story; a caption URL is not assumed clickable." : "Use the campaign link when sharing the website destination."}</p></div>
        <p className={PLAN_TEXT}>Evidence: {story.evidence} <a href={source.href} className={PLAN_LINK}>{source.label}</a></p>
        {instagramResearch.length > 0 && <div data-instagram-reference><h4 className="mb-3 font-mono text-xs text-primary">Instagram research → original application</h4><div className="space-y-4">{instagramResearch.map(account => <div key={account.handle}><p className={PLAN_TEXT}>{account.lesson}</p><a href={instagramPostUrl(account.samples[0].code)} className={`mt-2 inline-block ${PLAN_LINK}`}>{account.role}: {account.samples[0].label} →</a><p className="mt-1 text-xs leading-6 text-muted-foreground">{account.samples[0].depth}. Pattern reference; original project facts and wording stay separate.</p></div>)}</div></div>}
        {reference && <div data-content-reference><h4 className="mb-3 font-mono text-xs text-primary">Supporting LinkedIn research</h4><p className={PLAN_TEXT}>{reference.lesson} This draft uses Blessed Moon&apos;s own evidence and wording. This reference was sampled on LinkedIn; channel effectiveness still needs testing.</p><p className="mt-3 flex flex-wrap gap-x-5 gap-y-2">{reference.samples.map((sample) => <a key={sample.href} href={sample.href} className={PLAN_LINK}>{reference.name}: {sample.label} →</a>)}</p></div>}
        <div className="border-t border-border pt-5"><Link href={story.destination} className={PLAN_LINK}>Website destination →</Link><p className="mt-3 text-xs text-muted-foreground">External campaign link · select to copy</p><a href={campaignUrl(story, channel)} className={`mt-2 block break-all font-mono text-xs leading-6 ${PLAN_LINK}`}>{campaignUrl(story, channel)}</a></div>
      </div>
    </details>
  );
}
