import { PlanShell, PlanSection, PLAN_TEXT, planMetadata } from "@/components/social/plan-shell";
import { PostCard } from "@/components/social/post-card";
import { STORIES } from "@/lib/social-plan";
import { ProfilePreview } from "@/components/social/post-preview";

export const metadata = planMetadata("Instagram content plan", "/instagram-plan", "Eight weeks of practical Instagram briefs for Blessed Moon Studio, with Portuguese captions, visual outlines and campaign links.");

export default function InstagramPlanPage() {
  return <PlanShell title="Explain the useful detail." active="/instagram-plan" description="Portuguese buyer education and real project evidence for an initial Brazilian business pilot. Six-slide carousels and short screen recordings turn a decision into something a buyer can understand.">
    <PlanSection number="01" title="One story. One next step."><p className={PLAN_TEXT}>Start with one Portuguese adaptation each week while LinkedIn is primary. This library offers two alternatives per week; it is not a 16-post publishing commitment. If Brazilian business owners become the primary audience, make Instagram primary and revisit the rhythm. Reuse the work in optional Stories.</p><p className={`mt-4 ${PLAN_TEXT}`}>All 16 posts are drafts. The research now includes 356 collected Instagram covers and 59 captured captions across ten selected accounts, with selected inner-slide reviews. Each brief connects an observed pattern to original project evidence. Formats remain tests; no competitor engagement or conversion ranking is available. Use a clickable profile or Story link for the website destination. Account insights, permissions and Benito&apos;s solo capacity decide when each draft is ready.</p></PlanSection>
    <PlanSection number="02" title="Review the visual series."><ProfilePreview stories={STORIES} channel="instagram" /></PlanSection>
    <section aria-label="Instagram post briefs" className="space-y-4">{STORIES.map((story) => <PostCard key={story.id} story={story} channel="instagram" />)}</section>
    <PlanSection number="03" title="What to learn from the pilot."><p className={PLAN_TEXT}>Read saves, shares and relevant replies by topic. Compare similar formats, then look at tagged website visits and actual enquiry quality. A popular post does not establish sales; a smaller post can still introduce the right buyer.</p><p className={`mt-4 ${PLAN_TEXT}`}>Revise one variable at a time: question, format or destination. Use native account guidance to choose posting windows; this plan does not invent a universal best time.</p></PlanSection>
  </PlanShell>;
}
