import { SlideArt } from "@/components/social/slide-art";
import { PLAN_LINK, PLAN_TEXT } from "@/components/social/plan-shell";
import { storyPost } from "@/lib/social-art";
import { LANGUAGES, postId, STORIES, type Profile } from "@/lib/social-plan";

// TASK-social-profiles-and-rebalance.md §2.2: the profile a visitor reads before any
// post. Character counts are shown against each platform's own limit.

function Count({ text, limit }: { text: string; limit: number }) {
  return <span className={`font-mono text-[11px] ${[...text].length > limit ? "text-destructive" : "text-muted-foreground"}`}>{[...text].length} / {limit}</span>;
}

export function ProfileSetup({ profile }: { profile: Profile }) {
  const language = LANGUAGES[profile.lang];
  const instagram = profile.channel === "instagram";
  const pins = profile.pins.map((id) => STORIES.find((story) => story.id === id)).filter((story) => story !== undefined);
  return (
    <div data-profile-setup={profile.id} className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <article lang={language.htmlLang} className="border border-border bg-background/80 p-5 sm:p-6">
        <p className="font-mono text-xs text-primary">{profile.label}</p>
        <p className="mt-4 font-mono text-sm text-foreground">{profile.handle}</p>
        {profile.handleNote && <p className="mt-1 text-xs leading-6 text-muted-foreground">{profile.handleNote}</p>}
        <div className="mt-5 border-t border-border pt-4">
          <div className="flex items-baseline justify-between gap-3"><h3 className="text-xs font-medium text-muted-foreground uppercase">{instagram ? "Name" : "Headline"}</h3><Count text={profile.name} limit={profile.nameLimit} /></div>
          <p className="mt-2 text-lg leading-snug font-medium text-foreground">{profile.name}</p>
        </div>
        <div className="mt-5 border-t border-border pt-4">
          <div className="flex items-baseline justify-between gap-3"><h3 className="text-xs font-medium text-muted-foreground uppercase">{instagram ? "Bio" : "About"}</h3><Count text={profile.bio} limit={profile.bioLimit} /></div>
          <p className="mt-2 text-sm leading-7 whitespace-pre-line text-foreground/85">{profile.bio}</p>
        </div>
        <div className="mt-5 border-t border-border pt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase">Link</h3>
          <a href={profile.link.href} className={`mt-2 inline-block text-sm ${PLAN_LINK}`}>{profile.link.title}</a>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">{profile.link.detail}</p>
        </div>
        {profile.category && <p className="mt-4 text-xs leading-6 text-muted-foreground">Category: {profile.category}</p>}
      </article>

      <div className="min-w-0 space-y-8">
        {pins.length > 0 && <section>
          <h3 className="text-xl font-medium">Pin these three</h3>
          <ol className="mt-4 grid grid-cols-3 gap-2 sm:max-w-md">{pins.map((story) => <li key={story.id}><a href={`#${postId(story, profile.channel)}`} className="block focus-visible:outline-2 focus-visible:outline-primary" aria-label={`Pinned post: ${story.title}`}><SlideArt slide={storyPost(story, profile.channel).slides[0]} format="portrait" total={2} /></a></li>)}</ol>
        </section>}
        {profile.highlights.length > 0 && <section>
          <h3 className="text-xl font-medium">Highlights</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">{profile.highlights.map((item) => <li key={item.title} className="border border-border bg-background/70 p-4"><p className="text-sm font-medium text-foreground">{item.title}</p><p className={`mt-1 ${PLAN_TEXT}`}>{item.detail}</p></li>)}</ul>
        </section>}
        {profile.featured.length > 0 && <section>
          <h3 className="text-xl font-medium">Featured</h3>
          <ul className="mt-4 space-y-3">{profile.featured.map((item) => <li key={item.title} className="border-t border-border pt-3"><a href={item.href} className={PLAN_LINK}>{item.title} →</a><p className={`mt-1 ${PLAN_TEXT}`}>{item.detail}</p></li>)}</ul>
        </section>}
        {profile.company && <section>
          <h3 className="text-xl font-medium">Company page</h3>
          <div className="mt-4 border-t border-border pt-3">
            <div className="flex items-baseline justify-between gap-3"><p className="text-xs font-medium text-muted-foreground uppercase">Tagline</p><Count text={profile.company.tagline} limit={profile.company.taglineLimit} /></div>
            <p className="mt-2 text-sm leading-7 text-foreground/85">{profile.company.tagline}</p>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">Website: {profile.company.website} · <a href={profile.company.url} className={PLAN_LINK}>{profile.company.url.replace("https://www.", "")}</a></p>
          </div>
        </section>}
        <ul className="space-y-2">{profile.notes.map((note) => <li key={note} className="border-l-2 border-primary pl-4 text-sm leading-7 text-muted-foreground">{note}</li>)}</ul>
      </div>
    </div>
  );
}
