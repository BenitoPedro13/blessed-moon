import { PlanShell, PlanSection, PLAN_TEXT, planMetadata } from "@/components/social/plan-shell";
import { PostCard } from "@/components/social/post-card";
import { profileFor, storiesIn } from "@/lib/social-plan";
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
    <PlanSection number="06" title="What to learn from the pilot."><p className={PLAN_TEXT}>Read saves, shares and relevant replies by topic. Compare similar formats, then look at tagged website visits and actual enquiry quality, separately for each language. A popular post doesn&apos;t establish sales; a smaller post can still introduce the right buyer.</p><p className={`mt-4 ${PLAN_TEXT}`}>Revise one variable at a time: question, format or destination. Use native account guidance to choose posting windows; this plan doesn&apos;t invent a universal best time.</p></PlanSection>
  </PlanShell>;
}
