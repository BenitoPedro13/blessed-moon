import { PlanShell, PlanSection, PLAN_LINK, PLAN_TEXT, planMetadata } from "@/components/social/plan-shell";
import { PostCard } from "@/components/social/post-card";
import { postId, profileFor, storiesIn, STORIES, STORY_FRAMES, STORY_SCHEDULE } from "@/lib/social-plan";
import { framePost } from "@/lib/social-art";
import { SlideArt } from "@/components/social/slide-art";
import { ProfileSetup } from "@/components/social/profile-setup";
import { ProfilePreview } from "@/components/social/post-preview";

export const metadata = planMetadata("Instagram content plan", "/instagram-plan", "Instagram carousels for Blessed Moon Studio: an English account for international founders first, and an optional Portuguese account for Brazilian businesses.");

export default function InstagramPlanPage() {
  const english = storiesIn("en"), portuguese = storiesIn("pt");
  return <PlanShell title="Lead with the work." active="/instagram-plan" description="Every cover leads with real project evidence or a concrete buyer question, and every post ends with one action. English comes first, for international founders and product leaders; a Portuguese account for Brazilian businesses is the optional second.">
    <PlanSection number="01" title="Two accounts, one series."><p className={PLAN_TEXT}>English is the primary account, @blessedmoon.studio: two carousels a week for seven weeks, written for founders and product leaders who buy in strong currencies. The same carousels become LinkedIn documents. Portuguese is a separate, optional account for Brazilian business owners: one carousel a week for eight weeks, built on the Oishi and F&amp;A Móveis cases. Benito decides whether to open it.</p><p className={`mt-4 ${PLAN_TEXT}`}>Every slide states only what a case study records; the limits of that evidence sit in each brief, not on the art. Formats remain tests, since no competitor engagement or conversion ranking is available. Switch the account to a professional one before publishing, so the plan can be measured with native insights. Put the campaign link in the profile or a Story, because a caption URL isn&apos;t clickable.</p></PlanSection>
    <PlanSection number="02" title="English account: set up the profile."><ProfileSetup profile={profileFor("instagram-en")} /></PlanSection>
    <PlanSection number="03" title="English account: review the grid."><ProfilePreview stories={english} channel="instagram" /></PlanSection>
    <section aria-label="English Instagram post briefs" className="space-y-4">{english.map((story) => <PostCard key={story.id} story={story} channel="instagram" />)}</section>
    <PlanSection number="04" title="Portuguese account: set up the profile."><ProfileSetup profile={profileFor("instagram-pt")} /></PlanSection>
    <PlanSection number="05" title="Portuguese account: review the grid."><ProfilePreview stories={portuguese} channel="instagram" /></PlanSection>
    <section aria-label="Portuguese Instagram post briefs" className="space-y-4">{portuguese.map((story) => <PostCard key={story.id} story={story} channel="instagram" />)}</section>
    <PlanSection number="06" title="Portuguese account: launch Stories."><p className={PLAN_TEXT}>Stories sit outside the grid and last 24 hours. They announce the launch and send friends to the posts.</p><ol aria-label="Launch Story sequence" className="mt-6 space-y-5">{STORY_SCHEDULE.map((step) => {
      const frame = STORY_FRAMES.find((item) => item.id === step.frame), shared = STORIES.find((item) => item.id === step.share);
      return <li key={step.when} data-story-step className="grid gap-5 border-t border-border pt-5 sm:grid-cols-[10rem_1fr]">
        <div><h3 className="font-mono text-xs text-primary">{step.when.toUpperCase()}</h3>{frame && <div data-story-frame={frame.id} className="mt-3 w-36"><SlideArt slide={framePost(frame).slides[0]} format="story" /></div>}</div>
        <div className="min-w-0">{(frame || shared) && <p className="font-medium">{frame?.title ?? shared?.title}</p>}<p className={`mt-1 ${PLAN_TEXT}`}>{step.what}</p>
          {frame && <p className={`mt-3 ${PLAN_TEXT}`}><a className={PLAN_LINK} href={`/post-builder?story=${frame.id}`}>Open in the builder</a> for the still. For the video, run <code className="break-all font-mono text-xs">pnpm social:story-video {frame.id}</code> against a running server.</p>}
          {shared && <p className={`mt-3 ${PLAN_TEXT}`}><a className={PLAN_LINK} href={`#${postId(shared, "instagram")}`}>Read its brief</a></p>}</div>
      </li>;
    })}</ol></PlanSection>
    <PlanSection number="07" title="What to learn from the pilot."><p className={PLAN_TEXT}>Read saves, shares and relevant replies by topic. Compare similar formats, then look at tagged website visits and actual enquiry quality, separately for each language. A popular post doesn&apos;t establish sales; a smaller post can still introduce the right buyer.</p><p className={`mt-4 ${PLAN_TEXT}`}>Revise one variable at a time: question, format or destination. Use native account guidance to choose posting windows; this plan doesn&apos;t invent a universal best time.</p></PlanSection>
  </PlanShell>;
}
