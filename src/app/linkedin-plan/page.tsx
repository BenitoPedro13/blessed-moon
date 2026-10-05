import { PlanShell, PlanSection, PLAN_TEXT, planMetadata } from "@/components/social/plan-shell";
import { PostCard } from "@/components/social/post-card";
import { STORIES } from "@/lib/social-plan";
import { ProfilePreview } from "@/components/social/post-preview";

export const metadata = planMetadata("LinkedIn content plan", "/linkedin-plan", "Eight weeks of original project decision stories for founders and product leaders, with LinkedIn drafts and campaign links.");

export default function LinkedInPlanPage() {
  return <PlanShell title="Show the thinking behind the build." active="/linkedin-plan" description="Decision stories for founders and product leaders: the problem, the constraint, the choice and its limits. Written for Benito's direct role in the work, with English drafts for an international audience test.">
    <PlanSection number="01" title="Let the evidence carry the claim."><p className={PLAN_TEXT}>Publish the two weekly core stories with business context while LinkedIn is primary. Use an annotated screenshot or short document where it explains the decision. Keep the actual scope of a delivered project visible; a prototype remains a prototype.</p><p className={`mt-4 ${PLAN_TEXT}`}>Recommendation: use Benito&apos;s own profile for the solo founder voice, with the studio page as supporting proof. Confirm the official accounts before publishing. No account URL, follower count or historical performance is assumed. Every draft links to actual sampled content as well as its own evidence.</p></PlanSection>
    <PlanSection number="02" title="Review the visual series."><ProfilePreview stories={STORIES} channel="linkedin" /></PlanSection>
    <section aria-label="LinkedIn post drafts" className="space-y-4">{STORIES.map((story) => <PostCard key={story.id} story={story} channel="linkedin" />)}</section>
    <PlanSection number="03" title="Review relevance, then distribution."><p className={PLAN_TEXT}>Look at conversations with people who have a relevant business problem. Use native impressions and reached-member metrics for context; tagged website visits and confirmed enquiries describe different steps. Keep those signals separate when deciding which story to repeat.</p></PlanSection>
  </PlanShell>;
}
